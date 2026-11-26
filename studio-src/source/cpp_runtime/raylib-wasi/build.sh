#!/bin/bash
# Build raylib 5.5 for wasm32-wasip1 (Web Studio C++ mode). Output: out/libraylib.a + out/include/
set -e
H="$(cd "$(dirname "$0")" && pwd)"
CC=~/workspace/.emsdk/upstream/bin/clang
AR=~/workspace/.emsdk/upstream/bin/llvm-ar
SR=$(dirname "$H")/ysys
mkdir -p "$H/out/obj" "$H/out/include"
FL="--target=wasm32-wasip1 --sysroot=$SR -O2 -DPLATFORM_WASI -DGRAPHICS_API_OPENGL_ES3 -D_WASI_EMULATED_PROCESS_CLOCKS -I$H/include -I$H/src -Wno-everything -ffunction-sections -fdata-sections"
for f in rcore rshapes rtextures rtext rmodels utils; do $CC $FL -c "$H/src/$f.c" -o "$H/out/obj/$f.o" & done
$CC $FL -c "$H/raudio_stub.c" -o "$H/out/obj/raudio_stub.o" &
wait
rm -f "$H/out/libraylib.a"; $AR rcs "$H/out/libraylib.a" "$H"/out/obj/*.o
cp "$H/src/raylib.h" "$H/src/raymath.h" "$H/src/rlgl.h" "$H/src/rcamera.h" "$H/out/include/"
ls -la "$H/out/libraylib.a"
