// How each track's code is built and run for content validation.
// build(dir, code, project) -> { ok, stdout, error }
// parseLine(dir, line) -> error string, or "" when the line parses.
"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", timeout: 60000, input: "", ...opts });
  return { status: r.status, stdout: r.stdout || "", stderr: (r.stderr || "") + (r.error ? String(r.error) : "") };
}
function compileThenRun(dir, file, code, compile, run) {
  fs.writeFileSync(path.join(dir, file), code + "\n");
  const c = sh(compile[0], compile.slice(1), { cwd: dir });
  if (c.status !== 0) return { ok: false, error: c.stderr || c.stdout };
  const r = sh(run[0], run.slice(1), { cwd: dir, timeout: 10000 });
  if (r.status !== 0) return { ok: false, error: `exit ${r.status}: ${r.stderr}` };
  return { ok: true, stdout: r.stdout };
}

module.exports = {
  cpp: {
    needs: ["g++"],
    build: (dir, code) => compileThenRun(dir, "main.cpp", code, ["g++", "-std=c++17", "-Wall", "-o", "app", "main.cpp"], ["./app"]),
  },
  cs: {
    needs: ["dotnet"],
    // One reusable console project: C# 8, no implicit usings, so every
    // `using` the learner sees is one the program genuinely needs.
    setup: (dir) => {
      fs.writeFileSync(path.join(dir, "app.csproj"), `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework><LangVersion>8.0</LangVersion><ImplicitUsings>disable</ImplicitUsings><Nullable>disable</Nullable></PropertyGroup></Project>`);
      sh("dotnet", ["restore", "-v", "q"], { cwd: dir, env: { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1" } });
    },
    build: (dir, code) => compileThenRun(dir, "Program.cs", code, ["dotnet", "build", "--no-restore", "-v", "q", "-nologo", "-o", "out"], ["dotnet", "out/app.dll"]),
  },
};

// ---------- Python ----------
// A line is checked the way it would sit in real code: a header ending
// in ":" gets a body, and elif / else / except / finally get the
// statement they continue.
const PY_CHECK = `
import ast, json, sys
items = json.load(open(sys.argv[1]))
errs = []
for i, code in enumerate(items):
    src = code
    first = code.lstrip().split(" ")[0].rstrip(":")
    if code.rstrip().endswith(":"):
        src = code + "\\n    pass"
    if first == "try":
        src += "\\nexcept Exception:\\n    pass"
    if first in ("elif", "else"):
        src = "if x:\\n    pass\\n" + src
    elif first in ("except", "finally"):
        src = "try:\\n    pass\\n" + src
    elif first in ("return", "yield"):
        src = "def f():\\n" + "\\n".join("    " + l for l in src.split("\\n"))
    try:
        ast.parse(src)
    except SyntaxError as e:
        errs.append({"i": i, "err": f"{e.msg} (line {e.lineno})"})
print(json.dumps(errs))
`;
module.exports.python = {
  needs: ["python3"],
  build: (dir, code) => {
    fs.writeFileSync(path.join(dir, "main.py"), code + "\n");
    const r = sh("python3", ["-I", "main.py"], { cwd: dir, timeout: 10000 });
    return r.status === 0 ? { ok: true, stdout: r.stdout } : { ok: false, error: r.stderr };
  },
  checkLines: (dir, lines) => {
    fs.writeFileSync(path.join(dir, "lines.json"), JSON.stringify(lines));
    fs.writeFileSync(path.join(dir, "check_lines.py"), PY_CHECK);
    const r = sh("python3", ["-I", "check_lines.py", "lines.json"], { cwd: dir });
    if (r.status !== 0) return [{ i: 0, err: r.stderr }];
    return JSON.parse(r.stdout);
  },
  // Whole examples must parse; chapter and shelf examples are complete
  // programs and must also run without an error (in a scratch folder).
  checkExamples: (dir, examples) => {
    const errs = [];
    const lines = module.exports.python.checkLines(dir, examples.map((e) => e.code));
    lines.forEach((e) => errs.push(e));
    examples.forEach((ex, i) => {
      if (!ex.run || errs.some((e) => e.i === i)) return;
      const run = path.join(dir, "ex" + i);
      fs.mkdirSync(run, { recursive: true });
      fs.writeFileSync(path.join(run, "example.py"), ex.code + "\n");
      const r = sh("python3", ["-I", "example.py"], { cwd: run, timeout: 10000 });
      if (r.status !== 0) errs.push({ i, err: r.stderr || `exit ${r.status}` });
    });
    return errs;
  },
};

// ---------- JavaScript ----------
// Programs and examples run as ES modules in Node (so import and
// top-level await work); lines are parsed with acorn as modern modules.
function acornErrors(items, opts) {
  const acorn = require("acorn");
  const errs = [];
  items.forEach((code, i) => {
    try {
      acorn.parse(code, { ecmaVersion: "latest", sourceType: "module", allowAwaitOutsideFunction: true, allowReturnOutsideFunction: true, ...opts });
    } catch (e) { errs.push({ i, err: e.message }); }
  });
  return errs;
}
module.exports.javascript = {
  needs: ["node"],
  build: (dir, code) => {
    fs.writeFileSync(path.join(dir, "main.mjs"), code + "\n");
    const r = sh("node", ["main.mjs"], { cwd: dir, timeout: 10000 });
    return r.status === 0 ? { ok: true, stdout: r.stdout } : { ok: false, error: r.stderr };
  },
  checkLines: (dir, lines) => acornErrors(lines),
  checkExamples: (dir, examples) => {
    const errs = acornErrors(examples.map((e) => e.code));
    examples.forEach((ex, i) => {
      if (!ex.run || errs.some((e) => e.i === i)) return;
      const run = path.join(dir, "ex" + i);
      fs.mkdirSync(run, { recursive: true });
      fs.writeFileSync(path.join(run, "example.mjs"), ex.code + "\n");
      const r = sh("node", ["example.mjs"], { cwd: run, timeout: 10000 });
      if (r.status !== 0) errs.push({ i, err: r.stderr || `exit ${r.status}` });
    });
    return errs;
  },
};

// ---------- C# syntax (shared by the C# and Unity tracks) ----------
// Builds the Roslyn checker in tests/content/csparse once per run.
let csparseDll = null;
function csSyntaxErrors(dir, items) {
  if (!csparseDll) {
    const out = path.join(require("os").tmpdir(), "cb-csparse");
    const b = sh("dotnet", ["build", path.join(__dirname, "csparse"), "-v", "q", "-nologo", "-o", out], { timeout: 300000, env: { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1" } });
    if (b.status !== 0) return [{ i: 0, err: "csparse did not build: " + b.stdout + b.stderr }];
    csparseDll = path.join(out, "csparse.dll");
  }
  fs.writeFileSync(path.join(dir, "lines.json"), JSON.stringify(items));
  const r = sh("dotnet", [csparseDll, path.join(dir, "lines.json")], { timeout: 120000 });
  if (r.status !== 0) return [{ i: 0, err: r.stderr }];
  return JSON.parse(r.stdout);
}
module.exports.csSyntaxErrors = csSyntaxErrors;
module.exports.cs.checkLines = csSyntaxErrors;
module.exports.cs.checkExamples = (dir, examples) => csSyntaxErrors(dir, examples.map((e) => e.code));

// ---------- Unity (C# against the stand-in engine in stubs/unity) ----------
// A practice script is compiled with UnityEngine.cs and a tiny Main built
// from the project's harness (which objects exist, how many frames play),
// then run; its Debug.Log lines must equal the app's screen. Library
// examples are whole scripts and must compile against the same API.
const UNITY_STUBS = path.join(__dirname, "stubs", "unity", "UnityEngine.cs");
function unityProject(dir, files) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "game.csproj"), `<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework><LangVersion>9.0</LangVersion><ImplicitUsings>disable</ImplicitUsings><Nullable>disable</Nullable><NoWarn>CS0414;CS0169;CS0649;CS0618;CS8321</NoWarn><EnableDefaultCompileItems>false</EnableDefaultCompileItems></PropertyGroup><ItemGroup><Compile Include="${UNITY_STUBS}" />${files.map((f) => `<Compile Include="${f}" />`).join("")}</ItemGroup></Project>`);
}
const DOTNET_ENV = { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1" };
module.exports.unity = {
  needs: ["dotnet"],
  setup: (dir) => {
    unityProject(dir, ["Script.cs", "Harness.cs"]);
    fs.writeFileSync(path.join(dir, "Script.cs"), "");
    fs.writeFileSync(path.join(dir, "Harness.cs"), "static class Harness { static void Main() { } }");
    sh("dotnet", ["restore", "-v", "q"], { cwd: dir, env: DOTNET_ENV, timeout: 300000 });
  },
  build: (dir, code, project, c) => {
    fs.writeFileSync(path.join(dir, "Harness.cs"), "using UnityEngine;\nusing System.Collections.Generic;\nstatic class Harness {\n  static void Main() {\n" + (c.harness || "") + "\n  }\n}\n");
    return compileThenRun(dir, "Script.cs", code, ["dotnet", "build", "--no-restore", "-v", "q", "-nologo", "-o", "out"], ["dotnet", "out/game.dll"]);
  },
  checkLines: (dir, lines) => csSyntaxErrors(dir, lines),
  checkExamples: (dir, examples) => {
    const errs = csSyntaxErrors(dir, examples.map((e) => e.code));
    const whole = examples.map((e, i) => ({ e, i })).filter(({ e, i }) => e.run && !errs.some((x) => x.i === i));
    const exDir = path.join(dir, "examples");
    const files = whole.map(({ i }) => `Ex${i}.cs`);
    unityProject(exDir, files);
    whole.forEach(({ e, i }) => fs.writeFileSync(path.join(exDir, `Ex${i}.cs`), `namespace Ex${i} {\n${e.code}\n}\n`));
    fs.appendFileSync(path.join(exDir, `Ex${whole[0].i}.cs`), "\nstatic class __Main { static void Main() { } }\n");
    const b = sh("dotnet", ["build", "-v", "q", "-nologo", "-o", "out"], { cwd: exDir, env: DOTNET_ENV, timeout: 600000 });
    if (b.status !== 0) {
      const lines = (b.stdout + b.stderr).split("\n").filter((l) => /error CS/.test(l));
      whole.forEach(({ i }) => {
        const mine = lines.filter((l) => l.includes(`Ex${i}.cs(`));
        if (mine.length) errs.push({ i, err: mine[0].replace(/^.*Ex\d+\.cs/, "").slice(0, 220) });
      });
      if (!errs.length) errs.push({ i: whole[0].i, err: lines[0] || b.stdout.slice(-400) });
    }
    return errs;
  },
};
