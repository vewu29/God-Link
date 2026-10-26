"use strict";
/* ================= Code Block Studio — the editor =================
   The page around the engine: the Outliner (the Level and its actors),
   Details (an actor's shape, colour, transform, physics, tags), game
   Variables, the 3D view (js/studio-view.js), and the Blueprint graph
   where nodes are placed and wired. Every change can be undone, and the
   game saves itself on this device; games can be exported and imported
   as files. Play runs the game (js/studio-core.js) full screen, with
   the keyboard or an on-screen pad. */
(function () {
  var S = window.CBStudio, NODES = S.NODES, SAMPLES = window.CBStudioSamples;
  var STORE = "code-block-studio-v1";
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function say(msg) { var el = $("stSay"); el.textContent = ""; setTimeout(function () { el.textContent = msg; }, 30); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function icon(id) { return '<svg class="si"><use href="#' + id + '"/></svg>'; }
  var CAT = {};
  S.CATEGORIES.forEach(function (c) { CAT[c.id] = c.color; });
  var ACTOR_ONLY = { Clicked: 1, OverlapBegin: 1, OverlapEnd: 1, Hit: 1, Destroyed: 1, Self: 1 };

  /* ---------- the saved games ---------- */
  var store = { current: null, games: {} };
  try { var raw = JSON.parse(localStorage.getItem(STORE) || "null"); if (raw && raw.games && typeof raw.games === "object") store = raw; } catch (e) {}
  function persist() {
    try { localStorage.setItem(STORE, JSON.stringify(store)); }
    catch (e) { say("This device's storage is full, so the game couldn't be saved. Export it as a file to keep it."); }
  }
  var project, gameId, sel = "level", selNode = null, selWire = null, armed = null;
  var history = [], future = [], snapshot = "", saveTimer = 0;
  var graphCams = {};
  function newId(prefix) { return prefix + Math.random().toString(36).slice(2, 9); }
  function openGame(id) {
    var g = store.games[id];
    if (!g) return;
    gameId = id; store.current = id;
    project = S.cleanProject(g.project);
    history = []; future = []; snapshot = JSON.stringify(project); sel = "level"; selNode = null; selWire = null; armed = null; graphCams = {};
    var player = project.actors.filter(function (a) { return a.name === "Player"; })[0];
    if (player) sel = player.id;
    persist();
    renderAll(true);
  }
  function addGame(p) {
    var id = newId("g");
    store.games[id] = { project: S.cleanProject(p), updated: Date.now() };
    openGame(id);
    return id;
  }
  /* A starter game opens with every Blueprint tidied to fit the nodes
     as drawn here; that is where it starts, not an undo step. */
  function addStarter(sample) {
    var id = addGame(sample.make()), keep = sel;
    ["level"].concat(project.actors.map(function (a) { return a.id; })).forEach(function (who) {
      sel = who; renderGraph(false);
      if (graph().nodes.length) S.tidy(graph(), measureNode);
    });
    sel = keep; graphCams = {}; snapshot = JSON.stringify(project);
    store.games[id] = { project: project, updated: Date.now() }; persist();
    renderAll(true);
    return id;
  }
  function saveSoon() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      if (!gameId) return;
      store.games[gameId] = { project: project, updated: Date.now() };
      persist();
    }, 300);
  }
  /* commit(): the change just made becomes one undo step. */
  function commit(what) {
    var now = JSON.stringify(project);
    if (now === snapshot) return;
    history.push(snapshot); if (history.length > 80) history.shift();
    snapshot = now; future = [];
    saveSoon();
    paintUndo();
    if (what) say(what);
  }
  function undo() { if (!history.length) return; future.push(snapshot); snapshot = history.pop(); project = JSON.parse(snapshot); afterTimeTravel("Undone."); }
  function redo() { if (!future.length) return; history.push(snapshot); snapshot = future.pop(); project = JSON.parse(snapshot); afterTimeTravel("Redone."); }
  function afterTimeTravel(msg) {
    if (sel !== "level" && !actorById(sel)) sel = "level";
    selNode = null; selWire = null; armed = null;
    saveSoon(); renderAll(false); say(msg);
  }
  function paintUndo() { $("stUndo").disabled = !history.length; $("stRedo").disabled = !future.length; }

  /* ---------- lookups ---------- */
  function actorById(id) { for (var i = 0; i < project.actors.length; i++) if (project.actors[i].id === id) return project.actors[i]; return null; }
  function graph() { return sel === "level" ? project.level : (actorById(sel) || {}).graph || project.level; }
  function nodeById(id) { var g = graph(); for (var i = 0; i < g.nodes.length; i++) if (g.nodes[i].id === id) return g.nodes[i]; return null; }
  function nextNodeId() { project.next = (project.next || 1) + 1; return "n" + project.next; }
  function uniqueName(base, except) {
    var names = {}; project.actors.forEach(function (a) { if (a !== except) names[a.name.toLowerCase()] = 1; });
    if (!names[base.toLowerCase()]) return base;
    for (var i = 2; ; i++) if (!names[(base + " " + i).toLowerCase()]) return base + " " + i;
  }
  function nodeTitle(n) {
    var d = NODES[n.type], data = n.data || {};
    if (n.type === "GetVar") return "Get " + (data.var || "?");
    if (n.type === "SetVar") return "Set " + (data.var || "?");
    if (n.type === "IncVar") return "Increment " + (data.var || "?");
    if (n.type === "CustomEvent") return "Custom Event: " + (data.name || "MyEvent");
    return d.title;
  }

  /* ---------- the 3D view ---------- */
  var view = window.CBStudioView($("stCanvas"));
  view.ready.then(function () { view.setGizmo("move"); view.showProject(project, sel === "level" ? null : sel); },
    function () { var n = $("stViewNote"); n.textContent = "The 3D view couldn't start: Babylon.js didn't load (check the connection) or this browser has no WebGL. Blueprints still work, and Play shows the game's messages."; n.classList.remove("hidden"); });
  view.onPick(function (id) { if (id) selectActor(id); });
  view.onTransform(function (id, t) {
    var a = actorById(id); if (!a) return;
    a.pos = t.pos; a.rot = t.rot; a.scale = t.scale;
    commit(); renderDetails();
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-gizmo]"), function (b) {
    b.addEventListener("click", function () { setGizmo(b.getAttribute("data-gizmo")); });
  });
  function setGizmo(mode) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-gizmo]"), function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-gizmo") === mode)); });
    view.setGizmo(mode);
  }
  $("stFocus").addEventListener("click", function () { if (sel !== "level") view.frame(sel); });

  /* ---------- everything on screen ---------- */
  function renderAll(fit) {
    $("stName").value = project.name;
    document.title = project.name + " — Code Block Studio";
    renderOutliner(); renderVars(); renderDetails(); renderGraph(fit); paintUndo();
    view.showProject(project, sel === "level" ? null : sel);
  }
  function selectActor(id) {
    sel = id; selNode = null; selWire = null; armed = null;
    renderOutliner(); renderDetails(); renderGraph(!graphCams[sel]);
    view.select(id === "level" ? null : id);
  }

  /* ---------- outliner ---------- */
  function renderOutliner() {
    var html = '<li role="none"><button type="button" class="st-item" role="option" data-actor="level" aria-selected="' + (sel === "level") + '">' + icon("s-globe") +
      '<span class="nm">Level</span><span class="kd">World</span>' + (project.level.nodes.length ? '<i class="bpdot" title="Has a Blueprint"></i>' : "") + "</button></li>";
    project.actors.forEach(function (a) {
      html += '<li role="none"><button type="button" class="st-item" role="option" data-actor="' + a.id + '" aria-selected="' + (sel === a.id) + '">' +
        '<i class="sw" style="background:' + esc(a.color) + '"></i><span class="nm">' + esc(a.name) + '</span><span class="kd">' + a.shape + (a.body !== "none" ? " · " + a.body : "") + "</span>" +
        (a.graph.nodes.length ? '<i class="bpdot" title="Has a Blueprint"></i>' : "") + "</button></li>";
    });
    $("stActors").innerHTML = html;
  }
  $("stActors").addEventListener("click", function (e) { var b = e.target.closest("[data-actor]"); if (b) selectActor(b.getAttribute("data-actor")); });
  $("stActors").addEventListener("dblclick", function (e) { var b = e.target.closest("[data-actor]"); if (b) { showTab("graph"); } });

  /* Add actor */
  var SHAPE_NAMES = { box: "Box", sphere: "Sphere", cylinder: "Cylinder", cone: "Cone", capsule: "Capsule", torus: "Ring", sign: "Sign" };
  var SHAPE_COLORS = { box: "#94a3b8", sphere: "#f97316", cylinder: "#22c55e", cone: "#e11d48", capsule: "#3b82f6", torus: "#a855f7", sign: "#1e293b" };
  $("stAddActor").addEventListener("click", function (e) {
    var items = S.SHAPES.map(function (s) { return '<button type="button" role="menuitem" data-shape="' + s + '"><i class="sw" style="background:' + SHAPE_COLORS[s] + '"></i>' + SHAPE_NAMES[s] + "</button>"; }).join("");
    if (sel !== "level") items += '<button type="button" role="menuitem" data-shape="copy">' + icon("s-copy") + "Copy of " + esc(actorById(sel).name) + "</button>";
    openMenu($("stActorMenu"), items, e.currentTarget);
  });
  $("stActorMenu").addEventListener("click", function (e) {
    var b = e.target.closest("[data-shape]"); if (!b) return;
    closeMenu();
    var shape = b.getAttribute("data-shape");
    if (shape === "copy") return duplicateActor();
    addActor({ id: newId("a"), name: uniqueName(SHAPE_NAMES[shape]), shape: shape, pos: { x: 0, y: shape === "sign" ? 2 : 0.5, z: 2 }, rot: { x: 0, y: 0, z: 0 },
      scale: shape === "sign" ? { x: 3, y: 1.2, z: 1 } : { x: 1, y: 1, z: 1 }, color: SHAPE_COLORS[shape], tags: [], visible: true,
      body: shape === "sign" ? "none" : "solid", gravity: true, collide: shape !== "sign", text: shape === "sign" ? "Hello!" : "", graph: { nodes: [], links: [] } });
  });
  /* A copy keeps the Blueprint, tags and settings and sits beside the original. */
  function duplicateActor() {
    var a = clone(actorById(sel));
    a.id = newId("a"); a.name = uniqueName(a.name.replace(/ \d+$/, "")); a.pos = { x: a.pos.x + 1.5, y: a.pos.y, z: a.pos.z };
    addActor(a);
  }
  function addActor(a) {
    project.actors.push(a);
    commit("Added " + a.name + ".");
    sel = a.id; selNode = null;
    renderAll(true);
  }
  function openMenu(menu, html, anchor) {
    menu.innerHTML = html;
    menu.classList.remove("hidden");
    var r = anchor.getBoundingClientRect();
    menu.style.left = Math.min(r.left, window.innerWidth - menu.offsetWidth - 8) + "px";
    menu.style.top = Math.min(r.bottom + 4, window.innerHeight - menu.offsetHeight - 8) + "px";
    var first = menu.querySelector("button"); if (first) first.focus();
    setTimeout(function () { document.addEventListener("pointerdown", outsideMenu, true); }, 0);
    menu.__anchor = anchor;
  }
  function outsideMenu(e) { if (!$("stActorMenu").contains(e.target)) closeMenu(); }
  function closeMenu() {
    var m = $("stActorMenu");
    if (m.classList.contains("hidden")) return;
    m.classList.add("hidden");
    document.removeEventListener("pointerdown", outsideMenu, true);
  }
  $("stActorMenu").addEventListener("keydown", function (e) {
    var list = Array.prototype.slice.call(e.currentTarget.querySelectorAll("button")), i = list.indexOf(document.activeElement);
    if (e.key === "Escape") { closeMenu(); var a = e.currentTarget.__anchor; if (a) a.focus(); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); list[(i + (e.key === "ArrowDown" ? 1 : list.length - 1)) % list.length].focus(); }
  });

  /* ---------- variables ---------- */
  var VAR_TYPES = { number: "Number", bool: "Boolean", string: "Text", vector: "Vector", color: "Color", actor: "Actor" };
  function valueEditor(type, value, attrs) {
    if (type === "bool") return '<input type="checkbox" ' + attrs + (value ? " checked" : "") + ">";
    if (type === "number") return '<input type="number" step="any" ' + attrs + ' value="' + esc(value) + '">';
    if (type === "color") return '<input type="color" ' + attrs + ' value="' + esc(value) + '">';
    if (type === "vector") return '<span class="st-xyz">' + ["x", "y", "z"].map(function (k) { return '<label data-axis="' + k.toUpperCase() + '"><input type="number" step="any" ' + attrs + ' data-k="' + k + '" value="' + esc(value[k]) + '" aria-label="' + k.toUpperCase() + '"></label>'; }).join("") + "</span>";
    if (type === "actor") return '<span class="st-help">Starts empty; set it with a Set node.</span>';
    return '<input type="text" ' + attrs + ' value="' + esc(value) + '">';
  }
  function renderVars() {
    var html = project.variables.map(function (v, i) {
      return '<li class="st-var"><input type="text" value="' + esc(v.name) + '" data-vname="' + i + '" aria-label="Variable name" maxlength="31">' +
        '<select data-vtype="' + i + '" aria-label="Type of ' + esc(v.name) + '">' + Object.keys(VAR_TYPES).map(function (t) { return '<option value="' + t + '"' + (t === v.type ? " selected" : "") + ">" + VAR_TYPES[t] + "</option>"; }).join("") + "</select>" +
        '<button type="button" class="st-icon" data-vdel="' + i + '" aria-label="Delete ' + esc(v.name) + '">' + icon("s-trash") + "</button>" +
        '<span class="st-var-val">' + valueEditor(v.type, v.value, 'data-vval="' + i + '" aria-label="Starting value of ' + esc(v.name) + '"') + "</span></li>";
    }).join("");
    $("stVars").innerHTML = html || '<li class="st-note">Variables remember things for the whole game: a score, lives, a timer.</li>';
  }
  $("stAddVar").addEventListener("click", function () {
    var n = 1, name = "NewVar";
    while (project.variables.some(function (v) { return v.name === name; })) name = "NewVar" + (++n);
    project.variables.push({ name: name, type: "number", value: 0 });
    commit("Added variable " + name + ".");
    renderVars();
    var inputs = $("stVars").querySelectorAll("[data-vname]"); inputs[inputs.length - 1].select();
  });
  $("stVars").addEventListener("change", function (e) {
    var t = e.target, i;
    if (t.hasAttribute("data-vname")) {
      i = +t.getAttribute("data-vname");
      var old = project.variables[i].name, name = t.value.trim().replace(/[^A-Za-z0-9_ ]/g, "").slice(0, 31);
      if (!/^[A-Za-z_]/.test(name) || project.variables.some(function (v, j) { return j !== i && v.name === name; })) { t.value = old; say("Variable names start with a letter and must be different from the others."); return; }
      project.variables[i].name = name;
      eachNode(function (n) { if (n.data && n.data.var === old) n.data.var = name; });
      commit("Renamed " + old + " to " + name + ".");
    } else if (t.hasAttribute("data-vtype")) {
      i = +t.getAttribute("data-vtype");
      var v = project.variables[i]; v.type = t.value; v.value = v.type === "actor" ? null : S.coerce(v.value, v.type);
      if (v.type === "vector") v.value = { x: v.value.x, y: v.value.y, z: v.value.z };
      commit();
    } else if (t.hasAttribute("data-vval")) {
      i = +t.getAttribute("data-vval");
      var vv = project.variables[i];
      if (vv.type === "vector") vv.value[t.getAttribute("data-k")] = +t.value || 0;
      else vv.value = S.coerce(t.type === "checkbox" ? t.checked : t.value, vv.type);
      commit();
    } else return;
    renderVars(); renderGraph(false);
  });
  $("stVars").addEventListener("click", function (e) {
    var b = e.target.closest("[data-vdel]"); if (!b) return;
    var v = project.variables.splice(+b.getAttribute("data-vdel"), 1)[0];
    commit("Deleted variable " + v.name + ".");
    renderVars(); renderGraph(false);
  });
  function eachNode(fn) { project.level.nodes.forEach(fn); project.actors.forEach(function (a) { a.graph.nodes.forEach(fn); }); }

  /* ---------- details ---------- */
  function field(label, html) { return '<label class="st-field"><span>' + label + "</span>" + html + "</label>"; }
  function xyz(key, v) {
    return '<div class="st-field xyz"><span>' + key.charAt(0).toUpperCase() + key.slice(1) + '</span><span class="st-xyz">' + ["x", "y", "z"].map(function (k) {
      return '<label data-axis="' + k.toUpperCase() + '"><input type="number" step="any" data-xyz="' + key + '" data-k="' + k + '" value="' + (Math.round(v[k] * 1000) / 1000) + '" aria-label="' + key + " " + k.toUpperCase() + '"></label>';
    }).join("") + "</span></div>";
  }
  function select(attr, options, value, labels) {
    return "<select " + attr + ">" + options.map(function (o) { return '<option value="' + o + '"' + (o === value ? " selected" : "") + ">" + esc(labels ? labels[o] || o : o) + "</option>"; }).join("") + "</select>";
  }
  var BODY_HELP = { none: "Moves only when a Blueprint moves it. Others can still overlap it.", solid: "Never moves by itself; blocks moving actors (floors, walls).", dynamic: "Moves with velocity, can fall, and stops against solids (players, balls)." };
  function renderDetails() {
    var html = "";
    var n = selNode && nodeById(selNode);
    if (n) {
      var d = NODES[n.type];
      html += '<div class="st-sec"><h3>Node · ' + esc(nodeTitle(n)) + '</h3><p class="st-help">' + esc(d.help) + '</p><p class="st-help" style="color:var(--muted)">' + d.cat + (d.kind === "pure" ? " · gives values, no white wire" : d.kind === "event" ? " · an event: starts a white wire" : " · an action: runs when the white wire reaches it") + "</p></div>";
    }
    if (sel === "level") {
      var w = project.world;
      html += '<div class="st-sec"><h3>World</h3>' +
        field("Sky", '<input type="color" data-world="sky" value="' + esc(w.sky) + '">') +
        field("Gravity", '<input type="number" step="any" data-world="gravity" value="' + w.gravity + '">') +
        field("Camera", select('data-world="camera"', S.CAMERA_MODES, w.camera, { follow: "Follow the player", "top-down": "Top-down", side: "Side-on", fixed: "Fixed overview" })) +
        field("Distance", '<input type="number" step="any" min="2" max="80" data-world="distance" value="' + w.distance + '">') +
        field("Brightness", '<input type="range" min="0.2" max="2" step="0.1" data-world="light" value="' + w.light + '">') +
        '<label class="st-check"><input type="checkbox" data-world="fog"' + (w.fog ? " checked" : "") + "> Fog in the distance</label>" +
        '<p class="st-help">The camera follows the actor named Player (or tagged player). The Level Blueprint runs once for the whole game: good for timers, scores and messages.</p></div>';
    } else {
      var a = actorById(sel);
      html += '<div class="st-sec"><h3>Actor</h3>' +
        field("Name", '<input type="text" data-a="name" maxlength="40" value="' + esc(a.name) + '">') +
        field("Shape", select('data-a="shape"', S.SHAPES, a.shape, SHAPE_NAMES)) +
        field("Color", '<input type="color" data-a="color" value="' + esc(a.color) + '">') +
        (a.shape === "sign" ? field("Sign text", '<input type="text" data-a="text" maxlength="120" value="' + esc(a.text) + '">') : "") +
        field("Tags", '<input type="text" data-a="tags" placeholder="e.g. enemy, coin" value="' + esc(a.tags.join(", ")) + '">') +
        "</div><div class=\"st-sec\"><h3>Transform</h3>" + xyz("pos", a.pos) + xyz("rot", a.rot) + xyz("scale", a.scale) +
        '</div><div class="st-sec"><h3>Physics</h3>' + field("Body", select('data-a="body"', S.BODIES, a.body, { none: "None", solid: "Solid", dynamic: "Dynamic" })) +
        '<p class="st-help">' + BODY_HELP[a.body] + "</p>" +
        (a.body === "dynamic" ? '<label class="st-check"><input type="checkbox" data-a="gravity"' + (a.gravity ? " checked" : "") + "> Falls with gravity</label>" : "") +
        '<label class="st-check"><input type="checkbox" data-a="collide"' + (a.collide ? " checked" : "") + '> Collides and overlaps</label>' +
        '<label class="st-check"><input type="checkbox" data-a="visible"' + (a.visible ? " checked" : "") + "> Visible</label>" +
        '<div class="st-row"><button type="button" class="st-btn" id="stDupActor">' + icon("s-copy") + 'Duplicate</button><button type="button" class="st-btn st-danger" id="stDelActor">' + icon("s-trash") + "Delete actor</button></div></div>";
    }
    $("stDetails").innerHTML = html;
    var dup = $("stDupActor"), del = $("stDelActor");
    if (dup) dup.addEventListener("click", duplicateActor);
    if (del) del.addEventListener("click", function () {
      var a = actorById(sel);
      project.actors = project.actors.filter(function (x) { return x !== a; });
      commit("Deleted " + a.name + ". Undo brings it back.");
      sel = "level"; renderAll(true);
    });
  }
  $("stDetails").addEventListener("change", function (e) {
    var t = e.target;
    if (t.hasAttribute("data-world")) {
      var k = t.getAttribute("data-world");
      var v = t.type === "checkbox" ? t.checked : t.type === "number" || t.type === "range" ? +t.value || 0 : t.value;
      if (k === "distance") v = Math.max(2, Math.min(80, v || 12));
      if (k === "light") v = Math.max(0.2, Math.min(2, v || 1));
      project.world[k] = v;
      commit(); view.showProject(project, null); return;
    }
    var a = actorById(sel); if (!a) return;
    if (t.hasAttribute("data-xyz")) {
      a[t.getAttribute("data-xyz")][t.getAttribute("data-k")] = t.getAttribute("data-xyz") === "scale" ? Math.max(0.05, +t.value || 0.05) : +t.value || 0;
    } else {
      var key = t.getAttribute("data-a");
      if (key === "name") {
        var old = a.name, name = uniqueName(t.value.trim().slice(0, 40) || "Actor", a);
        a.name = name;
        // Blueprints that pick this actor by name follow the rename.
        eachNode(function (n) {
          var ins = n.data && n.data.in; if (!ins) return;
          for (var p in ins) {
            var pin = S.pinOf(n, p, "in");
            if (pin && (pin.type === "actor" || pin.template || (n.type === "GetActorByName" && p === "Name")) && ins[p] === old) ins[p] = name;
          }
        });
      } else if (key === "tags") a.tags = t.value.split(",").map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean);
      else if (t.type === "checkbox") a[key] = t.checked;
      else a[key] = t.value;
    }
    commit();
    renderOutliner(); renderDetails(); view.showProject(project, sel);
    if (t.getAttribute("data-a") === "name") renderGraph(false);
  });

  /* ---------- the Blueprint graph ---------- */
  var bp = $("bp"), world = $("bpWorld"), wires = $("bpWires");
  function cam() { return graphCams[sel] || (graphCams[sel] = { x: 30, y: 30, z: 0.85 }); }
  function applyCam() { var c = cam(); world.style.transform = "translate(" + c.x + "px," + c.y + "px) scale(" + c.z + ")"; }
  function pinColor(type) { return (S.TYPES[type] || S.TYPES.any).color; }
  function linked(g, id, pin, side) {
    for (var i = 0; i < g.links.length; i++) {
      var l = g.links[i];
      if (side === "in" && l.to.node === id && l.to.pin === pin) return true;
      if (side === "out" && l.from.node === id && l.from.pin === pin) return true;
    }
    return false;
  }
  function inlineEditor(n, p, type) {
    var v = n.data && n.data.in && n.data.in[p.name] !== undefined ? n.data.in[p.name] : p.def;
    var a = 'class="bp-in" data-in="' + esc(p.name) + '" aria-label="' + esc(p.name) + '"';
    if (p.template || type === "actor") {
      var names = project.actors.map(function (x) { return x.name; }).filter(function (x, i, arr) { return arr.indexOf(x) === i; });
      var opts = names.map(function (x) { return [x, x]; });
      if (!p.template) opts = (sel === "level" ? [] : [["self", "Self"]]).concat([["", "None"]], opts);
      var cur = v === undefined || v === null ? "" : String(v);
      if (cur === "self" && sel === "level") cur = "";
      return '<select ' + a + ">" + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === cur ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") + "</select>";
    }
    if (type === "bool") return '<input type="checkbox" ' + a + (v === true || v === "true" ? " checked" : "") + ">";
    if (type === "number") return '<input type="number" step="any" ' + a + ' value="' + esc(S.coerce(v, "number")) + '">';
    if (type === "color") return '<input type="color" ' + a + ' value="' + esc(S.coerce(v, "color")) + '">';
    if (type === "vector") { var vv = S.coerce(v, "vector"); return ["x", "y", "z"].map(function (k) { return '<input type="number" step="any" class="bp-in vec" data-in="' + esc(p.name) + '" data-k="' + k + '" aria-label="' + esc(p.name) + " " + k.toUpperCase() + '" value="' + esc(vv[k]) + '">'; }).join(""); }
    return '<input type="text" ' + a + ' value="' + esc(v === undefined || v === null ? "" : typeof v === "object" ? "" : v) + '">';
  }
  function nodeHTML(n) {
    var d = NODES[n.type], g = graph(), data = n.data || {};
    var color = CAT[d.cat] || "#444", pure = d.kind === "pure";
    var head = '<div class="bp-head" style="background:linear-gradient(90deg,' + color + "," + color + 'aa)">' + esc(nodeTitle(n)) +
      (d.kind === "event" ? '<span class="kind">Event</span>' : pure ? '<span class="kind">Value</span>' : "") + "</div>";
    var sets = d.settings.map(function (s) {
      var v = data[s.name] !== undefined ? data[s.name] : s.def, ctl;
      if (s.kind === "select") ctl = select('data-set="' + s.name + '" aria-label="' + s.label + '"', s.options, v);
      else if (s.kind === "variable") {
        var vs = project.variables.map(function (x) { return x.name; });
        if (v && vs.indexOf(v) < 0) vs.unshift(v);
        ctl = vs.length ? select('data-set="var" aria-label="Variable"', vs, v || vs[0]) : '<span>Add a variable first (left panel)</span>';
      } else if (s.kind === "check") ctl = '<input type="checkbox" data-set="' + s.name + '"' + (v ? " checked" : "") + ">";
      else ctl = '<input type="text" data-set="' + s.name + '" value="' + esc(v) + '" maxlength="40">';
      return '<div class="bp-set"><span>' + s.label + "</span>" + ctl + "</div>";
    }).join("");
    var ins = d.in.map(function (p) {
      var type = S.pinType(project, n, p.name, "in"), on = linked(g, n.id, p.name, "in");
      return '<div class="bp-row"><button type="button" class="bp-pin' + (type === "exec" ? " exec" : "") + (on ? " on" : "") + '" style="--pc:' + pinColor(type) + '" data-node="' + n.id + '" data-pin="' + esc(p.name) + '" data-side="in" data-type="' + type + '" aria-label="' + esc(nodeTitle(n)) + " input " + esc(p.name) + " (" + S.TYPES[type].name + ')"></button>' +
        (type === "exec" && p.name === "In" ? "" : '<span class="lbl">' + esc(p.name) + "</span>") + (type !== "exec" && !on ? inlineEditor(n, p, type) : "") + "</div>";
    }).join("");
    var outs = d.out.map(function (p) {
      var type = S.pinType(project, n, p.name, "out"), on = linked(g, n.id, p.name, "out");
      return '<div class="bp-row">' + (type === "exec" && (p.name === "Then") ? "" : '<span class="lbl">' + esc(p.name) + "</span>") +
        '<button type="button" class="bp-pin' + (type === "exec" ? " exec" : "") + (on ? " on" : "") + '" style="--pc:' + pinColor(type) + '" data-node="' + n.id + '" data-pin="' + esc(p.name) + '" data-side="out" data-type="' + type + '" aria-label="' + esc(nodeTitle(n)) + " output " + esc(p.name) + " (" + S.TYPES[type].name + ')"></button></div>';
    }).join("");
    var warn = "";
    if ((n.type === "GetVar" || n.type === "SetVar" || n.type === "IncVar") && !project.variables.some(function (v) { return v.name === data.var; })) warn = '<p class="bp-warn">Pick a variable (or add one on the left).</p>';
    if (sel === "level" && ACTOR_ONLY[n.type]) warn = '<p class="bp-warn">The Level isn\'t an actor, so this never happens here. Use it in an actor\'s Blueprint.</p>';
    return '<div class="bp-node' + (pure ? " pure" : "") + (selNode === n.id ? " sel" : "") + (warn ? " err" : "") + '" data-id="' + n.id + '" tabindex="0" role="group" aria-label="' + esc(nodeTitle(n)) + ' node" style="left:' + n.x + "px;top:" + n.y + 'px">' +
      head + '<div class="bp-body">' + sets + '<div class="bp-col ins">' + ins + '</div><div class="bp-col outs">' + outs + "</div>" + warn + "</div></div>";
  }
  function renderGraph(fit) {
    var g = graph();
    var who = sel === "level" ? "Level Blueprint" : (actorById(sel) ? actorById(sel).name + " · Blueprint" : "Blueprint");
    $("stGraphTitle").textContent = who;
    Array.prototype.forEach.call(world.querySelectorAll(".bp-node"), function (el) { el.remove(); });
    world.insertAdjacentHTML("beforeend", g.nodes.map(nodeHTML).join(""));
    var empty = $("bpEmpty");
    if (!g.nodes.length) {
      empty.innerHTML = "<b>This Blueprint is empty.</b><br>Press <b>Add node</b> (or double-click here) and start with an event: <b>Event BeginPlay</b> runs at the start, <b>Event Tick</b> every frame.";
      empty.classList.remove("hidden");
    } else empty.classList.add("hidden");
    applyCam();
    if (fit) fitGraph(); else drawWires();
  }
  function pinEl(node, pin, side) {
    return world.querySelector('.bp-pin[data-node="' + node + '"][data-side="' + side + '"][data-pin="' + cssEsc(pin) + '"]');
  }
  function cssEsc(s) { return String(s).replace(/["\\]/g, "\\$&"); }
  function pinPoint(el) {
    var r = el.getBoundingClientRect(), w = world.getBoundingClientRect(), z = cam().z;
    return { x: (r.left + r.width / 2 - w.left) / z, y: (r.top + r.height / 2 - w.top) / z };
  }
  function curve(a, b) {
    var dx = Math.max(40, Math.abs(b.x - a.x) * 0.5);
    return "M" + a.x + " " + a.y + " C" + (a.x + dx) + " " + a.y + " " + (b.x - dx) + " " + b.y + " " + b.x + " " + b.y;
  }
  function drawWires(temp) {
    var g = graph(), out = "";
    g.links.forEach(function (l, i) {
      var a = pinEl(l.from.node, l.from.pin, "out"), b = pinEl(l.to.node, l.to.pin, "in");
      if (!a || !b) return;
      var type = a.getAttribute("data-type"), d = curve(pinPoint(a), pinPoint(b));
      out += '<path class="bp-wire' + (type === "exec" ? " exec" : "") + (selWire === i ? " sel" : "") + '" d="' + d + '"' + (type === "exec" ? "" : ' stroke="' + pinColor(type) + '"') + "/>" +
        '<path class="bp-hit" data-wire="' + i + '" d="' + d + '"/>';
    });
    if (temp) out += '<path class="bp-wire live' + (temp.type === "exec" ? " exec" : "") + '" d="' + (temp.side === "out" ? curve(temp.a, temp.b) : curve(temp.b, temp.a)) + '"' + (temp.type === "exec" ? "" : ' stroke="' + pinColor(temp.type) + '"') + "/>";
    wires.innerHTML = out;
  }
  var fitLater = false;
  function fitGraph() {
    // a Blueprint in a hidden tab has no size yet: fit it when it shows
    fitLater = !bp.clientWidth;
    if (fitLater) return;
    var nodes = world.querySelectorAll(".bp-node"), c = cam();
    if (!nodes.length) { c.x = 30; c.y = 30; c.z = 0.9; applyCam(); drawWires(); return; }
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    Array.prototype.forEach.call(nodes, function (el) {
      var x = el.offsetLeft, y = el.offsetTop;
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x + el.offsetWidth); maxY = Math.max(maxY, y + el.offsetHeight);
    });
    var W = bp.clientWidth, H = bp.clientHeight || 400, pad = 30;
    var z = Math.min(1, (W - pad * 2) / (maxX - minX || 1), (H - pad * 2) / (maxY - minY || 1));
    if (z < 0.45) {
      // too big to read whole (a phone): start at the top left, where the events are
      c.z = 0.45; c.x = pad - minX * c.z; c.y = pad - minY * c.z;
    } else {
      c.z = z;
      c.x = (W - (maxX - minX) * c.z) / 2 - minX * c.z;
      c.y = Math.max(pad, (H - (maxY - minY) * c.z) / 2) - minY * c.z;
    }
    applyCam(); drawWires();
  }
  function zoomAt(f, sx, sy) {
    var c = cam(), r = bp.getBoundingClientRect();
    var px = sx === undefined ? r.width / 2 : sx - r.left, py = sy === undefined ? r.height / 2 : sy - r.top;
    var z = Math.max(0.25, Math.min(1.6, c.z * f));
    c.x = px - (px - c.x) * (z / c.z); c.y = py - (py - c.y) * (z / c.z); c.z = z;
    applyCam(); drawWires();
  }
  function toWorld(sx, sy) { var c = cam(), r = bp.getBoundingClientRect(); return { x: (sx - r.left - c.x) / c.z, y: (sy - r.top - c.y) / c.z }; }
  $("stZoomIn").addEventListener("click", function () { zoomAt(1.2); });
  $("stZoomOut").addEventListener("click", function () { zoomAt(1 / 1.2); });
  $("stFit").addEventListener("click", fitGraph);
  function measureNode(n) {
    var el = world.querySelector('.bp-node[data-id="' + cssEsc(n.id) + '"]');
    return el ? { w: el.offsetWidth, h: el.offsetHeight } : null;
  }
  $("stTidy").addEventListener("click", function () {
    if (!graph().nodes.length) return;
    S.tidy(graph(), measureNode);
    renderGraph(true); commit("Tidied up.");
  });
  bp.addEventListener("wheel", function (e) { e.preventDefault(); zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); }, { passive: false });

  /* Wires: a drag from pin to pin, or a tap on one pin then another. */
  function pinInfo(el) { return { node: el.getAttribute("data-node"), pin: el.getAttribute("data-pin"), side: el.getAttribute("data-side"), type: el.getAttribute("data-type") }; }
  function connect(p, q) {
    if (p.side === q.side || p.node === q.node) return false;
    var from = p.side === "out" ? p : q, to = p.side === "out" ? q : p;
    if (!S.compatible(from.type, to.type)) { say("Those pins don't fit: a " + S.TYPES[from.type].name + " can't go into a " + S.TYPES[to.type].name + "."); return false; }
    var g = graph();
    g.links = g.links.filter(function (l) {
      if (from.type === "exec") return !(l.from.node === from.node && l.from.pin === from.pin);
      return !(l.to.node === to.node && l.to.pin === to.pin);
    });
    g.links.push({ from: { node: from.node, pin: from.pin }, to: { node: to.node, pin: to.pin } });
    commit("Wired " + from.pin + " to " + to.pin + ".");
    renderGraph(false);
    return true;
  }
  function breakPin(p) {
    var g = graph(), before = g.links.length;
    g.links = g.links.filter(function (l) { return !(p.side === "out" ? l.from.node === p.node && l.from.pin === p.pin : l.to.node === p.node && l.to.pin === p.pin); });
    if (g.links.length !== before) { commit("Unwired " + p.pin + "."); renderGraph(false); }
  }
  function setArmed(p) {
    armed = p;
    Array.prototype.forEach.call(world.querySelectorAll(".bp-pin"), function (el) {
      var i = pinInfo(el);
      el.classList.toggle("armed", !!p && i.node === p.node && i.pin === p.pin && i.side === p.side);
      el.classList.toggle("dim", !!p && !(i.node === p.node && i.pin === p.pin && i.side === p.side) && (i.side === p.side || i.node === p.node || !S.compatible(p.side === "out" ? p.type : i.type, p.side === "out" ? i.type : p.type)));
    });
  }
  function selectNode(id) {
    selNode = id; selWire = null;
    Array.prototype.forEach.call(world.querySelectorAll(".bp-node"), function (el) { el.classList.toggle("sel", el.getAttribute("data-id") === id); });
    renderDetails(); drawWires();
  }

  var drag = null, pointers = {};
  bp.addEventListener("pointerdown", function (e) {
    if (e.button === 2) return;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pointers);
    if (ids.length === 2) { // pinch
      var a = pointers[ids[0]], b = pointers[ids[1]];
      drag = { kind: "pinch", dist: Math.hypot(a.x - b.x, a.y - b.y), z: cam().z };
      return;
    }
    var t = e.target;
    if (t.closest("input, select, textarea, label")) return;
    var pin = t.closest(".bp-pin");
    if (pin) {
      e.preventDefault();
      if (e.altKey) { breakPin(pinInfo(pin)); return; }
      drag = { kind: "wire", from: pinInfo(pin), a: pinPoint(pin), sx: e.clientX, sy: e.clientY, moved: false };
      bp.setPointerCapture(e.pointerId);
      return;
    }
    var hit = t.closest(".bp-hit");
    if (hit) { selWire = +hit.getAttribute("data-wire"); selNode = null; renderDetails(); renderGraph(false); bp.focus(); return; }
    var node = t.closest(".bp-node");
    if (node) {
      var id = node.getAttribute("data-id");
      if (selNode !== id) selectNode(id);
      if (t.closest(".bp-head")) {
        var n = nodeById(id);
        drag = { kind: "node", id: id, el: node, ox: n.x, oy: n.y, sx: e.clientX, sy: e.clientY, moved: false };
        bp.setPointerCapture(e.pointerId);
        e.preventDefault();
      }
      return;
    }
    // the background: pan
    if (armed) setArmed(null);
    if (selNode || selWire !== null) { selNode = null; selWire = null; renderDetails(); renderGraph(false); }
    drag = { kind: "pan", sx: e.clientX, sy: e.clientY, cx: cam().x, cy: cam().y, moved: false };
    bp.classList.add("panning");
    bp.setPointerCapture(e.pointerId);
  });
  bp.addEventListener("pointermove", function (e) {
    if (pointers[e.pointerId]) pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (!drag) return;
    var c = cam();
    if (drag.kind === "pinch") {
      var ids = Object.keys(pointers); if (ids.length < 2) return;
      var a = pointers[ids[0]], b = pointers[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(Math.max(0.25, Math.min(1.6, drag.z * d / drag.dist)) / c.z, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
    if (drag.kind === "pan") { c.x = drag.cx + dx; c.y = drag.cy + dy; applyCam(); }
    else if (drag.kind === "node") {
      var n = nodeById(drag.id);
      n.x = Math.round((drag.ox + dx / c.z) / 8) * 8; n.y = Math.round((drag.oy + dy / c.z) / 8) * 8;
      drag.el.style.left = n.x + "px"; drag.el.style.top = n.y + "px";
      drawWires();
    } else if (drag.kind === "wire" && drag.moved) {
      drawWires({ a: drag.a, b: toWorld(e.clientX, e.clientY), side: drag.from.side, type: drag.from.type });
    }
  });
  function endPointer(e) {
    delete pointers[e.pointerId];
    if (!drag) return;
    var d = drag; drag = null;
    bp.classList.remove("panning");
    if (d.kind === "node" && d.moved) commit();
    if (d.kind !== "wire") return;
    if (!d.moved) { // a tap: arm, or finish an armed wire
      if (armed && !(armed.node === d.from.node && armed.pin === d.from.pin && armed.side === d.from.side)) { var a = armed; setArmed(null); connect(a, d.from); }
      else if (armed) setArmed(null);
      else { setArmed(d.from); say("Pin " + d.from.pin + " picked. Tap a pin of a matching colour to wire it, or the background to cancel."); }
      return;
    }
    var under = document.elementFromPoint(e.clientX, e.clientY), pin = under && under.closest ? under.closest(".bp-pin") : null;
    if (pin) { if (!connect(d.from, pinInfo(pin))) drawWires(); }
    else { drawWires(); openPalette(e.clientX, e.clientY, d.from); }
  }
  bp.addEventListener("pointerup", endPointer);
  bp.addEventListener("pointercancel", function (e) { delete pointers[e.pointerId]; drag = null; bp.classList.remove("panning"); drawWires(); });
  bp.addEventListener("dblclick", function (e) { if (!e.target.closest(".bp-node")) openPalette(e.clientX, e.clientY, null); });
  bp.addEventListener("contextmenu", function (e) {
    var pin = e.target.closest(".bp-pin");
    e.preventDefault();
    if (pin) breakPin(pinInfo(pin)); else if (!e.target.closest(".bp-node")) openPalette(e.clientX, e.clientY, null);
  });
  /* keyboard: Enter on a pin picks it, Enter on another wires them */
  bp.addEventListener("click", function (e) {
    var pin = e.target.closest(".bp-pin");
    if (!pin || e.detail !== 0) return; // keyboard activation only (pointer taps are handled above)
    var p = pinInfo(pin);
    if (armed && !(armed.node === p.node && armed.pin === p.pin && armed.side === p.side)) { var a = armed; setArmed(null); connect(a, p); }
    else { setArmed(armed ? null : p); if (armed) say("Pin " + p.pin + " picked. Move to another pin and press Enter to wire them."); }
  });
  bp.addEventListener("change", function (e) {
    var t = e.target, el = t.closest(".bp-node"); if (!el) return;
    var n = nodeById(el.getAttribute("data-id")); if (!n) return;
    n.data = n.data || {};
    if (t.hasAttribute("data-set")) {
      var key = t.getAttribute("data-set");
      n.data[key] = t.type === "checkbox" ? t.checked : t.value;
      commit(); renderGraph(false); renderDetails();
      return;
    }
    var name = t.getAttribute("data-in"); if (!name) return;
    n.data.in = n.data.in || {};
    var p = S.pinOf(n, name, "in"), type = S.pinType(project, n, name, "in");
    if (t.hasAttribute("data-k")) {
      var cur = S.coerce(n.data.in[name] !== undefined ? n.data.in[name] : p.def, "vector");
      cur = { x: cur.x, y: cur.y, z: cur.z }; cur[t.getAttribute("data-k")] = +t.value || 0; n.data.in[name] = cur;
    } else if (t.type === "checkbox") n.data.in[name] = t.checked;
    else if (type === "number") n.data.in[name] = +t.value || 0;
    else if (type === "any") n.data.in[name] = /^-?\d+(\.\d+)?$/.test(t.value.trim()) ? +t.value : t.value === "true" ? true : t.value === "false" ? false : t.value;
    else n.data.in[name] = t.value;
    commit();
  });
  bp.addEventListener("keydown", function (e) {
    if (e.target.closest("input, select, textarea")) return;
    var n = selNode && nodeById(selNode);
    if ((e.key === "Delete" || e.key === "Backspace") && (n || selWire !== null)) { e.preventDefault(); deleteSelection(); }
    else if (n && e.key.indexOf("Arrow") === 0) {
      e.preventDefault();
      var step = e.shiftKey ? 64 : 16;
      if (e.key === "ArrowLeft") n.x -= step; if (e.key === "ArrowRight") n.x += step; if (e.key === "ArrowUp") n.y -= step; if (e.key === "ArrowDown") n.y += step;
      commit(); renderGraph(false); var el = world.querySelector('[data-id="' + n.id + '"]'); if (el) el.focus();
    } else if (e.key === "Escape" && armed) setArmed(null);
  });
  world.addEventListener("focusin", function (e) { var el = e.target.closest(".bp-node"); if (el && e.target === el && selNode !== el.getAttribute("data-id")) selectNode(el.getAttribute("data-id")); });
  function deleteSelection() {
    var g = graph();
    if (selWire !== null && g.links[selWire]) { g.links.splice(selWire, 1); selWire = null; commit("Wire removed."); renderGraph(false); return; }
    if (!selNode) return;
    var n = nodeById(selNode);
    g.nodes = g.nodes.filter(function (x) { return x.id !== selNode; });
    g.links = g.links.filter(function (l) { return l.from.node !== selNode && l.to.node !== selNode; });
    selNode = null;
    commit(nodeTitle(n) + " deleted.");
    renderGraph(false); renderDetails(); renderOutliner(); bp.focus();
  }
  function duplicate() {
    var n = selNode && nodeById(selNode); if (!n) return;
    var c = clone(n); c.id = nextNodeId(); c.x += 32; c.y += 32;
    graph().nodes.push(c);
    commit(nodeTitle(c) + " duplicated.");
    selNode = c.id; renderGraph(false); renderDetails();
  }
  $("stDel").addEventListener("click", deleteSelection);
  $("stDup").addEventListener("click", duplicate);

  /* ---------- the node palette ---------- */
  var pal = { at: null, from: null, items: [], index: 0 };
  function paletteItems(q, from) {
    q = q.trim().toLowerCase();
    var out = [];
    Object.keys(NODES).forEach(function (type) {
      var d = NODES[type];
      if (sel === "level" && ACTOR_ONLY[type]) return;
      if (type === "GetVar" || type === "SetVar" || type === "IncVar") return;
      out.push({ type: type, title: d.title, cat: d.cat, help: d.help, data: {} });
    });
    project.variables.forEach(function (v) {
      out.push({ type: "GetVar", title: "Get " + v.name, cat: "Variables", help: "Reads " + v.name + ".", data: { var: v.name } });
      out.push({ type: "SetVar", title: "Set " + v.name, cat: "Variables", help: "Changes " + v.name + ".", data: { var: v.name } });
      if (v.type === "number") out.push({ type: "IncVar", title: "Increment " + v.name, cat: "Variables", help: "Adds to " + v.name + ".", data: { var: v.name } });
    });
    if (!project.variables.length) out.push({ type: "GetVar", title: "Get (variable)", cat: "Variables", help: "Reads a game variable — add one on the left first.", data: {} });
    if (from) out = out.filter(function (it) { return !!matchPin(it, from); });
    if (q) {
      var words = q.split(/\s+/);
      out = out.filter(function (it) { var hay = (it.title + " " + it.help + " " + it.cat + " " + it.type).toLowerCase(); return words.every(function (w) { return hay.indexOf(w) >= 0; }); });
    }
    var order = {}; S.CATEGORIES.forEach(function (c, i) { order[c.id] = i; });
    out.sort(function (a, b) { return order[a.cat] - order[b.cat]; });
    return out;
  }
  /* The pin on a new node that a dragged wire should join. */
  function matchPin(it, from) {
    var fake = { type: it.type, data: it.data }, d = NODES[it.type], list = from.side === "out" ? d.in : d.out;
    for (var i = 0; i < list.length; i++) {
      var t = S.pinType(project, fake, list[i].name, from.side === "out" ? "in" : "out");
      if (from.side === "out" ? S.compatible(from.type, t) : S.compatible(t, from.type)) return list[i].name;
    }
    return null;
  }
  function openPalette(sx, sy, from) {
    var w = toWorld(sx, sy);
    pal = { at: w, from: from, items: [], index: 0 };
    var el = $("stPalette");
    el.classList.remove("hidden");
    var W = el.offsetWidth, H = el.offsetHeight;
    el.style.left = Math.max(8, Math.min(sx, window.innerWidth - W - 8)) + "px";
    el.style.top = Math.max(8, Math.min(sy, window.innerHeight - H - 8)) + "px";
    $("stPalHint").textContent = from ? "Showing nodes that fit " + from.pin + " (" + S.TYPES[from.type].name + ")." : "Every node, by category. Type to search.";
    $("stPalSearch").value = "";
    paintPalette();
    $("stPalSearch").focus();
  }
  function closePalette() { $("stPalette").classList.add("hidden"); bp.focus(); }
  function paintPalette() {
    pal.items = paletteItems($("stPalSearch").value, pal.from);
    pal.index = Math.min(pal.index, Math.max(0, pal.items.length - 1));
    var html = "", cat = null;
    pal.items.forEach(function (it, i) {
      if (it.cat !== cat) { cat = it.cat; html += '<div class="st-pal-cat" role="presentation"><i style="background:' + CAT[cat] + '"></i>' + cat + "</div>"; }
      html += '<button type="button" class="st-pal-item" role="option" id="pal' + i + '" data-i="' + i + '" aria-selected="' + (i === pal.index) + '"><b>' + esc(it.title) + "</b><span>" + esc(it.help) + "</span></button>";
    });
    $("stPalList").innerHTML = html || '<p class="st-note">Nothing matches. Try another word.</p>';
    $("stPalSearch").setAttribute("aria-activedescendant", pal.items.length ? "pal" + pal.index : "");
  }
  function addFromPalette(it) {
    if (!it) return;
    var n = { id: nextNodeId(), type: it.type, x: Math.round(pal.at.x / 8) * 8, y: Math.round(pal.at.y / 8) * 8, data: clone(it.data) };
    if ((it.type === "GetVar" || it.type === "SetVar") && !n.data.var && project.variables[0]) n.data.var = project.variables[0].name;
    graph().nodes.push(n);
    var from = pal.from;
    closePalette();
    if (from) {
      var pinName = matchPin(it, from);
      var g = graph(), fromNode = from.side === "out" ? from : { node: n.id, pin: pinName }, toNode = from.side === "out" ? { node: n.id, pin: pinName } : from;
      var outType = from.side === "out" ? from.type : S.pinType(project, n, pinName, "out");
      g.links = g.links.filter(function (l) { return outType === "exec" ? !(l.from.node === fromNode.node && l.from.pin === fromNode.pin) : !(l.to.node === toNode.node && l.to.pin === toNode.pin); });
      g.links.push({ from: { node: fromNode.node, pin: fromNode.pin }, to: { node: toNode.node, pin: toNode.pin } });
    }
    selNode = n.id;
    commit(nodeTitle(n) + " added.");
    renderGraph(false); renderDetails(); renderOutliner();
    var el = world.querySelector('[data-id="' + n.id + '"]'); if (el) el.focus({ preventScroll: true });
  }
  $("stPalSearch").addEventListener("input", function () { pal.index = 0; paintPalette(); });
  $("stPalSearch").addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      pal.index = Math.max(0, Math.min(pal.items.length - 1, pal.index + (e.key === "ArrowDown" ? 1 : -1)));
      paintPalette();
      var it = $("pal" + pal.index); if (it) it.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") { e.preventDefault(); addFromPalette(pal.items[pal.index]); }
    else if (e.key === "Escape") { e.preventDefault(); closePalette(); }
  });
  $("stPalList").addEventListener("click", function (e) { var b = e.target.closest("[data-i]"); if (b) addFromPalette(pal.items[+b.getAttribute("data-i")]); });
  $("stPalClose").addEventListener("click", closePalette);
  $("stPalette").addEventListener("keydown", function (e) { if (e.key === "Escape") closePalette(); });
  document.addEventListener("pointerdown", function (e) { if (!$("stPalette").classList.contains("hidden") && !$("stPalette").contains(e.target)) $("stPalette").classList.add("hidden"); }, true);
  $("stAddNode").addEventListener("click", function () {
    var r = bp.getBoundingClientRect();
    openPalette(r.left + Math.min(r.width / 2 - 100, 60), r.top + 40, null);
  });

  /* ---------- tabs (narrow screens) ---------- */
  function showTab(name) {
    $("stMain").setAttribute("data-tab", name);
    Array.prototype.forEach.call(document.querySelectorAll(".st-tabs [data-tab]"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-tab") === name)); });
    if (name === "scene") setTimeout(view.resize, 30);
    if (name === "graph") setTimeout(function () { if (fitLater) fitGraph(); else drawWires(); }, 30);
  }
  Array.prototype.forEach.call(document.querySelectorAll(".st-tabs [data-tab]"), function (b) { b.addEventListener("click", function () { showTab(b.getAttribute("data-tab")); }); });

  /* ---------- name, undo, shortcuts ---------- */
  $("stName").addEventListener("change", function () { project.name = $("stName").value.trim().slice(0, 60) || "My Game"; $("stName").value = project.name; document.title = project.name + " — Code Block Studio"; commit(); });
  $("stUndo").addEventListener("click", undo);
  $("stRedo").addEventListener("click", redo);
  document.addEventListener("keydown", function (e) {
    if (playing) return;
    var typing = e.target.closest && e.target.closest("input, select, textarea");
    var mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === "z" && !typing) { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
    else if (mod && e.key.toLowerCase() === "y" && !typing) { e.preventDefault(); redo(); }
    else if (mod && e.key.toLowerCase() === "d" && !typing && selNode) { e.preventDefault(); duplicate(); }
    else if (!typing && !mod && e.target.closest && !e.target.closest(".bp") && /^[wer]$/i.test(e.key) && !e.altKey) setGizmo({ w: "move", e: "rotate", r: "scale" }[e.key.toLowerCase()]);
    else if (!typing && !mod && (e.key === "f" || e.key === "F") && sel !== "level" && e.target.closest && !e.target.closest(".bp")) view.frame(sel);
  });

  /* ---------- sheets: help and games ---------- */
  var lastFocus = null;
  function openSheet(title, html) {
    lastFocus = document.activeElement;
    $("stSheetTitle").textContent = title;
    $("stSheetBody").innerHTML = html;
    $("stSheet").classList.remove("hidden");
    $("stSheetClose").focus();
  }
  function closeSheet() { $("stSheet").classList.add("hidden"); if (lastFocus) try { lastFocus.focus(); } catch (e) {} }
  $("stSheetClose").addEventListener("click", closeSheet);
  $("stSheet").addEventListener("click", function (e) { if (e.target === $("stSheet")) closeSheet(); });
  $("stSheet").addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeSheet(); return; }
    if (e.key !== "Tab") return;
    var f = Array.prototype.filter.call($("stSheet").querySelectorAll("button, input, a"), function (x) { return x.offsetParent !== null; });
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  function helpHTML() {
    var legend = ["exec", "bool", "number", "string", "vector", "actor", "color"].map(function (t) { return '<li><i style="border-color:' + S.TYPES[t].color + '"></i>' + (t === "exec" ? "White: what happens next" : S.TYPES[t].name) + "</li>"; }).join("");
    return "<p>Studio makes 3D games without writing code. A game is a <b>level</b> full of <b>actors</b> (boxes, balls, signs…), and each actor has a <b>Blueprint</b>: a little machine of nodes joined by wires, just like Unreal Engine's.</p>" +
      "<h3>1 · Events start things</h3><p>Red nodes are events: <b>Event BeginPlay</b> (once, at the start), <b>Event Tick</b> (every frame), <b>On Key Pressed</b>, <b>On Begin Overlap</b> (something touched me), <b>On Clicked</b>… An event sends a <b>white wire</b> to the next thing to do.</p>" +
      "<h3>2 · White wires run actions, in order</h3><p>Follow the white wire: Add Actor World Offset, then Play Sound, then Destroy Actor. <b>Branch</b> picks a path; <b>Sequence</b>, loops and <b>Delay</b> shape the flow.</p>" +
      "<h3>3 · Coloured wires carry values</h3><ul class=\"st-legend\">" + legend + "</ul><p>Values come from green-edged nodes like <b>+ Add</b>, <b>Get Score</b> or <b>Get Actor Location</b>. A pin with no wire uses the value typed into its box.</p>" +
      "<h3>Building</h3><ul><li><b>Add node</b>, or double-click the graph. Drag from a pin and let go on empty space to get only the nodes that fit.</li><li>Wire pins by dragging from one to another, or tap one pin and then the other (handy on a phone). Right-click (or Alt-click) a pin to unwire it.</li><li>Drag a node's title to move it; drag the background to pan; scroll or pinch to zoom.</li><li>Select an actor in the Outliner or the 3D view; move, turn and size it with the handles (<kbd>W</kbd> <kbd>E</kbd> <kbd>R</kbd>).</li><li><kbd>Ctrl</kbd>+<kbd>Z</kbd> undoes, <kbd>Ctrl</kbd>+<kbd>D</kbd> duplicates a node, <kbd>Delete</kbd> removes it.</li></ul>" +
      "<h3>Playing</h3><p>Press <b>Play</b>. Move with <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or the arrows, jump with <kbd>Space</kbd>; on a phone, use the on-screen pad. <kbd>Esc</kbd> or <b>Stop</b> goes back to the editor — the level resets, so play as often as you like.</p>" +
      "<h3>Saving</h3><p>Your games save on this device as you work. Use <b>Games</b> to switch between them, start from a ready-made game, or export a game as a file to share or keep.</p>";
  }
  $("stHelp").addEventListener("click", function () { openSheet("How Studio works", helpHTML()); });
  function gamesHTML() {
    var ids = Object.keys(store.games).sort(function (a, b) { return (store.games[b].updated || 0) - (store.games[a].updated || 0); });
    var list = ids.map(function (id) {
      var g = store.games[id], p = g.project || {};
      return '<li class="' + (id === gameId ? "cur" : "") + '"><span class="gm"><b>' + esc(p.name || "My Game") + "</b><span>" + ((p.actors || []).length) + " actors · " + (id === gameId ? "open now" : new Date(g.updated || 0).toLocaleDateString()) + "</span></span>" +
        (id === gameId ? "" : '<button type="button" class="st-mini" data-open="' + id + '">Open</button>') +
        '<button type="button" class="st-icon" data-export="' + id + '" aria-label="Export ' + esc(p.name || "game") + ' as a file">' + icon("s-download") + "</button>" +
        '<button type="button" class="st-icon" data-delete="' + id + '" aria-label="Delete ' + esc(p.name || "game") + '">' + icon("s-trash") + "</button></li>";
    }).join("");
    var cards = SAMPLES.map(function (s) { return '<button type="button" class="st-card" data-sample="' + s.id + '"><b>' + esc(s.name) + "</b><span>" + esc(s.blurb) + "</span></button>"; }).join("");
    return "<h3>Start a new game</h3><div class=\"st-cards\">" + cards + "</div>" +
      "<h3>Your games on this device</h3><ul class=\"st-games\">" + list + "</ul>" +
      '<div class="st-row"><button type="button" class="st-btn" id="stImport">' + icon("s-upload") + "Import a game file</button></div>";
  }
  function showGames() {
    openSheet("Games", gamesHTML());
  }
  $("stGames").addEventListener("click", showGames);
  $("stSheetBody").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-sample")) {
      var s = SAMPLES.filter(function (x) { return x.id === b.getAttribute("data-sample"); })[0];
      closeSheet(); addStarter(s); say(s.name + " is open. Press Play to try it, then read its Blueprints.");
    } else if (b.hasAttribute("data-open")) { closeSheet(); openGame(b.getAttribute("data-open")); say(project.name + " is open."); }
    else if (b.hasAttribute("data-export")) exportGame(b.getAttribute("data-export"));
    else if (b.hasAttribute("data-delete")) {
      var id = b.getAttribute("data-delete"), name = (store.games[id].project || {}).name || "this game";
      if (b.getAttribute("data-armed") !== "1") { b.setAttribute("data-armed", "1"); b.setAttribute("aria-label", "Press again to delete " + name); b.classList.add("st-danger"); say("Press again to delete " + name + " for good."); return; }
      delete store.games[id];
      if (id === gameId) { var rest = Object.keys(store.games); if (rest.length) openGame(rest[0]); else addStarter(SAMPLES[0]); }
      persist(); $("stSheetBody").innerHTML = gamesHTML(); say(name + " deleted.");
    } else if (b.id === "stImport") $("stFile").click();
  });
  function exportGame(id) {
    var g = store.games[id]; if (!g) return;
    var blob = new Blob([JSON.stringify({ codeBlockStudio: 1, project: id === gameId ? project : g.project }, null, 1)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = ((g.project && g.project.name) || "game").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").toLowerCase() + ".codeblock.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  $("stFile").addEventListener("change", function () {
    var f = $("stFile").files[0]; if (!f) return;
    if (f.size > 2e6) { say("That file is too big to be a Studio game."); return; }
    var r = new FileReader();
    r.onload = function () {
      try {
        var data = JSON.parse(r.result), p = data && data.project ? data.project : data;
        if (!p || !Array.isArray(p.actors)) throw new Error("no actors");
        closeSheet(); addGame(p); say(project.name + " imported.");
      } catch (e) { say("That file isn't a Studio game."); openSheet("Import", "<p>That file isn't a Code Block Studio game. Games are exported from the Games menu as <b>.codeblock.json</b> files.</p>"); }
      $("stFile").value = "";
    };
    r.readAsText(f);
  });

  /* ---------- play ---------- */
  var playing = null;
  var KEYMAP = { ArrowUp: "Up", ArrowDown: "Down", ArrowLeft: "Left", ArrowRight: "Right", " ": "Space", Spacebar: "Space", Enter: "Enter", Shift: "Shift" };
  function keyName(e) { if (KEYMAP[e.key]) return KEYMAP[e.key]; if (/^[a-z0-9]$/i.test(e.key)) return e.key.toUpperCase(); return null; }
  function gameStorage() {
    var key = "code-block-studio-save-" + gameId;
    return {
      get: function (k) { try { var m = JSON.parse(localStorage.getItem(key) || "{}"); return m[k]; } catch (e) { return undefined; } },
      set: function (k, v) { try { var m = JSON.parse(localStorage.getItem(key) || "{}"); m[k] = v; localStorage.setItem(key, JSON.stringify(m)); } catch (e) {} }
    };
  }
  function startGame() {
    var g = new S.Game(project, { storage: gameStorage() });
    hudCache = ""; msgCache = ""; printCache = "";
    view.play(g, onFrame);
    playing = g;
    return g;
  }
  function play() {
    if (playing) return;
    document.body.classList.add("playing");
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) document.body.classList.add("touch");
    $("stGame").classList.remove("hidden");
    view.resize();
    startGame();
    view.sound("click");
    $("stStop").focus();
    say("Playing " + project.name + ". Press Escape or Stop to go back to the editor.");
  }
  function stop() {
    if (!playing) return;
    view.stop(); playing = null;
    document.body.classList.remove("playing");
    $("stGame").classList.add("hidden");
    $("stHud").innerHTML = ""; $("stPrints").innerHTML = ""; $("stMsg").classList.add("hidden");
    var err = $("stGame").querySelector(".st-err"); if (err) err.remove();
    setTimeout(function () { view.resize(); view.showProject(project, sel === "level" ? null : sel); }, 30);
    $("stPlay").focus();
    say("Back in the editor.");
  }
  var hudCache = "", msgCache = "", printCache = "";
  function onFrame(g) {
    if (g.request === "restart") { g.request = null; view.stop(); startGame(); return; }
    if (g.request === "quit") { stop(); return; }
    var h = g.hud, html = "";
    Object.keys(h.slots).forEach(function (k) { html += '<span class="st-chip"><span>' + esc(k) + "</span>" + esc(h.slots[k]) + "</span>"; });
    Object.keys(h.bars).forEach(function (k) { var b = h.bars[k]; html += '<span class="st-chip st-bar"><span>' + esc(k) + '</span><i><b style="width:' + Math.round(b.value * 100) + "%;background:" + b.color + '"></b></i></span>'; });
    if (html !== hudCache) { $("stHud").innerHTML = html; hudCache = html; }
    var m = h.message, mk = m ? m.title + "|" + m.sub : "";
    if (mk !== msgCache) {
      msgCache = mk;
      var el = $("stMsg");
      if (m) { el.innerHTML = "<b>" + esc(m.title) + "</b>" + (m.sub ? "<span>" + esc(m.sub) + "</span>" : ""); el.classList.remove("hidden"); el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
      else el.classList.add("hidden");
    }
    var pk = h.prints.map(function (p) { return p.text + p.color; }).join("|");
    if (pk !== printCache) { printCache = pk; $("stPrints").innerHTML = h.prints.map(function (p) { return '<p style="color:' + p.color + '">' + esc(p.text) + "</p>"; }).join(""); }
    if (g.error && !$("stGame").querySelector(".st-err")) {
      var e = document.createElement("p"); e.className = "st-err"; e.setAttribute("role", "alert"); e.textContent = g.error + " Press Stop to fix it in the editor.";
      $("stGame").appendChild(e);
    }
  }
  $("stPlay").addEventListener("click", play);
  $("stStop").addEventListener("click", stop);
  document.addEventListener("keydown", function (e) {
    if (!playing) return;
    if (e.key === "Escape") { e.preventDefault(); stop(); return; }
    var k = keyName(e);
    if (k) { e.preventDefault(); playing.keyDown(k); }
  });
  document.addEventListener("keyup", function (e) { if (!playing) return; var k = keyName(e); if (k) playing.keyUp(k); });
  window.addEventListener("blur", function () { if (playing) Object.keys(playing.keys).forEach(function (k) { playing.keyUp(k); }); });
  Array.prototype.forEach.call(document.querySelectorAll("#stPad [data-key]"), function (b) {
    var k = b.getAttribute("data-key");
    b.addEventListener("pointerdown", function (e) { e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (err) { /* already up */ } b.classList.add("down-now"); if (playing) playing.keyDown(k); });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { b.addEventListener(t, function () { b.classList.remove("down-now"); if (playing) playing.keyUp(k); }); });
  });

  /* ---------- start ---------- */
  if (store.current && store.games[store.current]) openGame(store.current);
  else {
    addStarter(SAMPLES.filter(function (s) { return s.id === "coins"; })[0]);
    setTimeout(function () {
      openSheet("Welcome to Studio", "<p>Make 3D games by wiring <b>Blueprint</b> nodes together — no code. You're looking at <b>Coin Run</b>, a whole game made of nodes: press <b>Play</b> to try it, then click the Player or a Coin to see how it works.</p><p>Or start from another game:</p><div class=\"st-cards\">" +
        SAMPLES.map(function (s) { return '<button type="button" class="st-card" data-sample="' + s.id + '"><b>' + esc(s.name) + "</b><span>" + esc(s.blurb) + "</span></button>"; }).join("") + '</div><p>Open <b>How it works</b> any time for the basics.</p>');
    }, 300);
  }
  window.CBStudioEditor = { project: function () { return project; }, add: addGame, addStarter: addStarter, play: play, stop: stop, game: function () { return playing; }, select: selectActor, graph: graph, openPalette: openPalette, undo: undo, redo: redo };
})();
