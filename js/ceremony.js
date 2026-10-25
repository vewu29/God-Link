"use strict";
/* ================= LOOP 15 — CEREMONY, CERTIFICATE, MUSIC BUBBLE =================
   Everything here drives existing pieces: the world's celebration
   and sky pulse, the music engine's grand fanfare, the profile's
   learner name, and the shared BLOCKS / REPS_GOAL data for the
   active track. No new state is kept and nothing is persisted. */
(function () {
  function $(id) { return document.getElementById(id); }
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isDrive = !!window.__isDrive, isCS = !!window.__isCS;
  var totalReps = BLOCKS.length * REPS_GOAL;
  var COPY = isDrive ? {
    eyebrow: "Drive track complete", title: "The Road Masterpiece",
    line: "Every road block in your world is lit. You repeated the rules until they stuck — signs, signals, and safe driving, one line at a time. The music is playing the full arrangement for you.",
    certA: "has mastered all " + BLOCKS.length + " Minnesota road blocks",
    certB: "in the Code Block world — the complete driving track,"
  } : isCS ? {
    eyebrow: "C# track complete", title: "The C# Masterpiece",
    line: "Every block in your world is lit — in a whole new language. You typed each line eight perfect times, and now the music plays the full arrangement: the masterpiece you built one repetition at a time.",
    certA: "has mastered all " + BLOCKS.length + " C# blocks",
    certB: "in the Code Block world — the complete C# track,"
  } : {
    eyebrow: "C++ track complete", title: "The Masterpiece",
    line: "Every block in your world is lit. You typed each line eight perfect times, and now the music plays the full arrangement: the masterpiece you built one repetition at a time.",
    certA: "has mastered all " + BLOCKS.length + " C++ blocks",
    certB: "in the Code Block world — the complete C++ track,"
  };
  var certTail = "learned by repetition — one line, eight perfect times, over and over.";

  /* ---------- Ceremony ---------- */
  var ceremony = $("ceremony"), cerWave = $("cerWave"), cerPct = $("cerPct");
  var cerSteps = [$("cerStepTitle"), $("cerStepLine"), $("cerStepStats"), $("cerStepActions")];
  var lastFocus = null, hideTimer = null, waveTimers = [], countRAF = null;

  function buildWave() {
    cerWave.innerHTML = "";
    BLOCKS.forEach(function (b, i) {
      var s = document.createElement("span");
      s.className = "cer-chip";
      s.style.background = b.color;
      s.textContent = String(i + 1);
      cerWave.appendChild(s);
    });
  }
  function buildStats() {
    var box = $("cerStats"); box.innerHTML = "";
    [[BLOCKS.length, " blocks mastered"], [totalReps, " perfect reps"], ["100%", " of the track"]].forEach(function (pair) {
      var chip = document.createElement("span"); chip.className = "cer-stat";
      var strong = document.createElement("strong"); strong.textContent = String(pair[0]);
      chip.appendChild(strong); chip.appendChild(document.createTextNode(pair[1]));
      box.appendChild(chip);
    });
  }
  function countUp() {
    if (countRAF) cancelAnimationFrame(countRAF);
    if (reduceMotion) { cerPct.textContent = "100%"; return; }
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / 1200);
      cerPct.textContent = Math.round((1 - Math.pow(1 - p, 3)) * 100) + "%";
      if (p < 1) countRAF = requestAnimationFrame(frame);
    }
    countRAF = requestAnimationFrame(frame);
  }
  function armAutoHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(closeCeremony, 20000);
  }
  function openCeremony(auto) {
    if (!ceremony) return;
    lastFocus = document.activeElement;
    $("cerEyebrow").textContent = COPY.eyebrow;
    $("cerTitle").textContent = COPY.title;
    $("cerLine").textContent = COPY.line;
    buildWave(); buildStats();
    cerSteps.forEach(function (s) { s.classList.remove("show"); });
    cerPct.textContent = "0%";
    ceremony.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (window.__skyPulse) window.__skyPulse();
    if (!auto) {
      if (window.__celebrate) window.__celebrate();
      if (window.__grandFanfare) window.__grandFanfare();
    }
    var chips = cerWave.children, waveMs = 0;
    waveTimers.forEach(clearTimeout); waveTimers = [];
    if (reduceMotion) {
      for (var i = 0; i < chips.length; i++) chips[i].classList.add("lit");
    } else {
      for (var j = 0; j < chips.length; j++) (function (ch, d) {
        waveTimers.push(setTimeout(function () { ch.classList.add("lit"); }, 130 + d * 42));
      })(chips[j], j);
      waveMs = 130 + chips.length * 42;
    }
    countUp();
    var stepDelay = reduceMotion ? 0 : waveMs + 200;
    waveTimers.push(setTimeout(function () {
      cerSteps.forEach(function (s, k) {
        /* Loop 53: the per-step stagger is motion too — under
           reduced motion every step shows together. */
        waveTimers.push(setTimeout(function () {
          s.classList.add("show");
          /* Loop 60: the focus landing lives here now, not on
             a 60ms timer in openCeremony — the Done button
             sits in this last step, which is visibility:hidden
             until this moment (see .cer-step), so the old
             landing put focus on a button nobody could see
             for the whole wave. Land as it shows, unless the
             learner has already tabbed inside the dialog. */
          if (k === cerSteps.length - 1) {
            var a = document.activeElement;
            if (!a || !ceremony.contains(a)) {
              var b = $("cerDone");
              if (b) { try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); } }
            }
          }
        }, reduceMotion ? 0 : k * 130));
      });
    }, stepDelay));
    armAutoHide();
  }
  function closeCeremony() {
    if (!ceremony || ceremony.classList.contains("hidden")) return;
    ceremony.classList.add("hidden");
    document.body.style.overflow = "";
    clearTimeout(hideTimer);
    waveTimers.forEach(clearTimeout); waveTimers = [];
    if (countRAF) cancelAnimationFrame(countRAF);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { lastFocus.focus(); } }
  }
  window.__openCeremony = openCeremony;
  $("cerClose").addEventListener("click", closeCeremony);
  $("cerDone").addEventListener("click", closeCeremony);
  $("cerFanfareBtn").addEventListener("click", function () {
    if (window.__grandFanfare) window.__grandFanfare();
    armAutoHide();
  });
  $("cerCertBtn").addEventListener("click", function () { closeCeremony(); openCert(); });
  ceremony.addEventListener("click", function (e) { if (e.target === ceremony) closeCeremony(); });
  ceremony.addEventListener("pointerdown", armAutoHide);
  /* Loop 60: keyboard activity is activity too — tabbing through
     the ceremony re-arms the courtesy hide, the same courtesy a
     pointer already got, so the dialog never vanishes mid-read. */
  ceremony.addEventListener("focusin", armAutoHide);

  var reliveBtn = $("reliveBtn");
  if (reliveBtn) reliveBtn.addEventListener("click", function () { openCeremony(false); });
  var certBtn = $("certBtn");
  if (certBtn) certBtn.addEventListener("click", function () { openCert(); });

  /* ---------- Certificate ---------- */
  var certOverlay = $("certOverlay"), certLastFocus = null;
  function learnerName() {
    try {
      var p = cbProfile();
      if (p && p.name) return p.name;
    } catch (e) {}
    return "A Code Block Learner";
  }
  function dateLine() {
    try {
      return "Issued on " + new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    } catch (e) { return ""; }
  }
  function statsLine() {
    return BLOCKS.length + " blocks mastered · " + totalReps + " perfect repetitions · 100%";
  }
  function openCert() {
    if (!certOverlay) return;
    certLastFocus = document.activeElement;
    $("certName").textContent = learnerName();
    $("certTrack").textContent = COPY.certA + " " + COPY.certB + " " + certTail;
    $("certStats").textContent = statsLine();
    $("certDate").textContent = dateLine();
    var row = $("certBlocks"); row.innerHTML = "";
    BLOCKS.forEach(function (b) {
      var s = document.createElement("span");
      s.style.background = b.color;
      row.appendChild(s);
    });
    certOverlay.classList.remove("hidden");
    document.body.classList.add("printing-cert");
    document.body.style.overflow = "hidden";
    setTimeout(function () {
      var b = $("certDownload");
      if (b) { try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); } }
    }, 60);
  }
  function closeCert() {
    if (!certOverlay || certOverlay.classList.contains("hidden")) return;
    certOverlay.classList.add("hidden");
    document.body.classList.remove("printing-cert");
    document.body.style.overflow = "";
    if (certLastFocus && certLastFocus.focus) { try { certLastFocus.focus({ preventScroll: true }); } catch (e) { certLastFocus.focus(); } }
  }
  $("certClose").addEventListener("click", closeCert);
  $("certDone").addEventListener("click", closeCert);
  certOverlay.addEventListener("click", function (e) { if (e.target === certOverlay) closeCert(); });
  $("certDownload").addEventListener("click", function () {
    var cv = document.createElement("canvas"); cv.width = 1240; cv.height = 880;
    var g = cv.getContext("2d");
    var grad = g.createLinearGradient(0, 0, 0, 880);
    grad.addColorStop(0, "#ffffff"); grad.addColorStop(1, "#eaf4ff");
    g.fillStyle = grad; g.fillRect(0, 0, 1240, 880);
    g.strokeStyle = "#1d4ed8"; g.lineWidth = 6; g.strokeRect(28, 28, 1184, 824);
    g.strokeStyle = "#7cc4ff"; g.lineWidth = 2; g.strokeRect(46, 46, 1148, 788);
    g.textAlign = "center";
    g.fillStyle = "#1d4ed8"; g.font = "700 25px Sora, sans-serif";
    g.fillText("C O D E   B L O C K", 620, 116);
    g.fillStyle = "#0a2547"; g.font = "800 58px Sora, sans-serif";
    g.fillText("Certificate of Mastery", 620, 192);
    g.fillStyle = "#2f4d75"; g.font = "400 24px Sora, sans-serif";
    g.fillText("Awarded for finishing a full track — every block, every rep.", 620, 236);
    var n = BLOCKS.length, bw = 22, gap = 6, rowW = n * bw + (n - 1) * gap, x0 = (1240 - rowW) / 2;
    BLOCKS.forEach(function (b, i) {
      g.fillStyle = b.color;
      g.fillRect(x0 + i * (bw + gap), 272, bw, bw);
      g.strokeStyle = "rgba(6,30,60,0.25)"; g.lineWidth = 1;
      g.strokeRect(x0 + i * (bw + gap), 272, bw, bw);
    });
    var name = learnerName(), size = 54;
    g.fillStyle = "#1e3a8a";
    do { g.font = "800 " + size + "px Sora, sans-serif"; size -= 2; } while (g.measureText(name).width > 980 && size > 24);
    g.fillText(name, 620, 396);
    var rule = g.createLinearGradient(400, 0, 840, 0);
    rule.addColorStop(0, "rgba(56,189,248,0)"); rule.addColorStop(0.5, "#38bdf8"); rule.addColorStop(1, "rgba(56,189,248,0)");
    g.fillStyle = rule; g.fillRect(400, 424, 440, 3);
    g.fillStyle = "#0a2547"; g.font = "400 27px Sora, sans-serif";
    g.fillText(COPY.certA, 620, 492);
    g.fillText(COPY.certB, 620, 532);
    g.fillText(certTail, 620, 572);
    g.fillStyle = "#1d4ed8"; g.font = "700 25px Sora, sans-serif";
    g.fillText(statsLine(), 620, 648);
    g.fillStyle = "#2f4d75"; g.font = "400 23px Sora, sans-serif";
    g.fillText(dateLine(), 620, 692);
    var a = document.createElement("a");
    a.href = cv.toDataURL("image/png");
    a.download = "code-block-certificate.png";
    document.body.appendChild(a); a.click(); a.remove();
  });

  /* ---------- Music bubble ---------- */
  var dock = $("bubbleDock"), bubbleToggle = $("bubbleToggle"), bubblePanel = $("bubblePanel");
  var bubblePlay = $("bubblePlay"), bubblePlayLabel = $("bubblePlayLabel");
  var bubbleStatus = $("bubbleStatus"), bubbleToggleMood = $("bubbleToggleMood");
  var musicBtn = $("musicBtn");
  function syncBubble() {
    var on = musicBtn && musicBtn.getAttribute("aria-pressed") === "true";
    bubblePlay.setAttribute("aria-pressed", String(!!on));
    bubblePlayLabel.textContent = on ? "Pause the music" : "Play the music";
    var active = document.querySelector(".music-moods .mood-btn.active");
    var name = active ? active.textContent : "Calm";
    bubbleStatus.textContent = "Mood · " + name;
    bubbleToggleMood.textContent = name;
  }
  var bubbleCloseTimer = null;
  function openBubble() {
    clearTimeout(bubbleCloseTimer);
    dock.classList.remove("closing");
    /* The panel is display:none at rest — show it first, then let
       the open class animate it in on the next frame. */
    dock.classList.add("showing");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        dock.classList.add("open");
        dock.classList.remove("showing");
      });
    });
    bubbleToggle.setAttribute("aria-expanded", "true");
    syncBubble();
  }
  function closeBubble() {
    if (!dock.classList.contains("open")) return;
    dock.classList.remove("open");
    dock.classList.add("closing");
    bubbleToggle.setAttribute("aria-expanded", "false");
    clearTimeout(bubbleCloseTimer);
    /* Loop 53 gap: the close fade is stilled under reduced
       motion, so its 420ms tail must not linger either — the
       panel leaves on the next tick instead. */
    bubbleCloseTimer = setTimeout(function () { dock.classList.remove("closing"); }, reduceMotion ? 0 : 420);
  }
  bubbleToggle.addEventListener("click", function () {
    if (dock.classList.contains("open")) closeBubble(); else openBubble();
  });
  bubblePlay.addEventListener("click", function () {
    if (musicBtn) musicBtn.click();
    setTimeout(syncBubble, 0);
  });
  bubblePanel.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".mood-btn")) setTimeout(syncBubble, 0);
  });
  /* The mastery card's mood picker drives the same engine, but its
     picks never re-synced the dock: the toggle kept naming the old
     mood (Calm while Rain played) until the bubble was next opened.
     Mirror the panel listener for the card's own group. */
  var panelMoods = document.querySelector(".music-moods");
  if (panelMoods) panelMoods.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".mood-btn")) setTimeout(syncBubble, 0);
  });
  if (musicBtn) musicBtn.addEventListener("click", function () {
    if (dock.classList.contains("open")) setTimeout(syncBubble, 0);
  });
  syncBubble();

  /* One Escape ladder for the Loop 15 layers: certificate first,
     then the ceremony, then the bubble. */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (certOverlay && !certOverlay.classList.contains("hidden")) closeCert();
    else if (ceremony && !ceremony.classList.contains("hidden")) closeCeremony();
    else if (dock.classList.contains("open")) closeBubble();
  });
})();
