// Procedural Web Audio Synthesizer for LifeOS
// Completely self-contained, no external MP3 dependencies, works offline and in iframes.

class SoundService {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentAmbientType: string | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft meditation singing bowl
  playBowl(duration: number = 3.5) {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const fundamental = 392; // G4 bell tone

      // Fundamental and harmonics
      const frequencies = [fundamental, fundamental * 1.5, fundamental * 2.76, fundamental * 5.4];
      const gains = [0.4, 0.2, 0.1, 0.05];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(gains[idx], now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch {
      // Audio might be blocked before first interaction
    }
  }

  // Pleasant timer chime (two-tone chime)
  playChime(isBreak: boolean = false) {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const freq1 = isBreak ? 523.25 : 659.25; // C5 or E5
      const freq2 = isBreak ? 659.25 : 880.00; // E5 or A5

      [
        { freq: freq1, delay: 0 },
        { freq: freq2, delay: 0.18 },
      ].forEach(({ freq, delay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.3, now + delay + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 1.2);
      });
    } catch {
      // Ignore
    }
  }

  // Workout countdown interval beep
  playBeep(isHigh: boolean = false) {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isHigh ? 880 : 440, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  // Procedural Ambient Focus Sounds (Rain, White Noise, Ocean Waves)
  startAmbient(type: 'rain' | 'waves' | 'whitenoise', volume: number = 0.25) {
    try {
      this.stopAmbient();
      const ctx = this.initCtx();

      // Buffer size: 2 seconds loop
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate noise
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain' || type === 'waves') {
          // Brownish / pink noise filter
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        } else {
          // White noise
          data[i] = white * 0.3;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter
      const filter = ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
      } else if (type === 'waves') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);
        // Modulate filter for wave swoosh
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // Wave period ~8s
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(300, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
      } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
      this.ambientSource = noiseSource;
      this.ambientGain = gain;
      this.currentAmbientType = type;
    } catch {
      // Audio context error
    }
  }

  setAmbientVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        (this.ambientSource as AudioBufferSourceNode).stop();
        this.ambientSource.disconnect();
      } catch {
        // Ignore
      }
      this.ambientSource = null;
      this.ambientGain = null;
      this.currentAmbientType = null;
    }
  }

  getCurrentAmbient() {
    return this.currentAmbientType;
  }
}

export const sound = new SoundService();
