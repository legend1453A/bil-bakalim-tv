import json
import random

random.seed(42)

def make_q(category, q_text, correct, wrongs, time=20, style="general"):
    # Şıkları karıştır
    opts = [correct] + list(wrongs[:3])
    random.shuffle(opts)
    return {
        "category": category,
        "question": q_text,
        "options": opts,
        "answer": opts.index(correct),
        "time": time,
        "style": style
    }

all_questions = []

# ==============================================================================
# 1. TARİH KATEGORİSİ (Çok çeşitli stiller: Olaylar, Kişiler, Antlaşmalar, İlkler, Mimari, Dünya Tarihi)
# ==============================================================================
tarih_ozel = [
    ("Osmanlı Devleti'nin kurucusu Osman Gazi'nin babası kimdir?", "Ertuğrul Gazi", ["Gündüz Alp", "Süleyman Şah", "Orhan Gazi"], "kisiler"),
    ("İstanbul'un Fethi sırasında Bizans'ın Haliç'e çektiği zinciri aşmak için gemileri karadan yürüten padişah kimdir?", "Fatih Sultan Mehmet", ["Yavuz Sultan Selim", "II. Murad", "Kanuni Sultan Süleyman"], "kisiler"),
    ("Osmanlı Devleti'nde ilk kez kağıt para (Kaime) hangi padişah döneminde basılmıştır?", "Sultan Abdülmecid", ["II. Mahmud", "II. Abdülhamid", "Sultan Abdülaziz"], "ilkler"),
    ("Kurtuluş Savaşı'nda 'Hattı müdafaa yoktur, sathı müdafaa vardır' sözü hangi savaşta söylenmiştir?", "Sakarya Meydan Muharebesi", ["Büyük Taarruz", "I. İnönü Muharebesi", "Kütahya-Eskişehir Savaşları"], "sozler"),
    ("Mustafa Kemal Atatürk'e 'Mareşal' rütbesi ve 'Gazi' unvanı hangi zaferden sonra verilmiştir?", "Sakarya Meydan Muharebesi", ["Çanakkale Zaferi", "Büyük Taarruz", "II. İnönü Zaferi"], "unvanlar"),
    ("Türkiye Cumhuriyeti'nin ilk Başbakanı kimdir?", "İsmet İnönü", ["Celal Bayar", "Fethi Okyar", "Kazım Karabekir"], "cumhuriyet"),
    ("Türkiye Büyük Millet Meclisi'nin ilk başkanı kimdir?", "Mustafa Kemal Atatürk", ["İsmet İnönü", "Fevzi Çakmak", "Ali Fuat Cebesoy"], "cumhuriyet"),
    ("Anadolu kapılarının Türklere açıldığı 1071 Malazgirt Zaferi'nin komutanı kimdir?", "Sultan Alparslan", ["Tuğrul Bey", "Melikşah", "Kılıçarslan"], "komutanlar"),
    ("Mısır'ı fethederek Kutsal Emanetleri İstanbul'a getiren Osmanlı padişahı kimdir?", "Yavuz Sultan Selim", ["Kanuni Sultan Süleyman", "Fatih Sultan Mehmet", "IV. Murad"], "kisiler"),
    ("46 yıl ile Osmanlı tahtında en uzun süre kalan padişah kimdir?", "Kanuni Sultan Süleyman", ["IV. Mehmed", "II. Abdülhamid", "Fatih Sultan Mehmet"], "rekorlar"),
    ("Preveze Deniz Zaferi'nin kahramanı olan ünlü Osmanlı Kaptan-ı Deryası kimdir?", "Barbaros Hayreddin Paşa", ["Turgut Reis", "Piri Reis", "Kılıç Ali Paşa"], "denizcilik"),
    ("Hint Deniz Seferleri'ne katılan ve 'Mir'atü'l-Memalik' (Ülkelerin Aynası) eserini yazan denizcimiz kimdir?", "Seydi Ali Reis", ["Piri Reis", "Murat Reis", "Kemal Reis"], "denizcilik"),
    ("Osmanlı Devleti'nde ilk düzenli ordu olan 'Yaya ve Müsellem' hangi padişah zamanında kurulmuştur?", "Orhan Gazi", ["Osman Gazi", "I. Murad", "Yıldırım Bayezid"], "askeri"),
    ("Topkapı Sarayı'ndan sonra Osmanlı hanedanının ana ikametgahı olan boğaz kıyısındaki saray hangisidir?", "Dolmabahçe Sarayı", ["Yıldız Sarayı", "Çırağan Sarayı", "Beylerbeyi Sarayı"], "mimari"),
    ("Ağrı'nın Doğubayazıt ilçesinde bulunan ve merkezi ısıtma sistemine sahip tarihi Osmanlı sarayı hangisidir?", "İshak Paşa Sarayı", ["Topkapı Sarayı", "Edirne Sarayı", "Yıldız Sarayı"], "mimari"),
    ("Tarihte bilinen ilk yazılı kanunları hazırlayan Sümer kralı kimdir?", "Urgakina", ["Hammurabi", "Gılgamış", "Sargon"], "antik"),
    ("Anadolu'da kurulan ve başkentleri Tuşpa (Van) olan, taş işçiliği ve sulama kanallarıyla ünlü uygarlık hangisidir?", "Urartular", ["Frigler", "Lidyalılar", "İyonlar"], "antik"),
    ("Çivi yazısını icat ederek tarihi çağları başlatan Mezopotamya uygarlığı hangisidir?", "Sümerler", ["Babilliler", "Asurlular", "Elamlar"], "antik"),
    ("Anadolu'ya yazıyı ilk kez getiren ve Kültepe tabletleriyle bilinen Mezopotamya tüccar kavmi hangisidir?", "Asurlular", ["Sümerler", "Fenikeliler", "Hititler"], "antik"),
    ("Bugünkü Latin alfabesinin temeli olan ilk alfabeyi geliştiren denizci uygarlık hangisidir?", "Fenikeliler", ["İyonlar", "Yunanlılar", "Mısırlılar"], "antik"),
    ("Orhun Yazıtları (Göktürk Kitabeleri) günümüzde hangi ülkenin sınırları içerisinde yer almaktadır?", "Moğolistan", ["Kazakistan", "Kırgızistan", "Özbekistan"], "turk_tarihi"),
    ("Orhun Abideleri hangi üç devlet adamı adına dikilmiştir?", "Bilge Kağan, Kültigin ve Vezir Tonyukuk", ["Bumin Kağan, İstemi Yabgu, Mukan Kağan", "Mete Han, Teoman, Kiok", "Kutluk Kağan, Kapgan Kağan, Tonyukuk"], "turk_tarihi"),
    ("Kudüs'ü Haçlılardan geri alan Eyyubi Devleti'nin kurucusu büyük komutan kimdir?", "Selahaddin Eyyubi", ["Nureddin Zengi", "Sultan Baybars", "Kılıçarslan"], "islam_tarihi"),
    ("Moğol İmparatorluğu'nu 1260 Ayn Calut Savaşı'nda durduran Türk-İslam devleti hangisidir?", "Memlükler", ["Büyük Selçuklular", "Harzemşahlar", "Eyyubiler"], "savaslar"),
    ("Avrupa'da yaklaşık 1337-1453 yılları arasında süren Yüzyıl Savaşları hangi iki ülke arasında yaşanmıştır?", "İngiltere ve Fransa", ["Almanya ve Fransa", "İspanya ve İngiltere", "İtalya ve Avusturya"], "dunya_tarihi"),
    ("Magna Carta (Büyük Özgürlük Fermanı) 1215 yılında hangi ülkede imzalanmıştır?", "İngiltere", ["Fransa", "İtalya", "Almanya"], "dunya_tarihi"),
    ("Rönesans hareketi 15. yüzyılda ilk olarak hangi Avrupa ülkesinde başlamıştır?", "İtalya", ["Fransa", "İngiltere", "Almanya"], "dunya_tarihi"),
    ("Reform hareketini Almanya'da Wittenberg Kilisesi'ne 95 tezini asarak başlatan din adamı kimdir?", "Martin Luther", ["Jean Calvin", "Erasmus", "Thomas More"], "dunya_tarihi"),
    ("Ümit Burnu'nu keşfederek Hindistan'a deniz yoluyla ulaşan Portekizli kaşif kimdir?", "Vasco da Gama", ["Kristof Kolomb", "Ferdinand Macellan", "Amerigo Vespucci"], "kesifler"),
    ("Dünyanın çevresini gemiyle dolaşma seferini başlatan ve Dünyanın yuvarlak olduğunu kanıtlayan denizci kimdir?", "Ferdinand Macellan", ["James Cook", "Marco Polo", "Vasco da Gama"], "kesifler"),
    ("Çanakkale Savaşı'nda 276 kiloluk top mermisini sırtlayarak savaşın seyrini değiştiren kahramanımız kimdir?", "Seyit Onbaşı", ["Yahya Çavuş", "Hasan Tahsin", "Şahin Bey"], "kahramanlar"),
    ("İzmir'in işgalinde düşmana ilk kurşunu sıkarak milli direnişi başlatan gazeteci kimdir?", "Hasan Tahsin (Osman Nevres)", ["Sütçü İmam", "Şahin Bey", "Yörük Ali Efe"], "kahramanlar"),
    ("Kurtuluş Savaşı'nda Doğu Cephesi komutanı olan ve yetim çocuklara babalık yapan paşamız kimdir?", "Kazım Karabekir", ["Ali Fuat Cebesoy", "Refet Bele", "İsmet İnönü"], "komutanlar"),
    ("Türkiye'de kadınlara milletvekili seçme ve seçilme hakkı hangi yılda verilmiştir?", "1934", ["1926", "1930", "1938"], "cumhuriyet"),
    ("Türk Medeni Kanunu 1926 yılında hangi Avrupa ülkesinin medeni kanunu örnek alınarak hazırlanmıştır?", "İsviçre", ["Fransa", "İtalya", "Almanya"], "cumhuriyet"),
    ("Hatay Cumhuriyeti'nin tek cumhurbaşkanı kimdir?", "Tayfur Sökmen", ["Abdurrahman Melek", "Şükrü Kanatlı", "Celal Bayar"], "cumhuriyet"),
    ("Osmanlı'da Lale Devri hangi sadrazamın dönemiyle özdeşleşmiştir?", "Nevşehirli Damat İbrahim Paşa", ["Sokullu Mehmed Paşa", "Köprülü Mehmed Paşa", "Mithat Paşa"], "osmanli"),
    ("İlk Türk matbaasını Lale Devri'nde İstanbul'da kuran devlet adamı ve mütefekkir kimdir?", "İbrahim Müteferrika", ["Katip Çelebi", "Evliya Çelebi", "Hezarfen Ahmed Çelebi"], "ilkler"),
    ("Galata Kulesi'nden taktığı kanatlarla Üsküdar Doğancılar'a uçmayı başaran 17. yüzyıl Türk bilgini kimdir?", "Hezarfen Ahmed Çelebi", ["Lagari Hasan Çelebi", "Takiyüddin", "Ali Kuşçu"], "bilginler"),
    ("Barutlu roketle tarihte ilk kez dikey uçuş gerçekleştiren Osmanlı bilgini kimdir?", "Lagari Hasan Çelebi", ["Hezarfen Ahmed Çelebi", "Piri Reis", "Sabuncuoğlu Şerafeddin"], "bilginler"),
    ("Fatih Sultan Mehmet'in davetiyle İstanbul'a gelip Ayasofya Medresesi müderrisliği yapan büyük astronom kimdir?", "Ali Kuşçu", ["Uluğ Bey", "İbni Sina", "Biruni"], "bilginler"),
    ("Semerkant'ta dev bir rasathane (gözlemevi) kuran hem hükümdar hem de astronom olan Timur'un torunu kimdir?", "Uluğ Bey", ["Hüseyin Baykara", "Ali Şir Nevai", "Babür Şah"], "bilginler"),
    ("Osmanlı Devleti'nde üç padişaha (Kanuni, II. Selim, III. Murad) aralıksız sadrazamlık yapan devlet adamı kimdir?", "Sokullu Mehmed Paşa", ["Pargalı İbrahim Paşa", "Rüstem Paşa", "Kuyucu Murad Paşa"], "osmanli"),
    ("Büyük Selçuklu Devleti'nde Nizamiye Medreseleri'ni kuran ünlü vezir kimdir?", "Nizamülmülk", ["Celaleddin Karatay", "vezir Amidülmülk", "Sahip Ata"], "selcuklu"),
    ("Avrupa Hun İmparatorluğu'na en parlak dönemini yaşatan ve Avrupalıların 'Tanrının Kırbacı' dediği hükümdar kimdir?", "Attila", ["Balamir", "Uldız", "Rua"], "turk_tarihi"),
    ("İslamiyet'i resmi din olarak kabul eden ilk büyük Türk devleti hangisidir?", "Karahanlılar", ["Gazneliler", "Büyük Selçuklular", "İdil Bulgarları"], "turk_tarihi"),
    ("Hindistan'a 17 sefer düzenleyerek İslamiyet'in yayılmasını sağlayan ve 'Sultan' unvanını ilk kullanan Türk hükümdarı kimdir?", "Gazneli Mahmud", ["Tuğrul Bey", "Timur", "Babür Şah"], "turk_tarihi"),
    ("Mısır'da kurulan ilk Türk-İslam devleti hangisidir?", "Tolunoğulları", ["İhşidiler", "Eyyubiler", "Memlükler"], "turk_tarihi"),
    ("1919'da toplanan ve 'Mandaya ve himayeye kesin olarak reddedildiği' ulusal kongre hangisidir?", "Sivas Kongresi", ["Erzurum Kongresi", "Amasya Görüşmeleri", "Balıkesir Kongresi"], "kurtulus"),
    ("Kurtuluş Savaşı'nda düzenli ordunun Batı Cephesi'nde kazandığı ilk askeri zafer hangisidir?", "I. İnönü Muharebesi", ["II. İnönü Muharebesi", "Sakarya Muharebesi", "Gediz Muharebesi"], "kurtulus"),
    ("Kırım Savaşı sırasında İstanbul Selimiye Kışlası'nda yaralı askerlere yaptığı bakımla modern hemşireliğin kurucusu sayılan kişi kimdir?", "Florence Nightingale", ["Clara Barton", "Marie Curie", "Edith Cavell"], "dunya_tarihi"),
    ("Berlin Duvarı hangi yılda yıkılarak Soğuk Savaş döneminin sonunu simgelemiştir?", "1989", ["1979", "1991", "1985"], "dunya_tarihi"),
    ("Hiroşima ve Nagazaki'ye atom bombası atılması hangi savaşı sona erdirmiştir?", "II. Dünya Savaşı", ["I. Dünya Savaşı", "Kore Savaşı", "Vietnam Savaşı"], "dunya_tarihi"),
    ("Türkiye, 1952 yılında NATO'ya üye olmadan önce hangi uluslararası barış gücüne tugay göndermiştir?", "Kore Savaşı", ["Vietnam Savaşı", "Körfez Savaşı", "Süveyş Krizi"], "cumhuriyet"),
    ("Anadolu Selçuklu Devleti'nin başkenti Kılıçarslan tarafından İznik'ten hangi şehre taşınmıştır?", "Konya", ["Kayseri", "Sivas", "Erzurum"], "selcuklu"),
    ("Osmanlı Devleti'nin ilk başkenti olarak kabul edilen ve Orhan Gazi tarafından fethedilen şehir hangisidir?", "Bursa", ["Edirne", "İznik", "Söğüt"], "osmanli"),
    ("Osmanlı Devleti'nde ilk anayasa olan 'Kanun-i Esasi' hangi yılda ilan edilmiştir?", "1876", ["1839", "1856", "1908"], "osmanli"),
    ("Atatürk'ün 1919-1927 yılları arasındaki milli mücadeleyi anlattığı büyük eseri hangisidir?", "Nutuk", ["Geometri", "Medeni Bilgiler", "Zabit ve Kumandan ile Hasbihal"], "cumhuriyet"),
    ("Mustafa Kemal Atatürk'ün 'Benim şahsi meselemdir' dediği ve 1939'da anavatana katılan ilimiz hangisidir?", "Hatay", ["Kars", "Musul", "Batum"], "cumhuriyet"),
    ("Ayasofya, 537 yılında hangi Bizans imparatoru tarafından inşa ettirilmiştir?", "I. Justinianus", ["Büyük Konstantin", "II. Theodosius", "Herakleios"], "mimari"),
]

for q, ans, wr, st in tarih_ozel:
    all_questions.append(make_q("Tarih", q, ans, wr, 20, st))

# ==============================================================================
# 2. GENEL KÜLTÜR & COĞRAFYA (Dünya, Türkiye, Kültür, İcatlar, Atasözleri, Mutfak, Genel)
# ==============================================================================
genel_kultur_ozel = [
    ("Türkiye'nin yüzölçümü bakımından en büyük ili hangisidir?", "Konya", ["Sivas", "Ankara", "Erzurum"], "turkiye"),
    ("Türkiye'nin yüzölçümü bakımından en küçük ili hangisidir?", "Yalova", ["Kilis", "Bartın", "Düzce"], "turkiye"),
    ("Türkiye'nin en fazla komşu ülkeye sınırı olan ve 3 ülkeye (İran, Nahçıvan, Ermenistan) komşu olan ili hangisidir?", "Iğdır", ["Edirne", "Hakkari", "Artvin"], "turkiye"),
    ("Hem Karadeniz'e hem de Marmara Denizi'ne kıyısı bulunan Anadolu'daki şehirlerimizden biri hangisidir?", "Kocaeli", ["Bursa", "Bolu", "Yalova"], "turkiye"),
    ("UNESCO Dünya Mirası Listesi'nde hem doğal hem kültürel (karma) miras olarak yer alan Pamukkale ve Hierapolis hangi ilimizdedir?", "Denizli", ["Aydın", "Muğla", "Afyonkarahisar"], "miras"),
    ("Kapadokya bölgesinde Peri Bacaları'nın en yoğun görüldüğü Ürgüp, Göreme ve Avanos hangi ilimize bağlıdır?", "Nevşehir", ["Aksaray", "Kayseri", "Niğde"], "miras"),
    ("Dünyanın en kalabalık nüfusuna sahip iki ülkesi hangileridir?", "Hindistan ve Çin", ["Çin ve ABD", "Hindistan ve Endonezya", "ABD ve Brezilya"], "dunya"),
    ("Yüzölçümü bakımından dünyanın en büyük ülkesi hangisidir?", "Rusya", ["Kanada", "Çin", "ABD"], "dunya"),
    ("Yüzölçümü ve nüfus bakımından dünyanın en küçük bağımsız devleti hangisidir?", "Vatikan", ["Monako", "San Marino", "Lihtenştayn"], "dunya"),
    ("Güneş'in doğduğu ülke olarak bilinen Uzak Doğu ada ülkesi hangisidir?", "Japonya", ["Güney Kore", "Tayvan", "Filipinler"], "dunya"),
    ("Piramitlerin ve Sfenks'in bulunduğu Gize platosu hangi ülkenin sınırları içindedir?", "Mısır", ["Ürdün", "Sudan", "Fas"], "dunya"),
    ("Tac Mahal adlı mermer anıt mezar hangi ülkede yer almaktadır?", "Hindistan", ["Pakistan", "İran", "Özbekistan"], "miras"),
    ("İnka uygarlığının dağların zirvesindeki kayıp şehri Machu Picchu hangi ülkededir?", "Peru", ["Şili", "Meksika", "Kolombiya"], "miras"),
    ("Kolezyum (Colosseum) ve Pisa Kulesi hangi Avrupa ülkesinin simgeleridir?", "İtalya", ["İspanya", "Yunanistan", "Fransa"], "miras"),
    ("Eyfel Kulesi 1889 yılında hangi şehirdeki Dünya Fuarı için inşa edilmiştir?", "Paris", ["Londra", "Brüksel", "Viyana"], "miras"),
    ("Özgürlük Heykeli, Amerika Birleşik Devletleri'ne hangi ülke tarafından hediye edilmiştir?", "Fransa", ["İngiltere", "İtalya", "İspanya"], "dunya"),
    ("Atlas Okyanusu ile Büyük Okyanus'u birbirine bağlayan Orta Amerika'daki insan yapımı su kanalı hangisidir?", "Panama Kanalı", ["Süveyş Kanalı", "Korint Kanalı", "Kiel Kanalı"], "cografya"),
    ("Akdeniz ile Kızıldeniz'i birbirine bağlayan ve Mısır topraklarında yer alan kanal hangisidir?", "Süveyş Kanalı", ["Panama Kanalı", "Hürmüz Boğazı", "Cebelitarık"], "cografya"),
    ("Avrupa kıtası ile Afrika kıtasını birbirinden ayıran dar su geçidi hangisidir?", "Cebelitarık Boğazı", ["Bering Boğazı", "Macellan Boğazı", "Manş Denizi"], "cografya"),
    ("Asya ile Kuzey Amerika kıtalarının birbirine en çok yaklaştığı su geçidi hangisidir?", "Bering Boğazı", ["Hürmüz Boğazı", "Malakka Boğazı", "Dover Boğazı"], "cografya"),
    ("Türkiye'de çayın başkenti olarak bilinen Karadeniz ilimiz hangisidir?", "Rize", ["Trabzon", "Giresun", "Ordu"], "kultur"),
    ("Türkiye'de fındık üretiminin en yoğun yapıldığı iki Karadeniz ilimiz hangileridir?", "Ordu ve Giresun", ["Rize ve Artvin", "Sinop ve Kastamonu", "Samsun ve Amasya"], "kultur"),
    ("Kendine has 'Oltu Taşı' işlemeciliği ve Cağ Kebabı ile ünlü Doğu Anadolu ilimiz hangisidir?", "Erzurum", ["Kars", "Erzincan", "Sivas"], "kultur"),
    ("Çingene Kızı mozaiğinin sergilendiği Zeugma Mozaik Müzesi hangi ilimizdedir?", "Gaziantep", ["Hatay", "Şanlıurfa", "Mardin"], "kultur"),
    ("Nemrut Dağı zirvesindeki dev Kommagene Krallığı heykelleri hangi ilimiz sınırlarındadır?", "Adıyaman", ["Malatya", "Elazığ", "Diyarbakır"], "miras"),
    ("İshak Paşa Sarayı ve Türkiye'nin en yüksek noktası olan Ağrı Dağı hangi ilimizdedir?", "Ağrı", ["Kars", "Van", "Iğdır"], "turkiye"),
    ("İki gözü farklı renkte olan kedisi, kahvaltısı ve Akdamar Adası ile ünlü ilimiz hangisidir?", "Van", ["Bitlis", "Muş", "Hakkari"], "kultur"),
    ("Mevlana Celaleddin Rumi'nin türbesinin bulunduğu Yeşil Kubbe hangi şehrimizdedir?", "Konya", ["Karaman", "Bursa", "Eskişehir"], "kultur"),
    ("Odunpazarı evleri, Porsuk Çayı ve lületaşı işlemeciliği ile tanınan şehrimiz hangisidir?", "Eskişehir", ["Kütahya", "Bilecik", "Afyonkarahisar"], "kultur"),
    ("Çini sanatı ve porselenleriyle dünyaca ünlü Ege bölgemizdeki ilimiz hangisidir?", "Kütahya", ["Uşak", "Manisa", "Denizli"], "kultur"),
    ("Mesir macunu festivali ve Spil Dağı ile ünlü Ege ilimiz hangisidir?", "Manisa", ["İzmir", "Aydın", "Balıkesir"], "kultur"),
    ("Mimar Sinan tarafından yapılan tarihi Malabadi Köprüsü hangi bölgemizdedir?", "Güneydoğu Anadolu (Diyarbakır-Batman)", ["Karadeniz", "Ege", "Marmara"], "mimari"),
    ("Safran çiçeği ve tarihi Osmanlı konaklarıyla UNESCO listesindeki Karabük ilçemiz hangisidir?", "Safranbolu", ["Beypazarı", "Amasra", "Cumalıkızık"], "miras"),
    ("Birleşmiş Milletler (BM) Genel Merkezi hangi şehirde bulunmaktadır?", "New York", ["Cenevre", "Brüksel", "Lahey"], "kurumlar"),
    ("Avrupa Birliği'nin (AB) fiili başkenti sayılan ve NATO karargahına da ev sahipliği yapan şehir neresidir?", "Brüksel (Belçika)", ["Strazburg", "Frankfurt", "Lüksemburg"], "kurumlar"),
    ("Japonya'nın para birimi nedir?", "Yen", ["Yuan", "Won", "Rupi"], "ekonomi"),
    ("İngiltere'nin (Birleşik Krallık) resmi para birimi nedir?", "Sterlin (Pound)", ["Euro", "Dolar", "Frank"], "ekonomi"),
    ("Rusya'nın resmi para birimi nedir?", "Ruble", ["Grivna", "Manat", "Tenge"], "ekonomi"),
    ("Azerbaycan'ın resmi para birimi nedir?", "Manat", ["Tenge", "Som", "Lari"], "ekonomi"),
    ("Satranç oyununda yalnızca 'L' şeklinde hareket edebilen ve diğer taşların üzerinden atlayabilen taş hangisidir?", "At", ["Fil", "Kale", "Vezir"], "oyun"),
    ("Gökkuşağında (optik tayfta) en dışta yer alan ve dalga boyu en uzun olan renk hangisidir?", "Kırmızı", ["Mor", "Mavi", "Yeşil"], "genel"),
    ("Mors alfabesinde uluslararası imdat çağrısı olan 'SOS' hangi harf dizisiyle gönderilir?", "Üç kısa, üç uzun, üç kısa (... --- ...)", ["Üç uzun, üç kısa", "Sürekli kısa sinyaller", "İki uzun, iki kısa"], "genel"),
    ("Bir yılda 366 gün olan ve Şubat ayının 29 çektiği yıllara ne ad verilir?", "Artık Yıl", ["Tam Yıl", "Güneş Yılı", "Yıldız Yılı"], "genel"),
    ("Nobel Ödülleri her yıl hangi İskandinav ülkesinin başkenti Stockholm'de (Barış ödülü Oslo'da) verilir?", "İsveç", ["İsviçre", "Danimarka", "Finlandiya"], "oduller"),
    ("Türk atasözünde 'Sakla samanı...' ifadesinin devamı nasıldır?", "Gelir zamanı", ["Olur harmanı", "Bulur dermanı", "Dolar ambarı"], "atasozu"),
    ("Türk atasözünde 'Damlaya damlaya...' ifadesinin devamı nasıldır?", "Göl olur", ["Sel olur", "Deniz olur", "Nehir olur"], "atasozu"),
    ("Hangi hayvan uçabilen tek memeli türüdür?", "Yarasa", ["Uçan Sincap", "Devekuşu", "Penguen"], "doga"),
    ("Yeryüzünde yaşayan en büyük memeli hayvan hangisidir?", "Mavi Balina", ["Afrika Fili", "Zürafa", "Beyaz Köpekbalığı"], "doga"),
    ("Karada yaşayan en hızlı memeli hayvan hangisidir?", "Çita", ["Aslan", "Ceylan", "Tazı"], "doga"),
    ("Kutup ayıları doğal ortamlarında dünyanın hangi kutbunda yaşarlar?", "Kuzey Kutbu (Arktik)", ["Güney Kutbu (Antarktika)", "Her iki kutupta", "Grönland ve Yeni Zelanda"], "doga"),
    ("Penguenler doğal yaşam alanlarında ağırlıklı olarak hangi yarımkürede yaşarlar?", "Güney Yarımküre (Antarktika çevresi)", ["Kuzey Kutbu", "İskandinavya", "Sibirya"], "doga"),
    ("Kahvenin ana vatanı olarak kabul edilen ve 'Kaffa' bölgesinden adını alan Afrika ülkesi hangisidir?", "Etiyopya (Habeşistan)", ["Brezilya", "Kolombiya", "Yemen"], "kultur"),
    ("Pisa Kulesi hangi İtalyan şehrinde bulunmaktadır?", "Pisa", ["Roma", "Venedik", "Floransa"], "dunya"),
    ("Kanalları, gondolları ve maske karnavalıyla ünlü İtalyan şehri hangisidir?", "Venedik", ["Milano", "Napoli", "Verona"], "dunya"),
    ("Dünyanın en büyük sıcak çölü olan Sahra Çölü hangi kıtadadır?", "Afrika", ["Asya", "Avustralya", "Güney Amerika"], "cografya"),
    ("Gobi Çölü hangi kıtada yer almaktadır?", "Asya (Moğolistan - Çin)", ["Afrika", "Güney Amerika", "Avustralya"], "cografya"),
    ("Türkiye'nin dört bir yanını çevreleyen denizlerden hangisi iç denizimizdir?", "Marmara Denizi", ["Ege Denizi", "Karadeniz", "Akdeniz"], "turkiye"),
    ("İstanbul Boğazı ile Çanakkale Boğazı arasında yer alan denizimiz hangisidir?", "Marmara Denizi", ["Karadeniz", "Ege Denizi", "Akdeniz"], "turkiye"),
    ("Türkiye'de güneşin ilk doğduğu en doğudaki ilimiz hangisidir?", "Iğdır", ["Kars", "Hakkari", "Van"], "turkiye"),
    ("Türkiye'nin en batı ucunu oluşturan Gökçeada (İnceburun) hangi ilimize bağlıdır?", "Çanakkale", ["Edirne", "Balıkesir", "İzmir"], "turkiye"),
]

for q, ans, wr, st in genel_kultur_ozel:
    all_questions.append(make_q("Genel Kültür", q, ans, wr, 20, st))

# Başkentlerden sadece en bilinen 30 tanesini (tek yönlü, baymadan) ekleyelim:
ulkeler_30 = [
    ("Almanya", "Berlin", ["Münih", "Hamburg", "Frankfurt"]),
    ("Fransa", "Paris", ["Lyon", "Marsilya", "Nice"]),
    ("İtalya", "Roma", ["Milano", "Venedik", "Napoli"]),
    ("İspanya", "Madrid", ["Barselona", "Sevilla", "Valencia"]),
    ("İngiltere", "Londra", ["Manchester", "Liverpool", "Bristol"]),
    ("Japonya", "Tokyo", ["Osaka", "Kyoto", "Yokohama"]),
    ("Güney Kore", "Seul", ["Busan", "Incheon", "Daegu"]),
    ("Çin", "Pekin", ["Şanghay", "Hong Kong", "Vuhan"]),
    ("Rusya", "Moskova", ["St. Petersburg", "Kazan", "Soçi"]),
    ("Kanada", "Ottawa", ["Toronto", "Montreal", "Vancouver"]),
    ("Avustralya", "Canberra", ["Sidney", "Melbourne", "Perth"]),
    ("Brezilya", "Brasilia", ["Rio de Janeiro", "Sao Paulo", "Salvador"]),
    ("Arjantin", "Buenos Aires", ["Cordoba", "Rosario", "Mendoza"]),
    ("Mısır", "Kahire", ["İskenderiye", "Luksor", "Şarm El-Şeyh"]),
    ("Azerbaycan", "Bakü", ["Gence", "Nahçıvan", "Şeki"]),
    ("Yunanistan", "Atina", ["Selanik", "Kavala", "Patras"]),
    ("Hollanda", "Amsterdam", ["Rotterdam", "Eindhoven", "Utrecht"]),
    ("Avusturya", "Viyana", ["Salzburg", "Graz", "Linz"]),
    ("İsveç", "Stockholm", ["Göteborg", "Malmö", "Uppsala"]),
    ("Norveç", "Oslo", ["Bergen", "Trondheim", "Tromsö"]),
    ("Polonya", "Varşova", ["Krakow", "Gdansk", "Poznan"]),
    ("Macaristan", "Budapeşte", ["Debrecen", "Pecs", "Estergon"]),
    ("Çekya", "Prag", ["Brno", "Plzen", "Karlovy Vary"]),
    ("Portekiz", "Lizbon", ["Porto", "Braga", "Coimbra"]),
    ("Hindistan", "Yeni Delhi", ["Mumbai", "Kalküta", "Haydarabad"]),
    ("Meksika", "Mexico City", ["Cancun", "Tijuana", "Monterrey"]),
    ("KKTC", "Lefkoşa", ["Girne", "Gazimağusa", "Güzelyurt"]),
    ("Özbekistan", "Taşkent", ["Semerkant", "Buhara", "Hive"]),
    ("Kazakistan", "Astana", ["Almatı", "Türkistan", "Aktau"]),
    ("İsviçre", "Bern", ["Zürih", "Cenevre", "Basel"])
]

for ulke, cap, wr in ulkeler_30:
    all_questions.append(make_q("Genel Kültür", f"{ulke} ülkesinin başkenti neresidir?", cap, wr, 20, "baskent"))

# ==============================================================================
# 3. BİLİM & TEKNOLOJİ (Fizik, Kimya, Biyoloji, Uzay, Bilişim, Tıp, İcatlar)
# ==============================================================================
bilim_ozel = [
    ("Suyun deniz seviyesinde donma ve kaynama noktaları Celsius cinsinden kaç derecedir?", "0°C ve 100°C", ["-10°C ve 90°C", "0°C ve 80°C", "32°C ve 212°C"], "fizik"),
    ("Işık hızı boşlukta saniyede yaklaşık kaç kilometredir?", "300.000 km/s", ["150.000 km/s", "340 m/s", "1.000.000 km/s"], "fizik"),
    ("Ses dalgaları aşağıdaki ortamların hangisinde YAYILMAZ?", "Boşlukta (Uzayda)", ["Suda", "Demirde", "Havada"], "fizik"),
    ("Elektrik akımının şiddetini ölçmek için kullanılan ölçü aletine ne ad verilir?", "Ampermetre", ["Voltmetre", "Barometre", "Termometre"], "fizik"),
    ("Açık hava basıncını ölçmek için kullanılan alete ne ad verilir?", "Barometre", ["Altimetre", "Higrometre", "Anemometre"], "fizik"),
    ("Depremin büyüklüğünü ve yer sarsıntılarını kaydeden cihaza ne ad verilir?", "Sismograf", ["Telgraf", "Sonograf", "Kalorimetre"], "yerbilim"),
    ("Elmas ve grafit (kalem ucu) hangi elementin farklı kristal dizilimlerinden (allotroplarından) oluşur?", "Karbon", ["Silisyum", "Demir", "Kükürt"], "kimya"),
    ("Oda sıcaklığında sıvı halde bulunan tek metal element hangisidir?", "Cıva (Hg)", ["Kurşun", "Gümüş", "Alüminyum"], "kimya"),
    ("Dünya atmosferinde yaklaşık %78 oranla en fazla bulunan gaz hangisidir?", "Azot (Nitrojen)", ["Oksijen", "Karbondioksit", "Hidrojen"], "kimya"),
    ("Sofra tuzunun kimyasal formülü ve adı nedir?", "Sodyum Klorür (NaCl)", ["Kalsiyum Karbonat", "Potasyum Nitrat", "Hidrojen Peroksit"], "kimya"),
    ("Bitkilerin güneş ışığı yardımıyla karbondioksit ve sudan besin ve oksijen üretmesi olayına ne denir?", "Fotosentez", ["Solunum", "Fermantasyon", "Osmoz"], "biyoloji"),
    ("İnsan kalbi kaç odacıktan oluşur?", "4 odacık (2 kulakçık, 2 karıncık)", ["2 odacık", "3 odacık", "5 odacık"], "biyoloji"),
    ("İnsan vücudundaki en büyük iç organ hangisidir?", "Karaciğer", ["Mide", "Böbrek", "Dalak"], "biyoloji"),
    ("Kalıtsal bilgilerimizi taşıyan ve çift sarmal yapıda olan molekülün kısaltması nedir?", "DNA", ["ATP", "RNA", "Enzim"], "biyoloji"),
    ("DNA'nın çift sarmal yapısını 1953 yılında keşfeden bilim insanları kimlerdir?", "Watson ve Crick (Rosalind Franklin'in katkısıyla)", ["Mendel ve Darwin", "Pasteur ve Fleming", "Newton ve Hooke"], "biyoloji"),
    ("Normal bir yetişkin insanın vücudunda toplam kaç kemik bulunur?", "206", ["300", "150", "256"], "biyoloji"),
    ("İnsan kulağındaki 'Çekiç, Örs ve Üzengi' kemikleri vücudumuzun hangi özelliğine sahiptir?", "Vücuttaki en küçük kemiklerdir", ["En sert kemiklerdir", ["Eklem yapmayan kemiklerdir"], "En geç oluşan kemiklerdir"][0:3], "biyoloji"),
    ("Evrensel verici olarak bilinen ve acil durumlarda diğer gruplara kan verebilen kan grubu hangisidir?", "0 Rh Negatif (0 Rh-)", ["AB Rh Pozitif", "A Rh Pozitif", "B Rh Negatif"], "tip"),
    ("Hangi vitamin güneş ışığının etkisiyle insan derisinde sentezlenebilir?", "D Vitamini", ["C Vitamini", "B12 Vitamini", "A Vitamini"], "tip"),
    ("Turunçgillerde bolca bulunan ve eksikliğinde 'İskorbüt' hastalığına yol açan vitamin hangisidir?", "C Vitamini", ["A Vitamini", "K Vitamini", "E Vitamini"], "tip"),
    ("Güneş Sistemi'nde Güneş'e en yakın olan gezegen hangisidir?", "Merkür", ["Venüs", "Mars", "Dünya"], "uzay"),
    ("Güneş Sistemi'nin en sıcak gezegeni (yoğun sera etkisi nedeniyle) hangisidir?", "Venüs", ["Merkür", "Mars", "Jüpiter"], "uzay"),
    ("2006 yılında alınan kararla 'Cüce Gezegen' sınıfına geçirilen gök cismi hangisidir?", "Plüton", ["Neptün", "Ceres", "Uranüs"], "uzay"),
    ("Dünya'nın tek doğal uydusu nedir?", "Ay", ["Phobos", "Titan", "Europa"], "uzay"),
    ("Satürn'ün en büyük uydusu olan ve yoğun bir atmosfere sahip gök cismi hangisidir?", "Titan", ["Ganymede", "Io", " Ay"], "uzay"),
    ("Uzaya gönderilen ve derin uzay fotoğraflarıyla çığır açan Hubble'ın halefi kızılötesi uzay teleskobu hangisidir?", "James Webb Uzay Teleskobu", ["Kepler Teleskobu", "Chandra Teleskobu", "Spitzer Teleskobu"], "uzay"),
    ("Bilgisayarlarda geçici çalışma belleği olarak kullanılan donanım biriminin kısaltması nedir?", "RAM", ["ROM", "GPU", "PSU"], "bilisim"),
    ("Bilgisayarın beyni olarak nitelendirilen Merkezi İşlem Birimi'nin kısaltması nedir?", "CPU (İşlemci)", ["SSD", "HDD", "RAM"], "bilisim"),
    ("İnternet sitelerinin adreslerinde yer alan 'HTTP' kısaltmasındaki 'P' harfi neyi ifade eder?", "Protocol (Protokol)", ["Program", "Page (Sayfa)", "Port"], "bilisim"),
    ("1 Kilobayt (KB) ikili (binary) bilgisayar sisteminde kaç Bayt'a (Byte) eşittir?", "1024 Byte", ["1000 Byte", "512 Byte", "2048 Byte"], "bilisim"),
    ("Yapay zeka ve bilgisayar biliminin kurucusu sayılan, II. Dünya Savaşı'nda Enigma şifresini kıran matematikçi kimdir?", "Alan Turing", ["John von Neumann", "Tim Berners-Lee", "Bill Gates"], "bilisim"),
    ("World Wide Web'i (WWW) 1989 yılında CERN'de çalışırken icat eden bilim insanı kimdir?", "Tim Berners-Lee", ["Steve Jobs", "Linus Torvalds", "Vint Cerf"], "bilisim"),
    ("Açık kaynaklı 'Linux' işletim sistemi çekirdeğini geliştiren yazılımcı kimdir?", "Linus Torvalds", ["Richard Stallman", "Dennis Ritchie", "Ken Thompson"], "bilisim"),
    ("X-ışınlarını (Röntgen ışınlarını) keşfederek 1901'de ilk Nobel Fizik Ödülü'nü alan bilim insanı kimdir?", "Wilhelm Conrad Röntgen", ["Henri Becquerel", "Pierre Curie", "Max Planck"], "kesif"),
    ("Dinamiti icat eden ve servetini her yıl bilim/edebiyat/barış ödülleri dağıtılması için bağışlayan İsveçli kimyager kimdir?", "Alfred Nobel", ["Robert Oppenheimer", "Anders Celsius", "Carl Linnaeus"], "kesif"),
    ("Buhar makinesini geliştirerek Sanayi Devrimi'nin başlamasında kilit rol oynayan İskoç mühendis kimdir?", "James Watt", ["George Stephenson", "Rudolf Diesel", "Henry Ford"], "kesif"),
    ("Suyun kaldırma kuvvetini hamamda keşfettiği ve 'Evreka!' (Buldum!) diyerek koştuğu rivayet edilen antik bilgin kimdir?", "Arşimet (Archimedes)", ["Pisagor", "Öklid", "Thales"], "antik_bilim"),
    ("Tıp tarihinde 'El-Kanun fi't-Tıb' (Tıbbın Kanunu) adlı eseri yüzyıllarca Avrupa'da ders kitabı okutulan İslam bilgini kimdir?", "İbn-i Sina (Avicenna)", ["Farabi", "İbn-i Rüşd", "Razi"], "islam_bilim"),
    ("Cebir biliminin kurucusu sayılan ve '0' (sıfır) rakamıyla algoritmayı tanıtan büyük bilgin kimdir?", "Harezmi (El-Harezmi)", ["Ömer Hayyam", "Biruni", "Uluğ Bey"], "islam_bilim"),
    ("Sibernetik ve robotik biliminin öncüsü kabul edilen, su saatleri ve otomatlar tasarlayan Cizreli alim kimdir?", "El-Cezeri", ["Cabir bin Hayyan", "İbn-i Heysem", "Piri Reis"], "islam_bilim"),
    ("Optik biliminin babası kabul edilen ve 'Kitabü'l-Menazır' eseriyle karanlık oda (kamera) prensibini açıklayan bilgin kimdir?", "İbn-i Heysem", ["El-Kindi", "Farabi", "Sabit bin Kurra"], "islam_bilim"),
    ("Atomun parçalanabileceğini yüzyıllar öncesinden öngören ve modern kimyanın öncüsü sayılan İslam alimi kimdir?", "Cabir bin Hayyan", ["Razi", "İbn-i Haldun", "Biruni"], "islam_bilim"),
    ("Türkiye'nin uzaya gönderdiği ilk astronotumuz kimdir?", "Alper Gezeravcı", ["Tuva Cihangir Atasever", "Aziz Sancar", "Selçuk Bayraktar"], "uzay"),
    ("Bir elektrik devresinde gerilim (voltaj), akım ve direnç arasındaki bağıntıyı (V = I × R) açıklayan yasa hangisidir?", "Ohm Yasası", ["Coulomb Yasası", "Faraday Yasası", "Kirchhoff Yasası"], "fizik"),
    ("Periyodik tabloda 'Au' sembolüyle gösterilen değerli metal hangisidir?", "Altın", ["Gümüş", "Bakır", "Platin"], "kimya"),
    ("Periyodik tabloda 'Fe' sembolüyle gösterilen ve sanayinin temeli olan metal hangisidir?", "Demir", ["Fosfor", "Flor", "Çinko"], "kimya"),
    ("Periyodik tabloda 'Ag' sembolüyle gösterilen ve elektriği en iyi ileten metal hangisidir?", "Gümüş", ["Altın", "Alüminyum", "Argon"], "kimya"),
    ("Kutup Yıldızı (Polaris) hangi yönü bulmamıza yardımcı olur?", "Kuzey", ["Güney", "Doğu", "Batı"], "astronomi"),
    ("Ay'ın Dünya ile Güneş arasına girerek Güneş ışığını engellemesi olayına ne ad verilir?", "Güneş Tutulması", ["Ay Tutulması", "Ekinoks", "Gelgit"], "astronomi"),
    ("Gece ve gündüz sürelerinin tüm dünyada eşitlendiği (21 Mart ve 23 Eylül) tarihlere ne ad verilir?", "Ekinoks", ["Solstis (Gündönümü)", "Perihel", "Aphel"], "astronomi"),
]

for q, ans, wr, st in bilim_ozel:
    all_questions.append(make_q("Bilim & Teknoloji", q, ans, wr, 20, st))

# ==============================================================================
# 4. İSLAM & DİNİ BİLGİLER (Siyer, Kur'an, Peygamberler Tarihi, İbadet, Fıkıh, Ahlak, İslam Medeniyeti)
# ==============================================================================
islam_ozel = [
    ("İslam'ın şartlarından biri olan Zekat, zenginlik ölçüsü olan hangi miktara ulaşan mallardan verilir?", "Nisap miktarı", ["Fitre miktarı", "Fidye miktarı", "Öşür miktarı"], "fikih"),
    ("Kur'an-ı Kerim'in ilk suresi olan ve namazların her rekatında okunan sure hangisidir?", "Fatiha Suresi", ["Bakara Suresi", "İhlas Suresi", "Asr Suresi"], "kuran"),
    ("Kur'an-ı Kerim'de başında 'Besmele' bulunmayan tek sure hangisidir?", "Tevbe Suresi", ["Neml Suresi", "Enfal Suresi", "Kehf Suresi"], "kuran"),
    ("Kur'an-ı Kerim'de iki defa Besmele geçen sure hangisidir?", "Neml Suresi", ["Tevbe Suresi", "Bakara Suresi", "Yasin Suresi"], "kuran"),
    ("Bakara Suresi'nin 255. ayeti olan ve içinde Allah'ın birliği ile kudretinin anlatıldığı ünlü ayet hangisidir?", "Ayetel Kürsi", ["Amenerrasulü", "Hüvallahüllezi", "Nur Ayeti"], "kuran"),
    ("Peygamber Efendimiz Hz. Muhammed'in (s.a.v.) annesinin ve babasının isimleri nedir?", "Hz. Amine ve Hz. Abdullah", ["Hz. Halime ve Hz. Ebu Talip", "Hz. Hatice ve Hz. Abdülmuttalip", "Hz. Fatıma ve Hz. Hamza"], "siyer"),
    ("Peygamber Efendimiz'in sütannesi kimdir?", "Hz. Halime", ["Hz. Ümmü Eymen", "Hz. Sümeyye", "Hz. Esma"], "siyer"),
    ("Peygamber Efendimiz'in dedesi Abdülmuttalip vefat ettikten sonra O'nu himaye eden amcası kimdir?", "Ebu Talip", ["Hz. Abbas", "Hz. Hamza", "Haris"], "siyer"),
    ("Peygamber Efendimiz'e gençliğinde dürüstlüğü ve güvenilirliği sebebiyle Mekkelilerin verdiği unvan nedir?", "Muhammedü'l-Emin (Güvenilir Muhammed)", ["Es-Sıddık", "El-Faruk", "Zinnureyn"], "siyer"),
    ("Hz. Ebubekir'e Peygamberimiz'i her durumda tereddütsüz tasdik ettiği için verilen unvan nedir?", "Es-Sıddık", ["El-Faruk", "Esedullah", "Zinnureyn"], "sahabe"),
    ("Hak ile batılı ayıran anlamında 'El-Faruk' unvanıyla anılan halife kimdir?", "Hz. Ömer", ["Hz. Ebubekir", "Hz. Osman", "Hz. Ali"], "sahabe"),
    ("Peygamber Efendimiz'in iki kızıyla (Rukiyye ve Ümmü Gülsüm) evlendiği için 'Zinnureyn' (İki Nur Sahibi) denilen halife kimdir?", "Hz. Osman", ["Hz. Ali", "Hz. Ömer", "Hz. Zübeyr"], "sahabe"),
    ("Hayber Kalesi'nin fethinde sancağı taşıyan ve 'Allah'ın Arslanı' (Esedullah) unvanıyla bilinen halife kimdir?", "Hz. Ali", ["Hz. Hamza", "Halid bin Velid", "Hz. Ömer"], "sahabe"),
    ("Uhud Savaşı'nda şehit düşen ve 'Şehitlerin Efendisi' (Seyyidü'ş-Şüheda) olarak anılan Peygamberimiz'in amcası kimdir?", "Hz. Hamza", ["Hz. Abbas", "Mus'ab bin Umeyr", "Cafer-i Tayyar"], "sahabe"),
    ("Medine'ye hicretten önce İslam'ı öğretmek üzere Peygamberimiz tarafından gönderilen ilk öğretmen sahabe kimdir?", "Mus'ab bin Umeyr", ["Muaz bin Cebel", "Bilal-i Habeşi", "Enes bin Malik"], "sahabe"),
    ("Medine'ye hicret eden Mekkelilere evlerini ve gönüllerini açan Medineli Müslümanlara ne ad verilir?", "Ensar (Yardımcılar)", ["Muhacir", "Tabiin", "Ashab-ı Suffe"], "siyer"),
    ("Mekke'den Medine'ye Allah rızası için göç eden Müslümanlara ne ad verilir?", "Muhacir", ["Ensar", "Murabıt", "Mücahit"], "siyer"),
    ("Medine'de Mescid-i Nebevi'nin bitişiğinde ilim öğrenen sahabelerin kaldığı eğitim mekanına ne ad verilirdi?", "Suffe (Ashab-ı Suffe)", ["Darü'l-Erkam", "Darü'n-Nedve", "Beytü'l-Hikme"], "siyer"),
    ("Hendek Savaşı'nda Medine'nin etrafına hendek kazılması fikrini veren İran asıllı sahabe kimdir?", "Selman-ı Farisi", ["Ammar bin Yasir", "Ebu Eyyub el-Ensari", "Suheyb-i Rumi"], "siyer"),
    ("İstanbul kuşatmasına katılan ve kabri bugün Eyüpsultan'da bulunan, Peygamberimiz'i Medine'de evinde misafir eden sahabe kimdir?", "Ebu Eyyub el-Ensari (Eyüp Sultan)", ["Ebu Derda", "Sa'd bin Ebi Vakkas", "Amr bin As"], "sahabe"),
    ("Mekke'nin Fethi hangi yılda kansız ve barışçıl bir şekilde gerçekleşmiştir?", "630", ["624", "627", "632"], "siyer"),
    ("Peygamber Efendimiz'in 632 yılında yüz bini aşkın sahabeye hitap ettiği son konuşmasına ne ad verilir?", "Veda Hutbesi", ["Akabe Biatı", "Hudeybiye Antlaşması", "Medine Vesikası"], "siyer"),
    ("Abdest alırken yıkama ve mesh etme işlemlerinden oluşan abdestin farzları kaç tanedir?", "4 (Yüzü, kolları, ayakları yıkamak ve başı mesh etmek)", ["3", "5", "6"], "ibadet"),
    ("Su bulunamadığı veya suyun kullanılmasının sağlık açısından sakıncalı olduğu durumlarda toprakla alınan abdeste ne denir?", "Teyemmüm", ["Gusül", "Mesh", "Taharet"], "ibadet"),
    ("Ramazan ayında yatsı namazından sonra cemaatle veya tek başına kılınan 20 rekatlık sünnet namaz hangisidir?", "Teravih Namazı", ["Teheccüd Namazı", "Vitir Namazı", "İşrak Namazı"], "ibadet"),
    ("Ramazan ayında oruç tutmak için imsak vaktinden önce kalkılıp yenilen yemeğe ne ad verilir?", "Sahur", ["İftar", "İmsak", "Fidye"], "ibadet"),
    ("Ramazan Bayramı'ndan önce verilmesi vacip olan ve fıtır sadakası olarak da bilinen yardıma ne ad verilir?", "Fitre", ["Fidye", "Öşür", "Haraç"], "ibadet"),
    ("Hac ibadetinde ihrama giren hacıların Kabe'nin etrafında 7 kez dönmelerine ne ad verilir?", "Tavaf", ["Sa'y", "Vakfe", "İhram"], "ibadet"),
    ("Hac ve umrede Safa ile Merve tepeleri arasında 7 kez gidip gelmeye ne ad verilir?", "Sa'y", ["Tavaf", "Vakfe", "Tehlil"], "ibadet"),
    ("Hac ibadetinin en önemli iki farzından biri olan ve Kurban Bayramı arifesinde yapılan bekleyiş nerede gerçekleşir?", "Arafat Dağı'nda (Arafat Vakfesi)", ["Mina'da", "Müzdelife'de", "Uhud Dağı'nda"], "ibadet"),
    ("Kabe'nin köşesinde bulunan ve cennetten geldiğine inanılan kutsal siyah taşa ne ad verilir?", "Hacerü'l-Esved", ["Makam-ı İbrahim", "Altınoluk", "Mültezem"], "ibadet"),
    ("Hz. Hacer ve bebek Hz. İsmail'in susuzluğu sırasında Mekke'de mucizevi olarak çıkan kutsal su hangisidir?", "Zemzem Suyu", ["Kevser Suyu", "Ab-ı Hayat", "Tesnim"], "peygamberler"),
    ("İnsanlığın ilk babası ve ilk peygamber kimdir?", "Hz. Adem", ["Hz. Şit", "Hz. İdris", "Hz. Nuh"], "peygamberler"),
    ("Nemrut tarafından ateşe atılan ancak Allah'ın emriyle ateşin kendisine serin ve selamet olduğu peygamber kimdir?", "Hz. İbrahim", ["Hz. Musa", "Hz. Lut", "Hz. İsmail"], "peygamberler"),
    ("Kardeşleri tarafından kuyuya atılan, daha sonra Mısır'da hazineden sorumlu vezir olan ve kıssası 'Kıssaların En Güzeli' sayılan peygamber kimdir?", "Hz. Yusuf", ["Hz. Yakup", "Hz. Bünyamin", "Hz. Şuayb"], "peygamberler"),
    ("Firavun'un zulmüne karşı İsrailoğulları'nı Mısır'dan çıkaran ve asasıyla Kızıldeniz'i ikiye yaran peygamber kimdir?", "Hz. Musa", ["Hz. Harun", "Hz. Davud", "Hz. Süleyman"], "peygamberler"),
    ("Kuşların ve karıncaların dilini bilen, rüzgara ve cinlere hükmetme mucizesi verilen hükümdar peygamber kimdir?", "Hz. Süleyman", ["Hz. Davud", "Hz. Zülkarneyn", "Hz. İdris"], "peygamberler"),
    ("Demiri eliyle hamur gibi işleyebilen, zırh yapan ve gür sesiyle Zebur'u okuyan peygamber kimdir?", "Hz. Davud", ["Hz. Süleyman", "Hz. İlyas", "Hz. Zekeriya"], "peygamberler"),
    ("Babasız olarak dünyaya gelen, beşikteyken konuşan ve körlerle alacalı hastaları Allah'ın izniyle iyileştiren peygamber kimdir?", "Hz. İsa", ["Hz. Yahya", "Hz. Musa", "Hz. İdris"], "peygamberler"),
    ("Kur'an-ı Kerim'i baştan sona ezberleyen kişiye ne ad verilir?", "Hafız", ["Kari", "Müfessir", "Muhaddis"], "kavramlar"),
    ("Peygamber Efendimiz'in söz, fiil ve onaylarını inceleyen ilim dalına ve bu sözlerin kendisine ne ad verilir?", "Hadis (ve Sünnet)", ["Tefsir", "Fıkıh", "Kelam"], "kavramlar"),
    ("Kur'an-ı Kerim ayetlerinin anlamlarını ve iniş sebeplerini açıklayan ilim dalına ne ad verilir?", "Tefsir", ["Hadis", "Akaid", "Tasavvuf"], "kavramlar"),
    ("İslam hukukunda ibadet ve sosyal hayatla ilgili kuralları inceleyen ilim dalına ne ad verilir?", "Fıkıh", ["Kelam", "Siyer", "Kıraat"], "kavramlar"),
    ("En güvenilir 6 hadis kitabından (Kütüb-i Sitte) ilki olan 'El-Camiu's-Sahih' eserinin müellifi büyük hadis alimi kimdir?", "İmam Buhari", ["İmam Müslim", "İmam Tirmizi", "İmam Malik"], "alimler"),
    ("Türkiye'de ve Türk dünyasında en yaygın olan Hanefi mezhebinin kurucu imamı kimdir?", "İmam-ı Azam Ebu Hanife", ["İmam Şafii", "İmam Malik", "İmam Ahmed bin Hanbel"], "alimler"),
    ("İtikadi (inanç) konularda Türklerin büyük çoğunluğunun bağlı olduğu mezhebin imamı olan Semerkantlı alim kimdir?", "İmam Maturidi", ["İmam Eş'ari", "İmam Gazali", "İmam Rabbani"], "alimler"),
    ("İhya-u Ulumi'd-Din eseriyle tanınan ve 'Hüccetü'l-İslam' (İslam'ın Delili) unvanlı büyük alim kimdir?", "İmam Gazali", ["Fahreddin Razi", "İbn-i Rüşd", "Mevlana"], "alimler"),
    ("Anadolu'nun manevi mimarlarından olan ve 'Yaratılanı severiz, Yaradan'dan ötürü' sözüyle tanınan mutasavvıf şair kimdir?", "Yunus Emre", ["Hacı Bektaş-ı Veli", "Ahmet Yesevi", "Hacı Bayram-ı Veli"], "tasavvuf"),
    ("Türkistan'da 'Divan-ı Hikmet' eseriyle Türkler arasında İslamiyet'in yayılmasına öncülük eden 'Pir-i Türkistan' kimdir?", "Hoca Ahmet Yesevi", ["Yunus Emre", "Şah-ı Nakşibend", "Mevlana"], "tasavvuf"),
    ("Hayatta iken Peygamber Efendimiz tarafından Cennet ile müjdelenen 10 sahabeye ne ad verilir?", "Aşere-i Mübeşşere", ["Ashab-ı Bedir", "Ashab-ı Kehf", "Ashab-ı Kiram"], "kavramlar"),
    ("Kur'an-ı Kerim'de adı açıkça geçen tek kadın kimdir?", "Hz. Meryem", ["Hz. Asiye", "Hz. Hatice", "Hz. Havva"], "kuran"),
    ("Kur'an-ı Kerim'de adı geçen tek sahabe kimdir (Ahzab Suresi'nde)?", "Hz. Zeyd bin Harise", ["Hz. Ebubekir", "Hz. Ömer", "Hz. Ali"], "kuran"),
    ("Müslümanların kıblesi 624 yılında Mescid-i Aksa'dan nereye çevrilmiştir?", "Kabe'ye (Mescid-i Haram)", ["Mescid-i Nebevi'ye", "Mescid-i Kuba'ya", "Arafat'a"], "siyer"),
    ("Üç Aylar olarak bilinen mübarek hicri ayların doğru sıralaması hangisidir?", "Recep - Şaban - Ramazan", ["Muharrem - Safer - Ramazan", "Şaban - Recep - Ramazan", "Ramazan - Şevval - Zilhicce"], "ibadet"),
    ("İnsanın sağ ve sol omzunda bulunan, iyilik ve kötülükleri yazmakla görevli meleklere ne ad verilir?", "Kiramen Katibin", ["Münker ve Nekir", "Hamele-i Arş", "Mukarrebun"], "inanc"),
    ("Kabirde insanları sorguya çekecek olan iki meleğin adı nedir?", "Münker ve Nekir", ["Kiramen Katibin", "Harut ve Marut", "Rıdvan ve Malik"], "inanc"),
]

for q, ans, wr, st in islam_ozel:
    all_questions.append(make_q("İslam & Dini Bilgiler", q, ans, wr, 20, st))

# ==============================================================================
# 5. VIP: SANAT & SİNEMA (Yeşilçam, Türk Sineması, Dünya Sineması, Diziler, Müzik, Yönetmenler)
# ==============================================================================
sinema_ozel = [
    ("Hababam Sınıfı serisinde 'İnek Şaban' karakterine hayat veren unutulmaz usta oyuncumuz kimdir?", "Kemal Sunal", ["Şener Şen", "Halit Akçatepe", "Tarık Akan"], "yesilcam"),
    ("Hababam Sınıfı'nda disiplinli ama altın kalpli müdür yardımcısı 'Mahmut Hoca' (Kel Mahmut) rolünü kim oynamıştır?", "Münir Özkul", ["Adile Naşit", "Hulusi Kentmen", "İhsan Yüce"], "yesilcam"),
    ("Hababam Sınıfı'nda elinde ziliyle koşan sevimli hizmetli 'Hafize Ana' karakterini kim canlandırmıştır?", "Adile Naşit", ["Perran Kutman", "Ayşen Gruda", "Mürüvvet Sim"], "yesilcam"),
    ("Hababam Sınıfı'nda beden eğitimi öğretmeni 'Badi Ekrem' karakterini canlandıran usta aktör kimdir?", "Şener Şen", ["Kemal Sunal", "İlyas Salman", "Zeki Alasya"], "yesilcam"),
    ("Yeşilçam'ın 'Sultan' lakaplı, Selvi Boylum Al Yazmalım filminin başrol kadın oyuncusu kimdir?", "Türkan Şoray", ["Hülya Koçyiğit", "Filiz Akın", "Fatma Girik"], "yesilcam"),
    ("Selvi Boylum Al Yazmalım filminde 'İlyas' karakterini canlandıran jön oyuncumuz kimdir?", "Kadir İnanır", ["Cüneyt Arkın", "Ediz Hun", "Kartal Tibet"], "yesilcam"),
    ("Malkoçoğlu, Battal Gazi ve Kara Murat serileriyle tanınan Türk sinemasının efsanevi aksiyon yıldızı kimdir?", "Cüneyt Arkın", ["Kartal Tibet", "Tamer Yiğit", "Ayhan Işık"], "yesilcam"),
    ("Züğürt Ağa, Eşkıya ve Muhsin Bey filmlerinin unutulmaz başrol oyuncusu kimdir?", "Şener Şen", ["Uğur Yücel", "Haluk Bilginer", "Çetin Tekindor"], "turk_sinemasi"),
    ("1996 yapımı, Türk sinemasında gişe rekorları kıran ve Şener Şen ile Uğur Yücel'in başrolü paylaştığı film hangisidir?", "Eşkıya", ["Her Şey Çok Güzel Olacak", "Vizontele", "Babam ve Oğlum"], "turk_sinemasi"),
    ("Cagan Irmak'ın yönettiği, Ege'de bir kasabada geçen ve Sadık ile oğlu Deniz'in hikayesini anlatan duygusal film hangisidir?", "Babam ve Oğlum", ["Issız Adam", "Dedemin İnsanları", "Unutursam Fısılda"], "turk_sinemasi"),
    ("2014 yılında 'Kış Uykusu' filmiyle Cannes Film Festivali'nde Altın Palmiye kazanan ünlü yönetmenimiz kimdir?", "Nuri Bilge Ceylan", ["Fatih Akın", "Zeki Demirkubuz", "Ferzan Özpetek"], "oduller"),
    ("1982 yılında Cannes Film Festivali'nde 'Yol' filmiyle Altın Palmiye kazanan sinemacımız kimdir?", "Yılmaz Güney (ve Şerif Gönen)", ["Atıf Yılmaz", "Metin Erksan", "Ömer Lütfi Akad"], "oduller"),
    ("1964'te Berlin Film Festivali'nde 'Susuz Yaz' filmiyle Türkiye'ye ilk uluslararası büyük ödül olan Altın Ayı'yı getiren yönetmen kimdir?", "Metin Erksan", ["Lütfi Akad", "Halit Refiğ", "Memduh Ün"], "oduller"),
    ("Uluslararası Emmy Ödülü'nde 'Şahsiyet' dizisindeki Agâh Beyoğlu rolüyle 'En İyi Erkek Oyuncu' seçilen usta sanatçımız kimdir?", "Haluk Bilginer", ["Kenan İmirzalıoğlu", "Kıvanç Tatlıtuğ", "Halit Ergenç"], "diziler"),
    ("G.O.R.A, A.R.O.G ve Yahşi Batı filmlerinin senaristi ve başrol komedyeni kimdir?", "Cem Yılmaz", ["Ata Demirer", "Yılmaz Erdoğan", "Şahan Gökbakar"], "komedi"),
    ("Vizontele ve Kelebeğin Rüyası filmlerinin senaristi ve yönetmeni kimdir?", "Yılmaz Erdoğan", ["Çağan Irmak", "Yavuz Turgul", "Derviş Zaim"], "turk_sinemasi"),
    ("Yüzüklerin Efendisi (The Lord of the Rings) film üçlemesinin yönetmeni kimdir?", "Peter Jackson", ["George Lucas", "Guillermo del Toro", "James Cameron"], "dunya_sinemasi"),
    ("Titanik (Titanic) ve Avatar filmlerini yöneten Oscar ödüllü yönetmen kimdir?", "James Cameron", ["Steven Spielberg", "Ridley Scott", "Christopher Nolan"], "dunya_sinemasi"),
    ("Esaretin Bedeli (The Shawshank Redemption) filminde Andy Dufresne'in en yakın arkadaşı 'Red' rolünü oynayan usta aktör kimdir?", "Morgan Freeman", ["Samuel L. Jackson", "Denzel Washington", " Forest Whitaker"], "dunya_sinemasi"),
    ("Matrix üçlemesinde 'Neo' (Seçilmiş Kişi) karakterini canlandıran ünlü aktör kimdir?", "Keanu Reeves", ["Brad Pitt", "Tom Cruise", "Leonardo DiCaprio"], "dunya_sinemasi"),
    ("Karayip Korsanları serisinde eksantrik korsan 'Kaptan Jack Sparrow' rolüyle özdeşleşen aktör kimdir?", "Johnny Depp", ["Orlando Bloom", "Geoffrey Rush", "Javier Bardem"], "dunya_sinemasi"),
    ("Başlangıç (Inception), Zindan Adası ve Diriliş (The Revenant) filmlerinin başrol oyuncusu kimdir?", "Leonardo DiCaprio", ["Matt Damon", "Christian Bale", "Joaquin Phoenix"], "dunya_sinemasi"),
    ("Kara Şövalye (The Dark Knight) filminde unutulmaz 'Joker' performansıyla ölümünden sonra Oscar kazanan aktör kimdir?", "Heath Ledger", ["Jack Nicholson", "Joaquin Phoenix", "Jared Leto"], "dunya_sinemasi"),
    ("Forrest Gump, Er Ryan'ı Kurtarmak ve Yeni Hayat (Cast Away) filmlerinin başrol oyuncusu kimdir?", "Tom Hanks", ["Robin Williams", "Tom Cruise", "Harrison Ford"], "dunya_sinemasi"),
    ("Yıldız Savaşları (Star Wars) evreninin yaratıcısı olan yönetmen ve yapımcı kimdir?", "George Lucas", ["Steven Spielberg", "J.J. Abrams", "Denis Villeneuve"], "dunya_sinemasi"),
    ("Star Wars serisinde 'Ben senin babanım' repliğiyle sinema tarihine geçen ikonik kötü karakter kimdir?", "Darth Vader", ["İmparator Palpatine", "Kylo Ren", "Darth Maul"], "dunya_sinemasi"),
    ("Jurassic Park, Schindler'in Listesi ve E.T. filmlerinin efsanevi yönetmeni kimdir?", "Steven Spielberg", ["Martin Scorsese", "Robert Zemeckis", "George Lucas"], "dunya_sinemasi"),
    ("Sinema dünyasının en prestijli ödülü olan Akademi Ödülleri'nin (Oscar) heykelciği hangi şehirde düzenlenen törenle verilir?", "Los Angeles (Hollywood)", ["New York", "Londra", "Cannes"], "oduller"),
    ("Oscar tarihinde En İyi Film ödülünü kazanan ilk İngilizce olmayan yabancı dilde film (Güney Kore yapımı, 2019) hangisidir?", "Parazit (Parasite)", ["Roma", "Crouching Tiger, Hidden Dragon", "Hayat Güzeldir"], "oduller"),
    ("Kimya öğretmeni Walter White'ın (Heisenberg) hikayesini anlatan ve tüm zamanların en yüksek puanlı dizilerinden olan yapım hangisidir?", "Breaking Bad", ["The Sopranos", "Better Call Saul", "Prison Break"], "diziler"),
    ("Westeros kıtasındaki Demir Taht mücadelesini ve 'Winter is Coming' (Kış Geliyor) sloganını konu alan fantastik dizi hangisidir?", "Game of Thrones (Taht Oyunları)", ["The Witcher", "Vikings", "House of the Dragon"], "diziler"),
    ("Kırmızı tulumlu ve Salvador Dali maskeli soyguncuların İspanya Kraliyet Darphanesi'ni soyduğu ünlü dizi hangisidir?", "La Casa de Papel", ["Lupin", "Narcos", "Elite"], "diziler"),
    ("456 oyuncunun çocuk oyunları oynayarak hayatta kalmaya çalıştığı Güney Kore yapımı Netflix dizisi hangisidir?", "Squid Game", ["All of Us Are Dead", "Alice in Borderland", "Hellbound"], "diziler"),
    ("1986 yılında yaşanan nükleer felaketi tüm gerçekçiliğiyle anlatan 5 bölümlük ödüllü mini dizi hangisidir?", "Chernobyl", ["Band of Brothers", "The Pacific", "Dark"], "diziler"),
    ("Sessiz sinema döneminin şapkalı, bastonlu ve bıyıklı 'Şarlo' (The Tramp) karakterini yaratan sinema dehası kimdir?", "Charlie Chaplin", ["Buster Keaton", "Harold Lloyd", "Stan Laurel"], "klasik"),
    ("Gerilim sinemasının ustası olarak bilinen, 'Sapık' (Psycho) ve 'Kuşlar' (The Birds) filmlerinin yönetmeni kimdir?", "Alfred Hitchcock", ["Orson Welles", "Billy Wilder", "Stanley Kubrick"], "klasik"),
    ("2001: Bir Uzay Destanı, Cinnet (The Shining) ve Otomatik Portakal filmlerinin mükemmeliyetçi yönetmeni kimdir?", "Stanley Kubrick", ["Ridley Scott", "David Lynch", "Roman Polanski"], "klasik"),
    ("Anadolu Rock müziğinin efsanesi olan, 'Gülpembe', 'Dağlar Dağlar' ve 'Dönence' şarkılarıyla7'den 77'ye sevilen sanatçımız kimdir?", "Barış Manço", ["Cem Karaca", "Erkin Koray", "Fikret Kızılok"], "muzik"),
    ("'Tamirci Çırağı', 'Resimdeki Gözyaşları' ve 'Islak Islak' şarkılarıyla tanınan güçlü sesli Anadolu Rock ustamız kimdir?", "Cem Karaca", ["Barış Manço", "Edip Akbayram", "Moğollar"], "muzik"),
    ("'Bozkırın Tezenesi' lakabıyla anılan, 'Neredesin Sen' ve 'Gönül Dağı' türkülerinin büyük halk ozanı kimdir?", "Neşet Ertaş", ["Aşık Veysel", "Mahzuni Şerif", "Musa Eroğlu"], "muzik"),
    ("2003 yılında 'Everyway That I Can' şarkısıyla Türkiye'ye Eurovision Şarkı Yarışması'nda birincilik getiren sanatçımız kimdir?", "Sertab Erener", ["Şebnem Paker", "Hadise", "maNga"], "muzik"),
    ("Tosun Paşa filminde birbirine rakip olan iki ünlü aile hangileridir?", "Tellioğulları ve Seferoğulları", ["Köseoğulları ve Ramazanoğulları", "Haliloğulları ve Paşaoğulları", "Beyoğulları ve Sarıoğulları"], "yesilcam"),
    ("Süt Kardeşler filminde konaktaki herkesi korkutan efsanevi yaratığın adı nedir?", "Gulyabani", ["Karabasan", "Hortlak", "Frankenstein"], "yesilcam"),
    ("Çiçek Abbas filminde Şakir (Şener Şen) ve Abbas'ın (İlyas Salman) minibüsçülük yaptığı mahalle/hat neresidir?", "Alibeyköy - Aksaray", ["Kadıköy - Pendik", "Bakırköy - Taksim", "Sarıyer - Beşiktaş"], "yesilcam"),
    ("Bizim Aile filminde Münir Özkul'un canlandırdığı Yaşar Usta'nın zengin fabrika sahibi Saim Bey'e söylediği ünlü tirat nasıl başlar?", "'Bak beyim, sana iki çift lafım var...'", ["'Para her şey değildir Saim Bey...'", "'Benim çocuklarım sahipsiz değildir...'", "'Bu fabrikayı yıkacağız...'"], "yesilcam"),
    ("Canım Kardeşim filminde küçük Kahraman'ın (Kahraman Kıral) ölmeden önce abisi ve Halit'ten tek isteği nedir?", "Bir televizyon alınması", ["Bisiklet alınması", "Denizi görmek", "Lunaparka gitmek"], "yesilcam"),
    ("Kemal Sunal'ın 'Kapıcılar Kralı' filminde canlandırdığı kurnaz ve zeki apartman görevlisinin adı nedir?", "Seyit", ["Şaban", "Maho", "İbrahim"], "yesilcam"),
    ("Nuri Bilge Ceylan'ın 2002 yılında Cannes'da Büyük Jüri Ödülü kazanan filmi hangisidir?", "Uzak", ["İklimler", "Üç Maymun", "Bir Zamanlar Anadolu'da"], "turk_sinemasi"),
    ("Yavuz Turgul'un yönettiği, Şener Şen ve Çetin Tekindor'un başrollerini paylaştığı, Kars'ta geçen 2010 yapımı film hangisidir?", "Av Mevsimi", ["Gönül Yarası", "Kabadayı", "Eşkıya"], "turk_sinemasi"),
    ("Harry Potter film serisinde Hogwarts Cadılık ve Büyücülük Okulu'nun bilge müdürü kimdir?", "Albus Dumbledore", ["Severus Snape", "Sirius Black", "Gandalf"], "dunya_sinemasi"),
]

for q, ans, wr, st in sinema_ozel:
    all_questions.append(make_q("Sanat & Sinema", q, ans, wr, 20, st))

# ==============================================================================
# 6. VIP: SANAT & EDEBİYAT (Türk Edebiyatı, Dünya Klasikleri, Şairler, Ressamlar, Eser-Yazar)
# ==============================================================================
edebiyat_ozel = [
    ("Mehmet Akif Ersoy'un şiirlerini topladığı 7 kitaptan oluşan başyapıtının adı nedir?", "Safahat", ["Çile", "Kendi Gök Kubbemiz", "Memleketimden İnsan Manzaraları"], "siir"),
    ("Mehmet Akif Ersoy, İstiklal Marşı'nı hangi kitabına 'O benim değil, milletimin malıdır' diyerek almamıştır?", "Safahat", ["Gölgeler", "Süleymaniye Kürsüsünde", "Asım"], "siir"),
    ("'Sakarya Türküsü' ve 'Kaldırımlar' şiirleriyle tanınan, 'Üstad' lakaplı şair ve yazarımız kimdir?", "Necip Fazıl Kısakürek", ["Sezai Karakoç", "Cahit Sıtkı Tarancı", "Yahya Kemal Beyatlı"], "siir"),
    ("'Otuz Beş Yaş' şiirinde 'Yaş otuz beş! Yolun yarısı eder / Dante gibi ortasındayız ömrün' diyen şairimiz kimdir?", "Cahit Sıtkı Tarancı", ["Orhan Veli Kanık", "Ahmet Muhip Dıranas", "Ahmet Haşim"], "siir"),
    ("'Sessiz Gemi' ve 'Süleymaniye'de Bayram Sabahı' şiirlerinin usta şairi kimdir?", "Yahya Kemal Beyatlı", ["Tevfik Fikret", "Cenap Şahabettin", "Faruk Nafiz Çamlıbel"], "siir"),
    ("'İstanbul'u Dinliyorum, gözlerim kapalı' dizeleriyle başlayan ünlü şiirin Garip akımı öncüsü şairi kimdir?", "Orhan Veli Kanık", ["Melih Cevdet Anday", "Oktay Rifat", "Edip Cansever"], "siir"),
    ("'Mona Roza' şiiriyle edebiyatımızda iz bırakan şair ve düşünürümüz kimdir?", "Sezai Karakoç", ["Cemal Süreya", "Turgut Uyar", "İsmet Özel"], "siir"),
    ("'Ben sana mecburum bilemezsin / Adını mıh gibi aklımda tutuyorum' dizelerinin sahibi şairimiz kimdir?", "Attila İlhan", ["Cemal Süreya", "Nazım Hikmet", "Özdemir Asaf"], "siir"),
    ("'Uzun ince bir yoldayım / Gidiyorum gündüz gece' dizelerinin sahibi büyük halk ozanımız kimdir?", "Aşık Veysel Şatıroğlu", ["Karacaoğlan", "Pir Sultan Abdal", "Dadaloğlu"], "halk_edebiyati"),
    ("2006 yılında Nobel Edebiyat Ödülü'nü kazanarak bu ödülü alan ilk Türk yazar kim olmuştur?", "Orhan Pamuk", ["Yaşar Kemal", "Elif Şafak", "Aziz Nesin"], "roman"),
    ("Orhan Pamuk'un Doğu-Batı çatışmasını ve Osmanlı nakkaşlarını anlattığı ünlü tarihi romanı hangisidir?", "Benim Adım Kırmızı", ["Kar", "Masumiyet Müzesi", "Cevdet Bey ve Oğulları"], "roman"),
    ("Reşat Nuri Güntekin'in Anadolu'ya öğretmen olarak giden 'Feride' karakterini anlattığı ölümsüz romanı hangisidir?", "Çalıkuşu", ["Yaprak Dökümü", "Acımak", "Yeşil Gece"], "roman"),
    ("'Ali Rıza Bey ve ailesinin' dramını anlatan ve 'Aman Ali Rıza Bey ağzımızın tadı kaçmasın' sözüyle bilinen roman hangisidir?", "Yaprak Dökümü", ["Aşk-ı Memnu", "Mai ve Siyah", "Kiralık Konak"], "roman"),
    ("Halit Ziya Uşaklıgil'in Batılı anlamda ilk başarılı Türk romanlarından sayılan, Bihter ve Behlül karakterlerini barındıran eseri hangisidir?", "Aşk-ı Memnu", ["Mai ve Siyah", "Eylül", "Araba Sevdası"], "roman"),
    ("Türk edebiyatında ilk psikolojik roman olarak kabul edilen 'Eylül' adlı eserin yazarı kimdir?", "Mehmet Rauf", ["Halit Ziya Uşaklıgil", "Recaizade Mahmut Ekrem", "Şemseddin Sami"], "roman"),
    ("Recaizade Mahmut Ekrem'in yanlış Batılılaşmayı 'Bihruz Bey' karakteri üzerinden eleştirdiği romanı hangisidir?", "Araba Sevdası", ["Felatun Bey ile Rakım Efendi", "İntibah", "Taaşşuk-ı Talat ve Fitnat"], "roman"),
    ("Peyami Safa'nın bir gencin hastane odalarındaki psikolojisini anlattığı otobiyografik romanı hangisidir?", "Dokuzuncu Hariciye Koğuşu", ["Fatih-Harbiye", "Yalnızız", "Matmazel Noraliya'nın Koltuğu"], "roman"),
    ("Tarık Buğra'nın Osmanlı Devleti'nin kuruluş sürecini anlattığı ünlü tarihi romanı hangisidir?", "Osmancık", ["Küçük Ağa", "Devlet Ana", "Yorgun Savaşçı"], "roman"),
    ("Kemal Tahir'in Osmanlı'nın kuruluşunu ele aldığı başyapıt romanı hangisidir?", "Devlet Ana", ["Esir Şehrin İnsanları", "Yorgun Savaşçı", "Kurt Kanunu"], "roman"),
    ("Halide Edib Adıvar'ın Kurtuluş Savaşı yıllarını hemşire 'Ayşe' karakteri üzerinden anlattığı romanı hangisidir?", "Ateşten Gömlek", ["Sinekli Bakkal", "Vurun Kahpeye", "Handan"], "roman"),
    ("Yakup Kadri Karaosmanoğlu'nun Kurtuluş Savaşı döneminde bir Anadolu köyündeki aydın-halk kopukluğunu anlattığı romanı hangisidir?", "Yaban", ["Kiralık Konak", "Ankara", "Sodom ve Gomore"], "roman"),
    ("Kaşağı, Yalnız Efe ve Beyaz Lale hikayeleriyle milli edebiyatımızın öncüsü olan büyük hikayecimiz kimdir?", "Ömer Seyfettin", ["Sait Faik Abasıyanık", "Memduh Şevket Esendal", "Refik Halit Karay"], "hikaye"),
    ("Burgazada ve İstanbul öyküleriyle tanınan, 'Semaver' ve 'Lüzumsuz Adam' kitaplarının yazarı kimdir?", "Sait Faik Abasıyanık", ["Orhan Veli", "Haldun Taner", "Sabahattin Ali"], "hikaye"),
    ("Türk dilinin bilinen ilk sözlüğü olan 'Divanü Lügati't-Türk' adlı eseri 11. yüzyılda kim yazmıştır?", "Kaşgarlı Mahmud", ["Yusuf Has Hacib", "Edip Ahmet Yükneki", "Ali Şir Nevai"], "klasik_turk"),
    ("Türk edebiyatında ilk siyasetname ve mesnevi örneği olan 'Kutadgu Bilig' (Mutluluk Veren Bilgi) kimin eseridir?", "Yusuf Has Hacib", ["Kaşgarlı Mahmud", "Hoca Ahmet Yesevi", "Nizamülmülk"], "klasik_turk"),
    ("17. yüzyılda 50 yıla yakın gezdiği yerleri 10 ciltlik 'Seyahatname' eserinde toplayan ünlü Türk gezgini kimdir?", "Evliya Çelebi", ["Katip Çelebi", "Piri Reis", "İbn-i Battuta"], "klasik_turk"),
    ("Divan edebiyatında 'Su Kasidesi' ve 'Leyla ile Mecnun' mesnevisiyle tanınan 16. yüzyıl büyük şairi kimdir?", "Fuzuli", ["Baki", "Nedim", "Nabi"], "divan"),
    ("Mevlana Celaleddin Rumi'nin Farsça olarak kaleme aldığı 6 ciltlik dünyaca ünlü tasavvufi başyapıtı hangisidir?", "Mesnevi", ["Divan-ı Kebir", "Fihi Ma Fih", "Mektubat"], "tasavvuf"),
    ("Victor Hugo'nun 'Sefiller' (Les Misérables) romanında bir somun ekmek çaldığı için kürek mahkumu olan başkahraman kimdir?", "Jean Valjean", ["Müfettiş Javert", "Quasimodo", "Edmond Dantes"], "dunya_edebiyati"),
    ("Alexandre Dumas'nın haksız yere If Şatosu'na hapsedilen bir denizcinin intikamını anlattığı klasik romanı hangisidir?", "Monte Kristo Kontu", ["Üç Silahşörler", "Demir Maskeli Adam", "Siyah Lale"], "dunya_edebiyati"),
    ("Sir Arthur Conan Doyle tarafından yaratılan, Londra Baker Sokağı 221B'de yaşayan ünlü dedektif karakteri kimdir?", "Sherlock Holmes", ["Hercule Poirot", "Müfettiş Clouseau", "Arsen Lüpen"], "dunya_edebiyati"),
    ("Doğu Ekspresinde Cinayet ve On Küçük Zenci (Ve Sonra Hiç Kalmadı) polisiye romanlarının kraliçesi sayılan yazar kimdir?", "Agatha Christie", ["Arthur Conan Doyle", "Edgar Allan Poe", "Georges Simenon"], "dunya_edebiyati"),
    ("İhtiyar Adam ve Deniz ile Çanlar Kimin İçin Çalıyor romanlarının Nobel ödüllü Amerikalı yazarı kimdir?", "Ernest Hemingway", ["John Steinbeck", "Jack London", "Mark Twain"], "dunya_edebiyati"),
    ("Fareler ve İnsanlar ile Gazap Üzümleri romanlarının yazarı kimdir?", "John Steinbeck", ["Ernest Hemingway", "William Faulkner", "Jack London"], "dunya_edebiyati"),
    ("Beyaz Diş, Vahşetin Çağrısı ve Martin Eden romanlarının macera tutkunu yazarı kimdir?", "Jack London", ["Jules Verne", "Herman Melville", "Daniel Defoe"], "dunya_edebiyati"),
    ("Seksen Günde Devriâlem ve Denizler Altında Yirmi Bin Fersah romanlarıyla bilimkurgunun öncüsü sayılan Fransız yazar kimdir?", "Jules Verne", ["H.G. Wells", "Isaac Asimov", "Alexandre Dumas"], "dunya_edebiyati"),
    ("Satranç, Bilinmeyen Bir Kadının Mektubu ve Amok Koşucusu kitaplarının Avusturyalı yazarı kimdir?", "Stefan Zweig", ["Franz Kafka", "Albert Camus", "Hermann Hesse"], "dunya_edebiyati"),
    ("Cengiz Aytmatov'un 'Selvi Boylum Al Yazmalım', 'Gün Olur Asra Bedel' ve 'Cemile' eserleri hangi Türk halkının edebiyatını dünyaya tanıtmıştır?", "Kırgız Edebiyatı", ["Kazak Edebiyatı", "Özbek Edebiyatı", "Azerbaycan Edebiyatı"], "turk_dunyasi"),
    ("Osman Hamdi Bey'in 1906 yılında yaptığı ve Türk resim sanatının en ikonik eseri sayılan tablosu hangisidir?", "Kaplumbağa Terbiyecisi", ["Silah Tacirleri", "Kur'an Okuyan Kız", "Narlar ve Ayvalar"], "resim"),
    ("Edvard Munch tarafından resmedilen, köprü üzerinde ellerini yüzüne götürmüş figürle endişeyi simgeleyen ünlü tablo hangisidir?", "Çığlık (The Scream)", ["Guernica", "Gece Devriyesi", "İnci Küpeli Kız"], "resim"),
]

for q, ans, wr, st in edebiyat_ozel:
    all_questions.append(make_q("Sanat & Edebiyat", q, ans, wr, 20, st))

# ==============================================================================
# 7. VIP: MATEMATİK & MANTIK (Mantık Bilmeceleri, Geometri, Sayı Dizileri, Olasılık, Pratik Hesap)
# ==============================================================================
mantik_ozel = [
    ("Bir koşu yarışında 2. sıradaki koşucuyu geçerseniz kaçıncı sırada olursunuz?", "2. sırada", ["1. sırada", "3. sırada", "4. sırada"], "bilmece"),
    ("Bir doktor size 3 hap veriyor ve bunları yarımşar saat arayla içmenizi söylüyor. Hapların tamamını bitirmeniz ne kadar sürer?", "1 saat (İlkini hemen, ikincisini 30. dk, üçüncüsünü 60. dk)", ["1,5 saat", "2 saat", "45 dakika"], "bilmece"),
    ("Bazı aylar 30, bazı aylar 31 gündür. Peki bir yılda kaç ayda 28 gün vardır?", "12 ayın hepsinde (Her ayda 28. gün vardır)", ["Sadece 1 ayda (Şubat)", ["4 yılda bir 1 ayda", "Hiçbirinde"][0], "6 ayda"], "bilmece"),
    ("Bir çiftçinin 17 koyunu vardır. Sürüde salgın hastalık çıkar ve 9'u hariç hepsi ölür. Çiftçinin kaç canlı koyunu kalmıştır?", "9 koyun", ["8 koyun", "17 koyun", "0 koyun"], "bilmece"),
    ("3 kedi 3 fareyi 3 dakikada yakalarsa, 100 kedi 100 fareyi aynı hızla kaç dakikada yakalar?", "3 dakikada", ["100 dakikada", "30 dakikada", "1 dakikada"], "mantik"),
    ("Bir gölde nilüfer yaprakları her gün iki katına çıkıyor. Gölün tamamı 48 günde kaplandığına göre, gölün yarısı kaçıncı günde kaplanmıştır?", "47. günde", ["24. günde", "46. günde", "12. günde"], "mantik"),
    ("Bir saatte yelkovan ile akrep tam saat 03:00'ü gösterirken aralarındaki küçük açı kaç derecedir?", "90 derece", ["60 derece", "45 derece", "120 derece"], "geometri"),
    ("Bir üçgenin iç açılarının toplamı kaç derecedir?", "180 derece", ["360 derece", "90 derece", "270 derece"], "geometri"),
    ("Bir dik üçgende dik kenarların uzunlukları 3 cm ve 4 cm ise, hipotenüs (en uzun kenar) kaç cm'dir?", "5 cm", ["6 cm", "7 cm", "12 cm"], "geometri"),
    ("Bir dik üçgende dik kenarlar 6 cm ve 8 cm ise hipotenüs kaç cm'dir?", "10 cm", ["12 cm", "14 cm", "9 cm"], "geometri"),
    ("Kenar uzunluğu 8 cm olan bir karenin alanı kaç santimetrekaredir?", "64 cm²", ["32 cm²", "16 cm²", "48 cm²"], "geometri"),
    ("Kenar uzunluğu 9 cm olan bir karenin çevresi kaç santimetredir?", "36 cm", ["81 cm", "18 cm", "27 cm"], "geometri"),
    ("Bir küpün toplam kaç yüzeyi (yüzü) ve kaç ayrıtı (kenarı) vardır?", "6 yüzü, 12 ayrıtı", ["4 yüzü, 8 ayrıtı", "6 yüzü, 8 ayrıtı", "8 yüzü, 12 ayrıtı"], "geometri"),
    ("Hem asal sayı olan hem de çift sayı olan tek doğal sayı kaçtır?", "2", ["0", "1", "4"], "sayilar"),
    ("1'den 10'a kadar olan asal sayıların toplamı (2 + 3 + 5 + 7) kaçtır?", "17", ["15", "18", "19"], "sayilar"),
    ("İki basamaklı en büyük asal sayı kaçtır?", "97", ["99", "93", "91"], "sayilar"),
    ("Üç basamaklı en küçük doğal sayı ile iki basamaklı en büyük doğal sayının farkı kaçtır?", "1 (100 - 99)", ["10", "11", "9"], "sayilar"),
    ("Fibonacci sayı dizisinde (1, 1, 2, 3, 5, 8, 13, 21, ?) soru işareti yerine hangi sayı gelmelidir?", "34", ["29", "32", "35"], "dizi"),
    ("Sayı dizisinde sıradaki sayı kaçtır? 2, 6, 18, 54, ?", "162 (Her adımda 3 ile çarpılıyor)", ["108", "154", "216"], "dizi"),
    ("Sayı dizisinde sıradaki sayı kaçtır? 1, 4, 9, 16, 25, 36, ?", "49 (Tam kare sayılar: 7²)", ["42", "48", "64"], "dizi"),
    ("Sayı dizisinde sıradaki sayı kaçtır? 100, 95, 85, 70, 50, ?", "25 (-5, -10, -15, -20, -25 azalıyor)", ["30", "20", "35"], "dizi"),
    ("Bir sepette 5 elma var. Sepetten 3 elma alırsanız sizin kaç elmanız olur?", "3 elmanız olur (Aldığınız elmalar sizdedir)", ["2 elma", "5 elma", "8 elma"], "bilmece"),
    ("Bir terzi 12 metrelik bir kumaşı her seferinde 2 metre keserek parçalara ayıracaktır. Her kesim 1 dakika sürerse iş kaç dakikada biter?", "5 dakikada (Son parça 5. kesimde kendiliğinden ayrılır)", ["6 dakikada", "12 dakikada", "4 dakikada"], "mantik"),
    ("Bir baba 36, oğlu 12 yaşındadır. Kaç yıl sonra babanın yaşı oğlunun yaşının tam 2 katı olur?", "12 yıl sonra (Baba 48, oğul 24 olur)", ["6 yıl sonra", "10 yıl sonra", "8 yıl sonra"], "problem"),
    ("Saatte 90 km sabit hızla giden bir otomobil, 2 saat 20 dakikada toplam kaç kilometre yol alır?", "210 km", ["180 km", "200 km", "225 km"], "problem"),
    ("Fiyatı 200 TL olan bir ürüne önce %20 zam yapılıp, ardından yeni fiyat üzerinden %20 indirim yapılırsa son fiyatı kaç TL olur?", "192 TL", ["200 TL", "180 TL", "196 TL"], "problem"),
    ("Bir sınıfta 15 kız ve 10 erkek öğrenci vardır. Bu sınıftan rastgele seçilen bir öğrencinin erkek olma olasılığı yüzde kaçtır?", "%40", ["%25", "%50", "%60"], "olasilik"),
    ("Hilesiz bir zar havaya atıldığında üst yüze 4'ten büyük bir sayı (5 veya 6) gelme olasılığı nedir?", "1/3 (2/6)", ["1/2", "1/6", "2/3"], "olasilik"),
    ("Pi (π) sayısının virgülden sonraki ilk iki basamağı ile birlikte yaklaşık değeri nedir?", "3,14", ["3,41", "2,71", "3,16"], "matematik"),
    ("Herhangi bir sıfırdan farklı sayının 0. kuvveti (örneğin 25⁰) kaça eşittir?", "1", ["0", "25", "-1"], "matematik"),
    ("144 sayısının karekökü (√144) kaçtır?", "12", ["11", "13", "14"], "matematik"),
    ("225 sayısının karekökü (√225) kaçtır?", "15", ["14", "16", "25"], "matematik"),
    ("5 faktöriyel (5! = 5 × 4 × 3 × 2 × 1) işleminin sonucu kaçtır?", "120", ["60", "100", "24"], "matematik"),
    ("Bir düzine kalem ile iki deste kalemin toplamı kaç kalem eder?", "32 kalem (12 + 20)", ["22 kalem", "34 kalem", "24 kalem"], "problem"),
    ("Roma rakamlarında 'L', 'C' ve 'M' harfleri sırasıyla hangi sayıları temsil eder?", "50, 100 ve 1000", ["50, 500 ve 1000", ["10, 50 ve 100", "100, 500 ve 1000"][0], "5, 50 ve 500"], "matematik"),
    ("Roma rakamıyla 'MMXXIV' hangi sayıyı ifade eder?", "2024", ["2014", "1924", "2204"], "matematik"),
    ("Bir otobüste 10 yolcu var. İlk durakta 4 kişi indi, 7 kişi bindi. İkinci durakta 3 kişi indi, şoför dahil otobüste kaç kişi vardır?", "11 kişi (10 yolcu + 1 şoför)", ["10 kişi", "12 kişi", "9 kişi"], "bilmece"),
    ("Hızlı Hesaplama: 25 × 16 işleminin sonucu kaçtır?", "400", ["350", "425", "450"], "hesap"),
    ("Hızlı Hesaplama: (15 × 15) - 25 işleminin sonucu kaçtır?", "200", ["225", "175", "150"], "hesap"),
    ("Bir satranç turnuvasında 6 oyuncu herkes birbiriyle tek maç yapacak şekilde karşılaşırsa toplam kaç maç oynanır?", "15 maç", ["12 maç", "30 maç", "18 maç"], "mantik"),
]

for q, ans, wr, st in mantik_ozel:
    all_questions.append(make_q("Matematik & Mantık", q, ans, wr, 20, st))

# ==============================================================================
# 8. VIP: SPOR (Futbol, Süper Lig, Dünya Kupası, Olimpiyatlar, Basketbol, Voleybol, Rekorlar)
# ==============================================================================
spor_ozel = [
    ("2000 yılında UEFA Kupası ve UEFA Süper Kupası'nı kazanarak Türk futbol tarihinde bir ilki başaran kulübümüz hangisidir?", "Galatasaray", ["Fenerbahçe", "Beşiktaş", "Trabzonspor"], "futbol"),
    ("A Milli Futbol Takımımız, FIFA Dünya Kupası tarihinde üçüncülük başarısını hangi yılda elde etmiştir?", "2002 (Güney Kore - Japonya)", ["1954", "2008", "1996"], "milli_takim"),
    ("2002 Dünya Kupası'nda ev sahibi Güney Kore'ye 10.8 saniyede gol atarak Dünya Kupası tarihinin en hızlı golünü atan futbolcumuz kimdir?", "Hakan Şükür", ["İlhan Mansız", "Hasan Şaş", "Nihat Kahveci"], "milli_takim"),
    ("Süper Lig tarihinde bir sezonu hiç yenilgi almadan 'Namağlup Şampiyon' tamamlayan tek takımımız hangisidir?", "Beşiktaş (1991-1992 sezonu)", ["Galatasaray", "Fenerbahçe", "Trabzonspor"], "super_lig"),
    ("Süper Lig'de şampiyonluk sevinci yaşayan Anadolu kulüplerimizden 'Trabzonspor' dışında şampiyon olan diğer iki takım hangileridir?", "Bursaspor ve Başakşehir", ["Eskişehirspor ve Sivasspor", "Göztepe ve Kocaelispor", "Samsunspor ve Konyaspor"], "super_lig"),
    ("Olimpiyat tarihinde üst üste 3 kez (1988, 1992, 1996) altın madalya kazanan ve 'Cep Herkülü' lakabıyla tanınan efsane haltercimiz kimdir?", "Naim Süleymanoğlu", ["Halil Mutlu", "Nurcan Taylan", "Taner Sağır"], "olimpiyat"),
    ("Naim Süleymanoğlu gibi üst üste 3 Olimpiyat altın madalyası kazanan 'Küçük Dev Adam' lakaplı şampiyon haltercimiz kimdir?", "Halil Mutlu", ["Hafız Süleymanoğlu", "İzzet İnce", "Sunay Bulut"], "olimpiyat"),
    ("2020 Tokyo Olimpiyatları'nda okçuluk branşında Türkiye'ye tarihteki ilk olimpiyat altın madalyasını kazandıran sporcumuz kimdir?", "Mete Gazoz", ["Rıza Kayaalp", "Taha Akgül", "Busenaz Sürmeneli"], "olimpiyat"),
    ("2023 yılında FIVB Milletler Ligi ve Avrupa Şampiyonası'nda altın madalya kazanarak dünya 1 numarasına yükselen kadın milli takımımızın unvanı nedir?", "Filenin Sultanları (A Milli Kadın Voleybol Takımı)", ["Potanın Perileri", ["Ay-Yıldızlı Melekler", "Sultans of the Court"][0], "Altın Kızlar"], "voleybol"),
    ("2017 yılında Basketbol EuroLeague (THY Avrupa Ligi) şampiyonu olarak Türk erkek basketbol tarihinde bu kupayı ilk kez kazanan takımımız hangisidir?", "Fenerbahçe", ["Anadolu Efes", "Galatasaray", "Beşiktaş"], "basketbol"),
    ("2021 ve 2022 yıllarında üst üste iki kez EuroLeague şampiyonu olma başarısı gösteren Türk basketbol takımımız hangisidir?", "Anadolu Efes", ["Fenerbahçe", "Türk Telekom", "Darüşşafaka"], "basketbol"),
    ("FIFA Dünya Kupası'nı tarihinde 5 kez kazanarak bu alanda rekoru elinde bulunduran ülke hangisidir?", "Brezilya", ["Almanya", "İtalya", "Arjantin"], "dunya_kupasi"),
    ("2022 Katar FIFA Dünya Kupası'nda finalde Fransa'yı penaltılarla yenerek şampiyon olan ve Lionel Messi'nin kaptanlığını yaptığı ülke hangisidir?", "Arjantin", ["Brezilya", "Hırvatistan", "İspanya"], "dunya_kupasi"),
    ("UEFA Şampiyonlar Ligi'ni tarihinde en çok (15 kez) kazanan Avrupa kulübü hangisidir?", "Real Madrid", ["AC Milan", "Bayern Münih", "Liverpool"], "futbol"),
    ("Kariyerinde 8 kez 'Ballon d'Or' (Altın Top) ödülünü kazanarak dünya rekoru kıran futbolcu kimdir?", "Lionel Messi", ["Cristiano Ronaldo", "Zinedine Zidane", "Johan Cruyff"], "futbol"),
    ("1986 Dünya Kupası'nda İngiltere'ye attığı gollerden birini 'Tanrının Eli' olarak tanımlayan Arjantinli futbol efsanesi kimdir?", "Diego Armando Maradona", ["Pele", "Gabriel Batistuta", "Mario Kempes"], "futbol"),
    ("NBA tarihinde Chicago Bulls formasıyla 6 şampiyonluk yaşayan ve 'Majesteleri' (Air Jordan) lakabıyla bilinen basketbol efsanesi kimdir?", "Michael Jordan", ["Kobe Bryant", "LeBron James", "Magic Johnson"], "basketbol"),
    ("NBA tarihinde tüm zamanların en çok sayı atan oyuncusu rekorunu Kareem Abdul-Jabbar'dan devralan yıldız kimdir?", "LeBron James", ["Stephen Curry", "Kevin Durant", "Shaquille O'Neal"], "basketbol"),
    ("100 metre koşuda 9.58 saniyelik derecesiyle dünya rekorunu elinde bulunduran Jamaikalı rekortmen atlet kimdir?", "Usain Bolt", ["Carl Lewis", "Tyson Gay", "Yohan Blake"], "atletizm"),
    ("Olimpiyat oyunları tarihinde toplam 23 altın madalya kazanarak tüm zamanların en çok altın madalyalı sporcusu olan ABD'li yüzücü kimdir?", "Michael Phelps", ["Mark Spitz", "Ian Thorpe", "Ryan Lochte"], "olimpiyat"),
    ("Kelebek gibi uçarım, arı gibi sokarım sözüyle hafızalara kazınan tüm zamanların en büyük ağır sıklet boksörü kimdir?", "Muhammed Ali", ["Mike Tyson", "George Foreman", "Joe Frazier"], "boks"),
    ("Teniste sezonun en büyük 4 turnuvası olan 'Grand Slam' turnuvalarından hangisi çim kortta oynanır?", "Wimbledon (İngiltere)", ["Roland Garros (Fransa)", "Avustralya Açık", "ABD Açık"], "tenis"),
    ("Formula 1 tarihinde 7'şer kez dünya şampiyonu olarak rekoru paylaşan iki efsane pilot kimlerdir?", "Michael Schumacher ve Lewis Hamilton", ["Ayrton Senna ve Max Verstappen", "Alain Prost ve Sebastian Vettel", "Niki Lauda ve Fernando Alonso"], "motorspor"),
    ("Dünya Süperbike (WSBK) Şampiyonası'nda 2021 ve 2024 yıllarında dünya şampiyonu olan milli motosikletçimiz kimdir?", "Toprak Razgatlıoğlu", ["Kenan Sofuoğlu", "Can Öncü", "Deniz Öncü"], "motorspor"),
    ("Dünya Supersport Şampiyonası'nda 5 kez dünya şampiyonu olarak rekor kıran milli motosikletçimiz kimdir?", "Kenan Sofuoğlu", ["Toprak Razgatlıoğlu", "Şakir Şenkalaycı", "Bahattin Sofuoğlu"], "motorspor"),
    ("660 yılı aşkın süredir Edirne Sarayiçi'nde düzenlenen dünyanın en eski güreş organizasyonu hangisidir?", "Kırkpınar Yağlı Güreşleri", ["Elmalı Güreşleri", "Kurtdereli Güreşleri", "Yaşar Doğu Güreşleri"], "geleneksel"),
    ("Grekoromen güreşte 130 kiloda 12 kez Avrupa, 5 kez Dünya şampiyonu olan milli güreşçimiz kimdir?", "Rıza Kayaalp", ["Taha Akgül", "Hamza Yerlikaya", "Celal Atik"], "gures"),
    ("Serbest güreşte Olimpiyat, Dünya ve Avrupa şampiyonlukları bulunan 'Asrın Güreşçisi' unvanlı sporcumuz kimdir?", "Hamza Yerlikaya", ["Yaşar Doğu", "Gazanfer Bilge", "Mahmut Demir"], "gures"),
    ("Bir futbol maçında aynı oyuncunun tek maçta 3 gol birden atmasına ne ad verilir?", "Hat-trick", ["Double", "Poker", "Asist"], "futbol"),
    ("Voleybolda bir takımın seti kazanabilmesi için (5. karar seti hariç) en az iki sayı farkla kaç sayıya ulaşması gerekir?", "25 sayı", ["21 sayı", "15 sayı", "30 sayı"], "voleybol"),
    ("Basketbolda bir takım sahada aynı anda kaç oyuncu ile mücadele eder?", "5 oyuncu", ["6 oyuncu", "7 oyuncu", "11 oyuncu"], "basketbol"),
    ("Olimpiyat bayrağındaki iç içe geçmiş 5 renkli halka neyi temsil etmektedir?", "Dünyadaki 5 ana kıtayı", ["İlk 5 kurucu ülkeyi", "5 temel spor dalını", "Antik Yunan'daki 5 şehri"], "olimpiyat"),
    ("Türkiye'ye Olimpiyat tarihindeki ilk altın madalyayı 1936 Berlin Olimpiyatları'nda güreş branşında kazandıran sporcumuz kimdir?", "Yaşar Erkan", ["Gazanfer Bilge", "Celal Atik", "Müzahir Sille"], "olimpiyat"),
    ("Serbest dalışta dünya rekorları kıran milli sualtı sporcumuz kimdir?", "Şahika Ercümen", ["Yasemin Dalkılıç", "Sümeyye Boyacı", "Viktoria Zeynep Güneş"], "su_sporlari"),
    ("Artistik cimnastikte halka aletinde Türkiye'ye tarihteki ilk Dünya Şampiyonluğu ve Olimpiyat madalyasını kazandıran sporcumuz kimdir?", "İbrahim Çolak", ["Ferhat Arıcan", "Adem Asil", "Ahmet Önder"], "cimnastik"),
    ("Boksta 2020 Tokyo Olimpiyatları'nda altın madalya kazanan milli kadın boksörümüz kimdir?", "Busenaz Sürmeneli", ["Buse Naz Çakıroğlu", "Hatice Akbaş", "Esra Yıldız"], "boks"),
    ("Fenerbahçe, Galatasaray ve Beşiktaş'ın yanı sıra Türk futbolunda 'Dört Büyükler'i tamamlayan Karadeniz temsilcisi hangisidir?", "Trabzonspor", ["Samsunspor", "Çaykur Rizespor", "Giresunspor"], "futbol"),
    ("Türk futbolunda 'Metin - Ali - Feyyaz' üçlüsü hangi kulübümüzün efsane kadrosunda yer almıştır?", "Beşiktaş", ["Galatasaray", "Fenerbahçe", "Trabzonspor"], "futbol"),
    ("Fenerbahçe'de 103 gollü rekor şampiyonlukta ve A Milli Takım'da forma giyen 'Şeytan' lakaplı futbolcumuz kimdir?", "Rıdvan Dilmen", ["Aykut Kocaman", "Oğuz Çetin", "Tanju Çolak"], "futbol"),
    ("1987-88 sezonunda attığı 39 golle hem Türkiye Gol Kralı olan hem de 'Avrupa Altın Ayakkabı' ödülünü kazanan tek Türk futbolcu kimdir?", "Tanju Çolak", ["Metin Oktay", "Hakan Şükür", "Burak Yılmaz"], "futbol"),
]

for q, ans, wr, st in spor_ozel:
    all_questions.append(make_q("Spor", q, ans, wr, 20, st))

# Tekillik kontrolü
seen = set()
unique_questions = []
for q in all_questions:
    norm = q["question"].strip().lower()
    if norm not in seen:
        seen.add(norm)
        unique_questions.append(q)

random.shuffle(unique_questions)

out_path = r"C:\Users\legen\.gemini\antigravity\scratch\tv-party-trivia\questions.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(unique_questions, f, ensure_ascii=False, indent=2)

print(f"TAMAMLANDI! Toplam %100 BENZERSİZ (0 Kopya) Soru Sayısı: {len(unique_questions)}")
by_cat = {}
for q in unique_questions:
    by_cat[q["category"]] = by_cat.get(q["category"], 0) + 1
for k, v in by_cat.items():
    print(f" - {k}: {v} benzersiz soru")
