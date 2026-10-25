# Checks that Ruby lines and snippets parse, using Ruby's own compiler
# (nothing is run). Usage: ruby rbparse.rb items.json -- prints a JSON
# list of {i, err} failures.
#
# An item passes when any shape compiles: the code alone, inside a
# method, a class, a block, or as part of a bigger statement (an elsif,
# a when, a rescue, a line that opens a block).
require "json"

SHAPES = [
  ->(c) { c },
  ->(c) { "#{c}\nend" },
  ->(c) { "#{c}\nend\nend" },
  ->(c) { "def __f\n#{c}\nend" },
  ->(c) { "class C__\n#{c}\nend" },
  ->(c) { "class C__\n#{c}\nend\nend" },
  ->(c) { "loop do\n#{c}\nend" },
  ->(c) { "if x\n#{c}\nend" },
  ->(c) { "case x\n#{c}\nend" },
  ->(c) { "begin\n#{c}\nend" },
].freeze

$VERBOSE = nil
items = JSON.parse(File.read(ARGV[0]))
fails = []
items.each_with_index do |code, i|
  first = nil
  ok = SHAPES.any? do |shape|
    RubyVM::InstructionSequence.compile(shape.call(code))
    true
  rescue SyntaxError => e
    first ||= e.message.lines.first.to_s.strip
    false
  end
  fails << { i: i, err: first } unless ok
end
puts JSON.generate(fails)
