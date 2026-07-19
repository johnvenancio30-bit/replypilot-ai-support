import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [url = "http://127.0.0.1:3000", widthArg = "1440", heightArg = "1000", outputArg = "walkthrough-work/qa.png"] = process.argv.slice(2);
const output = resolve(outputArg);
await mkdir(dirname(output), { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const page = await browser.newPage({ viewport: { width: Number(widthArg), height: Number(heightArg) }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: output, fullPage: true });
const metrics = await page.evaluate(() => ({
  width: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  heading: document.querySelector("h1")?.textContent?.trim(),
  links: document.querySelectorAll("a").length,
  buttons: document.querySelectorAll("button").length,
}));
process.stdout.write(`${JSON.stringify({ metrics, errors, output })}\n`);
await browser.close();
