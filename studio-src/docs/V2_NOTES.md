# English++ Web Studio: editor v2 (Nov 25, 2026). Staged in stage_v2/, NOT pushed

Push list: push_v2_batch_1.nul (5 files, 670 KB, one batch; no server/app.py change needed):
epp-studio.html, js/epp-studio.js, js/vendor/codemirror-epp.js, css/epp-studio.css, data/epp-studio/root_table.json (new).
Engine/wasm untouched. English++ syntax untouched.

Rebuild: ui/build_v2.sh (usage counts → editor bundle → page script patch → css → root table → testsite_v2).
Root Table example status: node ui_v2/root_examples.js webkit → ui_v2/root_example_status.json, then rebuild.
Tests (server: python3 -m http.server 8765 in testsite_v2):
- ui_v2/test_editor_v2.js <iphone|webkit|chromium|chromebook>
- ui_v2/run_all_v2.sh (everything). ui_v2/run_wk_v2.sh = WebKit runs with libs from ~/workspace/.pw/syslibs
  (after the Nov 25 VM restart lost system libgstreamer etc.; MiniBrowser wrapper edited to keep LD_LIBRARY_PATH, original in MiniBrowser.orig).
