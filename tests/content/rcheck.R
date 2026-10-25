# Checks that R lines and snippets parse, using R's own parser:
# parse() reads code without running it.
# Usage: Rscript rcheck.R items.txt -- items are separated by NUL bytes;
# prints one "index<TAB>error" line per item that fails.
#
# An item passes when any shape parses: the code alone, closing a block
# it opens, inside an if (for "} else {" lines), or inside a function.
shapes <- list(
  function(code) code,
  function(code) paste0(code, "\n}"),
  function(code) paste0("if (TRUE) {\n", code, "\n}"),
  function(code) paste0("f <- function() {\n", code, "\n}")
)
path <- commandArgs(trailingOnly = TRUE)[1]
bytes <- readBin(path, "raw", file.info(path)$size)
ends <- c(which(bytes == as.raw(0)), length(bytes) + 1)
start <- 1
for (i in seq_along(ends)) {
  stop_at <- ends[i] - 1
  code <- if (stop_at >= start) rawToChar(bytes[start:stop_at]) else ""
  Encoding(code) <- "UTF-8"
  first <- NULL
  ok <- FALSE
  for (shape in shapes) {
    err <- tryCatch({ parse(text = shape(code), keep.source = FALSE); NULL }, error = function(e) conditionMessage(e))
    if (is.null(err)) { ok <- TRUE; break }
    if (is.null(first)) first <- err
  }
  if (!ok) cat(i - 1, "\t", gsub("\n", " ", first), "\n", sep = "")
  start <- ends[i] + 1
}
