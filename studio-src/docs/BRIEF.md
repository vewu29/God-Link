# English++ Web IDE — brief (Vewu, Nov 25, 2026, 14:03 CT)

## Vewu's request, verbatim
"I want you to write an Englishpp web compiler and add it to the website. It's like a web ide. It helights roots and have auto complete and all. Use c++ and web assembly and raylib and any c++ lybary to make this. It should be able to use raylib to make games or whatever. It should also be able to use qt too. It has to be accurate Englishpp. It should be made to work on my iPhone 17 pro max."

## Where it goes
- Website = GitHub repo vewu29/God-Link, branch `claude/g-9rwd0h`, live at https://god-link.wasmer.app (current head 0b6a62c — verify before starting).
- Add a new English++ "Web Studio" section. Do NOT change the C++, C#, Drive tracks, or any existing drill/Vault line or progress storage. Lazy-load the IDE's wasm so the rest of the site doesn't get heavier.
- STAGE ONLY in ~/workspace/englishpp-web-ide/stage/ with a push_paths file. NEVER push — every push needs Vewu's fresh "push it".

## Accuracy — the hard rule
- English++ = the three-word line (who / root / what) as written in the English++ Book (~/workspace/user/files/English___Book__1.docx, authoritative; ch. 52 Whole Chart), ENGLISHPP_CHART.md (345 Chart words, with C++ for each), ENGLISHPP_SYNTAX_MANUAL.md (v2), ENGLISHPP_FOR_AI.md inside EnglishPP_for_Muse_AI.zip, and roots.cpp/roots_c.cpp/revolutionizer.h (Opus's compiler source; 4 headers missing so it can't be compiled — read it for exact semantics and exact error wording).
- Syntax is FROZEN since Oct 30, 2026. Never invent a root, spelling or meaning. Part 8 (ch. 53–82) is Classic dialect — keep it out unless clearly separated.
- Match or refuse: anything not supported must give a plain-English "not in the Web Studio yet" message, never a guess.
- Test corpus: every Book program with a printed expected output (~/workspace/englishpp-site-prep/book-examples.json has 327 extracted; re-check against the docx). Target byte-identical output. Report the exact pass count and list every miss.
- Reuse what exists: ~/workspace/epp-games/skyforge/tools/epp2cpp.py (Muse's approximate translator — approximate, not authoritative), site drill data.

## Architecture (recommended; deviate only with a stated reason)
- An iPhone can't practically run a C++ compiler, so the engine is an English++ front end + interpreter/VM written in C++, compiled to WebAssembly with Emscripten (~/workspace/.emsdk). The front end also produces a C++ View (the C++ the Studio would write), labelled as Web Studio's view.
- raylib 5.5 compiled for web (PLATFORM_WEB, GLES3) inside the same wasm; generate bindings for raylib's functions, structs and constants from raylib.h so `now xlb raylib` programs (InitWindow, DrawText, Camera3D, Vector3 …, the Book's ch. 43 bouncing ball, Drive School ch. 1) run on a canvas. The main loop must yield to the browser (emscripten_set_main_loop / asyncify) — `WindowShouldClose& weq nay` must work.
- Qt: try real Qt for WebAssembly only if it can be built/downloaded and runs acceptably on iPhone Safari; otherwise implement the Book's documented Qt phrases/xlb qt subset with real HTML or ImGui widgets, and say plainly it is a Qt-compatible layer, not Qt itself. Report which.
- Editor: CodeMirror 6 (MIT) or equivalent: root highlighting by Chart family colours, autocomplete for all 345 roots (meaning + C++ shown), raylib/Qt names, the program's own names; inline plain-English errors on the exact line; Run/Stop; console pane; canvas pane; C++ View; examples menu (Book programs); save to localStorage; share code.
- iPhone 17 Pro Max: touch-first, portrait + landscape, safe areas, an accessory key row (& @ " indent tab, common roots), big readable font, no zoom-on-focus, keyboard covers nothing important, touch→mouse for raylib, on-screen keys for games. Match the site's blue look.
- Licenses: open (MIT/zlib/BSD), pinned.

## Proof required
- Playwright WebKit iPhone emulation (~/workspace/.pw): IDE loads, highlighting, autocomplete, run console program, run raylib program (screenshot of canvas), Qt-layer demo, errors, 0 page errors. Chromium too.
- Screenshot as you work, fix what is wrong, before/after shots (Vewu's standing rule).
- Honest gaps list: never claim real-iPhone testing, FPS, or Studio-identical behaviour beyond what the corpus proves.

## ADDED Nov 25, 2026, 14:31 CT — Vewu chose: "Add the full Clang build mode too"
- Keep the fast C++/wasm runner as the default Run (unchanged plan).
- Add an optional "Full build" button: English++ → C++ (the C++ View output) → Clang/LLVM running in the browser (compiled to wasm, e.g. wasm-clang / LLVM-in-wasm or an equivalent open-source toolchain; libc++ headers + raylib headers/lib in a virtual filesystem, run in a Web Worker) → wasm → run on the same canvas. Downloaded ONLY when tapped (lazy, cached), never on page load.
- Its purpose is the strictest accuracy check: the real C++ compiled for real. Use it to cross-check the default runner on the Book corpus where feasible (report matches/mismatches).
- iPhone Safari memory limits are the known risk (toolchain 30–100 MB+). Measure download size and peak memory; test in WebKit emulation; if big programs can't fit, say so plainly with the size limit found. Never claim it works on a real iPhone — only Vewu's phone can confirm.
- If no workable in-browser Clang can be built/obtained here, report exactly what was tried and why it failed, and ship the rest.

## ADDED Nov 25, 2026, 14:36 CT — Vewu: "I use chrome on my iPhone"
- Target = Chrome for iOS on iPhone 17 Pro Max. In the US, Chrome on iPhone runs on Apple's WebKit engine (same engine/memory limits as Safari), so WebKit emulation stays the main test. Use the Chrome-on-iOS user agent (CriOS) in Playwright WebKit runs too.
- Handle Chrome iOS's toolbar/viewport: use dvh/svh units + visualViewport for the keyboard, safe-area insets, no reliance on Safari-only features. Don't sniff for "Safari" in a way that breaks CriOS.
