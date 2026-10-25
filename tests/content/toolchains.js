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

// ---------- Unreal (C++ against the stand-in API in stubs/unreal) ----------
// Code is shown as one listing with "// Name.h" and "// Name.cpp"
// markers; the test splits it into those files, points Unreal's real
// include paths (CoreMinimal.h, GameFramework/Actor.h, …) at the stand-in,
// compiles with g++ in C++20 and plays the harness: spawn, BeginPlay,
// N frames of Tick, timers and overlaps. UE_LOG lines must match the app.
const { tsErrors } = require("./treesitter");
const UNREAL_STUBS = path.join(__dirname, "stubs", "unreal");
const UE_HEADERS = ["CoreMinimal.h", "GameFramework/Actor.h", "GameFramework/Pawn.h", "GameFramework/Character.h", "GameFramework/GameModeBase.h",
  "GameFramework/PlayerController.h", "GameFramework/CharacterMovementComponent.h", "GameFramework/SpringArmComponent.h", "Camera/CameraComponent.h",
  "Components/ActorComponent.h", "Components/SceneComponent.h", "Components/StaticMeshComponent.h", "Components/BoxComponent.h",
  "Components/SphereComponent.h", "Components/CapsuleComponent.h", "Components/PrimitiveComponent.h", "Components/AudioComponent.h",
  "Components/TextRenderComponent.h", "Components/TextBlock.h", "Components/ProgressBar.h", "Engine/Engine.h", "Engine/World.h",
  "Engine/DataAsset.h", "Engine/StaticMesh.h", "Kismet/GameplayStatics.h", "TimerManager.h", "EnhancedInputComponent.h",
  "EnhancedInputSubsystems.h", "InputActionValue.h", "InputAction.h", "Blueprint/UserWidget.h", "Sound/SoundBase.h", "Math/UnrealMathUtility.h"];
function unrealTree(dir) {
  const inc = path.join(dir, "inc");
  UE_HEADERS.forEach((h) => { const f = path.join(inc, h); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, '#pragma once\n#include "UnrealStub.h"\n'); });
  return inc;
}
function splitUnreal(code) {
  const files = {};
  let cur = null;
  code.split("\n").forEach((line) => {
    const m = line.match(/^\/\/ (\w+\.(?:h|cpp))$/);
    if (m) { cur = m[1]; files[cur] = []; return; }
    if (cur) files[cur].push(line);
  });
  return Object.fromEntries(Object.entries(files).map(([k, v]) => [k, v.join("\n").trim() + "\n"]));
}
function writeUnreal(dir, code) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const files = splitUnreal(code);
  for (const [name, text] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), text);
    for (const m of text.matchAll(/#include "(\w+)\.generated\.h"/g)) fs.writeFileSync(path.join(dir, m[1] + ".generated.h"), "#pragma once\n");
  }
  return files;
}
function gxx(dir, inc, extra) {
  const cpps = fs.readdirSync(dir).filter((f) => f.endsWith(".cpp"));
  return sh("g++", ["-std=c++20", "-w", "-I", inc, "-I", UNREAL_STUBS, "-I", ".", ...extra, ...cpps], { cwd: dir, timeout: 120000 });
}
const UE_MACROS = /\b(UPROPERTY|UFUNCTION|UCLASS|USTRUCT|UENUM|UMETA|UINTERFACE|GENERATED_BODY)\s*\((?:[^()]|\([^()]*\))*\)/g;
function ueLineShapes(c) {
  return [c, `void __f() {\n${c}\n}`, `class __C {\npublic:\n${c}\n};`, `${c}\n{ }`, `${c}\n{ };`, `class __C {\npublic:\n${c}\n{ }\n};`, `void __f() {\n${c}\n{ }\n}`];
}
module.exports.unreal = {
  needs: ["g++"],
  build: (dir, code, project, c) => {
    const work = path.join(dir, "build");
    const files = writeUnreal(work, code);
    const inc = unrealTree(work);
    const headers = Object.keys(files).filter((f) => f.endsWith(".h"));
    fs.writeFileSync(path.join(work, "harness_main.cpp"), headers.map((h) => `#include "${h}"`).join("\n") + "\nint main() {\n  using namespace UEStub;\n" + (c.harness || "") + "\n  return 0;\n}\n");
    const b = gxx(work, inc, ["-o", "app"]);
    if (b.status !== 0) return { ok: false, error: b.stderr };
    const r = sh("./app", [], { cwd: work, timeout: 10000 });
    return r.status === 0 ? { ok: true, stdout: r.stdout } : { ok: false, error: `exit ${r.status}: ${r.stderr}` };
  },
  checkLines: (dir, lines) => tsErrors("cpp", lines, ueLineShapes, (c) => c.replace(UE_MACROS, "")),
  // Whole examples (with file markers) must compile against the stand-in;
  // snippets are parsed.
  checkExamples: async (dir, examples) => {
    const errs = await tsErrors("cpp", examples.map((e) => (/^\/\/ \w+\.(h|cpp)$/m.test(e.code) ? "" : e.code)), ueLineShapes, (c) => c.replace(UE_MACROS, ""));
    examples.forEach((ex, i) => {
      if (!/^\/\/ \w+\.(h|cpp)$/m.test(ex.code)) return;
      const work = path.join(dir, "ex" + i);
      writeUnreal(work, ex.code);
      const inc = unrealTree(work);
      const b = gxx(work, inc, ["-fsyntax-only"]);
      if (b.status !== 0) errs.push({ i, err: b.stderr.split("\n").filter((l) => /error/.test(l)).slice(0, 2).join(" | ") });
    });
    return errs;
  },
};

// ---------- Java ----------
// Programs and examples run with the single-file source launcher
// (java Main.java), printing UTF-8; lines are parsed by tree-sitter.
const JAVA_RUN = ["-Dstdout.encoding=UTF-8", "-Dfile.encoding=UTF-8", "-Xshare:auto", "Main.java"];
function javaShapes(c) {
  return [c, `class __C {\n${c}\n}`, `class __C { void __m() throws Exception {\n${c}\n} }`, `class __C { void __m() {\n${c}\n{ }\n} }`, `class __C {\n${c}\n{ }\n}`, `${c}\n{ }`,
    `class __C { void __m() { switch (x) {\n${c}\n} } }`, `class __C { void __m() { try { }\n${c}\n} }`];
}
function javaRun(dir, code) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "Main.java"), code + "\n");
  const r = sh("java", JAVA_RUN, { cwd: dir, timeout: 60000 });
  return r.status === 0 ? { ok: true, stdout: r.stdout } : { ok: false, error: r.stderr.replace(/^Picked up JAVA_TOOL_OPTIONS.*\n/m, "") };
}
module.exports.java = {
  needs: ["java"],
  build: (dir, code) => javaRun(path.join(dir, "run"), code),
  checkLines: (dir, lines) => tsErrors("java", lines, javaShapes),
  checkExamples: async (dir, examples) => {
    const errs = await tsErrors("java", examples.map((e) => e.code), javaShapes);
    examples.forEach((ex, i) => {
      if (!ex.run || errs.some((e) => e.i === i)) return;
      const r = javaRun(path.join(dir, "ex" + i), ex.code);
      if (!r.ok) errs.push({ i, err: r.error });
    });
    return errs;
  },
};
