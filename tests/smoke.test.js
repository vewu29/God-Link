// Every track loads cleanly, offers its content, and fits a phone screen.
"use strict";
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { launch, newPage, trackIds, eachTrack } = require("./helpers/harness");

let env, ids;
before(async () => { env = await launch(); ids = await trackIds(env); });
after(async () => { await env.close(); });

test("each track loads with no script errors and real content", async () => {
  await eachTrack(ids, async (track) => {
    const { ctx, page, log } = await newPage(env, { track, world: true });
    const inv = await page.evaluate(() => ({
      track: document.body.getAttribute("data-track"),
      blocks: BLOCKS.length, repsGoal: REPS_GOAL,
      blockButtons: document.querySelectorAll("#blockGrid button").length,
      chapters: document.querySelectorAll("#libGrid > *").length,
      glossary: GLOSSARY.length,
      world: !!window.__worldHandoff,
    }));
    assert.deepEqual(log.pageErrors, [], `${track}: page errors`);
    assert.equal(inv.track, track);
    assert.equal(inv.repsGoal, 8, "the eight-repetition rule is the default");
    assert.ok(inv.blocks >= 20, `${track}: at least 20 drill blocks (got ${inv.blocks})`);
    assert.equal(inv.blockButtons, inv.blocks, `${track}: one button per block`);
    assert.ok(inv.chapters >= 8, `${track}: library chapters (got ${inv.chapters})`);
    assert.ok(inv.glossary >= 20, `${track}: glossary words (got ${inv.glossary})`);
    assert.equal(inv.world, true, `${track}: the 3D world started`);
    await ctx.close();
  }, 1);
});

test("the Vault fills every placeholder and never runs short of fresh lines", async () => {
  await eachTrack(ids, async (track) => {
    const { ctx, page } = await newPage(env, { track });
    const bad = await page.evaluate(() => {
      // A key is a placeholder when cbFill fills it; {0} in C and {x} in Rust are code.
      const keys = new Set(VT.flatMap((t) => [...t.line.matchAll(/\{([A-Za-z0-9]+)\}/g)].map((m) => m[1]))
        .filter((k) => cbFill({ line: "{" + k + "}" }, cbRng(1)) !== "{" + k + "}"));
      const out = [];
      // {L} is the one capital key, which an older pattern skipped.
      if (cbFill({ line: "{L}" }, cbRng(1)) === "{L}") out.push("{L} is not filled");
      for (let p = 0; p < 100; p++) {
        cbGenPack(p).forEach((d) => {
          const left = [...d.line.matchAll(/\{([A-Za-z0-9]+)\}/g)].map((m) => m[1]).filter((k) => keys.has(k));
          if (left.length || /^int drill\d+ = \d+;$/.test(d.line)) out.push(d.line);
        });
      }
      return out;
    });
    assert.deepEqual(bad.slice(0, 5), [], `${track}: ${bad.length} Vault lines left unfilled or fell back`);
    await ctx.close();
  });
});

test("no sideways scrolling on small phones, phones and desktop", async () => {
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 1280, height: 800 }]) {
    await eachTrack(ids, async (track) => {
      const { ctx, page } = await newPage(env, { track, viewport, mobile: viewport.width < 800 });
      for (const menu of ["#menuSandbox", "#menuLibrary", "#menuPc", "#menuVault", "#menuProfile"]) {
        await page.click(menu);
        await page.waitForTimeout(150);
        const w = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
        assert.ok(w[0] <= w[1], `${track} ${menu} at ${viewport.width}px scrolls sideways (${w[0]} > ${w[1]})`);
      }
      await ctx.close();
    });
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
