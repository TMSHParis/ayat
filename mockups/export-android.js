#!/usr/bin/env node
// Export Play Store screenshots — Android 1080×1920px (9:16)
// Usage: node mockups/export-android.js
// Requires: npm install puppeteer  (une seule fois)

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const W     = 360;   // CSS px → 1080px à 3x
const H     = 640;   // CSS px → 1920px à 3x
const SCALE = 3;
const PORT  = process.env.PORT || 3000;
const URL   = `http://localhost:${PORT}/mockups/android.html`;
const OUT   = path.join(__dirname, 'export-android');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  console.log('🚀 Lancement Puppeteer…');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();

  await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // Attendre que TOUTES les images soient chargées
  await page.waitForFunction(() => {
    const imgs = document.querySelectorAll('img');
    return imgs.length > 0 && Array.from(imgs).every(img => img.complete && img.naturalHeight > 0);
  }, { timeout: 30000 });

  // Polices Google Fonts
  await new Promise(r => setTimeout(r, 1500));

  // Sélectionner tous les slides
  const slides = await page.$$('.slide');

  for (let i = 0; i < slides.length; i++) {
    const file = path.join(OUT, `qurani-android-${String(i + 1).padStart(2, '0')}.png`);
    await slides[i].screenshot({ path: file });
    console.log(`  ✓ ${i + 1}/${slides.length} → ${path.basename(file)}`);
  }

  await browser.close();
  console.log(`\n✅ Export terminé → mockups/export-android/`);
  console.log(`   Format : ${W * SCALE} × ${H * SCALE} px (Android 1080×1920, 9:16)`);
})().catch(err => { console.error('❌', err.message); process.exit(1); });
