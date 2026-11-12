// Sound Engine using uploaded custom sound effects + Web Audio API synthesis
// Supports uploaded audio assets (flap, score, crash, BGM) with zero latency
// and synthesized fallback + special event audio (dragons, warp, potty, shields).

const soundAssetUrl = (path) => {
  const base = import.meta.env.BASE_URL || '/'
  return `${base.endsWith('/') ? base : `${base}/`}${path.replace(/^\/+/, '')}`
}

class SoundEngine {
  constructor() {
    this.ctx = null
    this.enabled = true
    this.musicEnabled = true
    this.audioBuffers = {}
    this.bgmAudio = null
    this.bgmPlaying = false
    this.isPreloaded = false

    // Initialize HTML5 Audio fallback/player for BGM
    if (typeof window !== 'undefined') {
      try {
        const bgm = new Audio(soundAssetUrl('sounds/bgm.mp3'))
        bgm.loop = true
        bgm.volume = 0.35
        bgm.preload = 'auto'
        this.bgmAudio = bgm
      } catch (e) {
        console.warn('BGM Audio init error:', e)
      }
    }
  }

  ensureContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  preload() {
    if (this.isPreloaded || typeof window === 'undefined') return
    this.isPreloaded = true

    const soundFiles = {
      flap: soundAssetUrl('sounds/flap.mp3'),
      score: soundAssetUrl('sounds/score.mp3'),
      crash: soundAssetUrl('sounds/crash.mp3'),
    }

    const ctx = this.ensureContext()
    if (!ctx) return

    Object.entries(soundFiles).forEach(([name, url]) => {
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((data) => ctx.decodeAudioData(data))
        .then((decoded) => {
          this.audioBuffers[name] = decoded
        })
        .catch((err) => {
          console.warn(`Could not preload ${name}:`, err)
        })
    })
  }

  setEnabled(val) {
    this.enabled = Boolean(val)
    if (!this.enabled) {
      this.stopMusic()
    } else if (this.musicEnabled) {
      this.startMusic()
    }
  }

  setMusicEnabled(val) {
    this.musicEnabled = Boolean(val)
    if (this.musicEnabled && this.enabled) {
      this.startMusic()
    } else {
      this.stopMusic()
    }
  }

  toggleMusic() {
    this.setMusicEnabled(!this.musicEnabled)
    return this.musicEnabled
  }

  startMusic() {
    if (!this.enabled || !this.musicEnabled) return
    if (this.bgmAudio) {
      this.bgmAudio.play().then(() => {
        this.bgmPlaying = true
      }).catch(() => {
        // Autoplay may be blocked until first user gesture
        this.bgmPlaying = false
      })
    }
  }

  stopMusic() {
    if (this.bgmAudio) {
      this.bgmAudio.pause()
      this.bgmPlaying = false
    }
  }

  // Play preloaded buffer with gain control
  playBuffer(name, volume = 0.5, rate = 1.0) {
    if (!this.enabled) return false
    const ctx = this.ensureContext()
    if (!ctx) return false

    const buffer = this.audioBuffers[name]
    if (!buffer) {
      // If buffer is still loading, try preloading now
      if (!this.isPreloaded) this.preload()
      return false
    }

    try {
      const source = ctx.createBufferSource()
      const gainNode = ctx.createGain()
      source.buffer = buffer
      source.playbackRate.value = rate
      gainNode.gain.setValueAtTime(volume, ctx.currentTime)
      source.connect(gainNode)
      gainNode.connect(ctx.destination)
      source.start(0)
      return true
    } catch {
      return false
    }
  }

  // 1. New Custom Flap Sound (uploaded audio + synthesized fallback)
  playFlap() {
    if (!this.enabled) return
    this.ensureContext()
    this.preload()

    // Slight pitch variation for playful responsiveness
    const rate = 0.98 + Math.random() * 0.08
    const played = this.playBuffer('flap', 0.55, rate)
    if (played) return

    // High quality synthesized cartoon chirp fallback
    const ctx = this.ctx
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(360, now)
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.09)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.2, now + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11)

    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.12)
  }

  // 2. New Custom Score Sound (uploaded audio + synthesized fallback)
  playScore() {
    if (!this.enabled) return
    this.ensureContext()
    this.preload()

    const played = this.playBuffer('score', 0.6)
    if (played) return

    const ctx = this.ctx
    if (!ctx) return
    const now = ctx.currentTime

    const notes = [1046.5, 1318.5, 1567.98]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.035)

      const start = now + idx * 0.035
      gain.gain.setValueAtTime(0.001, start)
      gain.gain.linearRampToValueAtTime(0.14, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22)

      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(start); osc.stop(start + 0.25)
    })
  }

  // 3. New Custom Crash / Game Over Sound (uploaded audio + synthesized fallback)
  playCrash() {
    if (!this.enabled) return
    this.ensureContext()
    this.preload()

    const played = this.playBuffer('crash', 0.65)
    if (played) return

    const ctx = this.ctx
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(580, now)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.28)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.22, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.32)
  }

  // Red Ball style heart damage / hurt impact
  playHurt() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return

    // Quick sharp punchy impact
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.16)

    gain.gain.setValueAtTime(0.22, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.22)
  }

  // Heart life pickup sparkle
  playHeal() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const notes = [659.25, 880, 1174.66, 1567.98] // E5, A5, D6, G6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.04)

      const start = now + idx * 0.04
      gain.gain.setValueAtTime(0.001, start)
      gain.gain.linearRampToValueAtTime(0.15, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25)

      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(start); osc.stop(start + 0.28)
    })
  }

  // Fierce Dragon Roar when Boss appears or prepares fire
  playDragonRoar() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Low rumble oscillator with distortion/growl
    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(95, now)
    osc.frequency.linearRampToValueAtTime(140, now + 0.15)
    osc.frequency.linearRampToValueAtTime(65, now + 0.6)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(380, now)
    filter.frequency.linearRampToValueAtTime(850, now + 0.2)
    filter.frequency.linearRampToValueAtTime(200, now + 0.6)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.28, now + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)

    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.75)
  }

  // Rushing Dragon Fireball blast / whoosh
  playFireball() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    // Swirling whoosh
    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(280, now)
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.25)

    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(650, now)
    filter.frequency.exponentialRampToValueAtTime(220, now + 0.25)
    filter.Q.setValueAtTime(3.0, now)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)

    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.3)
  }

  // Gem collection in Underground Cavern
  playGemCollect() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const notes = [1318.5, 1760.0] // E6, A6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.035)

      const start = now + idx * 0.035
      gain.gain.setValueAtTime(0.001, start)
      gain.gain.linearRampToValueAtTime(0.12, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22)

      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(start); osc.stop(start + 0.25)
    })
  }

  // Collectible star chime (Adventure / Extreme)
  playStarCollect() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const notes = [1318.5, 1760.0, 2093.0]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.04)

      const start = now + idx * 0.04
      gain.gain.setValueAtTime(0.001, start)
      gain.gain.linearRampToValueAtTime(0.14, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28)

      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(start); osc.stop(start + 0.3)
    })
  }

  // Triumphant kid fanfare for theme transition (every 10 points)
  playThemeChange() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const melody = [523.25, 659.25, 783.99, 1046.5]
    melody.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.07)

      const start = now + idx * 0.07
      const dur = idx === melody.length - 1 ? 0.35 : 0.12
      gain.gain.setValueAtTime(0.001, start)
      gain.gain.linearRampToValueAtTime(0.15, start + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur)

      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(start); osc.stop(start + dur + 0.05)
    })
  }

  // Cute energetic cartoon dog bark ("Yip! Woof!")
  playDogBark() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    ;[0, 0.16].forEach((delay) => {
      const t = now + delay
      const osc = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(460, t)
      osc.frequency.exponentialRampToValueAtTime(240, t + 0.09)

      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(850, t)
      filter.Q.setValueAtTime(2.5, t)

      gain.gain.setValueAtTime(0.001, t)
      gain.gain.linearRampToValueAtTime(0.18, t + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11)

      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
      osc.start(t); osc.stop(t + 0.12)
    })
  }

  // Cartoon dog alert siren / fanfare at score 60
  playDogAlert() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(350, now)
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.18)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.3)
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.45)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.16, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.52)

    setTimeout(() => this.playDogBark(), 450)
  }

  // Hilarious kid-friendly cartoon potty / squish / bubble pop
  playPotty() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(190, now)
    osc.frequency.linearRampToValueAtTime(80, now + 0.12)
    osc.frequency.linearRampToValueAtTime(140, now + 0.22)
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.35)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.22, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(400, now + 0.18)
    osc2.frequency.exponentialRampToValueAtTime(820, now + 0.25)

    gain2.gain.setValueAtTime(0.001, now + 0.18)
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.2)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32)

    osc.connect(gain); gain.connect(ctx.destination)
    osc2.connect(gain2); gain2.connect(ctx.destination)

    osc.start(now); osc.stop(now + 0.4)
    osc2.start(now + 0.18); osc2.stop(now + 0.34)
  }

  playClick() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(860, now + 0.04)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.1, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.07)
  }

  // Underground Pipe Suction / Vortex Warp
  playWarp() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.35)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.6)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65)

    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.7)
  }

  // Power-up pickup chime
  playPowerUp() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const notes = [587.33, 739.99, 880, 1174.66]
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.045)

      const start = now + idx * 0.045
      gain.gain.setValueAtTime(0.001, start)
      gain.gain.linearRampToValueAtTime(0.14, start + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22)

      osc.connect(gain); gain.connect(ctx.destination)
      osc.start(start); osc.stop(start + 0.25)
    })
  }

  playShieldPop() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(450, now)
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.15)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.22)
  }

  playBooster() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(160, now)
    osc.frequency.linearRampToValueAtTime(320, now + 0.3)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(400, now)
    filter.frequency.linearRampToValueAtTime(1200, now + 0.3)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.18, now + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.5)

    setTimeout(() => this.playDogBark(), 150)
  }

  playMonsterRoar() {
    if (!this.enabled) return
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.linearRampToValueAtTime(440, now + 0.08)
    osc.frequency.linearRampToValueAtTime(180, now + 0.2)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.25)
  }
}

export const sound = new SoundEngine()
