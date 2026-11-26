#!/usr/bin/env python3
"""Pack the C++ mode downloads for the Web Studio (text-only repo: gzip -> base64 chunks <= 4,000,000 bytes).
  raylib-cpp.pack : raylib 5.5 headers + libraylib.a (Studio WASI platform) + no-exceptions libc++/libc++abi + gl.syms
  binaryen.js     : binaryen.js 132.0.0 (Apache-2.0) for the in-browser Asyncify pass
Usage: python3 tools/pack_cpp.py <out_dir>   (run from cpp/)"""
import gzip, base64, json, hashlib, os, sys, re, struct
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
CH = 4_000_000
def emit(name, data):
    gz = gzip.compress(data, 9, mtime=0); b = base64.b64encode(gz)
    n = (len(b) + CH - 1) // CH
    for f in os.listdir(OUT):
        if f.startswith(name + '.gz.b64.'): os.remove(os.path.join(OUT, f))
    for i in range(n): open(f'{OUT}/{name}.gz.b64.{i:03d}', 'wb').write(b[i*CH:(i+1)*CH])
    return {'bytes': len(data), 'gz': len(gz), 'b64': len(b), 'b64_chunks': n, 'sha256': hashlib.sha256(data).hexdigest()[:16]}
# raylib pack: [u32 header length][header json][file bytes...]
files = []
for h in ['raylib.h', 'raymath.h', 'rlgl.h', 'rcamera.h']: files.append(('include/' + h, open('raylib-wasi/out/include/' + h, 'rb').read()))
files.append(('lib/libraylib.a', open('raylib-wasi/out/libraylib.a', 'rb').read()))
files.append(('lib/libc++.a', open('noeh/lib/wasm32-wasip1/libc++.a', 'rb').read()))
files.append(('lib/libc++abi.a', open('noeh/lib/wasm32-wasip1/libc++abi.a', 'rb').read()))
gl = sorted(set(re.findall(r'GL_APIENTRY (gl\w+)', open('raylib-wasi/include/GLES3/gl3.h').read())) | {'glDrawBuffersEXT'})
files.append(('lib/gl.syms', ('\n'.join(gl) + '\n').encode()))
hdr = json.dumps({'version': 'raylib 5.5 / Web Studio WASI platform r1', 'files': [[p, len(d)] for p, d in files]}).encode()
pack = struct.pack('<I', len(hdr)) + hdr + b''.join(d for _, d in files)
man = {'raylib-cpp.pack': emit('raylib-cpp.pack', pack),
       'binaryen.js': emit('binaryen.js', open('binaryen/package/index.js', 'rb').read())}
man['_about'] = {'raylib': 'raylib 5.5 (zlib) built for wasm32-wasip1 with cpp/raylib-wasi (platform rcore_wasi.c); libc++/libc++abi without exceptions from @yowasp/clang 22.0.0-git20695-13',
                 'binaryen.js': 'binaryen 132.0.0 (Apache-2.0) npm package index.js, unmodified'}
json.dump(man, open(f'{OUT}/manifest.json', 'w'), indent=1)
print(json.dumps(man, indent=1))
