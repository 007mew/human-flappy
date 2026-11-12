const fs = require('fs');
const { PNG } = require('pngjs');

function createIcon(size, isMaskable = false) {
  const png = new PNG({ width: size, height: size });
  const cx = size / 2;
  const cy = size / 2;
  const bgRadius = isMaskable ? size * 0.48 : size * 0.45;

  // Read agent spark if available
  let sparkPng = null;
  try {
    const data = fs.readFileSync('src/assets/agents/agent-spark.png');
    sparkPng = PNG.sync.read(data);
  } catch (e) {}

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= bgRadius) {
        // Gradient background from cyan #00b4d8 to golden amber #ff9f43
        const gradT = (x + y) / (size * 2);
        const r = Math.round(13 + gradT * (255 - 13));
        const g = Math.round(150 + gradT * (159 - 150));
        const b = Math.round(216 - gradT * (216 - 67));

        if (dist > bgRadius - (size * 0.04)) {
          // Bright gold rim
          png.data[idx] = 255;
          png.data[idx + 1] = 215;
          png.data[idx + 2] = 0;
          png.data[idx + 3] = 255;
        } else {
          png.data[idx] = r;
          png.data[idx + 1] = g;
          png.data[idx + 2] = b;
          png.data[idx + 3] = 255;
        }
      } else {
        if (isMaskable) {
          // Fill whole square for maskable
          png.data[idx] = 13;
          png.data[idx + 1] = 27;
          png.data[idx + 2] = 42;
          png.data[idx + 3] = 255;
        } else {
          png.data[idx + 3] = 0; // transparent corners
        }
      }
    }
  }

  // Composite character in center
  if (sparkPng) {
    const targetH = Math.round(size * (isMaskable ? 0.65 : 0.72));
    const targetW = Math.round(sparkPng.width * (targetH / sparkPng.height));
    const startX = Math.round(cx - targetW / 2);
    const startY = Math.round(cy - targetH / 2);

    for (let sy = 0; sy < targetH; sy++) {
      const srcY = Math.floor(sy * (sparkPng.height / targetH));
      const dstY = startY + sy;
      if (dstY < 0 || dstY >= size) continue;

      for (let sx = 0; sx < targetW; sx++) {
        const srcX = Math.floor(sx * (sparkPng.width / targetW));
        const dstX = startX + sx;
        if (dstX < 0 || dstX >= size) continue;

        const srcIdx = (srcY * sparkPng.width + srcX) * 4;
        const alpha = sparkPng.data[srcIdx + 3] / 255;
        if (alpha > 0.05) {
          const dstIdx = (dstY * size + dstX) * 4;
          const bgA = png.data[dstIdx + 3] / 255;
          const outA = alpha + bgA * (1 - alpha);

          png.data[dstIdx] = Math.round((sparkPng.data[srcIdx] * alpha + png.data[dstIdx] * bgA * (1 - alpha)) / outA);
          png.data[dstIdx + 1] = Math.round((sparkPng.data[srcIdx + 1] * alpha + png.data[dstIdx + 1] * bgA * (1 - alpha)) / outA);
          png.data[dstIdx + 2] = Math.round((sparkPng.data[srcIdx + 2] * alpha + png.data[dstIdx + 2] * bgA * (1 - alpha)) / outA);
          png.data[dstIdx + 3] = Math.round(outA * 255);
        }
      }
    }
  }

  return png;
}

if (!fs.existsSync('public')) fs.mkdirSync('public');

const icon192 = createIcon(192);
fs.writeFileSync('public/icon-192.png', PNG.sync.write(icon192));

const icon512 = createIcon(512);
fs.writeFileSync('public/icon-512.png', PNG.sync.write(icon512));

const maskable512 = createIcon(512, true);
fs.writeFileSync('public/maskable-icon-512.png', PNG.sync.write(maskable512));

const appleIcon = createIcon(180);
fs.writeFileSync('public/apple-touch-icon.png', PNG.sync.write(appleIcon));

const favicon = createIcon(64);
fs.writeFileSync('public/favicon.png', PNG.sync.write(favicon));

console.log('PWA icons created successfully in public/');
