// Consistent, high-fidelity canvas rendering for themes, backgrounds, obstacles & elements

export const THEMES = [
  {
    id: 'sunny_meadow',
    name: 'Sunny Meadow',
    emoji: '☀️',
    badge: 'Meadow Flight',
    sky: ['#1595eb', '#7ae2ff', '#d8f8ff'],
    pipeColor: { base: '#27ae60', cap: '#2ecc71', grad: ['#1e824c', '#2ecc71', '#a2f55e', '#27ae60'], rim: '#145a32' },
    ground: { grass: '#2ecc71', sub: '#e67e22', trim: '#27ae60' },
    sunType: 'happy_sun',
    birdType: 'bluebirds',
    homeType: 'cottages',
    elements: 'flowers',
  },
  {
    id: 'sunset_valley',
    name: 'Sunset Valley',
    emoji: '🌅',
    badge: 'Golden Dusk',
    sky: ['#3d155f', '#bf436b', '#f39c12', '#fde3a7'],
    pipeColor: { base: '#d35400', cap: '#e67e22', grad: ['#962d00', '#e67e22', '#f39c12', '#ba4a00'], rim: '#6e2300' },
    ground: { grass: '#c0392b', sub: '#78281f', trim: '#962d00' },
    sunType: 'sunset_sun',
    birdType: 'swallows',
    homeType: 'suburban',
    elements: 'windmills',
  },
  {
    id: 'rainbow_candyland',
    name: 'Rainbow Candy',
    emoji: '🍭',
    badge: 'Sugar Sky',
    sky: ['#7928ca', '#ff0080', '#ff9900', '#ffea79'],
    pipeColor: { base: '#e91e63', cap: '#ff4081', grad: ['#c2185b', '#ff4081', '#f48fb1', '#c2185b'], rim: '#880e4f' },
    ground: { grass: '#00b894', sub: '#fd79a8', trim: '#00cec9' },
    sunType: 'sunglass_sun',
    birdType: 'rainbow_birds',
    homeType: 'mushrooms',
    elements: 'lollipops',
  },
  {
    id: 'midnight_stars',
    name: 'Starry Midnight',
    emoji: '🌙',
    badge: 'Night Flight',
    sky: ['#040a18', '#0c1b33', '#19335a'],
    pipeColor: { base: '#6c5ce7', cap: '#a29bfe', grad: ['#4834d4', '#6c5ce7', '#a29bfe', '#4834d4'], rim: '#241571' },
    ground: { grass: '#1e3799', sub: '#0c2461', trim: '#4a69bd' },
    sunType: 'crescent_moon',
    birdType: 'owls_bats',
    homeType: 'treehouses',
    elements: 'fireflies',
  },
  {
    id: 'desert_oasis',
    name: 'Desert Oasis',
    emoji: '🏜️',
    badge: 'Mirage Sands',
    sky: ['#0077b6', '#00b4d8', '#caf0f8'],
    pipeColor: { base: '#d4a373', cap: '#faedcd', grad: ['#a9714b', '#d4a373', '#e9edc9', '#b07d56'], rim: '#7f4f24' },
    ground: { grass: '#e76f51', sub: '#f4a261', trim: '#e76f51' },
    sunType: 'blazing_sun',
    birdType: 'falcons',
    homeType: 'adobe',
    elements: 'palms',
  },
  {
    id: 'cloud_kingdom',
    name: 'Cloud Kingdom',
    emoji: '🏰',
    badge: 'Sky Spire',
    sky: ['#0072ff', '#00c6ff', '#e0f7fa'],
    pipeColor: { base: '#00cec9', cap: '#81ecec', grad: ['#0984e3', '#74b9ff', '#dff9fb', '#0984e3'], rim: '#005b96' },
    ground: { grass: '#0984e3', sub: '#74b9ff', trim: '#dfe6e9' },
    sunType: 'crystal_sun',
    birdType: 'doves',
    homeType: 'castles',
    elements: 'floating_islands',
  },
  {
    id: 'canyon_chase',
    name: 'Canyon Chase',
    emoji: '🐾',
    badge: 'Puppy Canyon',
    sky: ['#2d004b', '#7209b7', '#f72585', '#ff9e00'],
    pipeColor: { base: '#f39c12', cap: '#f1c40f', grad: ['#d35400', '#f39c12', '#f1c40f', '#e67e22'], rim: '#2c3e50', striped: true },
    ground: { grass: '#d63031', sub: '#631e1e', trim: '#e17055' },
    sunType: 'blood_sun',
    birdType: 'chase_birds',
    homeType: 'doghouses',
    elements: 'bones',
  },
]

export function getThemeForScore(score) {
  const index = Math.floor(score / 10) % THEMES.length
  return THEMES[index]
}

// Background birds generator
export function makeThemeBirds() {
  return [
    { x: 30, y: 130, speed: 38, size: 0.85, flapSpeed: 8, wing: 0 },
    { x: 190, y: 85, speed: 46, size: 0.7, flapSpeed: 10, wing: 1 },
    { x: 320, y: 165, speed: 32, size: 0.95, flapSpeed: 7, wing: 2 },
    { x: 420, y: 110, speed: 42, size: 0.78, flapSpeed: 9, wing: 3 },
  ]
}

// Background homes / structures generator
export function makeHomes() {
  return [
    { x: 25, type: 'cottage', scale: 1 },
    { x: 135, type: 'windmill', scale: 0.95 },
    { x: 245, type: 'cozy_home', scale: 1.05 },
    { x: 355, type: 'church_tower', scale: 0.9 },
  ]
}

// Draw dense twinkling stars, constellations and floating fireflies in the background
export function drawBackgroundStars(ctx, theme, now, W, H) {
  const isNight = theme.id === 'midnight_stars' || theme.sunType === 'crescent_moon'
  const isDusk = theme.id === 'sunset_valley' || theme.id === 'canyon_chase' || theme.id === 'rainbow_candyland'

  // Starry Midnight or evening twilight stars
  if (!isNight && !isDusk) return

  ctx.save()
  const count = isNight ? 65 : 28

  for (let i = 0; i < count; i++) {
    const sx = (i * 83 + 17) % (W - 10) + 5
    const sy = (i * 53 + 23) % (isNight ? 450 : 260) + 15
    const twinkle = Math.sin(now * 0.0035 + i * 1.7) * 0.45 + 0.55
    const starSize = (i % 3 === 0) ? 2.5 : (i % 2 === 0) ? 1.8 : 1.2

    // Star core
    ctx.fillStyle = isNight ? `rgba(255, 255, 255, ${twinkle * 0.95})` : `rgba(255, 240, 180, ${twinkle * 0.55})`
    ctx.beginPath()
    ctx.arc(sx, sy, starSize, 0, Math.PI * 2)
    ctx.fill()

    // 4-point sparkle cross on brightest stars
    if (i % 5 === 0 && isNight) {
      const sparkleLen = 4 + twinkle * 3
      ctx.strokeStyle = `rgba(255, 255, 255, ${twinkle * 0.75})`
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(sx - sparkleLen, sy)
      ctx.lineTo(sx + sparkleLen, sy)
      ctx.moveTo(sx, sy - sparkleLen)
      ctx.lineTo(sx, sy + sparkleLen)
      ctx.stroke()

      // Star soft glow
      ctx.fillStyle = `rgba(210, 240, 255, ${twinkle * 0.25})`
      ctx.beginPath()
      ctx.arc(sx, sy, sparkleLen * 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Floating glowing fireflies drifting in Starry Midnight
  if (isNight) {
    for (let f = 0; f < 10; f++) {
      const fx = ((f * 67 + Math.sin(now * 0.003 + f) * 25) % W + W) % W
      const fy = ((380 - (now * 0.02 + f * 42) % 320) + 320) % 320 + 120
      const fGlow = Math.sin(now * 0.006 + f) * 0.4 + 0.6

      ctx.fillStyle = `rgba(220, 255, 80, ${fGlow * 0.8})`
      ctx.beginPath()
      ctx.arc(fx, fy, 2, 0, Math.PI * 2)
      ctx.fill()

      // Firefly aura
      ctx.fillStyle = `rgba(220, 255, 80, ${fGlow * 0.2})`
      ctx.beginPath()
      ctx.arc(fx, fy, 6, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}

// Draw the Celestial Sun or Moon with animations
export function drawSun(ctx, theme, now, W, H) {
  const t = theme.sunType
  const sunX = 330
  const sunY = 115

  ctx.save()
  if (t === 'crescent_moon') {
    // Starry Midnight Crescent Moon
    const moonGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 65)
    moonGrad.addColorStop(0, 'rgba(255, 248, 200, 0.45)')
    moonGrad.addColorStop(1, 'rgba(255, 248, 200, 0)')
    ctx.fillStyle = moonGrad
    ctx.fillRect(sunX - 70, sunY - 70, 140, 140)

    ctx.save()
    ctx.translate(sunX, sunY)
    ctx.rotate(0.18)
    ctx.fillStyle = '#fff4bd'
    ctx.beginPath()
    ctx.arc(0, 0, 32, -Math.PI / 2, Math.PI / 2, false)
    ctx.bezierCurveTo(18, 20, 18, -20, 0, -32)
    ctx.closePath()
    ctx.fill()

    // Cute sleepy sleeping eye
    ctx.strokeStyle = '#c9a84d'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(10, -2, 6, 0.2, Math.PI - 0.2)
    ctx.stroke()
    ctx.restore()
  } else {
    // Sun variants
    let coreColor = '#ffd000'
    let rayColor = 'rgba(255, 220, 70, 0.35)'
    let glowColor = 'rgba(255, 235, 120, 0.28)'

    if (t === 'sunset_sun') {
      coreColor = '#ff6b35'
      rayColor = 'rgba(255, 130, 40, 0.35)'
      glowColor = 'rgba(255, 90, 30, 0.22)'
    } else if (t === 'sunglass_sun') {
      coreColor = '#ff3388'
      rayColor = 'rgba(255, 120, 200, 0.4)'
      glowColor = 'rgba(255, 180, 230, 0.25)'
    } else if (t === 'blazing_sun') {
      coreColor = '#ffa200'
      rayColor = 'rgba(255, 180, 0, 0.4)'
    } else if (t === 'crystal_sun') {
      coreColor = '#e0f7fa'
      rayColor = 'rgba(128, 222, 234, 0.45)'
      glowColor = 'rgba(255, 255, 255, 0.5)'
    } else if (t === 'blood_sun') {
      coreColor = '#e63946'
      rayColor = 'rgba(230, 57, 70, 0.35)'
      glowColor = 'rgba(255, 100, 110, 0.25)'
    }

    // Outer warm halo
    const glow = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 120)
    glow.addColorStop(0, glowColor)
    glow.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = glow
    ctx.fillRect(sunX - 130, sunY - 130, 260, 260)

    // Animated rotating sun rays
    ctx.save()
    ctx.translate(sunX, sunY)
    const rot = (now * 0.0006) % (Math.PI * 2)
    ctx.rotate(rot)
    ctx.fillStyle = rayColor
    for (let i = 0; i < 12; i++) {
      ctx.beginPath()
      ctx.moveTo(-7, 34)
      ctx.lineTo(7, 34)
      ctx.lineTo(0, 56 + Math.sin(now * 0.004 + i) * 5)
      ctx.closePath()
      ctx.fill()
      ctx.rotate((Math.PI * 2) / 12)
    }
    ctx.restore()

    // Core Sun
    ctx.fillStyle = coreColor
    ctx.beginPath()
    ctx.arc(sunX, sunY, 34, 0, Math.PI * 2)
    ctx.fill()

    // Cute facial features for Sun
    if (t === 'sunglass_sun') {
      // Cool retro sunglasses
      ctx.fillStyle = '#1e1e2f'
      ctx.beginPath()
      ctx.roundRect(sunX - 22, sunY - 8, 18, 12, 3)
      ctx.roundRect(sunX + 4, sunY - 8, 18, 12, 3)
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(sunX - 4, sunY - 2)
      ctx.lineTo(sunX + 4, sunY - 2)
      ctx.stroke()
      // Smile
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(sunX, sunY + 8, 9, 0.2, Math.PI - 0.2)
      ctx.stroke()
    } else {
      // Happy friendly cartoon face
      const blink = Math.sin(now * 0.002) > 0.96
      ctx.fillStyle = t === 'sunset_sun' || t === 'blood_sun' ? '#5a1212' : '#7a4500'
      if (blink) {
        ctx.strokeStyle = ctx.fillStyle
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(sunX - 14, sunY - 3)
        ctx.lineTo(sunX - 6, sunY - 3)
        ctx.moveTo(sunX + 6, sunY - 3)
        ctx.lineTo(sunX + 14, sunY - 3)
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(sunX - 10, sunY - 4, 3.5, 0, Math.PI * 2)
        ctx.arc(sunX + 10, sunY - 4, 3.5, 0, Math.PI * 2)
        ctx.fill()
      }
      // Rosy cheeks
      ctx.fillStyle = 'rgba(255, 100, 100, 0.45)'
      ctx.beginPath()
      ctx.arc(sunX - 16, sunY + 5, 5, 0, Math.PI * 2)
      ctx.arc(sunX + 16, sunY + 5, 5, 0, Math.PI * 2)
      ctx.fill()
      // Joyful smile
      ctx.strokeStyle = t === 'sunset_sun' || t === 'blood_sun' ? '#5a1212' : '#7a4500'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.arc(sunX, sunY + 5, 10, 0.2, Math.PI - 0.2)
      ctx.stroke()
    }
  }
  ctx.restore()
}

// Draw friendly birds flocking in the background
export function drawThemeBirds(ctx, birds, theme, now, W) {
  birds.forEach((b) => {
    ctx.save()
    ctx.translate(b.x, b.y)
    ctx.scale(b.size, b.size)

    const wingAngle = Math.sin(now * 0.008 * b.flapSpeed + b.wing) * 0.55

    if (theme.birdType === 'owls_bats') {
      // Cute nocturnal bat
      ctx.fillStyle = '#2c2541'
      ctx.beginPath()
      ctx.ellipse(0, 0, 7, 9, 0, 0, Math.PI * 2)
      ctx.fill()
      // Bat wings
      ctx.fillStyle = '#3f335e'
      ctx.beginPath()
      ctx.moveTo(-4, -2)
      ctx.quadraticCurveTo(-18, -12 + wingAngle * 10, -22, -2)
      ctx.quadraticCurveTo(-14, 8, -4, 4)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(4, -2)
      ctx.quadraticCurveTo(18, -12 + wingAngle * 10, 22, -2)
      ctx.quadraticCurveTo(14, 8, 4, 4)
      ctx.fill()
      // Glowing bat eyes
      ctx.fillStyle = '#ffec40'
      ctx.fillRect(-3, -4, 2, 2)
      ctx.fillRect(1, -4, 2, 2)
    } else {
      // Colorful chirping songbird
      let bodyCol = '#3498db'
      let wingCol = '#2980b9'
      let beakCol = '#f39c12'

      if (theme.birdType === 'swallows') {
        bodyCol = '#2c3e50'; wingCol = '#1a252f'; beakCol = '#f1c40f'
      } else if (theme.birdType === 'rainbow_birds') {
        bodyCol = '#e84393'; wingCol = '#fd79a8'; beakCol = '#ffeaa7'
      } else if (theme.birdType === 'falcons') {
        bodyCol = '#b9770e'; wingCol = '#7e5109'; beakCol = '#f5b041'
      } else if (theme.birdType === 'doves') {
        bodyCol = '#ffffff'; wingCol = '#dfe6e9'; beakCol = '#e17055'
      } else if (theme.birdType === 'chase_birds') {
        bodyCol = '#e74c3c'; wingCol = '#c0392b'; beakCol = '#f1c40f'
      }

      // Bird body
      ctx.fillStyle = bodyCol
      ctx.beginPath()
      ctx.ellipse(0, 0, 12, 7, 0.1, 0, Math.PI * 2)
      ctx.fill()

      // Cute eye
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(6, -2, 2.8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(7, -2, 1.4, 0, Math.PI * 2)
      ctx.fill()

      // Beak
      ctx.fillStyle = beakCol
      ctx.beginPath()
      ctx.moveTo(11, -1)
      ctx.lineTo(16, 1)
      ctx.lineTo(11, 3)
      ctx.closePath()
      ctx.fill()

      // Flapping wing
      ctx.save()
      ctx.translate(-2, -1)
      ctx.rotate(wingAngle)
      ctx.fillStyle = wingCol
      ctx.beginPath()
      ctx.ellipse(0, -6, 5, 10, -0.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Tail feather
      ctx.fillStyle = wingCol
      ctx.beginPath()
      ctx.moveTo(-11, 0)
      ctx.lineTo(-18, -4)
      ctx.lineTo(-17, 2)
      ctx.closePath()
      ctx.fill()
    }

    ctx.restore()
  })
}

// Draw village homes, cottages, windmills and landscape architecture
export function drawThemeHomes(ctx, homes, theme, now, groundY) {
  const t = theme.homeType

  homes.forEach((h) => {
    const x = h.x
    const y = groundY - 2

    ctx.save()
    if (t === 'cottages' || t === 'suburban') {
      // Cozy village home with chimney and smoke puffs
      const hw = 44 * h.scale
      const hh = 34 * h.scale

      // House walls
      ctx.fillStyle = t === 'suburban' ? '#f5cd79' : '#f8efba'
      ctx.fillRect(x - hw / 2, y - hh, hw, hh)

      // Peaked roof
      ctx.fillStyle = t === 'suburban' ? '#b71540' : '#e55039'
      ctx.beginPath()
      ctx.moveTo(x - hw / 2 - 6, y - hh)
      ctx.lineTo(x, y - hh - 22 * h.scale)
      ctx.lineTo(x + hw / 2 + 6, y - hh)
      ctx.closePath()
      ctx.fill()

      // Chimney & animated smoke
      const chimX = x + hw / 3
      const chimY = y - hh - 12 * h.scale
      ctx.fillStyle = '#b33939'
      ctx.fillRect(chimX - 4, chimY - 12, 8, 14)

      // Smoke puffs
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)'
      for (let s = 0; s < 3; s++) {
        const sy = chimY - 16 - s * 10 - ((now * 0.02 + s * 8) % 24)
        const sx = chimX + Math.sin(now * 0.003 + s) * 4
        const sr = 3 + s * 1.8
        ctx.beginPath()
        ctx.arc(sx, sy, sr, 0, Math.PI * 2)
        ctx.fill()
      }

      // Glowing cozy window
      ctx.fillStyle = t === 'suburban' ? '#ffeaa7' : '#74b9ff'
      ctx.fillRect(x - 9, y - hh + 8, 8, 8)
      ctx.fillRect(x + 3, y - hh + 8, 8, 8)
      ctx.strokeStyle = '#2d3436'
      ctx.lineWidth = 1
      ctx.strokeRect(x - 9, y - hh + 8, 8, 8)
      ctx.strokeRect(x + 3, y - hh + 8, 8, 8)

      // Door
      ctx.fillStyle = '#834c32'
      ctx.fillRect(x - 5, y - 14, 10, 14)

      // If it's the second home, draw an animated spinning windmill!
      if (h.type === 'windmill') {
        const wx = x + 35
        const wy = y - 40
        ctx.fillStyle = '#dfe6e9'
        ctx.beginPath()
        ctx.moveTo(wx - 10, y)
        ctx.lineTo(wx - 6, wy)
        ctx.lineTo(wx + 6, wy)
        ctx.lineTo(wx + 10, y)
        ctx.closePath()
        ctx.fill()

        // Rotating blades
        ctx.save()
        ctx.translate(wx, wy)
        ctx.rotate(now * 0.0018)
        ctx.fillStyle = '#2c3e50'
        for (let b = 0; b < 4; b++) {
          ctx.beginPath()
          ctx.moveTo(-2, 0)
          ctx.lineTo(2, 0)
          ctx.lineTo(4, 24)
          ctx.lineTo(-4, 24)
          ctx.closePath()
          ctx.fill()
          ctx.rotate(Math.PI / 2)
        }
        ctx.fillStyle = '#e74c3c'
        ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      }
    } else if (t === 'mushrooms') {
      // Magical candy mushroom homes
      const mw = 36 * h.scale
      // Mushroom stem
      ctx.fillStyle = '#f5f6fa'
      ctx.beginPath()
      ctx.roundRect(x - 10, y - 28, 20, 28, 6)
      ctx.fill()
      // Mushroom cap
      ctx.fillStyle = '#ff4757'
      ctx.beginPath()
      ctx.arc(x, y - 28, mw / 2, Math.PI, 0, false)
      ctx.closePath()
      ctx.fill()
      // Polka dots
      ctx.fillStyle = '#ffffff'
      ;[-8, 0, 8].forEach((dx, i) => {
        ctx.beginPath()
        ctx.arc(x + dx, y - 36 + (i % 2) * 5, 3.5, 0, Math.PI * 2)
        ctx.fill()
      })
      // Door
      ctx.fillStyle = '#57606f'
      ctx.beginPath()
      ctx.roundRect(x - 4, y - 12, 8, 12, 3)
      ctx.fill()
    } else if (t === 'treehouses') {
      // Enchanted treetop cabins with lanterns
      ctx.fillStyle = '#2d3436'
      ctx.fillRect(x - 6, y - 48, 12, 48)
      // Foliage
      ctx.fillStyle = '#1e272e'
      ctx.beginPath()
      ctx.arc(x, y - 56, 26, 0, Math.PI * 2)
      ctx.fill()
      // Cute treehouse
      ctx.fillStyle = '#d63031'
      ctx.fillRect(x - 12, y - 62, 24, 16)
      // Glowing warm lantern
      ctx.fillStyle = '#f1c40f'
      ctx.beginPath()
      ctx.arc(x + 14, y - 50, 4.5, 0, Math.PI * 2)
      ctx.fill()
      // Lantern glow halo
      ctx.fillStyle = 'rgba(241, 196, 15, 0.35)'
      ctx.beginPath()
      ctx.arc(x + 14, y - 50, 11, 0, Math.PI * 2)
      ctx.fill()
    } else if (t === 'adobe') {
      // Desert adobe home with palm tree
      const aw = 42 * h.scale
      const ah = 28 * h.scale
      ctx.fillStyle = '#e1b12c'
      ctx.fillRect(x - aw / 2, y - ah, aw, ah)
      ctx.fillStyle = '#834c32'
      ctx.fillRect(x - 5, y - 14, 10, 14)
      // Palm tree nearby
      const px = x + 30
      ctx.strokeStyle = '#834c32'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(px, y)
      ctx.quadraticCurveTo(px + 6, y - 25, px + 10, y - 45)
      ctx.stroke()
      // Palm leaves
      ctx.fillStyle = '#27ae60'
      for (let a = -1.2; a <= 1.2; a += 0.6) {
        ctx.beginPath()
        ctx.ellipse(px + 10 + Math.cos(a) * 14, y - 45 + Math.sin(a) * 6, 14, 4, a, 0, Math.PI * 2)
        ctx.fill()
      }
    } else if (t === 'castles') {
      // Grand sky fairy-tale spires
      ctx.fillStyle = '#dfe6e9'
      ctx.fillRect(x - 14, y - 48, 28, 48)
      // Spire cone
      ctx.fillStyle = '#0984e3'
      ctx.beginPath()
      ctx.moveTo(x - 16, y - 48)
      ctx.lineTo(x, y - 76)
      ctx.lineTo(x + 16, y - 48)
      ctx.closePath()
      ctx.fill()
      // Flying flag
      ctx.fillStyle = '#ff7675'
      ctx.beginPath()
      ctx.moveTo(x, y - 76)
      ctx.lineTo(x + 12 + Math.sin(now * 0.006) * 3, y - 72)
      ctx.lineTo(x, y - 68)
      ctx.closePath()
      ctx.fill()
    } else {
      // Canyon doghouses with bones
      ctx.fillStyle = '#d63031'
      ctx.fillRect(x - 16, y - 26, 32, 26)
      // Roof
      ctx.fillStyle = '#2d3436'
      ctx.beginPath()
      ctx.moveTo(x - 20, y - 26)
      ctx.lineTo(x, y - 42)
      ctx.lineTo(x + 20, y - 26)
      ctx.closePath()
      ctx.fill()
      // Arched doorway
      ctx.fillStyle = '#1e272e'
      ctx.beginPath()
      ctx.arc(x, y - 10, 8, Math.PI, 0)
      ctx.rect(x - 8, y - 10, 16, 10)
      ctx.fill()
      // Bone icon over door
      ctx.fillStyle = '#fff'
      ctx.fillRect(x - 6, y - 23, 12, 3)
      ctx.beginPath()
      ctx.arc(x - 6, y - 21.5, 2.5, 0, Math.PI * 2)
      ctx.arc(x + 6, y - 21.5, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  })
}

// Draw thematic pipes / obstacles with polished cartoon shading
export function drawThematicPipe(ctx, x, y, w, h, isTop, theme) {
  const cap = 24
  const bodyY = isTop ? y : y + cap
  const bodyH = Math.max(0, h - cap)
  const colors = (theme && theme.pipeColor) || {
    base: '#27ae60',
    cap: '#2ecc71',
    grad: ['#1e824c', '#2ecc71', '#a2f55e', '#27ae60'],
    rim: '#145a32',
  }

  ctx.save()

  // Pipe body outline
  ctx.fillStyle = colors.rim
  ctx.fillRect(x - 2, bodyY - 1, w + 4, bodyH + 2)

  // Gradient pipe body
  const grad = ctx.createLinearGradient(x, 0, x + w, 0)
  grad.addColorStop(0, colors.grad[0])
  grad.addColorStop(0.24, colors.grad[1])
  grad.addColorStop(0.55, colors.grad[2])
  grad.addColorStop(0.8, colors.grad[3] || colors.grad[1])
  grad.addColorStop(1, colors.grad[0])

  ctx.fillStyle = grad
  ctx.fillRect(x, bodyY, w, bodyH)

  // Candy striped / hazard striped variant if active
  if (colors.striped) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(x, bodyY, w, bodyH)
    ctx.clip()
    ctx.fillStyle = '#2c3e50'
    for (let sy = bodyY - 40; sy < bodyY + bodyH + 40; sy += 26) {
      ctx.beginPath()
      ctx.moveTo(x - 5, sy)
      ctx.lineTo(x + w + 5, sy + 20)
      ctx.lineTo(x + w + 5, sy + 32)
      ctx.lineTo(x - 5, sy + 12)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
  }

  // Specular glossy highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.38)'
  ctx.fillRect(x + 7, bodyY, 6, bodyH)

  // Subtle dark inner shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
  ctx.fillRect(x + w - 9, bodyY, 7, bodyH)

  // Pipe cap
  const capY = isTop ? y + h - cap : y
  ctx.fillStyle = colors.rim
  ctx.fillRect(x - 5, capY - 2, w + 10, cap + 4)

  const capGrad = ctx.createLinearGradient(x, 0, x + w, 0)
  capGrad.addColorStop(0, colors.grad[0])
  capGrad.addColorStop(0.35, colors.grad[2])
  capGrad.addColorStop(0.75, colors.grad[1])
  capGrad.addColorStop(1, colors.grad[0])

  ctx.fillStyle = capGrad
  ctx.fillRect(x - 3, capY, w + 6, cap)

  // Cap specular
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)'
  ctx.fillRect(x + 4, capY + 2, 7, cap - 4)

  // Cap lip border
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
  ctx.fillRect(x - 3, isTop ? capY + cap - 3 : capY, w + 6, 3)

  ctx.restore()
}

// Draw animated collectible star (for Adventure & Extreme modes)
export function drawBonusStar(ctx, starOrX, nowOrY, maybeNow) {
  const isObj = typeof starOrX === 'object' && starOrX !== null
  const star = isObj ? starOrX : { x: starOrX, y: nowOrY, collected: false }
  const now = isObj ? nowOrY : (maybeNow || 0)
  if (star.collected) return
  ctx.save()
  ctx.translate(star.x, star.y)

  // Gentle floating bob & spin
  const bob = Math.sin(now * 0.006 + star.x) * 4
  ctx.translate(0, bob)
  ctx.rotate(now * 0.003)

  // Golden glow halo
  const starGlow = ctx.createRadialGradient(0, 0, 3, 0, 0, 22)
  starGlow.addColorStop(0, 'rgba(255, 230, 0, 0.7)')
  starGlow.addColorStop(1, 'rgba(255, 230, 0, 0)')
  ctx.fillStyle = starGlow
  ctx.beginPath()
  ctx.arc(0, 0, 22, 0, Math.PI * 2)
  ctx.fill()

  // 5-point cartoon star
  ctx.fillStyle = '#ffd700'
  ctx.strokeStyle = '#d48806'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
    const innerAngle = angle + Math.PI / 5
    const rOuter = 13
    const rInner = 6
    if (i === 0) ctx.moveTo(Math.cos(angle) * rOuter, Math.sin(angle) * rOuter)
    else ctx.lineTo(Math.cos(angle) * rOuter, Math.sin(angle) * rOuter)
    ctx.lineTo(Math.cos(innerAngle) * rInner, Math.sin(innerAngle) * rInner)
  }
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Cute sparkling center
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(-2, -3, 2.5, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

// Draw the animated Dog chasing at the player's tail (after score 60)
export function drawDog(ctx, dog, birdOrNow, maybeNow) {
  if (!dog || !dog.active) return
  const now = typeof maybeNow === 'number' ? maybeNow : (typeof birdOrNow === 'number' ? birdOrNow : 0)

  ctx.save()
  ctx.translate(dog.x, dog.y)

  // Flying/running bob & tilt
  const legCycle = Math.sin(now * 0.018)
  const tailWag = Math.sin(now * 0.024) * 0.4
  const earFlap = Math.sin(now * 0.015) * 0.3

  // Flying superhero red cape!
  ctx.fillStyle = '#e74c3c'
  ctx.beginPath()
  ctx.moveTo(-16, -6)
  ctx.quadraticCurveTo(-38 + Math.sin(now * 0.02) * 5, -14 + Math.cos(now * 0.018) * 8, -42, -2)
  ctx.quadraticCurveTo(-28, 4, -14, 2)
  ctx.closePath()
  ctx.fill()

  // Golden puppy body
  ctx.fillStyle = '#e59866'
  ctx.strokeStyle = '#ba4a00'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(-2, 3, 16, 12, 0.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // White puppy chest belly patch
  ctx.fillStyle = '#fdfefe'
  ctx.beginPath()
  ctx.ellipse(3, 5, 8, 7, 0, 0, Math.PI * 2)
  ctx.fill()

  // Wagging tail
  ctx.save()
  ctx.translate(-16, 0)
  ctx.rotate(tailWag)
  ctx.fillStyle = '#e59866'
  ctx.beginPath()
  ctx.roundRect(-10, -3, 12, 6, 3)
  ctx.fill()
  // White tail tip
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(-9, 0, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Little running paws
  ctx.fillStyle = '#d35400'
  // Back paws
  ctx.beginPath()
  ctx.roundRect(-12 + legCycle * 5, 12, 6, 8, 3)
  ctx.roundRect(-5 - legCycle * 5, 12, 6, 8, 3)
  ctx.fill()
  // Front paws
  ctx.beginPath()
  ctx.roundRect(4 - legCycle * 6, 11, 6, 9, 3)
  ctx.roundRect(11 + legCycle * 6, 11, 6, 9, 3)
  ctx.fill()

  // Puppy head
  ctx.save()
  ctx.translate(14, -6)

  // Head circle
  ctx.fillStyle = '#e59866'
  ctx.beginPath()
  ctx.arc(0, 0, 13, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Big cute floppy ear (animated fluttering in wind)
  ctx.save()
  ctx.translate(-5, -6)
  ctx.rotate(-0.2 + earFlap)
  ctx.fillStyle = '#ba4a00'
  ctx.beginPath()
  ctx.ellipse(-4, 9, 7, 13, 0.4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Big sparkling puppy eye
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(3, -2, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#2c3e50'
  ctx.beginPath()
  ctx.arc(4, -2, 3.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(5, -3, 1.3, 0, Math.PI * 2)
  ctx.fill()

  // Cute black puppy nose
  ctx.fillStyle = '#17202a'
  ctx.beginPath()
  ctx.ellipse(11, 2, 3.2, 2.5, 0, 0, Math.PI * 2)
  ctx.fill()

  // Happy panting pink tongue!
  ctx.fillStyle = '#ff7675'
  ctx.beginPath()
  ctx.roundRect(7, 5, 6, 7 + Math.sin(now * 0.012) * 2, 3)
  ctx.fill()

  ctx.restore()

  // Speech bubble if dog is barking!
  if (dog.speechBubble && dog.bubbleTimer > 0) {
    ctx.save()
    ctx.translate(10, -32)
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#2c3e50'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(-24, -14, 56, 22, 8)
    ctx.fill()
    ctx.stroke()
    // Speech pointer
    ctx.beginPath()
    ctx.moveTo(-4, 8)
    ctx.lineTo(-8, 15)
    ctx.lineTo(2, 8)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#2c3e50'
    ctx.font = '900 11px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(dog.speechBubble, 4, 2)
    ctx.restore()
  }

  ctx.restore()
}

// Confetti burst for theme transitions or high scores
export function drawConfetti(ctx, particles) {
  if (!particles || particles.length === 0) return
  particles.forEach((p) => {
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot || 0)
    ctx.globalAlpha = p.alpha !== undefined ? p.alpha : 1
    ctx.fillStyle = p.color
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
    ctx.restore()
  })
}
