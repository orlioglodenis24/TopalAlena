// Эмбиент без аудиофайлов: мягкий пад-аккорд, лёгкий «воздух»
// и короткие щелчки интерфейса. Всё синтезируется WebAudio.
export class Ambience {
  constructor() {
    this.ctx = null
    this.on = false
  }

  init() {
    const ctx = (this.ctx = new (window.AudioContext || window.webkitAudioContext)())
    this.master = ctx.createGain()
    this.master.gain.value = 0
    this.master.connect(ctx.destination)

    // пад: Dmaj9 в низком регистре, слегка расстроенные пары голосов
    const filter = (this.padFilter = ctx.createBiquadFilter())
    filter.type = 'lowpass'
    filter.frequency.value = 520
    filter.Q.value = 0.8
    const padGain = ctx.createGain()
    padGain.gain.value = 0.11
    filter.connect(padGain).connect(this.master)
    ;[73.4, 110, 146.8, 185, 220, 329.6].forEach((f, i) => {
      ;[-4, 4].forEach((cents) => {
        const o = ctx.createOscillator()
        o.type = i < 2 ? 'sine' : 'triangle'
        o.frequency.value = f
        o.detune.value = cents
        o.connect(filter)
        o.start()
      })
    })
    // медленное «дыхание» фильтра
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.05
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 160
    lfo.connect(lfoGain).connect(filter.frequency)
    lfo.start()

    // «воздух» — тихий фильтрованный шум
    const len = ctx.sampleRate * 2
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    noise.loop = true
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 3200
    bp.Q.value = 0.4
    const ng = ctx.createGain()
    ng.gain.value = 0.008
    noise.connect(bp).connect(ng).connect(this.master)
    noise.start()
  }

  // пад раскрывается по мере пролёта сквозь сцену
  setTension(v) {
    if (!this.ctx) return
    this.padFilter.frequency.setTargetAtTime(520 + v * 1400, this.ctx.currentTime, 0.3)
  }

  toggle() {
    if (!this.ctx) this.init()
    this.on = !this.on
    if (this.ctx.state === 'suspended') this.ctx.resume()
    const g = this.master.gain
    g.cancelScheduledValues(this.ctx.currentTime)
    g.setTargetAtTime(this.on ? 0.6 : 0, this.ctx.currentTime, 0.6)
    return this.on
  }

  blip(freq = 880) {
    if (!this.on) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(freq, t)
    o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.05)
    g.gain.setValueAtTime(0.04, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)
    o.connect(g).connect(this.master)
    o.start(t)
    o.stop(t + 0.13)
  }
}
