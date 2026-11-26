// post.js — the Module functions the Web Studio page calls (ENGINE_API.md).
Module['version'] = 'English++ Web Studio engine 1.1 debugger (Nov 26, 2026)';
Module['check'] = function (src) { return JSON.parse(Module.ccall('epp_check', 'string', ['string'], [String(src)])); };
Module['cpp'] = function (src) { return Module.ccall('epp_cpp', 'string', ['string'], [String(src)]); };
Module['run'] = async function (src) {
  if (Module.__eppRunning) throw new Error('A program is already running. Stop it first.');
  Module.__eppRunning = true; Module.__eppStop = false; Module.__eppLastFrame = 0;
  try {
    var r = await Module.ccall('epp_run', 'string', ['string'], [String(src)], { async: true });
    return JSON.parse(r);
  } finally { Module.__eppRunning = false; }
};
Module['stop'] = function () { Module.__eppStop = true; if (Module.__eppDbgWake) { var w = Module.__eppDbgWake; Module.__eppDbgWake = null; w('stop'); } };
// ---- v4 debugger (ENGINE_API_V4.md) ----
function eppBpSpec(list) { return (list || []).map(function (b) { return String(b.file || '') + '\t' + (b.line | 0); }).join('\n'); }
Module['setBreakpoints'] = function (list) { Module.ccall('epp_dbg_breakpoints', null, ['string'], [eppBpSpec(list)]); };
Module['debugFrame'] = function (k) { return JSON.parse(Module.ccall('epp_dbg_frame', 'string', ['number'], [k | 0])); };
Module['debug'] = async function (src, opts) {
  opts = opts || {};
  if (Module.__eppRunning) throw new Error('A program is already running. Stop it first.');
  Module['setBreakpoints'](opts.breakpoints || []);
  Module.__eppDbgPause = function (info) {
    return new Promise(function (res) {
      Module.__eppDbgWake = res;
      Promise.resolve(opts.onPause ? opts.onPause(info) : 'continue').then(function (a) { if (Module.__eppDbgWake === res) { Module.__eppDbgWake = null; res(a); } }, function () { res('stop'); });
    });
  };
  Module.ccall('epp_dbg_attach', null, ['number', 'number'], [1, opts.pauseAtStart ? 1 : 0]);
  try { return await Module['run'](src); }
  finally { Module.__eppDbgPause = null; Module.__eppDbgWake = null; Module.ccall('epp_dbg_attach', null, ['number', 'number'], [0, 0]); }
};
Module['fsWrite'] = function (p, t) { Module.ccall('epp_fs_write', null, ['string', 'string'], [String(p), String(t)]); };
Module['fsRead'] = function (p) { var ptr = Module.ccall('epp_fs_read', 'number', ['string'], [String(p)]); return ptr ? UTF8ToString(ptr) : null; };
Module['fsList'] = function () { return JSON.parse(Module.ccall('epp_fs_list', 'string', [], [])); };
Module['fsRemove'] = function (p) { Module.ccall('epp_fs_remove', null, ['string'], [String(p)]); };
