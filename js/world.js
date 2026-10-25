"use strict";
/* ================= 3D WORLD (three.js) =================
   One world, two views of the same blocks, picked with the buttons
   on the world card and remembered on this device:

   - Original: the board, with the blocks laid along a lit, winding
     road from block 1 to the last block.
   - Tower of Babel: the blocks climb a spiral ramp around a tiered
     tower, block 1 at its foot and the last block at the summit, under
     the message "V has Come to!". Mastering blocks climbs the tower.

   Both views share the blocks, the camera springs, tap-to-open,
   the keyboard map, the particles and every hook the rest of the app
   calls (__refreshWorld, __burstAt, __shimmerAt, __celebrate,
   __skyPulse, __worldHandoff, __worldAttention). The tower is built
   the first time it is opened, so the original view starts as fast
   as it always did. Reduced motion stills every ease, drift and
   burst in both views; the states themselves (lit, mastered) remain. */
(function initWorld() {
  var canvas = document.getElementById("world");
  var hubEl = document.getElementById("hubView");
  /* Set by the context-lost handler below; the hooks read it so a
     dead world declines like an unstarted one. */
  var worldLost = false;
  function unavailable(message) {
    if (hubEl) hubEl.classList.add("world-unavailable");
    var hint = document.getElementById("worldHint");
    if (hint && message) hint.textContent = message;
  }
  if (!window.THREE || !canvas) {
    if (canvas) {
      var hint0 = document.getElementById("worldHint");
      if (hint0) hint0.style.display = "none";
      var fb = document.createElement("div");
      fb.className = "world-fallback";
      fb.innerHTML = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-cube"/></svg><br />The 3D world could not start on this device — no problem, every block below opens the same drill.';
      canvas.replaceWith(fb);
      unavailable(null);
    }
    return;
  }
  /* The stage keeps a 1.488 ratio at every width (height follows
     width, never below 320px); the tick loop and the resize listener
     re-derive the height the same way. */
  var W = canvas.clientWidth || 640;
  var H = Math.max(320, Math.round(W * 0.672));
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance" });
  } catch (e) {
    canvas.style.display = "none";
    var card2 = canvas.closest ? canvas.closest(".world-card") : null;
    if (card2) card2.classList.add("world-empty");
    unavailable("The 3D world could not start on this device — every block below opens the same drill.");
    return;
  }
  /* Mobile browsers drop WebGL contexts under memory pressure; the
     world then steps aside the same honest way the start failures do. */
  canvas.addEventListener("webglcontextlost", function () {
    worldLost = true;
    canvas.style.display = "none";
    var card3 = canvas.closest ? canvas.closest(".world-card") : null;
    if (card3) card3.classList.add("world-empty");
    unavailable("The 3D world stopped on this device — every block below opens the same drill.");
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
  var maxAniso = renderer.capabilities.getMaxAnisotropy ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 1;
  /* three.js r128 treats a hex colour as linear light, while the canvas
     is sRGB-encoded on the way out, so a plain 0x0f2f57 would be drawn
     far paler than written: that was the old world's washed-out look.
     Every designed colour goes through L() so it shows as written.
     Canvas textures are tagged sRGB and need no conversion. */
  var linCache = {};
  function L(hex) { return linCache[hex] || (linCache[hex] = new THREE.Color(hex).convertSRGBToLinear()); }

  /* The reduced-motion preference is a live query: switching it on
     mid-session stills the world at once (see onReduceMotionChange). */
  var reduceMotionMQ = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var reduceMotion = !!(reduceMotionMQ && reduceMotionMQ.matches);

  var N = BLOCKS.length;
  var LAST = Math.max(1, N - 1);
  var MODE_KEY = "code-block-world-mode-v1";
  var mode = "road";
  try { if (localStorage.getItem(MODE_KEY) === "tower") mode = "tower"; } catch (e) { /* the original view */ }

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(L(0x0b2a4c), 50, 120);
  var camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 420);

  /* ================= Light =================
     One rig serves both views; applyModeLook() recolours and moves it.
     The original board keeps its cool studio: a key "sun" from the
     top-right that throws the shadows, a deep-sky fill, and a low rim
     that lifts each block off the board. The tower stands in a golden
     evening: a warm, low sun from the front-left, a cool sky fill, and
     an orange rim from the sunset behind it. */
  var amb = new THREE.AmbientLight(L(0xdceeff), 0.22);
  var hemi = new THREE.HemisphereLight(L(0xbfe0ff), L(0x0a2547), 0.32);
  var sun = new THREE.DirectionalLight(L(0xf2f8ff), 1.3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 4;
  var fill = new THREE.DirectionalLight(L(0x7cc4ff), 0.3);
  var rim = new THREE.DirectionalLight(L(0x9adcff), 0.5);
  var glow = new THREE.PointLight(L(0x38bdf8), 0.62, 46);
  scene.add(amb, hemi, sun, sun.target, fill, rim, glow);

  /* ================= Sky =================
     A painted dome that turns with the camera, so the horizon stays
     where it belongs when you look around. paintSky() fills it with
     a navy night for the board, or a sunset for the tower. */
  var skyGeo = new THREE.SphereGeometry(170, 40, 24);
  skyGeo.setAttribute("color", new THREE.Float32BufferAttribute(new Float32Array(skyGeo.attributes.position.count * 3), 3));
  var skyDome = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false }));
  skyDome.renderOrder = -1;
  scene.add(skyDome);
  function paintSky(stops, sunDir, sunCol, sunAmt) {
    var pos = skyGeo.attributes.position, col = skyGeo.attributes.color;
    var c = new THREE.Color(), tmp = new THREE.Color(), sc = new THREE.Color(sunCol || 0xffffff);
    var v = new THREE.Vector3();
    for (var k = 0; k < pos.count; k++) {
      v.set(pos.getX(k), pos.getY(k), pos.getZ(k)).normalize();
      var h = v.y, j = 0;
      while (j < stops.length - 2 && h > stops[j + 1][0]) j++;
      var a = stops[j], b = stops[j + 1];
      var f = Math.max(0, Math.min(1, (h - a[0]) / ((b[0] - a[0]) || 1)));
      c.setHex(a[1]); tmp.setHex(b[1]); c.lerp(tmp, f * f * (3 - 2 * f));
      if (sunDir) {
        var d = Math.max(0, v.dot(sunDir));
        c.lerp(sc, Math.min(1, Math.pow(d, 6) * sunAmt + Math.pow(d, 60) * sunAmt));
      }
      c.convertSRGBToLinear();
      col.setXYZ(k, c.r, c.g, c.b);
    }
    col.needsUpdate = true;
  }
  /* Stars over the board: a thin scatter on the upper sky. */
  var stars = (function () {
    var n = 420, p = new Float32Array(n * 3), r = 160;
    for (var k = 0; k < n; k++) {
      var u = Math.random() * Math.PI * 2, y = 0.12 + Math.random() * 0.88, rr = Math.sqrt(1 - y * y);
      p[k * 3] = Math.cos(u) * rr * r; p[k * 3 + 1] = y * r; p[k * 3 + 2] = Math.sin(u) * rr * r;
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    var pts = new THREE.Points(g, new THREE.PointsMaterial({ color: L(0xcfe6ff), size: 0.75, transparent: true, opacity: 0.75, fog: false, depthWrite: false }));
    pts.renderOrder = -1;
    scene.add(pts);
    return pts;
  })();

  /* ================= Reflections =================
     A tiny painted dome that exists only to be reflected: PMREM turns
     it into the environment map the lacquered blocks and the stone
     sample. Each view gets its own (the tower's is warm). Wrapped in
     try/catch, because the lights alone still carry the scene. */
  function makeEnv(top, mid, bottom, win) {
    try {
      var pmrem = new THREE.PMREMGenerator(renderer);
      var envScene = new THREE.Scene();
      var domeGeo = new THREE.SphereGeometry(50, 24, 16);
      var cols = [], dPos = domeGeo.attributes.position;
      var cTop = new THREE.Color(top), cMid = new THREE.Color(mid), cBot = new THREE.Color(bottom);
      for (var vi = 0; vi < dPos.count; vi++) {
        var vy = dPos.getY(vi) / 50;
        var cc = vy > 0 ? cMid.clone().lerp(cTop, Math.pow(vy, 0.7)) : cMid.clone().lerp(cBot, Math.pow(-vy, 0.6));
        cc.convertSRGBToLinear();
        cols.push(cc.r, cc.g, cc.b);
      }
      domeGeo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
      envScene.add(new THREE.Mesh(domeGeo, new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })));
      var w1 = new THREE.Mesh(new THREE.PlaneGeometry(26, 13), new THREE.MeshBasicMaterial({ color: L(win) }));
      w1.position.set(-16, 20, -24); w1.lookAt(0, 0, 0); envScene.add(w1);
      var w2 = new THREE.Mesh(new THREE.PlaneGeometry(15, 8), new THREE.MeshBasicMaterial({ color: L(mid) }));
      w2.position.set(22, 12, -14); w2.lookAt(0, 0, 0); envScene.add(w2);
      var tex = pmrem.fromScene(envScene, 0.035).texture;
      pmrem.dispose();
      return tex;
    } catch (e) { return null; }
  }
  var envRoad = makeEnv(0x6f95c4, 0x1c4a86, 0x050f1f, 0xbfdcff), envTower = null;

  /* ================= Shared textures ================= */
  function canvasTex(c, srgb) {
    var t = new THREE.CanvasTexture(c);
    if (srgb) t.encoding = THREE.sRGBEncoding;
    t.anisotropy = maxAniso;
    return t;
  }
  /* A radial fade, reused as every block's soft contact shadow. */
  var contactTex = (function () {
    var c = document.createElement("canvas"); c.width = c.height = 128;
    var g = c.getContext("2d");
    var grad = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    grad.addColorStop(0, "rgba(2,12,26,0.85)");
    grad.addColorStop(0.7, "rgba(2,12,26,0.4)");
    grad.addColorStop(1, "rgba(2,12,26,0)");
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  /* A soft round mote of light, for every particle, glow and haze. */
  var softDotTex = (function () {
    var c = document.createElement("canvas"); c.width = c.height = 64;
    var g = c.getContext("2d");
    var grad = g.createRadialGradient(32, 32, 2, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();

  /* ================= The blocks =================
     Each block is a lacquered tile with rounded corners and a soft
     bevel, its face printed with its number, its name and the one
     verb that says what it does. The face is drawn on a canvas in
     the block's own colour, deepened so the dark print stays easy
     to read (at least 4.3:1 on every colour the tracks use). */
  function roundedRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
    g.closePath();
  }
  function fitFont(g, text, weight, size, family, maxW) {
    var s = size;
    do { g.font = weight + " " + s + "px " + family; s -= 2; } while (s > 12 && g.measureText(text).width > maxW);
  }
  function topTexture(b, i) {
    var S = 512, c = document.createElement("canvas"); c.width = c.height = S;
    var g = c.getContext("2d");
    var base = new THREE.Color(b.color);
    var light = base.clone().lerp(new THREE.Color(0xffffff), 0.2), deep = base.clone().lerp(new THREE.Color(0x0b2d5c), 0.32);
    var grad = g.createLinearGradient(0, 0, S, S);
    grad.addColorStop(0, light.getStyle()); grad.addColorStop(1, deep.getStyle());
    g.fillStyle = grad; g.fillRect(0, 0, S, S);
    /* a soft pool of light at the top-left, like a gloss highlight */
    var pool = g.createRadialGradient(130, 110, 10, 130, 110, 300);
    pool.addColorStop(0, "rgba(255,255,255,0.32)"); pool.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = pool; g.fillRect(0, 0, S, S);
    /* the inset panel the print sits on */
    roundedRect(g, 30, 30, S - 60, S - 60, 46);
    g.fillStyle = "rgba(255,255,255,0.10)"; g.fill();
    g.lineWidth = 5; g.strokeStyle = "rgba(255,255,255,0.55)"; g.stroke();
    roundedRect(g, 40, 40, S - 80, S - 80, 38);
    g.lineWidth = 2; g.strokeStyle = "rgba(6,30,60,0.18)"; g.stroke();
    /* the block's own glyph, etched faintly into the corner: read live
       from the SVG sprite on its 24-unit grid; any glyph the canvas
       can't read is skipped and the face keeps its plain panel */
    try {
      var sym = b.icon ? document.getElementById(b.icon) : null;
      if (sym && window.Path2D) {
        var parts = sym.querySelectorAll("path, rect, circle");
        var etch = function (dx, dy, style) {
          g.save();
          g.translate(400 + dx, 104 + dy); g.scale(3.4, 3.4); g.translate(-12, -12);
          g.strokeStyle = style; g.fillStyle = style; g.lineWidth = 1.7; g.lineCap = "round"; g.lineJoin = "round";
          for (var pi = 0; pi < parts.length; pi++) {
            var el = parts[pi], tag = el.tagName.toLowerCase();
            if (tag === "path") { var d = el.getAttribute("d"); if (d) g.stroke(new Path2D(d)); }
            else if (tag === "rect") { g.beginPath(); g.rect(+el.getAttribute("x") || 0, +el.getAttribute("y") || 0, +el.getAttribute("width") || 0, +el.getAttribute("height") || 0); g.stroke(); }
            else if (tag === "circle") { g.beginPath(); g.arc(+el.getAttribute("cx") || 0, +el.getAttribute("cy") || 0, +el.getAttribute("r") || 0, 0, Math.PI * 2); if (el.getAttribute("fill") === "currentColor") g.fill(); else g.stroke(); }
          }
          g.restore();
        };
        etch(2, 2, "rgba(255,255,255,0.35)");
        etch(0, 0, "rgba(4,30,58,0.32)");
      }
    } catch (etchErr) { /* the panel stays plain */ }
    g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = "rgba(255,255,255,0.5)"; g.shadowOffsetY = 3; g.shadowBlur = 0;
    g.fillStyle = "#061d38";
    g.font = "500 168px 'JetBrains Mono', monospace";
    g.fillText(String(i + 1), S / 2, 168);
    var words = String(b.short || "").split(" ");
    if (words.length > 1 && b.short.length > 9) {
      fitFont(g, words[0], "800", 62, "'Sora', sans-serif", S - 120);
      g.fillText(words[0], S / 2, 298);
      var rest = words.slice(1).join(" ");
      fitFont(g, rest, "800", 62, "'Sora', sans-serif", S - 120);
      g.fillText(rest, S / 2, 362);
    } else {
      fitFont(g, b.short || "", "800", 70, "'Sora', sans-serif", S - 110);
      g.fillText(b.short || "", S / 2, 318);
    }
    if (b.verb) {
      g.shadowOffsetY = 2;
      g.fillStyle = "rgba(6,29,56,0.72)";
      if ("letterSpacing" in g) g.letterSpacing = "6px";
      fitFont(g, b.verb.toUpperCase(), "700", 32, "'Sora', sans-serif", S - 140);
      g.fillText(b.verb.toUpperCase(), S / 2, 440);
      if ("letterSpacing" in g) g.letterSpacing = "0px";
    }
    var tex = canvasTex(c, true);
    /* the printed face fills the cap exactly (see the block geometry) */
    tex.repeat.set(1 / CAP, 1 / CAP);
    tex.offset.set(0.5, 0.5);
    return tex;
  }
  /* One shared block shape: a rounded square extruded upward with a
     three-step bevel, 3.4 wide and 1.3 tall like the old box. The
     extrusion runs along +Y after the turn below, so the back cap is
     the top face; its UVs are the shape's own x/y, which the face
     texture maps onto with repeat 1/CAP and offset ½. */
  var BEV = 0.14, CAP = 3.4 - 2 * BEV, DEPTH = 1.3 - 2 * BEV;
  var blockShape = (function () {
    var s = new THREE.Shape(), h = CAP / 2, r = 0.34;
    s.moveTo(-h + r, -h);
    s.lineTo(h - r, -h); s.quadraticCurveTo(h, -h, h, -h + r);
    s.lineTo(h, h - r); s.quadraticCurveTo(h, h, h - r, h);
    s.lineTo(-h + r, h); s.quadraticCurveTo(-h, h, -h, h - r);
    s.lineTo(-h, -h + r); s.quadraticCurveTo(-h, -h, -h + r, -h);
    return s;
  })();
  var blockGeo = new THREE.ExtrudeGeometry(blockShape, { depth: DEPTH, bevelEnabled: true, bevelThickness: BEV, bevelSize: BEV, bevelSegments: 3, curveSegments: 5 });
  blockGeo.rotateX(-Math.PI / 2);
  blockGeo.translate(0, -DEPTH / 2, 0);
  /* The plinth: a turned disc with a chamfered lip. */
  var pedestalGeo = new THREE.LatheGeometry([
    new THREE.Vector2(0, -0.14), new THREE.Vector2(2.4, -0.14), new THREE.Vector2(2.47, -0.09),
    new THREE.Vector2(2.47, 0.06), new THREE.Vector2(2.38, 0.14), new THREE.Vector2(0, 0.14)
  ], 48);

  var meshes = [], anchors = [], bases = [], pedestals = [], rims = [], glows = [], halos = [], rings = [];
  var rimGeo = new THREE.TorusGeometry(2.38, 0.05, 8, 48);
  var glowGeo = new THREE.CircleGeometry(3.2, 32);
  var haloGeo = new THREE.TorusGeometry(1.25, 0.05, 8, 44);
  var contactGeo = new THREE.CircleGeometry(2.7, 32);
  BLOCKS.forEach(function (b, i) {
    var anchor = new THREE.Group();
    var deepSide = new THREE.Color(b.color).lerp(new THREE.Color(0x0b2d5c), 0.42).convertSRGBToLinear();
    var top = new THREE.MeshPhysicalMaterial({ roughness: 0.26, metalness: 0.05, clearcoat: 0.9, clearcoatRoughness: 0.16, envMapIntensity: 1.0 });
    top.map = topTexture(b, i);
    /* the glow of a mastered block rides the printed face itself, so
       the dark print never washes out */
    top.emissiveMap = top.map;
    var side = new THREE.MeshPhysicalMaterial({ color: deepSide, roughness: 0.34, metalness: 0.08, clearcoat: 0.7, clearcoatRoughness: 0.25, envMapIntensity: 0.9 });
    var mesh = new THREE.Mesh(blockGeo, [top, side]);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.userData.index = i;
    mesh.userData.topMat = top; mesh.userData.sideMat = side;
    anchor.add(mesh);
    var ped = new THREE.Mesh(pedestalGeo, new THREE.MeshPhysicalMaterial({ color: L(0x0f2f57), roughness: 0.52, metalness: 0.25, clearcoat: 0.25, clearcoatRoughness: 0.5, envMapIntensity: 0.32, emissive: L(0x0a2547), emissiveIntensity: 0.35 }));
    ped.position.y = -0.5;
    ped.receiveShadow = true; ped.castShadow = true;
    anchor.add(ped);
    /* the trophy rim on the plinth's edge and the light pooled under
       it: both dark until the block earns them (refreshWorld) */
    var rimMesh = new THREE.Mesh(rimGeo, new THREE.MeshBasicMaterial({ color: L(0x9adcff), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    rimMesh.rotation.x = -Math.PI / 2; rimMesh.position.y = -0.36; rimMesh.visible = false;
    anchor.add(rimMesh);
    var glowDisc = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({ map: softDotTex, color: L(0x3f8ff0), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    glowDisc.rotation.x = -Math.PI / 2; glowDisc.position.y = -0.63; glowDisc.visible = false;
    anchor.add(glowDisc);
    /* the crown: a ring of ice light floated over a mastered block */
    var halo = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({ color: L(0xbfe6ff), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    halo.rotation.x = Math.PI / 2.35; halo.position.y = 2.5; halo.visible = false;
    anchor.add(halo);
    /* the progress ring on the plinth, drawn as far as the reps go */
    var ring = new THREE.Mesh(new THREE.RingGeometry(2.08, 2.34, 48, 1, Math.PI / 2, 0.02), new THREE.MeshBasicMaterial({ color: L(0x7aa2cf), side: THREE.DoubleSide, transparent: true, opacity: 0.95, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = -0.345; ring.visible = false;
    anchor.add(ring);
    /* the soft contact shadow that grounds the block */
    var contact = new THREE.Mesh(contactGeo, new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, opacity: 0.5, depthWrite: false }));
    contact.rotation.x = -Math.PI / 2; contact.position.y = -0.635;
    anchor.add(contact);
    scene.add(anchor);
    meshes.push(mesh); anchors.push(anchor); pedestals.push(ped); rims.push(rimMesh); glows.push(glowDisc); halos.push(halo); rings.push(ring);
    bases.push({ x: 0, y: 0, z: 0, rot: 0, s: 1 });
  });

  /* ================= Layouts =================
     Where each block sits in each view: { x, y, z, rot, s } for its
     anchor (s scales the block and everything under it).
     The original board winds back and forth in rows of six, block 1
     at the far left and the last block at the near right, spaced so
     no two blocks touch. The tower lays them along a spiral ramp that
     climbs two and a quarter turns while it narrows, the blocks a
     little smaller toward the summit, each turned so its face reads
     upright from outside the tower. */
  var ROW = 6, SX = 4.5, SZ = 4.9, ROWS = Math.ceil(N / ROW);
  function roadLayout(i) {
    var r = Math.floor(i / ROW), c = i % ROW;
    if (r % 2 === 1) c = ROW - 1 - c;
    var wob = Math.sin(i * 12.9898) * 43758.5453;
    wob = (wob - Math.floor(wob) - 0.5) * 0.14;
    return { x: (c - (ROW - 1) / 2) * SX, y: -0.06, z: (r - (ROWS - 1) / 2) * SZ, rot: wob, s: 0.92 };
  }
  var TURNS = 2.25, R0 = 9.2, R1 = 4.6, Y0 = 0.9, Y1 = 14.5;
  function tF(p) { return p / LAST; }
  function tTheta(p) { return tF(p) * TURNS * Math.PI * 2; }
  function tRad(p) { return R0 - (R0 - R1) * tF(p); }
  function tRampY(p) { return Y0 + (Y1 - Y0) * tF(p); }
  function tScale(p) { return 0.7 - 0.15 * Math.max(0, Math.min(1, tF(p))); }
  function tRampW(p) { return tScale(p) * 3.4 + 0.55; }
  function towerLayout(i) {
    var s = tScale(i), th = tTheta(i), r = tRad(i);
    return { x: r * Math.sin(th), y: tRampY(i) + 0.65 * s, z: r * Math.cos(th), rot: th, s: s };
  }
  function applyLayout() {
    var tower = mode === "tower";
    for (var i = 0; i < N; i++) {
      var L = tower ? towerLayout(i) : roadLayout(i);
      bases[i] = L;
      anchors[i].position.set(L.x, L.y, L.z);
      anchors[i].rotation.y = L.rot;
      anchors[i].scale.setScalar(L.s);
      pedestals[i].visible = !tower;
      rims[i].position.y = tower ? -0.62 : -0.36;
      rings[i].position.y = tower ? -0.625 : -0.345;
    }
  }

  /* ================= The lit path =================
     A dashed ribbon of light under the blocks, following the road on
     the board or the ramp up the tower. Each vertex remembers how far
     along the blocks it lies (p: 0 is block 1), so paintPath() can
     burn the stretch already travelled ice-bright, glow the step
     ahead, and leave the rest resting. One soft pulse rides from the
     last mastered block to the next. Built once per view. */
  function denseLine(out, ax, az, bx, bz, y, p0, p1, skipFirst) {
    var len = Math.sqrt((bx - ax) * (bx - ax) + (bz - az) * (bz - az)), n = Math.max(1, Math.ceil(len / 0.18));
    for (var k = skipFirst ? 1 : 0; k <= n; k++) {
      var f = k / n;
      out.push({ x: ax + (bx - ax) * f, y: y, z: az + (bz - az) * f, p: p0 + (p1 - p0) * f });
    }
  }
  function roadSamples() {
    var pts = [], Y = -0.615, a = roadLayout(0);
    denseLine(pts, a.x - 2.6, a.z, a.x, a.z, Y, -0.6, 0, false);
    for (var i = 0; i < N - 1; i++) {
      a = roadLayout(i);
      var b = roadLayout(i + 1);
      if (Math.abs(a.z - b.z) < 0.01) { denseLine(pts, a.x, a.z, b.x, b.z, Y, i, i + 1, true); continue; }
      /* a U-turn bulging outward past the end of the row */
      var R = Math.abs(b.z - a.z) / 2, cz = (a.z + b.z) / 2, side = a.x >= 0 ? 1 : -1, n = Math.ceil(Math.PI * R / 0.18);
      for (var k = 1; k <= n; k++) {
        var ph = Math.PI * k / n;
        pts.push({ x: a.x + side * R * Math.sin(ph), y: Y, z: cz - R * Math.cos(ph), p: i + k / n });
      }
    }
    var z = roadLayout(N - 1), dir = Math.floor((N - 1) / ROW) % 2 === 1 ? -1 : 1;
    denseLine(pts, z.x, z.z, z.x + dir * 2.6, z.z, Y, LAST, LAST + 0.6, true);
    return pts;
  }
  function towerSamples() {
    var pts = [];
    for (var p = -1.9; p <= LAST + 0.6 + 1e-6; p += 0.04) {
      var th = tTheta(p), r = tRad(p);
      pts.push({ x: r * Math.sin(th), y: Math.max(0, tRampY(p)) + 0.035, z: r * Math.cos(th), p: p });
    }
    return pts;
  }
  function buildPath(samples, halfWidth, opacity, dim) {
    var pos = [], col = [], vp = [], acc = 0;
    for (var s = 0; s < samples.length - 1; s++) {
      var a = samples[s], b = samples[s + 1];
      var tx = b.x - a.x, tz = b.z - a.z, seg = Math.sqrt(tx * tx + tz * tz + (b.y - a.y) * (b.y - a.y));
      var mid = acc + seg / 2; acc += seg;
      if (Math.floor(mid / 0.55) % 2 === 1) continue;
      var tl = Math.sqrt(tx * tx + tz * tz) || 1, px = -tz / tl * halfWidth, pz = tx / tl * halfWidth;
      var quad = [[a.x - px, a.y, a.z - pz, a.p], [a.x + px, a.y, a.z + pz, a.p], [b.x + px, b.y, b.z + pz, b.p], [b.x - px, b.y, b.z - pz, b.p]];
      [0, 1, 2, 0, 2, 3].forEach(function (q) {
        pos.push(quad[q][0], quad[q][1], quad[q][2]);
        col.push(dim.r, dim.g, dim.b);
        vp.push(quad[q][3]);
      });
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    var mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: opacity, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    return { mesh: mesh, geo: geo, vp: vp, samples: samples, dim: dim };
  }
  var PATH_LIT = L(0xa6dcff), PATH_NEAR = L(0x5d93d9);
  function paintPath(path) {
    if (!path) return;
    var open = firstOpen();
    var frontier = open < 0 ? Infinity : open;
    var c = path.geo.attributes.color;
    for (var v = 0; v < path.vp.length; v++) {
      var p = path.vp[v];
      var k = p <= frontier ? PATH_LIT : (p <= frontier + 0.5 ? PATH_NEAR : path.dim);
      c.setXYZ(v, k.r, k.g, k.b);
    }
    c.needsUpdate = true;
  }
  function pathPointAt(path, p) {
    var s = path.samples, lo = 0, hi = s.length - 1;
    if (p <= s[0].p) return s[0];
    if (p >= s[hi].p) return s[hi];
    while (hi - lo > 1) { var m = (lo + hi) >> 1; if (s[m].p <= p) lo = m; else hi = m; }
    var a = s[lo], b = s[hi], f = (p - a.p) / ((b.p - a.p) || 1);
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, z: a.z + (b.z - a.z) * f };
  }

  /* ================= The original board ================= */
  var roadSet = new THREE.Group();
  scene.add(roadSet);
  (function board() {
    /* a crisp, tileable grid: one cell per tile, the line drawn only
       on two edges so neighbouring tiles complete each other */
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var g = c.getContext("2d");
    g.fillStyle = "#0e2c52"; g.fillRect(0, 0, 256, 256);
    g.fillStyle = "rgba(124,190,255,0.10)"; g.fillRect(0, 0, 256, 3); g.fillRect(0, 0, 3, 256);
    g.fillStyle = "rgba(160,210,255,0.22)"; g.beginPath(); g.arc(1.5, 1.5, 5, 0, Math.PI * 2); g.fill();
    var tex = canvasTex(c, true);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(26, 26);
    var m = new THREE.Mesh(new THREE.CircleGeometry(30, 96), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.72, metalness: 0.12, envMapIntensity: 0.28 }));
    m.rotation.x = -Math.PI / 2; m.position.y = -0.65; m.receiveShadow = true;
    roadSet.add(m);
    /* a vignette laid over the grid: the board's middle stays bright
       and its edge sinks into the night */
    var vc = document.createElement("canvas"); vc.width = vc.height = 256;
    var vg = vc.getContext("2d");
    var vgrad = vg.createRadialGradient(128, 128, 30, 128, 128, 128);
    vgrad.addColorStop(0, "rgba(3,12,26,0)"); vgrad.addColorStop(0.55, "rgba(3,12,26,0.15)"); vgrad.addColorStop(1, "rgba(3,12,26,0.85)");
    vg.fillStyle = vgrad; vg.fillRect(0, 0, 256, 256);
    var vig = new THREE.Mesh(new THREE.CircleGeometry(30, 96), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(vc), transparent: true, depthWrite: false }));
    vig.rotation.x = -Math.PI / 2; vig.position.y = -0.645;
    roadSet.add(vig);
    var lip = new THREE.Mesh(new THREE.CylinderGeometry(30.5, 30.9, 0.5, 96, 1, true), new THREE.MeshStandardMaterial({ color: L(0x1b4e89), roughness: 0.5, metalness: 0.3, envMapIntensity: 0.6, side: THREE.DoubleSide }));
    lip.position.y = -0.9;
    roadSet.add(lip);
    /* the shore-glow ring that melts the board's edge into the void */
    var hc = document.createElement("canvas"); hc.width = hc.height = 256;
    var hg = hc.getContext("2d");
    var hgrad = hg.createRadialGradient(128, 128, 40, 128, 128, 128);
    hgrad.addColorStop(0, "rgba(124,196,255,0)"); hgrad.addColorStop(0.44, "rgba(124,196,255,0.05)");
    hgrad.addColorStop(0.5, "rgba(124,196,255,0.24)"); hgrad.addColorStop(0.75, "rgba(80,160,255,0.08)"); hgrad.addColorStop(1, "rgba(80,160,255,0)");
    hg.fillStyle = hgrad; hg.fillRect(0, 0, 256, 256);
    var hor = new THREE.Mesh(new THREE.CircleGeometry(64, 64), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hc), transparent: true, depthWrite: false }));
    hor.rotation.x = -Math.PI / 2; hor.position.y = -0.74;
    roadSet.add(hor);
  })();
  /* One sheet of light slanted like the sun's rays through the air,
     breathing between 4% and 7% opacity above the blocks. */
  var lightSheet = (function () {
    var c = document.createElement("canvas"); c.width = 256; c.height = 128;
    var g = c.getContext("2d");
    var grad = g.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, "rgba(190,225,255,0)"); grad.addColorStop(0.5, "rgba(190,225,255,0.85)"); grad.addColorStop(1, "rgba(190,225,255,0)");
    g.fillStyle = grad; g.fillRect(0, 0, 256, 128);
    g.globalCompositeOperation = "destination-in";
    var fade = g.createLinearGradient(0, 0, 0, 128);
    fade.addColorStop(0, "rgba(0,0,0,0)"); fade.addColorStop(0.35, "rgba(0,0,0,1)"); fade.addColorStop(0.75, "rgba(0,0,0,1)"); fade.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = fade; g.fillRect(0, 0, 256, 128);
    var m = new THREE.Mesh(new THREE.PlaneGeometry(52, 18), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
    m.position.set(2, 7.5, -3); m.rotation.set(-0.9, 0, 0.42);
    roadSet.add(m);
    return m;
  })();
  var roadPath = buildPath(roadSamples(), 0.62, 0.7, L(0x1f4a80));
  roadSet.add(roadPath.mesh);

  /* ================= The Tower of Babel =================
     Built the first time the tower is opened. Sandstone tiers ringed
     with arcades, terraces where each tier steps in, a spiral ramp
     with a low parapet carrying the blocks, a temple and a golden
     spire at the summit whose beam brightens as blocks are mastered,
     a city of flat-roofed houses on the plain, and clouds around the
     upper tiers. All of it is drawn from canvases made here — no
     image files. */
  var towerSet = null, towerPath = null, towerOccluders = [], clouds = null, summitBeam = null, spireMat = null, finialMat = null, sunGlow = null;
  var TIER_H = 2.6, TIERS = 6;
  function seeded(seed) { return function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }; }
  function stoneCanvas(arches) {
    var c = document.createElement("canvas"); c.width = 1024; c.height = 256;
    var g = c.getContext("2d"), rnd = seeded(arches ? 11 : 23);
    var grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#dcb582"); grad.addColorStop(1, "#c39462");
    g.fillStyle = grad; g.fillRect(0, 0, 1024, 256);
    for (var k = 0; k < 2600; k++) {
      g.fillStyle = rnd() < 0.5 ? "rgba(255,240,215,0.10)" : "rgba(90,58,30,0.10)";
      g.fillRect(rnd() * 1024, rnd() * 256, 2 + rnd() * 4, 2 + rnd() * 3);
    }
    /* courses of stone: mortar lines, with joints offset course by course */
    g.strokeStyle = "rgba(92,60,32,0.42)"; g.lineWidth = 2;
    for (var y = 0, row = 0; y <= 256; y += 32, row++) {
      g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke();
      for (var x = (row % 2) * 32; x < 1024; x += 64) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 32); g.stroke(); }
    }
    if (arches) {
      /* four arches per tile: dark openings with a lit stone surround */
      for (var a = 0; a < 4; a++) {
        var cx = 128 + a * 256, half = 58, top = 104, bottom = 226;
        g.beginPath(); g.moveTo(cx - half - 12, bottom); g.lineTo(cx - half - 12, top); g.arc(cx, top, half + 12, Math.PI, 0); g.lineTo(cx + half + 12, bottom); g.closePath();
        g.fillStyle = "#e8c896"; g.fill();
        g.beginPath(); g.moveTo(cx - half, bottom); g.lineTo(cx - half, top); g.arc(cx, top, half, Math.PI, 0); g.lineTo(cx + half, bottom); g.closePath();
        var dark = g.createLinearGradient(0, top - half, 0, bottom);
        dark.addColorStop(0, "#2a1a10"); dark.addColorStop(1, "#4a3020");
        g.fillStyle = dark; g.fill();
        /* the keystone */
        g.fillStyle = "#f0d3a2"; g.fillRect(cx - 9, top - half - 14, 18, 18);
      }
      /* a cornice along the top of every tier */
      g.fillStyle = "rgba(255,236,200,0.55)"; g.fillRect(0, 0, 1024, 10);
      g.fillStyle = "rgba(80,50,25,0.35)"; g.fillRect(0, 10, 1024, 4);
    }
    return c;
  }
  function slabCanvas() {
    var c = document.createElement("canvas"); c.width = 256; c.height = 128;
    var g = c.getContext("2d"), rnd = seeded(5);
    g.fillStyle = "#d9b98a"; g.fillRect(0, 0, 256, 128);
    for (var k = 0; k < 900; k++) { g.fillStyle = rnd() < 0.5 ? "rgba(255,245,225,0.12)" : "rgba(110,75,40,0.10)"; g.fillRect(rnd() * 256, rnd() * 128, 2 + rnd() * 3, 2 + rnd() * 2); }
    g.strokeStyle = "rgba(100,68,36,0.45)"; g.lineWidth = 3;
    for (var x = 0; x <= 256; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 128); g.stroke(); }
    g.beginPath(); g.moveTo(0, 64); g.lineTo(256, 64); g.stroke();
    var edge = g.createLinearGradient(0, 0, 0, 128);
    edge.addColorStop(0, "rgba(70,45,20,0.25)"); edge.addColorStop(0.15, "rgba(70,45,20,0)"); edge.addColorStop(0.85, "rgba(70,45,20,0)"); edge.addColorStop(1, "rgba(70,45,20,0.3)");
    g.fillStyle = edge; g.fillRect(0, 0, 256, 128);
    return c;
  }
  function sandCanvas() {
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var g = c.getContext("2d"), rnd = seeded(3);
    g.fillStyle = "#d8b886"; g.fillRect(0, 0, 256, 256);
    for (var k = 0; k < 3000; k++) { g.fillStyle = rnd() < 0.5 ? "rgba(255,240,210,0.16)" : "rgba(140,100,55,0.12)"; g.fillRect(rnd() * 256, rnd() * 256, 1 + rnd() * 2, 1 + rnd() * 2); }
    g.strokeStyle = "rgba(150,110,65,0.12)"; g.lineWidth = 2;
    for (var y = 8; y < 256; y += 22) { g.beginPath(); for (var x = 0; x <= 256; x += 16) g.lineTo(x, y + Math.sin(x / 40 + y) * 4); g.stroke(); }
    return c;
  }
  function cloudCanvas() {
    var c = document.createElement("canvas"); c.width = 256; c.height = 128;
    var g = c.getContext("2d"), rnd = seeded(9);
    for (var k = 0; k < 14; k++) {
      var x = 50 + rnd() * 156, y = 54 + rnd() * 30, r = 20 + rnd() * 26;
      var grad = g.createRadialGradient(x, y, 2, x, y, r);
      grad.addColorStop(0, "rgba(255,255,255,0.9)"); grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    return c;
  }
  /* A strip of quads between two edge curves, with u along the strip
     (in world units / uScale) and v across it (0 to 1). */
  function strip(edgeA, edgeB, n, uScale) {
    var pos = [], uv = [], idx = [], acc = 0, prev = null;
    for (var j = 0; j <= n; j++) {
      var a = edgeA(j / n), b = edgeB(j / n);
      if (prev) acc += Math.sqrt(Math.pow(a[0] - prev[0], 2) + Math.pow(a[1] - prev[1], 2) + Math.pow(a[2] - prev[2], 2));
      prev = a;
      pos.push(a[0], a[1], a[2], b[0], b[1], b[2]);
      uv.push(acc / uScale, 0, acc / uScale, 1);
      if (j < n) { var q = j * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); }
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }
  /* The core's radius at a height: the ramp's inner edge where the
     ramp passes the top of that tier, so the ramp never cuts a wall. */
  function coreRadiusAt(y) {
    var p = Math.max(0, Math.min(LAST + 0.6, (y - Y0) / (Y1 - Y0) * LAST));
    return tRad(p) - tRampW(p) / 2 + 0.02;
  }
  function buildTower() {
    towerSet = new THREE.Group();
    towerSet.visible = false;
    scene.add(towerSet);
    var masonry = stoneCanvas(true), plain = stoneCanvas(false);
    function stoneMat(cnv, repeatX, repeatY, color) {
      var t = canvasTex(cnv, true);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeatX, repeatY);
      var bump = new THREE.CanvasTexture(cnv);
      bump.wrapS = bump.wrapT = THREE.RepeatWrapping; bump.repeat.set(repeatX, repeatY);
      return new THREE.MeshStandardMaterial({ map: t, bumpMap: bump, bumpScale: 0.05, color: L(color || 0xffffff), roughness: 0.88, metalness: 0.02, envMapIntensity: 0.5 });
    }
    /* the plain, with the city on it */
    var sand = canvasTex(sandCanvas(), true);
    sand.wrapS = sand.wrapT = THREE.RepeatWrapping; sand.repeat.set(30, 30);
    var plainMesh = new THREE.Mesh(new THREE.CircleGeometry(150, 72), new THREE.MeshStandardMaterial({ map: sand, roughness: 1, metalness: 0, envMapIntensity: 0.3 }));
    plainMesh.rotation.x = -Math.PI / 2; plainMesh.position.y = -0.32; plainMesh.receiveShadow = true;
    towerSet.add(plainMesh);
    /* the foundation: two broad steps */
    [[12.2, -0.32, -0.16], [11.4, -0.16, 0]].forEach(function (st) {
      var step = new THREE.Mesh(new THREE.CylinderGeometry(st[0], st[0] + 0.2, st[2] - st[1], 96), stoneMat(plain, 8, 0.12, 0xf2dcc0));
      step.position.y = (st[1] + st[2]) / 2; step.receiveShadow = true; step.castShadow = true;
      towerSet.add(step); towerOccluders.push(step);
    });
    /* the tiers, each narrower than the one below, ringed with arcades */
    var tint = [0xffffff, 0xfbf1e4, 0xf6e6d2, 0xf1dcc2, 0xedd3b4, 0xe8c9a6];
    for (var k = 0; k < TIERS; k++) {
      var y0 = k * TIER_H, y1 = y0 + TIER_H, R = coreRadiusAt(y1);
      var reps = Math.max(1, Math.round(Math.PI * 2 * R / 12));
      var wall = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.985, R, TIER_H, 72, 1, true), stoneMat(masonry, reps, 1, tint[k % tint.length]));
      wall.position.y = y0 + TIER_H / 2; wall.castShadow = true; wall.receiveShadow = true;
      towerSet.add(wall); towerOccluders.push(wall);
      var Rn = k < TIERS - 1 ? coreRadiusAt(y1 + TIER_H) : 0;
      var ledge = new THREE.Mesh(new THREE.RingGeometry(Rn, R * 0.985 + 0.05, 72), new THREE.MeshStandardMaterial({ color: L(0xc9a06c), roughness: 0.92, envMapIntensity: 0.4, side: THREE.DoubleSide }));
      ledge.rotation.x = -Math.PI / 2; ledge.position.y = y1; ledge.receiveShadow = true;
      towerSet.add(ledge); towerOccluders.push(ledge);
    }
    /* the spiral ramp: a top of stone slabs, an outer wall and an
       underside, its inner edge buried in the core */
    var P0 = -1.9, P1 = LAST + 0.6, NS = 420;
    function at(f) { return P0 + (P1 - P0) * f; }
    function pt(p, rr, y) { var th = tTheta(p); return [rr * Math.sin(th), y, rr * Math.cos(th)]; }
    function top(p) { return Math.max(0, tRampY(p)); }
    function inner(f) { var p = at(f); return pt(p, tRad(p) - tRampW(p) / 2 - 1.3, top(p)); }
    function outer(f) { var p = at(f); return pt(p, tRad(p) + tRampW(p) / 2, top(p)); }
    function outerLow(f) { var p = at(f); return pt(p, tRad(p) + tRampW(p) / 2, top(p) - 0.55); }
    function innerLow(f) { var p = at(f); return pt(p, tRad(p) - tRampW(p) / 2 - 1.3, top(p) - 0.55); }
    var slabTex = canvasTex(slabCanvas(), true);
    slabTex.wrapS = slabTex.wrapT = THREE.RepeatWrapping;
    var rampTop = new THREE.Mesh(strip(inner, outer, NS, 2.4), new THREE.MeshStandardMaterial({ map: slabTex, roughness: 0.9, envMapIntensity: 0.4, side: THREE.DoubleSide }));
    var wallTex = canvasTex(plain, true);
    wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping; wallTex.repeat.set(1, 0.25);
    var rampWall = new THREE.Mesh(strip(outer, outerLow, NS, 12), new THREE.MeshStandardMaterial({ map: wallTex, color: L(0xead2b0), roughness: 0.9, envMapIntensity: 0.4, side: THREE.DoubleSide }));
    var rampUnder = new THREE.Mesh(strip(outerLow, innerLow, NS, 6), new THREE.MeshStandardMaterial({ color: L(0x9c7448), roughness: 1, side: THREE.DoubleSide }));
    /* a low parapet along the outer edge */
    function parA(f) { var p = at(f); return pt(p, tRad(p) + tRampW(p) / 2, top(p) + 0.32); }
    function parInA(f) { var p = at(f); return pt(p, tRad(p) + tRampW(p) / 2 - 0.16, top(p) + 0.32); }
    function parInB(f) { var p = at(f); return pt(p, tRad(p) + tRampW(p) / 2 - 0.16, top(p)); }
    var parMat = new THREE.MeshStandardMaterial({ color: L(0xe7c99b), roughness: 0.85, envMapIntensity: 0.4, side: THREE.DoubleSide });
    var parOut = new THREE.Mesh(strip(outer, parA, NS, 6), parMat);
    var parTop = new THREE.Mesh(strip(parA, parInA, NS, 6), parMat);
    var parIn = new THREE.Mesh(strip(parInA, parInB, NS, 6), parMat);
    [rampTop, rampWall, rampUnder, parOut, parTop, parIn].forEach(function (m) {
      m.castShadow = true; m.receiveShadow = true;
      towerSet.add(m); towerOccluders.push(m);
    });
    /* the summit: a small arcaded temple, a golden spire and a beam of
       light whose strength follows the learner's progress */
    var sy = TIERS * TIER_H, sr = Math.max(1.6, coreRadiusAt(sy) - 0.6);
    var temple = new THREE.Mesh(new THREE.CylinderGeometry(sr * 0.95, sr, 2.4, 48, 1, true), stoneMat(masonry, 2, 1, 0xfff4e4));
    temple.position.y = sy + 1.2; temple.castShadow = true;
    towerSet.add(temple); towerOccluders.push(temple);
    var roof = new THREE.Mesh(new THREE.CylinderGeometry(sr * 1.08, sr * 1.08, 0.3, 48), new THREE.MeshStandardMaterial({ color: L(0xdcb784), roughness: 0.8 }));
    roof.position.y = sy + 2.55; roof.castShadow = true;
    towerSet.add(roof); towerOccluders.push(roof);
    spireMat = new THREE.MeshStandardMaterial({ color: L(0xe2ad4a), metalness: 0.85, roughness: 0.28, envMapIntensity: 1.3, emissive: L(0x6b4100), emissiveIntensity: 0.15 });
    var spire = new THREE.Mesh(new THREE.ConeGeometry(sr * 0.72, 3.6, 40), spireMat);
    spire.position.y = sy + 2.7 + 1.8; spire.castShadow = true;
    towerSet.add(spire); towerOccluders.push(spire);
    finialMat = new THREE.MeshStandardMaterial({ color: L(0xfff1c9), emissive: L(0xffc861), emissiveIntensity: 0.6, roughness: 0.3 });
    var finial = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 14), finialMat);
    finial.position.y = sy + 2.7 + 3.75;
    towerSet.add(finial);
    summitBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.18, 36, 20, 1, true), new THREE.MeshBasicMaterial({ color: L(0xffe2a6), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
    summitBeam.position.y = finial.position.y + 18;
    towerSet.add(summitBeam);
    /* the city: a seeded scatter of flat-roofed houses on the plain */
    var rnd = seeded(7), COUNT = 190;
    var houses = new THREE.InstancedMesh((function () { var g = new THREE.BoxGeometry(1, 1, 1); g.translate(0, 0.5, 0); return g; })(), new THREE.MeshStandardMaterial({ roughness: 0.92, envMapIntensity: 0.35 }), COUNT);
    var hm = new THREE.Matrix4(), hq = new THREE.Quaternion(), hs = new THREE.Vector3(), hp = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    var tones = [0xb88f60, 0xa87d50, 0xc49d6e, 0x9a7048, 0xcfae80, 0xa9835c].map(function (h) { return L(h); });
    for (var hI = 0; hI < COUNT; hI++) {
      var ang = rnd() * Math.PI * 2, rad = 14.5 + Math.pow(rnd(), 0.8) * 38;
      var near = 1 - (rad - 14.5) / 38;
      hp.set(Math.sin(ang) * rad, -0.32, Math.cos(ang) * rad);
      hq.setFromAxisAngle(up, ang + (rnd() - 0.5) * 0.5);
      hs.set(0.9 + rnd() * 1.7, 0.6 + rnd() * (1 + 1.8 * near), 0.9 + rnd() * 1.5);
      hm.compose(hp, hq, hs);
      houses.setMatrixAt(hI, hm);
      houses.setColorAt(hI, tones[Math.floor(rnd() * tones.length)]);
    }
    houses.instanceMatrix.needsUpdate = true;
    if (houses.instanceColor) houses.instanceColor.needsUpdate = true;
    houses.castShadow = true; houses.receiveShadow = true;
    towerSet.add(houses);
    /* clouds drifting around the upper tiers, and a few far away */
    var cloudTex = new THREE.CanvasTexture(cloudCanvas());
    clouds = new THREE.Group();
    var crnd = seeded(13);
    for (var cI = 0; cI < 16; cI++) {
      var far = cI >= 11;
      var cs = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, color: L(far ? 0xffe6cf : 0xfff6ee), transparent: true, opacity: far ? 0.5 : 0.42 + crnd() * 0.3, depthWrite: false }));
      var ca = crnd() * Math.PI * 2, cr = far ? 70 + crnd() * 30 : 13 + crnd() * 16;
      cs.position.set(Math.sin(ca) * cr, far ? 10 + crnd() * 14 : 11 + crnd() * 11, Math.cos(ca) * cr);
      var w = far ? 40 + crnd() * 30 : 12 + crnd() * 12;
      cs.scale.set(w, w * 0.42, 1);
      clouds.add(cs);
    }
    towerSet.add(clouds);
    /* the low sun's glow on the horizon, behind and to the right */
    var sg = document.createElement("canvas"); sg.width = sg.height = 128;
    var sgc = sg.getContext("2d");
    var sgr = sgc.createRadialGradient(64, 64, 2, 64, 64, 64);
    sgr.addColorStop(0, "rgba(255,246,220,1)"); sgr.addColorStop(0.18, "rgba(255,214,150,0.8)"); sgr.addColorStop(1, "rgba(255,170,90,0)");
    sgc.fillStyle = sgr; sgc.fillRect(0, 0, 128, 128);
    sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(sg), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    sunGlow.position.copy(TOWER_SUN_DIR).multiplyScalar(150);
    sunGlow.scale.set(46, 46, 1);
    towerSet.add(sunGlow);
    towerPath = buildPath(towerSamples(), 0.32, 0.9, L(0x9a7550));
    towerSet.add(towerPath.mesh);
    envTower = makeEnv(0x7f9fd6, 0xa8774a, 0x3d2a18, 0xffe2b8);
  }
  var TOWER_SUN_DIR = new THREE.Vector3(0.62, 0.11, -0.78).normalize();

  /* The beacon over the next block: a soft column of light and a ring
     at its feet, so the eye finds the current goal from across the
     world. */
  var beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.34, 7.2, 12, 1, true),
    new THREE.MeshBasicMaterial({ color: L(0x7cc4ff), transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  scene.add(beacon);
  var beaconRing = new THREE.Mesh(
    new THREE.RingGeometry(2.6, 2.82, 48),
    new THREE.MeshBasicMaterial({ color: L(0x7cc4ff), transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false })
  );
  beaconRing.rotation.x = -Math.PI / 2;
  scene.add(beaconRing);
  function placeBeacon() {
    var open = firstOpen();
    var b = open >= 0 ? bases[open] : null;
    beacon.visible = beaconRing.visible = !!b;
    if (!b) return;
    var bs = mode === "tower" ? b.s * 0.75 : 1;
    beacon.scale.set(bs, bs, bs);
    beacon.position.set(b.x, b.y + 3.7 * bs, b.z);
    beaconRing.scale.set(b.s, b.s, 1);
    beaconRing.position.set(b.x, b.y - 0.56 * b.s, b.z);
  }

  /* ================= Block states =================
     The blocks carry the learner's journey, readable from across the
     room: untouched blocks rest matte and quiet, a block in progress
     warms with a deep-azure ember that grows with every rep, the next
     block waits polished under the beacon, and a mastered block is
     radiant, lifted, ringed with light and crowned with a halo. At
     100% (the masterpiece) everything burns a little brighter. In the
     tower, the lit ramp climbs with you and the summit's beam grows
     stronger with every block mastered. */
  var mpBloom = false, skyPulseUntil = 0;
  function refreshWorld() {
    if (worldLost) return;
    var done = doneCount();
    mpBloom = done >= N;
    paintPath(mode === "tower" ? towerPath : roadPath);
    placeBeacon();
    var open = firstOpen();
    meshes.forEach(function (mesh, i) {
      var isDoneI = isDone(i), frac = repsOf(i) / REPS_GOAL, warm = !isDoneI && frac > 0;
      var tm = mesh.userData.topMat, sm = mesh.userData.sideMat;
      if (isDoneI) {
        sm.emissive.copy(L(0x2f7fe0)); sm.emissiveIntensity = mpBloom ? 0.8 : 0.55;
        tm.emissive.copy(L(0xa8d8ff)); tm.emissiveIntensity = mpBloom ? 0.27 : 0.2;
        tm.roughness = 0.16; tm.clearcoat = 1.0; tm.envMapIntensity = 1.25;
        sm.clearcoat = 0.85; sm.envMapIntensity = 1.05;
      } else if (warm) {
        sm.emissive.copy(L(0x1a5fb4)); sm.emissiveIntensity = 0.45 * frac;
        tm.emissive.copy(L(0x7fbfff)); tm.emissiveIntensity = 0.12 * frac;
        tm.roughness = 0.3 - 0.08 * frac; tm.clearcoat = 0.7 + 0.2 * frac; tm.envMapIntensity = 0.9 + 0.25 * frac;
        sm.clearcoat = 0.5 + 0.25 * frac; sm.envMapIntensity = 0.8 + 0.15 * frac;
      } else {
        sm.emissive.setHex(0x000000); sm.emissiveIntensity = 0;
        tm.emissive.setHex(0x000000); tm.emissiveIntensity = 0;
        if (i === open) { tm.roughness = 0.2; tm.clearcoat = 0.95; tm.envMapIntensity = 1.15; sm.clearcoat = 0.65; sm.envMapIntensity = 0.95; }
        else { tm.roughness = 0.42; tm.clearcoat = 0.45; tm.envMapIntensity = 0.75; sm.clearcoat = 0.35; sm.envMapIntensity = 0.65; }
      }
      var pm = pedestals[i].material;
      pm.emissive.copy(L(isDoneI ? 0x2f7fe0 : 0x0a2547));
      pm.emissiveIntensity = isDoneI ? (mpBloom ? 1.1 : 0.8) : 0.4;
      var rm = rims[i].material;
      if (isDoneI) { rm.color.copy(L(0x9adcff)); rm.opacity = mpBloom ? 0.95 : 0.8; }
      else if (i === open) { rm.color.copy(L(0x7cc4ff)); rm.opacity = 0.4; }
      else if (warm) { rm.color.copy(L(0x5fb2ff)); rm.opacity = 0.15 + 0.4 * frac; }
      else rm.opacity = 0;
      rims[i].visible = rm.opacity > 0;
      glows[i].material.opacity = isDoneI ? (mpBloom ? 0.55 : 0.42) : 0;
      glows[i].visible = isDoneI;
      halos[i].material.opacity = isDoneI ? (mpBloom ? 0.72 : 0.55) : 0;
      halos[i].visible = isDoneI;
      mesh.userData.isCurrent = (i === open);
      mesh.userData.isDone = isDoneI;
      var ring = rings[i];
      ring.geometry.dispose();
      ring.geometry = new THREE.RingGeometry(2.08, 2.34, 48, 1, Math.PI / 2, Math.max(0.02, frac * Math.PI * 2));
      ring.visible = frac > 0;
      ring.material.color.copy(L(isDoneI ? 0x9adcff : 0x7aa2cf));
    });
    if (summitBeam) {
      var share = done / N;
      summitBeam.material.opacity = 0.06 + 0.42 * share + (mpBloom ? 0.12 : 0);
      spireMat.emissiveIntensity = 0.12 + 0.5 * share;
      finialMat.emissiveIntensity = 0.4 + 1.6 * share;
    }
    /* the tower turns to show the next block whenever it changes */
    if (mode === "tower" && open !== lastFacedOpen) { lastFacedOpen = open; faceNext(); }
  }
  window.__refreshWorld = refreshWorld;
  window.__skyPulse = function () { skyPulseUntil = performance.now() + 7000; };

  /* The faces are baked in whatever fonts have arrived; when the real
     faces land, rebake each block's face once so the world wears the
     same type as the page around it. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      meshes.forEach(function (mesh, i) {
        var tm = mesh.userData.topMat, old = tm.map;
        tm.map = topTexture(BLOCKS[i], i);
        tm.emissiveMap = tm.map;
        tm.needsUpdate = true;
        if (old) old.dispose();
      });
    });
  }

  /* ================= Particles =================
     Bursts, shimmers and the masterpiece fountain share one pool of
     soft motes; a few are near-white ice among the deep-sky blue. No
     particle ever spawns for a reduced-motion learner: mastery still
     reads in the block's own lit, lifted state. */
  var PMAX = 900;
  var pGeo = new THREE.BufferGeometry();
  var pPos = new Float32Array(PMAX * 3), pVel = new Float32Array(PMAX * 3), pLife = new Float32Array(PMAX), pBright = new Float32Array(PMAX), pCol = new Float32Array(PMAX * 3);
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
  var points = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.32, map: softDotTex, transparent: true, opacity: 0.95, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  points.frustumCulled = false;
  scene.add(points);
  var pNext = 0;
  function spawn(x, y, z, spread, upv, bright) {
    if (reduceMotion) return;
    var idx = pNext; pNext = (pNext + 1) % PMAX;
    pPos[idx * 3] = x; pPos[idx * 3 + 1] = y; pPos[idx * 3 + 2] = z;
    pVel[idx * 3] = (Math.random() - 0.5) * spread;
    pVel[idx * 3 + 1] = upv * (0.6 + Math.random() * 0.8);
    pVel[idx * 3 + 2] = (Math.random() - 0.5) * spread;
    pLife[idx] = 1;
    pBright[idx] = bright ? 1 : 0;
  }
  function blockTop(p) { return p.y + 1.2 * p.s; }
  window.__burstAt = function (i, big) {
    var p = bases[i]; if (!p || worldLost) return;
    /* the burst lands ON the block: it squashes, then springs back */
    var bm = meshes[i];
    if (bm) { bm.userData.squash = big ? 0.6 : 0.3; bm.userData.squashVel = 0; }
    var n = big ? 90 : 26;
    for (var k = 0; k < n; k++) spawn(p.x, blockTop(p), p.z, 3.2 * p.s, 4.2 * Math.sqrt(p.s), k % 3 === 0);
    if (big) fireShock(p.x, p.y - 0.5 * p.s, p.z, 5.4 * p.s, 850);
  };
  window.__shimmerAt = function (i) {
    var p = bases[i]; if (!p || worldLost) return;
    var sm = meshes[i];
    if (sm) { sm.userData.squash = Math.max(sm.userData.squash || 0, 0.2); sm.userData.squashVel = 0; }
    for (var k = 0; k < 12; k++) spawn(p.x + (Math.random() - 0.5) * 1.7 * p.s, blockTop(p), p.z + (Math.random() - 0.5) * 1.7 * p.s, 0.7 * p.s, 1.5, k % 4 !== 3);
  };
  var celebrating = false, celebUntil = 0;
  window.__celebrate = function () {
    if (reduceMotion || worldLost) return;
    celebrating = true; celebUntil = performance.now() + 9000;
    fireShock(0, mode === "tower" ? 0.05 : 0.5, 0, 27, 2600);
    meshes.forEach(function (m, i) { setTimeout(function () { window.__burstAt(i, true); }, i * 110); });
  };

  /* ================= The seam =================
     The drill view calls __worldHandoff(i, "pick") as a block opens
     from the hub and holds its console back one beat, so the world can
     lean in and lift the block to meet the tap; "settle" lets it ride
     back down as the hub returns. Reduced motion declines (returns
     false) and the drill view swaps at once. __worldAttention eases the
     exposure down a breath while the learner's eye is in the list. */
  var handoffIndex = -1, handoffKind = "", handoffT0 = 0;
  window.__worldHandoff = function (i, kind) {
    if (worldLost || reduceMotion || !meshes[i]) return false;
    handoffIndex = i; handoffKind = kind; handoffT0 = performance.now();
    if (kind === "settle" && meshes[i].userData.isDone) {
      var p = bases[i];
      for (var k = 0; k < 14; k++) spawn(p.x + (Math.random() - 0.5) * 1.7 * p.s, blockTop(p) + 0.15, p.z + (Math.random() - 0.5) * 1.7 * p.s, 0.7 * p.s, 1.6, k % 4 !== 3);
    }
    return true;
  };
  var attentionDim = 0, attentionGoal = 0;
  window.__worldAttention = function (on) { attentionGoal = on ? 1 : 0; };

  /* ================= Atmosphere =================
     Pooled and preallocated; the idle drift is skipped wholesale under
     reduced motion. Shockwaves are flat rings of light that roll out
     from a mastered block (or from the world's heart for the
     masterpiece). */
  var shockPool = [];
  for (var si = 0; si < 6; si++) {
    var shockMesh = new THREE.Mesh(new THREE.RingGeometry(0.86, 1, 48), new THREE.MeshBasicMaterial({ color: 0x9adcff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
    shockMesh.rotation.x = -Math.PI / 2;
    shockMesh.visible = false;
    scene.add(shockMesh);
    shockPool.push({ mesh: shockMesh, active: false, t0: 0, dur: 900, maxR: 5 });
  }
  var shockNext = 0;
  function fireShock(x, y, z, maxR, dur) {
    if (reduceMotion) return;
    var s = shockPool[shockNext]; shockNext = (shockNext + 1) % shockPool.length;
    s.active = true; s.t0 = performance.now(); s.dur = dur; s.maxR = maxR;
    s.mesh.position.set(x, y, z);
    s.mesh.visible = true;
  }
  function updateShocks() {
    var now = performance.now();
    for (var i = 0; i < shockPool.length; i++) {
      var s = shockPool[i];
      if (!s.active) continue;
      var f = (now - s.t0) / s.dur;
      if (f >= 1) { s.active = false; s.mesh.visible = false; continue; }
      var r = 0.4 + (s.maxR - 0.4) * (1 - Math.pow(1 - f, 3));
      s.mesh.scale.set(r, r, 1);
      s.mesh.material.opacity = 0.5 * (1 - f);
    }
  }
  /* Motes of light in three depths, so the air itself has parallax:
     far motes larger, fainter and slower; near ones small and quick.
     scatterMotes() spreads them over the board, or up and around the
     tower. */
  function moteLayer(count, size, opacity, yMax, iceShare, rise) {
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(count * 3), col = new Float32Array(count * 3), phase = new Float32Array(count), speed = new Float32Array(count);
    for (var i = 0; i < count; i++) {
      if (Math.random() < iceShare) { col[i * 3] = 0.82; col[i * 3 + 1] = 0.92; col[i * 3 + 2] = 1; }
      else { col[i * 3] = 0.35; col[i * 3 + 1] = 0.62; col[i * 3 + 2] = 1; }
      phase[i] = Math.random() * Math.PI * 2;
      speed[i] = 0.5 + Math.random() * 0.8;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    var pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: size, map: softDotTex, transparent: true, opacity: opacity, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    pts.frustumCulled = false;
    scene.add(pts);
    return { geo: geo, pos: pos, phase: phase, speed: speed, count: count, yMax: yMax, rise: rise, mat: pts.material };
  }
  var moteLayers = [moteLayer(46, 0.55, 0.15, 10, 0.25, 0.004), moteLayer(60, 0.34, 0.23, 8, 0.4, 0.006), moteLayer(80, 0.2, 0.32, 6, 0.55, 0.009)];
  function moteTop(lay) { return mode === "tower" ? lay.yMax * 2.4 : lay.yMax; }
  function scatterMotes() {
    moteLayers.forEach(function (lay) {
      for (var i = 0; i < lay.count; i++) {
        if (mode === "tower") {
          var a = Math.random() * Math.PI * 2, r = 6 + Math.random() * 24;
          lay.pos[i * 3] = Math.sin(a) * r; lay.pos[i * 3 + 2] = Math.cos(a) * r;
        } else {
          lay.pos[i * 3] = (Math.random() - 0.5) * 56; lay.pos[i * 3 + 2] = (Math.random() - 0.5) * 44;
        }
        lay.pos[i * 3 + 1] = 0.3 + Math.random() * moteTop(lay);
      }
      lay.geo.attributes.position.needsUpdate = true;
      /* warm dust in the evening air, ice motes over the board */
      lay.mat.color.copy(L(mode === "tower" ? 0xffd9a8 : 0xffffff));
    });
  }
  /* Haze: five huge, faint sprites of air drifting over the world. */
  var hazeSprites = [];
  for (var hi = 0; hi < 5; hi++) {
    var haze = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDotTex, color: L(0x2f7fe0), transparent: true, opacity: 0.05, depthWrite: false }));
    haze.userData.phase = Math.random() * Math.PI * 2;
    scene.add(haze); hazeSprites.push(haze);
  }
  function scatterHaze() {
    hazeSprites.forEach(function (h) {
      if (mode === "tower") {
        var a = Math.random() * Math.PI * 2, r = 14 + Math.random() * 14;
        h.position.set(Math.sin(a) * r, 5 + Math.random() * 14, Math.cos(a) * r);
        h.scale.set(26 + Math.random() * 16, 10 + Math.random() * 6, 1);
        h.material.color.copy(L(0xffcf9a));
      } else {
        h.position.set((Math.random() - 0.5) * 36, 3.5 + Math.random() * 4, (Math.random() - 0.5) * 30);
        h.scale.set(24 + Math.random() * 14, 9 + Math.random() * 5, 1);
        h.material.color.copy(L(0x2f7fe0));
      }
    });
  }
  var pathPulse = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDotTex, color: L(0xd8f1ff), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(pathPulse);
  function updatePathPulse(t) {
    var path = mode === "tower" ? towerPath : roadPath;
    if (!path) return;
    var open = firstOpen();
    var pEnd = open < 0 ? LAST : open, pStart = open > 0 ? open - 1 : (open < 0 ? 0 : -0.5);
    var dur = open < 0 ? 7000 : 3400, ph = (t % dur) / dur;
    var ease = ph < 0.5 ? 2 * ph * ph : 1 - Math.pow(-2 * ph + 2, 2) / 2;
    var q = pathPointAt(path, pStart + (pEnd - pStart) * ease);
    var sc = mode === "tower" ? 1.3 : 2.4;
    pathPulse.scale.set(sc, sc, 1);
    pathPulse.position.set(q.x, q.y + (mode === "tower" ? 0.3 : 1.0), q.z);
    pathPulse.material.opacity = 0.7 * Math.sin(ph * Math.PI);
  }
  function updateAtmosphere(t) {
    for (var L = 0; L < moteLayers.length; L++) {
      var lay = moteLayers[L], topY = moteTop(lay);
      for (var i = 0; i < lay.count; i++) {
        var y = lay.pos[i * 3 + 1] + lay.rise * lay.speed[i];
        if (y > topY + 0.6) y = 0.3;
        lay.pos[i * 3 + 1] = y;
        lay.pos[i * 3] += Math.sin(t * 0.0004 * lay.speed[i] + lay.phase[i]) * 0.004;
      }
      lay.geo.attributes.position.needsUpdate = true;
    }
    for (var h = 0; h < hazeSprites.length; h++) {
      var spr = hazeSprites[h];
      spr.position.x += Math.sin(t * 0.00005 + spr.userData.phase) * 0.008;
      spr.material.opacity = 0.04 + 0.015 * (0.5 + 0.5 * Math.sin(t * 0.0003 + spr.userData.phase));
    }
    if (mode === "tower") {
      if (clouds) clouds.rotation.y = t * 0.0000045;
    } else {
      lightSheet.material.opacity = 0.045 + 0.02 * (0.5 + 0.5 * Math.sin(t * 0.0005));
      scene.fog.near = 50 + Math.sin(t * 0.00019) * 1.4;
      scene.fog.far = 120 + Math.sin(t * 0.00019 + 0.6) * 2.6;
    }
    updatePathPulse(t);
  }

  /* ================= Camera =================
     Nothing the learner does moves the camera instantly: a drag sets
     a target the camera springs after, a released drag glides to a
     stop, the look-target leans toward the block under the pointer
     (and, more gently, toward the next block), a mouse lends a faint
     parallax, and the frame banks a few degrees into a fast swing.
     Over the board the swing is held within ±0.85 rad; around the
     tower it is free, so you can walk all the way round, and a
     vertical drag looks higher or lower up the tower. Every ease
     collapses to a snap under reduced motion. */
  var azimuth = 0, azimuthCur = 0, azimuthVel = 0, lastDragT = 0;
  var tilt = 0, tiltCur = 0, tiltVel = 0, lastTiltT = 0;
  var zoomGoal = 1, zoomCur = 1;
  var bankCur = 0, prevAzimuthCur = 0;
  var ROAD_TZ = 1.6;
  var camTargetCur = new THREE.Vector3(0, 0, ROAD_TZ), focusGoal = new THREE.Vector3();
  var parGoal = { x: 0, y: 0 }, parCur = { x: 0, y: 0 };
  var dollyCur = 1, fovCur = 46, modeExposure = 1, snapNext = true;
  var lastFacedOpen = -2;
  var AZ_LIMIT = 0.85;
  function zoomMin() { return mode === "tower" ? 0.5 : 0.78; }
  function clampAz(a) { return mode === "tower" ? a : Math.max(-AZ_LIMIT, Math.min(AZ_LIMIT, a)); }
  /* Around the tower, turn to face the next block (the summit block
     once every block is mastered), by the shortest way round. */
  function faceNext() {
    if (mode !== "tower" || dragging) return;
    var open = firstOpen(), th = tTheta(open < 0 ? LAST : open);
    azimuth = th + Math.PI * 2 * Math.round((azimuth - th) / (Math.PI * 2));
    azimuthVel = 0;
  }
  function resetView() {
    azimuth = 0; azimuthVel = 0;
    tilt = 0; tiltVel = 0;
    zoomGoal = 1;
    faceNext();
  }
  function placeCamera(t) {
    var sway = reduceMotion ? 0 : Math.sin(t * 0.00008) * 0.04;
    var a = azimuthCur + sway, dol = dollyCur * zoomCur;
    if (mode === "tower") {
      var D = 46 * dol, el = 0.2 + tiltCur * 0.2, ce = Math.cos(el);
      camera.position.set(
        camTargetCur.x + Math.sin(a) * ce * D + Math.cos(a) * parCur.x,
        camTargetCur.y + Math.sin(el) * D + parCur.y,
        camTargetCur.z + Math.cos(a) * ce * D - Math.sin(a) * parCur.x
      );
    } else {
      /* narrow screens step back until the whole board fits across;
         wide ones come a little closer */
      var fit = dol * Math.min(1.6, Math.max(0.86, 1.2 / camera.aspect));
      var r = 26 * fit, h = 25 * (0.9 + 0.1 * fit) * (1 + tiltCur * 0.17);
      var breathe = reduceMotion ? 0 : Math.sin(t * 0.00045) * 0.3;
      camera.position.set(Math.sin(a) * r * 0.42 + parCur.x, h + breathe + parCur.y, Math.cos(a) * r * (0.69 - tiltCur * 0.07) + 4 + ROAD_TZ);
    }
    camera.lookAt(camTargetCur);
    /* the crane's lean, applied after lookAt so it never fights the framing */
    if (bankCur) camera.rotateZ(bankCur);
  }
  function updateCamera() {
    var snap = reduceMotion || snapNext;
    if (!dragging && azimuthVel) {
      azimuth += azimuthVel * 0.55;
      if (mode !== "tower" && Math.abs(azimuth) > AZ_LIMIT) { azimuth = clampAz(azimuth); azimuthVel = 0; }
      azimuthVel *= 0.92;
      if (Math.abs(azimuthVel) < 0.00004) azimuthVel = 0;
    }
    var ease = snap ? 1 : 0.08;
    azimuthCur += (azimuth - azimuthCur) * ease;
    if (Math.abs(azimuth - azimuthCur) < 0.00005) azimuthCur = azimuth;
    var angVel = snap ? 0 : azimuthCur - prevAzimuthCur;
    prevAzimuthCur = azimuthCur;
    var bankGoal = Math.max(-0.05, Math.min(0.05, -angVel * 6));
    bankCur += (bankGoal - bankCur) * (snap ? 1 : 0.07);
    if (Math.abs(bankCur) < 0.0004 && !bankGoal) bankCur = 0;
    if (!dragging && tiltVel) {
      tilt += tiltVel * 0.55;
      if (tilt > 1) { tilt = 1; tiltVel = 0; }
      if (tilt < -1) { tilt = -1; tiltVel = 0; }
      tiltVel *= 0.92;
      if (Math.abs(tiltVel) < 0.0004) tiltVel = 0;
    }
    tiltCur += (tilt - tiltCur) * ease;
    if (Math.abs(tilt - tiltCur) < 0.0005) tiltCur = tilt;
    zoomCur += (zoomGoal - zoomCur) * (snap ? 1 : 0.06);
    if (Math.abs(zoomGoal - zoomCur) < 0.001) zoomCur = zoomGoal;
    /* where the camera looks: a handoff outranks the hover, the hover
       outranks the habit of leaning toward the next block */
    var fb = null, amt = 0;
    if (handoffIndex >= 0 && bases[handoffIndex]) { fb = bases[handoffIndex]; amt = handoffKind === "pick" ? 0.45 : 0.3; }
    else if (hoverIndex >= 0 && bases[hoverIndex]) { fb = bases[hoverIndex]; amt = 0.22; }
    else { var oi = firstOpen(); if (oi >= 0 && bases[oi]) { fb = bases[oi]; amt = 0.1; } }
    if (mode === "tower") {
      focusGoal.set(0, 12.2 + tiltCur * 4.5, 0);
      if (fb) {
        /* zoomed in, the lean grows so the block stays in view */
        var k = Math.min(0.9, amt * (1 + Math.max(0, 1 - zoomCur) * 4));
        focusGoal.x += (fb.x - focusGoal.x) * k;
        focusGoal.z += (fb.z - focusGoal.z) * k;
        focusGoal.y += (fb.y - focusGoal.y) * Math.min(0.9, k * 1.6);
      }
    } else {
      focusGoal.set(0, 0, ROAD_TZ);
      if (fb) focusGoal.set(fb.x * amt, amt > 0.2 ? 0.15 : 0, ROAD_TZ + (fb.z - ROAD_TZ) * amt);
    }
    var fe = snap ? 1 : 0.045;
    camTargetCur.x += (focusGoal.x - camTargetCur.x) * fe;
    camTargetCur.y += (focusGoal.y - camTargetCur.y) * fe;
    camTargetCur.z += (focusGoal.z - camTargetCur.z) * fe;
    var pe = snap ? 1 : 0.05;
    parCur.x += (parGoal.x - parCur.x) * pe;
    parCur.y += (parGoal.y - parCur.y) * pe;
    var dollyGoal = hoverIndex >= 0 ? 0.95 : 1;
    if (handoffIndex >= 0) dollyGoal = handoffKind === "pick" ? 0.86 : 0.93;
    dollyCur += (dollyGoal - dollyCur) * (snap ? 1 : 0.05);
    /* the celebration punch-in: the view narrows a breath, then relaxes */
    var fovGoal = celebrating ? 43.5 : 46;
    if (fovCur !== fovGoal) {
      fovCur += (fovGoal - fovCur) * (snap ? 1 : 0.06);
      if (Math.abs(fovGoal - fovCur) < 0.02) fovCur = fovGoal;
      camera.fov = fovCur; camera.updateProjectionMatrix();
    }
    snapNext = false;
  }

  /* ================= Picking and gestures =================
     A tap opens the block under it. Around the tower, the tower's own
     stone is in the way of the blocks behind it, so a tap only opens
     a block it can actually see. Two fingers pinch to zoom; the lift
     that ends a pinch never opens anything; only the primary mouse
     button starts a gesture. */
  var ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  var downX = 0, downY = 0, dragging = false, lastX = 0, lastY = 0;
  var livePtrs = {}, pinching = false, pinchDist = 0, hoverIndex = -1;
  function pinchSpan() {
    var ks = Object.keys(livePtrs);
    if (ks.length < 2) return 0;
    var a = livePtrs[ks[0]], b = livePtrs[ks[1]];
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
  }
  function setPtr(e) {
    var r = canvas.getBoundingClientRect();
    ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }
  function pickAt(e) {
    setPtr(e);
    ray.setFromCamera(ptr, camera);
    var hits = ray.intersectObjects(mode === "tower" ? meshes.concat(towerOccluders) : meshes, false);
    var idx = hits.length ? hits[0].object.userData.index : undefined;
    return typeof idx === "number" ? idx : -1;
  }
  canvas.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    livePtrs[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (Object.keys(livePtrs).length === 2) { pinching = true; dragging = false; pinchDist = pinchSpan(); }
    downX = lastX = e.clientX; downY = lastY = e.clientY; dragging = false;
    azimuthVel = 0; tiltVel = 0;
    if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", function (e) {
    if (livePtrs[e.pointerId]) livePtrs[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (pinching) {
      var span = pinchSpan();
      if (span && pinchDist) zoomGoal = Math.max(zoomMin(), Math.min(1.3, zoomGoal * (pinchDist / span)));
      pinchDist = span;
      return;
    }
    if (e.buttons !== 1) return;
    var dx = e.clientX - lastX; lastX = e.clientX;
    var dy = e.clientY - lastY; lastY = e.clientY;
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 9) dragging = true;
    if (dragging) {
      var k = mode === "tower" ? 0.008 : 0.005;
      azimuth = clampAz(azimuth - dx * k);
      azimuthVel = azimuthVel * 0.55 + (-dx * k) * 0.45;
      lastDragT = performance.now();
      tilt = Math.max(-1, Math.min(1, tilt - dy * 0.004));
      tiltVel = tiltVel * 0.55 + (-dy * 0.004) * 0.45;
      lastTiltT = performance.now();
    }
  });
  /* hover: one raycast per move feeds the pointer cursor, the hover
     lift and the camera's lean; a press clears it */
  canvas.addEventListener("pointermove", function (e) {
    if (e.buttons) { hoverIndex = -1; return; }
    if (e.pointerType === "mouse" && !reduceMotion) { setPtr(e); parGoal.x = ptr.x * 0.85; parGoal.y = ptr.y * 0.45; }
    hoverIndex = pickAt(e);
    canvas.style.cursor = hoverIndex >= 0 ? "pointer" : "";
  });
  function clearHover() { hoverIndex = -1; canvas.style.cursor = ""; parGoal.x = 0; parGoal.y = 0; }
  canvas.addEventListener("pointerleave", clearHover);
  canvas.addEventListener("pointercancel", function (e) {
    delete livePtrs[e.pointerId];
    if (Object.keys(livePtrs).length === 0) { pinching = false; clearHover(); }
    dragging = false;
    azimuthVel = 0; tiltVel = 0;
  });
  canvas.addEventListener("pointerup", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    delete livePtrs[e.pointerId];
    if (pinching) {
      /* the latch holds until the last finger is up */
      if (Object.keys(livePtrs).length === 0) pinching = false;
      dragging = false;
      return;
    }
    var wasDragging = dragging;
    dragging = false;
    if (wasDragging && performance.now() - lastDragT > 90) azimuthVel = 0;
    if (wasDragging && performance.now() - lastTiltT > 90) tiltVel = 0;
    if (wasDragging) return;
    var hit = pickAt(e);
    if (hit >= 0) openBlock(hit);
  });
  canvas.addEventListener("wheel", function (e) {
    e.preventDefault();
    zoomGoal = Math.max(zoomMin(), Math.min(1.3, zoomGoal + e.deltaY * 0.0012));
  }, { passive: false });
  canvas.addEventListener("dblclick", function (e) { e.preventDefault(); resetView(); });
  /* The keyboard map: arrows look around (and walk round the tower),
     up and down look higher or lower, + and − zoom, Home flies home,
     and Enter or Space opens the next unmastered block. */
  canvas.addEventListener("keydown", function (e) {
    var used = true, step = mode === "tower" ? 0.32 : 0.16;
    if (e.key === "ArrowLeft") azimuth = clampAz(azimuth - step);
    else if (e.key === "ArrowRight") azimuth = clampAz(azimuth + step);
    else if (e.key === "ArrowUp") tilt = Math.min(1, tilt + 0.18);
    else if (e.key === "ArrowDown") tilt = Math.max(-1, tilt - 0.18);
    else if (e.key === "+" || e.key === "=") zoomGoal = Math.max(zoomMin(), zoomGoal - 0.09);
    else if (e.key === "-" || e.key === "_") zoomGoal = Math.min(1.3, zoomGoal + 0.09);
    else if (e.key === "Home") resetView();
    else if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      var nx = firstOpen();
      if (nx >= 0) openBlock(nx);
      else if (window.cbAnnounce) window.cbAnnounce("Every block is mastered — the tiles below still open any block.");
    }
    else used = false;
    if (used) { azimuthVel = 0; tiltVel = 0; e.preventDefault(); }
  });

  if (reduceMotionMQ) {
    var onReduceMotionChange = function (e) {
      reduceMotion = !!e.matches;
      if (reduceMotion) {
        azimuthVel = 0; tiltVel = 0;
        handoffIndex = -1; handoffKind = "";
        celebrating = false;
      }
    };
    if (reduceMotionMQ.addEventListener) reduceMotionMQ.addEventListener("change", onReduceMotionChange);
    else if (reduceMotionMQ.addListener) reduceMotionMQ.addListener(onReduceMotionChange);
  }

  /* ================= The two views =================
     The buttons on the world card switch views; the choice is kept on
     this device. Switching cuts (never swings) the camera to the new
     view's home, and around the tower it faces your next block. */
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll("[data-world-mode]"));
  var bannerEl = document.getElementById("worldBanner");
  var hintEl = document.getElementById("worldHint");
  var VIEW_TEXT = {
    road: {
      aria: "3D world of your " + N + " blocks on a winding road, block 1 at the far left. Tap a block to open its drill, drag to look around, pinch or scroll to zoom, double-tap to reset the view, or focus here and use the arrow keys to look around, the plus and minus keys to zoom, and Enter to open your next block.",
      hint: "Tap a block to drill it · drag to look around · pinch or scroll to zoom · double-tap resets"
    },
    tower: {
      aria: "3D world: the Tower of Babel, built from your " + N + " blocks. They climb a spiral ramp from block 1 at the foot to block " + N + " at the summit. Tap a block to open its drill, drag sideways to walk around the tower and up or down to look higher or lower, pinch or scroll to zoom, double-tap to reset the view, or focus here and use the arrow keys, the plus and minus keys, and Enter to open your next block.",
      hint: "Tap a block to drill it · drag to walk around the tower · pinch or scroll to zoom · double-tap resets"
    }
  };
  function applyModeLook() {
    var sc = sun.shadow.camera;
    if (mode === "tower") {
      amb.color.copy(L(0xffe9cf)); amb.intensity = 0.16;
      hemi.color.copy(L(0xa9c8ff)); hemi.groundColor.copy(L(0x9a6a3c)); hemi.intensity = 0.4;
      sun.color.copy(L(0xffd6a1)); sun.intensity = 1.85; sun.position.set(-26, 30, 30); sun.target.position.set(0, 7, 0);
      sc.left = -26; sc.right = 26; sc.top = 26; sc.bottom = -26; sc.near = 1; sc.far = 130;
      fill.color.copy(L(0x86aef5)); fill.intensity = 0.28; fill.position.set(26, 14, -8);
      rim.color.copy(L(0xffa25e)); rim.intensity = 0.85; rim.position.copy(TOWER_SUN_DIR).multiplyScalar(40);
      glow.color.copy(L(0xffd9a0)); glow.distance = 40; glow.position.set(0, TIERS * TIER_H + 8, 0);
      scene.fog.color.copy(L(0xe8b685)); scene.fog.near = 70; scene.fog.far = 190;
      paintSky([[-1, 0xa8784c], [0, 0xffb877], [0.06, 0xf09a62], [0.18, 0xc77f7f], [0.36, 0x5b70ad], [0.62, 0x263f80], [1, 0x101d45]], TOWER_SUN_DIR, 0xffe0a8, 0.9);
      scene.environment = envTower || envRoad;
      modeExposure = 0.92;
    } else {
      amb.color.copy(L(0xdceeff)); amb.intensity = 0.18;
      hemi.color.copy(L(0xbfe0ff)); hemi.groundColor.copy(L(0x0a2547)); hemi.intensity = 0.28;
      sun.color.copy(L(0xf2f8ff)); sun.intensity = 1.3; sun.position.set(10, 22, 8); sun.target.position.set(0, 0, 0);
      sc.left = -18; sc.right = 18; sc.top = 20; sc.bottom = -20; sc.near = 0.5; sc.far = 60;
      fill.color.copy(L(0x7cc4ff)); fill.intensity = 0.3; fill.position.set(-12, 10, -8);
      rim.color.copy(L(0x9adcff)); rim.intensity = 0.5; rim.position.set(-4, 6, -16);
      glow.color.copy(L(0x38bdf8)); glow.distance = 46; glow.position.set(0, 7, 2);
      scene.fog.color.copy(L(0x0b2a4c)); scene.fog.near = 50; scene.fog.far = 120;
      paintSky([[-1, 0x040b18], [0, 0x123a66], [0.12, 0x0c2b52], [0.45, 0x071a36], [1, 0x030a17]], null);
      scene.environment = envRoad;
      modeExposure = 1.0;
    }
    sc.updateProjectionMatrix();
  }
  function setMode(m, initial) {
    if (m !== "tower") m = "road";
    if (m === "tower" && !towerSet) {
      try { buildTower(); } catch (err) {
        if (window.console) console.error(err);
        m = "road";
      }
    }
    mode = m;
    roadSet.visible = m === "road";
    if (towerSet) towerSet.visible = m === "tower";
    stars.visible = m === "road";
    applyLayout();
    applyModeLook();
    scatterMotes();
    scatterHaze();
    azimuth = 0; azimuthVel = 0; tilt = 0; tiltVel = 0; zoomGoal = 1; bankCur = 0;
    hoverIndex = -1; handoffIndex = -1;
    lastFacedOpen = -2;
    refreshWorld();
    snapNext = true;
    modeBtns.forEach(function (b) {
      var on = b.getAttribute("data-world-mode") === m;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (bannerEl) bannerEl.hidden = m !== "tower";
    canvas.setAttribute("aria-label", VIEW_TEXT[m].aria);
    if (hintEl) hintEl.textContent = VIEW_TEXT[m].hint;
    if (!initial) {
      try { localStorage.setItem(MODE_KEY, m); } catch (e) { /* the view still switches */ }
      if (window.cbAnnounce) window.cbAnnounce(m === "tower" ? "Tower of Babel view. V has Come to!" : "Original view: the winding road.");
    }
  }
  modeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var m = b.getAttribute("data-world-mode");
      if (worldLost || m === mode) return;
      setMode(m, false);
    });
  });

  /* ================= The frame loop =================
     Rests while the world is off-screen (another room open, a drill in
     front of it, or the tab hidden): no rendering, no battery. */
  var lastW = W, lastDPR = Math.min(window.devicePixelRatio || 1, 2);
  function tick(t) {
    requestAnimationFrame(tick);
    if (worldLost || document.hidden || !canvas.getClientRects().length) return;
    t = t || 0;
    /* self-heal the size and pixel ratio (rotation, zoom, a new display) */
    var cw = canvas.clientWidth, ch = cw ? Math.max(320, Math.round(cw * 0.672)) : H;
    var dprNow = Math.min(window.devicePixelRatio || 1, 2);
    if (cw && (cw !== lastW || ch !== H || dprNow !== lastDPR)) {
      lastW = cw; H = ch; lastDPR = dprNow;
      renderer.setPixelRatio(dprNow);
      renderer.setSize(cw, H, false);
      camera.aspect = cw / H; camera.updateProjectionMatrix();
    }
    updateCamera();
    placeCamera(t);
    var tower = mode === "tower";
    if (!reduceMotion) {
      glow.intensity = tower ? (mpBloom ? 0.95 : 0.5) + Math.sin(t * 0.0009) * 0.12 : (mpBloom ? 0.95 : 0.62) + Math.sin(t * 0.0009) * (mpBloom ? 0.2 : 0.14);
      if (performance.now() < skyPulseUntil) glow.intensity = 1.45 + Math.sin(t * 0.012) * 0.35;
      beacon.material.opacity = 0.24 + Math.sin(t * 0.0022) * 0.08;
      beaconRing.material.opacity = 0.42 + Math.sin(t * 0.0022) * 0.14;
      var bsc = 1 + Math.sin(t * 0.0022) * 0.035, b0 = bases[firstOpen()];
      if (b0) beaconRing.scale.set(b0.s * bsc, b0.s * bsc, 1);
      /* now and then a mote drifts up off a block, and a mastered one twinkles */
      if (Math.random() < 0.02) {
        var mp = bases[Math.floor(Math.random() * N)];
        spawn(mp.x + (Math.random() - 0.5) * 2 * mp.s, mp.y + 0.9 * mp.s, mp.z + (Math.random() - 0.5) * 2 * mp.s, 0.5 * mp.s, 1.1, Math.random() < 0.3);
      }
      if (Math.random() < 0.06) {
        for (var tw = 0; tw < 6; tw++) {
          var ti = Math.floor(Math.random() * N);
          if (meshes[ti] && meshes[ti].userData.isDone) {
            var tp = bases[ti];
            spawn(tp.x + (Math.random() - 0.5) * 1.6 * tp.s, blockTop(tp) + 0.3, tp.z + (Math.random() - 0.5) * 1.6 * tp.s, 0.4 * tp.s, 1.3, true);
            break;
          }
        }
      }
      updateAtmosphere(t);
    } else {
      glow.intensity = tower ? (mpBloom ? 0.95 : 0.5) : (mpBloom ? 0.95 : 0.62);
    }
    updateShocks();
    /* attention: the scene quiets while the eye is in the list (light,
       not motion, so it runs under reduced motion too, as a step) */
    attentionDim += (attentionGoal - attentionDim) * (reduceMotion ? 1 : 0.045);
    if (Math.abs(attentionGoal - attentionDim) < 0.002) attentionDim = attentionGoal;
    renderer.toneMappingExposure = modeExposure - 0.16 * attentionDim;
    if (handoffIndex >= 0 && performance.now() - handoffT0 > (handoffKind === "pick" ? 3000 : 2400)) { handoffIndex = -1; handoffKind = ""; }
    var open = firstOpen();
    meshes.forEach(function (mesh, i) {
      var isDoneI = mesh.userData.isDone;
      var bob = reduceMotion ? 0 : Math.sin(t * 0.0012 + i * 0.7) * 0.07;
      /* a mastered block rests higher, a trophy's poise, and sways a
         whisper on its bearings; the lift survives reduced motion */
      if (isDoneI) bob += 0.14 + (reduceMotion ? 0 : Math.sin(t * 0.0009 + i * 1.7) * 0.045);
      mesh.position.set(0, bob, 0);
      mesh.rotation.y = isDoneI && !reduceMotion ? Math.sin(t * 0.0005 + i * 2.1) * 0.05 : 0;
      /* size and squash are springs, so a block lands with weight */
      var target = isDoneI ? 1.06 : (i === open ? 1 + (reduceMotion ? 0.05 : Math.sin(t * 0.004) * 0.05 + 0.05) : 1);
      var sCur = mesh.userData.scaleCur == null ? 1 : mesh.userData.scaleCur, sVel = mesh.userData.scaleVel || 0;
      if (reduceMotion) { sCur = target; sVel = 0; }
      else { sVel += (target - sCur) * 0.16; sVel *= 0.72; sCur += sVel; }
      mesh.userData.scaleCur = sCur; mesh.userData.scaleVel = sVel;
      var sq = mesh.userData.squash || 0, sqVel = mesh.userData.squashVel || 0;
      if (reduceMotion) { sq = 0; sqVel = 0; }
      else if (sq || sqVel) {
        sqVel += -sq * 0.22 - sqVel * 0.2;
        sq += sqVel;
        if (Math.abs(sq) < 0.002 && Math.abs(sqVel) < 0.002) { sq = 0; sqVel = 0; }
      }
      mesh.userData.squash = sq; mesh.userData.squashVel = sqVel;
      mesh.scale.set(sCur * (1 + sq * 0.13), sCur * (1 - sq * 0.3), sCur * (1 + sq * 0.13));
      if (celebrating && !reduceMotion) {
        var cph = (t * 0.0011 + i * 0.37) % 1;
        mesh.position.y = 4 * 0.55 * cph * (1 - cph);
      }
      /* the hover and the handoff lift the block to meet the pointer */
      var liftGoal = (i === hoverIndex) ? 0.16 : (i === open ? 0.08 : 0);
      if (i === handoffIndex) {
        if (handoffKind === "pick") liftGoal = Math.max(liftGoal, 0.55);
        else { var sf = 1 - (performance.now() - handoffT0) / 900; if (sf > 0) liftGoal = Math.max(liftGoal, 0.5 * sf * sf); }
      }
      var liftCur = mesh.userData.liftCur || 0, liftVel = mesh.userData.liftVel || 0;
      if (reduceMotion) { liftCur = liftGoal; liftVel = 0; }
      else { liftVel += (liftGoal - liftCur) * 0.14; liftVel *= 0.7; liftCur += liftVel; }
      mesh.userData.liftCur = liftCur; mesh.userData.liftVel = liftVel;
      mesh.position.y += liftCur;
      /* the halo rides its trophy, rocking and breathing a whisper */
      var haloM = halos[i];
      if (haloM.visible) {
        haloM.position.y = mesh.position.y + 2.5 + (reduceMotion ? 0 : Math.sin(t * 0.0011 + i * 1.35) * 0.09);
        haloM.rotation.x = Math.PI / 2.35 + (reduceMotion ? 0 : Math.sin(t * 0.0007 + i * 2.3) * 0.14);
        haloM.rotation.y = reduceMotion ? 0 : Math.sin(t * 0.0005 + i * 1.1) * 0.25;
        var hs = 1 + (reduceMotion ? 0 : Math.sin(t * 0.0016 + i * 0.9) * 0.045);
        haloM.scale.set(hs, hs, hs);
      }
    });
    if (celebrating && performance.now() > celebUntil) celebrating = false;
    if (celebrating && !reduceMotion && Math.random() < 0.25) {
      var cp = bases[Math.floor(Math.random() * N)];
      spawn(cp.x, blockTop(cp) + 0.2, cp.z, 2 * cp.s, 5 * Math.sqrt(cp.s), Math.random() < 0.35);
    }
    var anyAlive = false;
    for (var k = 0; k < PMAX; k++) {
      if (pLife[k] <= 0) { pPos[k * 3 + 1] = -50; continue; }
      anyAlive = true;
      pLife[k] -= 0.011;
      var fade = Math.max(pLife[k], 0);
      if (pBright[k]) { pCol[k * 3] = 0.88 * fade; pCol[k * 3 + 1] = 0.95 * fade; pCol[k * 3 + 2] = fade; }
      else { pCol[k * 3] = 0.55 * fade; pCol[k * 3 + 1] = 0.82 * fade; pCol[k * 3 + 2] = fade; }
      pVel[k * 3 + 1] -= 0.045;
      pPos[k * 3] += pVel[k * 3] * 0.06;
      pPos[k * 3 + 1] += pVel[k * 3 + 1] * 0.06;
      pPos[k * 3 + 2] += pVel[k * 3 + 2] * 0.06;
    }
    if (anyAlive) { pGeo.attributes.position.needsUpdate = true; pGeo.attributes.color.needsUpdate = true; }
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", function () {
    /* never size from a hidden canvas; the tick loop heals it later */
    var w = canvas.clientWidth;
    if (!w) return;
    lastW = w; H = Math.max(320, Math.round(w * 0.672));
    renderer.setSize(w, H, false);
    camera.aspect = w / H; camera.updateProjectionMatrix();
  });

  /* For tests and tools: the current view, and where block i's face is
     on screen (client pixels) right now. */
  window.__worldMode = function () { return mode; };
  window.__worldProject = function (i) {
    var m = meshes[i]; if (!m || !bases[i]) return null;
    scene.updateMatrixWorld();
    var v = new THREE.Vector3();
    m.getWorldPosition(v);
    v.y += 0.5 * bases[i].s;
    v.project(camera);
    var r = canvas.getBoundingClientRect();
    return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height, onScreen: v.z < 1 && Math.abs(v.x) < 1 && Math.abs(v.y) < 1 };
  };

  setMode(mode, true);
  requestAnimationFrame(tick);
})();
