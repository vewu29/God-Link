#!/bin/bash
# Rebuild the v2 editor files into stage_v2 and copy them into the local test site (testsite_v2 = repo + stage_v2).
set -e
H="$(cd "$(dirname "$0")" && pwd)"; R="$(dirname "$H")"
python3 "$H/gen_usage.py"
node "$H/build_editor.js" "$R/stage_v2/js/vendor/codemirror-epp.js"
python3 "$H/patch_studio_v2.py"
node --check "$R/stage_v2/js/epp-studio.js"
cat "$H/studio_base.css" "$H/fam.css" > "$R/stage_v2/css/epp-studio.css"
python3 "$H/gen_root_table.py" stage_v2
cp -r "$R/stage_v2/." "$R/testsite_v2/"
