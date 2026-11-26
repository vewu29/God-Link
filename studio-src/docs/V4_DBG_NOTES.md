# English++ Web Studio v4 — debugger + big-program speed + fix-it hook (layer `debug`)

Written as the work goes (newest at the bottom). Staged only; nothing pushed.
English++ is Vewu's language; nothing here changes what any English++ line means.

## Setup (Nov 26, ~11:50 CT)
- Engine copy: `cpp/engine_v4/` = `cpp/engine_v3/` (its dist was checked byte-equal to the live `stage_v3/engine/*` before any edit: wasm.gz.b64 md5 6ed8c52e…, js md5 04a3b741…).
- Editor copy: `ui/src_v4/` = `ui/src_v3/`; bundled by `ui/build_editor_v4.js`.
- Layer file: `ui/v4_hooks_debug.py`. Build: `ui/build_v4.sh stage_v4_dbg testsite_v4_dbg debug`; served on :8772.
- Test copies on :8772 in `ui_v4/dbg/`.

## (A) engine debugger — DONE in the engine (Nov 26, ~12:30 CT)
- New `cpp/engine_v4/src/debug.{h,cpp}`. `Interp::Exec` (the one per-line point) gained ONE line:
  `if (__builtin_expect(g_dbg.on, 0)) DebugAt(*this, s);` — when no debugger is attached that is the whole cost.
- `epp.h` Host gained `debugPause` (std::function); `wasm_api.cpp` gained `js_debug_pause` (EM_ASYNC_JS, awaits the page),
  `epp_dbg_breakpoints`, `epp_dbg_attach`, `epp_dbg_frame`; `post.js` gained `M.debug`, `M.setBreakpoints`, `M.debugFrame`;
  `M.stop()` also wakes a paused program. After a pause the host's yield clock restarts, so continuing never adds a mid-frame yield.
- Modes: step (into), over (frames ≤ depth), out (frames < depth), continue, stop. Breakpoints by (file, line); file "" = main file,
  imported files by their tab name — so breakpoints work in xim files too.
- Snapshot per pause: line, file, why, call stack (name + line per frame), locals of the top frame (+ `slf` fields in a method), mgl globals.
  Values are `Show()` = exactly what `out prn` prints; lists/maps/sets/tuples/objects carry kids (first 100, 3 levels, 3000-node budget)
  and a count. Pointers show what they point at only when that place is still alive (no reading freed memory).
- Engine check (ui_v4/dbg/eng_test.js, Chromium): breakpoint inside a function hits with stack main:8 → show_it:17; step/over/out/stop
  all behave; Run, Debug-with-breakpoints, step-over-to-the-end and step-into-to-the-end all print the same bytes.
- Engine size: wasm 4,817,964 → 4,853,261 bytes; js 184,126 → 185,731.

## (B) big test project — built (Nov 26, ~12:45 CT)
- `ui_v4/dbg/gen_bigproj.js` → `ui_v4/dbg/bigproj/project/` (main.epp 6,533 lines + 12 modules, 16,013 lines total, via xim)
  and `bigproj/single/main.epp` (15,977 lines, one file). 199 Book programs × 9 copies; every made name renamed name_b<id>k<k>
  so nothing collides; each program's main lines wrapped in run_b<id>k<k>. A program is kept only if its converted form prints
  exactly what the original prints (native runner) and runs under 150 ms. Native output: `bigproj/native_out.txt` (4,437 lines).
- Wasm engine (Chromium, emulator): M.check ok in 455 ms; Run prints exactly native_out.txt; Debug (no breakpoints) prints the same.

## (A) debugger UI + (C) fix-it — DONE (Nov 26, ~18:30 CT)
- Layer `ui/v4_hooks_debug.py`: 5 JS_PATCHES (run() → EppDebug.go when breakpoints/Debug; check() syncs other tabs to the engine
  files first; fixesFor option; otherFiles hands over f.doc; EppDebug.init after start), SCRIPTS js/epp-debug.js, CSS epp-debug.css.
- UI test `ui_v4/dbg/test_debug_ui.js`: chromebook 34/34, iphone 33/33 (first runs).
- Corpus through the debug path (`corpus_dbg.js webkit crios`): run 300/9/1, debug(no bps) 300/9/1, step-into-every-line 300/9/1
  (45,203 pauses), outputs + error texts byte-identical to run for every program. (First try showed #304 differ: it was the
  test harness keeping count.txt from the previous mode; each program now starts with the same files.)
- Engine run speed (perf_run.js, Chromium emulator, median of 10): loops 5495 (v3) vs 6319 (v4) ms — noisy; lists 1337 vs 1135.
  Needs a second, quieter measurement (VM load varies ±20%).

## (B) big-program speed — fixes + measured (Nov 26, ~19:30 CT)
Fixes in ui/src_v4/editor.js: splitWords cached per line text (frozen arrays); libsOf walks lines (no whole-doc string),
cached per doc and carried across edits that touch no xlb line; rankAt no longer builds the doc string; names: one array per
doc version (nameMap cached), big files rescanned at most every 400 ms while typing; other tabs scanned once per doc version
(page passes f.doc — JS_PATCH); usage() for big files from per-line records built once per doc; onChange without toString when
the page's handler takes no argument; engine check of a > 1,500-line file waits for 900 ms of no typing + idle, never repeats
the same text (keyed with the other tabs), three-word check stays instant. Page: live check writes the other tabs into the
engine's files first (main.epp with xim was red until the first Run in v3).
Measured with ui_v4/dbg/perf_editor.js (16,013-line project, main.epp 6,533 lines), v3 live page (testsite_v4_dbg/v3base) vs
v4 page back to back, 2 rounds each: perf/editor_*_v3_r*.json, *_v4_r*.json (tables in the final report).
Open-to-Ready varies 0.7–3.2 s for BOTH pages on a cold first launch (open_probe.js) — noise, not a regression.
Run speed: loops program v4 ~13% slower than v3 in Chromium (medians 6014 vs 6805; noisy) — moved the per-line work to one
out-of-line slow path (ExecSlowPath) to fix; rebuilding.
- Run speed, measured properly (perf_ab.js: both engines in one page, runs alternate, 12 pairs; emulator):
  Chromium loops 0.938, lists 0.997, calls 0.971 (v4/v3); WebKit loops 0.962, lists 1.019, calls 1.152 (single sample set).
  The earlier "13% slower" came from separate contexts drifting with VM load. Engine rebuilt with ExecSlowPath (dist 18:58).

## Fixes found by testing (Nov 26, ~19:40 CT)
- Snapshot crashed a raylib program: Show() refuses a Camera3D ("can't be printed as it is"), and that refusal stopped the
  program at the first pause. debug.cpp now uses SafeShow (catches the refusal, shows "(can't be printed as it is)"). Show is
  pure (no program code runs), so nothing else can leak. Engine rebuilt 19:35 (wasm 4,853,885 bytes).
- /tmp (512 MB tmpfs) was filled by other layers' build dirs — that made test_cpp_mode fail 15/17 once. Not mine, not deleted;
  my runs now use TMPDIR=ui_v4/dbg/tmp. With that: cpp mode 17/17.
- Debugger + raylib (r_test_blink_dbg.js): stop at a breakpoint inside the game loop, step 3 lines, go on → 0 mid-frame yields,
  4/4. Multi-file (test_debug_xim.js): breakpoint in a xim file, stack across files, tap a frame → 10/10 chromebook + iphone.
- Objects say "N fields" (not items) in Variables.

## Final regression (Nov 26, ~20:15 CT, engine 19:35 build) — ui_v4/dbg/run_regress.sh, logs ui_v4/dbg/regress/
editor 90/90 iphone, webkit, chromium; 97/97 chromebook · studio 52/52 webkit+crios, webkit, chromium · autocomplete overlap
3/3 ×2 · doubletap 5/5 · blink 3/3 (0 mid-frame yields) · blink with debugger pause 4/4 (0 yields) · cpp editor 22/22 ·
cpp mode 17/17 · corpus 300/9/1 · corpus via debug + step-into: 300/9/1, identical · debug UI 34/34 chromebook, 33/33 iphone,
chromium, webkit · debug xim 10/10 chromebook, iphone.
Perf tables: final report (perf/editor_<profile>_project_{v3,v4}_r{1,2}.json; perf_ab.js for engine speed).
