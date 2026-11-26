// Full build button in the real Web Studio page: lazy load, Clang build of the C++ View, run, output check.
// node test_fullbuild_ui.js [webkit|chromium] [crios]   — needs `python3 -m http.server 8765` in ui/testsite
process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PLAYWRIGHT_BROWSERS_PATH || require("path").join(process.env.HOME, "workspace/.pw/browsers");
const { webkit, chromium } = require(require("path").join(process.env.HOME, "workspace/.pw/node_modules/playwright"));
const fs = require("fs"), os = require("os"), path = require("path");
const eng = process.argv[2] || "webkit", CRIOS = process.argv[3] === "crios";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.73 Mobile/15E148 Safari/604.1";
const TAG = eng + (CRIOS ? "-crios" : "");
const BASE = "http://localhost:8765/";
const res = []; function ok(n, p, i) { res.push(p); console.log((p ? "PASS " : "FAIL ") + n + (i ? " — " + i : "")); }
(async () => {
  const B = eng === "webkit" ? webkit : chromium;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fbui-"));
  const ctx = await B.launchPersistentContext(dir, Object.assign({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 3, isMobile: eng === "webkit", hasTouch: true, colorScheme: "dark" }, CRIOS ? { userAgent: UA } : {}));
  const page = ctx.pages()[0] || await ctx.newPage();
  const errs = []; page.on("pageerror", e => errs.push(String(e)));
  page.on("dialog", d => d.accept());
  const fbReq = []; page.on("request", r => { if (/\/fullbuild\//.test(r.url())) fbReq.push(r.url()); });
  await page.goto(BASE + "epp-studio.html", { waitUntil: "load" });
  await page.waitForFunction(() => document.getElementById("esStatus").textContent === "Ready", null, { timeout: 20000 });
  await page.waitForTimeout(800);
  ok("nothing of Full build loads with the page", fbReq.length === 0, fbReq.length + " requests");
  const prog = "note Book program #177\npets mak vec@own@Animal\nd mwn Dog\npets add d\nc mwn Cat\npets add c\np fea pets\n  out prn p@sound\n\nAnimal dcl now\n  sound dmb txt\n\nDog dcl Animal\n  sound dov txt\n    sound ert \"Woof\"\n\nCat dcl Animal\n  sound dov txt\n    sound ert \"Meow\"\n";
  await page.evaluate(t => window.EppStudio.editor.setText(t), prog);
  const cpp = await page.evaluate(() => { var b = document.getElementById("esCppBtn"); b.click(); return document.querySelector("#esCpp, .es-cpp, [data-pane-body=cpp]") ? document.querySelector("#esCpp, .es-cpp, [data-pane-body=cpp]").textContent : ""; });
  ok("C++ View shows real C++", /int main/.test(cpp) && !/^\/\/ C\+\+ View:/.test(cpp), cpp.slice(0, 60).replace(/\n/g, " "));
  const t0 = Date.now();
  await page.click("#esFullBuild");
  await page.waitForFunction(() => /Full build finished|Full build stopped|Clang refused|needs a complete C\+\+ View|can't do Full build/.test(document.getElementById("esConsole").textContent), null, { timeout: 240000 });
  const con = await page.textContent("#esConsole");
  ok("Full build built and ran", /Full build finished/.test(con), ((Date.now() - t0) / 1000).toFixed(1) + " s");
  ok("Full build output matches the fast runner's", /Woof\s*Meow/.test(con), con.replace(/\s+/g, " ").slice(0, 220));
  ok("downloaded the Clang files only after the tap", fbReq.some(u => /llvm\.core\.wasm\.gz/.test(u)), fbReq.length + " requests");
  await page.screenshot({ path: __dirname + "/shots/" + TAG + "_fullbuild.png" });
  // Run still works after a Full build
  await page.click("#esRun");
  await page.waitForFunction(() => /Finished/.test(document.getElementById("esConsole").textContent), null, { timeout: 20000 });
  ok("Run works after Full build", /Woof\s*Meow/.test(await page.textContent("#esConsole")));
  // raylib program is refused honestly by Full build
  await page.evaluate(t => window.EppStudio.editor.setText(t), 'now xlb raylib\nnow InitWindow 200&200&"x"\n');
  await page.click("#esFullBuild");
  await page.waitForTimeout(500);
  ok("raylib program: Full build says use Run", /console programs/.test(await page.textContent("#esConsole")));
  ok("0 page errors", errs.length === 0, errs.join(" | "));
  console.log(TAG + ": " + res.filter(x => x).length + "/" + res.length + " passed");
  await ctx.close();
})().catch(e => { console.log("FAIL crashed — " + e); process.exit(1); });
