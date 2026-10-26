# Code Block

**A free place to learn to code — one line, eight perfect reps at a time.**

Code Block teaches programming by repetition and plain words. You type a real line of code until your fingers know it, read what it means in everyday language, then copy and run whole little programs. It works on a phone and needs no account. Where the site runs with its server, a free account saves your progress online, follows you to any device and puts you on the leaderboard.

It's free to use, supported by voluntary donations (the **Donate with PayPal** button), never a paywall. See [the project brief](docs/PROJECT_BRIEF.md) for the full vision.

## What you can learn

| Group | Tracks |
| --- | --- |
| Programming languages | C++ · C# · Python · JavaScript · Java · TypeScript · Go · Rust · C · Ruby · Kotlin · Lua · Bash · Haskell |
| Web & data | HTML & CSS · SQL · PHP |
| Science & math | R |
| Game engines | Unity (C#) · Unreal Engine 5 (C++) |
| Road & life skills | Minnesota Drive (permit-test study) |

Every programming track has the same rooms:

- **Sandbox**: 30 drill blocks, each one everyday line of code. A block is mastered after 8 perfect repetitions. A wrong letter is gently refused, and phone keyboards' smart quotes and dashes count as the plain character.
- **Library**: 16–19 chapters in plain words (a story, the big idea, an animated picture, a deep dive, a worked example with a line-by-line walkthrough, and the most common mistake), plus 4–6 reference shelves, a glossary, a field guide and cheat cards.
- **PC**: 12–25 practice programs per track. Pick one, type along, change the numbers in the blue boxes and run it again. In HTML & CSS, Compile & Run opens your page in a sandboxed frame (no scripts, no forms) and your own browser draws it.
- **The 3D world**: every block stands in a 3D scene you can tap, drag and zoom, in two views. **Original** lays them along a lit, winding road on a board; **Tower of Babel** builds them into a spiral ramp climbing a tiered tower under the message "V has Come to!", so mastering blocks climbs the tower. The choice is remembered on the device.
- **Vault**: 10,000 generated drills per track, in 100 themed packs.
- **My Book**: open your own PDF beside the drills.
- **Profiles and certificates**: several learners can share one device, and finishing a track earns a certificate you can save as an image.

Across every room:

- **Every keystroke answers.** A right letter plays a note (or a key click, or a bubble) and throws a few sparks; a wrong one thuds, shakes and shows the key the line wanted. Runs of right letters build a combo that heats up through five colours. Finished lines pay XP toward levels, a daily goal and a day streak, and 16 trophies wait to be earned. Sounds are made in the browser (no audio files) and the effects step aside for reduced motion.
- **Eleven colour themes**, from Sky (which follows the device's light or dark setting) to Forest, Ocean, Sunset, Galaxy, Terminal, Paper and High Contrast. Every theme is contrast-checked when it's built and scanned for accessibility in every room.
- **Online accounts** (where the server runs): sign up with a username and password, no email. A one-time recovery code stands in for "forgot password". Your blocks, Vault drills, XP, streak and trophies are saved to the account and merged on every device you log in on. A leaderboard (this week and all time) and a live count of lines typed today make it a shared place to practise.

## Make games: Code Block Studio

**Studio** (`studio.html`, linked from the home page) is a 3D game engine you use without writing code. It runs on [Babylon.js](https://www.babylonjs.com/) and is scripted the way Unreal Engine's Blueprints are: you place nodes and wire them together.

- **The level**: add actors (box, sphere, cylinder, cone, capsule, ring or sign), then move, turn and scale them with the gizmos or type exact numbers. Each actor has a colour, tags, and physics: *none*, *solid* (walls and floors) or *dynamic* (falls, collides, can be pushed). The World sets the sky, gravity, brightness, fog and the camera (follow, top-down, side-on or fixed).
- **Blueprints**: every actor has its own graph, and the Level has one for the whole game. White wires carry the order things happen in; coloured wires carry values (true/false, numbers, text, vectors, actors, colours). Drag from a pin to a pin, or tap one pin and then another on a phone. Dropping a wire on empty space opens the node menu showing only nodes that fit, as in Unreal. **Tidy up** lines a graph up along its wires.
- **140 nodes in 14 groups**: events (BeginPlay, Tick, key presses, clicks, overlaps, hits, custom events); flow control (Branch, Sequence, loops, Do Once, Do N, Gate, Flip Flop, Delay, timers, Switch, broadcasts); variables, plus values saved on the device; maths, logic, text and vectors; actors (find, move, turn, spawn, destroy, tag, recolour); physics (velocity, impulses, jumping, gravity, line traces); input; camera (mode, distance, shake); HUD (on-screen text, messages, progress bars); sounds, notes, particle effects and sky colour; and the game itself (time, pause, restart, quit).
- **Play** runs the game full screen, with the keyboard or an on-screen pad on phones. Escape or Stop goes back to the editor, and the level is never changed by playing it.
- **Four starter games**, each made only of nodes, to play and then read: an Empty level, Coin Run, Dodge the Rocks and Target Practice.
- Games save on the device (with undo and redo), and the Games menu exports and imports them as `.codeblock.json` files.

The engine itself (`js/studio-core.js`) runs without a browser, so its tests play every starter game with simulated keys and clicks.

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
| HTML & CSS | checked by the W3C Nu HTML Checker (its CSS checker too) with no message at all, then drawn by Chromium: the page's text must match, and the styles its numbers set must compute to those numbers | the Nu HTML Checker, inside a small page |
| PHP | run with PHP 8.3, every error reported; any warning fails | `php -l` |
| Ruby | run with `ruby -w` (Ruby 3.3); any warning fails | Ruby's own compiler |
| Kotlin | built by kotlinc 2.1 with warnings as errors, then run | the Kotlin compiler's parser |
| Lua | run with Lua 5.4; any error output fails | Lua's own `load()` |
| Bash | must pass ShellCheck with every check on, then run with Bash 5; any error output fails | `bash -n`, then ShellCheck |
| Haskell | run with GHC 9.4's `runghc` and `-Wall`; any warning fails (type defaulting and missing signatures aside) | GHC's own parser, through the GHC API |
| R | run with `Rscript` (R 4.3); any error or warning output fails | R's own parser |
| Unity | compiled against a stand-in copy of the Unity API and played frame by frame | Roslyn |
| Unreal | compiled with g++ against a stand-in copy of the UE5 API and played frame by frame | tree-sitter (reflection macros removed) |

The Unity and Unreal tracks say plainly in the app that their PC is a simulation: no game engine runs in a browser. Chapter and shelf examples must also build and run (browser-only examples are type-checked or parsed). Cheat cards and key lines must parse.

## Run it

Code Block is plain HTML, CSS and JavaScript, with no build step. The server is optional: without it, everything except online accounts works.

- **Quickest**: open `index.html` in a browser.
- **Local server** (closer to how it's hosted):
  ```sh
  python3 -m http.server 8000   # then visit http://localhost:8000
  ```
- **One file**: `npm run build:single` writes `dist/code-block.html`, a single self-contained page with every track inlined. It's handy for sharing or for hosts that only take one file.

The 3D world loads three.js and the PDF reader loads pdf.js from cdnjs. The fonts come from Google Fonts. If those can't be reached, the app still works: it skips the 3D background and uses system fonts (a test checks this).

## Put it online

**With accounts** (a Python or PHP host with MySQL, such as Wasmer Edge): see [docs/DEPLOY.md](docs/DEPLOY.md). The database settings come only from the host's environment; no password is ever in the repository.

**As a static site** (GitHub Pages):

1. Merge the work into the branch you want to publish (usually `main`).
2. In the repository on GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and the `/ (root)` folder, and save.
4. After a minute the site is live at `https://<your-user>.github.io/<repo>/`.

Any static host works the same way: Netlify, Cloudflare Pages, or a plain web server. Upload the repository's files, or just `dist/code-block.html`.

## Test it

```sh
npm ci                      # exact versions from package-lock.json
npx playwright install chromium   # once, if no Chromium is installed
npm test                    # browser suite: every track, every room
npm run test:content        # run every practice program with real toolchains
DB_NAME=cb_test npm run test:api   # both servers against a MySQL test database (see docs/DEPLOY.md)
```

- `CB_TRACKS=go,rust npm test` runs the browser tests for just those tracks.
- `npm run test:content -- python sql` checks just those tracks.
- `CB_EXTRA_CASES=40 npm run test:content -- sql` also runs every project at 40 more seeded settings.
- A toolchain that isn't installed is reported as **SKIP**, never as a pass. The content check needs g++, the .NET 8 SDK, Python 3, Node.js, a JDK (21+), Go, Rust (with rustfmt and clippy), gcc and clang-format, sqlite3, PHP 8, Ruby 3, kotlinc 2.1, Lua 5.4, Bash and ShellCheck. The Nu HTML Checker comes from `npm ci` (the `vnu-jar` dev dependency) and runs on the JDK.

The browser suite covers mastery after 8 reps, wrong-letter handling, saving, every drill line in every track, PC output, the Library, the driving test, profiles and the Vault, My Book, the offline fallback, phone layouts at 320 and 390 px, the track picker, every Vault placeholder being filled (no pack falls back to filler lines), the typing effects, every theme, the account screens (against a stand-in API), and an axe-core accessibility scan in light and dark mode and in every theme.

The Studio suite builds Blueprints in a real browser (the node menu, wiring by dragging and by tapping, undo and redo, Tidy up), plays Coin Run on a desktop and a phone, saves, reloads and imports games, and scans the editor for accessibility. The engine's own suite checks every node's definition, flow control, the maths, physics and collisions, and plays all four starter games.

The API suite runs one set of tests against the Python and the PHP server alike: sign-up rules, sessions, recovery, rate limits, the request checks, progress, XP caps, streaks, the leaderboard, an account made on one server used on the other, and the page itself signing up in a real browser.

## How it's organized

```
index.html            the page: every room's markup
css/app.css           all styles
css/themes.css        the colour themes (generated by tools/build-themes.js)
js/tracks.js          the track registry: names, groups, storage keys, loader
js/drill.js           Sandbox drills and mastery
js/views.js           Library, PC and the rest of the rooms
js/world.js           the 3D world: the original board and the Tower of Babel
js/music.js           the generative music
js/profiles-vault.js  profiles, the Vault and its generator
js/typing-fx.js       sounds, sparks, combos, XP, streaks and trophies
js/theme.js           the theme picker
js/account.js         online accounts, sync, the leaderboard and live count
studio.html           Code Block Studio, the no-code game engine
css/studio.css        its styles
js/studio-core.js     the engine: 140 Blueprint nodes, the interpreter and the game world (runs in Node too)
js/studio-samples.js  the four starter games, made of nodes
js/studio-view.js     the Babylon.js 3D view: meshes, gizmos, shadows, particles and sounds
js/studio.js          the editor: outliner, details, the Blueprint graph, the node menu, Play
js/…                  book reader, ceremony, keyboard and focus helpers
tracks/<id>.js        one file per track: all of its content
main.py, server/      the Python server (FastAPI): the page and the API
index.php, api/       the same server in PHP
db/schema.sql         the MySQL tables both servers use
tests/                browser tests (Playwright), API tests and content checks
tools/                the single-file and theme builders
docs/                 the project brief, deployment, the audit and licensing notes
archive/              the original single-file upload, unchanged
```

Each track's progress is saved under its own key, so learners can switch tracks freely. Adding a track takes one data file plus one registry line. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Status

- [docs/AUDIT.md](docs/AUDIT.md) lists what the first review found, what was fixed and what's still open.
- **License**: not chosen yet. Until one is added, the code and content are all rights reserved by the author. [docs/LICENSING.md](docs/LICENSING.md) recommends options.
- **Donations**: the **Donate with PayPal** button (at the foot of every room) goes to the creator's PayPal. Every lesson stays free either way.
