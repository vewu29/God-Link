// goparse checks that Go lines and snippets parse, using Go's own parser.
// Usage: goparse items.json — prints a JSON list of {i, err} failures.
//
// An item passes when any shape parses: a whole file, a top-level
// declaration, a statement inside a function, or part of a bigger
// statement (a case, an else branch, a line that opens a block).
package main

import (
	"encoding/json"
	"go/parser"
	"go/token"
	"os"
)

type failure struct {
	I   int    `json:"i"`
	Err string `json:"err"`
}

func shapes(c string) []string {
	body := func(s string) string { return "package p\nfunc _() {\n" + s + "\n}\n" }
	return []string{
		c,
		"package p\n" + c + "\n",
		"package p\n" + c + "\n}\n",
		body(c),
		body(c + "\n}"),
		body("switch {\n" + c + "\n}"),
		body("select {\n" + c + "\n}"),
		body("if x {\n" + c + "\n}"),
		"package p\ntype _ struct {\n" + c + "\n}\n",
	}
}

func main() {
	raw, err := os.ReadFile(os.Args[1])
	if err != nil {
		panic(err)
	}
	var items []string
	if err := json.Unmarshal(raw, &items); err != nil {
		panic(err)
	}
	fails := []failure{}
	for i, c := range items {
		var first error
		for _, src := range shapes(c) {
			_, err := parser.ParseFile(token.NewFileSet(), "line.go", src, parser.SkipObjectResolution)
			if err == nil {
				first = nil
				break
			}
			if first == nil {
				first = err
			}
		}
		if first != nil {
			fails = append(fails, failure{i, first.Error()})
		}
	}
	json.NewEncoder(os.Stdout).Encode(fails)
}
