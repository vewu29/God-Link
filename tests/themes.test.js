// Themes: the picker recolours the page at once and remembers the pick,
// the default Sky theme follows the device's light or dark setting (live),
// the sheet behaves for keyboards, and every theme passes the same
// accessibility scan as the default.
"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const { launch, newPage } = require("./helpers/harness");

const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
let env;
before(async () => { env = await launch(); });
after(async () => { await env.close(); });

const state = (page) => page.evaluate(() => ({
  theme: document.documentElement.getAttribute("data-theme"),
  mode: document.documentElement.getAttribute("data-mode"),
  bg: getComputedStyle(document.documentElement).getPropertyValue("--bg").trim(),
  meta: document.querySelector('meta[name="theme-color"]').getAttribute("content"),
  saved: localStorage.getItem("code-block-theme-v1"),
  label: document.getElementById("themeBtn").getAttribute("aria-label")
}));

test("Themes: the picker recolours the page at once and remembers the pick", async () => {
  const { ctx, page, log } = await newPage(env, { track: "python", colorScheme: "light" });
  let s = await state(page);
  assert.equal(s.theme, "auto");
  assert.equal(s.mode, "light");
  await page.click("#themeBtn");
  assert.equal(await page.getAttribute("#themeBtn", "aria-expanded"), "true");
  assert.equal(await page.$$eval("#themeSheet .theme-tile", (els) => els.length), 11);
  await page.click('#themeSheet [data-theme-id="forest"]');
  s = await state(page);
  assert.deepEqual([s.theme, s.mode, s.bg, s.meta, s.saved], ["forest", "light", "#dcfce7", "#dcfce7", "forest"]);
  assert.match(s.label, /^Theme: Forest/);
  assert.equal(await page.getAttribute('#themeSheet [data-theme-id="forest"]', "aria-pressed"), "true");
  // A dark theme flips the mode, so every dark-mode rule follows.
  await page.click('#themeSheet [data-theme-id="galaxy"]');
  s = await state(page);
  assert.deepEqual([s.theme, s.mode, s.bg], ["galaxy", "dark", "#0b0820"]);
  // The pick survives a reload, from the first paint.
  await page.reload();
  s = await state(page);
  assert.deepEqual([s.theme, s.mode, s.bg], ["galaxy", "dark", "#0b0820"]);
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("Themes: Sky follows the device's setting, live; a chosen theme keeps its own", async () => {
  const { ctx, page } = await newPage(env, { track: "python", colorScheme: "light" });
  assert.equal((await state(page)).mode, "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.waitForFunction(() => document.documentElement.getAttribute("data-mode") === "dark");
  assert.equal((await state(page)).bg, "#050f1f");
  await page.evaluate(() => window.CBTheme.set("sunset"));
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  assert.equal((await state(page)).mode, "light", "Sunset stays light whatever the device says");
  await ctx.close();
});

test("Themes: the sheet opens on the current theme, Escape closes it and gives focus back", async () => {
  const { ctx, page } = await newPage(env, { track: "python", storage: { "code-block-theme-v1": "paper" } });
  await page.focus("#themeBtn");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => document.activeElement && document.activeElement.getAttribute("data-theme-id") === "paper");
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(() => document.getElementById("themeSheet").classList.contains("hidden")), true);
  assert.equal(await page.evaluate(() => document.activeElement.id), "themeBtn");
  await ctx.close();
});

const ROOMS = [
  ["sandbox", null],
  ["drill", () => document.querySelectorAll("#blockGrid button")[0].click()],
  ["reader", () => { document.querySelector("#menuLibrary").click(); document.querySelector("#libGrid > :first-child").click(); }],
  ["pc", () => document.querySelector("#menuPc").click()],
  ["profile", () => document.querySelector("#menuProfile").click()],
  ["theme sheet", () => document.querySelector("#themeBtn").click()]
];
test("Themes: every theme passes the accessibility scan", async () => {
  const probe = await newPage(env, { track: "python" });
  const ids = await probe.page.evaluate(() => window.CBTheme.list().map((t) => t.id));
  await probe.ctx.close();
  const problems = [];
  for (const id of ids) {
    for (const [room, open] of ROOMS) {
      const { ctx, page } = await newPage(env, { track: "python", storage: { "code-block-theme-v1": id } });
      if (open) { await page.evaluate(open); await page.waitForTimeout(500); }
      await page.addScriptTag({ content: AXE });
      const v = await page.evaluate(async () => (await axe.run(document, { resultTypes: ["violations"], runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] })).violations
        .filter((x) => x.impact === "serious" || x.impact === "critical")
        .map((x) => `${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target.join(" ") + " " + (n.any[0] && n.any[0].message ? n.any[0].message.slice(0, 120) : "")).join(" | ")}`));
      v.forEach((x) => problems.push(`${id} · ${room}: ${x}`));
      await ctx.close();
    }
  }
  assert.deepEqual(problems, []);
});

test("Themes: the first-paint script in <head> and js/theme.js agree on every theme's mode", () => {
  const html = fs.readFileSync(require("path").join(__dirname, "..", "index.html"), "utf8");
  const head = JSON.parse(html.match(/var MODES = (\{[^}]*\});/)[1].replace(/(\w+):/g, '"$1":'));
  const js = fs.readFileSync(require("path").join(__dirname, "..", "js", "theme.js"), "utf8");
  const list = {};
  for (const m of js.matchAll(/\{ id: "(\w+)", name: "[^"]*", note: "[^"]*", mode: (null|"light"|"dark") \}/g)) list[m[1]] = m[2] === "null" ? null : m[2].replace(/"/g, "");
  assert.equal(Object.keys(list).length, 11);
  assert.equal(list.auto, null);
  delete list.auto;
  assert.deepEqual(head, list);
});
