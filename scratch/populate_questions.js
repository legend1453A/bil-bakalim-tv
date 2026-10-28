const fs = require('fs');
const path = require('path');

const questionsFile = path.join(__dirname, '..', 'questions.json');
let existingQuestions = [];
try {
  existingQuestions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));
} catch (e) {
  existingQuestions = [];
}

const existingQuestionsMap = new Map();
existingQuestions.forEach(q => {
  existingQuestionsMap.set((q.question || '').trim().toLowerCase(), q);
});

// Zengin Yeni Soru Havuzu
const newQuestionPacks = [
  // --- İSLAM & DİNİ BİLGİLER ---
  {
    category: "İslam & Dini Bilgiler",
    question: "Peygamber Efendimiz Hz. Muhammed'e (s.a.v.) ilk vahiy hangi mağarada gelmiştir?",
    options: ["Hira Mağarası", "Sevr Mağarası", "Uhud Mağarası", "Nur Mağarası"],
    answer: 0,
    time: 20,
    style: "islam_tarihi"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Kur'an-ı Kerim'in en uzun suresi hangisidir?",
    options: ["Al-i İmran Suresi", "Bakara Suresi", "Nisa Suresi", "Maide Suresi"],
    answer: 1,
    time: 20,
    style: "kuran"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "İslam'ın beş şartından biri olan zekat kimlere farzdır?",
    options: ["Her Müslümana", "Yalnızca hacca gidenlere", "Nisap miktarı mala sahip zenginlere", "Sadece esnaflara"],
    answer: 2,
    time: 20,
    style: "ibadet"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Hicret esnasında Peygamberimiz ile Sevr Mağarası'nda beraber bulunan sahabe kimdir?",
    options: ["Hz. Ömer", "Hz. Ali", "Hz. Ebubekir", "Hz. Osman"],
    answer: 2,
    time: 20,
    style: "sahabe"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Müslümanların ilk kıblesi neresidir?",
    options: ["Kabe-i Muazzama", "Mescid-i Aksa", "Mescid-i Nebevi", "Kuba Mescidi"],
    answer: 1,
    time: 20,
    style: "tarih"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Kur'an-ı Kerim hangi halife döneminde kitap (Mushaf) haline getirilmiştir?",
    options: ["Hz. Ebubekir", "Hz. Ömer", "Hz. Osman", "Hz. Ali"],
    answer: 0,
    time: 20,
    style: "kuran_tarihi"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Kur'an-ı Kerim hangi halife döneminde çoğaltılarak İslam merkezlerine gönderilmiştir?",
    options: ["Hz. Ebubekir", "Hz. Ömer", "Hz. Osman", "Hz. Ali"],
    answer: 2,
    time: 20,
    style: "kuran_tarihi"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Peygamber Efendimiz'in kabrinin de bulunduğu Medine'deki mescidin adı nedir?",
    options: ["Mescid-i Haram", "Mescid-i Nebevi", "Mescid-i Aksa", "Mescid-i Kıbleteyn"],
    answer: 1,
    time: 20,
    style: "mekanlar"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Sabır timsali olarak bilinen ve ağır hastalıklara karşı sabrıyla anılan peygamber kimdir?",
    options: ["Hz. Eyyub", "Hz. Yakub", "Hz. Yusuf", "Hz. Davud"],
    answer: 0,
    time: 20,
    style: "peygamberler"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Kendisine 'Zebur' kutsal kitabı indirilen peygamber hangisidir?",
    options: ["Hz. Musa", "Hz. İsa", "Hz. Davud", "Hz. İbrahim"],
    answer: 2,
    time: 20,
    style: "peygamberler"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "İslam tarihinde Müslümanların kazandığı ilk büyük zafer hangi savaştır?",
    options: ["Bedir Savaşı", "Uhud Savaşı", "Hendek Savaşı", "Huneyn Savaşı"],
    answer: 0,
    time: 20,
    style: "savaslar"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Okçular Tepesi'nin terk edilmesi sebebiyle Müslümanların zor anlar yaşadığı savaş hangisidir?",
    options: ["Bedir Savaşı", "Uhud Savaşı", "Mute Savaşı", "Tebük Seferi"],
    answer: 1,
    time: 20,
    style: "savaslar"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Medine'nin etrafına hendek kazma fikrini Peygamberimiz'e öneren sahabe kimdir?",
    options: ["Selman-ı Farisi", "Bilal-i Habeşi", "Halid bin Velid", "Ebu Ubeyde"],
    answer: 0,
    time: 20,
    style: "sahabe"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "İslam'ın ilk müezzini kimdir?",
    options: ["Zeyd bin Sabit", "Bilal-i Habeşi", "Musab bin Umeyr", "Ammar bin Yasir"],
    answer: 1,
    time: 20,
    style: "sahabe"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Peygamber Efendimiz'e 'Seyfullah' (Allah'ın Kılıcı) unvanını verdiği ünlü komutan kimdir?",
    options: ["Hz. Hamza", "Hz. Ali", "Halid bin Velid", "Sad bin Ebi Vakkas"],
    answer: 2,
    time: 20,
    style: "sahabe"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Günde 5 vakit kılınan farz namazlar toplam kaç rekattır?",
    options: ["15", "17", "20", "24"],
    answer: 1,
    time: 20,
    style: "ibadet"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Bin aydan daha hayırlı olduğu Kur'an-ı Kerim'de bildirilen mübarek gece hangisidir?",
    options: ["Mevlid Kandili", "Kadir Gecesi", "Berat Kandili", "Miraç Kandili"],
    answer: 1,
    time: 20,
    style: "kutsal_vakitler"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Peygamberimizin göğe yükselerek Allah'ın huzuruna kabul edildiği mucizevi yolculuk nedir?",
    options: ["Hicret", "Miraç", "İsra", "Biat"],
    answer: 1,
    time: 20,
    style: "mucizeler"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Su bulunmadığı veya kullanılamadığı durumlarda temiz toprakla alınan abdest hangisidir?",
    options: ["Gusül", "Teyemmüm", "Mesh", "İstihaze"],
    answer: 1,
    time: 20,
    style: "fikih"
  },
  {
    category: "İslam & Dini Bilgiler",
    question: "Kelime-i Şehadet'in ilk kısmı aşağıdakilerden hangisidir?",
    options: ["Eşhedü en la ilahe illallah", "Ve eşhedü enne Muhammeden abduhu", "Bismillahi Allahuekber", "Subhanallahi ve bihamdihi"],
    answer: 0,
    time: 20,
    style: "iman"
  },

  // --- TARİH ---
  {
    category: "Tarih",
    question: "Osmanlı Devleti'nin kurucusu olan ilk padişah kimdir?",
    options: ["Ertuğrul Gazi", "Osman Gazi", "Orhan Gazi", "I. Murad"],
    answer: 1,
    time: 20,
    style: "osmanli"
  },
  {
    category: "Tarih",
    question: "İstanbul'u 1453 yılında fethederek 'Fatih' unvanını alan Osmanlı padişahı kimdir?",
    options: ["II. Mehmed", "I. Selim", "I. Süleyman", "II. Murad"],
    answer: 0,
    time: 20,
    style: "osmanli"
  },
  {
    category: "Tarih",
    question: "Mustafa Kemal Atatürk'ün Samsun'a çıkarak Milli Mücadele'yi fiilen başlattığı tarih hangisidir?",
    options: ["23 Nisan 1920", "19 Mayıs 1919", "29 Ekim 1923", "30 Ağustos 1922"],
    answer: 1,
    time: 20,
    style: "kurtulus_savasi"
  },
  {
    category: "Tarih",
    question: "Türkiye Büyük Millet Meclisi (TBMM) hangi tarihte açılmıştır?",
    options: ["19 Mayıs 1919", "23 Nisan 1920", "29 Ekim 1923", "9 Eylül 1922"],
    answer: 1,
    time: 20,
    style: "cumhuriyet"
  },
  {
    category: "Tarih",
    question: "Milli Mücadele'de Türk ordusunun Yunan ordusunu kesin yenilgiye uğrattığı 'Büyük Taarruz' hangi tarihte zaferle sonuçlanmıştır?",
    options: ["30 Ağustos 1922", "9 Eylül 1922", "29 Ekim 1923", "24 Temmuz 1923"],
    answer: 0,
    time: 20,
    style: "kurtulus_savasi"
  },
  {
    category: "Tarih",
    question: "Cumhuriyet hangi tarihte ilan edilmiştir?",
    options: ["23 Nisan 1920", "29 Ekim 1923", "30 Ağustos 1922", "19 Mayıs 1919"],
    answer: 1,
    time: 20,
    style: "cumhuriyet"
  },
  {
    category: "Tarih",
    question: "İstiklal Marşı'mızın şairi kimdir?",
    options: ["Mehmet Akif Ersoy", "Ziya Gökalp", "Yahya Kemal Beyatlı", "Namık Kemal"],
    answer: 0,
    time: 20,
    style: "kultur_tarihi"
  },
  {
    category: "Tarih",
    question: "İlk Türk devletlerinde hükümdarlara verilen unvanlardan biri hangisidir?",
    options: ["Padişah", "Hakan / Kağan", "Kral", "Çar"],
    answer: 1,
    time: 20,
    style: "eski_turkler"
  },
  {
    category: "Tarih",
    question: "Tarihte bilinen ilk Türk devleti hangisidir?",
    options: ["Göktürk Devleti", "Asya Hun Devleti", "Uygur Devleti", "Avarlar"],
    answer: 1,
    time: 20,
    style: "eski_turkler"
  },
  {
    category: "Tarih",
    question: "Tarihte yazıyı ilk kullanan uygarlık hangisidir?",
    options: ["Mısırlılar", "Sümerler", "Hititler", "Yunanlar"],
    answer: 1,
    time: 20,
    style: "dunya_tarihi"
  },
  {
    category: "Tarih",
    question: "Çanakkale Kara Savaşları'nda Mustafa Kemal hangi tepedeki başarısıyla 'Anafartalar Kahramanı' olmuştur?",
    options: ["Conkbayırı", "Kocatepe", "Dumlupınar", "İnönü"],
    answer: 0,
    time: 20,
    style: "canakkale"
  },
  {
    category: "Tarih",
    question: "Osmanlı Devleti'nde en uzun süre tahtta kalan padişah kimdir?",
    options: ["Fatih Sultan Mehmed", "Yavuz Sultan Selim", "Kanuni Sultan Süleyman", "II. Abdülhamid"],
    answer: 2,
    time: 20,
    style: "osmanli"
  },
  {
    category: "Tarih",
    question: "Türkiye Cumhuriyeti'nin tapusu niteliğindeki bağımsızlık antlaşması hangisidir?",
    options: ["Sevr Antlaşması", "Mondros Ateşkesi", "Lozan Barış Antlaşması", "Gümrü Antlaşması"],
    answer: 2,
    time: 20,
    style: "cumhuriyet"
  },
  {
    category: "Tarih",
    question: "Orhun Abideleri hangi Türk devletine aittir?",
    options: ["Hunlar", "Göktürkler (Kutluk Devleti)", "Uygurlar", "Karahanlılar"],
    answer: 1,
    time: 20,
    style: "eski_turkler"
  },
  {
    category: "Tarih",
    question: "Anadolu Selçuklu Devleti'nin başkenti neresiydi?",
    options: ["Bursa", "Konya", "Edirne", "Sivas"],
    answer: 1,
    time: 20,
    style: "selcuklu"
  },

  // --- SPOR & FUTBOL ---
  {
    category: "Spor",
    question: "2000 yılında UEFA Kupası'nı namağlup kazanan ilk ve tek Türk futbol takımı hangisidir?",
    options: ["Fenerbahçe", "Beşiktaş", "Galatasaray", "Trabzonspor"],
    answer: 2,
    time: 20,
    style: "futbol_tarihi"
  },
  {
    category: "Spor",
    question: "A Milli Futbol Takımımız Dünya Kupası'nda en büyük başarısı olan üçüncülüğü hangi yıl elde etmiştir?",
    options: ["1998", "2002", "2006", "2008"],
    answer: 1,
    time: 20,
    style: "milli_takim"
  },
  {
    category: "Spor",
    question: "'Cep Herkülü' lakaplı 3 kez Olimpiyat Şampiyonu olan efsanevi Türk halterci kimdir?",
    options: ["Halil Mutlu", "Naim Süleymanoğlu", "Taner Sağır", "Sedat Artuç"],
    answer: 1,
    time: 20,
    style: "olimpiyat"
  },
  {
    category: "Spor",
    question: "Tokyo 2020 Olimpiyatları'nda okçulukta Türkiye'ye ilk altın madalyayı kazandıran sporcumuz kimdir?",
    options: ["Mete Gazoz", "Rıza Kayaalp", "Taha Akgül", "Ferhat Arıcan"],
    answer: 0,
    time: 20,
    style: "olimpiyat"
  },
  {
    category: "Spor",
    question: "2023 yılında hem Milletler Ligi hem de Avrupa Şampiyonu olan kadın voleybol milli takımımızın lakabı nedir?",
    options: ["Potanın Perileri", "Filenin Sultanları", "Altın Kızlar", "Rüzgarın Kızları"],
    answer: 1,
    time: 20,
    style: "voleybol"
  },
  {
    category: "Spor",
    question: "Futbolda bir maç kaçar dakikalık 2 devreden oluşur?",
    options: ["40", "45", "50", "60"],
    answer: 1,
    time: 20,
    style: "kurallar"
  },
  {
    category: "Spor",
    question: "Dünya Kupası'nı 5 kez ile en çok kazanan ülke hangisidir?",
    options: ["Almanya", "İtalya", "Brezilya", "Arjantin"],
    answer: 2,
    time: 20,
    style: "dunya_futbolu"
  },
  {
    category: "Spor",
    question: "Basketbolda bir takım sahada kaç oyuncu ile mücadele eder?",
    options: ["4", "5", "6", "7"],
    answer: 1,
    time: 20,
    style: "basketbol"
  },
  {
    category: "Spor",
    question: "Fenerbahçe Erkek Basketbol Takımı EuroLeague şampiyonluğunu hangi yıl kazanmıştır?",
    options: ["2015", "2016", "2017", "2019"],
    answer: 2,
    time: 20,
    style: "basketbol"
  },
  {
    category: "Spor",
    question: "Kariyerinde 8 Ballon d'Or (Altın Top) ödülü kazanan Arjantinli efsane futbolcu kimdir?",
    options: ["Diego Maradona", "Lionel Messi", "Cristiano Ronaldo", "Pele"],
    answer: 1,
    time: 20,
    style: "yildizlar"
  },
  {
    category: "Spor",
    question: "Futbolda ceza sahası içindeki faule verilen doğrudan kaleciyle karşı karşıya vuruş nedir?",
    options: ["Korner", "Taç", "Penaltı", "Frikik"],
    answer: 2,
    time: 20,
    style: "kurallar"
  },
  {
    category: "Spor",
    question: "Teniste 4 büyük turnuvaya verilen genel isim nedir?",
    options: ["Grand Slam", "Masters", "Super Bowl", "Champions"],
    answer: 0,
    time: 20,
    style: "tenis"
  },

  // --- BİLİM & TEKNOLOJİ ---
  {
    category: "Bilim & Teknoloji",
    question: "Güneş Sistemi'mizin en büyük gezegeni hangisidir?",
    options: ["Mars", "Satürn", "Jüpiter", "Neptün"],
    answer: 2,
    time: 20,
    style: "astronomi"
  },
  {
    category: "Bilim & Teknoloji",
    question: "DNA'nın onarımı ile ilgili çalışmalarından ötürü 2015 Nobel Kimya Ödülü'nü kazanan Türk bilim insanı kimdir?",
    options: ["Cahit Arf", "Aziz Sancar", "Oktay Sinanoğlu", "Ali Erdemir"],
    answer: 1,
    time: 20,
    style: "bilim_insanlari"
  },
  {
    category: "Bilim & Teknoloji",
    question: "Suyun kimyasal formülü nedir?",
    options: ["CO2", "H2O", "NaCl", "O2"],
    answer: 1,
    time: 20,
    style: "kimya"
  },
  {
    category: "Bilim & Teknoloji",
    question: "Işığın boşluktaki saniyedeki yaklaşık hızı ne kadardır?",
    options: ["30.000 km/s", "300.000 km/s", "3.000.000 km/s", "150.000 km/s"],
    answer: 1,
    time: 20,
    style: "fizik"
  },
  {
    category: "Bilim & Teknoloji",
    question: "Yer çekimi kanununu bir elmanın düşüşünden ilham alarak formüle eden bilim insanı kimdir?",
    options: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"],
    answer: 1,
    time: 20,
    style: "fizik"
  },
  {
    category: "Bilim & Teknoloji",
    question: "Alternatif akım (AC) sistemini geliştirerek elektrik dağıtımında devrim yapan mucit kimdir?",
    options: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "James Watt"],
    answer: 1,
    time: 20,
    style: "mucitler"
  },
  {
    category: "Bilim & Teknoloji",
    question: "Telefonu icat eden mucit kimdir?",
    options: ["Alexander Graham Bell", "Samuel Morse", "Guglielmo Marconi", "Alan Turing"],
    answer: 0,
    time: 20,
    style: "mucitler"
  },
  {
    category: "Bilim & Teknoloji",
    question: "Bilgisayarlarda 1 Byte kaç bitten oluşur?",
    options: ["4 Bit", "8 Bit", "16 Bit", "32 Bit"],
    answer: 1,
    time: 20,
    style: "bilgisayar"
  },
  {
    category: "Bilim & Teknoloji",
    question: "Kızıl Gezegen olarak bilinen Dünya'ya en yakın komşu gezegen hangisidir?",
    options: ["Venüs", "Mars", "Merkür", "Jüpiter"],
    answer: 1,
    time: 20,
    style: "astronomi"
  },
  {
    category: "Bilim & Teknoloji",
    question: "Kutup Yıldızı gökyüzünde daima hangi yönü gösterir?",
    options: ["Güney", "Kuzey", "Doğu", "Batı"],
    answer: 1,
    time: 20,
    style: "cografya_astronomi"
  },

  // --- SANAT & SİNEMA ---
  {
    category: "Sanat & Sinema",
    question: "Hababam Sınıfı filmlerinde 'İnek Şaban' karakterini canlandıran efsane komedyen kimdir?",
    options: ["Kemal Sunal", "Şener Şen", "İlyas Salman", "Halit Akçatepe"],
    answer: 0,
    time: 20,
    style: "yesilcam"
  },
  {
    category: "Sanat & Sinema",
    question: "Hababam Sınıfı'nın otoriter ama sevecen müdür muavini 'Kel Mahmut'u kim canlandırmıştır?",
    options: ["Münir Özkul", "Hulusi Kentmen", "Adile Naşit", "Erol Taş"],
    answer: 0,
    time: 20,
    style: "yesilcam"
  },
  {
    category: "Sanat & Sinema",
    question: "Türk sinemasının 'Sultan' lakaplı efsane kadın oyuncusu kimdir?",
    options: ["Fatma Girik", "Hülya Koçyiğit", "Filiz Akın", "Türkan Şoray"],
    answer: 3,
    time: 20,
    style: "yesilcam"
  },
  {
    category: "Sanat & Sinema",
    question: "Kenan İmirzalıoğlu ve Tuncel Kurtiz'in (Ramiz Dayı) başrollerini paylaştığı efsane Türk dizisi hangisidir?",
    options: ["Kurtlar Vadisi", "Ezel", "Kuzey Güney", "İçerde"],
    answer: 1,
    time: 20,
    style: "diziler"
  },
  {
    category: "Sanat & Sinema",
    question: "Necati Şaşmaz'ın 'Polat Alemdar' karakterini canlandırdığı Türk televizyon tarihinin en uzun soluklu aksiyon dizisi hangisidir?",
    options: ["Arka Sokaklar", "Kurtlar Vadisi", "Deli Yürek", "Söz"],
    answer: 1,
    time: 20,
    style: "diziler"
  },
  {
    category: "Sanat & Sinema",
    question: "Leonardo DiCaprio ve Kate Winslet'ın başrollerini paylaştığı 11 Oscar ödüllü batık gemi filmi hangisidir?",
    options: ["Titanik", "Avatar", "Gladyatör", "Yıldızlararası"],
    answer: 0,
    time: 20,
    style: "hollywood"
  },
  {
    category: "Sanat & Sinema",
    question: "Ünlü tablosu 'Mona Lisa' hangi İtalyan Rönesans ressamına aittir?",
    options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
    answer: 1,
    time: 20,
    style: "resim"
  },
  {
    category: "Sanat & Sinema",
    question: "'Kaplumbağa Terbiyecisi' adlı ünlü tablo hangi Türk ressama aittir?",
    options: ["Osman Hamdi Bey", "İbrahim Çallı", "Şeker Ahmet Paşa", "Fikret Mualla"],
    answer: 0,
    time: 20,
    style: "turk_sanati"
  },

  // --- SANAT & EDEBİYAT ---
  {
    category: "Sanat & Edebiyat",
    question: "Kürk Mantolu Madonna ve Kuyucaklı Yusuf romanlarının yazarı kimdir?",
    options: ["Sabahattin Ali", "Ahmet Hamdi Tanpınar", "Peyami Safa", "Orhan Pamuk"],
    answer: 0,
    time: 20,
    style: "turk_edebiyati"
  },
  {
    category: "Sanat & Edebiyat",
    question: "İnce Memed adlı başyapıt roman serisi hangi yazarımıza aittir?",
    options: ["Yaşar Kemal", "Orhan Kemal", "Kemal Tahir", "Fakir Baykurt"],
    answer: 0,
    time: 20,
    style: "turk_edebiyati"
  },
  {
    category: "Sanat & Edebiyat",
    question: "Çalıkuşu romanının yazarı kimdir?",
    options: ["Reşat Nuri Güntekin", "Halide Edib Adıvar", "Yakup Kadri Karaosmanoğlu", "Ömer Seyfettin"],
    answer: 0,
    time: 20,
    style: "turk_edebiyati"
  },
  {
    category: "Sanat & Edebiyat",
    question: "Suç ve Ceza, Karamazov Kardeşler gibi başyapıtların Rus yazarı kimdir?",
    options: ["Tolstoy", "Dostoyevski", "Çehov", "Gogol"],
    answer: 1,
    time: 20,
    style: "dunya_edebiyati"
  },
  {
    category: "Sanat & Edebiyat",
    question: "Sefiller (Les Misérables) romanının ünlü Fransız yazarı kimdir?",
    options: ["Victor Hugo", "Emile Zola", "Alexandre Dumas", "Albert Camus"],
    answer: 0,
    time: 20,
    style: "dunya_edebiyati"
  },
  {
    category: "Sanat & Edebiyat",
    question: "2006 yılında Nobel Edebiyat Ödülü'nü kazanan ilk Türk yazar kimdir?",
    options: ["Orhan Pamuk", "Yaşar Kemal", "Nazım Hikmet", "Ahmet Hamdi Tanpınar"],
    answer: 0,
    time: 20,
    style: "nobel"
  },

  // --- MATEMATİK & MANTIK ---
  {
    category: "Matematik & Mantık",
    question: "En küçük asal sayı kaçtır?",
    options: ["1", "2", "3", "0"],
    answer: 1,
    time: 20,
    style: "sayilar"
  },
  {
    category: "Matematik & Mantık",
    question: "Bir üçgenin iç açıları toplamı kaç derecedir?",
    options: ["90", "180", "270", "360"],
    answer: 1,
    time: 20,
    style: "geometri"
  },
  {
    category: "Matematik & Mantık",
    question: "Bir kenarı 6 cm olan karenin çevresi kaç santimetredir?",
    options: ["12", "18", "24", "36"],
    answer: 2,
    time: 20,
    style: "geometri"
  },
  {
    category: "Matematik & Mantık",
    question: "8 x 9 işleminin sonucu kaçtır?",
    options: ["64", "72", "81", "68"],
    answer: 1,
    time: 20,
    style: "carpim"
  },
  {
    category: "Matematik & Mantık",
    question: "Bir saatte kaç saniye vardır?",
    options: ["600", "1200", "3600", "6000"],
    answer: 2,
    time: 20,
    style: "zaman"
  },
  {
    category: "Matematik & Mantık",
    question: "Hangi sayının karesi 49'dur?",
    options: ["6", "7", "8", "9"],
    answer: 1,
    time: 20,
    style: "sayilar"
  },

  // --- GENEL KÜLTÜR ---
  {
    category: "Genel Kültür",
    question: "Türkiye'nin başkenti neresidir?",
    options: ["İstanbul", "Ankara", "İzmir", "Bursa"],
    answer: 1,
    time: 20,
    style: "turkiye_cografyasi"
  },
  {
    category: "Genel Kültür",
    question: "Türkiye'nin yüz ölçümü bakımından en büyük gölü hangisidir?",
    options: ["Tuz Gölü", "Van Gölü", "Beyşehir Gölü", "Eğirdir Gölü"],
    answer: 1,
    time: 20,
    style: "turkiye_cografyasi"
  },
  {
    category: "Genel Kültür",
    question: "Türkiye'nin en yüksek dağı hangisidir?",
    options: ["Erciyes Dağı", "Ağrı Dağı", "Süphan Dağı", "Kaçkar Dağı"],
    answer: 1,
    time: 20,
    style: "turkiye_cografyasi"
  },
  {
    category: "Genel Kültür",
    question: "Fransa'nın başkenti neresidir?",
    options: ["Lyon", "Marsilya", "Paris", "Nice"],
    answer: 2,
    time: 20,
    style: "baskentler"
  },
  {
    category: "Genel Kültür",
    question: "Dünyanın en kalabalık kıtası hangisidir?",
    options: ["Avrupa", "Afrika", "Asya", "Amerika"],
    answer: 2,
    time: 20,
    style: "dunya_cografyasi"
  },
  {
    category: "Genel Kültür",
    question: "Pusulada 'E' harfi hangi yönü temsil eder?",
    options: ["Kuzey", "Güney", "Doğu (East)", "Batı (West)"],
    answer: 2,
    time: 20,
    style: "genel_bilgi"
  },
  {
    category: "Genel Kültür",
    question: "Japonya'nın para birimi nedir?",
    options: ["Yuan", "Won", "Yen", "Dolar"],
    answer: 2,
    time: 20,
    style: "para_birimleri"
  },
  {
    category: "Genel Kültür",
    question: "Peri Bacaları ile ünlü tarihi ve turistik bölgemiz neresidir?",
    options: ["Pamukkale", "Kapadokya", "Efes", "Nemrut"],
    answer: 1,
    time: 20,
    style: "turizm"
  },

  // --- ÇOCUK DÜNYASI & ÇİZGİ FİLM ---
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "TRT Çocuk'un sevilen çizgi filmi Rafadan Tayfa'da mahallenin en bilmiş ve gözlüklü çocuğu kimdir?",
    options: ["Mert", "Hayri", "Kamil", "Akın"],
    answer: 3,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Rafadan Tayfa'da sürekli baklava ve köfte düşünen obur karakter kimdir?",
    options: ["Hayri", "Kamil", "Mert", "Basri Amca"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Kral Şakir'in en yakın arkadaşı olan mor renkli sevimli filin adı nedir?",
    options: ["Necati", "Remzi", "Canan", "Kadriye"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Kral Şakir çizgi filminde Şakir ve babası Remzi hangi hayvandır?",
    options: ["Aslan", "Fil", "Kedi", "Köpek"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Bal kaymak yemeyi çok seven, kel kafasıyla meşhur geleneksel Türk masal kahramanı kimdir?",
    options: ["Nasreddin Hoca", "Keloğlan", "Karagöz", "Hacivat"],
    answer: 1,
    time: 20,
    style: "masal",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Ormanlar kralı olarak bilinen yeleli güçlü hayvan hangisidir?",
    options: ["Kaplan", "Aslan", "Ayı", "Kurt"],
    answer: 1,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Uçabilen tek memeli hayvan hangisidir?",
    options: ["Yarasa", "Karga", "Kartal", "Uçan Sincap"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Kırmızı peleriniyle uçan ve göğsünde 'S' harfi olan çizgi roman kahramanı kimdir?",
    options: ["Batman", "Superman", "Iron Man", "Kaptan Amerika"],
    answer: 1,
    time: 20,
    style: "super_kahraman",
    isKids: true
  },

  // --- VIP: ÇOCUK BİLİM & ZEKA ---
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Kocaman dişleriyle ünlü, 'Kertenkele Kralı' anlamına gelen en ünlü etobur dinozor hangisidir?",
    options: ["Tyrannosaurus Rex (T-Rex)", "Triceratops", "Brachiosaurus", "Stegosaurus"],
    answer: 0,
    time: 20,
    style: "dinozorlar",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Geceleri gökyüzünde Dünya'mızın etrafında dönen tek doğal uydumuz nedir?",
    options: ["Güneş", "Ay", "Mars", "Kutup Yıldızı"],
    answer: 1,
    time: 20,
    style: "uzay",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Karnında kesesi olan ve yavrularını zıplayarak taşıyan Avustralyalı sevimli hayvan hangisidir?",
    options: ["Kanguru", "Koala", "Panda", "Penguen"],
    answer: 0,
    time: 20,
    style: "doga",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Gökkuşağında toplam kaç farklı renk bulunur?",
    options: ["5", "6", "7", "8"],
    answer: 2,
    time: 20,
    style: "bilim",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Bilmecemiz: Uzaktan baktım bir taş, yanına vardım dört ayak bir baş. Bu nedir?",
    options: ["Kaplumbağa", "Kirpi", "Kedi", "Tavşan"],
    answer: 0,
    time: 20,
    style: "bilmece",
    isKids: true
  }
];

let addedCount = 0;
newQuestionPacks.forEach(q => {
  const key = (q.question || '').trim().toLowerCase();
  if (!existingQuestionsMap.has(key)) {
    existingQuestionsMap.set(key, q);
    addedCount++;
  }
});

const merged = Array.from(existingQuestionsMap.values());
fs.writeFileSync(questionsFile, JSON.stringify(merged, null, 2), 'utf8');

console.log('Başarıyla güncellendi!');
console.log('Eklenen yeni soru sayısı:', addedCount);
console.log('Toplam güncel soru havuzu:', merged.length);
