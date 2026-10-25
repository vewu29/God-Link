"use strict";
/* ================= 3D WORLD (Three.js, top-down) ================= */
(function initWorld() {
  var canvas = document.getElementById("world");
  /* Loop 74: set true by the context-lost handler below; the
     seam hooks read it so a dead world declines like an
     unstarted one instead of staging gestures nobody can see. */
  var worldLost = false;
  if (!window.THREE || !canvas) {
    if (canvas) {
      var hint = document.getElementById("worldHint");
      if (hint) hint.style.display = "none";
      var fb = document.createElement("div");
      fb.className = "world-fallback";
      fb.innerHTML = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#i-cube"/></svg><br />The 3D world could not start on this device — no problem, every block below opens the same drill.';
      canvas.replaceWith(fb);
      var hub = document.getElementById("hubView");
      if (hub) hub.classList.add("world-unavailable");
    }
    return;
  }
  var W = canvas.clientWidth || 640;
  /* Loop 17 — the stage keeps a 1.488 ratio at every width:
     height follows width (minimum 320) instead of the old
     fixed 430, so a narrow phone gets a shorter world and a
     wide desktop a taller one. The tick loop and the resize
     listener below re-derive H from the live width the same
     way, so the camera aspect always matches the real box. */
  var H = Math.max(320, Math.round(W * 0.672));
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance" });
  } catch (e) {
    canvas.style.display = "none";
    var card2 = canvas.closest ? canvas.closest(".world-card") : null;
    if (card2) card2.classList.add("world-empty");
    var hub2 = document.getElementById("hubView");
    if (hub2) hub2.classList.add("world-unavailable");
    var hint2 = document.getElementById("worldHint");
    if (hint2) hint2.textContent = "The 3D world could not start on this device — every block below opens the same drill.";
    return;
  }
  /* Loop 61: if the GPU context is lost mid-session (mobile
     browsers drop WebGL contexts under memory pressure), the
     canvas would otherwise sit blank and unresponsive under
     a hint that still promises taps work. Degrade to the same
     honest fallback the two start-failure paths above use:
     the card steps aside and every block below still opens
     its drill. No preventDefault — we have no re-init to
     offer a restored context, so the loss stands. */
  canvas.addEventListener("webglcontextlost", function () {
    worldLost = true;
    canvas.style.display = "none";
    var card3 = canvas.closest ? canvas.closest(".world-card") : null;
    if (card3) card3.classList.add("world-empty");
    var hub3 = document.getElementById("hubView");
    if (hub3) hub3.classList.add("world-unavailable");
    var hint3 = document.getElementById("worldHint");
    if (hint3) hint3.textContent = "The 3D world stopped on this device — every block below opens the same drill.";
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  if (THREE.ACESFilmicToneMapping) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
  }

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x081f3a);
  scene.fog = new THREE.Fog(0x081f3a, 34, 62);

  var camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 200);
  var camTarget = new THREE.Vector3(0, 0, 0.5);
  var azimuth = 0; // user drag target
  /* Loop 28 — camera feel: nothing the learner does moves the
     camera instantly any more. The drag sets a target and the
     real azimuth springs after it; a released drag keeps its
     momentum and glides to a stop against the same end stops;
     the look-target leans a whisper toward the block under the
     pointer (a smaller whisper toward the next block at rest);
     a mouse lends a faint parallax; hovering leans the camera
     in a touch; and a mastery celebration punches the field of
     view in a breath before it relaxes. Every ease collapses
     to a snap under prefers-reduced-motion, and the idle sway
     and breathing the camera already had stay motion-only. */
  var azimuthCur = 0, azimuthVel = 0, lastDragT = 0;
  var camTargetCur = camTarget.clone(), focusGoal = camTarget.clone();
  var parGoal = { x: 0, y: 0 }, parCur = { x: 0, y: 0 };
  var dollyCur = 1, fovCur = 46;
  /* Loop 29 — the camera gains weight and two more axes.
     TILT: a vertical drag (or the up/down arrow keys) tips
     the camera between a low, near-horizon lean and a high,
     near-top-down perch, on the same kind of spring as the
     azimuth, with its own fling. ZOOM: a pinch, the mouse
     wheel, or the +/− keys pull the world closer or let it
     recede, again springed — never a jump cut. BANK: the
     whole frame rolls a few degrees against the azimuth's
     speed, the way a heavy camera on a crane leans into a
     swing and then settles level. Double-tap (or Home)
     flies every channel home. Every ease still collapses
     to a snap under prefers-reduced-motion. */
  var tilt = 0, tiltCur = 0, tiltVel = 0, lastTiltT = 0;
  var zoomGoal = 1, zoomCur = 1;
  var bankCur = 0, prevAzimuthCur = 0;
  function resetView() {
    azimuth = 0; azimuthVel = 0;
    tilt = 0; tiltVel = 0;
    zoomGoal = 1;
  }
  function placeCamera(t) {
    var sway = reduceMotion ? 0 : Math.sin(t * 0.00008) * 0.04;
    var a = azimuthCur + sway;
    var dol = dollyCur * zoomCur;
    var r = 27 * dol, h = 24 * (0.9 + 0.1 * dol) * (1 + tiltCur * 0.17);
    var breathe = reduceMotion ? 0 : Math.sin(t * 0.00045) * 0.3;
    camera.position.set(
      Math.sin(a) * r * 0.42 + parCur.x,
      h + breathe + parCur.y,
      Math.cos(a) * r * (0.62 - tiltCur * 0.07) + 4
    );
    camera.lookAt(camTargetCur);
    /* the crane's lean: roll against the swing, applied
       after lookAt so it never fights the framing */
    if (bankCur) camera.rotateZ(bankCur);
  }
  function updateCamera() {
    /* fling: a released drag glides on its last velocity,
       decaying each frame, and dies against the end stops */
    if (!dragging && azimuthVel) {
      azimuth += azimuthVel * 0.55;
      if (azimuth > 0.85) { azimuth = 0.85; azimuthVel = 0; }
      if (azimuth < -0.85) { azimuth = -0.85; azimuthVel = 0; }
      azimuthVel *= 0.92;
      if (Math.abs(azimuthVel) < 0.00004) azimuthVel = 0;
    }
    var ease = reduceMotion ? 1 : 0.08;
    azimuthCur += (azimuth - azimuthCur) * ease;
    if (Math.abs(azimuth - azimuthCur) < 0.00005) azimuthCur = azimuth;
    /* Loop 29: banking — the frame rolls against however
       fast the azimuth is actually travelling this frame,
       then settles back to level as the swing dies */
    var angVel = azimuthCur - prevAzimuthCur;
    prevAzimuthCur = azimuthCur;
    var bankGoal = Math.max(-0.05, Math.min(0.05, -angVel * 6));
    bankCur += (bankGoal - bankCur) * (reduceMotion ? 1 : 0.07);
    if (Math.abs(bankCur) < 0.0004 && !bankGoal) bankCur = 0;
    /* Loop 29: tilt fling — a released vertical drag tips on
       its last velocity, decaying against the same stops */
    if (!dragging && tiltVel) {
      tilt += tiltVel * 0.55;
      if (tilt > 1) { tilt = 1; tiltVel = 0; }
      if (tilt < -1) { tilt = -1; tiltVel = 0; }
      tiltVel *= 0.92;
      if (Math.abs(tiltVel) < 0.0004) tiltVel = 0;
    }
    tiltCur += (tilt - tiltCur) * ease;
    if (Math.abs(tilt - tiltCur) < 0.0005) tiltCur = tilt;
    /* Loop 29: zoom breathes toward its goal a touch slower
       than the swing — mass takes a moment to arrive */
    zoomCur += (zoomGoal - zoomCur) * (reduceMotion ? 1 : 0.06);
    if (Math.abs(zoomGoal - zoomCur) < 0.001) zoomCur = zoomGoal;
    /* where the camera looks: home by default, leaning toward
       the hovered block, else a whisper toward the next one */
    focusGoal.set(0, 0, 0.5);
    if (hoverIndex >= 0 && bases[hoverIndex]) {
      var hb = bases[hoverIndex];
      focusGoal.set(hb.x * 0.22, 0.15, 0.5 + (hb.z - 0.5) * 0.22);
    } else {
      var oi = firstOpen();
      if (oi >= 0 && bases[oi]) {
        var ob = bases[oi];
        focusGoal.set(ob.x * 0.1, 0, 0.5 + (ob.z - 0.5) * 0.1);
      }
    }
    /* Loop 47: a handoff outranks hover and habit — while a
       block is being picked up or set down, the camera looks
       at that block, harder for the pick-up than the return */
    if (handoffIndex >= 0 && bases[handoffIndex]) {
      var gb = bases[handoffIndex];
      var gAmt = handoffKind === "pick" ? 0.45 : 0.3;
      focusGoal.set(gb.x * gAmt, 0.2, 0.5 + (gb.z - 0.5) * gAmt);
    }
    var fe = reduceMotion ? 1 : 0.045;
    camTargetCur.x += (focusGoal.x - camTargetCur.x) * fe;
    camTargetCur.y += (focusGoal.y - camTargetCur.y) * fe;
    camTargetCur.z += (focusGoal.z - camTargetCur.z) * fe;
    /* pointer parallax and the hover lean-in */
    var pe = reduceMotion ? 1 : 0.05;
    parCur.x += (parGoal.x - parCur.x) * pe;
    parCur.y += (parGoal.y - parCur.y) * pe;
    var dollyGoal = hoverIndex >= 0 ? 0.95 : 1;
    /* Loop 47: the world leans in for a handoff — closest for
       the pick-up, a step back for the set-down */
    if (handoffIndex >= 0) dollyGoal = handoffKind === "pick" ? 0.86 : 0.93;
    dollyCur += (dollyGoal - dollyCur) * (reduceMotion ? 1 : 0.05);
    /* celebration punch-in: the field of view narrows a breath
       while the blocks bounce, then relaxes back to rest */
    var fovGoal = celebrating ? 43.5 : 46;
    if (fovCur !== fovGoal) {
      fovCur += (fovGoal - fovCur) * (reduceMotion ? 1 : 0.06);
      if (Math.abs(fovGoal - fovCur) < 0.02) fovCur = fovGoal;
      camera.fov = fovCur; camera.updateProjectionMatrix();
    }
  }

  /* Loop 25 lighting rig — a three-point studio over the board:
     a cool key "sun" from the top-right that throws the shadows,
     a deep sky fill from the back-left, and a low rim from behind
     that lifts each block's silhouette off the ground. Ambient and
     hemisphere stay low because the environment map (below) now
     does the gentle base lifting, so the contrast survives. */
  scene.add(new THREE.AmbientLight(0xdceeff, 0.34));
  scene.add(new THREE.HemisphereLight(0xbfe0ff, 0x0a2547, 0.38));
  var sun = new THREE.DirectionalLight(0xf2f8ff, 1.12);
  sun.position.set(10, 22, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -16; sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 20; sun.shadow.camera.bottom = -20;
  sun.shadow.camera.far = 60;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 4;
  scene.add(sun);
  var fill = new THREE.DirectionalLight(0x7cc4ff, 0.3);
  fill.position.set(-12, 10, -8);
  scene.add(fill);
  var rim = new THREE.DirectionalLight(0x9adcff, 0.5);
  rim.position.set(-4, 6, -16);
  scene.add(rim);
  var glow = new THREE.PointLight(0x38bdf8, 0.62, 46);
  glow.position.set(0, 7, 2);
  scene.add(glow);

  /* Loop 25: a tiny painted sky-dome that exists only to be
     reflected. PMREM turns it into the environment map every
     standard and physical material samples — bright sky above,
     deep floor below, two soft "windows" for the clearcoat to
     catch. It is never added to the visible scene, so the world
     itself stays deep navy; wrapped in try/catch because the
     lights alone still carry the scene if it ever fails. */
  try {
    var pmrem = new THREE.PMREMGenerator(renderer);
    var envScene = new THREE.Scene();
    var domeGeo = new THREE.SphereGeometry(50, 24, 16);
    var domeCols = [];
    var dPos = domeGeo.attributes.position;
    var cTop = new THREE.Color(0xbfe3ff), cMid = new THREE.Color(0x2f7fe0), cBot = new THREE.Color(0x06182e);
    for (var vi = 0; vi < dPos.count; vi++) {
      var vy = dPos.getY(vi) / 50;
      var cc = vy > 0 ? cMid.clone().lerp(cTop, Math.pow(vy, 0.7)) : cMid.clone().lerp(cBot, Math.pow(-vy, 0.6));
      domeCols.push(cc.r, cc.g, cc.b);
    }
    domeGeo.setAttribute("color", new THREE.Float32BufferAttribute(domeCols, 3));
    envScene.add(new THREE.Mesh(domeGeo, new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })));
    var win1 = new THREE.Mesh(new THREE.PlaneGeometry(26, 13), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    win1.position.set(-16, 20, -24); win1.lookAt(0, 0, 0); envScene.add(win1);
    var win2 = new THREE.Mesh(new THREE.PlaneGeometry(15, 8), new THREE.MeshBasicMaterial({ color: 0xbfe3ff }));
    win2.position.set(22, 12, -14); win2.lookAt(0, 0, 0); envScene.add(win2);
    scene.environment = pmrem.fromScene(envScene, 0.035).texture;
    pmrem.dispose();
  } catch (e) { /* environment is garnish — the light rig still carries the scene */ }

  /* Ground: a big soft disc with a dotted board texture */
  (function ground() {
    var c = document.createElement("canvas"); c.width = c.height = 512;
    var g = c.getContext("2d");
    var grad = g.createRadialGradient(256, 256, 40, 256, 256, 300);
    grad.addColorStop(0, "#16406f");
    grad.addColorStop(0.55, "#0d2c52");
    grad.addColorStop(1, "#081f3a");
    g.fillStyle = grad; g.fillRect(0, 0, 512, 512);
    g.fillStyle = "rgba(160,205,255,0.13)";
    for (var x = 16; x < 512; x += 32) for (var y = 16; y < 512; y += 32) {
      g.beginPath(); g.arc(x, y, 2, 0, Math.PI * 2); g.fill();
    }
    g.strokeStyle = "rgba(124,196,255,0.10)"; g.lineWidth = 1;
    for (var gx = 0; gx <= 512; gx += 32) {
      g.beginPath(); g.moveTo(gx, 0); g.lineTo(gx, 512); g.stroke();
      g.beginPath(); g.moveTo(0, gx); g.lineTo(512, gx); g.stroke();
    }
    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(6, 6);
    tex.encoding = THREE.sRGBEncoding;
    /* Loop 25: a roughness map drawn from the same radial idea —
       dark (smooth) toward each tile's middle so the sky pools
       there in a soft sheen, pale (matte) at the rim. Three.js
       reads roughness from the green channel, so grey is fine. */
    var rc = document.createElement("canvas"); rc.width = rc.height = 512;
    var rg = rc.getContext("2d");
    var rgrad = rg.createRadialGradient(256, 256, 30, 256, 256, 300);
    rgrad.addColorStop(0, "#4d4d4d");
    rgrad.addColorStop(0.55, "#8c8c8c");
    rgrad.addColorStop(1, "#e8e8e8");
    rg.fillStyle = rgrad; rg.fillRect(0, 0, 512, 512);
    var roughTex = new THREE.CanvasTexture(rc);
    roughTex.wrapS = roughTex.wrapT = THREE.RepeatWrapping; roughTex.repeat.set(6, 6);
    var m = new THREE.Mesh(
      new THREE.CircleGeometry(30, 64),
      new THREE.MeshPhysicalMaterial({ map: tex, roughnessMap: roughTex, roughness: 1, metalness: 0.05, clearcoat: 0.35, clearcoatRoughness: 0.5, envMapIntensity: 0.55 })
    );
    m.rotation.x = -Math.PI / 2; m.position.y = -0.65;
    m.receiveShadow = true;
    scene.add(m);
    /* Loop 25: a hairline-wider matte disc just beneath the board,
       so the rim reads as a machined lip catching the light */
    var lip = new THREE.Mesh(
      new THREE.CircleGeometry(30.45, 64),
      new THREE.MeshStandardMaterial({ color: 0x1b4e89, roughness: 0.6, metalness: 0.2, envMapIntensity: 0.4 })
    );
    lip.rotation.x = -Math.PI / 2; lip.position.y = -0.68;
    scene.add(lip);
  })();

  /* Block positions: a winding path */
  function blockPos(i) {
    var t = i / (BLOCKS.length - 1);
    return {
      x: Math.sin(t * Math.PI * 2.3) * 6.2,
      z: -15.5 + t * 31,
      rot: Math.sin(t * Math.PI * 2.3 + 1.2) * 0.35
    };
  }

  function topTexture(b, i) {
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var g = c.getContext("2d");
    g.fillStyle = b.color; g.fillRect(0, 0, 256, 256);
    /* soft vertical sheen so the top face catches the light */
    var sheen = g.createLinearGradient(0, 0, 0, 256);
    sheen.addColorStop(0, "rgba(255,255,255,0.42)");
    sheen.addColorStop(0.45, "rgba(255,255,255,0.07)");
    sheen.addColorStop(1, "rgba(6,30,60,0.20)");
    g.fillStyle = sheen; g.fillRect(0, 0, 256, 256);
    /* radial glow pooling at the top-left, like light on polished glass */
    var glowGrad = g.createRadialGradient(62, 48, 6, 62, 48, 150);
    glowGrad.addColorStop(0, "rgba(255,255,255,0.5)");
    glowGrad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = glowGrad; g.fillRect(0, 0, 256, 256);
    /* deep polished base band along the bottom edge */
    var baseBand = g.createLinearGradient(0, 216, 0, 256);
    baseBand.addColorStop(0, "rgba(6,30,60,0)");
    baseBand.addColorStop(1, "rgba(6,30,60,0.30)");
    g.fillStyle = baseBand; g.fillRect(0, 216, 256, 40);
    /* Loop 30: the block's own glyph, etched into the tile as a
       watermark — the same hand-drawn mark the list and the drill
       header carry, pressed into the glass beneath the print so
       the world and the list speak one language. It is read live
       from the SVG sprite (paths, rects and circles on its
       24-unit grid) and struck twice — a pale strike a breath
       down-right, then the deep strike over it — so the mark
       reads as cut into the surface, never printed on it. Any
       glyph the canvas cannot read is quietly skipped and the
       tile keeps its plain face. */
    try {
      var sym = b.icon ? document.getElementById(b.icon) : null;
      if (sym) {
        var parts = sym.querySelectorAll("path, rect, circle");
        var drawEtch = function (dx, dy, style) {
          g.save();
          g.translate(128 + dx, 126 + dy); g.scale(7.2, 7.2); g.translate(-12, -12);
          g.strokeStyle = style; g.lineWidth = 1.5;
          g.lineCap = "round"; g.lineJoin = "round"; g.fillStyle = style;
          for (var pi = 0; pi < parts.length; pi++) {
            var el = parts[pi], tag = el.tagName.toLowerCase();
            if (tag === "path") {
              var d = el.getAttribute("d");
              if (d && window.Path2D) g.stroke(new Path2D(d));
            } else if (tag === "rect") {
              g.beginPath();
              g.rect(parseFloat(el.getAttribute("x")) || 0, parseFloat(el.getAttribute("y")) || 0,
                parseFloat(el.getAttribute("width")) || 0, parseFloat(el.getAttribute("height")) || 0);
              g.stroke();
            } else if (tag === "circle") {
              g.beginPath();
              g.arc(parseFloat(el.getAttribute("cx")) || 0, parseFloat(el.getAttribute("cy")) || 0,
                parseFloat(el.getAttribute("r")) || 0, 0, Math.PI * 2);
              if (el.getAttribute("fill") === "currentColor") g.fill(); else g.stroke();
            }
          }
          g.restore();
        };
        drawEtch(1.6, 1.6, "rgba(255,255,255,0.20)");
        drawEtch(0, 0, "rgba(4,30,58,0.15)");
      }
    } catch (etchErr) { /* the tile keeps its plain face */ }
    /* tiny sparkles */
    g.fillStyle = "rgba(255,255,255,0.75)";
    [[36, 200], [222, 42], [206, 224], [46, 40]].forEach(function (pt) {
      g.beginPath(); g.arc(pt[0], pt[1], 3, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(pt[0], pt[1], 7, 0, Math.PI * 2);
      g.fillStyle = "rgba(255,255,255,0.18)"; g.fill();
      g.fillStyle = "rgba(255,255,255,0.75)";
    });
    /* glossy diagonal band */
    g.save();
    g.beginPath(); g.rect(0, 0, 256, 256); g.clip();
    g.translate(128, 128); g.rotate(-0.5); g.translate(-128, -128);
    g.fillStyle = "rgba(255,255,255,0.13)"; g.fillRect(-40, 18, 340, 44);
    g.restore();
    /* inset border, like a polished tile edge */
    g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 5;
    g.beginPath();
    if (g.roundRect) g.roundRect(11, 11, 234, 234, 26); else g.rect(11, 11, 234, 234);
    g.stroke();
    g.strokeStyle = "rgba(6,30,60,0.16)"; g.lineWidth = 2;
    g.beginPath();
    if (g.roundRect) g.roundRect(17, 17, 222, 222, 21); else g.rect(17, 17, 222, 222);
    g.stroke();
    g.fillStyle = "#041e3a";
    g.shadowColor = "rgba(255,255,255,0.55)"; g.shadowOffsetY = 2; g.shadowBlur = 0;
    g.font = "700 80px 'JetBrains Mono', monospace";
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(String(i + 1), 128, 82);
    g.font = "700 29px 'Sora', sans-serif";
    var words = b.short.split(" ");
    if (words.length > 1 && b.short.length > 9) {
      g.fillText(words[0], 128, 148);
      g.fillText(words.slice(1).join(" "), 128, 182);
    } else {
      g.fillText(b.short, 128, 164);
    }
    /* Loop 22: the block's verb rides under its name — one small
       word that says what the block DOES (say, store, listen…). */
    if (b.verb) {
      g.font = "700 17px 'Sora', sans-serif";
      g.fillStyle = "rgba(4,30,58,0.68)";
      g.shadowOffsetY = 1;
      if ("letterSpacing" in g) g.letterSpacing = "3px";
      g.fillText(b.verb.toUpperCase(), 128, 222);
      if ("letterSpacing" in g) g.letterSpacing = "0px";
    }
    var tex = new THREE.CanvasTexture(c);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = 4;
    return tex;
  }

  /* Loop 25: one shared radial-fade texture, reused as every
     block's soft contact shadow — it grounds each block even
     where the sun's real shadow falls soft. */
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

  /* Loop 26: one shared soft-dot sprite — a radial puff that
     turns every particle system below (bursts, ambient motes,
     haze) from hard squares into round motes of light. */
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

  var group = new THREE.Group(); scene.add(group);
  var meshes = [], rings = [], bases = [], pedestals = [];
  /* Loop 30: the trophy furniture — one shared rim torus and one
     shared glow disc for every plinth, cloned per block only in
     material (each block's light is its own). The rim is a thin
     ring of light seated on the pedestal's top edge; the glow
     pools on the board beneath it. Both rest invisible and are
     lit purely by state in refreshWorld. */
  var rims = [], glows = [];
  var rimGeo = new THREE.TorusGeometry(2.55, 0.045, 8, 44);
  var glowGeo = new THREE.CircleGeometry(3.2, 32);
  /* Loop 31: the crown — one shared halo torus floated above
     every block, lit only for a mastered trophy (refreshWorld
     owns its state; the tick loop rides it with its block). */
  var halos = [];
  var haloGeo = new THREE.TorusGeometry(1.5, 0.05, 8, 44);
  BLOCKS.forEach(function (b, i) {
    var p = blockPos(i);
    /* Loop 25: the blocks become lacquered objects — physical
       materials with a clearcoat skin over the colour, reflections
       fed by the environment map, and a dedicated deep-navy
       underside instead of a stretched side face. */
    var side = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(b.color).multiplyScalar(0.68), roughness: 0.34, metalness: 0.1, clearcoat: 0.55, clearcoatRoughness: 0.32, envMapIntensity: 0.85 });
    var top = new THREE.MeshPhysicalMaterial({ map: topTexture(b, i), roughness: 0.24, metalness: 0.08, clearcoat: 0.85, clearcoatRoughness: 0.18, envMapIntensity: 1.15 });
    var bottom = new THREE.MeshStandardMaterial({ color: 0x0d2c52, roughness: 0.7, metalness: 0.1, envMapIntensity: 0.4 });
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.3, 3.4), [side, side, top, bottom, side, side]);
    mesh.position.set(p.x, 0, p.z);
    mesh.rotation.y = p.rot;
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.userData.index = i;
    /* Loop 30: keep handles on the two materials that carry the
       block's state language, so refreshWorld can matte, warm
       and polish without walking the material array. */
    mesh.userData.topMat = top; mesh.userData.sideMat = side;
    /* crisp bevel edge lines, so every block reads like polished glass tile */
    var edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: 0xd6ecff, transparent: true, opacity: 0.34 })
    );
    mesh.add(edges);
    group.add(mesh); meshes.push(mesh); bases.push(p);
    /* pedestal plinth under each block */
    var ped = new THREE.Mesh(
      new THREE.CylinderGeometry(2.55, 2.8, 0.28, 36),
      new THREE.MeshPhysicalMaterial({ color: 0x14406f, roughness: 0.42, metalness: 0.25, clearcoat: 0.4, clearcoatRoughness: 0.4, envMapIntensity: 0.6, emissive: 0x0a2547, emissiveIntensity: 0.4 })
    );
    ped.position.set(p.x, -0.5, p.z);
    ped.receiveShadow = true;
    group.add(ped); pedestals.push(ped);
    /* Loop 30: the trophy rim on the plinth's top edge, and the
       under-light pooled beneath it — both dark until the block
       earns them (refreshWorld owns their state). */
    var rim = new THREE.Mesh(rimGeo, new THREE.MeshBasicMaterial({
      color: 0x9adcff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    rim.rotation.x = -Math.PI / 2;
    rim.position.set(p.x, -0.36, p.z);
    rim.visible = false;
    group.add(rim); rims.push(rim);
    var glowDisc = new THREE.Mesh(glowGeo, new THREE.MeshBasicMaterial({
      map: softDotTex, color: 0x2f7fe0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    glowDisc.rotation.x = -Math.PI / 2;
    glowDisc.position.set(p.x, -0.59, p.z);
    glowDisc.visible = false;
    group.add(glowDisc); glows.push(glowDisc);
    /* Loop 31: the halo itself — a thin ring of ice light
       hovering over the block like a crown on a cushion. It
       rests invisible; mastery floats it (see refreshWorld
       and the tick loop, which rocks and breathes it). */
    var halo = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({
      color: 0xbfe6ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    halo.rotation.x = Math.PI / 2.35;
    halo.position.set(p.x, 2.5, p.z);
    halo.visible = false;
    group.add(halo); halos.push(halo);
    /* progress ring lying flat around the block */
    var ring = new THREE.Mesh(
      new THREE.RingGeometry(2.15, 2.5, 40, 1, Math.PI / 2, 0.01),
      new THREE.MeshBasicMaterial({ color: 0x2f7fe0, side: THREE.DoubleSide, transparent: true, opacity: 0.95 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(p.x, -0.58, p.z);
    group.add(ring); rings.push(ring);
    /* Loop 25: the soft contact shadow pooling under the block */
    var contact = new THREE.Mesh(
      new THREE.CircleGeometry(2.6, 32),
      new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, opacity: 0.5, depthWrite: false })
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.set(p.x, -0.6, p.z);
    group.add(contact);
  });

  /* Loop 6: a soft beacon marks the next block from across the
     world, so the learner's eye lands on the current goal before
     they read a word of the list. */
  var beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.34, 7.2, 12, 1, true),
    new THREE.MeshBasicMaterial({ color: 0x7cc4ff, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  beacon.position.y = 3.7;
  scene.add(beacon);
  var beaconRing = new THREE.Mesh(
    new THREE.RingGeometry(2.72, 2.94, 48),
    new THREE.MeshBasicMaterial({ color: 0x7cc4ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false })
  );
  beaconRing.rotation.x = -Math.PI / 2;
  beaconRing.position.y = -0.56;
  scene.add(beaconRing);

  /* ================= Loop 27: THE LIT ROAD =================
     The winding path the blocks sit on, drawn onto the board
     itself: a dashed ribbon of light following the very curve
     the blocks were laid along. The stretch the learner has
     already travelled burns ice-bright; the road ahead rests
     dim; and one soft pulse of light forever rides from the
     last mastered block toward the next, so the way forward
     reads at a glance from across the room. Vertex colours are
     rewritten by paintRoad() whenever progress changes
     (refreshWorld calls it); the pulse rides inside
     updateAtmosphere, so it stills with the rest of the air
     under reduced motion. All buffers are built once — the
     road never allocates per frame. */
  var roadCurve = new THREE.CatmullRomCurve3(
    bases.map(function (p) { return new THREE.Vector3(p.x, 0, p.z); }),
    false, "catmullrom", 0.35
  );
  var roadGeo = new THREE.BufferGeometry();
  var roadTArr = [];
  (function buildRoad() {
    var SEG = 240, HW = 0.55, pts = roadCurve.getSpacedPoints(SEG);
    var pos = [], col = [];
    for (var s = 0; s < SEG; s++) {
      if (s % 4 >= 2) continue; /* dashes: two segments lit, two resting */
      var a = pts[s], b = pts[s + 1];
      var tx = b.x - a.x, tz = b.z - a.z;
      var tl = Math.sqrt(tx * tx + tz * tz) || 1;
      var px = -tz / tl * HW, pz = tx / tl * HW;
      var quad = [
        [a.x - px, a.z - pz], [a.x + px, a.z + pz],
        [b.x + px, b.z + pz], [b.x - px, b.z - pz]
      ];
      var order = [0, 1, 2, 0, 2, 3];
      for (var k = 0; k < 6; k++) {
        pos.push(quad[order[k]][0], -0.615, quad[order[k]][1]);
        col.push(0.13, 0.30, 0.52);
        roadTArr.push(s / SEG);
      }
    }
    roadGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    roadGeo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  })();
  var road = new THREE.Mesh(roadGeo, new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.6, depthWrite: false
  }));
  scene.add(road);
  function paintRoad() {
    var open = firstOpen();
    var frontier = open < 0 ? 1 : open / (BLOCKS.length - 1);
    var colAttr = roadGeo.attributes.color;
    for (var v = 0; v < roadTArr.length; v++) {
      var t = roadTArr[v];
      if (t <= frontier) colAttr.setXYZ(v, 0.58, 0.84, 1.0);
      else if (t <= frontier + 0.035) colAttr.setXYZ(v, 0.32, 0.52, 0.82);
      else colAttr.setXYZ(v, 0.13, 0.30, 0.52);
    }
    colAttr.needsUpdate = true;
  }
  paintRoad();
  /* The travelling pulse — one soft sprite riding the road
     from the last mastered block to the next one (the whole
     road, slowly, once every block is mastered). */
  var roadPulse = new THREE.Sprite(new THREE.SpriteMaterial({
    map: softDotTex, color: 0xd8f1ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending
  }));
  roadPulse.scale.set(2.4, 2.4, 1);
  scene.add(roadPulse);
  function updateRoadPulse(t) {
    var open = firstOpen();
    var tEnd = open < 0 ? 1 : open / (BLOCKS.length - 1);
    var tStart = open > 0 ? (open - 1) / (BLOCKS.length - 1) : 0;
    var dur = open < 0 ? 7000 : 3400;
    var ph = (t % dur) / dur;
    var ease = ph < 0.5 ? 2 * ph * ph : 1 - Math.pow(-2 * ph + 2, 2) / 2;
    var pt = roadCurve.getPointAt(tStart + (tEnd - tStart) * ease);
    roadPulse.position.set(pt.x, 0.4, pt.z);
    roadPulse.material.opacity = 0.7 * Math.sin(ph * Math.PI);
  }

  /* Loop 15: at 100% the world holds a permanent bloom — mastered
     blocks and pedestals burn a little brighter and the sky-glow
     breathes deeper — and a completion fires one strong sky pulse. */
  var mpBloom = false, skyPulseUntil = 0;
  function refreshWorld() {
    if (worldLost) return;
    mpBloom = doneCount() >= BLOCKS.length;
    /* Loop 27: the lit road follows the learner's frontier */
    paintRoad();
    var open = firstOpen();
    var beaconTarget = open >= 0 ? bases[open] : null;
    beacon.visible = !!beaconTarget;
    beaconRing.visible = !!beaconTarget;
    if (beaconTarget) {
      beacon.position.x = beaconTarget.x; beacon.position.z = beaconTarget.z;
      beaconRing.position.x = beaconTarget.x; beaconRing.position.z = beaconTarget.z;
    }
    meshes.forEach(function (mesh, i) {
      var done = isDone(i);
      var frac = repsOf(i) / REPS_GOAL;
      /* Loop 30: the blocks themselves carry their state, so the
         journey reads from across the room — untouched blocks
         rest matte and quiet, a block in progress warms with a
         deep-azure ember that grows with every rep, the next
         block waits polished, and a mastered block is radiant:
         full emissive over a mirror-gloss skin. */
      var warm = !done && frac > 0;
      mesh.material.forEach(function (m) {
        if ("emissive" in m) {
          if (done) { m.emissive.setHex(0x2f7fe0); m.emissiveIntensity = mpBloom ? 1.2 : 0.85; }
          else if (warm) { m.emissive.setHex(0x1a5fb4); m.emissiveIntensity = 0.5 * frac; }
          else { m.emissive.setHex(0x000000); m.emissiveIntensity = 0; }
        }
      });
      var tm = mesh.userData.topMat, sm = mesh.userData.sideMat;
      if (tm && sm) {
        if (done) {
          tm.roughness = 0.16; tm.clearcoat = 1.0; tm.envMapIntensity = 1.35;
          sm.clearcoat = 0.85; sm.envMapIntensity = 1.05;
        } else if (i === open) {
          tm.roughness = 0.22; tm.clearcoat = 0.95; tm.envMapIntensity = 1.2;
          sm.clearcoat = 0.6; sm.envMapIntensity = 0.9;
        } else if (warm) {
          tm.roughness = 0.30 - 0.08 * frac; tm.clearcoat = 0.68 + 0.22 * frac; tm.envMapIntensity = 0.9 + 0.3 * frac;
          sm.clearcoat = 0.45 + 0.25 * frac; sm.envMapIntensity = 0.8 + 0.15 * frac;
        } else {
          tm.roughness = 0.44; tm.clearcoat = 0.42; tm.envMapIntensity = 0.72;
          sm.clearcoat = 0.3; sm.envMapIntensity = 0.62;
        }
      }
      if (pedestals[i]) {
        pedestals[i].material.emissive = new THREE.Color(done ? 0x2f7fe0 : 0x0a2547);
        pedestals[i].material.emissiveIntensity = done ? (mpBloom ? 1.25 : 0.9) : 0.4;
      }
      /* Loop 30: the plinth answers the block — its rim lights
         as work begins, burns for mastery, and the under-light
         pools only beneath a finished trophy. At 100% every
         rim and pool runs at full strength: the trophy room. */
      if (rims[i]) {
        var rimM = rims[i];
        if (done) { rimM.material.color.setHex(0x9adcff); rimM.material.opacity = mpBloom ? 0.95 : 0.8; }
        else if (i === open) { rimM.material.color.setHex(0x7cc4ff); rimM.material.opacity = 0.4; }
        else if (warm) { rimM.material.color.setHex(0x5fb2ff); rimM.material.opacity = 0.15 + 0.4 * frac; }
        else rimM.material.opacity = 0;
        rimM.visible = rimM.material.opacity > 0;
      }
      if (glows[i]) {
        glows[i].material.opacity = done ? (mpBloom ? 0.55 : 0.42) : 0;
        glows[i].visible = done;
      }
      /* Loop 31: the crown appears with mastery — at 100%
         every halo in the room burns at full strength. */
      if (halos[i]) {
        halos[i].material.opacity = done ? (mpBloom ? 0.95 : 0.72) : 0;
        halos[i].visible = done;
      }
      mesh.userData.isCurrent = (i === open);
      mesh.userData.isDone = done;
      var ring = rings[i];
      ring.geometry.dispose();
      ring.geometry = new THREE.RingGeometry(2.15, 2.5, 40, 1, Math.PI / 2, Math.max(0.02, frac * Math.PI * 2));
      ring.visible = frac > 0;
      ring.material.color.setHex(done ? 0x9adcff : 0x5f83ad);
    });
  }
  window.__refreshWorld = refreshWorld;
  window.__skyPulse = function () { skyPulseUntil = performance.now() + 7000; };
  refreshWorld();

  /* Loop 61 — the tile faces are baked into canvas textures
     once, at build time, in whatever fonts have arrived by
     then: on a slow connection that is the fallback sans,
     permanently, while the list beside the world wears Sora
     and JetBrains Mono. When the real faces land, rebake each
     block's top once and swap the map (disposing the old), so
     the world's numbers, names and verbs wear the same
     typefaces as everything else. If the faces were already
     in, the promise resolves at once and the rebake is one
     cheap extra bake; a browser without document.fonts simply
     keeps the first bake, exactly as before. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      meshes.forEach(function (mesh, i) {
        if (!mesh.userData.topMat) return;
        var oldMap = mesh.userData.topMat.map;
        mesh.userData.topMat.map = topTexture(BLOCKS[i], i);
        mesh.userData.topMat.needsUpdate = true;
        if (oldMap) oldMap.dispose();
      });
    });
  }

  /* --- Particles (bursts + masterpiece fountain) --- */
  var PMAX = 900;
  var pGeo = new THREE.BufferGeometry();
  var pPos = new Float32Array(PMAX * 3);
  var pVel = new Float32Array(PMAX * 3);
  var pLife = new Float32Array(PMAX);
  /* Loop 25: each mote carries a "bright" flag — near-white ice
     sparks mixed into the deep-sky motes, so bursts read duotone */
  var pBright = new Float32Array(PMAX);
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  var pCol = new Float32Array(PMAX * 3);
  pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
  var points = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.32, map: softDotTex, transparent: true, opacity: 0.95, vertexColors: true,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  points.frustumCulled = false;
  scene.add(points);
  var pNext = 0;
  function spawn(x, y, z, spread, up, bright) {
    /* Loop 53: no particle ever spawns for a reduced-motion
       learner — mastery still reads in the block's own lit,
       lifted state, so the burst is decoration, not signal. */
    if (reduceMotion) return;
    var idx = pNext; pNext = (pNext + 1) % PMAX;
    pPos[idx * 3] = x; pPos[idx * 3 + 1] = y; pPos[idx * 3 + 2] = z;
    pVel[idx * 3] = (Math.random() - 0.5) * spread;
    pVel[idx * 3 + 1] = up * (0.6 + Math.random() * 0.8);
    pVel[idx * 3 + 2] = (Math.random() - 0.5) * spread;
    pLife[idx] = 1;
    pBright[idx] = bright ? 1 : 0;
  }
  window.__burstAt = function (i, big) {
    var p = bases[i]; if (!p) return;
    /* Loop 29: the burst lands ON the block — a mastery
       compresses it hard, a small burst just presses it;
       the spring in the tick loop rebounds it with a
       stretch past its rest size before it settles. */
    var bm = meshes[i];
    if (bm) { bm.userData.squash = big ? 0.6 : 0.3; bm.userData.squashVel = 0; }
    var n = big ? 90 : 26;
    for (var k = 0; k < n; k++) spawn(p.x, 1.2, p.z, 3.2, 4.2, k % 3 === 0);
    /* Loop 26: a mastery gets a voice of its own — a flat ring
       of light rolls outward across the board from the block. */
    if (big) fireShock(p.x, p.z, 5.4, 850);
  };
  /* Loop 26: the rep tick gets its own quieter signature — a
     dozen motes rising slowly off the block's top, mostly
     bright ice, nothing like the mastery explosion. */
  window.__shimmerAt = function (i) {
    var p = bases[i]; if (!p) return;
    /* Loop 29: even a quiet rep lands with a little weight —
       the block dips a breath under the shimmer */
    var sm = meshes[i];
    if (sm) { sm.userData.squash = Math.max(sm.userData.squash || 0, 0.2); sm.userData.squashVel = 0; }
    for (var k = 0; k < 12; k++) {
      spawn(p.x + (Math.random() - 0.5) * 1.7, 1.15, p.z + (Math.random() - 0.5) * 1.7, 0.7, 1.5, k % 4 !== 3);
    }
  };
  var celebrating = false, celebUntil = 0;
  window.__celebrate = function () {
    /* Loop 53: the celebration is a bounce and a rain of
       bursts — a reduced-motion learner's world simply rests
       in its mastered state instead. */
    if (reduceMotion) return;
    celebrating = true; celebUntil = performance.now() + 9000;
    /* Loop 26: the masterpiece opens with one slow bloom ring
       rolling from the board's heart to its rim, under the rain
       of per-block bursts that follows. */
    fireShock(0, 0.5, 27, 2600);
    meshes.forEach(function (m, i) { setTimeout(function () { window.__burstAt(i, true); }, i * 110); });
  };

  /* ================= Loop 47: THE SEAM =================
     The handoffs between world and interface. The drill view
     calls __worldHandoff(i, "pick") the moment a block opens
     from the hub and holds its console back one beat, so the
     world can lean in and lift the block to meet the tap; it
     calls __worldHandoff(i, "settle") as the hub returns,
     and the block rides down onto its plinth while the camera
     leans to watch — a block mastered in that session gets a
     quiet shimmer from the world before anything else moves.
     The state is one index, one kind, one start time; the
     tick reads it for the lift, the look-target and the
     dolly, and it expires on its own. Reduced motion wants
     none of it: the hook declines (returns false) and the
     drill view swaps at once, exactly as before.
     __worldAttention is the ambient half: while the learner's
     eye is down in the block list, the scene eases its
     exposure down a breath; when the eye returns, it
     brightens back. */
  var handoffIndex = -1, handoffKind = "", handoffT0 = 0;
  window.__worldHandoff = function (i, kind) {
    if (worldLost || reduceMotion || !meshes[i]) return false;
    handoffIndex = i; handoffKind = kind; handoffT0 = performance.now();
    if (kind === "settle" && meshes[i].userData.isDone) {
      var p = bases[i];
      for (var k = 0; k < 14; k++) {
        spawn(p.x + (Math.random() - 0.5) * 1.7, 1.35, p.z + (Math.random() - 0.5) * 1.7, 0.7, 1.6, k % 4 !== 3);
      }
    }
    return true;
  };
  var attentionDim = 0, attentionGoal = 0;
  window.__worldAttention = function (on) { attentionGoal = on ? 1 : 0; };

  /* ================= Loop 26: ATMOSPHERE =================
     The air of the world. Everything here is pooled and
     preallocated — fixed buffers, no per-frame allocation —
     and the idle drift below is skipped wholesale when the
     learner prefers reduced motion. */

  /* Shockwaves: a small pool of flat light-rings. A mastery
     fires one at its block; the masterpiece fires one slow
     bloom from the board's centre. Each ring owns its material
     so opacities never fight. */
  var shockPool = [];
  for (var si = 0; si < 6; si++) {
    var shockMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.86, 1, 48),
      new THREE.MeshBasicMaterial({ color: 0x9adcff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    shockMesh.rotation.x = -Math.PI / 2;
    shockMesh.position.y = -0.5;
    shockMesh.visible = false;
    scene.add(shockMesh);
    shockPool.push({ mesh: shockMesh, active: false, t0: 0, dur: 900, maxR: 5 });
  }
  var shockNext = 0;
  function fireShock(x, z, maxR, dur) {
    /* Loop 53: shockwaves are pure motion — they never fire
       under reduced motion (the tick's updateShocks call then
       has nothing to run). */
    if (reduceMotion) return;
    var s = shockPool[shockNext]; shockNext = (shockNext + 1) % shockPool.length;
    s.active = true; s.t0 = performance.now(); s.dur = dur; s.maxR = maxR;
    s.mesh.position.x = x; s.mesh.position.z = z;
    s.mesh.visible = true;
  }
  function updateShocks() {
    var now = performance.now();
    for (var i = 0; i < shockPool.length; i++) {
      var s = shockPool[i];
      if (!s.active) continue;
      var f = (now - s.t0) / s.dur;
      if (f >= 1) { s.active = false; s.mesh.visible = false; continue; }
      var ease = 1 - Math.pow(1 - f, 3);
      var r = 0.4 + (s.maxR - 0.4) * ease;
      s.mesh.scale.set(r, r, 1);
      s.mesh.material.opacity = 0.5 * (1 - f);
    }
  }

  /* Ambient motes in three depths — far motes are larger,
     fainter and slower; near motes are small, brighter and
     quicker — so the air itself has parallax when the camera
     breathes. Every mote rises gently and sways on its own
     phase, wrapping from the board back to the ground. */
  function moteLayer(count, size, opacity, yMax, iceShare, rise) {
    var geo = new THREE.BufferGeometry();
    var pos = new Float32Array(count * 3);
    var col = new Float32Array(count * 3);
    var phase = new Float32Array(count);
    var speed = new Float32Array(count);
    for (var i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 56;
      pos[i * 3 + 1] = 0.3 + Math.random() * yMax;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 44;
      if (Math.random() < iceShare) { col[i * 3] = 0.82; col[i * 3 + 1] = 0.92; col[i * 3 + 2] = 1; }
      else { col[i * 3] = 0.35; col[i * 3 + 1] = 0.62; col[i * 3 + 2] = 1; }
      phase[i] = Math.random() * Math.PI * 2;
      speed[i] = 0.5 + Math.random() * 0.8;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    var pts = new THREE.Points(geo, new THREE.PointsMaterial({
      size: size, map: softDotTex, transparent: true, opacity: opacity, vertexColors: true,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    pts.frustumCulled = false;
    scene.add(pts);
    return { geo: geo, pos: pos, phase: phase, speed: speed, count: count, yMax: yMax, rise: rise };
  }
  var moteLayers = [
    moteLayer(46, 0.55, 0.15, 10, 0.25, 0.004),
    moteLayer(60, 0.34, 0.23, 8, 0.4, 0.006),
    moteLayer(80, 0.2, 0.32, 6, 0.55, 0.009)
  ];

  /* Haze: five huge, faint sprites of blue air drifting over
     the board — the cheapest volumetric feeling there is, and
     at 5% opacity it can only ever read as depth. */
  var hazeSprites = [];
  for (var hi = 0; hi < 5; hi++) {
    var haze = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDotTex, color: 0x2f7fe0, transparent: true, opacity: 0.05, depthWrite: false }));
    haze.position.set((Math.random() - 0.5) * 36, 3.5 + Math.random() * 4, (Math.random() - 0.5) * 30);
    haze.scale.set(24 + Math.random() * 14, 9 + Math.random() * 5, 1);
    haze.userData.phase = Math.random() * Math.PI * 2;
    scene.add(haze); hazeSprites.push(haze);
  }

  /* One sheet of light slanted like the key sun's rays through
     the air — a gradient plane, additive, breathing between
     4% and 7% opacity. It sits above the blocks, so it tints
     the air and never the board. */
  var lightSheet = (function () {
    var c = document.createElement("canvas"); c.width = 256; c.height = 128;
    var g = c.getContext("2d");
    var grad = g.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, "rgba(190,225,255,0)");
    grad.addColorStop(0.5, "rgba(190,225,255,0.85)");
    grad.addColorStop(1, "rgba(190,225,255,0)");
    g.fillStyle = grad; g.fillRect(0, 0, 256, 128);
    g.globalCompositeOperation = "destination-in";
    var fade = g.createLinearGradient(0, 0, 0, 128);
    fade.addColorStop(0, "rgba(0,0,0,0)");
    fade.addColorStop(0.35, "rgba(0,0,0,1)");
    fade.addColorStop(0.75, "rgba(0,0,0,1)");
    fade.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = fade; g.fillRect(0, 0, 256, 128);
    var tex = new THREE.CanvasTexture(c);
    var m = new THREE.Mesh(
      new THREE.PlaneGeometry(52, 18),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })
    );
    m.position.set(2, 7.5, -3);
    m.rotation.set(-0.9, 0, 0.42);
    scene.add(m);
    return m;
  })();

  /* Horizon: a wide shore-glow ring fading the board's edge
     into the void, so the world floats on light instead of
     ending at a hard circle. Fog finishes the melt. */
  (function horizon() {
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var g = c.getContext("2d");
    var grad = g.createRadialGradient(128, 128, 40, 128, 128, 128);
    grad.addColorStop(0, "rgba(124,196,255,0)");
    grad.addColorStop(0.42, "rgba(124,196,255,0.06)");
    grad.addColorStop(0.52, "rgba(124,196,255,0.22)");
    grad.addColorStop(0.75, "rgba(80,160,255,0.08)");
    grad.addColorStop(1, "rgba(80,160,255,0)");
    g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
    var tex = new THREE.CanvasTexture(c);
    var m = new THREE.Mesh(
      new THREE.CircleGeometry(64, 48),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
    );
    m.rotation.x = -Math.PI / 2; m.position.y = -0.74;
    scene.add(m);
  })();

  /* One per-frame driver for the whole atmosphere, called from
     the tick loop only when motion is welcome. */
  function updateAtmosphere(t) {
    for (var L = 0; L < moteLayers.length; L++) {
      var lay = moteLayers[L];
      for (var i = 0; i < lay.count; i++) {
        var y = lay.pos[i * 3 + 1] + lay.rise * lay.speed[i];
        if (y > lay.yMax + 0.6) y = 0.3;
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
    lightSheet.material.opacity = 0.045 + 0.02 * (0.5 + 0.5 * Math.sin(t * 0.0005));
    /* the haze itself breathes — fog edges drift a breath in
       and out on a slow, offset rhythm */
    scene.fog.near = 34 + Math.sin(t * 0.00019) * 1.4;
    scene.fog.far = 62 + Math.sin(t * 0.00019 + 0.6) * 2.6;
    /* Loop 27: the road's pulse rides with the air */
    updateRoadPulse(t);
  }

  /* --- Picking + drag-to-look --- */
  var ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  var downX = 0, downY = 0, dragging = false, lastX = 0, lastY = 0;
  /* Loop 29: live pointers are tracked so a second finger
     turns the gesture into a pinch — the drag handlers below
     stand down while two pointers are down, and the tap that
     ends a pinch never opens a block. */
  var livePtrs = {}, pinching = false, pinchDist = 0;
  function pinchSpan() {
    var ks = Object.keys(livePtrs);
    if (ks.length < 2) return 0;
    var a = livePtrs[ks[0]], b = livePtrs[ks[1]];
    var ddx = a.x - b.x, ddy = a.y - b.y;
    return Math.sqrt(ddx * ddx + ddy * ddy);
  }
  function setPtr(e) {
    var r = canvas.getBoundingClientRect();
    ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  }
  canvas.addEventListener("pointerdown", function (e) {
    /* Loop 74: only the primary button starts a gesture. A
       right- or middle-button press used to be tracked like a
       tap-in-waiting, and its release (below) opened whatever
       block sat under it — a context-menu click could start a
       drill. Non-primary mouse buttons are simply not the
       world's business; touch and pen contacts report 0. */
    if (e.pointerType === "mouse" && e.button !== 0) return;
    livePtrs[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (Object.keys(livePtrs).length === 2) {
      pinching = true; dragging = false;
      azimuthVel = 0; tiltVel = 0;
      pinchDist = pinchSpan();
    }
    downX = lastX = e.clientX; downY = lastY = e.clientY; dragging = false;
    azimuthVel = 0; tiltVel = 0; // Loop 28/29: a fresh press kills any glide
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", function (e) {
    if (livePtrs[e.pointerId]) livePtrs[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (pinching) {
      /* Loop 29: pinch zoom — fingers apart pulls the world
         closer, together lets it recede, on the zoom spring */
      var span = pinchSpan();
      if (span && pinchDist) zoomGoal = Math.max(0.78, Math.min(1.3, zoomGoal * (pinchDist / span)));
      pinchDist = span;
      return;
    }
    if (e.buttons !== 1) return;
    var dx = e.clientX - lastX; lastX = e.clientX;
    var dy = e.clientY - lastY; lastY = e.clientY;
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 9) dragging = true;
    if (dragging) {
      azimuth = Math.max(-0.85, Math.min(0.85, azimuth - dx * 0.005));
      /* Loop 28: remember the drag's speed so a release can
         glide — smoothed, so one jittery event can't throw it */
      azimuthVel = azimuthVel * 0.55 + (-dx * 0.005) * 0.45;
      lastDragT = performance.now();
      /* Loop 29: the vertical half of the drag tips the
         camera — drag up to rise over the board, down to
         lean in low — with the same smoothed fling */
      tilt = Math.max(-1, Math.min(1, tilt - dy * 0.004));
      tiltVel = tiltVel * 0.55 + (-dy * 0.004) * 0.45;
      lastTiltT = performance.now();
    }
  });
  /* Loop 25: hover picking — one raycast per pointermove feeds a
     pointer cursor over tappable blocks and the hover lift in the
     tick loop. Touch pointers simply leave the last position set;
     any press clears it so a drag never fights the lift. */
  var hoverIndex = -1;
  canvas.addEventListener("pointermove", function (e) {
    if (e.buttons) { hoverIndex = -1; return; }
    setPtr(e);
    /* Loop 28: a mouse lends the camera a faint parallax —
       touch pointers leave it centred */
    if (e.pointerType === "mouse" && !reduceMotion) { parGoal.x = ptr.x * 0.85; parGoal.y = ptr.y * 0.45; }
    ray.setFromCamera(ptr, camera);
    var hits = ray.intersectObjects(meshes);
    hoverIndex = hits.length ? hits[0].object.userData.index : -1;
    canvas.style.cursor = hoverIndex >= 0 ? "pointer" : "";
  });
  canvas.addEventListener("pointerleave", function () { hoverIndex = -1; canvas.style.cursor = ""; parGoal.x = 0; parGoal.y = 0; });
  canvas.addEventListener("pointercancel", function (e) {
    delete livePtrs[e.pointerId];
    /* Loop 74: the pinch latch clears only when no pointer
       remains — see pointerup below. */
    if (Object.keys(livePtrs).length === 0) {
      pinching = false;
      /* Loop 74: a cancelled gesture also retires the hover —
         no pointermove may follow to clear it, so the block it
         last touched kept its lift, its pointer cursor and the
         camera's parallax lean indefinitely. Pointerleave has
         always reset all three; a cancel now does the same. */
      hoverIndex = -1; canvas.style.cursor = ""; parGoal.x = 0; parGoal.y = 0;
    }
    /* Loop 61: a cancelled gesture ends the drag too — the
       flag must not stay wedged on (see pointerup below) */
    dragging = false;
    azimuthVel = 0; tiltVel = 0;
  });
  canvas.addEventListener("pointerup", function (e) {
    /* Loop 74: a non-primary release is not a tap and not the
       end of anything — the mouse is one pointer, so a right
       release mid-drag must not untrack or conclude the left
       button's gesture still in progress. */
    if (e.pointerType === "mouse" && e.button !== 0) return;
    delete livePtrs[e.pointerId];
    if (pinching) {
      /* Loop 29: the last finger lifting off a pinch is not
         a tap — the gesture is over, nothing opens.
         Loop 74: the latch now holds until that last finger
         is actually up. It used to clear the moment the count
         dropped below two — the FIRST lift — so the final
         finger's lift fell through to the tap branch below
         and opened whatever block it happened to leave over:
         a pinch never sets `dragging` (its moves take the
         pinch branch), so nothing marked the lift as anything
         but a clean tap. Pinch to zoom, release in the wrong
         order over a block, and a drill you never asked for
         opened. */
      if (Object.keys(livePtrs).length === 0) pinching = false;
      dragging = false;
      return;
    }
    /* Loop 28: a press held still before release has no glide
       left in it — only a true flick keeps its momentum.
       Loop 61: the release must also END the drag. This
       handler read `dragging` but never cleared it outside
       the pinch branch, so after the first drag the flag
       stayed on forever — and updateCamera's fling blocks,
       both gated on !dragging, never ran: the Loop 28 swing
       glide and the Loop 29 tilt fling have been dead since
       they shipped. Capture the state, clear the flag, and
       the preserved velocity finally gets its glide. */
    var wasDragging = dragging;
    dragging = false;
    if (wasDragging && performance.now() - lastDragT > 90) azimuthVel = 0;
    if (wasDragging && performance.now() - lastTiltT > 90) tiltVel = 0;
    if (wasDragging) return;
    setPtr(e);
    ray.setFromCamera(ptr, camera);
    var hits = ray.intersectObjects(meshes);
    if (hits.length) openBlock(hits[0].object.userData.index);
  });
  /* Loop 29: the wheel zooms too, for the desktop learner —
     scroll up leans in, down steps back, always on the spring */
  canvas.addEventListener("wheel", function (e) {
    e.preventDefault();
    zoomGoal = Math.max(0.78, Math.min(1.3, zoomGoal + e.deltaY * 0.0012));
  }, { passive: false });
  /* Loop 29: a double-tap or double-click flies the whole
     camera home — swing, tilt and zoom together */
  canvas.addEventListener("dblclick", function (e) { e.preventDefault(); resetView(); });
  /* Loop 28: the world takes the keyboard too — arrow keys
     swing the camera in the same eased steps a drag takes
     (same clamp, same spring home in updateCamera), Home
     returns to centre.
     Loop 29: the keyboard map grows with the new axes —
     up/down tip the tilt, +/− work the zoom, and Home now
     flies every channel home, not just the swing.
     Loop 52: the keyboard map completes — Enter and Space
     open the next unmastered block through the app's own
     openBlock (the same pick-up, focus landing and focus
     return a tapped tile gets), so the world is fully
     operable without ever touching the tile grid. When every
     block is mastered they announce that instead of opening
     nothing in silence. */
  canvas.addEventListener("keydown", function (e) {
    var used = true;
    if (e.key === "ArrowLeft") azimuth = Math.max(-0.85, azimuth - 0.16);
    else if (e.key === "ArrowRight") azimuth = Math.min(0.85, azimuth + 0.16);
    else if (e.key === "ArrowUp") tilt = Math.min(1, tilt + 0.18);
    else if (e.key === "ArrowDown") tilt = Math.max(-1, tilt - 0.18);
    else if (e.key === "+" || e.key === "=") zoomGoal = Math.max(0.78, zoomGoal - 0.09);
    else if (e.key === "-" || e.key === "_") zoomGoal = Math.min(1.3, zoomGoal + 0.09);
    else if (e.key === "Home") resetView();
    else if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      var nx = (typeof firstOpen === "function") ? firstOpen() : -1;
      if (nx >= 0 && typeof openBlock === "function") openBlock(nx);
      else if (window.cbAnnounce) window.cbAnnounce("Every block is mastered — the tiles below still open any block.");
    }
    else used = false;
    if (used) { azimuthVel = 0; tiltVel = 0; e.preventDefault(); }
  });

  /* Loop 61 — the preference is held as a live query, not a
     snapshot: the room-travel system (Loop 45) has read
     .matches live since it shipped, but the world froze its
     answer at build time, so a learner who switched reduced
     motion on mid-session (an OS toggle, a settings change)
     kept a breathing, bursting world until reload. Every
     consumer below reads this variable per call or per frame,
     so one assignment stills — or releases — the whole world.
     Turning it on also parks the machinery mid-gesture: any
     glide, handoff or celebration in flight is over, not
     merely frozen, so nothing resumes oddly when it lifts. */
  var reduceMotionMQ = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var reduceMotion = !!(reduceMotionMQ && reduceMotionMQ.matches);
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
  var lastW = W;
  var lastDPR = Math.min(window.devicePixelRatio || 1, 2);
  function tick(t) {
    requestAnimationFrame(tick);
    /* Rest while the world is off-screen (another section open, a drill
       in front of it, or the tab hidden) — no rendering, no battery. */
    if (document.hidden || !canvas.getClientRects().length) return;
    /* Self-heal: if the canvas changed size while hidden (rotation,
       window resize), re-fit the renderer before drawing again.
       Loop 61: the pixel ratio is part of the fit — it was set
       once at build time, so a browser zoom or a move to a
       display with a different density left the buffer at the
       old ratio and the world rendered soft (or oversized)
       until reload. The resize listener below re-sizes without
       touching the ratio; this check heals it on the next
       frame either way. */
    var cw = canvas.clientWidth;
    var ch = cw ? Math.max(320, Math.round(cw * 0.672)) : H;
    var dprNow = Math.min(window.devicePixelRatio || 1, 2);
    if (cw && (cw !== lastW || ch !== H || dprNow !== lastDPR)) {
      lastW = cw; H = ch; lastDPR = dprNow;
      renderer.setPixelRatio(dprNow);
      renderer.setSize(cw, H, false);
      camera.aspect = cw / H; camera.updateProjectionMatrix();
    }
    /* Loop 28: ease every camera channel first, then place it */
    updateCamera();
    placeCamera(t || 0);
    /* the sky-glow light breathes, and a mote of dust drifts up over a
       random block now and then, so the world feels alive at rest */
    if (!reduceMotion) {
      glow.intensity = (mpBloom ? 0.95 : 0.62) + Math.sin((t || 0) * 0.0009) * (mpBloom ? 0.2 : 0.14);
      if (performance.now() < skyPulseUntil) glow.intensity = 1.45 + Math.sin((t || 0) * 0.012) * 0.35;
      beacon.material.opacity = 0.24 + Math.sin((t || 0) * 0.0022) * 0.08;
      beaconRing.material.opacity = 0.42 + Math.sin((t || 0) * 0.0022) * 0.14;
      var beaconScale = 1 + Math.sin((t || 0) * 0.0022) * 0.035;
      beaconRing.scale.set(beaconScale, beaconScale, 1);
      if (Math.random() < 0.02) {
        var mp = bases[Math.floor(Math.random() * bases.length)];
        spawn(mp.x + (Math.random() - 0.5) * 2, 0.9, mp.z + (Math.random() - 0.5) * 2, 0.5, 1.1, Math.random() < 0.3);
      }
      /* Loop 31: trophies twinkle — now and then a bright mote
         lifts off a mastered block, so finished work keeps
         catching the light long after its celebration ended.
         A few random probes find one without allocating. */
      if (Math.random() < 0.06) {
        for (var tw = 0; tw < 6; tw++) {
          var ti = Math.floor(Math.random() * meshes.length);
          if (meshes[ti] && meshes[ti].userData.isDone) {
            var tp = bases[ti];
            spawn(tp.x + (Math.random() - 0.5) * 1.6, 1.5, tp.z + (Math.random() - 0.5) * 1.6, 0.4, 1.3, true);
            break;
          }
        }
      }
      /* Loop 26: the air moves — layered motes, haze, the
         light sheet and the breathing fog edge */
      updateAtmosphere(t || 0);
    }
    /* Loop 26: celebration shockwaves advance here. Loop 61:
       the old comment claimed they run even for reduced-motion
       learners — Loop 53 reversed that (fireShock never fires
       under reduced motion), so under it this call simply has
       an empty pool to scan, exactly as fireShock's own
       comment already said. */
    updateShocks();
    /* Loop 47: attention — the scene itself quiets while the
       eye is in the list, easing exposure down a breath and
       back. Light, not motion: it runs under reduced motion
       too, where the ease collapses to a step. */
    attentionDim += (attentionGoal - attentionDim) * (reduceMotion ? 1 : 0.045);
    if (Math.abs(attentionGoal - attentionDim) < 0.002) attentionDim = attentionGoal;
    renderer.toneMappingExposure = 1.1 - 0.16 * attentionDim;
    /* Loop 47: a handoff lives for one gesture, then lets go */
    if (handoffIndex >= 0 && performance.now() - handoffT0 > (handoffKind === "pick" ? 3000 : 2400)) { handoffIndex = -1; handoffKind = ""; }
    var open = firstOpen();
    meshes.forEach(function (mesh, i) {
      var base = bases[i];
      var bob = reduceMotion ? 0 : Math.sin((t || 0) * 0.0012 + i * 0.7) * 0.07;
      /* Loop 30: a mastered block rests higher on its plinth —
         a trophy's poise — and sways a breath on its bearings
         so the finished stretch of the road feels displayed,
         not parked. The lift itself is steady and survives
         reduced motion; the sway does not. The sway is a whisper
         (±0.05 rad) so the etched face always stays readable. */
      if (mesh.userData.isDone) {
        bob += 0.14 + (reduceMotion ? 0 : Math.sin((t || 0) * 0.0009 + i * 1.7) * 0.045);
      }
      mesh.position.y = bob;
      mesh.rotation.y = base.rot + (mesh.userData.isDone && !reduceMotion ? Math.sin((t || 0) * 0.0005 + i * 2.1) * 0.05 : 0);
      var target = 1;
      if (mesh.userData.isDone) target = 1.06;
      else if (i === open) target = 1 + (reduceMotion ? 0.05 : Math.sin((t || 0) * 0.004) * 0.05 + 0.05);
      /* Loop 29: size is a spring now, not a lerp — velocity,
         stiffness and damping, so a growing block overshoots
         a whisper past its mark and settles like it has mass.
         The squash channel rides on top: compression squeezes
         Y down and bulges X/Z out, and the same under-damped
         spring throws it back past flat into a stretch before
         it rests. Reduced motion snaps everything flat. */
      var sCur = mesh.userData.scaleCur == null ? 1 : mesh.userData.scaleCur;
      var sVel = mesh.userData.scaleVel || 0;
      if (reduceMotion) { sCur = target; sVel = 0; }
      else {
        sVel += (target - sCur) * 0.16;
        sVel *= 0.72;
        sCur += sVel;
      }
      mesh.userData.scaleCur = sCur; mesh.userData.scaleVel = sVel;
      var sq = mesh.userData.squash || 0, sqVel = mesh.userData.squashVel || 0;
      if (reduceMotion) { sq = 0; sqVel = 0; }
      else if (sq || sqVel) {
        sqVel += -sq * 0.22 - sqVel * 0.2;
        sq += sqVel;
        if (Math.abs(sq) < 0.002 && Math.abs(sqVel) < 0.002) { sq = 0; sqVel = 0; }
      }
      mesh.userData.squash = sq; mesh.userData.squashVel = sqVel;
      mesh.scale.set(
        sCur * (1 + sq * 0.13),
        sCur * (1 - sq * 0.3),
        sCur * (1 + sq * 0.13)
      );
      if (celebrating && !reduceMotion) {
        /* Loop 29: the celebration bounce falls like it means
           it — a gravity arc (fast landing, soft apex) instead
           of the old weightless sine hop. Loop 53: never under
           reduced motion, even if a celebration somehow began. */
        var cph = ((t || 0) * 0.0011 + i * 0.37) % 1;
        mesh.position.y = 4 * 0.55 * cph * (1 - cph);
      }
      mesh.position.x = base.x; mesh.position.z = base.z;
      /* Loop 25: the block under the learner's pointer rises a
         breath to meet it; the next block idles a touch higher
         too. Purely additive over the bob/celebration height.
         Loop 29: the rise is springed too, so the block
         arrives with a tiny overshoot and settles onto its
         hover instead of gliding to a stop. */
      var liftGoal = (i === hoverIndex) ? 0.16 : (i === open ? 0.08 : 0);
      /* Loop 47: the handoff lift — a picked-up block rises
         to meet the tap and holds while the console rises
         over it; a set-down block starts raised and rides
         the lift spring home as the handoff's first second
         runs out, settling onto its plinth */
      if (i === handoffIndex) {
        if (handoffKind === "pick") liftGoal = Math.max(liftGoal, 0.55);
        else {
          var sf = 1 - (performance.now() - handoffT0) / 900;
          if (sf > 0) liftGoal = Math.max(liftGoal, 0.5 * sf * sf);
        }
      }
      var liftCur = mesh.userData.liftCur || 0, liftVel = mesh.userData.liftVel || 0;
      if (reduceMotion) { liftCur = liftGoal; liftVel = 0; }
      else {
        liftVel += (liftGoal - liftCur) * 0.14;
        liftVel *= 0.7;
        liftCur += liftVel;
      }
      mesh.userData.liftCur = liftCur; mesh.userData.liftVel = liftVel;
      mesh.position.y += liftCur;
      /* Loop 31: the halo rides with its trophy — it takes the
         block's final height (bob, celebration and lift all
         included), rocks slowly on its tilt and breathes a
         whisper in size, so the crown feels floated on air,
         not bolted on. Reduced motion parks it level and
         still above the block; the lift itself is state, so
         the halo still appears there. */
      var haloM = halos[i];
      if (haloM && haloM.visible) {
        haloM.position.y = mesh.position.y + 2.5 + (reduceMotion ? 0 : Math.sin((t || 0) * 0.0011 + i * 1.35) * 0.09);
        haloM.rotation.x = Math.PI / 2.35 + (reduceMotion ? 0 : Math.sin((t || 0) * 0.0007 + i * 2.3) * 0.14);
        haloM.rotation.y = reduceMotion ? 0 : Math.sin((t || 0) * 0.0005 + i * 1.1) * 0.25;
        var hs = 1 + (reduceMotion ? 0 : Math.sin((t || 0) * 0.0016 + i * 0.9) * 0.045);
        haloM.scale.set(hs, hs, hs);
      }
    });
    if (celebrating && performance.now() > celebUntil) celebrating = false;
    if (celebrating && !reduceMotion && Math.random() < 0.25) {
      var p = bases[Math.floor(Math.random() * bases.length)];
      spawn(p.x, 1.4, p.z, 2, 5, Math.random() < 0.35);
    }
    /* particle physics */
    var anyAlive = false;
    for (var k = 0; k < PMAX; k++) {
      if (pLife[k] <= 0) { pPos[k * 3 + 1] = -50; continue; }
      anyAlive = true;
      pLife[k] -= 0.011;
      /* Loop 25: colour fades with life — bright motes burn
         near-white ice, the rest stay deep sky */
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
  requestAnimationFrame(tick);

  window.addEventListener("resize", function () {
    /* Never size the renderer from a hidden canvas (clientWidth 0) —
       the tick loop heals the size when the world is visible again. */
    var w = canvas.clientWidth;
    if (!w) return;
    lastW = w; H = Math.max(320, Math.round(w * 0.672));
    renderer.setSize(w, H, false);
    camera.aspect = w / H; camera.updateProjectionMatrix();
  });
})();

/* ================= GENERATIVE MUSIC (Web Audio) ================= */
(function initMusic() {
  var btn = document.getElementById("musicBtn");
  var btnText = document.getElementById("musicBtnText");
  var AC = null, master = null, padFilter = null, padGain = null, delayIn = null, delayNode = null, hatVol = 0.018;
  var on = false, timer = null, nextBar = 0, barCount = 0;
  /* Thirty generative moods — the same growing-layers idea in
     thirty different harmonic worlds. Calm is the original Code Block sound
     (Cmaj7 · Am7 · Fmaj7 · G6 at 72 BPM). Focus drifts slower through
     A minor; Bright lifts the tempo through a I–V–vi–IV pop loop.
     Night sinks into a slow, deep D-minor hush with no hats at all;
     Arcade runs the same loop at chiptune speed with square-wave
     plucks, an octave up. Rain is the softest of all: a slow E-minor
     wash, sine plucks falling like drips through the delay, and no
     hats — just the pads breathing underneath. Meadow (Loop 3) is
     the sunny one: a G-major pastoral at 84 BPM, triangle plucks
     wandering a G pentatonic ladder over Gmaj7 · Em7 · Cmaj7 · D7.
     Forge (Loop 4) pushes ahead in A major at 100 BPM — a bright
     filter, hats arriving early from layer 6, and warm sawtooth
     plucks kept low (Arcade's square-wave volume is the precedent).
     Orbit (Loop 6) circles in D major at 92 BPM — Dmaj7 · Bm7 ·
     Gmaj7 · A7 under a weightless triangle melody. Pebble
     (Loop 7) skips stones in G major at 76 BPM — Gmaj7 · Em7 ·
     Fmaj7 · Dm7 under soft sine plucks that land like pebbles
     on still water, hats only from layer 14. Summit (Loop 9)
     climbs in F major at 88 BPM — Fmaj7 · Dm7 · Bbmaj7 · C7
     under clear triangle plucks, the view-from-the-top mood:
     bright air, steady steps, hats from layer 10. Vault
     (Loop 11) is the after-hours one, made for the Vault's
     night room: B minor at 70 BPM — Bm7 · Gmaj7 · Dmaj7 · A7
     under a low, dark filter, soft sine plucks ticking like a
     combination lock, hats held back until layer 16. */
  var MOODS = {
    calm: { bpm: 72, filterBase: 850, filterMp: 1500, plucks: [2, 3], hatAt: 12, hatVol: 0.018,
      chords: [[130.81, 164.81, 196.00, 246.94], [110.00, 130.81, 164.81, 196.00], [87.31, 110.00, 130.81, 164.81], [98.00, 123.47, 146.83, 196.00]],
      roots: [65.41, 55.00, 43.65, 49.00],
      scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25] },
    focus: { bpm: 60, filterBase: 620, filterMp: 1150, plucks: [1, 2], hatAt: 99, hatVol: 0.010,
      chords: [[110.00, 164.81, 196.00, 246.94], [87.31, 110.00, 130.81, 164.81], [130.81, 164.81, 196.00, 246.94], [98.00, 123.47, 146.83, 196.00]],
      roots: [55.00, 43.65, 65.41, 49.00],
      scale: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33] },
    bright: { bpm: 96, filterBase: 1150, filterMp: 1900, plucks: [3, 4], hatAt: 8, hatVol: 0.02,
      chords: [[130.81, 164.81, 196.00, 246.94], [98.00, 146.83, 196.00, 246.94], [110.00, 130.81, 164.81, 196.00], [87.31, 110.00, 130.81, 164.81]],
      roots: [65.41, 49.00, 55.00, 43.65],
      scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25] },
    night: { bpm: 54, filterBase: 460, filterMp: 880, plucks: [1, 2], hatAt: 99, hatVol: 0,
      pluckType: "sine", pluckVol: 0.06,
      chords: [[146.83, 220.00, 261.63, 349.23], [116.54, 146.83, 174.61, 220.00], [87.31, 130.81, 174.61, 220.00], [110.00, 164.81, 220.00, 261.63]],
      roots: [73.42, 58.27, 43.65, 55.00],
      scale: [293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99] },
    arcade: { bpm: 118, filterBase: 1650, filterMp: 2500, plucks: [4, 5], hatAt: 4, hatVol: 0.013,
      pluckType: "square", pluckVol: 0.026, arpType: "square", arpVol: 0.008,
      chords: [[130.81, 164.81, 196.00, 246.94], [98.00, 146.83, 196.00, 246.94], [110.00, 130.81, 164.81, 196.00], [87.31, 110.00, 130.81, 164.81]],
      roots: [65.41, 49.00, 55.00, 43.65],
      scale: [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51] },
    rain: { bpm: 66, filterBase: 680, filterMp: 1280, plucks: [2, 3], hatAt: 99, hatVol: 0,
      pluckType: "sine", pluckVol: 0.05, arpVol: 0.011,
      chords: [[164.81, 196.00, 246.94, 293.66], [130.81, 164.81, 196.00, 246.94], [146.83, 196.00, 246.94, 293.66], [110.00, 164.81, 196.00, 261.63]],
      roots: [82.41, 65.41, 98.00, 55.00],
      scale: [329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00] },
    /* Drizzle (Loop 13) is Rain's quieter sibling, tuned for
       Library reading: B minor at 62 BPM — Bm7 · Gmaj7 · Em7 ·
       A7 under a soft, low filter, sine plucks pattering like
       drizzle on a window, a sine arp from layer 8, no hats. */
    drizzle: { bpm: 62, filterBase: 720, filterMp: 1340, plucks: [2, 3], hatAt: 99, hatVol: 0,
      pluckType: "sine", pluckVol: 0.052, arpType: "sine", arpVol: 0.013,
      chords: [[123.47, 146.83, 185.00, 220.00], [98.00, 123.47, 146.83, 185.00], [164.81, 196.00, 246.94, 293.66], [110.00, 138.59, 164.81, 196.00]],
      roots: [61.74, 49.00, 82.41, 55.00],
      scale: [246.94, 293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25] },
    meadow: { bpm: 84, filterBase: 980, filterMp: 1700, plucks: [2, 3], hatAt: 8, hatVol: 0.014,
      pluckType: "triangle", pluckVol: 0.055, arpVol: 0.013,
      chords: [[98.00, 123.47, 146.83, 185.00], [82.41, 98.00, 123.47, 146.83], [130.81, 164.81, 196.00, 246.94], [146.83, 185.00, 220.00, 261.63]],
      roots: [49.00, 41.20, 65.41, 73.42],
      scale: [392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00, 987.77] },
    forge: { bpm: 100, filterBase: 1250, filterMp: 2050, plucks: [3, 4], hatAt: 6, hatVol: 0.016,
      pluckType: "sawtooth", pluckVol: 0.028, arpType: "triangle", arpVol: 0.012,
      chords: [[110.00, 138.59, 164.81, 220.00], [82.41, 103.83, 123.47, 164.81], [92.50, 110.00, 138.59, 185.00], [73.42, 92.50, 110.00, 146.83]],
      roots: [55.00, 41.20, 46.25, 36.71],
      scale: [440.00, 493.88, 554.37, 659.25, 739.99, 880.00, 987.77, 1108.73] },
    orbit: { bpm: 92, filterBase: 1080, filterMp: 1880, plucks: [2, 4], hatAt: 10, hatVol: 0.015,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.014,
      chords: [[146.83, 185.00, 220.00, 277.18], [123.47, 146.83, 185.00, 220.00], [98.00, 123.47, 146.83, 196.00], [110.00, 138.59, 164.81, 220.00]],
      roots: [73.42, 61.74, 49.00, 55.00],
      scale: [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99] },
    pebble: { bpm: 76, filterBase: 760, filterMp: 1420, plucks: [2, 3], hatAt: 14, hatVol: 0.011,
      pluckType: "sine", pluckVol: 0.052, arpType: "sine", arpVol: 0.012,
      chords: [[196.00, 246.94, 293.66, 392.00], [164.81, 196.00, 246.94, 329.63], [174.61, 220.00, 261.63, 349.23], [146.83, 174.61, 220.00, 293.66]],
      roots: [98.00, 82.41, 87.31, 73.42],
      scale: [392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00, 987.77] },
    summit: { bpm: 88, filterBase: 1050, filterMp: 1800, plucks: [2, 3], hatAt: 10, hatVol: 0.013,
      pluckType: "triangle", pluckVol: 0.05, arpType: "triangle", arpVol: 0.013,
      chords: [[174.61, 220.00, 261.63, 329.63], [146.83, 174.61, 220.00, 261.63], [116.54, 146.83, 174.61, 220.00], [130.81, 164.81, 196.00, 233.08]],
      roots: [87.31, 73.42, 58.27, 65.41],
      scale: [349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99, 880.00] },
    vault: { bpm: 70, filterBase: 560, filterMp: 1050, plucks: [1, 2], hatAt: 16, hatVol: 0.009,
      pluckType: "sine", pluckVol: 0.055, arpType: "sine", arpVol: 0.012,
      chords: [[110.00, 146.83, 185.00, 220.00], [98.00, 123.47, 146.83, 185.00], [146.83, 185.00, 220.00, 277.18], [110.00, 138.59, 164.81, 196.00]],
      roots: [61.74, 49.00, 73.42, 55.00],
      scale: [246.94, 293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25] },
    /* Drift (Loop 12) is the slowest water in the collection:
       A major at 58 BPM — Amaj7 · F#m7 · Dmaj7 · E7 — under a
       low, soft filter, sparse sine plucks and a sine arp that
       floats like light on a lake. No hats, ever: the current
       carries this one. */
    drift: { bpm: 58, filterBase: 640, filterMp: 1150, plucks: [1, 2], hatAt: 99, hatVol: 0,
      pluckType: "sine", pluckVol: 0.055, arpType: "sine", arpVol: 0.015,
      chords: [[110.00, 138.59, 164.81, 207.65], [92.50, 110.00, 138.59, 164.81], [146.83, 185.00, 220.00, 277.18], [123.47, 164.81, 185.00, 246.94]],
      roots: [55.00, 46.25, 73.42, 61.74],
      scale: [220.00, 246.94, 277.18, 329.63, 440.00, 493.88, 554.37, 659.25] },
    /* Fortune (Loop 16) is the golden one — the mood the
       ceremony deserves: E major at 104 BPM — Emaj7 · C#m7 ·
       Amaj7 · B7 under a warm, open filter, triangle plucks
       with a coin-bright sparkle, hats from layer 8. Lucky,
       but never loud. */
    fortune: { bpm: 104, filterBase: 1180, filterMp: 1980, plucks: [3, 4], hatAt: 8, hatVol: 0.015,
      pluckType: "triangle", pluckVol: 0.05, arpType: "triangle", arpVol: 0.013,
      chords: [[164.81, 207.65, 246.94, 311.13], [138.59, 164.81, 207.65, 246.94], [110.00, 138.59, 164.81, 207.65], [123.47, 155.56, 185.00, 220.00]],
      roots: [82.41, 69.30, 55.00, 61.74],
      scale: [329.63, 369.99, 415.30, 493.88, 554.37, 659.25, 739.99, 830.61] },
    /* Halo (Loop 17) is the light-and-glow mood — the sound of
       this loop's luminous blue: C major at 80 BPM — Cmaj7 ·
       Em7 · Am7 · G6 under a bright, wide-open filter,
       crystal sine plucks ringing an octave up,
       a sine arp halo overhead, hats from layer 8. */
    halo: { bpm: 80, filterBase: 1250, filterMp: 2100, plucks: [2, 3], hatAt: 8, hatVol: 0.012,
      pluckType: "sine", pluckVol: 0.05, arpType: "sine", arpVol: 0.014,
      chords: [[130.81, 164.81, 196.00, 246.94], [164.81, 196.00, 246.94, 293.66], [110.00, 130.81, 164.81, 196.00], [98.00, 123.47, 146.83, 196.00]],
      roots: [65.41, 82.41, 55.00, 49.00],
      scale: [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51] },
    /* Tide (Loop 18) is the depth-system mood — the sound of
       water over deep blue: E-flat major at 74 BPM — Ebmaj7 ·
       Cm7 · Abmaj7 · Bb7 under a mid, breathing filter,
       triangle plucks that swell and recede like a slow tide,
       a sine arp from layer 10, hats hushed from layer 12. */
    tide: { bpm: 74, filterBase: 900, filterMp: 1560, plucks: [2, 3], hatAt: 12, hatVol: 0.011,
      pluckType: "triangle", pluckVol: 0.052, arpType: "sine", arpVol: 0.013,
      chords: [[155.56, 196.00, 233.08, 293.66], [130.81, 155.56, 196.00, 233.08], [103.83, 130.81, 155.56, 196.00], [116.54, 146.83, 174.61, 207.65]],
      roots: [77.78, 65.41, 51.91, 58.27],
      scale: [311.13, 349.23, 392.00, 466.16, 523.25, 587.33, 622.25, 783.99] },
    /* Velvet (Loop 19) is the tactile mood — the sound of a
       soft press: C minor at 68 BPM — Cm7 · Abmaj7 · Ebmaj7 ·
       Fm7 under a low, close filter, plush triangle plucks
       close to the ear, a whisper of sine arp, hats held back
       to layer 14 so the surface stays unbroken. */
    velvet: { bpm: 68, filterBase: 700, filterMp: 1250, plucks: [1, 2], hatAt: 14, hatVol: 0.010,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.012,
      chords: [[130.81, 155.56, 196.00, 233.08], [103.83, 130.81, 155.56, 196.00], [155.56, 196.00, 233.08, 293.66], [174.61, 207.65, 261.63, 311.13]],
      roots: [65.41, 51.91, 77.78, 87.31],
      scale: [261.63, 293.66, 311.13, 392.00, 466.16, 523.25, 587.33, 622.25] },
    /* Lagoon (Loop 21) is the spacing system's mood — the
       sound of room to breathe: A-flat major at 82 BPM —
       Abmaj7 · Fm7 · Dbmaj7 · Eb7 under a warm, open filter,
       triangle plucks wading in shallow sunlit water, a sine
       arp rippling from layer 10, hats hushed from layer 12.
       A key no other mood in the collection uses. */
    lagoon: { bpm: 82, filterBase: 950, filterMp: 1650, plucks: [2, 3], hatAt: 12, hatVol: 0.011,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      chords: [[207.65, 261.63, 311.13, 392.00], [174.61, 207.65, 261.63, 311.13], [138.59, 174.61, 207.65, 261.63], [155.56, 196.00, 233.08, 277.18]],
      roots: [103.83, 87.31, 69.30, 77.78],
      scale: [415.30, 466.16, 523.25, 622.25, 698.46, 783.99, 830.61, 1046.50] },
    /* Aurora (Loop 23) is the boot moment's mood — the sound
       of first light over the world: B-flat major at 86 BPM —
       Bbmaj7 · Gm7 · Ebmaj7 · F7 under a wide, brightening
       filter, triangle plucks rising like dawn, a sine arp
       shimmering from layer 10, hats hushed from layer 12.
       A key no other mood in the collection uses. */
    aurora: { bpm: 86, filterBase: 1020, filterMp: 1780, plucks: [2, 3], hatAt: 12, hatVol: 0.012,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      chords: [[116.54, 146.83, 174.61, 220.00], [98.00, 116.54, 146.83, 174.61], [155.56, 196.00, 233.08, 293.66], [87.31, 110.00, 130.81, 155.56]],
      roots: [58.27, 49.00, 77.78, 43.65],
      scale: [233.08, 261.63, 293.66, 349.23, 392.00, 440.00, 466.16, 587.33] },
    /* Cascade (Loop 27) is the lit road's mood — the sound
       of water over stepping stones: E major at 78 BPM —
       Emaj7 · C#m7 · Amaj7 · B7 under a clear, open filter,
       triangle plucks stepping down an E-major ladder, a
       sine arp rippling from layer 10, hats hushed from
       layer 12. Fortune's E-major loop, slowed to a
       walking pace under a cooler filter. */
    cascade: { bpm: 78, filterBase: 980, filterMp: 1720, plucks: [2, 3], hatAt: 12, hatVol: 0.011,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      chords: [[164.81, 207.65, 246.94, 311.13], [138.59, 164.81, 207.65, 246.94], [110.00, 138.59, 164.81, 207.65], [123.47, 155.56, 185.00, 220.00]],
      roots: [82.41, 69.30, 55.00, 61.74],
      scale: [329.63, 369.99, 415.30, 493.88, 554.37, 659.25, 739.99, 830.61] },
    /* Granite (Loop 29) is the weighted world's mood — the
       sound of stone settling: C minor at 64 BPM, a slow,
       heavy walk — Cm7 · Abmaj7 ·
       Ebmaj7 · Bb7 under a low, grounded filter, deep sine
       plucks landing like set blocks, a sine arp from
       layer 12, hats held back until layer 16 so the
       weight arrives before the shimmer. A tempo no other
       mood in the collection uses; the key is Velvet's
       C minor, walked heavier. */
    granite: { bpm: 64, filterBase: 620, filterMp: 1150, plucks: [1, 2], hatAt: 16, hatVol: 0.009,
      pluckType: "sine", pluckVol: 0.055, arpType: "sine", arpVol: 0.011,
      chords: [[130.81, 155.56, 196.00, 233.08], [103.83, 130.81, 155.56, 196.00], [155.56, 196.00, 233.08, 293.66], [116.54, 146.83, 174.61, 220.00]],
      roots: [65.41, 51.91, 77.78, 58.27],
      scale: [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25] },
    /* Laurel (Loop 31) is the trophy mood — the sound of a
       crown being set down: D major at 90 BPM — Dmaj7 ·
       Bm7 · Gmaj7 · A7 under a clear, open filter, triangle
       plucks with a victor's easy stride, a sine arp
       circling from layer 10 like light around a halo, hats
       hushed from layer 12. Orbit's D-major loop at a
       statelier tempo, its hats held two layers later. */
    laurel: { bpm: 90, filterBase: 1080, filterMp: 1850, plucks: [2, 3], hatAt: 12, hatVol: 0.012,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      chords: [[146.83, 185.00, 220.00, 277.18], [123.47, 146.83, 185.00, 220.00], [98.00, 123.47, 146.83, 185.00], [110.00, 138.59, 164.81, 196.00]],
      roots: [73.42, 61.74, 49.00, 55.00],
      scale: [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99] },
    /* Meridian (Loop 33) is the bridge mood — the sound of
       crossing from one place to another: D-flat major at
       84 BPM — Dbmaj7 · Bbm7 · Gbmaj7 · Ab7 under a clear,
       travelling filter, triangle plucks walking the line
       between keys, a sine arp from layer 10, hats hushed
       from layer 12. A key no other mood in the collection
       uses, at Meadow's travelling tempo. */
    meridian: { bpm: 84, filterBase: 1000, filterMp: 1740, plucks: [2, 3], hatAt: 12, hatVol: 0.011,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      chords: [[138.59, 174.61, 207.65, 261.63], [116.54, 138.59, 174.61, 207.65], [92.50, 116.54, 138.59, 174.61], [103.83, 130.81, 155.56, 185.00]],
      roots: [69.30, 58.27, 46.25, 51.91],
      scale: [277.18, 311.13, 349.23, 415.30, 466.16, 523.25, 554.37, 698.46] },
    /* Ember (Loop 34) is the hearth mood — the sound of a
       fire kept low: G minor at 94 BPM — Gm7 · Ebmaj7 ·
       Bbmaj7 · F7 under a low, warm filter, triangle plucks
       glowing close to the ear, and the engine's new bell
       voice tolling one high chord tone per bar from
       layer 6 — the first mood ever scored for it. Hats
       held back to layer 14 so the warmth stays unbroken.
       A key and a tempo no other mood in the collection
       uses. */
    ember: { bpm: 94, filterBase: 680, filterMp: 1260, plucks: [2, 3], hatAt: 14, hatVol: 0.010,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.012,
      bellAt: 6, bellVol: 0.016,
      chords: [[196.00, 233.08, 293.66, 349.23], [155.56, 196.00, 233.08, 293.66], [116.54, 146.83, 174.61, 220.00], [174.61, 220.00, 261.63, 311.13]],
      roots: [98.00, 77.78, 58.27, 87.31],
      scale: [392.00, 440.00, 466.16, 523.25, 587.33, 698.46, 783.99, 932.33] },
    /* Zephyr (Loop 35) is the wind mood — the sound of air
       moving over open blue: F major at 98 BPM — Fmaj7 ·
       Dm7 · Bbmaj7 · C7 under a clear, travelling filter,
       triangle plucks drifting like leaves on a breeze, a
       sine arp from layer 10, and the engine's new swell
       voice breathing one long chord tone per bar from
       layer 8 — the first mood ever scored for it. Hats
       hushed from layer 12. Summit's F-major voicing, at
       a tempo no other mood in the collection uses. */
    zephyr: { bpm: 98, filterBase: 1050, filterMp: 1820, plucks: [2, 3], hatAt: 12, hatVol: 0.011,
      pluckType: "triangle", pluckVol: 0.05, arpType: "sine", arpVol: 0.013,
      swellAt: 8, swellVol: 0.02,
      chords: [[174.61, 220.00, 261.63, 329.63], [146.83, 174.61, 220.00, 261.63], [116.54, 146.83, 174.61, 220.00], [130.81, 164.81, 196.00, 233.08]],
      roots: [87.31, 73.42, 58.27, 65.41],
      scale: [349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99, 880.00] },
    /* Hymn (Loop 38) is the quiet side — the sound of
       winding down at the end of the day: B major at
       52 BPM, the slowest tempo in the collection —
       Bmaj7 · G#m7 · Emaj7 · F#7, the old hymn loop,
       under the lowest, closest filter of any major-key
       mood, sparse sine plucks falling like last light,
       no hats ever. It is the first mood scored for both
       signature voices at once: the bell tolls one high
       chord tone per bar from layer 5 and the swell
       breathes one long tone per bar from layer 6, so
       the two voices Ember and Zephyr each introduced
       sing together here like a small choir settling.
       A key and a tempo no other mood in the collection
       uses. Loop 39 flags it quiet: true — the mark of
       the winding-down moods, which the Bridge (below)
       now crosses into by descending, an amen instead
       of a climb. */
    hymn: { bpm: 52, filterBase: 540, filterMp: 1020, plucks: [1, 2], hatAt: 99, hatVol: 0, quiet: true,
      pluckType: "sine", pluckVol: 0.05, arpType: "sine", arpVol: 0.011,
      bellAt: 5, bellVol: 0.014, swellAt: 6, swellVol: 0.018,
      chords: [[123.47, 155.56, 185.00, 233.08], [103.83, 123.47, 155.56, 185.00], [164.81, 207.65, 246.94, 311.13], [185.00, 233.08, 277.18, 329.63]],
      roots: [61.74, 51.91, 41.20, 46.25],
      scale: [246.94, 277.18, 311.13, 329.63, 369.99, 415.30, 466.16, 493.88] },
    /* Vespers (Loop 39) is Hymn's evening companion —
       the last office of the day, sung as the light
       goes: F minor at 56 BPM, the third-slowest tempo
       in the collection — Fm7 · Dbmaj7 · Abmaj7 · C7
       under the lowest filter of any mood but Night,
       sparse sine plucks like single candles, no hats
       ever. Like Hymn it is scored for both signature
       voices, but they arrive sooner and softer —
       the bell from layer 4, the swell from layer 5 —
       because at vespers the quiet voices lead and the
       plucks only follow. It carries the quiet flag
       too, so crossing into it descends the amen.
       A key and a tempo no other mood in the
       collection uses. */
    vespers: { bpm: 56, filterBase: 520, filterMp: 980, plucks: [1, 2], hatAt: 99, hatVol: 0, quiet: true,
      pluckType: "sine", pluckVol: 0.048, arpType: "sine", arpVol: 0.010,
      bellAt: 4, bellVol: 0.013, swellAt: 5, swellVol: 0.017,
      chords: [[174.61, 207.65, 261.63, 311.13], [138.59, 174.61, 207.65, 261.63], [103.83, 130.81, 155.56, 196.00], [130.81, 164.81, 196.00, 233.08]],
      roots: [87.31, 69.30, 51.91, 65.41],
      scale: [174.61, 196.00, 207.65, 233.08, 261.63, 277.18, 311.13, 349.23] },
    /* Monsoon (Loop 40) is Zephyr's mirror — the same
       F-major loop heard from the other side of the glass:
       Fmaj7 · Dm7 · Bbmaj7 · C7, the same chords and roots
       as Zephyr over a lower, wider ladder of the same
       key, the breeze become a rain-front.
       It rides faster — 104 BPM, Fortune's tempo pushed
       harder — under the widest travelling filter of any
       wind mood, with square-wave plucks pattering where
       Zephyr's triangles drifted, kept at Forge's sawtooth
       volume (0.028) so the edge never shouts. Hats arrive
       early, from layer 10, like rain finding the roof,
       and the swell breathes from layer 7 — one layer
       sooner than Zephyr's — on the polished three-bar
       lane below. Monsoon is pointedly NOT quiet: a front
       arrives standing up, so the Bridge climbs into it
       like any working mood; only the winding-down side
       ever earns the amen. */
    monsoon: { bpm: 104, filterBase: 1180, filterMp: 2050, plucks: [2, 3], hatAt: 10, hatVol: 0.012,
      pluckType: "square", pluckVol: 0.028, arpType: "sine", arpVol: 0.013,
      swellAt: 7, swellVol: 0.019,
      chords: [[174.61, 220.00, 261.63, 329.63], [146.83, 174.61, 220.00, 261.63], [116.54, 146.83, 174.61, 220.00], [130.81, 164.81, 196.00, 233.08]],
      roots: [87.31, 73.42, 58.27, 65.41],
      scale: [174.61, 196.00, 220.00, 261.63, 293.66, 329.63, 349.23, 392.00] },
    /* Night Drive (Loop 41) is the synth-forward mood —
       the sound of a night highway at cruise speed:
       C-sharp minor at 102 BPM — C#m7 · Amaj7 · Emaj7 ·
       B7, the classic synthwave loop — under a wide-open
       synth filter, with sawtooth on BOTH melody voices:
       saw plucks at 0.03 (Forge's sawtooth precedent,
       a breath louder) and the collection's first sawtooth
       arp at 0.009 (Arcade's square-arp weight), so the
       whole top of the arrangement is circuitry, not
       wood. Hats arrive from layer 6 — only Arcade
       starts its rhythm sooner, Forge just as soon —
       like a steady road beat. And it is the first mood scored wide:
       panWide: true opens the engine's new stereo field
       (Loop 41, below) to full width, so its plucks
       travel and its arp sweeps kerb to kerb while every
       other mood moves in a gentler lane. Pointedly NOT
       quiet: a drive starts standing up, so the Bridge
       climbs into it like any working mood. A key and a
       tempo no other mood in the collection uses. */
    nightdrive: { bpm: 102, filterBase: 1320, filterMp: 2240, plucks: [3, 4], hatAt: 6, hatVol: 0.014,
      pluckType: "sawtooth", pluckVol: 0.03, arpType: "sawtooth", arpVol: 0.009,
      panWide: true,
      chords: [[138.59, 164.81, 207.65, 246.94], [110.00, 138.59, 164.81, 207.65], [164.81, 207.65, 246.94, 311.13], [123.47, 155.56, 185.00, 220.00]],
      roots: [69.30, 55.00, 82.41, 61.74],
      scale: [277.18, 311.13, 329.63, 369.99, 415.30, 440.00, 493.88, 554.37] }
  };
  var mood = "calm";
  try {
    var savedMood = localStorage.getItem("code-block-music-mood-v1");
    if (savedMood && MOODS[savedMood]) mood = savedMood;
  } catch (e) {}
  /* A gentle composed phrase for the masterpiece lead (pentatonic indexes, -1 = rest) */
  var LEAD = [4, -1, 2, 3, 4, -1, 5, 4, 3, 2, -1, 1, 2, -1, -1, -1,
              4, -1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0, -1, -1, -1];
  var melodyIdx = 3;
  /* Loop 32 — Echo: the music listens to the learner. Typing
     signals (window.__musicEcho, fed by the Sandbox drill, the
     PC type-along and the Vault) raise and lower a slow "flow"
     tide inside the engine: correct letters feed it, perfect
     reps feed it more, a refused letter lets some out, and
     stillness drains it back to rest over ~30 quiet seconds.
     scheduleBar spends the tide — pads open toward their
     masterpiece brightness, plucks thicken, the arp and hats
     arrive early, and a high sheen rides hot streaks — while
     each perfect rep answers with one soft note that climbs
     the mood's own scale as the streak grows. Nothing here
     touches a drill rule, a rep count, or storage. */
  var flow = 0, streak = 0, duckTimer = null;
  function flowFilter(M) { return M.filterBase + (M.filterMp - M.filterBase) * Math.min(1, flow * 0.85); }

  function layers() { return doneCount(); }
  function isMasterpiece() { return doneCount() >= BLOCKS.length; }

  function buildGraph() {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain(); master.gain.value = 0;
    var comp = AC.createDynamicsCompressor();
    master.connect(comp); comp.connect(AC.destination);
    padFilter = AC.createBiquadFilter();
    padFilter.type = "lowpass"; padFilter.frequency.value = 850; padFilter.Q.value = 0.4;
    padFilter.connect(master);
    /* The pads get their own gain stage into the filter, so the
       pad bed can be balanced apart from the master bus. */
    padGain = AC.createGain(); padGain.gain.value = 0.9;
    padGain.connect(padFilter);
    var delay = AC.createDelay(1); delay.delayTime.value = (60 / MOODS[mood].bpm) * 0.75;
    delayNode = delay;
    var fb = AC.createGain(); fb.gain.value = 0.32;
    var wet = AC.createGain(); wet.gain.value = 0.22;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    delayIn = delay;
  }
  /* Loop 41 — stereo: until now every voice summed to the
     middle of the road. panDest routes a gain through a
     StereoPannerNode into a destination bus, clamped to
     [-1, 1]; where the browser has no StereoPanner it
     returns the bus itself, so the graph degrades to
     exactly the old mono mix. Pads and swells take a
     fixed gentle spread (their two detuned oscillators
     sit a little left and a little right), while tone()
     gains an optional seventh argument — a pan position
     for that one note — which scheduleBar spends as
     movement: plucks travel on a slow arc, the arp
     sweeps side to side. Voices that must come from one
     place (the bass root, the bell, the fanfare, the
     bridge, the answer notes) pass no pan and stay
     centred, byte-identical to before. */
  function panDest(pan, dest) {
    if (!AC || typeof AC.createStereoPanner !== "function") return dest;
    var p = AC.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    p.connect(dest);
    return p;
  }
  function pad(freq, t, dur) {
    [0, 5].forEach(function (det) {
      var o = AC.createOscillator();
      o.type = det === 0 ? "sine" : "triangle";
      o.frequency.value = freq; o.detune.value = det;
      var g = AC.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.045, t + 1.1);
      g.gain.setValueAtTime(0.045, t + dur - 1.0);
      g.gain.linearRampToValueAtTime(0, t + dur + 0.4);
      o.connect(g); g.connect(panDest(det === 0 ? -0.2 : 0.2, padGain));
      o.start(t); o.stop(t + dur + 0.5);
    });
  }
  function tone(freq, t, dur, vol, type, toDelay, pan) {
    var o = AC.createOscillator(); o.type = type || "triangle"; o.frequency.value = freq;
    var g = AC.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g); g.connect(typeof pan === "number" && pan !== 0 ? panDest(pan, master) : master);
    if (toDelay) g.connect(delayIn);
    o.start(t); o.stop(t + dur + 0.05);
  }
  /* Loop 34 — the bell: the engine's fifth voice. A struck
     bell is two sines — the fundamental and a quiet inharmonic
     partial a little above two octaves up (×4.2) — struck
     fast and left to ring out on a long exponential tail,
     always sent through the shared delay so it hangs in the
     same air as the plucks. Used sparingly: a mood opts in
     with bellAt, and scheduleBar tolls it once a bar. */
  function bell(freq, t, dur, vol) {
    [[1, 1], [4.2, 0.32]].forEach(function (p) {
      var o = AC.createOscillator(); o.type = "sine";
      o.frequency.value = freq * p[0];
      var g = AC.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol * p[1], t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0008, t + dur * (p[0] === 1 ? 1 : 0.45));
      o.connect(g); g.connect(master); g.connect(delayIn);
      o.start(t); o.stop(t + dur + 0.05);
    });
  }
  /* Loop 35 — the swell: the engine's sixth voice, and the
     opposite of the bell. Where the bell is struck, the
     swell breathes in: two triangle oscillators detuned a
     few cents apart swell up slowly over nearly half the
     note and sigh back down, routed through the pad bus so
     the voice rides the same breathing filter as the chord
     bed — a bowed, wind-like tone that never starts or
     stops abruptly. Used sparingly: a mood opts in with
     swellAt, and scheduleBar breathes it once a bar. */
  function swell(freq, t, dur, vol) {
    [-4, 4].forEach(function (det) {
      var o = AC.createOscillator(); o.type = "triangle";
      o.frequency.value = freq; o.detune.value = det;
      var g = AC.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + dur * 0.45);
      g.gain.linearRampToValueAtTime(0, t + dur);
      /* Loop 41: the breath opens widest of the bed voices —
         its two detuned triangles sit ±0.3 out, so a swell
         feels like air arriving from both sides at once. */
      o.connect(g); g.connect(panDest(det < 0 ? -0.3 : 0.3, padGain));
      o.start(t); o.stop(t + dur + 0.05);
    });
  }
  function hat(t) {
    var len = AC.sampleRate * 0.05;
    var buf = AC.createBuffer(1, len, AC.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = AC.createBufferSource(); src.buffer = buf;
    var f = AC.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 7000;
    var g = AC.createGain(); g.gain.value = hatVol;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }
  function scheduleBar(bar, t) {
    var M = MOODS[mood];
    var CHORDS = M.chords, ROOTS = M.roots, PENTA = M.scale;
    var SPB = 60 / M.bpm, BAR = SPB * 4;
    hatVol = M.hatVol;
    var chord = CHORDS[bar % 4];
    var L = layers(), mp = isMasterpiece();
    padFilter.frequency.setTargetAtTime(mp ? M.filterMp : flowFilter(M), t, 1.5);
    chord.forEach(function (f) { pad(f, t, BAR); });
    if (L >= 4 || mp) tone(ROOTS[bar % 4], t, BAR * 0.9, 0.10, "sine", false);
    /* Loop 41 — stereo movement: the melody voices travel.
       panRange is the half-width of this mood's lane —
       ±0.38 for every mood, ±0.8 for a panWide mood
       (Night Drive is the first) — and every pan below
       stays inside it. The bass above passes no pan: the
       root anchors the middle of the road. */
    var panRange = M.panWide ? 0.8 : 0.38;
    /* sparse pluck melody — random walk on the pentatonic ladder */
    var plucks = mp ? 5 : (L >= 1 ? M.plucks[1] : M.plucks[0]) + (flow >= 0.55 ? 1 : 0) + (flow >= 0.85 ? 1 : 0);
    var slots = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
    for (var k = 0; k < plucks; k++) {
      if (Math.random() < 0.25) continue;
      var slot = slots[Math.floor(Math.random() * slots.length)];
      melodyIdx = Math.max(0, Math.min(PENTA.length - 1, melodyIdx + [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]));
      /* Each pluck is placed on a slow arc that swings
         with the bar count and the note's own slot, so the
         melody wanders the lane instead of sitting in it. */
      tone(PENTA[melodyIdx], t + slot * SPB, 1.6, M.pluckVol || 0.055, M.pluckType || "triangle", true, Math.sin(bar * 0.9 + slot * 1.1) * panRange);
    }
    if (L >= 8 || flow >= 0.7 || mp) {
      for (var s = 0; s < 8; s++) {
        var f = chord[s % chord.length] * (s % 2 ? 4 : 2);
        /* The arp sweeps the lane step by step — left to
           right on even bars, right to left on odd ones —
           so the pattern drives back and forth overhead. */
        var arpPan = (s / 7 * 2 - 1) * panRange;
        if (bar % 2) arpPan = -arpPan;
        tone(f, t + s * SPB * 0.5, 0.7, M.arpVol || 0.016, M.arpType || "sine", true, arpPan);
      }
    }
    /* Loop 34 — the bell bed: a mood that carries bellAt
       earns one slow struck bell on the bar's third beat
       once enough layers are in (or while the flow runs
       hot, or in the masterpiece), tolling a chord tone
       two octaves up. Moods without bellAt never schedule
       one — the voice stays Ember's signature (Hymn, Loop
       38, joins it — the first mood scored for both the
       bell and the swell at once; Vespers, Loop 39, joins
       them both on the quiet side). */
    if (M.bellAt && (L >= M.bellAt || flow >= 0.8 || mp)) {
      bell(chord[(bar + 1) % chord.length] * 4, t + SPB * 2, 2.8, M.bellVol || 0.016);
    }
    /* Loop 35 — the swell bed: a mood that carries swellAt
       earns one slow breath per bar once enough layers are
       in (or while the flow runs warm, or in the
       masterpiece), swelling a chord tone one octave up
       from the bar's second beat across almost the whole
       bar. Moods without swellAt never schedule one — the
       voice stays Zephyr's signature (Hymn, Loop 38, joins
       it — the first mood scored for both voices at once;
       Vespers, Loop 39, breathes with it on the quiet side;
       Monsoon, Loop 40, blows with it on the working side).
       Loop 40 — the swell lane: the breath used to ride ONE
       chord slot every bar (index +2), so over a four-bar
       loop it traced the same two tones forever. It now
       rotates on a three-bar lane — slot +2, +2, then +3 —
       so the breath crosses the loop's chord tones out of
       phase with the chords themselves (fifth, seventh,
       then the third held across the join), and the whole
       breath-pattern repeats every twelve bars instead of
       four. Nothing else
       moves: same beat (the bar's second), same octave,
       same span, same gate, same per-mood volume — and the
       fanfare's own swell call sites are untouched, because
       a ceremony is composed, not generated. */
    if (M.swellAt && (L >= M.swellAt || flow >= 0.75 || mp)) {
      var swellLane = bar % 3 === 2 ? 3 : 2;
      swell(chord[(bar + swellLane) % chord.length] * 2, t + SPB, BAR * 0.95, M.swellVol || 0.02);
    }
    /* Loop 32: a hot streak earns a sheen — one high, quiet
       sparkle per bar while the flow lasts. Loop 41: it
       shines from the far side of the lane, answering the
       bar's pluck arc from the opposite kerb. */
    if (flow >= 0.6 && !mp) tone(PENTA[PENTA.length - 1] * 2, t + SPB * 2.5, 1.4, 0.011, "sine", true, -Math.sin(bar * 0.9) * panRange);
    if (L >= M.hatAt || flow >= 0.92 || mp) { hat(t + SPB); hat(t + SPB * 3); }
    if (mp) {
      for (var q = 0; q < 8; q++) {
        var li = LEAD[(bar % 2) * 16 + q * 2] >= 0 ? LEAD[(bar % 2) * 16 + q * 2] : LEAD[(bar % 2) * 16 + q * 2 + 1];
        /* Loop 41: the masterpiece lead walks the lane at
           half width — present in the field, never so wide
           it leaves the ceremony behind. */
        if (li >= 0) tone(PENTA[li] * 2, t + q * SPB * 0.5, 1.1, 0.05, "sine", true, (q / 7 * 2 - 1) * panRange * 0.5);
      }
    }
  }
  function loop() {
    /* Loop 32: the flow tide ebbs a little on every scheduler
       pass (~0.02 per second), so stillness always settles
       the music back to its resting shape. */
    if (flow > 0) flow = Math.max(0, flow - 0.004);
    /* Loop 59 — the scheduler resync: this interval is the
       engine's heartbeat, and browsers throttle or pause
       timers in a hidden tab while the AudioContext clock
       keeps walking. Until now the while below repaid that
       debt literally: on the first tick back it scheduled
       EVERY missed bar at its long-past start time, and
       Web Audio plays a past-dated note immediately — so a
       minute in the background returned as dozens of bars
       (hundreds of oscillators) stacked into one blast,
       and even a one-second throttle smeared each bar's
       start a little into the past. The missed bars are
       now dropped, not repaid: barCount and nextBar skip
       forward by whole bars (so the chord cycle, the arp's
       direction and the swell's three-bar lane keep the
       phase they would have had), and scheduling resumes
       just ahead of the clock. Ordinary jitter — a tick
       landing a fraction of a bar late — is untouched: the
       resync only fires once a bar start is a real step
       (0.15 s) behind the clock. */
    var BAR = (60 / MOODS[mood].bpm) * 4;
    if (nextBar < AC.currentTime - 0.15) {
      barCount += Math.floor((AC.currentTime - nextBar) / BAR) + 1;
      nextBar = AC.currentTime + 0.1;
    }
    while (nextBar < AC.currentTime + 0.7) {
      scheduleBar(barCount, nextBar);
      nextBar += BAR; barCount++;
    }
  }
  function start() {
    /* One song at a time: the Library's picture music steps aside. */
    if (window.stopStageMusic) window.stopStageMusic();
    if (!AC) buildGraph();
    AC.resume();
    master.gain.cancelScheduledValues(AC.currentTime);
    master.gain.setTargetAtTime(0.5, AC.currentTime, 0.8);
    nextBar = AC.currentTime + 0.1; barCount = 0;
    timer = setInterval(loop, 200); loop();
  }
  function stop() {
    if (!AC) return;
    master.gain.setTargetAtTime(0, AC.currentTime, 0.3);
    clearInterval(timer); timer = null;
    setTimeout(function () { if (!on && AC) AC.suspend(); }, 900);
  }
  /* Finale glissando: the moment a track's mastery reaches 100%,
     one quiet sine climbs an octave through the current mood's
     scale over about 1.2 s — a small rising breath under the
     masterpiece bloom. Silent if the music was never started.
     Loop 37: a second sine now glides with it a perfect fifth
     above (×1.5, tracking the same octave climb at half the
     weight), so the arrival lands as a chord, not a solo line —
     the first harmony the masterpiece moment ever announced
     itself with, and a promise of the fanfare's fuller voicing. */
  function finaleGliss() {
    /* Loop 67: silent while the music is off, not only while it
       was never started — the off case used to resume the
       suspended context and schedule the glissando (and, 1.25 s
       later, the whole fanfare) into the zeroed master gain,
       which also armed the fanfare's replay guard and made a
       Relive pressed just after turning the music on no-op. */
    if (!AC || !master || !on) return;
    try { AC.resume(); } catch (e) {}
    var scale = MOODS[mood].scale;
    var from = scale[Math.min(4, scale.length - 1)];
    var t = AC.currentTime + 0.05;
    [[1, 0.05], [1.5, 0.026]].forEach(function (voice) {
      var o = AC.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(from * voice[0], t);
      o.frequency.exponentialRampToValueAtTime(from * voice[0] * 2, t + 1.2);
      var g = AC.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(voice[1], t + 0.3);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 1.35);
      o.connect(g); g.connect(master);
      if (delayIn) g.connect(delayIn);
      o.start(t); o.stop(t + 1.45);
    });
    /* …and the glissando lands on the grand fanfare. */
    setTimeout(grandFanfare, 1250);
  }
  window.__finaleGliss = finaleGliss;
  /* A short filtered noise burst — the fanfare's snare-ish tick.
     Same noise-buffer recipe as hat(), voiced lower and louder
     through a bandpass so it reads as a soft drum, not a hiss. */
  function tick(t, vol) {
    var len = Math.floor(AC.sampleRate * 0.07);
    var buf = AC.createBuffer(1, len, AC.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = AC.createBufferSource(); src.buffer = buf;
    var f = AC.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1900; f.Q.value = 0.8;
    var g = AC.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }
  /* Loop 37 — the thump: the engine's seventh voice, and the
     fanfare's drum. One sine whose pitch falls from a sixth
     above the root down to the root itself over a third of a
     second while its gain blooms fast and decays on a long
     exponential tail — a soft timpani stroke, felt as much
     as heard. Dry (no delay): a drum that echoes is a drum
     in the wrong room. Used only by the grand fanfare — the
     herald's opening stroke and the climax's two beats — so
     the everyday generative loop stays exactly as calm as
     it always was. */
  function thump(freq, t, vol) {
    var o = AC.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(freq * 1.6, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(30, freq), t + 0.32);
    var g = AC.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.85);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + 0.95);
  }
  /* Grand fanfare (Loop 15, expanded Loops 36–37): the finale
     the glissando lands on — now a full ceremony in five
     movements through the current mood's own chord loop, in
     the original Calm the classic C-major-family procession.
     The Herald (one bar) opens it: a thump on the tonic, three
     unison chord stabs, and a tick roll that crescendos into
     a held scale-top — the doors opening. Phrase one (bars
     2–5) states the theme grand: swelling pads, a walking
     bass (root · fifth · octave · fifth), the composed LEAD
     phrase at twice its usual density, pluck sparkle, and
     snare-ish ticks on the off-beats. Phrase two (bars 6–9)
     answers it: the LEAD's second half leads, the sparkle
     doubles, ticks land on every beat, a swell breathes under
     bars 6 and 8 — and the LEAD now answers itself in canon,
     echoing one beat behind at whisper weight, so the theme
     sounds chased by its own success. The Procession (bars
     10–11) walks the loop's last two chords home: the bass
     climbs, ticks march (off-beats joining in the second
     bar), a thump underlines the final approach, and bell
     and swell trade places bar to bar — antiphony, the two
     signature voices calling across the hall. The Climax is
     a held tonic with real weight now: two thumps, a sub-
     octave under the root where the root is high enough to
     carry one, a two-tone swell stack, five slow bell tolls,
     and the scale climbing to its top note before a high
     sparkle descent rains back down. The Coda lets it land:
     one soft swell, the LEAD's opening gesture (5·4·3·1)
     stepping back down at fading weight, and a single last
     bell toll left ringing into the returning generative loop.
     A replay guard keeps fanfares from stacking: while one
     ceremony is sounding, further calls (the glissando's
     delayed landing, the ceremony's own button, the banner's
     Relive) politely no-op until it has finished. Everything
     is scheduled with the engine's own voices at modest
     volumes, and it stays silent if the music was never
     started. The ceremony overlay replays it through
     window.__grandFanfare. */
  var fanfareEnd = 0;
  function grandFanfare() {
    /* Loop 67: the same off-guard as the glissando — a fanfare
       requested while the music is off must not schedule forty
       seconds of silence that poisons the replay guard below. */
    if (!AC || !master || !on) return;
    try { AC.resume(); } catch (e) {}
    if (AC.currentTime < fanfareEnd) return;
    var M = MOODS[mood];
    var SPB = 60 / M.bpm, BAR = SPB * 4;
    var t0 = AC.currentTime + 0.06;
    var p0 = t0 + BAR;              /* phrases begin after the herald */
    var tf = p0 + 10 * BAR;         /* climax: 8 phrase bars + 2 procession bars */
    var tc = tf + BAR * 1.7;        /* coda */
    fanfareEnd = tc + BAR * 1.2 + 3.2;
    /* — Herald: one bar of doors opening. — */
    thump(M.roots[0], t0, 0.13);
    [0, 1.5, 3].forEach(function (beat) {
      M.chords[0].forEach(function (f) { tone(f * 2, t0 + beat * SPB, 0.7, 0.028, "triangle", true); });
    });
    for (var ht = 0; ht < 8; ht++) tick(t0 + ht * SPB * 0.5, 0.02 + ht * 0.004);
    tone(M.scale[Math.min(4, M.scale.length - 1)] * 2, t0 + SPB * 3, 1.2, 0.04, "sine", true);
    /* — Phrases one and two: the theme, stated and answered. — */
    for (var bar = 0; bar < 8; bar++) {
      var t = p0 + bar * BAR;
      var chord = M.chords[bar % 4], root = M.roots[bar % 4];
      var phrase2 = bar >= 4;
      chord.forEach(function (f) { pad(f, t, BAR * 1.05); });
      [1, 1.5, 2, 1.5].forEach(function (mult, s) {
        tone(root * mult, t + s * SPB, SPB * 0.95, phrase2 ? 0.12 : 0.11, "sine", false);
      });
      for (var q = 0; q < 8; q++) {
        var li = LEAD[(bar % 2) * 16 + q + (phrase2 ? 8 : 0)];
        if (li === undefined || li < 0) li = LEAD[(bar % 2) * 16 + q];
        if (li >= 0 && M.scale[li] !== undefined) tone(M.scale[li] * 2, t + q * SPB * 0.5, 1.15, phrase2 ? 0.06 : 0.055, "sine", true);
      }
      var sparkle = phrase2 ? 8 : 4;
      for (var s2 = 0; s2 < sparkle; s2++) {
        tone(chord[s2 % chord.length] * 2, t + s2 * SPB * (phrase2 ? 0.5 : 1) + SPB * 0.5, 0.8, M.arpVol || 0.014, M.arpType || "sine", true);
      }
      if (phrase2) {
        /* Call-and-response: phrase two answers phrase one's
           off-beat ticks with a tick on every beat, plus the
           swell voice breathing a chord tone under the bar.
           Loop 37 adds the canon: the bar's own LEAD line
           repeated one beat later at whisper weight. */
        for (var cq = 0; cq < 8; cq++) {
          var cli = LEAD[(bar % 2) * 16 + cq + 8];
          if (cli !== undefined && cli >= 0 && M.scale[cli] !== undefined) tone(M.scale[cli] * 2, t + cq * SPB * 0.5 + SPB, 0.9, 0.019, "sine", true);
        }
        for (var tk = 0; tk < 4; tk++) tick(t + tk * SPB, 0.045);
        if (bar === 4 || bar === 6) swell(chord[(bar + 2) % chord.length] * 2, t + SPB * 0.5, BAR * 0.9, 0.022);
      } else {
        if (bar >= 1) { tick(t + SPB, 0.05); tick(t + SPB * 3, 0.05); }
        if (bar === 3) { tick(t + SPB * 2, 0.04); tick(t + SPB * 3.5, 0.04); }
      }
      /* One bell toll crowns the end of each phrase. */
      if (bar === 3 || bar === 7) bell(chord[0] * 4, t + SPB * 3, 2.8, 0.018);
    }
    /* — Procession: two bars walking the last chords home,
       bell and swell answering each other across the hall. — */
    for (var pb = 0; pb < 2; pb++) {
      var pt = p0 + (8 + pb) * BAR;
      var pchord = M.chords[2 + pb], proot = M.roots[2 + pb];
      pchord.forEach(function (f) { pad(f, pt, BAR * 1.05); });
      [1, 1.5, 2, 1.5].forEach(function (mult, s) {
        tone(proot * mult, pt + s * SPB, SPB * 0.95, 0.12, "sine", false);
      });
      [0, 2, 4, 5].forEach(function (idx, s) {
        if (M.scale[idx] !== undefined) tone(M.scale[idx] * 2, pt + s * SPB, 1.1, 0.045, "sine", true);
      });
      for (var pk = 0; pk < 4; pk++) tick(pt + pk * SPB, 0.045);
      if (pb === 1) {
        for (var po = 0; po < 4; po++) tick(pt + po * SPB + SPB * 0.5, 0.03);
        thump(proot, pt, 0.11);
      }
      if (pb === 0) { bell(pchord[0] * 4, pt, 2.8, 0.016); swell(pchord[2] * 2, pt + SPB * 2, BAR * 0.45, 0.02); }
      else { swell(pchord[2] * 2, pt, BAR * 0.45, 0.02); bell(pchord[0] * 4, pt + SPB * 2, 2.8, 0.016); }
    }
    /* — Climax: the held tonic, with weight — two thumps, a
       sub-octave where the root can carry one, a two-tone
       swell stack, five bell tolls, the climb up and the
       sparkle raining back down to the top tonic. — */
    M.chords[0].forEach(function (f) { pad(f, tf, BAR * 2.0); });
    thump(M.roots[0], tf, 0.14);
    thump(M.roots[0], tf + SPB * 2, 0.10);
    tone(M.roots[0], tf, BAR * 1.4, 0.13, "sine", false);
    tone(M.roots[0] * 2, tf, BAR * 1.2, 0.07, "sine", false);
    if (M.roots[0] >= 55) tone(M.roots[0] * 0.5, tf, BAR * 1.6, 0.06, "sine", false);
    swell(M.chords[0][1] * 2, tf, BAR * 1.3, 0.024);
    swell(M.chords[0][3] * 2, tf + SPB * 0.5, BAR * 1.1, 0.018);
    for (var b = 0; b < 5; b++) bell(M.chords[0][0] * 4, tf + b * SPB * 1.25, 3.2, 0.02);
    var climb = Math.min(8, M.scale.length);
    for (var c = 0; c < climb; c++) {
      tone(M.scale[c] * 2, tf + c * SPB * 0.25, 1.3, 0.038, "sine", true);
    }
    tone(M.scale[Math.min(4, M.scale.length - 1)] * 2, tf, 1.6, 0.05, "sine", true);
    tone(M.scale[M.scale.length - 1] * 2, tf + climb * SPB * 0.25, 2.2, 0.045, "sine", true);
    var rain = tf + climb * SPB * 0.25 + 0.5;
    for (var d = climb - 1; d >= 0; d--) {
      tone(M.scale[d] * 4, rain + (climb - 1 - d) * SPB * 0.25, 1.0, 0.012, "sine", true);
    }
    /* — Coda: the landing — one soft swell, the theme's
       opening gesture stepping back down at fading weight,
       and a single last bell toll left ringing. — */
    swell(M.chords[0][0] * 2, tc, BAR * 1.1, 0.018);
    [4, 3, 2, 0].forEach(function (idx, s) {
      if (M.scale[idx] !== undefined) tone(M.scale[idx] * 2, tc + s * SPB * 0.75, 1.4, 0.034 - s * 0.005, "sine", true);
    });
    bell(M.chords[0][0] * 4, tc + SPB * 3, 3.4, 0.014);
  }
  window.__grandFanfare = grandFanfare;
  /* Loop 33 — the Bridge: changing moods mid-play used to be a
     hard retune at the next bar line. Now the switch is crossed
     on a short composed bridge — four soft sine notes climbing
     the NEW mood's own scale (root · third · fifth · top) at
     the new tempo, sent through the delay — so the ear walks
     from the old key into the new one instead of being cut
     across. The pads and bass retune at the bar as before; the
     bridge is the handrail over the join. Silent whenever the
     music is off, and it never fires on a re-tap of the mood
     already playing (the picker handler returns early there).
     Loop 39 — the Amen: crossing INTO a quiet mood (one
     carrying quiet: true — Hymn, Vespers) reverses the
     bridge. The four notes descend the new mood's scale
     (top · fifth · third · root), slower and softer, so
     arriving at the winding-down side feels like sitting
     down rather than setting out: an amen cadence, the
     day's last chord resolving home. Leaving a quiet mood
     for a bright one still climbs as before — you stand
     up to go back to work. Monsoon (Loop 40) carries no
     quiet flag on purpose — the rain-front is a working
     mood — so crossing into it climbs like any other.
     Night Drive (Loop 41) climbs too: a drive starts
     standing up, never sitting down. */
  function moodBridge() {
    if (!AC || !master || !on) return;
    var M = MOODS[mood];
    var SPB = 60 / M.bpm;
    var t = AC.currentTime + 0.04;
    if (M.quiet) {
      var down = [7, 4, 2, 0];
      for (var j = 0; j < down.length; j++) {
        var df = M.scale[Math.min(down[j], M.scale.length - 1)];
        if (df !== undefined) tone(df * 2, t + j * SPB * 0.75, 1.6, 0.02, "sine", true);
      }
      return;
    }
    var steps = [0, 2, 4, 7];
    for (var i = 0; i < steps.length; i++) {
      var f = M.scale[Math.min(steps[i], M.scale.length - 1)];
      if (f !== undefined) tone(f * 2, t + i * SPB * 0.5, 1.25, 0.026, "sine", true);
    }
  }
  /* Loop 32 — Echo, the receiving end. A refused letter never
     earns an ugly sound: the pad filter simply ducks for half
     a second, the music leaning in while the learner retries,
     then eases back to wherever the flow says it belongs. */
  function duck() {
    if (!AC || !padFilter) return;
    var M = MOODS[mood];
    padFilter.frequency.cancelScheduledValues(AC.currentTime);
    padFilter.frequency.setTargetAtTime(Math.max(180, flowFilter(M) * 0.45), AC.currentTime, 0.04);
    clearTimeout(duckTimer);
    duckTimer = setTimeout(function () {
      if (!AC || !padFilter) return;
      var M2 = MOODS[mood];
      padFilter.frequency.setTargetAtTime(isMasterpiece() ? M2.filterMp : flowFilter(M2), AC.currentTime, 0.5);
    }, 480);
  }
  /* The answer note: one soft sine from the mood's own scale,
     an octave up and sent through the delay. Consecutive
     perfect reps climb the ladder (third, fourth, fifth…);
     a mastered block lands with a gentle two-note chime. */
  function answerNote(big) {
    if (!AC || !master || !on) return;
    var P = MOODS[mood].scale;
    var idx = Math.min(P.length - 1, 2 + (streak % 5));
    var t = AC.currentTime + 0.03;
    tone(P[idx] * 2, t, 1.3, 0.03, "sine", true);
    if (big && P[idx + 2] !== undefined) tone(P[idx + 2] * 2, t + 0.09, 1.5, 0.024, "sine", true);
  }
  function musicEcho(kind) {
    if (kind === "key") { flow = Math.min(1, flow + 0.03); return; }
    if (kind === "slip") {
      flow = Math.max(0, flow - 0.13); streak = 0;
      if (on) duck();
      return;
    }
    if (kind === "rep") { flow = Math.min(1, flow + 0.16); answerNote(false); streak++; return; }
    if (kind === "master") { flow = 1; answerNote(true); streak++; }
  }
  window.__musicEcho = musicEcho;
  btn.addEventListener("click", function () {
    on = !on;
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-pressed", String(on));
    btnText.textContent = on ? "Music on" : "Music off";
    if (on) start(); else stop();
  });
  /* Let the Library's picture music hush this engine when it starts,
     so the two never play over each other. */
  window.__stopMainMusic = function () {
    if (!on) return;
    on = false;
    btn.classList.remove("on");
    btn.setAttribute("aria-pressed", "false");
    btnText.textContent = "Music off";
    stop();
  };
  /* Mood picker — switching moods retunes the engine from the next
     bar onward; the choice is remembered on this device. */
  var moodBtns = document.querySelectorAll(".mood-btn");
  function paintMoods() {
    Array.prototype.forEach.call(moodBtns, function (b) {
      var sel = b.getAttribute("data-mood") === mood;
      b.classList.toggle("active", sel);
      b.setAttribute("aria-pressed", String(sel));
    });
  }
  Array.prototype.forEach.call(moodBtns, function (b) {
    b.addEventListener("click", function () {
      var next = b.getAttribute("data-mood");
      if (!next || !MOODS[next] || next === mood) { paintMoods(); return; }
      mood = next;
      try { localStorage.setItem("code-block-music-mood-v1", mood); } catch (e) {}
      if (delayNode && AC) delayNode.delayTime.setTargetAtTime((60 / MOODS[mood].bpm) * 0.75, AC.currentTime, 0.2);
      /* Loop 33: cross into the new mood on its bridge phrase. */
      moodBridge();
      paintMoods();
      /* Loop 24 — every real mood switch announces itself
         through the app's polite live region, so the change
         is heard as well as seen. Loop 50 — speak through the
         app's one voice (cbAnnounce): writing the region
         directly raced its clear-then-write timer and could
         be wiped mid-sentence; the raw write stays only as a
         fallback for a click landing before it exists. */
      if (window.cbAnnounce) window.cbAnnounce("Music mood: " + b.textContent.trim());
      else { var sr = document.getElementById("srStatus"); if (sr) sr.textContent = "Music mood: " + b.textContent.trim(); }
    });
  });
  paintMoods();
})();
