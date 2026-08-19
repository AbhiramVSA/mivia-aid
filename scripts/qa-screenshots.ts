import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
await mkdir("qa", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--hide-scrollbars"],
});

async function shot(name: string, width: number, height: number) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `qa/${name}.png`, fullPage: true });
  await page.close();
  console.log("wrote", name);
}

await shot("desktop", 1440, 900);
await shot("laptop", 1200, 800);
await shot("mobile", 390, 844);
await browser.close();
