"use strict";
/* ================= Code Block Studio — starter games =================
   Each starter is a whole game made only of Blueprint nodes, so a
   learner can open it, press Play, and then read (and change) how it
   works. They double as the engine's own end-to-end tests
   (tests/studio-core.test.js plays each one). */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./studio-core.js"));
  else root.CBStudioSamples = factory(root.CBStudio);
})(typeof self !== "undefined" ? self : this, function (S) {
  var V = S.V;
  function A(id, name, shape, pos, scale, color, body, extra) {
    var a = { id: id, name: name, shape: shape, pos: pos, rot: V(0, 0, 0), scale: scale, color: color, tags: [], visible: true, body: body, gravity: true, collide: true, text: "", graph: { nodes: [], links: [] } };
    for (var k in extra || {}) a[k] = extra[k];
    return a;
  }
  function ground(id, size) { return A(id, "Ground", "box", V(0, -0.5, 0), V(size, 1, size), "#4ade80", "solid"); }

  /* Tick → move with the arrow keys / WASD, at `speed` units a second. */
  function walk(b, speed, x, y) {
    var tick = b.node("Tick", x, y);
    var h = b.node("GetAxis", x, y + 140, { axis: "Horizontal" });
    var v = b.node("GetAxis", x, y + 220, { axis: "Vertical" });
    var mk = b.node("MakeVector", x + 230, y + 150);
    var sp = b.node("Multiply", x + 230, y + 300, { in: { A: speed } });
    var sc = b.node("VecScale", x + 460, y + 150);
    var off = b.node("AddOffset", x + 690, y);
    b.link(h, "Value", mk, "X").link(v, "Value", mk, "Z");
    b.link(tick, "Delta Seconds", sp, "B");
    b.link(mk, "Vector", sc, "Vector").link(sp, "Result", sc, "Scale");
    b.link(sc, "Result", off, "Delta");
    b.chain(tick, off);
    return { tick: tick, last: off };
  }

  function coinRun() {
    var c = { n: 1 };
    var p = { name: "Coin Run", world: { sky: "#8ec5ff", gravity: -20, camera: "follow", distance: 11 }, variables: [{ name: "Score", type: "number", value: 0 }], actors: [] };
    p.actors.push(ground("g", 26));
    var hill = A("p1", "Platform", "box", V(6, 0.75, 5), V(4, 1.5, 4), "#a78bfa", "solid");
    var step = A("p2", "Platform", "box", V(9, 2, 9.5), V(3, 1, 3), "#c4b5fd", "solid");
    p.actors.push(hill, step);
    // the player: walk, jump, and start over after a fall
    var player = A("pl", "Player", "capsule", V(0, 1, 0), V(0.9, 1.6, 0.9), "#3b82f6", "dynamic", { tags: ["player"] });
    var b = new S.Builder(player.graph, c);
    var w = walk(b, 6, 40, 40);
    var loc = b.node("GetLocation", 700, 330), brk = b.node("BreakVector", 900, 330);
    var low = b.node("Less", 1100, 330, { in: { B: -10 } });
    var br = b.node("Branch", 920, 40), rs = b.node("RestartGame", 1150, 40);
    b.link(loc, "Location", brk, "Vector").link(brk, "Y", low, "A").link(low, "Result", br, "Condition");
    b.chain(w.last, br).link(br, "True", rs, "In");
    var key = b.node("KeyPressed", 40, 520, { key: "Space" }), jump = b.node("Jump", 280, 520, { in: { Height: 2.4 } });
    var did = b.node("Branch", 520, 520), snd = b.node("PlaySound", 760, 520, { sound: "jump" });
    b.chain(key, jump, did).link(jump, "Jumped", did, "Condition").link(did, "True", snd, "In");
    p.actors.push(player);
    // five coins, each with the same Blueprint
    [[0, 1, 5], [-5, 1, -3], [6, 2.2, 5], [9, 3.2, 9.5], [-7, 1, 6]].forEach(function (at, i) {
      var coin = A("c" + i, "Coin", "cylinder", V(at[0], at[1], at[2]), V(0.9, 0.15, 0.9), "#facc15", "none", { tags: ["coin"], rot: V(90, 0, 0) });
      var cb = new S.Builder(coin.graph, c);
      var t = cb.node("Tick", 40, 40), spin = cb.node("AddRotation", 520, 40), d = cb.node("Multiply", 280, 140, { in: { A: 180 } }), mk = cb.node("MakeVector", 300, 260);
      cb.link(t, "Delta Seconds", d, "B").link(d, "Result", mk, "Y").link(mk, "Vector", spin, "Delta").chain(t, spin);
      var ov = cb.node("OverlapBegin", 40, 380), is = cb.node("HasTag", 260, 480, { in: { Tag: "player" } }), br2 = cb.node("Branch", 280, 380);
      var inc = cb.node("IncVar", 500, 380, { var: "Score" }), fmt = cb.node("FormatText", 700, 520, { in: { Format: "{0} / 5" } }), hud = cb.node("SetHudText", 740, 380, { in: { Slot: "Coins" } });
      var s2 = cb.node("PlaySound", 980, 380, { sound: "coin" }), here = cb.node("GetLocation", 1000, 520), fx = cb.node("SpawnParticles", 1220, 380, { effect: "sparkle" });
      var kill = cb.node("Destroy", 1460, 380), tell = cb.node("Broadcast", 1700, 380, { in: { "Event Name": "CoinTaken" } });
      cb.link(ov, "Other Actor", is, "Target").link(is, "Result", br2, "Condition");
      cb.link(inc, "Value", fmt, "{0}").link(fmt, "Result", hud, "Text").link(here, "Location", fx, "Location");
      cb.chain(ov, br2).link(br2, "True", inc, "In").chain(inc, hud, s2, fx, kill, tell);
      p.actors.push(coin);
    });
    // the level: say hello, and cheer when the last coin is taken
    var lb = new S.Builder(p.level = { nodes: [], links: [] }, c);
    var bp = lb.node("BeginPlay", 40, 40), h0 = lb.node("SetHudText", 280, 40, { in: { Slot: "Coins", Text: "0 / 5" } });
    var msg = lb.node("ShowMessage", 520, 40, { in: { Title: "Coin Run", Subtitle: "Collect all 5 coins. WASD or arrows to move, Space to jump.", Duration: 3.5 } });
    lb.chain(bp, h0, msg);
    var ev = lb.node("CustomEvent", 40, 300, { name: "CoinTaken" }), cnt = lb.node("CountTagged", 240, 420, { in: { Tag: "coin" } }), none = lb.node("LessEqual", 460, 420);
    var br3 = lb.node("Branch", 300, 300), win = lb.node("ShowMessage", 540, 300, { in: { Title: "You win!", Subtitle: "Every coin collected.", Duration: 0 } });
    var ws = lb.node("PlaySound", 780, 300, { sound: "win" }), pl = lb.node("GetActorByName", 800, 440, { in: { Name: "Player" } }), ploc = lb.node("GetLocation", 1000, 440);
    var conf = lb.node("SpawnParticles", 1020, 300, { effect: "confetti" });
    lb.link(cnt, "Count", none, "A").link(none, "Result", br3, "Condition").link(pl, "Actor", ploc, "Target").link(ploc, "Location", conf, "Location");
    lb.chain(ev, br3).link(br3, "True", win, "In").chain(win, ws, conf);
    p.next = c.n;
    return p;
  }

  function dodge() {
    var c = { n: 1 };
    var p = { name: "Dodge the Rocks", world: { sky: "#fde68a", gravity: -14, camera: "follow", distance: 15 }, variables: [], actors: [] };
    p.actors.push(ground("g", 18));
    var player = A("pl", "Player", "box", V(0, 0.5, 0), V(1, 1, 1), "#2563eb", "dynamic", { tags: ["player"] });
    var b = new S.Builder(player.graph, c);
    walk(b, 8, 40, 40);
    var ov = b.node("OverlapBegin", 40, 420), is = b.node("HasTag", 260, 520, { in: { Tag: "rock" } }), br = b.node("Branch", 280, 420), once = b.node("DoOnce", 500, 420);
    var t = b.node("GameTime", 520, 700), r = b.node("Round", 720, 700), best0 = b.node("LoadValue", 720, 820, { in: { Key: "dodge-best", Default: 0 } }), best = b.node("Max", 940, 760);
    var save = b.node("SaveValue", 740, 420, { in: { Key: "dodge-best" } });
    var fmt = b.node("FormatText", 1000, 560, { in: { Format: "You lasted {0} s · best {1} s · press R to play again" } });
    var msg = b.node("ShowMessage", 980, 420, { in: { Title: "Bonk!", Duration: 0 } }), snd = b.node("PlaySound", 1220, 420, { sound: "lose" });
    var shake = b.node("CameraShake", 1460, 420), here = b.node("GetLocation", 1460, 560), boom = b.node("SpawnParticles", 1700, 420, { effect: "explosion" }), stop = b.node("PauseGame", 1940, 420);
    b.link(ov, "Other Actor", is, "Target").link(is, "Result", br, "Condition");
    b.link(t, "Seconds", r, "Value").link(r, "Result", best, "A").link(best0, "Value", best, "B").link(best, "Result", save, "Value");
    b.link(r, "Result", fmt, "{0}").link(best, "Result", fmt, "{1}").link(fmt, "Result", msg, "Subtitle").link(here, "Location", boom, "Location");
    b.chain(ov, br).link(br, "True", once, "In").chain([once, "Completed"], save, msg, snd, shake, boom, stop);
    var rk = b.node("KeyPressed", 40, 900, { key: "R" }), again = b.node("RestartGame", 280, 900);
    b.chain(rk, again);
    p.actors.push(player);
    var lb = new S.Builder(p.level = { nodes: [], links: [] }, c);
    var bp = lb.node("BeginPlay", 40, 40), tm = lb.node("SetTimer", 280, 40, { in: { "Event Name": "SpawnRock", Time: 0.45, Looping: true } });
    var hi = lb.node("LoadValue", 300, 200, { in: { Key: "dodge-best", Default: 0 } }), hs = lb.node("SetHudText", 520, 40, { in: { Slot: "Best" } });
    var intro = lb.node("ShowMessage", 760, 40, { in: { Title: "Dodge the Rocks", Subtitle: "Move with WASD or the arrows. Don't get squashed!", Duration: 2.5 } });
    lb.link(hi, "Value", hs, "Text").chain(bp, tm, hs, intro);
    var ev = lb.node("CustomEvent", 40, 340, { name: "SpawnRock" }), where = lb.node("RandomVector", 240, 460, { in: { Min: V(-8, 14, -8), Max: V(8, 14, 8) } });
    var size = lb.node("RandomFloat", 240, 600, { in: { Min: 0.7, Max: 1.6 } }), sv = lb.node("MakeVector", 460, 600);
    var rock = lb.node("SpawnShape", 520, 340, { shape: "sphere", body: "dynamic", in: { Color: "#78716c", Tag: "rock" } });
    lb.link(where, "Point", rock, "Location").link(size, "Result", sv, "X").link(size, "Result", sv, "Y").link(size, "Result", sv, "Z").link(sv, "Vector", rock, "Scale");
    lb.chain(ev, rock);
    var tk = lb.node("Tick", 40, 760), seq = lb.node("Sequence", 260, 760), gt = lb.node("GameTime", 300, 940), tt = lb.node("ToText", 500, 940, { in: { Decimals: 1 } });
    var th = lb.node("SetHudText", 520, 760, { in: { Slot: "Time" } }), each = lb.node("ForEachTagged", 520, 1040, { in: { Tag: "rock" } });
    var og = lb.node("IsOnGround", 760, 1180), br2 = lb.node("Branch", 780, 1040), al = lb.node("GetLocation", 1000, 1180), smoke = lb.node("SpawnParticles", 1020, 1040, { effect: "smoke" }), gone = lb.node("Destroy", 1260, 1040);
    lb.link(gt, "Seconds", tt, "Value").link(tt, "Result", th, "Text");
    lb.link(each, "Actor", og, "Target").link(og, "On Ground", br2, "Condition").link(each, "Actor", al, "Target").link(al, "Location", smoke, "Location").link(each, "Actor", gone, "Target");
    lb.chain(tk, seq).link(seq, "Then 0", th, "In").link(seq, "Then 1", each, "In").chain([each, "Loop Body"], br2).link(br2, "True", smoke, "In").chain(smoke, gone);
    p.next = c.n;
    return p;
  }

  function targets() {
    var c = { n: 1 };
    var p = { name: "Target Practice", world: { sky: "#1e1b4b", gravity: -20, camera: "fixed", distance: 14 },
      variables: [{ name: "Score", type: "number", value: 0 }, { name: "TimeLeft", type: "number", value: 30 }], actors: [] };
    p.actors.push(ground("g", 30));
    p.actors[0].color = "#334155";
    var sign = A("s", "Sign", "sign", V(0, 3.4, 6), V(6, 1.4, 1), "#0f172a", "none", { text: "Tap the targets!", collide: false });
    p.actors.push(sign);
    var tgt = A("t", "Target", "sphere", V(0, 2.5, 0), V(1.2, 1.2, 1.2), "#ef4444", "none", { tags: ["target"] });
    var b = new S.Builder(tgt.graph, c);
    var bp = b.node("BeginPlay", 40, 40), rv = b.node("RandomVector", 260, 160, { in: { Min: V(-6, 1, -3), Max: V(6, 5, 3) } }), put = b.node("SetLocation", 500, 40);
    b.link(rv, "Point", put, "Location").chain(bp, put);
    var tk = b.node("Tick", 40, 300), d = b.node("Multiply", 260, 400, { in: { A: 120 } }), mk = b.node("MakeVector", 460, 400), rot = b.node("AddRotation", 520, 300);
    b.link(tk, "Delta Seconds", d, "B").link(d, "Result", mk, "Y").link(mk, "Vector", rot, "Delta").chain(tk, rot);
    var ck = b.node("Clicked", 40, 560), ps = b.node("IsPaused", 220, 680), np = b.node("Not", 420, 680), br = b.node("Branch", 280, 560);
    var inc = b.node("IncVar", 520, 560, { var: "Score" }), hud = b.node("SetHudText", 760, 560, { in: { Slot: "Score" } });
    var here = b.node("GetLocation", 1000, 700), boom = b.node("SpawnParticles", 1000, 560, { effect: "explosion" }), snd = b.node("PlaySound", 1240, 560, { sound: "explode" });
    var nv = b.node("RandomVector", 1260, 700, { in: { Min: V(-6, 1, -3), Max: V(6, 5, 3) } }), copy = b.node("SpawnCopy", 1480, 560, { in: { Template: "Target" } }), kill = b.node("Destroy", 1720, 560);
    b.link(ps, "Paused", np, "A").link(np, "Result", br, "Condition").link(inc, "Value", hud, "Text").link(here, "Location", boom, "Location").link(nv, "Point", copy, "Location");
    b.chain(ck, br).link(br, "True", inc, "In").chain(inc, hud, boom, snd, copy, kill);
    p.actors.push(tgt);
    var lb = new S.Builder(p.level = { nodes: [], links: [] }, c);
    var lbp = lb.node("BeginPlay", 40, 40), s0 = lb.node("SetHudText", 280, 40, { in: { Slot: "Score", Text: "0" } }), bar = lb.node("SetProgressBar", 520, 40, { in: { Slot: "Time", Value: 1, Color: "#38bdf8" } });
    var tm = lb.node("SetTimer", 760, 40, { in: { "Event Name": "Second", Time: 1, Looping: true } });
    var hi = lb.node("ShowMessage", 1000, 40, { in: { Title: "Target Practice", Subtitle: "Tap or click as many targets as you can in 30 seconds.", Duration: 2.5 } });
    lb.chain(lbp, s0, bar, tm, hi);
    var ev = lb.node("CustomEvent", 40, 300, { name: "Second" }), dec = lb.node("IncVar", 280, 300, { var: "TimeLeft", in: { By: -1 } });
    var frac = lb.node("Divide", 300, 440, { in: { B: 30 } }), bar2 = lb.node("SetProgressBar", 520, 300, { in: { Slot: "Time", Color: "#38bdf8" } });
    var over = lb.node("LessEqual", 560, 440, { in: { B: 0 } }), br2 = lb.node("Branch", 760, 300), stop = lb.node("ClearTimer", 1000, 300, { in: { "Event Name": "Second" } });
    var sc = lb.node("GetVar", 960, 460, { var: "Score" }), old = lb.node("LoadValue", 960, 580, { in: { Key: "targets-best", Default: 0 } }), best = lb.node("Max", 1180, 520);
    var save = lb.node("SaveValue", 1240, 300, { in: { Key: "targets-best" } }), fmt = lb.node("FormatText", 1420, 460, { in: { Format: "You hit {0} · best {1}" } });
    var end = lb.node("ShowMessage", 1480, 300, { in: { Title: "Time's up!", Duration: 0 } }), ws = lb.node("PlaySound", 1720, 300, { sound: "win" }), pz = lb.node("PauseGame", 1960, 300);
    lb.link(dec, "Value", frac, "A").link(frac, "Result", bar2, "Value").link(dec, "Value", over, "A").link(over, "Result", br2, "Condition");
    lb.link(sc, "Value", best, "A").link(old, "Value", best, "B").link(best, "Result", save, "Value").link(sc, "Value", fmt, "{0}").link(best, "Result", fmt, "{1}").link(fmt, "Result", end, "Subtitle");
    lb.chain(ev, dec, bar2, br2).link(br2, "True", stop, "In").chain(stop, save, end, ws, pz);
    p.next = c.n;
    return p;
  }

  function blank() {
    var c = { n: 1 };
    var p = { name: "My Game", world: { sky: "#8ec5ff", gravity: -20, camera: "follow", distance: 12 }, variables: [], actors: [] };
    p.actors.push(ground("g", 20));
    var player = A("pl", "Player", "capsule", V(0, 1, 0), V(0.9, 1.6, 0.9), "#3b82f6", "dynamic", { tags: ["player"] });
    var b = new S.Builder(player.graph, c);
    walk(b, 6, 40, 40);
    var key = b.node("KeyPressed", 40, 420, { key: "Space" }), jump = b.node("Jump", 280, 420);
    b.chain(key, jump);
    p.actors.push(player);
    var lb = new S.Builder(p.level = { nodes: [], links: [] }, c);
    var bp = lb.node("BeginPlay", 40, 40), pr = lb.node("PrintString", 280, 40, { in: { Text: "Hello! Add actors, then give them Blueprints." } });
    lb.chain(bp, pr);
    p.next = c.n;
    return p;
  }

  return [
    { id: "blank", name: "Empty level", blurb: "A floor and a player who can walk and jump. Build anything.", make: blank },
    { id: "coins", name: "Coin Run", blurb: "Run and jump to collect five spinning coins.", make: coinRun },
    { id: "dodge", name: "Dodge the Rocks", blurb: "Rocks rain down; stay out from under them as long as you can.", make: dodge },
    { id: "targets", name: "Target Practice", blurb: "Tap targets for 30 seconds; the best score is saved.", make: targets }
  ];
});
