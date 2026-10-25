// Guards for the issues found in the first audit (docs/AUDIT.md).
"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { launch, newPage, trackIds } = require("./helpers/harness");

let env, ids;
before(async () => { env = await launch(); ids = await trackIds(env); });
after(async () => { await env.close(); });

const reps = (page) => page.$eval("#repText", (e) => e.textContent.trim());

test("phone keyboards' smart punctuation counts as the plain character", async () => {
  const { ctx, page } = await newPage(env);
  const tries = [
    [0, "std::cout << “Hello”;"], // Hello Block: curly quotes
    [7, "while (lives > 0) { lives—; }"], // While Block: -- became an em dash
    [15, "try { play(); } catch (…) { }"], // Safety Net: ... became an ellipsis
  ];
  for (const [i, typed] of tries) {
    await page.evaluate((k) => { closeDrill(); openBlock(k); }, i);
    await page.focus("#typeInput");
    await page.keyboard.insertText(typed);
    assert.equal(await reps(page), "1 / 8 reps", `block ${i + 1}: ${typed}`);
    await page.waitForTimeout(500);
  }
  // A dash where the line has a single minus is still a wrong letter.
  await page.evaluate(() => { closeDrill(); openBlock(12); });
  await page.focus("#typeInput");
  await page.keyboard.insertText("int damage(int atk, int def) { return atk —");
  assert.equal(await page.inputValue("#typeInput"), "int damage(int atk, int def) { return atk ");
  await ctx.close();
});

test("on a phone, the drill opens with its typing box on screen", async () => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 568 }]) {
    const { ctx, page } = await newPage(env, { viewport });
    await page.click("#blockGrid button:nth-child(5)");
    await page.waitForSelector("#drillView:not(.hidden)");
    await page.waitForTimeout(150);
    const r = await page.$eval("#typeInput", (e) => { const b = e.getBoundingClientRect(); return [b.top, b.bottom, innerHeight]; });
    assert.ok(r[0] >= 0 && r[1] <= r[2], `${viewport.width}px: typing box at ${r[0]}..${r[1]} of ${r[2]}`);
    await ctx.close();
  }
});

test("drill lines wrap between words, never inside a short word", async () => {
  const { ctx, page } = await newPage(env, { viewport: { width: 320, height: 568 } });
  for (const i of [4, 12, 16, 17]) {
    await page.evaluate((k) => { closeDrill(); openBlock(k); }, i);
    const split = await page.$$eval("#targetLine .word", (ws) => ws.filter((w) => {
      const tops = new Set([...w.children].map((c) => Math.round(c.getBoundingClientRect().top)));
      return tops.size > 1 && w.textContent.length < 20;
    }).map((w) => w.textContent));
    assert.deepEqual(split, [], `block ${i + 1}`);
  }
  await ctx.close();
});

test("code is drawn without ligatures, so <= reads as two characters", async () => {
  const { ctx, page } = await newPage(env);
  await page.click("#menuPc");
  const lig = await page.$eval("#pcCode", (e) => getComputedStyle(e).fontVariantLigatures);
  assert.match(lig, /no-contextual/);
  await ctx.close();
});

test("PC: an out-of-range number snaps back into range in the box itself", async () => {
  const { ctx, page } = await newPage(env);
  await page.click("#menuPc");
  const box = await page.$("#pcVars input");
  const max = await box.getAttribute("max");
  await box.fill("9999");
  await box.press("Tab");
  assert.equal(await box.inputValue(), max);
  await ctx.close();
});

test("PC: the run says honestly whether your typed program matches", async () => {
  const { ctx, page } = await newPage(env);
  await page.click("#menuPc");
  await page.click("#compileBtn");
  await page.waitForFunction(() => document.querySelector("#pcStatusText").textContent === "Finished");
  assert.match(await page.textContent("#pcScreen"), /Running the program shown above/);
  assert.doesNotMatch(await page.textContent("#pcScreen"), /no errors/);
  await ctx.close();
});

test("a profile cannot be named __proto__ (it would never save)", async () => {
  const { ctx, page } = await newPage(env);
  await page.click("#menuProfile");
  await page.fill("#profName", "__proto__");
  await page.click("#profCreate");
  assert.match(await page.textContent("#profMsg"), /reserved/);
  assert.equal(await page.evaluate(() => localStorage.getItem("code-block-profiles-v1")), null);
  await ctx.close();
});

test("track picker: lists every track, opens and closes, keeps focus inside", async () => {
  const { ctx, page } = await newPage(env);
  await page.click("#trackCurrent");
  assert.equal(await page.$$eval("#trackSheet .track-tile", (t) => t.length), await page.evaluate(() => CB_TRACK_LIST.length));
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains("track-tile")), true);
  for (let i = 0; i < 14; i++) await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => !!document.activeElement.closest("#trackSheet")), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.$eval("#trackSheet", (e) => e.classList.contains("hidden")), true);
  await ctx.close();
});

test("track picker: choosing a track switches to it and keeps the old track's progress", async () => {
  const { ctx, page } = await newPage(env, { storage: { "code-block-progress-v1": JSON.stringify({ reps: { 0: 8 }, celebrated: false }) } });
  await page.click("#trackCurrent");
  await Promise.all([page.waitForNavigation(), page.click('[data-track-id="cs"]')]);
  assert.equal(await page.evaluate(() => window.__track), "cs");
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("code-block-progress-v1")).reps[0]), 8);
  await ctx.close();
});

test("PC: every project can be chosen by name", async () => {
  const { ctx, page } = await newPage(env);
  await page.click("#menuPc");
  const names = await page.evaluate(() => PROJECTS.map((p) => p.name));
  const options = await page.$$eval("#pcPick option", (o) => o.map((x) => x.textContent));
  assert.deepEqual(options, names.map((n, i) => `${i + 1}. ${n}`));
  await page.selectOption("#pcPick", "2");
  assert.equal(await page.textContent("#pcProjectName"), names[2]);
  await page.click("#randomBtn");
  assert.equal(await page.inputValue("#pcPick"), String(await page.evaluate(() => pcIndex)));
  await ctx.close();
});
