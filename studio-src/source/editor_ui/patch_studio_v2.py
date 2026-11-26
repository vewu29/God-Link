# Makes stage_v2/js/epp-studio.js from the live stage_text one + studio_v2_part.js (editor v2 page code).
import os
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(H)
s = open(os.path.join(R, 'stage_text/js/epp-studio.js')).read()
old_touch = '''  var touch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  document.documentElement.classList.toggle("es-touch", !!touch);
'''
new_touch = '''  /* touch row: on for a phone (coarse pointer); on a laptop or Chromebook it shows when you touch the
     screen and hides again when you type on a physical keyboard (a touchscreen Chromebook keeps both). */
  var coarse = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  var touch = coarse || (!(window.matchMedia && window.matchMedia("(pointer: fine)").matches) && "ontouchstart" in window);
  var lastTouch = 0;
  function setTouch(on) { touch = !!on; document.documentElement.classList.toggle("es-touch", touch); document.documentElement.classList.toggle("es-keys", !touch); }
  setTouch(touch);
  window.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch") { lastTouch = Date.now(); if (!touch) { setTouch(true); setTimeout(layout, 0); } } }, true);
  window.addEventListener("keydown", function (e) {
    if (coarse || !touch) return;
    if (Date.now() - lastTouch < 1500) return; // an on-screen keyboard right after a tap
    if (e.key && e.key.length === 1 || /^(Enter|Backspace|Tab|Arrow)/.test(e.key)) { setTouch(false); setTimeout(layout, 0); }
  }, true);
'''
assert old_touch in s; s = s.replace(old_touch, new_touch)
i = s.index('  var ACC = [['); j = s.index('  /* ---------- keyboard-aware layout')
s = s[:i] + open(os.path.join(H, 'studio_v2_part.js')).read() + s[j:]
old_create = '''      onCursor: onCursor,
      onRun: run
    });'''
new_create = '''      onCursor: onCursor,
      onRun: run,
      fileName: function () { return files[active] ? files[active].name : "main.epp"; },
      otherFiles: function () { return files.map(function (f, i) { return i === active ? null : { name: f.name, text: f.state ? f.state.doc.toString() : (f.text || "") }; }).filter(Boolean); },
      onRootTable: function (w) { openRootTable(w); },
      onRename: function (n) { askRename(n); },
      openFile: function (name, line) { var i = files.findIndex(function (f) { return f.name === name; }); if (i < 0) return; openTab(i); editor.goToLine(line); }
    });'''
assert old_create in s; s = s.replace(old_create, new_create)
a = 'window.EppStudio = { editor: editor, files: function () { syncActive(); return fileList(); }, shareURL: shareURL, run: run, stop: stop, engine: function () { return M; }, showPane: showPane };'
assert a in s
s = s.replace(a, 'window.EppStudio = { editor: editor, files: function () { syncActive(); return fileList(); }, shareURL: shareURL, run: run, stop: stop, engine: function () { return M; }, showPane: showPane, blocks: BLOCKS, insertBlock: insertBlock, openRootTable: openRootTable, rootTable: function () { return RT; }, openOutline: openOutline, rename: doRename, setTouch: setTouch, openTab: openTab };')
old_gk = '    g.addEventListener("contextmenu", function (e) { e.preventDefault(); });\n'
assert old_gk in s
s = s.replace(old_gk, old_gk + '    /* iPhone: stop the touch itself so Safari/Chrome-iOS never flash, focus, scroll or zoom on a game key */\n    g.addEventListener("touchstart", function (e) { if (e.target.closest(".es-gk")) e.preventDefault(); }, { passive: false });\n    g.addEventListener("touchend", function (e) { if (e.target.closest(".es-gk")) e.preventDefault(); }, { passive: false });\n')
old_gk2 = '    g.addEventListener("touchend", function (e) { if (e.target.closest(".es-gk")) e.preventDefault(); }, { passive: false });\n'
assert old_gk2 in s
s = s.replace(old_gk2, old_gk2 + """    /* iPhone double tap: never start a text selection, word highlight or zoom anywhere in the game area */
    (function () {
      var st = $("esStage");
      function noSel() { try { var sel = window.getSelection(); if (sel && sel.rangeCount && !(editor && editor.view.hasFocus)) sel.removeAllRanges(); } catch (er) {} }
      st.addEventListener("selectstart", function (e) { e.preventDefault(); });
      st.addEventListener("dblclick", function (e) { e.preventDefault(); noSel(); });
      st.addEventListener("touchstart", function (e) { if (e.touches.length === 1 && !e.target.closest("button, input, select, textarea, a, canvas")) e.preventDefault(); }, { passive: false });
      st.addEventListener("touchend", function (e) { if (!e.target.closest("button, input, select, textarea, a, canvas")) e.preventDefault(); noSel(); }, { passive: false });
      g.addEventListener("pointerdown", noSel, true);
    })();
""")
open(os.path.join(R, 'stage_v2/js/epp-studio.js'), 'w').write(s)
print('epp-studio.js', len(s))
