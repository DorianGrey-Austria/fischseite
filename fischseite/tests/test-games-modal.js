const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const baseUrl = 'http://localhost:8002/';

  const clickAndVerifyModal = async (triggerText) => {
    const btn = await page.$(`text=${triggerText}`);
    if (!btn) {
      console.log(`⚠️ Button nicht gefunden: ${triggerText}`);
      return false;
    }
    await btn.click();
    const shown = await page.waitForSelector('#game-modal', { state: 'visible', timeout: 7000 }).then(() => true).catch(() => false);
    if (!shown) {
      console.log(`❌ Modal nicht sichtbar nach Klick: ${triggerText}`);
      return false;
    }
    await page.keyboard.press('Escape');
    await page.waitForSelector('#game-modal.hidden', { timeout: 5000 }).catch(() => {});
    console.log(`✅ Modal-Test bestanden: ${triggerText}`);
    return true;
  };

  try {
    console.log('🌐 Öffne Seite:', baseUrl);
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const results = [];
    results.push(await clickAndVerifyModal('Fish Memory'));
    results.push(await clickAndVerifyModal('Aquarium Builder'));
    results.push(await clickAndVerifyModal('Fish Racing'));

    const passed = results.filter(Boolean).length;
    console.log(`\n📊 Ergebnis: ${passed}/3 Modal-Tests bestanden`);
    await browser.close();
    process.exit(passed === results.length ? 0 : 1);
  } catch (e) {
    console.error('💥 Testfehler:', e);
    await browser.close();
    process.exit(1);
  }
}

if (require.main === module) run();

module.exports = { run };


