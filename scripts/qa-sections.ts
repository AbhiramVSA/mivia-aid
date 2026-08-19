import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
await mkdir("qa", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--hide-scrollbars"],
});

const shots = [
  { name: "v-hero", width: 1440, height: 900, selector: ".hero" },
  { name: "v-abstract", width: 1440, height: 900, selector: "#abstract" },
  { name: "v-problem", width: 1440, height: 900, selector: "#problem" },
  { name: "v-metric", width: 1440, height: 900, selector: "#metric" },
  { name: "v-pipeline", width: 1440, height: 1100, selector: "#pipeline" },
  { name: "v-method", width: 1440, height: 1100, selector: "#method" },
  { name: "v-algorithm", width: 1440, height: 1100, selector: "#algorithm" },
  { name: "v-results", width: 1440, height: 1100, selector: "#results" },
  { name: "v-mobile-hero", width: 390, height: 844, selector: ".hero" },
];

for (const shot of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: shot.width, height: shot.height, deviceScaleFactor: 1.25 });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  const el = await page.$(shot.selector);
  if (!el) throw new Error(`missing ${shot.selector}`);
  await el.screenshot({ path: `qa/${shot.name}.png` });
  await page.close();
  console.log("wrote", shot.name);
}

await browser.close();
