const fs = require('fs');
const path = require('path');

function auditQuestionsFile(filePath) {
  console.log(`\n======================================================`);
  console.log(`🔍 DENETLENEN DOSYA: ${filePath}`);
  console.log(`======================================================`);

  if (!fs.existsSync(filePath)) {
    console.error(`Dosya bulunamadı: ${filePath}`);
    return;
  }

  const rawData = fs.readFileSync(filePath, 'utf8');
  let questions = [];
  try {
    questions = JSON.parse(rawData);
  } catch (err) {
    console.error(`❌ JSON Ayrıştırma Hatası: ${err.message}`);
    return;
  }

  console.log(`Toplam Soru Sayısı: ${questions.length}\n`);

  const issues = [];
  const seenQuestions = new Map();

  questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const itemErrors = [];

    // 1. Temel Yapı Kontrolleri
    if (!q.question || typeof q.question !== 'string' || !q.question.trim()) {
      itemErrors.push('Soru metni boş veya geçersiz');
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      itemErrors.push(`Şık sayısı 4 değil (Mevcut: ${Array.isArray(q.options) ? q.options.length : 0})`);
    }
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3) {
      itemErrors.push(`Cevap indeksi 0-3 aralığında değil (Mevcut: ${q.answer})`);
    }

    if (q.question) {
      const text = q.question.trim();

      // 2. Mükerrer (Aynı) Soru Tespiti
      const cleanKey = text.toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '');
      if (seenQuestions.has(cleanKey)) {
        itemErrors.push(`Mükerrer soru! (İlk olarak Soru #${seenQuestions.get(cleanKey)}'de bulundu)`);
      } else {
        seenQuestions.set(cleanKey, qNum);
      }

      // 3. Noktalama & Yazım Kontrolleri
      if (!text.endsWith('?') && !text.endsWith(':')) {
        itemErrors.push(`Soru işareti (?) ile bitmiyor: "${text.slice(-15)}"`);
      }
      if (text.includes('??')) {
        itemErrors.push('Çift soru işareti (??) var');
      }
      if (text.includes('  ')) {
        itemErrors.push('Çift boşluk (  ) içeriyor');
      }

      // 4. Anlatım Bozukluğu & Kalıp Hataları
      const repetitions = text.match(/\b(ve|ile|de|da|bir|bu|için)\s+\1\b/gi);
      if (repetitions) {
        itemErrors.push(`Kelime tekrarı anlatım kusuru: "${repetitions.join(', ')}"`);
      }
      if (/bebek\s+Hz\./i.test(text)) {
        itemErrors.push('Anlatım kusuru: "bebek Hz." kalıbı');
      }
      if (/susuzluğu sırasında/i.test(text)) {
        itemErrors.push('Anlatım kusuru: "susuzluğu sırasında" kalıbı');
      }
      if (/hangisidir\s*\?/i.test(text) && /hangi\s.*hangisidir/i.test(text)) {
        itemErrors.push('Gereksiz "hangi" tekrarı');
      }
    }

    // 5. Şık Kontrolleri
    if (Array.isArray(q.options)) {
      const optSet = new Set();
      q.options.forEach((opt, optIdx) => {
        if (!opt || typeof opt !== 'string' || !opt.trim()) {
          itemErrors.push(`Şık #${optIdx + 1} (${['A','B','C','D'][optIdx]}) boş`);
        } else {
          const optClean = opt.trim().toLowerCase();
          if (optSet.has(optClean)) {
            itemErrors.push(`Birbiriyle aynı olan mükerrer şık: "${opt}"`);
          }
          optSet.add(optClean);
        }
      });
    }

    if (itemErrors.length > 0) {
      issues.push({
        num: qNum,
        category: q.category || 'Belirtilmemiş',
        question: q.question || '',
        errors: itemErrors
      });
    }
  });

  if (issues.length === 0) {
    console.log(`✅ Harika! ${questions.length} sorunun tamamı kurallara uygun ve hatasız.`);
  } else {
    console.log(`⚠️ Tespit Edilen Olası Hata / Düzeltme Önerisi Sayısı: ${issues.length}\n`);
    issues.forEach(iss => {
      console.log(`--- [Soru #${iss.num}] [${iss.category}] ---`);
      console.log(`Metin: "${iss.question}"`);
      iss.errors.forEach(err => console.log(`   ❌ ${err}`));
      console.log('');
    });
  }

  return { total: questions.length, issueCount: issues.length, issues };
}

console.log('=== BİL BAKALIM SORU KALİTE VE YAZIM DENETİM SİSTEMİ ===');
const rootResult = auditQuestionsFile(path.join(__dirname, 'questions.json'));
const publicResult = auditQuestionsFile(path.join(__dirname, 'public', 'questions.json'));
