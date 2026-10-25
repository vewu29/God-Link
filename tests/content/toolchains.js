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
