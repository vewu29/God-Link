# English++ Syntax Manual

> **This manual describes English++ Classic.** The language now has a new
> structure, with three words on every line (`.epp` files): its whole definition
> is [ENGLISHPP_CHART.md](ENGLISHPP_CHART.md). Classic programs still work exactly
> as this manual says.

**Version 2.** Part One (Sections 1–30) is version 1, unchanged. Part Two (Sections 31–46) is English++ 2.

**The complete language reference. This manual is both the rule book the compiler is built from and the book you learn the language from.**

## How to read this manual

Every rule in this book is shown the same way: first the English++ line, then the exact C++ line it becomes. Nothing is left to guesswork. If you can read the English++ line out loud and understand it, you understand the program.

A few words used in this manual, in plain words:

- **A statement** is one instruction. One thing to do. `show hello` is a statement.
- **A compiler** is a program that reads English++ and writes out C++.
- **An argument** is a value you hand to an instruction. In `move walker by 1, 0, 0`, the numbers `1, 0, 0` are the arguments.
- **A verb** is a doing word, like `move` or `show`.
- **A noun** is a thing word. In version 1, the only thing word is `box`.
- **A literal** is a value written out directly, like `5`, `2.5`, `"ding"`, or `true`.

Note: English++ compiles directly to real C++ source, one line of English++ to fixed C++ by fixed rules. That is the ruling in Section 8 of the project brief, and it governs this manual.

**Frozen:** The English++ syntax documented in this manual is frozen — its meaning, spelling, and behavior will never change. Future work is additive only: new verbs and constructs may be added alongside the old ones, never replacing or changing them.

---

## 1. The idea, in plain words

C++ is powerful, but a long C++ program is hard to read unless you have written C++ for years. English++ exists to be the opposite.

**The readability bar: if a 7-year-old cannot look at a few hundred lines of English++ and follow what is happening, the language has failed its job — even if it compiles correctly.**

That bar governs everything in this manual:

- Words are ordinary English words, not code symbols.
- There are no curly braces `{ }`, no semicolons `;`, and no equals signs `=` in English++.
- Each line says one thing, in the order it happens.
- The same words always mean the same thing. There is no guessing from one line to the next.

If a rule in this manual ever seems clever but hard to read, the readable version wins.

---

## 2. What a program looks like

An English++ program is a list of lines. The program runs from the top line to the bottom line, in order.

Rules:

- One statement per line is the normal way to write. You may also put several statements on one line, joined by commas (see Section 8).
- Blank lines are fine. They change nothing. Use them to group your thoughts.
- Order matters. You must make a thing before you use its name. Using a name before it is made is an error.
- Capital letters do not matter for the language's own words. `Make a box` means the same as `make a box`. But names keep their exact spelling: `myBox` and `Mybox` are two different names, so pick one spelling and stick to it.
- English++ lines do not end with semicolons. A stray semicolon is an error, so the compiler can tell English++ apart from C++.

A small program:

```englishpp
note A tiny program.
make a box called hero
show hero
```

That is the whole shape. The rest of this manual fills in each kind of line.

---

## 3. Comments: lines that start with `note`

A line that starts with the word `note` is a comment. It is a message for the human reader. The computer ignores it, except that it is kept as a C++ comment.

English++:

```englishpp
note This box is the hero.
```

Exact C++ translation:

```cpp
// This box is the hero.
```

Rules:

- `note` must be the first word on the line. A `note` in the middle of a line is not a comment.
- Everything after `note` on that line becomes the comment text.
- A `note` line on its own, with nothing after it, becomes an empty C++ comment: `//`.
- `note` lines never change what the program does, and they never count as statements. In particular, a `note` line or a blank line between an `if` line and its `otherwise` line does not break the pair (see Section 11).

---

## 4. Names and kinds of things

### Kinds (types)

A **kind** is what sort of thing you are making. In version 1, there is exactly one kind:

| English++ word | C++ kind | What it is |
|---|---|---|
| `box` | `Box` | A box in the show. |

That is all of version 1. Writing any other kind word, like `make a dragon`, is an error. New kinds arrive later by adding rows to a table, never by guessing (see Section 17 for how new words are added).

Notes on kinds:

- The English++ word is lower case (`box`). The C++ kind starts with a capital letter (`Box`).
- `boxes` is not a kind word for making things. `boxes` is the name of the collection of all boxes (see Section 12). Do not write `make a boxes`.

### Names

A **name** is the word you call one particular thing, so you can talk about it later.

Rules for names:

- A name starts with a letter. After that, it may contain letters, numbers, and underscores: `hero`, `box1`, `red_box`.
- A name is one word. It has no spaces. `my box` is not a name; `myBox` is.
- A name must be made before it is used.
- Do not reuse a name for a second thing. Each name points to one thing.

### `a` and `an`

`a` and `an` mean exactly the same thing in English++. Use whichever reads better. The compiler does not check which one you picked.

```englishpp
make a box called hero
make an box called hero2
```

Both lines are correct, and both make a box.

---

## 5. Making things

There are three ways to make a box. They look alike, but they become different C++.

### 5.1 Making a named box

English++:

```englishpp
make a box called myBox
```

Exact C++ translation:

```cpp
Box myBox;
```

The words `make`, `create`, and `spawn` mean exactly the same thing here (see Section 9). So these three lines all become `Box myBox;`:

```englishpp
make a box called myBox
create a box called myBox
spawn a box called myBox
```

The word `called` introduces the name. The name is the last word on the line.

### 5.2 Making a box without a name (bare creation)

If you make a box at the top level of a program and do not give it a name, the compiler gives it one for you: `box1`, `box2`, `box3`, and so on, in the order the nameless boxes appear.

English++:

```englishpp
make a box
make a box
make a box
```

Exact C++ translation:

```cpp
Box box1;
Box box2;
Box box3;
```

Rules for automatic names:

- Only nameless boxes get counted. Named boxes do not use up a number. So `make a box called hero` followed by `make a box` gives `Box hero;` and then `Box box1;` — not `box2`.
- Counting starts at `box1` for each kind, and goes up by one each time, in program order.
- After a nameless box is made, `it` points to it (see Section 9 on pronouns), so you can still talk about the box you just made.

### 5.3 Making a box inside a loop

A box made as the body of a loop is different. A loop runs many times, so one declaration would not make sense — the box would have to be declared again on every pass. Instead, a creation inside a loop becomes a spawn call that runs once per pass.

English++:

```englishpp
repeat 5 times: make a box
```

Exact C++ translation:

```cpp
for (int i = 0; i < 5; ++i) { SpawnBox(); }
```

The same rule holds for a `for each` loop body: a creation there also becomes `SpawnBox();`.

Rules:

- A loop-body creation never gets a name and never uses up a bare-creation number. `SpawnBox()` makes the box and adds it to the `boxes` collection, but there is no name to talk about afterwards. To do something to those boxes, use a `for each` loop over `boxes` (see Section 12 and worked program 3).
- A creation inside a loop may not carry a `called` name. `repeat 5 times: make a box called hero` is an error, because the name `hero` would be declared five times. Make the box outside the loop if it needs a name.

### 5.4 Making several boxes at once (plural making)

The pattern is:

```englishpp
make <n> boxes
```

The count `<n>` is a whole-number literal. The boxes are nameless, like loop-body creations: they join the `boxes` collection, they do not use up a bare-creation number, and they do not change `it`.

English++:

```englishpp
make 3 boxes
```

Exact C++ translation:

```cpp
for (int i = 0; i < 3; ++i) { SpawnBox(); }
```

`create` and `spawn` mean the same thing here, as always. `make 3 boxes called hero` is an error: boxes made together cannot share one name. `make 3.5 boxes` is an error: the count must be a whole number. Only boxes can be made this way; class instances are still made one at a time.

### 5.5 Spelling words with boxes (text formations)

The pattern is:

```englishpp
make boxes spell "<text>"
```

Each letter of the quoted text becomes boxes arranged in a 5-by-7 grid, like letters on a scoreboard. The boxes are real boxes: they join the world, they join the `boxes` collection, and they count for `the count of boxes`. The text must be quoted in version 1; an unquoted word is an error.

English++:

```englishpp
make boxes spell "HI"
```

Exact C++ translation:

```cpp
SpawnTextFormation("HI");
```

Layout rules, fixed:

- Letters are 5 columns wide and 7 rows tall. The first letter's bottom-left corner sits at position (0, 0.5, 0); letters run along +X and rows run up +Y.
- Each lit cell of a letter is one box, size 0.55, spaced 1.4 box-widths apart, in gold (255, 200, 60).
- Letters are case-insensitive: `"hi"` spells the same as `"HI"`.
- Characters with no letter in the table (A–Z, 0–9, space, and `., '!? -`) are skipped entirely: no box, and no space taken. An empty string spawns nothing.
- The count of boxes a word makes is the count of its lit cells. `"HI"` makes 28 boxes: H has 17 lit cells and I has 11.

`create boxes spell "..."` and `spawn boxes spell "..."` mean the same thing.

---

## 6. Storing values: `let` and `set`

### 6.1 `let`: give a value a name for the first time

English++:

```englishpp
let speed be 5
```

Exact C++ translation:

```cpp
auto speed = 5;
```

Rules:

- `let` takes a literal value or a calculation: a number, a decimal, quoted text, or `true`/`false` (see Section 16 for what kind of value each literal becomes; see Section 30 for calculations).
- `let` does not take a bare name. `let speed be fast` is an error — use `set` for a name. Calculations like `let speed be 5 + 1` are version 1 (see Section 30).
- A `let` name is not an object, so it does not change what `it` points to (see Section 9).

More examples:

```englishpp
let speed be 5
let height be 2.5
let greeting be "hello"
let ready be true
```

Exact C++ translation:

```cpp
auto speed = 5;
auto height = 2.5;
auto greeting = "hello";
auto ready = true;
```

### 6.2 `set`: change a value that already has a name

English++:

```englishpp
set speed to 10
```

Exact C++ translation:

```cpp
speed = 10;
```

Rules:

- The name must already exist (made by `let` or by an earlier line).
- The new value is a literal, a name, or a calculation (see Section 30).
- `set` does not change what `it` points to.

---

## 7. Doing things: actions and the verb dictionary

An action is a verb, a target, and sometimes arguments. The pattern is:

```englishpp
<verb> <target> by|to|with <arguments>
```

The words `by`, `to`, and `with` all mean the same thing here: "here come the arguments." Pick the one that reads best. The compiler does not treat them differently.

### 7.1 The verb dictionary (the authoritative table)

This table is the whole action language of version 1. Every verb, what it becomes, and what arguments it takes. New verbs are added as new rows in this table, never by guessing what a word might mean on one particular line (see Section 17).

| English++ | C++ it becomes | Arguments | Example |
|---|---|---|---|
| `move <target> by <x>, <y>, <z>` | `<target>.Move(<x>, <y>, <z>);` | Exactly 3 numbers or names | `move hero by 1, 0, 0` |
| `spin <target> by <n>` | `<target>.Spin(<n>);` | Exactly 1 number or name | `spin hero by 90` |
| `grow <target> by <n>` | `<target>.Grow(<n>);` | Exactly 1 number or name | `grow hero by 2` |
| `shrink <target> by <n>` | `<target>.Shrink(<n>);` | Exactly 1 number or name | `shrink hero by 2` |
| `show <target>` | `<target>.Show();` | None | `show hero` |
| `hide <target>` | `<target>.Hide();` | None | `hide hero` |
| `destroy <target>` | `Destroy(<target>);` | None, and no `by`/`to`/`with` | `destroy hero` |
| `paint <target> <colour>` | `<target>.Paint(Color{<r>, <g>, <b>, 255});` | Exactly 1 colour word (see Section 7.5) | `paint hero red` |
| `say <text>` | `Say(<text>);` | 1 printable value (see Section 7.6) | `say "hello"` |
| `make the camera follow <target>` | `FollowCamera(<target>);` | Exactly 1 box | `make the camera follow hero` |
| `make the camera stop following` | `StopFollowingCamera();` | None | `make the camera stop following` |
| `write <text> to "<path>"` | `WriteTextFile("<path>", <text>);` | 1 printable value + 1 quoted path | `write "hi" to "note.txt"` |
| `read "<path>" into <name>` | `<name> = ReadTextFile("<path>");` | 1 quoted path + 1 existing text name | `read "note.txt" into msg` |
| `play sound "<text>"` | `PlaySound("<text>");` | Exactly 1 quoted text | `play sound "ding"` |
| `wait <n> seconds` | `co_await WaitSeconds(<n>f);` | Exactly 1 number (see Section 14) | `wait 3 seconds` |

Notes on the table:

- `move`, `spin`, `grow`, `shrink`, `show`, and `hide` become methods on the target: the target's name, a dot, and the action word with a capital first letter.
- `destroy` and `play sound` become free functions: the target or the quoted text goes inside the parentheses. `destroy` never takes `by`/`to`/`with`.
- `play sound` is a two-word verb phrase. `play` on its own is not a verb in version 1.
- `wait` has no target. It is explained in full in Section 14.
- `make`, `create`, and `spawn` are not in this table because they are declaration words, not action verbs. They are covered in Section 5.

### 7.2 Each action, with its exact translation

Move:

```englishpp
move myBox by 3, 0, 0
```

```cpp
myBox.Move(3, 0, 0);
```

Spin, grow, shrink:

```englishpp
spin myBox by 90
grow myBox by 2
shrink myBox by 2
```

```cpp
myBox.Spin(90);
myBox.Grow(2);
myBox.Shrink(2);
```

Show, hide:

```englishpp
show myBox
hide myBox
```

```cpp
myBox.Show();
myBox.Hide();
```

Destroy:

```englishpp
destroy myBox
```

```cpp
Destroy(myBox);
```

Do not use a destroyed box again. Once it is destroyed, any later use of its name in the same scope is a plain-English compile error, for example `Line 4: 'hero' was destroyed, so it can't be used again. Make a new box with a different name if you need one.` Using a destroyed name a second time with `destroy` errors the same way, because the name is resolved before the action. Re-making the same name is still a redefinition error, as before. One gap, honestly stated: destroying a box by position (`destroy pack at 0`) does not mark that position as destroyed, so the position can still be named afterwards — positions are not tracked names.

Play sound:

```englishpp
play sound "ding"
```

```cpp
PlaySound("ding");
```

The sound argument must be quoted text in version 1. `play sound ding` without quotes is an error.

### 7.5 Painting a box: `paint`

The pattern is:

```englishpp
paint <target> <colour>
```

There is no introducer word: the colour follows the target directly. The colour must be one of the fixed table below, and it becomes the box's colour at full strength (alpha 255). A colour word the table does not know is an error that lists the colours.

| English++ | RGB |
|---|---|
| `red` | 255, 0, 0 |
| `blue` | 0, 0, 255 |
| `green` | 0, 200, 0 |
| `gold` | 255, 200, 0 |
| `purple` | 160, 0, 255 |
| `white` | 255, 255, 255 |
| `black` | 0, 0, 0 |
| `pink` | 255, 150, 200 |
| `orange` | 255, 140, 0 |
| `cyan` | 0, 255, 255 |

Example:

```englishpp
paint hero red
```

```cpp
hero.Paint(Color{255, 0, 0, 255});
```

`paint` works on boxes only: painting a class instance is the same kind-tracked error as the other box verbs (`paint works on boxes. rex is a Dog, not a box.`). A variable cannot be a colour in version 1; the colour word must be written out.

### 7.6 Saying something on screen: `say`

The pattern is:

```englishpp
say <text>
```

The runtime draws the text in a panel under the "English++" title, every frame, until another `say` replaces it. An empty string clears the panel. `say` prints to the screen only, never to the console (for the console, use `print`, Section 28).

Example:

```englishpp
say "hello"
say msg
say msg and "!"
say 5
```

```cpp
Say("hello");
Say(msg);
Say((msg + std::string("!")));
Say(5);
```

The argument is any printable value: a quoted string, a text variable, a number, decimal, letter, or yes-or-no value. A text variable joined with `and` and more text becomes a `+` join in the C++ (`say msg and "!"` above). Joining only works from a text variable: `say "score:" and 5` is an error, because after a quoted literal the compiler does not treat `and` as a join — put the words in a text variable first, then join. Saying a box or a class instance is an error, as is saying a whole collection. Numbers print with `%g` formatting, and yes-or-no prints as `true` or `false`.

### 7.7 Moving the camera: `make the camera follow` / `make the camera stop following`

The pattern is:

```englishpp
make the camera follow <target>
make the camera stop following
```

`create` and `spawn` mean the same thing here. The target must be a box (or `it` meaning one); following a class instance is the same kind-tracked error as the other box verbs. The target is a name, not a position: `make the camera follow pack at 0` is not a form.

Example:

```englishpp
make a box called hero
make the camera follow hero
```

```cpp
Box hero;
FollowCamera(hero);
```

Rules, fixed:

- While following, the camera keeps its initial offset from the target — the camera sits 9 right, 10 up, and 12 forward of the box — and moves with the box every frame.
- Stopping freezes the camera where it is. It does not snap back to the start.
- If the followed box is destroyed, following stops and the camera stays where it is.
- Any other camera wording is an error that lists the two forms: `make the camera dance` answers `make the camera follow <box> or make the camera stop following`.

### 7.8 Writing and reading text files: `write` / `read`

The pattern is:

```englishpp
write <text> to "<path>"
read "<path>" into <name>
```

The path must be quoted, and paths use forward slashes: backslashes inside a quoted string reach the C++ unchanged, where they would be read as escapes. `read` fills an EXISTING text variable — make it first with `make a text called msg`, then read into it. Reading into an unknown name errors with "make a text called … first", and reading into a non-text kind errors with its kind.

Example:

```englishpp
make a text called msg
write "hello" to "note.txt"
read "note.txt" into msg
print msg
```

```cpp
std::string msg;
WriteTextFile("note.txt", "hello");
msg = ReadTextFile("note.txt");
std::cout << msg << std::endl;
```

Rules:

- `write` takes any printable value, like `say` (Section 7.6): text, numbers, decimals, letters, yes-or-no values.
- `write` replaces the whole file. It does not append.
- `read` reads the whole file as text. If the file cannot be opened, `read` gives an empty string and prints a warning to the console — it is not a compile error, because the file may not exist yet when the program is compiled.
- File paths are relative to the folder the program runs from.

### 7.9 Sizes as words: `tiny`, `small`, `normal`, `big`, `huge`

In version 1, size words work in exactly one place: the amount of `grow` and `shrink`. They are checked before the argument is read as a name, so a size word there is always a size — unless a thing with that exact name already exists, in which case the name wins and the word is not a size (old programs with a variable called `big` keep working).

| English++ | Number |
|---|---|
| `tiny` | 0.5 |
| `small` | 0.75 |
| `normal` | 1.0 |
| `big` | 1.5 |
| `huge` | 2.0 |

Example:

```englishpp
grow hero by big
shrink hero by tiny
```

```cpp
hero.Grow(1.5);
hero.Shrink(0.5);
```

Size words do NOT work anywhere else in version 1: not in `move` distances, not in `spin` degrees, not in `make` sizes. `move hero by big` is an error, because `move` takes numbers or names, and `big` on its own is neither a number nor (without a variable of that name) a name. The grammar's size slots are the `grow`/`shrink` amounts only.

### 7.3 What arguments can be

An argument is one of:

- A number: `3`, `-1`, `2.5`. Negative numbers are fine.
- A name made earlier: `speed`, `hero`.
- Quoted text, for `play sound` only in version 1: `"ding"`.
- A colour word, for `paint` only (Section 7.5): `red`, `blue`, and the rest of the fixed table.
- A size word, for `grow` and `shrink` amounts only (Section 7.9): `tiny`, `small`, `normal`, `big`, `huge`.
- A printable value, for `say` and `write` (Sections 7.6, 7.8): a quoted string, a text variable, a number, decimal, letter, or yes-or-no value.
- A quoted path, for `read` and `write` (Section 7.8): `"note.txt"`.

Arguments are separated by commas. There are no unit words in version 1: write `spin hero by 90`, not `spin hero by 90 degrees`. A trailing unit word is an error.

### 7.4 Argument counts are fixed, and that is what makes commas work

Each verb knows exactly how many arguments it takes. That fixed count is what lets the compiler tell where one statement ends and the next begins on a comma-joined line (see Section 8). If a verb gets too few or too many arguments, that is an error, and the error message says how many the verb needs (see Section 18).

---

## 8. Doing one thing, then the next: commas and new lines

Commas and new lines both mean the same thing: "do this, then do this."

New lines:

```englishpp
make a box called hero
show hero
move hero by 1, 0, 0
```

Commas on one line:

```englishpp
make a box called hero, show hero, move hero by 1, 0, 0
```

Both programs become exactly the same C++:

```cpp
Box hero;
hero.Show();
hero.Move(1, 0, 0);
```

How the compiler reads a comma line: it reads one statement, and because each verb takes a fixed number of arguments (Section 7.4), it knows exactly where that statement's arguments end. The next comma then starts a new statement. So in `move hero by 1, 0, 0, hide hero`, the `move` takes its three numbers, and `hide hero` is the next statement — not a fourth argument.

You may mix commas and new lines freely. A comma at the end of a line, with nothing after it, is an error: a comma promises another statement, and one must follow.

---

## 9. Saying `it` and `them`: pronoun rules (fixed)

Pronouns are shortcuts. They always resolve to a concrete name before any C++ is written. The generated C++ never contains the words `it` or `them`.

### `it`: the most recently declared single object

`it` means the single object declared most recently, counting only declarations:

- A named declaration: `make a box called hero` makes `it` mean `hero`.
- A nameless declaration: `make a box` makes `it` mean the automatic name just created, `box1`, `box2`, and so on.
- `let` and `set` do not change `it`. They store values, they do not declare objects.
- Actions do not change `it`. Moving a box does not make it "the most recent."
- A loop-body creation (`SpawnBox()`) does not change `it`, because it creates no name.
- Inside a `for each` loop body, `it` means the loop's current item. After the loop ends, `it` goes back to whatever it meant before the loop.

Example:

```englishpp
make a box called hero
move it by 1, 0, 0
```

Exact C++ translation:

```cpp
Box hero;
hero.Move(1, 0, 0);
```

Example with a nameless box:

```englishpp
make a box
show it
```

Exact C++ translation:

```cpp
Box box1;
box1.Show();
```

Example inside a loop:

```englishpp
for each box in boxes: move it by 0, 1, 0
```

Exact C++ translation:

```cpp
for (auto& box : boxes) { box.Move(0, 1, 0); }
```

Here `it` inside the loop means the loop item, `box`, on each pass.

If `it` is used before any object has been declared, that is an error. The compiler cannot guess what you mean, and it will not guess.

### `them`: the most recently named plural collection in scope

`them` means a group, not one thing. In version 1, a group is named by the header of a `for each` loop: in `for each box in boxes`, the collection named is `boxes`, so `them` means `boxes` from that point on, while that loop's scope lasts.

In version 1, `them` is only used where a collection is expected — that is, as the collection in a `for each` header:

```englishpp
for each box in boxes: show box
for each other in them: hide other
```

Exact C++ translation:

```cpp
for (auto& box : boxes) { box.Show(); }
for (auto& other : boxes) { other.Hide(); }
```

Rules:

- Using `them` as a single target is an error: `hide them` is wrong, because `them` is a group and `hide` takes one thing. To act on every member of a group, use a `for each` loop over it.
- If no group has been named yet, using `them` is an error (see Section 18 for the message).
- You can always name the collection directly instead of saying `them`. `for each box in boxes` works whether or not `them` exists. Direct names are clearer; pronouns are a shortcut, not a requirement.

### Pronouns resolve where they appear

A pronoun means whatever it pointed to on the line where it is written, looking only at lines before it. Later lines cannot change what an earlier pronoun meant.

---

## 10. Same words, same meaning: synonyms (fixed)

`make`, `create`, and `spawn` are identical in every form. They are never guessed per occurrence. Whichever word you write, the compiler does the same thing:

- As a declaration with `called`: `Box <name>;`
- As a bare creation at the top level: `Box box<n>;`
- As a loop body: `SpawnBox();`

The same holds for `by`, `to`, and `with` before arguments (Section 7), for `a` and `an` (Section 4), and for `second` and `seconds` (Section 14). When this manual says two words are the same, they are the same everywhere, every time. That is what keeps the compiler deterministic: the same English++ program always produces the same C++.

---

## 11. Choices: `if` and `otherwise`

### `if`: do something only when a comparison is true

The pattern is:

```englishpp
if <a> <comparator> <b>, <statement>
```

The comma after the comparison separates the question from the thing to do. The statement after the comma is a single statement: an action, a `set`, a `destroy`, a `play sound`, a `wait` — or another control line (see Section 12.5 on nesting).

Example:

```englishpp
make a box called player
let health be 10
set health to 0
if health is less than 1, destroy player
```

Exact C++ translation (showing only the `if` line's translation, plus the lines around it for context):

```cpp
Box player;
auto health = 10;
health = 0;
if (health < 1) { Destroy(player); }
```

The comparison sides `<a>` and `<b>` are each a name, a literal, or a calculation (see Section 30).

### Comparator table

| English++ | C++ | Example |
|---|---|---|
| `is` | `==` | `if health is 0, hide player` |
| `is not` | `!=` | `if health is not 0, show player` |
| `is less than` | `<` | `if health is less than 1, destroy player` |
| `is more than` | `>` | `if score is more than 10, play sound "win"` |
| `is less than or equal to` | `<=` | `if health is less than or equal to 0, hide player` |
| `is more than or equal to` | `>=` | `if score is more than or equal to 10, play sound "win"` |

Each comparator becomes exactly the C++ shown:

```englishpp
if score is more than 10, play sound "win"
```

```cpp
if (score > 10) { PlaySound("win"); }
```

### `otherwise`: the else branch

`otherwise` gives the "if not" case. It must directly follow an `if` line: it is the very next statement after the `if`. Blank lines and `note` lines in between do not break the pair, but any other statement does. An `otherwise` with no `if` directly before it is an error.

The pattern is:

```englishpp
otherwise, <statement>
```

The comma after `otherwise` is required, just as after an `if` comparison. The statement after it follows the same single-simple-statement rule as an `if` body.

Example:

```englishpp
make a box called player
let health be 10
if health is less than 1, destroy player
otherwise, show player
```

Exact C++ translation:

```cpp
Box player;
auto health = 10;
if (health < 1) { Destroy(player); }
else { player.Show(); }
```

There is no "otherwise if" chain in version 1. One `if`, at most one `otherwise`, and then the choice is over. For a longer chain of choices, write separate `if` lines, or use `code:` (Section 15).

### Otherwise-if chains

A chain tests one condition after another, in order, and runs the first body whose condition is true. There are two spellings, and they are NOT the same — the comma decides which one you get.

**Same-line chain.** After an `if` body, a comma and `otherwise if` keeps the chain going on the same line. A final `, otherwise, <body>` closes the chain. While a chain is still open, an `otherwise` on a following line attaches to it; once the chain is closed by a final `otherwise`, a following `otherwise` errors, because there is no open `if` left.

```englishpp
if score is more than 10, play sound "win", otherwise if score is more than 5, play sound "good", otherwise, play sound "try"
```

Exact C++ translation:

```cpp
if (score > 10) { PlaySound("win"); } else if (score > 5) { PlaySound("good"); } else { PlaySound("try"); }
```

**Cross-line chain.** An `otherwise if` line with NO comma after `otherwise` also continues the chain, and it can follow an `if` line directly:

```englishpp
if score is more than 10, play sound "win"
otherwise if score is more than 5, play sound "good"
otherwise, play sound "try"
```

Exact C++ translation:

```cpp
if (score > 10) { PlaySound("win"); }
else if (score > 5) { PlaySound("good"); }
else { PlaySound("try"); }
```

**The comma form is different.** `otherwise, if ...` — WITH a comma after `otherwise` — is the old shape: an `else` branch whose body happens to be an `if`. It does not extend the chain; it closes it, and the inner `if` is a fresh choice inside the `else`.

```englishpp
if score is more than 10, play sound "win"
otherwise, if score is more than 5, play sound "good"
```

Exact C++ translation:

```cpp
if (score > 10) { PlaySound("win"); }
else { if (score > 5) { PlaySound("good"); } }
```

Rules:

- A chain link needs its comma in the same-line form (`otherwise if score is more than 5, ...` — the comma after the condition is required, as for any `if`).
- A cross-line `otherwise if` needs NO comma after `otherwise` and a comparison after it. `otherwise if` with no comparison is an error, and `otherwise if` after a closed chain is the "needs an if" error.
- Each link's body is a single statement, like any `if` body, and bodies may nest (Section 12.5).

---

## 12. Doing things again: loops

A loop body is a single statement, the same rule as an `if` body (Section 11). That statement may itself be a control line: loops, `if` lines, and event lines nest (Section 12.5).

### `repeat`: do something a counted number of times

The pattern is:

```englishpp
repeat <n> times: <statement>
```

The colon after `times` is required. It separates the count from the thing to do. The count is a whole-number literal, or a calculation (Section 12.4): `repeat 2 + 1 times` runs three times. A literal count keeps its exact old form; a calculated count is checked on every pass, so if the count's names change during the loop, the number of passes changes with them.

Example:

```englishpp
repeat 5 times: make a box
```

Exact C++ translation:

```cpp
for (int i = 0; i < 5; ++i) { SpawnBox(); }
```

Example with an action body:

```englishpp
make a box called hero
repeat 3 times: move hero by 1, 0, 0
```

Exact C++ translation:

```cpp
Box hero;
for (int i = 0; i < 3; ++i) { hero.Move(1, 0, 0); }
```

Note the loop variable in the generated C++ is always `i`. Nested loops each get their own `i`, and the inner one shadows the outer one while it runs — that is legal C++, and each loop still counts its own passes correctly (see Section 12.5). One gotcha, honestly stated: do not name your own variable `i` and use it as a `repeat` count. `repeat i times` with a variable called `i` becomes `for (int i = 0; i < i; ++i)`, where the count reads the loop's own counter instead of your variable, so the loop runs zero times. Call the variable anything else and it works.

### `for each`: do something to every member of a collection

The pattern is:

```englishpp
for each <var> in <collection>: <statement>
```

The colon after the collection is required. The loop variable `<var>` is a name you choose for the current member, used inside the body. The collection is a name of a group.

Example:

```englishpp
for each box in boxes: move box by 0, 1, 0
```

Exact C++ translation:

```cpp
for (auto& box : boxes) { box.Move(0, 1, 0); }
```

### The `boxes` collection

The runtime provides a global collection called `boxes`. It holds every box made so far:

- Every named box joins `boxes` when it is made.
- Every nameless box joins `boxes` when it is made.
- Every box made by `SpawnBox()` inside a loop joins `boxes` when it is spawned.

So a `for each` loop over `boxes` only sees boxes that already exist at the moment the loop runs. Boxes made after the loop do not retroactively join that pass. This is why worked program 3 spawns first and loops second: the loop then finds all five spawned boxes.

Inside a `for each` body, the loop variable is the current member. `it` also means the current member there (Section 9), and `them` means the collection named in the header.

### 12.4 Repeat counts can be calculations

`repeat <expr> times` takes a full expression, not just a literal: a name, a calculation, or a call result. The count must be a whole number (a number, a `let` value, or a letter used as a number — the same rule as a position). A decimal count is an error, and a text count is an error. The count expression is written into the loop's condition, so it is checked on every pass.

```englishpp
repeat count + 1 times: move hero by 1, 0, 0
```

```cpp
for (int i = 0; i < (count + 1); ++i) { hero.Move(1, 0, 0); }
```

A bare literal keeps its exact old form (`repeat 5 times` is still `for (int i = 0; i < 5; ++i)`).

### 12.5 Nesting: control lines inside control lines

An `if`, `repeat`, `for each`, `when`, or `while` body may itself be a control line. The inner line is written exactly as it would be on its own, after the outer line's comma or colon.

```englishpp
repeat 2 times: if health is less than 1, hide hero
if health is less than 1, repeat 3 times: move hero by 1, 0, 0
```

```cpp
for (int i = 0; i < 2; ++i) { if (health < 1) { hero.Hide(); } }
if (health < 1) { for (int i = 0; i < 3; ++i) { hero.Move(1, 0, 0); } }
```

Rules, fixed:

- Names made inside an `if` or `when` body do not leak out. `if x is 1, make a box called hero` followed by `move hero by 1, 0, 0` errors, because `hero` only exists inside that branch. The same holds for `it`: inside a body, `it` may point at the body's own new box, but after the body it points back at whatever it pointed at before.
- A `for each` collection named inside a body still sets `them` persistently (as always), and bare-creation numbers are never reused, so names stay unique across branches.
- The same name may be made in both branches of an `if`: each branch is its own C++ scope, so `if x is 1, make a box called hero` and `otherwise, make a box called hero` are two different boxes that never meet.
- Loop depth is tracked through nesting: `break` and `continue` (Section 12.7) work from a loop body nested inside an `if` or `when` body, but not from an event body that has no loop of its own (Section 12.7).

### 12.6 `while`: loop while a comparison is true

The pattern is:

```englishpp
while <a> <comparator> <b>: <statement>
```

The colon after the comparison is required (not a comma — a `while` is a loop, and loops take colons). The comparators are the same six as `if` (Section 11). The body is a single statement, like any loop body, and it may itself be a control line.

```englishpp
while health is less than 10: set health to health + 1
```

```cpp
while (health < 10) { health = (health + 1); }
```

Warning, plainly stated: a `while` whose condition never changes and never waits freezes the program. `while health is less than 10: play sound "ding"` with nothing changing `health` loops forever, and the show never moves on. That is the programmer's responsibility, exactly as in any language — the compiler does not guess when you meant to stop.

### 12.7 Stopping early: `break` and `continue`

`break` leaves the nearest enclosing loop at once. `continue` skips the rest of the current pass and starts the next pass. Both are statements on their own, and both are valid only inside a loop body (`repeat`, `while`, or `for each`) — including a loop body nested inside an `if` or `when` body.

```englishpp
repeat 10 times: if health is less than 1, break
repeat 10 times: if health is 5, continue
```

```cpp
for (int i = 0; i < 10; ++i) { if (health < 1) { break; } }
for (int i = 0; i < 10; ++i) { if (health == 5) { continue; } }
```

Rules:

- Outside any loop, `break` and `continue` are plain-English errors.
- Inside an event body with no loop of its own, they are errors too — even if the event line itself sits inside a loop. An event body runs later, when the event fires, not while the loop runs, so there is no loop to break out of. To break from inside an event, put a loop inside the event body itself (`when hero touches coin, repeat 3 times: break` breaks that inner loop, which is allowed).

---

## 13. When things happen: events

An event line says: when two things touch, do something. The pattern is:

```englishpp
when <a> touches <b>, <statement>
```

The comma after the second name separates the event from the thing to do. The statement after the comma is a single simple statement, the same rule as an `if` body.

Example:

```englishpp
make a box called player
make a box called coin
when player touches coin, play sound "ding"
```

Exact C++ translation:

```cpp
Box player;
Box coin;
RegisterOnTouch(player, coin, [](){ PlaySound("ding"); });
```

Rules:

- `<a>` and `<b>` are names of boxes (or `it`, resolved on that line by Section 9's rules).
- The event fires once per contact. When the two boxes first touch, the statement runs once. If they stay touching, it does not run again every frame. It runs again only after they separate and touch again.
- An event line is a top-level statement. Events are registered in program order, and they keep watching after the program's main lines have finished.
- The body is one statement. To do several things when a touch happens, that multi-step reaction is not version 1; use `code:` (Section 15) for now.
- The body is written inside a lambda in the C++. A body that names a thing made in the show gets a `[&]` capture (Section 13.3); a body that names nothing local keeps the old `[]()` byte-for-byte.

### 13.1 Keyboard events

The pattern is:

```englishpp
when the <key> key is pressed, <statement>
```

The key table, fixed:

| English++ | C++ key |
|---|---|
| `space` | `KEY_SPACE` |
| `enter` | `KEY_ENTER` |
| `up`, `down`, `left`, `right` | `KEY_UP`, `KEY_DOWN`, `KEY_LEFT`, `KEY_RIGHT` |
| any letter `a` to `z` | `KEY_A` to `KEY_Z` |

Example:

```englishpp
when the space key is pressed, move hero by 1, 0, 0
```

```cpp
RegisterOnKey(KEY_SPACE, [&](){ hero.Move(1, 0, 0); });
```

Key events fire once per press, like touch events fire once per contact: holding the key down does not repeat the body every frame. A key word the table does not know is an error that lists the keys. `when the space is pressed` (without `key`) is an error, because the key form needs the word `key`. The `[&]` capture follows Section 13.3: the body names `hero`, so it captures by reference; a body naming nothing local would keep `[]()`.

### 13.2 Mouse events

The pattern is:

```englishpp
when the mouse is clicked, <statement>
```

Example:

```englishpp
when the mouse is clicked, play sound "click"
```

```cpp
RegisterOnMouseClick([](){ PlaySound("click"); });
```

Only the left mouse button counts, and only one form exists: `when the mouse is clicked`. There is no right-click, drag, or hover event in version 1.

### 13.3 Event bodies that name a thing: the `[&]` capture

An event body runs later, when the event fires — after the main program's lines have finished. In the C++, the body is a lambda. A lambda that names nothing from outside is written `[]()`, exactly as before. A lambda that names a box made in the main program is written `[&]()`, capturing that box by reference. The main program's locals stay alive until the window closes (the stay-open design of Section 14), so the reference is safe there.

```englishpp
make a box called hero
make a box called coin
when hero touches coin, move hero by 1, 0, 0
```

```cpp
Box hero;
Box coin;
RegisterOnTouch(hero, coin, [&](){ hero.Move(1, 0, 0); });
```

Rules, fixed:

- The capture triggers when the body names any thing from the main program — a box, a collection, a plain value, a pointer, directly or through `it`. Naming nothing local keeps `[]()`. Class instances still do not capture at all: naming a class instance (or calling its method, or reading its field) inside an event body is a plain-English error, because a class instance is not a runtime box.
- A body that names nothing local — `play sound "ding"`, for example — still emits `[]()` byte-for-byte as before.
- Event bodies inside a function or a method may not name a box at all, even with `[&]`: a function-local box dies when the function returns, so a reference to it would dangle. That is a plain-English error, naming the event form that would be needed.
- An event nested inside another event's body also needs `[&]` on the outer lambda if the inner event names a box, because the inner registration itself mentions the box.
- The event's own targets (`hero` and `coin` in the example above) are arguments to the registration, outside the lambda, so they never count toward the capture by themselves — only the body does.

---

## 14. Waiting: `wait` and how waits work

English++:

```englishpp
wait 3 seconds
```

Exact C++ translation:

```cpp
co_await WaitSeconds(3.0f);
```

Rules:

- The amount is an expression: a literal, a name, or a calculation (see Section 30.9). A bare literal keeps the old float format: `wait 3 seconds` becomes `WaitSeconds(3.0f)`, and `wait 0.5 seconds` becomes `WaitSeconds(0.5f)`. A whole number gains `.0` so the C++ value is always a decimal with an `f` on the end.
- Write `seconds` or `second`; both are accepted and mean the same thing.
- The amount may be a name: `wait speed seconds` waits for speed's value (see Section 30.9). A non-numeric duration is an error.

How waits work, in plain words: the whole show is a coroutine. A coroutine is a program that can pause in the middle and carry on later, without stopping everything else. When the show reaches a `wait`, it pauses itself for that many seconds, and then picks up exactly where it left off, on the next line. Nothing after the `wait` runs early, and nothing before it runs twice. Under the hood, that pause is the `co_await` you see in the C++: a yield point where the show hands control back until the time has passed.

Waits work inside functions too: a function whose body contains a `wait` becomes a waiting function (Section 26) — a coroutine of its own, called with `co_await`. Waits work inside methods the same way (Section 22.8a) — a method whose body contains a `wait` becomes a waiting method, called with `co_await` just like a waiting function. Waits do NOT work inside event bodies, which run all at once rather than as coroutines, with no way to pause and resume later.

---

## 15. The escape hatch: lines that start with `code:`

A line that starts with `code:` is copied into the C++ exactly as written, after the `code:` prefix. This is how you reach anything English++ does not have a word for yet.

English++:

```englishpp
code: hero.Move(5, 0, 0);
```

Exact C++ translation:

```cpp
hero.Move(5, 0, 0);
```

Rules:

- The text after `code:` is copied verbatim: spelling, punctuation, and semicolons included. The compiler does not check it. If it is wrong C++, the C++ compiler will report it, in C++ terms.
- One `code:` line is one C++ line. For longer C++, write several `code:` lines, one per line.
- `code:` lines stand on their own lines at the top level in version 1. They are not used as the body after a comma or colon in an `if`, loop, or event line.
- `code:` lines do not change what `it` or `them` point to, and pronouns inside a `code:` line are not resolved. What you write is what you get.
- Use `code:` as a bridge, not as the normal way to write. If you find yourself writing many `code:` lines for the same idea, that idea is a candidate for a new verb row (Section 17).

---

## 16. What kind of value is that? Type inference (fixed)

`let` writes `auto` in C++, and `auto` means "work out the kind from the value." The rule is fixed, by the shape of the literal:

| Literal shape | Kind | Example English++ | C++ |
|---|---|---|---|
| Whole number, like `5` | `int` | `let speed be 5` | `auto speed = 5;` |
| Decimal number, like `2.5` | `double` | `let height be 2.5` | `auto height = 2.5;` |
| Quoted text, like `"hello"` | `std::string` | `let greeting be "hello"` | `auto greeting = "hello";` |
| `true` or `false` | `bool` | `let ready be true` | `auto ready = true;` |

The generated C++ always says `auto`. It never spells out `int`, `double`, `std::string`, or `bool` for a `let` line. The kind is decided by the literal, every time, by this table — never guessed per occurrence.

Note the difference from action arguments: action numbers are copied exactly as written (`move hero by 3, 0, 0` keeps `3, 0, 0`), while `wait` numbers gain `.0f` (Section 14). Only `let` uses this inference table, because only `let` writes `auto`.

---

## 17. Libraries: adding words from other C++ libraries

> **English++ Studio 3:** libraries are now folders of phrases (`libraries/<name>/` with `<name>.englishpp`, a C++ helper header and `library.ini`; see `libraries/README.md`), used with `include once "<name>.englishpp"`. The JSON manifests described below were version 1's format and are retired.

English++ can call any C++ library, but only through the verb table. A library is added with a manifest: a small JSON file that tells the IDE where the library lives and which new verb rows it brings.

### The manifest format

A manifest has exactly these fields:

```json
{
  "name": "mylib",
  "include_dir": "path/to/mylib/include",
  "lib_path": "path/to/mylib/lib",
  "verb_bindings": [
    {
      "verb": "sparkle",
      "maps_to": "Sparkle",
      "kind": "method",
      "arguments": 1
    }
  ]
}
```

What each field means, in plain words:

- `name`: the library's name, one word.
- `include_dir`: the folder holding the library's header files (the files that declare what the library can do).
- `lib_path`: the folder or file holding the library's compiled code.
- `verb_bindings`: a list of new verb rows. Each row has:
  - `verb`: the new English++ word, like `sparkle`.
  - `maps_to`: the C++ name it becomes, like `Sparkle`.
  - `kind`: either `"method"` (called on a target, like `hero.Sparkle(1);`) or `"function"` (called on its own, like `Sparkle(hero, 1);` — the exact argument order is part of the binding and must be written down in the row's documentation when the binding is added).
  - `arguments`: how many arguments the verb takes, so the compiler knows where the statement ends on a comma line (Section 7.4).

The example above is only an illustration of the format. `sparkle` is not a version 1 verb, and `mylib` is not a real library. Do not use them in a program and expect them to work.

### How to add a verb binding for a new library

1. Write the manifest, with one row per new verb. Each row must state the verb, the C++ name, the kind, and the argument count.
2. Put the manifest in the project, so the IDE can read it at compile time.
3. Rebuild, and test the new verb in a tiny program of two or three lines before using it in a big program.
4. If a verb is missing or wrong, use `code:` (Section 15) for that one call until the binding is fixed. Do not guess a different spelling and hope.

Rules:

- A manifest row may not reuse a built-in verb name. If it does, that is an error, and the built-in meaning is not silently replaced. Rename the new verb instead.
- Adding a row never changes an existing row. Old programs keep meaning what they meant.
- The compiler never invents a binding. If there is no row for a word, the word is unknown, and the compiler says so (Section 18).

### Which libraries are ready

One honest note about the two manifest shapes in this book. The `verb_bindings` format above is the proposed format for teaching the compiler a new verb. The manifest files actually shipped in `libraries/` today are simpler: they are what the IDE's Libraries panel reads, with the fields `name`, `status` (`compiled` or `template`), `include_dir`, `lib_path`, `description`, and `verbs` (a list of `verb` → `cpp` pairs for display). Those shipped manifests do not by themselves teach the compiler a new verb — until a binding is added and tested, reach a new library through `code:` lines. Do not confuse the two shapes.

Say this plainly, because it matters:

- **raylib is built in.** The IDE already knows where raylib lives, so no manifest is needed for raylib itself. The box verbs in Section 7 run on top of it.
- **SDL, SFML, OpenGL, and Qt are templates, not validated libraries.** Template manifests exist as starting points, but they have not been validated, and their verb sets have not been tested. Do not claim a program using them will build and run until it has actually been built and run. Until a binding is added and tested, reach that library through `code:` lines.

---

## 18. Error messages: what goes wrong, and how you are told

When English++ cannot be compiled, the IDE reports the problem in plain English, with a line number, and no `.exe` is produced. Fix the problem and compile again. If there are several errors, fix the top one first: later lines often depend on earlier ones, so one fix can clear several messages.

Every error message follows the same shape:

```text
Line <number>: <what is wrong, in plain words>. <what to do about it>.
```

### Example 1: an unknown word

Program:

```englishpp
make a box called hero
florp hero
```

Message:

```text
Line 2: I don't know the word "florp". Check the spelling, or use a word from the verb table in Section 7.
```

### Example 2: a missing argument

Program:

```englishpp
make a box called hero
move hero by 1, 0
```

Message:

```text
Line 2: "move hero by 1, 0" is missing an argument. "move" needs 3 numbers. Write it like "move hero by 1, 0, 0".
```

### Example 3: a pronoun with nothing to point to

Program:

```englishpp
move them by 1, 0, 0
```

Message:

```text
Line 1: "them" has no group to point to. Name a group first with a "for each" line, or name the collection "boxes" directly.
```

Other errors follow the same shape: an unknown kind word (`make a dragon` — in version 1, the only kind is `box`), a name used before it is made, an `otherwise` with no `if` directly before it, a loop count that is not a whole number, and a `code:` line is never an English++ error, because its text is passed through unchecked (Section 15).

---

## 19. What the finished program looks like: the generated-program shape

In plain words, a compiled English++ program becomes a C++ program with these parts:

1. **A runtime header.** One `#include` line pulls in the runtime: the `Box` kind, the `boxes` collection, the verbs' C++ functions and methods, `WaitSeconds`, `RegisterOnTouch`, `SpawnBox`, and the show-running machinery. The header's name in the generated code is `englishpp_runtime.h`.
2. **Class and function definitions, when the program has any.** Boxx class definitions (Section 22) and function definitions (Section 26) sit at namespace scope before `MainScript`, each in definition order. A program with none of them has nothing here, and its output is unchanged.
3. **A coroutine called `MainScript`.** All of your top-level statements go inside this one function, in order. It is a coroutine (Section 14): a function that can pause at a `wait` and carry on afterwards. Your `note` lines become `//` comments inside it, in place.
4. **A `main` that runs the show.** The `main` function starts the `MainScript` coroutine and returns its result. You never write `main` yourself; the compiler writes it for you.

The shape, with a tiny program inside:

```cpp
#include "englishpp_runtime.h"

using namespace epp;

Task MainScript() {
  Box hero;
  hero.Show();
  co_return;
}

int main() {
  return Run(MainScript());
}
```

Read it top to bottom: bring in the runtime, define the show, run the show. The four worked programs in Section 20 each show their own full generated program in this same shape, so you can see exactly what every English++ line becomes, wrapper included.

### How the show looks when it runs

The runtime opens one window, 800 by 450, titled "English++". The camera does not move in version 1 — there is no camera verb yet — so every show is seen from the same fixed view: the camera sits at (12, 10, 12) and looks at (3, 0, 0), with a 45-degree view. You do not place boxes yourself: boxes appear in a row, in the order they are made. The first box sits at x = 0, and each later box sits 2.2 units further along x, all at height 0.5, so every box is visible without any placing words. Box colours cycle through four blues and purples, in creation order, for the same reason: the show looks arranged before you have said anything about looks.

---

## 20. Worked full programs

Each program below is complete and runnable, and each one also exists as a file under `examples/` with exactly the same lines. Each program is followed by a line-by-line walkthrough in plain words, and then by its full generated C++.

### Program 1: Hello Box

File: `examples/hello_box.englishpp`

```englishpp
note Hello Box - our first program.
make a box called hello
show hello
```

Walkthrough, line by line:

- Line 1, `note Hello Box - our first program.`: a comment for the reader. It becomes `// Hello Box - our first program.` and does nothing else.
- Line 2, `make a box called hello`: make one box and call it `hello`. This is a named declaration (Section 5.1).
- Line 3, `show hello`: make the box `hello` appear in the show.

Full generated C++:

```cpp
#include "englishpp_runtime.h"

using namespace epp;

Task MainScript() {
  // Hello Box - our first program.
  Box hello;
  hello.Show();
  co_return;
}

int main() {
  return Run(MainScript());
}
```

### Program 2: Timed Move

File: `examples/timed_move.englishpp`

```englishpp
note Timed Move - a box walks across in steps.
make a box called walker
show walker
move walker by 1, 0, 0
wait 1 seconds
move walker by 1, 0, 0
wait 1 seconds
move walker by 1, 0, 0
```

Walkthrough, line by line:

- Line 1: a comment. It becomes a `//` comment.
- Line 2, `make a box called walker`: make one box called `walker`.
- Line 3, `show walker`: make `walker` appear.
- Line 4, `move walker by 1, 0, 0`: move `walker` by the three numbers `1, 0, 0`. This is the `move` verb (Section 7), which takes exactly three arguments.
- Line 5, `wait 1 seconds`: pause the show for one second. The whole number `1` becomes `1.0f` in C++ (Section 14). Nothing after this line runs until the second has passed.
- Line 6: move `walker` by `1, 0, 0` again, one step further.
- Line 7: pause for one second again.
- Line 8: move `walker` by `1, 0, 0` a third time. The box has now taken three steps, one second apart.

Full generated C++:

```cpp
#include "englishpp_runtime.h"

using namespace epp;

Task MainScript() {
  // Timed Move - a box walks across in steps.
  Box walker;
  walker.Show();
  walker.Move(1, 0, 0);
  co_await WaitSeconds(1.0f);
  walker.Move(1, 0, 0);
  co_await WaitSeconds(1.0f);
  walker.Move(1, 0, 0);
  co_return;
}

int main() {
  return Run(MainScript());
}
```

### Program 3: Spawn Loop

File: `examples/spawn_loop.englishpp`

```englishpp
note Spawn Loop - five boxes appear, then each one is shown.
repeat 5 times: make a box
for each box in boxes: show box
```

Walkthrough, line by line:

- Line 1: a comment. It becomes a `//` comment.
- Line 2, `repeat 5 times: make a box`: run the body five times. The body is a creation, and a creation inside a loop becomes `SpawnBox()` (Section 5.3), not a declaration — so no name is made, no bare-creation number is used up, and each pass adds one new box to the `boxes` collection. After this line, five boxes exist.
- Line 3, `for each box in boxes: show box`: go through the `boxes` collection, one member at a time, calling the current member `box`, and show it. Because the loop runs after the spawning, it finds all five boxes. The loop variable `box` is the current member on each pass, and `it` would mean the same thing inside this body (Section 9).

Full generated C++:

```cpp
#include "englishpp_runtime.h"

using namespace epp;

Task MainScript() {
  // Spawn Loop - five boxes appear, then each one is shown.
  for (int i = 0; i < 5; ++i) { SpawnBox(); }
  for (auto& box : boxes) { box.Show(); }
  co_return;
}

int main() {
  return Run(MainScript());
}
```

### Program 4: Event and Sound

File: `examples/event_sound.englishpp`

```englishpp
note Event and Sound - touch the coin, hear a ding.
make a box called hero
make a box called coin
show hero
show coin
when hero touches coin, play sound "ding"
wait 1 seconds
note Hero walks onto the coin.
move hero by 2, 0, 0
```

Walkthrough, line by line:

- Line 1: a comment. It becomes a `//` comment.
- Line 2, `make a box called hero`: make one box called `hero`.
- Line 3, `make a box called coin`: make one box called `coin`.
- Line 4, `show hero`: make `hero` appear.
- Line 5, `show coin`: make `coin` appear. Both boxes are now visible, so they can meet.
- Line 6, `when hero touches coin, play sound "ding"`: register an event (Section 13). When `hero` and `coin` first touch, play the sound `"ding"`. The comma separates the event from the thing to do. If the boxes stay touching, the sound does not repeat every frame; it plays again only after they separate and touch again.
- Line 7, `wait 1 seconds`: pause one second, so you can see the two boxes standing apart first.
- Line 8: a comment. It becomes a `//` comment.
- Line 9, `move hero by 2, 0, 0`: hero walks 2 units onto the coin. Hero starts at position 0 and the coin sits at 2.2, so a move of 2 overlaps them — the touch fires and the ding plays.

Full generated C++:

```cpp
#include "englishpp_runtime.h"

using namespace epp;

Task MainScript() {
  // Event and Sound - touch the coin, hear a ding.
  Box hero;
  Box coin;
  hero.Show();
  coin.Show();
  RegisterOnTouch(hero, coin, [](){ PlaySound("ding"); });
  co_await WaitSeconds(1.0f);
  // Hero walks onto the coin.
  hero.Move(2, 0, 0);
  co_return;
}

int main() {
  return Run(MainScript());
}
```

---

### Program 5: New features together

File: `examples/new_features.englishpp`

```englishpp
note New features - paint, say, camera, words, and a class with a method.
Boxx called Dog:
has a number called speed with 5
can run:
set speed to speed + 1
end run
end Dog
make a Dog called rex
rex run
print the speed of rex
make a box called hero
paint hero red
grow hero by big
say "hello"
make the camera follow hero
make boxes spell "HI"
print the count of boxes
make 3 boxes
print the count of boxes
let n be 0
while n is less than 3: set n to n + 1
print n
repeat 10 times: if n is 3, break
print n
make a text called msg
write "hello" to "new_features_note.txt"
read "new_features_note.txt" into msg
print msg
```

Walkthrough, line by line:

- Lines 2–7: a class `Dog` with a field (`speed`, starting at 5) and a method (`run`, which adds 1 to `speed`). The class body opens with a colon after `Boxx called Dog:` and closes with `end Dog`.
- Line 8, `make a Dog called rex`: one `Dog` named `rex`.
- Line 9, `rex run`: call the method (a statement, not a value).
- Line 10, `print the speed of rex`: read the field — prints `6`, because `run` raised it from 5.
- Line 11, `make a box called hero`: the one box the camera will follow.
- Line 12, `paint hero red`: the fixed colour table (Section 7.5).
- Line 13, `grow hero by big`: a size word in a `grow` amount (Section 7.9) — `big` is 1.5.
- Line 14, `say "hello"`: text on the screen panel (Section 7.6), not the console.
- Line 15, `make the camera follow hero`: the camera keeps its offset and moves with `hero` (Section 7.7).
- Line 16, `make boxes spell "HI"`: 28 gold boxes spelling HI (Section 5.5).
- Line 17, `print the count of boxes`: prints `29` — `hero` plus the 28 letter boxes.
- Line 18, `make 3 boxes`: plural making (Section 5.4).
- Line 19, `print the count of boxes`: prints `32`.
- Lines 20–21: a `while` loop counting `n` from 0 to 3 (Section 12.6).
- Line 22, `print n`: prints `3`.
- Line 23, `repeat 10 times: if n is 3, break`: nesting (Section 12.5) plus `break` (Section 12.7) — the loop stops on its first pass, because `n` is already 3.
- Line 24, `print n`: prints `3` again.
- Lines 25–28: file output and input (Section 7.8) — write `"hello"` to a file, read it back into `msg`, print it. Prints `hello`, and the file `new_features_note.txt` in the program's folder holds `hello`.

Full generated C++:

```cpp
#include "englishpp_runtime.h"

using namespace epp;

class Dog { public:
  int speed = 5;
  void run() {
    speed = (speed + 1);
  }
};

Task MainScript() {
  // New features - paint, say, camera, words, and a class with a method.
  Dog rex;
  rex.run();
  std::cout << rex.speed << std::endl;
  Box hero;
  hero.Paint(Color{255, 0, 0, 255});
  hero.Grow(1.5);
  Say("hello");
  FollowCamera(hero);
  SpawnTextFormation("HI");
  std::cout << boxes.size() << std::endl;
  for (int i = 0; i < 3; ++i) { SpawnBox(); }
  std::cout << boxes.size() << std::endl;
  auto n = 0;
  while (n < 3) { n = (n + 1); }
  std::cout << n << std::endl;
  for (int i = 0; i < 10; ++i) { if (n == 3) { break; } }
  std::cout << n << std::endl;
  std::string msg;
  WriteTextFile("new_features_note.txt", "hello");
  msg = ReadTextFile("new_features_note.txt");
  std::cout << msg << std::endl;
  co_return;
}

int main() {
  return Run(MainScript());
}
```

---

## 21. What English++ does NOT do yet (version 1 limits, honestly stated)

**English++ 2 update:** many limits below are lifted by Part Two (Sections 31–46): blocks with many lines, `and`/`or`/`not`, methods as values, methods calling functions, keyboard input, more containers, and the C++ standard library. Section 46 is the current list of what is still missing. The text below is kept as it was, as the record of version 1.

Version 1 is small on purpose. Saying what it cannot do is part of the manual, not a footnote to hide. Everything that used to be on this list and has since landed is gone from it; what remains is still true.

- **One built-in kind, plus Boxx classes.** The built-in kind is `box`. Boxx classes (Section 22) now have fields and methods (Sections 22.7–22.9), including inherited ones. Plural making (`make 3 boxes`, Section 5.4) exists; class instances are still made one at a time.
- **Colours, sizes as words, text on screen, and camera moves exist now.** `paint` (Section 7.5, fixed colour table), size words in `grow`/`shrink` amounts only (Section 7.9), `say` (Section 7.6, on-screen panel), `make the camera follow` / `make the camera stop following` (Section 7.7), and text-formation spawning (Section 5.5) are all in the language.
- **Control lines nest now.** An `if`, `repeat`, `for each`, `when`, or `while` body may itself be a control line (Section 12.5). Otherwise-if chains (Section 11), `while` loops (Section 12.6), `break` and `continue` (Section 12.7), and expression repeat counts (Section 12.4) all exist.
- **Pointers nest now.** Multi-level pointers and pointers to collections exist (Section 24). What remains: `the count of` and `for each` over a dereferenced collection do not parse, and whole-collection assignment does not exist — pass a dereferenced collection to a function instead.
- **Events cover keys and mouse now, and event bodies may name things.** `when the <key> key is pressed` and `when the mouse is clicked` exist (Sections 13.1–13.2), and a main-program event body naming a thing gets a `[&]` capture (Section 13.3). What remains: event bodies inside functions or methods may not name a thing; event bodies may not name a class instance, call its method, or read its field; a body that names nothing local still emits `[]()`.
- **Files exist now.** `write` and `read` for text files exist (Section 7.8). Network input and output do not exist: there is no `fetch`, no socket, no download verb in version 1.
- **Include guards exist as a new form only.** `include once "..."` skips a file already brought in by an `include once` line in the same build (Section 29.1). Plain `include` still splices twice, with no dedup — that behavior never changes. An `include` line must still stand on its own line.
- **Destroyed names are errors now.** Any later use of a destroyed name in the same scope is a plain-English compile error (Section 7.2). What remains: destroying by position (`destroy pack at 0`) does not mark that position as destroyed, so the position can still be named afterwards.
- **Functions exist (Section 26), with these remaining limits.** A function body sees only its parameters plus its own locals; a main-program name inside a function is an error, not a capture. `wait` works inside a function now (waiting functions, Section 26), and inside a method too (waiting methods, Section 22.8a) — but an event body can neither wait nor call a waiting function or method (Sections 13, 22.9, 26). A method still cannot call a top-level function at all, waiting or not (Section 22.10). Function and class *names* hoist (Sections 22.4, 26, 29): a function may be called, and a class may be used, before its definition line — but only the name hoists, so a class's fields and methods are usable only once its body has been read. A function definition belongs on its own top-level line, and its `end` line must name it.
- **A Boxx class may have several parents now (Section 22.2).** `Boxx called Dog uses Animal and Pet` compiles to `class Dog : public Animal, public Pet`. Field and method names must still be unique down the whole parent chain: two parents defining the same member is an error naming the clash.
- **Boxes made inside a function: it depends on the function (Section 26).** A box made inside a *plain* function still never appears on screen: the function returns synchronously, before the next frame is drawn, and the box is then destroyed. A box made inside a *waiting* function DOES appear while the function waits: the function's locals stay alive across frames, so the box is in the world list when frames draw. This is C++ lifetime, not a bug.
- **Method calls are statements only, not values (Section 22.9).** You cannot `print` a method's return or `set` a variable to it yet; call the method, then read a field it set.
- **Field access is one level only (Section 22.9).** `the <field> of <instance>` needs a plain instance name; a field of a field is not a form.
- **Fields cannot be pointers, references, or their own class (Section 22.7).**
- **Size words work in `grow`/`shrink` amounts only (Section 7.9).** Nowhere else.
- **A `repeat` count variable must not be named `i` (Section 12).** The generated loop variable is `i`, so a count variable called `i` reads the loop's own counter and the loop runs zero times.
- **No new verbs without a table row.** A word with no row in the verb dictionary (Section 7) or in a library manifest (Section 17) is an unknown-word error, not a guess.
- **SDL, SFML, OpenGL, and Qt are templates, not validated libraries** (Section 17). A program using them has not been proven to build and run until it actually has.
- **No keyboard, mouse, file, or network input beyond what this manual states.** Keys and mouse clicks exist as events (Sections 13.1–13.2); there is no key-state polling, no mouse position, no file listing, and no network.

Anything in this list marked as a remaining limit may arrive in a later version, with its own manual section, its own table row, and its own worked example. Until then, it is not part of the language, and no program in this manual relies on it.

### Retired limits, and the golden cases that pinned them

When a limit on this list lands, its old error case is retired, not rewritten: the old error file is replaced by the newly-working program (or the new error, where the old program still fails for a different reason), and the retirement is named here. Retired so far:

| Retired golden file | Lifted by |
|---|---|
| `error_class_uses_multiple.err` — `uses A and B` was "one parent for now" | Multiple parents (Section 22.2): the file's program still errors, but now because `Cat` is never defined, not because two parents are forbidden. |
| `error_wait_in_function.err` — `wait` inside a function was "for now" | Waiting functions (Section 26): the file's program is now a working waiting function. |
| `error_call_before_define.err` — calling a function before its `define` line | Definition hoisting (Sections 22.4, 26): the file's program now calls, then defines. |
| `error_class_forward.err` — using a class before its `Boxx` line | Definition hoisting (Sections 22.4, 26): the file's program now makes an instance, then defines the class. |
| `include_order.err` — calling a function on a line above its `include` line | Definition hoisting across files (Section 29): the file's program now prints 5. |
| `error_class_circular.err` — a parent circle errored as two unknown classes | Definition hoisting (Section 22.4): with both classes known, a circle can no longer hide as "unknown parent" — it is now one error at the closing definition, naming the circle. |

One success-case output was fixed, not retired: `event_capture_plain_var.cpp` used to emit a lambda that named a main-program number without capturing it, which is C++ that cannot compile. The capture rule (Section 13.3) now covers any thing the body names, so it emits `[&]` and compiles. No working program changed: the old output never compiled, so nothing was built on it.

One further limit retired since the table above was last filled in (no numbered golden-suite file ships with this delivery, so it is named here in prose instead of a file row): "a method cannot wait" (formerly Section 22.8, formerly also listed above under Functions) is lifted by waiting methods (Section 22.8a). The one place this retirement changed existing behavior, not just added new behavior: a method calling a top-level function used to be blocked only when that function waited (silently reaching the C++ compiler broken the rest of the time); it is now blocked unconditionally, with a plain-English error, because the real cause was never the waiting — see Section 22.10.

No success-case golden output for a program that compiled before ever changes: such a program still compiles to the same C++, byte for byte. Only error cases that pinned a lifted limit are ever retired, and each one is listed here — plus the one fixed output above, whose old form never compiled.

---

## 22. Classes with Boxx

`Boxx` is a new keyword for making your own kinds of things. It is a different word from `box`, the built-in kind: `box` makes a box in the show, `Boxx` defines a class (a new kind). Everything in this section is additive: no earlier section's syntax changed to make room for it.

### 22.1 Defining a class

A class definition stands on its own line, at the top level of the program. There are two spellings, and they compile to exactly the same C++:

```englishpp
Boxx called Dog
Boxx Dog
```

Exact C++ translation (either spelling):

```cpp
class Dog { public: };
```

Class definitions are emitted before `MainScript`, in the order they are defined, so a program that defines several classes starts like this:

```englishpp
Boxx called Animal
Boxx called Dog
```

```cpp
class Animal { public: };
class Dog { public: };
```

Rules for a definition:

- A class name may be used before its definition line (see Section 22.4): only the name hoists, so the class's fields and methods are usable once its body has been read.
- A class name is one word, like any name (Section 4). By convention, class names start with a capital letter (`Dog`, `Animal`); the compiler accepts any identifier spelling, but writing class names with a capital keeps them easy to tell apart from thing names at a glance.
- `Boxx` and other keywords do not care about capital letters (`boxx called Dog` works), but class and thing names keep their exact spelling: `Dog` and `dog` are different names.
- A class definition is not a statement inside a loop, an `if`, or an event, and it cannot sit after another instruction on the same line. It belongs on its own top-level line.

In version 1, a class with no body has an empty public section. A class with a body holds its fields and methods in that public section — see Sections 22.7–22.9.

### 22.2 Inheritance: `Boxx uses X`

A class can use other classes as its parents with `uses`. One parent, or several, separated by `and`:

```englishpp
Boxx called Animal
Boxx called Pet
Boxx called Dog uses Animal and Pet
Boxx Puppy uses Dog
```

Exact C++ translation:

```cpp
class Animal { public: };
class Pet { public: };
class Dog : public Animal, public Pet { public: };
class Puppy : public Dog { public: };
```

Rules for `uses`:

- `uses X` names any class made with `Boxx` in the same program. A parent may be defined later than the child (see Section 22.4): the emitted C++ still puts parents first, so a child using a later-defined parent compiles.
- `box` is not a class, it is the built-in kind, so `uses box` is an error. `uses` naming a thing (a variable) instead of a class is also an error.
- Naming the same parent twice (`uses Animal and Animal`) is an error: each parent needs to be named once.
- **The ambiguity rule.** If two parents anywhere in the whole parent chain define the same field or method name, the class definition is an error naming the clash:

```englishpp
Boxx called Animal:
has a number called age with 3
end Animal
Boxx called Pet:
has a number called age with 5
end Pet
Boxx called Dog uses Animal and Pet:
end Dog
```

```text
Line 7: 'age' is defined by both Animal and Pet, so Dog can't use them both — each member needs one home.
```

The rule looks through the whole chain, not just the direct parents: a clash through grandparents errors the same way. A diamond is fine — when two parents share one ancestor, that ancestor's members have one home, so they are not a clash:

```englishpp
Boxx called Living:
has a number called years with 1
end Living
Boxx called Animal uses Living:
end Animal
Boxx called Pet uses Living:
end Pet
Boxx called Dog uses Animal and Pet:
end Dog
```

Here `years` comes from `Living` once, no matter which parent it is reached through, so `Dog` compiles. The emitted C++ makes the shared edges `virtual` — `class Animal : public virtual Living`, `class Pet : public virtual Living` — so there is one shared `Living` subobject instead of two, and `rex.years` is not ambiguous. Edges into ancestors no class reaches twice stay plain `public`, so programs without a diamond emit exactly the C++ they did before.
- A class cannot use itself, and a chain of `uses` cannot circle back to a class. A circle is reported at the CLOSING definition — the line whose parent chain closes the circle — because a chain through a not-yet-reached parent cannot close a circle at the earlier definition. In a file that tries `Boxx called Alpha uses Beta` followed by `Boxx called Beta uses Alpha`, the first line stands (Beta is not unknown any more, it is just defined later), and the second line errors:

```text
Line 2: That would make a circle: Beta ends up using itself through its parents. A class can't end up using itself.
```

### 22.3 Making an instance of a class

Once a class exists, its name becomes a usable kind, exactly where `box` goes in a making line:

```englishpp
Boxx called Dog
make a Dog called rex
```

Exact C++ translation:

```cpp
class Dog { public: };

Task MainScript() {
  Dog rex;
}
```

The synonyms `create` and `spawn` work identically for classes, as they do for boxes:

```englishpp
create a Dog called rex
spawn a Dog called rex
```

A bare instance — no `called` name — auto-names per class: the lowercase class name plus a counter, starting at 1, counted separately for each class:

```englishpp
Boxx called Dog
Boxx called Puppy uses Dog
make a Dog
make a Dog
make a Puppy
```

```cpp
Dog dog1;
Dog dog2;
Puppy puppy1;
```

Named instances do not use up a number, just as named boxes do not (Section 5.2).

Class instances are NOT boxes: they do not join the runtime `boxes` collection, so `for each box in boxes` never touches them. What you can do with a class instance: declare it (named or bare), read and write its fields, and call its methods (Sections 22.7–22.9). Declaring an instance you never use may produce an unused-variable warning when the generated program is compiled with `-Wall`; it still compiles and links, and that warning is acceptable in version 1.

### 22.4 One namespace, and definitions that hoist

Classes and things share one namespace, in both directions:

- `make a box called Dog` when `Dog` is already a class is an error, and `Boxx called hero` when `hero` is already a thing is an error. A name is either a class or a thing, never both.
- The same rule covers `let`: `let Dog be 5` when `Dog` is a class is an error.
- Redefining a class is an error: two `Boxx called Dog` lines cannot both stand.
- The namespace rule is order-dependent: a variable made BEFORE a class line makes the class line error, and a variable made AFTER a class line errors itself. Either order errors — the error just lands on the later line.

**Hoisting: a definition's name is visible throughout the whole program, before its definition line.** Before any statement compiles, the compiler scans the whole spliced program (all included files, after textual splicing) and registers every top-level `Boxx` definition and every top-level `define` block. So this works:

```englishpp
make a Dog called rex
Boxx called Dog
```

```cpp
class Dog { public: };

Task MainScript() {
  Dog rex;
  co_return;
}
```

And a class may use a parent defined later, and a function may call a function defined later (Section 26). Only DEFINITIONS hoist, never statements: statements still run strictly in order — `it`, auto-naming order, and `let`/`set` order are all unchanged — and a definition's body still parses at its definition line, in source order. That gives hoisting one honest limit: **only the NAME hoists, not the members.** A class's fields and methods become usable once its body has been read, so a method in a child defined before its parent cannot use the parent's fields yet (it errors as an unknown thing), even though the child may name the parent in `uses`.

Emission follows the same honesty: classes are emitted parents-first (for programs that already define parents first, that IS definition order, so their C++ is byte-identical), and functions that call a function defined later get forward declarations (prototypes) before the definitions, so mutual recursion compiles. A circle is still an error, reported at the closing definition (Section 22.2).

### 22.5 Kind rules and verb guards

The compiler tracks every variable's kind: `box`, a class name, or a value (`let` name). Box-only verbs and methods are refused in plain English for class instances, because the runtime only gives those operations to `Box` — emitting `rex.Move(...)` for a `Dog` would be C++ that cannot compile, so the compiler stops at the English++ stage instead. The guarded verbs are:

- `move`, `show`, `hide`, `spin`, `grow`, `shrink` (Box methods),
- `destroy` (the runtime's `Destroy` takes a `Box&` only),
- touch events (`when ... touches ...`, whose runtime registration takes `Box&` arguments).

The error wording follows one pattern — the verb, the instance, and its class:

```text
Line 3: move works on boxes. rex is a Dog, not a box.
Line 3: destroy works on boxes. rex is a Dog, not a box.
Line 4: Touch events work on boxes. rex is a Dog, not a box.
```

Two more guards follow the same idea: `set` refuses a class instance (`set works on values. rex is a Dog, not a value.`), and a class instance used as a value — an action argument or a comparison — is refused (`rex is a Dog, not a value, so it can't be used here.`). Fields and methods (Sections 22.7–22.9) are the ways to work with an instance's insides; the guards above still refuse the box verbs themselves.

Pronouns follow the same rules. A class definition does NOT change `it` — it declares a type, not an object. After `make a Dog called rex`, `it` is `rex`, and the guards still apply when `it` is used with a box-only verb (`move it by 1, 0, 0` after making `rex` errors with `move works on boxes. rex is a Dog, not a box.`).

### 22.6 The full error list

Every error in this section produces no C++ output at all, only the plain-English error (with its line number). The wording below is exact.

| Situation | Error |
|---|---|
| `uses` an unknown class | `I don't know a class called X yet. Define it first with Boxx called X.` |
| A class using itself | `A class can't use itself. 'Dog uses Dog' is not allowed.` |
| Circular `uses` (a chain that closes back on itself) | `That would make a circle: Beta ends up using itself through its parents. A class can't end up using itself.` — reported at the closing definition. |
| Redefining an existing class | `I already know a class called 'Dog'. Each class needs its own name.` |
| A thing sharing a class's name (`make a box called Dog`, `make a Dog called Animal`, `let Dog be 5`) | `'Dog' is already a class, so it can't also be a thing's name. Pick another name.` |
| A class sharing a thing's name (`Boxx called hero`) | `'hero' is already a thing, so it can't also be a class name. Pick another name.` |
| A class named `box` | `'box' is already the built-in kind, so it can't be a class name. Pick another name.` |
| Boxx inside a loop, `if`, or event body, or after another instruction on the same line | `A class definition belongs on its own line at the top level. It can't sit inside a loop, an if, or an event, or after another instruction on the same line.` |
| A class instance made inside a loop | `A class instance made inside a loop can't be declared, because the name would be made again on every pass. Make it outside the loop if it needs a name.` |
| `uses` without a parent name | `uses needs a class name after it, like 'Boxx called Dog uses Animal'.` |
| `uses` naming a thing instead of a class | `'hero' is a thing, not a class. 'uses' needs a class made with Boxx.` |
| `uses box` | `'box' is a kind, not a class. 'uses' needs a class made with Boxx, like 'Boxx called Animal'.` |
| `uses` naming the same parent twice | `'Animal' is already a parent of Dog — each parent needs to be named once.` |
| Two parents defining the same member | `'age' is defined by both Animal and Pet, so Dog can't use them both — each member needs one home.` (more than two definers are listed in full: `'age' is defined by A, B, and C, so Dog can't use them all — each member needs one home.`) |
| `make a Boxx ...` | `To make a class, write Boxx called Dog. 'make a Boxx' is not a form; to make an instance, write 'make a Dog called rex' once the class exists.` |
| Using an unknown kind (no class by that name anywhere) | `I don't know the thing 'Dog'. Things I do know: box.` (once classes exist, the list also names them) |
| A box-only verb on a class instance | `<verb> works on boxes. rex is a Dog, not a box.` |
| A touch event on a class instance | `Touch events work on boxes. rex is a Dog, not a box.` |
| `set` on a class instance | `set works on values. rex is a Dog, not a value.` |
| A class instance used as a value | `rex is a Dog, not a value, so it can't be used here.` |
| A field sharing a member name (own class or ancestor) | `'speed' is already a member of Dog — each member needs its own name.` |
| A field holding its own class | `a class can't hold one of itself — 'Dog' inside Dog would never be finished.` |
| A field that is a pointer or reference | `a class field can't be a pointer or a reference in version 1 — hold a number, a box, or a collection instead.` |
| A `with` value on a box or class field | `a box field can't start with a value — leave out 'with'.` |
| A statement that is neither `has` nor `can` inside a class body | `a class body holds fields ('has ...') and methods ('can ...:') — '...' is neither.` |
| A class body with no `end <Class>` line | `Boxx called Dog needs an end line, like 'end Dog'.` |
| A method with no `end <method>` line | `end bark is needed to close Dog can bark.` |
| Reading an unknown field | `Dog has no field called 'nosuch'. Fields Dog has: speed.` |
| Reading a field of a box | `boxes don't have fields` (worded for the instance) |
| Calling an unknown method | `Dog doesn't have a method called 'fly'. Methods Dog has: bark.` |
| Calling a method on a box | `boxes don't have methods — 'hero' is a box. Methods belong to classes made with Boxx.` |
| A method call with the wrong argument count or kind | `sum takes 2 thing(s), but 1 were given.` / `sum expects a number as thing 1, but you gave a text.` |
| A plain method calling a waiting method (Section 22.8a) | `greet can't call bark — bark waits, and greet doesn't. Call bark from the main program, or from a method that waits too.` |
| A plain function calling a waiting method (Section 22.8a) | `greet is a plain function, but bark waits. A plain function can't call a waiting method — call bark from the main program, or from a function that waits too.` |
| A method calling a top-level function, waiting or not (Section 22.10) | `bark can't call helper — a method can't call a top-level function yet. Call helper from the main program or from another function instead.` |
| A field access inside an event body | `naming a class instance inside an event body isn't version 1 yet — events that name boxes work, but class instances don't capture yet.` |
| A method call inside an event body | `a method call inside an event body isn't version 1 yet — class instances don't capture into events yet. Call the method from the main program instead.` |

### 22.7 Fields inside a class

A class body is opened by a colon after the class header and closed by an `end` line naming the class. Inside the body, a field line starts with `has`:

```englishpp
Boxx called Dog:
has a number called speed with 5
has a text called name with "rex"
has a box called body
end Dog
```

Exact C++ translation:

```cpp
class Dog { public:
  int speed = 5;
  std::string name = "rex";
  Box body;
};
```

Rules, fixed:

- A class with no fields and no methods keeps its exact old one-line form (`class Dog { public: };`). Only a class with a body becomes multi-line.
- A field's kind is any kind from Sections 23–27: a number, decimal, text, letter, yes-or-no value, box, class, or collection of those. The `with` value, when given, is a literal for primitive kinds and a literal list for collection kinds (`has a vector of numbers called scores with 1 and 2` becomes `std::vector<int> scores = {1, 2};`). A field with no `with` gets a default: numbers, decimals, letters, and yes-or-no values get `{}` (zero, empty, false), text gets an empty string, boxes and classes get a default-made member, collections get an empty collection.
- A box or class field cannot take `with`: a box field starts empty, not with a value.
- A field cannot be a pointer or a reference in version 1. A reference member would need a constructor to bind it, and this version has no constructor syntax.
- A field cannot hold its own class (`has a Dog called pup` inside `Dog`), or a collection of its own class: in C++ that type is never finished.
- A field cannot share the class's own name (that would read as a constructor in C++), share another class's name (one namespace, Section 22.4), or share a member name already held by the class or any ancestor. Members are strictly unique down the whole parent chain in version 1: C++ would silently hide an ancestor's member without virtual dispatch, so the compiler errors instead, honestly.
- Field lines, method headers (Section 22.8), `note` lines, and `code:` lines are the only lines a class body holds. Any other statement in a class body is an error naming those forms. `define` and `Boxx` inside a class body are top-level-only errors, as in a function body.
- A class body that never gets its `end <Class>` line is an error at the class header line. On any body failure, the class is not registered at all — a failed body leaves no class behind.
- A class body does NOT change `it`.

### 22.8 Methods inside a class

A method line starts with `can` and ends with a colon, then its body lines, then an `end` line naming the method. "Dog can bark" reads as what the class CAN do:

```englishpp
Boxx called Dog:
has a number called speed with 5
can bark:
print "woof"
end bark
can run:
set speed to speed + 1
end run
end Dog
```

Exact C++ translation:

```cpp
class Dog { public:
  int speed = 5;
  void bark() {
    std::cout << "woof" << std::endl;
  }
  void run() {
    speed = (speed + 1);
  }
};
```

Rules, fixed:

- A method header takes the same `taking` and `giving back` clauses as a function (Section 26): `can sum taking a number called x and a number called y giving back a number:` becomes `int sum(int x, int y) {`. Parameters follow the same by-reference rules as function parameters: boxes, class instances, and collections arrive by reference, values by value.
- A method body is a function-like body: it sees only its parameters, its own locals, and the class's fields (its own fields plus inherited fields, walked down the parent chain). Naming a main-program variable inside a method is the same pass-it-in error as in a function, worded for methods.
- Inside a method, a bare field name means the field: `set speed to speed + 1` writes the member. A parameter sharing a field's name shadows it inside the method, as in C++: the parameter wins, and the field is not reachable by that name in that method.
- Inside a method, a bare method name of the same class calls that method on the same instance: `run` inside `go` becomes `run();` (implicit `this`, in C++ terms) — or `co_await run();` when `run` is a waiting method (Section 22.8a).
- `wait` inside a method works, exactly as inside a function (Section 26): a method whose body contains a `wait` becomes a waiting method, see Section 22.8a. `give back` follows the method's return kind, and giving back a value from a method with no `giving back` clause is an error, as in a function.
- A method's `end` line must name the method, and a method without its `end` line is an error at the method header line.
- Method names follow the same reserved-word rules as other names: a method cannot be named with a statement keyword (`can add` fails, because `add` is a statement word) or an article word (`can sum taking a number called a` fails, because `a` is reserved).
- Inheritance covers methods exactly as it covers fields: a child instance calls a parent's methods (Section 22.9), and a child may not redefine a parent's method name (Section 22.7's uniqueness rule).

### 22.8a Waiting methods

A method body may contain `wait`, exactly like a function body (Section 26). A method whose body contains a `wait` is a WAITING method: it is emitted as a coroutine, and calling it emits `co_await`.

```englishpp
Boxx called Dog:
has a number called speed with 5
can bark:
print "woof"
wait 1 seconds
print "woof again"
end bark
can fetch:
bark
wait speed seconds
print "back with it"
end fetch
end Dog
make a Dog called rex
rex fetch
```

Exact C++ translation:

```cpp
class Dog { public:
  int speed = 5;
  Task bark() {
    std::cout << "woof" << std::endl;
    co_await WaitSeconds(1.0f);
    std::cout << "woof again" << std::endl;
  }
  Task fetch() {
    co_await bark();
    co_await WaitSeconds(speed);
    std::cout << "back with it" << std::endl;
  }
};
```

```cpp
Dog rex;
co_await rex.fetch();
```

Rules:

- A void waiting method is emitted as `Task <name>(...)`; a waiting method with a `giving back` clause is emitted as `TaskValue<<kind>> <name>(...)`, exactly like a waiting function (Section 26). `give back` inside a waiting method emits `co_return`, not `return`.
- A call to a waiting method emits `co_await`, whether the call is written with an explicit instance (`rex fetch` → `co_await rex.fetch();`) or as an implicit-this call from inside another method of the same class (`bark` inside `fetch`, above, → `co_await bark();`). A call to a plain (non-waiting) method is unaffected — it emits exactly as before.
- Caller rules mirror waiting functions exactly (Section 26): the main program may call a waiting method, a waiting function may call a waiting method, and a waiting method may call a waiting method — but a PLAIN function or a PLAIN method may not call a method that waits. Each refusal names both sides in plain English, for example: `greet can't call bark — bark waits, and greet doesn't. Call bark from the main program, or from a method that waits too.`
- Inheritance is unaffected: a waiting method found through a parent class (Section 22.2) calls and emits exactly as if it belonged to the child.
- A method call is still a statement only, never a value (Section 22.9) — this is unchanged by waiting methods. A waiting method's `giving back` value can be read with the `code:` escape hatch (Section 15), the same workaround a plain giving-back method already needs.
- An event body still cannot call a method at all, waiting or not (Section 13, Section 22.9) — this refusal needed no change.
- A method still cannot call a top-level function, waiting or not (Section 22.10) — functions are emitted after classes, so the call would have no declaration in scope. This refusal is now unconditional (it no longer matters whether the function waits), so it is now caught with a clear error in every case instead of only when the function happened to wait.

### 22.9 Using fields and methods from outside

**Reading and writing a field.** The pattern is `the <field> of <instance>`, one level only in version 1 — the instance must be a plain name, not another phrase:

```englishpp
make a Dog called rex
print the speed of rex
set the speed of rex to 10
move the body of rex by 1, 0, 0
```

```cpp
Dog rex;
std::cout << rex.speed << std::endl;
rex.speed = 10;
rex.body.Move(1, 0, 0);
```

Rules: the instance must be a class instance. Reading a field of a box errors (`boxes don't have fields`), and reading a field of a plain value errors with its kind. A field that does not exist errors with the list of fields the class actually has (`Dog has no field called 'nosuch'. Fields Dog has: speed.`). A field access inside an event body is an error: class instances do not capture into events yet (Section 13.3). A field access whose field kind is a box works as an action target (the `move the body of rex` line above); a field access whose field kind is a collection does not yet support `the count of` or `for each` over it, because those forms take a name, not a phrase — use a variable for the collection first if you need to count or iterate it.

**Calling a method.** The pattern is a statement, not a value:

```englishpp
rex bark
rex sum with 2 and 3
```

```cpp
rex.bark();
rex.sum(2, 3);
```

Rules: the instance comes first, then the method name, then `with` and arguments separated by `and` when the method takes parameters. Argument count and kinds are checked exactly as for function calls (Section 26), including by-reference rules. Calling a method as a value — for example, inside `print` or `set` — is not version 1: method calls are statements only. Calling an unknown method errors with the list of methods the class has (`Dog doesn't have a method called 'fly'. Methods Dog has: bark.`). Calling a method on a box errors (`boxes don't have methods`), and calling one on a plain value errors that only class instances have methods. A method call inside an event body is an error, like a field access there. When the method waits (Section 22.8a), the call emits `co_await` and is subject to the same caller rules as calling a waiting function.

### 22.10 What is NOT in classes yet

Honestly stated, still missing: a class's fields and methods cannot be used before its body is defined (only the class name hoists — Section 22.4); method calls are statements only, not values (so a waiting method's `giving back` value, like a plain method's, needs the `code:` escape hatch to read); field access is one level only; fields cannot be pointers, references, or their own class; a method body cannot call a top-level function at all, waiting or not (functions are emitted after classes, so the call has no declaration in scope — this is now a plain-English error rather than broken C++: call functions from the main program or from other functions instead). As of Section 22.8a, a method CAN wait — this limit from earlier versions of this manual no longer applies. The `code:` escape hatch (Section 15) still covers anything beyond this section.

This is `examples/classes.englishpp`, in full. Its statements are all guard-safe: it only declares class instances, and the one action (`show hero`) acts on a box.

```englishpp
note Classes - Animal, Dog, and Puppy.
Boxx called Animal
Boxx Dog uses Animal
Boxx Puppy uses Dog
make a Dog called rex
make a Dog
make a Puppy
make a box called hero
show hero
```

Its exact generated C++ (byte-for-byte what the compiler emits):

```cpp
#include "englishpp_runtime.h"

using namespace epp;

class Animal { public: };
class Dog : public Animal { public: };
class Puppy : public Dog { public: };

Task MainScript() {
  // Classes - Animal, Dog, and Puppy.
  Dog rex;
  Dog dog1;
  Puppy puppy1;
  Box hero;
  hero.Show();
  co_return;
}

int main() {
  return Run(MainScript());
}
```

Note how the class definitions sit above `MainScript` in definition order, the short form `Boxx Dog` produced the same `class Dog : public Animal` line as the long form would, bare instances auto-named per class (`dog1`, `puppy1`), and the box `hero` is the only thing acted on.

---

## 23. Types: numbers, decimals, text, letters, and yes-or-no values

Section 4 introduced kinds in general; this section is the full table for the built-in value kinds, with the exact C++ each one becomes. A kind word in a making line is written with an article (`a number`, `a text`), and the plural forms (`numbers`, `decimals`, `texts`, `letters`) mean the same kind in collection phrases (Section 27).

| English++ kind word | Kind | Exact C++ type |
|---|---|---|
| `number` | whole number | `int` |
| `decimal` | number with a fraction | `double` |
| `text` | words in quotes | `std::string` |
| `letter` | one character in single quotes | `char` |
| `yes or no` | `yes` / `no` (also `true` / `false`) | `bool` |
| `box` | a box in the show | `Box` |
| a class name, e.g. `Dog` | an instance of that class (Section 22) | `Dog` |

Making one, with and without a starting value:

```englishpp
make a number called count with 5
make a decimal called price with 2.5
make a text called greeting with "hello"
make a letter called mark with 'a'
make a yes or no called done with yes
make a number called total
```

Exact C++ translation:

```cpp
int count = 5;
double price = 2.5;
std::string greeting = "hello";
char mark = 'a';
bool done = true;
int total;
```

Rules:

- A starting value must fit the kind: a number needs a whole number (`with 5`, not `with 2.5`), a decimal takes any number, a text needs words in quotes, a letter needs exactly one character in single quotes, a yes-or-no needs `yes` / `no` (or `true` / `false`).
- A name made with `let` (Section 6.1) has no tracked kind — the compiler calls it a "value" and lets it stand wherever a value is needed. A name made with `make a <kind>` has a tracked kind, and the compiler checks it: storing a text into a number, or comparing a number with a text, is a plain-English error, never C++ that cannot compile. Numeric kinds mix (an `int` may stand where a `double` is expected, and comparisons mix `int` with `double`).
- Names keep their exact spelling and keywords do not care about capitals (Section 2). `count` and `Count` are different names.

## 24. Pointers: pointing at things

A pointer is a name that points at another thing, rather than holding a value itself. Pointers nest: a pointer to a pointer is allowed, and a pointer to a collection is allowed. Each extra level adds one `*` in the C++.

```englishpp
make a number called count with 5
make a pointer to a number called p
point p at count
print the value p points to
set the value p points to to 9
point p at nothing
```

Exact C++ translation:

```cpp
int count = 5;
int* p;
p = &count;
std::cout << *p << std::endl;
*p = 9;
p = nullptr;
```

Rules and forms:

- Declare with `make a pointer to a <kind> called <name>`, or declare-and-point in one line with `pointing at`: `make a pointer to a number called p pointing at count`.
- Point later with `point <pointer> at <thing>`. The thing must be a variable of the pointed kind (or a collection position of that kind, or the value another pointer points to); pointing a number-pointer at a text is a plain-English error ("A pointer can only point at its own kind.").
- `point <pointer> at nothing` and `set <pointer> to nothing` both mean `nullptr`. `nothing` only works with pointers.
- Read and write through a pointer with the phrase `the value <pointer> points to`, which becomes `*<pointer>` in C++ — as a value (`print the value p points to`) and as a set-target (`set the value p points to to 9`).
- A pointer itself is not a value you can print or store into a number: `print p` and `set count to p` are errors. Print or set the value it points to instead.
- Pointers pass to functions by value (Section 26): the function receives a copy of the pointer, so it can change the pointed-to value but pointing it elsewhere inside the function does not move the caller's pointer.

### Multi-level pointers and pointers to collections

```englishpp
make a number called count with 5
make a pointer to a number called p
make a pointer to a pointer to a number called pp
point p at count
point pp at p
print the value p points to
make a vector of numbers called scores with 1 and 2
make a pointer to a vector of numbers called ps
point ps at scores
```

Exact C++ translation:

```cpp
int count = 5;
int* p;
int** pp;
p = &count;
pp = &p;
std::cout << *p << std::endl;
std::vector<int> scores = {1, 2};
std::vector<int>* ps;
ps = &scores;
```

Rules: pointing follows the same kind rule at every level — `point pp at p` works because `p` is a pointer to a number and `pp` points at exactly that kind; pointing `pp` at `count` (a number, not a pointer to a number) is a kind error. Reading through one level works as before (`the value p points to` is `*p`); reading through two levels means reading the value the first pointer points to, then reading through that (`the value pp points to` is `*pp`, a pointer, which itself is not printable — print `the value p points to` after pointing `p` at the same target, or point through in steps). A dereferenced collection is most useful passed to a function, which takes collections by reference:

```englishpp
define showcount taking a vector of numbers called v:
print the count of v
end showcount
make a vector of numbers called scores with 1 and 2
make a pointer to a vector of numbers called ps
point ps at scores
call showcount with the value ps points to
```

```cpp
void showcount(std::vector<int>& v) {
  std::cout << v.size() << std::endl;
}
std::vector<int> scores = {1, 2};
std::vector<int>* ps;
ps = &scores;
showcount(*ps);
```

Two gaps, honestly stated: `the count of` and `for each` over a dereferenced collection do not parse, because those forms take a name, not a phrase — `the count of scores` works (a name), `the count of the value ps points to` does not, and neither does `add 9 to the value ps points to`. Whole-collection assignment does not exist either: `set copy to the value ps points to` errors, because `set` works on single values. Pass the dereferenced collection to a function when you need to count, iterate, or grow it.

## 25. References: another name for the same thing

A reference is a second name for a thing that already exists. Unlike a pointer, a reference must start out referring to something, it can never be re-pointed, and using it is exactly like using the original thing — the compiler calls this "transparent".

```englishpp
make a number called count with 5
make a reference to a number called r for count
set r to 12
print count
```

Exact C++ translation:

```cpp
int count = 5;
int& r = count;
r = 12;
std::cout << count << std::endl;
```

The last line prints `12`: setting `r` set `count`, because `r` *is* `count` under another name.

Rules:

- Declare with `make a reference to a <kind> called <name> for <thing>`. The `for` clause is required — a reference with nothing to refer to is an error — and the thing must be of the referred kind.
- A reference to a reference is not version 1 yet.
- References are transparent everywhere: a reference to a number compares like a number, prints like a number, and can be passed where a number is expected. The compiler tracks the referred kind, not the word "reference", when it checks kinds.
- As a function parameter (Section 26), an explicit reference parameter stays a reference, so the function can change the caller's variable. A plain number parameter, by contrast, is a copy — changing it inside the function does not change the caller's variable.

## 26. Functions: defining your own blocks

A function is a named block of lines you can call by name, with optional parameters and an optional given-back value. Functions are defined at the top level, before `MainScript`, in definition order — exactly like classes (Section 22).

```englishpp
define same taking a number called x giving back a number:
give back x
end same
define move_box taking a box called b:
move b by 2, 0, 0
end move_box
make a box called hero
call move_box with hero
print call same with 4
```

Exact C++ translation, in definition order (functions are emitted before `MainScript`, in the order they were defined):

```cpp
int same(int x) {
  return x;
}
void move_box(Box& b) {
  b.Move(2, 0, 0);
}

Task MainScript() {
  Box hero;
  move_box(hero);
  std::cout << same(4) << std::endl;
  co_return;
}
```

The full define form:

```englishpp
define <name> [taking <param> [and <param>...]] [giving back a <kind>]:
<body lines>
end <name>
```

- **No `taking`** means no parameters: `define wave:` … `end wave`.
- **No `giving back`** means the function gives nothing back (C++ `void`). A void function can still be called as a statement; it cannot be used as a value (`print call wave` is an error: "wave doesn't give anything back, so it can't be used as a value.").
- **A parameter** is written `[a|an] <kind> called <name>`, where the kind is any kind in this manual — `a number`, `a vector of numbers`, `a pointer to a number`, `a reference to a number`, `a box`, or a class name (`a Dog`). Parameters may not share a name with each other or with the function.
- **Giving back** is written `give back <literal|variable|call|phrase>` inside the body, which becomes `return ...;` (or `co_return ...;` in a waiting function — see the waiting bullet below). Giving back a value of the wrong kind, or giving back anything from a void function, is a plain-English error. Giving back outside a function is an error too.
- **Calling:** as a statement, `call <name> [with <arg> [and <arg>...]]` becomes `<name>(args);`; as a value, `call <name> with ...` appears wherever a value goes (`print call same with 4`, `set total to call same with 9`). Argument count and kinds are checked in plain English.
- **Definitions hoist.** Calling a function before its `define` line works: names are registered from a scan of the whole program before statements compile (Section 22.4), so a call above its definition, and two functions calling each other, both compile. When a function calls a function defined LATER than itself, the compiler emits forward declarations (prototypes) for all functions before the definitions, so the later function is declared before its first use. A function *can* call itself: the function is registered before its body is parsed, so recursion parses (whether it terminates at run time is the program's business — a recursive countdown can now be written with a calculation; see Section 30).
- **The `end` line is required and must name the function:** `end same` closes `define same`. A mismatched name, or a missing `end` at the end of the file, is a plain-English error. `end` with no `define` before it is an error, and a `define` inside a loop, an `if`, an event, or after another instruction on the same line is an error — a function definition belongs on its own top-level line, exactly like a class definition.
- **Scope: a body sees only its parameters plus its own locals.** Naming a main-program variable inside a function is a plain-English error that says how to fix it: `'speed' isn't inside greet — pass it in: define greet taking a number called speed:`. Locals made inside a function (including boxes) do not leak out, and `it` starts unset inside a function — parameters do not set it. Loop-variable `it` scoping inside functions follows the existing loop rule (Section 9): inside a `for each` body `it` means the loop's current item, and it is restored afterwards.
- **`wait` works inside a function — that function becomes a WAITING function.** No new syntax: a function whose body contains a `wait` is a coroutine, exactly like the main program. A waiting function that gives nothing back emits `Task`; one that gives back a value emits `TaskValue<that type>`, and its `give back` emits `co_return` instead of `return`. Calls to a waiting function emit `co_await`, in statement position and value position alike. Calls to a plain function emit exactly as before — a plain function gets no `Task` wrapper, and its output never changes. Caller rules, enforced in plain English: the main program may call anything; a waiting function may call anything; a PLAIN function may NOT call a waiting function (the error names both, e.g. `plain is a plain function, but waiter waits. A plain function can't call a waiting function — call waiter from the main program, or from a function that waits too.`). A method can wait too (Section 22.8a) — the same mechanism, called a waiting method there. An event body, though, can neither wait nor call a waiting function or method: it runs all at once, not as a coroutine.
- **Boxx stays top-level only:** a class definition inside a function body is the top-level error from Section 22.

How arguments travel (passing):

| Parameter kind | Travels as | Exact C++ |
|---|---|---|
| number, decimal, text, letter, yes or no | by value (a copy) | `int`, `double`, `std::string`, `char`, `bool` |
| pointer to a kind | by value (a copy of the pointer) | `int*`, … |
| explicit reference to a kind | by reference (stays a reference) | `int&`, … |
| box, class instance, vector, list, array | by reference | `Box&`, `Dog&`, `std::vector<int>&`, … |

So a function that takes a box can move the caller's box (`move b by 2, 0, 0` moves `hero`), and a function that takes a vector can add to the caller's vector — but a function that takes a number cannot change the caller's number (pass a reference parameter if that is what you want).

Boxes made inside a function, honestly stated: it depends on whether the function waits. A box made inside a *plain* function is constructed (and joins the world list), but the function returns synchronously, before the next frame is drawn, and the box is then destroyed — and the runtime removes a destroyed box from the world list, so it leaves no dangling entry and no garbage on screen. The net effect is: **boxes made inside a plain function never appear on screen — the window only draws between steps, and the box is gone before the next frame.** A box made inside a *waiting* function DOES appear while the function waits: the function's locals stay alive across frames (that is what makes the wait work), so the box is in the world list when frames draw, and only disappears when the function finally returns. If you want a box to be seen from a plain function, make it in the main program (or pass a main-program box into the function by reference) instead.

Worked waiting-function example:

```englishpp
define double_after_wait taking a number called n giving back a number:
wait 1 seconds
give back n + n
end double_after_wait
make a number called total
set total to call double_after_wait with 21
print total
```

Exact C++ translation:

```cpp
TaskValue<int> double_after_wait(int n) {
  co_await WaitSeconds(1.0f);
  co_return (n + n);
}

Task MainScript() {
  int total;
  total = co_await double_after_wait(21);
  std::cout << total << std::endl;
  co_return;
}
```

Note the three changes a waiting function makes, and nothing else: `TaskValue<int>` instead of `int`, `co_return` instead of `return`, and `co_await` on the call. A waiting function that gives nothing back is `Task` instead of `void`, and a plain function calling it is the error above — not a silent guess.

## 27. Collections and the standard library

English++ collections are the C++ standard library containers, with English++ words for each one. This section is the explicit word-to-standard-type mapping — nothing here is a custom English++ container.

| English++ word | Standard type | Example declaration |
|---|---|---|
| `vector of <kind>` | `std::vector<...>` | `make a vector of numbers called scores` → `std::vector<int> scores;` |
| `list of <kind>` | `std::list<...>` | `make a list of texts called words` → `std::list<std::string> words;` |
| `array of <N> <kind>` | `std::array<..., N>` | `make an array of 3 numbers called arr1` → `std::array<int, 3> arr1;` |

Collections hold plain kinds in version 1 (numbers, decimals, texts, letters, yes-or-no values, boxes, class instances) — not pointers and not other collections.

| English++ phrase | Exact C++ |
|---|---|
| `make a vector of numbers called scores with 1 and 2` | `std::vector<int> scores = {1, 2};` |
| `make an array of 3 numbers called arr1 with 1 and 2 and 3` | `std::array<int, 3> arr1 = {1, 2, 3};` |
| `the count of scores` | `scores.size();` (as a value: `scores.size()`) |
| `the count of boxes` | `boxes.size()` — the runtime counts boxes currently in the world, not counting removed ones, and counting never disturbs iteration |
| `scores at 0` (as a value, or as a set-target) | `scores[0]` |
| `add 5 to scores` | `scores.push_back(5);` |
| `for each score in scores: print score` | `for (auto& score : scores) { std::cout << score << std::endl; }` |

Rules:

- **Starting values** are literals or calculations, joined by `and` (see Section 30). An array needs exactly its size in starting values — an array of 3 numbers with 2 values is an error.
- **Adding** works for vectors and lists only. Arrays cannot grow: `add 4 to arr1` is the plain-English error "arrays can't grow — make a vector if you need to add." Adding a value of the wrong kind is an error naming what the collection holds ("scores holds numbers, but "hi" is a text."). Adding to something that is not a vector or list is an error too.
- **Adding a box moves it.** A box is a thing in the world, not a copyable value (its C++ copy is deleted), so `add hero to pack` becomes `pack.push_back(std::move(hero));` and the runtime move transfers the box's world presence into the collection. The box is then the collection's element, not a second copy.
- **`for each` works over any collection variable** — a vector, a list, or an array — as well as over `boxes` and over `them` (the most recent collection, Section 9). The loop variable's kind is the element kind: over a vector of numbers it is a number, over a vector of boxes it is a box. Inside the body, `it` means the loop's current item and is restored afterwards, exactly as for `boxes`. Looping over something that is not a collection ("'count' is not a group") or over an unknown group ("I don't know the group 'mystery'.") is a plain-English error.
- **Positions** take a whole-number literal, a number variable, or a calculation (see Section 30). Positions work for vectors, lists, and arrays; `boxes` has no positions (use `for each` over `boxes`, or a vector of boxes, if positions are needed).
- A whole collection is not a value: printing it, or comparing it, is an error (Section 28). Act on its count, one position, or each member instead.

Worked example — `examples/collections.englishpp`:

```englishpp
note Collections - a vector, adding, counting, positions, and for each.
make a vector of numbers called scores with 10 and 20
add 30 to scores
print the count of scores
print scores at 0 and scores at 2
for each score in scores: print score
```

```cpp
std::vector<int> scores = {10, 20};
scores.push_back(30);
std::cout << scores.size() << std::endl;
std::cout << scores[0] << " " << scores[2] << std::endl;
for (auto& score : scores) { std::cout << score << std::endl; }
```

## 28. Printing

`print` writes values to the console (standard output), one line per `print` line, with a space between items. It works in the main program, inside functions, and inside loop and `if` bodies.

```englishpp
print count and price and greeting
print the count of scores and scores at 0
print call same with 4
```

Exact C++ translation (for the first line, with `count` a number, `price` a decimal, `greeting` a text):

```cpp
std::cout << count << " " << price << " " << greeting << std::endl;
```

Rules, stated exactly:

- **Always ends the line.** Every `print` ends with `std::endl` — there is no form that prints without ending the line.
- **A space between items.** Items joined by `and` are separated by exactly one space in the output (`<< " " <<` between items, not after the last one).
- **Printable:** numbers, decimals, texts, letters, yes-or-no values, `let` values (whose kind is not tracked), and any phrase resolving to one of those — the count of a collection, a collection position of a printable kind, the value a pointer points to (if printable), and a call returning a printable kind.
- **Yes-or-no values print as `1`/`0`.** That is `std::cout`'s default for `bool` — there is no true/false spelling in version 1 output. `print done` where `done` is `yes` prints `1`.
- **Not printable:** a box (`I don't know how to print a box yet — print numbers, text, and counts.`), a class instance, a whole collection, a pointer itself, and a collection element of one of those kinds. Print the count, one printable position, or the value a pointer points to instead.
- Printing needs the runtime's `<iostream>` include, which the runtime header now provides; a `print` program compiles without any extra include in the generated code.

---

## 29. Sharing code between files: `include`

One file can pull in another file's lines, word for word, before anything is parsed. The form is one line, on its own, with a quoted path:

```englishpp
include "helpers.englishpp"
```

Worked example — `examples/include_demo.englishpp` includes `examples/helpers.englishpp`, which defines the function `double_it` and the class `Dog`:

```englishpp
include "helpers.englishpp"
print call double_it with 21
make a Dog called rex
print call double_it with 3
```

Exact C++ translation (the main program's lines only; the function and the class from `helpers.englishpp` are emitted before `MainScript`):

```cpp
std::cout << double_it(21) << std::endl;
Dog rex;
std::cout << double_it(3) << std::endl;
```

Rules, stated exactly:

- **Own line only.** An `include` line stands alone. Leading whitespace is allowed. Anything after the closing quote on the same line makes the line malformed (see the error list below).
- **The path is relative to the file doing the including.** A main file in a project folder that includes `"helpers.englishpp"` reads the `helpers.englishpp` next to it. A nested include is relative to *its* file's folder, not the main file's: if the main file includes `"include/outer.englishpp"`, and `outer.englishpp` includes `"inner.englishpp"`, that second path is read from the `include/` folder.
- **Extension-less paths are tried with `.englishpp` added.** `include "include/greet"` first tries the path exactly as written, then tries `include/greet.englishpp`. Both spellings produce the same C++:

```englishpp
include "include/greet"
print call greet with 4
```

```cpp
std::cout << greet(4) << std::endl;
```

- **Splice, then parse.** Inclusion is a pure textual splice that happens *before* parsing, and it is recursive: an included file's own `include` lines are spliced in turn. Definitions hoist across the whole spliced program (Section 22.4): calling a function on a line *above* the line that includes its definition now works, because the definition is registered before statements compile — exactly as if the definition came earlier in one file:

```englishpp
print call greet with 4
include "include/greet.englishpp"
```

```cpp
std::cout << greet(4) << std::endl;
```

The program prints 5. Only definitions hoist, never statements: a statement still runs in order, and a class's fields and methods are usable only once the class's body has been read — so making an instance above its `include` line works, but reading its field on a line above that `include` line still errors, because the body has not been read yet. Scope rules and top-level rules work on the spliced program, not on each file separately. An `include` line inside a function body splices its statements *into that body*: an ordinary statement spliced there works, but a spliced `Boxx` or `define` line still gets the existing top-level-only error, now carrying the included file's name:

```englishpp
define f:
include "include/dogboxx.englishpp"
end f
```

```
include/dogboxx.englishpp: Line 1: A class definition belongs on its own line at the top level. It can't sit inside a loop, an if, or an event, or after another instruction on the same line.
```

- **No dedup, no guards.** The same file included twice is spliced twice. That is fine for a file with no definitions, but a file that defines something will then define it twice, which is an error. This is the diamond rule: if two files both include the same defining file, and the main file includes both of them, the shared file is spliced twice and the second definition errors. Keep shared definitions in one file included once by the main program. When both definitions land in the *same* included file, the error has no extra clause — only the file prefix identifies it (see the redefinition clause below):

```englishpp
include "include/helper.englishpp"
include "include/helper.englishpp"
```

```
include/helper.englishpp: Line 1: I already know a function called 'helper'. Each function needs its own name.
```

- **Cycles are an error, and the chain names only included files.** If A includes B and B includes A again, the error lists the chain from the first included ancestor to the repeating file; the main file is never part of the chain:

```englishpp
include "include/cycle_a.englishpp"
```

```
include/cycle_b.englishpp: Line 1: include cycle: include/cycle_a.englishpp → include/cycle_b.englishpp → include/cycle_a.englishpp
```

- **Depth cap: 32 levels.** Includes nest at most 32 levels deep; the 33rd nested include errors, naming the file whose `include` line hit the cap:

```
include/d32.englishpp: Line 1: include depth is too deep — includes nest at most 32 levels.
```

- **A mid-line `include` is not spliced.** An `include` that appears as a loop or `if` body (after a colon) or after a comma is not an `include` line at all: it falls through to the ordinary parser, which does not know the word. The same applies to an `include` after another instruction on the same line:

```englishpp
repeat 2 times: include "include/greet.englishpp"
```

```
Line 1: I don't know the word 'include'. Words I do know here: make, create, spawn, let, set, move, spin, grow, shrink, show, hide, destroy, play, wait, if, otherwise, repeat, for, when, note, code.
```

### 29.1 Include once: the guard form

Plain `include` never deduplicates: including the same defining file twice defines everything in it twice, and the second definition errors. That behavior never changes. The guard is a NEW form, spelled differently, for when you want "include this file, but only the first time":

```englishpp
include once "helpers.englishpp"
```

Rules, stated exactly:

- `include once` follows every rule of plain `include` (own line only, quoted path, relative to the including file, extension-less fallback, recursive splice, cycle error) with one addition: the compiler remembers every file already brought in by an `include once` line in the same build. If an `include once` line names a file already in that set, its lines are skipped entirely — no splice, no redefinition, and no cycle error even if the file includes itself through `once` lines.
- Plain `include` never touches the remembered set, in either direction. `include` then `include once` still splices on the `once` (redefinition error, because the plain include did not guard it), and `include once` then plain `include` still splices on the plain line (redefinition error, because the plain line does not check the set). Only `once` then `once` skips.
- A malformed `include once` line mirrors the plain message: `include once` without a quoted path errors `include once needs a quoted path, like 'include once "helpers.englishpp"'.`
- The remembered set is per build, not per file: two different files that both `include once` the same helper share one entry, so the helper is spliced only for the first of them.

### 29.2 The redefinition clause

Only the three `I already know a …` messages gain an extra clause, and only when the first definition is in a *different* file. Same-file redefinitions are byte-identical to before. The clause names the file and line of the first definition:

```englishpp
include "include/countdef.englishpp"
make a number called count with 2
```

```
Line 2: I already know a thing called 'count'. Give the new one a different name. (first defined in include/countdef.englishpp at line 1)
```

```englishpp
include "include/dogdef.englishpp"
Boxx called Dog
```

```
Line 2: I already know a class called 'Dog'. Each class needs its own name. (first defined in include/dogdef.englishpp at line 1)
```

### 29.3 The full error list

Error messages from an included file are prefixed with that file's display path (relative to the main file's folder), as in the examples above; errors in the main file carry no prefix. The message itself always starts with `Line N:`, where N is the line in the file the message came from.

| Situation | Exact message (after any file prefix) |
|---|---|
| Malformed line (no quotes, or anything after the closing quote) | `Line N: include needs a quoted path, like 'include "helpers.englishpp"'.` |
| Malformed `include once` line (no quotes, or anything after the closing quote) | `Line N: include once needs a quoted path, like 'include once "helpers.englishpp"'.` |
| File not found | `Line N: I can't find the included file '<quoted>' included from <including file display, or 'the main file'>.` For example, from the main file: `Line 1: I can't find the included file 'include/nope.englishpp' included from the main file.` |
| Cycle | `Line N: include cycle: <d1> → <d2> → <repeated>` |
| Too deep | `Line N: include depth is too deep — includes nest at most 32 levels.` |
| Mid-line `include` (loop/`if` body, after a comma) | `Line N: I don't know the word 'include'. Words I do know here: make, create, spawn, let, set, move, spin, grow, shrink, show, hide, destroy, play, wait, if, otherwise, repeat, for, when, note, code.` |
| No file reader available (only for a caller of the compiler that supplies none; the IDE and the golden driver always supply one) | `Line N: I can't read '<quoted>' here — no file reader is available.` |

In the IDE, `include` is keyword-coloured like the other keywords. The console shows errors as `file: Line N: …`, and clicking an error opens the named file when it differs from the file currently in the editor; if that file cannot be opened, the message still shows and nothing crashes.

## 30. Doing arithmetic: math expressions

English++ now has calculations. The operators are `+`, `-`, `*`, `/`, and `%`, with parentheses and unary minus (a minus in front of a value, as in `-x`).

### 30.1 Precedence: what binds tightest

| Tightest first | |
|---|---|
| Parentheses `( … )` | Work out the bracketed part first. |
| Unary minus `-e` | Next tightest. |
| `*`, `/`, `%` | Then these, left to right. |
| `+`, `-` | Loosest, left to right. |

So `1 + 2 * 3` is `1 + (2 * 3)`, and `10 - 4 - 3` is `(10 - 4) - 3`, because operators at the same level work left to right.

### 30.2 How expressions are printed as C++

Every binary operation is fully parenthesised in the C++; a unary minus is `(-e)`; a bare primary (a lone number, name, or phrase) stays bare, never wrapped. A parenthesised primary keeps its parentheses, and a parenthesised binary or unary is not wrapped twice. All of the following are exact, with `x` and `y` numbers:

```englishpp
set x to x + y
set x to 1 + 2 * 3
set x to (1 + 2) * 3
set x to ((1 + 2)) * 3
set x to -x + 5
set x to 5
```

```cpp
x = (x + y);
x = (1 + (2 * 3));
x = ((1 + 2) * 3);
x = (((1 + 2)) * 3);
x = ((-x) + 5);
x = 5;
```

Note the last line: `set x to 5` becomes `x = 5;`, never `x = (5);`. Parentheses you write are kept; parentheses the compiler adds are never doubled.

### 30.3 Where expressions work

Expressions work in exactly these places, and no others:

- The right-hand side of `let` (see the let rule in §30.8) and of `set`.
- Call arguments (`call same with 1 + 2`).
- `give back` values inside a function.
- `print` items.
- Both sides of a comparison in a condition.
- A collection position (`scores at …`), including as a `set` target.
- The amount added by `add … to …`.
- Items in a collection's `with` list.
- A `wait` duration.

Examples, all exact:

```englishpp
set x to call same with 1 + 2
give back 1 + 2
add 1 + 2 to scores
make a vector of numbers called s2 with 1 + 2 and 3 * 4
if x + 1 is more than 5, print x
print x + 1 and 2 * 3
wait count + 1 seconds
```

```cpp
x = same((1 + 2));
return (1 + 2);
scores.push_back((1 + 2));
std::vector<int> s2 = {(1 + 2), (3 * 4)};
if ((x + 1) > 5) { std::cout << x << std::endl; }
std::cout << (x + 1) << " " << (2 * 3) << std::endl;
co_await WaitSeconds((count + 1));
```

Two things those examples show. First, **`and` never operates**: it ends one expression and starts the next. In `print x + 1 and 2 * 3`, the two printed items are `(x + 1)` and `(2 * 3)`, not one sum; in the `with` list, `and` separates the starting values. Second, **verb arguments are not generalised**: `move`, `spin`, `grow`, `shrink`, `show`, and `hide` still take plain numbers and names only. Writing an expression where a verb argument goes is an argument-count error, not a calculation:

```englishpp
move hero by 1 + 1, 0, 0
```

```
Line 2: move needs 3 arguments, but only 1 were given. Write it like 'move hero by 1, 0, 0'.
```

Likewise, a typed value's starting value stays literal-only — it is not one of the listed expression sites:

```englishpp
make a number called count with 1 + 2
```

```
Line 1: I don't know what to do with '+' here.
```

### 30.4 Kind rules: what you may calculate with

`+`, `-`, `*`, `/`, and `%` need number or decimal operands, with one exception: `+` also joins text to text. The kind of an expression follows its operands:

| Expression | Kind |
|---|---|
| Whole number `op` whole number | Whole number (`int`) |
| Any operand a decimal | Decimal (`double`) — ordinary C++ promotion, emitted as written: `set d to x + d` becomes `d = (x + d);` |
| Text `+` text | Text |
| `the count of X` | Whole number |
| `X at N` | The element kind of `X` |
| `the value p points to` | The kind `p` points to |
| `call f …` | The kind `f` gives back |

A `let` value (whose kind is not tracked) is permissive: with a number it gives that number's kind, with text (for `+`) it gives text, and with another value it stays a value. A void function used as a value is the existing error, unchanged:

```englishpp
define wave:
print 1
end wave
make a number called x with 0
set x to call wave
```

```
Line 5: wave doesn't give anything back, so it can't be used as a value.
```

### 30.5 Text: joining with `+` only

Joining text works with `+`, and a quoted literal on either side is wrapped in `std::string(…)` so that two quoted literals still compile as C++. A value that is already a `std::string` is not wrapped again:

```englishpp
set g to g + "!"
set g to "a" + "b"
```

```cpp
g = (g + std::string("!"));
g = (std::string("a") + std::string("b"));
```

Text with any other operator, or text added to a non-text, is an error:

```englishpp
set g to g + 1
```

```
Line 3: you can't add text and a number together — add text to text, or numbers to numbers.
```

```englishpp
set g to g - "!"
```

```
Line 2: text can't be used with '-' — text only joins with +; use numbers for calculations.
```

(The second message names the operator used: `-`, `*`, `/`, or `%`.)

Any other non-numeric operand — a letter, a yes-or-no value, a box, a class instance, a collection, or a pointer itself — gives the same shape of message, naming the operand's kind:

| Operand | Message |
|---|---|
| A letter | `Line N: I can't do math with a letter — use numbers for calculations.` |
| A yes-or-no value | `Line N: I can't do math with a yes or no — use numbers for calculations.` |
| A box | `Line N: I can't do math with a box — use numbers for calculations.` |
| A class instance, e.g. a `Dog` | `Line N: I can't do math with a Dog — use numbers for calculations.` |
| A collection, e.g. a vector of numbers | `Line N: I can't do math with a vector of numbers — use numbers for calculations.` |
| A pointer, e.g. to a number | `Line N: I can't do math with a pointer to a number — use numbers for calculations.` |

Unary minus on such an operand gives the same message.

### 30.6 Division, remainder, and the whole-number gotcha

Division of two whole numbers is whole-number division, emitted as written:

```englishpp
set x to x / 2
set x to 5 / 2
```

```cpp
x = (x / 2);
x = (5 / 2);
```

**The gotcha, stated plainly: `5 / 2` is `2` for whole numbers and `2.5` for decimals — and the decision is made from the operands, not from where the answer is stored.** Storing a whole-number division into a decimal still gives `2`, because the division happens in whole numbers first. To get `2.5`, make at least one operand a decimal:

```englishpp
set d to 5 / 2
set d to 5.0 / 2
```

```cpp
d = (5 / 2);
d = (5.0 / 2);
```

The first line stores `2` into `d`; the second stores `2.5`.

Remainder (`%`) follows the same kind rule, with one C++ twist: whole-number remainder stays `%`, but any decimal operand becomes `fmod` (the runtime header already includes `<cmath>`, so no extra include is needed):

```englishpp
set x to x % 3
set d to d % 2.0
set d to x % 2.0
```

```cpp
x = (x % 3);
d = fmod(d, 2.0);
d = fmod(x, 2.0);
```

Dividing by a statically known zero is caught at compile time — for `/` only, and only when the divisor is literally zero (`0`, `0.0`, `0.00`, or a parenthesised or negated form of those):

```englishpp
set x to 5 / 0
```

```
Line 2: I can't divide by zero — a divisor of 0 has no answer. Use a number that isn't zero.
```

`5 % 0` is *not* caught by this check (it still compiles); the check is for `/` only.

An unclosed parenthesis is its own error:

```englishpp
set x to (1 + 2
```

```
Line 2: I expected a closing bracket ')' after this calculation.
```

### 30.7 The index-greedy rule — read this before using `at` in a calculation

**A position index eats the whole expression that follows it.** `scores at 0 + 1` does *not* mean "the item at position 0, plus 1". It means "the item at position `0 + 1`" — that is, the item at position 1. To do math *on* an item, put the position phrase in parentheses first:

```englishpp
set x to scores at 0 + 1
set x to (scores at 0) + 1
```

```cpp
x = scores[(0 + 1)];
x = ((scores[0]) + 1);
```

The first line reads position 1; the second reads position 0 and adds 1 to it. The same greed applies to a `set` target:

```englishpp
set scores at 0 + 1 to 99
```

```cpp
scores[(0 + 1)] = 99;
```

That line writes position 1, not position 0. A position that is not a whole number (or a number you made) is an error; an empty position keeps the old message:

```englishpp
print scores at 2.5
```

```
Line 2: a position must be a whole number or a number you made, like 'scores at 0'.
```

Phrases inside expressions work as you would expect, once the index rule is respected:

```englishpp
set x to the count of scores + 1
set x to the value p points to + 1
```

```cpp
x = (scores.size() + 1);
x = (*p + 1);
```

### 30.8 The let rule, and the counting pattern

`let` accepts exactly three shapes:

- (a) a literal: `let speed be 5` becomes `auto speed = 5;`;
- (b) a parenthesised literal: `let x be (5)` becomes `auto x = (5);`;
- (c) any expression containing at least one operator: `let x be 5 + 1` becomes `auto x = (5 + 1);`, and `let x be count + 1` (with `count` a number) becomes `auto x = (count + 1);`.

A bare name — or a parenthesised bare name, or any other bare non-literal phrase — keeps the exact old error:

```englishpp
make a number called speed with 5
let x be speed
```

```
Line 2: let needs a literal value, like 'let speed be 5', or a calculation. A name on its own isn't a value yet; use 'set' for a name.
```

The message says exactly what it means: a bare name is not a value. Use `set` for a name, exactly as the message says.

The pattern you will use most is counting up by one, which is just `set` with an expression whose left side is the variable itself:

```englishpp
set x to x + 1
```

```cpp
x = (x + 1);
```

### 30.9 Waits, collections, and the remaining expression errors

**Waits.** A `wait` duration is now an expression, followed by `seconds`. A bare literal keeps the old float format; any other expression is emitted as written and converts to the float `WaitSeconds` takes:

```englishpp
wait count + 1 seconds
wait 3 seconds
```

```cpp
co_await WaitSeconds((count + 1));
co_await WaitSeconds(3.0f);
```

A non-numeric duration is an error, while a literal-negative wait keeps the old message:

```englishpp
wait greeting seconds
```

```
Line 2: wait needs a number of seconds, like 'wait 3 seconds'.
```

**Collections.** A `with` list now takes expressions, each checked against the element kind. A mismatch names what the collection holds and what the item is — note this message starts with "that collection holds", which is different from the `add` message, which names the collection (`scores holds numbers, …`):

```englishpp
make a vector of numbers called scores with "hi" and 2
```

```
Line 1: that collection holds numbers, but "hi" is a text.
```

(A primitive's `with` is the exception: it stays literal-only, §30.3.)

**Worked example — `examples/math_demo.englishpp`.** It prints computed values in `set`, `print`, conditions, call arguments, positions, and a wait, so running it proves the arithmetic. Its printed lines, in order, are: `6`, `18`, `7`, `9`, `8.5`, `3`, `20`, `11`, `2`, `2.5`, `hi!`, `15`, `6`, `6` — note `20` is the index-greedy position (`scores at 0 + 1` reads position 1), `11` is math on an item (`(scores at 0) + 1`), and `2` is whole-number division (`5 / 2`) next to `2.5` for the decimal form (`5.0 / 2`).

---

---

# Part Two: English++ 2

Everything from here to the appendices is **English++ 2**. It is additive, like every round before it: no older line changed its meaning, and every program that compiled before compiles to the same C++, byte for byte (the golden check in `tests/golden/` proves it for every shipped example). A program that uses an English++ 2 word may get extra `#include` lines under the first line of its C++; a program that uses none gets none.

The aim of English++ 2 is simple to say: **anything you can write in C++, you can write in English++, and you can see the exact C++ it becomes.** Sections 31–39 add the missing language features. Section 40 adds the C++ standard library, as a table the compiler reads. Section 46 says plainly what is still missing.

---

## 31. Blocks: lines that end with a colon

Before English++ 2, the body of an `if` or a loop was one statement on the same line. Now, a line that **ends with a colon** opens a **block**: the lines below it are its body, as many as you like, until the matching `end` line.

```englishpp
if score is more than 10:
  print "big"
  print "really big"
end if
```

```cpp
if (score > 10) {
  std::cout << "big" << std::endl;
  std::cout << "really big" << std::endl;
}
```

Rules, fixed:

- A block starts **its own line**. It can't sit after a comma, or inside a one-line body.
- The spaces at the start of a line are for people. The compiler ignores them; indent the body two spaces so the shape is easy to see. (The Studio does this for you when you press Enter after a colon.)
- Each kind of block has one closing line: `end if`, `end repeat`, `end while`, `end for`, `end check`, `end try`, `end lock`. A `repeat:` block (Section 31.2) closes with `until <condition>` instead.
- Closing the wrong block is a plain-English error that names the open block and its line, like: `this 'end while' doesn't match — the open block is the 'if' from line 4. Close that one first with 'end if'.`
- A block that never closes is an error at the line that opened it.
- Names made inside a block stay inside it (it is a C++ `{ }` scope), and `it` is put back when the block ends — the same rule as one-line bodies (Section 12.5).
- A definition (`Boxx`, `define`, `Choices`) can't sit inside a block.
- The one-line forms still work exactly as before. Use whichever reads better.

### 31.1 If blocks

```englishpp
if score is more than 10:
  print "big"
otherwise if score is more than 5:
  print "medium"
otherwise:
  print "small"
end if
```

```cpp
if (score > 10) {
  std::cout << "big" << std::endl;
} else if (score > 5) {
  std::cout << "medium" << std::endl;
} else {
  std::cout << "small" << std::endl;
}
```

Inside an if block, `otherwise if <condition>:` and `otherwise:` sit on their own lines, each ending with a colon. Once `otherwise:` has appeared, nothing more can follow before `end if`.

### 31.2 Repeat blocks

| English++ | C++ |
|---|---|
| `repeat 3 times:` … `end repeat` | `for (int i = 0; i < 3; ++i) {` … `}` |
| `repeat forever:` … `end repeat` | `while (true) {` … `}` |
| `repeat:` … `until n is more than 5` | `do {` … `} while (!(n > 5));` |

`repeat forever: <statement>` also works on one line. A `repeat:` block always runs its body at least once, then checks its `until` condition. Use `break` to leave any loop early (Section 12.7).

### 31.3 While and for-each blocks

```englishpp
while n is more than 3:
  set n to n - 1
end while
for each s in scores:
  print s
end for
```

```cpp
while (n > 3) {
  n = (n - 1);
}
for (auto& s : scores) {
  std::cout << s << std::endl;
}
```

### 31.4 Counting loops

```englishpp
for i from 1 to 3:
  print "count" and i
end for
for i from 10 down to 0 by 5:
  print i
end for
```

```cpp
for (int i = 1; i <= 3; ++i) {
  std::cout << "count" << " " << i << std::endl;
}
for (int i = 10; i >= 0; i -= 5) {
  std::cout << i << std::endl;
}
```

The count includes both ends. `by` sets the step; `down` counts down. The counting name is made by the loop and lives only inside it. If `from`, `to`, or `by` is a decimal, the counting name is a decimal too. The one-line form is `for i from 1 to 10: print i`.

### 31.5 Check: choosing by value (a C++ switch)

```englishpp
check day:
  if it is 1:
    print "Monday"
  if it is 2 or 3:
    print "Tuesday or Wednesday"
  otherwise:
    print "another day"
end check
```

```cpp
switch (day) {
  case 1: {
    std::cout << "Monday" << std::endl;
    break;
  }
  case 2: case 3: {
    std::cout << "Tuesday or Wednesday" << std::endl;
    break;
  }
  default: {
    std::cout << "another day" << std::endl;
    break;
  }
}
```

Rules, fixed:

- `check` works on whole numbers, letters, and choices (Section 36). Text can't be checked — C++ can't switch on text — so use `if` / `otherwise if`.
- Each case value is a fixed value (a literal or a choice), joined with `or`.
- Every case ends by itself (the compiler writes the `break;`), so there is no falling through from one case into the next.
- `break` directly inside a case is refused: in C++ it would only leave the `check`, not the loop around it, which surprises people. Set a yes-or-no and test it after `end check` instead.
- Inside a `check` block, a line starting `if it is` always starts the next case.

---

## 32. Conditions

A condition is what follows `if`, `otherwise if`, `while`, and `until`. One comparison still becomes exactly `lhs op rhs` (Section 11). English++ 2 adds:

| English++ | C++ |
|---|---|
| `a is 1 and b is 2` | `a == 1 && b == 2` |
| `a is 1 or b is 2` | `a == 1 \|\| b == 2` |
| `not done` | `!done` |
| `not x is 5` | `!(x == 5)` |
| `done` (a yes-or-no on its own) | `done` |
| `n is between 1 and 10` | `(n >= 1 && n <= 10)` |
| `n is even` / `n is odd` | `(n % 2 == 0)` / `(n % 2 != 0)` |
| `n is divisible by 3` | `(n % 3 == 0)` |
| `scores is empty` | `scores.empty()` |
| `name contains "a"` | `(name.find("a") != std::string::npos)` |
| `scores contains 7` | `(std::find(scores.begin(), scores.end(), 7) != scores.end())` |
| `seen contains 7` (a set or map) | `seen.contains(7)` |
| `7 is in scores` | the same as `scores contains 7` |
| `name starts with "A"` / `ends with` | `name.starts_with("A")` / `name.ends_with(...)` |
| `ages has "bob"` | `ages.contains("bob")` |
| `best has a value` / `has no value` | `best.has_value()` / `!best.has_value()` |
| `c is a digit` (also `a letter`, `a space`, `a capital letter`, `a lowercase letter`) | `std::isdigit(static_cast<unsigned char>(c))` |

`not` can go in front of most of these: `is not empty`, `is not between 1 and 10`, `does not contain`. When `and` and `or` mix, `and` groups first (as in C++), and the compiler adds the brackets: `a or b and c` becomes `a || (b && c)`.

A condition is also a **value** wherever a yes-or-no is expected:

```englishpp
make a yes or no called big with score is more than 100
set done to lives is 0 or score is more than 99
give back x is more than y
```

```cpp
bool big = score > 100;
done = lives == 0 || score > 99;
return x > y;
```

---

## 33. Numbers, constants, and changing things in place

### 33.1 More kinds of numbers

| English++ kind | C++ |
|---|---|
| `big number` | `long long` |
| `small number` | `short` |
| `positive number` | `unsigned int` |
| `byte` | `unsigned char` |
| `small decimal` | `float` (a starting literal gets an `f`: `0.5f`) |
| `big decimal` | `long double` (a starting literal gets an `L`) |

Plurals work for collections: `a vector of big numbers`. Mixed calculations follow C++ promotion: a decimal anywhere makes a decimal, a big number makes a big number.

### 33.2 Starting values can be calculations

`make a number called total with lives * 2 + 1` → `int total = ((lives * 2) + 1);`. A lone literal still takes the old exact path, so `make a number called x with 2.5` is still the error it always was (a number needs a whole number).

### 33.3 Constants

```englishpp
make a constant number called max_lives with 3
```

```cpp
const int max_lives = 3;
```

`set` and the other changing words refuse a constant in plain English. A constant made at the **top of the main program** with a plain literal value becomes a C++ global, written above the classes and functions, so every function and method can read it; its old place in the program keeps a comment saying so.

### 33.4 Changing a number in place

| English++ | C++ |
|---|---|
| `add 5 to score` | `score += 5;` |
| `subtract 2 from score` | `score -= 2;` |
| `multiply score by 3` | `score *= 3;` |
| `divide score by 2` | `score /= 2;` |
| `add "!" to greeting` (text) | `greeting += "!";` |

The thing changed may be a name, a position (`add 1 to scores at 0` → `scores[0] += 1;`), or a field (`add 1 to the speed of rex`). On an atomic number (Section 39) these are safe across threads.

### 33.5 Postfix words

| English++ | C++ |
|---|---|
| `x squared` / `x cubed` | `(x * x)` / `(x * x * x)` |
| `2 to the power of 10` | `std::pow(2, 10)` |
| `x rounded` / `rounded down` / `rounded up` | `std::round(x)` / `std::floor(x)` / `std::ceil(x)` |
| `x as a number` / `as a decimal` / `as a letter` / `as a big number` | `static_cast<int>(x)` / `<double>` / `<char>` / `<long long>` |
| `x as text` | `ToText(x)` |
| `price with 2 decimal places` | `WithDecimalPlaces(price, 2)` (a text) |

They bind tightly, to the value just before them: `n + 1 squared` is `n + (1 * 1)`; write `(n + 1) squared` for the other one.

---

## 34. Containers

Every kind below is made with `make`, passes to functions by reference, can be counted with `the count of`, and (except stacks and queues) can be walked with `for each`.

| English++ | C++ |
|---|---|
| `make a map from texts to numbers called ages with "bob" as 9 and "amy" as 7` | `std::map<std::string, int> ages = {{"bob", 9}, {"amy", 7}};` |
| `make an unordered map from texts to numbers called m` | `std::unordered_map<std::string, int> m;` |
| `make a set of numbers called seen with 3 and 1` | `std::set<int> seen = {3, 1};` |
| `make an unordered set of texts called tags` | `std::unordered_set<std::string> tags;` |
| `make a deque of numbers called d with 1 and 2` | `std::deque<int> d = {1, 2};` |
| `make a stack of texts called plates` | `std::stack<std::string> plates;` |
| `make a queue of numbers called line` | `std::queue<int> line;` |
| `make a priority queue of numbers called jobs` | `std::priority_queue<int> jobs;` |
| `make a pair of a number and a text called p with 1 and "one"` | `std::pair<int, std::string> p = {1, "one"};` |
| `make an optional number called best` | `std::optional<int> best;` |
| `make a vector of vectors of numbers called grid` | `std::vector<std::vector<int>> grid;` |
| `make a vector of pointers to Animals called pets` | `std::vector<Animal*> pets;` |
| `make a vector of unique pointers to Animals called zoo` | `std::vector<std::unique_ptr<Animal>> zoo;` |

### 34.1 Adding

`add V to C` picks the right C++ for the container: `push_back` (vector, list, deque), `insert` (set), `push` (stack, queue, priority queue). A map gets items with `set` (below). Adding a class instance to a vector of pointers stores its address: `add rex to pets` → `pets.push_back(&rex);`.

### 34.2 Maps

`ages at "bob"` is the value for a key (`ages["bob"]`), and `set ages at "amy" to 7` sets one (`ages["amy"] = 7;`). Walk the pairs with two names:

```englishpp
for each who and age in ages:
  print who and age
end for
```

```cpp
for (auto& [who, age] : ages) {
  std::cout << who << " " << age << std::endl;
}
```

### 34.3 Positions everywhere

`X at N` now also works on text (`name at 0` is a letter), deques, and maps, and positions chain: `grid at 1 at 0` → `grid[1][0]`, and `set grid at 1 at 0 to 9` sets one.

### 34.4 Pairs, optionals, and smart pointers

- `the first of p` / `the second of p` → `p.first` / `p.second`.
- An optional takes a plain value (`set best to 42`), empties with `set best to nothing` (`best = std::nullopt;`), and is read with `the value in best` or `the value in best or else 0` (`best.value_or(0)`).
- `make a unique pointer to a Dog called d with "Rex"` → `std::unique_ptr<Dog> d = std::make_unique<Dog>("Rex");` (`shared pointer` uses `std::make_shared`). `pointing at nothing` starts empty; `set d to nothing` empties it. `the value d points to` reads through it, `the speed of d` reads a field (`d->speed`), and `d bark` calls a method (`d->bark();`).

### 34.5 Whole collections

`set words to the words in line` replaces a whole collection with another of the same kind. A collection may also be referred to: `make a reference to a set of texts called floor for the things of room` → `std::set<std::string>& floor = room.things;`.

---

## 35. Classes, part two

### 35.1 Making with values: `when made`

```englishpp
Boxx called Dog:
  has a text called name
  when made taking a text called given:
    set name to given
  end when made
end Dog
make a Dog called rex with "Rex"
```

```cpp
class Dog { public:
  std::string name;
  Dog(std::string given) {
    name = given;
  }
};
...
Dog rex("Rex");
```

A class has at most one `when made`. Its closing line is `end when made` (or `end made`). Making an instance checks the values given against it in plain English.

**A child that is made with values must say how to make its parent**, as the very first line of its `when made`:

```englishpp
Boxx called Dog uses Animal:
  when made taking a text called given:
    start as an Animal with given
  end when made
end Dog
```

```cpp
Dog(std::string given) : Animal(given) {
}
```

A child with **no** `when made` of its own is made exactly like its parent (C++ inheriting constructors: `using Animal::Animal;`).

### 35.2 When destroyed

`when destroyed:` … `end when destroyed` runs when the thing goes away → `~Dog() { ... }` (made `virtual` when the class has virtual methods).

### 35.3 Secrets and shared fields

| English++ | C++ |
|---|---|
| `has a secret number called pin` | in a `private:` section |
| `has a family secret number called age` | in a `protected:` section (children can use it) |
| `can secretly think:` | a private method |
| `shares a number called made_so_far with 0` | `static inline int made_so_far = 0;` |

A shared field is read from outside through the class: `the made_so_far of Animal` → `Animal::made_so_far`.

### 35.4 Children that do things their own way (overriding)

A child may write a method its parent already has, with the same things in and the same kind out. The parent's becomes `virtual` and the child's is marked `override`. Through a pointer to the parent, the child's own version runs:

```englishpp
make a pointer to an Animal called pet
point pet at rex
pet speak
```

```cpp
Animal* pet;
pet = &rex;
pet->speak();
```

A pointer to a parent may point at any child (`point pet at tom`).

### 35.5 Must be able to (pure virtual methods)

`must be able to speak giving back a text` (no colon, no body) → `virtual std::string speak() = 0;`. Every child must provide it. A class that still leaves one undone can't be made directly; the error names what is missing.

### 35.6 Methods as values, and methods calling functions

- `call rex rest with 1` uses a method's result as a value (`rex.rest(1)`); `call speak` inside a method calls the object's own method.
- A method may now call a top-level function. When one does, every class is declared and every function gets a prototype above the classes, so the C++ has each declaration in scope (this lifts the old limit in Section 22.10).

### 35.7 Operators

```englishpp
  can be added to a Spot called other giving back a Spot:
    give back call make_spot with x + the x of other and y + the y of other
  end added
  can be equal to a Spot called other:
    give back x is the x of other and y is the y of other
  end equal
```

```cpp
  Spot operator+(const Spot& other) const {
    return make_spot((x + other.x), (y + other.y));
  }
  bool operator==(const Spot& other) const {
    return x == other.x && y == other.y;
  }
```

The six forms are `can be added to`, `subtracted from`, `multiplied by`, `divided by` (closing `end added`, `end subtracted`, …), `equal to` (`==`, also gives `!=`), and `less than` (`<`, which also lets `sort` order them). After that, `p1 + p2` and `if p3 is p4` work on the class.

### 35.8 Owned objects

`add a new Dog with "Fido" to zoo` → `zoo.push_back(std::make_unique<Dog>("Fido"));` — for a vector of unique (or shared) pointers to a class or one of its parents.

### 35.9 Names already taken

A class, choices, or function may not be named after something every program already uses (raylib's `Color`, `Vector3`, `Camera`, ..., and the runtime's `Box`, `Task`, `Run`, ...). The compiler says so in plain English instead of making C++ that can't compile.

### 35.10 Methods may call methods written below them

Every method header of a class is read before any body, so a method may call one written further down — as in C++.

### 35.11 Leaving early

In a function or method that gives nothing back, `give back` on its own (or `give back nothing`) leaves at once: `return;` (`co_return;` in a waiting one).

### 35.12 Returning collections and objects

A function or method that gives back a collection or a class instance it **made itself** (or a calculation) returns it by value; one that gives back something it was handed returns a reference, as before. Before English++ 2, a function giving back its own local vector returned a reference to it — C++ that compiled but read freed memory. That case is now correct.

---

## 36. Choices (enum class)

```englishpp
Choices called Colour: red, green, and blue
make a Colour called shade with green
if shade is green, print "it is green"
print shade
```

```cpp
enum class Colour { red, green, blue };
inline std::ostream& operator<<(std::ostream& out, Colour value) {
  const char* names[] = {"red", "green", "blue"};
  return out << names[static_cast<int>(value)];
}
...
Colour shade = Colour::green;
if (shade == Colour::green) { std::cout << "it is green" << std::endl; }
std::cout << shade << std::endl;
```

A choice word is used on its own (`green`); each choice word belongs to one set of choices. `print` shows the word. Choices work in `check` (Section 31.5) and as class fields. Define choices before the lines that use them.

---

## 37. Errors: `try`, `if it fails`, and `complain`

```englishpp
try:
  complain "something broke"
if it fails:
  print "caught:" and the problem
end try
```

```cpp
try {
  throw std::runtime_error(std::string("something broke"));
} catch (const std::exception& problem) {
  std::cout << "caught:" << " " << std::string(problem.what()) << std::endl;
}
```

- `complain <text>` stops what is happening with that message.
- `the problem` is the message, inside `if it fails:` only.
- A complaint travels out of functions and methods — waiting ones too — to the nearest `try` around the call.
- A complaint nobody catches stops the program with `The program stopped with a problem: <message>` and exit code 1, instead of crashing.
- An error inside an event body is reported the same way, and the show keeps running.

---

## 38. Printing and asking

| English++ | C++ |
|---|---|
| `print scores` (any container, pair, or optional) | prints `[4, 9, 2]`, `{bob: 9}`, `(1, one)`, or `nothing` |
| `print "Name? " without a new line` | `std::cout << "Name? ";` |
| `print a blank line` | `std::cout << std::endl;` |
| `ask "What is your name?" into name` | `Ask(std::string("What is your name?"), name);` |
| `ask for age` | `Ask("", age);` |
| `if the input is finished, stop the program` | `if (!std::cin.good()) { std::exit(0); }` |

`ask` shows the question, then reads one line into a text, number, decimal, letter, or yes-or-no. If a number was wanted and the answer isn't one, it says `Please type a number.` and asks again. At the end of the input, the thing keeps the value it had — check `the input is finished` in a loop that asks.

---

## 39. Doing things at the same time: threads

```englishpp
define work taking an atomic number called hits and a number called times:
  repeat times times: add 1 to hits
end work
make an atomic number called counter with 0
start a thread called helper doing work with counter and 10
wait for helper to finish
make a mutex called guard
lock guard:
  add 1 to total
end lock
```

```cpp
void work(std::atomic<int>& hits, int times) {
  for (int i = 0; i < times; ++i) { hits += 1; }
}
...
std::atomic<int> counter = 0;
std::thread helper(work, std::ref(counter), 10);
helper.join();
std::mutex guard;
{
  std::lock_guard<std::mutex> lock_guard(guard);
  total += 1;
}
```

Things that arrive by reference are passed with `std::ref`, so the thread works on the real thing. A thread runs a plain function (not a waiting one). Change shared numbers with `add`/`subtract` on an atomic, or inside a `lock` block — `set n to n + 1` on an atomic is a read followed by a write, which two threads can interleave.

---

## 40. The C++ standard library

Each phrase below is one row of `src/compiler/std_phrases.h`. **To add a piece of the standard library, add a row** — no other code changes. The rules for reading a phrase, fixed:

- A phrase must match all the way, or the compiler moves on (and, if nothing else fits, explains which part of the closest phrase didn't).
- When several phrases fit, the longest wins: `sort scores from biggest to smallest` beats `sort scores`.
- A thing in a phrase (`scores` in `sort scores`) is a name you made. Where the C++ uses it only once, it may be a whole phrase: `the texts in the keys of doors joined with ", "`.
- The **last value** in a value phrase is just one value: `the length of name + 1` is the length, plus 1. Use brackets for more: `the square root of (x * 2)`.
- A text written in quotes is wrapped as `std::string("...")` where C++ needs a real string.
- Each phrase brings the header it needs; the program gets that `#include` (headers sorted, then `englishpp_std.h`, which holds the small helpers like `ToUpper` and `RandomNumber`).

The tables below are generated from the compiler's own table by `python tools/gen_std_table.py`, so they can't drift from it. In the C++ column, `{x}` stands for the C++ of the thing named `x` in the phrase.

#### Values (use them anywhere a value goes)

| English++ | C++ | Gives back | Header |
|---|---|---|---|
| `the square root of x` | `std::sqrt({x})` | decimal | `<cmath>` |
| `the cube root of x` | `std::cbrt({x})` | decimal | `<cmath>` |
| `the absolute value of x` | `std::abs({x})` | same kind as x | `<cmath>` |
| `the sine of x` | `std::sin({x})` | decimal | `<cmath>` |
| `the cosine of x` | `std::cos({x})` | decimal | `<cmath>` |
| `the tangent of x` | `std::tan({x})` | decimal | `<cmath>` |
| `the arc sine of x` | `std::asin({x})` | decimal | `<cmath>` |
| `the arc cosine of x` | `std::acos({x})` | decimal | `<cmath>` |
| `the arc tangent of y over x` | `std::atan2({y}, {x})` | decimal | `<cmath>` |
| `the arc tangent of x` | `std::atan({x})` | decimal | `<cmath>` |
| `the natural log of x` | `std::log({x})` | decimal | `<cmath>` |
| `the log base 10 of x` | `std::log10({x})` | decimal | `<cmath>` |
| `the log base 2 of x` | `std::log2({x})` | decimal | `<cmath>` |
| `the exponential of x` | `std::exp({x})` | decimal | `<cmath>` |
| `the floor of x` | `std::floor({x})` | decimal | `<cmath>` |
| `the ceiling of x` | `std::ceil({x})` | decimal | `<cmath>` |
| `the rounded value of x` | `std::round({x})` | decimal | `<cmath>` |
| `the whole part of x` | `std::trunc({x})` | decimal | `<cmath>` |
| `the remainder of x divided by y` | `std::fmod({x}, {y})` | decimal | `<cmath>` |
| `the hypotenuse of a and b` | `std::hypot({a}, {b})` | decimal | `<cmath>` |
| `the power of x to y` | `std::pow({x}, {y})` | decimal | `<cmath>` |
| `the smaller of a and b` | `std::min<{R}>({a}, {b})` | the wider of a and b | `<algorithm>` |
| `the larger of a and b` | `std::max<{R}>({a}, {b})` | the wider of a and b | `<algorithm>` |
| `the bigger of a and b` | `std::max<{R}>({a}, {b})` | the wider of a and b | `<algorithm>` |
| `the value of x kept between lo and hi` | `std::clamp<{R}>({x}, {lo}, {hi})` | the wider of x and lo | `<algorithm>` |
| `the greatest common divisor of a and b` | `std::gcd({a}, {b})` | same kind as a | `<numeric>` |
| `the least common multiple of a and b` | `std::lcm({a}, {b})` | same kind as a | `<numeric>` |
| `the number pi` | `std::numbers::pi` | decimal | `<numbers>` |
| `the number e` | `std::numbers::e` | decimal | `<numbers>` |
| `the biggest possible number` | `std::numeric_limits<int>::max()` | number | `<limits>` |
| `the smallest possible number` | `std::numeric_limits<int>::min()` | number | `<limits>` |
| `the biggest possible big number` | `std::numeric_limits<long long>::max()` | big number | `<limits>` |
| `the biggest possible decimal` | `std::numeric_limits<double>::max()` | decimal | `<limits>` |
| `the smallest possible decimal` | `std::numeric_limits<double>::lowest()` | decimal | `<limits>` |
| `a random number from a to b` | `RandomNumber({a}, {b})` | number | `"englishpp_std.h"` |
| `a random decimal from a to b` | `RandomDecimal({a}, {b})` | decimal | `"englishpp_std.h"` |
| `a random item from c` | `RandomItem({c})` | an item of c | `"englishpp_std.h"` |
| `a random yes or no` | `RandomYesOrNo()` | yes or no | `"englishpp_std.h"` |
| `the seconds since the start` | `SecondsSinceStart()` | decimal | `"englishpp_std.h"` |
| `the milliseconds since the start` | `MillisecondsSinceStart()` | big number | `"englishpp_std.h"` |
| `the time now` | `TimeNowText()` | text | `"englishpp_std.h"` |
| `the date today` | `DateTodayText()` | text | `"englishpp_std.h"` |
| `the current year` | `CurrentYear()` | number | `"englishpp_std.h"` |
| `the file f exists` | `std::filesystem::exists({f})` | yes or no | `<filesystem>` |
| `the folder f exists` | `std::filesystem::is_directory({f})` | yes or no | `<filesystem>` |
| `the size of the file f` | `static_cast<long long>(std::filesystem::file_size({f}))` | big number | `<filesystem>` |
| `the text in the file f` | `ReadTextFile({f})` | text | - |
| `the lines of the file f` | `ReadLines({f})` | vector of texts | `"englishpp_std.h"` |
| `the files in the folder d` | `ListFolder({d})` | vector of texts | `"englishpp_std.h"` |
| `the current folder` | `std::filesystem::current_path().string()` | text | `<filesystem>` |
| `the input is finished` | `!std::cin.good()` | yes or no | `<iostream>` |
| `the length of s` | `{s}.size()` | number | - |
| `the uppercase version of c` | `static_cast<char>(std::toupper(static_cast<unsigned char>({c})))` | letter | `<cctype>` |
| `the lowercase version of c` | `static_cast<char>(std::tolower(static_cast<unsigned char>({c})))` | letter | `<cctype>` |
| `the uppercase version of s` | `ToUpper({s})` | text | `"englishpp_std.h"` |
| `the lowercase version of s` | `ToLower({s})` | text | `"englishpp_std.h"` |
| `the trimmed version of s` | `Trim({s})` | text | `"englishpp_std.h"` |
| `the reversed version of s` | `Reversed({s})` | text | `"englishpp_std.h"` |
| `the reversed version of c` | `Reversed({c})` | same kind as c | `"englishpp_std.h"` |
| `a sorted copy of c` | `SortedCopy({c})` | same kind as c | `"englishpp_std.h"` |
| `the first n letters of s` | `{s}.substr(0, {n})` | text | - |
| `the last n letters of s` | `LastLetters({s}, {n})` | text | `"englishpp_std.h"` |
| `the letters of s from i to j` | `{s}.substr({i}, {j} - {i} + 1)` | text | - |
| `the part of s starting at i with n letters` | `{s}.substr({i}, {n})` | text | - |
| `the position of x in s` | `FindPosition({s}, {x})` | number | `"englishpp_std.h"` |
| `the position of v in c` | `IndexOf({c}, {v})` | number | `"englishpp_std.h"` |
| `the words in s` | `SplitWords({s})` | vector of texts | `"englishpp_std.h"` |
| `the lines in s` | `SplitLines({s})` | vector of texts | `"englishpp_std.h"` |
| `the pieces of s split by sep` | `Split({s}, {sep})` | vector of texts | `"englishpp_std.h"` |
| `the texts in c joined with sep` | `Join({c}, {sep})` | text | `"englishpp_std.h"` |
| `a copy of s with a replaced by b` | `ReplaceAll({s}, {a}, {b})` | text | `"englishpp_std.h"` |
| `the text made of n copies of c` | `std::string({n}, {c})` | text | - |
| `the text of x` | `ToText({x})` | text | `"englishpp_std.h"` |
| `the number in s` | `std::stoi({s})` | number | `<string>` |
| `the decimal in s` | `std::stod({s})` | decimal | `<string>` |
| `the big number in s` | `std::stoll({s})` | big number | `<string>` |
| `the letter code of c` | `static_cast<int>({c})` | number | - |
| `the letter with code n` | `static_cast<char>({n})` | letter | - |
| `the size of c` | `{c}.size()` | number | - |
| `the first item in c` | `{c}.front()` | an item of c | - |
| `the last item in c` | `{c}.back()` | an item of c | - |
| `the top of s` | `{s}.top()` | an item of s | - |
| `the front of q` | `{q}.front()` | an item of q | - |
| `the back of q` | `{q}.back()` | an item of q | - |
| `the sum of c` | `std::accumulate({c}.begin(), {c}.end(), {E:c}{})` | an item of c | `<numeric>` |
| `the product of c` | `std::accumulate({c}.begin(), {c}.end(), {E:c}{1}, std::multiplies<{E:c}>())` | an item of c | `<numeric>`, `<functional>` |
| `the average of c` | `Average({c})` | decimal | `"englishpp_std.h"` |
| `the biggest in c` | `*std::max_element({c}.begin(), {c}.end())` | an item of c | `<algorithm>` |
| `the smallest in c` | `*std::min_element({c}.begin(), {c}.end())` | an item of c | `<algorithm>` |
| `the number of times v is in c` | `static_cast<int>(std::count({c}.begin(), {c}.end(), {v}))` | number | `<algorithm>` |
| `the keys of m` | `KeysOf({m})` | vector of the keys of m | `"englishpp_std.h"` |
| `the values of m` | `ValuesOf({m})` | vector of the values of m | `"englishpp_std.h"` |
| `the value in o` | `{o}.value()` | an item of o | `<optional>` |
| `the value in o or else d` | `{o}.value_or({d})` | an item of o | `<optional>` |
| `the number of items in c where f` | `static_cast<int>(std::count_if({c}.begin(), {c}.end(), {f}))` | number | `<algorithm>` |
| `every item in c passes f` | `std::all_of({c}.begin(), {c}.end(), {f})` | yes or no | `<algorithm>` |
| `some item in c passes f` | `std::any_of({c}.begin(), {c}.end(), {f})` | yes or no | `<algorithm>` |
| `no item in c passes f` | `std::none_of({c}.begin(), {c}.end(), {f})` | yes or no | `<algorithm>` |
| `the items of c where f` | `KeepIf({c}, {f})` | vector of elem:cs | `"englishpp_std.h"` |
| `the results of f for every item in c` | `Transformed({c}, {f})` | vecret:f | `"englishpp_std.h"` |

#### Instructions (each is a line of its own)

| English++ | C++ | Gives back | Header |
|---|---|---|---|
| `sort c` | `{c}.sort();` | - | - |
| `sort c from biggest to smallest` | `{c}.sort(std::greater<>());` | - | `<functional>` |
| `sort c` | `std::sort({c}.begin(), {c}.end());` | - | `<algorithm>` |
| `sort c from biggest to smallest` | `std::sort({c}.begin(), {c}.end(), std::greater<>());` | - | `<algorithm>`, `<functional>` |
| `reverse c` | `{c}.reverse();` | - | - |
| `reverse c` | `std::reverse({c}.begin(), {c}.end());` | - | `<algorithm>` |
| `shuffle c` | `std::shuffle({c}.begin(), {c}.end(), RandomEngine());` | - | `<algorithm>`, `"englishpp_std.h"` |
| `fill c with v` | `std::fill({c}.begin(), {c}.end(), {v});` | - | `<algorithm>` |
| `fill c counting up from v` | `std::iota({c}.begin(), {c}.end(), {v});` | - | `<numeric>` |
| `remove duplicates from c` | `std::sort({c}.begin(), {c}.end()); {c}.erase(std::unique({c}.begin(), {c}.end()), {c}.end());` | - | `<algorithm>` |
| `sort c using f` | `std::sort({c}.begin(), {c}.end(), {f});` | - | `<algorithm>` |
| `sort c using f` | `{c}.sort({f});` | - | - |
| `apply f to every item in c` | `std::transform({c}.begin(), {c}.end(), {c}.begin(), {f});` | - | `<algorithm>` |
| `do f for every item in c` | `std::for_each({c}.begin(), {c}.end(), {f});` | - | `<algorithm>` |
| `remove the items from c where f` | `std::erase_if({c}, {f});` | - | - |
| `remove the items from c where f` | `std::erase_if({c}, {f});` | - | - |
| `swap a and b` | `std::swap({a}, {b});` | - | `<utility>` |
| `remove v from c` | `std::erase({c}, {v});` | - | - |
| `remove v from c` | `{c}.erase({v});` | - | - |
| `remove the item at i from c` | `{c}.erase({c}.begin() + {i});` | - | - |
| `remove the last item from c` | `{c}.pop_back();` | - | - |
| `remove the first item from c` | `{c}.pop_front();` | - | - |
| `insert v into c at i` | `{c}.insert({c}.begin() + {i}, {v});` | - | - |
| `empty c` | `{c}.clear();` | - | - |
| `clear c` | `{c}.clear();` | - | - |
| `push v onto s` | `{s}.push({v});` | - | - |
| `take the top off s` | `{s}.pop();` | - | - |
| `take the front off q` | `{q}.pop();` | - | - |
| `append x to the file f` | `AppendTextFile({f}, {x});` | - | `"englishpp_std.h"` |
| `delete the file f` | `std::filesystem::remove({f});` | - | `<filesystem>` |
| `delete the folder f` | `std::filesystem::remove_all({f});` | - | `<filesystem>` |
| `create the folder d` | `std::filesystem::create_directories({d});` | - | `<filesystem>` |
| `copy the file a to b` | `std::filesystem::copy_file({a}, {b}, std::filesystem::copy_options::overwrite_existing);` | - | `<filesystem>` |
| `rename the file a to b` | `std::filesystem::rename({a}, {b});` | - | `<filesystem>` |
| `ask q into x` | `Ask({q}, {x});` | - | `"englishpp_std.h"` |
| `ask for x` | `Ask("", {x});` | - | `"englishpp_std.h"` |
| `print a blank line` | `std::cout << std::endl;` | - | - |
| `set the random seed to n` | `SeedRandom({n});` | - | `"englishpp_std.h"` |
| `wait for t to finish` | `{t}.join();` | - | `<thread>` |
| `complain msg` | `throw std::runtime_error({msg});` | - | `<stdexcept>` |
| `stop the program with code n` | `std::exit({n});` | - | `<cstdlib>` |
| `stop the program` | `std::exit(0);` | - | `<cstdlib>` |

---

## 41. Programs without a window

The window now opens the first time a program needs it: when it makes a box, plays a sound, says something on screen, registers an event, or moves the camera. A program that only prints, asks, and calculates is an ordinary console program: it runs, prints, and ends, with exit code 0 (or 1 after an uncaught complaint). Waits work with or without a window. This is a change in what you see, not in the C++: the generated program is the same; only the runtime decides later whether to open the window. Programs that use the world look and behave exactly as before.

---

## 42. Functions that take anything (function templates)

```englishpp
define biggest taking anything called first and anything called second giving back anything:
  if first is more than second, give back first
  give back second
end biggest
print call biggest with 3 and 9
print call biggest with 2.5 and 1.5
```

```cpp
auto biggest(auto first, auto second) {
  if (first > second) { return first; }
  return second;
}
...
std::cout << biggest(3, 9) << std::endl;
std::cout << biggest(2.5, 1.5) << std::endl;
```

`anything` is a C++20 abbreviated function template. Inside, the compiler can't know the kind, so it lets the C++ compiler check each use.

---

## 43. English++ Studio

The IDE (`englishpp_studio.exe`, built by `build.bat`) is part of English++ 2. It checks the program a moment after every change: problems appear as red squiggles (hover for the message), in the Problems panel, and in the status bar; the C++ pane shows the translation and links the two — the English line under the caret tints the C++ it became, and hovering a C++ line tints the English line it came from. **Run** (F5) saves, builds the C++ with Visual Studio's compiler in the background, and runs it; what the program prints streams into Output, and a box under it sends your answers to `ask`. The Language reference panel (F1) lists every form in this manual with its C++ — the standard-library entries are read from the same table as the compiler — and inserts any of them into your program. Everything is also in the command palette (Ctrl+Shift+P).

---

## 44. Functions as values (C++ lambdas)

A function can be a value: made with `make`, kept in a name, handed to another function, and given to the standard library. In C++ it is a lambda kept in a `std::function`.

```englishpp
make a number called limit with 10
make a function called twice taking a number called n giving back a number: give back n * 2
make a function called is_big taking a number called n giving back a yes or no: give back n is more than limit
print call twice with 21
```

```cpp
int limit = 10;
std::function<int(int)> twice = [&](int n) -> int { return (n * 2); };
std::function<bool(int)> is_big = [&](int n) -> bool { return n > limit; };
std::cout << twice(21) << std::endl;
```

After the colon comes one instruction, or nothing — then the lines below are its body, until `end function`:

```englishpp
make a function called describe taking a text called word:
  if the length of word is more than 4:
    print word and "is long"
  otherwise:
    print word and "is short"
  end if
end function
call describe with "elephant"
```

```cpp
std::function<void(std::string)> describe = [&](std::string word) {
  if (word.size() > 4) {
    std::cout << word << " " << "is long" << std::endl;
  } else {
    std::cout << word << " " << "is short" << std::endl;
  }
};
describe("elephant");
```

Rules, fixed:

- A function value **sees the things around it** (`[&]`): `is_big` above reads `limit` each time it runs, so changing `limit` later changes what it says. Use it while those things still exist — the same rule as C++.
- It is called like any function: `call twice with 4` as a value or an instruction.
- Its things are named kinds, never `anything`. Inside, `give back` (or `give back nothing`) leaves it.
- It runs all at once: it can't `wait`, and it can't call a function or method that waits. `break` and `continue` work only inside a loop in its own body.
- **The name of a `define` is a value too**, where a function is expected: `sort words using longer_first` → `std::sort(words.begin(), words.end(), longer_first);`. (A waiting function, or one taking `anything`, can't be used this way.)
- **The kind** of a function value, for things a function takes: `a function taking a number giving back a number` → `std::function<int(int)>`; `a function taking a number and a text` → `std::function<void(int, std::string)>`.

```englishpp
define apply_twice taking a function taking a number giving back a number called f and a number called x giving back a number:
  give back call f with call f with x
end apply_twice
print call apply_twice with twice and 5
```

```cpp
int apply_twice(std::function<int(int)> f, int x) {
  return f(f(x));
}
...
std::cout << apply_twice(twice, 5) << std::endl;
```

The standard-library phrases that take a function (Section 40):

| English++ | C++ |
|---|---|
| `sort words using longer_first` | `std::sort(words.begin(), words.end(), longer_first);` |
| `the number of items in scores where is_big` | `static_cast<int>(std::count_if(scores.begin(), scores.end(), is_big))` |
| `every item in scores passes is_big` | `std::all_of(scores.begin(), scores.end(), is_big)` |
| `some item in scores passes is_big` | `std::any_of(...)` |
| `no item in scores passes is_big` | `std::none_of(...)` |
| `the items of scores where is_big` | `KeepIf(scores, is_big)` (a vector, through `std::copy_if`) |
| `the results of twice for every item in scores` | `Transformed(scores, twice)` (a vector) |
| `apply twice to every item in scores` | `std::transform(scores.begin(), scores.end(), scores.begin(), twice);` |
| `do shout for every item in words` | `std::for_each(words.begin(), words.end(), shout);` |
| `remove the items from scores where is_odd` | `std::erase_if(scores, is_odd);` |

A thread can run a function value too: `start a thread called one doing bump with 500` → `std::thread one(bump, 500);` (Section 39).

---

## 45. Groups (C++ namespaces)

A **group** keeps related definitions together under one name. In C++ it is a namespace.

```englishpp
Group called geometry:
  Boxx called Circle:
    has a decimal called radius
    when made taking a decimal called r:
      set radius to r
    end when made
  end Circle
  define area taking a number called s giving back a number:
    give back s * s
  end area
end geometry

print call area with 4
make a Circle called ring with 2
```

```cpp
namespace geometry {
class Circle { public:
  double radius{};
  Circle(double r) {
    radius = r;
  }
};
}  // namespace geometry

namespace geometry {
int area(int s) {
  return (s * s);
}
}  // namespace geometry

...
std::cout << geometry::area(4) << std::endl;
geometry::Circle ring(2);
```

Rules, fixed:

- A group holds definitions only: `Boxx`, `define`, and `Choices` lines (and notes), until `end <group>`. Other lines go after the group.
- **Names stay unique across the whole program**, so you never need to say which group a name is in: every use is written in full in the C++ (`geometry::area`, `words::Mood::happy`). You may say it anyway, for the reader: `call area from geometry with 4` (the compiler checks that `area` really is in `geometry`).
- Groups sit at the top level and don't nest yet.
- As everywhere, a class's fields and methods, and choices, are usable once their definition has been read — so groups usually go at the top of the program. A group's functions and class names may be used before it (Section 22.4).
- Each grouped definition is written in its own `namespace … { }` in the C++; C++ joins them into one namespace.

---

## 46. What English++ 2 does not do yet

Said plainly, the C++ that has no English++ form yet (use `code:` for any of it, Section 15):

- **Unnamed functions written inside a phrase** (`sort words using a function taking ...` on one line): make a named function first (Section 44), then use its name.
- **Nested groups** (a namespace inside a namespace) and the same name in two groups (Section 45).
- **Class templates** (a Boxx that holds "any kind"). Function templates exist (Section 42).
- **`std::variant`, `std::any`, `std::span`, `std::string_view`, regex, `std::format`**, and the ranges library.
- **Bitwise operators** (`& | ^ ~ << >>`), the conditional operator (`?:`), `goto`, unions, bit-fields, and attributes.
- **Move semantics** written by hand (`&&` references, `std::move`) — the compiler moves boxes for you where it must.
- **Condition variables, futures, and `std::async`**. Threads, atomics, and mutexes exist (Section 39).
- **Event bodies on several lines.** An event body is still one line (call a function for more).
- **Field and method access through a position** (`the speed of pack at 0`): bind a reference first (`make a reference to a Dog called d for pack at 0`).
- A class's `when made` is one constructor; C++ allows several.
- A function, method, or class named `check`, `try`, or `lock` can't use a block of that same name inside itself — the `end` line would be ambiguous.

---

## Appendix A: Choices this manual fixed

The task brief fixed the core rules. Where a rule could be read two ways, this manual picked the clearer reading, wrote it down, and lists it here so the compiler step can check it against the compiler and reconcile any difference:

1. **Bare-creation numbering counts only nameless boxes.** Named declarations do not use up a number (Section 5.2).
2. **Loop-body creation is `SpawnBox()` in both loop kinds**, not only in `repeat` (Section 5.3).
3. **A creation inside a loop may not carry a `called` name** (Section 5.3).
4. **`by`, `to`, and `with` are interchangeable argument introducers**, with no difference in meaning (Section 7).
5. **`a`/`an` and `second`/`seconds` are interchangeable** (Sections 4 and 14).
6. **Keywords do not care about capital letters; names keep their exact spelling** (Section 2).
7. **No semicolons in English++; a stray semicolon is an error** (Section 2).
8. **Comma lines are parsed by fixed verb argument counts** (Sections 7.4 and 8).
9. **Inside a `for each` body, `it` means the loop's current item, and is restored afterwards** (Section 9).
10. **In version 1, `them` is only used as the collection in a `for each` header**; using it as a single target is an error (Section 9).
11. **Pronouns resolve on the line where they appear, using only earlier lines** (Section 9).
12. **An `otherwise` must be the next statement after its `if`; blank lines and `note` lines do not break the pair, but any other statement does** (Section 11).
13. **Loop, `if`, `otherwise`, and event bodies are single statements, and a body may itself be a control line** (Sections 11, 12, 13). Names made inside an `if` or `when` body do not leak out; `it` is restored after the body.
14. **`repeat` counts are whole-number literals or calculations; `wait` amounts are expressions — a literal, a name, or a calculation** (Sections 12, 14, and 30.9). A `repeat` count variable must not be named `i` (Section 12).
15. **`let` takes a literal or a calculation; `set` and comparisons take literals, names, or calculations; action arguments take literals or names** (Sections 6, 11, 7.3, and 30).
16. **Action argument counts are fixed: `move` 3, `spin`/`grow`/`shrink` 1, `show`/`hide` 0, `destroy` 1 target with no introducer, `play sound` 1 quoted text, `paint` 1 colour word with no introducer, `say` 1 printable value, `write` 1 printable value plus 1 quoted path, `read` 1 quoted path plus 1 existing text name** (Section 7).
17. **No unit words after arguments** (`90 degrees` is an error) (Section 7.3).
18. **Whole-number waits gain `.0` in C++** (`wait 3 seconds` becomes `WaitSeconds(3.0f)`) (Section 14).
19. **`code:` lines stand on their own top-level lines and are not loop/`if`/event bodies in version 1; pronouns inside them are not resolved** (Section 15).
20. **A manifest binding may not reuse a built-in verb name** (Section 17).
21. **The generated-program wrapper shape — header `englishpp_runtime.h`, `using namespace epp;`, coroutine `MainScript` ending in `co_return;`, runner `return Run(MainScript());`** — is the compiler's actual shape, as printed in Section 19 (Section 19's earlier `Show` proposal was superseded by the compiler's choice).
22. **Every box made joins the `boxes` collection at the moment it is made**, so a `for each` over `boxes` sees only boxes made before it runs (Section 12).
23. **The colour table is fixed** (Section 7.5): red, blue, green, gold, purple, white, black, pink, orange, cyan — each at full alpha.
24. **Size words map to fixed numbers and work in `grow`/`shrink` amounts only** (Section 7.9): tiny 0.5, small 0.75, normal 1.0, big 1.5, huge 2.0. A thing with the same name wins over the size word.
25. **Text formations are 5×7 letters, gold, anchored bottom-left at (0, 0.5, 0), columns +X, rows +Y, size 0.55, spacing 1.4** (Section 5.5). Unknown characters are skipped with no advance.
26. **Camera follow keeps the initial offset (9, 10, 12) from the target, freezes on stop, and stops if the target is destroyed** (Section 7.7).
27. **Event lambdas capture `[&]` exactly when the body names any thing from the main program; otherwise they stay `[]()`** (Section 13.3). Event bodies inside functions or methods may not name a thing; event bodies may not name a class instance.
28. **A destroyed name errors on any later use in the same scope; re-making it is a redefinition error; destroying by position tracks nothing** (Section 7.2).
29. **Plain `include` never dedups; `include once` skips files already brought in by `include once` in the same build** (Section 29.1).
30. **A class with no fields and no methods emits the exact old one-line form; a class with a body emits multi-line** (Section 22.7). Field and method names are unique down the whole parent chain; a child may not redefine a parent's member.
31. **Method calls are statements only, field access is one level only, and fields cannot be pointers, references, or their own class** (Sections 22.7–22.9). A method CAN wait, and a waiting method is called with `co_await` under the same caller rules as a waiting function (Section 22.8a) — but a method still cannot call a top-level function at all, waiting or not (Section 22.10).
32. **Otherwise-if chains have two spellings with different meanings: same-line `, otherwise if` and cross-line `otherwise if` extend the chain; `otherwise, if` (with a comma) is an `else` whose body is a fresh `if`** (Section 11).
33. **A `while` whose condition never changes and never waits freezes the program; that is the programmer's responsibility** (Section 12.6).

## Appendix B: Quick reference

| What you want | English++ |
|---|---|
| Make a named box | `make a box called hero` |
| Make a nameless box | `make a box` |
| Make a typed value | `make a number called count with 5` / `make a text called word with "hi"` / `make a yes or no called done with yes` |
| Make a pointer / reference | `make a pointer to a number called p` / `make a reference to a number called r for count` |
| Point at something / at nothing | `point p at count` / `point p at nothing` |
| Make a collection | `make a vector of numbers called scores with 1 and 2` / `make a list of texts called words` / `make an array of 3 numbers called arr1` |
| Count / position / add | `the count of scores` / `scores at 0` / `add 5 to scores` |
| Print | `print count and greeting` (one line, a space between items, always ends the line) |
| Define a function | `define greet taking a number called x giving back a number:` … `end greet` |
| Call a function | `call greet with 3` (statement) / `print call greet with 3` (value) |
| Give back | `give back x` (inside a function only) |
| Define a class | `Boxx called Dog` / `Boxx Dog` |
| Define a class with a parent | `Boxx called Dog uses Animal` |
| Define a class with fields and methods | `Boxx called Dog:` … `has a number called speed with 5` … `can bark:` … `end bark` … `end Dog` |
| Make an instance of a class | `make a Dog called rex` / `make a Dog` |
| Read / write a field | `print the speed of rex` / `set the speed of rex to 10` |
| Call a method | `rex bark` / `rex sum with 2 and 3` (statements only) |
| Call a waiting method | `rex bark` → `co_await rex.bark();` when `bark`'s body contains a `wait` (same caller rules as a waiting function) |
| Make several boxes | `make 3 boxes` |
| Spell with boxes | `make boxes spell "HI"` (5×7 letters, gold, 28 boxes for "HI") |
| Paint a box | `paint hero red` (red, blue, green, gold, purple, white, black, pink, orange, cyan) |
| Say text on screen | `say "hello"` / `say msg and "!"` |
| Follow with the camera | `make the camera follow hero` / `make the camera stop following` |
| Write / read a text file | `write "hi" to "note.txt"` / `read "note.txt" into msg` (msg must already be a text) |
| Grow / shrink by a size word | `grow hero by big` / `shrink hero by tiny` (tiny, small, normal, big, huge; grow/shrink amounts only) |
| Show / hide it | `show hero` / `hide hero` |
| Move it | `move hero by 1, 0, 0` |
| Spin / grow / shrink it | `spin hero by 90` / `grow hero by 2` / `shrink hero by 2` |
| Remove it | `destroy hero` (later use of the name is a compile error) |
| Play a sound | `play sound "ding"` |
| Wait | `wait 3 seconds` |
| Store a value | `let speed be 5` / `set speed to 10` |
| Choose | `if health is less than 1, destroy hero` / `otherwise, show hero` / `otherwise if health is less than 5, hide hero` (chains: same-line or cross-line) |
| Repeat | `repeat 5 times: make a box` / `repeat count + 1 times: move hero by 1, 0, 0` |
| While | `while health is less than 10: set health to health + 1` (a condition that never changes freezes the program) |
| Break / continue | `break` / `continue` (inside loop bodies only) |
| For every box | `for each box in boxes: show box` |
| For every member of a collection | `for each score in scores: print score` |
| When two boxes touch | `when hero touches coin, play sound "ding"` |
| When a key is pressed | `when the space key is pressed, move hero by 1, 0, 0` (space, enter, arrows, letters a–z) |
| When the mouse is clicked | `when the mouse is clicked, play sound "click"` |
| Comment | `note This is a comment.` |
| Raw C++ | `code: hero.Move(5, 0, 0);` |
| The last box made | `it` |
| The last group named | `them` (as a `for each` collection only, in version 1) |
| Include another file | `include "helpers.englishpp"` (own line only; path relative to the including file; `.englishpp` added when no extension is given; plain `include` never dedups) |
| Include once | `include once "helpers.englishpp"` (skips a file already brought in by `include once` in the same build) |
| Calculate | `set x to x + 1` / `set x to 1 + 2 * 3` / `set x to (1 + 2) * 3` (precedence: brackets, then unary minus, then `*`/`/`/`%`, then `+`/`-`; every binary operation is parenthesised in C++) |
| Join text | `set g to g + "!"` (text joins with `+` only) |
| Whole-number division | `set x to 5 / 2` is `2`; `set d to 5.0 / 2` is `2.5` (the operands decide, not where the answer is stored) |
| Remainder | `set x to x % 3` / `set d to d % 2.0` (a decimal operand becomes `fmod`) |
| Position in a calculation (index-greedy) | `set x to scores at 0 + 1` reads position 1; `set x to (scores at 0) + 1` adds 1 to position 0 |
| Count up by one | `set x to x + 1` |
| Wait a calculated time | `wait count + 1 seconds` |
| `let` with a calculation | `let y be 5 + 1` / `let z be (5)` (a bare name still errors; see Section 30.8) |
| **English++ 2** | |
| If block | `if x is 1:` … `otherwise if x is 2:` … `otherwise:` … `end if` |
| Repeat block / forever / until | `repeat 3 times:` … `end repeat` / `repeat forever:` … `end repeat` / `repeat:` … `until done` |
| Count | `for i from 1 to 10:` … `end for` / `for i from 10 down to 0 by 2:` |
| Check (switch) | `check day:` / `if it is 1:` / `if it is 6 or 7:` / `otherwise:` / `end check` |
| And, or, not | `if a is 1 and not b is 2 or done, ...` |
| Phrase conditions | `is between 1 and 10`, `is even`, `is empty`, `contains`, `starts with`, `has a value`, `is a digit` |
| Constants | `make a constant number called lives with 3` |
| Change in place | `add 5 to score` / `subtract 1 from lives` / `multiply x by 2` / `divide x by 2` |
| Sized numbers | `big number`, `small number`, `positive number`, `byte`, `small decimal`, `big decimal` |
| Containers | `map from texts to numbers`, `set of numbers`, `deque of`, `stack of`, `queue of`, `priority queue of`, `pair of a number and a text`, `optional number` |
| Smart pointers | `make a unique pointer to a Dog called d with "Rex"` / `add a new Dog with "Fido" to zoo` |
| Constructor / destructor | `when made taking a text called given:` … `end when made` / `start as an Animal with given` / `when destroyed:` |
| Access | `has a secret number called pin` / `has a family secret ...` / `can secretly think:` / `shares a number called count with 0` |
| Pure virtual / override | `must be able to speak giving back a text` / write the same `can speak` in the child |
| Operators | `can be added to a Spot called other giving back a Spot:` … `end added` |
| Choices (enum) | `Choices called Mood: happy, sad, and sleepy` |
| Errors | `try:` … `if it fails:` … `print the problem` … `end try` / `complain "message"` |
| Input | `ask "Your name?" into name` / `if the input is finished, stop the program` |
| Print more | `print scores` / `print "Hi" without a new line` / `print price with 2 decimal places` |
| Threads | `start a thread called t doing work with 5` / `wait for t to finish` / `lock guard:` … `end lock` |
| Standard library | `sort scores`, `the sum of scores`, `the square root of x`, `a random number from 1 to 6`, `the words in line`, … (Section 40) |
| Any kind (template) | `define biggest taking anything called x and anything called y giving back anything:` |
| Function as a value (lambda) | `make a function called twice taking a number called n giving back a number: give back n * 2` / `call twice with 4` |
| Functions in algorithms | `sort words using longer_first` / `the number of items in scores where is_big` / `remove the items from scores where is_odd` |
| Group (namespace) | `Group called geometry:` … `end geometry` / `call area from geometry with 4` |

## Studio 3: errors in English, and more of the standard library

Nothing in this section changes what an earlier program means; it adds
phrases and changes what happens when a program goes wrong while it runs.

### Run-time mistakes name their line

A program built by the Studio stops on a mistake with its English++ line:

```text
The program stopped on line 3:
    print scores at 5
It used a position that is not in the collection or text.
```

Covered: a position outside a vector, text, array or deque, or the value of
an empty optional (the C++ library's hardening, which the runtime header
turns on); a pointer to nothing; dividing a whole number by zero; a
function that calls itself forever; and a `complain` (or any C++ exception)
nobody caught - the line it came from. How: the builder adds a table from
C++ lines to English++ lines and builds with debug information; the
reporter (`runtime/englishpp_errors.cpp`) reads where the program stopped.

### New phrases

| Phrase | Gives back |
|---|---|
| `the output of the command C` | text (one final line end removed) |
| `the exit code of the command C` | number |
| `run the command C` | (instruction) |
| `the text of the web page U` | text (through Windows' curl) |
| `download the web page U to the file F` | (instruction) |
| `the environment value N` | text ("" when there is none) |
| `the words given to the program` | vector of texts |
| `the current month` / `the current day of the month` / `the current hour` / `the current minute` / `the current second` | number |
| `the day of the week` / `the name of the month` | text |
| `the seconds since 1970` | big number |
| `the median of C` / `the standard deviation of C` (population) | decimal |
| `the factorial of N` (up to 20) | big number |
| `the number N is prime` | yes or no |
| `the name of the file F` / `the extension of the file F` / `the folder of the file F` / `the full path of F` | text |
| `the folders in the folder D` | vector of texts |
| `write the lines C to the file F` | (instruction) |
| `the csv cells in S` | vector of texts |
| `the csv line of C` | text |
| `the text S padded to N letters` / `the title case version of S` | text |
| `the text T matches the pattern P` | yes or no |
| `the matches of the pattern P in T` | vector of texts |
| `a copy of T with the pattern P replaced by R` | text |

Patterns are regular expressions in the ECMAScript form.

## Studio 3: the Blueprint form

The Blueprint form is the third form of English++, beside the regular and the
compressed form. It is a view of a program, not a new language: every
blueprint is a regular-form program, and every program can be shown as a
blueprint. Nothing in this section changes what any program means.

### What a blueprint is

| The program | The blueprint |
|---|---|
| a line | a node; its title is the phrase, its rows are the phrase's holes |
| the order lines run in | white exec wires: a node's top pin is where it is run from, its bottom pin what runs next |
| a block (`if`, `while`, `for`, `repeat`, `check`, `try`, `define`, `Boxx`, `can`, `when made`, `Group`) | a node with an exec pin on its right for each body: Then, Otherwise if, Otherwise; Loop body; the cases of `check` (If it is ...), Otherwise; Try, If it fails; Body; Members; Contents |
| `repeat:` ... `until C` | a Loop body pin, and an `until` pin for C |
| a hole's words | typed in the pin's box, exactly as in the regular form |
| a value in a hole | a value node wired in: a number, words, yes or no, a letter, a name (Get), `+ - * / %`, `and`, `or`, `not`, or any phrase that gives back a value; it is written with parentheses where it needs them |
| a top-level `define`, `Boxx` or `Group` | a node of its own (no top pin), written where it was in the text |
| a line no phrase matches | an "English++ line" node holding the line |
| notes and blank lines | kept with the node after them (notes show inside the node) |

### Exactness

Reading a program into a blueprint and writing it out again gives back the
same text, byte for byte. A node that is changed is written afresh from its
phrase and its pins; a node that is not changed keeps its own words, spacing
and notes. `tools/blueprint_check` checks this on every test, template,
library example and benchmark: the round trip, the `.epb` round trip, and
that every node written afresh from its phrase compiles to the same C++.

### `.epb` files

A blueprint file is JSON: `"format": "englishpp-blueprint"`, `"version": 1`,
the graph (`start`, `nextId`, `roots`, `trailing`, `nodes`), and `"program"`:
the regular-form English++ the graph writes. The builder compiles
`"program"`, so a `.epb` file builds and runs like any other program, and
`include once "helpers.epb"` includes one. If the nodes and the program in a
file ever disagree (the file was changed by hand), the Studio reads the nodes
again from the program.

### Editing

| Do this | To |
|---|---|
| Space, right-click, or double-click empty space | add a node (search every phrase; a typed English++ line becomes its phrase's node) |
| drag from a pin to a pin | wire them |
| drop a wire on empty space | add a node that comes wired to it |
| click a pin's box | type in it (Tab: the next box; Enter: done; Escape: cancel) |
| Alt+click a pin | unwire it |
| Delete, Ctrl+D, Ctrl+C / Ctrl+X / Ctrl+V | delete, duplicate, copy, cut, paste (English++ text pastes as nodes) |
| Ctrl+Z / Ctrl+Y | undo, redo |
| choose a node, then F12 / Shift+F12 / F2 | go to where a name it uses was made; list every line that uses it; rename it everywhere (in blueprints and open files alike) |
| Ctrl+F, Ctrl+H | find the next node whose line matches (with the find bar's case, whole-word and pattern options); replace in what is typed in the boxes and in notes - a node's own phrase words stay, since they say which node it is |
| wheel, right-drag or middle-drag, F | zoom, move around, see everything |
| Ctrl+Alt+B, or the form button | switch a file to the Blueprint form (and back to Regular or Compressed) |

## Studio 3: C++ Overpowered

C++ Overpowered is the Studio's blueprint editor for real C++. It is not part
of the English++ language and changes nothing in it: a `.cpb` file is a C++
program, and it is built as C++.

### What a C++ blueprint is

| The C++ | The blueprint |
|---|---|
| a statement | a node whose kind sets its color, shape, light and sound: a variable, a set, a call, printing, reading, return, throw, break, continue, goto, using, enum |
| a block (`if`/`else if`/`else`, `for`, range `for`, `while`, `do`, `switch`, `try`/`catch`, a function, `main`, a lambda, `class`/`struct`/`union`, `namespace`, `extern "C"`, `{ }`) | a node with an exec pin on its right for each body; `case`, `default` and access labels are nodes in the body |
| the parts of a statement (a type, a name, a condition, a for loop's three parts, a function's template, return type, name, parameters and qualifiers) | pins you type in |
| an expression in a pin | text, or value nodes wired in: literals, names, operators (with C++ precedence), calls, members, `[ ]`, `? :` |
| `#include` and other directives | nodes of their own |
| anything else | a "C++ code" node that keeps its text exactly |
| comments and spacing | kept with the node they come before (`//` comments show as the node's notes) |

### Saying it instead of writing it

The palette (Space) and the boxes also take plain words. These only choose
which C++ gets written: the file is always ordinary C++, and nothing here is
part of the English++ language. A line ending in `;`, `{` or `}`, or starting
with `#`, is real C++ and is kept exactly as typed.

| In the palette | The C++ it makes |
|---|---|
| `print Hello there` | `std::cout << "Hello there" << '\n';` |
| `print numbers` (a list) | a range `for` that prints each item, then a new line |
| `print Score: {score}` | the words and the value, joined with `<<` |
| `score = 7`, `speed = 2.5`, `title = The End` | `int`, `double` and `std::string` variables |
| `numbers = 1, 2, 3` | `std::vector<int> numbers = {1, 2, 3};` |
| `prices = apple: 2, pear: 3` | `std::map<std::string, int>` with those entries |
| `score = 9` (it exists) | `score = 9;` |
| `add 3 to score`, `take 2 from score`, `set score to 3` | `+=`, `-=` and `=` |
| `add 4 to numbers`, `sort numbers` | `push_back` and `std::sort` |
| `repeat 5`, `for i from 1 to 10`, `for each n in numbers` | the matching `for` |
| `if score is more than 5`, `while x is less than 9` | the block, with the condition |
| `stop`, `skip`, `return 5`, `wait 100` | `break`, `continue`, `return`, a sleep |
| `ask name` | the variable if needed, a prompt, and `std::cin` |
| `function hello`, `function greet name`, `class Robot`, `struct Point` | the empty definition |
| `make a Ship`, `Greet Ada`, `use Add with 1, 2` | an object, or a call |
| `done` | adds nothing: the next step goes after the current `if` or loop |
| any other words | printed |

New steps join the program by themselves: after the chosen node, or at the end
of `main` (a function or class goes above `main`). `#include` lines are added
when needed, names stay unique, and each box offers what fits it. Orbs have
one-click actions, and the top of the palette (*What next?*) suggests steps
from the names visible at that point.

### Exactness

Reading C++ into a blueprint and writing it out gives back the same text,
byte for byte. A node that is changed is written afresh from its pins (a
brace-less body gets braces when its block changes). `tools/cpp_check`
checks the exact round trip, the `.cpb` JSON round trip, and that every node
written afresh from its pins gives the same tokens, on 1,077 files (279,931
lines: the Qt Core, Gui and Widgets headers, raylib, and the repository's own
C++).

### Files and building

A `.cpb` file is JSON like a `.epb` file; its `"program"` is the C++. The
builder builds a `.cpp`, `.cc`, `.cxx` or `.cpb` main file as C++20 with no
English++ step. The other C++ files next to it (`.cpp`, `.cc`, `.cxx`, and
`.cpb` through a `#line`-marked copy) are built with it, its folder is on the
include path, and a library is used when the program includes one of its
headers. While a C++ file is open, the Studio runs `cl /Zs` on it in the
background and shows each mistake on its line or node.

### Looks

Every node is an orb: a small glossy circle in its kind's color, with the
kind's badge and the kind's shape drawn faintly inside, and a few words of its
code beside it (a value's words inside it, or under it). Step orbs share one
center line, so a column of steps is a straight line; bodies branch off to the
right, and values sit on the left of what they feed.

| Kind | Color | Shape inside | Light | Sound |
|---|---|---|---|---|
| `main` | #2fd36b | tab | sparkle | fanfare |
| function, lambda | #a463ff, #d18cff | tab | pulse | bell |
| variable, set | #3ddc97, #6fe3b4 | capsule | - | pluck, strum |
| call, print, read | #3d8bfd, #36c5f0, #36d6c5 | arrow | - | blip, chirp |
| `if`, `switch` | #ff4f7b, #ff5cc8 | diamond, octagon | blink | ding-dong |
| loops | #ff8a3d | capsule | orbit | arpeggio |
| `return` | #ffc53d | arrow down | flicker | swoop |
| `try`, `throw` | #ffb020, #ff3d3d | shield, bolt | flicker | chime, zap |
| `class`, `struct`, `enum` | #19c3e6, #8bd450 | hexagon | shimmer | crystal |
| `namespace` | #22c4a5 | frame | shimmer | hum |
| `#include` | #7f93ad | tag | - | tick |
| C++ code | #6b7280 | box | - | blip |

Pointers have their own values: `*p` (#ff7ab6, `*`), `&x` (`&`), `p->x`
(`→`), and `delete` statements (#ff6b6b, `✕`, a poof).

The ring around an orb is the type it makes or gives back: a variable's or a
loop variable's declared type, a function's return type (`main`: `int`), the
return type of a function a call runs (the program's own, or a library's), and
for a name or `&x` value, the declared type of the name.

| Ring | Type |
|---|---|
| solid #9be35b | whole numbers: `int`, `long`, `size_t`, `int32_t`... |
| solid #2fd3c7 | `float`, `double` |
| solid #e5484d | `bool` |
| solid #ff9f43 | `char` and its kin |
| solid #ff5cc8 | `std::string`, `std::string_view`, and `const char*` |
| beads, #b07cff | containers (`vector`, `array`, `map`, `set`, ...) and `T x[n]` arrays |
| solid #19c3e6 | any other type: a class's objects |
| dashes and an arrow out, in the pointee's color | a pointer; one arrow per `*` (up to three) |
| a double ring | a reference `&` |
| a triple ring | an rvalue reference `&&` |
| a ring with three rivets, in the pointee's color | `unique_ptr`, `shared_ptr`, `weak_ptr` |
| dash-dot, #d18cff | a lambda, `std::function` |
| a rainbow | `auto`, `decltype(...)` |
| none | `void`, constructors, and statements that make no value |

An orb opens - its boxes fan out on a circle around it, with a spoke to each,
its title and type over it and its mistake under it - when the mouse rests on
it (after 160 ms), while one of its boxes is being typed in, while a wire being
drawn is over it, and when it has just been added (until another node is
chosen, or Enter finishes typing in it). It closes as soon as none of these
holds. Closed, an orb shows only the pins that are wired; open, every pin.

The canvas glows around lit nodes, particles flow along the wires, *Play the
flow* lights the steps in the order they run, and *Legend* (kinds and rings),
*Effects* and *Sound* are on the blueprint's toolbar (Effects and Sound are
remembered). In C++ text, statement words take their node's color. A `.cpb`
file records `"layout": "orbs"`; one saved without it is laid out again when
opened.

### Editing

Everything in the Blueprint form's editing table works here. Also:

| Do this | To |
|---|---|
| Space, then a category or a search | add C++: main, includes, variables, flow, functions, classes, input and output, the standard library, raylib and the libraries' functions, and the program's own names; a typed C++ line becomes its nodes |
| right-click a pin, *Open it up into nodes* | turn the C++ in a pin into value nodes |
| double-click an orb, or click the pin over an open orb | keep its boxes open while its values are changed; again (or Escape, which lets every kept-open orb close) to let it close |
| *+ Else if*, *+ Else*, *+ Catch* on a node | add a branch |
| the form button | switch between C++ Overpowered (`.cpb`) and C++ text (`.cpp`) |

### Examples

`examples/cpp` holds 32 C++ programs, numbered in the order to learn them:
printing, variables, math, text, if, switch, loops, functions, recursion,
references, pointers, smart pointers, lists, maps and sets, structs, enums,
classes, constructors, inheritance, operators, templates, lambdas,
exceptions, namespaces, static and constexpr, algorithms, files, random
numbers and time, optional and variant, threads, and two raylib window
programs. The comments at the top of each are its name and what it shows.
*Help > C++ Overpowered Examples* (and the Welcome page) lists them; choosing
one copies it into a project of its own under the projects folder's `C++
Examples` (the first time; after that the same project opens again, with its
changes), as a `.cpb` blueprint.

`tools/check_cpp_examples.py` builds every example with the Studio's builder
and checks that each console program prints exactly `examples/cpp/expected/
<name>.txt`; window programs are built, not run. In a C++ program's folder,
a file with a `main` of its own is a separate program, so it is not built
into another one.

## Words added in November 2026

The chart is frozen: a word that is there never changes what it means, and new words may only be added. These were added to fill in what the language couldn't do. The rules of a line are the same as ever, and `docs/ENGLISHPP_CHART.md` has every one of them. This says what they are for.

### Numbers and bits

The roots `and aor axr asl asr ant` change a thing in place. These give a value: `nnd&a&b`, `nor&a&b`, `nxr&a&b`, `nsl&a&2`, `nsr&a&2`, `nnt&a`. `nsz&x` is how many bytes x takes, `nlw` is the lowest whole number, and `pbg` is a positive whole number of 64 bits.

`hug` is a whole number of any size. It stops where your memory does, not at 2 billion, and C++ has nothing like it:

```
x mak hug
x is 1
i is 2
i wle 100
  x aml i
  i add 1
out prn x
```

That prints all 158 digits of 100 factorial. Make a big one from text, `hug&"123456789012345678901234567890"`, turn one back with `big&x`, and raise one to a power with `x apw 100`. `cpx` is a complex number: `z mak cpx&1.0&2.0`.

### Lists

| Word | Says | Example |
|---|---|---|
| `cea` | does each one pass | `cea&scores&big` |
| `can` | does any pass | `can&scores&big` |
| `cnn` | does none pass | `cnn&scores&big` |
| `crl` | rolled up by a function | `crl&scores&0&plus` |
| `czp` | two lists as pairs | `czp&names&ages` |
| `cnu` | each one with its number | `k&x fea cnu&names` |
| `cun` `cbt` `cot` | in either, in both, only in the first | `cbt&a&b` |
| `ccu` | part of a list | `ccu&scores&1&2` |
| `cbf` `cpb` | found by halves in a sorted list, and where | `cbf&sorted&7` |
| `cgr` | grouped by a function | `cgr&words&first_letter` |
| `cjn` | a list of lists as one list | `cjn&lists` |
| `crg` | counted, with a step if you like | `crg&0&10&2` |

`v lrw 1` turns a list so the first goes to the end, and `v lss now` sorts it and keeps things that tie in the order they were. `mhp@num` is a priority queue with the smallest on top, and it is what most programs want from one.

Anything can be a key. C++ asks you to write a hash or an order by hand for a pair, a list or a class of your own, and here `hsh@par@num@num@num` and `map@Dot@txt` just work.

### Text

`tre&"ab"&3` repeats, and `tct&s&"a"` counts. `tdg&c`, `tlr&c` and `tws&c` ask if a letter is a digit, a letter or white space. `tfa&"{} and {:.2f}"&1&2.5` fills in a pattern, in the same pattern language as C++'s `std::format`. `ttp&x` says what kind a thing is, as text.

### Functions

A last parameter that is a list takes all the values left over, so a function can take any number of them:

```
out prn add_all&1&2&3&4

add_all dfn num
  xs dpm vec@num
  add_all ert csm&xs
```

A lambda that a function gives back takes copies of what it uses, so it keeps working after that function has ended. To ask for that anywhere, use `dlv` in place of `dlm`. A lambda can call itself. `n msv 0` makes a number that stays between calls, and `seen mtl 0`, at the top level, makes one that each thread has its own of. `dcx` is a function C++ can work out while compiling.

A function that gives back `gnr@num` hands out one value at a time with `eyd`, and it only runs as far as it is asked to, so it can go on forever:

```
n fea evens&
  out prn n
  n igt 100
    now ebk now

evens dfn gnr@num
  i is 0
  now wfv now
    evens eyd i
    i add 2
```

A `bdr` block runs when the block around it ends, however it ends, so a program can't forget to clean up. Several run in the opposite order to how they were written.

```
now bdr now
  out prn "this comes last"
out prn "this comes first"
```

### Classes

`dop` also takes `+= -= *= /= %=`. `at dop ref@num` lets a class be reached by position, `rows@3`, and `call dop num` lets it be called, `adder&3`. `ptr@Dog&pet` gives the Dog a pointer really is, or nil if it isn't one, and `shr@Dog&pet` does the same for a shared pointer. `ready dbb 1` is a field of one bit. `o dpm tkn@Dot` takes a thing that is being handed over to keep. An enum or a class can be made inside a class, and is used by its own name. `N dtp num` makes a template of a number, `Box@3`. `m fea Mood` walks through an enum's choices, and `arr@num@SIZE` takes a constant.

### Threads

`c mak chn@num` is a channel: threads hand each other values through it, and C++ has no such thing. `c add 5` sends, `x is c@get&` waits for one, `c close now` says there are no more, and `n fea c` walks through them until it is closed and empty. `chn@num&2` holds two at most, and sending waits for room.

`cv mak cnd` is a condition. Inside a `blk`, `cv wait g&ready` lets go of the mutex until `ready` says yes and another thread has called `cv notify_one now`.

### The world outside

`"a.bin" hby bytes` writes a `vec@byt` to a file, and `hrb&"a.bin"` reads one back. `kns` is a clock in nanoseconds, and `kfa&"%Y-%m-%d"` fills in the date and time. `xha&s` is a SHA-256 hash, `xbe&s` and `xbd&s` are base 64, and `xpo&url&text` sends a text to a web address.

`j is tjs&text` reads JSON. `j@"name"` and `j@0` reach in, `num&j`, `dec&j` and `j@text&` read it out, and `j@"age" is 36` changes it. `j mak jsn` starts an empty one, and `j add 1` makes it a list. Printing one writes JSON. A mistake in the text says which line it is on.

`c mak sck&"example.com"&80` connects to another computer. `c send "hello\n"` sends, `c@line&` reads a line and `c@all&` reads until the other end has finished. `l mak srv&8080` listens on this PC, `l mak srv&8080&"0.0.0.0"` listens on the network too, and `c is l@next&` waits for someone.

### Notes

A red line is a mistake. A yellow line is a note: the program builds and runs, and the line may not be what it looks like. Notes are in the Problems panel too.

- A test or a sum that uses `v@j` and `v@j+1` together, as `v@j igt v@j+1` or `v@j+1-v@j` does. `v@j+1` is what is at `v@j`, plus 1, so these always come out the same. To reach the next place, make a step: `q is j+1`, then `v@q`. On its own, `best is v@j+1` is a good line and gets no note.
- `i flt n` when a loop above left `i` behind. It goes on from where `i` stopped. To start again, write `i is 0` above it. A counter set on purpose, as `k is 1` then `k fle 3`, gets no note.

### What is still left out

Left out on purpose, because it is a way for a program to go wrong with no message:

- Moving a pointer with `p add 1`. Use a position in a list, which is checked.

Left out because the language has another way:

- `goto`: `ebk` and `enx` take a loop's name.
- `switch` on text: use `ieq` and `oeq`.
- A class inside a function: make it at the top level.

Not in the language yet, and reached with `xgl` and `xpp`:

- `friend`, virtual inheritance and conversion operators.
- Variadic templates, concepts and `requires`.
- `noexcept` and attributes.
- Inline assembly and SIMD intrinsics.
