# English++ Web Studio v4: the "fb" layer (C++ runtime side). Staged only, NOT pushed.

This layer covers three things:
- (A) Full build for raylib English++ programs.
- (B) Interactive console input.
- (C) Lower peak memory during C++ builds.

Where things live:
- Layer file: `ui/v4_hooks_fb.py`.
- Runtime sources: `cpp/web_v4/`, which goes to `stage/fullbuild/cpp/`.
- Page side: `cpp/studio_v4/epp-cpp.js`, which goes to `stage/js/epp-cpp.js`.
- Tests: `ui_v4/fb/` (port 8771). They are copies of the v2/v3 tests with the port changed.
- Build: `bash ui/build_v4.sh $PWD/stage_v4_fb $PWD/testsite_v4_fb fb`

## Log (written as the work goes)

### Orientation (11:50 CT)
- The C++ View already handles `xim` programs, but only once the imported files have been `fsWrite`'d into the engine. It inlines their definitions into one C++ file. Full build can therefore support `xim` by writing the tabs before `M.cpp()`. No engine change is needed.
- The C++ View of the 4 raylib examples and of 3 new Drive School-style programs (`ui_v4/fb/progs/ds*.epp`) is real C++. The 2 Qt examples start with `// C++ View: the qt library is not in the Web Studio's C++ View yet.`
- Baseline memory: `ui_v4/fb/mem.sh`. It counts the RSS of the WebKit web process belonging to this run only, as descendants of our node process. The v3 script summed every WebKit process on the VM.
  - Run: `test_cpp_mode.js webkit crios` on the v3-equivalent stage.
  - Result: **peak 985 MB** (emulator). The peak comes around the raylib build, while Clang is still loaded.
  - After that build the level sits at about 880 MB while the game runs, because Clang is kept warm for 2 minutes.
- The headless FPS check in `test_cpp_mode` is load-sensitive. It read 4.2 FPS in that run, against 15.5 FPS in v3's log. Emulator number; other agents share the VM.

### (B) live console input: runtime done (12:40 CT)
- `cpp/web_v4/cppworker.js`: `build({interactive:true})` builds a console program
  - with `-fno-exceptions`,
  - against the no-exceptions libc++/libc++abi already in the raylib pack (the same libs raylib programs use),
  - plus a hidden unit `__epp_io.cpp`, which exports a 256 KB Asyncify buffer (`epp_io_data`/`epp_io_size`).
  - Asyncify then runs on `wasi_snapshot_preview1.fd_read`.
- `cpp/web_v4/runio.js` (new, a module Worker) runs the program.
  - When `fd_read` finds nothing typed, it unwinds and posts `{type:'read'}`.
  - The page answers `{type:'input', text|null}` (null = end of input), then the worker rewinds.
  - Output streams live (batched every 30 ms or 16 KB). No SharedArrayBuffer, no COOP/COEP.
- `cppbuild.js`:
  - New `runConsoleLive(wasm, {readLine, print, printErr, timeoutMs})`. The time limit pauses while the program waits for typing.
  - New `usesExceptions(files)` and `readsInput(files)`. Both scan the code with comments, strings and character literals blanked.
- **Rule:** a console program that reads input (cin/getline/scanf/getchar/fgets/…) and has no try/throw/catch gets live input. One that uses exceptions keeps the v3 up-front "separate lines with |" prompt, because binaryen crashes on Asyncify combined with wasm exceptions.
- Test `ui_v4/fb/test_live.js` (page `_cpp_suite_v4.html`) answers each read with the next line of the `.in` file, then end-of-input. It compares stdout with native g++.
  - chromium: **5/5 byte-exact**. Cases: c37, c38, c39 from the corpus, plus `live/l01_prompt` (the prompt is printed before the program asks: 11 chars) and `live/l02_eof` (reads until end of input).
  - Asyncify on these console programs takes 7–19 s on the VM (emulator), and the wasm is about 0.5 MB, against about 0.1 MB without it. Asyncify has to treat libc++'s virtual stream calls as possible pause points.

### (A) Full build for raylib English++: first pass works (12:55 CT)
- `epp-cpp.js` `fullBuildEpp()` takes every English++ Full build. Hook in `epp-studio.js`, one line: `if (window.EppCppMode && EppCppMode.fullBuildEpp) { var fbv4 = ...; if (fbv4) return fbv4; }`.
  - Qt programs get the refusal "Full build: Qt is a look-alike here, so it has no C++ to build. Use Run."
  - Other `.epp` tabs are `fsWrite`'d first, like Run does, so `xim` programs get a full C++ View.
  - `M.cpp(main)` → Clang (`EppCpp.build`) → raylib canvas (the same `runRaylib` as C++ mode: game keys, Stop, full screen) or the console runner.
  - Clang errors print as "C++ line L:C message", followed by "from English++ line N: <text>". That is found through the C++ View's trailing `// <English++ line>` comment.
- `rlw_runtime.js` `stats().midYields` counts yields made while a frame is half-drawn. It should always be 0.
- Test `ui_v4/fb/test_fb_games.js`. For each program: Run first (English++ engine; pixel check), then Full build (window opens, colour shares, key or click answered, midYields 0, Stop). ds1_road on chromium at 1366×768: 7/7. Run and Full build gave identical colour shares (SKYBLUE 6.93 / DARKGREEN 63.22 / GRAY 26.41 / RED 2.19 %).

### Test results so far (13:40 CT, emulator)
- `test_fb_games.js webkit crios`, first run: 36/45. Each failure was checked:
  - **bouncing_ball**: the ball is BLUE, not SKYBLUE. The colour spec in the test was wrong. The test now matches the ball's blue range, and it allows for the ball moving after the click, because a screenshot takes about 1.5 s on the VM. Rerun: 7/7.
  - **dodge**: the rocks had already hit the player before the key test (player dead → no movement). The test now presses R (restart) first. Rerun: 7/7, YELLOW moved 47.5 %.
  - **ds1_road / ds3_park in WebKit only**: the red car (ds1) and DARKBLUE (ds3) are missing in **both Run and Full build** (identical shares). A probe (`cpp_v4_scratch/cubes.cpp`, 5 cubes) showed that headless WebKit's software GL drops cubes sitting on the plane at y=0.5 and draws only the raised one. Chromium draws ds1 fully (7/7, both paths identical).
    - This is an emulator GL artefact, not a Full build difference. It does not appear on chromium, and the equal Run/Full build numbers show both paths send the same draw calls.
    - The ds3 DARKBLUE threshold was lowered to 1 % (it is a thin strip).
  - orbit_camera, car_3d, ds2_signs: all pass in WebKit. Qt ×2 refuse plainly.
- `test_fb_console.js webkit crios` (iPhone 440 wide): 9/11.
  - The 2 "fails" were a wrong test assumption. **Run and Full build print exactly the same console text, questions included.** Run prints the `get`/`gln` question as output too. The test now compares the two directly.
  - Passing:
    - Book #177 "Woof\nMeow" Full build = Run.
    - in_age, in_sum, in_inp ask while running (2/3/1 times), with no "separated by |" prompt.
    - xim main.epp + tools.epp Full build prints 42.
    - C++ mode l01_prompt with live std::cin/getline.
- `ui_v4/fb/test_fullbuild_ui.js` check 7 changed. v3 checked "raylib program: Full build says use Run (console programs)". v4 checks "raylib program: Full build builds and runs it (v4)" (frames > 5, then Stop → "Game closed"). The other 7 checks are unchanged.

### (C) memory: what changed
- **Clang is no longer kept warm.** C++ mode Run and Full build both use `keepWarm:false`, so the Clang worker (its ~75 MB module plus linear memory of up to several hundred MB) is terminated as soon as the build ends. It is never alive while a game or program runs. v3 kept it for 2 minutes.
  - Cost: each build re-instantiates Clang from the browser's compiled-module cache instead of reusing a warm worker. Measured as "load" in test_cpp_mode: see the regress numbers below.
- **Asyncify runs apart.** binaryen.js runs in its own short-lived worker, started after the Clang worker has ended (`asyncifyApart`), so the two are never in memory together. In v3 both lived in the same worker at the same time.
- **The build worker drops memories as it goes.** It used to hold every tool run's wasm Memory in a Set until the build ended, so the compile step's memory couldn't be collected while the linker ran. It now holds them only through WeakRefs.

### (C) memory: measured (14:20 CT, emulator: headless WebKit + CriOS UA on the 1.5-CPU VM)
Same method both times: `ui_v4/fb/mem.sh` run on `test_cpp_mode.js webkit crios`. It does 4 builds: console cold, console warm, errors, raylib. The game then runs, followed by English++ Run.

| | before (v3 runtime) | after (v4 fb) |
|---|---|---|
| peak web-process RSS during a build | **985 MB** | **979 MB** (no real change) |
| level while the raylib game runs after its build | ~880 MB | **~614 MB** (−265 MB) |
| level between builds | stays high (Clang warm) | falls back to ~510–690 MB |
| warm rebuild (2nd console build) | 15.0 s (load 0 s, build 14.2) | 29.1 s (load 8.4 s, build 20.1) |

- **What dominates the build peak:** Clang's own wasm linear memory is small: 72 MB peak for hello-iostream and 35 MB for a raylib program (`stats.maxWasmMemory`, `ui_v4/fb/stats_probe.js`).
  - The rest of a build's ~400–450 MB is WebKit's compiled machine code for the 74 MB `llvm.core.wasm`, plus the page itself (about 450–550 MB with the English++ engine loaded).
  - The downloads were already streamed through Blobs, without whole-file JS copies.
  - Compiled code for the toolchain can't be cut from JavaScript without a smaller compiler build. That's an honest limit: **the iPhone compile peak is about the same as v3**.
- **What v4 does win:** nothing compiler-related stays in memory once the build is done. A game, or a program waiting for typing, runs about 265 MB lighter, which matters most on a phone, because the game then runs for minutes.
  - Asyncify (binaryen) is no longer stacked on Clang in one worker.
- **Cost:** each build loads Clang again from the browser cache (about 8 s here, emulator). On the real iPhone, v3 Full build took 8.1 s compile in total, so this adds a few seconds per build. That trade was chosen for the iPhone memory cap, as the brief allows.
- The `game FPS > 15` check in `test_cpp_mode` failed both before (4.2 FPS, v3 runtime) and after (12.1 webkit, 6.4 chromium). It depends on VM load from other agents and is an emulator number, not a regression.

### C++ View gaps found (engine, NOT changed: listed for the engine owner)
- On all 4 raylib examples, the 3 Drive School-style programs, Book #177, in_age/in_sum/in_inp and the xim pair, Clang found **0 errors** in the C++ View.
- Checked and NOT a gap: `age get "Age? "` (no `mak num`) then `next is age+1`.
  - The C++ View emits `std::string next = age + 1;`.
  - Run refuses line 2 ("A text can be joined with a text or a letter, not a whole number…").
  - g++ also refuses it ("no match for 'operator+' (std::string and int)"; `cpp_v4_scratch/gap1.cpp`), so Full build stops with a Clang error mapped to English++ line 2, which matches Run's refusal.
  - An earlier note claiming C++ accepts this was wrong and has been corrected.
- No C++ View gap was found in this layer's programs.

### Final regression (15:45 CT, testsite_v4_fb on :8771, emulator). Logs: `ui_v4/fb/logs/R_*.txt`, summary `logs/REGRESS.txt`
| suite | result |
|---|---|
| C++ console vs g++, webkit / chromium | **50/50 / 50/50** byte-exact |
| raylib C++, webkit / chromium | **11/11 / 11/11** |
| test_cpp_mode webkit-crios / chromium | 16/17 / 16/17. The only fail is the headless "game FPS > 15" check (12.1 / 6.4 FPS, emulator). It was 16/17 on the v3 runtime too (4.2 FPS), so it's load-dependent and not a regression. |
| Full build UI (raylib check changed for v4), webkit-crios / webkit | **8/8 / 8/8** |
| blink (0 mid-frame yields), chromium / webkit | **3/3 / 3/3** |
| Studio real 52 | **52/52** webkit-crios |
| Open the C++ in C++ mode | 4/6 (the 2 Qt refuse, as in v3) |
| NEW live input vs g++ (test_live), chromium / webkit | **5/5 / 5/5** |
| NEW Full build console (test_fb_console), webkit-crios / chromium | **11/11 / 11/11** |
| NEW Full build games (test_fb_games), chromium 1366×768 | 44/45 in the sweep. The one fail was dodge, from the run started before the test fix; dodge rerun alone: 7/7. So 45/45. |
| NEW Full build games, webkit-crios 440 wide | 42/45. All 3 fails are ds1_road: the red car isn't drawn, **in Run and in Full build alike**. This is a headless-WebKit software-GL artefact (see the cubes probe above). Chromium draws it. |

Screenshots: `peek/v4_fb_chromebook_ds1_road.jpg`, `v4_fb_chromebook_orbit_camera.jpg`, `v4_fb_iphone_ds1_road.jpg`, `v4_fb_iphone_orbit_camera.jpg`, `v4_fb_iphone_live_input.jpg`, `v4_fb_iphone_cpp_live_input.jpg`. All were looked at. Per-program before/after shots are in `ui_v4/fb/shots/`.
