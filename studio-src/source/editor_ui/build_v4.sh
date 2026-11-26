#!/bin/bash
# Build v4 = stage_v3 (live) + every ui/v4_hooks_*.py layer.
# usage: ui/build_v4.sh [STAGE_DIR] [TESTSITE_DIR] [layers,comma,separated]
#   default: stage_v4 + testsite_v4, all layers. Children use their own dirs (e.g. stage_v4_fb testsite_v4_fb fb).
set -e
H="$(cd "$(dirname "$0")" && pwd)"; R="$(dirname "$H")"
STAGE="${1:-$R/stage_v4}"; SITE="${2:-$R/testsite_v4}"; ONLY="${3:-}"
python3 "$H/patch_studio_v4.py" "$STAGE" "$ONLY"
for f in "$STAGE"/js/*.js; do node --check "$f"; done
rm -rf "$SITE"; mkdir -p "$SITE"; cp -r "$R/testsite_v3/." "$SITE/"; cp -r "$STAGE/." "$SITE/"
echo "testsite: $SITE"
