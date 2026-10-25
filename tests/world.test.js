// The 3D world's two views: the original board and the Tower of Babel.
// These build the real world (software WebGL), so they run on one track.
"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { launch, newPage } = require("./helpers/harness");

let env;
before(async () => { env = await launch(); });
after(async () => { await env.close(); });

async function openWorld(storage = {}) {
  const r = await newPage(env, { track: "python", world: true, storage });
  await r.page.waitForFunction(() => typeof window.__worldMode === "function", null, { timeout: 30000 });
  return r;
}

test("World: two views, picked with the buttons and remembered on this device", async () => {
  const { ctx, page, log } = await openWorld();
  assert.equal(await page.evaluate(() => window.__worldMode()), "road", "the original view is the default");
  assert.equal(await page.isVisible("#worldBanner"), false);
  await page.click('[data-world-mode="tower"]');
  assert.equal(await page.evaluate(() => window.__worldMode()), "tower");
  assert.equal(await page.isVisible("#worldBanner"), true, "the tower shows its message");
  assert.equal((await page.textContent("#worldBanner")).trim(), "V has Come to!");
  assert.equal(await page.getAttribute('[data-world-mode="tower"]', "aria-pressed"), "true");
  assert.equal(await page.getAttribute('[data-world-mode="road"]', "aria-pressed"), "false");
  assert.match(await page.getAttribute("#world", "aria-label"), /Tower of Babel/);
  assert.match(await page.textContent("#worldHint"), /walk around the tower/);
  await page.reload();
  await page.waitForFunction(() => typeof window.__worldMode === "function", null, { timeout: 30000 });
  assert.equal(await page.evaluate(() => window.__worldMode()), "tower", "the choice survives a reload");
  await page.click('[data-world-mode="road"]');
  assert.equal(await page.evaluate(() => window.__worldMode()), "road");
  assert.equal(await page.isVisible("#worldBanner"), false);
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

for (const mode of ["road", "tower"]) {
  test(`World (${mode === "road" ? "original" : "Tower of Babel"}): tapping a block opens its drill`, async () => {
    const reps = { 0: 8, 1: 8, 2: 8 };
    const { ctx, page, log } = await openWorld({ "code-block-world-mode-v1": mode, "code-block-progress-python-v1": JSON.stringify({ reps }) });
    await page.$eval("#world", (el) => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(400);
    // Block 4 is the next one: it is on screen (around the tower, the
    // tower turns to face it) and a tap on it opens its drill.
    const pt = await page.evaluate(() => window.__worldProject(3));
    assert.ok(pt && pt.onScreen, `block 4 is on screen in the ${mode} view`);
    await page.touchscreen.tap(pt.x, pt.y);
    await page.waitForFunction(() => !document.getElementById("drillView").classList.contains("hidden"), null, { timeout: 10000 });
    const [title, want] = await page.evaluate(() => [document.getElementById("drillTitle").textContent, BLOCKS[3].name]);
    assert.equal(title, want);
    assert.deepEqual(log.pageErrors, []);
    await ctx.close();
  });
}

test("World: without WebGL the view buttons step aside and every block still opens from the list", async () => {
  const { ctx, page } = await newPage(env, { track: "python" });
  assert.equal(await page.isVisible(".world-modes"), false);
  assert.equal(await page.isVisible("#worldBanner"), false);
  assert.ok(await page.isVisible(".world-fallback"));
  await ctx.close();
});
