/**
 * Pure Web Audio API Ambient Sound Generator
 * Generates soothing ambient soundscapes without external audio files:
 * - Rain: filtered pink/brown noise with random droplet impulses
 * - Ocean: rhythmic low-pass noise swell simulating tides
 * - Forest Wind: resonant bandpass breeze
 * - Zen Chime: warm 432Hz harmonic soothing drone
 */

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private currentTrack: string | null = null;
  private volume: number = 0.4;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentTrack(): string | null {
    return this.currentTrack;
  }

  public stop() {
    this.activeNodes.forEach(node => {
      try {
        node.stop();
      } catch {
        // ignore
      }
    });
    this.activeNodes = [];
    this.currentTrack = null;
  }

  public play(type: 'rain' | 'ocean' | 'zen' | 'wind') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.currentTrack === type) {
      this.stop();
      return;
    }

    this.stop();
    this.currentTrack = type;

    switch (type) {
      case 'rain':
        this.startRain();
        break;
      case 'ocean':
        this.startOcean();
        break;
      case 'wind':
        this.startWind();
        break;
      case 'zen':
        this.startZen();
        break;
    }
  }

  private startRain() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink noise generation
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.65, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    noise.start();
    this.activeNodes.push({
      stop: () => {
        noise.stop();
        noise.disconnect();
      },
    });
  }

  private startOcean() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    // LFO for tide swells
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 sec ocean swell cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(260, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const oceanGain = this.ctx.createGain();
    oceanGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(oceanGain);
    oceanGain.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        noise.stop();
        lfo.stop();
        noise.disconnect();
        lfo.disconnect();
      },
    });
  }

  private startWind() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // Wind modulation
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        noise.stop();
        lfo.stop();
        noise.disconnect();
        lfo.disconnect();
      },
    });
  }

  private startZen() {
    if (!this.ctx || !this.masterGain) return;

    // Harmonic singing bowl / chime drone at 432 Hz + 216 Hz
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432, this.ctx.currentTime);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(216, this.ctx.currentTime);

    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(648, this.ctx.currentTime); // 5th harmonic

    const zenGain = this.ctx.createGain();
    zenGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    osc1.connect(zenGain);
    osc2.connect(zenGain);
    osc3.connect(zenGain);
    zenGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    osc3.start();

    this.activeNodes.push({
      stop: () => {
        osc1.stop();
        osc2.stop();
        osc3.stop();
        osc1.disconnect();
        osc2.disconnect();
        osc3.disconnect();
      },
    });
  }
}

export const ambientSound = new AmbientSoundEngine();
