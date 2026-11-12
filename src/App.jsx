import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Pause,
  Home,
  Trophy,
  Sparkles,
  Smartphone,
  Keyboard,
  MousePointer2,
  Maximize2,
  Minimize2,
  BarChart3,
  Shirt,
  BookOpen,
  Medal,
  Settings,
  X,
  ArrowLeft,
  Flame,
  Star,
  Dog,
  HelpCircle,
  Upload,
  Shield,
  Magnet,
  Camera,
  Check,
  Download,
  Heart,
} from 'lucide-react'
import sparkImgUrl from './assets/agents/agent-spark.png'
import shadowImgUrl from './assets/agents/agent-shadow.png'
import boobooImgUrl from './assets/agents/agent-booboo.png'
import robocatImgUrl from './assets/agents/agent-robocat.png'
import arachnoImgUrl from './assets/agents/agent-arachno.png'
import mampiImgUrl from './assets/agents/agent-mampi.png'
import { sound } from './sound'
import {
  THEMES,
  getThemeForScore,
  makeThemeBirds,
  makeHomes,
  drawBackgroundStars,
  drawSun,
  drawThemeBirds,
  drawThemeHomes,
  drawThematicPipe,
  drawBonusStar,
  drawDog,
  drawConfetti,
} from './themes'
import {
  MONSTER_TYPES,
  drawMonsterRealmBg,
  drawWarpPipe,
  drawMonster,
  drawPowerUp,
  drawActiveShield,
  drawGem,
} from './monsters'
import {
  createDragon,
  updateDragon,
  drawDragon,
  drawFireballs,
  drawDragonAlertBanner,
} from './dragon'

const W = 420
const H = 720
const FLOOR_H = 82

export const AGENTS = [
  {
    id: 'spark',
    name: 'Agent Spark',
    title: 'Solar Cadet',
    icon: '🧢',
    badge: 'Solar Flight',
    imgUrl: sparkImgUrl,
    color: '#ff9f43',
    description: 'Brave adventure boy in his signature orange cap!',
  },
  {
    id: 'shadow',
    name: 'Agent Shadow',
    title: 'Mystic Ninja',
    icon: '🥷',
    badge: 'Shadow Rogue',
    imgUrl: shadowImgUrl,
    color: '#9b59b6',
    description: 'Swift, stealthy rogue pilot in a dark violet hood!',
  },
  {
    id: 'booboo',
    name: 'Agent Booboo',
    title: 'Furry Chuckles',
    icon: '🐻',
    badge: 'Joyful Yeti',
    imgUrl: boobooImgUrl,
    color: '#2ecc71',
    description: 'Fluffy white friend spreading cheer with big thumbs up!',
  },
  {
    id: 'robocat',
    name: 'Agent RoboCat',
    title: 'Cosmic Meow',
    icon: '🐱',
    badge: 'Gadget Cat',
    imgUrl: robocatImgUrl,
    color: '#00b4d8',
    description: 'Futuristic blue robot cat with a golden collar bell!',
  },
  {
    id: 'arachno',
    name: 'Agent Arachno',
    title: 'Web Striker',
    icon: '🕷️',
    badge: 'Spider Hero',
    imgUrl: arachnoImgUrl,
    color: '#ee5253',
    description: 'Agile wall-crawling acrobat soaring with web power!',
  },
  {
    id: 'mampi',
    name: 'Agent Mampi',
    title: 'Warrior Scout',
    icon: '⚔️',
    badge: 'Valor Flight',
    imgUrl: mampiImgUrl,
    color: '#e74c3c',
    description: 'Brave adventurer warrior soaring into battle with blade and valor!',
  },
]

export const MODES = {
  Chill: {
    name: 'Chill',
    icon: '🌴',
    badge: 'Relaxed',
    color: '#22c55e',
    speed: 135,
    gap: 215,
    gravity: 620,
    flap: -230,
    spacing: 280,
    oscillatePipes: false,
    hasBonusStars: false,
    description: 'Wide gaps, gentle float. Perfect for kids and chilling out!',
  },
  Pro: {
    name: 'Pro',
    icon: '🏆',
    badge: 'Sky Master',
    color: '#f97316',
    speed: 215,
    gap: 155,
    gravity: 840,
    flap: -290,
    spacing: 235,
    oscillatePipes: false,
    hasBonusStars: false,
    description: 'Fast flight and tight gaps for brave pro pilots!',
  },
  Adventure: {
    name: 'Adventure',
    icon: '🧭',
    badge: 'Dynamic',
    color: '#a855f7',
    speed: 175,
    gap: 180,
    gravity: 740,
    flap: -268,
    spacing: 255,
    oscillatePipes: true,
    hasBonusStars: true,
    description: 'Moving bobbing pipes, gems & collectible golden stars (+2 pts)!',
  },
  Extreme: {
    name: 'Extreme',
    icon: '⚡',
    badge: 'Hyper Turbo',
    color: '#ef4444',
    speed: 260,
    gap: 138,
    gravity: 920,
    flap: -315,
    spacing: 220,
    oscillatePipes: true,
    hasBonusStars: true,
    description: 'Maximum velocity, razor gaps, and bobbing pipes!',
  },
}

// Aliases for backward compatibility
MODES.Easy = MODES.Chill
MODES.Hard = MODES.Pro

export const LEVEL_NAMES = ['Chill', 'Pro', 'Adventure', 'Extreme']

const POTTY_QUOTES = [
  "Splat! Even top superhero pilots need a potty break! 💩",
  "Uh-oh, flushed right down the pipe! 🚽💩",
  "Poop happens! Shake off the stink and fly again! 💩✨",
  "Holy Guacamole! That was a stinky wipeout! 🥑💩",
  "Toilet paper not included in high altitude flight! 🧻💩",
  "Flush the failure and launch straight back up! 💨💩",
]

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

function rand(min, max) {
  return min + Math.random() * (max - min)
}

function makeClouds() {
  return Array.from({ length: 8 }, (_, i) => ({
    x: (i * 95 + rand(0, 35)) % W,
    y: 40 + ((i * 73) % 270),
    s: rand(0.7, 1.25),
    speed: rand(8, 18),
  }))
}

function drawCloud(ctx, x, y, s) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(s, s)
  ctx.fillStyle = 'rgba(255,255,255,0.88)'
  ctx.beginPath()
  ctx.arc(0, 12, 17, 0, Math.PI * 2)
  ctx.arc(20, 2, 23, 0, Math.PI * 2)
  ctx.arc(43, 12, 17, 0, Math.PI * 2)
  ctx.arc(22, 17, 19, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function makeGame(modeName, bestScores) {
  const mode = MODES[modeName] || MODES.Chill
  return {
    status: 'menu',
    modeName,
    mode,
    score: 0,
    best: bestScores[modeName] || 0,
    time: 0,
    groundX: 0,
    clouds: makeClouds(),
    birds: makeThemeBirds(),
    homes: makeHomes(),
    bird: { x: 112, y: 310, vy: 0, w: 46, h: 46 },
    pipes: [],
    stars: [],
    gems: [],
    powerUps: [],
    particles: [],
    shieldActive: false,
    shieldFlashTimer: 0,
    magnetTimer: 0,
    lives: 3,
    maxLives: 3,
    invulnerableTimer: 0,
    shakeTimer: 0,
    dragon: createDragon(W, H),
    isMonsterRealm: false,
    monsterVisitCount: 0,
    monsterTypeIndex: 0,
    monsterExitScore: 0,
    dog: {
      active: false,
      helperActive: false,
      boosterActive: false,
      boosterTimer: 0,
      x: 36,
      y: 320,
      barkTimer: 2.5,
      speechBubble: '',
      bubbleTimer: 0,
    },
    banner: {
      text: '',
      sub: '',
      timer: 0,
      color: '#ffd700',
    },
    lastThemeId: THEMES[0].id,
  }
}

function drawScene(ctx, game, characterImg, customCharImg, skinId, now) {
  const {
    pipes,
    stars,
    gems,
    powerUps,
    clouds,
    birds,
    homes,
    groundX,
    score,
    bird,
    dog,
    dragon,
    particles,
    banner,
    mode,
    isMonsterRealm,
    monsterTypeIndex,
    shieldActive,
  } = game

  const floorY = H - FLOOR_H

  // Full-bleed sky backdrop extending past corridor bounds to eliminate black bars and screen patches
  const currentTheme = getThemeForScore(score)
  ctx.save()
  if (isMonsterRealm) {
    ctx.fillStyle = '#09050d'
    ctx.fillRect(-300, -300, W + 600, H + 600)
  } else {
    const sky = ctx.createLinearGradient(0, -100, 0, H + 100)
    currentTheme.sky.forEach((stop, idx) => {
      sky.addColorStop(idx / (currentTheme.sky.length - 1), stop)
    })
    ctx.fillStyle = sky
    ctx.fillRect(-300, -300, W + 600, H + 600)
  }
  ctx.restore()

  if (isMonsterRealm) {
    // 1. Revamped Underground Cavern Background with Spelunker Lantern Glow
    drawMonsterRealmBg(
      ctx,
      W,
      H,
      now,
      monsterTypeIndex,
      bird ? bird.x : W / 2,
      bird ? bird.y : H / 2
    )
  } else {
    // Standard Thematic Realm
    const theme = currentTheme

    // Twinkling stars in Starry Midnight or Twilight
    drawBackgroundStars(ctx, theme, now, W, H)

    // Sun or Moon
    drawSun(ctx, theme, now, W)

    // Distant Theme Homes / Windmills / Castles
    drawThemeHomes(ctx, homes, theme, now, floorY)

    // Clouds
    clouds.forEach((c) => {
      drawCloud(ctx, c.x, c.y, c.s)
    })

    // Flocking Theme Birds
    drawThemeBirds(ctx, birds, theme, now)
  }

  // Draw Ground Floor with full-bleed width
  ctx.save()
  const groundGrad = ctx.createLinearGradient(0, floorY, 0, H + 200)
  if (isMonsterRealm) {
    groundGrad.addColorStop(0, '#190a2a')
    groundGrad.addColorStop(1, '#090410')
  } else {
    const subColor = currentTheme.ground?.sub || '#e67e22'
    groundGrad.addColorStop(0, subColor)
    groundGrad.addColorStop(1, '#1b262c')
  }
  ctx.fillStyle = groundGrad
  ctx.fillRect(-300, floorY, W + 600, FLOOR_H + 200)

  // Ground Grass/Crystal Trim
  const grassColor = isMonsterRealm ? '#8e44ad' : (currentTheme.ground?.grass || '#2ecc71')
  ctx.fillStyle = grassColor
  ctx.fillRect(-300, floorY, W + 600, 8)

  // Animated ground stripes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)'
  for (let x = -((groundX * 1.5) % 24) - 280; x < W + 300; x += 24) {
    ctx.beginPath()
    ctx.moveTo(x, floorY)
    ctx.lineTo(x + 12, floorY)
    ctx.lineTo(x + 4, H + 200)
    ctx.lineTo(x - 8, H + 200)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()

  // Draw Pipes or Monsters
  for (const p of pipes) {
    if (p.isWarpPipe) {
      drawWarpPipe(ctx, p, now, false)
    } else if (p.isExitWarp) {
      drawWarpPipe(ctx, p, now, true) // Subterranean Rescue Drill!
    } else if (isMonsterRealm || p.isMonster) {
      drawMonster(ctx, p.x, 0, p.w, p.topH, true, monsterTypeIndex, now)
      const lowerY = p.topH + mode.gap
      drawMonster(ctx, p.x, lowerY, p.w, H - FLOOR_H - lowerY, false, monsterTypeIndex, now)
    } else {
      const currentTheme = getThemeForScore(score)
      // Top Pipe
      drawThematicPipe(ctx, p.x, 0, p.w, p.topH, true, currentTheme)
      // Bottom Pipe
      const lowerY = p.topH + mode.gap
      const lowerH = Math.max(0, H - FLOOR_H - lowerY)
      drawThematicPipe(ctx, p.x, lowerY, p.w, lowerH, false, currentTheme)
    }
  }

  // Draw Bonus Stars (Adventure / Extreme)
  if (stars && stars.length > 0) {
    for (const s of stars) {
      if (!s.collected) {
        drawBonusStar(ctx, s.x, s.y, now)
      }
    }
  }

  // Draw Floating Underground Gems (Amethyst & Ruby)
  if (gems && gems.length > 0) {
    for (const gem of gems) {
      if (!gem.collected) {
        drawGem(ctx, gem, now)
      }
    }
  }

  // Draw Collectible Power-Ups
  if (powerUps && powerUps.length > 0) {
    for (const pu of powerUps) {
      if (!pu.collected) {
        drawPowerUp(ctx, pu, now)
      }
    }
  }

  // Draw Dragon Boss & Fireballs (Score >= 50)
  if (dragon) {
    drawDragon(ctx, dragon, now)
    drawFireballs(ctx, dragon.fireballs, now)
    drawDragonAlertBanner(ctx, dragon.alertTimer, W, H, now)
  }

  // Draw Animated Tail Dog Companion
  if (dog && dog.active) {
    drawDog(ctx, dog, bird, now)
  }

  // Draw Flyer Character
  ctx.save()
  ctx.translate(bird.x, bird.y)
  const angle = clamp(bird.vy / 420, -0.4, 0.65)
  ctx.rotate(angle)

  // Invulnerability blink effect when damaged
  if (game.invulnerableTimer > 0 && Math.floor(now / 90) % 2 === 0) {
    ctx.globalAlpha = 0.35
  }

  if (skinId === 'custom' && customCharImg && customCharImg.complete && customCharImg.naturalWidth) {
    // Custom uploaded user photo in cute aviator badge!
    ctx.save()
    // Gold aviator wings
    ctx.fillStyle = '#ffd700'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(24, -14)
    ctx.lineTo(18, 14)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-24, -14)
    ctx.lineTo(-18, 14)
    ctx.closePath()
    ctx.fill()

    // Circular avatar
    ctx.beginPath()
    ctx.arc(0, 0, 21, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(customCharImg, -21, -21, 42, 42)
    ctx.restore()

    ctx.strokeStyle = '#ffd700'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(0, 0, 21, 0, Math.PI * 2)
    ctx.stroke()
  } else if (characterImg && characterImg.complete && characterImg.naturalWidth) {
    // Maintain proportional aspect ratio inside bird.w and bird.h
    const imgW = characterImg.naturalWidth
    const imgH = characterImg.naturalHeight
    const scale = Math.min(bird.w / imgW, bird.h / imgH)
    const dw = imgW * scale
    const dh = imgH * scale
    ctx.drawImage(characterImg, -dw / 2, -dh / 2, dw, dh)
  } else {
    ctx.fillStyle = '#f39c12'
    ctx.beginPath()
    ctx.arc(0, 0, bird.w / 2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  // Active Bubble Shield around player
  if (shieldActive) {
    drawActiveShield(ctx, bird, now)
  }

  // Particles
  drawConfetti(ctx, particles)

  // Screen Alert Banner
  if (banner && banner.timer > 0) {
    ctx.save()
    const bannerAlpha = Math.min(1, banner.timer)
    ctx.globalAlpha = bannerAlpha
    ctx.translate(W / 2, 175)

    ctx.fillStyle = 'rgba(16, 36, 60, 0.92)'
    ctx.strokeStyle = banner.color || '#ffd700'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(-170, -34, 340, 68, 18)
    ctx.fill()
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.fillStyle = banner.color || '#ffd700'
    ctx.font = '900 17px Nunito, Fredoka, system-ui'
    ctx.fillText(banner.text, 0, -4)

    ctx.fillStyle = '#ffffff'
    ctx.font = '800 12px Nunito, system-ui'
    ctx.fillText(banner.sub, 0, 18)

    ctx.restore()
  }
}

const preloadedAgentImages = {}
if (typeof window !== 'undefined') {
  AGENTS.forEach((agent) => {
    const img = new Image()
    img.src = agent.imgUrl
    preloadedAgentImages[agent.id] = img
  })
}

export default function App() {
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const rafRef = useRef(0)
  const agentImagesRef = useRef(preloadedAgentImages)
  const customCharRef = useRef(new Image())
  const fileInputRef = useRef(null)

  // Dedication Splash Screen UI/UX State
  const [showSplash, setShowSplash] = useState(true)

  // Red Ball Style 3-Heart Life State
  const [lives, setLives] = useState(3)

  const [modeName, setModeName] = useState(() => {
    try {
      const saved = localStorage.getItem('human-flappy-mode')
      if (saved === 'Easy') return 'Chill'
      if (saved === 'Hard') return 'Pro'
      return saved || 'Chill'
    } catch {
      return 'Chill'
    }
  })

  const modeNameRef = useRef(modeName)
  useEffect(() => {
    modeNameRef.current = modeName
  }, [modeName])

  const [skinId, setSkinId] = useState(() => {
    try {
      const saved = localStorage.getItem('human-flappy-skin')
      if (saved === 'aadya') return 'mampi'
      return saved || 'spark'
    } catch {
      return 'spark'
    }
  })

  const skinIdRef = useRef(skinId)
  useEffect(() => {
    skinIdRef.current = skinId
  }, [skinId])

  const [customSkinUrl, setCustomSkinUrl] = useState(() => {
    try {
      return localStorage.getItem('human-flappy-custom-skin') || ''
    } catch {
      return ''
    }
  })

  const [status, setStatus] = useState('menu')
  const [score, setScore] = useState(0)

  const [bestScores, setBestScores] = useState(() => {
    try {
      const chillBest = Number(
        localStorage.getItem('human-flappy-best-Chill') ||
          localStorage.getItem('human-flappy-best-Easy') ||
          0
      )
      const proBest = Number(
        localStorage.getItem('human-flappy-best-Pro') ||
          localStorage.getItem('human-flappy-best-Hard') ||
          0
      )
      return {
        Chill: chillBest,
        Pro: proBest,
        Adventure: Number(localStorage.getItem('human-flappy-best-Adventure') || 0),
        Extreme: Number(localStorage.getItem('human-flappy-best-Extreme') || 0),
      }
    } catch {
      return { Chill: 0, Pro: 0, Adventure: 0, Extreme: 0 }
    }
  })

  const bestScoresRef = useRef(bestScores)
  useEffect(() => {
    bestScoresRef.current = bestScores
  }, [bestScores])

  const [soundOn, setSoundOn] = useState(() => {
    try {
      return localStorage.getItem('human-flappy-sound') !== 'off'
    } catch {
      return true
    }
  })

  const [musicOn, setMusicOn] = useState(() => {
    try {
      return localStorage.getItem('human-flappy-music') !== 'off'
    } catch {
      return true
    }
  })

  const [menuPanel, setMenuPanel] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(() => {
    if (typeof document === 'undefined') return false
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    )
  })
  const [pottyQuote, setPottyQuote] = useState(POTTY_QUOTES[0])
  const [pottyWiggle, setPottyWiggle] = useState(false)
  const [scorePop, setScorePop] = useState(false)
  const [activeBoosterTime, setActiveBoosterTime] = useState(0)
  const [hasShield, setHasShield] = useState(false)
  const [isMonsterWorld, setIsMonsterWorld] = useState(false)

  // PWA Install Handlers
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isStandalone, setIsStandalone] = useState(() => {
    try {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        Boolean(window.navigator.standalone)
      )
    } catch {
      return false
    }
  })

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsStandalone(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Sync fullscreen state with native browser events (Esc key, F11, gestures)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      )
      setIsFullscreen(isFull)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const triggerInstallPrompt = async () => {
    sound.playClick()
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsStandalone(true)
      }
      setDeferredPrompt(null)
      setIsInstallable(false)
    } else {
      setMenuPanel('install-guide')
    }
  }

  // Preload Agent Images
  useEffect(() => {
    AGENTS.forEach((agent) => {
      const img = new Image()
      img.src = agent.imgUrl
      agentImagesRef.current[agent.id] = img
    })
    if (customSkinUrl) {
      customCharRef.current.src = customSkinUrl
    }
  }, [customSkinUrl])

  // Custom Photo File Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result
      if (typeof dataUrl === 'string') {
        setCustomSkinUrl(dataUrl)
        setSkinId('custom')
        customCharRef.current.src = dataUrl
        try {
          localStorage.setItem('human-flappy-custom-skin', dataUrl)
          localStorage.setItem('human-flappy-skin', 'custom')
        } catch {}
        sound.playPowerUp()
      }
    }
    reader.readAsDataURL(file)
  }

  // Sound & Music Synchronization
  useEffect(() => {
    sound.setEnabled(soundOn)
    try {
      localStorage.setItem('human-flappy-sound', soundOn ? 'on' : 'off')
    } catch {}
  }, [soundOn])

  useEffect(() => {
    sound.setMusicEnabled(musicOn)
    try {
      localStorage.setItem('human-flappy-music', musicOn ? 'on' : 'off')
    } catch {}
  }, [musicOn])

  // Skin Switcher
  const selectSkin = (id) => {
    setSkinId(id)
    try {
      localStorage.setItem('human-flappy-skin', id)
    } catch {}
    sound.playClick()
  }

  // Mode Switcher
  const chooseMode = (m) => {
    setModeName(m)
    try {
      localStorage.setItem('human-flappy-mode', m)
    } catch {}
    sound.playClick()
  }

  const changeStatus = useCallback((next) => {
    setStatus(next)
    if (gameRef.current) gameRef.current.status = next
  }, [])

  // Core Game Reset
  const resetGame = useCallback(
    (nextMode = modeName, begin = false) => {
      const g = makeGame(nextMode, bestScores)
      g.status = begin ? 'playing' : 'menu'

      // Initial pipe pair
      const firstX = W + 70
      g.pipes.push({
        x: firstX,
        w: 68,
        topH: rand(130, 275),
        baseTopH: rand(130, 275),
        oscPhase: 0,
        scored: false,
      })
      g.pipes.push({
        x: firstX + g.mode.spacing,
        w: 68,
        topH: rand(125, 270),
        baseTopH: rand(125, 270),
        oscPhase: 1.5,
        scored: false,
      })

      // Bonus star for Adventure / Extreme modes
      if (g.mode.hasBonusStars) {
        g.stars.push({
          x: firstX + g.mode.spacing / 2,
          y: rand(220, 420),
          collected: false,
        })
      }

      gameRef.current = g
      setModeName(nextMode)
      setScore(0)
      setLives(3)
      setActiveBoosterTime(0)
      setHasShield(false)
      setIsMonsterWorld(false)
      setStatus(g.status)

      if (begin) {
        sound.playFlap()
        sound.startMusic()
      }
    },
    [modeName, bestScores]
  )

  // Flap jump action
  const flap = useCallback(() => {
    const g = gameRef.current
    if (!g || g.status === 'menu' || g.status === 'gameover') {
      resetGame(modeName, true)
      return
    }

    if (g.status !== 'playing') return
    g.bird.vy = g.mode.flap
    sound.playFlap()
  }, [modeName, resetGame])

  const togglePause = useCallback(() => {
    const g = gameRef.current
    if (!g) return
    if (g.status === 'playing') changeStatus('paused')
    else if (g.status === 'paused') changeStatus('playing')
    sound.playClick()
  }, [changeStatus])

  const toggleFullscreen = useCallback(() => {
    sound.playClick()
    const doc = document
    const docEl = document.documentElement
    const isFull = Boolean(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    )

    if (!isFull) {
      const enter =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.webkitRequestFullScreen ||
        docEl.mozRequestFullScreen ||
        docEl.msRequestFullscreen

      if (enter) {
        try {
          const res = enter.call(docEl)
          if (res && res.then) {
            res.then(() => setIsFullscreen(true)).catch(() => {})
          } else {
            setIsFullscreen(true)
          }
        } catch {
          // ignore if blocked by browser policy
        }
      }
    } else {
      const exit =
        doc.exitFullscreen ||
        doc.webkitExitFullscreen ||
        doc.webkitCancelFullScreen ||
        doc.mozCancelFullScreen ||
        doc.msExitFullscreen

      if (exit) {
        try {
          const res = exit.call(doc)
          if (res && res.then) {
            res.then(() => setIsFullscreen(false)).catch(() => {})
          } else {
            setIsFullscreen(false)
          }
        } catch {
          // ignore
        }
      }
    }
  }, [])

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault()
        flap()
      } else if (e.code === 'KeyP') {
        e.preventDefault()
        togglePause()
      } else if (e.code === 'KeyR') {
        e.preventDefault()
        resetGame(modeName, true)
      } else if (e.code === 'KeyF') {
        e.preventDefault()
        toggleFullscreen()
      } else if (e.code === 'Escape') {
        setMenuPanel('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flap, togglePause, resetGame, toggleFullscreen, modeName])

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let last = 0

    const prepareFrame = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const reqW = Math.round(rect.width * dpr)
      const reqH = Math.round(rect.height * dpr)

      if (canvas.width !== reqW || canvas.height !== reqH) {
        canvas.width = reqW
        canvas.height = reqH
      }

      const scale = Math.min(rect.width / W, rect.height / H)
      const offsetX = (rect.width - W * scale) / 2
      const offsetY = (rect.height - H * scale) / 2

      // Screen Shake translation when damaged
      let shakeOffsetX = 0
      let shakeOffsetY = 0
      if (gameRef.current && gameRef.current.shakeTimer > 0) {
        const intensity = (gameRef.current.shakeTimer / 0.28) * 6
        shakeOffsetX = (Math.random() - 0.5) * intensity
        shakeOffsetY = (Math.random() - 0.5) * intensity
      }

      // Completely clear canvas before drawing next frame to eliminate screen trails and patches
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.setTransform(
        dpr * scale,
        0,
        0,
        dpr * scale,
        dpr * (offsetX + shakeOffsetX),
        dpr * (offsetY + shakeOffsetY)
      )
    }

    const triggerGameOver = (g) => {
      if (g.status !== 'playing') return
      g.status = 'gameover'
      setStatus('gameover')
      setScore(g.score)
      setActiveBoosterTime(0)
      setHasShield(false)
      setIsMonsterWorld(false)

      setPottyQuote(POTTY_QUOTES[Math.floor(Math.random() * POTTY_QUOTES.length)])

      sound.playCrash()
      setTimeout(() => {
        sound.playPotty()
      }, 240)

      const currentBest = bestScoresRef.current[g.modeName] || 0
      if (g.score > currentBest) {
        const newBestObj = { ...bestScoresRef.current, [g.modeName]: g.score }
        setBestScores(newBestObj)
        try {
          localStorage.setItem(`human-flappy-best-${g.modeName}`, String(g.score))
        } catch {}
      }
    }

    // Red Ball Style Damage Handling with Heart Counter
    const handlePlayerDamage = (g, source = 'obstacle') => {
      if (g.dog && g.dog.boosterActive) return // Invincible in rocket flight!
      if (g.shieldActive) {
        g.shieldActive = false
        setHasShield(false)
        g.invulnerableTimer = 1.4
        sound.playShieldPop()
        return
      }
      if (g.invulnerableTimer > 0) return

      g.lives -= 1
      setLives(g.lives)

      if (g.lives > 0) {
        sound.playHurt()
        g.invulnerableTimer = 1.8
        g.shakeTimer = 0.28
        g.bird.vy = -190

        // Heart crack particles!
        for (let p = 0; p < 8; p++) {
          g.particles.push({
            x: g.bird.x,
            y: g.bird.y,
            vx: rand(-110, 110),
            vy: rand(-130, 50),
            size: rand(4, 7),
            color: '#ff4757',
            rot: rand(0, Math.PI * 2),
            vRot: rand(-4, 4),
            gravity: 160,
            life: 0.8,
            maxLife: 0.8,
          })
        }
      } else {
        triggerGameOver(g)
      }
    }

    const tick = (now) => {
      const g = gameRef.current
      const dt = last ? Math.min((now - last) / 1000, 0.033) : 0
      last = now

      prepareFrame()

      const activeSkinId = skinIdRef.current
      const activeCharImg = agentImagesRef.current[activeSkinId]

      if (!g) {
        const idle = makeGame(modeNameRef.current, bestScoresRef.current)
        drawScene(ctx, idle, activeCharImg, customCharRef.current, activeSkinId, now)
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (g.status === 'playing') {
        g.time += dt

        // Invulnerability and screen shake countdowns
        if (g.invulnerableTimer > 0) g.invulnerableTimer -= dt
        if (g.shakeTimer > 0) g.shakeTimer -= dt

        // Milestone banner countdown
        if (g.banner && g.banner.timer > 0) {
          g.banner.timer -= dt
        }

        // Dog Booster Countdown
        if (g.dog.boosterActive) {
          g.dog.boosterTimer -= dt
          setActiveBoosterTime(g.dog.boosterTimer)
          if (g.dog.boosterTimer <= 0) {
            g.dog.boosterActive = false
            setActiveBoosterTime(0)
          }
        }

        // Magnet timer countdown
        if (g.magnetTimer > 0) {
          g.magnetTimer -= dt
        }

        // Dynamic speed based on Dog Booster & Score
        let speedBoost = g.dog.boosterActive ? 1.6 : 1.0
        const scrollSpeed = (g.mode.speed + Math.min(g.score * 1.5, 70)) * speedBoost

        // Background elements scroll
        g.groundX += scrollSpeed * dt
        g.clouds.forEach((c) => {
          c.x -= c.speed * dt
          if (c.x < -60) {
            c.x = W + rand(10, 50)
            c.y = 40 + rand(0, 240)
          }
        })
        g.birds.forEach((b) => {
          b.x -= b.speed * dt
          if (b.x < -50) {
            b.x = W + rand(20, 80)
            b.y = rand(50, 200)
          }
        })
        g.homes.forEach((h) => {
          h.x -= scrollSpeed * 0.3 * dt
          if (h.x < -80) {
            h.x = W + rand(20, 80)
          }
        })

        // Physics: Cavern Draft gives floatier dynamics in Underground World!
        const effectiveGravity = g.isMonsterRealm ? g.mode.gravity * 0.82 : g.mode.gravity
        g.bird.vy += effectiveGravity * dt
        g.bird.y += g.bird.vy * dt

        // Tail Dog Companion AI
        if (g.score >= 15 && !g.dog.helperActive) {
          g.dog.helperActive = true
          g.dog.active = true
          sound.playDogBark()
          g.dog.speechBubble = 'RUFF! I GOT YOUR BACK! 🐶✨'
          g.dog.bubbleTimer = 3.5
          g.banner = {
            text: `🐶 TAIL DOG COMPANION UNLOCKED! 🐾`,
            sub: `COLLECT GOLDEN BONES FOR ROCKET BOOSTS!`,
            timer: 3.5,
            color: '#ffd700',
          }
        }

        if (g.score >= 60 && !g.dog.alertShown) {
          g.dog.alertShown = true
          sound.playDogAlert()
          g.dog.speechBubble = 'ZOOM! SPEED CHASE! 🐕💨'
          g.dog.bubbleTimer = 3.5
          g.banner = {
            text: `🚨 DOG TAILING AT FULL SPEED! 🐾💨`,
            sub: `CAN YOU KEEP AHEAD OF THE SPEEDY PUP?`,
            timer: 3.5,
            color: '#ff4757',
          }
        }

        if (g.dog.active) {
          const targetX = g.score >= 60 ? g.bird.x - 72 : g.bird.x - 65
          const targetY = g.bird.y + 12
          g.dog.x += (targetX - g.dog.x) * Math.min(dt * 3.5, 0.12)
          g.dog.y += (targetY - g.dog.y) * Math.min(dt * 4.0, 0.15)

          g.dog.barkTimer -= dt
          if (g.dog.barkTimer <= 0) {
            sound.playDogBark()
            g.dog.barkTimer = rand(6, 12)
          }
          if (g.dog.bubbleTimer > 0) {
            g.dog.bubbleTimer -= dt
          }
        }

        // DRAGON BOSS UPDATE (Score >= 50)
        updateDragon(g, dt, now, W, H, (source) => {
          handlePlayerDamage(g, source)
        })

        // Magnet attraction
        if (g.magnetTimer > 0) {
          const attract = (item) => {
            if (item.collected) return
            const dx = g.bird.x - item.x
            const dy = g.bird.y - item.y
            const dist = Math.hypot(dx, dy)
            if (dist < 240) {
              item.x += (dx / dist) * 320 * dt
              item.y += (dy / dist) * 320 * dt
            }
          }
          g.stars.forEach(attract)
          g.gems.forEach(attract)
          g.powerUps.forEach(attract)
        }

        // Underground Gems Update
        if (g.isMonsterRealm && g.gems.length > 0) {
          g.gems.forEach((gem) => {
            gem.x -= scrollSpeed * dt
            if (!gem.collected) {
              const dx = gem.x - g.bird.x
              const dy = gem.y - g.bird.y
              if (Math.hypot(dx, dy) < 32) {
                gem.collected = true
                g.score += gem.points
                setScore(g.score)
                sound.playGemCollect()
                for (let i = 0; i < 8; i++) {
                  g.particles.push({
                    x: gem.x,
                    y: gem.y,
                    vx: rand(-80, 80),
                    vy: rand(-80, 80),
                    size: rand(4, 7),
                    color: gem.type === 'ruby' ? '#ff4757' : '#a29bfe',
                    rot: rand(0, Math.PI * 2),
                    vRot: rand(-4, 4),
                    life: 0.65,
                    maxLife: 0.65,
                  })
                }
              }
            }
          })
          g.gems = g.gems.filter((gem) => gem.x > -40)
        }

        // Pipes & Obstacles update
        g.pipes.forEach((p) => {
          p.x -= scrollSpeed * dt

          // Suction effect if approaching entrance warp pipe!
          if (p.isWarpPipe && p.x - g.bird.x < 140 && p.x - g.bird.x > 0) {
            g.bird.y += (p.topH - 10 - g.bird.y) * 4 * dt
            g.bird.vy *= 0.8
            // Sucked into Underground Cavern!
            if (p.x - g.bird.x < 28) {
              p.isWarpPipe = false
              g.isMonsterRealm = true
              setIsMonsterWorld(true)
              g.monsterVisitCount += 1
              g.monsterTypeIndex = (g.monsterVisitCount - 1) % 5
              g.monsterExitScore = g.score + 10
              sound.playWarp()
              sound.playMonsterRoar()
              g.banner = {
                text: `⛏️ ENTERING UNDERGROUND CAVERN! 💎`,
                sub: `${MONSTER_TYPES[g.monsterTypeIndex].title}! SURVIVE 10 PTS!`,
                timer: 3.5,
                color: '#00cec9',
              }
              g.pipes = g.pipes.filter((pipe) => pipe === p)
            }
          }

          // Suction effect if approaching exit Rescue Drill!
          if (p.isExitWarp && p.x - g.bird.x < 140 && p.x - g.bird.x > 0) {
            g.bird.y += (p.topH - 10 - g.bird.y) * 4 * dt
            g.bird.vy *= 0.8
            if (p.x - g.bird.x < 28) {
              p.isExitWarp = false
              g.isMonsterRealm = false
              setIsMonsterWorld(false)
              sound.playWarp()
              sound.playThemeChange()
              g.banner = {
                text: `🚀 RESCUE DRILL LAUNCH! SURFACE BOUND! 🌟`,
                sub: `SURVIVED THE UNDERGROUND CAVERN!`,
                timer: 3.5,
                color: '#ffd700',
              }
              g.pipes = g.pipes.filter((pipe) => pipe === p)
            }
          }

          // Pipe oscillation in Adventure & Extreme modes
          if (g.mode.oscillatePipes && !p.isWarpPipe && !p.isExitWarp) {
            p.oscPhase += dt * (g.modeName === 'Extreme' ? 2.4 : 1.6)
            const oscAmp = g.modeName === 'Extreme' ? 45 : 32
            p.topH = clamp(
              p.baseTopH + Math.sin(p.oscPhase) * oscAmp,
              90,
              H - FLOOR_H - g.mode.gap - 90
            )
          }

          // Scoring logic
          if (!p.scored && p.x + p.w < g.bird.x - 5) {
            p.scored = true
            g.score += 1
            setScore(g.score)
            sound.playScore()
            setScorePop(true)
            setTimeout(() => setScorePop(false), 200)

            // Random chance to spawn Power-up (Shield, Magnet, Heart)
            if (Math.random() > 0.65 && g.powerUps.length < 2) {
              const types = ['shield', 'magnet']
              if (g.lives < g.maxLives || Math.random() < 0.25) types.push('heart')
              const pType = types[Math.floor(Math.random() * types.length)]
              g.powerUps.push({
                x: W + rand(40, 90),
                y: rand(180, H - FLOOR_H - 130),
                type: pType,
                bobOffset: rand(0, Math.PI * 2),
                collected: false,
              })
            }

            // Spawn Golden Dog Bone helper booster if score >= 15
            if (g.score >= 15 && Math.random() > 0.5 && !g.dog.boosterActive) {
              const hasBone = g.powerUps.some((pu) => pu.type === 'dog_booster' && !pu.collected)
              if (!hasBone) {
                g.powerUps.push({
                  x: W + rand(50, 110),
                  y: rand(190, H - FLOOR_H - 140),
                  type: 'dog_booster',
                  bobOffset: rand(0, Math.PI * 2),
                  collected: false,
                })
              }
            }

            // Theme transition every 10 points (when not in underground cavern)
            if (g.score % 10 === 0 && g.score > 0 && !g.isMonsterRealm) {
              sound.playThemeChange()
              const newTheme = getThemeForScore(g.score)
              g.banner = {
                text: `🌟 NEW THEME UNLOCKED! 🌟`,
                sub: `${newTheme.emoji} ${newTheme.name.toUpperCase()}`,
                timer: 2.8,
                color: '#ffd700',
              }
              for (let i = 0; i < 35; i++) {
                g.particles.push({
                  x: W / 2 + rand(-80, 80),
                  y: 160 + rand(-20, 20),
                  vx: rand(-140, 140),
                  vy: rand(-220, -60),
                  size: rand(6, 12),
                  color: ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#ff6b81'][i % 5],
                  rot: rand(0, Math.PI * 2),
                  vRot: rand(-5, 5),
                  gravity: 240,
                  life: 1.6,
                  maxLife: 1.6,
                })
              }
            }
          }
        })

        // Collectible stars
        if (g.mode.hasBonusStars) {
          g.stars.forEach((s) => {
            s.x -= scrollSpeed * dt
            if (!s.collected) {
              const dx = s.x - g.bird.x
              const dy = s.y - g.bird.y
              if (Math.hypot(dx, dy) < 32) {
                s.collected = true
                g.score += 2
                setScore(g.score)
                sound.playStarCollect()
                setScorePop(true)
                setTimeout(() => setScorePop(false), 200)

                for (let i = 0; i < 10; i++) {
                  g.particles.push({
                    x: s.x,
                    y: s.y,
                    vx: rand(-80, 80),
                    vy: rand(-80, 80),
                    size: rand(4, 8),
                    color: '#ffd700',
                    rot: rand(0, Math.PI * 2),
                    vRot: rand(-4, 4),
                    life: 0.65,
                    maxLife: 0.65,
                  })
                }
              }
            }
          })
          g.stars = g.stars.filter((s) => s.x > -40)
        }

        // Collectible Power-Ups
        g.powerUps.forEach((pu) => {
          pu.x -= scrollSpeed * dt
          if (!pu.collected) {
            const dx = pu.x - g.bird.x
            const dy = pu.y - g.bird.y
            if (Math.hypot(dx, dy) < 36) {
              pu.collected = true

              if (pu.type === 'shield') {
                g.shieldActive = true
                setHasShield(true)
                sound.playPowerUp()
                g.banner = {
                  text: `🫧 BUBBLE SHIELD ACTIVE!`,
                  sub: `ABSORBS 1 COLLISION SAFELY!`,
                  timer: 2.2,
                  color: '#00cec9',
                }
              } else if (pu.type === 'heart') {
                if (g.lives < g.maxLives) {
                  g.lives += 1
                  setLives(g.lives)
                }
                sound.playHeal()
                g.banner = {
                  text: `💖 HEART COLLECTED! +1 LIFE!`,
                  sub: `${g.lives} OF ${g.maxLives} HEARTS REMAINING`,
                  timer: 2.2,
                  color: '#ff4757',
                }
                for (let i = 0; i < 12; i++) {
                  g.particles.push({
                    x: pu.x,
                    y: pu.y,
                    vx: rand(-90, 90),
                    vy: rand(-110, 50),
                    size: rand(4, 8),
                    color: '#ff4757',
                    rot: rand(0, Math.PI * 2),
                    vRot: rand(-4, 4),
                    gravity: 120,
                    life: 0.75,
                    maxLife: 0.75,
                  })
                }
              } else if (pu.type === 'magnet') {
                g.magnetTimer = 8.0
                sound.playPowerUp()
                g.banner = {
                  text: `🧲 STAR MAGNET ACTIVE!`,
                  sub: `PULLING IN ALL STARS & GEMS!`,
                  timer: 2.2,
                  color: '#ff7675',
                }
              } else if (pu.type === 'dog_booster') {
                g.dog.boosterActive = true
                g.dog.boosterTimer = 5.0
                setActiveBoosterTime(5.0)
                sound.playBooster()
                g.dog.speechBubble = 'ROCKET BOOST! 🚀🐶'
                g.dog.bubbleTimer = 2.4
                g.banner = {
                  text: `🚀 SUPER DOG JETPACK BOOST! 🐕`,
                  sub: `INVINCIBLE ROCKET FLIGHT FOR 5 SECONDS!`,
                  timer: 2.5,
                  color: '#ffd700',
                }
              }
            }
          }
        })
        g.powerUps = g.powerUps.filter((pu) => pu.x > -40)

        // Spawn new pipes / monsters
        const lastPipe = g.pipes[g.pipes.length - 1]
        if (!lastPipe || lastPipe.x < W - g.mode.spacing) {
          const spawnX = lastPipe ? lastPipe.x + g.mode.spacing : W + 50
          const newTopH = rand(110, H - FLOOR_H - g.mode.gap - 90)

          const shouldSpawnWarp =
            !g.isMonsterRealm &&
            g.score >= 20 &&
            g.score % 20 === 0 &&
            !g.pipes.some((p) => p.isWarpPipe)

          const shouldSpawnExitWarp =
            g.isMonsterRealm &&
            g.score >= g.monsterExitScore - 2 &&
            !g.pipes.some((p) => p.isExitWarp)

          if (shouldSpawnWarp) {
            g.pipes.push({
              x: spawnX,
              w: 74,
              topH: 260,
              baseTopH: 260,
              oscPhase: 0,
              scored: false,
              isWarpPipe: true,
            })
          } else if (shouldSpawnExitWarp) {
            g.pipes.push({
              x: spawnX,
              w: 78,
              topH: 250,
              baseTopH: 250,
              oscPhase: 0,
              scored: false,
              isExitWarp: true,
            })
          } else {
            g.pipes.push({
              x: spawnX,
              w: 68,
              topH: newTopH,
              baseTopH: newTopH,
              oscPhase: rand(0, Math.PI * 2),
              scored: false,
              isMonster: g.isMonsterRealm,
            })
          }

          // Bonus star in Adventure / Extreme
          if (g.mode.hasBonusStars && Math.random() < 0.6 && !shouldSpawnWarp && !shouldSpawnExitWarp) {
            g.stars.push({
              x: spawnX + g.mode.spacing / 2,
              y: newTopH + g.mode.gap / 2,
              collected: false,
            })
          }

          // Floating gems in Underground Cavern
          if (g.isMonsterRealm && Math.random() < 0.7 && !shouldSpawnExitWarp) {
            g.gems.push({
              x: spawnX + g.mode.spacing / 2,
              y: newTopH + g.mode.gap / 2 + rand(-25, 25),
              type: Math.random() > 0.4 ? 'amethyst' : 'ruby',
              points: Math.random() > 0.4 ? 2 : 3,
              collected: false,
            })
          }
        }
        g.pipes = g.pipes.filter((p) => p.x > -p.w - 30)

        // Collision Checks
        const b = g.bird
        const bRadX = b.w * 0.38
        const bRadY = b.h * 0.38

        // Floor / Ceiling collision
        if (b.y - bRadY < 0 || b.y + bRadY > H - FLOOR_H) {
          if (g.dog.boosterActive) {
            g.bird.y = clamp(b.y, bRadY + 5, H - FLOOR_H - bRadY - 5)
            g.bird.vy = 0
          } else {
            handlePlayerDamage(g, 'boundary')
            g.bird.y = clamp(b.y, bRadY + 5, H - FLOOR_H - bRadY - 5)
            g.bird.vy = b.y - bRadY < 0 ? 140 : -220
          }
        }

        // Pipe / Monster collision
        for (const p of g.pipes) {
          if (p.isWarpPipe || p.isExitWarp) continue

          const bx1 = b.x - bRadX
          const bx2 = b.x + bRadX
          const by1 = b.y - bRadY
          const by2 = b.y + bRadY

          if (bx2 > p.x + 2 && bx1 < p.x + p.w - 2) {
            if (by1 < p.topH || by2 > p.topH + g.mode.gap) {
              if (g.dog.boosterActive) {
                // Invincibly smash through obstacle!
                for (let i = 0; i < 8; i++) {
                  g.particles.push({
                    x: p.x + p.w / 2,
                    y: by1 < p.topH ? p.topH : p.topH + g.mode.gap,
                    vx: rand(-120, 120),
                    vy: rand(-120, 120),
                    size: rand(4, 8),
                    color: '#ffd700',
                    rot: rand(0, Math.PI * 2),
                    vRot: rand(-5, 5),
                    life: 0.7,
                    maxLife: 0.7,
                  })
                }
              } else {
                handlePlayerDamage(g, 'obstacle')
              }
            }
          }
        }
      } else if (g.status === 'menu') {
        g.bird.y = H * 0.44 + Math.sin(now / 320) * 10
      }

      // Update and decay particles across all game states to prevent lingering screen patches
      if (g.particles && g.particles.length > 0) {
        for (let i = g.particles.length - 1; i >= 0; i--) {
          const p = g.particles[i]
          p.life = (p.life !== undefined ? p.life : 0.8) - dt
          if (p.life <= 0) {
            g.particles.splice(i, 1)
            continue
          }
          const maxLife = p.maxLife || 0.8
          p.alpha = Math.max(0, Math.min(1, p.life / maxLife))
          p.x += (p.vx || 0) * dt
          p.y += (p.vy || 0) * dt
          if (p.gravity) {
            p.vy += p.gravity * dt
          }
          if (p.vRot) {
            p.rot = (p.rot || 0) + p.vRot * dt
          }
        }
      }

      drawScene(ctx, g, activeCharImg, customCharRef.current, activeSkinId, now)

      if (g.status === 'paused') {
        ctx.fillStyle = 'rgba(10, 25, 47, 0.65)'
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.font = '900 38px Fredoka, Nunito, system-ui'
        ctx.fillText('PAUSED', W / 2, H / 2 - 10)
        ctx.font = '700 15px Nunito, system-ui'
        ctx.fillText('Tap Resume or Press P', W / 2, H / 2 + 24)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const toggleSound = () => {
    sound.playClick()
    setSoundOn((prev) => !prev)
  }

  const toggleMusic = () => {
    sound.playClick()
    setMusicOn((prev) => !prev)
  }

  const triggerPottyBoing = () => {
    setPottyWiggle(true)
    sound.playPotty()
    setPottyQuote(POTTY_QUOTES[Math.floor(Math.random() * POTTY_QUOTES.length)])
    setTimeout(() => setPottyWiggle(false), 500)
  }

  const currentTheme = getThemeForScore(score)
  const selectedAgent = AGENTS.find((a) => a.id === skinId) || AGENTS[0]

  return (
    <main className={`app-shell ${isFullscreen ? 'is-fullscreen' : ''}`}>
      <div className="desktop-ambient-backdrop" />

      {/* Hidden File Input for Custom Photo Avatar */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className="arcade-cabinet">
        {/* Topbar Header */}
        <header className="topbar">
          <div className="brand" onClick={() => resetGame(modeName, false)}>
            <div className="brand-mark">
              <Sparkles size={18} />
            </div>
            <div className="brand-text">
              <span className="brand-main">
                HUMAN <b>FLAPPY</b>
              </span>
              <span className="brand-sub">KIDS HERO FLIGHT</span>
            </div>
          </div>

          <div className="top-actions">
            {/* Background Music Toggle */}
            <button
              className={`icon-button ${!musicOn ? 'off' : ''}`}
              onClick={toggleMusic}
              title={musicOn ? 'Mute Music (BGM)' : 'Unmute Music (BGM)'}
              aria-label="Toggle Background Music"
            >
              <span>{musicOn ? '🎵' : '🔇'}</span>
            </button>

            {/* Sound Effects Toggle */}
            <button
              className={`icon-button ${!soundOn ? 'off' : ''}`}
              onClick={toggleSound}
              title={soundOn ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
              aria-label="Toggle Sound Effects"
            >
              {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* PWA Direct Install Header Icon */}
            {!isStandalone && (
              <button
                className="icon-button"
                onClick={triggerInstallPrompt}
                title="Install App on Phone"
                aria-label="Install App"
              >
                <Download size={16} />
              </button>
            )}

            {/* Fullscreen Button */}
            <button
              className={`icon-button fullscreen-btn ${isFullscreen ? 'active-fullscreen' : ''}`}
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Full Screen (F)' : 'Enter Full Screen (F)'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Pause Button */}
            {status === 'playing' && (
              <button
                className="icon-button pause-btn"
                onClick={togglePause}
                title="Pause Game"
                aria-label="Pause"
              >
                <Pause size={17} />
              </button>
            )}
          </div>
        </header>

        {/* Game Canvas Container */}
        <div className="game-frame canvas-container">
          <canvas
            ref={canvasRef}
            className="game-canvas"
            onPointerDown={(e) => {
              e.preventDefault()
              flap()
            }}
            aria-label="Human Flappy Game Screen"
          />

          {/* In-Game Floating HUD */}
          {status === 'playing' && (
            <div className="in-game-hud" style={{ pointerEvents: 'none' }}>
              <div className="hud-left-group" style={{ pointerEvents: 'auto' }}>
                {/* Red Ball Style 3-Heart Life Counter */}
                <div className="red-ball-hearts-container" aria-label={`Lives: ${lives} of 3`}>
                  {[1, 2, 3].map((heartIndex) => {
                    const isFilled = lives >= heartIndex
                    const isCritical = lives === 1 && isFilled
                    return (
                      <div
                        key={heartIndex}
                        className={`red-ball-heart-slot ${isFilled ? 'filled' : 'empty'} ${
                          isCritical ? 'critical' : ''
                        }`}
                      >
                        {isFilled ? (
                          <svg className="red-ball-heart-svg" viewBox="0 0 32 32">
                            <defs>
                              <radialGradient id={`heartGrad-${heartIndex}`} cx="35%" cy="30%" r="70%">
                                <stop offset="0%" stopColor="#ff7675" />
                                <stop offset="45%" stopColor="#d63031" />
                                <stop offset="100%" stopColor="#8b0000" />
                              </radialGradient>
                              <linearGradient
                                id={`heartSheen-${heartIndex}`}
                                x1="0%"
                                y1="0%"
                                x2="50%"
                                y2="80%"
                              >
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M16 29s-12-7.5-12-16a7 7 0 0 1 12-4.5A7 7 0 0 1 28 13c0 8.5-12 16-12 16z"
                              fill="rgba(0,0,0,0.3)"
                              transform="translate(0, 1.5)"
                            />
                            <path
                              d="M16 28s-12-7.5-12-16a7 7 0 0 1 12-4.5A7 7 0 0 1 28 12c0 8.5-12 16-12 16z"
                              fill={`url(#heartGrad-${heartIndex})`}
                              stroke="#b71540"
                              strokeWidth="1.2"
                            />
                            <ellipse
                              cx="10"
                              cy="9"
                              rx="4"
                              ry="2.2"
                              transform="rotate(-30 10 9)"
                              fill={`url(#heartSheen-${heartIndex})`}
                            />
                          </svg>
                        ) : (
                          <svg className="red-ball-heart-svg empty" viewBox="0 0 32 32">
                            <path
                              d="M16 28s-12-7.5-12-16a7 7 0 0 1 12-4.5A7 7 0 0 1 28 12c0 8.5-12 16-12 16z"
                              fill="rgba(20, 30, 45, 0.65)"
                              stroke="rgba(255, 255, 255, 0.25)"
                              strokeWidth="1.5"
                              strokeDasharray="2.5 1.5"
                            />
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>

                {isMonsterWorld ? (
                  <div className="hud-pill monster-pill">
                    <span>⛏️</span>
                    <b>UNDERGROUND CAVERN</b>
                  </div>
                ) : (
                  <div className="hud-pill theme-pill">
                    <span>{currentTheme.emoji}</span>
                    <b>{currentTheme.name}</b>
                  </div>
                )}
                {hasShield && (
                  <div className="hud-pill shield-pill">
                    <span>🫧</span>
                    <b>SHIELD ON</b>
                  </div>
                )}
              </div>

              <div className={`hud-score ${scorePop ? 'pop' : ''}`}>
                <span className="score-num">{score}</span>
                {activeBoosterTime > 0 ? (
                  <span className="dog-booster-hud">
                    🚀 DOG BOOST {activeBoosterTime.toFixed(1)}s
                  </span>
                ) : score >= 60 ? (
                  <span className="dog-tail-badge" title="Dog on your tail!">
                    🐶 DOG TAILING!
                  </span>
                ) : score >= 15 ? (
                  <span className="dog-helper-badge">🐶 DOG HELPER</span>
                ) : null}
              </div>

              <div className="hud-pill mode-pill" style={{ borderColor: (MODES[modeName] || MODES.Chill).color }}>
                <span>{(MODES[modeName] || MODES.Chill).icon}</span>
                <b>{(MODES[modeName] || MODES.Chill).name}</b>
              </div>
            </div>
          )}

          {/* Splash Screen UI/UX Overlay */}
          {showSplash && (
            <div className="splash-screen-overlay" onClick={() => setShowSplash(false)}>
              <div className="splash-ambient-glow" />
              <div className="splash-card" onClick={(e) => e.stopPropagation()}>
                <div className="splash-badge">A SPECIAL FLAPPY ADVENTURE</div>

                {/* Animated Pulsing Heart */}
                <div className="splash-heart-wrapper">
                  <span className="splash-big-heart">❤️</span>
                  <div className="splash-heart-pulse-ring" />
                </div>

                <h2 className="splash-subtitle">
                  Made with <span className="heart-span">❤</span> for
                </h2>
                <h1 className="splash-names-title">Shivansh & Aadya</h1>

                <p className="splash-tagline">
                  Soar with Agent Spark, Shadow, Booboo, RoboCat, Arachno & Mampi! Dodge dragon fire &
                  explore the underground cavern!
                </p>

                {/* 5 Hero Agents preview */}
                <div className="splash-agents-row">
                  {AGENTS.map((agent) => (
                    <div
                      key={agent.id}
                      className="splash-agent-bubble"
                      style={{ borderColor: agent.color }}
                      title={agent.name}
                    >
                      <img src={agent.imgUrl} alt={agent.name} />
                    </div>
                  ))}
                </div>

                <button
                  className="splash-start-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSplash(false)
                    resetGame(modeName, true)
                  }}
                >
                  <span>TAP TO PLAY</span>
                  <b>🎮</b>
                </button>

                <span className="splash-skip-note" onClick={() => setShowSplash(false)}>
                  Or tap outside to enter menu
                </span>
              </div>
            </div>
          )}

          {/* Menu Overlay */}
          {status === 'menu' && !menuPanel && (
            <div className="overlay menu-overlay">
              <div className="menu-header">
                {/* Dedication Banner */}
                <button
                  className="menu-dedication-pill"
                  onClick={() => setShowSplash(true)}
                  title="View Dedication"
                >
                  <span>Made with ❤️ for Shivansh and Aadya</span>
                  <small>✨</small>
                </button>

                <div className="eyebrow">
                  <span className="pulse-dot" /> EPIC KIDS ADVENTURE
                </div>
                <h1 className="game-logo">
                  FLAPPY <span className="highlight-text">HUMAN</span>
                </h1>
                <p className="tagline">6 Epic Agents · Dragon Boss · Underground Cavern!</p>
              </div>

              {/* Active Character Preview Pill */}
              <button
                className="active-char-banner"
                onClick={() => {
                  sound.playClick()
                  setMenuPanel('characters')
                }}
              >
                <span className="char-badge-icon">
                  {skinId === 'custom' ? '📸' : selectedAgent.icon}
                </span>
                <div className="char-badge-text">
                  <small>FLYING AGENT</small>
                  <b>{skinId === 'custom' ? 'Custom Pilot' : selectedAgent.name}</b>
                </div>
                <span className="char-badge-change">CHANGE ❯</span>
              </button>

              {/* Four Levels Picker: Chill, Pro, Adventure, Extreme */}
              <div className="difficulty-container">
                <div className="picker-title">CHOOSE YOUR LEVEL</div>
                <div className="mode-picker-grid" role="radiogroup" aria-label="Level Selection">
                  {LEVEL_NAMES.map((m) => {
                    const info = MODES[m]
                    const isSel = modeName === m
                    return (
                      <button
                        key={m}
                        className={`mode-card ${isSel ? 'selected' : ''}`}
                        onClick={() => chooseMode(m)}
                        style={{ '--mode-color': info.color }}
                      >
                        <span className="mode-card-icon">{info.icon}</span>
                        <div className="mode-card-info">
                          <strong className="mode-name">{info.name}</strong>
                          <small className="mode-desc">{info.badge}</small>
                        </div>
                        <span className="mode-best">🏆 {bestScores[m] || 0}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Big Play Button */}
              <button
                className="big-play-button"
                onClick={() => resetGame(modeName, true)}
                aria-label="Start Game"
              >
                <Play size={24} fill="currentColor" />
                <span>TAP TO FLY!</span>
              </button>

              {/* PWA Install Button on Main Menu */}
              {!isStandalone && (
                <button
                  className="pwa-install-menu-btn"
                  onClick={triggerInstallPrompt}
                  aria-label="Install App on Phone"
                >
                  <Download size={15} />
                  <span>INSTALL APP ON PHONE 📲</span>
                </button>
              )}

              {/* Quick Navigation Footer */}
              <div className="quick-menu-row">
                <button
                  className="quick-menu-btn quick-icon-btn"
                  onClick={() => {
                    sound.playClick()
                    setMenuPanel('characters')
                  }}
                  title="Hero Agents"
                >
                  <Shirt size={18} />
                  <span>Agents</span>
                </button>
                <button
                  className="quick-menu-btn quick-icon-btn"
                  onClick={() => {
                    sound.playClick()
                    setMenuPanel('leaderboard')
                  }}
                  title="High Scores"
                >
                  <Trophy size={18} />
                  <span>Scores</span>
                </button>
                <button
                  className="quick-menu-btn quick-icon-btn"
                  onClick={() => {
                    sound.playClick()
                    setMenuPanel('howto')
                  }}
                  title="How to Play"
                >
                  <BookOpen size={18} />
                  <span>Rules</span>
                </button>
                <button
                  className="quick-menu-btn quick-icon-btn"
                  onClick={() => {
                    sound.playClick()
                    setMenuPanel('settings')
                  }}
                  title="Settings"
                >
                  <Settings size={18} />
                  <span>Config</span>
                </button>
              </div>

              <div className="control-hints">
                <span>📱 Tap Screen</span>
                <span>•</span>
                <span>⌨️ Space / Up</span>
                <span>•</span>
                <span>🖥️ F: Fullscreen</span>
              </div>
            </div>
          )}

          {/* Modal Panels */}
          {Boolean(menuPanel) && (
            <div className="overlay modal-overlay" onClick={() => setMenuPanel('')}>
              <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <button
                  className="modal-close-btn"
                  onClick={() => {
                    sound.playClick()
                    setMenuPanel('')
                  }}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                {menuPanel === 'characters' && (
                  <div className="modal-content">
                    <div className="modal-icon-badge">
                      <Sparkles size={26} />
                    </div>
                    <h2>6 HERO AGENTS</h2>
                    <p className="modal-desc">
                      Select your flying hero or upload your own photo!
                    </p>

                    <div className="skin-grid skin-cards-list">
                      {AGENTS.map((agent) => {
                        const isSel = skinId === agent.id
                        return (
                          <div
                            key={agent.id}
                            className={`skin-card ${isSel ? 'selected' : ''}`}
                            onClick={() => selectSkin(agent.id)}
                            style={{ '--accent-color': agent.color }}
                          >
                            <div className="skin-thumb">
                              <img src={agent.imgUrl} alt={agent.name} />
                            </div>
                            <div className="skin-details">
                              <b>
                                {agent.name} {agent.icon}
                              </b>
                              <small>{agent.description}</small>
                            </div>
                            {isSel ? (
                              <span className="skin-check">✓ ACTIVE</span>
                            ) : (
                              <span className="skin-select-tag">SELECT</span>
                            )}
                          </div>
                        )
                      })}

                      {/* Custom Photo Face Uploader */}
                      <div
                        className={`skin-card custom-uploader-card ${
                          skinId === 'custom' ? 'selected' : ''
                        }`}
                        onClick={() => {
                          if (customSkinUrl) {
                            selectSkin('custom')
                          } else {
                            fileInputRef.current?.click()
                          }
                        }}
                      >
                        <div className="skin-thumb custom-thumb">
                          {customSkinUrl ? (
                            <img src={customSkinUrl} alt="Your custom photo" />
                          ) : (
                            <Camera size={24} color="#00b4d8" />
                          )}
                        </div>
                        <div className="skin-details">
                          <b>Fly As Yourself 📸</b>
                          <small>
                            {customSkinUrl
                              ? 'Your photo is active!'
                              : 'Tap to upload your face/selfie!'}
                          </small>
                        </div>
                        <button
                          className="upload-photo-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            fileInputRef.current?.click()
                          }}
                        >
                          <Upload size={13} /> {customSkinUrl ? 'CHANGE' : 'UPLOAD'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {menuPanel === 'leaderboard' && (
                  <div className="modal-content">
                    <div className="modal-icon-badge trophy-badge">
                      <Trophy size={26} />
                    </div>
                    <h2>LEVEL HIGH SCORES</h2>
                    <p className="modal-desc">Personal records tracked across all 4 levels:</p>

                    <div className="level-scores-list">
                      {LEVEL_NAMES.map((m) => (
                        <div key={m} className="score-row-card">
                          <span className="row-icon">{MODES[m].icon}</span>
                          <div className="row-title">
                            <b>{m} Level</b>
                            <small>{MODES[m].description}</small>
                          </div>
                          <strong className="row-pts">{bestScores[m] || 0} pts</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {menuPanel === 'howto' && (
                  <div className="modal-content">
                    <div className="modal-icon-badge">
                      <BookOpen size={26} />
                    </div>
                    <h2>HOW TO PLAY</h2>
                    <div className="how-to-steps">
                      <div className="step-item">
                        <span className="step-num">1</span>
                        <div>
                          <b>Flap Upward & Controls:</b>
                          <p>
                            Tap screen, click mouse, or press <b>SPACE / UP / W</b>. Press <b>P</b> to pause, and <b>F</b> for full-screen mode!
                          </p>
                        </div>
                      </div>
                      <div className="step-item">
                        <span className="step-num">2</span>
                        <div>
                          <b>Red Ball Heart Lives ❤️❤️❤️:</b>
                          <p>
                            You have 3 heart lives! Colliding with obstacles costs 1 heart with brief
                            invulnerability. Collect floating hearts (💖) to heal!
                          </p>
                        </div>
                      </div>
                      <div className="step-item">
                        <span className="step-num">3</span>
                        <div>
                          <b>Tail Dog Helper & Rocket Booster 🐶:</b>
                          <p>
                            After score 15, your tail pup helps you fly! Collect Golden Bones 🦴 for
                            a 5-second <b>Super Dog Rocket Booster</b>!
                          </p>
                        </div>
                      </div>
                      <div className="step-item">
                        <span className="step-num">4</span>
                        <div>
                          <b>Underground Cavern World ⛏️:</b>
                          <p>
                            Sucked into the deep cavern at score 20, 40, 60! Fly with your miner
                            lantern spotlight, mine amethyst/ruby gems, and board the Rescue Drill!
                          </p>
                        </div>
                      </div>
                      <div className="step-item">
                        <span className="step-num">5</span>
                        <div>
                          <b>Dragon Boss & Fireballs 🐲:</b>
                          <p>
                            At score 50+, a giant winged dragon swoops in and shoots blazing fireballs!
                            Dodge or deflect them to survive!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {menuPanel === 'settings' && (
                  <div className="modal-content">
                    <div className="modal-icon-badge">
                      <Settings size={26} />
                    </div>
                    <h2>GAME SETTINGS</h2>
                    <div className="settings-list">
                      <button className="settings-toggle-row" onClick={toggleSound}>
                        <div className="row-left">
                          {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                          <span>Sound Effects</span>
                        </div>
                        <span className={`toggle-pill ${soundOn ? 'on' : 'off'}`}>
                          {soundOn ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      <button className="settings-toggle-row" onClick={toggleMusic}>
                        <div className="row-left">
                          <span>🎵</span>
                          <span>Background Music (BGM)</span>
                        </div>
                        <span className={`toggle-pill ${musicOn ? 'on' : 'off'}`}>
                          {musicOn ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      <button className="settings-toggle-row" onClick={toggleFullscreen}>
                        <div className="row-left">
                          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                          <span>Full Screen Mode</span>
                        </div>
                        <span className={`toggle-pill ${isFullscreen ? 'on' : 'off'}`}>
                          {isFullscreen ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      <button
                        className="settings-toggle-row"
                        onClick={() => {
                          setShowSplash(true)
                          setMenuPanel('')
                        }}
                      >
                        <div className="row-left">
                          <span>❤️</span>
                          <span>Replay Dedication Splash</span>
                        </div>
                        <span className="toggle-pill on">VIEW</span>
                      </button>

                      {!isStandalone && (
                        <button className="settings-toggle-row" onClick={triggerInstallPrompt}>
                          <div className="row-left">
                            <Download size={20} />
                            <span>Install App to Home Screen</span>
                          </div>
                          <span className="toggle-pill on">INSTALL</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {menuPanel === 'install-guide' && (
                  <div className="modal-content">
                    <div className="modal-icon-badge">
                      <Download size={26} />
                    </div>
                    <h2>INSTALL ON YOUR PHONE</h2>
                    <p className="modal-desc">
                      Install Flappy Human as a native app on your Android or iPhone:
                    </p>
                    <div className="install-guide-steps">
                      <div className="install-device-block">
                        <b>🤖 Android (Chrome / Brave / Edge):</b>
                        <ol>
                          <li>Tap the browser three-dots menu (⋮) in the top-right.</li>
                          <li>Select <b>"Install app"</b> or <b>"Add to Home screen"</b>.</li>
                          <li>Launch Flappy Human in full-screen anytime from your app drawer!</li>
                        </ol>
                      </div>
                      <div className="install-device-block">
                        <b>🍎 iPhone / iPad (Safari):</b>
                        <ol>
                          <li>Tap the <b>Share button</b> (box with upward arrow) at the bottom.</li>
                          <li>Scroll down and tap <b>"Add to Home Screen"</b>.</li>
                          <li>Tap <b>Add</b> in the top right corner.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                <div className="modal-button-group">
                  <button className="big-play-button" onClick={togglePause}>
                    <Play size={20} fill="currentColor" /> RESUME FLIGHT
                  </button>
                  <button
                    className="secondary-action-btn fullscreen-action-btn"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
                    {isFullscreen ? 'EXIT FULLSCREEN' : 'FULL SCREEN'}
                  </button>
                  <button
                    className="secondary-action-btn"
                    onClick={() => resetGame(modeName, true)}
                  >
                    <RotateCcw size={17} /> RESTART
                  </button>
                  <button
                    className="secondary-action-btn"
                    onClick={() => resetGame(modeName, false)}
                  >
                    <Home size={17} /> MAIN MENU
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Game Over Modal with Potty Emoji */}
          {status === 'gameover' && (
            <div className="overlay modal-overlay gameover-overlay">
              <div className="modal-dialog gameover-dialog">
                <div
                  className={`potty-hero-badge ${pottyWiggle ? 'wiggle' : ''}`}
                  onClick={triggerPottyBoing}
                  title="Click me for a funny sound!"
                  role="button"
                  tabIndex={0}
                >
                  <span className="potty-emoji">💩</span>
                  <span className="potty-sparkle">✨</span>
                  <span className="potty-tap-hint">TAP ME!</span>
                </div>

                <div className="gameover-title-row">
                  <h2 className="gameover-header">OOPSIE POOPSIE! 💩</h2>
                  <p className="potty-quote-text">"{pottyQuote}"</p>
                </div>

                {/* Score Summary Box */}
                <div className="gameover-score-card">
                  <div className="score-col">
                    <small>RUN SCORE</small>
                    <span className="score-highlight">{score}</span>
                  </div>
                  <div className="score-divider-vert" />
                  <div className="score-col">
                    <small>{(modeName || 'Chill').toUpperCase()} BEST</small>
                    <span className="best-highlight">{bestScores[modeName] || 0}</span>
                  </div>
                </div>

                {/* Badges Earned */}
                <div className="run-badges-row">
                  <span className="run-badge">
                    {(MODES[modeName] || MODES.Chill).icon} {modeName}
                  </span>
                  <span className="run-badge">
                    {currentTheme.emoji} {currentTheme.name}
                  </span>
                  {score >= 50 && (
                    <span className="run-badge dragon-badge">
                      🐲 Dragon Challenger!
                    </span>
                  )}
                  {score >= 20 && (
                    <span className="run-badge monster-badge">
                      ⛏️ Cavern Explorer!
                    </span>
                  )}
                  {score >= 15 && (
                    <span className="run-badge dog-badge">
                      🚀 Dog Jetpack Booster!
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="modal-button-group">
                  <button className="big-play-button" onClick={() => resetGame(modeName, true)}>
                    <RotateCcw size={20} /> FLAP AGAIN!
                  </button>
                  <button
                    className="secondary-action-btn"
                    onClick={() => resetGame(modeName, false)}
                  >
                    <Home size={17} /> MAIN MENU
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
