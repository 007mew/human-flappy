const fs = require('fs');
const { PNG } = require('pngjs');

function floodFillTransparent(png, isBgPixel, startPoints = [[0, 0]]) {
  const w = png.width;
  const h = png.height;
  const visited = new Uint8Array(w * h);
  const queue = [];

  for (const [sx, sy] of startPoints) {
    if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
      const idx = sy * w + sx;
      if (!visited[idx] && isBgPixel(sx, sy, png)) {
        visited[idx] = 1;
        queue.push(sx, sy);
      }
    }
  }

  // Also seed all edges
  for (let x = 0; x < w; x++) {
    for (const y of [0, h - 1]) {
      const idx = y * w + x;
      if (!visited[idx] && isBgPixel(x, y, png)) {
        visited[idx] = 1;
        queue.push(x, y);
      }
    }
  }
  for (let y = 0; y < h; y++) {
    for (const x of [0, w - 1]) {
      const idx = y * w + x;
      if (!visited[idx] && isBgPixel(x, y, png)) {
        visited[idx] = 1;
        queue.push(x, y);
      }
    }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const pIdx = (cy * w + cx) * 4;
    png.data[pIdx + 3] = 0; // transparent!

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nIdx = ny * w + nx;
        if (!visited[nIdx]) {
          visited[nIdx] = 1;
          if (isBgPixel(nx, ny, png)) {
            queue.push(nx, ny);
          }
        }
      }
    }
  }
}

function cropPng(png, minX, minY, maxX, maxY) {
  const newW = maxX - minX + 1;
  const newH = maxY - minY + 1;
  const cropped = new PNG({ width: newW, height: newH });

  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      const srcIdx = ((minY + y) * png.width + (minX + x)) * 4;
      const dstIdx = (y * newW + x) * 4;
      cropped.data[dstIdx] = png.data[srcIdx];
      cropped.data[dstIdx + 1] = png.data[srcIdx + 1];
      cropped.data[dstIdx + 2] = png.data[srcIdx + 2];
      cropped.data[dstIdx + 3] = png.data[srcIdx + 3];
    }
  }
  return cropped;
}

function autoCropAlpha(png, alphaThreshold = 20) {
  let minX = png.width, maxX = 0, minY = png.height, maxY = 0;
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const a = png.data[(y * png.width + x) * 4 + 3];
      if (a > alphaThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (minX > maxX || minY > maxY) return png;
  return cropPng(png, minX, minY, maxX, maxY);
}

// 1. Process agent-arachno (white background)
function processArachno() {
  const file = 'src/assets/agents/agent-arachno.png';
  const data = fs.readFileSync(file);
  const png = PNG.sync.read(data);

  floodFillTransparent(png, (x, y, p) => {
    const idx = (y * p.width + x) * 4;
    const r = p.data[idx];
    const g = p.data[idx + 1];
    const b = p.data[idx + 2];
    return r > 230 && g > 230 && b > 230;
  });

  const cropped = autoCropAlpha(png);
  fs.writeFileSync(file, PNG.sync.write(cropped));
  console.log('Arachno processed:', cropped.width, 'x', cropped.height);
}

// 2. Process agent-shadow (black background)
function processShadow() {
  const file = 'src/assets/agents/agent-shadow.png';
  const data = fs.readFileSync(file);
  const png = PNG.sync.read(data);

  floodFillTransparent(png, (x, y, p) => {
    const idx = (y * p.width + x) * 4;
    const r = p.data[idx];
    const g = p.data[idx + 1];
    const b = p.data[idx + 2];
    return r < 25 && g < 25 && b < 25;
  });

  const cropped = autoCropAlpha(png);
  fs.writeFileSync(file, PNG.sync.write(cropped));
  console.log('Shadow processed:', cropped.width, 'x', cropped.height);
}

// 3. Process agent-robocat (checkerboard background + remove bottom-left camera icon)
function processRobocat() {
  const file = 'src/assets/agents/agent-robocat.png';
  const data = fs.readFileSync(file);
  const png = PNG.sync.read(data);

  // Erase bottom-left camera icon (roughly 50x50 in bottom-left)
  for (let y = png.height - 55; y < png.height; y++) {
    for (let x = 0; x < 55; x++) {
      const idx = (y * png.width + x) * 4;
      png.data[idx] = 230;
      png.data[idx + 1] = 230;
      png.data[idx + 2] = 230;
    }
  }

  floodFillTransparent(png, (x, y, p) => {
    const idx = (y * p.width + x) * 4;
    const r = p.data[idx];
    const g = p.data[idx + 1];
    const b = p.data[idx + 2];
    // Checkerboard grey/white: near neutral grey or white
    const isNeutral = Math.abs(r - g) < 12 && Math.abs(r - b) < 12 && Math.abs(g - b) < 12;
    return isNeutral && r > 185;
  });

  const cropped = autoCropAlpha(png);
  fs.writeFileSync(file, PNG.sync.write(cropped));
  console.log('Robocat processed:', cropped.width, 'x', cropped.height);
}

// 4. Process agent-spark (left boy only + checkerboard removal + camera icon removal)
function processSpark() {
  const file = 'src/assets/agents/agent-spark.png';
  const data = fs.readFileSync(file);
  const fullPng = PNG.sync.read(data);

  // Erase bottom-left camera icon
  for (let y = fullPng.height - 60; y < fullPng.height; y++) {
    for (let x = 0; x < 60; x++) {
      const idx = (y * fullPng.width + x) * 4;
      fullPng.data[idx] = 230;
      fullPng.data[idx + 1] = 230;
      fullPng.data[idx + 2] = 230;
    }
  }

  // Crop left character (x: 0 to 285)
  const leftPng = cropPng(fullPng, 0, 0, Math.floor(fullPng.width * 0.49), fullPng.height - 1);

  floodFillTransparent(leftPng, (x, y, p) => {
    const idx = (y * p.width + x) * 4;
    const r = p.data[idx];
    const g = p.data[idx + 1];
    const b = p.data[idx + 2];
    const isNeutral = Math.abs(r - g) < 12 && Math.abs(r - b) < 12 && Math.abs(g - b) < 12;
    return isNeutral && r > 185;
  });

  const cropped = autoCropAlpha(leftPng);
  fs.writeFileSync(file, PNG.sync.write(cropped));
  console.log('Spark processed:', cropped.width, 'x', cropped.height);
}

// 5. Process agent-booboo (create a clean circular avatar / character cutout)
function processBooboo() {
  const file = 'src/assets/agents/agent-booboo.png';
  const data = fs.readFileSync(file);
  const png = PNG.sync.read(data);

  // Booboo is centered. Let's crop into a circular/rounded badge with transparent corners
  // Center is around x: 191, y: 144. Radius around 120.
  const cx = png.width / 2;
  const cy = png.height / 2;
  const radius = Math.min(cx, cy) - 4;

  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * png.width + x) * 4;
      if (dist > radius) {
        png.data[idx + 3] = 0; // outside circle transparent
      } else if (dist > radius - 3) {
        // gold border
        png.data[idx] = 255;
        png.data[idx + 1] = 215;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 255;
      }
    }
  }

  const cropped = autoCropAlpha(png);
  fs.writeFileSync(file, PNG.sync.write(cropped));
  console.log('Booboo processed:', cropped.width, 'x', cropped.height);
}

try {
  processArachno();
  processShadow();
  processRobocat();
  processSpark();
  processBooboo();
  console.log('All 5 agents processed successfully!');
} catch (e) {
  console.error(e);
}
