# Code Block

**A free place to learn to code — one line, eight perfect reps at a time.**

Code Block teaches programming by repetition and plain words. You type a real line of code until your fingers know it, read what it means in everyday language, then copy and run whole little programs. It works on a phone, needs no account, and keeps your progress in your own browser.

It's free to use. The plan is for it to be supported by voluntary donations, never a paywall. See [the project brief](docs/PROJECT_BRIEF.md) for the full vision.

## What you can learn

| Group | Tracks |
| --- | --- |
| Programming languages | C++ · C# · Python · JavaScript · Java · TypeScript · Go · Rust · C |
| Web & data | SQL |
| Game engines | Unity (C#) · Unreal Engine 5 (C++) |
| Road & life skills | Minnesota Drive (permit-test study) |

Every programming track has the same rooms:

- **Sandbox**: 30 drill blocks, each one everyday line of code. A block is mastered after 8 perfect repetitions. A wrong letter is gently refused, and phone keyboards' smart quotes and dashes count as the plain character.
- **Library**: 16–19 chapters in plain words (a story, the big idea, an animated picture, a deep dive, a worked example with a line-by-line walkthrough, and the most common mistake), plus 4–6 reference shelves, a glossary, a field guide and cheat cards.
- **PC**: 12–25 practice programs per track. Pick one, type along, change the numbers in the blue boxes and run it again.
- **Vault**: 10,000 generated drills per track, in 100 themed packs.
- **My Book**: open your own PDF beside the drills.
- **Profiles and certificates**: several learners can share one device, and finishing a track earns a certificate you can save as an image.

## How the content is checked

The PC does not compile anything in your browser. Each practice program's output is worked out in JavaScript, and **the test suite proves that output is right** by running every program with the real toolchain and comparing the two, character for character. It checks the default, minimum and maximum settings, and as many extra random settings as you like.

| Track | Programs and examples are… | Drill and Vault lines are parsed by… |
| --- | --- | --- |
| C++ | built with g++ (C++17, `-Wall`) and run | — |
| C# | built with .NET 8 (C# 8) and run | Roslyn |
| Python | run with CPython 3 | Python's `ast` |
| JavaScript | run with Node.js 22 | acorn |
| TypeScript | type-checked by `tsc` in strict mode, then run | the TypeScript compiler's parser |
| Java | run with JDK 21 | tree-sitter |
| Go | `gofmt`-checked, `go vet`-ed, then run (the testing lesson runs `go test`) | `go/parser` |
| Rust | `rustfmt`-checked, built with clippy (warnings are errors), then run | syn |
| C | `clang-format`-checked, built as C17 (warnings are errors), run under AddressSanitizer and UBSan | tree-sitter |
| SQL | run by the `sqlite3` shell | SQLite itself, against a shared schema (so table and column names are checked too) |
| Unity | compiled against a stand-in copy of the Unity API and played frame by frame | Roslyn |
| Unreal | compiled with g++ against a stand-in copy of the UE5 API and played frame by frame | tree-sitter (reflection macros removed) |

The Unity and Unreal tracks say plainly in the app that their PC is a simulation: no game engine runs in a browser. Chapter and shelf examples must also build and run (browser-only examples are type-checked or parsed). Cheat cards and key lines must parse.

## Run it

Code Block is plain HTML, CSS and JavaScript, with no build step and no server code.

- **Quickest**: open `index.html` in a browser.
- **Local server** (closer to how it's hosted):
  ```sh
  python3 -m http.server 8000   # then visit http://localhost:8000
  ```
- **One file**: `npm run build:single` writes `dist/code-block.html`, a single self-contained page with every track inlined. It's handy for sharing or for hosts that only take one file.

The 3D world loads three.js and the PDF reader loads pdf.js from cdnjs. The fonts come from Google Fonts. If those can't be reached, the app still works: it skips the 3D background and uses system fonts (a test checks this).

## Put it online (GitHub Pages)

1. Merge the work into the branch you want to publish (usually `main`).
2. In the repository on GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and the `/ (root)` folder, and save.
4. After a minute the site is live at `https://<your-user>.github.io/<repo>/`.

Any static host works the same way: Netlify, Cloudflare Pages, or a plain web server. Upload the repository's files, or just `dist/code-block.html`.

## Test it

```sh
npm ci                      # exact versions from package-lock.json
npx playwright install chromium   # once, if no Chromium is installed
npm test                    # browser suite: 26 tests, every track
npm run test:content        # run every practice program with real toolchains
```

- `CB_TRACKS=go,rust npm test` runs the browser tests for just those tracks.
- `npm run test:content -- python sql` checks just those tracks.
- `CB_EXTRA_CASES=40 npm run test:content -- sql` also runs every project at 40 more seeded settings.
- A toolchain that isn't installed is reported as **SKIP**, never as a pass. The content check needs g++, the .NET 8 SDK, Python 3, Node.js, a JDK (21+), Go, Rust (with rustfmt and clippy), gcc and clang-format, and sqlite3.

The browser suite covers mastery after 8 reps, wrong-letter handling, saving, every drill line in every track, PC output, the Library, the driving test, profiles and the Vault, My Book, the offline fallback, phone layouts at 320 and 390 px, the track picker, and an axe-core accessibility scan in light and dark mode.

## How it's organized

```
index.html            the page: every room's markup
css/app.css           all styles
js/tracks.js          the track registry: names, groups, storage keys, loader
js/drill.js           Sandbox drills and mastery
js/views.js           Library, PC and the rest of the rooms
js/profiles-vault.js  profiles, the Vault and its generator
js/…                  music, 3D world, book reader, ceremony, keyboard and focus helpers
tracks/<id>.js        one file per track: all of its content
tests/                browser tests (Playwright) and content checks
tools/                the single-file builder
docs/                 the project brief, the audit and licensing notes
archive/              the original single-file upload, unchanged
```

Each track's progress is saved under its own key, so learners can switch tracks freely. Adding a track takes one data file plus one registry line. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Status

- [docs/AUDIT.md](docs/AUDIT.md) lists what the first review found, what was fixed and what's still open.
- **License**: not chosen yet. Until one is added, the code and content are all rights reserved by the author. [docs/LICENSING.md](docs/LICENSING.md) recommends options.
- **Donations**: not set up yet. No payment links exist on the site.
