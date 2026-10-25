// The repetition drill: eight perfect reps master a block, a wrong
// letter is refused, progress survives a reload, every line is typeable.
"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { launch, newPage, trackIds, eachTrack } = require("./helpers/harness");

let env, ids;
before(async () => { env = await launch(); ids = await trackIds(env); });
after(async () => { await env.close(); });

const reps = (page) => page.$eval("#repText", (e) => e.textContent.trim());
const status = (page) => page.$eval("#drillStatus", (e) => e.textContent.replace(/​/g, "").trim());

async function openDrill(page, i) {
  await page.evaluate((k) => { closeDrill(); openBlock(k); }, i);
  await page.waitForSelector("#drillView:not(.hidden)");
  await page.waitForTimeout(80);
  await page.focus("#typeInput");
}

test("eight perfect reps master a block, and the counter stops at eight", async () => {
  const { ctx, page, log } = await newPage(env);
  await page.click("#continueBtn");
  await page.waitForSelector("#drillView:not(.hidden)");
  assert.equal(await page.textContent("#drillTitle"), "Hello Block");
  const line = await page.evaluate(() => BLOCKS[current].line);
  await page.focus("#typeInput");
  for (let i = 1; i <= 8; i++) {
    await page.keyboard.type(line);
    assert.equal(await reps(page), `${i} / 8 reps`);
  }
  assert.match(await status(page), /mastered/i);
  assert.equal(await page.$eval("#nextBtn", (e) => e.classList.contains("hidden")), false);
  await page.keyboard.type(line);
  assert.equal(await reps(page), "8 / 8 reps");
  assert.deepEqual(log.pageErrors, []);
  await ctx.close();
});

test("a wrong letter is refused and trimmed; an extra space is a wrong letter", async () => {
  const { ctx, page } = await newPage(env);
  await openDrill(page, 1); // int score = 0;
  await page.keyboard.type("int scor3");
  assert.equal(await page.inputValue("#typeInput"), "int scor");
  assert.match(await status(page), /not quite/i);
  await page.fill("#typeInput", "");
  await page.keyboard.type("int  ");
  assert.equal(await page.inputValue("#typeInput"), "int ");
  await ctx.close();
});

test("progress survives a reload", async () => {
  const { ctx, page } = await newPage(env);
  await openDrill(page, 2);
  const line = await page.evaluate(() => BLOCKS[current].line);
  await page.keyboard.type(line);
  await page.waitForTimeout(500);
  await page.keyboard.type(line);
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => state.reps[2]), 2);
  await ctx.close();
});

test("Escape steps out of a drill", async () => {
  const { ctx, page } = await newPage(env);
  await openDrill(page, 0);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  assert.equal(await page.$eval("#drillView", (e) => e.classList.contains("hidden")), true);
  await ctx.close();
});

test("every drill line in every track accepts a typed rep", async () => {
  await eachTrack(ids, async (track) => {
    const { ctx, page, log } = await newPage(env, { track });
    const n = await page.evaluate(() => BLOCKS.length);
    const bad = [];
    for (let i = 0; i < n; i++) {
      await openDrill(page, i);
      await page.keyboard.type(await page.evaluate(() => BLOCKS[current].line));
      const r = await reps(page);
      if (r !== "1 / 8 reps") bad.push(`${i + 1}: ${r}`);
    }
    assert.deepEqual(bad, [], `${track}: lines that did not count`);
    assert.deepEqual(log.pageErrors, [], `${track}: page errors`);
    await ctx.close();
  });
});
