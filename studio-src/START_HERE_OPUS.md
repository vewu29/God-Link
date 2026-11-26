# START HERE, Opus: English++ Web Studio + God-Link site handoff

Prepared by Muse on Thu Nov 26, 2026, at Vewu's request. All times are US Central.

## Whose work this is

English++ is **Vewu's** language. He designed it and dictated everything, and the code is his. He has written C++ before and knows many languages. English++ is the first language he *designed*, so do not treat him as a beginner coder. AI (Muse, you) writes code at his direction and is never a co-author.

The English++ syntax has been **frozen since Oct 30, 2026**. Growth is additive only. No existing line may change its meaning, spelling or behaviour, and old programs must give byte-identical results.

## What you are getting

Vewu's ask (verbatim in VEWU_PROMPTS.md) is to make **the IDE, the compiler and the site AAA quality**. Here is what each of those is.

1. **The IDE: English++ Web Studio**, live at https://god-link.wasmer.app/epp-studio.html. It is a browser IDE built on CodeMirror 6 with root highlighting by Chart family, three-word-aware autocomplete, Blocks, a Root Table (339 entries), Fix it, a Project sheet with zip and search, a debugger, a C++ mode and a canvas for raylib games.
2. **The compiler: the Studio's in-browser engine.** This is a C++20 English++ front end and interpreter, plus a "C++ View" writer that turns English++ into C++. It is compiled to WebAssembly with Emscripten 7.0.1, with raylib 5.5 inside. Its "Full build" mode sends the C++ View output through real Clang 22 (YoWASP) running in the browser.
   - **Important:** Muse wrote this engine from the Book and the Chart. It is **separate from your own compiler** (roots.cpp / the Revolutionizer / Turbo).
   - If you think the Studio should run on your compiler instead, or share code with it, propose that to Vewu. **He decides.** Either way, the Book corpus has to keep matching.
3. **The site: God-Link / Code Block**, a multi-track coding-learning site (C++, C#, English++, Drive and many more tracks). It has a 3D drill world, Library, PC projects, Vault, themes and music.
   - Repo: `vewu29/God-Link`, branch **`claude/g-9rwd0h`**. Head at handoff: `607f293`.
   - It is a FastAPI app on Wasmer Edge (`main.py` → `server/app.py`) that **only serves the routes and folders listed in `server/app.py`**. A new top-level page or folder 404s until you add it there.
   - Read `site/docs/DEPLOY.md`. There is a MySQL accounts backend whose settings come from environment variables only; **never put credentials in the repo.**

## Zip map

| Folder | What it is | Original path on Muse's machine |
|---|---|---|
| `site/` | Fresh clone of the branch at `607f293`, without `.git`. The big Full-build compiler chunks (`fullbuild/vendor/yowasp-clang/*.b64.0*`, `fullbuild/cpp/vendor/*.b64.0*`, about 41 MB) are left out; clone the repo to get them. | GitHub |
| `source/engine/` | Engine source: `src/` (front end, interpreter, C++ View incl. `cppview_rl.inc`), `src_web/` (wasm API, raylib bindings, debugger hooks), `Makefile.web`. About 10,000 lines. | `englishpp-web-ide/cpp/engine_v4/` |
| `source/editor_ui/` | Editor and page build: `src_v4/` (editor source), `v4/` + `v4_hooks_*.py` (v4 layers), `build_v4.sh`, `patch_studio_v*.py`, data generators (`gen_root_table.py`, `build_data.py`, `gen_usage.py`). | `englishpp-web-ide/ui/` |
| `source/cpp_runtime/` | C++ mode runtime: `web_v4/` (cppbuild, cppworker, rlw_runtime = raylib-on-WebGL2 for WASI + Asyncify, runio = live stdin), `studio_v4/epp-cpp.js`, generators, the raylib-wasi build script. | `englishpp-web-ide/cpp/` |
| `tests/` | Playwright suites (v2, v3, v4 core, v4 debugger, v4 Full build), the Book corpus (`book_corpus.json`, 310 programs with expected output) and the C++ corpus (50 programs + g++ outputs). | `ui_v2/`, `ui_v3/`, `ui_v4/`, `corpus/`, `cpp/corpus/` |
| `docs/` | BRIEF.md (the original build brief), ENGINE_API.md + ENGINE_API_V4.md (engine ↔ page contract), V2/V3/V4 notes (what was built, measured and left open). | top level |
| `reference/` | ENGLISHPP_CHART.md, ENGLISHPP_SYNTAX_MANUAL.md, TURBO.md, the English++ Book (.docx). These are the authority for every root fact. | Vewu's uploads |
| `screenshots/` | v3 and v4 shots, iPhone + Chromebook layouts (emulator). | `peek/` |

**Honest warning about the build chain:** v2, v3 and v4 were each built as *patch layers* on top of the previous staged copy (`build_v4.sh` copies `testsite_v3` and applies `v4_hooks_*.py`). The scripts also use absolute paths under `/home/hatch/workspace/englishpp-web-ide/`. It works, but it is not a clean source tree. **Turning it into one clean, reproducible project (one source tree, one build command, one test command) is probably AAA job one.** The live repo files are the source of truth for what ships.

## Where it stands (v4, pushed Nov 26, 2026, 15:08 CT, commit 607f293)

**On his real devices, proven by Vewu's own screenshots:**
- iPhone 17 Pro Max (Chrome for iOS, so WebKit underneath), Nov 25:
  - his own English++ program ran in 3 ms
  - raylib bouncing ball at 61 FPS full screen
  - Full build (Clang in the browser) compiled in 8.1 s
- Chromebook (Chrome): the orbit camera runs, and the canvas blink is fixed ("It's fixed", Nov 25 21:42).
- v3 C++ mode and all of v4 have **not yet been checked on his devices**.

**Measured by Muse in headless emulators only** (WebKit + Chrome-iOS UA, WebKit, Chromium):

| Check | Result |
|---|---|
| Book corpus | 300 pass / 9 honest refusals / 1 fail. #273 is an extraction error, not an engine bug. |
| C++ View under g++ | 298 compile and match, 0 mismatches |
| C++ console vs g++ | 50/50 byte-exact |
| raylib C++ | 11/11 |
| raylib bindings | 790 functions bound, 90 browser-impossible ones refused plainly |
| Debugger | corpus identical when debugging and when stepping every line (45,203 pauses) |
| Big project (16,013 lines) | typing median ~30 → ~18 ms per key on the iPhone layout |

Every Studio, editor, autocomplete, double-tap, blink, Full build and C++ suite is green. Details are in `docs/V4_NOTES.md`.

**Known gaps and open items (raise them, fix what's in scope):**
- **Build memory:** a C++ build peaks at about 980 MB in WebKit, almost all of it WebKit's compiled code for the 74 MB `llvm.core.wasm`.
  - This is the biggest iPhone risk.
  - v4 unloads Clang after each build: the game runs ~265 MB lighter, but warm rebuilds went 15 → 29 s.
  - A smaller compiler build, or a different route, is the real fix.
- **Qt** is an HTML look-alike layer, labelled as such; it is not real Qt. Qt programs can't Full build or open as C++.
- **Asyncify:**
  - raylib C++ builds with `-fno-exceptions`, because Asyncify + wasm exceptions crashes binaryen.
  - Programs that use exceptions *and* read input type their input up front.
- **Debugger:** English++ files only, not C++ tabs. A loop header shows once while stepping. Step out on recursion stops at the first shallower frame.
- **Fix it:** 16 rules, silent when unsure. Run-time-only mistakes get the console card but no editor popup.
- **Run vs C++:** threads run one after another in Run but truly at once in C++. The C++ View refuses `hsh`/`bag` when output depends on insertion order.
- **Phone layout:** "Full screen" fills the browser window, not true fullscreen. On a 430 px phone, Examples lives in the More menu.
- **Deploys:** Wasmer's edge can serve a stale page for ~8 minutes after a push. Use `?v=` to bypass it.
- **Headless test quirk:** headless WebKit software GL drops some cubes at y=0.5 (the ds1_road car) in Run and Full build alike. Real-GPU behaviour is unverified.
- **9 refusals by design** in the browser: `rcm`, `xcm`, `xev`, `srv`, `xgl`, `"<vector>"`/`"shop.h"` includes. They say "… is not in the Web Studio yet."

## Vewu's rules (do not break)

- **Syntax frozen, additive only. Match or refuse:** anything unsupported gives a plain "not in the Web Studio yet" message, never a guess. Ground every root fact in the Chart and the Book.
- **Every git push needs Vewu's fresh "push it".** Earlier approvals don't carry over. Stage, show him, then push.
- **Code Block's systems are frozen except where he directs changes.** He has directed visual upgrades before (Nov 13, Nov 19), and this AAA ask is that kind of direction.
  - Never change an existing drill or Vault line.
  - Never break saved progress: the localStorage keys and profile format must keep working.
  - The Web Studio uses only `epp-web-studio-` keys.
- **The look is blue:** keep the site's all-blue identity and its themes. High contrast, readable, "gaming" display type, beautiful and professional. His Nov 19 words were "every text as if gaming, with beautiful graphics."
- **Copyright:** never bake copyrighted textbook text (e.g. Beginning C++17) into the site. The "My Book" reader opens *his own* PDF on his device only.
- **Devices that matter:** his **iPhone 17 Pro Max with Chrome for iOS** (WebKit engine, iOS memory cap, safe areas, the visualViewport keyboard; don't sniff for "Safari" in a way that breaks CriOS) and his **Chromebook** (keyboard + trackpad, maybe touchscreen).
  - Don't require COOP/COEP headers on the whole site. The Worker + SharedArrayBuffer route was rejected for that reason.
- **Screenshot as you work.** Fix what looks wrong and prove it with before/after shots (his standing rule).
- **Working build at every step.** Keep every existing suite green, or explain each change to a test. Say plainly what you could not verify; his phone is the final test.
- **Credit:** English++ is his. Write docs and UI text that way.

## Build and test quick start (adjust the paths)

- **Engine:** install emsdk 7.0.1 and build raylib 5.5 for web (`PLATFORM_WEB`) into `~/workspace/.raylib-web/` (see `Makefile.web`), then `make -f Makefile.web`. The output is `dist/epp_engine.js` + `epp_engine.wasm`.
  - The site ships the wasm as `engine/epp_engine.wasm.gz.b64`, i.e. `gzip -9 -n | base64 -w0`.
  - That is only because Muse's GitHub tool could push text files only. If you can push binaries, you may simplify it, but update the loader in `engine/epp_engine.js` / the page's `instantiateWasm` hook to match.
- **Page:** `source/editor_ui/build_v4.sh` (needs node and the npm deps in `package.json`: CodeMirror 6 + lang-cpp, esbuild).
- **Tests:** Playwright (Chromium + WebKit) against a local static server of the built site. `tests/v4/run_regress_v4.sh` runs all old suites and `run_new_v4.sh` the new ones. For the corpus, use `tests/book_corpus/run_corpus.py` (native) or the browser corpus runners in `tests/v4_dbg/`.
- **Local server for the real site:** `pip install -r site/requirements.txt`, then `uvicorn main:app` from `site/`. Accounts need MySQL environment variables; everything else runs without them.

Next, read VEWU_PROMPTS.md (his words), then `docs/V4_NOTES.md`.
