//! rsparse checks that Rust lines and snippets parse, using the syn parser.
//! Usage: rsparse items.txt — items are separated by NUL bytes; prints one
//! "index<TAB>error" line per item that fails.
//!
//! An item passes when any shape parses: a whole file, statements in a
//! block, or a piece of something bigger (an else branch, a match arm, an
//! impl or trait item, a struct field, an enum variant, a line that opens
//! a block).
use std::{env, fs};

fn parses(c: &str) -> Result<(), String> {
    let files = [
        c.to_string(),
        format!("{c}\n}}"),
        format!("impl X {{\n{c}\n}}"),
        format!("impl X {{\n{c}\n}}\n}}"),
        format!("trait X {{\n{c}\n}}"),
        format!("struct X {{\n{c}\n}}"),
        format!("enum X {{\n{c}\n}}"),
    ];
    let blocks = [
        format!("{{\n{c}\n}}"),
        format!("{{\n{c}\n}}\n}}"),
        format!("{{\nif x {{\n{c}\n}}\n}}"),
        format!("{{\nmatch x {{\n{c}\n}}\n}}"),
    ];
    let mut first = None;
    for src in &files {
        match syn::parse_file(src) {
            Ok(_) => return Ok(()),
            Err(e) => first = first.or(Some(e.to_string())),
        }
    }
    for src in &blocks {
        if syn::parse_str::<syn::Block>(src).is_ok() {
            return Ok(());
        }
    }
    Err(first.unwrap_or_default())
}

fn main() {
    let path = env::args().nth(1).expect("usage: rsparse items.txt");
    let text = fs::read_to_string(path).expect("cannot read items");
    for (i, item) in text.split('\0').enumerate() {
        if let Err(e) = parses(item) {
            println!("{i}\t{}", e.replace('\n', " "));
        }
    }
}
