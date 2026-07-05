// Downmixes input audio to mono PCM16 and posts ~100ms chunks (2400 samples
// at the 24kHz context rate) to the main thread as transferable buffers.
const TARGET_SAMPLES = 2400;

class Pcm16Recorder extends AudioWorkletProcessor {
  constructor() {
    super();
    this.pending = [];
    this.pendingLength = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0 || input[0].length === 0) return true;

    const frames = input[0].length;
    const mono = new Float32Array(frames);
    for (const channel of input) {
      for (let i = 0; i < frames; i++) {
        mono[i] += channel[i] / input.length;
      }
    }

    this.pending.push(mono);
    this.pendingLength += frames;

    if (this.pendingLength >= TARGET_SAMPLES) {
      const pcm = new Int16Array(this.pendingLength);
      let offset = 0;
      for (const block of this.pending) {
        for (let i = 0; i < block.length; i++, offset++) {
          const sample = Math.max(-1, Math.min(1, block[i]));
          pcm[offset] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        }
      }
      this.port.postMessage(pcm.buffer, [pcm.buffer]);
      this.pending = [];
      this.pendingLength = 0;
    }

    return true;
  }
}

registerProcessor("pcm16-recorder", Pcm16Recorder);
