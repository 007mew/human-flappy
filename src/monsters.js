// Revamped Underground Cavern World & Subterranean Monsters
// Features: Spelunker lantern glow, cavern stalactites/stalagmites, glowing crystal gems,
// 5 subterranean monster types, and high-tech Underground Rescue Drill exit!

export const MONSTER_TYPES = [
  {
    id: 'cyclops_blob',
    name: 'Magma Bloop Slime',
    emoji: '🌋',
    title: 'THE MAGMA CAVERN',
    bodyColor: '#e17055',
    secondaryColor: '#d63031',
    glowColor: 'rgba(235, 77, 75, 0.45)',
  },
  {
    id: 'chomp_jaw',
    name: 'Underground Rock-Jaws',
    emoji: '🦈',
    title: 'THE SPIKED QUARRY',
    bodyColor: '#636e72',
    secondaryColor: '#2d3436',
    glowColor: 'rgba(255, 118, 117, 0.45)',
  },
  {
    id: 'neon_specter',
    name: 'Cave Phosphor Phantom',
    emoji: '👻',
    title: 'THE CRYSTAL ABYSS',
    bodyColor: '#00cec9',
    secondaryColor: '#81ecec',
    glowColor: 'rgba(0, 206, 201, 0.5)',
  },
  {
    id: 'fire_bat',
    name: 'Subterranean Shadow Bat',
    emoji: '🦇',
    title: 'THE OBSIDIAN HOLLOW',
    bodyColor: '#6c5ce7',
    secondaryColor: '#a29bfe',
    glowColor: 'rgba(108, 92, 231, 0.45)',
  },
  {
    id: 'cosmic_jelly',
    name: 'Bioluminescent Spore Queen',
    emoji: '🪼',
    title: 'THE BIOLUMINESCENT GROTTO',
    bodyColor: '#fd79a8',
    secondaryColor: '#e84393',
    glowColor: 'rgba(253, 121, 168, 0.45)',
  },
]

// Draw the Revamped Underground Cavern with Spelunker Lantern Glow
export function drawMonsterRealmBg(ctx, W, H, now, typeIndex, playerX, playerY) {
  const mType = MONSTER_TYPES[typeIndex % MONSTER_TYPES.length]

  // Deep subterranean rock gradient
  const rockGrad = ctx.createLinearGradient(0, 0, 0, H)
  rockGrad.addColorStop(0, '#09050d')
  rockGrad.addColorStop(0.3, '#140c1d')
  rockGrad.addColorStop(0.7, '#1b0f27')
  rockGrad.addColorStop(1, '#08040a')
  ctx.fillStyle = rockGrad
  ctx.fillRect(0, 0, W, H)

  // Cavern Ceiling Stalactites & Floor Stalagmites (Drawn in background)
  ctx.fillStyle = 'rgba(25, 14, 35, 0.95)'
  for (let i = 0; i < 10; i++) {
    const sx = i * 46
    const topLen = 22 + Math.sin(i * 1.7) * 14
    ctx.beginPath()
    ctx.moveTo(sx - 12, 0)
    ctx.lineTo(sx + 12, 0)
    ctx.lineTo(sx, topLen)
    ctx.closePath()
    ctx.fill()

    const botLen = 20 + Math.cos(i * 1.5) * 12
    ctx.beginPath()
    ctx.moveTo(sx - 12, H - 70)
    ctx.lineTo(sx + 12, H - 70)
    ctx.lineTo(sx, H - 70 - botLen)
    ctx.closePath()
    ctx.fill()
  }

  // Glowing Crystal Clusters on Cavern Walls
  for (let c = 0; c < 7; c++) {
    const cx = (c * 64 + 20) % (W + 20)
    const cy = c % 2 === 0 ? 32 + (c * 12) % 40 : H - 110 - (c * 10) % 35
    const cColor = c % 2 === 0 ? '#00cec9' : '#e056fd'
    const glowPulse = 0.5 + Math.sin(now * 0.004 + c) * 0.3

    ctx.save()
    ctx.translate(cx, cy)
    ctx.fillStyle = cColor
    ctx.shadowColor = cColor
    ctx.shadowBlur = 10 * glowPulse

    // Faceted crystal spike cluster
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-4, -12)
    ctx.lineTo(0, -16)
    ctx.lineTo(4, -12)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(3, 0)
    ctx.lineTo(10, -8)
    ctx.lineTo(6, -2)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  // Floating Subterranean Spores / Embers
  for (let i = 0; i < 28; i++) {
    const sx = ((i * 67 + now * 0.025 * (i % 3 + 1)) % (W + 40)) - 20
    const sy = ((i * 51 + now * 0.015) % (H - 140)) + 35
    const size = 1.5 + (i % 3)
    const alpha = 0.25 + Math.sin(now * 0.006 + i) * 0.3
    ctx.fillStyle = i % 2 === 0 ? `rgba(0, 206, 201, ${alpha})` : `rgba(235, 77, 75, ${alpha})`
    ctx.beginPath()
    ctx.arc(sx, sy, size, 0, Math.PI * 2)
    ctx.fill()
  }

  // SPELUNKER LANTERN SPOTLIGHT:
  // Dynamically illuminates the dark underground around the player
  if (playerX !== undefined && playerY !== undefined) {
    ctx.save()
    const lantern = ctx.createRadialGradient(playerX, playerY, 25, playerX, playerY, 190)
    lantern.addColorStop(0, 'rgba(255, 236, 179, 0.28)')
    lantern.addColorStop(0.4, 'rgba(0, 206, 201, 0.14)')
    lantern.addColorStop(0.8, 'rgba(108, 92, 231, 0.06)')
    lantern.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = lantern
    ctx.beginPath()
    ctx.arc(playerX, playerY, 190, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

// Draw Cavern Suction Pipe or High-Tech Underground Rescue Drill
export function drawWarpPipe(ctx, pipe, now, isExit = false) {
  const { x, topH, w } = pipe
  ctx.save()

  if (isExit) {
    // SUBTERRANEAN RESCUE DRILL / LAUNCH POD
    // High-tech escape rocket with rotating drill bit and booster flames!
    const cx = x + w / 2

    // Metal pod hull
    const podGrad = ctx.createLinearGradient(x, 0, x + w, 0)
    podGrad.addColorStop(0, '#f39c12')
    podGrad.addColorStop(0.3, '#f1c40f')
    podGrad.addColorStop(0.7, '#ffd32a')
    podGrad.addColorStop(1, '#e67e22')
    ctx.fillStyle = podGrad
    ctx.fillRect(x, 0, w, topH)

    // Hazard Stripes
    ctx.fillStyle = '#2c3e50'
    for (let stripe = 0; stripe < topH - 30; stripe += 24) {
      ctx.beginPath()
      ctx.moveTo(x, stripe)
      ctx.lineTo(x + w, stripe + 14)
      ctx.lineTo(x + w, stripe + 22)
      ctx.lineTo(x, stripe + 8)
      ctx.closePath()
      ctx.fill()
    }

    // Heavy Rim & Cockpit Glass
    ctx.fillStyle = '#34495e'
    ctx.fillRect(x - 6, topH - 26, w + 12, 26)

    // Glowing cyan viewport
    ctx.fillStyle = '#00d2d3'
    ctx.beginPath()
    ctx.ellipse(cx, topH - 13, 14, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.ellipse(cx - 3, topH - 15, 5, 2.5, -0.2, 0, Math.PI * 2)
    ctx.fill()

    // Rotating Escape Drill Bit
    ctx.save()
    ctx.translate(cx, topH + 12)
    const drillSpin = Math.sin(now * 0.03) * 6
    ctx.fillStyle = '#bdc3c7'
    ctx.beginPath()
    ctx.moveTo(-w / 2 + 4, -12)
    ctx.lineTo(w / 2 - 4, -12)
    ctx.lineTo(drillSpin, 18)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#7f8c8d'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.restore()

    // Blasting Rocket Booster Exhaust
    const thrustLen = 25 + Math.sin(now * 0.04) * 8
    const flameGrad = ctx.createLinearGradient(cx, topH + 20, cx, topH + 20 + thrustLen)
    flameGrad.addColorStop(0, '#ffffff')
    flameGrad.addColorStop(0.3, '#00d2d3')
    flameGrad.addColorStop(0.7, '#54a0ff')
    flameGrad.addColorStop(1, 'rgba(84, 160, 255, 0)')
    ctx.fillStyle = flameGrad
    ctx.beginPath()
    ctx.moveTo(cx - 16, topH + 20)
    ctx.lineTo(cx + 16, topH + 20)
    ctx.lineTo(cx, topH + 20 + thrustLen)
    ctx.closePath()
    ctx.fill()
  } else {
    // ENTRANCE WARP PIPE: Swirling Cosmic Portal
    const grad = ctx.createLinearGradient(x, 0, x + w, 0)
    grad.addColorStop(0, '#6c5ce7')
    grad.addColorStop(0.5, '#a29bfe')
    grad.addColorStop(1, '#4834d4')
    ctx.fillStyle = grad
    ctx.fillRect(x, 0, w, topH)

    ctx.fillStyle = '#e056fd'
    ctx.fillRect(x - 5, topH - 18, w + 10, 18)

    const cx = x + w / 2
    const cy = topH - 9
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(now * 0.007)

    const vortexGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 28)
    vortexGrad.addColorStop(0, '#ffffff')
    vortexGrad.addColorStop(0.3, '#e056fd')
    vortexGrad.addColorStop(0.7, '#686de0')
    vortexGrad.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.fillStyle = vortexGrad
    ctx.beginPath()
    ctx.arc(0, 0, 32, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  ctx.restore()
}

// Draw the Revamped Animated Monster Obstacles
export function drawMonster(ctx, x, y, w, h, isTop, typeIndex, now) {
  const mType = MONSTER_TYPES[typeIndex % MONSTER_TYPES.length]
  const cx = x + w / 2
  const cy = isTop ? y + h - 35 : y + 35

  ctx.save()

  // Cavern Stalactite Anchor
  ctx.fillStyle = '#22152b'
  if (isTop) {
    ctx.beginPath()
    ctx.moveTo(x + 6, 0)
    ctx.lineTo(x + w - 6, 0)
    ctx.lineTo(cx, y + h - 15)
    ctx.closePath()
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.moveTo(x + 6, y + h)
    ctx.lineTo(x + w - 6, y + h)
    ctx.lineTo(cx, y + 15)
    ctx.closePath()
    ctx.fill()
  }

  // Glow halo
  const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, 55)
  halo.addColorStop(0, mType.glowColor)
  halo.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = halo
  ctx.fillRect(cx - 60, cy - 60, 120, 120)

  // Floating stem/tendril connecting to cavern
  ctx.fillStyle = mType.secondaryColor
  if (isTop) {
    ctx.fillRect(x + 12, 0, w - 24, Math.max(0, h - 35))
  } else {
    ctx.fillRect(x + 12, y + 35, w - 24, Math.max(0, h - 35))
  }

  ctx.translate(cx, cy)
  const bob = Math.sin(now * 0.006 + x) * 5
  ctx.translate(0, bob)

  const tid = mType.id

  if (tid === 'cyclops_blob') {
    // 1. Magma Bloop Slime
    ctx.fillStyle = mType.bodyColor
    ctx.beginPath()
    ctx.arc(0, 0, 34, 0, Math.PI * 2)
    ctx.fill()

    // Bouncing tentacles
    ctx.fillStyle = mType.secondaryColor
    for (let i = -2; i <= 2; i++) {
      const tx = i * 11
      const ty = isTop ? -30 : 30
      const tw = Math.sin(now * 0.01 + i) * 6
      ctx.beginPath()
      ctx.arc(tx + tw, ty, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    // Huge Eyeball
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(0, -2, 16, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#e74c3c'
    ctx.beginPath()
    ctx.arc(0, -2, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(0, -2, 4, 0, Math.PI * 2)
    ctx.fill()

    // Grin
    ctx.fillStyle = '#2c3e50'
    ctx.beginPath()
    ctx.arc(0, 16, 12, 0, Math.PI, false)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ;[-6, 0, 6].forEach((tx) => {
      ctx.fillRect(tx - 2, 16, 4, 4)
    })
  } else if (tid === 'chomp_jaw') {
    // 2. Underground Rock-Jaws
    const jawOpen = (Math.sin(now * 0.012) + 1) * 0.22

    // Upper jaw
    ctx.save()
    ctx.rotate(-jawOpen)
    ctx.fillStyle = mType.bodyColor
    ctx.beginPath()
    ctx.arc(0, 0, 32, Math.PI, 0, false)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    for (let t = -24; t <= 24; t += 10) {
      ctx.beginPath()
      ctx.moveTo(t - 4, 0)
      ctx.lineTo(t + 4, 0)
      ctx.lineTo(t, 8)
      ctx.closePath()
      ctx.fill()
    }
    ctx.fillStyle = '#fffa65'
    ctx.beginPath()
    ctx.arc(-8, -14, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Lower jaw
    ctx.save()
    ctx.rotate(jawOpen)
    ctx.fillStyle = mType.secondaryColor
    ctx.beginPath()
    ctx.arc(0, 0, 32, 0, Math.PI, false)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    for (let t = -24; t <= 24; t += 10) {
      ctx.beginPath()
      ctx.moveTo(t - 4, 0)
      ctx.lineTo(t + 4, 0)
      ctx.lineTo(t, -8)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
  } else if (tid === 'neon_specter') {
    // 3. Cave Phosphor Phantom
    ctx.fillStyle = mType.bodyColor
    ctx.beginPath()
    ctx.arc(0, -8, 28, Math.PI, 0, false)
    ctx.lineTo(28, 18)
    for (let w = 28; w >= -28; w -= 14) {
      const wy = 18 + Math.sin(now * 0.014 + w) * 6
      ctx.lineTo(w, wy)
    }
    ctx.lineTo(-28, -8)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#1e272e'
    ctx.beginPath()
    ctx.ellipse(-10, -8, 5, 7, 0, 0, Math.PI * 2)
    ctx.ellipse(10, -8, 5, 7, 0, 0, Math.PI * 2)
    ctx.fill()
  } else if (tid === 'fire_bat') {
    // 4. Subterranean Shadow Bat
    const wingFlap = Math.sin(now * 0.016) * 16

    ctx.fillStyle = mType.secondaryColor
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(24, -22 + wingFlap, 46, -10 + wingFlap)
    ctx.quadraticCurveTo(34, 10, 0, 6)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(-24, -22 + wingFlap, -46, -10 + wingFlap)
    ctx.quadraticCurveTo(-34, 10, 0, 6)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = mType.bodyColor
    ctx.beginPath()
    ctx.ellipse(0, 0, 18, 24, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#e74c3c'
    ctx.beginPath()
    ctx.arc(-7, -4, 4, 0, Math.PI * 2)
    ctx.arc(7, -4, 4, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // 5. Bioluminescent Spore Queen
    ctx.fillStyle = mType.bodyColor
    ctx.beginPath()
    ctx.arc(0, -5, 26, Math.PI, 0, false)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = mType.secondaryColor
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    for (let t = -3; t <= 3; t++) {
      const tx = t * 7
      const tw = Math.sin(now * 0.01 + t) * 8
      ctx.beginPath()
      ctx.moveTo(tx, -4)
      ctx.quadraticCurveTo(tx + tw, 18, tx - tw * 0.5, 34)
      ctx.stroke()
    }

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(0, -6, 12, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#e84393'
    ctx.beginPath()
    ctx.arc(0, -6, 6, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

// Draw Collectible Power-Up / Item (Shield, Magnet, Bone, or Heart)
export function drawPowerUp(ctx, powerUp, now) {
  const { x, y, type, bobOffset } = powerUp
  const bobY = y + Math.sin(now * 0.006 + bobOffset) * 6

  ctx.save()
  ctx.translate(x, bobY)

  if (type === 'heart') {
    // Collectible Heart 💖 (Restores 1 Heart)
    const halo = ctx.createRadialGradient(0, 0, 4, 0, 0, 24)
    halo.addColorStop(0, 'rgba(255, 71, 87, 0.85)')
    halo.addColorStop(0.6, 'rgba(255, 107, 129, 0.4)')
    halo.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(0, 0, 24, 0, Math.PI * 2)
    ctx.fill()

    // 3D Red Ball Style Heart
    const heartPulse = 1 + Math.sin(now * 0.01) * 0.1
    ctx.scale(heartPulse, heartPulse)

    ctx.fillStyle = '#ff4757'
    ctx.beginPath()
    ctx.moveTo(0, 4)
    ctx.bezierCurveTo(0, -4, -12, -8, -12, 2)
    ctx.bezierCurveTo(-12, 9, 0, 16, 0, 16)
    ctx.bezierCurveTo(0, 16, 12, 9, 12, 2)
    ctx.bezierCurveTo(12, -8, 0, -4, 0, 4)
    ctx.fill()

    // Gloss shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
    ctx.beginPath()
    ctx.ellipse(-5, 0, 3, 1.8, -0.4, 0, Math.PI * 2)
    ctx.fill()
  } else if (type === 'shield') {
    // Bubble Shield Item 🫧
    const halo = ctx.createRadialGradient(0, 0, 5, 0, 0, 25)
    halo.addColorStop(0, 'rgba(0, 206, 201, 0.8)')
    halo.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(0, 0, 25, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(129, 236, 236, 0.65)'
    ctx.strokeStyle = '#00cec9'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(0, 0, 15, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.beginPath()
    ctx.arc(-5, -6, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#0984e3'
    ctx.beginPath()
    ctx.moveTo(0, -8)
    ctx.lineTo(8, -4)
    ctx.lineTo(6, 8)
    ctx.lineTo(0, 12)
    ctx.lineTo(-6, 8)
    ctx.lineTo(-8, -4)
    ctx.closePath()
    ctx.fill()
  } else if (type === 'magnet') {
    // Star Magnet Item 🧲
    const halo = ctx.createRadialGradient(0, 0, 4, 0, 0, 22)
    halo.addColorStop(0, 'rgba(255, 118, 117, 0.7)')
    halo.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(0, 0, 22, 0, Math.PI * 2)
    ctx.fill()

    ctx.rotate(now * 0.003)
    ctx.lineWidth = 5
    ctx.strokeStyle = '#d63031'
    ctx.beginPath()
    ctx.arc(0, 0, 11, Math.PI, 0, false)
    ctx.stroke()
    ctx.fillStyle = '#dfe6e9'
    ctx.fillRect(-14, 0, 6, 6)
    ctx.fillRect(8, 0, 6, 6)
  } else if (type === 'dog_booster') {
    // Golden Dog Bone 🦴
    const halo = ctx.createRadialGradient(0, 0, 5, 0, 0, 25)
    halo.addColorStop(0, 'rgba(255, 215, 0, 0.9)')
    halo.addColorStop(0.6, 'rgba(255, 165, 2, 0.4)')
    halo.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = halo
    ctx.beginPath()
    ctx.arc(0, 0, 25, 0, Math.PI * 2)
    ctx.fill()

    ctx.rotate(now * 0.004)
    ctx.fillStyle = '#ffd700'
    ctx.strokeStyle = '#d48800'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(-14, -4, 28, 8, 4)
    ctx.fill()
    ctx.stroke()

    ;[-14, 14].forEach((bx) => {
      ctx.beginPath()
      ctx.arc(bx, -4, 5, 0, Math.PI * 2)
      ctx.arc(bx, 4, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    })
  }

  ctx.restore()
}

// Draw Active Bubble Shield around Player
export function drawActiveShield(ctx, bird, now) {
  ctx.save()
  ctx.translate(bird.x, bird.y)

  const shieldPulse = Math.sin(now * 0.01) * 3
  const rad = Math.max(bird.w, bird.h) * 0.65 + shieldPulse

  const grad = ctx.createRadialGradient(0, 0, rad * 0.7, 0, 0, rad)
  grad.addColorStop(0, 'rgba(0, 206, 201, 0.05)')
  grad.addColorStop(0.85, 'rgba(129, 236, 236, 0.45)')
  grad.addColorStop(1, 'rgba(0, 206, 201, 0.85)')

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, rad, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.stroke()

  for (let s = 0; s < 3; s++) {
    const angle = now * 0.005 + (s * Math.PI * 2) / 3
    const sx = Math.cos(angle) * (rad - 3)
    const sy = Math.sin(angle) * (rad - 3)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(sx, sy, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

// Draw Floating Underground Gems (Amethyst +2 pts, Ruby +3 pts)
export function drawGem(ctx, gem, now) {
  const { x, y, type = 'amethyst' } = gem
  const bobY = y + Math.sin(now * 0.007 + x) * 5

  ctx.save()
  ctx.translate(x, bobY)

  const isRuby = type === 'ruby'
  const mainColor = isRuby ? '#e84118' : '#8c7ae6'
  const lightColor = isRuby ? '#ff7979' : '#9c88ff'

  // Gem Glow
  const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, 16)
  halo.addColorStop(0, lightColor)
  halo.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.arc(0, 0, 16, 0, Math.PI * 2)
  ctx.fill()

  // Faceted Gem Shape
  ctx.fillStyle = mainColor
  ctx.beginPath()
  ctx.moveTo(0, -9)
  ctx.lineTo(8, -2)
  ctx.lineTo(0, 10)
  ctx.lineTo(-8, -2)
  ctx.closePath()
  ctx.fill()

  // Top Light Facet
  ctx.fillStyle = lightColor
  ctx.beginPath()
  ctx.moveTo(0, -9)
  ctx.lineTo(8, -2)
  ctx.lineTo(0, 0)
  ctx.lineTo(-8, -2)
  ctx.closePath()
  ctx.fill()

  // Specular spark
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(-2, -3, 1.8, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}
