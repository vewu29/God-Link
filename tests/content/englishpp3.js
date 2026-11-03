// English++ three-words-a-line checker for the content checks.
//
// The English++ Book (for English++ Studio 3) teaches one main form:
// every line has exactly three words, who · the root · what. The Sandbox
// drills use that form, while the Library, PC and Vault still use the
// sentence form that englishpp.js reads. This file checks a drill line
// the way the book's Chapter 4 ("The Three Words") describes the Studio
// reading one:
//   · spaces split a line into words, except inside quote marks;
//   · a line has exactly three words;
//   · the middle word is a root from the book's Whole Chart (or is);
//   · C++ marks never appear outside text: ; ( ) [ ] { } , and :
//     (the one dot allowed is the point inside a number).
//
//   looksThreeWord(line) → true when the line is written in this form
//   check(line)          → "" or the first problem
"use strict";

// Every root in the book's Whole Chart (Chapter 43), plus is.
const ROOTS = new Set((
  "is " +
  "add adv amd aml and ant aor apw asb asl asr axr bbl bch bcs bdf bdo blk bsw btr bts " +
  "cav cct cde cfr cft chm chs cky cla cme cmn cmp cmx cpd cps cra crv csm cso ctx cvl " +
  "dal dbs dcl dds den dfd dfm dfn dfy dgr dhd dkn dlm dmb dmk dop dov dpm dsc dsf dsh dst dtp dun dvr " +
  "ebk edl enx ert etw ext fea fge fgt fle flt fne fpr get gln hap hcp hex hln hls hmk hmv hrd hrm hsz hwr " +
  "ieq iff ige igt ile ilt ine kda kdy kel khr kmi kmo kms kse ktm kwk kyr " +
  "ldx lfl lin lpf lpl lrm lrs lrv lso lsu luq lwp mak mfi mfo mgl mkn mlo mmv mnw mpt mrf msh msy mtd mwn " +
  "nab nac nas nat nco ncr ndn nep nfc ngd nhi nhy nkb nlg nlx nmn nmu nmx npe npi npw nra nro nrz nsn nsq ntn nup nwh " +
  "oeq oge ogt ole olt one oth prn put rcm rdt rjn rsd rwt seq sge sgt sle slt sne " +
  "tbg tcu tdc ted tfx ths tlc tln tma tmt tnm tpa tps trp trv trx tsp tsz ttc tti tuc twd " +
  "ueq uge ugt ule ult une weq wfv wge wgt wle wln wlt wne xag xcd xcm xev xgl xic xim xlb xpp xus xwb"
).split(/\s+/));

// Split on spaces outside quote marks. Returns null for an unclosed quote.
function words(line) {
  const out = [];
  let cur = "", inText = false;
  for (const ch of line) {
    if (ch === '"') { inText = !inText; cur += ch; continue; }
    if (ch === " " && !inText) { if (cur) out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  if (inText) return null;
  if (cur) out.push(cur);
  return out;
}

function looksThreeWord(line) {
  const w = words(line.trim());
  return !!w && w.length === 3 && ROOTS.has(w[1]);
}

const MARKS = { ";": "semicolons", "(": "round brackets", ")": "round brackets", "[": "square brackets", "]": "square brackets",
  "{": "curly brackets", "}": "curly brackets", ",": "commas", ":": "colons" };

function check(line) {
  if (line !== line.trim()) return "A drill line has no spaces at its start or end.";
  const w = words(line);
  if (!w) return "A quote mark is never closed.";
  if (w.length !== 3) return `This line has ${w.length} words. Every line has exactly 3: who, the root, and what.`;
  if (!ROOTS.has(w[1])) return `“${w[1]}” is not a root in the Whole Chart.`;
  for (const word of w) {
    const bare = word.replace(/"[^"]*"/g, "");
    for (const ch of bare) if (MARKS[ch]) return `English++ has no ${MARKS[ch]}.`;
    if (/\.(?!\d)|(?<!\d)\./.test(bare)) return "The one dot English++ allows is the point inside a number.";
  }
  return "";
}

module.exports = { looksThreeWord, check, ROOTS };
