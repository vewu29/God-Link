// Automated accessibility scan (axe-core, WCAG 2.1 A/AA + best practice)
// of every room, in light and dark, with motion reduced so colours are
// measured at rest rather than mid-fade.
"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const { launch, newPage } = require("./helpers/harness");

const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
let env;
before(async () => { env = await launch(); });
after(async () => { await env.close(); });

const ROOMS = [
  ["sandbox", null],
  ["drill", () => openBlock(0)],
  ["library", () => document.querySelector("#menuLibrary").click()],
  ["reader", () => { document.querySelector("#menuLibrary").click(); document.querySelector("#libGrid > :first-child").click(); }],
  ["pc", () => document.querySelector("#menuPc").click()],
  ["vault", () => document.querySelector("#menuVault").click()],
  ["profile", () => document.querySelector("#menuProfile").click()],
  ["track picker", () => document.querySelector("#trackCurrent").click()],
  // The 3D world itself, in both views (the rooms above run without WebGL).
  ["world, original view", null, { world: true }],
  ["world, Tower of Babel", null, { world: true, storage: { "code-block-world-mode-v1": "tower" } }],
];

for (const scheme of ["light", "dark"]) {
  test(`no serious or critical accessibility problems (${scheme})`, async () => {
    const problems = [];
    for (const [room, open, opts] of ROOMS) {
      const { ctx, page } = await newPage(env, { colorScheme: scheme, ...(opts || {}) });
      if (open) { await page.evaluate(open); await page.waitForTimeout(700); }
      await page.addScriptTag({ content: AXE });
      const v = await page.evaluate(async () => (await axe.run(document, { resultTypes: ["violations"], runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] })).violations
        .filter((x) => x.impact === "serious" || x.impact === "critical")
        .map((x) => `${x.id}: ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`));
      v.forEach((x) => problems.push(`${room}: ${x}`));
      await ctx.close();
    }
    assert.deepEqual(problems, []);
  });
}
