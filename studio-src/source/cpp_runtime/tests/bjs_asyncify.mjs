import fs from 'fs';
const b = (await import('../binaryen/package/index.js')).default;
const bytes = fs.readFileSync(process.argv[2]);
const m = b.readBinary(bytes); const F = b.Features;
m.setFeatures(F.MutableGlobals | F.NontrappingFPToInt | F.BulkMemory | F.BulkMemoryOpt | F.SignExt | F.ReferenceTypes | F.Multivalue | F.CallIndirectOverlong);
b.setPassArgument('asyncify-imports', 'env.rlw_present,env.rlw_sleep'); b.setOptimizeLevel(1); b.setShrinkLevel(0);
const t0 = Date.now(); m.runPasses(['asyncify']); const out = m.emitBinary();
console.log('asyncify', Date.now() - t0, 'ms', out.length, 'bytes; validate', WebAssembly.validate(out));
fs.writeFileSync(process.argv[3], out);
