const fs = require('fs');
const net = require('net');

const FTP_HOST = '192.168.1.5';
const FTP_PORT = 4887;
const FTP_USER = 'pc';
const FTP_PASS = '263393';
const LOCAL_FILE = 'C:/Users/legen/.gemini/antigravity/scratch/tv-party-trivia/Bil_Bakalim_TV.apk';

function sendFtp() {
  const fileBuffer = fs.readFileSync(LOCAL_FILE);
  console.log(`Dosya okundu: ${fileBuffer.length} bayt`);

  const client = net.createConnection({ host: FTP_HOST, port: FTP_PORT }, () => {
    console.log('TV FTP sunucusuna baglanildi.');
  });

  let state = 'INIT';

  client.on('data', (data) => {
    const msg = data.toString();
    console.log('<<', msg.trim());

    if (state === 'INIT' && msg.startsWith('220')) {
      state = 'USER';
      client.write(`USER ${FTP_USER}\r\n`);
    } else if (state === 'USER' && msg.startsWith('331')) {
      state = 'PASS';
      client.write(`PASS ${FTP_PASS}\r\n`);
    } else if (state === 'PASS' && msg.startsWith('230')) {
      state = 'TYPE';
      client.write('TYPE I\r\n');
    } else if (state === 'TYPE' && msg.startsWith('200')) {
      state = 'PASV';
      client.write('PASV\r\n');
    } else if (state === 'PASV' && msg.startsWith('227')) {
      const match = msg.match(/\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
      if (!match) {
        console.error('PASV port ayrıştırma hatası');
        client.end();
        return;
      }
      const dataPort = (parseInt(match[5]) << 8) + parseInt(match[6]);
      console.log(`Veri kanali aciliyor: ${FTP_HOST}:${dataPort}`);

      const dataClient = net.createConnection({ host: FTP_HOST, port: dataPort }, () => {
        console.log('Veri kanalina baglanildi, dosya aktarimi baslatiliyor...');
        dataClient.write(fileBuffer, () => {
          console.log('Dosya verisi gonderildi, veri kanali kapatiliyor...');
          dataClient.end();
        });
      });

      dataClient.on('error', (err) => console.error('Data error:', err.message));

      state = 'STOR';
      client.write('STOR Bil_Bakalim_TV.apk\r\n');
    } else if (state === 'STOR') {
      if (msg.startsWith('150') || msg.startsWith('125')) {
        console.log('Sunucu dosya alimini baslatti...');
      } else if (msg.startsWith('226')) {
        console.log('🎉 TEBRİKLER! Dosya TV\'ye başarıyla yüklendi!');
        client.write('QUIT\r\n');
      }
    } else if (msg.startsWith('221')) {
      console.log('Oturum kapatildi.');
      process.exit(0);
    }
  });

  client.on('error', (err) => {
    console.error('FTP Kontrol Kanali Hatasi:', err.message);
  });
}

sendFtp();
