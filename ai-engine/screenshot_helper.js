const { chromium } = require('playwright');

async function main() {
  const url = process.argv[2];
  if (!url) {
    process.stderr.write('URL argument required\n');
    process.exit(1);
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();
    
    // Navigate with a reasonable timeout
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 });
    // Allow brief settle for animations / fonts
    await page.waitForTimeout(600);

    const buffer = await page.screenshot({ type: 'png' });
    const base64 = `data:image/png;base64,${buffer.toString('base64')}`;
    process.stdout.write(base64);
  } catch (err) {
    process.stderr.write(`Screenshot error: ${err.message}\n`);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

main();
