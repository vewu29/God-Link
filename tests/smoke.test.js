// Every track loads cleanly, offers its content, and fits a phone screen.
"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { launch, newPage, trackIds } = require("./helpers/harness");

let env, ids;
before(async () => { env = await launch(); ids = await trackIds(env); });
after(async () => { await env.close(); });

test("each track loads with no script errors and real content", async () => {
  for (const track of ids) {
    const { ctx, page, log } = await newPage(env, { track });
    const inv = await page.evaluate(() => ({
      track: document.body.getAttribute("data-track"),
      blocks: BLOCKS.length, repsGoal: REPS_GOAL,
      blockButtons: document.querySelectorAll("#blockGrid button").length,
      chapters: document.querySelectorAll("#libGrid > *").length,
      glossary: GLOSSARY.length,
    }));
    assert.deepEqual(log.pageErrors, [], `${track}: page errors`);
    assert.equal(inv.track, track);
    assert.equal(inv.repsGoal, 8, "the eight-repetition rule is the default");
    assert.ok(inv.blocks >= 20, `${track}: at least 20 drill blocks (got ${inv.blocks})`);
    assert.equal(inv.blockButtons, inv.blocks, `${track}: one button per block`);
    assert.ok(inv.chapters >= 8, `${track}: library chapters (got ${inv.chapters})`);
    assert.ok(inv.glossary >= 20, `${track}: glossary words (got ${inv.glossary})`);
    await ctx.close();
  }
});

test("no sideways scrolling on small phones, phones and desktop", async () => {
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 1280, height: 800 }]) {
    for (const track of ids) {
      const { ctx, page } = await newPage(env, { track, viewport, mobile: viewport.width < 800 });
      for (const menu of ["#menuSandbox", "#menuLibrary", "#menuPc", "#menuVault", "#menuProfile"]) {
        await page.click(menu);
        await page.waitForTimeout(150);
        const w = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
        assert.ok(w[0] <= w[1], `${track} ${menu} at ${viewport.width}px scrolls sideways (${w[0]} > ${w[1]})`);
      }
      await ctx.close();
    }
  }
});

test("the app still works when the CDN and web fonts are unreachable", async () => {
  const { ctx, page, log } = await newPage(env, { cdn: false });
  assert.deepEqual(log.pageErrors, []);
  await page.evaluate(() => openBlock(0));
  await page.waitForTimeout(300);
  await page.focus("#typeInput");
  await page.keyboard.type(await page.evaluate(() => BLOCKS[0].line));
  assert.equal((await page.textContent("#repText")).trim(), "1 / 8 reps");
  await ctx.close();
});
