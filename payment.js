/**
 * BİL BAKALIM - TAM ÖDEME ENTEGRASYON MODÜLÜ
 * iyzico, PayTR ve Güvenli Test/Sandbox Altyapısı
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const CONFIG_PATH = path.join(__dirname, 'payment_config.json');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('Payment config yüklenemedi:', e.message);
  }
  return {
    activeProvider: 'SANDBOX',
    providers: {
      SANDBOX: { enabled: true, autoApprove: true },
      IYZICO: { enabled: false },
      PAYTR: { enabled: false }
    }
  };
}

function saveConfig(cfg) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Payment config kaydedilemedi:', e.message);
    return false;
  }
}

/**
 * Kart Numarasını Luhn Algoritması ile Doğrular
 */
function isValidCardNumber(num) {
  const digits = (num || '').replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return (sum % 10) === 0;
}

/**
 * Fiyat Dizesini Sayısal Kuruşa / TL'ye Çevirir
 */
function parsePrice(priceStr) {
  if (!priceStr) return 59.99;
  const cleaned = priceStr.toString().replace(/TL/gi, '').replace(/\s+/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 59.99 : num;
}

/**
 * Kart ile Ödeme Başlatma ve Tahsilat
 */
async function processCardPayment(data, clientIp = '127.0.0.1') {
  const cfg = loadConfig();
  const provider = (cfg.activeProvider || 'SANDBOX').toUpperCase();
  const {
    roomCode,
    pkgType,
    pkgName,
    price,
    cardHolder,
    cardNumber,
    expireMonth,
    expireYear,
    cvv
  } = data;

  const cleanCardNumber = (cardNumber || '').replace(/\s+/g, '').replace(/-/g, '');
  const cleanHolder = (cardHolder || '').trim().toUpperCase();
  const cleanCvv = (cvv || '').trim();
  const expMonth = parseInt(expireMonth, 10);
  const expYear = parseInt(expireYear, 10);
  const priceNum = parsePrice(price);

  // 1. TEMEL KART BİLGİSİ DOĞRULAMA
  if (!cleanHolder || cleanHolder.length < 3) {
    return { success: false, message: 'Lütfen kart üzerindeki geçerli bir isim girin.' };
  }
  if (!cleanCardNumber || cleanCardNumber.length < 15 || cleanCardNumber.length > 19) {
    return { success: false, message: 'Kart numarası 16 haneli olmalıdır.' };
  }
  if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) {
    return { success: false, message: 'Geçersiz son kullanma ayı (01-12).' };
  }
  const currentYearShort = new Date().getFullYear() % 100;
  const fullYear = expYear < 100 ? (2000 + expYear) : expYear;
  if (isNaN(expYear) || (expYear < 100 ? expYear < currentYearShort : expYear < new Date().getFullYear())) {
    return { success: false, message: 'Kartın son kullanma tarihi geçmiş.' };
  }
  if (!cleanCvv || cleanCvv.length < 3 || cleanCvv.length > 4) {
    return { success: false, message: 'Güvenlik kodu (CVV) 3 haneli olmalıdır.' };
  }

  // 2. SANDBOX (TEST & GELİŞTİRİCİ MODU)
  if (provider === 'SANDBOX' || !cfg.providers[provider] || !cfg.providers[provider].enabled) {
    // Gerçekçi banka simülasyonu
    const txnId = `TXN-SBX-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const last4 = cleanCardNumber.slice(-4);

    return {
      success: true,
      provider: 'SANDBOX',
      transactionId: txnId,
      paidPrice: priceNum.toFixed(2) + ' TL',
      cardMasked: `•••• •••• •••• ${last4}`,
      cardHolder: cleanHolder,
      roomCode: roomCode || '',
      pkgType: pkgType || 'PRO',
      pkgName: pkgName || 'BİL BAKALIM PRO',
      date: new Date().toISOString(),
      message: 'Ödeme başarıyla onaylandı! TV ekranınız anında açıldı.'
    };
  }

  // 3. IYZICO ENTEGRASYONU
  if (provider === 'IYZICO') {
    const iyzicoCfg = cfg.providers.IYZICO;
    if (!iyzicoCfg.apiKey || !iyzicoCfg.secretKey || iyzicoCfg.apiKey.includes('BURAYA')) {
      return { success: false, message: 'İyzico API anahtarları henüz girilmemiş. Lütfen payment_config.json dosyasını kontrol edin.' };
    }

    try {
      // iyzico REST API çağrısı
      const conversationId = `CONV-${Date.now()}-${roomCode}`;
      const requestData = {
        locale: 'tr',
        conversationId: conversationId,
        price: priceNum.toFixed(2),
        paidPrice: priceNum.toFixed(2),
        currency: 'TRY',
        installment: '1',
        basketId: `BASKET-${roomCode}`,
        paymentChannel: 'WEB',
        paymentGroup: 'PRODUCT',
        paymentCard: {
          cardHolderName: cleanHolder,
          cardNumber: cleanCardNumber,
          expireMonth: expMonth < 10 ? `0${expMonth}` : `${expMonth}`,
          expireYear: fullYear.toString(),
          cvc: cleanCvv,
          registerCard: '0'
        },
        buyer: {
          id: `BUYER-${roomCode}`,
          name: cleanHolder.split(' ')[0] || 'Kullanıcı',
          surname: cleanHolder.split(' ').slice(1).join(' ') || 'Soyisim',
          gsmNumber: '+905555555555',
          email: 'musteri@bilbakalim.tv',
          identityNumber: '11111111110',
          registrationAddress: 'Turkiye',
          ip: clientIp,
          city: 'Istanbul',
          country: 'Turkey'
        },
        shippingAddress: {
          contactName: cleanHolder,
          city: 'Istanbul',
          country: 'Turkey',
          address: 'Dijital Hizmet'
        },
        billingAddress: {
          contactName: cleanHolder,
          city: 'Istanbul',
          country: 'Turkey',
          address: 'Dijital Hizmet'
        },
        basketItems: [
          {
            id: `ITEM-${pkgType}`,
            name: pkgName || 'BİL BAKALIM PRO',
            category1: 'Oyun',
            itemType: 'VIRTUAL',
            price: priceNum.toFixed(2)
          }
        ]
      };

      // iyzico HMAC-SHA1 Kimlik Doğrulama Başlığı
      const pkiString = `[locale=${requestData.locale},conversationId=${requestData.conversationId},price=${requestData.price},paidPrice=${requestData.paidPrice}]`;
      const hash = crypto.createHmac('sha1', iyzicoCfg.secretKey).update(pkiString).digest('base64');
      const authHeader = `IYZWS ${iyzicoCfg.apiKey}:${hash}`;

      // API İsteği gönder
      const result = await makeHttpsRequest(
        iyzicoCfg.baseUrl || 'https://api.iyzipay.com',
        '/payment/auth',
        'POST',
        {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'x-iyzi-rnd': conversationId
        },
        requestData
      );

      if (result && result.status === 'success') {
        return {
          success: true,
          provider: 'IYZICO',
          transactionId: result.paymentId,
          paidPrice: priceNum.toFixed(2) + ' TL',
          roomCode,
          pkgType,
          pkgName,
          message: 'İyzico ile ödeme başarıyla onaylandı!'
        };
      } else {
        return {
          success: false,
          message: (result && result.errorMessage) ? result.errorMessage : 'İyzico ödemesi reddedildi.'
        };
      }
    } catch (err) {
      return { success: false, message: 'İyzico sunucu bağlantı hatası: ' + err.message };
    }
  }

  // 4. PAYTR ENTEGRASYONU (3D & Token Doğrulama)
  if (provider === 'PAYTR') {
    const paytrCfg = cfg.providers.PAYTR;
    if (!paytrCfg.merchantId || !paytrCfg.merchantKey || paytrCfg.merchantSalt || paytrCfg.merchantId.includes('BURAYA')) {
      return { success: false, message: 'PayTR mağaza bilgileri henüz girilmemiş.' };
    }

    try {
      const merchant_oid = `ORDER-${roomCode}-${Date.now()}`;
      const email = 'oyuncu@bilbakalim.tv';
      const payment_amount = Math.round(priceNum * 100); // Kuruş cinsinden (5999)
      const user_basket = JSON.stringify([[pkgName || 'BİL BAKALIM PRO', priceNum.toFixed(2), 1]]);
      const no_installment = '1';
      const max_installment = '0';
      const currency = 'TL';
      const test_mode = paytrCfg.testMode ? '1' : '0';

      const hashStr = `${paytrCfg.merchantId}${clientIp}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
      const paytr_token = crypto.createHmac('sha256', paytrCfg.merchantKey).update(hashStr + paytrCfg.merchantSalt).digest('base64');

      return {
        success: true,
        provider: 'PAYTR',
        merchant_oid,
        token: paytr_token,
        roomCode,
        pkgType,
        pkgName,
        message: 'PayTR işlemi hazırlandı.'
      };
    } catch (err) {
      return { success: false, message: 'PayTR hatası: ' + err.message };
    }
  }

  return { success: false, message: 'Bilinmeyen ödeme sağlayıcısı.' };
}

/**
 * Node.js HTTPS Yardımcısı
 */
function makeHttpsRequest(hostUrl, endpoint, method, headers, postData) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(hostUrl + endpoint);
      const dataStr = JSON.stringify(postData);
      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        headers: {
          ...headers,
          'Content-Length': Buffer.byteLength(dataStr)
        },
        timeout: 10000
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => { body += d; });
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve({ rawBody: body, status: res.statusCode });
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.on('timeout', () => { req.destroy(); reject(new Error('İstek zaman aşımına uğradı')); });
      req.write(dataStr);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * PayTR Webhook Bildirim Doğrulama (Hash Check)
 */
function verifyPayTRWebhook(postBody) {
  const cfg = loadConfig();
  const paytr = cfg.providers.PAYTR || {};
  const { merchant_oid, status, total_amount, hash } = postBody || {};
  if (!hash || !paytr.merchantKey || !paytr.merchantSalt) return false;

  const expectedHash = crypto.createHmac('sha256', paytr.merchantKey)
    .update(`${merchant_oid}${paytr.merchantSalt}${status}${total_amount}`)
    .digest('base64');

  return (hash === expectedHash);
}

module.exports = {
  loadConfig,
  saveConfig,
  processCardPayment,
  verifyPayTRWebhook
};
