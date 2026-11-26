# English++ Web Studio — engine ↔ UI contract (v1)

The engine is C++ compiled to WebAssembly (Emscripten, MODULARIZE, ASYNCIFY).
It is built to `~/workspace/englishpp-web-ide/engine/dist/`:

- `epp_engine.js` + `epp_engine.wasm` (lazy-loaded by the Web Studio page only).
- Factory: `createEppEngine(options) -> Promise<Module>`.

## Options the UI passes to the factory
```js
createEppEngine({
  canvas: document.getElementById('epp-canvas'), // raylib draws here (WebGL2)
  print:    (text) => {},   // one call per stdout chunk (may hold several lines, no trailing \n added)
  printErr: (text) => {},   // stderr (err prn, runtime problems)
  eppEvent: (ev) => {},     // ev is a JS object, see "Events"
  eppReadLine: (promptText) => Promise<string>, // program asked for input (get / gln / wln inp)
  eppQt: (cmd) => any,      // Qt-compatible layer: synchronous widget commands, see "Qt layer"
  eppQtNextEvent: () => Promise<string>, // resolves with the id of the next clicked/changed widget, or "" when the window was closed / Stop pressed
  locateFile: (p) => 'engine/' + p,
})
```

## Functions on the Module
All take/return JS strings (UTF-8).
- `M.check(src) -> {ok, errors:[{line, message}]}` — front end only (fast). Line numbers are 1-based. Messages are plain English.
- `M.cpp(src) -> string` — the Web Studio's C++ View (one C++ chunk per English++ line, with `// line N` markers).
- `M.run(src) -> Promise<{exitCode, error?:{line,message}}>` — runs the program. Output goes to `print`. Uncaught problems arrive as `error` (and also printed to printErr).
- `M.stop()` — asks the running program to stop at the next line (safe to call any time).
- `M.fsWrite(path, text)`, `M.fsRead(path) -> string|null`, `M.fsList() -> [path]`, `M.fsRemove(path)` — the program's in-memory disk. Extra editor tabs are written here before Run so `now xim "tools.epp"` finds them. Files written by the program (hwr …) appear here too.
- `M.version` — string.

## Events (`eppEvent`)
- `{type:'library', name:'raylib'|'qt'}` — the program uses a library (sent at start of run); UI shows the canvas pane (raylib) or the Qt pane (qt).
- `{type:'window', width, height, title}` — raylib InitWindow; canvas logical size.
- `{type:'line', line}` — optional, throttled: line being run (for highlighting during slow programs).
- `{type:'done', exitCode}` — run finished.

## Input
`eppReadLine(prompt)` must resolve with the typed line (without newline). Resolve with `null` if the user pressed Stop.

## Qt layer (Qt-compatible, NOT real Qt)
The engine sends `eppQt({op, id, text, min, max, title, width, height})` with ops:
`window`(title,width,height) · `label`(id,text) · `button`(id,text) · `textbox`(id) · `slider`(id,min,max) · `checkbox`(id,text) · `setLabel`(id,text) · `message`(text) · `getText`(id)->string · `getSlider`(id)->number · `getTicked`(id)->bool · `show`() · `close`().
After `show`, the engine loops on `await eppQtNextEvent()` and runs the function connected to that id. Resolving "" ends the app.

## Keys for games
raylib reads keyboard/mouse/touch through Emscripten's GLFW. On-screen game keys should dispatch real `KeyboardEvent`s (`keydown`/`keyup` with the right `key`/`code`/`keyCode`) on `window` — that reaches raylib. Touches on the canvas are mouse/touch input already.

## Data files for the editor (`~/workspace/englishpp-web-ide/data/`)
- `roots.json` — every Chart word: `{families, words:[{word,family,familyName,says,who,what,example,cpp,block,type:'root'|'value'}], kinds:[...], special:[...]}`.
- `raylib_names.json` — 581 raylib functions + structs + constants + colors.
- `qt_names.json` — the Qt-compatible phrases.
- `../corpus/book_corpus.json` — Book programs with expected output (examples menu source).
