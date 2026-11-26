# studio-src: English++ Web Studio source (for Opus)

The source behind the live Web Studio (`/epp-studio.html`). This folder is NOT served by the site (server/app.py only serves listed routes).

- `START_HERE_OPUS.md`: read first. Its "zip map" folders are the ones in this folder; the site itself is the rest of this repo.
- `PROMPT_FOR_OPUS.md`: Vewu's ask. `VEWU_PROMPTS.md` has his words verbatim.
- `source/engine/`: the English++ engine (C++20 → wasm via Emscripten 7.0.1 + raylib 5.5).
- `source/editor_ui/`: the editor/page build (CodeMirror 6, v4 patch layers).
- `source/cpp_runtime/`: the C++ mode runtime (Clang in the browser, raylib on WebGL2, live input).
- `tests/`: the Book corpus (310 programs with expected output) and the C++ corpus (50 programs + g++ output). The Playwright suites are in the zip only.
- `docs/`: build briefs and v2–v4 notes. `reference/`: Chart, syntax manual, TURBO.md.

English++ is Vewu's language. The syntax is frozen: additions only. No push without his "push it".
