# 🪔 आरती संग्रह (Aarti Sangraha)

> **A serene, distraction-free, mobile-first Aarti Sangraha Progressive Web App (PWA) designed for static hosting on GitHub Pages.**

---

## 🌟 Key Features

1. **📱 Mobile-First Devotional UX:**
   - Crafted with sacred aesthetics: Chandan Cream (`#fdfbf7`), Saffron Amber (`#ea580c`), and Evening Pooja Diya Glow.
   - Respects WCAG 2.1 AAA accessibility with large touch targets (48px+), high contrast ratios, and scalable typography (16px–28px).

2. **⚡ Screen Wake Lock API:**
   - Automatically keeps your smartphone display awake during pooja and recitation so you never have to touch the screen with wet or pooja thali-holding hands.

3. **📜 Hands-Free Auto-Scroll:**
   - Smooth variable-speed auto-scrolling (`0.5x`, `1.0x`, `1.5x`, `2.0x`) with a floating control pill to pause or adjust pace while singing.

4. **🔤 Dual-Script & Phonetic Search:**
   - 1-tap toggle between authentic **Devanagari** (मराठी/हिंदी) and **Phonetic English Transliteration**.
   - Zero-latency client-side fuzzy search (`Fuse.js`): type `"sukhkarta"` or `"सुखकर्ता"` to instantly find hymns.

5. **🔔 Procedural Web Audio Rituals:**
   - Procedurally synthesizes authentic brass temple bell (*ghanti*) and conch (*shankh*) sound effects with zero heavy audio file overhead and subtle haptic vibration.
   - Virtual Diya glow toggle for evening pooja ambiance.

6. **📋 Pre-Ordered Sangraha Sequences (Playlists):**
   - Step-by-step consecutive chanting flows (e.g. *Ganesh Utsav Sequence*, *Daily Sandhya Aarti*, *Navratri Devi Sangraha*) with sequential progress steppers.

7. **❤️ Offline-Ready & Favorites:**
   - Persists your favorite aartis and custom preferences in `localStorage`.
   - 100% functional offline without internet connection.

---

## 🏗️ Architecture & GitHub Pages Deployment

- **Framework:** Next.js 14+ (App Router) with static export (`output: 'export'`)
- **Styling:** Tailwind CSS with custom devotional theme tokens
- **Icons:** Lucide React
- **Test Suite:** Vitest + React Testing Library (23 unit & data integrity tests)
- **CI/CD:** Automated GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push to `main`.

### Repository Configuration for GitHub Pages

1. In your GitHub repository settings, navigate to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push to `main`. The included workflow will test, build, and deploy your site automatically!

---

## 🚀 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run test suite (TDD verification)
npm run test

# 3. Start development server
npm run dev

# 4. Create static production export (outputs to /out)
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your mobile browser or responsive dev tools.

---

## 🧪 Test-Driven Development (TDD) Suites

```
 ✓ tests/unit/search.test.ts (6 tests)       — Fuzzy & phonetic search
 ✓ tests/unit/useWakeLock.test.ts (4 tests)  — Screen wake lock lifecycle
 ✓ tests/unit/useAutoScroll.test.ts (4 tests)— Hands-free scrolling speed
 ✓ tests/unit/audioBell.test.ts (2 tests)    — Procedural bell synthesis
 ✓ tests/unit/useFavorites.test.ts (3 tests) — LocalStorage persistence
 ✓ tests/unit/dataIntegrity.test.ts (4 tests)— Stanza & deity reference validation

Total: 23 passed (100% pass rate)
```

---

## 📜 Included Hymns (Phase 1)

- **श्री गणेश:** सुखकर्ता दुःखहर्ता, शेंदूर लाल चढायो
- **भगवान शिव:** लवथवती विक्राळा, कर्पूरगौरं करुणावतारम्
- **श्री दुर्गा / महालक्ष्मी:** दुर्गे दुर्घट भारी, जय देवी जय महालक्ष्मी
- **श्री विठ्ठल:** युगे अठ्ठावीस विटेवरी उभा
- **श्री दत्तात्रेय:** त्रिगुणात्मक त्रैमूर्ती दत्त हा जाणा
- **श्री हनुमान:** श्री हनुमान चालीसा, आरती कीजै हनुमान लला की
- **समापन प्रार्थना:** घालीन लोटांगण वंदीन चरण, मंत्रपुष्पांजली
