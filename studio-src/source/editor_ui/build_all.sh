#!/bin/bash
# Rebuild the Web Studio's staged files and a local test site (ui/testsite = repo + stage + MOCK engine).
set -e
H="$(cd "$(dirname "$0")" && pwd)"; R="$(dirname "$H")"
node "$H/build_editor.js" "$R/stage/js/vendor/codemirror-epp.js"
python3 "$H/build_data.py"
python3 "$H/gen_fam_css.py" >/dev/null
mkdir -p "$R/stage/css"; cat "$H/studio_base.css" "$H/fam.css" > "$R/stage/css/epp-studio.css"
mkdir -p "$H/testsite"; find "$H/testsite" -mindepth 1 -delete
cp -r "$R/site/repo/." "$H/testsite/"; rm -rf "$H/testsite/.git"
cp -r "$R/stage/." "$H/testsite/"
mkdir -p "$H/testsite/engine"
if [ "${REAL_ENGINE:-}" != "" ] && [ -f "$R/stage/engine/epp_engine.js" ]; then echo "testsite uses the REAL engine"; else cp "$H/mock_engine.js" "$H/testsite/engine/epp_engine.js"; echo "testsite uses the MOCK engine"; fi
