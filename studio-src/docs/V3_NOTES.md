# English++ Web Studio v3: C++ mode + raylib from C++ (staged, NOT pushed)

Asked by Vewu Nov 25, 2026, 20:01 CT: "Also give the ide the ability to code in c++ too and for raylib to work with c++ too".
Staged in `stage_v3/` (= stage_v2 with the 790f65b blink-fix engine + v3). The parent pushes only after his fresh "push it".

## What it does
- **One language per file.** A `.cpp` or `.h` file opens in C++ mode, and `.epp` stays English++, exactly as before. "+ File" accepts `game.cpp` and gives it a C++ starter.
  - A "C++ / English++" badge sits at the end of the file-tab row. It appears only once the project has a C++ file.
- **C++ editor.**
  - CodeMirror C++ highlighting, auto-indent on `{`, and auto-close for brackets and quotes.
  - Autocomplete covers keywords, `std::` names, the program's own names, and all raylib functions with their signatures, structs, colours and keys (raylib, raymath and rcamera; 736 functions). Struct fields come up after `.` or `->`.
  - The Enter rule matches English++ mode: Enter accepts only after you move with the arrows. Tab takes the top row.
  - Phone layout: 44px rows and no detail panel.
- **C++ Blocks** (14): main, for, for-each, while, if, if/else if, switch, function, class, struct, vector, map, try, and the raylib window loop.
  - The window-loop block adds the include and `main` if they're missing.
- **C++ examples:** Hello, loops/vectors/strings, a class, the bouncing ball (raylib), the 3D orbit camera (raylib), and the game Star Catcher (raylib).
- **Run, console programs:** real Clang 22 in the browser, through the same lazy Full build compiler.
  - The full C++20 library with exceptions is available.
  - stdin is typed up front.
  - Compile errors appear in plain words as tappable rows and as wavy underlines on the right line.
- **Run, raylib programs:** raylib 5.5, compiled for wasm32-wasi with a small platform layer. GL, window, input and time are JS imports on WebGL2.
  - binaryen.js runs Asyncify in the browser, so the program's `while (!WindowShouldClose())` loop hands the frame to the browser at EndDrawing only.
  - It never yields mid-frame. A long `WaitTime` in the middle of drawing waits after the frame instead.
  - Game keys, touch and mouse drive raylib input. Stop closes the game cleanly.
- **English++ → C++:** "Open the C++ in C++ mode" in the C++ pane turns the C++ View into an editable, runnable `from_english.cpp`.
  - The C++ View now writes raylib calls, colours, keys and struct fields as real C++, but only for raylib programs. Every other program's C++ View is unchanged.

## Route and why
Asyncify on the main thread, with no special headers. The other option was a Worker with OffscreenCanvas plus SharedArrayBuffer. That needs COOP/COEP headers on the whole God-Link site, which risks the existing engine and the embeds. JSPI is not in WebKit, so it isn't an option for iOS.

Proven limit: Asyncify plus wasm exceptions crashes binaryen. So raylib programs build with `-fno-exceptions`. Console programs keep exceptions.

## Files (`stage_v3` versus the live v2)
- **Changed:** `epp-studio.html` (+1 script tag), `js/epp-studio.js`, `js/vendor/codemirror-epp.js` (+lang-cpp), `css/epp-studio.css`, `engine/epp_engine.js` + `engine/epp_engine.wasm.gz.b64`.
  - The engine change is the C++ View raylib table only. The source is the parent's engine with the blink fix; `cppview.cpp` is the only file that differs. The two engine files must be pushed together.
- **New:** `js/epp-cpp.js`, `data/epp-studio/cpp.json` (lazy, loads on the first C++ file), `data/epp-studio/cpp_examples.json`, and `fullbuild/cpp/*`.
  - `fullbuild/cpp/*`: `cppbuild.js`, `cppworker.js`, `rlw_runtime.js`, and in `vendor/`: the raylib pack, binaryen.js, the manifest and licences.
- **Server:** no change. `js`/`css` are served through ASSET_FOLDERS, and `fullbuild`, `data/epp-studio` and `engine` are already mounted.

## Push order (manifests in this folder; NUL-delimited, NUL-terminated, text only, each under 4 MB)
1. `push_v3_a_binaryen.nul`: binaryen.js (3.51 MB). Nothing uses it until the new page goes up.
2. `push_v3_b_engine.nul`: `engine/epp_engine.js` + `.wasm.gz.b64` (1.78 MB). This one is safe on the live v2 page too; only its C++ View gets more complete for raylib programs.
3. `push_v3_c_page.nul`: the page, scripts, CSS, data, the C++ runtime and the raylib pack (2.70 MB). Push this last.

## Rebuild
`ui/build_v3.sh`. It refuses to build if `cpp/engine_v3/src_web` or any engine source other than `cppview.cpp` differs from `engine/`. The engine wasm build is `make -f Makefile.web` in `cpp/engine_v3`, using emsdk.
