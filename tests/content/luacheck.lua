-- Checks that Lua lines and snippets compile, using Lua's own compiler:
-- load() compiles a chunk without running it.
-- Usage: lua luacheck.lua items.txt -- items are separated by NUL bytes;
-- prints one "index<TAB>error" line per item that fails.
--
-- An item passes when any shape compiles: the code alone, inside a
-- function, a loop, an if or a table, or as part of a bigger statement.
local shapes = {
  function(c) return c end,
  function(c) return c .. "\nend" end,
  function(c) return "local function f__()\n" .. c .. "\nend" end,
  function(c) return "local function f__()\n" .. c .. "\nend\nend" end,
  function(c) return "if x then\n" .. c .. "\nend" end,
  function(c) return "for i = 1, 2 do\n" .. c .. "\n::continue::\nend" end,
  function(c) return "local t = {\n" .. c .. "\n}" end,
  function(c) return "repeat\n" .. c end,
}

local f = assert(io.open(arg[1], "rb"))
local text = f:read("a")
f:close()

local i, start = 0, 1
while start <= #text + 1 do
  local stop = string.find(text, "\0", start, true) or (#text + 1)
  local code = string.sub(text, start, stop - 1)
  local first
  local ok = false
  for _, shape in ipairs(shapes) do
    local chunk, err = load(shape(code), "=line")
    if chunk then
      ok = true
      break
    end
    first = first or err
  end
  if not ok then
    print(i .. "\t" .. tostring(first))
  end
  i = i + 1
  start = stop + 1
end
