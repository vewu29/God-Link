#!/bin/bash
# Rebuild v3 (English++ Studio + C++ mode) into stage_v3 and the local test site testsite_v3 (= testsite_v2 + stage_v3).
set -e
H="$(cd "$(dirname "$0")" && pwd)"; R="$(dirname "$H")"; C="$R/cpp"
python3 "$H/gen_usage.py"
python3 "$H/patch_editor_v3.py"
node "$H/build_editor_v3.js" "$R/stage_v3/js/vendor/codemirror-epp.js"
python3 "$H/patch_studio_v3.py"
cp "$C/studio/epp-cpp.js" "$R/stage_v3/js/epp-cpp.js"
node --check "$R/stage_v3/js/epp-studio.js"; node --check "$R/stage_v3/js/epp-cpp.js"
cat "$H/studio_base.css" "$H/fam.css" "$H/studio_cpp.css" > "$R/stage_v3/css/epp-studio.css"
python3 "$H/gen_root_table.py" stage_v3
python3 "$C/tools/gen_cpp_data.py" "$R/stage_v3/data/epp-studio/cpp.json"
python3 "$C/tools/gen_cpp_examples.py" "$R/stage_v3/data/epp-studio/cpp_examples.json"
mkdir -p "$R/stage_v3/fullbuild/cpp/vendor"
cp "$C/web/cppbuild.js" "$C/web/cppworker.js" "$C/web/rlw_runtime.js" "$R/stage_v3/fullbuild/cpp/"
cp "$C/web/vendor/"* "$R/stage_v3/fullbuild/cpp/vendor/"
mkdir -p "$R/testsite_v3"; cp -r "$R/testsite_v2/." "$R/testsite_v3/"; cp -r "$R/stage_v3/." "$R/testsite_v3/"

# --- engine for stage_v3: the parent's engine (with its frame-yield fix) + only the C++ View raylib change in cppview.cpp
# refuse to build if the web glue (wasm_api.cpp yield/frame code etc.) differs from the live engine source
if ! diff -rq "$R"/engine/src_web "$C"/engine_v3/src_web >/dev/null; then echo "engine_v3/src_web differs from engine/src_web: re-copy it (cp -r "$R"/engine/src_web "$C"/engine_v3/)"; exit 1; fi
for f in "$R"/engine/src/*; do b=$(basename $f); [ "$b" = cppview.cpp ] && continue; cmp -s $f "$C"/engine_v3/src/$b || { echo "engine_v3/src/$b differs from engine/src: re-copy"; exit 1; }; done
if [ -f "$C"/engine_v3/dist/epp_engine.wasm ] && [ "$C"/engine_v3/dist/epp_engine.wasm -nt "$C"/engine_v3/src/cppview.cpp ]; then
  cp "$C"/engine_v3/dist/epp_engine.js "$R"/stage_v3/engine/epp_engine.js
  gzip -9n -c "$C"/engine_v3/dist/epp_engine.wasm | base64 -w0 > "$R"/stage_v3/engine/epp_engine.wasm.gz.b64
  echo "stage_v3/engine from cpp/engine_v3/dist"
else echo "cpp/engine_v3/dist is stale or missing: build it (make -f Makefile.web in cpp/engine_v3)"; exit 1; fi
cp -r "$R"/stage_v3/engine "$R"/testsite_v3/
