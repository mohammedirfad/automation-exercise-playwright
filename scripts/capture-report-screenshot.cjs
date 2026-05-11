const path = require('node:path');
const { chromium } = require('playwright');

async function main() {
  const reportPath = path.resolve('playwright-report', 'index.html');
  const screenshotPath = path.resolve('screenshots', 'all-5-tests-passed.png');
  const reportUrl = `file:///${reportPath.replace(/\\/g, '/')}`;

  const browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(reportUrl, { waitUntil: 'domcontentloaded' });
  await page.getByText(/5 passed/i).waitFor({ timeout: 10_000 }).catch(() => undefined);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();

  console.log(`Saved ${screenshotPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
