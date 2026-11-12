# Flappy Human - Kids Arcade Edition (PWA)

A vibrant, feature-packed Flappy Bird-inspired browser game built with React, Vite, and high-performance HTML5 Canvas rendering — now fully equipped as a **Progressive Web App (PWA)** installable on your Android phone and computer!

## Progressive Web App (PWA) Setup

- **Web App Manifest**: Full metadata, standalone display mode, orientation lock, and theme colors ([`public/manifest.json`](file:///d:/human-flappy-react-vite/human-flappy/public/manifest.json)).
- **High-Res App Icons**: `icon-192.png`, `icon-512.png`, `maskable-icon-512.png`, and `apple-touch-icon.png` in [`public/`](file:///d:/human-flappy-react-vite/human-flappy/public/).
- **Service Worker**: Offline caching and asset persistence via [`public/sw.js`](file:///d:/human-flappy-react-vite/human-flappy/public/sw.js).
- **One-Click In-App Install Button**: An **"INSTALL APP ON PHONE 📲"** button on the main menu and in Settings triggers the native device installation banner.
- **Local HTTPS Support**: Enabled via `@vitejs/plugin-basic-ssl` so Android Chrome treats the local Wi-Fi IP as a secure context and allows full PWA installation.

## How to Install on Your Android Phone

1. Make sure your Android phone is connected to the same Wi-Fi network as your computer.
2. In your phone's browser (Chrome, Edge, or Samsung Internet), open:
   ```
   https://192.168.1.10:5173
   ```
3. Because the local server uses a self-signed HTTPS certificate, Chrome will show a one-time connection screen:
   - Tap **"Advanced"** (or Details).
   - Tap **"Proceed to 192.168.1.10 (unsafe)"**.
4. Once the game loads:
   - Tap the glowing **"INSTALL APP ON PHONE 📲"** button on the game menu (or tap the browser menu `⋮` and select **"Install app"** / **"Add to Home screen"**).
5. The game installs right to your phone's home screen with its custom arcade app icon, launching full-screen without any browser address bar!

## How to Install on Computer (Desktop Chrome / Edge)

1. Open `https://localhost:5173` in Chrome or Edge.
2. Click the **Install App icon (⊕)** on the right side of the URL address bar, or tap **"INSTALL APP ON PHONE 📲"** on the menu.
3. The game will run in its own standalone desktop window!

## Characters & Features

1. 🧢 **Agent Spark (Default)**: Solar Cadet in orange adventure cap.
2. 🥷 **Agent Shadow**: Mystic Ninja in violet cloak.
3. 🐻 **Agent Booboo**: Furry Chuckles white creature.
4. 🐱 **Agent RoboCat**: Cosmic Meow robot cat with bell.
5. 🕷️ **Agent Arachno**: Web Striker superhero.
6. ⚔️ **Agent Mampi**: Warrior Scout in crimson armor and blade.
7. 📸 **"Fly As Yourself"**: Upload any selfie or photo to fly with a cape!
8. **Background Stars**: Twinkling stars, sparkles, and floating fireflies in Starry Midnight.
9. **Power-Ups**: Bubble Shield 🫧, Star Magnet 🧲, and Golden Dog Bone 🦴.
10. **Dog Helper & Rocket Booster**: Active after score 15!
11. **Cosmic Monster Void Realm**: Sucked by warp pipes after level 20 for 10 points.
12. **Potty Emoji Game Over Screen 💩**: Interactive funny potty sounds.
