# Code Block — Audit and Verification Report

This report records what the first review of the original Muse-built app found, what was fixed, how each fix is guarded, and what is still open. Every finding below was reproduced in a real browser or with a real compiler before it was changed. Commit hashes refer to the `claude/g-9rwd0h` branch.

## How the review was done

- **Baseline kept.** The upload (one 1 MB HTML file) is preserved unchanged at `archive/code-block-muse-original.html`. The split into `index.html`, `css/`, `js/` and `tracks/` was verbatim, and the first regression suite passed identically on the original file and the split one (`1da2140`).
- **Behavior.** Each room (Sandbox drills, Library, PC, Vault, My Book, profiles, Drive test) was driven in Chromium with Playwright at 320 px, 390 px and 1280 px wide, with phone touch emulation, in light and dark mode.
- **Accessibility.** An axe-core 4.10 scan of eight rooms in both color schemes.
- **Content.** Every C++ practice program was built with g++ and every C# one with the .NET 8 SDK. Each program's real output was compared, character for character, with what the app's PC screen shows.

## Is the PC's "Compile & Run" real?

**No, and now the app says so.** The original PC printed "Compiling… OK — no errors" for every run, but nothing is compiled in the browser. Each program's output is calculated in JavaScript. That text was removed (`b03c0d5`). The screen now says whether the learner's typed program matches the one shown, then shows its output.

The output itself is trustworthy because the content tests run every practice program with the real toolchain and compare. They check default, minimum and maximum settings, plus any number of seeded random settings (`CB_EXTRA_CASES`). The Unity and Unreal tracks run against stand-in copies of the engine APIs and say plainly in the app that their PC is a simulation.

## Findings and fixes

| # | Finding | Severity | Fix | Guarded by |
| --- | --- | --- | --- | --- |
| 1 | **Phone keyboards' smart punctuation was refused.** iOS turns `"` into curly quotes, `--` into an em dash and `...` into an ellipsis, so many drill lines couldn't be typed on an iPhone. | High (blocks drills on iPhone) | Typed text is folded position by position: a smart character counts as the plain one only where the line has that plain character. A genuinely wrong letter is still refused. Applies to the Sandbox, the Vault and the PC. | `fixes.test.js` "smart punctuation" |
| 2 | **On a phone, opening a drill left the typing box 1.5 screens down**, under thirty mood chips. | High (phone usability) | The drill, or on short screens its typing card, scrolls to just under the menu. Mood chips are hidden on phones (they're also in the Music bubble), and the "Start — this block" button hides while that block is open. | "typing box on screen" at 390 × 844 and 320 × 568 |
| 3 | **Drill lines wrapped mid-word** (`gameOve` / `r()`) on narrow screens. | Medium | Letters are grouped into words that wrap as units. | "wrap between words" |
| 4 | **Code-font ligatures** drew `<=` as `≤` and `==` as one bar, in code learners must copy exactly. | Medium | Contextual ligatures are switched off. | "drawn without ligatures" |
| 5 | **PC said "Compiling… OK — no errors"** when nothing was compiled. | Medium (honesty) | Replaced with a truthful message (see above). | "says honestly whether your typed program matches" |
| 6 | **PC number boxes kept out-of-range values** on screen while the program quietly used the clamped number. | Low | The box snaps to the value the code uses. | "snaps back into range" |
| 7 | **A profile named `__proto__` never saved** and blanked the profile menu after a reload. | Low (data loss in an edge case) | Reserved names are refused; lookups use own keys only. | "cannot be named __proto__" |
| 8 | **C++ shelf S2's example ended on an unclosed `{`.** | Low (content) | Closed. | C++ examples now parse in the content check |
| 9 | **Minnesota Drive: the school-bus stop-arm fine was given as $300.** Minn. Stat. § 169.444 sets a fine of not less than $500; $300 is the older figure. | Medium (wrong fact in test prep) | Corrected. | — |
| 10 | **Minnesota Drive: a child-restraint question relied on the old "4 feet 9 inches" rule.** | Medium (outdated fact) | The question and the seat-belt field-guide text were rewritten to current law. | — |
| 11 | **Accessibility:** rooms had no landmarks, the music dock and track bar weren't labeled, and the PC's "Type along" label had 1.7:1 contrast. | Medium | Each room is a `main` landmark, the dock and bar are labeled regions, the footer is `contentinfo`, and the label is now 7:1. | `a11y.test.js`: no serious or critical axe findings in eight rooms, light and dark |
| 12 | **Tracks were hard-wired as paired flags** (`__isCS` / `__isDrive`) in about 60 places, so a fourth track was impractical. | Structural | A track registry (`js/tracks.js`) and a grouped, searchable track picker. Original storage keys were kept, so saved progress still loads. | "track picker" tests; progress-survives test |
| 13 | **The PC could only deal a random project**, so a learner couldn't go back to one they liked. | Low (usability) | A labeled project list, kept in step with Surprise me (`2be5e3d`). | "every project can be chosen by name" |

## Content verification (current)

Run `npm run test:content` to reproduce these numbers.

| Track | Practice programs vs. real output | Drill + Vault lines parse | Library examples |
| --- | --- | --- | --- |
| C++ | 75/75 | 10,030/10,030 | 54/54 (24 of 25 chapter/shelf examples are fragments, so they're parsed rather than run) |
| C# | 36/36 | 10,030/10,030 | 34/34 |
| Python | 54/54 | 10,030/10,030 | 45/45 |
| JavaScript | 54/54 | 10,030/10,030 | 45/45 |
| TypeScript | 51/51 (strict type-check) | 10,030/10,030 | 45/45 |
| Java | 54/54 | 10,030/10,030 | 45/45 |
| Go | 54/54 (gofmt + go vet) | 10,030/10,030 | 45/45 |
| Rust | 54/54 (rustfmt + clippy, warnings are errors) | 10,030/10,030 | 45/45 |
| C | 54/54 (clang-format, warnings are errors, ASan + UBSan) | 10,030/10,030 | 45/45 |
| SQL | 54/54 (sqlite3) | 10,030/10,030 (compiled against a schema) | 45/45 |
| Unity | 36/36 (engine stand-in) | 10,030/10,030 | 47/47 |
| Unreal | 36/36 (engine stand-in) | 10,030/10,030 | 47/47 |

With 10–40 extra random settings per project, every track above still matches.

The stricter checks found real problems in new content before it shipped. All were fixed:

- a TypeScript example that narrowed a variable to `never`;
- Rust and Go formatting and lint issues;
- an undefined-behavior bug (`stack[--top], top` in one call) in a C draft;
- a SQL example whose output depended on how ties were ordered.

## Open items

These are known and not yet done. They need the owner's decision, or more work than this pass covered.

1. **Driving content needs a full fact review.** Only the two items above were checked against current Minnesota law. The whole Drive track should be reviewed against the current *Minnesota Driver's Manual* before it's promoted as test prep. One specific item: a secondary source reports that Laws 2026, ch. 41 amended § 169.444, subd. 1 (effective March 28, 2026) so that the duty to stop no longer depends on the stop arm being *fully extended*; the $500 minimum fine is unchanged. The revisor's site couldn't be reached from the build environment, so confirm this there. If it's confirmed, reword the School Bus block to say you stop for flashing red lights, whether or not the arm is all the way out.
2. **Editorial review of the original C++ and C# text.** Their code is now compile- and parse-checked, but the explanations (including a 309-term C++ glossary) haven't had a line-by-line accuracy review.
3. **Licensing.** No license has been chosen, so the code and content are currently all rights reserved. See [LICENSING.md](LICENSING.md).
4. **Donations.** Not set up. This needs the owner's accounts (for example GitHub Sponsors, Open Collective or Ko-fi). No payment links exist on the site.
5. **Hosting.** The site is ready for GitHub Pages or any static host (see the README), but it hasn't been published from this repository yet.
6. **Third-party CDNs.** three.js (r128, 2021) and pdf.js load from cdnjs, and the fonts from Google Fonts. The app works without them, but self-hosting them would remove the dependency and the font requests to Google.
7. **Progress lives in one browser.** There is no sync between devices. That's by design for privacy, but worth stating on the site.
8. **More tracks.** Planned next: PHP, Ruby, Kotlin, Lua, Bash, HTML & CSS (needs a live-preview PC) and Swift.
