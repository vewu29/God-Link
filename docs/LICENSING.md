# Licensing: Recommendations

**Status: no license has been chosen yet.** Until a license file is added, all code and content in this repository are all rights reserved by the author. Others may view the code on GitHub, but they may not copy, modify or host it. The decision belongs to the project owner. This page lays out the options. It is general information, not legal advice.

## What the project needs

The [project brief](PROJECT_BRIEF.md) asks for:

- free core learning, funded by voluntary donations;
- open-source software, with community contributions;
- reusable educational content;
- permission for others to host independent copies.

Code and educational writing are usually licensed separately, because software licenses fit prose poorly.

## Recommended combination

| Part | Recommended license | Why |
| --- | --- | --- |
| Code (`index.html`, `css/`, `js/`, `tools/`, `tests/`) | **MIT** | Short, widely understood, and lets anyone host, fork or reuse the app. This is what most contributors expect. |
| Learning content (`tracks/*.js`: drills, chapters, examples, glossaries, quizzes) | **CC BY-SA 4.0** | Anyone may share and adapt the lessons, even commercially, as long as they credit Code Block and share their changes under the same license. That keeps improved versions of the lessons open. |

To adopt it:

1. Add a `LICENSE` file with the MIT text.
2. Add a `LICENSE-CONTENT` file that names CC BY-SA 4.0 and links to <https://creativecommons.org/licenses/by-sa/4.0/>.
3. Add one line to the README saying which applies to what.
4. Optionally, add a credit line to the site footer.

## Alternatives, and what they change

- **CC BY 4.0 for content** (instead of BY-SA): maximally reusable. Teachers and companies could adapt the lessons without sharing their changes back. Pick this if spreading the material matters more than keeping derivatives open.
- **Apache-2.0 for code** (instead of MIT): like MIT, plus an explicit patent grant and a NOTICE-file convention. A little heavier, and common in larger projects.
- **AGPL-3.0 for code**: anyone who hosts a modified copy must publish their changes. It protects the project from closed commercial forks, but some contributors and institutions avoid it.
- **CC BY-NC (non-commercial)**: tempting, but it isn't an open license. It blocks schools that charge fees, and anyone selling printed copies, and it makes "commercial" a gray area. It conflicts with the brief's "reusable" goal.

## Things to know before choosing

- **Contributions.** Once a license exists, contributions are accepted under it ("inbound = outbound"). Add a sentence saying so to CONTRIBUTING.md.
- **AI-assisted content.** The original app was generated with Meta's Muse, and the newer tracks were written with Claude. In the United States, purely AI-generated material may not be protected by copyright on its own, but human selection, arrangement and editing can be. A license still matters: it states clearly what others may do. If certainty matters, for example before accepting grants or selling anything, ask a lawyer.
- **The two inspiration books.** The brief notes the original design was inspired by two books. Keep all wording, examples and structure the project's own. Don't paste text, exercises or diagrams from them.
- **Trademarks.** Java (Oracle), Go (Google), Rust (Rust Foundation), Unity (Unity Technologies), Unreal Engine (Epic Games), Python (PSF) and others are trademarks. Using the names to describe what is taught is normal; avoid logos and anything implying endorsement. Each track's sources line already says Code Block isn't affiliated.

## Third-party software and fonts the site uses

| Component | Version | License | How it's used |
| --- | --- | --- | --- |
| three.js | r128 | MIT | 3D background world, loaded from cdnjs |
| pdf.js | 3.11.174 | Apache-2.0 | "My Book" PDF reader, loaded from cdnjs when used |
| Newsreader, Sora, JetBrains Mono | — | SIL Open Font License 1.1 | Fonts, loaded from Google Fonts |

The development tools (Playwright, axe-core, acorn, TypeScript, tree-sitter, syn and others) are used only for testing and are not shipped with the site. Their licenses are recorded in `package-lock.json` and `tests/content/rsparse/Cargo.lock`.
