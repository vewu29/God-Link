# Contributing to Code Block

Thank you for helping make learning to code free for everyone. This guide covers how to set up, the rules every lesson follows, and how to add content or a whole new track.

## Ground rules

1. **The core stays free.** Nothing that teaches goes behind a paywall, a login or an ad.
2. **Plain words.** Write for someone who has never programmed. Use short sentences, one idea per paragraph, and say *why* as well as *what*. Explain a term the first time it appears.
3. **Every fact is checked.** Code must be run by the real compiler or interpreter in `tests/content` (see below). Facts about laws, versions or tools need a source you can name.
4. **Your own words.** Don't copy text, examples or diagrams from books, courses or websites. Learn from them, then write it fresh.
5. **Never break progress.** Learners' progress lives in their browser under each track's storage key. Never rename a key or reorder a track's drill blocks; add new blocks at the end.

## Setting up

```sh
npm ci
npx playwright install chromium   # once, if needed
npm test                          # browser suite
npm run test:content -- python    # content checks for one track
```

Open `index.html` in a browser to try your change. The README's "Test it" section lists every option and the toolchains the content checks use.

## How a track is built

Each track is one file, `tracks/<id>.js`, that calls `cbRegisterTrack("<id>", function () { … return { … }; })`. It is listed once in `js/tracks.js` with `addTrack({ … })`, which gives its name, group, badge color, file name, run command and comment marker. The returned object has:

| Field | What it holds |
| --- | --- |
| `blocks` | The 30 Sandbox drills: `{ name, short, chapter, icon, verb, line, explain }`. `line` is the exact code to type. |
| `chapters` | Library chapters: `{ title, chapter, line, content: { story[3], big, caption, demo[4] }, deep: { more[2], ex: { code, walk[] }, mistake } }`. |
| `shelves` | Reference shelves, in the same shape as chapters. |
| `glossary` | `[term, plain-words definition]` pairs. |
| `field` | Field-guide cards: `{ name, head, what, ex }`. |
| `cheats` | Cheat cards: `{ title, body, code }`. |
| `projects` | PC programs: `{ name, about, vars: [{ key, val, min, max }], code(v) → lines, run(v) → output lines, explain }`. |
| `vt`, `themes`, `fill` | Vault templates (`{ line, why }`, with placeholders like `{v}` and `{n}`), the 20 themes that group them into packs, and optional custom placeholder fills. |
| `sandboxNote`, `sourcesHTML` | The Sandbox intro and the footer's sources line. |

Read an existing track (for example `tracks/python.js`) before writing a new one. The structure and tone carry over.

### Rules for content

- **Projects.** `run(v)` must produce exactly what the real program prints, for *every* value in each box's range, not just the defaults. The content check runs the default, minimum and maximum settings; add `CB_EXTRA_CASES=40` to try random ones too. Each box's value must appear in the code as the language declares it (`start = 5`, `let start = 5;`, `start := 5`, `.parameter set :start 5` …) so the PC can highlight it.
- **Web pages (HTML & CSS).** A track with `preview: true` in `addTrack` has no console: Compile & Run draws the page in a sandboxed frame. There, `run(v)` is the text the page shows, one line per line of text, and each project also has `checks(v)`, a list of `[selector, CSS property, value]` the browser must compute (`.offsetWidth` reads an element property; `count:grid-template-columns` counts columns). Name each box after the CSS property or attribute it sets (`font-size`, `gap`, `value`) so the PC can highlight `font-size: 32px` or `value="40"`.
- **Examples.** Chapter and shelf examples are whole programs that must run without errors. Mark one `browser: true` if it needs a web page (it's then type-checked or parsed only), or `test: true` if it's a test file (Go and Rust run their test tools on it).
- **Walkthroughs.** Each `walk` step that starts "Line 5:" or "Lines 3–7:" must point at those exact lines, and any output it quotes must be what the program really prints. Run the example and check.
- **Drills and Vault lines** must parse in the track's language. Every Vault template needs enough variety (placeholders with many possible values) that each 100-drill pack has no repeats.
- **Formatting.** Code follows the language's standard formatter: gofmt, rustfmt, clang-format (LLVM, 4 spaces) and so on. Tabs are shown as four spaces.
- **Color.** A track's badge color must reach 4.5:1 contrast against white text.

## Adding a new language

1. Write `tracks/<id>.js` as above.
2. Add `addTrack({ id, name, badge, group, color, blocks: 30, blurb, keywords, file, run, comment, vaultFile, varPrefix })` in `js/tracks.js`.
3. Teach the content check to run it: add `module.exports.<id> = { needs, build, checkLines, checkExamples }` in `tests/content/toolchains.js`, using the real compiler or interpreter (slow toolchains can use `buildBatch` to build every case at once, as Kotlin and HTML do). If no real toolchain can run in tests, say so plainly in the track and check as much as you can, the way the Unity and Unreal stand-ins do.
4. Run `npm run test:content -- <id>` and `CB_TRACKS=<id> npm test` until both pass.
5. Update the track table in `README.md` and the numbers in `docs/AUDIT.md`.

## Changing the app

- Keep the 8-rep mastery loop, the drill rules and every existing room working. The browser suite guards them; add a test for anything you fix.
- Check phone widths (320 and 390 px) and keyboard use. The accessibility scan in `tests/a11y.test.js` must stay clean.
- Run the full `npm test` before opening a pull request, and `npm run build:single` if you touched loading or script order.

## Pull requests

- Keep each pull request to one track or one feature, so it can be reviewed.
- Say what you checked and how (for example "test:content python: 54/54, 10,030 lines, 45/45 examples").
- By contributing, you agree your work is shared under the project's licenses once they're chosen (see [docs/LICENSING.md](docs/LICENSING.md)).
