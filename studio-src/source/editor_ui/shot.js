// Quick look: open the Studio in WebKit (iPhone 17 Pro Max-like) and take a shot.
// node shot.js <name> [webkit|chromium] [portrait|landscape] [light|dark] [url-suffix]
process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PLAYWRIGHT_BROWSERS_PATH || require("path").join(process.env.HOME, "workspace/.pw/browsers");
const { webkit, chromium } = require(require("path").join(process.env.HOME, "workspace/.pw/node_modules/playwright"));
const [name = "look", eng = "webkit", orient = "portrait", mode = "dark", suffix = ""] = process.argv.slice(2);
(async () => {
  const B = eng === "webkit" ? webkit : chromium;
  const browser = await B.launch();
  const vp = orient === "portrait" ? { width: 440, height: 956 } : { width: 956, height: 440 };
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 3, isMobile: eng === "webkit", hasTouch: true, colorScheme: mode });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", e => errs.push(String(e)));
  page.on("console", m => { if (m.type() === "error") errs.push("console: " + m.text()); });
  await page.goto("http://localhost:8765/epp-studio.html" + suffix, { waitUntil: "load" });
  await page.waitForFunction(() => document.getElementById("esStatus").textContent !== "Loading engine…", null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);
  await page.screenshot({ path: __dirname + "/shots/" + name + ".png" });
  console.log("errors:", errs.length ? errs : "none");
  await browser.close();
})();
