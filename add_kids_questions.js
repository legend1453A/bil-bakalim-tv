const fs = require('fs');
const path = require('path');

const questionsFile = path.join(__dirname, 'questions.json');
let questions = JSON.parse(fs.readFileSync(questionsFile, 'utf8'));

// Mark existing kids questions with isKids: true
questions.forEach(q => {
  if (q.category && (q.category.includes('Çocuk') || q.category.includes('Cocuk'))) {
    q.isKids = true;
  }
});

const newKidsQuestions = [
  // ÇİZGİ FİLM & ANİMASYON
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Kral Şakir çizgi dizisinde Şakir'in en yakın arkadaşı olan mor renkli sevimli filin adı nedir?",
    options: ["Necati", "Remzi", "Canan", "Tanju"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Rafadan Tayfa çizgi filminde mahallenin en zeki ve mucit çocuğu kimdir?",
    options: ["Hayri", "Mert", "Akın", "Kamil"],
    answer: 2,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Rafadan Tayfa'da sürekli baklava, köfte ve yemek düşünen şişman karakter kimdir?",
    options: ["Hayri", "Kamil", "Mert", "Basri Amca"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Buzlar Ülkesi (Frozen) filminde şarkı söyleyen ve 'Bırak ve Yaşasın (Let it go)' şarkısını seslendiren kraliçe kimdir?",
    options: ["Elsa", "Anna", "Rapunzel", "Moana"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Karlar Ülkesi (Frozen) animasyonundaki havuç burunlu sevimli kardan adamın adı nedir?",
    options: ["Olaf", "Sven", "Kristoff", "Baloo"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "SüngerBob KareŞort nerede yaşar?",
    options: ["Bikini Kasabası'nda bir ananas evde", "Kutup ayılarının buz dağında", "Gökdelende", "Çölde bir çadırda"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "SüngerBob'un en yakın arkadaşı olan pembe deniz yıldızının adı nedir?",
    options: ["Patrick", "Squidward", "Bay Yengeç", "Gary"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Şirinler köyünde kırmızı şapka ve beyaz sakalıyla köyün lideri olan karakter kimdir?",
    options: ["Şirin Baba", "Gözlüklü Şirin", "Tembel Şirin", "Usta Şirin"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Şirinler'i yakalamaya çalışan kötü kalpli büyücü ve kedisinin adı nedir?",
    options: ["Gargamel ve Azman", "Voldemort ve Nagini", "Jafar ve Iago", "Kötü Kraliçe"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Oyuncak Hikayesi (Toy Story) animasyonunda 'Sonsuzluğa ve ötesine!' diyen uzay korucusu oyuncağın adı nedir?",
    options: ["Buzz Lightyear", "Sheriff Woody", "Rex", "Bay Patates Kafa"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Kayıp Balık Nemo hangi türde sevimli bir balıktır?",
    options: ["Palyaço Balığı", "Köpekbalığı", "Yunus", "Japon Balığı"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Aslan Kral (The Lion King) filmindeki yavru aslanın adı nedir?",
    options: ["Simba", "Mufasa", "Scar", "Timon"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Kral Şakir'in babası olan aslan karakterin adı nedir?",
    options: ["Remzi", "Necati", "Kadir", "Tamer"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Kaptan Tsubasa çizgi filminde Tsubasa Ozora hangi sporu oynamaktadır?",
    options: ["Futbol", "Basketbol", "Yüzme", "Voleybol"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Pokemon animesinde elektrik fırlatan sarı renkli sevimli yaratığın adı nedir?",
    options: ["Pikachu", "Charmander", "Squirtle", "Bulbasaur"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Pikachu'nun sahibi olan ana karakter çocuk kimdir?",
    options: ["Ash Ketchum", "Brock", "Gary", "James"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Tom ve Jerry çizgi filminde Jerry hangi hayvandır?",
    options: ["Küçük kurnaz bir fare", "Büyük gri bir kedi", "Bulldog köpeği", "Ördek"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Kung Fu Panda filmindeki panda Po'nun en sevdiği yiyecek nedir?",
    options: ["Mantı (Bao / Noodle)", "Pizza", "Havuç", "Çikolata"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  },

  // HAYVANLAR ALEMİ (ÇOCUKLAR İÇİN EĞLENCELİ)
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Dünyanın karada en hızlı koşan hayvanı hangisidir?",
    options: ["Çita", "Aslan", "Tavşan", "At"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Dünyanın en uzun boylu hayvanı hangisidir?",
    options: ["Zürafa", "Fil", "Devekuşu", "Kanguru"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Bulunduğu ortama göre renk değiştirebilen sürüngen hayvan hangisidir?",
    options: ["Bukalemun", "Kertenkele", "Timsah", "Kaplumbağa"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Karnındaki kesesinde yavrusunu taşıyan ve zıplayarak ilerleyen hayvan hangisidir?",
    options: ["Kanguru", "Koala", "Maymun", "Ayı"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Kutup bölgelerinde yaşayan, siyah-beyaz renkli, uçamayan ama usta bir yüzücü olan kuş hangisidir?",
    options: ["Penguen", "Martı", "Pelikan", "Papağan"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Çöllerde susuzluğa günlerce dayanabilen ve sırtında hörgücü olan hayvan hangisidir?",
    options: ["Deve", "At", "Eşek", "Ceylan"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Bal yapan çalışkan böcek hangisidir?",
    options: ["Bal Arısı", "Karasinek", "Uğur Böceği", "Kelebek"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Tırtıl kozasından çıktıktan sonra hangi güzel hayvana dönüşür?",
    options: ["Kelebek", "Arı", "Kuş", "Karınca"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Denizlerde yaşayan ve kafasındaki delikten su püskürten devasa memeli canlı hangisidir?",
    options: ["Mavi Balina", "Köpekbalığı", "Ahtapot", "Vatoz"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Sekiz tane kolu (dokunacı) olan ve tehlike anında mürekkep püskürten deniz canlısı hangisidir?",
    options: ["Ahtapot", "Yengeç", "Denizanası", "Istakoz"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Geceleri uyanık olan, kafasını neredeyse tam tur döndürebilen ve çok iyi gören kuş hangisidir?",
    options: ["Baykuş", "Kartal", "Şahin", "Güvercin"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Sadece okaliptüs yaprakları yiyen ve ağaçlarda uyuklayan Avustralyalı sevimli hayvan hangisidir?",
    options: ["Koala", "Panda", "Tembel Hayvan", "Sincap"],
    answer: 0,
    time: 20,
    style: "hayvanlar",
    isKids: true
  },

  // MASALLAR & HİKAYELER
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Saat gece 12'yi vurunca bal kabağı arabası kaybolan ve camdan ayakkabısını düşüren prenses kimdir?",
    options: ["Külkedisi (Cinderella)", "Pamuk Prenses", "Rapunzel", "Ariel"],
    answer: 0,
    time: 20,
    style: "masal",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Çok yüksek bir kuleye hapsedilen ve upuzun altın sarısı saçları olan masal prensesi kimdir?",
    options: ["Rapunzel", "Külkedisi", "Uyuyan Güzel", "Deniz Kızı"],
    answer: 0,
    time: 20,
    style: "masal",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Yedi cücelerle birlikte ormanda yaşayan ve zehirli elmayı ısıran prenses kimdir?",
    options: ["Pamuk Prenses", "Kırmızı Başlıklı Kız", "Külkedisi", "Bebek Ayı"],
    answer: 0,
    time: 20,
    style: "masal",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Büyülü lambayı ovuşturunca içinden dilekleri yerine getiren bir cin çıkan masal kahramanı kimdir?",
    options: ["Alaaddin", "Sinbad", "Ali Baba", "Keloğlan"],
    answer: 0,
    time: 20,
    style: "masal",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Türk masallarında kel kafası, aklı ve kurnazlığıyla padişahın kızını alan kahraman kimdir?",
    options: ["Keloğlan", "Nasreddin Hoca", "Dede Korkut", "Karagöz"],
    answer: 0,
    time: 20,
    style: "masal",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Eşeğe ters binen ve göle maya çalıp 'Ya tutarsa' diyen mizah ustası Türk bilgini kimdir?",
    options: ["Nasreddin Hoca", "Keloğlan", "Hacivat", "Evliya Çelebi"],
    answer: 0,
    time: 20,
    style: "masal",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Üç küçük domuzcuk masalında domuzcukların evini üfleyerek yıkmaya çalışan hayvan hangisidir?",
    options: ["Kötü Kurt", "Ayı", "Aslan", "Tilki"],
    answer: 0,
    time: 20,
    style: "masal",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Bremen Mızıkacıları masalındaki 4 hayvan hangileridir?",
    options: ["Eşek, Köpek, Kedi ve Horoz", "Aslan, Kaplan, Ayı ve Kurt", "At, İnek, Koyun ve Keçi", "Fil, Zürafa, Maymun ve Papağan"],
    answer: 0,
    time: 20,
    style: "masal",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Ormanda yolunu kaybedip cadının kurabiyeden ve şekerden yapılmış evine düşen kardeşler kimlerdir?",
    options: ["Hansel ve Gretel", "Tom ve Jerry", "Akın ve Mert", "Kamil ve Hayri"],
    answer: 0,
    time: 20,
    style: "masal",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Hiç büyümeyen ve 'Varolmayan Ülke'de (Neverland) yaşayan uçan çocuk kimdir?",
    options: ["Peter Pan", "Pinokyo", "Robin Hood", "Mowgli"],
    answer: 0,
    time: 20,
    style: "masal",
    isKids: true
  },

  // EĞLENCELİ OKUL & TEMEL ÇOCUK BİLGİLERİ
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Gökkuşağında kaç renk vardır?",
    options: ["7", "5", "10", "12"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Türkiye Cumhuriyeti'nin kurucusu Gazi Mustafa Kemal Atatürk nerede doğmuştur?",
    options: ["Selanik", "Ankara", "İstanbul", "İzmir"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Türkiye'nin başkenti hangi ilimizdir?",
    options: ["Ankara", "İstanbul", "İzmir", "Bursa"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Bir yılda kaç mevsim vardır?",
    options: ["4", "12", "7", "2"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Bir haftada kaç gün vardır?",
    options: ["7", "5", "6", "8"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Gündüzleri gökyüzümüzü aydınlatan ve dünyamızı ısıtan dev ateş topu gök cismi hangisidir?",
    options: ["Güneş", "Ay", "Mars", "Kutup Yıldızı"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Dünyamızın uydusu olan ve geceleri parlayan gök cismi hangisidir?",
    options: ["Ay", "Güneş", "Kuyruklu Yıldız", "Jüpiter"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Bitkilerin yeşil kalmasını sağlayan ve büyümesi için topraktan aldıkları temel sıvı nedir?",
    options: ["Su", "Meyve Suyu", "Süt", "Zeytinyağı"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "İnsan vücudunda kanı bütün vücuda pompalayan hayati organımız hangisidir?",
    options: ["Kalp", "Mide", "Akciğer", "Karaciğer"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Trafik ışıklarında 'DUR' anlamına gelen renk hangisidir?",
    options: ["Kırmızı", "Sarı", "Yeşil", "Mavi"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Trafik lambasında 'GEÇ' anlamına gelen ışık hangi renktir?",
    options: ["Yeşil", "Kırmızı", "Turuncu", "Mor"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },
  {
    category: "Çocuk Dünyası & Çizgi Film",
    question: "Okulda yazı tahtasını silmek için ne kullanılır?",
    options: ["Tahta Silgisi", "Kalemtıraş", "Cetvel", "Pergel"],
    answer: 0,
    time: 20,
    style: "okul_bilgi",
    isKids: true
  },

  // VIP: ÇOCUK BİLİM & ZEKA (DİNOZORLAR, UZAY, BİLMECELER, OYUNLAR)
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Dinozorlar kralı olarak bilinen, devasa çenesi ve minik kollarıyla ünlü etobur dinozor hangisidir?",
    options: ["Tyrannosaurus Rex (T-Rex)", "Triceratops", "Brachiosaurus", "Stegosaurus"],
    answer: 0,
    time: 20,
    style: "dinozorlar",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Uzun boynu sayesinde devasa ağaçların en tepesindeki yaprakları yiyebilen otobur dev dinozor hangisidir?",
    options: ["Brachiosaurus", "Velociraptor", "T-Rex", "Spinosaurus"],
    answer: 0,
    time: 20,
    style: "dinozorlar",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Başında 3 boynuzu ve kalkan gibi geniş bir yakalığı olan ünlü otobur dinozor hangisidir?",
    options: ["Triceratops", "Ankylosaurus", "Pterodaktil", "T-Rex"],
    answer: 0,
    time: 20,
    style: "dinozorlar",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Dinozorlar çağında gökyüzünde kanat çırparak uçan dev sürüngenin adı nedir?",
    options: ["Pterodaktil (Pterozor)", "Megalodon", "Mamut", "Kılıç Dişli Kaplan"],
    answer: 0,
    time: 20,
    style: "dinozorlar",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Güneş Sistemi'ndeki en büyük gezegen hangisidir?",
    options: ["Jüpiter", "Dünya", "Mars", "Plüton"],
    answer: 0,
    time: 20,
    style: "uzay_bilim",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Yüzeyindeki paslı tozlar nedeniyle 'Kızıl Gezegen' olarak adlandırılan gezegen hangisidir?",
    options: ["Mars", "Venüs", "Merkür", "Neptün"],
    answer: 0,
    time: 20,
    style: "uzay_bilim",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Göz alıcı devasa buz ve kaya halkalarıyla ünlü gezegen hangisidir?",
    options: ["Satürn", "Mars", "Venüs", "Merkür"],
    answer: 0,
    time: 20,
    style: "uzay_bilim",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Uzaya gidip Ay'a ilk ayak basan astronot kimdir?",
    options: ["Neil Armstrong", "Yuri Gagarin", "Elon Musk", "Buzz Aldrin"],
    answer: 0,
    time: 20,
    style: "uzay_bilim",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Türkiye'nin uzaya giden ilk astronotu kimdir?",
    options: ["Alper Gezeravcı", "Barış Manço", "Aziz Sancar", "Selçuk Bayraktar"],
    answer: 0,
    time: 20,
    style: "uzay_bilim",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Yerçekimini kafasına düşen elma sayesinde keşfeden ünlü bilim insanı kimdir?",
    options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla", "Thomas Edison"],
    answer: 0,
    time: 20,
    style: "bilim_mucit",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Evlerimizi aydınlatan elektrik ampulünü geliştiren mucit kimdir?",
    options: ["Thomas Edison", "Alexander Graham Bell", "Galileo", "Wright Kardeşler"],
    answer: 0,
    time: 20,
    style: "bilim_mucit",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "İlk telefonu icat eden ve alo kelimesinin çıkmasına vesile olan mucit kimdir?",
    options: ["Alexander Graham Bell", "Steve Jobs", "Samuel Morse", "Tesla"],
    answer: 0,
    time: 20,
    style: "bilim_mucit",
    isKids: true
  },

  // EĞLENCELİ ÇOCUK BİLMECELERİ
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "BİLMECE: 'Uzaktan baktım bir taş, yanına gittim dört ayak bir baş.' Bu nedir?",
    options: ["Kaplumbağa", "Kirpi", "Salyangoz", "Taş bebek"],
    answer: 0,
    time: 20,
    style: "bilmece",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "BİLMECE: 'Kanadı var kuş değil, burnu var fil değil, havada uçar uçak değil.' Bu nedir?",
    options: ["Kelebek (veya Yarasa)", "Helikopter", "Balon", "Uçurtma"],
    answer: 0,
    time: 20,
    style: "bilmece",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "BİLMECE: 'Pazardan aldım bir tane, eve geldim bin tane.' Bu meyve nedir?",
    options: ["Nar", "Karpuz", "Elma", "Portakal"],
    answer: 0,
    time: 20,
    style: "bilmece",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "BİLMECE: 'Ben giderim o gider, arkamdan tık tık eder.' Bu nedir?",
    options: ["Baston", "Ayakkabı", "Gölge", "Tekerlek"],
    answer: 0,
    time: 20,
    style: "bilmece",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "BİLMECE: 'Güneş görünce erir, soğuk gelince giyinir.' Bu nedir?",
    options: ["Kardan Adam", "Dondurma", "Mum", "Tereyağı"],
    answer: 0,
    time: 20,
    style: "bilmece",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "BİLMECE: 'Daldan dala atlarım, kuyruğumla sarkarım, muzu pek çok severim.' Bu sevimli hayvan kimdir?",
    options: ["Maymun", "Sincap", "Kedi", "Panda"],
    answer: 0,
    time: 20,
    style: "bilmece",
    isKids: true
  },

  // ÇOCUK OYUN DÜNYASI (MINECRAFT, LEGO, ROBLOX, SATRANÇ)
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Minecraft oyununda elmas ve obsidyen gibi sert blokları kırmak için en az hangi kazma gerekir?",
    options: ["Demir Kazma", "Taş Kazma", "Tahta Kazma", "Altın Kazma"],
    answer: 0,
    time: 20,
    style: "oyun_dunyasi",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Minecraft oyununda oyuncunun yanına yaklaşıp 'tıssss' sesi çıkararak patlayan yeşil yaratık kimdir?",
    options: ["Creeper", "Zombi", "İskelet", "Enderman"],
    answer: 0,
    time: 20,
    style: "oyun_dunyasi",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Renkli plastik parçaları üst üste takarak evler, arabalar ve kaleler inşa edilen dünyaca ünlü oyuncak markası hangisidir?",
    options: ["LEGO", "Hot Wheels", "Barbie", "Play-Doh"],
    answer: 0,
    time: 20,
    style: "oyun_dunyasi",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Satranç oyununda diğer taşların üzerinden atlayabilen ve 'L' şeklinde hareket eden taş hangisidir?",
    options: ["At", "Fil", "Kale", "Vezir"],
    answer: 0,
    time: 20,
    style: "oyun_dunyasi",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Satranç oyununun en güçlü ve her yöne istediği kadar gidebilen taşı hangisidir?",
    options: ["Vezir", "Şah", "Kale", "Piyon"],
    answer: 0,
    time: 20,
    style: "oyun_dunyasi",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Mario oyununda Süper Mario bir mantar yediğinde ona ne olur?",
    options: ["Büyür ve güçlenir", "Küçülür", "Uçar", "Hızı azalır"],
    answer: 0,
    time: 20,
    style: "oyun_dunyasi",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Süper Mario'nun yeşil kıyafetli kardeşi olan karakter kimdir?",
    options: ["Luigi", "Wario", "Bowser", "Yoshi"],
    answer: 0,
    time: 20,
    style: "oyun_dunyasi",
    isKids: true
  },
  {
    category: "VIP: Çocuk Bilim & Zeka",
    question: "Rubik Küpü'nün (Zeka Küpü) kaç farklı yüzü vardır?",
    options: ["6", "4", "8", "12"],
    answer: 0,
    time: 20,
    style: "zeka",
    isKids: true
  }
];

// Add procedural generator for more kids questions to ensure large pool
const cizgiFilmList = [
  { name: "Kral Şakir", hero: "Şakir", pet: "Fil Necati", channel: "Cartoon Network" },
  { name: "Rafadan Tayfa", hero: "Akın", pet: "Yumak", channel: "TRT Çocuk" },
  { name: "Niloya", hero: "Niloya", pet: "Tospik (kaplumbağa)", channel: "TRT Çocuk" },
  { name: "Kaptan Pengu ve Arkadaşları", hero: "Kaptan Pengu", pet: "Mandalina", channel: "TRT Çocuk" },
  { name: "Maysa ve Bulut", hero: "Maysa", pet: "Çoban köpeği", channel: "TRT Çocuk" },
  { name: "İbi ile Tosi", hero: "İbi", pet: "Tosi", channel: "TRT Çocuk" },
  { name: "Aslan", hero: "Aslan", pet: "Uçan helikopter", channel: "TRT Çocuk" },
  { name: "Ege ile Gaga", hero: "Ege", pet: "Karga Gaga", channel: "TRT Çocuk" }
];

cizgiFilmList.forEach(item => {
  newKidsQuestions.push({
    category: "Çocuk Dünyası & Çizgi Film",
    question: `${item.name} çizgi dizisinde kahramanın sevimli dostu/yoldaşı kimdir?`,
    options: [item.pet, "Gargamel", "Daffy Duck", "Şirin Baba"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  });
  newKidsQuestions.push({
    category: "Çocuk Dünyası & Çizgi Film",
    question: `${item.name} çizgi filminin başrolündeki meraklı kahramanın adı nedir?`,
    options: [item.hero, "Keloğlan", "SüngerBob", "Pinokyo"],
    answer: 0,
    time: 20,
    style: "cizgi_film",
    isKids: true
  });
});

// Bilim & Zeka procedurals
const planetList = [
  { planet: "Merkür", fact: "Güneş'e en yakın gezegendir" },
  { planet: "Venüs", fact: "Güneş Sistemi'nin en sıcak ve parlak gezegenidir" },
  { planet: "Dünya", fact: "Üzerinde yaşam olduğu bilinen tek gezegendir" },
  { planet: "Mars", fact: "Yüzeyi kızıl renkli olan gezegendir" },
  { planet: "Jüpiter", fact: "Güneş Sistemi'ndeki en büyük gaz devi gezegendir" },
  { planet: "Satürn", fact: "Görkemli halkalarıyla ünlü olan gezegendir" },
  { planet: "Uranüs", fact: "Güneş'in etrafında yan yatmış bir varil gibi dönen buz devidir" },
  { planet: "Neptün", fact: "Güneş'e en uzak, masmavi rüzgarlı gezegendir" }
];

planetList.forEach(p => {
  newKidsQuestions.push({
    category: "VIP: Çocuk Bilim & Zeka",
    question: `Güneş Sistemi'nde "${p.fact}" olan gezegen hangisidir?`,
    options: [p.planet, "Ay", "Güneş", "Plüton"].sort(() => 0.5 - Math.random()),
    answer: -1, // will set below
    time: 20,
    style: "uzay_bilim",
    isKids: true
  });
  // correct answer index
  const lastQ = newKidsQuestions[newKidsQuestions.length - 1];
  lastQ.answer = lastQ.options.indexOf(p.planet);
});

// Fun Math & Logic puzzles for kids 7-12
for (let i = 2; i <= 9; i++) {
  const ans = i * i;
  newKidsQuestions.push({
    category: "VIP: Çocuk Bilim & Zeka",
    question: `EĞLENCELİ MATEMATİK: Bir sepette ${i} kutu ve her kutunun içinde ${i} elma varsa toplam kaç elma vardır? (${i} x ${i})`,
    options: [ans.toString(), (ans + i).toString(), (ans - 2).toString(), (ans + 4).toString()],
    answer: 0,
    time: 20,
    style: "matematik_zeka",
    isKids: true
  });
}

// Add all new questions ensuring no duplicates
const existingQuestionsSet = new Set(questions.map(q => q.question.trim().toLowerCase()));
let addedCount = 0;

newKidsQuestions.forEach(q => {
  const key = q.question.trim().toLowerCase();
  if (!existingQuestionsSet.has(key)) {
    existingQuestionsSet.add(key);
    questions.push(q);
    addedCount++;
  }
});

fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2), 'utf8');
console.log(`Başarıyla ${addedCount} yeni çocuk sorusu eklendi! Toplam soru sayısı: ${questions.length}`);
