# Nishant & Saumya — Cinematic Invitation Engine

A static-first interactive wedding invitation designed for GitHub Pages.

## What is new
- Scene state machine rather than simple page scrolling
- Cursor/finger-aware Ganesh interaction
- Cinematic scene transitions
- Physical invitation cover/open animation
- Procedural particle layer
- Original WebAudio chimes (no external audio files)
- Responsive mobile/touch navigation
- Haldi, Mehndi, Baraat and Wedding scenes with distinct visual languages
- Keyboard + swipe + progress navigation
- No build step required

## Deploy
Upload these files to the repository root:
- `index.html`
- `styles.css`
- `app.js`
- `.nojekyll`

GitHub Pages:
Settings → Pages → Deploy from branch → `main` → `/ (root)`.

## Important
This version deliberately uses CSS/SVG/procedural effects so it works immediately on static hosting without requiring a bundler or huge media files.

For a future 10/10 asset pass, replace the procedural deity silhouettes with layered Rive assets and add optimized WebP/AVIF artwork while keeping the same state-machine API.
