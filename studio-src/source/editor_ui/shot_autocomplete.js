// Autocomplete on a phone: shoot after the info panel would have appeared (1.2 s), check nothing covers a row.
// node shot_autocomplete.js [webkit|chromium] [crios] [outprefix]
process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PLAYWRIGHT_BROWSERS_PATH || require("path").join(process.env.HOME, "workspace/.pw/browsers");
const { webkit, chromium } = require(require("path").join(process.env.HOME, "workspace/.pw/node_modules/playwright"));
const eng = process.argv[2] || "webkit", CRIOS = process.argv[3] === "crios", OUT = process.argv[4] || "after";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.73 Mobile/15E148 Safari/604.1";
const TAG = eng + (CRIOS ? "-crios" : "");
(async () => {
  const b = await (eng === "webkit" ? webkit : chromium).launch();
  const ctx = await b.newContext(Object.assign({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 3, isMobile: eng === "webkit", hasTouch: true, colorScheme: "dark" }, CRIOS ? { userAgent: UA } : {}));
  const page = await ctx.newPage(); const errs = []; page.on("pageerror", e => errs.push(String(e)));
  await page.goto((process.env.BASE || "http://localhost:8765/") + "epp-studio.html", { waitUntil: "load" });
  await page.waitForFunction(() => document.getElementById("esStatus").textContent === "Ready", null, { timeout: 20000 });
  let fails = 0;
  for (const [name, text] of [["ig", "x is 5\nx ig"], ["i", "x is 5\nx i"]]) {
    await page.evaluate(t => window.EppStudio.editor.setText(t), text);
    await page.evaluate(() => { const v = window.EppStudio.editor.view; v.focus(); v.dispatch({ selection: { anchor: v.state.doc.length } }); });
    await page.keyboard.press("Backspace"); await page.keyboard.type(text.slice(-1));
    await page.waitForSelector(".cm-tooltip-autocomplete li", { timeout: 5000 });
    await page.waitForTimeout(1200);
    const m = await page.evaluate(() => {
      const rows = [...document.querySelectorAll(".cm-tooltip-autocomplete li")].map(li => li.getBoundingClientRect());
      const info = document.querySelector(".cm-completionInfo");
      const ir = info && getComputedStyle(info).display !== "none" ? info.getBoundingClientRect() : null;
      const covered = ir ? rows.filter(r => !(ir.right <= r.left || ir.left >= r.right || ir.bottom <= r.top || ir.top >= r.bottom)).length : 0;
      const list = document.querySelector(".cm-tooltip-autocomplete > ul").getBoundingClientRect();
      const visible = rows.filter(r => r.top >= list.top - 1 && r.bottom <= list.bottom + 1).length;
      return { rows: rows.length, visible, infoShown: !!ir, covered, listRight: list.right, vw: innerWidth };
    });
    const pass = m.covered === 0 && m.listRight <= m.vw && (name !== "i" || m.visible >= 4);
    if (!pass) fails++;
    console.log((pass ? "PASS " : "FAIL ") + `autocomplete "${name}" — ` + JSON.stringify(m));
    await page.screenshot({ path: `${__dirname}/shots/${OUT}_autocomplete_${name}_${TAG}.png` });
  }
  console.log(errs.length ? "FAIL page errors " + errs.join(" | ") : "PASS 0 page errors");
  await b.close(); process.exit(fails || errs.length ? 1 : 0);
})();
