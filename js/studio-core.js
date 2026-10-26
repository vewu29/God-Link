"use strict";
/* ================= Code Block Studio — the engine core =================
   A game is made of actors (boxes, spheres, signs…) in a 3D world, and
   each actor has a Blueprint: a graph of nodes joined by wires, in the
   style of Unreal Engine's visual scripting. The Level has a Blueprint
   too. Nobody writes code: events (Begin Play, Tick, a key, a bump…)
   send a white "execution" wire through action nodes, and coloured data
   wires carry numbers, text, vectors and actors between them.

   This file is everything that makes a game run — the node library,
   the Blueprint interpreter and the world (movement, gravity, collision,
   overlaps, timers) — with no drawing at all. js/studio.js draws it
   with Babylon.js and gives it an editor; tests/studio-core.test.js
   runs it in Node. Exposed as window.CBStudio (or module.exports).

   Conventions
   - Coordinates: y is up; 1 unit is about a metre. Rotations are in
     degrees. Every shape fits a 1×1×1 box before scaling, and collisions
     use world-aligned boxes (rotation turns the look, not the box).
   - Bodies: "none" (moves only when told; can still overlap), "solid"
     (never moves on its own; blocks others), "dynamic" (has velocity,
     optional gravity, stops against solids).
   - Pins: exec (white), bool, number, string, vector, actor, color, any. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CBStudio = factory();
})(typeof self !== "undefined" ? self : this, function () {
  var VERSION = 1;
  var MAX_STEPS = 100000;       // node runs per frame before "a loop that never ends"
  var MAX_ACTORS = 1500;

  /* ---------- small helpers ---------- */
  function V(x, y, z) { return { x: +x || 0, y: +y || 0, z: +z || 0 }; }
  function vcopy(v) { return V(v && v.x, v && v.y, v && v.z); }
  function isVec(v) { return !!v && typeof v === "object" && typeof v.x === "number" && typeof v.y === "number" && typeof v.z === "number"; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function round(n, d) { var p = Math.pow(10, d); return Math.round(n * p) / p; }
  function hex2(n) { var s = clamp(Math.round(n), 0, 255).toString(16); return s.length < 2 ? "0" + s : s; }
  function isColor(c) { return typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c); }
  function toText(v) {
    if (v === null || v === undefined) return "";
    if (typeof v === "number") return isFinite(v) ? String(round(v, 2)) : "0";
    if (typeof v === "boolean") return v ? "true" : "false";
    if (isVec(v)) return "(" + round(v.x, 2) + ", " + round(v.y, 2) + ", " + round(v.z, 2) + ")";
    if (typeof v === "object" && v.__actor) return v.name;
    return String(v);
  }
  function coerce(v, type) {
    switch (type) {
      case "number":
        if (typeof v === "number") return isFinite(v) ? v : 0;
        if (typeof v === "boolean") return v ? 1 : 0;
        if (typeof v === "string") { var n = parseFloat(v); return isFinite(n) ? n : 0; }
        return 0;
      case "bool":
        if (typeof v === "string") return v === "true";
        return !!v;
      case "string": return toText(v);
      case "vector": return isVec(v) ? v : Array.isArray(v) ? V(v[0], v[1], v[2]) : typeof v === "number" ? V(v, v, v) : V(0, 0, 0);
      case "color": return isColor(v) ? v.toLowerCase() : "#ffffff";
      default: return v;
    }
  }
  function same(a, b) {
    if (isVec(a) && isVec(b)) return Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6 && Math.abs(a.z - b.z) < 1e-6;
    if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-9;
    if (a && b && a.__actor && b.__actor) return a.id === b.id;
    if (typeof a !== typeof b && a !== null && b !== null && typeof a !== "object" && typeof b !== "object") return toText(a) === toText(b);
    return a === b;
  }
  function mulberry(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- the vocabulary ---------- */
  var TYPES = {
    exec: { name: "Exec", color: "#ffffff" },
    bool: { name: "Boolean", color: "#e0425a" },
    number: { name: "Number", color: "#8be04a" },
    string: { name: "Text", color: "#f25fd8" },
    vector: { name: "Vector", color: "#f5c518" },
    actor: { name: "Actor", color: "#3aa8ff" },
    color: { name: "Color", color: "#4fd6cf" },
    any: { name: "Any", color: "#c4c9d4" }
  };
  var VAR_TYPES = ["number", "bool", "string", "vector", "color", "actor"];
  var SHAPES = ["box", "sphere", "cylinder", "cone", "capsule", "torus", "sign"];
  var BODIES = ["none", "solid", "dynamic"];
  var KEYS = ["W", "A", "S", "D", "Up", "Down", "Left", "Right", "Space", "Enter", "Shift",
    "Q", "E", "R", "F", "G", "Z", "X", "C", "V", "1", "2", "3", "4", "5"];
  var SOUNDS = ["coin", "jump", "hit", "explode", "powerup", "laser", "win", "lose", "click", "beep"];
  var PARTICLES = ["sparkle", "explosion", "smoke", "confetti", "fire"];
  var CAMERA_MODES = ["follow", "top-down", "side", "fixed"];
  var CATEGORIES = [
    { id: "Events", color: "#b3261e" }, { id: "Flow Control", color: "#5b6270" }, { id: "Variables", color: "#7b3fb8" },
    { id: "Math", color: "#3d8a2a" }, { id: "Logic", color: "#9c2a3e" }, { id: "Text", color: "#a8298f" },
    { id: "Vector", color: "#a07d00" }, { id: "Actor", color: "#1d5fa8" }, { id: "Physics", color: "#b5571b" },
    { id: "Input", color: "#b5306e" }, { id: "Camera", color: "#11807a" }, { id: "HUD", color: "#0e7490" },
    { id: "Audio & Effects", color: "#6d3fc0" }, { id: "Game", color: "#374151" }
  ];

  var NODES = {};
  var X = { name: "In", type: "exec" };
  function I(name, type, def, extra) { var p = { name: name, type: type, def: def }; if (extra) for (var k in extra) p[k] = extra[k]; return p; }
  function O(name, type) { return { name: name, type: type }; }
  var THEN = O("Then", "exec");
  /* def(type, {title, cat, kind: "event"|"exec"|"pure", in, out, settings, run|eval, help}) */
  function def(type, d) {
    d.type = type;
    d.in = d.in || [];
    d.out = d.out || [];
    d.settings = d.settings || [];
    d.kind = d.kind || (d.eval ? "pure" : "exec");
    NODES[type] = d;
  }
  function S(name, kind, options, dflt, label) { return { name: name, kind: kind, options: options, def: dflt, label: label || name }; }

  /* ===== Events ===== */
  def("BeginPlay", { title: "Event BeginPlay", cat: "Events", kind: "event", out: [THEN], help: "Runs once when the game starts (or when this actor is spawned)." });
  def("Tick", { title: "Event Tick", cat: "Events", kind: "event", out: [THEN, O("Delta Seconds", "number")], help: "Runs every frame. Delta Seconds is the time since the last frame — multiply speeds by it." });
  def("KeyPressed", { title: "On Key Pressed", cat: "Events", kind: "event", out: [THEN], settings: [S("key", "select", KEYS, "Space", "Key")], help: "Runs when the key goes down." });
  def("KeyReleased", { title: "On Key Released", cat: "Events", kind: "event", out: [THEN], settings: [S("key", "select", KEYS, "Space", "Key")], help: "Runs when the key comes back up." });
  def("Clicked", { title: "On Clicked", cat: "Events", kind: "event", out: [THEN], help: "Runs when this actor is clicked or tapped." });
  def("AnyClicked", { title: "On Any Actor Clicked", cat: "Events", kind: "event", out: [THEN, O("Actor", "actor")], help: "Runs when any actor is clicked or tapped." });
  def("OverlapBegin", { title: "On Begin Overlap", cat: "Events", kind: "event", out: [THEN, O("Other Actor", "actor")], help: "Runs when another actor starts touching this one." });
  def("OverlapEnd", { title: "On End Overlap", cat: "Events", kind: "event", out: [THEN, O("Other Actor", "actor")], help: "Runs when another actor stops touching this one." });
  def("Hit", { title: "On Hit", cat: "Events", kind: "event", out: [THEN, O("Other Actor", "actor")], help: "Runs when this actor bumps into a solid (or a moving actor bumps into this solid)." });
  def("Destroyed", { title: "Event Destroyed", cat: "Events", kind: "event", out: [THEN], help: "Runs just before this actor is destroyed." });
  def("CustomEvent", { title: "Custom Event", cat: "Events", kind: "event", out: [THEN], settings: [S("name", "text", null, "MyEvent", "Name")], help: "Runs when called by name: Call Custom Event, Broadcast Event or Set Timer by Event." });

  /* ===== Flow Control ===== */
  def("Branch", { title: "Branch", cat: "Flow Control", in: [X, I("Condition", "bool", true)], out: [O("True", "exec"), O("False", "exec")],
    run: function (c) { return c.in("Condition") ? "True" : "False"; }, help: "Goes one way if the condition is true, the other if false." });
  def("Sequence", { title: "Sequence", cat: "Flow Control", in: [X], out: [O("Then 0", "exec"), O("Then 1", "exec"), O("Then 2", "exec"), O("Then 3", "exec")],
    run: function (c) { c.fire("Then 0"); c.fire("Then 1"); c.fire("Then 2"); return "Then 3"; }, help: "Runs each output in order, top to bottom." });
  def("ForLoop", { title: "For Loop", cat: "Flow Control", in: [X, I("First Index", "number", 0), I("Last Index", "number", 3)],
    out: [O("Loop Body", "exec"), O("Index", "number"), O("Completed", "exec")],
    run: function (c) {
      var a = Math.round(c.in("First Index")), b = Math.round(c.in("Last Index"));
      for (var i = a; i <= b; i++) { c.out("Index", i); c.fire("Loop Body"); if (c.stopped()) return null; }
      return "Completed";
    }, help: "Runs Loop Body once for each whole number from First to Last." });
  def("ForEachTagged", { title: "For Each Actor With Tag", cat: "Flow Control", in: [X, I("Tag", "string", "enemy")],
    out: [O("Loop Body", "exec"), O("Actor", "actor"), O("Index", "number"), O("Completed", "exec")],
    run: function (c) {
      var list = c.game.withTag(c.in("Tag"));
      for (var i = 0; i < list.length; i++) { c.out("Actor", list[i]); c.out("Index", i); c.fire("Loop Body"); if (c.stopped()) return null; }
      return "Completed";
    }, help: "Runs Loop Body for every living actor that has the tag." });
  def("WhileLoop", { title: "While Loop", cat: "Flow Control", in: [X, I("Condition", "bool", false)], out: [O("Loop Body", "exec"), O("Completed", "exec")],
    run: function (c) {
      var guard = 0;
      while (c.in("Condition")) { c.fire("Loop Body"); if (c.stopped()) return null; if (++guard > 10000) { c.game.fail("A While Loop ran 10,000 times without its condition turning false."); return null; } }
      return "Completed";
    }, help: "Repeats Loop Body as long as the condition stays true." });
  def("DoOnce", { title: "Do Once", cat: "Flow Control", in: [X, { name: "Reset", type: "exec" }], out: [O("Completed", "exec")],
    run: function (c, pin) {
      if (pin === "Reset") { c.mem.done = false; return null; }
      if (c.mem.done) return null;
      c.mem.done = true; return "Completed";
    }, help: "Lets the flow through only the first time, until Reset." });
  def("DoN", { title: "Do N", cat: "Flow Control", in: [X, { name: "Reset", type: "exec" }, I("N", "number", 3)], out: [O("Exit", "exec"), O("Counter", "number")],
    run: function (c, pin) {
      if (pin === "Reset") { c.mem.count = 0; c.out("Counter", 0); return null; }
      c.mem.count = c.mem.count || 0;
      if (c.mem.count >= Math.round(c.in("N"))) return null;
      c.mem.count++; c.out("Counter", c.mem.count); return "Exit";
    }, help: "Lets the flow through N times, until Reset." });
  def("Gate", { title: "Gate", cat: "Flow Control", in: [{ name: "Enter", type: "exec" }, { name: "Open", type: "exec" }, { name: "Close", type: "exec" }, { name: "Toggle", type: "exec" }],
    out: [O("Exit", "exec")], settings: [S("startClosed", "check", null, false, "Start Closed")],
    run: function (c, pin) {
      if (c.mem.open === undefined) c.mem.open = !c.setting("startClosed");
      if (pin === "Open") c.mem.open = true;
      else if (pin === "Close") c.mem.open = false;
      else if (pin === "Toggle") c.mem.open = !c.mem.open;
      else if (c.mem.open) return "Exit";
      return null;
    }, help: "Enter passes through only while the gate is open." });
  def("FlipFlop", { title: "Flip Flop", cat: "Flow Control", in: [X], out: [O("A", "exec"), O("B", "exec"), O("Is A", "bool")],
    run: function (c) { c.mem.a = !c.mem.a; c.out("Is A", c.mem.a); return c.mem.a ? "A" : "B"; }, help: "Alternates: A, then B, then A…" });
  def("Delay", { title: "Delay", cat: "Flow Control", in: [X, I("Duration", "number", 1)], out: [O("Completed", "exec")],
    run: function (c) { if (!c.mem.pending) { c.mem.pending = true; c.later(c.in("Duration"), "Completed", function () { c.mem.pending = false; }); } return null; },
    help: "Waits, then carries on. While waiting, new arrivals are ignored." });
  def("RetriggerableDelay", { title: "Retriggerable Delay", cat: "Flow Control", in: [X, I("Duration", "number", 1)], out: [O("Completed", "exec")],
    run: function (c) { c.later(c.in("Duration"), "Completed", null, true); return null; }, help: "Waits; each new arrival starts the wait over." });
  def("SwitchInt", { title: "Switch on Number", cat: "Flow Control", in: [X, I("Selection", "number", 0)],
    out: [O("0", "exec"), O("1", "exec"), O("2", "exec"), O("3", "exec"), O("Default", "exec")],
    run: function (c) { var n = Math.round(c.in("Selection")); return n >= 0 && n <= 3 ? String(n) : "Default"; }, help: "Picks an output by number." });
  def("SetTimer", { title: "Set Timer by Event", cat: "Flow Control", in: [X, I("Event Name", "string", "MyEvent"), I("Time", "number", 1), I("Looping", "bool", false)], out: [THEN],
    run: function (c) { c.game.setTimer(c.inst, c.in("Event Name"), c.in("Time"), c.in("Looping")); return "Then"; },
    help: "After Time seconds, runs this Blueprint's Custom Event with that name (again and again if Looping)." });
  def("ClearTimer", { title: "Clear Timer", cat: "Flow Control", in: [X, I("Event Name", "string", "MyEvent")], out: [THEN],
    run: function (c) { c.game.clearTimer(c.inst, c.in("Event Name")); return "Then"; }, help: "Stops a timer set by Set Timer by Event." });
  def("CallEvent", { title: "Call Custom Event", cat: "Flow Control", in: [X, I("Target", "actor", "self"), I("Event Name", "string", "MyEvent")], out: [THEN],
    run: function (c) { var a = c.in("Target"); c.game.callEvent(a ? c.game.instOf(a) : c.game.level, c.in("Event Name")); return "Then"; },
    help: "Runs a Custom Event in another actor's Blueprint (or this one's)." });
  def("Broadcast", { title: "Broadcast Event", cat: "Flow Control", in: [X, I("Event Name", "string", "GameOver")], out: [THEN],
    run: function (c) { c.game.broadcast(c.in("Event Name")); return "Then"; }, help: "Runs the Custom Event with that name in every Blueprint, the Level's too." });

  /* ===== Variables ===== */
  def("GetVar", { title: "Get", cat: "Variables", settings: [S("var", "variable", null, "", "Variable")], out: [O("Value", "any")],
    eval: function (c) { return { Value: c.game.getVar(c.setting("var")) }; }, help: "Reads a game variable." });
  def("SetVar", { title: "Set", cat: "Variables", settings: [S("var", "variable", null, "", "Variable")], in: [X, I("Value", "any", 0)], out: [THEN, O("Value", "any")],
    run: function (c) { var v = c.game.setVar(c.setting("var"), c.in("Value")); c.out("Value", v); return "Then"; }, help: "Changes a game variable." });
  def("IncVar", { title: "Increment Variable", cat: "Variables", settings: [S("var", "variable", null, "", "Variable")], in: [X, I("By", "number", 1)], out: [THEN, O("Value", "number")],
    run: function (c) { var name = c.setting("var"); var v = c.game.setVar(name, coerce(c.game.getVar(name), "number") + c.in("By")); c.out("Value", v); return "Then"; },
    help: "Adds to a number variable (use a negative number to take away)." });
  def("SaveValue", { title: "Save Game Value", cat: "Variables", in: [X, I("Key", "string", "best"), I("Value", "any", 0)], out: [THEN],
    run: function (c) { c.game.save(c.in("Key"), c.in("Value")); return "Then"; }, help: "Remembers a value on this device, even after the game is closed." });
  def("LoadValue", { title: "Load Game Value", cat: "Variables", in: [I("Key", "string", "best"), I("Default", "any", 0)], out: [O("Value", "any")],
    eval: function (c) { var v = c.game.load(c.in("Key")); return { Value: v === undefined ? c.in("Default") : v }; }, help: "Reads a value saved with Save Game Value." });

  /* ===== Math ===== */
  function bin(type, title, f, help) { def(type, { title: title, cat: "Math", in: [I("A", "number", 0), I("B", "number", 1)], out: [O("Result", "number")], eval: function (c) { return { Result: f(c.in("A"), c.in("B")) }; }, help: help }); }
  function un(type, title, f, help, name) { def(type, { title: title, cat: "Math", in: [I(name || "Value", "number", 0)], out: [O("Result", "number")], eval: function (c) { return { Result: f(c.in(name || "Value")) }; }, help: help }); }
  bin("Add", "+ Add", function (a, b) { return a + b; }, "A plus B.");
  bin("Subtract", "− Subtract", function (a, b) { return a - b; }, "A minus B.");
  bin("Multiply", "× Multiply", function (a, b) { return a * b; }, "A times B.");
  bin("Divide", "÷ Divide", function (a, b) { return b === 0 ? 0 : a / b; }, "A divided by B (dividing by 0 gives 0).");
  bin("Modulo", "% Remainder", function (a, b) { return b === 0 ? 0 : ((a % b) + b) % b; }, "What's left over after dividing A by B.");
  bin("Power", "Power", function (a, b) { var r = Math.pow(a, b); return isFinite(r) ? r : 0; }, "A to the power B.");
  bin("Min", "Min", Math.min, "The smaller of A and B.");
  bin("Max", "Max", Math.max, "The larger of A and B.");
  def("Clamp", { title: "Clamp", cat: "Math", in: [I("Value", "number", 0), I("Min", "number", 0), I("Max", "number", 1)], out: [O("Result", "number")],
    eval: function (c) { return { Result: clamp(c.in("Value"), c.in("Min"), c.in("Max")) }; }, help: "Keeps the value between Min and Max." });
  un("Abs", "Absolute", Math.abs, "The value without its minus sign.");
  un("Round", "Round", Math.round, "To the nearest whole number.");
  un("Floor", "Floor", Math.floor, "Down to a whole number.");
  un("Ceil", "Ceil", Math.ceil, "Up to a whole number.");
  un("Sqrt", "Square Root", function (x) { return x < 0 ? 0 : Math.sqrt(x); }, "The square root.");
  un("Sin", "Sin (degrees)", function (x) { return Math.sin(x * Math.PI / 180); }, "Sine of an angle in degrees — handy for bobbing and waves.", "Degrees");
  un("Cos", "Cos (degrees)", function (x) { return Math.cos(x * Math.PI / 180); }, "Cosine of an angle in degrees.", "Degrees");
  def("Atan2", { title: "Angle From X/Z", cat: "Math", in: [I("X", "number", 0), I("Z", "number", 1)], out: [O("Degrees", "number")],
    eval: function (c) { return { Degrees: Math.atan2(c.in("X"), c.in("Z")) * 180 / Math.PI }; }, help: "The turn (yaw) in degrees that faces along X and Z." });
  def("Lerp", { title: "Lerp", cat: "Math", in: [I("A", "number", 0), I("B", "number", 1), I("Alpha", "number", 0.5)], out: [O("Result", "number")],
    eval: function (c) { var a = c.in("A"); return { Result: a + (c.in("B") - a) * c.in("Alpha") }; }, help: "Blends from A (Alpha 0) to B (Alpha 1)." });
  def("MapRange", { title: "Map Range", cat: "Math", in: [I("Value", "number", 0.5), I("In Min", "number", 0), I("In Max", "number", 1), I("Out Min", "number", 0), I("Out Max", "number", 100)], out: [O("Result", "number")],
    eval: function (c) { var a = c.in("In Min"), b = c.in("In Max"), t = b === a ? 0 : clamp((c.in("Value") - a) / (b - a), 0, 1); return { Result: c.in("Out Min") + (c.in("Out Max") - c.in("Out Min")) * t }; },
    help: "Turns a value from one range into another (clamped)." });
  def("RandomFloat", { title: "Random Number in Range", cat: "Math", in: [I("Min", "number", 0), I("Max", "number", 1)], out: [O("Result", "number")],
    eval: function (c) { var a = c.in("Min"); return { Result: a + (c.in("Max") - a) * c.game.random() }; }, help: "A random number between Min and Max." });
  def("RandomInt", { title: "Random Whole Number", cat: "Math", in: [I("Min", "number", 1), I("Max", "number", 6)], out: [O("Result", "number")],
    eval: function (c) { var a = Math.ceil(c.in("Min")), b = Math.floor(c.in("Max")); if (b < a) return { Result: a }; return { Result: a + Math.floor(c.game.random() * (b - a + 1)) }; },
    help: "A random whole number from Min to Max, both included." });
  def("RandomBool", { title: "Random Chance", cat: "Math", in: [I("Chance", "number", 0.5)], out: [O("Result", "bool")],
    eval: function (c) { return { Result: c.game.random() < c.in("Chance") }; }, help: "True with this chance (0.25 = one time in four)." });
  def("Number", { title: "Number", cat: "Math", in: [I("Value", "number", 0)], out: [O("Value", "number")],
    eval: function (c) { return { Value: c.in("Value") }; }, help: "A fixed number you can wire to many places." });

  /* ===== Logic ===== */
  function cmp(type, title, f, help) { def(type, { title: title, cat: "Logic", in: [I("A", "number", 0), I("B", "number", 0)], out: [O("Result", "bool")], eval: function (c) { return { Result: f(c.in("A"), c.in("B")) }; }, help: help }); }
  def("Equal", { title: "== Equal", cat: "Logic", in: [I("A", "any", 0), I("B", "any", 0)], out: [O("Result", "bool")], eval: function (c) { return { Result: same(c.in("A"), c.in("B")) }; }, help: "True if A and B are the same." });
  def("NotEqual", { title: "!= Not Equal", cat: "Logic", in: [I("A", "any", 0), I("B", "any", 0)], out: [O("Result", "bool")], eval: function (c) { return { Result: !same(c.in("A"), c.in("B")) }; }, help: "True if A and B differ." });
  cmp("Greater", "> Greater", function (a, b) { return a > b; }, "True if A is bigger than B.");
  cmp("GreaterEqual", ">= Greater or Equal", function (a, b) { return a >= b; }, "True if A is at least B.");
  cmp("Less", "< Less", function (a, b) { return a < b; }, "True if A is smaller than B.");
  cmp("LessEqual", "<= Less or Equal", function (a, b) { return a <= b; }, "True if A is at most B.");
  def("NearlyEqual", { title: "Nearly Equal", cat: "Logic", in: [I("A", "number", 0), I("B", "number", 0), I("Tolerance", "number", 0.01)], out: [O("Result", "bool")],
    eval: function (c) { return { Result: Math.abs(c.in("A") - c.in("B")) <= Math.abs(c.in("Tolerance")) }; }, help: "True if A and B are within the tolerance." });
  def("And", { title: "AND", cat: "Logic", in: [I("A", "bool", false), I("B", "bool", false)], out: [O("Result", "bool")], eval: function (c) { return { Result: c.in("A") && c.in("B") }; }, help: "True only if both are true." });
  def("Or", { title: "OR", cat: "Logic", in: [I("A", "bool", false), I("B", "bool", false)], out: [O("Result", "bool")], eval: function (c) { return { Result: c.in("A") || c.in("B") }; }, help: "True if either is true." });
  def("Not", { title: "NOT", cat: "Logic", in: [I("A", "bool", false)], out: [O("Result", "bool")], eval: function (c) { return { Result: !c.in("A") }; }, help: "Flips true and false." });
  def("Xor", { title: "XOR", cat: "Logic", in: [I("A", "bool", false), I("B", "bool", false)], out: [O("Result", "bool")], eval: function (c) { return { Result: c.in("A") !== c.in("B") }; }, help: "True if exactly one is true." });
  def("Select", { title: "Select", cat: "Logic", in: [I("Condition", "bool", true), I("If True", "any", 1), I("If False", "any", 0)], out: [O("Result", "any")],
    eval: function (c) { return { Result: c.in("Condition") ? c.in("If True") : c.in("If False") }; }, help: "Picks one of two values." });

  /* ===== Text ===== */
  def("Append", { title: "Append", cat: "Text", in: [I("A", "string", "Score: "), I("B", "string", ""), I("C", "string", "")], out: [O("Result", "string")],
    eval: function (c) { return { Result: c.in("A") + c.in("B") + c.in("C") }; }, help: "Joins pieces of text." });
  def("FormatText", { title: "Format Text", cat: "Text", in: [I("Format", "string", "Lives: {0}"), I("{0}", "any", ""), I("{1}", "any", ""), I("{2}", "any", "")], out: [O("Result", "string")],
    eval: function (c) { var vals = [c.in("{0}"), c.in("{1}"), c.in("{2}")]; return { Result: c.in("Format").replace(/\{([0-2])\}/g, function (m, i) { return toText(vals[+i]); }) }; },
    help: "Fills {0}, {1} and {2} in the text with values." });
  def("ToText", { title: "To Text", cat: "Text", in: [I("Value", "any", 0), I("Decimals", "number", 0)], out: [O("Result", "string")],
    eval: function (c) { var v = c.in("Value"); return { Result: typeof v === "number" ? v.toFixed(clamp(Math.round(c.in("Decimals")), 0, 6)) : toText(v) }; }, help: "Turns any value into text." });
  def("TextLength", { title: "Text Length", cat: "Text", in: [I("Text", "string", "")], out: [O("Length", "number")], eval: function (c) { return { Length: c.in("Text").length }; }, help: "How many characters." });
  def("TextContains", { title: "Text Contains", cat: "Text", in: [I("Text", "string", ""), I("Search", "string", "")], out: [O("Result", "bool")],
    eval: function (c) { return { Result: c.in("Text").toLowerCase().indexOf(c.in("Search").toLowerCase()) >= 0 }; }, help: "True if the text has the search inside it (any case)." });

  /* ===== Vector ===== */
  def("MakeVector", { title: "Make Vector", cat: "Vector", in: [I("X", "number", 0), I("Y", "number", 0), I("Z", "number", 0)], out: [O("Vector", "vector")],
    eval: function (c) { return { Vector: V(c.in("X"), c.in("Y"), c.in("Z")) }; }, help: "Three numbers into one vector (a direction or a place)." });
  def("BreakVector", { title: "Break Vector", cat: "Vector", in: [I("Vector", "vector", V(0, 0, 0))], out: [O("X", "number"), O("Y", "number"), O("Z", "number")],
    eval: function (c) { var v = c.in("Vector"); return { X: v.x, Y: v.y, Z: v.z }; }, help: "A vector into its three numbers." });
  def("VecAdd", { title: "Vector + Vector", cat: "Vector", in: [I("A", "vector", V(0, 0, 0)), I("B", "vector", V(0, 0, 0))], out: [O("Result", "vector")],
    eval: function (c) { var a = c.in("A"), b = c.in("B"); return { Result: V(a.x + b.x, a.y + b.y, a.z + b.z) }; }, help: "Adds two vectors." });
  def("VecSub", { title: "Vector − Vector", cat: "Vector", in: [I("A", "vector", V(0, 0, 0)), I("B", "vector", V(0, 0, 0))], out: [O("Result", "vector")],
    eval: function (c) { var a = c.in("A"), b = c.in("B"); return { Result: V(a.x - b.x, a.y - b.y, a.z - b.z) }; }, help: "Takes B away from A." });
  def("VecScale", { title: "Vector × Number", cat: "Vector", in: [I("Vector", "vector", V(1, 0, 0)), I("Scale", "number", 1)], out: [O("Result", "vector")],
    eval: function (c) { var v = c.in("Vector"), s = c.in("Scale"); return { Result: V(v.x * s, v.y * s, v.z * s) }; }, help: "Makes a vector longer or shorter." });
  def("VecLength", { title: "Vector Length", cat: "Vector", in: [I("Vector", "vector", V(0, 0, 0))], out: [O("Length", "number")],
    eval: function (c) { var v = c.in("Vector"); return { Length: Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) }; }, help: "How long the vector is." });
  def("VecNormalize", { title: "Normalize", cat: "Vector", in: [I("Vector", "vector", V(1, 0, 0))], out: [O("Result", "vector")],
    eval: function (c) { var v = c.in("Vector"), l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); return { Result: l ? V(v.x / l, v.y / l, v.z / l) : V(0, 0, 0) }; }, help: "Same direction, length 1." });
  def("Distance", { title: "Distance", cat: "Vector", in: [I("A", "vector", V(0, 0, 0)), I("B", "vector", V(0, 0, 0))], out: [O("Distance", "number")],
    eval: function (c) { var a = c.in("A"), b = c.in("B"), x = a.x - b.x, y = a.y - b.y, z = a.z - b.z; return { Distance: Math.sqrt(x * x + y * y + z * z) }; }, help: "How far apart two places are." });
  def("Direction", { title: "Direction From To", cat: "Vector", in: [I("From", "vector", V(0, 0, 0)), I("To", "vector", V(0, 0, 1))], out: [O("Direction", "vector")],
    eval: function (c) { var a = c.in("From"), b = c.in("To"), x = b.x - a.x, y = b.y - a.y, z = b.z - a.z, l = Math.sqrt(x * x + y * y + z * z); return { Direction: l ? V(x / l, y / l, z / l) : V(0, 0, 0) }; },
    help: "The way to go from one place to another, length 1." });
  def("VecLerp", { title: "Lerp Vector", cat: "Vector", in: [I("A", "vector", V(0, 0, 0)), I("B", "vector", V(0, 0, 0)), I("Alpha", "number", 0.5)], out: [O("Result", "vector")],
    eval: function (c) { var a = c.in("A"), b = c.in("B"), t = c.in("Alpha"); return { Result: V(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t) }; }, help: "Blends between two vectors." });
  def("RandomVector", { title: "Random Point in Box", cat: "Vector", in: [I("Min", "vector", V(-5, 1, -5)), I("Max", "vector", V(5, 1, 5))], out: [O("Point", "vector")],
    eval: function (c) { var a = c.in("Min"), b = c.in("Max"), r = c.game.random; return { Point: V(a.x + (b.x - a.x) * r(), a.y + (b.y - a.y) * r(), a.z + (b.z - a.z) * r()) }; }, help: "A random place between two corners." });
  def("RotateY", { title: "Rotate Vector Around Y", cat: "Vector", in: [I("Vector", "vector", V(0, 0, 1)), I("Degrees", "number", 90)], out: [O("Result", "vector")],
    eval: function (c) { var v = c.in("Vector"), a = c.in("Degrees") * Math.PI / 180, s = Math.sin(a), co = Math.cos(a); return { Result: V(v.x * co + v.z * s, v.y, -v.x * s + v.z * co) }; },
    help: "Turns a direction left or right." });

  /* ===== Actor ===== */
  function T(name) { return I(name || "Target", "actor", "self"); }
  function act(type, title, ins, f, help, outs) {
    def(type, { title: title, cat: "Actor", in: [X].concat(ins), out: [THEN].concat(outs || []), run: function (c) { var a = c.in("Target"); if (a && a.alive) f(c, a); else f(c, null); return "Then"; }, help: help });
  }
  def("Self", { title: "Self", cat: "Actor", out: [O("Self", "actor")], eval: function (c) { return { Self: c.self }; }, help: "This Blueprint's own actor." });
  def("GetActorByName", { title: "Get Actor By Name", cat: "Actor", in: [I("Name", "string", "Player")], out: [O("Actor", "actor")],
    eval: function (c) { return { Actor: c.game.byName(c.in("Name")) }; }, help: "Finds an actor by its name." });
  def("GetActorWithTag", { title: "Get Actor With Tag", cat: "Actor", in: [I("Tag", "string", "player")], out: [O("Actor", "actor")],
    eval: function (c) { return { Actor: c.game.withTag(c.in("Tag"))[0] || null }; }, help: "The first actor with the tag." });
  def("CountTagged", { title: "Count Actors With Tag", cat: "Actor", in: [I("Tag", "string", "coin")], out: [O("Count", "number")],
    eval: function (c) { return { Count: c.game.withTag(c.in("Tag")).length }; }, help: "How many living actors have the tag." });
  def("IsValid", { title: "Is Valid", cat: "Actor", in: [I("Actor", "actor", null)], out: [O("Valid", "bool")],
    eval: function (c) { var a = c.in("Actor"); return { Valid: !!(a && a.alive) }; }, help: "True if the actor exists and hasn't been destroyed." });
  def("GetName", { title: "Get Actor Name", cat: "Actor", in: [T()], out: [O("Name", "string")], eval: function (c) { var a = c.in("Target"); return { Name: a ? a.name : "" }; }, help: "The actor's name." });
  def("HasTag", { title: "Has Tag", cat: "Actor", in: [T(), I("Tag", "string", "player")], out: [O("Result", "bool")],
    eval: function (c) { var a = c.in("Target"); return { Result: !!(a && a.tags.indexOf(String(c.in("Tag")).toLowerCase()) >= 0) }; }, help: "True if the actor has the tag." });
  act("AddTag", "Add Tag", [T(), I("Tag", "string", "found")], function (c, a) { var t = String(c.in("Tag")).toLowerCase(); if (a && t && a.tags.indexOf(t) < 0) a.tags.push(t); }, "Gives the actor a tag.");
  act("RemoveTag", "Remove Tag", [T(), I("Tag", "string", "found")], function (c, a) { var t = String(c.in("Tag")).toLowerCase(); if (a) a.tags = a.tags.filter(function (x) { return x !== t; }); }, "Takes a tag away.");
  def("GetLocation", { title: "Get Actor Location", cat: "Actor", in: [T()], out: [O("Location", "vector")], eval: function (c) { var a = c.in("Target"); return { Location: a ? vcopy(a.pos) : V(0, 0, 0) }; }, help: "Where the actor is." });
  act("SetLocation", "Set Actor Location", [T(), I("Location", "vector", V(0, 1, 0)), I("Sweep", "bool", false)],
    function (c, a) { if (!a) return; var to = c.in("Location"); if (c.in("Sweep")) c.game.move(a, V(to.x - a.pos.x, to.y - a.pos.y, to.z - a.pos.z), true); else a.pos = vcopy(to); }, "Puts the actor somewhere. With Sweep it stops at solids on the way.");
  act("AddOffset", "Add Actor World Offset", [T(), I("Delta", "vector", V(0, 0, 0)), I("Sweep", "bool", true)],
    function (c, a) { if (a) c.game.move(a, c.in("Delta"), c.in("Sweep")); }, "Moves the actor by an amount. With Sweep it stops at solids.");
  def("GetRotation", { title: "Get Actor Rotation", cat: "Actor", in: [T()], out: [O("Rotation", "vector")], eval: function (c) { var a = c.in("Target"); return { Rotation: a ? vcopy(a.rot) : V(0, 0, 0) }; }, help: "The actor's turn in degrees (x tilt, y turn, z roll)." });
  act("SetRotation", "Set Actor Rotation", [T(), I("Rotation", "vector", V(0, 0, 0))], function (c, a) { if (a) a.rot = vcopy(c.in("Rotation")); }, "Sets the actor's turn in degrees.");
  act("AddRotation", "Add Actor Rotation", [T(), I("Delta", "vector", V(0, 90, 0))], function (c, a) { if (!a) return; var d = c.in("Delta"); a.rot = V((a.rot.x + d.x) % 360, (a.rot.y + d.y) % 360, (a.rot.z + d.z) % 360); }, "Turns the actor by an amount (multiply by Delta Seconds for a steady spin).");
  def("GetScale", { title: "Get Actor Scale", cat: "Actor", in: [T()], out: [O("Scale", "vector")], eval: function (c) { var a = c.in("Target"); return { Scale: a ? vcopy(a.scale) : V(1, 1, 1) }; }, help: "The actor's size." });
  act("SetScale", "Set Actor Scale", [T(), I("Scale", "vector", V(1, 1, 1))], function (c, a) { if (!a) return; var s = c.in("Scale"); a.scale = V(Math.max(0.01, s.x), Math.max(0.01, s.y), Math.max(0.01, s.z)); }, "Sets the actor's size.");
  def("GetForward", { title: "Get Forward Vector", cat: "Actor", in: [T()], out: [O("Forward", "vector")],
    eval: function (c) { var a = c.in("Target"), y = (a ? a.rot.y : 0) * Math.PI / 180; return { Forward: V(Math.sin(y), 0, Math.cos(y)) }; }, help: "The way the actor faces (from its Y turn)." });
  def("MoveToward", { title: "Move Toward", cat: "Actor", in: [X, T(), I("Destination", "vector", V(0, 1, 0)), I("Speed", "number", 3), I("Delta Seconds", "number", 0.016)], out: [THEN, O("Arrived", "bool")],
    run: function (c) {
      var a = c.in("Target"); if (!a || !a.alive) { c.out("Arrived", false); return "Then"; }
      var d = c.in("Destination"), x = d.x - a.pos.x, y = d.y - a.pos.y, z = d.z - a.pos.z, l = Math.sqrt(x * x + y * y + z * z), step = c.in("Speed") * c.in("Delta Seconds");
      if (l <= step || l < 1e-6) { c.game.move(a, V(x, y, z), true); c.out("Arrived", true); }
      else { c.game.move(a, V(x / l * step, y / l * step, z / l * step), true); c.out("Arrived", false); }
      return "Then";
    }, help: "Moves a step toward a place each time it runs (use it on Tick)." });
  act("LookAt", "Look At", [T(), I("Location", "vector", V(0, 0, 0))], function (c, a) { if (!a) return; var p = c.in("Location"); a.rot = V(a.rot.x, Math.atan2(p.x - a.pos.x, p.z - a.pos.z) * 180 / Math.PI, a.rot.z); }, "Turns the actor to face a place.");
  act("SetVisibility", "Set Visibility", [T(), I("Visible", "bool", false)], function (c, a) { if (a) a.visible = c.in("Visible"); }, "Shows or hides the actor (hidden actors still collide).");
  act("SetColor", "Set Color", [T(), I("Color", "color", "#ff4d4d")], function (c, a) { if (a) a.color = c.in("Color"); }, "Paints the actor.");
  act("SetSignText", "Set Sign Text", [T(), I("Text", "string", "Hello!")], function (c, a) { if (a) a.text = c.in("Text").slice(0, 120); }, "Changes the words on a Sign actor.");
  def("SpawnCopy", { title: "Spawn Actor From Template", cat: "Actor", in: [X, I("Template", "string", "Coin", { template: true }), I("Location", "vector", V(0, 1, 0))], out: [THEN, O("New Actor", "actor")],
    run: function (c) { c.out("New Actor", c.game.spawnCopy(c.in("Template"), c.in("Location"))); return "Then"; },
    help: "Makes a new copy of an actor in the level — with its Blueprint — at a place." });
  def("SpawnShape", { title: "Spawn Shape", cat: "Actor", in: [X, I("Location", "vector", V(0, 4, 0)), I("Scale", "vector", V(1, 1, 1)), I("Color", "color", "#f59e0b"), I("Tag", "string", "spawned")],
    settings: [S("shape", "select", SHAPES.slice(0, 6), "box", "Shape"), S("body", "select", BODIES, "dynamic", "Body")], out: [THEN, O("New Actor", "actor")],
    run: function (c) {
      c.out("New Actor", c.game.spawn({ name: c.setting("shape"), shape: c.setting("shape"), pos: c.in("Location"), scale: c.in("Scale"), color: c.in("Color"), tags: [c.in("Tag")], body: c.setting("body") }));
      return "Then";
    }, help: "Makes a new plain shape (no Blueprint)." });
  act("Destroy", "Destroy Actor", [T()], function (c, a) { if (a) c.game.destroy(a); }, "Removes the actor from the game.");

  /* ===== Physics ===== */
  function phys(type, title, ins, f, help, outs) { def(type, { title: title, cat: "Physics", in: [X].concat(ins), out: [THEN].concat(outs || []), run: function (c) { var a = c.in("Target"); f(c, a && a.alive ? a : null); return "Then"; }, help: help }); }
  phys("SetVelocity", "Set Velocity", [T(), I("Velocity", "vector", V(0, 0, 5))], function (c, a) { if (a) a.vel = vcopy(c.in("Velocity")); }, "Sets how fast and which way a dynamic actor moves.");
  def("GetVelocity", { title: "Get Velocity", cat: "Physics", in: [T()], out: [O("Velocity", "vector")], eval: function (c) { var a = c.in("Target"); return { Velocity: a ? vcopy(a.vel) : V(0, 0, 0) }; }, help: "How fast and which way the actor moves." });
  phys("AddImpulse", "Add Impulse", [T(), I("Impulse", "vector", V(0, 6, 0))], function (c, a) { if (!a) return; var i = c.in("Impulse"); a.vel = V(a.vel.x + i.x, a.vel.y + i.y, a.vel.z + i.z); }, "Gives a dynamic actor a sudden push.");
  def("Jump", { title: "Jump", cat: "Physics", in: [X, T(), I("Height", "number", 2)], out: [THEN, O("Jumped", "bool")],
    run: function (c) {
      var a = c.in("Target");
      if (a && a.alive && a.onGround) { a.vel.y = Math.sqrt(2 * Math.abs(c.game.world.gravity) * Math.max(0, c.in("Height"))); a.onGround = false; c.out("Jumped", true); }
      else c.out("Jumped", false);
      return "Then";
    }, help: "Jumps about Height units up — only when standing on something." });
  def("IsOnGround", { title: "Is On Ground", cat: "Physics", in: [T()], out: [O("On Ground", "bool")], eval: function (c) { var a = c.in("Target"); return { "On Ground": !!(a && a.onGround) }; }, help: "True while the actor stands on a solid." });
  phys("SetGravity", "Set Gravity Enabled", [T(), I("Enabled", "bool", true)], function (c, a) { if (a) a.gravity = c.in("Enabled"); }, "Turns falling on or off for a dynamic actor.");
  def("SetBody", { title: "Set Physics Body", cat: "Physics", in: [X, T()], settings: [S("body", "select", BODIES, "dynamic", "Body")], out: [THEN],
    run: function (c) { var a = c.in("Target"); if (a && a.alive) { a.body = c.setting("body"); if (a.body !== "dynamic") a.vel = V(0, 0, 0); } return "Then"; }, help: "Changes how an actor moves and collides." });
  phys("SetCollision", "Set Collision Enabled", [T(), I("Enabled", "bool", false)], function (c, a) { if (a) a.collide = c.in("Enabled"); }, "With collision off an actor never blocks or overlaps anything.");
  def("SetWorldGravity", { title: "Set World Gravity", cat: "Physics", in: [X, I("Gravity", "number", -20)], out: [THEN],
    run: function (c) { c.game.world.gravity = c.in("Gravity"); return "Then"; }, help: "How strongly everything falls (negative is down)." });
  def("IsOverlapping", { title: "Is Overlapping", cat: "Physics", in: [I("A", "actor", "self"), I("B", "actor", "Player")], out: [O("Result", "bool")],
    eval: function (c) { var a = c.in("A"), b = c.in("B"); return { Result: !!(a && b && a !== b && a.alive && b.alive && overlap(a, b)) }; }, help: "True if the two actors touch." });
  def("LineTrace", { title: "Line Trace", cat: "Physics", in: [I("Start", "vector", V(0, 1, 0)), I("End", "vector", V(0, 1, 10)), I("Ignore Self", "bool", true)],
    out: [O("Hit", "bool"), O("Hit Actor", "actor"), O("Hit Location", "vector"), O("Distance", "number")],
    eval: function (c) { var r = c.game.trace(c.in("Start"), c.in("End"), c.in("Ignore Self") ? c.self : null); return { Hit: !!r, "Hit Actor": r ? r.actor : null, "Hit Location": r ? r.point : c.in("End"), Distance: r ? r.dist : 0 }; },
    help: "Shoots an invisible line and reports the first actor it hits." });

  /* ===== Input ===== */
  def("IsKeyDown", { title: "Is Key Down", cat: "Input", settings: [S("key", "select", KEYS, "Space", "Key")], out: [O("Down", "bool")],
    eval: function (c) { return { Down: !!c.game.keys[c.setting("key")] }; }, help: "True while the key is held." });
  def("GetAxis", { title: "Get Axis", cat: "Input", settings: [S("axis", "select", ["Horizontal", "Vertical"], "Horizontal", "Axis")], out: [O("Value", "number")],
    eval: function (c) {
      var k = c.game.keys;
      var v = c.setting("axis") === "Vertical" ? (k.W || k.Up ? 1 : 0) - (k.S || k.Down ? 1 : 0) : (k.D || k.Right ? 1 : 0) - (k.A || k.Left ? 1 : 0);
      return { Value: v };
    }, help: "Horizontal: D/→ is 1, A/← is −1. Vertical: W/↑ is 1, S/↓ is −1. The on-screen pad works too." });

  /* ===== Camera ===== */
  def("SetCameraTarget", { title: "Set Camera Target", cat: "Camera", in: [X, T()], out: [THEN], run: function (c) { var a = c.in("Target"); c.game.camera.target = a ? a.id : null; return "Then"; }, help: "The camera follows this actor." });
  def("SetCameraMode", { title: "Set Camera Mode", cat: "Camera", in: [X], settings: [S("mode", "select", CAMERA_MODES, "follow", "Mode")], out: [THEN],
    run: function (c) { c.game.camera.mode = c.setting("mode"); return "Then"; }, help: "Follow (behind), top-down, side-on, or fixed." });
  def("SetCameraDistance", { title: "Set Camera Distance", cat: "Camera", in: [X, I("Distance", "number", 12)], out: [THEN],
    run: function (c) { c.game.camera.distance = clamp(c.in("Distance"), 2, 80); return "Then"; }, help: "How far back the camera sits." });
  def("CameraShake", { title: "Camera Shake", cat: "Camera", in: [X, I("Strength", "number", 0.4), I("Duration", "number", 0.4)], out: [THEN],
    run: function (c) { c.game.emit({ type: "shake", strength: c.in("Strength"), duration: c.in("Duration") }); return "Then"; }, help: "Shakes the view — for hits and explosions." });

  /* ===== HUD ===== */
  def("PrintString", { title: "Print String", cat: "HUD", in: [X, I("Text", "string", "Hello"), I("Duration", "number", 2), I("Color", "color", "#7dd3fc")], out: [THEN],
    run: function (c) { c.game.print(c.in("Text"), c.in("Duration"), c.in("Color")); return "Then"; }, help: "Shows a message in the corner for a moment — great for testing." });
  def("SetHudText", { title: "Set HUD Text", cat: "HUD", in: [X, I("Slot", "string", "Score"), I("Text", "string", "0")], out: [THEN],
    run: function (c) { c.game.hudText(c.in("Slot"), c.in("Text")); return "Then"; }, help: "Shows a labelled value on screen (Score: 3). Empty text removes it." });
  def("ShowMessage", { title: "Show Message", cat: "HUD", in: [X, I("Title", "string", "You win!"), I("Subtitle", "string", ""), I("Duration", "number", 3)], out: [THEN],
    run: function (c) { c.game.message(c.in("Title"), c.in("Subtitle"), c.in("Duration")); return "Then"; }, help: "A big title in the middle of the screen (Duration 0 keeps it up)." });
  def("SetProgressBar", { title: "Set Progress Bar", cat: "HUD", in: [X, I("Slot", "string", "Health"), I("Value", "number", 1), I("Color", "color", "#22c55e")], out: [THEN],
    run: function (c) { c.game.bar(c.in("Slot"), c.in("Value"), c.in("Color")); return "Then"; }, help: "A bar from 0 (empty) to 1 (full), for health, time or power." });

  /* ===== Audio & Effects ===== */
  def("PlaySound", { title: "Play Sound", cat: "Audio & Effects", in: [X], settings: [S("sound", "select", SOUNDS, "coin", "Sound")], out: [THEN],
    run: function (c) { c.game.emit({ type: "sound", sound: c.setting("sound") }); return "Then"; }, help: "Plays a game sound." });
  def("PlayNote", { title: "Play Note", cat: "Audio & Effects", in: [X, I("Pitch", "number", 0), I("Length", "number", 0.3)], out: [THEN],
    run: function (c) { c.game.emit({ type: "note", pitch: clamp(Math.round(c.in("Pitch")), -24, 24), length: clamp(c.in("Length"), 0.05, 4) }); return "Then"; },
    help: "Plays a musical note: 0 is middle C, each step is one semitone." });
  def("SpawnParticles", { title: "Spawn Particles", cat: "Audio & Effects", in: [X, I("Location", "vector", V(0, 1, 0))], settings: [S("effect", "select", PARTICLES, "sparkle", "Effect")], out: [THEN],
    run: function (c) { c.game.emit({ type: "particles", effect: c.setting("effect"), at: vcopy(c.in("Location")) }); return "Then"; }, help: "A burst of sparkles, smoke, fire, confetti or an explosion." });
  def("SetSkyColor", { title: "Set Sky Color", cat: "Audio & Effects", in: [X, I("Color", "color", "#1e1b4b")], out: [THEN],
    run: function (c) { c.game.world.sky = c.in("Color"); return "Then"; }, help: "Changes the sky." });

  /* ===== Game ===== */
  def("GameTime", { title: "Get Game Time", cat: "Game", out: [O("Seconds", "number")], eval: function (c) { return { Seconds: c.game.time }; }, help: "Seconds since the game started (stops while paused)." });
  def("PauseGame", { title: "Set Game Paused", cat: "Game", in: [X, I("Paused", "bool", true)], out: [THEN],
    run: function (c) { c.game.paused = c.in("Paused"); return "Then"; }, help: "Freezes ticks, movement and timers. Keys and clicks still work, so they can unpause." });
  def("IsPaused", { title: "Is Game Paused", cat: "Game", out: [O("Paused", "bool")], eval: function (c) { return { Paused: c.game.paused }; }, help: "True while paused." });
  def("RestartGame", { title: "Restart Game", cat: "Game", in: [X], out: [], run: function (c) { c.game.request = "restart"; c.game.halt(); return null; }, help: "Starts the game over from the beginning." });
  def("QuitGame", { title: "Quit Game", cat: "Game", in: [X], out: [], run: function (c) { c.game.request = "quit"; c.game.halt(); return null; }, help: "Stops playing and goes back to the editor." });

  /* ---------- collision geometry ---------- */
  var HALF = { box: [0.5, 0.5, 0.5], sphere: [0.5, 0.5, 0.5], cylinder: [0.5, 0.5, 0.5], cone: [0.5, 0.5, 0.5], capsule: [0.5, 0.5, 0.5], torus: [0.5, 0.15, 0.5], sign: [0.5, 0.5, 0.05] };
  function half(a) { var h = HALF[a.shape] || HALF.box; return [h[0] * Math.abs(a.scale.x), h[1] * Math.abs(a.scale.y), h[2] * Math.abs(a.scale.z)]; }
  function overlap(a, b) {
    var ha = half(a), hb = half(b);
    return Math.abs(a.pos.x - b.pos.x) < ha[0] + hb[0] && Math.abs(a.pos.y - b.pos.y) < ha[1] + hb[1] && Math.abs(a.pos.z - b.pos.z) < ha[2] + hb[2];
  }

  /* ---------- projects ---------- */
  var DEFAULT_WORLD = { sky: "#8ec5ff", gravity: -20, camera: "follow", distance: 12, fog: false, light: 1 };
  function cleanVec(v, d) { return isVec(v) ? V(v.x, v.y, v.z) : Array.isArray(v) ? V(v[0], v[1], v[2]) : vcopy(d); }
  function cleanGraph(g) {
    var out = { nodes: [], links: [] }, ids = {};
    if (!g || typeof g !== "object") return out;
    (Array.isArray(g.nodes) ? g.nodes : []).forEach(function (n) {
      if (!n || typeof n.id !== "string" || !NODES[n.type] || ids[n.id]) return;
      ids[n.id] = 1;
      out.nodes.push({ id: n.id, type: n.type, x: +n.x || 0, y: +n.y || 0, data: n.data && typeof n.data === "object" ? JSON.parse(JSON.stringify(n.data)) : {} });
    });
    var byId = {};
    out.nodes.forEach(function (n) { byId[n.id] = n; });
    (Array.isArray(g.links) ? g.links : []).forEach(function (l) {
      if (!l || !l.from || !l.to || !byId[l.from.node] || !byId[l.to.node]) return;
      if (canLink(byId[l.from.node], l.from.pin, byId[l.to.node], l.to.pin)) out.links.push({ from: { node: l.from.node, pin: l.from.pin }, to: { node: l.to.node, pin: l.to.pin } });
    });
    // one source per data input, one target per exec output
    var seen = {};
    out.links = out.links.filter(function (l) {
      var fromType = pinOf(byId[l.from.node], l.from.pin, "out").type;
      var key = fromType === "exec" ? "o:" + l.from.node + ":" + l.from.pin : "i:" + l.to.node + ":" + l.to.pin;
      if (seen[key]) return false;
      seen[key] = 1; return true;
    });
    return out;
  }
  function cleanProject(p) {
    p = p && typeof p === "object" ? p : {};
    var world = {};
    var w = p.world && typeof p.world === "object" ? p.world : {};
    for (var k in DEFAULT_WORLD) world[k] = w[k] !== undefined && typeof w[k] === typeof DEFAULT_WORLD[k] ? w[k] : DEFAULT_WORLD[k];
    if (!isColor(world.sky)) world.sky = DEFAULT_WORLD.sky;
    if (CAMERA_MODES.indexOf(world.camera) < 0) world.camera = "follow";
    world.light = Math.max(0.2, Math.min(2, isFinite(world.light) ? world.light : 1));
    var vars = [], vnames = {};
    (Array.isArray(p.variables) ? p.variables : []).forEach(function (v) {
      if (!v || typeof v.name !== "string" || !/^[A-Za-z_][A-Za-z0-9_ ]{0,30}$/.test(v.name) || vnames[v.name]) return;
      var type = VAR_TYPES.indexOf(v.type) >= 0 ? v.type : "number";
      vnames[v.name] = 1;
      vars.push({ name: v.name, type: type, value: type === "actor" ? null : coerce(v.value, type) });
    });
    var actors = [], aids = {};
    (Array.isArray(p.actors) ? p.actors : []).forEach(function (a) {
      if (!a || typeof a.id !== "string" || aids[a.id]) return;
      aids[a.id] = 1;
      actors.push({
        id: a.id, name: typeof a.name === "string" && a.name.trim() ? a.name.trim().slice(0, 40) : "Actor",
        shape: SHAPES.indexOf(a.shape) >= 0 ? a.shape : "box",
        pos: cleanVec(a.pos, V(0, 0.5, 0)), rot: cleanVec(a.rot, V(0, 0, 0)), scale: cleanVec(a.scale, V(1, 1, 1)),
        color: isColor(a.color) ? a.color.toLowerCase() : "#9ca3af",
        tags: (Array.isArray(a.tags) ? a.tags : []).map(function (t) { return String(t).toLowerCase().trim().slice(0, 30); }).filter(Boolean),
        visible: a.visible !== false, body: BODIES.indexOf(a.body) >= 0 ? a.body : "none",
        gravity: a.gravity !== false, collide: a.collide !== false, text: typeof a.text === "string" ? a.text.slice(0, 120) : "",
        graph: cleanGraph(a.graph)
      });
    });
    return {
      version: VERSION, name: typeof p.name === "string" && p.name.trim() ? p.name.trim().slice(0, 60) : "My Game",
      world: world, variables: vars, level: cleanGraph(p.level), actors: actors,
      next: Math.max(1, Math.floor(+p.next || 1))
    };
  }
  function pinOf(node, name, side) {
    var d = NODES[node.type];
    var list = side === "in" ? d.in : d.out;
    for (var i = 0; i < list.length; i++) if (list[i].name === name) return list[i];
    return null;
  }
  /* Which data types may feed which: the same type; anything into Text
     or Any; numbers and booleans into each other; Any into anything. */
  function compatible(from, to) {
    if (from === "exec" || to === "exec") return from === to;
    if (from === to || to === "any" || from === "any" || to === "string") return true;
    if ((from === "number" && to === "bool") || (from === "bool" && to === "number")) return true;
    if (from === "string" && to === "color") return true;
    return false;
  }
  function canLink(fromNode, fromPin, toNode, toPin) {
    if (!fromNode || !toNode || fromNode === toNode) return false;
    var a = pinOf(fromNode, fromPin, "out"), b = pinOf(toNode, toPin, "in");
    return !!(a && b && compatible(a.type, b.type));
  }
  /* A variable's type decides its Get/Set pins (shown in the editor). */
  function pinType(project, node, name, side) {
    var p = pinOf(node, name, side);
    if (!p) return null;
    if ((node.type === "GetVar" || node.type === "SetVar") && p.type === "any") {
      var v = (project.variables || []).filter(function (x) { return x.name === (node.data || {}).var; })[0];
      return v ? v.type : "any";
    }
    return p.type;
  }

  /* ---------- a running game ---------- */
  function Game(project, opts) {
    opts = opts || {};
    this.project = cleanProject(project);
    this.world = JSON.parse(JSON.stringify(this.project.world));
    this.random = mulberry(opts.seed !== undefined ? opts.seed : (Date.now() & 0x7fffffff));
    this.storage = opts.storage || { _m: {}, get: function (k) { return this._m[k]; }, set: function (k, v) { this._m[k] = v; } };
    this.time = 0; this.frame = 0; this.depth = 0; this.paused = false; this.ended = false; this.error = null; this.request = null;
    this.keys = {}; this.queue = []; this.events = []; this.timers = []; this.waits = [];
    this.vars = {};
    var self = this;
    this.project.variables.forEach(function (v) { self.vars[v.name] = { type: v.type, value: v.value === null ? null : JSON.parse(JSON.stringify(v.value)) }; });
    this.hud = { slots: {}, bars: {}, prints: [], message: null };
    this.camera = { mode: this.world.camera, distance: this.world.distance, target: null };
    this.actors = []; this.nextId = 1; this.insts = {};
    this.overlaps = {}; this.contacts = {}; this.newContacts = {};
    this.templates = {};
    this.project.actors.forEach(function (a) { self.templates[a.name.toLowerCase()] = a; });
    this.level = this.makeInst(this.project.level, null);
    var spawned = this.project.actors.map(function (a) { return self.spawnFrom(a, a.pos, true); });
    var player = this.byName("Player") || this.withTag("player")[0];
    if (player) this.camera.target = player.id;
    this.started = false;
    this._spawned = spawned;
  }
  var G = Game.prototype;
  G.start = function () {
    if (this.started) return;
    this.started = true;
    this.safely(function () {
      this.fire(this.level, "BeginPlay");
      var self = this;
      this._spawned.forEach(function (a) { if (a.alive) self.fire(self.insts[a.id], "BeginPlay"); });
    });
  };
  G.makeInst = function (graph, actor) {
    var inst = { graph: graph, actor: actor, nodes: {}, execOut: {}, dataIn: {}, mem: {}, events: {} };
    graph.nodes.forEach(function (n) {
      inst.nodes[n.id] = n;
      var d = NODES[n.type];
      if (d.kind === "event") (inst.events[n.type] = inst.events[n.type] || []).push(n);
    });
    graph.links.forEach(function (l) {
      var from = inst.nodes[l.from.node], p = pinOf(from, l.from.pin, "out");
      if (p.type === "exec") inst.execOut[l.from.node + ":" + l.from.pin] = l.to;
      else inst.dataIn[l.to.node + ":" + l.to.pin] = l.from;
    });
    return inst;
  };
  G.spawnFrom = function (tpl, at, initial) {
    if (this.actors.length >= MAX_ACTORS) { this.print("Too many actors (" + MAX_ACTORS + ") — some weren't spawned.", 3, "#fca5a5"); return null; }
    var a = {
      __actor: true, id: "a" + (this.nextId++), name: tpl.name, shape: tpl.shape, pos: vcopy(at || tpl.pos), rot: vcopy(tpl.rot), scale: vcopy(tpl.scale),
      color: tpl.color, tags: tpl.tags.slice(), visible: tpl.visible, body: tpl.body, gravity: tpl.gravity, collide: tpl.collide,
      text: tpl.text, vel: V(0, 0, 0), onGround: false, alive: true, template: tpl.id || null
    };
    this.actors.push(a);
    this.insts[a.id] = this.makeInst(tpl.graph || { nodes: [], links: [] }, a);
    if (!initial && this.started) this.fire(this.insts[a.id], "BeginPlay");
    return a;
  };
  G.spawn = function (spec) {
    return this.spawnFrom({
      name: String(spec.name || "Shape"), shape: SHAPES.indexOf(spec.shape) >= 0 ? spec.shape : "box", pos: spec.pos, rot: V(0, 0, 0),
      scale: isVec(spec.scale) ? spec.scale : V(1, 1, 1), color: isColor(spec.color) ? spec.color : "#f59e0b",
      tags: (spec.tags || []).map(function (t) { return String(t).toLowerCase(); }).filter(Boolean), visible: true,
      body: BODIES.indexOf(spec.body) >= 0 ? spec.body : "dynamic", gravity: true, collide: true, text: "", graph: null
    }, spec.pos);
  };
  G.spawnCopy = function (name, at) {
    var tpl = this.templates[String(name).toLowerCase()];
    if (!tpl) { this.print("No actor named \"" + name + "\" to copy.", 3, "#fca5a5"); return null; }
    return this.spawnFrom(tpl, at);
  };
  G.destroy = function (a) {
    if (!a || !a.alive || a.dying) return;
    a.dying = true;
    this.fire(this.insts[a.id], "Destroyed");
    a.alive = false;
    this.emit({ type: "destroyed", id: a.id });
  };
  G.instOf = function (a) { return a ? this.insts[a.id] : null; };
  G.byName = function (name) {
    name = String(name).toLowerCase();
    for (var i = 0; i < this.actors.length; i++) if (this.actors[i].alive && this.actors[i].name.toLowerCase() === name) return this.actors[i];
    return null;
  };
  G.withTag = function (tag) {
    tag = String(tag).toLowerCase();
    return this.actors.filter(function (a) { return a.alive && a.tags.indexOf(tag) >= 0; });
  };
  G.getVar = function (name) { var v = this.vars[name]; return v ? v.value : 0; };
  G.setVar = function (name, value) {
    var v = this.vars[name];
    if (!v) return value;
    v.value = v.type === "actor" ? (value && value.__actor ? value : null) : coerce(value, v.type);
    if (isVec(v.value)) v.value = vcopy(v.value);
    return v.value;
  };
  G.save = function (key, value) { try { this.storage.set(String(key), JSON.parse(JSON.stringify(value === undefined ? null : value))); } catch (e) {} };
  G.load = function (key) { try { return this.storage.get(String(key)); } catch (e) { return undefined; } };
  G.emit = function (ev) { this.events.push(ev); };
  G.drain = function () { var e = this.events; this.events = []; return e; };
  G.print = function (text, secs, color) { this.hud.prints.push({ text: toText(text), until: this.time + Math.max(0.2, +secs || 2), color: isColor(color) ? color : "#7dd3fc" }); if (this.hud.prints.length > 8) this.hud.prints.shift(); };
  G.hudText = function (slot, text) { slot = toText(slot).slice(0, 24); if (text === "" || text === null) delete this.hud.slots[slot]; else this.hud.slots[slot] = toText(text).slice(0, 80); };
  G.bar = function (slot, value, color) { this.hud.bars[toText(slot).slice(0, 24)] = { value: clamp(+value || 0, 0, 1), color: isColor(color) ? color : "#22c55e" }; };
  G.message = function (title, sub, secs) { this.hud.message = { title: toText(title).slice(0, 60), sub: toText(sub).slice(0, 120), until: +secs > 0 ? this.time + +secs : Infinity }; };
  G.fail = function (msg) { if (!this.error) { this.error = msg; this.print(msg, 6, "#fca5a5"); } this.halt(); };
  G.halt = function () { this.ended = true; };

  /* Movement: axis by axis, so an actor slides along walls and lands on
     floors; small steps so fast movers don't pass through thin solids. */
  G.move = function (a, d, sweep) {
    if (!d) return;
    if (!sweep || !a.collide || a.body === "solid") { a.pos = V(a.pos.x + d.x, a.pos.y + d.y, a.pos.z + d.z); return; }
    var h = half(a), smallest = Math.max(0.05, Math.min(h[0], h[1], h[2]) * 0.9);
    var steps = Math.min(16, Math.max(1, Math.ceil(Math.max(Math.abs(d.x), Math.abs(d.y), Math.abs(d.z)) / smallest)));
    for (var s = 0; s < steps; s++) {
      this.axis(a, "y", d.y / steps);
      this.axis(a, "x", d.x / steps);
      this.axis(a, "z", d.z / steps);
    }
  };
  var AX = { x: 0, y: 1, z: 2 };
  G.axis = function (a, ax, amount) {
    if (!amount) return;
    a.pos[ax] += amount;
    var ha = half(a);
    for (var i = 0; i < this.actors.length; i++) {
      var b = this.actors[i];
      if (b === a || !b.alive || b.body !== "solid" || !b.collide || !overlap(a, b)) continue;
      var hb = half(b), k = AX[ax];
      if (amount > 0) a.pos[ax] = b.pos[ax] - hb[k] - ha[k] - 1e-4;
      else a.pos[ax] = b.pos[ax] + hb[k] + ha[k] + 1e-4;
      if (ax === "y" && amount < 0) a.onGround = true;
      if (a.body === "dynamic" && ((amount > 0 && a.vel[ax] > 0) || (amount < 0 && a.vel[ax] < 0))) a.vel[ax] = 0;
      var key = a.id < b.id ? a.id + "|" + b.id : b.id + "|" + a.id;
      this.newContacts[key] = [a, b];
    }
  };
  G.trace = function (from, to, ignore) {
    var dx = to.x - from.x, dy = to.y - from.y, dz = to.z - from.z, best = null;
    var len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (!len) return null;
    for (var i = 0; i < this.actors.length; i++) {
      var a = this.actors[i];
      if (!a.alive || !a.collide || a === ignore) continue;
      var h = half(a), tmin = 0, tmax = 1, ok = true, o = [from.x, from.y, from.z], dd = [dx, dy, dz], c = [a.pos.x, a.pos.y, a.pos.z];
      for (var k = 0; k < 3 && ok; k++) {
        var lo = c[k] - h[k], hi = c[k] + h[k];
        if (Math.abs(dd[k]) < 1e-9) { if (o[k] < lo || o[k] > hi) ok = false; }
        else {
          var t1 = (lo - o[k]) / dd[k], t2 = (hi - o[k]) / dd[k];
          if (t1 > t2) { var tt = t1; t1 = t2; t2 = tt; }
          tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
          if (tmin > tmax) ok = false;
        }
      }
      if (ok && (!best || tmin < best.t)) best = { t: tmin, actor: a };
    }
    if (!best) return null;
    return { actor: best.actor, point: V(from.x + dx * best.t, from.y + dy * best.t, from.z + dz * best.t), dist: len * best.t };
  };

  /* ---------- running Blueprints ---------- */
  G.safely = function (fn) {
    try { fn.call(this); }
    catch (e) { this.fail("Something in a Blueprint went wrong: " + (e && e.message ? e.message : e)); }
  };
  G.fire = function (inst, type, match, outs) {
    if (!inst || this.ended) return;
    var list = inst.events[type];
    if (!list) return;
    if (this.depth > 120) { this.fail("Events keep calling each other in a circle (" + type + "), so the game stopped."); return; }
    this.depth = (this.depth || 0) + 1;
    try {
      for (var i = 0; i < list.length; i++) {
        var n = list[i];
        if (match && !match(n)) continue;
        var m = this.memOf(inst, n.id);
        if (outs) for (var k in outs) m.out[k] = outs[k];
        this.run(inst, n.id, "Then");
        if (this.ended) return;
      }
    } finally { this.depth--; }
  };
  G.callEvent = function (inst, name) {
    name = String(name);
    this.fire(inst, "CustomEvent", function (n) { return String((n.data || {}).name || "") === name; });
  };
  G.broadcast = function (name) {
    this.callEvent(this.level, name);
    for (var i = 0; i < this.actors.length; i++) if (this.actors[i].alive) this.callEvent(this.insts[this.actors[i].id], name);
  };
  G.setTimer = function (inst, name, time, loop) {
    this.clearTimer(inst, name);
    this.timers.push({ inst: inst, name: String(name), every: Math.max(0.01, +time || 0), loop: !!loop, at: this.time + Math.max(0.01, +time || 0) });
  };
  G.clearTimer = function (inst, name) { this.timers = this.timers.filter(function (t) { return !(t.inst === inst && t.name === String(name)); }); };
  G.memOf = function (inst, id) { return inst.mem[id] || (inst.mem[id] = { out: {} }); };
  G.run = function (inst, nodeId, pin) {
    var link = inst.execOut[nodeId + ":" + pin];
    while (link && !this.ended) {
      if (++this.steps > MAX_STEPS) { this.fail("More than " + MAX_STEPS.toLocaleString() + " nodes ran in one frame — is there a loop that never ends?"); return; }
      var node = inst.nodes[link.node], d = NODES[node.type];
      var next = d.run(this.ctx(inst, node), link.pin);
      if (!next) return;
      link = inst.execOut[node.id + ":" + next];
    }
  };
  G.ctx = function (inst, node) {
    var game = this, m = this.memOf(inst, node.id);
    return {
      game: game, inst: inst, node: node, self: inst.actor, mem: m,
      in: function (name) { return game.pull(inst, node, name, 0); },
      out: function (name, v) { m.out[name] = v; },
      setting: function (name) {
        var d = NODES[node.type], s = d.settings.filter(function (x) { return x.name === name; })[0];
        var v = node.data && node.data[name];
        return v === undefined || v === null || v === "" ? (s ? s.def : undefined) : v;
      },
      fire: function (pin) { game.run(inst, node.id, pin); },
      stopped: function () { return game.ended; },
      later: function (secs, pin, done, restart) {
        if (restart) game.waits = game.waits.filter(function (w) { return !(w.inst === inst && w.node === node.id); });
        game.waits.push({ inst: inst, node: node.id, pin: pin, at: game.time + Math.max(0, +secs || 0), done: done });
      }
    };
  };
  G.pull = function (inst, node, name, depth) {
    var d = NODES[node.type], p = null;
    for (var i = 0; i < d.in.length; i++) if (d.in[i].name === name) p = d.in[i];
    if (!p) return undefined;
    var src = inst.dataIn[node.id + ":" + name], v;
    if (src) {
      var sn = inst.nodes[src.node], sd = NODES[sn.type];
      if (sd.kind === "pure") {
        if (depth > 60) { this.fail("Some nodes feed each other in a circle."); return coerce(undefined, p.type); }
        var game = this, ctx = this.ctx(inst, sn);
        ctx.in = function (n) { return game.pull(inst, sn, n, depth + 1); };
        v = sd.eval(ctx)[src.pin];
      } else v = this.memOf(inst, sn.id).out[src.pin];
      if (v === undefined) v = p.def;
    } else {
      var given = node.data && node.data.in ? node.data.in[name] : undefined;
      v = given !== undefined ? given : p.def;
    }
    if (p.type === "actor") {
      if (v === "self" || v === undefined || v === null || v === "") return v === "self" || v === undefined ? inst.actor : null;
      if (typeof v === "string") return this.byName(v);
      return v && v.__actor ? v : null;
    }
    if (p.type === "vector" && Array.isArray(v)) v = V(v[0], v[1], v[2]);
    if (p.type === "any" && Array.isArray(v)) v = V(v[0], v[1], v[2]);
    return p.type === "any" ? v : coerce(v, p.type);
  };

  /* ---------- the frame ---------- */
  G.keyDown = function (k) { if (!this.keys[k]) { this.keys[k] = true; this.queue.push(["down", k]); } };
  G.keyUp = function (k) { if (this.keys[k]) { this.keys[k] = false; this.queue.push(["up", k]); } };
  G.click = function (id) { this.queue.push(["click", id]); };
  G.everyInst = function (fn) {
    fn.call(this, this.level);
    var list = this.actors.slice();
    for (var i = 0; i < list.length && !this.ended; i++) if (list[i].alive) fn.call(this, this.insts[list[i].id]);
  };
  G.tick = function (dt) {
    if (this.ended) return;
    if (!this.started) this.start();
    dt = clamp(+dt || 0, 0, 0.1);
    this.steps = 0;
    this.frame++;
    this.safely(function () {
      var q = this.queue; this.queue = [];
      for (var i = 0; i < q.length && !this.ended; i++) {
        var e = q[i];
        if (e[0] === "click") {
          var a = null;
          for (var j = 0; j < this.actors.length; j++) if (this.actors[j].id === e[1] && this.actors[j].alive) a = this.actors[j];
          if (!a) continue;
          this.fire(this.insts[a.id], "Clicked");
          this.everyInst(function (inst) { this.fire(inst, "AnyClicked", null, { Actor: a }); });
        } else {
          var type = e[0] === "down" ? "KeyPressed" : "KeyReleased", key = e[1];
          this.everyInst(function (inst) { this.fire(inst, type, function (n) { return ((n.data || {}).key || "Space") === key; }); });
        }
      }
      if (this.paused || this.ended) return;
      this.time += dt;
      // timers and delays that are due
      var due = this.timers.filter(function (t) { return t.at <= this.time; }, this);
      for (i = 0; i < due.length && !this.ended; i++) {
        var t = due[i];
        if (t.inst.actor && !t.inst.actor.alive) { this.clearTimer(t.inst, t.name); continue; }
        if (t.loop) t.at += t.every; else this.timers.splice(this.timers.indexOf(t), 1);
        this.callEvent(t.inst, t.name);
      }
      var waits = this.waits.filter(function (w) { return w.at <= this.time; }, this);
      this.waits = this.waits.filter(function (w) { return w.at > this.time; }, this);
      for (i = 0; i < waits.length && !this.ended; i++) {
        var w = waits[i];
        if (w.done) w.done();
        if (w.inst.actor && !w.inst.actor.alive) continue;
        this.run(w.inst, w.node, w.pin);
      }
      // Tick
      this.everyInst(function (inst) { this.fire(inst, "Tick", null, { "Delta Seconds": dt }); });
      if (this.ended) return;
      // physics
      var g = this.world.gravity;
      for (i = 0; i < this.actors.length; i++) {
        var b = this.actors[i];
        if (!b.alive || b.body !== "dynamic") continue;
        if (b.gravity) b.vel.y = Math.max(-60, b.vel.y + g * dt);
        b.onGround = false;
        this.move(b, V(b.vel.x * dt, b.vel.y * dt, b.vel.z * dt), true);
      }
      // hits (new contacts only)
      for (var key in this.newContacts) {
        if (this.contacts[key]) continue;
        var pair = this.newContacts[key];
        this.fire(this.insts[pair[0].id], "Hit", null, { "Other Actor": pair[1] });
        this.fire(this.insts[pair[1].id], "Hit", null, { "Other Actor": pair[0] });
      }
      this.contacts = this.newContacts; this.newContacts = {};
      // overlaps
      var now = {}, live = this.actors.filter(function (x) { return x.alive && x.collide; });
      for (i = 0; i < live.length; i++) for (j = i + 1; j < live.length; j++) {
        var A = live[i], B = live[j];
        if (A.body === "solid" && B.body === "solid") continue;
        if (overlap(A, B)) now[A.id + "|" + B.id] = [A, B];
      }
      for (key in now) if (!this.overlaps[key]) {
        this.fire(this.insts[now[key][0].id], "OverlapBegin", null, { "Other Actor": now[key][1] });
        this.fire(this.insts[now[key][1].id], "OverlapBegin", null, { "Other Actor": now[key][0] });
      }
      for (key in this.overlaps) if (!now[key]) {
        var o = this.overlaps[key];
        if (o[0].alive) this.fire(this.insts[o[0].id], "OverlapEnd", null, { "Other Actor": o[1] });
        if (o[1].alive) this.fire(this.insts[o[1].id], "OverlapEnd", null, { "Other Actor": o[0] });
      }
      this.overlaps = now;
    });
    // tidy
    this.actors = this.actors.filter(function (x) { return x.alive; });
    var tnow = this.time;
    this.hud.prints = this.hud.prints.filter(function (p) { return p.until > tnow; });
    if (this.hud.message && this.hud.message.until <= tnow) this.hud.message = null;
  };

  /* ---------- building Blueprints in code (samples and tests) ---------- */
  function Builder(graph, counter) {
    this.g = graph; this.counter = counter || { n: 1 };
  }
  Builder.prototype.node = function (type, x, y, data) {
    if (!NODES[type]) throw new Error("Unknown node " + type);
    var id = "n" + (this.counter.n++);
    this.g.nodes.push({ id: id, type: type, x: x || 0, y: y || 0, data: data || {} });
    return id;
  };
  Builder.prototype.link = function (a, ap, b, bp) { this.g.links.push({ from: { node: a, pin: ap }, to: { node: b, pin: bp } }); return this; };
  /* chain(a, b, c…): a.Then → b.In → b.Then → c.In … (or [id, outPin] / [id, outPin, inPin]) */
  Builder.prototype.chain = function () {
    for (var i = 0; i + 1 < arguments.length; i++) {
      var a = arguments[i], b = arguments[i + 1];
      var aid = Array.isArray(a) ? a[0] : a, apin = Array.isArray(a) ? a[1] : "Then";
      var bid = Array.isArray(b) ? b[0] : b, bpin = Array.isArray(b) && b[2] ? b[2] : "In";
      this.link(aid, apin, bid, bpin);
    }
    return this;
  };

  /* ---------- tidy layout ----------
     Lays a graph out left to right along its wires, the way Blueprints
     read: each node sits one column right of everything that feeds it,
     a value node sits just left of the first node that uses it, and
     nodes line up with what feeds them. Unconnected groups stack
     downwards in the order they were. size(node) gives {w, h} in graph
     pixels (the editor measures the drawn nodes). Moves nodes in place. */
  function tidy(g, size, opts) {
    opts = opts || {};
    var GX = opts.gapX || 70, GY = opts.gapY || 26, GROUP = opts.gapGroup || 60, LEFT = opts.left || 40, TOP = opts.top || 40;
    var byId = {}, ins = {}, outs = {}, dim = {};
    g.nodes.forEach(function (n) { byId[n.id] = n; ins[n.id] = []; outs[n.id] = []; var d = size(n) || {}; dim[n.id] = { w: d.w || 170, h: d.h || 60 }; });
    g.links.forEach(function (l) {
      if (!byId[l.from.node] || !byId[l.to.node] || l.from.node === l.to.node) return;
      ins[l.to.node].push(l.from.node); outs[l.from.node].push(l.to.node);
    });
    // a depth-first order that ignores wires looping back, then the
    // longest path from the left gives each node its column
    var order = [], state = {};
    function visit(root) {
      // iterative, so a very long imported graph can't overflow the stack
      var stack = [[root, 0]];
      state[root] = 1;
      while (stack.length) {
        var top = stack[stack.length - 1], kids = outs[top[0]];
        if (top[1] < kids.length) {
          var o = kids[top[1]++];
          if (!state[o]) { state[o] = 1; stack.push([o, 0]); }
        } else { stack.pop(); state[top[0]] = 2; order.push(top[0]); }
      }
    }
    var start = g.nodes.slice().sort(function (a, b) { return a.y - b.y || a.x - b.x; });
    start.forEach(function (n) { if (!ins[n.id].length && !state[n.id]) visit(n.id); });
    start.forEach(function (n) { if (!state[n.id]) visit(n.id); });
    order.reverse();
    var pos = {}, rank = {};
    order.forEach(function (id, i) { pos[id] = i; });
    function fwd(a, b) { return pos[a] < pos[b]; }
    order.forEach(function (id) {
      rank[id] = 0;
      ins[id].forEach(function (p) { if (fwd(p, id)) rank[id] = Math.max(rank[id], rank[p] + 1); });
    });
    for (var i = order.length - 1; i >= 0; i--) {
      var id = order[i], n = byId[id];
      if (!NODES[n.type] || NODES[n.type].kind !== "pure") continue;
      var next = outs[id].filter(function (o) { return fwd(id, o); }).map(function (o) { return rank[o] - 1; });
      if (next.length) rank[id] = Math.max(rank[id], Math.min.apply(null, next));
    }
    // groups of nodes joined by wires
    var group = {};
    function mark(root, k) {
      var stack = [root];
      group[root] = k;
      while (stack.length) {
        var id = stack.pop();
        ins[id].concat(outs[id]).forEach(function (o) { if (group[o] === undefined) { group[o] = k; stack.push(o); } });
      }
    }
    var groups = [];
    start.forEach(function (n) { if (group[n.id] === undefined) { mark(n.id, groups.length); groups.push([]); } groups[group[n.id]].push(n); });
    var top = TOP;
    groups.forEach(function (members) {
      var cols = [];
      members.forEach(function (n) { (cols[rank[n.id]] = cols[rank[n.id]] || []).push(n); });
      var x = LEFT, bottom = top;
      cols.forEach(function (col) {
        if (!col) return;
        var w = 0;
        col.forEach(function (n) {
          var feeds = ins[n.id].filter(function (p) { return rank[p] < rank[n.id] && group[p] === group[n.id]; });
          n._want = feeds.length ? feeds.reduce(function (s, p) { return s + byId[p].y; }, 0) / feeds.length : NaN;
          w = Math.max(w, dim[n.id].w);
        });
        col.sort(function (a, b) {
          var ka = isNaN(a._want) ? Infinity : a._want, kb = isNaN(b._want) ? Infinity : b._want;
          return ka - kb || a.y - b.y || a.x - b.x;
        });
        var y = top;
        col.forEach(function (n) {
          var want = isNaN(n._want) ? y : Math.max(y, n._want);
          n.x = Math.round(x); n.y = Math.round(want);
          y = want + dim[n.id].h + GY;
          bottom = Math.max(bottom, y - GY);
          delete n._want;
        });
        x += w + GX;
      });
      top = bottom + GROUP;
    });
    return g;
  }

  return {
    VERSION: VERSION, TYPES: TYPES, NODES: NODES, CATEGORIES: CATEGORIES, SHAPES: SHAPES, BODIES: BODIES, VAR_TYPES: VAR_TYPES, KEYS: KEYS,
    SOUNDS: SOUNDS, PARTICLES: PARTICLES, CAMERA_MODES: CAMERA_MODES, DEFAULT_WORLD: DEFAULT_WORLD,
    Game: Game, Builder: Builder, cleanProject: cleanProject, cleanGraph: cleanGraph, canLink: canLink, compatible: compatible,
    pinOf: pinOf, pinType: pinType, toText: toText, coerce: coerce, V: V, half: half, tidy: tidy
  };
});
