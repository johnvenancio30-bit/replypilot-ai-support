import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3000";
const output = resolve(process.argv[3] ?? "walkthrough-work/replypilot-actions.webm");
await mkdir(dirname(output), { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: dirname(output), size: { width: 1280, height: 720 } },
});
const page = await context.newPage();
const wait = (ms) => page.waitForTimeout(ms);

async function overlay(label) {
  await page.evaluate((text) => {
    document.querySelector("#walkthrough-overlay")?.remove();
    const root = document.createElement("div");
    root.id = "walkthrough-overlay";
    root.innerHTML = `<style>
      #walkthrough-cursor{position:fixed;z-index:2147483647;left:0;top:0;width:28px;height:36px;pointer-events:none;filter:drop-shadow(0 4px 8px rgba(0,0,0,.65));transition:transform .32s cubic-bezier(.2,.8,.2,1)}
      #walkthrough-cursor svg{width:100%;height:100%}
      #walkthrough-label{position:fixed;z-index:2147483646;right:25px;top:90px;max-width:380px;padding:11px 14px;color:#e2e8f0;border:1px solid rgba(34,211,238,.34);border-radius:12px;background:rgba(7,11,24,.94);box-shadow:0 18px 42px rgba(0,0,0,.45),0 0 0 1px rgba(124,58,237,.12);font:700 13px/1.3 Arial,sans-serif;backdrop-filter:blur(12px)}
      #walkthrough-label::before{display:inline-block;width:8px;height:8px;margin-right:9px;border-radius:50%;background:#22d3ee;box-shadow:0 0 0 5px rgba(34,211,238,.12);content:''}
      #walkthrough-ripple{position:fixed;z-index:2147483645;width:18px;height:18px;margin:-9px;border:3px solid #22d3ee;border-radius:50%;opacity:0;pointer-events:none}
      #walkthrough-ripple.go{animation:ripple .55s ease-out}@keyframes ripple{0%{opacity:.9;transform:scale(.55)}100%{opacity:0;transform:scale(3)}}
    </style><div id="walkthrough-label"></div><div id="walkthrough-ripple"></div><div id="walkthrough-cursor"><svg viewBox="0 0 30 38"><path d="M3 2.5V30l7.5-6.6 5.2 11.2 5.7-2.7-5.2-10.8 9.8-.6L3 2.5Z" fill="white" stroke="#22d3ee" stroke-width="2.5" stroke-linejoin="round"/></svg></div>`;
    document.body.appendChild(root);
    document.querySelector("#walkthrough-label").textContent = text;
    document.querySelector("#walkthrough-cursor").style.transform = "translate(1120px,620px)";
  }, label);
}

async function setLabel(label) {
  await page.locator("#walkthrough-label").evaluate((element, text) => { element.textContent = text; }, label);
}

async function moveTo(locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error("Walkthrough target is not visible.");
  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await page.locator("#walkthrough-cursor").evaluate((element, value) => { element.style.transform = `translate(${value.x}px,${value.y}px)`; }, point);
  await page.mouse.move(point.x, point.y, { steps: 12 });
  await wait(380);
  return point;
}

async function click(locator) {
  const point = await moveTo(locator);
  await page.locator("#walkthrough-ripple").evaluate((element, value) => {
    element.style.left = `${value.x}px`; element.style.top = `${value.y}px`; element.classList.remove("go"); void element.offsetWidth; element.classList.add("go");
  }, point);
  await locator.click();
  await wait(420);
}

async function type(locator, value) {
  await click(locator);
  await locator.fill("");
  await locator.pressSequentially(value, { delay: 18 });
  await wait(250);
}

await page.goto(`${baseUrl}/demo`, { waitUntil: "networkidle" });
await overlay("A customer starts with one support question");
await wait(1600);
await setLabel("1. The customer shares the issue and order details");
await type(page.locator('input[autocomplete="name"]'), "John Venancio");
await type(page.locator('input[type="email"]'), "johnvenancio30@gmail.com");
await type(page.locator('input[placeholder="ORD-78214"]'), "ORD-78214");
await click(page.locator("select"));
await page.locator("select").selectOption({ label: "Delayed delivery" });
await type(page.locator("textarea").first(), "My tracking has not changed for four business days and the package was due yesterday. Can you help me find it?");

await setLabel("2. ReplyPilot analyzes urgency, sentiment, and intent");
await click(page.getByRole("button", { name: /analyze support ticket/i }));
await page.waitForSelector(".review-workspace", { timeout: 35_000 });
await overlay("3. Company knowledge grounds the suggested reply");
await wait(2800);

await setLabel("4. A human reviews and edits every word");
const draft = page.locator("#draft-reply");
await moveTo(draft);
await draft.press("Control+End");
await draft.pressSequentially("\n\nWe will keep you updated while the courier investigation is open.", { delay: 14 });
await wait(1600);

await setLabel("5. Human approval unlocks the send action");
await click(page.getByRole("button", { name: /approve reply/i }));
await page.waitForSelector("button:has-text('Send approved reply')");
await wait(1800);

await setLabel("6. Only the approved version is delivered");
await click(page.getByRole("button", { name: /send approved reply/i }));
await page.waitForSelector(".send-success", { timeout: 20_000 });
await wait(2800);

await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
await overlay("7. The dashboard records the outcome and business value");
await page.waitForSelector(".queue-panel");
await wait(4200);

await page.evaluate(() => {
  document.querySelector("#walkthrough-overlay")?.remove();
  const outro = document.createElement("section");
  outro.style.cssText = "position:fixed;z-index:2147483647;inset:0;display:grid;place-items:center;color:#f8fafc;background:radial-gradient(circle at 18% 8%,rgba(124,58,237,.30),transparent 36%),radial-gradient(circle at 85% 92%,rgba(34,211,238,.15),transparent 34%),linear-gradient(135deg,#050814,#0a1022);font-family:Arial,sans-serif";
  outro.innerHTML = `<div style="width:min(720px,calc(100% - 70px));padding:58px;text-align:center;border:1px solid rgba(124,58,237,.34);border-radius:28px;background:rgba(10,16,34,.88);box-shadow:0 34px 90px rgba(0,0,0,.52),inset 0 1px 0 rgba(255,255,255,.05);backdrop-filter:blur(16px)"><div style="font-size:18px;font-weight:800;color:#67e8f9">ReplyPilot</div><p style="margin:26px 0 8px;color:#a78bfa;font-size:13px;font-weight:700;letter-spacing:.14em">BUILT BY</p><h2 style="margin:0;color:#f8fafc;font-size:43px;letter-spacing:-.04em">John Venancio —</h2><p style="margin:10px 0 30px;color:#aab5c8;font-size:21px">AI Automation Developer</p><div style="display:flex;justify-content:center;gap:12px"><span style="padding:14px 28px;color:white;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#6d28d9);font-weight:700;box-shadow:0 12px 28px rgba(124,58,237,.32)">Try the demo</span><span style="padding:14px 28px;color:#67e8f9;border:1px solid rgba(34,211,238,.34);border-radius:12px;background:#0b1328;font-weight:700">Contact me</span></div></div>`;
  document.body.appendChild(outro);
});
await wait(17500);

const video = page.video();
await context.close();
if (!video) throw new Error("Walkthrough recording was not created.");
await video.saveAs(output);
await browser.close();
process.stdout.write(`${output}\n`);
