# ENGINE_API_V4.md — additions to ENGINE_API.md (English++ Web Studio v4, debugger)

English++ is Vewu's language; this file only documents how the Web Studio page talks to the engine.
Everything in ENGINE_API.md stays exactly as it was. `M.run`, `M.check`, `M.cpp`, `M.stop`, `M.fs*` are unchanged,
and a program run with `M.run` takes the same path as in v3 (one extra `if (g_dbg.on)` test per line, branch-predicted off).

Engine source: `cpp/engine_v4/` (copy of `cpp/engine_v3` + `src/debug.h`, `src/debug.cpp`, one line in
`Interp::Exec`, the calls below in `src_web/wasm_api.cpp` and `src_web/post.js`).
`Module.version` = `"English++ Web Studio engine 1.1 debugger (Nov 26, 2026)"`.

## M.debug(src, opts) → Promise<RunResult>

Runs `src` exactly like `M.run(src)` (same output callbacks, same files, same result object), with the debugger attached.

| opts field | meaning |
|---|---|
| `breakpoints` | `[{file, line}]`. `file` is `""` for the main program (the text passed in) and the file's name (as written to `M.fsWrite`, e.g. `"mod_01.epp"`) for a file brought in with `xim`. `line` is 1-based. |
| `pauseAtStart` | `true` = stop before the first line that runs (the Debug button with no breakpoints). |
| `onPause(info)` | called each time the program stops. Must return an action, or a Promise of one. While the promise is pending the program is paused (the wasm stack is saved by ASYNCIFY; the browser is free). |

Actions: `"continue"` (run to the next breakpoint), `"step"` / `"into"` (the next line that runs, into function calls),
`"over"` (the next line in this function or a caller), `"out"` (the next line after this function returns), `"stop"`
(ends the program: the result is `{exitCode: 1, error: {line: 0, message: "Stopped.", stopped: true}}`, as with `M.stop()`).
Any other value = continue. `M.stop()` while paused also wakes the pause with `"stop"`.

After the run ends (any way) the debugger is detached, so the next `M.run` is a plain run.

### info (the pause snapshot)
```
{ line: 17, file: "", why: "breakpoint" | "step",
  stack: [ {name: "main", line: 8, file: ""}, {name: "show_it", line: 17, file: ""} ],   // outermost first; the last one is where it stopped
  locals:  [ Var ... ],   // the names made so far in the stopped function (+ "slf" in a method); the main program's names when stopped in main
  globals: [ Var ... ] }  // mgl globals
```
`stack[k].line` is the line that frame is on (for callers: the line making the call).

### Var
```
{ n: "names",            // the name ("" for a list item; the index / key for a child)
  k: "a vector",          // the kind, in the Studio's words
  v: "[Ann, Bo]",          // the value exactly as `out prn` would print it (cut at 400 characters)
  t: 1,                    // present when the value is text (so "" can be shown as empty text)
  count: 2,                // lists, maps, sets, queues, stacks, tuples: how many items
  kids: [ Var ... ],       // what it holds: list items (first 100), map entries (key as n), object fields, what a pointer points at
  more: 1 }                // present when it goes deeper than 3 levels or the 3,000-item budget is used up (kids left out)
```
Pointers show what they point at only when that place is still alive; a dangling pointer shows its value and no kids
(the debugger never reads freed memory).

## M.setBreakpoints([{file, line}])
Replaces the breakpoint set; works while a debug run is going (including while paused). Not needed for `M.run`.

## M.debugFrame(k) → [Var]
While paused only: the names of stack frame `k` (0 = main). Returns `[]` when not paused or `k` is out of range.

## Exports (wasm)
`epp_dbg_breakpoints(spec)` (`"file\tline\n…"`), `epp_dbg_attach(on, pauseAtStart)`, `epp_dbg_frame(k)` → JSON text.
`post.js` wraps them; the page should use the M.* functions above.

## Rules kept
- Output never changes: a debug run prints byte-for-byte what `M.run` prints (Book corpus checked through the debug path).
- raylib frames: a pause is a deliberate stop. After a pause the engine's yield clock restarts, so continuing or stepping
  never adds a yield in the middle of a frame; frames still yield only at EndDrawing (ui_v2/test_blink.js stays 3/3).
- `M.check` while a debug run is paused returns busy, as during any run.

## Editor API additions (js/vendor/codemirror-epp.js, `EppCM.createEditor` → editor)
| call | meaning |
|---|---|
| `editor.breakpoints()` | breakpoint line numbers of the open file |
| `editor.toggleBreakpoint(n)`, `setBreakpoints([n])`, `clearBreakpoints()` | change them (tap/click a line number does the toggle) |
| `editor.onBreakpoints(fn)` | `fn(lines)` when they change (typing moves them with their lines) |
| `editor.setDebugLine(n, scroll)` / `debugLine()` | the paused-line highlight (0 = none) |
| `EppCM.breakpointLines(state)`, `EppCM.clearBreakpointsIn(state)` | the same for a file's saved state (tabs not open) |
| `opts.fixesFor(d)` | **fix-it hook**: called per diagnostic with `{line, message, lineText, from, to, file}`; return `[{name, text}]` (text = the whole corrected line) to get buttons that replace the line and re-check |
| `editor.diagnostics()` | `[{line, message, from, to, actions: [names]}]` now on screen |
| `editor.replaceLine(n, text)` | replace line n's text |
