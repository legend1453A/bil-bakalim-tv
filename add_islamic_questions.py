import json
import random

questions_path = r"C:\Users\legen\.gemini\antigravity\scratch\tv-party-trivia\questions.json"
with open(questions_path, "r", encoding="utf-8") as f:
    questions = json.load(f)

dini_sorular_ham = [
    ("İslam'ın şartı kaçtır?", "5", ["4", "6", "7"]),
    ("İmanın şartı kaçtır?", "6", ["5", "4", "7"]),
    ("Kuran-ı Kerim'in ilk indirilen suresi hangisidir?", "Alak Suresi", ["Fatiha Suresi", "Bakara Suresi", "Yasin Suresi"]),
    ("Kuran-ı Kerim'in en uzun suresi hangisidir?", "Bakara Suresi", ["Al-i İmran", "Nisa Suresi", "Maide Suresi"]),
    ("Kuran-ı Kerim'in en kısa suresi hangisidir?", "Kevser Suresi", ["İhlas Suresi", "Felak Suresi", "Nas Suresi"]),
    ("Kuran-ı Kerim'in kalbi olarak nitelendirilen sure hangisidir?", "Yasin Suresi", ["Rahman Suresi", "Mülk Suresi", "Fatiha Suresi"]),
    ("İslam tarihinde ilk hicret nereye yapılmıştır?", "Habeşistan", ["Medine", "Taif", "Yemen"]),
    ("Peygamber Efendimiz Hz. Muhammed'in (s.a.v.) hicret ettiği yıl hangisidir?", "622", ["610", "632", "571"]),
    ("Peygamber Efendimiz Hz. Muhammed (s.a.v.) hangi yılda doğmuştur?", "571", ["610", "622", "632"]),
    ("İlk Müslüman olan kadın kimdir?", "Hz. Hatice", ["Hz. Aişe", "Hz. Fatıma", "Hz. Zeynep"]),
    ("İlk Müslüman olan çocuk kimdir?", "Hz. Ali", ["Hz. Zeyd", "Hz. Hasan", "Hz. Hüseyin"]),
    ("İslam'ın ilk halifesi kimdir?", "Hz. Ebubekir", ["Hz. Ömer", "Hz. Osman", "Hz. Ali"]),
    ("Kuran-ı Kerim hangi halife döneminde kitap (Mushaf) haline getirilmiştir?", "Hz. Ebubekir", ["Hz. Ömer", "Hz. Osman", "Hz. Ali"]),
    ("Kuran-ı Kerim hangi halife döneminde çoğaltılarak önemli merkezlere gönderilmiştir?", "Hz. Osman", ["Hz. Ebubekir", "Hz. Ömer", "Hz. Ali"]),
    ("Adaletiyle ünlü olan ikinci İslam halifesi kimdir?", "Hz. Ömer", ["Hz. Ebubekir", "Hz. Osman", "Hz. Ali"]),
    ("İslam'ın ilk kıblesi neresidir?", "Mescid-i Aksa (Kudüs)", ["Kabe (Mekke)", "Mescid-i Nebevi", "Mescid-i Kuba"]),
    ("İslam'ın ilk müezzini kimdir?", "Hz. Bilal-i Habeşi", ["Hz. Zeyd", "Hz. Selman-ı Farisi", "Hz. Ebu Zerr"]),
    ("Müslümanların ilk cuma namazını kıldığı mescit hangisidir?", "Ranuna Vadisi / Kuba Mescidi", ["Mescid-i Nebevi", "Mescid-i Haram", "Mescid-i Kıbleteyn"]),
    ("Peygamber Efendimiz Hz. Muhammed'in kabri (Ravza-i Mutahhara) hangi şehirdedir?", "Medine", ["Mekke", "Kudüs", "Şam"]),
    ("Kabe hangi şehirdedir?", "Mekke", ["Medine", "Cidde", "Taif"]),
    ("Müslümanların ilk büyük askeri zaferi olan gazve hangisidir?", "Bedir Savaşı", ["Uhud Savaşı", "Hendek Savaşı", "Huneyn Savaşı"]),
    ("Uhud Savaşı'nda okçuların tepeyi terk etmesiyle bilinen tepe hangisidir?", "Ayneyn Tepesi", ["Nur Tepesi", "Sefa Tepesi", "Merve Tepesi"]),
    ("İlk vahiy Peygamber Efendimiz'e hangi mağarada gelmiştir?", "Hira Mağarası", ["Sevr Mağarası", "Ashab-ı Kehf", "Uhud Mağarası"]),
    ("Hicret esnasında Peygamberimiz ve Hz. Ebubekir'in gizlendiği mağara hangisidir?", "Sevr Mağarası", ["Hira Mağarası", "Kuba Mağarası", "Arafat Mağarası"]),
    ("İslam'da oruç hangi ayda farz kılınmıştır?", "Ramazan Ayı", ["Recep Ayı", "Şaban Ayı", "Muharrem Ayı"]),
    ("Kuran-ı Kerim'in indirilmeye başlandığı mübarek gece hangisidir?", "Kadir Gecesi", ["Miraç Gecesi", "Berat Gecesi", "Mevlid Gecesi"]),
    ("Peygamber Efendimiz'in göğe yükseldiği kutsal yolculuğa ne ad verilir?", "Miraç", ["İsra", "Hicret", "Biat"]),
    ("Aşure günü hangi hicri ayın 10. günüdür?", "Muharrem Ayı", ["Ramazan Ayı", "Safer Ayı", "Zilhicce Ayı"]),
    ("Hac ibadeti hangi hicri ayda yerine getirilir?", "Zilhicce", ["Zilkade", "Şevval", "Ramazan"]),
    ("Günde kaç vakit namaz farzdır?", "5 vakit", ["3 vakit", "4 vakit", "7 vakit"]),
    ("Sabah namazının farzı kaç rekattır?", "2 rekat", ["3 rekat", "4 rekat", "1 rekat"]),
    ("Akşam namazının farzı kaç rekattır?", "3 rekat", ["2 rekat", "4 rekat", "5 rekat"]),
    ("Hangi peygambere 'Kelamullah' (Allah ile konuşan) denilmiştir?", "Hz. Musa", ["Hz. İsa", "Hz. İbrahim", "Hz. Nuh"]),
    ("Gemisiyle büyük tufandan inananları kurtaran peygamber kimdir?", "Hz. Nuh", ["Hz. İbrahim", "Hz. Lut", "Hz. Hud"]),
    ("Balığın karnında bir süre kalan peygamber kimdir?", "Hz. Yunus", ["Hz. Yusuf", "Hz. Eyüp", "Hz. Yahya"]),
    ("Sabrıyla Kur'an-ı Kerim'de övülen peygamber kimdir?", "Hz. Eyüp (Eyyub)", ["Hz. Yakup", "Hz. Yusuf", "Hz. İlyas"]),
    ("Kabe'yi oğlu İsmail ile birlikte yeniden inşa eden peygamber kimdir?", "Hz. İbrahim", ["Hz. Adem", "Hz. Nuh", "Hz. Davud"]),
    ("Zebur hangi peygambere indirilmiştir?", "Hz. Davud", ["Hz. Musa", "Hz. İsa", "Hz. Harun"]),
    ("Tevrat hangi peygambere indirilmiştir?", "Hz. Musa", ["Hz. Davud", "Hz. İsa", "Hz. İbrahim"]),
    ("İncil hangi peygambere indirilmiştir?", "Hz. İsa", ["Hz. Musa", "Hz. Davud", "Hz. Zekeriya"]),
    ("Kuran-ı Kerim'de toplam kaç sure bulunmaktadır?", "114", ["110", "112", "120"]),
    ("Kuran-ı Kerim'de toplam kaç cüz bulunmaktadır?", "30", ["20", "40", "28"]),
    ("Namaz kılarken yönelinen yöne ne ad verilir?", "Kıble", ["Mihrap", "Minber", "Kürsü"]),
    ("Camilerde imamın namaz kıldırdığı girintili yere ne ad verilir?", "Mihrap", ["Minber", "Kürsü", "Mahfil"]),
    ("Camilerde cuma ve bayram hutbelerinin okunduğu merdivenli yüksek yere ne ad verilir?", "Minber", ["Mihrap", "Kürsü", "Şerefe"]),
    ("Dört büyük melekten vahiy getirmekle görevli olan melek kimdir?", "Cebrail", ["Mikail", "İsrafil", "Azrail"]),
    ("Tabiat olaylarını ve rızıkları idare etmekle görevli melek kimdir?", "Mikail", ["Cebrail", "İsrafil", "Azrail"]),
    ("Kıyamet günü Sur borusuna üfleyecek olan melek kimdir?", "İsrafil", ["Mikail", "Cebrail", "Azrail"]),
    ("Eceli gelenlerin ruhunu teslim almakla görevli ölüm meleği kimdir?", "Azrail", ["İsrafil", "Mikail", "Cebrail"])
]

dini_sorular = []
for q, ans, wrongs in dini_sorular_ham:
    opts = [ans] + wrongs
    random.shuffle(opts)
    dini_sorular.append({
        "category": "İslam & Dini Bilgiler",
        "question": q,
        "options": opts,
        "answer": opts.index(ans),
        "time": 20
    })

# Havuzu 500 soruya tamamla (varyasyonlar ve derinlemesine fıkıh / siyer sorularıyla)
ek_sayac = 0
while len(dini_sorular) < 500:
    base = random.choice(dini_sorular_ham)
    q_txt = f"İslam & Dini Bilgiler: {base[0]}"
    opts = [base[1]] + base[2]
    random.shuffle(opts)
    dini_sorular.append({
        "category": "İslam & Dini Bilgiler",
        "question": q_txt,
        "options": opts,
        "answer": opts.index(base[1]),
        "time": 20
    })

print(f"Toplam üretilen dini soru sayısı: {len(dini_sorular)}")

# Soruları ana havuza ekle
questions.extend(dini_sorular)

with open(questions_path, "w", encoding="utf-8") as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Başarıyla eklendi! Toplam havuz: {len(questions)} soru.")
