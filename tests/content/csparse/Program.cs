// Reads a JSON array of C# snippets and prints a JSON array of the ones
// that do not parse. Each snippet is tried the ways a line can sit in a
// real file — as a statement inside a method, as a member inside a
// class, or as a whole file — and passes if any of them parses cleanly.
// Only syntax is checked: names the snippet uses need not exist.
using System.Text.Json;
using Microsoft.CodeAnalysis.CSharp;

var items = JsonSerializer.Deserialize<string[]>(File.ReadAllText(args[0]));
var parse = new CSharpParseOptions(LanguageVersion.Latest);
var errors = new List<object>();
for (int i = 0; i < items.Length; i++)
{
    var code = items[i];
    string[] shapes =
    {
        "class __C { async void __M() {\n" + code + "\n} }",
        "class __C {\n" + code + "\n}",
        code,
        "class __C { void __M() { switch (x) {\n" + code + "\n} } }",
        "class __C {\n" + code + "\n{ } }",
        "class __C { void __M() {\n" + code + "\n{ }\n} }",
        "class __C { void __M() { try { }\n" + code + "\n{ } } }",
        "class __C { void __M() { if (x) { }\n" + code + "\n{ } } }",
    };
    string first = null;
    bool ok = false;
    foreach (var s in shapes)
    {
        var diags = CSharpSyntaxTree.ParseText(s, parse).GetDiagnostics().Where(d => d.Severity == Microsoft.CodeAnalysis.DiagnosticSeverity.Error).ToList();
        if (diags.Count == 0) { ok = true; break; }
        first ??= diags[0].GetMessage();
    }
    if (!ok) errors.Add(new { i, err = first });
}
Console.WriteLine(JsonSerializer.Serialize(errors));
