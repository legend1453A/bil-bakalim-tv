const fs = require('fs');
const path = require('path');

const questionsFile = path.join(__dirname, 'questions.json');
let questions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));

console.log('Mevcut toplam soru:', questions.length);

// 1. Yeni Doğru / Yanlış Soruları (type: "TRUE_FALSE")
const trueFalseQuestions = [
  // TARİH
  {
    category: "Tarih",
    question: "Osmanlı Devleti'nin ilk başkenti Bursa'dır.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 1, // Söğüt / İznik / Bilecik ilk merkezler, Bursa 1326'da fethedildi (veya Söğüt ilk başkent kabul edilir)
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "tarih_dy"
  },
  {
    category: "Tarih",
    question: "Fatih Sultan Mehmet, İstanbul'u fethettiğinde 21 yaşındaydı.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 0, // DOĞRU
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "tarih_dy"
  },
  {
    category: "Tarih",
    question: "Kurtuluş Savaşı'nda Batı Cephesi Komutanlığı'nı İsmet İnönü yürütmüştür.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 0, // DOĞRU
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "ORTA",
    style: "tarih_dy"
  },
  {
    category: "Tarih",
    question: "İlk Türk devletlerinde hükümdarlara 'Firavun' unvanı verilirdi.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 1, // YANLIŞ (Kağan / Hakan)
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "tarih_dy"
  },
  {
    category: "Tarih",
    question: "Cumhuriyet, 29 Ekim 1923 tarihinde Türkiye Büyük Millet Meclisi'nde ilan edilmiştir.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 0, // DOĞRU
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "tarih_dy"
  },

  // GENEL KÜLTÜR
  {
    category: "Genel Kültür",
    question: "Ahtapotların vücudunda tam 3 adet kalp bulunmaktadır.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 0, // DOĞRU
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "ORTA",
    style: "gk_dy"
  },
  {
    category: "Genel Kültür",
    question: "Brezilya'nın resmi dili İspanyolca'dır.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 1, // YANLIŞ (Portekizce)
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "gk_dy"
  },
  {
    category: "Genel Kültür",
    question: "Dünyanın en uzun nehri Nil Nehri'dir.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 0, // DOĞRU
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "gk_dy"
  },
  {
    category: "Genel Kültür",
    question: "Gözlerimiz açıkken hapşırmak insan anatomisi açısından mümkündür.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 1, // YANLIŞ
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "ORTA",
    style: "gk_dy"
  },
  {
    category: "Genel Kültür",
    question: "İtalya'nın başkenti Milano şehridir.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 1, // YANLIŞ (Roma)
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "gk_dy"
  },

  // BİLİM & TEKNOLOJİ
  {
    category: "Bilim & Teknoloji",
    question: "Güneş Sistemi'ndeki en büyük gezegen Jüpiter'dir.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 0, // DOĞRU
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "bilim_dy"
  },
  {
    category: "Bilim & Teknoloji",
    question: "Işık hızı saniyede yaklaşık 300.000 kilometre yol alır.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 0, // DOĞRU
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "ORTA",
    style: "bilim_dy"
  },
  {
    category: "Bilim & Teknoloji",
    question: "İnsan vücudundaki en güçlü ve sert kemik köprücük kemiğidir.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 1, // YANLIŞ (Uyluk / Femur kemiği)
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "ZOR",
    style: "bilim_dy"
  },
  {
    category: "Bilim & Teknoloji",
    question: "Suyun kimyasal formülü H2O'dur.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 0, // DOĞRU
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "bilim_dy"
  },

  // SPOR
  {
    category: "Spor",
    question: "Galatasaray, UEFA Kupası'nı 2000 yılında Arsenal'i yenerek kazanmıştır.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 0, // DOĞRU
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "spor_dy"
  },
  {
    category: "Spor",
    question: "Futbol maçlarında bir takım sahada en az 8 oyuncu ile maça devam edebilir.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 1, // YANLIŞ (En az 7 oyuncu olmalıdır)
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "ORTA",
    style: "spor_dy"
  },
  {
    category: "Spor",
    question: "Basketbolda serbest atış çizgisi arkasından atılan basket 3 puan değerindedir.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 1, // YANLIŞ (Serbest atış 1 puandır)
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "spor_dy"
  },

  // SANAT & SİNEMA
  {
    category: "Sanat & Sinema",
    question: "Hababam Sınıfı film serisinde Mahmut Hoca karakterini Kemal Sunal canlandırmıştır.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 1, // YANLIŞ (Münir Özkul)
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "sinema_dy"
  },
  {
    category: "Sanat & Sinema",
    question: "Tosun Paşa filminde Yeşil Vadi için Hakiki Tosun Paşa rolünü Oktar Durukan oynamıştır.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 0, // DOĞRU
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "ZOR",
    style: "sinema_dy"
  },

  // İSLAM & DİNİ BİLGİLER
  {
    category: "İslam & Dini Bilgiler",
    question: "Kuran-ı Kerim'in ilk indirilen suresi ve ayetleri Alak Suresi'dir.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 0, // DOĞRU (Oku emri)
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "din_dy"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "İslam'ın şartı 6, imanın şartı 5'tir.",
    options: ["DOĞRU", "YANLIŞ"],
    answer: 1, // YANLIŞ (İslam'ın şartı 5, imanın şartı 6'dır)
    time: 15,
    type: "TRUE_FALSE",
    difficulty: "KOLAY",
    style: "din_dy"
  }
];

// 2. Yeni Boşluk Doldurma Soruları (type: "FILL_BLANK")
const fillBlankQuestions = [
  // TARİH
  {
    category: "Tarih",
    question: "Kurtuluş Savaşı'nda Mustafa Kemal Paşa'ya Mareşallik rütbesi ve Gazilik unvanı _______ Meydan Muharebesi sonrasında verilmiştir.",
    options: ["Sakarya", "Büyük Taarruz", "1. İnönü", "Çanakkale"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "ORTA",
    style: "tarih_bosluk"
  },
  {
    category: "Tarih",
    question: "Osmanlı Devleti'ni 1299 yılında kuran kurucu padişah _______ Gazi'dir.",
    options: ["Osman", "Orhan", "Ertuğrul", "Murat"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "KOLAY",
    style: "tarih_bosluk"
  },
  {
    category: "Tarih",
    question: "1071 yılında Anadolu'nun kapılarını Türklere açan zafer _______ Meydan Muharebesi'dir.",
    options: ["Malazgirt", "Dandanakan", "Pasinler", "Miryokefalon"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "KOLAY",
    style: "tarih_bosluk"
  },

  // GENEL KÜLTÜR
  {
    category: "Genel Kültür",
    question: "Türkiye Cumhuriyeti'nin başkenti _______ şehridir.",
    options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "KOLAY",
    style: "gk_bosluk"
  },
  {
    category: "Genel Kültür",
    question: "Mona Lisa tablosunu yapan dünyaca ünlü İtalyan ressam _______ da Vinci'dir.",
    options: ["Leonardo", "Michelangelo", "Raphael", "Donatello"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "KOLAY",
    style: "gk_bosluk"
  },
  {
    category: "Genel Kültür",
    question: "Dünyanın uydusu olan gök cismi _______'dır.",
    options: ["Ay", "Mars", "Güneş", "Venüs"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "KOLAY",
    style: "gk_bosluk"
  },

  // BİLİM & TEKNOLOJİ
  {
    category: "Bilim & Teknoloji",
    question: "Yerçekimi kanununu başına elma düşmesiyle keşfettiği rivayet edilen ünlü bilim insanı Isaac _______'dır.",
    options: ["Newton", "Einstein", "Tesla", "Galileo"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "KOLAY",
    style: "bilim_bosluk"
  },
  {
    category: "Bilim & Teknoloji",
    question: "Bitkilerin güneş ışığını kullanarak besin ve oksijen üretmesi olayına _______ denir.",
    options: ["Fotosentez", "Kemosentez", "Solunum", "Fermantasyon"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "ORTA",
    style: "bilim_bosluk"
  },

  // SPOR
  {
    category: "Spor",
    question: "Basketbol maçlarında her takım sahada aynı anda _______ oyuncu ile mücadele eder.",
    options: ["5", "6", "7", "11"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "KOLAY",
    style: "spor_bosluk"
  },
  {
    category: "Spor",
    question: "A Milli Futbol Takımımızın Dünya Kupası'nda 3. olduğu efsane turnuva _______ yılında düzenlenmiştir.",
    options: ["2002", "1998", "2006", "2010"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "ORTA",
    style: "spor_bosluk"
  },

  // İSLAM & DİNİ BİLGİLER
  {
    category: "İslam & Dini Bilgiler",
    question: "Peygamber Efendimiz Hz. Muhammed (s.a.v.) _______ yılında Mekke'de dünyaya gelmiştir.",
    options: ["571", "632", "610", "622"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "KOLAY",
    style: "din_bosluk"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "İslam dininde zekat, dinen zengin sayılan Müslümanların yılda bir kez mallarının _______'de birini vermesidir.",
    options: ["40", "10", "20", "5"],
    answer: 0,
    time: 20,
    type: "FILL_BLANK",
    difficulty: "ORTA",
    style: "din_bosluk"
  }
];

// Mevcut sorulara type ve difficulty ataması (eğer yoksa)
questions.forEach((q, idx) => {
  if (!q.type) {
    if (q.question && q.question.includes('_______')) {
      q.type = 'FILL_BLANK';
    } else if (q.options && q.options.length === 2) {
      q.type = 'TRUE_FALSE';
    } else {
      q.type = 'MULTIPLE_CHOICE';
    }
  }
  if (!q.difficulty) {
    // Dağılım: %40 KOLAY, %40 ORTA, %20 ZOR
    const r = (idx % 10);
    if (r < 4) q.difficulty = 'KOLAY';
    else if (r < 8) q.difficulty = 'ORTA';
    else q.difficulty = 'ZOR';
  }
});

// Yeni soruları ekle (soru metni daha önce yoksa)
const existingTexts = new Set(questions.map(q => (q.question || '').trim().toLowerCase()));

let addedCount = 0;
[...trueFalseQuestions, ...fillBlankQuestions].forEach(nq => {
  const key = nq.question.trim().toLowerCase();
  if (!existingTexts.has(key)) {
    questions.push(nq);
    existingTexts.add(key);
    addedCount++;
  }
});

fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2), 'utf8');
console.log(`Tamamlandı! ${addedCount} yeni soru eklendi. Toplam soru: ${questions.length}`);
