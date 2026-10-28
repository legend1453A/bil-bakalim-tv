// Web Audio API ile tamamen bağımsız ve sıfır gecikmeli ses sentezleyici
class SoundFX {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch(e) {}
  }

  playUrgentTick() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch(e) {}
  }

  // 💓 Gerilim Kalp Atışı (Son 5 Saniye: Lub-Dub... Lub-Dub...)
  playHeartbeat() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      // 1. Vuruş (Lub)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(85, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // 2. Vuruş (Dub)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(70, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(30, now + 0.32);
      gain2.gain.setValueAtTime(0.35, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.32);
    } catch(e) {}
  }

  // 🏆 BÜYÜK ŞAMPİYONLUK FANFARI (Podyum & Havai Fişek Açılışı)
  playVictoryFanfare() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const fanfareNotes = [
        { f: 523.25, t: 0.0, d: 0.18 }, // C5
        { f: 523.25, t: 0.18, d: 0.18 }, // C5
        { f: 523.25, t: 0.36, d: 0.18 }, // C5
        { f: 659.25, t: 0.54, d: 0.35 }, // E5
        { f: 523.25, t: 0.90, d: 0.18 }, // C5
        { f: 659.25, t: 1.08, d: 0.18 }, // E5
        { f: 783.99, t: 1.26, d: 0.65 }, // G5 (Hold)
        { f: 1046.50, t: 1.95, d: 1.2 }  // C6 (Grand Finale)
      ];
      fanfareNotes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.3, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    } catch(e) {}
  }

  playCorrect() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Muzaffer akor)
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch(e) {}
  }

  playWrong() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.4);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch(e) {}
  }

  playGameStart() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.15, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.25);
      });
    } catch(e) {}
  }

  playPop() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch(e) {}
  }

  // 📢 Stadyum Havalı Korna (Air Horn Blast)
  playHorn() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const freqs = [233.08, 293.66, 349.23]; // Bb3, D4, F4 - güçlü korna akoru
      freqs.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq * 1.02, now + 0.15);
        osc.frequency.linearRampToValueAtTime(freq * 0.98, now + 0.35);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.setValueAtTime(0.22, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      });
    } catch(e) {}
  }

  // 😙 Hakem / Taraftar Düdüğü (Whistle Trill)
  playWhistle() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      
      const trillOsc = this.ctx.createOscillator();
      const trillGain = this.ctx.createGain();
      trillOsc.type = 'sine';
      trillOsc.frequency.setValueAtTime(24, now);
      trillGain.gain.setValueAtTime(150, now);
      trillOsc.connect(osc.frequency);

      osc.frequency.setValueAtTime(2600, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.setValueAtTime(0.2, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      trillOsc.start(now);
      osc.start(now);
      trillOsc.stop(now + 0.35);
      osc.stop(now + 0.35);
    } catch(e) {}
  }

  // 👏 Stadyum Alkış & Tezahürat (Applause / Crowd cheer)
  playApplause() {
    if (this.isMuted) return;
    this.init();
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.6);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
        if (i % 2200 < 150) data[i] *= 2.2;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 1.2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch(e) {}
  }

  // 🔥 TAKIM COMBOSU ZAFER FANFARI (1.5X Puan Kutlaması)
  playComboFanfare() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.22, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.4);
      });
    } catch(e) {}
  }

  // ❄️ BUZ JOKERİ SESİ (Kristal Dondurma Efekti)
  playFreeze() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const freqs = [1760, 2093, 2637, 3135, 3520];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + idx * 0.05 + 0.3);

        gain.gain.setValueAtTime(0.18, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.3);
      });
    } catch(e) {}
  }

  // 🎬 ÖDÜLLÜ REKLAM TAMAMLAMA SESİ (VIP Açılış Çanı)
  playRewardSuccess() {
    if (this.isMuted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.2, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    } catch(e) {}
  }
}

window.soundFX = new SoundFX();
