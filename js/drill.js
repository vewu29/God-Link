"use strict";
/* ================= DATA — 30 blocks, book chapter order ================= */
var REPS_GOAL = 8;
var BLOCKS = window.CB_T ? CB_T.blocks : window.__isDrive ? DRIVE_BLOCKS : window.__isCS ? CS_BLOCKS : [
  { name: "Hello Block", short: "Hello", chapter: "Book Ch. 1 · Basic Ideas", color: "#53b1fd", icon: "i-say", verb: "say",
    line: 'std::cout << "Hello";',
    explain: 'std::cout is the screen\u2019s mouth. The << arrows pour text into it, so the words appear on screen. Every statement ends with a semicolon — the full stop of C++.' },
  { name: "Variable Block", short: "Variable", chapter: "Book Ch. 2 · Introducing Fundamental Types of Data", color: "#38bdf8", icon: "i-box", verb: "store",
    line: "int score = 0;",
    explain: "A variable is a labeled box that holds a value. int means the box holds whole numbers only. The = puts a starting value inside the box." },
  { name: "Input Block", short: "Input", chapter: "Book Ch. 2 · Introducing Fundamental Types of Data", color: "#22d3ee", icon: "i-keyboard", verb: "listen",
    line: "std::cin >> name;",
    explain: "std::cin is the keyboard\u2019s ear. The >> arrows pour whatever the player types into your variable. The arrows always point the way the data flows." },
  { name: "Math Block", short: "Math", chapter: "Book Ch. 3 · Working with Fundamental Data Types", color: "#2fc4e8", icon: "i-calc", verb: "add",
    line: "total += price;",
    explain: "+= means \u201Cadd to what\u2019s already there.\u201D Instead of writing total = total + price, this shortcut adds price straight into total. Short lines, clear meaning." },
  { name: "Decision Block", short: "Decision", chapter: "Book Ch. 4 · Making Decisions", color: "#3ec6dd", icon: "i-fork", verb: "choose",
    line: "if (hp <= 0) { gameOver(); }",
    explain: "if asks a yes/no question. If the answer is yes, the code inside the curly braces runs. The braces group lines together into one block of code." },
  { name: "Switch Block", short: "Switch", chapter: "Book Ch. 4 · Making Decisions", color: "#4a90d9", icon: "i-toggle", verb: "pick",
    line: "switch (level) { case 1: break; }",
    explain: "switch looks at one value and jumps to the case that matches it. break stops the code falling through into the next case when it\u2019s done." },
  { name: "For Block", short: "For Loop", chapter: "Book Ch. 5 · Arrays and Loops", color: "#6d9df5", icon: "i-repeat", verb: "count",
    line: "for (int i = 0; i < 5; i++) { }",
    explain: "A for loop has three parts: where counting starts (int i = 0), the keep-going rule (i < 5), and the step (i++ means add one). It repeats whatever is inside the braces." },
  { name: "While Block", short: "While Loop", chapter: "Book Ch. 5 · Arrays and Loops", color: "#7aa5f8", icon: "i-clock", verb: "wait",
    line: "while (lives > 0) { lives--; }",
    explain: "while repeats for as long as its question stays true. Something inside the loop must change each time — here lives-- counts down — or the loop would never stop." },
  { name: "Vector Block", short: "Vector", chapter: "Book Ch. 5 · Arrays and Loops", color: "#5ea8f7", icon: "i-boxes", verb: "line up",
    line: "std::vector<int> scores = {10, 20, 30};",
    explain: "A vector is a list that can grow and shrink while the program runs. <int> says what kind of items it holds. The curly braces list the starting items." },
  { name: "Pointer Block", short: "Pointer", chapter: "Book Ch. 6 · Pointers and References", color: "#4fb3ff", icon: "i-point", verb: "point",
    line: "int* ptr = &score;",
    explain: "& asks \u201Cwhere do you live?\u201D and gives the address of a variable in memory. int* declares a pointer — a variable whose whole job is to hold an address." },
  { name: "Reference Block", short: "Reference", chapter: "Book Ch. 6 · Pointers and References", color: "#38a3f8", icon: "i-tag", verb: "name",
    line: "void heal(int& hp) { hp += 10; }",
    explain: "int& is a nickname: another name for the very same box. Change the nickname and the original changes too. Functions use references to modify the values they\u2019re given." },
  { name: "String Block", short: "String", chapter: "Book Ch. 7 · Working with Strings", color: "#2fb9e8", icon: "i-link", verb: "join",
    line: 'std::string hero = "V";',
    explain: "std::string is a box built specially for text. The double quotes mark the text itself. Strings can grow, shrink, and join together with +." },
  { name: "Function Block", short: "Function", chapter: "Book Ch. 8 · Defining Functions", color: "#3b8ef0", icon: "i-play-circle", verb: "run",
    line: "int damage(int atk, int def) { return atk - def; }",
    explain: "A function is a named machine: inputs go in through the parentheses, the type before the name says what kind of answer comes out, and return hands that answer back." },
  { name: "Class Block", short: "Class", chapter: "Book Ch. 11 · Defining Your Own Data Types", color: "#2f9be8", icon: "i-shapes", verb: "shape",
    line: "class Block { public: int size; };",
    explain: "A class is a blueprint for your own kind of box. public: opens the door so other code can use what\u2019s inside. Don\u2019t forget the semicolon after the closing brace." },
  { name: "Inheritance Block", short: "Inherit", chapter: "Book Ch. 13 · Inheritance", color: "#7fb2e5", icon: "i-tree", verb: "inherit",
    line: "class FireBlock : public Block { };",
    explain: ": public Block means \u201Cstart from the Block blueprint, then add more.\u201D The new class inherits everything the original could do, for free." },
  { name: "Safety Net Block", short: "Safety Net", chapter: "Book Ch. 15 · Runtime Errors and Exceptions", color: "#6495ed", icon: "i-shield-check", verb: "rescue",
    line: "try { play(); } catch (...) { }",
    explain: "try marks risky code. If something throws an error inside, the program jumps to catch instead of crashing. The ... means catch catches anything at all." },
  { name: "Template Block", short: "Template", chapter: "Book Ch. 9 & 16 · Function & Class Templates", color: "#3f7de0", icon: "i-stamp", verb: "stamp",
    line: "template <typename T> T twice(T x) { return x + x; }",
    explain: "template <typename T> turns T into a fill-in-the-blank type. One function now works for ints, doubles, strings — anything that supports +." },
  { name: "Lambda Block", short: "Lambda", chapter: "Book Ch. 18 · First-Class Functions", color: "#31b8c6", icon: "i-lambda", verb: "whisper",
    line: "auto hit = [](int x) { return x * 2; };",
    explain: "A lambda is a tiny unnamed function you can store in a variable. [] opens it, (int x) lists its inputs, and auto lets the compiler figure out its type." },
  { name: "Enum Block", short: "Enum", chapter: "Going Further · Named Choices", color: "#5ea8f7", icon: "i-list", verb: "list",
    line: "enum Color { Red, Green, Blue };",
    explain: "An enum gives friendly names to a fixed set of choices. Instead of remembering that 0 means red and 1 means green, your code can just say Red and Green — numbers with name tags, so nobody has to guess what a plain number means." },
  { name: "Struct Block", short: "Struct", chapter: "Going Further · Bundled Boxes", color: "#38bdf8", icon: "i-grid", verb: "pack",
    line: "struct Point { int x; int y; };",
    explain: "A struct bundles related variables into one box. A point on a screen is really two numbers — across (x) and up (y) — and a struct keeps them traveling together under one name, like a backpack instead of juggling loose items." },
  { name: "Const Block", short: "Const", chapter: "Going Further · Locked Values", color: "#0ea5e9", icon: "i-anchor", verb: "keep",
    line: "const double PI = 3.14159;",
    explain: "const locks a box forever: once PI is set, no code anywhere can change it. Use it for values that must never wobble — the number of players, the speed of light, the size of the board. If something tries to change it, the compiler refuses." },
  { name: "Auto Block", short: "Auto", chapter: "Going Further · Type Detective", color: "#2563eb", icon: "i-eye", verb: "peek",
    line: "auto total = price * count;",
    explain: "auto tells the compiler: you figure out the type. It looks at what's on the right of the = and deduces the matching box shape — price times count is a number, so total becomes that kind of number. Less typing, same safety." },
  { name: "Range-For Block", short: "Range For", chapter: "Going Further · Visiting Every Item", color: "#3b82f6", icon: "i-visit", verb: "visit",
    line: "for (int n : nums) { sum += n; }",
    explain: "A range-for loop visits every item in a list, one at a time, with no counting at all. Read it as: for each n in nums. The loop hands you the item itself — you never touch an index number or worry about counting one too far." },
  { name: "Do-While Block", short: "Do While", chapter: "Going Further · Once, Then Ask", color: "#0284c7", icon: "i-rotate", verb: "again",
    line: "do { roll(); } while (again);",
    explain: "A do-while loop runs its code FIRST and asks its question afterwards — so the code always happens at least once. Perfect for menus and games: play one round, then ask should we go again? A plain while asks first and might never run at all." },
  { name: "Ternary Block", short: "Ternary", chapter: "Going Further · One-Line Choice", color: "#0369a1", icon: "i-help", verb: "ask",
    line: "int m = (a > b) ? a : b;",
    explain: "The ternary operator is a one-line if/else that picks a VALUE. The part before the ? is the question; if it's true you get the left value, if it's false you get the right one. Here m becomes whichever of a and b is bigger." },
  { name: "Namespace Block", short: "Namespace", chapter: "Going Further · Labeled Drawers", color: "#4f9cf9", icon: "i-folder", verb: "gather",
    line: "namespace game { int score; }",
    explain: "A namespace is a labeled drawer for your names. Two programmers can both have a score variable without a mix-up if theirs live in different drawers. That's why the standard tools live in the std drawer — std::cout is just cout, from the std drawer." },
  { name: "Smart Pointer Block", short: "Smart Ptr", chapter: "Going Further · Self-Cleaning Memory", color: "#22d3ee", icon: "i-point-spark", verb: "share",
    line: "auto p = std::make_unique<Player>();",
    explain: "make_unique builds something in memory and hands you a smart pointer — a signpost that tidies up after itself. When the pointer is done, the thing it points at is cleaned away automatically. No leaks, no forgetting: the pointer remembers so you don't have to." },
  { name: "Overload Block", short: "Overload", chapter: "Going Further · Same Name, New Job", color: "#2f7fe0", icon: "i-layers", verb: "multiply",
    line: "void draw(int x, int y) { }",
    explain: "Overloading means several functions share one name, as long as their inputs differ. draw() with two numbers draws at a spot; draw() with a string might draw words. C++ picks the right one by looking at what you hand it — like one friend who answers differently depending on what you ask." },
  { name: "Static Block", short: "Static", chapter: "Going Further · Remembering Values", color: "#60a5fa", icon: "i-column", verb: "stay",
    line: "static int calls = 0;",
    explain: "A normal variable inside a function is rebuilt fresh on every call and forgotten afterwards. static makes it REMEMBER: calls is set to 0 only the very first time, then keeps its value between calls — a tally counter that survives." },
  { name: "New Block", short: "New", chapter: "Going Further · Memory on Demand", color: "#7cc4ff", icon: "i-plus-square", verb: "make",
    line: "int* p = new int(5);",
    explain: "new asks the computer for fresh memory while the program is running — a box built on demand, with 5 inside. The answer you get back is the new box's address, which is why it lands in a pointer. Memory asked for with new is yours until you give it back with delete." }
];

/* ================= STATE (localStorage, in-memory fallback) ================= */
var STORE_KEY = CB_META.storeKey;
var storeOK = true;
var state = { reps: {}, celebrated: false };
/* Loop 56 — storage hygiene: whatever an older build, a hand
   edit, or a half-written save left behind, the state that
   reaches the app is always the same clean shape — reps are
   whole numbers inside 1..REPS_GOAL (zero and junk are
   dropped, so no counter can ever render NaN), celebrated a
   plain boolean. A bent value resets its own block only,
   never the whole save. Every door into `state` — this
   loader, the guest read, profile restore and sign-in —
   passes through here. */
function sanitizeState(s) {
  var clean = { reps: {}, celebrated: false };
  if (!s || typeof s !== "object") return clean;
  clean.celebrated = !!s.celebrated;
  if (s.reps && typeof s.reps === "object") {
    for (var k in s.reps) {
      var n = Math.floor(Number(s.reps[k]));
      if (isFinite(n) && n > 0) clean.reps[k] = Math.min(n, REPS_GOAL);
    }
  }
  return clean;
}
try {
  var raw = localStorage.getItem(STORE_KEY);
  if (raw) state = sanitizeState(JSON.parse(raw));
} catch (e) { storeOK = false; }
function save() {
  if (!storeOK) return;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { storeOK = false; }
}
function repsOf(i) { return Math.min(state.reps[i] || 0, REPS_GOAL); }
function isDone(i) { return repsOf(i) >= REPS_GOAL; }
function doneCount() { var c = 0; for (var i = 0; i < BLOCKS.length; i++) if (isDone(i)) c++; return c; }
function firstOpen() { for (var i = 0; i < BLOCKS.length; i++) if (!isDone(i)) return i; return -1; }

/* ================= DOM refs ================= */
function $(id) { return document.getElementById(id); }
var pctText = $("pctText"), barFill = $("barFill"), barTrack = $("barTrack"), doneCountEl = $("doneCount");
var hubView = $("hubView"), drillView = $("drillView"), blockGrid = $("blockGrid");
var masterpieceBanner = $("masterpieceBanner");
var continueBtn = $("continueBtn");

/* ================= Block list ================= */
var listBtns = [];
(function buildList() {
  BLOCKS.forEach(function (b, i) {
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "block-btn";
    var chip = document.createElement("span");
    chip.className = "block-chip"; chip.style.background = b.color; chip.setAttribute("aria-hidden", "true");
    chip.innerHTML = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#' + (b.icon || "i-cube") + '"/></svg>';
    var meta = document.createElement("span"); meta.className = "block-meta";
    var nm = document.createElement("span"); nm.className = "block-name"; nm.textContent = b.name;
    var rp = document.createElement("span"); rp.className = "block-reps";
    meta.appendChild(nm); meta.appendChild(document.createElement("br")); meta.appendChild(rp);
    var check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    check.setAttribute("viewBox", "0 0 24 24"); check.setAttribute("fill", "none");
    check.setAttribute("stroke", "currentColor"); check.setAttribute("stroke-width", "2");
    check.setAttribute("stroke-linecap", "round"); check.setAttribute("stroke-linejoin", "round");
    check.setAttribute("class", "block-check"); check.setAttribute("aria-hidden", "true");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#i-check"); check.appendChild(use);
    btn.appendChild(chip); btn.appendChild(meta); btn.appendChild(check);
    btn.addEventListener("click", function () { openBlock(i); });
    blockGrid.appendChild(btn);
    listBtns.push({ btn: btn, reps: rp });
  });
})();

function refreshProgress() {
  var done = doneCount();
  var pct = Math.round((done / BLOCKS.length) * 100);
  pctText.textContent = pct + "%";
  barFill.style.width = pct + "%";
  barTrack.setAttribute("aria-valuenow", String(pct));
  barTrack.setAttribute("aria-valuetext", pct + "% mastered — " + done + " of " + BLOCKS.length + " blocks");
  doneCountEl.textContent = String(done);
  listBtns.forEach(function (entry, i) {
    entry.btn.classList.toggle("done", isDone(i));
    entry.btn.style.setProperty("--p", String(Math.round((repsOf(i) / REPS_GOAL) * 100)));
    entry.reps.textContent = isDone(i) ? "Mastered" : (repsOf(i) > 0 ? repsOf(i) + " / " + REPS_GOAL + " reps" : "Not started");
  });
  masterpieceBanner.classList.toggle("hidden", done < BLOCKS.length);
  /* Loop 67 — the finale glissando no longer fires from here.
     refreshProgress runs for every state swap too (signing in,
     signing out, switching or deleting a profile, a reset), so
     the transition it used to watch could not tell "the final
     rep just landed" from "a finished save was just loaded
     onto the screen" — and a learner who merely signed in to a
     completed profile, music playing, was greeted by the full
     glissando and grand fanfare for a completion that happened
     in another session. The glissando now fires in the drill
     handler itself, in the one branch that runs only when a
     typed rep masters the final block (see typeInput's input
     handler), which is the only genuine completion moment. */
  /* One-tap way back into the work: jump straight to the next open block. */
  var open = firstOpen();
  if (continueBtn) {
    continueBtn.classList.toggle("hidden", open < 0);
    if (open >= 0) continueBtn.textContent = (done > 0 ? "Continue — " : "Start — ") + BLOCKS[open].name;
  }
  if (window.__refreshWorld) window.__refreshWorld();
}
if (continueBtn) continueBtn.addEventListener("click", function () {
  var o = firstOpen();
  if (o >= 0) openBlock(o);
});

/* ================= DRILL VIEW ================= */
var current = -1;
var lastOpener = null;
var typeInput = $("typeInput"), targetLine = $("targetLine"), typeCard = $("typeCard");
var repDots = $("repDots"), repText = $("repText"), drillStatus = $("drillStatus"), nextBtn = $("nextBtn");
var sessionBlock = $("sessionBlock"), sessionMood = $("sessionMood");
/* Loop 4 session bar: the mood pill mirrors the picker's saved
   choice (same localStorage key the music engine reads), with a
   calm fallback for a missing or unknown value. */
var KNOWN_MOODS = { calm: "Calm", focus: "Focus", bright: "Bright", night: "Night", arcade: "Arcade", rain: "Rain", drizzle: "Drizzle", meadow: "Meadow", forge: "Forge", orbit: "Orbit", pebble: "Pebble", summit: "Summit", vault: "Vault", drift: "Drift", fortune: "Fortune", halo: "Halo", tide: "Tide", velvet: "Velvet", lagoon: "Lagoon", aurora: "Aurora", cascade: "Cascade", granite: "Granite", laurel: "Laurel", meridian: "Meridian", ember: "Ember", zephyr: "Zephyr", hymn: "Hymn", vespers: "Vespers", monsoon: "Monsoon", nightdrive: "Night Drive" };
function paintSessionMood(key) {
  if (!sessionMood) return;
  var k = KNOWN_MOODS[key] ? key : "calm";
  sessionMood.textContent = "Mood · " + KNOWN_MOODS[k];
}
function storedMood() {
  try { return localStorage.getItem("code-block-music-mood-v1") || "calm"; } catch (e) { return "calm"; }
}
Array.prototype.forEach.call(document.querySelectorAll(".mood-btn"), function (b) {
  b.addEventListener("click", function () { paintSessionMood(b.getAttribute("data-mood")); });
});
var holdActive = false, holdTimer = null;
var errAt = -1, errTimer = null;
/* Loop 44 (second pass): how many letters stood correct at the
   last render — renderTarget compares against it to spot the
   one letter a keystroke just landed, and only that letter. */
var lastOkLen = 0;
var lineProgressFill = $("lineProgressFill");
/* Loop 46: the console as an instrument — feel-only state.
   freshTake asks the next renderTarget to re-deal the line
   letter by letter; forgiveNext asks it to answer a cleared
   error with one gentle brighten; lastKeyT/paceMs keep an
   eased measure of the typing tempo for the caret's pulse;
   lastRepShown spots the render where the rep count rises. */
var freshTake = false, forgiveNext = false;
var lastKeyT = 0, paceMs = 0, lastRepShown = -1;
function notePace() {
  var now = (window.performance && performance.now) ? performance.now() : Date.now();
  if (lastKeyT) {
    var gap = now - lastKeyT;
    if (gap > 0 && gap < 2500) {
      paceMs = paceMs ? paceMs * 0.6 + gap * 0.4 : gap;
      var dur = Math.min(1.6, Math.max(0.65, paceMs * 1.6 / 1000));
      targetLine.style.setProperty("--pulse-dur", dur.toFixed(2) + "s");
    } else {
      paceMs = 0;
      targetLine.style.setProperty("--pulse-dur", "1.5s");
    }
  }
  lastKeyT = now;
}

/* Loop 47: the seam — opening a block from the hub first lets
   the world pick it up (the world script's __worldHandoff
   leans the camera in and lifts the block to meet the tap),
   and only then does the drill console rise. swapSeq tokens
   the delayed swap, so a second open — or a close — can
   retire a swap that is still waiting its beat. */
var prefersReduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
var swapSeq = 0;

(function buildDots() {
  for (var i = 0; i < REPS_GOAL; i++) {
    var d = document.createElement("span"); d.className = "rep-dot"; repDots.appendChild(d);
  }
})();

function renderTarget(overrideTyped) {
  var b = BLOCKS[current];
  var typed = overrideTyped !== undefined ? overrideTyped : typeInput.value;
  targetLine.innerHTML = "";
  targetLine.classList.toggle("all-ok", typed === b.line);
  /* Loop 50 — the target line is a row of single-letter spans;
     its old aria-label ("Tap to start typing the drill line")
     replaced that content for screen readers, so the one thing
     a listener most needs — the line itself — was the one thing
     never spoken. The label now carries the line, refreshed
     only when it changes (this runs per keystroke). */
  var lineLabel = "Drill line: " + b.line + " — tap to start typing";
  if (targetLine.getAttribute("aria-label") !== lineLabel) targetLine.setAttribute("aria-label", lineLabel);
  /* The letter this render just landed: the correct count grew
     by exactly one since the last render and no error is lit.
     Pastes and jumps land silently; backspaces only shrink the
     count, so they never pop. */
  var okLen = Math.min(typed.length, b.line.length);
  var justIdx = (okLen === lastOkLen + 1 && errAt < 0) ? okLen - 1 : -1;
  lastOkLen = okLen;
  /* Loop 46 — the streak glow: the card warms with the rep's
     correct fraction; a lit error dips it and dims the letters. */
  var frac = b.line.length ? okLen / b.line.length : 0;
  typeCard.style.setProperty("--streak", (errAt >= 0 ? frac * 0.45 : frac).toFixed(3));
  typeCard.classList.toggle("err-lit", errAt >= 0);
  /* A fresh take re-deals the letters; forgiveness answers a
     cleared error. Both are one-render affairs: the flags are
     consumed here, and a plain render strips the classes so
     typing never replays them. */
  var fresh = freshTake; freshTake = false;
  targetLine.classList.toggle("fresh", fresh);
  if (forgiveNext) {
    forgiveNext = false;
    targetLine.classList.remove("forgiven"); void targetLine.offsetWidth;
    targetLine.classList.add("forgiven");
    setTimeout(function () { targetLine.classList.remove("forgiven"); }, 750);
  }
  for (var i = 0; i < b.line.length; i++) {
    var s = document.createElement("span");
    s.className = "ch " + (i < typed.length ? "ok" : (i === typed.length ? "next" : "todo")) + (i === errAt ? " err" : "") + (i === justIdx ? " just" : "");
    if (fresh) s.style.animationDelay = Math.min(i * 14, 320) + "ms";
    s.textContent = b.line[i] === " " ? "\u00A0" : b.line[i];
    targetLine.appendChild(s);
  }
  if (fresh) setTimeout(function () { targetLine.classList.remove("fresh"); }, 1000);
  if (lineProgressFill) lineProgressFill.style.width = (b.line.length ? Math.min(typed.length, b.line.length) / b.line.length * 100 : 0) + "%";
}
function renderReps() {
  var r = repsOf(current);
  var dots = repDots.children;
  for (var i = 0; i < dots.length; i++) {
    dots[i].classList.toggle("filled", i < r);
    dots[i].classList.toggle("next-seg", i === r);
  }
  repText.textContent = r + " / " + REPS_GOAL + " reps";
  /* Loop 46 — the counter ticks when a rep lands: a small pop
     on the pill, never on first paint or when counts fall. */
  if (lastRepShown >= 0 && r > lastRepShown) {
    repText.classList.remove("tick"); void repText.offsetWidth; repText.classList.add("tick");
  }
  lastRepShown = r;
  nextBtn.classList.toggle("hidden", !isDone(current));
  nextBtn.textContent = current >= BLOCKS.length - 1 ? "Back to your world" : "Next block — " + BLOCKS[current + 1].name;
}
/* Loop 50 — an identical status set twice ("Still got it.
   Perfect rep." on consecutive practice reps) is not
   re-announced by most screen readers, so alternate a
   zero-width space on the end: invisible on screen, different
   in the region, heard every time. */
var statusFlip = false;
function setStatus(msg, cls) { statusFlip = !statusFlip; drillStatus.textContent = msg ? msg + (statusFlip ? "\u200B" : "") : ""; drillStatus.className = "drill-status" + (cls ? " " + cls : ""); }

function openBlock(i) {
  current = i; holdActive = false; clearTimeout(holdTimer);
  errAt = -1; clearTimeout(errTimer);
  var b = BLOCKS[i];
  $("drillChip").style.background = b.color;
  $("drillChip").innerHTML = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#' + (b.icon || "i-cube") + '"/></svg>';
  $("drillTitle").textContent = b.name;
  $("drillChapter").textContent = b.chapter;
  if (sessionBlock) sessionBlock.textContent = "Block " + (i + 1) + " of " + BLOCKS.length;
  paintSessionMood(storedMood());
  var cn = $("consoleName");
  if (cn) cn.textContent = CB_META.file;
  $("drillExplain").textContent = b.explain;
  typeInput.value = "";
  setStatus(isDone(i) ? "Mastered. Keep typing it for the rhythm — that\u2019s how it sticks." : "", isDone(i) ? "good" : "");
  /* Loop 50 — opening a fresh block set an EMPTY status, so a
     screen-reader user landed in the typing box knowing neither
     the block nor the job. Announce both through the app voice;
     the mastered case already speaks via the status above. */
  if (!isDone(i) && window.cbAnnounce) window.cbAnnounce(b.name + " — " + b.chapter + ". Type the line eight perfect times.");
  if (listBtns[i]) lastOpener = listBtns[i].btn;
  /* Loop 46 — opening a block is a fresh take at a resting
     tempo: the line is dealt in and the caret starts calm. */
  freshTake = true; lastRepShown = -1;
  lastKeyT = 0; paceMs = 0; targetLine.style.removeProperty("--pulse-dur");
  renderTarget(); renderReps();
  /* Loop 47 — the pick-up: from the hub, the world gets one
     beat (380ms) to lean in and lift the block before the
     console rises over it. The delayed swap is tokened and
     guarded: a newer open or a close retires it, and if the
     learner has left the Sandbox entirely it stands down.
     The no-WebGL fallback has no __worldHandoff, so it swaps
     at once, exactly as before — as does reduced motion,
     where the hook itself declines. */
  var fromHub = !hubView.classList.contains("hidden");
  var picked = fromHub && !prefersReduced && window.__worldHandoff && window.__worldHandoff(i, "pick");
  var seq = ++swapSeq;
  function swapToDrill(guarded) {
    if (seq !== swapSeq) return;
    if (guarded && (hubView.classList.contains("hidden") || !hubView.getClientRects().length)) return;
    hubView.classList.add("hidden");
    drillView.classList.remove("hidden");
    window.scrollTo(0, 0);
    setTimeout(function () { try { typeInput.focus({ preventScroll: true }); } catch (e) { typeInput.focus(); } }, 60);
  }
  if (picked) setTimeout(function () { swapToDrill(true); }, 380); else swapToDrill(false);
}
function closeDrill() {
  var leaving = current;
  swapSeq++; /* Loop 47: retire any pick-up swap still waiting */
  current = -1;
  drillView.classList.add("hidden");
  hubView.classList.remove("hidden");
  typeInput.blur();
  window.scrollTo(0, 0);
  /* Loop 47 — the set-down: the world receives the block back
     (the camera leans to it, it settles onto its plinth, and
     a block mastered in that session gets its shimmer from
     the world before anything else moves). Fired only after
     the hub is visible again, so the world's tick can run. */
  if (leaving >= 0 && window.__worldHandoff) window.__worldHandoff(leaving, "settle");
  /* Put keyboard focus back on the block that was opened, so Tab and
     screen-reader users land where they left off, not at the top. */
  if (lastOpener) { try { lastOpener.focus({ preventScroll: true }); } catch (e) { lastOpener.focus(); } }
}
$("backBtn").addEventListener("click", closeDrill);
nextBtn.addEventListener("click", function () {
  if (current >= BLOCKS.length - 1) closeDrill(); else openBlock(current + 1);
});
targetLine.addEventListener("click", function () { typeInput.focus(); });

typeInput.addEventListener("input", function () {
  if (current < 0) return;
  if (holdActive) { holdActive = false; clearTimeout(holdTimer); }
  var b = BLOCKS[current];
  /* Loop 54 — regression sweep find: renderTarget draws the
     line's spaces as U+00A0 so the letter spans hold their
     width, which means any text that arrives by paste,
     dictation, an assistive tool reading the line back, or a
     keyboard that emits a non-breaking space carries U+00A0
     exactly where the line has a plain space — and the strict
     comparison below refused it as a wrong letter at the one
     spot that looked right. Fold the two space look-alikes
     (U+00A0, U+202F) back to a plain space in the box itself,
     so this handler, renderTarget and the progress fill all
     read one alphabet. One char for one char: positions,
     caret and the wrong-letter hunt are untouched. */
  var v = typeInput.value.replace(/[\u00A0\u202F]/g, " ");
  if (v !== typeInput.value) typeInput.value = v;
  /* Find the first wrong character — the line refuses it, gently. */
  var bad = -1;
  for (var i = 0; i < v.length; i++) {
    if (i >= b.line.length || v[i] !== b.line[i]) { bad = i; break; }
  }
  if (bad >= 0) {
    typeInput.value = v.slice(0, bad);
    errAt = bad;
    typeCard.classList.remove("shake"); void typeCard.offsetWidth; typeCard.classList.add("shake");
    setStatus("Not quite — watch the glowing letter and try again.", "bad");
    if (window.__musicEcho) window.__musicEcho("slip");
    renderTarget();
    clearTimeout(errTimer);
    /* Loop 46 — when the refusal clears, the line forgives:
       the next render answers with one gentle brighten. */
    errTimer = setTimeout(function () { errAt = -1; forgiveNext = true; if (current >= 0) renderTarget(); }, 420);
    return;
  }
  /* Loop 46 — every correct keystroke feeds the caret's tempo. */
  notePace();
  if (v === b.line) {
    renderTarget();
    var wasDone = isDone(current);
    if (!wasDone) {
      state.reps[current] = repsOf(current) + 1;
      save();
    }
    var nowDone = isDone(current);
    renderReps(); refreshProgress();
    /* Loop 46 — the rep lands on the card as one soft ring. */
    typeCard.classList.remove("rep-land"); void typeCard.offsetWidth; typeCard.classList.add("rep-land");
    if (window.__musicEcho) window.__musicEcho(nowDone && !wasDone ? "master" : "rep");
    if (nowDone && !wasDone) {
      setStatus("Block mastered! That syntax is yours now.", "good");
      if (window.__burstAt) window.__burstAt(current, true);
      /* Loop 67 — the finale glissando fires here, at the one
         genuine completion moment: this typed rep just mastered
         a block (nowDone && !wasDone) and it was the track's
         last open one. It used to fire from refreshProgress's
         100% transition, which state swaps (profile sign-in /
         out / switch) could trip without any rep being typed. */
      if (doneCount() === BLOCKS.length && window.__finaleGliss) window.__finaleGliss();
      if (doneCount() === BLOCKS.length && !state.celebrated) {
        state.celebrated = true; save();
        if (window.__celebrate) window.__celebrate();
        setTimeout(closeDrill, 900);
        /* Loop 15: once the hub and its banner are back on screen,
           the ceremony overlay rises to mark the moment properly. */
        setTimeout(function () { if (window.__openCeremony) window.__openCeremony(true); }, 1500);
      }
    } else {
      setStatus(wasDone ? "Still got it. Perfect rep." : "Perfect rep — " + (REPS_GOAL - repsOf(current)) + " to go.", "good");
      /* Loop 26: a plain perfect rep earns the quiet shimmer,
         not the burst — the explosion is saved for mastery. */
      if (window.__shimmerAt) window.__shimmerAt(current);
      else if (window.__burstAt) window.__burstAt(current, false);
    }
    /* Hold the all-blue line on screen briefly, but clear the input
       right away so a fast typist's next rep is never swallowed. */
    typeInput.value = "";
    holdActive = true;
    /* Loop 46 — the reset line arrives as a fresh take. */
    holdTimer = setTimeout(function () { holdActive = false; freshTake = true; renderTarget(); }, 480);
  } else {
    if (drillStatus.classList.contains("bad")) setStatus("", "");
    if (window.__musicEcho) window.__musicEcho("key");
    renderTarget();
  }
});
/* Keep the hidden input focused while drilling on desktop too */
typeCard.addEventListener("click", function () { typeInput.focus(); });

/* ================= Reset ================= */
var resetArmed = false, resetTimer = null;
$("resetBtn").addEventListener("click", function () {
  var btn = $("resetBtn");
  if (!resetArmed) {
    resetArmed = true; btn.classList.add("arm");
    btn.textContent = "Tap again to erase all progress";
    resetTimer = setTimeout(function () {
      resetArmed = false; btn.classList.remove("arm"); btn.textContent = "Reset all progress";
    }, 3500);
    return;
  }
  clearTimeout(resetTimer);
  resetArmed = false; btn.classList.remove("arm"); btn.textContent = "Reset all progress";
  state = { reps: {}, celebrated: false }; save();
  refreshProgress();
});

/* Loop 47 — attention: the world is an ambient presence
   behind the list. Scrolling down into the blocks marks the
   hub as attending the list: the world card dims (CSS) and
   the 3D scene eases its exposure down to match. Scrolling
   back to the top — or putting the pointer over the world —
   returns the eye, and everything brightens. Where the world
   never started (no WebGL) only the card dim applies, driven
   by the same class; the hook call is guarded. */
var worldCardEl = document.querySelector(".world-card");
var eyeOnWorld = false;
function noteAttention() {
  var toList = !eyeOnWorld && window.scrollY > 90;
  hubView.classList.toggle("attending-list", toList);
  if (window.__worldAttention) window.__worldAttention(toList);
}
window.addEventListener("scroll", noteAttention, { passive: true });
if (worldCardEl) {
  worldCardEl.addEventListener("pointerenter", function () { eyeOnWorld = true; noteAttention(); });
  worldCardEl.addEventListener("pointerleave", function () { eyeOnWorld = false; noteAttention(); });
}

refreshProgress();
