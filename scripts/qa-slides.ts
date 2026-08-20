import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
await mkdir("qa", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.25 });
await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle0", timeout: 60000 });
await page.evaluate(() => document.fonts.ready);

const count = await page.$$eval(".slide", (els) => els.length);
console.log("slides", count);

for (const n of [1, 2, 3, 5, 6, 8, 11, 15, 18]) {
  await page.goto(`http://127.0.0.1:3000#${n}`, { waitUntil: "networkidle0" });
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 250));
  await page.screenshot({ path: `qa/slide-${String(n).padStart(2, "0")}.png` });
  console.log("shot", n);
}

await page.goto("http://127.0.0.1:3000#1", { waitUntil: "networkidle0" });
await page.reload({ waitUntil: "networkidle0" });
await page.keyboard.press("ArrowRight");
await new Promise((r) => setTimeout(r, 600));
const afterRight = await page.evaluate(() => location.hash);
await page.keyboard.press("ArrowLeft");
await new Promise((r) => setTimeout(r, 600));
const afterLeft = await page.evaluate(() => location.hash);
console.log("afterRight", afterRight, "afterLeft", afterLeft);

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.goto("http://127.0.0.1:3000#1", { waitUntil: "networkidle0" });
await page.reload({ waitUntil: "networkidle0" });
await page.screenshot({ path: "qa/slide-mobile.png" });

await browser.close();
