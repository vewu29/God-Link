"use strict";
/* ================= Code Block Studio — the 3D view =================
   Draws a project (while editing) or a running game (while playing)
   with Babylon.js: one mesh per actor, a sun with soft shadows, a
   glow around the selection, move/rotate/scale handles, the play
   cameras (follow, top-down, side, fixed), particle bursts and the
   game's sounds — all made here, with no files to download except
   Babylon.js itself, which loads the first time the Studio opens.

   window.CBStudioView(canvas) → view, with:
     ready                Promise: Babylon is loaded and the scene built
     showProject(p, sel)  draw the project's actors (editing)
     select(id), setGizmo("move"|"rotate"|"scale"), frame(id)
     onPick(fn(id)), onTransform(fn(id, {pos, rot, scale}))
     play(game, onFrame), stop(), playing()
     sound(name), resize() */
(function () {
  var BABYLON_URL = window.CB_BABYLON_URL || "https://cdn.jsdelivr.net/npm/babylonjs@9.30.0/babylon.js";
  var D2R = Math.PI / 180;

  function loadBabylon() {
    if (window.BABYLON) return Promise.resolve(window.BABYLON);
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = BABYLON_URL;
      s.async = true;
      s.onload = function () { window.BABYLON ? resolve(window.BABYLON) : reject(new Error("Babylon.js didn't start")); };
      s.onerror = function () { reject(new Error("Babylon.js couldn't load")); };
      document.head.appendChild(s);
    });
  }

  /* ---------- sounds, made on the spot ---------- */
  var AC = null, master = null;
  function audio() {
    if (!AC) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      try { AC = new C(); } catch (e) { return null; }
      master = AC.createGain(); master.gain.value = 0.5;
      var comp = AC.createDynamicsCompressor(); master.connect(comp); comp.connect(AC.destination);
    }
    if (AC.state !== "running") { try { AC.resume(); } catch (e) {} }
    return AC;
  }
  ["pointerdown", "keydown", "touchend"].forEach(function (t) { document.addEventListener(t, function () { if (AC && AC.state !== "running") { try { AC.resume(); } catch (e) {} } }, true); });
  function tone(f, t, dur, type, vol, to) {
    var o = AC.createOscillator(), g = AC.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  var noiseBuf = null;
  function noise(t, dur, vol, freq, type) {
    if (!noiseBuf) { noiseBuf = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    var s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = noiseBuf; f.type = type || "lowpass"; f.frequency.value = freq || 1200;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + 0.05);
  }
  function midi(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  var SOUNDS = {
    coin: function (t) { tone(midi(83), t, 0.08, "square", 0.12); tone(midi(88), t + 0.07, 0.22, "square", 0.12); },
    jump: function (t) { tone(280, t, 0.2, "sine", 0.25, 720); },
    hit: function (t) { noise(t, 0.12, 0.4, 900); tone(140, t, 0.16, "triangle", 0.3, 70); },
    explode: function (t) { noise(t, 0.7, 0.6, 700); noise(t, 0.25, 0.4, 3000, "bandpass"); tone(90, t, 0.5, "sine", 0.4, 40); },
    powerup: function (t) { [60, 64, 67, 72, 76, 79, 84].forEach(function (m, i) { tone(midi(m), t + i * 0.045, 0.12, "square", 0.08); }); },
    laser: function (t) { tone(1400, t, 0.22, "sawtooth", 0.1, 180); },
    win: function (t) { [72, 76, 79, 84].forEach(function (m, i) { tone(midi(m), t + i * 0.12, 0.5, "triangle", 0.18); }); tone(midi(88), t + 0.5, 0.9, "sine", 0.12); },
    lose: function (t) { [67, 63, 60, 55].forEach(function (m, i) { tone(midi(m), t + i * 0.16, 0.35, "triangle", 0.18); }); },
    click: function (t) { tone(1800, t, 0.03, "square", 0.08); },
    beep: function (t) { tone(880, t, 0.12, "square", 0.08); }
  };
  function playSound(name, pitch, length) {
    var c = audio(); if (!c) return;
    var t = c.currentTime + 0.01;
    if (name === "note") { var f = 261.63 * Math.pow(2, (pitch || 0) / 12); tone(f, t, length || 0.3, "triangle", 0.2); tone(f * 2, t, (length || 0.3) * 0.6, "sine", 0.05); return; }
    (SOUNDS[name] || SOUNDS.beep)(t);
  }

  window.CBStudioView = function (canvas) {
    var view = { onPickFn: null, onTransformFn: null, mode: "move" };
    var B = null, engine = null, scene = null, editCam = null, playCam = null, sun = null, hemi = null, shadows = null, glow = null, highlight = null, gizmos = null, particleTex = null;
    var editMeshes = {}, playMeshes = {}, selected = null, game = null, onFrame = null, acc = 0, last = 0, shake = { t: 0, s: 0 }, camPos = null;

    view.sound = playSound;
    view.ready = loadBabylon().then(function (BAB) {
      B = BAB;
      engine = new B.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, antialias: true }, true);
      engine.canvasTabIndex = 0; // Babylon's default (1) would jump the canvas ahead in the Tab order
      engine.setHardwareScalingLevel(1 / Math.min(2, window.devicePixelRatio || 1));
      scene = new B.Scene(engine);
      scene.clearColor = B.Color4.FromHexString("#8ec5ffff");
      scene.ambientColor = new B.Color3(0.3, 0.3, 0.35);
      editCam = new B.ArcRotateCamera("edit", -Math.PI / 2.3, 1.0, 22, new B.Vector3(0, 0.5, 0), scene);
      editCam.lowerRadiusLimit = 3; editCam.upperRadiusLimit = 120; editCam.wheelDeltaPercentage = 0.02; editCam.pinchDeltaPercentage = 0.004;
      editCam.lowerBetaLimit = 0.05; editCam.upperBetaLimit = Math.PI / 2.02; editCam.panningSensibility = 60;
      editCam.attachControl(canvas, true);
      playCam = new B.FreeCamera("play", new B.Vector3(0, 6, -12), scene);
      playCam.minZ = 0.1; playCam.fov = 0.9;
      hemi = new B.HemisphericLight("hemi", new B.Vector3(0.2, 1, 0.15), scene);
      hemi.groundColor = new B.Color3(0.22, 0.24, 0.3);
      sun = new B.DirectionalLight("sun", new B.Vector3(-0.45, -1, 0.35), scene);
      sun.position = new B.Vector3(18, 30, -14);
      shadows = new B.ShadowGenerator(1024, sun);
      shadows.usePercentageCloserFiltering = true; shadows.bias = 0.0008; shadows.normalBias = 0.02;
      glow = new B.GlowLayer("glow", scene, { blurKernelSize: 24 }); glow.intensity = 0.35;
      highlight = new B.HighlightLayer("hl", scene, { isStroke: true });
      highlight.innerGlow = false; highlight.outerGlow = true; highlight.blurHorizontalSize = 0.6; highlight.blurVerticalSize = 0.6;
      gizmos = new B.GizmoManager(scene);
      gizmos.usePointerToAttachGizmos = false;
      gizmos.positionGizmoEnabled = true;
      gizmos.boundingBoxGizmoEnabled = false;
      wireGizmoEnd();
      // a soft round dot for particles, drawn here
      particleTex = new B.DynamicTexture("dot", { width: 64, height: 64 }, scene, false);
      var ctx = particleTex.getContext(), grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.4, "rgba(255,255,255,0.7)"); grd.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grd; ctx.fillRect(0, 0, 64, 64); particleTex.hasAlpha = true; particleTex.update();
      scene.onPointerObservable.add(function (pi) {
        if (pi.type !== B.PointerEventTypes.POINTERTAP) return;
        var m = pi.pickInfo && pi.pickInfo.hit ? pi.pickInfo.pickedMesh : null;
        while (m && !(m.metadata && m.metadata.actor)) m = m.parent;
        var id = m ? m.metadata.actor : null;
        if (game) { if (id) game.click(id); return; }
        if (view.onPickFn) view.onPickFn(id);
      });
      engine.runRenderLoop(loop);
      window.addEventListener("resize", function () { engine.resize(); });
      return view;
    });

    function wireGizmoEnd() {
      var fire = function () {
        if (!selected || !editMeshes[selected] || !view.onTransformFn) return;
        var m = editMeshes[selected];
        view.onTransformFn(selected, {
          pos: { x: r3(m.position.x), y: r3(m.position.y), z: r3(m.position.z) },
          rot: { x: r3(m.rotation.x / D2R), y: r3(m.rotation.y / D2R), z: r3(m.rotation.z / D2R) },
          scale: { x: r3(Math.max(0.05, m.scaling.x)), y: r3(Math.max(0.05, m.scaling.y)), z: r3(Math.max(0.05, m.scaling.z)) }
        });
      };
      var hook = function () {
        var g = gizmos.gizmos;
        [g.positionGizmo, g.rotationGizmo, g.scaleGizmo].forEach(function (gz) {
          if (gz && !gz.__cb) { gz.__cb = true; gz.onDragEndObservable.add(fire); }
        });
      };
      hook();
      view.__hook = hook;
    }
    function r3(n) { return Math.round(n * 1000) / 1000; }

    function color(hex) { return B.Color3.FromHexString(/^#[0-9a-f]{6}$/i.test(hex) ? hex : "#9ca3af"); }
    function makeMesh(a, key) {
      var m, s = a.shape;
      if (s === "sphere") m = B.MeshBuilder.CreateSphere(key, { diameter: 1, segments: 24 }, scene);
      else if (s === "cylinder") m = B.MeshBuilder.CreateCylinder(key, { height: 1, diameter: 1, tessellation: 40 }, scene);
      else if (s === "cone") m = B.MeshBuilder.CreateCylinder(key, { height: 1, diameterTop: 0, diameterBottom: 1, tessellation: 40 }, scene);
      else if (s === "capsule") m = B.MeshBuilder.CreateCapsule(key, { height: 1, radius: 0.42, tessellation: 24, subdivisions: 4 }, scene);
      else if (s === "torus") m = B.MeshBuilder.CreateTorus(key, { diameter: 0.78, thickness: 0.22, tessellation: 40 }, scene);
      else if (s === "sign") m = B.MeshBuilder.CreatePlane(key, { width: 1, height: 1, sideOrientation: B.Mesh.DOUBLESIDE }, scene);
      else m = B.MeshBuilder.CreateBox(key, { size: 1 }, scene);
      var mat = new B.StandardMaterial(key + "-m", scene);
      mat.specularColor = new B.Color3(0.16, 0.16, 0.16); mat.specularPower = 32;
      m.material = mat;
      m.metadata = { actor: a.id, shape: s, color: null, text: null };
      m.receiveShadows = true;
      if (s !== "sign") shadows.addShadowCaster(m);
      return m;
    }
    function paint(m, a) {
      if (m.metadata.color !== a.color || (a.shape === "sign" && m.metadata.text !== a.text)) {
        var mat = m.material;
        if (a.shape === "sign") {
          var tex = mat.diffuseTexture || new B.DynamicTexture(m.name + "-t", { width: 512, height: 256 }, scene, true);
          var ctx = tex.getContext();
          ctx.fillStyle = a.color; ctx.fillRect(0, 0, 512, 256);
          ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 10; ctx.strokeRect(5, 5, 502, 246);
          ctx.fillStyle = luminance(a.color) > 0.5 ? "#0f172a" : "#ffffff";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          var text = String(a.text || ""), size = text.length > 24 ? 40 : text.length > 12 ? 56 : 76;
          ctx.font = "800 " + size + "px system-ui, sans-serif";
          wrap(ctx, text, 256, 128, 470, size * 1.15);
          tex.update(); mat.diffuseTexture = tex; mat.emissiveColor = new B.Color3(0.55, 0.55, 0.55); mat.backFaceCulling = false;
        } else {
          mat.diffuseColor = color(a.color);
          mat.emissiveColor = color(a.color).scale(0.06);
        }
        m.metadata.color = a.color; m.metadata.text = a.text;
      }
      m.position.set(a.pos.x, a.pos.y, a.pos.z);
      m.rotation.set(a.rot.x * D2R, a.rot.y * D2R, a.rot.z * D2R);
      m.scaling.set(a.scale.x, a.scale.y, a.scale.z);
      m.isVisible = a.visible !== false;
    }
    function luminance(hex) { var c = color(hex); return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b; }
    function wrap(ctx, text, x, y, max, lh) {
      var words = text.split(/\s+/), lines = [], line = "";
      words.forEach(function (w) { var t = line ? line + " " + w : w; if (ctx.measureText(t).width > max && line) { lines.push(line); line = w; } else line = t; });
      if (line) lines.push(line);
      lines = lines.slice(0, 3);
      lines.forEach(function (l, i) { ctx.fillText(l, x, y + (i - (lines.length - 1) / 2) * lh); });
    }
    /* sky colour, fog (tinted to match the sky) and brightness */
    function atmosphere(w) {
      var hex = /^#[0-9a-f]{6}$/i.test(w.sky) ? w.sky : "#8ec5ff", light = typeof w.light === "number" ? w.light : 1;
      scene.clearColor = B.Color4.FromHexString(hex + "ff");
      scene.fogMode = w.fog ? B.Scene.FOGMODE_EXP2 : B.Scene.FOGMODE_NONE;
      scene.fogDensity = 0.022; scene.fogColor = B.Color3.FromHexString(hex);
      hemi.intensity = 0.45 * light; sun.intensity = 0.72 * light;
    }

    view.showProject = function (p, sel) {
      if (!scene) return;
      atmosphere(p.world);
      var seen = {};
      p.actors.forEach(function (a) {
        seen[a.id] = true;
        var m = editMeshes[a.id];
        if (m && m.metadata.shape !== a.shape) { m.dispose(false, true); m = null; }
        if (!m) m = editMeshes[a.id] = makeMesh(a, "e-" + a.id);
        paint(m, a);
        m.setEnabled(!game);
      });
      for (var id in editMeshes) if (!seen[id]) { editMeshes[id].dispose(false, true); delete editMeshes[id]; }
      view.select(sel || null);
    };
    view.select = function (id) {
      selected = id && editMeshes[id] ? id : null;
      if (!scene) return;
      highlight.removeAllMeshes();
      var m = selected ? editMeshes[selected] : null;
      if (m && !game) {
        highlight.addMesh(m, B.Color3.FromHexString("#fbbf24"));
        gizmos.attachToMesh(m);
      } else gizmos.attachToMesh(null);
      if (view.__hook) view.__hook();
    };
    view.setGizmo = function (mode) {
      view.mode = mode;
      if (!gizmos) return;
      gizmos.positionGizmoEnabled = mode === "move";
      gizmos.rotationGizmoEnabled = mode === "rotate";
      gizmos.scaleGizmoEnabled = mode === "scale";
      if (gizmos.gizmos.rotationGizmo) gizmos.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh = false;
      if (view.__hook) view.__hook();
      view.select(selected);
    };
    view.frame = function (id) {
      var m = id && editMeshes[id];
      if (!m || !editCam) return;
      editCam.setTarget(m.position.clone());
      editCam.radius = Math.max(4, Math.max(m.scaling.x, m.scaling.y, m.scaling.z) * 3.2);
    };
    view.onPick = function (fn) { view.onPickFn = fn; };
    view.onTransform = function (fn) { view.onTransformFn = fn; };
    view.resize = function () { if (engine) engine.resize(); };
    view.playing = function () { return !!game; };

    /* ---------- play ---------- */
    view.play = function (g, frameFn) {
      game = g; onFrame = frameFn; acc = 0; last = performance.now(); shake = { t: 0, s: 0 }; camPos = null;
      if (scene) {
        gizmos.attachToMesh(null); highlight.removeAllMeshes();
        for (var id in editMeshes) editMeshes[id].setEnabled(false);
        editCam.detachControl();
        scene.activeCamera = playCam;
      }
      g.start();
      if (!scene) noSceneLoop();
    };
    view.stop = function () {
      game = null; onFrame = null;
      for (var id in playMeshes) playMeshes[id].dispose(false, true);
      playMeshes = {};
      if (!scene) return;
      scene.particleSystems.slice().forEach(function (ps) { ps.dispose(); });
      for (id in editMeshes) editMeshes[id].setEnabled(true);
      scene.activeCamera = editCam;
      editCam.attachControl(canvas, true);
      view.select(selected);
    };
    function noSceneLoop() {
      if (!game) return;
      step();
      requestAnimationFrame(noSceneLoop);
    }
    function step() {
      var now = performance.now(), dt = Math.min(0.25, (now - last) / 1000); last = now;
      acc += dt;
      var n = 0;
      while (acc >= 1 / 60 && n < 6 && game && !game.ended) { game.tick(1 / 60); acc -= 1 / 60; n++; }
      if (n === 6) acc = 0;
      if (!game) return;
      var evs = game.drain();
      for (var i = 0; i < evs.length; i++) handle(evs[i]);
      if (onFrame) onFrame(game);
    }
    function handle(e) {
      if (e.type === "sound") playSound(e.sound);
      else if (e.type === "note") playSound("note", e.pitch, e.length);
      else if (e.type === "shake") shake = { t: Math.max(shake.t, e.duration), s: Math.max(shake.s, e.strength) };
      else if (e.type === "particles" && scene) burst(e.effect, e.at);
    }
    var FX = {
      sparkle: { n: 50, c1: "#fff7cc", c2: "#facc15", size: [0.08, 0.22], life: [0.35, 0.8], power: [1.5, 4], grav: -2, blend: "add" },
      explosion: { n: 140, c1: "#fde68a", c2: "#f97316", size: [0.2, 0.7], life: [0.3, 0.8], power: [4, 10], grav: -3, blend: "add" },
      smoke: { n: 36, c1: "#d1d5db", c2: "#6b7280", size: [0.6, 1.4], life: [0.9, 1.6], power: [0.4, 1.4], grav: 1.5, blend: "standard" },
      confetti: { n: 160, c1: "#f472b6", c2: "#38bdf8", size: [0.08, 0.18], life: [1.2, 2.2], power: [3, 8], grav: -6, blend: "standard" },
      fire: { n: 80, c1: "#fde047", c2: "#ef4444", size: [0.25, 0.7], life: [0.4, 0.9], power: [1, 3], grav: 4, blend: "add" }
    };
    function burst(kind, at) {
      var f = FX[kind] || FX.sparkle;
      var ps = new B.ParticleSystem("fx", f.n, scene);
      ps.particleTexture = particleTex;
      ps.emitter = new B.Vector3(at.x, at.y, at.z);
      ps.createSphereEmitter(0.3, 1);
      var c1 = color(f.c1), c2 = color(f.c2);
      ps.color1 = new B.Color4(c1.r, c1.g, c1.b, 1); ps.color2 = new B.Color4(c2.r, c2.g, c2.b, 1); ps.colorDead = new B.Color4(c2.r, c2.g, c2.b, 0);
      ps.minSize = f.size[0]; ps.maxSize = f.size[1]; ps.minLifeTime = f.life[0]; ps.maxLifeTime = f.life[1];
      ps.minEmitPower = f.power[0]; ps.maxEmitPower = f.power[1]; ps.gravity = new B.Vector3(0, f.grav, 0);
      ps.blendMode = f.blend === "add" ? B.ParticleSystem.BLENDMODE_ADD : B.ParticleSystem.BLENDMODE_STANDARD;
      if (kind === "confetti") { ps.minAngularSpeed = -6; ps.maxAngularSpeed = 6; }
      ps.manualEmitCount = f.n; ps.targetStopDuration = f.life[1] + 0.2; ps.disposeOnStop = true;
      ps.start();
    }
    function syncGame() {
      atmosphere(game.world);
      var seen = {};
      for (var i = 0; i < game.actors.length; i++) {
        var a = game.actors[i];
        if (!a.alive) continue;
        seen[a.id] = true;
        var m = playMeshes[a.id];
        if (m && m.metadata.shape !== a.shape) { m.dispose(false, true); m = null; }
        if (!m) m = playMeshes[a.id] = makeMesh(a, "p-" + a.id);
        paint(m, a);
      }
      for (var id in playMeshes) if (!seen[id]) { playMeshes[id].dispose(false, true); delete playMeshes[id]; }
      // the camera
      var c = game.camera, d = c.distance, t = null;
      for (i = 0; i < game.actors.length; i++) if (game.actors[i].id === c.target && game.actors[i].alive) t = game.actors[i].pos;
      var focus = t ? new B.Vector3(t.x, t.y, t.z) : new B.Vector3(0, 1, 0), want;
      if (c.mode === "top-down") want = focus.add(new B.Vector3(0, d, -d * 0.28));
      else if (c.mode === "side") want = new B.Vector3(focus.x, focus.y + d * 0.18, focus.z - d);
      else if (c.mode === "fixed") { focus = new B.Vector3(0, 1.5, 0); want = new B.Vector3(0, d * 0.7, -d * 1.05); }
      else want = focus.add(new B.Vector3(0, d * 0.42, -d));
      camPos = camPos ? B.Vector3.Lerp(camPos, want, 0.12) : want;
      var pos = camPos.clone();
      if (shake.t > 0) { var s = shake.s * Math.min(1, shake.t * 3); pos.addInPlace(new B.Vector3((Math.random() - 0.5) * s, (Math.random() - 0.5) * s, (Math.random() - 0.5) * s)); shake.t -= engine.getDeltaTime() / 1000; }
      playCam.position.copyFrom(pos);
      playCam.setTarget(focus.add(new B.Vector3(0, c.mode === "top-down" ? 0 : 0.8, 0)));
    }
    function loop() {
      if (game) { step(); if (game) syncGame(); }
      scene.render();
    }
    return view;
  };
})();
