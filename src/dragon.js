// Dragon Boss System - Appears at score 50+
// Swoops in, hovers with flapping wings, charges up, and launches blazing fireballs!

import { sound } from './sound'

export function createDragon(W, H) {
  return {
    active: false,
    x: W + 120,
    y: H * 0.4,
    targetY: H * 0.4,
    w: 88,
    h: 68,
    wingCycle: 0,
    fireCooldown: 2.5,
    chargeTimer: 0,
    fireballs: [],
    alertTimer: 0,
    mouthY: 0,
  }
}

export function updateDragon(g, dt, now, W, H, onPlayerHit) {
  const d = g.dragon
  if (!d) return

  // Activate Dragon at score >= 50
  if (g.score >= 50 && !d.active) {
    d.active = true
    d.alertTimer = 3.2
    d.x = W + 120
    d.y = H * 0.4
    sound.playDragonRoar()
  }

  if (d.alertTimer > 0) {
    d.alertTimer -= dt
  }

  if (!d.active) return

  // Swoop smoothly to hover station on the right
  const targetX = W - 78
  d.x += (targetX - d.x) * Math.min(dt * 2.2, 0.08)

  // Track player height with gentle inertia
  const playerY = g.bird ? g.bird.y : H / 2
  d.targetY = Math.max(70, Math.min(H - 120, playerY + Math.sin(now * 0.003) * 35))
  d.y += (d.targetY - d.y) * Math.min(dt * 2.4, 0.08)

  // Wing flap animation
  d.wingCycle = Math.sin(now * 0.008)

  // Fireball charging & launch
  d.fireCooldown -= dt
  if (d.fireCooldown <= 0.7 && d.fireCooldown > 0) {
    d.chargeTimer = 0.7 - d.fireCooldown
  } else {
    d.chargeTimer = 0
  }

  if (d.fireCooldown <= 0 && d.x < W) {
    // Shoot fireball!
    const mouthX = d.x - 38
    const mouthY = d.y + 4
    d.fireballs.push({
      x: mouthX,
      y: mouthY,
      vx: -230 - (g.mode?.speed ? g.mode.speed * 0.35 : 50),
      vy: Math.sin(now * 0.01) * 25,
      r: 13,
      age: 0,
      trail: [],
    })

    sound.playFireball()
    d.fireCooldown = 2.4 + Math.random() * 1.0
    d.chargeTimer = 0
  }

  // Update Fireballs
  const bird = g.bird
  const bRad = bird ? bird.w * 0.38 : 18

  for (let i = d.fireballs.length - 1; i >= 0; i--) {
    const fb = d.fireballs[i]
    fb.age += dt
    fb.x += fb.vx * dt
    fb.y += fb.vy * dt

    // Smoke/flame particle trail
    if (Math.random() < 0.8) {
      g.particles.push({
        x: fb.x + (Math.random() - 0.5) * 8,
        y: fb.y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.2) * 50,
        vy: (Math.random() - 0.5) * 40,
        size: 3 + Math.random() * 5,
        color: Math.random() > 0.4 ? '#ff6b35' : '#ffbe0b',
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 5,
        life: 0.35,
        maxLife: 0.35,
      })
    }

    // Collision with Player
    if (bird) {
      const dx = bird.x - fb.x
      const dy = bird.y - fb.y
      const dist = Math.hypot(dx, dy)

      if (dist < bRad + fb.r) {
        // Destroy fireball with explosion
        for (let p = 0; p < 12; p++) {
          g.particles.push({
            x: fb.x,
            y: fb.y,
            vx: (Math.random() - 0.5) * 160,
            vy: (Math.random() - 0.5) * 160,
            size: 4 + Math.random() * 6,
            color: p % 2 === 0 ? '#ff4757' : '#ffd700',
            rot: Math.random() * Math.PI,
            vRot: (Math.random() - 0.5) * 6,
            life: 0.55,
            maxLife: 0.55,
          })
        }
        d.fireballs.splice(i, 1)

        if (g.dog && g.dog.boosterActive) {
          // Deflected by booster!
          continue
        } else {
          onPlayerHit('fireball')
        }
        continue
      }
    }

    // Off-screen cleanup
    if (fb.x < -50) {
      d.fireballs.splice(i, 1)
    }
  }
}

// Render the Animated Cartoon Dragon
export function drawDragon(ctx, dragon, now) {
  if (!dragon || !dragon.active) return
  const { x, y, wingCycle, chargeTimer } = dragon

  ctx.save()
  ctx.translate(x, y)

  // Floating bob
  const bob = Math.sin(now * 0.005) * 4
  ctx.translate(0, bob)

  // 1. Dragon Tail
  ctx.strokeStyle = '#c0392b'
  ctx.lineWidth = 10
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(25, 10)
  const tailWave = Math.sin(now * 0.008) * 14
  ctx.quadraticCurveTo(45, 12 + tailWave, 60, tailWave)
  ctx.stroke()

  // Tail arrow tip
  ctx.fillStyle = '#ffbe0b'
  ctx.beginPath()
  ctx.moveTo(58, tailWave - 8)
  ctx.lineTo(72, tailWave)
  ctx.lineTo(58, tailWave + 8)
  ctx.closePath()
  ctx.fill()

  // 2. Far Wing (Behind Body)
  drawWing(ctx, 5, -8, wingCycle, true)

  // 3. Dragon Body
  const bodyGrad = ctx.createRadialGradient(-5, 0, 8, 0, 0, 32)
  bodyGrad.addColorStop(0, '#e74c3c')
  bodyGrad.addColorStop(0.7, '#c0392b')
  bodyGrad.addColorStop(1, '#962d22')

  ctx.fillStyle = bodyGrad
  ctx.beginPath()
  ctx.ellipse(0, 4, 30, 22, -0.15, 0, Math.PI * 2)
  ctx.fill()

  // Yellow underbelly plates
  ctx.fillStyle = '#f39c12'
  ctx.beginPath()
  ctx.ellipse(-8, 12, 18, 10, -0.2, 0, Math.PI)
  ctx.fill()

  // Back Spikes
  ctx.fillStyle = '#ffd700'
  for (let s = -2; s <= 2; s++) {
    const sx = s * 10
    const sy = -14 - Math.abs(s) * 2
    ctx.beginPath()
    ctx.moveTo(sx - 4, sy + 6)
    ctx.lineTo(sx, sy - 5)
    ctx.lineTo(sx + 4, sy + 6)
    ctx.closePath()
    ctx.fill()
  }

  // 4. Near Wing (In Front of Body)
  drawWing(ctx, -8, -12, wingCycle, false)

  // 5. Dragon Head & Snout
  ctx.save()
  ctx.translate(-24, -6)

  // Head base
  ctx.fillStyle = '#c0392b'
  ctx.beginPath()
  ctx.ellipse(0, 0, 18, 14, 0.1, 0, Math.PI * 2)
  ctx.fill()

  // Curved Gold Horns
  ctx.fillStyle = '#f1c40f'
  ctx.beginPath()
  ctx.moveTo(8, -8)
  ctx.quadraticCurveTo(16, -26, 26, -24)
  ctx.quadraticCurveTo(14, -18, 4, -4)
  ctx.closePath()
  ctx.fill()

  // Snout
  ctx.fillStyle = '#e74c3c'
  ctx.beginPath()
  ctx.ellipse(-14, 2, 13, 9, 0, 0, Math.PI * 2)
  ctx.fill()

  // Nostril puffing smoke
  ctx.fillStyle = '#7f1d1d'
  ctx.beginPath()
  ctx.arc(-22, -1, 2.5, 0, Math.PI * 2)
  ctx.fill()

  // Fire charge glow in mouth
  if (chargeTimer > 0) {
    const chargeGlow = ctx.createRadialGradient(-20, 4, 2, -20, 4, 18)
    chargeGlow.addColorStop(0, '#ffffff')
    chargeGlow.addColorStop(0.4, '#ffd700')
    chargeGlow.addColorStop(0.8, '#ff4757')
    chargeGlow.addColorStop(1, 'rgba(255, 71, 87, 0)')
    ctx.fillStyle = chargeGlow
    ctx.beginPath()
    ctx.arc(-20, 4, 18, 0, Math.PI * 2)
    ctx.fill()
  }

  // Fierce Glowing Eye
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(-6, -4, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#f39c12'
  ctx.beginPath()
  ctx.arc(-6, -4, 4, 0, Math.PI * 2)
  ctx.fill()

  // Vertical slit pupil
  ctx.fillStyle = '#1e272e'
  ctx.beginPath()
  ctx.ellipse(-6, -4, 1.5, 3.5, 0, 0, Math.PI * 2)
  ctx.fill()

  // Eye glint
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(-7, -5, 1.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore() // End head

  ctx.restore()
}

// Helper: Animated Dragon Wing
function drawWing(ctx, ox, oy, wingCycle, isFar) {
  ctx.save()
  ctx.translate(ox, oy)

  // Wing flap rotation
  const angle = wingCycle * (isFar ? 0.35 : 0.45) - 0.2
  ctx.rotate(angle)

  // Wing strut
  ctx.fillStyle = isFar ? '#962d22' : '#c0392b'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(15, -28, 38, -32)
  ctx.lineTo(34, -26)
  ctx.quadraticCurveTo(12, -20, 0, 4)
  ctx.closePath()
  ctx.fill()

  // Wing membrane
  ctx.fillStyle = isFar ? 'rgba(231, 76, 60, 0.75)' : 'rgba(255, 107, 129, 0.88)'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(15, -28, 38, -32)
  ctx.quadraticCurveTo(30, -14, 32, -4)
  ctx.quadraticCurveTo(22, 0, 18, 6)
  ctx.quadraticCurveTo(8, 6, 0, 2)
  ctx.closePath()
  ctx.fill()

  // Wing fingers / veins
  ctx.strokeStyle = '#f39c12'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(15, -20)
  ctx.lineTo(32, -4)
  ctx.moveTo(10, -10)
  ctx.lineTo(18, 6)
  ctx.stroke()

  ctx.restore()
}

// Render Fireballs with dynamic flame glow & particle trails
export function drawFireballs(ctx, fireballs, now) {
  if (!fireballs || fireballs.length === 0) return

  fireballs.forEach((fb) => {
    ctx.save()
    ctx.translate(fb.x, fb.y)

    // Outer fire glow
    const glow = ctx.createRadialGradient(0, 0, fb.r * 0.3, 0, 0, fb.r * 2.2)
    glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
    glow.addColorStop(0.25, 'rgba(255, 204, 0, 0.9)')
    glow.addColorStop(0.6, 'rgba(255, 77, 0, 0.75)')
    glow.addColorStop(1, 'rgba(255, 30, 0, 0)')

    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(0, 0, fb.r * 2.2, 0, Math.PI * 2)
    ctx.fill()

    // Inner bright core
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(0, 0, fb.r * 0.5, 0, Math.PI * 2)
    ctx.fill()

    // Flame tongue whipping behind
    ctx.fillStyle = '#ff6b35'
    ctx.beginPath()
    const flick = Math.sin(now * 0.02 + fb.x * 0.1) * 4
    ctx.moveTo(0, -fb.r * 0.8)
    ctx.quadraticCurveTo(fb.r * 1.6, flick, fb.r * 2.4, flick)
    ctx.quadraticCurveTo(fb.r * 1.2, flick + 4, 0, fb.r * 0.8)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  })
}

// Warning Alert Banner on Dragon Arrival
export function drawDragonAlertBanner(ctx, alertTimer, W, H, now) {
  if (alertTimer <= 0) return

  ctx.save()
  const alpha = Math.min(alertTimer, 1.0)
  ctx.globalAlpha = alpha

  // Pulsing banner box
  const pulse = 1 + Math.sin(now * 0.015) * 0.04
  const boxW = Math.min(360, W - 30) * pulse
  const boxH = 46 * pulse
  const bx = (W - boxW) / 2
  const by = 110

  // Danger Red Striped Banner
  ctx.fillStyle = 'rgba(180, 20, 30, 0.88)'
  ctx.strokeStyle = '#ffd700'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.roundRect(bx, by, boxW, boxH, 14)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.font = '900 16px Fredoka, Nunito, system-ui'
  ctx.fillText('⚠️ DRAGON ALERT! INCOMING FIRE! 🐲', W / 2, by + 28)

  ctx.restore()
}
