import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Polyfill for Canvas roundRect across all browsers and Android WebViews
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    if (!radii) radii = 0
    let r
    if (typeof radii === 'number') {
      r = { tl: radii, tr: radii, br: radii, bl: radii }
    } else if (Array.isArray(radii)) {
      if (radii.length === 1) r = { tl: radii[0], tr: radii[0], br: radii[0], bl: radii[0] }
      else if (radii.length === 2) r = { tl: radii[0], tr: radii[1], br: radii[0], bl: radii[1] }
      else if (radii.length === 3) r = { tl: radii[0], tr: radii[1], br: radii[2], bl: radii[1] }
      else r = { tl: radii[0] || 0, tr: radii[1] || 0, br: radii[2] || 0, bl: radii[3] || 0 }
    } else {
      r = radii
    }
    this.beginPath()
    this.moveTo(x + (r.tl || 0), y)
    this.lineTo(x + w - (r.tr || 0), y)
    this.quadraticCurveTo(x + w, y, x + w, y + (r.tr || 0))
    this.lineTo(x + w, y + h - (r.br || 0))
    this.quadraticCurveTo(x + w, y + h, x + w - (r.br || 0), y + h)
    this.lineTo(x + (r.bl || 0), y + h)
    this.quadraticCurveTo(x, y + h, x, y + h - (r.bl || 0))
    this.lineTo(x, y + (r.tl || 0))
    this.quadraticCurveTo(x, y, x + (r.tl || 0), y)
    this.closePath()
    return this
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
