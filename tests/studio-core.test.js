// Code Block Studio's engine, with no browser: every node's definition,
// the flow-control nodes, the maths, movement and collisions, and the
// starter games played with simulated keys and clicks.
"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const S = require("../js/studio-core.js");
const SAMPLES = require("../js/studio-samples.js");
const V = S.V;

/* A one-actor project; build(b, ids) adds nodes to the actor's Blueprint. */
function project(build, opts = {}) {
  const p = { name: "t", variables: opts.variables || [{ name: "Out", type: opts.outType || "any", value: 0 }], actors: [], level: { nodes: [], links: [] } };
  if (opts.ground !== false) p.actors.push({ id: "g", name: "Ground", shape: "box", pos: V(0, -0.5, 0), scale: V(20, 1, 20), body: "solid", graph: { nodes: [], links: [] } });
  const actor = Object.assign({ id: "a", name: "Hero", shape: "box", pos: V(0, 0.5, 0), scale: V(1, 1, 1), body: "none", tags: ["hero"], graph: { nodes: [], links: [] } }, opts.actor || {});
  p.actors.push(actor);
  (opts.more || []).forEach((m) => p.actors.push(Object.assign({ shape: "box", scale: V(1, 1, 1), graph: { nodes: [], links: [] } }, m)));
  const b = new S.Builder(actor.graph, { n: 1 });
  build(b, p);
  return p;
}
function play(p, seconds, opts = {}) {
  const g = new S.Game(p, { seed: 1, storage: opts.storage });
  const frames = Math.round(seconds * 60);
  for (let i = 0; i < frames; i++) { if (opts.each) opts.each(g, i); g.tick(1 / 60); }
  return g;
}
/* BeginPlay → Set Out = <the node's output> */
function evalNode(type, inputs, outPin, settings, outType = "number") {
  const p = project((b) => {
    const bp = b.node("BeginPlay"), set = b.node("SetVar", 0, 0, { var: "Out" });
    const n = b.node(type, 0, 0, Object.assign({ in: inputs || {} }, settings || {}));
    b.link(n, outPin, set, "Value").chain(bp, set);
  }, { outType });
  const g = play(p, 1 / 60);
  assert.equal(g.error, null, g.error);
  return g.getVar("Out");
}

test("Studio: every node is well-formed: a title, a known category, help, typed pins and sane defaults", () => {
  const types = Object.keys(S.NODES);
  assert.ok(types.length >= 130, `only ${types.length} nodes`);
  const cats = new Set(S.CATEGORIES.map((c) => c.id));
  for (const t of types) {
    const d = S.NODES[t];
    assert.ok(d.title && cats.has(d.cat) && typeof d.help === "string" && d.help.length > 8, t);
    for (const side of ["in", "out"]) {
      const names = d[side].map((p) => p.name);
      assert.equal(new Set(names).size, names.length, `${t}: duplicate ${side} pin`);
      d[side].forEach((p) => assert.ok(S.TYPES[p.type], `${t}.${p.name}: type ${p.type}`));
    }
    const execIn = d.in.some((p) => p.type === "exec"), execOut = d.out.some((p) => p.type === "exec");
    if (d.kind === "event") assert.ok(!execIn && execOut && typeof d.run !== "function", `${t}: an event`);
    if (d.kind === "pure") assert.ok(!execIn && !execOut && typeof d.eval === "function", `${t}: pure`);
    if (d.kind === "exec") assert.ok(execIn && typeof d.run === "function", `${t}: action`);
    d.in.filter((p) => p.type !== "exec" && p.type !== "actor" && p.type !== "any").forEach((p) => {
      assert.deepEqual(S.coerce(p.def, p.type), p.type === "vector" ? p.def : S.coerce(p.def, p.type), `${t}.${p.name} default`);
    });
    d.settings.forEach((s) => { if (s.kind === "select") assert.ok(s.options.includes(s.def), `${t}: setting ${s.name}`); });
  }
  // Every category has something in it.
  for (const c of cats) assert.ok(types.some((t) => S.NODES[t].cat === c), c);
});

test("Studio: wires only join pins that fit", () => {
  const n = (type) => ({ id: type, type, data: {} });
  assert.equal(S.canLink(n("BeginPlay"), "Then", n("Branch"), "In"), true);
  assert.equal(S.canLink(n("BeginPlay"), "Then", n("Branch"), "Condition"), false, "exec into data");
  assert.equal(S.canLink(n("Add"), "Result", n("Branch"), "Condition"), true, "a number can be a condition");
  assert.equal(S.canLink(n("Add"), "Result", n("PrintString"), "Text"), true, "anything prints");
  assert.equal(S.canLink(n("MakeVector"), "Vector", n("Add"), "A"), false, "a vector isn't a number");
  assert.equal(S.canLink(n("Self"), "Self", n("Distance"), "A"), false, "an actor isn't a place");
  const g = S.cleanGraph({
    nodes: [{ id: "a", type: "BeginPlay" }, { id: "b", type: "PrintString" }, { id: "c", type: "PrintString" }, { id: "d", type: "Nope" }, { id: "e", type: "MakeVector" }],
    links: [{ from: { node: "a", pin: "Then" }, to: { node: "b", pin: "In" } }, { from: { node: "a", pin: "Then" }, to: { node: "c", pin: "In" } },
      { from: { node: "e", pin: "Vector" }, to: { node: "b", pin: "Duration" } }, { from: { node: "a", pin: "Then" }, to: { node: "d", pin: "In" } }]
  });
  assert.deepEqual(g.nodes.map((x) => x.id), ["a", "b", "c", "e"]);
  assert.equal(g.links.length, 1, "one wire per exec output; mismatched and dangling wires dropped");
});

test("Studio: flow control — Branch, Sequence, loops, Do Once, Do N, Gate, Flip Flop, Switch", () => {
  const p = project((b) => {
    const bp = b.node("BeginPlay"), seq = b.node("Sequence");
    const log = (text) => b.node("PrintString", 0, 0, { in: { Text: text } });
    b.chain(bp, seq);
    const br = b.node("Branch", 0, 0, { in: { Condition: false } }), yes = log("yes"), no = log("no");
    b.link(seq, "Then 0", br, "In").link(br, "True", yes, "In").link(br, "False", no, "In");
    const loop = b.node("ForLoop", 0, 0, { in: { "First Index": 2, "Last Index": 4 } }), body = b.node("PrintString"), done = log("loop done");
    b.link(seq, "Then 1", loop, "In").link(loop, "Loop Body", body, "In").link(loop, "Index", body, "Text").link(loop, "Completed", done, "In");
    const fl = b.node("ForLoop", 0, 0, { in: { "First Index": 1, "Last Index": 4 } }), once = b.node("DoOnce"), dn = b.node("DoN", 0, 0, { in: { N: 2 } }), ff = b.node("FlipFlop");
    const o = log("once"), d = b.node("PrintString"), a = log("A"), bb = log("B");
    b.link(seq, "Then 2", fl, "In").link(fl, "Loop Body", once, "In").link(once, "Completed", o, "In");
    b.chain(o, dn).link(dn, "Exit", d, "In").link(dn, "Counter", d, "Text");
    b.chain(d, ff).link(ff, "A", a, "In").link(ff, "B", bb, "In");
    const sw = b.node("SwitchInt", 0, 0, { in: { Selection: 2 } }), two = log("two"), other = log("other");
    b.link(seq, "Then 3", sw, "In").link(sw, "2", two, "In").link(sw, "Default", other, "In");
  });
  const g = play(p, 1 / 60);
  assert.deepEqual(g.hud.prints.map((x) => x.text), ["no", "2", "3", "4", "loop done", "once", "1", "A", "two"].slice(-8),
    "prints keep the last eight");
  assert.equal(g.error, null);
});

test("Studio: Gate opens and closes; While Loop stops at its condition; a runaway loop is caught", () => {
  const p = project((b) => {
    const k = b.node("KeyPressed", 0, 0, { key: "E" }), gate = b.node("Gate", 0, 0, { startClosed: true }), hit = b.node("IncVar", 0, 0, { var: "Out" });
    const o = b.node("KeyPressed", 0, 0, { key: "Q" });
    b.link(k, "Then", gate, "Enter").link(o, "Then", gate, "Open").link(gate, "Exit", hit, "In");
  }, { outType: "number" });
  const g = new S.Game(p, { seed: 1 });
  g.tick(0.016); g.keyDown("E"); g.tick(0.016); g.keyUp("E"); g.tick(0.016);
  assert.equal(g.getVar("Out"), 0, "closed");
  g.keyDown("Q"); g.tick(0.016); g.keyDown("E"); g.tick(0.016);
  assert.equal(g.getVar("Out"), 1, "open");
  // While: count to 5
  const w = project((b) => {
    const bp = b.node("BeginPlay"), wl = b.node("WhileLoop"), lt = b.node("Less", 0, 0, { in: { B: 5 } }), get = b.node("GetVar", 0, 0, { var: "Out" }), inc = b.node("IncVar", 0, 0, { var: "Out" });
    b.link(get, "Value", lt, "A").link(lt, "Result", wl, "Condition").chain(bp, wl).link(wl, "Loop Body", inc, "In");
  }, { outType: "number" });
  assert.equal(play(w, 0.02).getVar("Out"), 5);
  const runaway = project((b) => { const t = b.node("Tick"), fl = b.node("ForLoop", 0, 0, { in: { "Last Index": 1e9 } }), pr = b.node("SetVar", 0, 0, { var: "Out" }); b.chain(t, fl).link(fl, "Loop Body", pr, "In"); });
  const r = play(runaway, 0.05);
  assert.match(r.error, /loop that never ends/);
  assert.equal(r.ended, true);
  const circle = project((b) => { const ev = b.node("CustomEvent", 0, 0, { name: "Ping" }), call = b.node("CallEvent", 0, 0, { in: { "Event Name": "Ping" } }), bp = b.node("BeginPlay"), c2 = b.node("CallEvent", 0, 0, { in: { "Event Name": "Ping" } }); b.chain(ev, call); b.chain(bp, c2); });
  assert.match(play(circle, 0.02).error, /calling each other in a circle/);
});

test("Studio: Delay waits (ignoring repeats), Retriggerable Delay restarts, timers loop until cleared", () => {
  const p = project((b) => {
    const k = b.node("KeyPressed", 0, 0, { key: "E" }), d = b.node("Delay", 0, 0, { in: { Duration: 0.5 } }), inc = b.node("IncVar", 0, 0, { var: "Out" });
    b.chain(k, d).link(d, "Completed", inc, "In");
    const bp = b.node("BeginPlay"), t = b.node("SetTimer", 0, 0, { in: { "Event Name": "Beat", Time: 0.25, Looping: true } });
    const ev = b.node("CustomEvent", 0, 0, { name: "Beat" }), tick = b.node("IncVar", 0, 0, { var: "Beats" });
    const stopKey = b.node("KeyPressed", 0, 0, { key: "Q" }), clr = b.node("ClearTimer", 0, 0, { in: { "Event Name": "Beat" } });
    b.chain(bp, t); b.chain(ev, tick); b.chain(stopKey, clr);
  }, { variables: [{ name: "Out", type: "number", value: 0 }, { name: "Beats", type: "number", value: 0 }] });
  const g = new S.Game(p, { seed: 1 });
  const run = (secs) => { for (let i = 0; i < Math.round(secs * 60); i++) g.tick(1 / 60); };
  g.keyDown("E"); run(0.2); g.keyUp("E"); g.keyDown("E"); run(0.2);
  assert.equal(g.getVar("Out"), 0, "still waiting");
  run(0.2);
  assert.equal(g.getVar("Out"), 1, "one delay finished; the repeat press was ignored");
  assert.equal(g.getVar("Beats"), 2, "a beat every quarter second");
  g.keyDown("Q"); run(1);
  assert.equal(g.getVar("Beats"), 2, "cleared");
});

test("Studio: maths, logic, text and vectors", () => {
  const cases = [
    ["Add", { A: 2, B: 3 }, "Result", 5], ["Subtract", { A: 2, B: 3 }, "Result", -1], ["Multiply", { A: 4, B: 2.5 }, "Result", 10],
    ["Divide", { A: 1, B: 0 }, "Result", 0], ["Modulo", { A: -1, B: 5 }, "Result", 4], ["Power", { A: 2, B: 10 }, "Result", 1024],
    ["Clamp", { Value: 9, Min: 0, Max: 5 }, "Result", 5], ["Round", { Value: 2.5 }, "Result", 3], ["Sqrt", { Value: -4 }, "Result", 0],
    ["Lerp", { A: 10, B: 20, Alpha: 0.25 }, "Result", 12.5], ["MapRange", { Value: 5, "In Min": 0, "In Max": 10, "Out Min": 0, "Out Max": 100 }, "Result", 50],
    ["Atan2", { X: 1, Z: 0 }, "Degrees", 90], ["Greater", { A: 3, B: 2 }, "Result", true], ["NearlyEqual", { A: 1, B: 1.005 }, "Result", true],
    ["Equal", { A: "3", B: 3 }, "Result", true], ["Xor", { A: true, B: true }, "Result", false], ["Select", { Condition: false, "If True": "a", "If False": "b" }, "Result", "b"],
    ["Append", { A: "Lv ", B: "3", C: "!" }, "Result", "Lv 3!"], ["FormatText", { Format: "{0}/{1}", "{0}": 2, "{1}": 5 }, "Result", "2/5"],
    ["ToText", { Value: 3.14159, Decimals: 2 }, "Result", "3.14"], ["TextContains", { Text: "Hello World", Search: "world" }, "Result", true],
    ["VecLength", { Vector: V(3, 4, 0) }, "Length", 5], ["Distance", { A: V(0, 0, 0), B: V(0, 0, 2) }, "Distance", 2],
    ["Direction", { From: V(0, 0, 0), To: V(0, 0, 9) }, "Direction", V(0, 0, 1)], ["VecScale", { Vector: V(1, 2, 3), Scale: 2 }, "Result", V(2, 4, 6)],
    ["RandomInt", { Min: 4, Max: 4 }, "Result", 4]
  ];
  const typeOf = (w) => (typeof w === "boolean" ? "bool" : typeof w === "string" ? "string" : typeof w === "object" ? "vector" : "number");
  for (const [type, ins, out, want] of cases) {
    const got = evalNode(type, ins, out, null, typeOf(want));
    if (typeof want === "number") assert.ok(Math.abs(got - want) < 1e-9, `${type}: ${got} ≠ ${want}`);
    else assert.deepEqual(got, want, type);
  }
  const r = evalNode("RotateY", { Vector: V(0, 0, 1), Degrees: 90 }, "Result", null, "vector");
  assert.ok(Math.abs(r.x - 1) < 1e-9 && Math.abs(r.z) < 1e-9, "turning forward 90° faces +x");
  for (let i = 0; i < 20; i++) { const n = evalNode("RandomFloat", { Min: 2, Max: 3 }, "Result"); assert.ok(n >= 2 && n <= 3); }
});

test("Studio: falling, landing, walls, overlaps and line traces", () => {
  const p = project((b) => {
    const hit = b.node("Hit"), inc = b.node("IncVar", 0, 0, { var: "Hits" });
    const ov = b.node("OverlapBegin"), on = b.node("IncVar", 0, 0, { var: "In" }), oe = b.node("OverlapEnd"), off = b.node("IncVar", 0, 0, { var: "Out" });
    b.chain(hit, inc); b.chain(ov, on); b.chain(oe, off);
  }, {
    variables: ["Hits", "In", "Out"].map((n) => ({ name: n, type: "number", value: 0 })),
    actor: { pos: V(0, 5, 0), body: "dynamic" },
    more: [{ id: "w", name: "Wall", pos: V(3, 1, 0), scale: V(1, 2, 4), body: "solid" }, { id: "z", name: "Zone", pos: V(-3, 0.5, 0), scale: V(1, 1, 1), body: "none" }]
  });
  const g = play(p, 1.5);
  const hero = g.byName("Hero");
  assert.ok(Math.abs(hero.pos.y - 0.5) < 0.01, `landed at ${hero.pos.y}`);
  assert.equal(hero.onGround, true);
  assert.equal(g.getVar("Hits"), 1, "one hit on landing, not one a frame while resting");
  g.move(hero, V(10, 0, 0), true);
  assert.ok(hero.pos.x < 2.5, "a wall stops a sweep");
  g.move(hero, V(-hero.pos.x - 3, 0, 0), true);
  g.tick(1 / 60);
  assert.equal(g.getVar("In"), 1, "walked into the zone");
  g.move(hero, V(6, 0, 0), true); g.tick(1 / 60);
  assert.equal(g.getVar("Out"), 1, "and out again");
  assert.equal(g.trace(V(-9, 0.8, 0), V(9, 0.8, 0), null).actor.name, "Zone", "the nearest thing on the line");
  const tr = g.trace(V(9, 0.8, 0), V(-9, 0.8, 0), null);
  assert.equal(tr.actor.name, "Wall", "from the other side, the wall");
  assert.ok(Math.abs(tr.point.x - 3.5) < 1e-9 && Math.abs(tr.dist - 5.5) < 1e-9);
  assert.equal(g.trace(V(-9, 9, 0), V(9, 9, 0), null), null, "nothing up high");
});

test("Studio: spawning copies runs their Begin Play; destroying runs Event Destroyed", () => {
  const p = project((b) => {
    const k = b.node("KeyPressed", 0, 0, { key: "E" }), sp = b.node("SpawnCopy", 0, 0, { in: { Template: "Spark", Location: V(1, 1, 1) } }), kill = b.node("Destroy");
    b.chain(k, sp, kill).link(sp, "New Actor", kill, "Target");
  }, {
    variables: [{ name: "Born", type: "number", value: 0 }, { name: "Gone", type: "number", value: 0 }],
    more: [{ id: "s", name: "Spark", pos: V(0, 9, 0), body: "none", graph: (() => { const gr = { nodes: [], links: [] }, b = new S.Builder(gr, { n: 100 }); b.chain(b.node("BeginPlay"), b.node("IncVar", 0, 0, { var: "Born" })); b.chain(b.node("Destroyed"), b.node("IncVar", 0, 0, { var: "Gone" })); return gr; })() }]
  });
  const g = new S.Game(p, { seed: 1 });
  g.tick(1 / 60);
  assert.equal(g.getVar("Born"), 1, "the placed Spark began");
  g.keyDown("E"); g.tick(1 / 60);
  assert.equal(g.getVar("Born"), 2, "the copy began");
  assert.equal(g.getVar("Gone"), 1, "and was destroyed");
  assert.equal(g.actors.filter((a) => a.name === "Spark").length, 1);
});

test("Studio: Coin Run — walk into a coin, jump, collect all five, start over after a fall", () => {
  const p = SAMPLES.find((s) => s.id === "coins").make();
  const g = new S.Game(p, { seed: 3 });
  const run = (secs) => { for (let i = 0; i < Math.round(secs * 60); i++) g.tick(1 / 60); };
  run(0.5);
  const player = g.byName("Player");
  assert.ok(player.onGround, "standing");
  g.keyDown("W"); run(1.2); g.keyUp("W");
  assert.equal(g.getVar("Score"), 1, "walked forward into the first coin");
  assert.equal(g.hud.slots.Coins, "1 / 5");
  const evs = g.drain().map((e) => e.type + ":" + (e.sound || e.effect || ""));
  assert.ok(evs.includes("sound:coin") && evs.includes("particles:sparkle"), evs.join(" "));
  const y0 = player.pos.y;
  g.keyDown("Space"); run(0.25); g.keyUp("Space");
  assert.ok(player.pos.y > y0 + 1, "jumped");
  assert.ok(g.drain().some((e) => e.sound === "jump"));
  run(1);
  for (const coin of g.withTag("coin")) { player.pos = Object.assign({}, coin.pos); run(0.1); }
  assert.equal(g.getVar("Score"), 5);
  assert.equal(g.hud.message.title, "You win!");
  player.pos = V(40, 0.8, 40); run(1.5);
  assert.equal(g.request, "restart", "fell off the world");
  assert.equal(g.error, null);
});

test("Studio: Dodge the Rocks — rocks rain and clear away; a hit ends the run and saves the best", () => {
  const store = { m: {}, get(k) { return this.m[k]; }, set(k, v) { this.m[k] = v; } };
  const p = SAMPLES.find((s) => s.id === "dodge").make();
  const g = new S.Game(p, { seed: 5, storage: store });
  const run = (secs) => { for (let i = 0; i < Math.round(secs * 60); i++) g.tick(1 / 60); };
  run(4);
  assert.ok(g.withTag("rock").length >= 1, "rocks are falling");
  assert.ok(g.withTag("rock").length < 9, "and landed ones are cleared");
  assert.equal(g.hud.slots.Time, "4.0");
  const rock = g.withTag("rock")[0];
  rock.pos = Object.assign({}, g.byName("Player").pos);
  run(0.05);
  assert.equal(g.hud.message.title, "Bonk!");
  assert.match(g.hud.message.sub, /You lasted 4 s · best 4 s/);
  assert.equal(g.paused, true);
  assert.equal(store.m["dodge-best"], 4);
  g.keyDown("R"); run(0.05);
  assert.equal(g.request, "restart", "R plays again, even while paused");
});

test("Studio: Target Practice — taps score, a new target appears, and time runs out", () => {
  const store = { m: { "targets-best": 2 }, get(k) { return this.m[k]; }, set(k, v) { this.m[k] = v; } };
  const p = SAMPLES.find((s) => s.id === "targets").make();
  const g = new S.Game(p, { seed: 9, storage: store });
  const run = (secs) => { for (let i = 0; i < Math.round(secs * 60); i++) g.tick(1 / 60); };
  run(0.1);
  for (let i = 0; i < 3; i++) { g.click(g.withTag("target")[0].id); run(0.1); }
  assert.equal(g.getVar("Score"), 3);
  assert.equal(g.withTag("target").length, 1, "each hit target is replaced");
  assert.equal(g.hud.slots.Score, "3");
  run(30);
  assert.equal(g.hud.message.title, "Time's up!");
  assert.equal(g.hud.message.sub, "You hit 3 · best 3");
  assert.equal(store.m["targets-best"], 3);
  assert.equal(g.paused, true);
  g.click(g.withTag("target")[0].id); run(0.1);
  assert.equal(g.getVar("Score"), 3, "no points after the bell");
  assert.ok(Math.abs(g.hud.bars.Time.value) < 1e-9);
});

test("Studio: loading a project cleans out anything broken", () => {
  const p = S.cleanProject({
    name: "  ", world: { sky: "blue", gravity: "x", camera: "drone" },
    variables: [{ name: "Ok", type: "number", value: "4" }, { name: "Ok", type: "number" }, { name: "bad name!", type: "number" }, { name: "Pos", type: "vector", value: [1, 2, 3] }],
    actors: [{ id: "a", name: "", shape: "blob", pos: [1, 2, 3], color: "red", body: "flying", tags: ["Player ", ""] }, { id: "a" }, null]
  });
  assert.equal(p.name, "My Game");
  assert.deepEqual(p.world, S.DEFAULT_WORLD);
  assert.deepEqual(p.variables.map((v) => [v.name, v.value]), [["Ok", 4], ["Pos", { x: 1, y: 2, z: 3 }]]);
  assert.equal(p.actors.length, 1);
  assert.deepEqual([p.actors[0].name, p.actors[0].shape, p.actors[0].body, p.actors[0].color, p.actors[0].tags], ["Actor", "box", "none", "#9ca3af", ["player"]]);
  assert.deepEqual(p.actors[0].pos, V(1, 2, 3));
});
