"use strict";
/* ================= C# MODE — parallel dataset for Code Block =================
   Inspired by the topic order of "C# 8.0 in a Nutshell" (Albahari & Albahari).
   Every explanation below is ORIGINAL Code Block prose — no book text is used.
   This file loads BEFORE the main scripts. It sets window.__isCS from the
   saved language choice; the main data declarations then pick the C# arrays
   instead of the C++ ones, and C# progress uses its own storage keys, so the
   two languages never overwrite each other. */
window.__isCS = false;
window.__isDrive = false;
try {
  var cbSavedMode = localStorage.getItem("code-block-lang-v1");
  window.__isCS = cbSavedMode === "cs";
  window.__isDrive = cbSavedMode === "drive";
} catch (e) {}
window.cbCountProg = function (prog) {
  if (!prog || typeof prog !== "object" || !prog.reps || typeof prog.reps !== "object") return 0;
  var c = 0;
  for (var k in prog.reps) { var n = Number(prog.reps[k]); if (isFinite(n) && n >= 8) c++; }
  return c;
};
window.cbVaultLen = function (v) { return (v && typeof v === "object" && !Array.isArray(v)) ? Object.keys(v).length : 0; };

var CS_BLOCKS = [
  { name: "Hello Block", short: "Hello", chapter: "C# Book Ch. 1 · Introducing C#", color: "#53b1fd", icon: "i-say", verb: "say",
    line: 'Console.WriteLine("Hello");',
    explain: "Console is the screen's control panel in C#. WriteLine writes a whole line of text and then presses Enter for you, so the next thing printed starts fresh on a new line. Every instruction ends with a semicolon — the full stop of C#." },
  { name: "Variable Block", short: "Variable", chapter: "C# Book Ch. 2 · Language Basics", color: "#38bdf8", icon: "i-box", verb: "store",
    line: "int score = 0;",
    explain: "A variable is a labeled box that holds a value. int means the box holds whole numbers only. The = puts a starting value inside the box, ready to change later as the program runs." },
  { name: "Input Block", short: "Input", chapter: "C# Book Ch. 2 · Language Basics", color: "#22d3ee", icon: "i-keyboard", verb: "listen",
    line: "string name = Console.ReadLine();",
    explain: "Console.ReadLine() listens to the keyboard and waits until the player presses Enter. Whatever they typed comes back as text, and this line stores it in a string box called name. Reading in, storing away — one line does both." },
  { name: "Math Block", short: "Math", chapter: "C# Book Ch. 2 · Language Basics", color: "#2fc4e8", icon: "i-calc", verb: "add",
    line: "total += price;",
    explain: "+= means add to what's already there. Instead of writing total = total + price, this shortcut piles price straight onto total. Short lines, clear meaning — C# programmers use it constantly." },
  { name: "Decision Block", short: "Decision", chapter: "C# Book Ch. 2 · Language Basics", color: "#3ec6dd", icon: "i-fork", verb: "choose",
    line: "if (hp <= 0) { GameOver(); }",
    explain: "if asks a yes/no question. If the answer is yes, the code inside the curly braces runs — here, the GameOver method. If the answer is no, the braces are skipped and play continues." },
  { name: "Switch Block", short: "Switch", chapter: "C# Book Ch. 2 · Language Basics", color: "#4a90d9", icon: "i-toggle", verb: "pick",
    line: "switch (level) { case 1: break; }",
    explain: "switch looks at one value and jumps to the case that matches it. break stops the code falling through into the next case when it is done. One value, one matching door." },
  { name: "For Block", short: "For Loop", chapter: "C# Book Ch. 2 · Language Basics", color: "#6d9df5", icon: "i-repeat", verb: "count",
    line: "for (int i = 0; i < 5; i++) { }",
    explain: "A for loop has three parts: where counting starts (int i = 0), the keep-going rule (i < 5), and the step (i++ means add one). It repeats whatever is inside the braces, once per count." },
  { name: "While Block", short: "While Loop", chapter: "C# Book Ch. 2 · Language Basics", color: "#7aa5f8", icon: "i-clock", verb: "wait",
    line: "while (lives > 0) { lives--; }",
    explain: "while repeats for as long as its question stays true. Something inside the loop must change each lap — here lives-- counts down — or the loop would spin forever." },
  { name: "Array Block", short: "Array", chapter: "C# Book Ch. 2 · Language Basics", color: "#5ea8f7", icon: "i-brackets", verb: "slot",
    line: "int[] scores = { 10, 20, 30 };",
    explain: "An array is a row of boxes sharing one name. int[] says the row holds whole numbers, and the curly braces list the starting values. You reach each box by its number, counting from 0: scores[0] is the first." },
  { name: "List Block", short: "List", chapter: "C# Book Ch. 6 · Collections", color: "#4fb3ff", icon: "i-rows", verb: "collect",
    line: "List<int> scores = new List<int>();",
    explain: "A List is an array that can GROW. List<int> builds a stretchy list for whole numbers, and new List<int>() actually creates it — new is the word that brings things to life in C#. Add items any time with scores.Add(40)." },
  { name: "String Block", short: "String", chapter: "C# Book Ch. 6 · Strings and Text", color: "#38a3f8", icon: "i-link", verb: "join",
    line: 'string hero = "V";',
    explain: "string is the box built specially for text. The double quotes mark the text itself. Strings can be measured with .Length, joined with +, and searched — text is a first-class citizen in C#." },
  { name: "Interpolation Block", short: "Interp", chapter: "C# Book Ch. 2 · Language Basics", color: "#2fb9e8", icon: "i-braces", verb: "weave",
    line: 'Console.WriteLine($"Score: {score}");',
    explain: "The $ before a string turns it into a fill-in-the-blanks sentence. Holes in curly braces are replaced by the values of your variables when the line runs — Score: {score} becomes Score: 250. No more gluing pieces together with +." },
  { name: "Method Block", short: "Method", chapter: "C# Book Ch. 3 · Creating Types", color: "#3b8ef0", icon: "i-gear", verb: "do",
    line: "int Damage(int atk, int def) { return atk - def; }",
    explain: "A method is a named machine inside a class: inputs ride in the parentheses, the type before the name promises what kind of answer comes out, and return hands that answer back. In C#, functions living in classes are called methods." },
  { name: "Class Block", short: "Class", chapter: "C# Book Ch. 3 · Creating Types", color: "#2f9be8", icon: "i-shapes", verb: "shape",
    line: "class Block { public int Size; }",
    explain: "A class is a blueprint for your own kind of object. public opens a part of the blueprint so other code can use it. Notice: unlike C++, a C# class does NOT take a semicolon after its closing brace." },
  { name: "Property Block", short: "Property", chapter: "C# Book Ch. 3 · Creating Types", color: "#7fb2e5", icon: "i-sliders", verb: "tune",
    line: "public int Size { get; set; }",
    explain: "A property is a smart doorway into an object. get lets other code read the value, set lets them change it — and C# builds the storage behind the door for you. It looks like a variable from outside, but the class stays in control." },
  { name: "Constructor Block", short: "Ctor", chapter: "C# Book Ch. 3 · Creating Types", color: "#6495ed", icon: "i-brick", verb: "build",
    line: "public Block(int size) { Size = size; }",
    explain: "A constructor is the welcome ceremony that runs the moment an object is born. It has the same name as its class and no return type. Here it takes the starting size the builder asked for and stores it in the new object's Size." },
  { name: "Inheritance Block", short: "Inherit", chapter: "C# Book Ch. 3 · Creating Types", color: "#3f7de0", icon: "i-tree", verb: "inherit",
    line: "class FireBlock : Block { }",
    explain: "The colon says: start from the Block blueprint, then add more. FireBlock inherits everything Block could already do — its properties, its methods — for free, and then adds its own fire on top." },
  { name: "Override Block", short: "Override", chapter: "C# Book Ch. 3 · Creating Types", color: "#31b8c6", icon: "i-pencil", verb: "rewrite",
    line: "public override void Speak() { }",
    explain: "override is how a child class replaces a parent's method with its own version. The parent must first mark its method virtual — an open invitation — and then each child can answer the same call in its own voice." },
  { name: "Interface Block", short: "Interface", chapter: "C# Book Ch. 3 · Creating Types", color: "#0ea5e9", icon: "i-overlap", verb: "promise",
    line: "interface IDrawable { void Draw(); }",
    explain: "An interface is a promise list: it names methods a class must have, without saying how they work. Any class that signs IDrawable guarantees it can Draw(). Interfaces often start with I, like a name tag that says I am a promise." },
  { name: "Enum Block", short: "Enum", chapter: "C# Book Ch. 3 · Creating Types", color: "#2563eb", icon: "i-list", verb: "list",
    line: "enum Color { Red, Green, Blue }",
    explain: "An enum gives friendly names to a fixed set of choices. Instead of remembering that 0 means red and 1 means green, your code can just say Color.Red. Underneath they are still numbers — but nobody has to guess what a plain number meant." },
  { name: "Struct Block", short: "Struct", chapter: "C# Book Ch. 3 · Creating Types", color: "#3b82f6", icon: "i-grid", verb: "pack",
    line: "struct Point { public int X; public int Y; }",
    explain: "A struct bundles a few values into one lightweight package — a point on screen is really two numbers traveling together. Structs are copied by value, like numbers: hand one over and the receiver gets its own copy. Classes, by contrast, are shared by reference." },
  { name: "Try/Catch Block", short: "TryCatch", chapter: "C# Book Ch. 4 · Advanced Types", color: "#0284c7", icon: "i-net", verb: "catch",
    line: "try { Play(); } catch { }",
    explain: "try marks risky code. If something throws an exception inside, the program jumps to catch instead of crashing. C# lets you write a plain catch that catches anything, or name the exact exception you expect." },
  { name: "Null Check Block", short: "Null", chapter: "C# Book Ch. 4 · Advanced Types", color: "#0369a1", icon: "i-shield-alert", verb: "guard",
    line: "if (name != null) { Say(name); }",
    explain: "null means no object at all — an empty hook with nothing hanging on it. Touching a null by accident is the most famous crash in C#. This line checks first: only say the name if there really is one." },
  { name: "Lambda Block", short: "Lambda", chapter: "C# Book Ch. 8 · LINQ Queries", color: "#4f9cf9", icon: "i-lambda", verb: "whisper",
    line: "Func<int, int> hit = x => x * 2;",
    explain: "A lambda is a tiny unnamed method. Read x => x * 2 as: x goes to x times 2. Func<int, int> is its carrying box — a method that takes an int and returns an int — so the little machine can be stored and fired later: hit(5) gives 10." },
  { name: "LINQ Where Block", short: "Where", chapter: "C# Book Ch. 8 · LINQ Queries", color: "#22d3ee", icon: "i-funnel", verb: "filter",
    line: "var big = nums.Where(n => n > 10);",
    explain: "Where is a filter from LINQ, C#'s built-in question-asking toolbox. It walks a list and keeps only the items that pass your test — here, numbers bigger than 10. The lambda n => n > 10 is the test itself." },
  { name: "LINQ Select Block", short: "Select", chapter: "C# Book Ch. 8 · LINQ Queries", color: "#2f7fe0", icon: "i-cursor", verb: "select",
    line: "var names = items.Select(x => x.Name);",
    explain: "Select is LINQ's transformer: it walks a list and turns each item into something else — here, each item becomes just its Name. Where filters a list down; Select reshapes what comes out of it." },
  { name: "Async Block", short: "Async", chapter: "C# Book Ch. 14 · Concurrency and Asynchrony", color: "#60a5fa", icon: "i-hourglass", verb: "await",
    line: "async Task LoadAsync() { await Fetch(); }",
    explain: "async marks a method that can pause without freezing the whole program. await says: wait for this slow job — a download, a file — but let everything else keep moving meanwhile. Task is the promise slip the method hands back while the work finishes." },
  { name: "Var Block", short: "Var", chapter: "C# Book Ch. 2 · Language Basics", color: "#7cc4ff", icon: "i-eye", verb: "peek",
    line: "var total = price * count;",
    explain: "var tells the compiler: you figure out the type. It looks at the right side of the = and deduces the matching box shape. The box is still fully typed and safe — var just saves you writing the type twice." },
  { name: "Ternary Block", short: "Ternary", chapter: "C# Book Ch. 2 · Language Basics", color: "#48cae4", icon: "i-help", verb: "ask",
    line: "int m = (a > b) ? a : b;",
    explain: "The ternary operator is a one-line if/else that picks a VALUE. The part before the ? is the question; true gets the left value, false gets the right one. Here m becomes whichever of a and b is bigger." },
  { name: "File I/O Block", short: "File IO", chapter: "C# Book Ch. 6 · Framework APIs", color: "#1d4ed8", icon: "i-file", verb: "save",
    line: 'File.WriteAllText("save.txt", data);',
    explain: "File.WriteAllText saves text to a file in one line: the file's name first, then the text to pour into it. Its partner, File.ReadAllText, reads the whole file back as a string. This is how games remember your progress between visits." }
];

/* ---------- C# Library chapters (12) ---------- */
var CS_CHAPTERS = [
  { title: "Getting Started with C#", chapter: "C# Ch. 1–2 · Introducing C# and Language Basics", color: "#53b1fd", scene: 0, line: 'Console.WriteLine("Hello");',
    content: { story: ["C# is a language built for making apps, games and tools — it is the language of Unity games and of programs that run on the .NET platform. Every C# program talks to the screen through one friendly control panel: Console. Console.WriteLine pours a line of text onto the screen and presses Enter at the end, so the next line starts fresh.", "A program is a list of instructions read in order, and C# programs start inside a method called Main — the front door. Older C# (like the C# 8.0 your inspiration book teaches) wraps Main inside a class called Program. Newer C# lets tiny programs skip the wrapping, but the door is always the same: execution starts at Main.", "Boxes hold your values. int score = 0; builds a whole-number box. string name = Console.ReadLine(); builds a text box AND fills it with whatever the player types — reading and storing in a single line. Types are box shapes, and C# checks the shapes strictly, which catches whole families of mistakes before the program even runs."],
      big: "Console.WriteLine talks, Console.ReadLine listens, and typed boxes (int, string, bool, double) hold everything in between.",
      caption: "The Console is the screen's control panel: WriteLine speaks, ReadLine listens. Tap Play to say hello and hear an answer.",
      demo: ["Console wakes up…", "WriteLine pours the words: Hello!", "ReadLine listens… someone types: V", "The text lands in the box called name.", "Talking and listening — a conversation in code."] } },
  { title: "Decisions and Loops", chapter: "C# Ch. 2 · Language Basics", color: "#3ec6dd", scene: 6, line: ["if (hp <= 0) { GameOver(); }", "for (int i = 0; i < 5; i++) { }"],
    content: { story: ["Programs earn their keep by choosing and repeating. if asks a yes/no question: if (hp <= 0) asks whether the hero's health has run out. A yes runs the code in the braces; a no skips it. Its partner else is the otherwise door, and else if chains more questions in a row — the first yes wins.", "switch is the hallway of doors: it looks at ONE value and opens the matching case. break closes each door behind you so you never tumble into the next room. C# 8 even added switch expressions — a switch that hands back a value — but the classic hallway is where everyone starts.", "Loops repeat. for counts its laps with start, rule and step. while asks its question before every lap and repeats while the answer stays yes — so something inside must change each lap, or the question never turns no. foreach is the friendliest of all: it visits every item in a collection without any counting at all."],
      big: "if chooses, switch picks a door, for counts laps, while asks first, and foreach visits every item for you.",
      caption: "The counting wheel and the fork in the road: decisions pick the path, loops walk it again and again. Tap Play.",
      demo: ["Question: is hp <= 0? hp is 2 → NO → play on.", "…damage lands. hp is 0. Question again → YES → GameOver()!", "The wheel spins: i = 0, 1, 2, 3, 4 — five laps.", "foreach takes over: every item visited, no counting.", "Choose, repeat, visit — the rhythm of every program."] } },
  { title: "Arrays, Lists and Collections", chapter: "C# Ch. 2 & 6 · Arrays and Collections", color: "#5ea8f7", scene: 8, line: ["int[] scores = { 10, 20, 30 };", "List<int> scores = new List<int>();"],
    content: { story: ["An array is a row of boxes sharing one name, numbered from 0. int[] scores = { 10, 20, 30 }; builds a row of three whole numbers. scores[0] reaches the first box. Arrays are fast and tidy — but their size is fixed the day they are born.", "A List is the array's flexible cousin. List<int> scores = new List<int>(); creates a list that grows and shrinks while the program runs: scores.Add(40) grows it, scores.Remove(10) shrinks it, and scores.Count always knows how many items are inside. The word new is what actually builds the list — declarations describe, new creates.", "Around these two stands a whole family, the Collections: Dictionary is a wall of labeled drawers found by key, HashSet keeps every different item exactly once, Queue serves first-come-first-served, and Stack takes from the top of the pile. Picking the right holder is half of writing a good program."],
      big: "Arrays are fixed rows; List<T> grows on demand; Dictionary, HashSet, Queue and Stack each hold things their own useful way.",
      caption: "A fixed train and a growing one: the array keeps its size, the List adds carriages whenever it needs them. Tap Play.",
      demo: ["The array is born: [10] [20] [30] — size fixed at 3.", "The List starts empty… Add(10), Add(20), Add(30).", "Add(40) — the List grows a carriage. No rebuild!", "Count reports: 4 items inside.", "Fixed or flexible — choose the holder that fits the job."] } },
  { title: "Strings and Interpolation", chapter: "C# Ch. 6 · Strings and Text", color: "#2fb9e8", scene: 11, line: 'Console.WriteLine($"Score: {score}");',
    content: { story: ["Text in C# lives in string boxes, and strings are everywhere: names, messages, save files, whole books. A string knows its own length (name.Length), can be glued to other strings with +, and can be searched, sliced with Substring, and compared with ==.", "C# strings are immutable — they never change in place. Every edit builds a brand-new string and points your box at it. That sounds wasteful, but it makes text safe to share: nobody can sneak up and alter a string someone else is reading. When a program edits text thousands of times in a loop, the StringBuilder tool does the editing in one reusable buffer instead.", "The friendliest string trick is interpolation. Put $ before the quotes and the string becomes a form with blanks: $\"Score: {score}\" prints Score: 250 when score holds 250. Braces hold any expression — $\"{a} + {b} = {a + b}\" even does the math inside the sentence."],
      big: "Strings are unchangeable text boxes with measuring and searching tools built in — and $\"…{value}…\" lets you write sentences with the answers filled in.",
      caption: "Letter tiles snapping into a sentence, with the score filled into its blank. Tap Play to build the sentence.",
      demo: ["Tile one: \"Sco\" … tile two: \"re\" … joined: \"Score\".", "The $ string has a blank: Score: {score}", "score holds 250 — the blank fills in.", "The screen reads: Score: 250", "Sentences with the answers inside. That is interpolation."] } },
  { title: "Methods — Building Machines", chapter: "C# Ch. 3 · Creating Types", color: "#3b8ef0", scene: 12, line: "int Damage(int atk, int def) { return atk - def; }",
    content: { story: ["A method is a named machine that lives inside a class. int Damage(int atk, int def) promises a whole-number answer, takes two whole-number inputs, and return hands the answer back through the slot. Build the machine once, call it a thousand times — nobody should ever do the same job twice by hand.", "Methods that act instead of calculate are marked void: they print, move, or play a sound, and hand nothing back. The inputs a method receives are its parameters; the values you actually send when calling are the arguments. Parameters are the labeled slots; arguments are what you drop into them.", "C# methods can share a name when their inputs differ — overloading. Damage(int, int) and Damage(int, int, int) are two machines with one name, and C# picks the right one by counting what you hand it. Methods can also offer default values, so a caller may skip an input and the machine uses its stand-in."],
      big: "A method is a named machine in a class: parameters in, work inside, return hands the answer back — and void machines act without answering.",
      caption: "Feed the machine an attack and a defense. It crunches, and the damage pops out. Tap Play to run the machine.",
      demo: ["Feeding in: atk = 9, def = 4", "The machine crunches: 9 - 4 …", "Out pops the answer: 5", "Call Damage(20, 3) — same machine, new answer: 17.", "Built once. Used forever."] } },
  { title: "Classes, Properties and Constructors", chapter: "C# Ch. 3 · Creating Types", color: "#2f9be8", scene: 13, line: ["class Block { public int Size { get; set; } }", "public Block(int size) { Size = size; }"],
    content: { story: ["A class is a blueprint for objects — boxes of your own design, with data and machines inside. Building a real object from the blueprint is called creating an instance, and the word new does the building: Block gem = new Block();. The blueprint describes; new delivers.", "Properties are a class's smart doorways. public int Size { get; set; } lets outside code read Size and change it, while the class keeps the right to check or react later. A property can even be read-only — { get; } with no set — a window you can look through but never open.", "The constructor is the birth ceremony: a special method with the class's own name and no return type, which runs the instant new builds the object. public Block(int size) { Size = size; } means every Block is born already knowing its size — no half-built objects wandering the program."],
      big: "class draws the blueprint, new builds the object, properties are its smart doorways, and the constructor makes sure it is born complete.",
      caption: "A blueprint on the drawing board, a birth ceremony, and a doorway with two handles: get and set. Tap Play to build a Block.",
      demo: ["Reading the blueprint: class Block.", "new Block(5) — the constructor runs at birth…", "Size is set to 5 before anyone touches the object.", "Outside code reads through the door: gem.Size → 5", "Blueprint, birth, doorway. A complete object."] } },
  { title: "Inheritance, Override and Interfaces", chapter: "C# Ch. 3 · Creating Types", color: "#7fb2e5", scene: 14, line: ["class FireBlock : Block { }", "public override void Speak() { }", "interface IDrawable { void Draw(); }"],
    content: { story: ["Inheritance lets a new class start from an old one. class FireBlock : Block says: give me everything Block has, then I will add fire. The child IS a Block in every way that matters, plus its own gifts. C# classes inherit from exactly one parent class — one family tree, no tangles.", "A parent can mark a method virtual — an open invitation for children to replace it. Each child answers with override, and the same call then behaves differently per child: Dog overrides Speak() to bark, Cat to meow. One call, many voices: that is polymorphism, and it only works when the parent said virtual first.", "Interfaces are pure promise lists. interface IDrawable { void Draw(); } names a method without any working code. A class that signs the interface — class Sprite : IDrawable — guarantees it provides Draw(). One class can sign many interfaces, so programs can group objects by what they promise to do, whatever family they come from."],
      big: "Inherit with :, replace with override (the parent must say virtual), and promise with an interface — three ways classes team up.",
      caption: "The child blueprint copies the parent for free, then answers in its own voice and signs a promise. Tap Play.",
      demo: ["Parent blueprint: Block (has Size).", "FireBlock inherits Size… for free!", "Parent said virtual Speak() — the invitation is open.", "Child answers with override: its own voice.", "And it signs IDrawable, promising: I can Draw()."] } },
  { title: "Enums and Structs", chapter: "C# Ch. 3 · Creating Types", color: "#4f9cf9", scene: 5, line: ["enum Color { Red, Green, Blue }", "struct Point { public int X; public int Y; }"],
    content: { story: ["An enum names a small set of choices. enum Color { Red, Green, Blue } means a Color can only ever be one of those three — the compiler refuses anything else. Underneath, the names stand for numbers (Red is 0, Green is 1), but the code reads like English and mistakes become impossible to write.", "A struct bundles a few values into one light package. struct Point { public int X; public int Y; } keeps a screen position's two numbers traveling together. The big difference from a class: structs are value types. Hand a struct to a method and the method gets a COPY; hand over a class object and the method shares the original.", "That one difference decides which to use. Small, simple data that behaves like a number — points, colors, dates — fits a struct. Bigger things with identity and behavior — players, blocks, accounts — belong in classes. C# even ships famous structs: int, double, bool and DateTime are all structs under the hood."],
      big: "Enums name a fixed set of choices; structs bundle small values and are copied when handed over, while classes are shared.",
      caption: "Three labeled doors for the enum, and a two-pocket package for the point. Tap Play to open them.",
      demo: ["enum Color offers exactly three doors…", "Red opens — the value underneath is 0.", "Point packs two numbers: X = 3, Y = 4.", "Hand the Point over — the receiver gets a COPY.", "Change the copy… the original stays 3, 4. Value types!"] } },
  { title: "Handling Errors with Try/Catch", chapter: "C# Ch. 4 · Advanced Types", color: "#6495ed", scene: 15, line: "try { Play(); } catch { }",
    content: { story: ["When something goes badly wrong while a C# program runs — a file is missing, a number is divided by zero — the program throws an EXCEPTION: an error package that flies up through the program looking for a handler. If nothing catches it, the program stops and shows the package's message. Exceptions are how C# reports trouble without silently producing wrong answers.", "try marks the risky ground. try { Play(); } catch { } says: run Play, but watch it — if it throws, jump sideways into catch and land softly instead of crashing. The lines after the risky one inside try are skipped the moment the throw happens; the jump is instant.", "A catch can name what it caught: catch (FileNotFoundException) handles only missing files, while a plain catch takes anything. Caught exceptions carry a Message explaining themselves, and the finally block runs afterwards no matter what — the tidy-up crew that always gets its turn, perfect for closing files."],
      big: "Risky code lives in try; a thrown exception jumps to the matching catch; finally always tidies up afterwards.",
      caption: "The tightrope walker trips — but the net catches every fall, and the tidy-up crew always gets its turn. Tap Play.",
      demo: ["Play() walks the tightrope inside try { }…", "Uh oh — an exception is thrown!", "Falling… falling… caught by catch!", "The Message reads: what went wrong, in words.", "finally tidies up. The program lives on."] } },
  { title: "Lambdas and LINQ", chapter: "C# Ch. 8–9 · LINQ Queries and Operations", color: "#31b8c6", scene: 17, line: ["var big = nums.Where(n => n > 10);", "var names = items.Select(x => x.Name);"],
    content: { story: ["A lambda is a method with no name, folded on the spot: n => n > 10 reads as n goes to n is greater than 10 — a tiny test you can hand to other code. The => arrow is pronounced goes to, and once you can fold lambdas, a whole toolbox unlocks.", "That toolbox is LINQ — Language Integrated Query — C#'s built-in way of asking questions about collections. Where filters: nums.Where(n => n > 10) keeps only the big numbers. Select transforms: items.Select(x => x.Name) turns every item into its name. OrderBy sorts, Count counts, First takes the top one, Any asks if anything passes the test.", "LINQ questions chain like a sentence: nums.Where(n => n > 10).OrderBy(n => n).Select(n => n * 2) filters, sorts, then doubles — read left to right, one machine feeding the next. And nothing runs until you actually look at the answers: LINQ is lazy, preparing the question first and cooking only when asked."],
      big: "Lambdas are pocket-sized tests (n => n > 10); LINQ chains them — Where filters, Select transforms, OrderBy sorts — and cooks lazily, only when asked.",
      caption: "A stream of numbers flowing through three machines: filter, sort, double. Tap Play to open the gates.",
      demo: ["The stream: 4, 17, 9, 23, 12", "Where(n => n > 10) filters: 17, 23, 12 remain.", "OrderBy lines them up: 12, 17, 23.", "Select(n => n * 2) doubles each: 24, 34, 46.", "One chain. Three machines. Questions answered."] } },
  { title: "Async and Await", chapter: "C# Ch. 14 · Concurrency and Asynchrony", color: "#60a5fa", scene: 22, line: "async Task LoadAsync() { await Fetch(); }",
    content: { story: ["Some jobs are slow: downloading a file, reading a big save, asking a server a question. If a program simply stopped and waited, the screen would freeze and the buttons would die. Async is C#'s answer — do the waiting WITHOUT blocking everything else.", "Mark a method async and it can use await. await Fetch(); means: start the fetch, and while it travels, let the rest of the program keep running — animations, buttons, music. When the fetch lands, the method wakes up exactly where it paused and carries on, as if the wait were one ordinary line.", "The Task is the promise slip. An async method hands back a Task the moment it first pauses: the job is not done, but here is your slip — await the slip later to collect the finished result. Whole interfaces stay responsive because every slow job is a slip, not a roadblock."],
      big: "async lets a method pause at await without freezing the program; Task is the promise slip for work still cooking.",
      caption: "The order is placed, the slip is handed over, and the kitchen — and the whole restaurant — keeps moving. Tap Play.",
      demo: ["LoadAsync starts… the fetch will be slow.", "await: the method pauses and hands back a Task slip.", "Meanwhile the screen keeps animating. Nothing froze.", "The fetch lands! The method wakes where it paused.", "Result collected. Slow job, smooth program."] } },
  { title: "Files and Saving Data", chapter: "C# Ch. 6 · Framework APIs", color: "#1d4ed8", scene: 28, line: 'File.WriteAllText("save.txt", data);',
    content: { story: ["Everything so far lived in memory — and memory forgets the moment the program closes. Files are how programs remember. File.WriteAllText(\"save.txt\", data) pours text into a file on disk in one line; File.ReadAllText(\"save.txt\") reads the whole file back as a string whenever you need it again.", "Whole files are not always the right shape. File.WriteAllLines takes a collection of strings and gives each one its own line — perfect for high-score lists. File.Exists asks whether a file is there before you try to read it, and the Path helper builds file paths that work on any machine, joining folders and names safely.", "Saving has one golden rule: save TEXT in a shape you can read back. Games save scores as numbers in text, settings as name = value lines, and whole worlds as structured text like JSON. Write it plainly today, and future-you can always load it tomorrow."],
      big: "File.WriteAllText and ReadAllText save and load whole files in one line each; Exists checks first, and plain text is the shape that always loads back.",
      caption: "The drawer wall of files: one line saves, one line loads, and your progress survives the night. Tap Play.",
      demo: ["data holds the score: 250", "File.WriteAllText pours it into save.txt…", "The program closes. Memory forgets everything!", "Next visit: File.ReadAllText reads save.txt back.", "250 — remembered. Files are a program's long-term memory."] } }
];

var CS_DEEP = [
  { more: ["Names matter in C#: methods and classes wear PascalCase (every word capitalized, like WriteLine), while local variables wear camelCase (first word small, like playerName). The casing is a signal — readers can tell a machine from a box at a glance.", "The semicolon ends almost every statement, and C# is strict about it. When the compiler points at a strange line, the real problem is usually a missing ; at the end of the line just above — the same detective rule as every language in this app."],
    ex: { code: "string player = \"V\";\nint score = 250;\nConsole.WriteLine($\"{player}: {score}\");",
          walk: ["Line 1: a text box holding the player's name.", "Line 2: a whole-number box holding the score.", "Line 3: an interpolated sentence — both blanks fill in as the line runs, and the screen reads: V: 250.", "Three lines: two boxes and a sentence with the answers inside. Most programs are exactly this, at heart."] },
    mistake: "Writing Console.Writeline with a small l. C# names are case-sensitive — WriteLine and Writeline are completely different names, and only one of them exists. When a famous name is 'not found', check its capitals first." },
  { more: ["A question can combine two smaller questions: && means both must be true, || means either will do, and ! flips an answer. hp > 0 && hasKey asks two things at once — alive AND carrying the key — before the door opens.", "break leaves a loop early, and return leaves a whole method early, handing back its answer on the way out. Both are polite exits: the program does not crash out, it simply stops doing work it no longer needs."],
    ex: { code: "for (int i = 1; i <= 3; i++) {\n    if (i == 2) {\n        Console.WriteLine(\"Two!\");\n    }\n}",
          walk: ["Line 1: the counting machine will visit i = 1, 2, 3.", "Line 2: each lap asks its question — is this the lap where i is 2?", "Line 3: only lap 2 says anything. Laps 1 and 3 pass in silence.", "A loop provides the laps; an if decides what each lap does. Most game logic is those two, dancing."] },
    mistake: "Writing = where == belonged inside a question. if (hp = 0) does not ask about hp — in C# the compiler actually stops you here, because the result is not a yes/no value. Thank it: it just caught the sneakiest typo in programming." },
  { more: ["Every collection can be walked with foreach: foreach (int n in scores) visits each item in turn, handing you the item itself — never an index to get wrong. When you need the items but not their positions, foreach is the loop to reach for.", "Arrays and lists answer questions about themselves: scores.Length for an array, scores.Count for a list — how many items right now. Mixing those two up is a rite of passage; the array measures length, the list keeps count."],
    ex: { code: "List<string> team = new List<string>();\nteam.Add(\"V\");\nteam.Add(\"Nova\");\nConsole.WriteLine(team.Count);",
          walk: ["Line 1: a stretchy list built for text, born empty.", "Lines 2–3: Add grows the list twice — two names file in.", "Line 4: Count reports 2. The list always knows its own size.", "No size was ever declared. The List simply grew to fit the job."] },
    mistake: "Reaching one past the end: scores[3] on a three-item list. Positions count from 0, so the last item is [2] — [3] throws an exception the moment the program runs. When a crash names an index, count the items from zero." },
  { more: ["Joining strings with + inside a long loop quietly builds hundreds of throwaway strings. For serious text-building, StringBuilder is the workshop bench: Append adds pieces to one reusable buffer, and ToString lifts the finished text off the bench in one go.", "Verbatim strings wear an @: @\"C:\\Games\\Saves\" keeps the backslashes honest instead of treating them as escape codes. And a raw newline inside a normal string needs the escape \\n — two characters that mean one invisible line break."],
    ex: { code: "string first = \"Code\";\nstring whole = first + \" Block\";\nConsole.WriteLine(whole.Length);",
          walk: ["Line 1: a text box holding Code.", "Line 2: + glues Block on — and builds a NEW string, because strings never change in place.", "Line 3: Length counts every letter and the space: 10.", "The original \"Code\" was never altered. Immutability means edits always make a fresh string."] },
    mistake: "Comparing strings with == works in C# — but comparing with a single = does not ask anything at all; it tries to store. And measuring with .Length counts the spaces too: \"Code Block\" is 10 characters, not 9." },
  { more: ["A method can call itself — recursion — solving a big problem by shrinking it one step at a time, as long as some smallest case stops the shrinking. It is elegant and dangerous in equal measure: forget the stopping case and the calls pile up until the program runs out of stack.", "Methods can also be static: a static method belongs to the class itself, not to any object built from it. Console.WriteLine is static — you never build a Console object; you just use the class's own machine. Main is static for the same reason: the program starts before any object exists."],
    ex: { code: "static int Triple(int x) {\n    return x * 3;\n}\nint answer = Triple(7);",
          walk: ["Line 1: a static machine — it belongs to the class, ready before any object is born.", "Line 2: its one job: hand back the input times three.", "Line 4: the call. 7 goes in, and the answer box receives 21.", "Machines that only need their inputs — no object, no fuss — are natural static methods."] },
    mistake: "Defining the machine but never calling it. Writing Damage() teaches C# the recipe; nothing happens until a line somewhere calls Damage(9, 4). If a method 'does nothing', hunt for the missing call before doubting the recipe." },
  { more: ["A class can have SEVERAL constructors — a welcoming committee. One takes a size, one takes nothing and uses a sensible default. Callers pick the ceremony that matches what they know, and every road leads to a complete object.", "The word this means the object itself, from inside. this.Size = size untangles the classic puzzle where the parameter and the property share a name: this.Size is the object's own doorway; plain size is the delivery that just arrived."],
    ex: { code: "Block gem = new Block(5);\ngem.Size = 9;\nConsole.WriteLine(gem.Size);",
          walk: ["Line 1: new runs the constructor with 5 — the gem is born with Size already 5.", "Line 2: the property's set door opens and 9 replaces 5. The class could have objected; this one allows it.", "Line 3: the get door answers: 9.", "Born complete, adjusted through the doorway — that is the life of a well-built object."] },
    mistake: "Forgetting new. Block gem; declares a hook for a Block but builds nothing — gem is null, and the first gem.Size throws the famous NullReferenceException. Declaration describes; only new delivers." },
  { more: ["Polymorphism has one strict entry rule: you must hold the child through the PARENT's kind of reference. Block b = new FireBlock(); keeps a FireBlock on a Block hook — and overridden methods still answer in the child's voice, because C# looks at what is really hanging there.", "The keyword base is the child's line to its parent: base.Speak() runs the parent's version from inside the child's override — handy when the child wants to ADD to the parent's behavior rather than replace it completely."],
    ex: { code: "Block b = new FireBlock();\nb.Speak();",
          walk: ["Line 1: a FireBlock is built, but held on a Block hook — the reference is the parent, the object is the child.", "Line 2: Speak() is called through the parent hook…", "…and the FIREBLOCK's override answers, because C# checks the real object at run time.", "Parent hook, child voice. That two-line trick is polymorphism itself."] },
    mistake: "Forgetting virtual in the parent. Without it, the child cannot override — C# warns that the child method hides the parent's instead, and calls through a parent hook use the parent's version. Same call, wrong voice: check for the missing virtual." },
  { more: ["Enum values can be given flags: days of the week, permissions, options that combine. With the [Flags] label, Weekend = Saturday | Sunday packs two choices into one value, and & checks whether a flag is inside.", "Structs shine brightest as tiny bundles passed around constantly — a Point crosses the program a hundred times a second in a game. Because each hand-off copies it, nobody can accidentally move someone else's point. Copying is the safety."],
    ex: { code: "Color pick = Color.Green;\nif (pick == Color.Green) {\n    Console.WriteLine(\"Go!\");\n}",
          walk: ["Line 1: a Color box holding the named choice Green — not 1, not \"green\", the name itself.", "Line 2: comparing names with == — readable at a glance, impossible to mistype into a wrong number.", "Line 3: the matching choice runs its line.", "Enums turn magic numbers into sentences. Future readers — including future you — say thanks."] },
    mistake: "Treating an enum like a string. Color.Green is not the text \"Green\" — printing it shows the name, but storing names in string boxes throws away the compiler's protection. Keep choices in enum boxes and let the compiler guard the doors." },
  { more: ["An exception skips everything between the throw and the catch — including, potentially, the line that was supposed to close a file. That is exactly why finally exists: its block runs on the way out no matter which road the program took, success or disaster.", "Catching too broadly too early hides clues: a plain catch { } swallows the exception AND its Message. Catch, yes — but read the Message while you are learning, even if you only print it for yourself. Detectives do not shred evidence."],
    ex: { code: "try {\n    OpenTreasure();\n} catch (Exception e) {\n    Console.WriteLine(e.Message);\n}",
          walk: ["Line 1: the risky ground begins — everything in these braces is watched.", "Line 2: the risky act. If it throws, the jump happens here.", "Line 3: this catch receives the exception itself, in a box called e.", "Line 4: the Message explains the failure in words — evidence, printed, not shredded."] },
    mistake: "Using exceptions for ordinary flow — throwing when a guess is simply wrong, or a name is merely missing from a list. Exceptions are for exceptional trouble; everyday answers deserve everyday if checks. Programs that cry wolf are miserable to debug." },
  { more: ["LINQ has a second costume: query syntax, which reads like a tiny sentence — from n in nums where n > 10 select n. It compiles to the very same Where and Select machines. Most programmers mix both costumes freely, choosing whichever reads clearer for the question at hand.", "Because LINQ is lazy, a query is a recipe, not a meal. big does not hold answers until something enumerates it — a foreach, a Count, a ToList(). Change the list after writing the query and the answers change too, because the cooking happens at serving time."],
    ex: { code: "List<int> nums = new List<int> { 4, 17, 9 };\nvar big = nums.Where(n => n > 10);\nConsole.WriteLine(big.Count());",
          walk: ["Line 1: a list of three numbers, born with its items inside the braces.", "Line 2: the question is written — but not yet cooked. big is a recipe.", "Line 3: Count() forces the cooking: only 17 passes the test, so the answer is 1.", "Write the question once, cook it whenever you are hungry. That is deferred execution."] },
    mistake: "Expecting a Where result to be a List. It is a lazy sequence — you cannot index it like nums[0] or Add to it. When you truly need a list, finish the chain with .ToList() and take the snapshot." },
  { more: ["Not every async method should be awaited immediately. Starting three downloads first and awaiting them together lets the slow jobs travel side by side instead of queuing — the difference between three errands in one trip and three separate trips.", "The kitchen timer of async is Task.WhenAll: hand it several slips and await once — it completes when the slowest job lands. Its sibling WhenAny completes with the FIRST finisher, perfect for racing mirrors and picking the fastest answer."],
    ex: { code: "async Task<int> FetchScore() {\n    await Task.Delay(100);\n    return 250;\n}",
          walk: ["Line 1: an async method promising an int — the Task<int> is the slip; the int is what's inside when it completes.", "Line 2: a pretend slow job: a 100-millisecond delay that never freezes the program.", "Line 3: the result is delivered into the slip, ready for whoever awaits it.", "Callers write int score = await FetchScore(); and receive 250 — after a pause that blocked nothing."] },
    mistake: "Marking a method async and never awaiting anything inside — C# warns you, because the method then runs start-to-finish like an ordinary one and the async label is a costume with nothing inside. The warning is a friend: async earns its keep only at an await." },
  { more: ["Files live at paths, and paths differ between machines — Path.Combine(\"saves\", \"slot1.txt\") builds the right path anywhere, instead of gluing folder names with slashes and hoping. Directories have their own helper: Directory.CreateDirectory makes the folder if it is missing, quietly doing nothing if it is already there.", "A file you write is a file you must be able to read after ANY crash — even one mid-save. Careful games write to a temporary file first and swap it into place only when the writing finishes, so a half-written save can never replace a good one."],
    ex: { code: "File.WriteAllText(\"hi.txt\", \"Hello\");\nstring back = File.ReadAllText(\"hi.txt\");\nConsole.WriteLine(back);",
          walk: ["Line 1: one line pours Hello into a file called hi.txt, creating it on the spot.", "Line 2: another single line reads the whole file back into a string box.", "Line 3: the screen proves the round trip: Hello.", "Save and load, one line each. The entire trick behind every save game you have ever kept."] },
    mistake: "Reading a file that might not exist. The first run of any program has no save file yet — File.ReadAllText throws FileNotFoundException and the program dies on its first morning. Check File.Exists first, or wrap the read in the try/catch you met two chapters ago." }
];

/* ---------- C# shelves (4) + their deep content ---------- */
var CS_SHELVES = [
  { title: "Collections Field Guide", chapter: "Beyond the Book · C# shelf", num: "S1", color: "#2563eb", scene: 23,
    line: ["List<int> bag = new List<int>();", "Dictionary<string, int> scores = new Dictionary<string, int>();"],
    content: { story: ["The Base Class Library — the BCL — is C#'s built-in workshop, and its busiest shelf is Collections. Every holder answers the same question differently: how will you reach your things? By position, by name, by arrival order, or just by asking whether something is inside?", "List<T> reaches by position and grows freely. Dictionary<TKey, TValue> is the wall of labeled drawers: scores[\"V\"] = 250 files a value under a name, and the same name tag fetches it back instantly, however many drawers the wall holds. HashSet<T> keeps every different item exactly once and answers Contains at lightning speed — the bouncer list of collections.", "The specialists finish the tour: Queue<T> serves first-come-first-served (Enqueue joins the back, Dequeue takes the front), Stack<T> serves last-in-first-out from the top (Push and Pop), and arrays remain the fixed, fastest row underneath everything. Choosing a collection is choosing how your future questions get answered."],
      big: "List by position, Dictionary by name, HashSet for one-of-each membership, Queue first-come, Stack last-in — pick the holder that matches your question.",
      caption: "The workshop wall in C#: a growing list, labeled drawers, a bouncer list, a queue and a pile. Tap Play for the tour.",
      demo: ["List: bag grows by Add — position is the address.", "Dictionary: the drawer labeled V opens — 250 inside.", "HashSet: is 7 on the list? Contains answers instantly.", "Queue: first to arrive is first served.", "Stack: the last plate on is the first plate off."] } },
  { title: "Strings and Text Workshop", chapter: "Beyond the Book · C# shelf", num: "S2", color: "#1d4ed8", scene: 11,
    line: "string shout = name.ToUpper();",
    content: { story: ["Text work is half of everyday programming, and C# strings come with a full workbench. Length measures, IndexOf hunts for a piece, Substring cuts a piece out, Replace swaps pieces, Split breaks a sentence into words at a chosen separator, and Trim tidies the ragged spaces from both ends.", "Case is a tool, not a fact: ToUpper and ToLower rebuild a string in shouting or whispering case — the standard trick for comparing a player's typed answer against the expected one without caring how they capitalized it. And Contains asks the yes/no question that half of all text code boils down to.", "Remember the workshop rule: strings never change in place, so every tool hands back a NEW string — name = name.Trim() keeps the trimmed version; forgetting to keep it is the classic workshop wobble. When the edits number in the thousands, StringBuilder does them all on one reusable bench instead."],
      big: "Measure with Length, hunt with IndexOf, cut with Substring, tidy with Trim, compare case-free with ToLower — and always keep the new string these tools hand back.",
      caption: "The text workbench: measuring, hunting, cutting and tidying a sentence, one tool at a time. Tap Play.",
      demo: ["The sentence on the bench: \"  Code Block  \"", "Trim tidies the ends: \"Code Block\"", "ToUpper shouts it: \"CODE BLOCK\"", "IndexOf hunts \"Block\" — found at position 5.", "Split at the space: two words on the bench."] } },
  { title: "The LINQ Query Kitchen", chapter: "Beyond the Book · C# shelf", num: "S3", color: "#0284c7", scene: 8,
    line: "var top = scores.Where(s => s > 50).OrderByDescending(s => s).First();",
    content: { story: ["Welcome to the kitchen where collections go in raw and answers come out cooked. LINQ's machines each do one job: Where is the gatekeeper that filters, OrderBy is the ranker that sorts, Select is the reshaper on the end of the counter, and First, Count, Sum and Any are the tasters that turn a whole stream into a single answer.", "Cooking is chained: scores.Where(s => s > 50).OrderByDescending(s => s).First() reads like a sentence \u2014 from the scores, keep the ones over fifty, rank biggest first, take the champion. Each machine hands its output to the next, and the lambda at each station is the little test or rule that station works by.", "The kitchen's secret is that nothing cooks until you order. A query is a recipe card, not a meal: it re-reads its ingredients every time it is enumerated. That laziness is a gift (questions stay fresh) and a trap (enumerating twice cooks twice) \u2014 so kitchens that serve the same dish all day call ToList() once and keep the tray."],
      big: "Where filters, OrderBy sorts, Select reshapes, First and Count answer — and the whole chain cooks lazily, only when you ask for a serving.",
      caption: "The query kitchen: raw ingredients flow in one end, questions are chained along the counter, and answers are served on demand. Tap Play.",
      demo: ["Ingredients: scores 30, 90, 55, 70.", "Where(s => s > 50) keeps the big ones: 90, 55, 70.", "OrderByDescending ranks them: 90, 70, 55.", "First() takes the champion: 90.", "One chain, cooked only when asked. The kitchen is lazy — wisely."] } },
  { title: "Async and Tasks Workshop", chapter: "Beyond the Book · C# shelf", num: "S4", color: "#0369a1", scene: 22,
    line: "int score = await FetchScoreAsync();",
    content: { story: ["This workshop turns Chapter 11's idea into daily practice. The naming custom comes first: async methods end in Async — FetchScoreAsync — so every caller can see from the name alone that a wait is involved and a Task is coming back.", "The three moves of the workshop: start the job (the method returns its Task slip at the first await), do other work while it travels, then await the slip to collect the result. Await is not blocking — the thread that waits is released to serve other work, which is why interfaces stay smooth under hundreds of little waits.", "And the safety rail: never block a slip with .Result in interface code — that chains the thread to the spot and can deadlock the kitchen. await is the polite collect; it always lets the restaurant keep serving."],
      big: "Name async methods with Async, start jobs before awaiting them, collect results with await — and never block on .Result where the screen must stay alive.",
      caption: "Slips on the counter, jobs traveling, results collected without a single frozen screen. Tap Play to run the workshop.",
      demo: ["FetchScoreAsync starts — slip handed back instantly.", "The interface keeps serving other guests.", "A second job starts BEFORE the first is awaited.", "Task.WhenAll watches both slips at once.", "Both land. await collects: smooth, unfrozen, done."] } }
];

var CS_SHELFDEEP = [
  { more: ["Two collections deserve a closer look. LinkedList<T> chains items hand to hand, making mid-list insertions nearly free but position-reaching slow — a conga line, not a row of boxes. And SortedDictionary keeps its drawers in key order at all times, so walking it visits names alphabetically without any separate sort.", "Every generic collection wears its contents in angle brackets — List<int>, Dictionary<string, int> — which means the compiler checks EVERY item you file. A List<int> physically cannot accept a string. That strictness is the entire point of generics: whole species of mix-ups die at compile time."],
    ex: { code: "Dictionary<string, int> scores = new Dictionary<string, int>();\nscores[\"V\"] = 250;\nscores[\"V\"] += 50;\nConsole.WriteLine(scores[\"V\"]);",
          walk: ["Line 1: the drawer wall is built — string name tags, int treasures.", "Line 2: drawer V is created on the spot and filled with 250.", "Line 3: the same tag opens the same drawer: 50 piles on, making 300.", "Line 4: fetched by name and printed: 300. No searching — the tag IS the address."] },
    mistake: "Reading a drawer that was never created. scores[\"Nova\"] throws KeyNotFoundException when no Nova filed anything yet. Ask first with ContainsKey, or use TryGetValue, which answers false politely instead of throwing." },
  { more: ["Split and Join are mirror twins: Split breaks one string into a tray of pieces at a separator; string.Join glues a tray of pieces back into one string with a separator between them. CSV files, word games and save formats are all just these two, dancing.", "Format placeholders are interpolation's older sibling: string.Format(\"{0} wins {1} coins\", name, coins) fills numbered blanks. Interpolation wins on readability — the values sit inside the sentence — but you will meet Format in older code everywhere, and now you can read it."],
    ex: { code: "string phrase = \"Code Block Rocks\";\nstring[] words = phrase.Split(' ');\nConsole.WriteLine(words.Length);",
          walk: ["Line 1: the sentence on the bench.", "Line 2: Split cuts at every space, delivering a tray of three strings: Code, Block, Rocks.", "Line 3: the tray reports its size: 3 words.", "One line turned prose into a countable, sortable, playable list of words."] },
    mistake: "Splitting on a space and being surprised by empty pieces: double spaces and leading spaces each leave an empty string in the tray. Trim first, or hand Split the option to remove empties — StringSplitOptions.RemoveEmptyEntries earns its long name." },
  { more: ["GroupBy is the kitchen's sorting hat: it buckets items by a shared trait — players by team, scores by level — and hands you each bucket with its key. Many real questions are two-step: group first, then taste each bucket with Count or Max.", "Deferred execution has one more consequence worth memorizing: a query over a list you are EDITING will throw if you enumerate it mid-edit. Snapshot with ToList() before a loop that changes the ingredients, and the recipe cooks from the photograph instead."],
    ex: { code: "List<int> scores = new List<int> { 30, 90, 55 };\nint best = scores.Max();\nint total = scores.Sum();",
          walk: ["Line 1: three scores on the counter.", "Line 2: Max tastes the whole stream and answers the champion: 90.", "Line 3: Sum folds the stream into one number: 175.", "No loops were written. The tasters did the walking, and your code said only what it wanted."] },
    mistake: "Calling First() on a stream that might be empty — if the filter keeps nothing, First throws. FirstOrDefault is the forgiving sibling: it answers the type's default (0, null) when the stream runs dry. Reach for it whenever 'maybe none' is a real answer." },
  { more: ["Cancellation is the workshop's fire alarm: a CancellationToken can be handed to long jobs, and when the user presses Stop, the token rings and well-behaved jobs wrap up early instead of cooking on. Any await can listen for the alarm.", "Exceptions in async land arrive at the await, not at the starting line — a job that failed while traveling delivers its exception when you collect the slip. Wrap the await in try/catch and the net from Chapter 9 catches async trouble exactly like ordinary trouble."],
    ex: { code: "Task<int> slip = FetchScoreAsync();\nServeOtherGuests();\nint score = await slip;",
          walk: ["Line 1: the job starts and the slip comes back immediately — the fetch is already traveling.", "Line 2: other work happens while the job travels. Nothing waited.", "Line 3: only NOW does the code await — collecting 250 from the finished slip.", "Start early, await late: the golden rhythm of responsive programs."] },
    mistake: "Writing async void for ordinary methods. An async void method's exceptions cannot be caught by its caller and its completion cannot be awaited — it is a slip nobody holds. Reserve async void for event handlers; everything else returns Task or Task<T>." }
];

/* ---------- C# PC projects (12) ---------- */
var CS_PROJECTS = [
  { name: "Rocket Countdown", file: "Program.cs",
    about: "A for loop counts the rocket down to blast off. Change the start number and the rocket counts from somewhere new.",
    vars: [{ key: "start", label: "start", val: 5, min: 1, max: 12 }],
    code: function (v) { return ["using System;", "", "class Program {", "    static void Main() {", "        int start = " + v.start + ";", "        for (int i = start; i > 0; i--) {", "            Console.WriteLine(i + \"...\");", "        }", "        Console.WriteLine(\"Blast off!\");", "    }", "}"]; },
    run: function (v) { var out = []; for (var i = v.start; i > 0; i--) out.push(i + "..."); out.push("Blast off!"); return out; },
    explain: "The for loop starts at your number and counts down by 1 (i--) until it passes 0. Console.WriteLine prints each count on its own line, then the line after the loop fires the rocket." },
  { name: "Star Steps", file: "Program.cs",
    about: "Two loops build a staircase of stars — the outer loop picks the step, the inner loop draws that many stars.",
    vars: [{ key: "rows", label: "rows", val: 4, min: 1, max: 8 }],
    code: function (v) { return ["using System;", "", "class Program {", "    static void Main() {", "        int rows = " + v.rows + ";", "        for (int r = 1; r <= rows; r++) {", "            for (int s = 0; s < r; s++) {", "                Console.Write(\"*\");", "            }", "            Console.WriteLine();", "        }", "    }", "}"]; },
    run: function (v) { var out = []; for (var r = 1; r <= v.rows; r++) { var row = ""; for (var s = 0; s < r; s++) row += "*"; out.push(row); } return out; },
    explain: "A loop inside a loop! Console.Write prints stars side by side without pressing Enter; the empty WriteLine() ends each row. Row 1 draws 1 star, row 2 draws 2 — nested loops are how patterns are born." },
  { name: "Coin Bank", file: "Program.cs",
    about: "Drop coins into the bank one by one with total += each — and watch the total pile up.",
    vars: [{ key: "coins", label: "coins", val: 4, min: 1, max: 10 }, { key: "each", label: "each (cents)", val: 25, min: 1, max: 100 }],
    code: function (v) { return ["using System;", "", "class Program {", "    static void Main() {", "        int total = 0;", "        int coins = " + v.coins + ";", "        int each = " + v.each + ";", "        for (int c = 1; c <= coins; c++) {", "            total += each;", "            Console.WriteLine($\"Coin {c}: total {total}\");", "        }", "    }", "}"]; },
    run: function (v) { var out = [], t = 0; for (var c = 1; c <= v.coins; c++) { t += v.each; out.push("Coin " + c + ": total " + t); } return out; },
    explain: "total += each piles each coin onto the running total — nothing is ever erased. The $ string is interpolation: the {c} and {total} blanks fill in fresh on every lap, so one WriteLine prints every stage of the pile." },
  { name: "Score Doubler", file: "Program.cs",
    about: "Start with a small score and double it every round with score *= 2.",
    vars: [{ key: "score", label: "score", val: 3, min: 1, max: 50 }, { key: "rounds", label: "rounds", val: 4, min: 1, max: 8 }],
    code: function (v) { return ["using System;", "", "class Program {", "    static void Main() {", "        int score = " + v.score + ";", "        int rounds = " + v.rounds + ";", "        for (int r = 1; r <= rounds; r++) {", "            score *= 2;", "            Console.WriteLine($\"Round {r}: {score}\");", "        }", "    }", "}"]; },
    run: function (v) { var out = [], s = v.score; for (var r = 1; r <= v.rounds; r++) { s *= 2; out.push("Round " + r + ": " + s); } return out; },
    explain: "score *= 2 means: take what is in the box, double it, keep the result in the same box. Doubling grows FAST — a few extra rounds and the numbers explode." },
  { name: "Robot Walker", file: "Program.cs",
    about: "A little robot walks step by step. Its position lives in a variable, and every lap of the while loop adds one step.",
    vars: [{ key: "steps", label: "steps", val: 5, min: 1, max: 12 }],
    code: function (v) { return ["using System;", "", "class Program {", "    static void Main() {", "        int steps = " + v.steps + ";", "        int pos = 0;", "        while (pos < steps) {", "            pos++;", "            Console.WriteLine($\"Step! Position {pos}\");", "        }", "        Console.WriteLine(\"Arrived!\");", "    }", "}"]; },
    run: function (v) { var out = []; for (var p = 1; p <= v.steps; p++) out.push("Step! Position " + p); out.push("Arrived!"); return out; },
    explain: "The while loop keeps asking: is pos still less than steps? Each lap, pos++ moves the robot one tile closer, so the answer eventually flips to no — and the robot arrives." },
  { name: "Tip Calculator", file: "Program.cs",
    about: "Work out a restaurant tip: multiply the bill by the percent, divide by 100, then add it on.",
    vars: [{ key: "bill", label: "bill ($)", val: 40, min: 5, max: 200 }, { key: "percent", label: "percent", val: 15, min: 0, max: 50 }],
    code: function (v) { return ["using System;", "", "class Program {", "    static void Main() {", "        int bill = " + v.bill + ";", "        int percent = " + v.percent + ";", "        int tip = bill * percent / 100;", "        int total = bill + tip;", "        Console.WriteLine($\"Bill: ${bill}\");", "        Console.WriteLine($\"Tip: ${tip}\");", "        Console.WriteLine($\"Total: ${total}\");", "    }", "}"]; },
    run: function (v) { var tip = Math.floor(v.bill * v.percent / 100); return ["Bill: $" + v.bill, "Tip: $" + tip, "Total: $" + (v.bill + tip)]; },
    explain: "bill * percent / 100 is a percent in one line: multiply first, then divide. Because these are ints, the division drops leftover cents — whole dollars only. Try percent 0 (a grumpy diner) and percent 50 (a delighted one)." },
  { name: "Multiplication Table", file: "Program.cs",
    about: "Print a whole times table with one loop. Pick a number and how many lines to print.",
    vars: [{ key: "num", label: "num", val: 3, min: 2, max: 12 }, { key: "times", label: "times", val: 5, min: 1, max: 10 }],
    code: function (v) { return ["using System;", "", "class Program {", "    static void Main() {", "        int num = " + v.num + ";", "        int times = " + v.times + ";", "        for (int i = 1; i <= times; i++) {", "            Console.WriteLine($\"{num} x {i} = {num * i}\");", "        }", "    }", "}"]; },
    run: function (v) { var out = []; for (var i = 1; i <= v.times; i++) out.push(v.num + " x " + i + " = " + (v.num * i)); return out; },
    explain: "Interpolation does the whole show: the {num * i} blank even does the multiplication inside the sentence. One WriteLine, every row of the table — change the number and the same line prints a different table." },
  { name: "Temperature Converter", file: "Program.cs",
    about: "Turn Celsius into Fahrenheit with one formula: multiply by 9, divide by 5, add 32.",
    vars: [{ key: "celsius", label: "celsius", val: 20, min: -20, max: 100 }],
    code: function (v) { return ["using System;", "", "class Program {", "    static void Main() {", "        int celsius = " + v.celsius + ";", "        int fahrenheit = celsius * 9 / 5 + 32;", "        Console.WriteLine($\"{celsius} C is {fahrenheit} F\");", "        Console.WriteLine(\"Converted!\");", "    }", "}"]; },
    run: function (v) { var f = Math.trunc(v.celsius * 9 / 5) + 32; return [v.celsius + " C is " + f + " F", "Converted!"]; },
    explain: "celsius * 9 / 5 + 32 runs left to right: multiply, divide, then add. Try 100 (boiling water) and -20 (a deep freezer). At -40 the two scales meet exactly." },
  { name: "Guess the Number", file: "Program.cs",
    about: "The computer hides a secret number and judges your guess: too low, too high, or bang on.",
    vars: [{ key: "secret", label: "secret", val: 7, min: 1, max: 10 }, { key: "guess", label: "guess", val: 5, min: 1, max: 10 }],
    code: function (v) { return ["using System;", "", "class Program {", "    static void Main() {", "        int secret = " + v.secret + ";", "        int guess = " + v.guess + ";", "        if (guess == secret) {", "            Console.WriteLine(\"You guessed it!\");", "        } else if (guess < secret) {", "            Console.WriteLine(\"Too low! Aim higher.\");", "        } else {", "            Console.WriteLine(\"Too high! Aim lower.\");", "        }", "        Console.WriteLine($\"The secret was {secret}.\");", "    }", "}"]; },
    run: function (v) { var out = []; if (v.guess === v.secret) out.push("You guessed it!"); else if (v.guess < v.secret) out.push("Too low! Aim higher."); else out.push("Too high! Aim lower."); out.push("The secret was " + v.secret + "."); return out; },
    explain: "Three doors, one chain: == checks a perfect guess first, < catches the low guesses, and the final else catches everything left. Move the guess box until it matches the secret and the first door opens." },
  { name: "Dice Roller", file: "Program.cs",
    about: "Roll a die again and again and add up the tumbles. The % symbol keeps every roll inside the die's faces.",
    vars: [{ key: "sides", label: "sides", val: 6, min: 2, max: 20 }, { key: "rolls", label: "rolls", val: 4, min: 1, max: 8 }],
    code: function (v) { return ["using System;", "", "class Program {", "    static void Main() {", "        int sides = " + v.sides + ";", "        int rolls = " + v.rolls + ";", "        int total = 0;", "        for (int i = 0; i < rolls; i++) {", "            int roll = (i * 7 + 3) % sides + 1;", "            total += roll;", "            Console.WriteLine($\"Roll {i + 1}: {roll}\");", "        }", "        Console.WriteLine($\"Total: {total}\");", "    }", "}"]; },
    run: function (v) { var out = [], t = 0; for (var i = 0; i < v.rolls; i++) { var r = (i * 7 + 3) % v.sides + 1; t += r; out.push("Roll " + (i + 1) + ": " + r); } out.push("Total: " + t); return out; },
    explain: "(i * 7 + 3) % sides makes a tumbling pattern, and % sides keeps the leftovers inside the die — plus 1, because dice start at 1. Real games use the Random class; this die follows a secret pattern so the show is the same every run." },
  { name: "Grade Averager", file: "Program.cs",
    about: "Three test grades go in, one average comes out. Add them up, divide by how many there are.",
    vars: [{ key: "g1", label: "grade 1", val: 80, min: 0, max: 100 }, { key: "g2", label: "grade 2", val: 90, min: 0, max: 100 }, { key: "g3", label: "grade 3", val: 100, min: 0, max: 100 }],
    code: function (v) { return ["using System;", "", "class Program {", "    static void Main() {", "        int g1 = " + v.g1 + ";", "        int g2 = " + v.g2 + ";", "        int g3 = " + v.g3 + ";", "        int avg = (g1 + g2 + g3) / 3;", "        Console.WriteLine($\"Average: {avg}\");", "    }", "}"]; },
    run: function (v) { return ["Average: " + Math.floor((v.g1 + v.g2 + v.g3) / 3)]; },
    explain: "The parentheses matter: (g1 + g2 + g3) / 3 adds FIRST, then divides — without them, only g3 would be divided by 3. And because these are ints, 269 / 3 reports 89 with the fraction dropped." },
  { name: "List Keeper", file: "Program.cs",
    about: "The List Block on stage: a List grows with Add, answers with Count, and a foreach visits every item without counting.",
    vars: [{ key: "add", label: "add next", val: 40, min: 1, max: 99 }],
    code: function (v) { return ["using System;", "using System.Collections.Generic;", "", "class Program {", "    static void Main() {", "        List<int> scores = new List<int> { 10, 20, 30 };", "        int add = " + v.add + ";", "        scores.Add(add);", "        foreach (int s in scores) {", "            Console.WriteLine(s);", "        }", "        Console.WriteLine($\"Count: {scores.Count}\");", "    }", "}"]; },
    run: function (v) { var out = ["10", "20", "30", String(v.add)]; out.push("Count: 4"); return out; },
    explain: "The List is born with three items in its braces, Add grows it to four, and foreach visits each item in turn — no index, no counting, no off-by-one. Count always knows the size. This is collections doing daily work." }
];

/* ---------- C# Vault templates (40) + themes (20) ---------- */
var CS_VT = [
  { line: 'Console.WriteLine("{w}");', why: "WriteLine pours a whole line of text onto the screen, then presses Enter." },
  { line: "Console.WriteLine({v});", why: "WriteLine prints whatever value is inside the box right now." },
  { line: 'Console.WriteLine($"{v} is {n}");', why: "The $ string fills its blanks with the variable and the number as it prints." },
  { line: 'Console.WriteLine("{w}: " + {v});', why: "Glue a label and a value together with + and print the joined sentence." },
  { line: "int {v} = {n};", why: "Build a whole-number box and put a starting value inside." },
  { line: "double {v} = {dec};", why: "double boxes hold numbers with a decimal point." },
  { line: 'string {sv} = "{w}";', why: "A string box built for text, wearing double quotes." },
  { line: "bool {v} = {b};", why: "A bool box holds exactly one thing: true or false." },
  { line: "string {sv} = Console.ReadLine();", why: "ReadLine listens for a line of typing and hands it back as a string." },
  { line: "{v} += {n};", why: "Add onto what is already in the box — never erase, pile on." },
  { line: "{v}++;", why: "Step the box up by exactly one." },
  { line: "int {r} = {v} * {d};", why: "An answer is worked out on the right, then stored on the left." },
  { line: "if ({v} > {n}) { Play(); }", why: "Ask a question; if yes, the method in the braces runs." },
  { line: "if ({v} == {n}) { {v} = 0; }", why: "Two equals signs ASK if they match. One would have filled the box." },
  { line: "switch ({v}) { case {d}: break; }", why: "switch opens the one matching door; break closes it behind you." },
  { line: "int {r} = ({v} > {u}) ? {v} : {u};", why: "The one-line choice: question, then value-if-yes, value-if-no." },
  { line: "for (int i = 0; i < {d}; i++) { {v} += i; }", why: "Start, rule, step — the counting loop adds i on every lap." },
  { line: "while ({v} > 0) { {v}--; }", why: "Keep going while the question stays true — and something changes each lap." },
  { line: "foreach (int x in {arr}) { total += x; }", why: "foreach visits every item in the collection — no counting at all." },
  { line: "for (int i = 1; i <= {n}; i++) { Console.WriteLine(i); }", why: "Count from 1 upward, printing every lap number on its own line." },
  { line: "List<int> {arr} = new List<int>();", why: "new builds the stretchy list — declarations describe, new creates." },
  { line: "{arr}.Add({n});", why: "Add grows the list by one item at the end." },
  { line: "Dictionary<string, int> {m} = new Dictionary<string, int>();", why: "A wall of labeled drawers: string name tags, int treasures." },
  { line: '{m}["{w}"] = {n};', why: "Open the drawer with that name tag and put a value inside." },
  { line: "string part = {sv}.Substring(0, {d});", why: "Substring cuts a piece out of a string, starting at a position." },
  { line: "Console.WriteLine({sv}.Length);", why: "A string's Length is its character count, spaces included." },
  { line: "string shout = {sv}.ToUpper();", why: "ToUpper hands back a NEW string in shouting case — keep it or lose it." },
  { line: "{sv} = {sv}.Trim();", why: "Trim tidies the spaces from both ends — and the result must be kept." },
  { line: "class {c} { public int Size { get; set; } }", why: "A class is a blueprint, and a property is its smart doorway. No trailing semicolon in C#." },
  { line: "{c} {o} = new {c}();", why: "Building one real object from the blueprint, with new doing the building." },
  { line: "{o}.Size = {n};", why: "The dot reaches through the property doorway to set the value." },
  { line: "enum {c} { Low, High }", why: "An enum names a small set of choices instead of mystery numbers." },
  { line: "try { Play(); } catch { }", why: "Risky code in try; if it throws, catch lands the fall." },
  { line: "if ({sv} != null) { Console.WriteLine({sv}); }", why: "Check for null before touching the text — the crash-proof habit." },
  { line: "Func<int, int> {f} = x => x * {d};", why: "A lambda stored in a Func box: x goes to x times the number." },
  { line: "var {r} = {v} + {n};", why: "var lets the compiler deduce the box's type from the value." },
  { line: "var big = {arr}.Where(n => n > {n});", why: "LINQ's Where keeps only the items that pass the lambda test." },
  { line: "var copy = {arr}.Select(x => x).ToList();", why: "Select reshapes, ToList cooks the lazy query into a real list." },
  { line: "await FetchAsync();", why: "await pauses this method — never the whole program — until the job lands." },
  { line: 'File.WriteAllText("{w}.txt", {sv});', why: "One line pours text into a file, so the program remembers it tomorrow." }
];
var CS_THEMES = [
  { name: "Print & Talk", t: [0, 1, 2, 3, 13] },
  { name: "Boxes & Numbers", t: [4, 5, 6, 7, 9] },
  { name: "Text & Names", t: [6, 24, 25, 26, 27] },
  { name: "True or False", t: [7, 12, 13, 15, 33] },
  { name: "Listening In", t: [8, 0, 1, 3, 25] },
  { name: "Pile It On", t: [9, 10, 11, 35, 17] },
  { name: "Yes or No", t: [12, 13, 14, 15, 32] },
  { name: "Door Picker", t: [14, 12, 15, 33, 7] },
  { name: "Counting Loops", t: [16, 17, 19, 10, 9] },
  { name: "Visiting Items", t: [18, 16, 19, 36, 37] },
  { name: "Growing Lists", t: [20, 21, 18, 25, 35] },
  { name: "Drawer Walls", t: [22, 23, 20, 21, 6] },
  { name: "String Workshop", t: [24, 25, 26, 27, 8] },
  { name: "Blueprints", t: [28, 29, 30, 31, 35] },
  { name: "Born Complete", t: [29, 30, 28, 4, 21] },
  { name: "Promises", t: [31, 28, 33, 34, 12] },
  { name: "Safety Nets", t: [32, 33, 12, 17, 14] },
  { name: "Pocket Methods", t: [34, 36, 37, 18, 11] },
  { name: "Query Kitchen", t: [36, 37, 18, 35, 21] },
  { name: "Files & Waiting", t: [39, 38, 8, 0, 32] }
];

/* ---------- C# glossary (24), field guide (10), cheat cards (6) ---------- */
var CS_GLOSSARY = [
  ["namespace", "A labeled drawer for type names, so two programs' classes never collide — Console lives in the System drawer."],
  ["assembly", "The finished package a C# program compiles into: one file holding the translated code and its description."],
  ["CLR", "The Common Language Runtime: the engine that runs C# programs, managing memory and safety while they work."],
  ["garbage collection", "The runtime's tidy-up service: it finds objects nobody references anymore and reclaims their memory for you."],
  ["BCL", "The Base Class Library: the giant built-in toolbox of types that ships with .NET — collections, files, text, and more."],
  ["property", "A smart doorway into an object: get reads through it, set writes through it, and the class stays in control."],
  ["getter", "The get half of a property — the code that answers when outside code reads the value."],
  ["setter", "The set half of a property — the code that runs when outside code changes the value."],
  ["constructor", "The birth ceremony of an object: a method with the class's name that runs the moment new builds it."],
  ["null", "No object at all — an empty hook. Touching members through null throws NullReferenceException."],
  ["nullable", "A value type wrapped so it may also hold null — int? is a whole-number box that can honestly be empty."],
  ["var", "The keyword that lets the compiler deduce a variable's type from its starting value. The box is still fully typed."],
  ["value type", "A type whose boxes hold their value directly and are copied when handed over: int, bool, and structs."],
  ["reference type", "A type whose boxes hold a reference to an object elsewhere: classes, strings, and arrays. Copies share the object."],
  ["boxing", "Packing a value type into an object box so it can travel where objects go — and unboxing is the unpacking."],
  ["delegate", "A type that describes a method's shape, so methods themselves can be stored and passed around like values."],
  ["Func", "A ready-made delegate family: Func<int, int> is any method taking an int and returning an int."],
  ["lambda", "A tiny unnamed method written inline: x => x * 2 reads as x goes to x times 2."],
  ["LINQ", "Language Integrated Query: the built-in question toolbox — Where, Select, OrderBy — for asking collections questions."],
  ["deferred execution", "LINQ's laziness: a query is a recipe that cooks only when something enumerates its answers."],
  ["Task", "The promise slip for work in progress: await it to collect the finished result."],
  ["async", "Marks a method that may pause at await without blocking the program around it."],
  ["await", "Pauses an async method until a job lands, while the rest of the program keeps moving."],
  ["exception", "The error package thrown when something goes wrong at run time, caught by a matching catch."]
];
var CS_FIELD = [
  { name: "List<T>", head: "System.Collections.Generic", what: "The stretchy array: grows with Add, reaches by index, and answers Count instantly. The default holder for ordered items.", ex: "List<string> names = new List<string>();" },
  { name: "Dictionary<TKey, TValue>", head: "System.Collections.Generic", what: "The wall of labeled drawers: file a value under a key, fetch it back by the same key, whatever the wall's size.", ex: 'scores["V"] = 250;  // drawer V now holds 250' },
  { name: "HashSet<T>", head: "System.Collections.Generic", what: "The bouncer list: keeps every different item exactly once and answers Contains at lightning speed.", ex: "if (seen.Contains(id)) { /* already met */ }" },
  { name: "Queue<T>", head: "System.Collections.Generic", what: "A fair line: Enqueue joins the back, Dequeue serves the front. First come, first served.", ex: "line.Enqueue(job);  var next = line.Dequeue();" },
  { name: "Stack<T>", head: "System.Collections.Generic", what: "A pile: Push puts work on top, Pop takes from the top. Last in, first out — undo histories live here.", ex: "history.Push(page);  var back = history.Pop();" },
  { name: "StringBuilder", head: "System.Text", what: "The text workbench: Append pieces onto one reusable buffer when a program builds long text piece by piece.", ex: "sb.Append(\"Score: \");  sb.Append(score);" },
  { name: "LINQ Where / Select", head: "System.Linq", what: "The question machines: Where filters a collection by a test, Select reshapes every item into something else.", ex: "var big = nums.Where(n => n > 10);" },
  { name: "Task / Task<T>", head: "System.Threading.Tasks", what: "The promise slip for async work: Task for a job, Task<T> for a job that delivers a T when it lands.", ex: "Task<int> slip = FetchScoreAsync();" },
  { name: "File", head: "System.IO", what: "One-line file work: WriteAllText saves, ReadAllText loads, Exists checks — the save-game shelf of the BCL.", ex: 'File.WriteAllText("save.txt", data);' },
  { name: "DateTime", head: "System", what: "A moment in time as a value: today's date, a deadline, a duration — with calendar math built in.", ex: "DateTime today = DateTime.Today;" }
];
var CS_CHEATS = [
  { title: "Program Skeleton Card", body: "The C# 8 shape every program in this mode wears.", code: "using System;\n\nclass Program {\n    static void Main() {\n        // your code lives here\n    }\n}" },
  { title: "Console Card", body: "Talking and listening, the whole conversation kit.", code: "Console.WriteLine(\"Hello\");   // line + Enter\nConsole.Write(\"*\");           // no Enter\nstring s = Console.ReadLine(); // listen" },
  { title: "Collection Moves Card", body: "List and Dictionary daily moves, side by side.", code: "bag.Add(40);            // grow the list\nbag.Count;              // how many?\nscores[\"V\"] = 250;      // file in drawer V\nscores.ContainsKey(\"V\"); // is there a V?" },
  { title: "LINQ Chain Card", body: "One chain, read left to right like a sentence.", code: "var top = scores\n    .Where(s => s > 50)       // filter\n    .OrderByDescending(s => s) // rank\n    .First();                  // champion" },
  { title: "Property & Constructor Card", body: "Doorways and the birth ceremony, one glance.", code: "class Block {\n    public int Size { get; set; }\n    public Block(int size) {\n        Size = size;\n    }\n}" },
  { title: "Async Card", body: "Start early, await late, never block the screen.", code: "async Task<int> FetchScoreAsync() {\n    await Task.Delay(100);\n    return 250;\n}\nint score = await FetchScoreAsync();" }
];

/* ---------- Language toggle + C# text polish ---------- */
(function cbLangUI() {
  var style = document.createElement("style");
  style.textContent = ".lang-toggle{display:flex;gap:6px;background:linear-gradient(170deg,var(--surface) 55%,var(--ice) 150%);border:1px solid var(--line);border-radius:var(--r-tile);padding:5px;box-shadow:var(--shadow-sm);margin-bottom:12px;}" +
    ".lang-btn{flex:1;border:none;background:transparent;color:var(--muted);border-radius:var(--r-row);padding:10px 4px;font-size:15px;font-weight:800;cursor:pointer;min-height:44px;font-family:inherit;}" +
    ".lang-btn.active{background:var(--grad-primary);color:var(--on-accent);box-shadow:0 5px 16px rgba(37,99,235,.45);text-shadow:0 1px 2px rgba(4,30,60,.35);}";
  document.head.appendChild(style);
  function makeToggle() {
    var cur = window.__isDrive ? "drive" : window.__isCS ? "cs" : "cpp";
    var t = document.createElement("div");
    t.className = "lang-toggle";
    t.setAttribute("role", "group");
    t.setAttribute("aria-label", "Choose your track");
    [["cpp", "C++"], ["cs", "C#"], ["drive", "Drive"]].forEach(function (opt) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lang-btn" + (cur === opt[0] ? " active" : "");
      b.textContent = opt[1];
      b.setAttribute("aria-pressed", String(cur === opt[0]));
      b.addEventListener("click", function () {
        if (cur === opt[0]) return;
        try {
          if (opt[0] === "cpp") localStorage.removeItem("code-block-lang-v1");
          else localStorage.setItem("code-block-lang-v1", opt[0]);
        } catch (e) {}
        location.reload();
      });
      t.appendChild(b);
    });
    return t;
  }
  /* The track switcher sits above the main menu, so it stays reachable from
     every section — not just the Sandbox. Falls back to the Sandbox top. */
  var nav = document.querySelector(".wrap > .menu");
  if (nav && nav.parentNode) nav.parentNode.insertBefore(makeToggle(), nav);
  else {
    var sandbox = document.getElementById("sandboxView");
    if (sandbox) sandbox.insertBefore(makeToggle(), sandbox.firstChild);
  }

  /* Footer credit: C# sources join the C++ ones in every mode. */
  var notes = document.querySelectorAll(".wrap > .source-note");
  if (notes.length) {
    var foot = notes[notes.length - 1];
    var add = document.createElement("span");
    add.innerHTML = ' C# content follows <a href="https://learn.microsoft.com/en-us/dotnet/csharp/">Microsoft Learn’s C# documentation</a> and the <a href="https://learn.microsoft.com/en-us/dotnet/api/">.NET API browser</a>, with topic order inspired by <em>C# 8.0 in a Nutshell</em> (Albahari &amp; Albahari) — again, every explanation is written in Code Block’s own words.';
    foot.appendChild(add);
  }
  if (!window.__isCS) return;

  function setText(sel, txt) { var el = document.querySelector(sel); if (el) el.textContent = txt; }
  function setHTML(sel, html) { var el = document.querySelector(sel); if (el) el.innerHTML = html; }
  setText(".mastery-label", "C# Mastery");
  setText("#masterpieceBanner h2", "The C# Masterpiece");
  setText("#masterpieceBanner p", "All 30 C# blocks mastered. Every block in your world glows bright blue, and the music is playing the full arrangement. You built this — one repeated line at a time, in a whole new language.");
  setText("#sandboxView .source-note", "Curriculum follows the topic order of C# 8.0 in a Nutshell (Albahari & Albahari), used as inspiration only. All explanations are written in plain words for Code Block. Each block takes 8 perfect repetitions. Your C# progress is saved separately from your C++ progress.");
  setText("#libraryView .lib-intro h2", "The C# Library");
  setText("#libChip", CS_CHAPTERS.length + " chapters · " + CS_SHELVES.length + " shelves");
  setText("#pcChip", CS_PROJECTS.length + " projects");
  setHTML("#libraryView .lib-intro p:not(.sec-hint)", "The C# story, retold in bright, simple words anyone can follow — inspired by the topic order of <em>C# 8.0 in a Nutshell</em>, with every explanation written fresh for Code Block. Open a chapter, then read it two ways: <strong>Text</strong> tells you the idea in plain words, and <strong>Picture</strong> shows it moving — with things to tap, animations, and music. Below the chapters sit four shelves through the Base Class Library: collections, strings and text, the LINQ kitchen, and the async workshop.");
  var shelfHeads = document.querySelectorAll("#libHome .shelf-head");
  if (shelfHeads[0]) {
    shelfHeads[0].querySelector("h3").textContent = "Beyond the Book — C# Shelves";
    shelfHeads[0].querySelector("p").textContent = "Four shelves through the Base Class Library — each reads two ways, Text and Picture, just like a chapter. All four are open to everyone.";
  }
  if (shelfHeads[1]) {
    shelfHeads[1].querySelector("h3").textContent = "The Glossary — Words of C#";
    shelfHeads[1].querySelector("p").textContent = "The vocabulary of C# and .NET, each word in one plain sentence. Search it, or jump by letter.";
  }
  if (shelfHeads[2]) {
    shelfHeads[2].querySelector("h3").textContent = "Field Guide — BCL Tools";
    shelfHeads[2].querySelector("p").textContent = "Ten Base Class Library tools worth knowing, each with the namespace that fetches it and a line you can steal.";
  }
  if (shelfHeads[3]) {
    shelfHeads[3].querySelector("h3").textContent = "Cheat Sheets — C# Cards";
    shelfHeads[3].querySelector("p").textContent = "Pin-up cards for the shapes you will reach for every day: the skeleton, the Console, collections, LINQ, properties, and async.";
  }
  var gs = document.getElementById("glossSearch");
  if (gs) gs.placeholder = "Search C# words… try “lambda” or “Task”";
  var libNotes = document.querySelectorAll("#libraryView .source-note");
  if (libNotes[0]) libNotes[0].textContent = "Every chapter is an original retelling in simple words, following the C# book's topic order. The code itself is real C# — its key lines are drawn from the very lines you drill in the Sandbox.";
  if (libNotes[1]) libNotes[1].textContent = "Shelf facts and syntax follow Microsoft Learn's C# documentation and the .NET API browser, with every explanation written fresh in Code Block's own words.";
  setHTML("#pcView .pc-intro p:not(.sec-hint)", "A friendly little computer. It hands you a surprise C# project — type along with the code, press <strong>Compile &amp; Run</strong>, and watch it work. Then change the numbers in the blue boxes and run it again to see what changes.");
  setHTML("#bookView .book-intro p:not(.sec-hint)", "The full textbook, right here in Code Block: <em>C# 8.0 in a Nutshell</em> by Joseph &amp; Ben Albahari. Open your own copy of the book (the PDF file) and read it without leaving the site.");
  setText("#vaultView .lib-intro h2", "The Vault — 10,000 C# Drills");
  setHTML("#vaultView .lib-intro p:not(.sec-hint)", "The members-only drill vault, in C#: <strong>100 themed packs of 100 drills each — 10,000 lines of real C#</strong> to type until your fingers know them all. Your C# Vault progress saves under your profile, separately from your C++ Vault and from the 30 Sandbox blocks.");
  /* Loop 62 — the profile intro is C++ copy: it promises guests all
     but two shelves and a profile two extra ones, but every C# shelf
     is open to everyone (the shelf head above says so). In C# the
     profile's prize is the Vault and a name on the progression. */
  setText("#profileView .sec-hint", "Create a profile to unlock the Vault.");
  setHTML("#profileView .lib-intro p:not(.sec-hint)", "Code Block is free to explore as a guest — every block, chapter, project and shelf on the site works without signing up, all four C# shelves included. Create a free profile on this device and two things happen: <strong>your progression is saved under your name</strong> (Sandbox mastery and Vault drills, kept separately for each profile), and the members-only <strong>10,000-drill Vault</strong> unlocks. Profiles live on this device only; nothing is uploaded anywhere.");
})();
