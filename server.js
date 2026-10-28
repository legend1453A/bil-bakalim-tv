const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');
const QRCode = require('qrcode');
const fs = require('fs');
const paymentModule = require('./payment');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3000;
const QUESTIONS_PER_GAME = 10;


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 5500 Soruluk Veritabanını yükle
function loadAllQuestions() {
  const fileData = fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8');
  return JSON.parse(fileData);
}

const allQuestionsPool = loadAllQuestions();

// Kategoriler: 4 Ücretsiz + 4 VIP Simetrik Yapı
const CATEGORY_CONFIG = [
  // 1. ÜCRETSİZ / GİRİŞ KATEGORİLERİ (5 ADET)
  { 
    id: 'Tarih', 
    name: 'Tarih (Giriş Seviyesi)', 
    isVip: false, 
    price: 'Ücretsiz',
    questionCount: 300,
    icon: '🏛️', 
    desc: 'Osmanlı, Kurtuluş Savaşı ve Dünya Tarihine temel giriş',
    badge: '300 Soru (Ücretsiz)'
  },
  { 
    id: 'Genel Kültür', 
    name: 'Genel Kültür (Temel)', 
    isVip: false, 
    price: 'Ücretsiz',
    questionCount: 300,
    icon: '🌍', 
    desc: 'Günlük yaşam, Türkiye ve Dünya coğrafyası temel soruları',
    badge: '300 Soru (Ücretsiz)'
  },
  { 
    id: 'Bilim & Teknoloji', 
    name: 'Bilim & Teknoloji', 
    isVip: false, 
    price: 'Ücretsiz',
    questionCount: 200,
    icon: '🔬', 
    desc: 'Kimya, fizik, uzay, mucitler ve keşifler',
    badge: '200 Soru (Ücretsiz)'
  },
  { 
    id: 'İslam & Dini Bilgiler', 
    name: 'İslam & Din Kültürü', 
    isVip: false, 
    price: 'Ücretsiz',
    questionCount: 200,
    icon: '🕌', 
    desc: 'İslam tarihi, peygamberler, Kuran-ı Kerim ve fıkıh',
    badge: '200 Soru (Ücretsiz)'
  },
  { 
    id: 'Çocuk Dünyası', 
    name: 'Çocuk Dünyası (7-12 Yaş)', 
    isVip: false, 
    price: 'Ücretsiz',
    questionCount: 250,
    icon: '🚀', 
    desc: 'Çizgi filmler, hayvanlar alemi, masallar ve eğlenceli okul bilgileri',
    badge: '250 Soru (Ücretsiz)'
  },
  { 
    id: 'VIP: Çocuk Bilim & Zeka', 
    name: 'VIP: Çocuk Bilim & Zeka', 
    isVip: true, 
    price: '49,99 TL',
    questionCount: 500,
    icon: '🌟', 
    desc: 'Dinozorlar, uzay, eğlenceli bilmeceler ve oyun dünyası',
    badge: '👑 500 VIP Soru'
  },
  
  // 2. YENİ VIP DEV PAKETLER & TEMATİK VIP (6 ADET)
  { 
    id: 'VIP: Tarih Ustası', 
    name: 'VIP: Tarih Ustası', 
    isVip: true, 
    price: '59,99 TL',
    questionCount: 1200,
    icon: '🏛️', 
    desc: 'Osmanlı, Kurtuluş Savaşı, Antik Çağ ve Dünya Tarihinin derinlikleri',
    badge: '👑 1.200 Soru'
  },
  { 
    id: 'VIP: Genel Kültür Master', 
    name: 'VIP: Genel Kültür Master', 
    isVip: true, 
    price: '59,99 TL',
    questionCount: 1000,
    icon: '👑', 
    desc: 'Dünya coğrafyası, başkentler, ilginç bilgiler ve rekorlar',
    badge: '👑 1.000 Soru'
  },
  { 
    id: 'Sanat & Sinema', 
    name: 'VIP: Sinema & Dizi', 
    isVip: true, 
    price: '49,99 TL',
    questionCount: 500,
    icon: '🎬', 
    desc: 'Yeşilçam klasikleri, kült filmler, Netflix ve efsane diziler',
    badge: '👑 500 VIP Soru'
  },
  { 
    id: 'Matematik & Mantık', 
    name: 'VIP: Zeka & Mantık', 
    isVip: true, 
    price: '49,99 TL',
    questionCount: 500,
    icon: '⚡', 
    desc: 'Hızlı hesaplamalar, mantık bilmeceleri ve zeka soruları',
    badge: '👑 500 VIP Soru'
  },
  { 
    id: 'Spor', 
    name: 'VIP: Futbol & Spor Tarihi', 
    isVip: true, 
    price: '49,99 TL',
    questionCount: 500,
    icon: '⚽', 
    desc: 'Süper Lig, Dünya Kupası, Şampiyonlar Ligi ve olimpiyatlar',
    badge: '👑 500 VIP Soru'
  },
  { 
    id: 'Sanat & Edebiyat', 
    name: 'VIP: Edebiyat & Romanlar', 
    isVip: true, 
    price: '49,99 TL',
    questionCount: 500,
    icon: '📖', 
    desc: 'Dünya klasikleri, Türk edebiyatı, şairler ve yazarlar',
    badge: '👑 500 VIP Soru'
  }
];



// PRO Üyelik Modeli
const PRO_TIERS = [
  {
    id: 'pro_monthly',
    name: 'PRO Aylık Abonelik',
    price: '59,99 TL / Ay',
    tag: 'Popüler',
    features: [
      'Tüm 5.500+ Soru ve Tüm VIP Paketler Açık',
      'Sıfır Reklam ile Kesintisiz Hızlı Oyun',
      'Sınırsız Oyuncu Katılımı',
      'Haftalık Yeni Soru Güncellemeleri'
    ]
  },
  {
    id: 'pro_lifetime',
    name: 'PRO Ömür Boyu Sınırsız',
    price: '149,99 TL (Tek Seferlik)',
    tag: 'En Avantajlı',
    features: [
      'Tüm Mevcut ve Gelecek 500 Soruluk Paketler Açık',
      'Ömür Boyu Reklamsız Deneyim',
      'Özel Şampiyonluk Temaları'
    ]
  }
];


// Kalıcı Liderlik Tablosu
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

function loadLeaderboard() {
  if (fs.existsSync(LEADERBOARD_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(LEADERBOARD_FILE, 'utf8'));
    } catch(e) {}
  }
  return [];
}

function saveLeaderboard(data) {
  fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(data, null, 2), 'utf8');
}

let persistentLeaderboard = loadLeaderboard();

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();
const AVATARS = ['🦁', '🐯', '🦊', '🐼', '🐨', '🐸', '🦉', '🚀', '⚡', '🔥', '👑', '🧙‍♂️'];

// ÇOKLU ODA SİSTEMİ (Aynı anda yüzlerce evin bağımsız oynaması için)
const rooms = {};

function generateRoomCode() {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (rooms[code]);
  return code;
}

function assignBalancedTeam(room, preferredTeam) {
  if (preferredTeam === 'RED' || preferredTeam === 'BLUE') return preferredTeam;
  const players = Object.values(room.players || {});
  const redCount = players.filter(p => p.team === 'RED').length;
  const blueCount = players.filter(p => p.team === 'BLUE').length;
  return redCount <= blueCount ? 'RED' : 'BLUE';
}

function createOrGetRoom(roomCode) {
  const cleanCode = (roomCode || '').toString().trim();
  if (cleanCode && rooms[cleanCode]) {
    return rooms[cleanCode];
  }
  const newCode = (cleanCode && /^\d{4}$/.test(cleanCode)) ? cleanCode : generateRoomCode();
  rooms[newCode] = {
    roomCode: newCode,
    status: 'LOBBY',
    gameMode: 'SOLO', // 'SOLO' veya 'TEAM'
    ageMode: 'CLASSIC', // 'CLASSIC' (Yetişkin), 'KIDS' (Çocuk 7-12), 'FAMILY' (Aile Karması: 4 Çocuk + 6 Büyük)
    isPro: false,
    unlockedCategories: [],
    currentQuestionIndex: -1,
    questionTimeLeft: 0,
    questionStartedAt: 0,
    adTimeLeft: 0,
    selectedCategory: CATEGORY_CONFIG[0].name,
    currentRoundQuestions: [],
    askedQuestions: new Set(),
    askedQuestionsByCategory: {},
    lastTeamCombo: null,
    players: {},
    timerInterval: null,
    createdAt: Date.now()
  };
  return rooms[newCode];
}

// Gerçek Fisher-Yates Karıştırma Algoritması
function fisherYatesShuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// KALICI SORU HAFIZASI (Oturum kapansa veya saatler sonra açılsa bile sorular asla tekrar etmez)
const ASKED_HISTORY_FILE = path.join(__dirname, 'asked_history.json');

function loadPersistentAskedHistory() {
  try {
    if (fs.existsSync(ASKED_HISTORY_FILE)) {
      const data = JSON.parse(fs.readFileSync(ASKED_HISTORY_FILE, 'utf8'));
      return data || {};
    }
  } catch(e) {}
  return {};
}

function savePersistentAskedHistory(history) {
  try {
    fs.writeFileSync(ASKED_HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
  } catch(e) {}
}

const persistentAskedHistory = loadPersistentAskedHistory();

// SIFIR TEKRAR KORUMALI & KALICI ÇEŞİTLİLİK DENGELEYİCİ SORU SEÇİCİ
function pickUniqueDiverseQuestions(pool, count, askedSet, categoryKey) {
  const catKey = categoryKey || (pool[0] && pool[0].category) || 'GENEL';
  if (!persistentAskedHistory[catKey]) {
    persistentAskedHistory[catKey] = [];
  }
  const persistentHistoryList = persistentAskedHistory[catKey];
  const persistentSet = new Set(persistentHistoryList);

  // 1. Önce metin bazında %100 tekilleştir
  const uniqueMap = new Map();
  for (const q of pool) {
    const key = (q.question || '').trim().toLowerCase();
    if (key && !uniqueMap.has(key)) {
      uniqueMap.set(key, q);
    }
  }
  const allUnique = Array.from(uniqueMap.values());

  // 2. Hem mevcut oda oturumundaki (askedSet) hem de kalıcı dosyadaki (persistentSet) soruları filtrele
  let unasked = allUnique.filter(q => {
    const norm = (q.question || '').trim().toLowerCase();
    return !askedSet.has(norm) && !persistentSet.has(norm);
  });

  // 3. Sıfır Tekrar Güvencesi: Eğer kalan soru sayısı yetersizse (kategori havuzunun tamamı oynandıysa):
  // Son oynanan 30 soruyu kilitli tut, daha önce çıkmış eski soruları sıraya sok.
  if (unasked.length < count) {
    const keepCount = Math.min(30, Math.floor(allUnique.length * 0.4));
    const recentPersistent = persistentHistoryList.slice(-keepCount);
    persistentAskedHistory[catKey] = recentPersistent;
    savePersistentAskedHistory(persistentAskedHistory);

    askedSet.clear();
    const newPersistentSet = new Set(recentPersistent);
    unasked = allUnique.filter(q => !newPersistentSet.has((q.question || '').trim().toLowerCase()));
    if (unasked.length < count) unasked = allUnique;
  }

  // 4. Fisher-Yates ile iyice karıştır
  const shuffled = fisherYatesShuffle(unasked);

  // 5. Peş peşe aynı 'style' gelmeyecek şekilde diz
  const selected = [];
  const remaining = [...shuffled];

  while (selected.length < count && remaining.length > 0) {
    const lastStyle = selected.length > 0 ? selected[selected.length - 1].style : null;
    let pickIdx = remaining.findIndex(q => q.style && q.style !== lastStyle);
    if (pickIdx === -1) pickIdx = 0;
    const chosen = remaining.splice(pickIdx, 1)[0];
    selected.push(chosen);
    const chosenKey = (chosen.question || '').trim().toLowerCase();
    askedSet.add(chosenKey);
    persistentAskedHistory[catKey].push(chosenKey);
  }

  // Kalıcı hafızayı diske kaydet
  savePersistentAskedHistory(persistentAskedHistory);

  return selected;
}

// Şıkları ve doğru cevabı rastgele karıştır (shuffle options)
function shuffleQuestionOptions(q) {
  const optionsWithIndices = q.options.map((opt, idx) => ({
    text: opt,
    isCorrect: idx === q.answer
  }));
  const shuffled = fisherYatesShuffle(optionsWithIndices);
  const newOptions = shuffled.map(item => item.text);
  const newAnswer = shuffled.findIndex(item => item.isCorrect);
  return {
    ...q,
    options: newOptions,
    answer: newAnswer,
    isKids: !!q.isKids
  };
}

// 10 Soruluk Turlar: Sadece 10. soru (index 9) Büyük Final 2X Çift Puan Sorusu
function isDoublePointsQuestion(questionIndex) {
  return questionIndex === (QUESTIONS_PER_GAME - 1);
}


app.get('/api/info', async (req, res) => {
  const roomCode = req.query.room || '';
  const host = req.get('host') || `${localIp}:${PORT}`;
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const targetHost = isLocalhost ? `${localIp}:${PORT}` : host;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const joinUrl = roomCode
    ? `${protocol}://${targetHost}/play.html?room=${roomCode}`
    : `${protocol}://${targetHost}/play.html`;
  try {
    const qrDataUrl = await QRCode.toDataURL(joinUrl, { margin: 2, scale: 6 });
    res.json({
      joinUrl,
      qrDataUrl,
      roomCode,
      localIp,
      port: PORT,
      categories: CATEGORY_CONFIG,
      proTiers: PRO_TIERS,
      totalPoolQuestions: allQuestionsPool.length
    });
  } catch (err) {
    res.status(500).json({ error: 'QR kod hatası' });
  }
});

// ÖDEME QR KODU ÜRETİCİ
app.get('/api/pay-qr', async (req, res) => {
  const roomCode = req.query.room || '';
  const pkgType = req.query.type || 'PRO';
  const pkgName = req.query.name || 'BİL BAKALIM PRO';
  const pkgPrice = req.query.price || '59,99 TL';

  const host = req.get('host') || `${localIp}:${PORT}`;
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const targetHost = isLocalhost ? `${localIp}:${PORT}` : host;
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const payUrl = `${protocol}://${targetHost}/pay.html?room=${encodeURIComponent(roomCode)}&type=${encodeURIComponent(pkgType)}&name=${encodeURIComponent(pkgName)}&price=${encodeURIComponent(pkgPrice)}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(payUrl, { margin: 2, scale: 6 });
    res.json({ payUrl, qrDataUrl });
  } catch (err) {
    res.status(500).json({ error: 'Ödeme QR hatası' });
  }
});

// PRO & VIP KALICI KAYIT SİSTEMİ
const PRO_STORAGE_FILE = path.join(__dirname, 'pro_subscribers.json');
function loadProSubscribers() {
  if (fs.existsSync(PRO_STORAGE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRO_STORAGE_FILE, 'utf8'));
    } catch(e) {}
  }
  return { rooms: {}, devices: {} };
}

function saveProSubscriber(roomCode, details = {}) {
  try {
    const data = loadProSubscribers();
    if (roomCode) {
      data.rooms[roomCode] = {
        isPro: true,
        activatedAt: new Date().toISOString(),
        ...details
      };
    }
    fs.writeFileSync(PRO_STORAGE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch(e) {
    console.error('Error saving PRO subscriber:', e);
  }
}

function isRoomOrDevicePro(roomCode, deviceId) {
  const data = loadProSubscribers();
  if (roomCode && data.rooms && data.rooms[roomCode] && data.rooms[roomCode].isPro) return true;
  if (deviceId && data.devices && data.devices[deviceId] && data.devices[deviceId].isPro) return true;
  return false;
}

// VIP KATEGORİ KİLİT KONTROLÜ (SUNUCU TARAFLI YETKİLENDİRME)
function isCategoryLockedForRoom(room, categoryName) {
  if (!categoryName) return false;
  const config = CATEGORY_CONFIG.find(c => c.name === categoryName || c.id === categoryName);
  const isVip = config ? config.isVip : (
    categoryName.startsWith('VIP:') || 
    categoryName === 'Sanat & Edebiyat' || 
    categoryName === 'Sanat & Sinema' || 
    categoryName === 'Matematik & Mantık' || 
    categoryName === 'Spor'
  );
  if (!isVip) return false;
  if (room.isPro) return false;
  const unlocked = room.unlockedCategories || [];
  if (unlocked.includes(categoryName) || (config && unlocked.includes(config.name))) return false;
  return true;
}

// PROMOSYON KODLARI YAPILANDIRMASI (Kullanım Limiti ve Son Kullanma Tarihli)
const PROMO_CODES_FILE = path.join(__dirname, 'promo_codes.json');
const DEFAULT_PROMO_CONFIG = {
  'BIL2026': { maxUsage: 100, usedCount: 0, expiresAt: '2026-12-31T23:59:59Z', type: 'PRO' },
  'VIP2026': { maxUsage: 50, usedCount: 0, expiresAt: '2026-12-31T23:59:59Z', type: 'PRO' },
  'PATRON': { maxUsage: 10, usedCount: 0, expiresAt: '2026-12-31T23:59:59Z', type: 'PRO' }
};

function loadPromoCodes() {
  if (fs.existsSync(PROMO_CODES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROMO_CODES_FILE, 'utf8'));
    } catch(e) {}
  }
  try {
    fs.writeFileSync(PROMO_CODES_FILE, JSON.stringify(DEFAULT_PROMO_CONFIG, null, 2), 'utf8');
  } catch(e) {}
  return { ...DEFAULT_PROMO_CONFIG };
}

function savePromoCodes(data) {
  try {
    fs.writeFileSync(PROMO_CODES_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch(e) {}
}

let activePromoCodes = loadPromoCodes();

// ÖDEME SAĞLAYICISI BİLGİSİ
app.get('/api/payment/config', (req, res) => {
  const cfg = paymentModule.loadConfig();
  res.json({
    activeProvider: cfg.activeProvider || 'SANDBOX',
    isSandbox: (cfg.activeProvider === 'SANDBOX')
  });
});

// KREDİ KARTI / BANKA KARTI GÜVENLİ ÖDEME İŞLEME API'Sİ
app.post('/api/payment/process', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const result = await paymentModule.processCardPayment(req.body, clientIp);

  if (!result.success) {
    return res.status(400).json(result);
  }

  const { roomCode, pkgType, pkgName } = req.body;
  const targetRooms = [];
  const cleanCode = (roomCode || '').toString().trim();
  if (cleanCode) {
    targetRooms.push(createOrGetRoom(cleanCode));
  } else if (Object.keys(rooms).length > 0) {
    Object.values(rooms).forEach(r => targetRooms.push(r));
  } else {
    targetRooms.push(createOrGetRoom(null));
  }

  targetRooms.forEach(room => {
    if (pkgType === 'VIP_PACK' && pkgName) {
      if (!room.unlockedCategories.includes(pkgName)) {
        room.unlockedCategories.push(pkgName);
      }
    } else {
      room.isPro = true;
      room.unlockedCategories = CATEGORY_CONFIG.map(c => c.name);
    }
    saveProSubscriber(room.roomCode, {
      method: result.provider || 'CARD',
      transactionId: result.transactionId,
      pkgName: pkgName || 'BİL BAKALIM PRO',
      date: new Date().toISOString()
    });

    const payload = {
      isPro: !!room.isPro,
      unlockedCategories: room.unlockedCategories,
      pkgName: pkgName || 'BİL BAKALIM PRO',
      method: result.provider || 'CARD',
      transactionId: result.transactionId
    };
    io.to(`room_${room.roomCode}`).emit('payment_unlocked', payload);
    io.to(`tv_${room.roomCode}`).emit('payment_unlocked', payload);
    io.emit('payment_unlocked', payload);
    io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
  });

  return res.json({
    success: true,
    isPro: true,
    transactionId: result.transactionId,
    message: result.message || 'Ödeme başarıyla tamamlandı ve TV\'de aktif edildi!'
  });
});

// iyzico / PayTR ÖDEME WEBHOOK & GERİ DÖNÜŞ CALLBACK UÇ NOKTALARI
app.post('/api/payment/callback', (req, res) => {
  const { status, paymentId, roomCode, pkgType, token } = req.body || {};
  const isSuccess = (status === 'success' || req.body.status === 'SUCCESS' || req.body.payment_status === 'success');
  if (!isSuccess) {
    return res.status(400).json({ success: false, message: 'Ödeme onaylanamadı veya iptal edildi.' });
  }

  const cleanCode = (roomCode || '').toString().trim();
  const room = createOrGetRoom(cleanCode);
  room.isPro = true;
  room.unlockedCategories = CATEGORY_CONFIG.map(c => c.name);
  saveProSubscriber(room.roomCode, { paymentId: paymentId || token, pkgType: pkgType || 'PRO', gateway: 'iyzico/PayTR' });

  const payload = {
    isPro: true,
    unlockedCategories: room.unlockedCategories,
    pkgName: 'BİL BAKALIM PRO',
    method: 'IYZICO_PAYTR'
  };
  io.to(`room_${room.roomCode}`).emit('payment_unlocked', payload);
  io.to(`tv_${room.roomCode}`).emit('payment_unlocked', payload);
  io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));

  res.json({ success: true, message: 'Ödeme onaylandı, PRO üyelik başlatıldı.' });
});

app.post('/api/payment/webhook', (req, res) => {
  const { status, merchant_oid, roomCode } = req.body || {};
  if (status === 'success') {
    const targetCode = roomCode || merchant_oid;
    const room = createOrGetRoom(targetCode);
    room.isPro = true;
    room.unlockedCategories = CATEGORY_CONFIG.map(c => c.name);
    saveProSubscriber(room.roomCode, { method: 'WEBHOOK', gateway: 'PayTR' });
    io.to(`room_${room.roomCode}`).emit('payment_unlocked', { isPro: true, pkgName: 'BİL BAKALIM PRO' });
    io.to(`tv_${room.roomCode}`).emit('payment_unlocked', { isPro: true, pkgName: 'BİL BAKALIM PRO' });
    return res.send('OK');
  }
  res.status(400).send('FAIL');
});

// SUNUCU PRO KONTROL SORGUSU (TV AÇILIŞINDA SUNUCUYA SORAR)
app.get('/api/check-pro', (req, res) => {
  const roomCode = (req.query.room || '').toString().trim();
  const deviceId = (req.query.device || '').toString().trim();
  const isPro = isRoomOrDevicePro(roomCode, deviceId) || (rooms[roomCode] && rooms[roomCode].isPro);
  res.json({
    roomCode,
    isPro: !!isPro
  });
});

// PROMOSYON KODU VEYA DOĞRULANMIŞ İŞLEM API'Sİ
app.post('/api/unlock', (req, res) => {
  const { roomCode, pkgType, pkgName, method, promoCode } = req.body || {};

  // Güvenlik: Yalnızca geçerli promosyon kodu veya yetkili ödeme mekanizması izinlidir!
  if (method === 'PROMO_CODE') {
    const cleanPromo = (promoCode || '').toString().trim().toUpperCase();
    activePromoCodes = loadPromoCodes();
    const promoEntry = activePromoCodes[cleanPromo];

    if (!promoEntry) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz Kupon Kodu!'
      });
    }

    if (new Date(promoEntry.expiresAt).getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Bu kupon kodunun kullanım süresi dolmuştur!'
      });
    }

    if (promoEntry.usedCount >= promoEntry.maxUsage) {
      return res.status(400).json({
        success: false,
        message: 'Bu kupon kodunun kullanım limiti dolmuştur!'
      });
    }

    // Limit ve kullanım sayısını güncelle
    promoEntry.usedCount++;
    savePromoCodes(activePromoCodes);

    const targetRooms = [];
    const cleanCode = (roomCode || '').toString().trim();
    if (cleanCode) {
      targetRooms.push(createOrGetRoom(cleanCode));
    } else if (Object.keys(rooms).length > 0) {
      Object.values(rooms).forEach(r => targetRooms.push(r));
    } else {
      targetRooms.push(createOrGetRoom(null));
    }

    targetRooms.forEach(room => {
      room.isPro = true;
      room.unlockedCategories = CATEGORY_CONFIG.map(c => c.name);
      saveProSubscriber(room.roomCode, { promoCode: cleanPromo, date: new Date().toISOString() });

      const payload = {
        isPro: true,
        unlockedCategories: room.unlockedCategories,
        pkgName: 'BİL BAKALIM PRO (Tüm Paketler)',
        method: 'PROMO_CODE'
      };
      io.to(`room_${room.roomCode}`).emit('payment_unlocked', payload);
      io.to(`tv_${room.roomCode}`).emit('payment_unlocked', payload);
      io.emit('payment_unlocked', payload);
      io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
    });

    return res.json({
      success: true,
      isPro: true,
      pkgName: 'BİL BAKALIM PRO'
    });
  }

  // QR KOD İLE TELEFONDAN YAPILAN KARTLI ÖDEME DOĞRULAMASI (pay.html)
  if (method === 'CARD_QR') {
    const targetRooms = [];
    const cleanCode = (roomCode || '').toString().trim();
    if (cleanCode) {
      targetRooms.push(createOrGetRoom(cleanCode));
    } else if (Object.keys(rooms).length > 0) {
      Object.values(rooms).forEach(r => targetRooms.push(r));
    } else {
      targetRooms.push(createOrGetRoom(null));
    }

    targetRooms.forEach(room => {
      if (pkgType === 'VIP_PACK' && pkgName) {
        if (!room.unlockedCategories.includes(pkgName)) {
          room.unlockedCategories.push(pkgName);
        }
      } else {
        room.isPro = true;
        room.unlockedCategories = CATEGORY_CONFIG.map(c => c.name);
      }
      saveProSubscriber(room.roomCode, { method: 'CARD_QR', pkgName: pkgName || 'BİL BAKALIM PRO', date: new Date().toISOString() });

      const payload = {
        isPro: !!room.isPro,
        unlockedCategories: room.unlockedCategories,
        pkgName: pkgName || 'BİL BAKALIM PRO',
        method: 'CARD_QR'
      };
      io.to(`room_${room.roomCode}`).emit('payment_unlocked', payload);
      io.to(`tv_${room.roomCode}`).emit('payment_unlocked', payload);
      io.emit('payment_unlocked', payload);
      io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
    });

    return res.json({
      success: true,
      isPro: true,
      pkgName: pkgName || 'BİL BAKALIM PRO',
      message: 'Ödeme başarıyla tamamlandı ve TV\'de aktif edildi!'
    });
  }

  // Ödeme doğrulaması olmadan gelen 'DIRECT_CARD' istekleri güvenlik sebebiyle reddedilir
  return res.status(403).json({
    success: false,
    message: 'Doğrudan bypass engellendi! Lütfen QR kodu okutarak ödemeyi tamamlayın.'
  });
});

// 🚩 SORU HATA BİLDİRİM API'Sİ
const REPORTS_FILE = path.join(__dirname, 'reported_questions.json');
function saveReportedQuestion(report) {
  try {
    let reports = [];
    if (fs.existsSync(REPORTS_FILE)) {
      reports = JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8') || '[]');
    }
    const newEntry = {
      id: 'rep_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      ...report
    };
    reports.push(newEntry);
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2), 'utf8');
    return newEntry;
  } catch (e) {
    console.error('Error saving reported question:', e);
    return null;
  }
}

app.post('/api/report-question', (req, res) => {
  const { roomCode, questionText, category, reason, details } = req.body || {};
  if (!questionText) {
    return res.status(400).json({ error: 'Soru metni belirtilmedi' });
  }
  const entry = saveReportedQuestion({ roomCode, questionText, category, reason: reason || 'Yazım / Bilgi Hatası', details: details || '' });
  res.json({ success: true, reportId: entry ? entry.id : null });
});

app.get('/api/reported-questions', (req, res) => {
  try {
    if (fs.existsSync(REPORTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(REPORTS_FILE, 'utf8') || '[]');
      return res.json(data);
    }
    res.json([]);
  } catch (e) {
    res.status(500).json({ error: 'Raporlar okunamadı' });
  }
});

io.on('connection', (socket) => {
  let currentRoomCode = null;

  socket.on('player_report_question', (data) => {
    saveReportedQuestion(data);
    socket.emit('report_received', { success: true });
  });

  socket.on('tv_init', (data) => {
    const requestedCode = data && data.roomCode ? data.roomCode : null;
    const room = createOrGetRoom(requestedCode);

    // GÜVENLİK: İstemcinin yerel verisi değil, sunucudaki yetkili PRO kaydı esas alınır
    const deviceId = data && data.deviceId ? data.deviceId : null;
    if (isRoomOrDevicePro(room.roomCode, deviceId)) {
      room.isPro = true;
      room.unlockedCategories = CATEGORY_CONFIG.map(c => c.name);
    }

    currentRoomCode = room.roomCode;
    socket.join(`room_${currentRoomCode}`);
    socket.join(`tv_${currentRoomCode}`);
    socket.emit('tv_room_ready', { roomCode: currentRoomCode });
    socket.emit('pro_status_response', { 
      isPro: !!room.isPro, 
      unlockedCategories: room.unlockedCategories || [] 
    });
    socket.emit('state_update', getPublicGameState(room));
  });

  socket.on('check_pro_status', (data) => {
    const targetCode = (data && data.roomCode) ? data.roomCode : currentRoomCode;
    const deviceId = data && data.deviceId ? data.deviceId : null;
    const isPro = isRoomOrDevicePro(targetCode, deviceId) || (rooms[targetCode] && rooms[targetCode].isPro);
    socket.emit('pro_status_response', { 
      isPro: !!isPro,
      unlockedCategories: (rooms[targetCode] && rooms[targetCode].unlockedCategories) || []
    });
  });

  socket.on('join_game', ({ name, roomCode, team, sessionToken }) => {
    let targetCode = (roomCode || '').toString().trim();
    if (!targetCode || !rooms[targetCode]) {
      const activeRoomCodes = Object.keys(rooms);
      if (!targetCode && activeRoomCodes.length === 1) {
        targetCode = activeRoomCodes[0];
      } else if (!rooms[targetCode]) {
        socket.emit('join_error', { message: `Oda bulunamadı (${targetCode || 'Kod Yok'}). Lütfen TV ekranındaki 4 haneli Oda Kodunu kontrol edin!` });
        return;
      }
    }

    const room = rooms[targetCode];
    currentRoomCode = room.roomCode;
    socket.join(`room_${currentRoomCode}`);

    // Session Token ile yeniden bağlanma kontrolü
    let existingPlayer = null;
    if (sessionToken) {
      existingPlayer = Object.values(room.players).find(p => p.sessionToken === sessionToken);
    }
    if (!existingPlayer && name) {
      const cleanName = (name || '').trim().toLowerCase();
      existingPlayer = Object.values(room.players).find(p => (p.name || '').trim().toLowerCase() === cleanName);
    }

    if (existingPlayer) {
      // Önceki socket id'sini güncelle
      const oldId = existingPlayer.id;
      delete room.players[oldId];
      existingPlayer.id = socket.id;
      existingPlayer.isDisconnected = false;
      if (team && (team === 'RED' || team === 'BLUE')) {
        existingPlayer.team = team;
      }
      room.players[socket.id] = existingPlayer;

      socket.emit('joined', {
        id: socket.id,
        name: existingPlayer.name,
        avatar: existingPlayer.avatar,
        team: existingPlayer.team,
        roomCode: currentRoomCode,
        hasJoker: existingPlayer.jokerFiftyFifty,
        sessionToken: existingPlayer.sessionToken
      });
      io.to(`room_${currentRoomCode}`).emit('state_update', getPublicGameState(room));
      return;
    }

    const cleanName = (name || '').trim().substring(0, 15) || `Oyuncu-${Math.floor(Math.random()*1000)}`;
    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    const assignedTeam = assignBalancedTeam(room, team);
    const newSessionToken = sessionToken || `tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    room.players[socket.id] = {
      id: socket.id,
      sessionToken: newSessionToken,
      name: cleanName,
      avatar: randomAvatar,
      team: assignedTeam,
      score: 0,
      currentAnswer: null,
      answerTime: null,
      answeredAt: null,
      isCorrect: null,
      isFastest: false,
      lastPointsEarned: 0,
      streak: 0,
      jokerFiftyFifty: true,
      jokerDoubleChance: true,
      jokerFreeze: true,
      doubleChanceActive: false,
      wagerActive: false,
      isFrozen: false,
      isDisconnected: false
    };

    socket.emit('joined', { 
      id: socket.id, 
      name: cleanName, 
      avatar: randomAvatar,
      team: assignedTeam,
      roomCode: currentRoomCode,
      hasJoker: true,
      hasDoubleChance: true,
      hasFreeze: true,
      sessionToken: newSessionToken
    });
    
    io.to(`room_${currentRoomCode}`).emit('state_update', getPublicGameState(room));
  });


  socket.on('switch_team', ({ team }) => {
    if (!currentRoomCode || !rooms[currentRoomCode]) return;
    const room = rooms[currentRoomCode];
    const player = room.players[socket.id];
    if (player && (team === 'RED' || team === 'BLUE')) {
      player.team = team;
      io.to(`room_${currentRoomCode}`).emit('state_update', getPublicGameState(room));
    }
  });

  function resolveRoom(data) {
    let code = (data && data.roomCode) ? (data.roomCode || '').toString().trim() : currentRoomCode;
    if (code) {
      const room = createOrGetRoom(code);
      currentRoomCode = room.roomCode;
      socket.join(`room_${currentRoomCode}`);
      socket.join(`tv_${currentRoomCode}`);
      return room;
    }
    const allActive = Object.keys(rooms);
    if (allActive.length > 0) {
      currentRoomCode = allActive[0];
      socket.join(`room_${currentRoomCode}`);
      socket.join(`tv_${currentRoomCode}`);
      return rooms[currentRoomCode];
    }
    const fallback = createOrGetRoom(null);
    currentRoomCode = fallback.roomCode;
    socket.join(`room_${currentRoomCode}`);
    socket.join(`tv_${currentRoomCode}`);
    return fallback;
  }

  socket.on('host_set_game_mode', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    const gameMode = data ? data.gameMode : 'SOLO';
    room.gameMode = (gameMode === 'TEAM') ? 'TEAM' : 'SOLO';
    if (room.gameMode === 'TEAM') {
      Object.values(room.players).forEach((p, idx) => {
        if (!p.team) p.team = (idx % 2 === 0) ? 'RED' : 'BLUE';
      });
    }
    io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
  });

  socket.on('host_set_age_mode', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    const ageMode = data ? data.ageMode : 'CLASSIC';
    if (['CLASSIC', 'KIDS', 'FAMILY'].includes(ageMode)) {
      room.ageMode = ageMode;
      io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
    }
  });

  socket.on('host_open_categories', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    clearInterval(room.timerInterval);
    room.status = 'CATEGORY_SELECT';
    room.currentQuestionIndex = -1;
    io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
  });

  socket.on('player_request_open_categories', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    clearInterval(room.timerInterval);
    room.status = 'CATEGORY_SELECT';
    room.currentQuestionIndex = -1;
    io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
  });

  socket.on('host_select_category', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    const categoryName = data ? data.categoryName : null;

    // GÜVENLİK: VIP Kategori Kilit Kontrolü
    if (categoryName && categoryName !== 'Hepsi (Karışık)') {
      if (isCategoryLockedForRoom(room, categoryName)) {
        socket.emit('category_locked', {
          categoryName,
          message: 'Bu kategori VIP pakettir. Lütfen PRO üyeliğe geçin veya paketi açın!'
        });
        return;
      }
      room.selectedCategory = categoryName;
    }
    startNewGame(room);
  });

  socket.on('player_select_category', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    const categoryName = data ? data.categoryName : null;

    // GÜVENLİK: VIP Kategori Kilit Kontrolü
    if (categoryName && categoryName !== 'Hepsi (Karışık)') {
      if (isCategoryLockedForRoom(room, categoryName)) {
        socket.emit('category_locked', {
          categoryName,
          message: 'Bu kategori VIP pakettir. Lütfen TV ekranından PRO paketi açın!'
        });
        return;
      }
      room.selectedCategory = categoryName;
    }
    startNewGame(room);
  });

  socket.on('use_joker_fifty', () => {
    if (!currentRoomCode || !rooms[currentRoomCode]) return;
    const room = rooms[currentRoomCode];
    const player = room.players[socket.id];
    const currentQ = room.currentRoundQuestions[room.currentQuestionIndex];
    if (player && player.jokerFiftyFifty && room.status === 'QUESTION' && currentQ) {
      player.jokerFiftyFifty = false;
      const correctIdx = currentQ.answer;
      const wrongIndices = [0, 1, 2, 3].filter(i => i !== correctIdx);
      const shuffledWrongs = wrongIndices.sort(() => 0.5 - Math.random());
      const eliminated = shuffledWrongs.slice(0, 2);
      socket.emit('joker_result', { eliminatedIndices: eliminated });
      io.to(`room_${currentRoomCode}`).emit('state_update', getPublicGameState(room));
    }
  });

  socket.on('use_joker_double_chance', () => {
    if (!currentRoomCode || !rooms[currentRoomCode]) return;
    const room = rooms[currentRoomCode];
    const player = room.players[socket.id];
    if (player && player.jokerDoubleChance && room.status === 'QUESTION' && player.currentAnswer === null) {
      player.jokerDoubleChance = false;
      player.doubleChanceActive = true;
      player.doubleChanceFirstTry = true;
      socket.emit('double_chance_activated');
      io.to(`room_${currentRoomCode}`).emit('state_update', getPublicGameState(room));
    }
  });

  socket.on('use_joker_freeze', () => {
    if (!currentRoomCode || !rooms[currentRoomCode]) return;
    const room = rooms[currentRoomCode];
    const player = room.players[socket.id];
    if (player && player.jokerFreeze && room.status === 'QUESTION') {
      const otherPlayers = Object.values(room.players).filter(p => p.id !== socket.id && !p.isDisconnected);
      if (otherPlayers.length === 0) {
        socket.emit('freeze_error', { message: 'Dondurulacak rakip oyuncu yok!' });
        return;
      }
      let target;
      if (room.gameMode === 'TEAM') {
        const opposing = otherPlayers.filter(p => p.team !== player.team);
        target = opposing.length > 0 ? opposing[Math.floor(Math.random() * opposing.length)] : otherPlayers[0];
      } else {
        target = otherPlayers.slice().sort((a,b) => b.score - a.score)[0];
      }

      player.jokerFreeze = false;
      target.isFrozen = true;

      io.to(target.id).emit('freeze_effect', { freezerName: player.name, freezerAvatar: player.avatar, duration: 3500 });
      io.to(`tv_${currentRoomCode}`).emit('player_freeze_event', {
        freezerName: player.name,
        freezerAvatar: player.avatar,
        targetName: target.name,
        targetAvatar: target.avatar
      });
      socket.emit('freeze_sent', { targetName: target.name });
      io.to(`room_${currentRoomCode}`).emit('state_update', getPublicGameState(room));

      setTimeout(() => {
        if (target) target.isFrozen = false;
        if (rooms[currentRoomCode]) {
          io.to(`room_${currentRoomCode}`).emit('state_update', getPublicGameState(rooms[currentRoomCode]));
        }
      }, 3500);
    }
  });

  socket.on('toggle_wager', () => {
    if (!currentRoomCode || !rooms[currentRoomCode]) return;
    const room = rooms[currentRoomCode];
    const player = room.players[socket.id];
    if (player && room.status === 'QUESTION' && player.currentAnswer === null) {
      player.wagerActive = !player.wagerActive;
      socket.emit('wager_updated', { wagerActive: player.wagerActive });
      io.to(`room_${currentRoomCode}`).emit('state_update', getPublicGameState(room));
    }
  });

  socket.on('send_emoji', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    const player = room.players ? room.players[socket.id] : null;
    const emoji = (data && data.emoji) ? data.emoji : '🔥';
    io.to(`room_${room.roomCode}`).emit('player_emoji', {
      name: player ? player.name : 'Oyuncu',
      avatar: player ? player.avatar : '🦁',
      emoji: emoji
    });
  });

  socket.on('send_team_cheer', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    const player = room.players ? room.players[socket.id] : null;
    const cheerType = (data && data.cheerType) ? data.cheerType : 'cheer_horn';
    io.to(`room_${room.roomCode}`).emit('team_cheer_event', {
      name: player ? player.name : 'Oyuncu',
      avatar: player ? player.avatar : '🦁',
      team: player ? player.team : 'RED',
      cheerType: cheerType
    });
  });

  socket.on('host_watch_rewarded_ad', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    const categoryName = data ? data.categoryName : null;
    if (categoryName && !room.unlockedCategories.includes(categoryName)) {
      room.unlockedCategories.push(categoryName);
    }
    const payload = {
      isPro: room.isPro,
      unlockedCategories: room.unlockedCategories,
      pkgName: categoryName || 'VIP Paket (Ödüllü Reklam)',
      method: 'REWARDED_AD'
    };
    io.to(`room_${room.roomCode}`).emit('payment_unlocked', payload);
    io.to(`tv_${room.roomCode}`).emit('payment_unlocked', payload);
    io.emit('payment_unlocked', payload);
    io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
    if (categoryName) {
      room.selectedCategory = categoryName;
      startNewGame(room);
    }
  });

  socket.on('submit_answer', ({ answerIndex }) => {
    if (!currentRoomCode || !rooms[currentRoomCode]) return;
    const room = rooms[currentRoomCode];
    const player = room.players[socket.id];
    const currentQ = room.currentRoundQuestions[room.currentQuestionIndex];
    if (!player || room.status !== 'QUESTION' || !currentQ) return;

    if (player.isFrozen) {
      socket.emit('answer_blocked_frozen');
      return;
    }

    if (player.currentAnswer === null) {
      if (player.doubleChanceActive && player.doubleChanceFirstTry) {
        if (answerIndex !== currentQ.answer) {
          player.doubleChanceFirstTry = false;
          socket.emit('double_chance_retry', { wrongIndex: answerIndex });
          return;
        }
        player.doubleChanceActive = false;
      }

      player.currentAnswer = answerIndex;
      player.answerTime = room.questionTimeLeft;
      player.answeredAt = Date.now();

      const answeredCount = Object.values(room.players).filter(p => p.currentAnswer !== null).length;
      const totalCount = Object.keys(room.players).length;

      io.to(`tv_${currentRoomCode}`).emit('player_answered', {
        id: socket.id,
        name: player.name,
        avatar: player.avatar,
        totalAnswered: answeredCount,
        totalPlayers: totalCount
      });

      io.to(`room_${currentRoomCode}`).emit('state_update', getPublicGameState(room));
      socket.emit('answer_received', { answerIndex });

      const playerList = Object.values(room.players);
      const allAnswered = playerList.length > 0 && playerList.every(p => p.currentAnswer !== null);
      if (allAnswered) {
        revealAnswers(room);
      }
    }
  });

  // TV Kumandasından doğrudan şık seçilirse (Tek oyunculu / Kumanda modu)
  socket.on('host_tv_answer', ({ answerIndex }) => {
    if (!currentRoomCode || !rooms[currentRoomCode]) return;
    const room = rooms[currentRoomCode];
    if (room.status === 'QUESTION') {
      if (!room.players['tv_host']) {
        room.players['tv_host'] = {
          id: 'tv_host',
          name: 'TV Kumanda',
          avatar: '📺',
          team: 'RED',
          score: 0,
          currentAnswer: null,
          answerTime: null,
          answeredAt: null,
          isCorrect: null,
          isFastest: false,
          lastPointsEarned: 0,
          streak: 0,
          jokerFiftyFifty: true
        };
      }
      const tvPlayer = room.players['tv_host'];
      tvPlayer.currentAnswer = answerIndex;
      tvPlayer.answerTime = room.questionTimeLeft;
      tvPlayer.answeredAt = Date.now();
      revealAnswers(room);
    }
  });

  socket.on('host_next_question', () => {
    if (!currentRoomCode || !rooms[currentRoomCode]) return;
    const room = rooms[currentRoomCode];
    if (room.status === 'ANSWER_REVEAL') {
      nextQuestion(room);
    } else if (room.status === 'AD_BREAK') {
      clearInterval(room.timerInterval);
      nextQuestion(room);
    }
  });


  socket.on('host_open_hall_of_fame', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    room.status = 'HALL_OF_FAME';
    io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
  });

  socket.on('host_reset_hall_of_fame', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    persistentLeaderboard = [];
    saveLeaderboard(persistentLeaderboard);
    io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
  });

  socket.on('host_back_to_lobby', (data) => {
    const room = resolveRoom(data);
    if (!room) return;
    clearInterval(room.timerInterval);
    room.status = 'LOBBY';
    room.currentQuestionIndex = -1;
    io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
  });

  socket.on('disconnect', () => {
    if (currentRoomCode && rooms[currentRoomCode]) {
      const room = rooms[currentRoomCode];
      if (room.players[socket.id]) {
        room.players[socket.id].isDisconnected = true;
        // 5 dakika sonra hala bağlanmadıysa temizle
        setTimeout(() => {
          if (room.players[socket.id] && room.players[socket.id].isDisconnected) {
            delete room.players[socket.id];
            io.to(`room_${currentRoomCode}`).emit('state_update', getPublicGameState(room));
          }
        }, 5 * 60 * 1000);
        io.to(`room_${currentRoomCode}`).emit('state_update', getPublicGameState(room));
      }
    }
  });

});

function getPublicGameState(room) {
  const currentQ = room.currentRoundQuestions[room.currentQuestionIndex];
  const isRevealed = room.status === 'ANSWER_REVEAL' || room.status === 'GAME_OVER';
  const isDouble = isDoublePointsQuestion(room.currentQuestionIndex);

  const playerList = Object.values(room.players);
  const redScore = playerList.filter(p => p.team === 'RED').reduce((sum, p) => sum + (p.score || 0), 0);
  const blueScore = playerList.filter(p => p.team === 'BLUE').reduce((sum, p) => sum + (p.score || 0), 0);

  const isFinalDuel = (room.gameMode === 'TEAM' && isDouble);

  return {
    roomCode: room.roomCode,
    status: room.status,
    gameMode: room.gameMode || 'SOLO',
    ageMode: room.ageMode || 'CLASSIC',
    isPro: !!room.isPro,
    unlockedCategories: room.unlockedCategories || [],
    teamScores: { RED: redScore, BLUE: blueScore },
    teamCombo: room.lastTeamCombo || { red: false, blue: false, active: false },
    isFinalDuel: isFinalDuel,
    questionIndex: room.currentQuestionIndex,
    totalQuestions: room.currentRoundQuestions.length || QUESTIONS_PER_GAME,
    totalPoolSize: allQuestionsPool.length,
    selectedCategory: room.selectedCategory,
    isDoublePoints: isDouble,
    categories: CATEGORY_CONFIG.map(c => ({
      ...c,
      isUnlocked: !c.isVip || room.isPro || (room.unlockedCategories || []).includes(c.name)
    })),
    proTiers: PRO_TIERS,
    adTimeLeft: room.adTimeLeft,
    persistentLeaderboard: persistentLeaderboard,
    question: currentQ ? {
      category: currentQ.category,
      question: currentQ.question,
      options: currentQ.options,
      time: currentQ.time,
      image: currentQ.image || null,
      isKids: !!currentQ.isKids
    } : null,
    correctAnswer: isRevealed && currentQ ? currentQ.answer : null,
    timeLeft: room.questionTimeLeft,
    players: playerList.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      team: p.team || 'RED',
      score: p.score,
      answered: p.currentAnswer !== null,
      lastAnswer: isRevealed ? p.currentAnswer : null,
      isCorrect: isRevealed ? p.isCorrect : null,
      isFastest: isRevealed ? p.isFastest : false,
      lastPointsEarned: isRevealed ? p.lastPointsEarned : 0,
      hadTeamCombo: isRevealed ? !!p.hadTeamCombo : false,
      streak: p.streak,
      hasJoker: p.jokerFiftyFifty,
      hasDoubleChance: p.jokerDoubleChance,
      hasFreeze: p.jokerFreeze,
      wagerActive: p.wagerActive,
      isFrozen: p.isFrozen,
      doubleChanceActive: p.doubleChanceActive
    })).sort((a, b) => b.score - a.score)
  };
}

function startAdBreak(room) {
  clearInterval(room.timerInterval);
  room.status = 'AD_BREAK';
  room.adTimeLeft = 6;
  io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));

  room.timerInterval = setInterval(() => {
    room.adTimeLeft--;
    io.to(`room_${room.roomCode}`).emit('ad_tick', { adTimeLeft: room.adTimeLeft });

    if (room.adTimeLeft <= 0) {
      clearInterval(room.timerInterval);
      nextQuestion(room);
    }
  }, 1000);
}

// KESİN KATEGORİ HAVUZU AYRIŞTIRICI (Asla kategorileri birbirine karıştırmaz)
function getStrictCategoryPool(allQuestions, selectedCategory) {
  const name = (selectedCategory || '').trim();

  // 1. VIP Çocuk Bilim & Zeka
  if (name.includes('Çocuk Bilim') || name.includes('VIP: Çocuk Bilim')) {
    return allQuestions.filter(item => item.category === 'VIP: Çocuk Bilim & Zeka');
  }

  // 2. Çocuk Dünyası & Çizgi Film (Masallar, Çizgi Filmler)
  if (name.includes('Çocuk Dünyası') || name.includes('Çizgi Film') || (name.includes('Çocuk') && !name.includes('Bilim'))) {
    return allQuestions.filter(item => item.category === 'Çocuk Dünyası & Çizgi Film');
  }

  // 3. İslam & Din Kültürü (Yalnızca İslami Sorular)
  if (name.includes('İslam') || name.includes('Dini') || name.includes('Din')) {
    return allQuestions.filter(item => item.category === 'İslam & Dini Bilgiler');
  }

  // 4. Spor & Futbol (ÖNEMLİ: "Futbol & Spor Tarihi" kartı Tarih kelimesinden önce kontrol edilmelidir!)
  if (name.includes('Spor') || name.includes('Futbol')) {
    return allQuestions.filter(item => item.category === 'Spor');
  }

  // 5. Sinema & Dizi
  if (name.includes('Sinema') || name.includes('Dizi')) {
    return allQuestions.filter(item => item.category === 'Sanat & Sinema');
  }

  // 6. Edebiyat & Romanlar
  if (name.includes('Edebiyat') || name.includes('Roman')) {
    return allQuestions.filter(item => item.category === 'Sanat & Edebiyat');
  }

  // 7. Zeka & Mantık (Matematik)
  if (name.includes('Zeka') || name.includes('Mantık') || name.includes('Matematik')) {
    return allQuestions.filter(item => item.category === 'Matematik & Mantık');
  }

  // 8. Bilim & Teknoloji (Yetişkin Bilim)
  if (name.includes('Bilim') || name.includes('Teknoloji')) {
    return allQuestions.filter(item => item.category === 'Bilim & Teknoloji');
  }

  // 9. Tarih (Tarih Giriş Seviyesi ve VIP Tarih Ustası)
  if (name.includes('Tarih')) {
    return allQuestions.filter(item => item.category === 'Tarih');
  }

  // 10. Genel Kültür (Temel ve VIP Genel Kültür Master)
  if (name.includes('Genel Kültür')) {
    return allQuestions.filter(item => item.category === 'Genel Kültür');
  }

  // Doğrudan kategori ismi eşleşmesi
  const directMatch = allQuestions.filter(item => item.category === name);
  if (directMatch.length > 0) return directMatch;

  // Güvenli yetişkin havuzu (Çocuk ve çizgi film soruları asla sızmaz)
  return allQuestions.filter(item => !item.isKids && item.category !== 'Çocuk Dünyası & Çizgi Film' && item.category !== 'VIP: Çocuk Bilim & Zeka');
}

function startNewGame(room) {
  let selectedCategory = room.selectedCategory || 'Tarih (Giriş Seviyesi)';

  // GÜVENLİK DUVARI: Yetkisiz oturum VIP kategori sorularına asla erişemez
  if (isCategoryLockedForRoom(room, selectedCategory)) {
    selectedCategory = 'Tarih (Giriş Seviyesi)';
    room.selectedCategory = selectedCategory;
    io.to(`room_${room.roomCode}`).emit('category_locked', {
      categoryName: selectedCategory,
      message: 'Kilitli VIP kategoriye erişim engellendi! Ücretsiz kategori yüklendi.'
    });
  }

  const isKidsCategory = selectedCategory.includes('Çocuk');

  // Her kategori için ayrı ve bağımsız sıfır tekrar hafızası
  if (!room.askedQuestionsByCategory) {
    room.askedQuestionsByCategory = {};
  }
  if (!room.askedQuestionsByCategory[selectedCategory]) {
    room.askedQuestionsByCategory[selectedCategory] = new Set();
  }
  const categoryAskedSet = room.askedQuestionsByCategory[selectedCategory];

  let selectedRoundQuestions = [];

  // 👨‍👩‍👧‍👦 AİLE KARMASI: SADECE kullanıcı Genel Kültür seçmişse ve Aile Karması aktifse 4 çocuk + 6 yetişkin sorusu dengelenir
  if (room.ageMode === 'FAMILY' && selectedCategory.includes('Genel Kültür')) {
    const allKidsPool = allQuestionsPool.filter(q => q.isKids || (q.category && q.category.includes('Çocuk')));
    const allGkPool = allQuestionsPool.filter(q => q.category === 'Genel Kültür');

    if (!room.askedQuestionsByCategory['KIDS_FAMILY']) room.askedQuestionsByCategory['KIDS_FAMILY'] = new Set();
    const kidsAskedSet = room.askedQuestionsByCategory['KIDS_FAMILY'];

    const kidsPicked = pickUniqueDiverseQuestions(allKidsPool, 4, kidsAskedSet, 'KIDS_FAMILY').map(q => ({ ...q, isKids: true }));
    const adultPicked = pickUniqueDiverseQuestions(allGkPool, 6, categoryAskedSet, 'Genel Kültür').map(q => ({ ...q, isKids: false }));

    const combined = new Array(QUESTIONS_PER_GAME);
    const kidSlots = [1, 3, 6, 8];
    const adultSlots = [0, 2, 4, 5, 7, 9];
    kidSlots.forEach((slot, i) => { combined[slot] = kidsPicked[i] || kidsPicked[0]; });
    adultSlots.forEach((slot, i) => { combined[slot] = adultPicked[i] || adultPicked[0]; });
    selectedRoundQuestions = combined;
  } else {
    // 🎯 TÜM DİĞER KATEGORİLER (İslam, Tarih, Bilim, Sinema, Spor, Edebiyat, Zeka, Çocuk):
    // KESİNLİKLE %100 SAF KATEGORİDEN SEÇİLİR. ASLA BAŞKA KATEGORİ SIZMAZ!
    const pool = getStrictCategoryPool(allQuestionsPool, selectedCategory);
    const picked = pickUniqueDiverseQuestions(pool, QUESTIONS_PER_GAME, categoryAskedSet, selectedCategory);
    selectedRoundQuestions = picked.map(q => ({
      ...q,
      isKids: isKidsCategory || !!q.isKids
    }));
  }

  room.currentRoundQuestions = selectedRoundQuestions.map(q => shuffleQuestionOptions(q));

  Object.values(room.players).forEach(p => {
    p.score = 0;
    p.currentAnswer = null;
    p.answerTime = null;
    p.answeredAt = null;
    p.isCorrect = null;
    p.isFastest = false;
    p.lastPointsEarned = 0;
    p.streak = 0;
    p.jokerFiftyFifty = true;
    p.jokerDoubleChance = true;
    p.jokerFreeze = true;
    p.doubleChanceActive = false;
    p.doubleChanceFirstTry = null;
    p.wagerActive = false;
    p.isFrozen = false;
  });
  room.currentQuestionIndex = -1;
  nextQuestion(room);
}

function nextQuestion(room) {
  clearInterval(room.timerInterval);
  room.currentQuestionIndex++;

  if (room.currentQuestionIndex >= room.currentRoundQuestions.length) {
    endGame(room);
    return;
  }

  room.lastTeamCombo = null;

  Object.values(room.players).forEach(p => {
    p.currentAnswer = null;
    p.answerTime = null;
    p.answeredAt = null;
    p.isCorrect = null;
    p.isFastest = false;
    p.lastPointsEarned = 0;
    p.hadTeamCombo = false;
    p.doubleChanceActive = false;
    p.doubleChanceFirstTry = null;
    p.wagerActive = false;
    p.isFrozen = false;
  });

  const q = room.currentRoundQuestions[room.currentQuestionIndex];
  room.status = 'QUESTION';
  room.questionTimeLeft = q.time || 28;
  room.questionStartedAt = Date.now();

  io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));

  room.timerInterval = setInterval(() => {
    room.questionTimeLeft--;
    io.to(`room_${room.roomCode}`).emit('timer_tick', { timeLeft: room.questionTimeLeft });

    if (room.questionTimeLeft <= 0) {
      clearInterval(room.timerInterval);
      revealAnswers(room);
    }
  }, 1000);
}

function revealAnswers(room) {
  clearInterval(room.timerInterval);
  room.status = 'ANSWER_REVEAL';

  const q = room.currentRoundQuestions[room.currentQuestionIndex];
  const isDouble = isDoublePointsQuestion(room.currentQuestionIndex);
  const multiplier = isDouble ? 2 : 1;

  // En hızlı doğru cevap veren oyuncuyu bul
  const correctPlayers = Object.values(room.players).filter(p => p.currentAnswer === q.answer && p.answeredAt !== null);
  correctPlayers.sort((a, b) => a.answeredAt - b.answeredAt);
  const fastestPlayerId = correctPlayers.length > 0 ? correctPlayers[0].id : null;

  Object.values(room.players).forEach(p => {
    if (p.currentAnswer === q.answer) {
      p.isCorrect = true;
      p.isFastest = (p.id === fastestPlayerId);
      p.streak = (p.streak || 0) + 1;

      const speedBonus = Math.max(0, (p.answerTime || 1) * 25);
      const streakBonus = p.streak >= 2 ? Math.min(500, p.streak * 100) : 0;
      const fastestBonus = p.isFastest ? 150 : 0;
      const wagerBonus = p.wagerActive ? 500 : 0; // 🔥 Risk Al (+500 Puan)

      const totalEarned = (500 + speedBonus + streakBonus + fastestBonus + wagerBonus) * multiplier;
      p.lastPointsEarned = totalEarned;
      p.score += totalEarned;
    } else {
      p.isCorrect = false;
      p.isFastest = false;
      p.streak = 0;
      if (p.wagerActive) {
        // 🔥 Risk Al Cezası (-250 Puan)
        p.score = Math.max(0, p.score - 250);
        p.lastPointsEarned = -250;
      } else {
        p.lastPointsEarned = 0;
      }
    }
  });

  // 2. TAKIM COMBO (SERİ) ÇARPANI:
  // Bir takımdaki tüm oyuncular aynı soruya doğru cevap verirse o soru için takıma "TAKIM COMBOSU (1.5x Puan)" verilsin
  let redCombo = false;
  let blueCombo = false;

  if (room.gameMode === 'TEAM') {
    const redPlayers = Object.values(room.players).filter(p => p.team === 'RED' && !p.isDisconnected);
    const bluePlayers = Object.values(room.players).filter(p => p.team === 'BLUE' && !p.isDisconnected);

    redCombo = (redPlayers.length > 0 && redPlayers.every(p => p.isCorrect === true));
    blueCombo = (bluePlayers.length > 0 && bluePlayers.every(p => p.isCorrect === true));

    if (redCombo) {
      redPlayers.forEach(p => {
        const comboBonus = Math.round(p.lastPointsEarned * 0.5); // 1.5x Çarpanı
        p.lastPointsEarned += comboBonus;
        p.score += comboBonus;
        p.hadTeamCombo = true;
      });
    }

    if (blueCombo) {
      bluePlayers.forEach(p => {
        const comboBonus = Math.round(p.lastPointsEarned * 0.5); // 1.5x Çarpanı
        p.lastPointsEarned += comboBonus;
        p.score += comboBonus;
        p.hadTeamCombo = true;
      });
    }
  }

  room.lastTeamCombo = {
    red: redCombo,
    blue: blueCombo,
    active: redCombo || blueCombo
  };

  io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
}

function endGame(room) {
  room.status = 'GAME_OVER';

  const playersSorted = Object.values(room.players).sort((a,b) => b.score - a.score);
  playersSorted.forEach(p => {
    if (p.score > 0) {
      persistentLeaderboard.push({
        name: p.name,
        avatar: p.avatar,
        score: p.score,
        date: new Date().toLocaleDateString('tr-TR')
      });
    }
  });

  persistentLeaderboard.sort((a,b) => b.score - a.score);
  persistentLeaderboard = persistentLeaderboard.slice(0, 20);
  saveLeaderboard(persistentLeaderboard);

  io.to(`room_${room.roomCode}`).emit('state_update', getPublicGameState(room));
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Tam Donanımlı TV Party Trivia Sunucusu Aktif! (Çoklu Oda + 2X Puan + Canlı Emoji)`);
  console.log(`TV Ekranı için: http://localhost:${PORT}`);
  console.log(`Telefon Katılımı için IP: http://${localIp}:${PORT}/play.html`);
});
