"use strict";
/* ================= SQL — a Code Block track =================
   Written fresh for Code Block in plain words. Facts and syntax follow
   the SQLite documentation (sqlite.org/lang.html, SQLite 3.45), with
   notes where PostgreSQL and MySQL differ. Every PC project and library
   example is run by the real sqlite3 shell in tests/content, and a
   project's output must match the app exactly. Every drill and Vault
   line is compiled by SQLite against a shared game database, so table
   and column names are checked as well as grammar. */
cbRegisterTrack("sql", function () {
  function src(lines) { return lines.join("\n"); }

  var blocks = [
    { name: "Hello Block", short: "SELECT", chapter: "SQL Ch. 1 · What Is a Database?", icon: "i-say", verb: "ask",
      line: "SELECT 'Hello, world!';",
      explain: "SELECT asks the database for an answer. Text goes in single quotes, and a semicolon ends every statement." },
    { name: "Create Table Block", short: "CREATE", chapter: "SQL Ch. 2 · Tables and Types", icon: "i-grid", verb: "build",
      line: "CREATE TABLE players (id INTEGER PRIMARY KEY, name TEXT, score INTEGER);",
      explain: "A table is a grid: each column has a name and a type, each row is one record. id INTEGER PRIMARY KEY numbers every row for you." },
    { name: "Insert Block", short: "INSERT", chapter: "SQL Ch. 3 · Adding Rows", icon: "i-plus-square", verb: "add",
      line: "INSERT INTO players (name, score) VALUES ('Ana', 120);",
      explain: "INSERT adds a row. List the columns, then the VALUES in the same order. Columns you leave out get their default, often NULL." },
    { name: "Insert Many Block", short: "VALUES ( ), ( )", chapter: "SQL Ch. 3 · Adding Rows", icon: "i-rows", verb: "stack",
      line: "INSERT INTO players (name, score) VALUES ('Leo', 95), ('Mia', 80);",
      explain: "One INSERT can add many rows: separate each bracketed group with a comma." },
    { name: "Select All Block", short: "SELECT *", chapter: "SQL Ch. 4 · Reading Data", icon: "i-eye", verb: "show",
      line: "SELECT * FROM players;",
      explain: "* means every column. FROM names the table. The answer comes back as a little table of its own." },
    { name: "Columns Block", short: "SELECT a, b", chapter: "SQL Ch. 4 · Reading Data", icon: "i-column", verb: "pick",
      line: "SELECT name, score FROM players;",
      explain: "Name the columns you want, in the order you want them. Asking for less makes answers clearer and faster." },
    { name: "Where Block", short: "WHERE", chapter: "SQL Ch. 5 · Filtering with WHERE", icon: "i-funnel", verb: "filter",
      line: "SELECT name FROM players WHERE score > 100;",
      explain: "WHERE keeps only the rows that pass a test. Comparisons are = (just one equals sign), <> or !=, <, >, <= and >=." },
    { name: "And Block", short: "AND", chapter: "SQL Ch. 5 · Filtering with WHERE", icon: "i-fork", verb: "combine",
      line: "SELECT name FROM players WHERE team = 'red' AND level >= 3;",
      explain: "AND needs both tests to pass; OR needs either one. Use brackets when you mix them, so the meaning is clear." },
    { name: "Like Block", short: "LIKE", chapter: "SQL Ch. 5 · Filtering with WHERE", icon: "i-search", verb: "match",
      line: "SELECT name FROM players WHERE name LIKE 'A%';",
      explain: "LIKE matches a pattern: % stands for any run of letters, _ for exactly one. 'A%' means “starts with A.”" },
    { name: "Order Block", short: "ORDER BY", chapter: "SQL Ch. 6 · Sorting and Limiting", icon: "i-list", verb: "sort",
      line: "SELECT name, score FROM players ORDER BY score DESC;",
      explain: "ORDER BY sorts the answer. ASC is smallest first (the default); DESC is biggest first." },
    { name: "Limit Block", short: "LIMIT", chapter: "SQL Ch. 6 · Sorting and Limiting", icon: "i-stop", verb: "trim",
      line: "SELECT name FROM players ORDER BY score DESC LIMIT 3;",
      explain: "LIMIT keeps only the first few rows — with ORDER BY, that's a top-three list." },
    { name: "Alias Block", short: "AS", chapter: "SQL Ch. 7 · Calculations and Functions", icon: "i-tag", verb: "rename",
      line: "SELECT name, score * 2 AS doubled FROM players;",
      explain: "SELECT can calculate. AS gives the new column a name, which becomes its heading." },
    { name: "Function Block", short: "UPPER()", chapter: "SQL Ch. 7 · Calculations and Functions", icon: "i-calc", verb: "transform",
      line: "SELECT UPPER(name), LENGTH(name) FROM players;",
      explain: "Functions work on each row's value: UPPER makes capitals, LENGTH counts letters, ROUND rounds, SUBSTR cuts out part of the text." },
    { name: "Update Block", short: "UPDATE", chapter: "SQL Ch. 8 · Changing Data", icon: "i-pencil", verb: "change",
      line: "UPDATE players SET score = score + 10 WHERE name = 'Ana';",
      explain: "UPDATE changes rows that already exist. SET says what changes; WHERE says which rows. Without WHERE, every row changes!" },
    { name: "Delete Block", short: "DELETE", chapter: "SQL Ch. 8 · Changing Data", icon: "i-x", verb: "remove",
      line: "DELETE FROM players WHERE hp = 0;",
      explain: "DELETE removes the rows that match WHERE. Run the same WHERE with SELECT first to see exactly what will go." },
    { name: "Is Null Block", short: "IS NULL", chapter: "SQL Ch. 9 · NULL: The Missing Value", icon: "i-gap", verb: "find gaps",
      line: "SELECT name FROM players WHERE team IS NULL;",
      explain: "NULL means “unknown” or “missing.” Nothing equals NULL — not even NULL — so test for it with IS NULL or IS NOT NULL." },
    { name: "Coalesce Block", short: "COALESCE", chapter: "SQL Ch. 9 · NULL: The Missing Value", icon: "i-shield-check", verb: "fill",
      line: "SELECT name, COALESCE(team, 'none') FROM players;",
      explain: "COALESCE gives the first value that isn't NULL — a handy way to show a default instead of a gap." },
    { name: "Count Block", short: "COUNT", chapter: "SQL Ch. 10 · Aggregates", icon: "i-clipboard", verb: "count",
      line: "SELECT COUNT(*) FROM players;",
      explain: "COUNT(*) counts rows. It's an aggregate: it squeezes many rows into one answer." },
    { name: "Average Block", short: "AVG", chapter: "SQL Ch. 10 · Aggregates", icon: "i-gauge", verb: "sum up",
      line: "SELECT AVG(score), MAX(score) FROM players;",
      explain: "SUM, AVG, MIN and MAX work across a column. They skip NULLs, so missing scores don't drag the average down." },
    { name: "Group By Block", short: "GROUP BY", chapter: "SQL Ch. 11 · Grouping", icon: "i-boxes", verb: "group",
      line: "SELECT team, SUM(score) FROM players GROUP BY team;",
      explain: "GROUP BY sorts rows into piles that share a value, then the aggregate runs once per pile: one total per team." },
    { name: "Having Block", short: "HAVING", chapter: "SQL Ch. 11 · Grouping", icon: "i-funnel", verb: "keep",
      line: "SELECT team, COUNT(*) FROM players GROUP BY team HAVING COUNT(*) > 2;",
      explain: "HAVING filters groups after they're made — WHERE can't, because it runs before the grouping." },
    { name: "Join Block", short: "JOIN", chapter: "SQL Ch. 12 · Joins", icon: "i-link", verb: "connect",
      line: "SELECT players.name, items.item FROM players JOIN items ON items.owner_id = players.id;",
      explain: "JOIN glues two tables together. ON says which rows belong together — here, each item and the player who owns it." },
    { name: "Left Join Block", short: "LEFT JOIN", chapter: "SQL Ch. 12 · Joins", icon: "i-overlap", verb: "include",
      line: "SELECT p.name, i.item FROM players p LEFT JOIN items i ON i.owner_id = p.id;",
      explain: "LEFT JOIN keeps every row from the left table, even with no match; the missing side is filled with NULL. p and i are short nicknames." },
    { name: "Subquery Block", short: "( SELECT )", chapter: "SQL Ch. 13 · Subqueries", icon: "i-layers", verb: "nest",
      line: "SELECT name FROM players WHERE score > (SELECT AVG(score) FROM players);",
      explain: "A query inside brackets runs first and hands its answer to the outer query: everyone who beats the average." },
    { name: "Case Block", short: "CASE", chapter: "SQL Ch. 14 · CASE and DISTINCT", icon: "i-toggle", verb: "label",
      line: "SELECT name, CASE WHEN score >= 100 THEN 'pro' ELSE 'rookie' END AS tier FROM players;",
      explain: "CASE is SQL's if-else: the first WHEN that's true gives the value, and ELSE covers the rest. END closes it." },
    { name: "Distinct Block", short: "DISTINCT", chapter: "SQL Ch. 14 · CASE and DISTINCT", icon: "i-check", verb: "dedupe",
      line: "SELECT DISTINCT team FROM players;",
      explain: "DISTINCT removes repeated rows from the answer, so each team appears once." },
    { name: "Index Block", short: "INDEX", chapter: "SQL Ch. 15 · Keys, Constraints and Indexes", icon: "i-book-open", verb: "speed up",
      line: "CREATE INDEX idx_players_score ON players (score);",
      explain: "An index is like the index in a book: the database can jump straight to the scores it needs instead of reading every row." },
    { name: "Foreign Key Block", short: "REFERENCES", chapter: "SQL Ch. 15 · Keys, Constraints and Indexes", icon: "i-anchor", verb: "link",
      line: "CREATE TABLE items (id INTEGER PRIMARY KEY, owner_id INTEGER REFERENCES players(id), item TEXT NOT NULL);",
      explain: "REFERENCES makes owner_id a foreign key: it must match a real player's id. NOT NULL means the item name can't be left empty." },
    { name: "Transaction Block", short: "BEGIN", chapter: "SQL Ch. 16 · Transactions, Views and CTEs", icon: "i-lock", verb: "protect",
      line: "BEGIN TRANSACTION;",
      explain: "A transaction groups changes so they all happen or none do. COMMIT saves them together; ROLLBACK cancels them all." },
    { name: "CTE Block", short: "WITH", chapter: "SQL Ch. 16 · Transactions, Views and CTEs", icon: "i-stamp", verb: "name",
      line: "WITH top AS (SELECT * FROM players ORDER BY score DESC LIMIT 3) SELECT name FROM top;",
      explain: "WITH names a temporary result (a common table expression) that the main query can use like a table." }
  ];

  var H = [".headers on", ".mode column"];
  var chapters = [
    { title: "What Is a Database?", chapter: "Start here · tables, rows, SQL and SQLite", line: "SELECT 'Hello, world!';",
      content: {
        story: ["A database stores information in tables — grids like a spreadsheet. Each row is one thing (a player, an order, a song) and each column is one fact about it (a name, a price, a length). Almost every app you use keeps its data in one.",
          "SQL (say “sequel” or “S-Q-L”) is the language for asking a database questions and changing what's in it. You don't tell it how to search — you describe what you want, and the database works out the fastest way to get it.",
          "This track uses SQLite, the most widely deployed database in the world: it's inside every phone and browser. Install it from sqlite.org, type sqlite3 game.db, and you can start typing SQL. Almost everything here works the same in PostgreSQL, MySQL and SQL Server."],
        big: "A database keeps data in tables of rows and columns; SQL describes what you want, and the database finds it.",
        caption: "A question goes in as SELECT, and a small table of answers comes back. Tap Play.",
        demo: ["$ sqlite3 game.db", "sqlite> SELECT 'Hello, world!';", "Hello, world!", "sqlite> .quit"]
      },
      deep: {
        more: ["Lines starting with a dot, like .headers on and .mode column, aren't SQL: they're settings for the sqlite3 program itself. These two print neat columns with headings, and every example in this track uses them.",
          "SQL keywords aren't case-sensitive — select works like SELECT — but writing keywords in capitals is the common style, because it makes them stand out from your table and column names."],
        ex: { code: src(H.concat(["-- My first SQL", "SELECT 'Hello, world!' AS greeting;", "SELECT 2 + 3 AS answer;", "CREATE TABLE players (name TEXT, score INTEGER);", "INSERT INTO players VALUES ('Ana', 120);", "SELECT * FROM players;"])),
          walk: ["Lines 1–2: sqlite3 settings for neat columns with headings — not SQL.", "Line 3: a comment starts with --.", "Line 4: a heading greeting, then Hello, world!", "Line 5: SQL can do maths: answer 5.", "Lines 6–8: make a table, add one row, and read it back: Ana 120."] },
        mistake: "Forgetting the semicolon. The sqlite3 prompt changes to ...> and waits, because it thinks the statement isn't finished. Type ; and press Enter."
      } },
    { title: "Tables and Types", chapter: "Building · CREATE TABLE, types, PRIMARY KEY, NOT NULL", line: "CREATE TABLE players (id INTEGER PRIMARY KEY, name TEXT, score INTEGER);",
      content: {
        story: ["CREATE TABLE describes a new table: its name, then each column with a type. The everyday types are INTEGER (whole numbers), REAL (decimals), TEXT and BLOB (raw bytes, like images).",
          "id INTEGER PRIMARY KEY gives every row a unique number that SQLite fills in for you: 1, 2, 3 … The primary key is how you point at exactly one row, even if two players share a name.",
          "Rules called constraints keep bad data out: NOT NULL means a value is required, DEFAULT 0 fills in a value when none is given, and UNIQUE stops duplicates."],
        big: "CREATE TABLE names the columns and their types; a primary key identifies each row, and constraints keep data clean.",
        caption: "A blank grid gets column headings: id, name, score, speed. Tap Play.",
        demo: ["CREATE TABLE players (", "  id INTEGER PRIMARY KEY,", "  name TEXT NOT NULL,", "  score INTEGER DEFAULT 0 );"]
      },
      deep: {
        more: ["SQLite is relaxed about types: a column's type is a strong suggestion (its affinity), and typeof(value) shows what was really stored. PostgreSQL and MySQL are strict and reject a word in a number column.",
          "Names in SQL are usually snake_case: high_score, owner_id. Table names are often plural (players), because a table holds many rows."],
        ex: { code: src(H.concat(["CREATE TABLE players (", "    id INTEGER PRIMARY KEY,", "    name TEXT NOT NULL,", "    score INTEGER DEFAULT 0,", "    speed REAL", ");", "INSERT INTO players (name, speed) VALUES ('Ana', 4.5);", "SELECT id, name, score, speed, typeof(speed) AS kind FROM players;"])),
          walk: ["Lines 3–8: a table with four columns.", "Line 4: id numbers each row automatically.", "Lines 5–6: name is required; score starts at 0 if not given.", "Line 9: only name and speed are given.", "Line 10: 1 Ana 0 4.5 real — id and score were filled in."] },
        mistake: "Creating a table that already exists. SQLite stops with “table players already exists.” Use CREATE TABLE IF NOT EXISTS, or DROP TABLE first when you mean to start again."
      } },
    { title: "Adding Rows", chapter: "Filling up · INSERT INTO, VALUES, many rows", line: "INSERT INTO players (name, score) VALUES ('Ana', 120);",
      content: {
        story: ["INSERT INTO adds rows. Name the table, list the columns in brackets, then give VALUES in the same order: INSERT INTO players (name, score) VALUES ('Ana', 120);.",
          "Text goes in single quotes; numbers don't. To put an apostrophe inside text, double it: 'Ana''s sword'.",
          "Add several rows at once by separating groups with commas: VALUES ('Leo', 95), ('Mia', 80). Any column you don't list gets its DEFAULT, or NULL if there isn't one."],
        big: "INSERT INTO table (columns) VALUES (values) adds rows; text needs single quotes, and missing columns get defaults.",
        caption: "New rows slide into the bottom of the grid, one per bracketed group. Tap Play.",
        demo: ["INSERT INTO players (name, score)", "VALUES ('Ana', 120);", "VALUES ('Leo', 95), ('Mia', 80);", "3 rows"]
      },
      deep: {
        more: ["You can leave out the column list and give a value for every column in order, but naming the columns is safer: the statement keeps working if someone adds a column later.",
          "INSERT INTO new_table SELECT … copies rows from a query straight into another table."],
        ex: { code: src(H.concat(["CREATE TABLE players (id INTEGER PRIMARY KEY, name TEXT, score INTEGER DEFAULT 0);", "INSERT INTO players (name, score) VALUES ('Ana', 120);", "INSERT INTO players (name, score) VALUES ('Leo', 95), ('Mia', 80);", "INSERT INTO players (name) VALUES ('Sam');", "SELECT * FROM players;", "SELECT COUNT(*) AS how_many FROM players;"])),
          walk: ["Line 3: id and score have rules built in.", "Line 4: one row.", "Line 5: two rows in one statement.", "Line 6: no score given, so Sam gets the default 0.", "Line 7: four rows, numbered 1 to 4.", "Line 8: how_many 4."] },
        mistake: "Using double quotes for text: VALUES (\"Ana\"). In SQL, double quotes mean a column name, so some databases complain there's no column called Ana. Text takes single quotes."
      } },
    { title: "Reading Data", chapter: "Asking · SELECT, FROM, columns, AS", line: "SELECT name, score FROM players;",
      content: {
        story: ["SELECT reads data. SELECT * FROM players; returns every column of every row. List columns instead to choose exactly what you see and in what order: SELECT name, score FROM players;.",
          "AS renames a column in the answer: SELECT name AS player. The table isn't changed — only the heading of the result.",
          "The answer to a SELECT is itself a table: rows and columns. That simple idea is what makes SQL so powerful — answers can be filtered, sorted, joined and fed into other queries."],
        big: "SELECT columns FROM table reads data; * means every column, and AS renames a column in the answer.",
        caption: "A spotlight picks two columns out of the grid and shows just those. Tap Play.",
        demo: ["SELECT * FROM players", "→ every column", "SELECT name, score …", "→ just two"]
      },
      deep: {
        more: ["SELECT * is great for exploring, but real programs name their columns: it's clearer, sends less data, and keeps working if new columns are added.",
          "Without ORDER BY, rows come back in whatever order the database finds handy. Never rely on it — sorting is the next-but-one chapter."],
        ex: { code: src(H.concat(["CREATE TABLE players (name TEXT, team TEXT, score INTEGER);", "INSERT INTO players VALUES ('Ana', 'red', 120), ('Leo', 'blue', 95), ('Mia', 'red', 80);", "SELECT * FROM players;", "SELECT name, score FROM players;", "SELECT name AS player, score AS points FROM players;"])),
          walk: ["Lines 3–4: a small table with three players.", "Line 5: every column.", "Line 6: just name and score.", "Line 7: the same values under new headings: player and points."] },
        mistake: "Misspelling a column: SELECT nmae FROM players stops with “no such column: nmae.” The message names the exact word to fix."
      } },
    { title: "Filtering with WHERE", chapter: "Choosing rows · WHERE, AND, OR, LIKE, BETWEEN, IN", line: "SELECT name FROM players WHERE score > 100;",
      content: {
        story: ["WHERE keeps only the rows that pass a test: WHERE score > 100. SQL compares with = (one equals sign), <> or != (not equal), <, >, <= and >=.",
          "Combine tests with AND (both must pass), OR (either can pass) and NOT. When you mix AND and OR, add brackets so the meaning is obvious: WHERE team = 'red' AND (level > 5 OR score > 100).",
          "Handy shortcuts: BETWEEN 1 AND 5 includes both ends; IN ('red', 'blue') matches any value in the list; LIKE 'A%' matches text patterns, where % is any run of letters and _ is exactly one."],
        big: "WHERE filters rows with comparisons, joined by AND, OR and NOT; BETWEEN, IN and LIKE are handy shortcuts.",
        caption: "Rows pass through a gate marked score > 100; only two make it through. Tap Play.",
        demo: ["WHERE score > 100", "Ana 120 ✓", "Leo 95 ✗", "Sam 150 ✓"]
      },
      deep: {
        more: ["In SQLite, LIKE ignores upper and lower case for English letters: 'a%' also matches Ana. In PostgreSQL LIKE is case-sensitive, and ILIKE ignores case.",
          "AND is worked out before OR, just as × comes before + in maths. Brackets make your intention unmistakable."],
        ex: { code: src(H.concat(["CREATE TABLE players (name TEXT, team TEXT, level INTEGER, score INTEGER);", "INSERT INTO players VALUES", "    ('Ana', 'red', 4, 120), ('Leo', 'blue', 2, 95), ('Mia', 'red', 5, 80),", "    ('Sam', 'green', 1, 150), ('Zoe', 'blue', 5, 60);", "SELECT name FROM players WHERE score > 100;", "SELECT name FROM players WHERE team = 'red' AND level >= 3;", "SELECT name FROM players WHERE name LIKE 'M%' OR level BETWEEN 1 AND 2;", "SELECT name FROM players WHERE team IN ('blue', 'green') AND NOT level = 5;"])),
          walk: ["Lines 3–6: one INSERT can span several lines.", "Line 7: Ana and Sam.", "Line 8: Ana and Mia.", "Line 9: Leo, Mia and Sam.", "Line 10: Leo and Sam — Zoe is level 5."] },
        mistake: "Writing == or comparing text without quotes: WHERE team = red looks for a column called red. Text values always need single quotes: WHERE team = 'red'."
      } },
    { title: "Sorting and Limiting", chapter: "Order · ORDER BY, ASC, DESC, LIMIT, OFFSET", line: "SELECT name, score FROM players ORDER BY score DESC;",
      content: {
        story: ["ORDER BY sorts the answer. ASC (the default) goes smallest first — A to Z, 1 to 9. DESC goes biggest first.",
          "You can sort by several columns: ORDER BY team, name sorts by team, and within each team by name. Each column can have its own direction: ORDER BY score DESC, name.",
          "LIMIT keeps the first few rows, so ORDER BY score DESC LIMIT 3 is a top-three list. OFFSET skips rows first, which is how apps show page 2 of a list."],
        big: "ORDER BY sorts (ASC or DESC, by several columns), and LIMIT with OFFSET picks a page of the answer.",
        caption: "Rows shuffle into order, biggest score on top, and a frame keeps the top two. Tap Play.",
        demo: ["ORDER BY score DESC", "Sam 150, Ana 120, Leo 95 …", "LIMIT 2", "Sam, Ana"]
      },
      deep: {
        more: ["Sorting by a column you don't show is allowed: SELECT name FROM players ORDER BY score.",
          "SQL Server uses SELECT TOP 3 instead of LIMIT 3, and the SQL standard spells it FETCH FIRST 3 ROWS ONLY. PostgreSQL, MySQL and SQLite all understand LIMIT."],
        ex: { code: src(H.concat(["CREATE TABLE players (name TEXT, team TEXT, score INTEGER);", "INSERT INTO players VALUES ('Ana', 'red', 120), ('Leo', 'blue', 95), ('Mia', 'red', 80), ('Sam', 'blue', 150);", "SELECT name, score FROM players ORDER BY score DESC;", "SELECT name, team FROM players ORDER BY team, name;", "SELECT name FROM players ORDER BY score DESC LIMIT 2;", "SELECT name FROM players ORDER BY score DESC LIMIT 2 OFFSET 2;"])),
          walk: ["Line 5: Sam 150, Ana 120, Leo 95, Mia 80.", "Line 6: blue first (Leo, Sam), then red (Ana, Mia).", "Line 7: the top two: Sam and Ana.", "Line 8: skip two, take two: Leo and Mia — page 2."] },
        mistake: "Using LIMIT without ORDER BY for a “top” list. Without sorting, the database returns any rows it likes, so the result can change."
      } },
    { title: "Calculations and Functions", chapter: "Working it out · maths, ||, UPPER, LENGTH, ROUND, SUBSTR", line: "SELECT name, score * 2 AS doubled FROM players;",
      content: {
        story: ["SELECT can calculate: price * qty, score + 10, hp / 2. Like many languages, dividing two whole numbers gives a whole number (7 / 2 is 3); use 7.0 / 2 for 3.5. % gives the remainder.",
          "|| glues text together: name || '!' turns Ana into Ana!. Functions transform values: UPPER and LOWER change case, LENGTH counts characters, SUBSTR(name, 1, 3) cuts out the first three, ROUND(x, 2) rounds to two places.",
          "Give calculated columns a name with AS — otherwise the heading is the whole calculation."],
        big: "SELECT calculates with + - * / %, joins text with ||, and transforms values with functions like UPPER and ROUND.",
        caption: "Each row passes through a little machine that doubles its score. Tap Play.",
        demo: ["7 / 2 → 3", "7.0 / 2 → 3.5", "'Ana' || '!' → Ana!", "SUBSTR('Leonardo', 1, 3) → Leo"]
      },
      deep: {
        more: ["MySQL joins text with CONCAT(a, b) instead of || (unless a setting is changed). PostgreSQL and SQLite understand both.",
          "abs, max and min of two values, random, replace, trim, instr, printf and date functions are all built in — see the field guide shelf."],
        ex: { code: src(H.concat(["CREATE TABLE cart (name TEXT, price REAL, qty INTEGER);", "INSERT INTO cart VALUES ('Apple', 0.5, 6), ('Leonardo Comic', 3.99, 2);", "SELECT 7 / 2 AS whole, 7 % 2 AS remainder, 7.0 / 2 AS exact;", "SELECT name, price * qty AS cost, ROUND(price * qty * 1.08, 2) AS with_tax FROM cart;", "SELECT UPPER(name) AS loud, LENGTH(name) AS letters, SUBSTR(name, 1, 3) AS short, name || '!' AS excited FROM cart;"])),
          walk: ["Line 5: 3, 1 and 3.5.", "Line 6: Apple costs 3.0 (3.24 with tax); the comic costs 7.98 (8.62 with tax).", "Line 7: APPLE 5 App Apple! and LEONARDO COMIC 14 Leo Leonardo Comic!"] },
        mistake: "Expecting a decimal from two whole numbers: AVG is fine, but score / 3 drops the fraction. Multiply by 1.0 first, or CAST(score AS REAL) / 3."
      } },
    { title: "Changing Data", chapter: "Editing · UPDATE, SET, DELETE", line: "UPDATE players SET score = score + 10 WHERE name = 'Ana';",
      content: {
        story: ["UPDATE changes rows that already exist: UPDATE players SET score = score + 10 WHERE name = 'Ana';. SET can change several columns at once: SET level = 2, hp = 100.",
          "DELETE FROM players WHERE hp = 0; removes rows. Both statements affect every row that matches WHERE — and if you forget WHERE, they affect every row in the table.",
          "A safe habit: write the WHERE as a SELECT first, check the rows it finds, then turn it into the UPDATE or DELETE."],
        big: "UPDATE … SET changes matching rows and DELETE removes them — WHERE decides which; forget it and every row is hit.",
        caption: "A pencil changes one score; an eraser removes one row; the rest stay put. Tap Play.",
        demo: ["UPDATE players SET score = score + 10", "WHERE name = 'Ana'", "DELETE FROM players WHERE hp = 0", "SELECT * → the result"]
      },
      deep: {
        more: ["Updates can use the old value: score = score * 2 doubles everyone's score in one statement.",
          "To remove every row but keep the table, use DELETE FROM players; (other databases also have TRUNCATE). DROP TABLE removes the table itself."],
        ex: { code: src(H.concat(["CREATE TABLE players (name TEXT, level INTEGER, hp INTEGER, score INTEGER);", "INSERT INTO players VALUES ('Ana', 3, 80, 120), ('Leo', 1, 0, 95), ('Sam', 2, 0, 40);", "UPDATE players SET score = score + 10 WHERE name = 'Ana';", "UPDATE players SET level = level + 1, hp = 100 WHERE name = 'Leo';", "DELETE FROM players WHERE hp = 0;", "SELECT * FROM players;"])),
          walk: ["Line 5: Ana's score becomes 130.", "Line 6: Leo is revived: level 2, hp 100.", "Line 7: Sam still has hp 0, so his row is removed.", "Line 8: Ana 3 80 130 and Leo 2 100 95."] },
        mistake: "UPDATE players SET score = 0; with no WHERE resets every player. Databases do exactly what you say — check the WHERE before pressing Enter."
      } },
    { title: "NULL: The Missing Value", chapter: "Gaps · NULL, IS NULL, COALESCE", line: "SELECT name FROM players WHERE team IS NULL;",
      content: {
        story: ["NULL means a value is missing or unknown. It isn't zero and it isn't empty text — it's “we don't know.”",
          "Because NULL is unknown, comparing with it gives unknown too: team = NULL is never true, even when team is NULL. Always test with IS NULL or IS NOT NULL.",
          "COALESCE(team, 'no team') swaps a NULL for a default. Aggregates like SUM, AVG and COUNT(column) skip NULLs, while COUNT(*) counts every row."],
        big: "NULL means unknown: test it with IS NULL, replace it with COALESCE, and remember aggregates skip it.",
        caption: "One cell is a grey question mark; = NULL walks past it, IS NULL finds it. Tap Play.",
        demo: ["team = NULL → unknown", "team IS NULL → Leo", "COALESCE(team, 'no team')", "COUNT(score) skips NULL"]
      },
      deep: {
        more: ["Maths with NULL gives NULL: 5 + NULL is NULL. Wrap values in COALESCE(x, 0) when a missing number should count as zero.",
          "NOT NULL on a column stops NULLs from getting in at all — often the simplest fix."],
        ex: { code: src(H.concat(["CREATE TABLE players (name TEXT, team TEXT, score INTEGER);", "INSERT INTO players VALUES ('Ana', 'red', 120), ('Leo', NULL, 95), ('Mia', 'blue', NULL);", "SELECT name FROM players WHERE team IS NULL;", "SELECT name, COALESCE(team, 'no team') AS team FROM players;", "SELECT COUNT(*) AS all_rows, COUNT(score) AS scored, AVG(score) AS average FROM players;", "SELECT NULL = NULL AS equals, NULL IS NULL AS is_null;"])),
          walk: ["Line 5: Leo.", "Line 6: Leo's team shows as no team.", "Line 7: 3 rows, but only 2 scores; the average of 120 and 95 is 107.5.", "Line 8: equals is blank (NULL — unknown), is_null is 1 (true)."] },
        mistake: "Writing WHERE team = NULL. It finds nothing, without any error. Use WHERE team IS NULL."
      } },
    { title: "Aggregates", chapter: "Summing up · COUNT, SUM, AVG, MIN, MAX", line: "SELECT COUNT(*) FROM players;",
      content: {
        story: ["Aggregate functions squeeze many rows into one answer. COUNT(*) counts rows, SUM adds a column, AVG averages it, MIN and MAX find the smallest and largest.",
          "Combine them with WHERE to answer real questions: SELECT COUNT(*) FROM players WHERE score > 90; counts the high scorers.",
          "COUNT(DISTINCT team) counts different values — how many teams, not how many players."],
        big: "COUNT, SUM, AVG, MIN and MAX turn a whole column into one answer; WHERE chooses which rows count.",
        caption: "A column of numbers pours into a funnel and comes out as one total. Tap Play.",
        demo: ["COUNT(*) → 4", "SUM(score) → 445", "AVG(score) → 111.25", "MAX(score) → 150"]
      },
      deep: {
        more: ["You can't mix an aggregate with a plain column without grouping: SELECT name, MAX(score) is ambiguous in most databases. The next chapter, GROUP BY, is how you get one answer per group.",
          "ROUND(AVG(score), 1) keeps averages tidy."],
        ex: { code: src(H.concat(["CREATE TABLE players (name TEXT, team TEXT, score INTEGER);", "INSERT INTO players VALUES ('Ana', 'red', 120), ('Leo', 'blue', 95), ('Mia', 'red', 80), ('Sam', 'blue', 150);", "SELECT COUNT(*) AS players, SUM(score) AS total, AVG(score) AS average, MIN(score) AS low, MAX(score) AS high FROM players;", "SELECT COUNT(*) AS big_scorers FROM players WHERE score > 90;", "SELECT COUNT(DISTINCT team) AS teams FROM players;"])),
          walk: ["Line 5: 4 players, total 445, average 111.25, low 80, high 150.", "Line 6: three players scored over 90.", "Line 7: two different teams."] },
        mistake: "Using WHERE to filter on an aggregate: WHERE COUNT(*) > 2 is an error. Aggregates are tested with HAVING, after grouping."
      } },
    { title: "Grouping", chapter: "Per group · GROUP BY, HAVING", line: "SELECT team, SUM(score) FROM players GROUP BY team;",
      content: {
        story: ["GROUP BY team sorts rows into piles that share a team, and each aggregate then runs once per pile. One query gives every team's player count and total score.",
          "Every column in the SELECT should either be in the GROUP BY or inside an aggregate. Otherwise, which player's name would a whole team show?",
          "HAVING filters the groups after they're built: HAVING COUNT(*) >= 2 keeps only teams with at least two players. WHERE filters rows before grouping; HAVING filters groups after."],
        big: "GROUP BY makes one result row per group, aggregates run per group, and HAVING filters the groups.",
        caption: "Players walk into team piles, and each pile shows its own total. Tap Play.",
        demo: ["GROUP BY team", "red: Ana, Mia → 200", "blue: Leo, Sam → 245", "HAVING SUM(score) > 220 → blue"]
      },
      deep: {
        more: ["The order of a query is fixed: SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT. The database works through it as FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.",
          "You can group by several columns: GROUP BY team, level gives one row per team-and-level pair."],
        ex: { code: src(H.concat(["CREATE TABLE players (name TEXT, team TEXT, score INTEGER);", "INSERT INTO players VALUES ('Ana', 'red', 120), ('Leo', 'blue', 95), ('Mia', 'red', 80), ('Sam', 'blue', 150), ('Zoe', 'green', 60);", "SELECT team, COUNT(*) AS players, SUM(score) AS points FROM players GROUP BY team ORDER BY points DESC;", "SELECT team, AVG(score) AS average FROM players GROUP BY team HAVING COUNT(*) >= 2 ORDER BY team;"])),
          walk: ["Line 5: blue 2 245, red 2 200, green 1 60.", "Line 6: green has only one player, so HAVING drops it: blue 122.5, red 100.0."] },
        mistake: "SELECT name, team, SUM(score) … GROUP BY team. SQLite quietly picks some name from each group; PostgreSQL refuses. Group by every plain column you show."
      } },
    { title: "Joins", chapter: "Connecting tables · JOIN, ON, LEFT JOIN, aliases", line: "SELECT players.name, items.item FROM players JOIN items ON items.owner_id = players.id;",
      content: {
        story: ["Good databases split information into several tables: players in one, items in another. Each item stores its owner's id — a foreign key — instead of copying the player's name.",
          "JOIN puts them back together: FROM players JOIN items ON items.owner_id = players.id pairs every item with its owner. Columns are named table.column, or with short aliases: FROM players p JOIN items i.",
          "A plain JOIN (an inner join) keeps only pairs that match. LEFT JOIN keeps every row from the left table even if nothing matches, filling the other side with NULL — perfect for “players and how many items they have, including zero.”"],
        big: "JOIN … ON matches rows across tables by key; LEFT JOIN keeps unmatched rows from the left side.",
        caption: "Two grids slide together, lines connecting each item to its owner's id. Tap Play.",
        demo: ["players: 1 Ana, 2 Leo, 3 Mia", "items: sword→1, potion→1, shield→2", "JOIN → Ana sword, Ana potion, Leo shield", "LEFT JOIN → Mia too, with NULL"]
      },
      deep: {
        more: ["You can join three or more tables by adding more JOIN … ON clauses. A many-to-many link (students and clubs) uses a table in the middle — see the design shelf.",
          "Forgetting ON (or using the wrong key) multiplies rows: every player paired with every item. If a join returns far too many rows, check the ON."],
        ex: { code: src(H.concat(["CREATE TABLE players (id INTEGER PRIMARY KEY, name TEXT);", "CREATE TABLE items (id INTEGER PRIMARY KEY, owner_id INTEGER REFERENCES players(id), item TEXT);", "INSERT INTO players VALUES (1, 'Ana'), (2, 'Leo'), (3, 'Mia');", "INSERT INTO items (owner_id, item) VALUES (1, 'sword'), (1, 'potion'), (2, 'shield');", "SELECT players.name, items.item FROM players JOIN items ON items.owner_id = players.id ORDER BY items.id;", "SELECT p.name, COUNT(i.id) AS items", "FROM players p", "LEFT JOIN items i ON i.owner_id = p.id", "GROUP BY p.id", "ORDER BY p.name;"])),
          walk: ["Lines 3–4: owner_id points at a player's id.", "Lines 5–6: Ana owns two things, Leo one, Mia none.", "Line 7: Ana sword, Ana potion, Leo shield — Mia has no match.", "Lines 8–12: a query can span lines; LEFT JOIN keeps Mia: Ana 2, Leo 1, Mia 0."] },
        mistake: "Writing just name when both tables have a name column: SQLite stops with “ambiguous column name: name.” Say which one: p.name."
      } },
    { title: "Subqueries", chapter: "Queries in queries · scalar, IN, EXISTS", line: "SELECT name FROM players WHERE score > (SELECT AVG(score) FROM players);",
      content: {
        story: ["A subquery is a query in brackets inside another. It runs first, and its answer is used by the outer query.",
          "A subquery that returns one value can sit anywhere a value can: WHERE score > (SELECT AVG(score) FROM players) finds everyone above average.",
          "A subquery that returns a list works with IN: WHERE id IN (SELECT owner_id FROM items). EXISTS checks whether a subquery finds any row at all, and NOT EXISTS whether it finds none."],
        big: "A subquery in brackets runs first; use one value with comparisons, a list with IN, and EXISTS to test for any match.",
        caption: "A small query works out the average, then hands it to the big query. Tap Play.",
        demo: ["(SELECT AVG(score) …) → 111.25", "WHERE score > 111.25", "→ Ana, Sam", "NOT EXISTS → players with no items"]
      },
      deep: {
        more: ["Many subqueries can be written as joins and the other way round. Use whichever reads more clearly; the database usually runs both equally fast.",
          "A correlated subquery refers to the outer row, like WHERE i.owner_id = p.id — it's checked once for each outer row."],
        ex: { code: src(H.concat(["CREATE TABLE players (id INTEGER PRIMARY KEY, name TEXT, score INTEGER);", "CREATE TABLE items (owner_id INTEGER, item TEXT);", "INSERT INTO players VALUES (1, 'Ana', 120), (2, 'Leo', 95), (3, 'Mia', 80), (4, 'Sam', 150);", "INSERT INTO items VALUES (1, 'sword'), (4, 'sword'), (2, 'shield');", "SELECT name, score FROM players WHERE score > (SELECT AVG(score) FROM players);", "SELECT name FROM players WHERE id IN (SELECT owner_id FROM items WHERE item = 'sword');", "SELECT name FROM players p WHERE NOT EXISTS (SELECT 1 FROM items i WHERE i.owner_id = p.id);", "SELECT name, score - (SELECT MIN(score) FROM players) AS ahead_by FROM players ORDER BY ahead_by DESC;"])),
          walk: ["Line 7: the average is 111.25: Ana 120 and Sam 150.", "Line 8: the sword owners: Ana and Sam.", "Line 9: Mia owns nothing.", "Line 10: points ahead of last place: Sam 70, Ana 40, Leo 15, Mia 0."] },
        mistake: "Using = with a subquery that returns several rows. WHERE id = (SELECT owner_id FROM items) quietly uses just the first row in SQLite and errors in PostgreSQL. Use IN."
      } },
    { title: "CASE and DISTINCT", chapter: "Labels and uniques · CASE WHEN, DISTINCT, UNION", line: "SELECT DISTINCT team FROM players;",
      content: {
        story: ["CASE is SQL's if-else. CASE WHEN score >= 100 THEN 'pro' WHEN score >= 50 THEN 'player' ELSE 'rookie' END checks each WHEN in order and gives the first matching value.",
          "DISTINCT removes duplicate rows from an answer: SELECT DISTINCT team lists each team once.",
          "UNION stacks the answers of two queries into one list and removes duplicates; UNION ALL keeps them. Both queries must return the same number of columns."],
        big: "CASE turns values into labels, DISTINCT removes duplicates, and UNION stacks two answers together.",
        caption: "Scores drop through a sorter labelled pro, player and rookie. Tap Play.",
        demo: ["CASE WHEN score >= 100 THEN 'pro'", "WHEN score >= 50 THEN 'player'", "ELSE 'rookie' END", "DISTINCT team → red, blue"]
      },
      deep: {
        more: ["CASE works anywhere a value can: in ORDER BY to sort in a custom order, or inside SUM to count conditionally: SUM(CASE WHEN score > 100 THEN 1 ELSE 0 END).",
          "INTERSECT returns rows found in both queries, and EXCEPT rows in the first but not the second."],
        ex: { code: src(H.concat(["CREATE TABLE players (name TEXT, team TEXT, score INTEGER);", "CREATE TABLE coaches (name TEXT);", "INSERT INTO players VALUES ('Ana', 'red', 120), ('Leo', 'blue', 95), ('Mia', 'red', 30);", "INSERT INTO coaches VALUES ('Kai'), ('Ana');", "SELECT name, CASE WHEN score >= 100 THEN 'pro' WHEN score >= 50 THEN 'player' ELSE 'rookie' END AS tier FROM players;", "SELECT DISTINCT team FROM players ORDER BY team;", "SELECT name FROM players UNION SELECT name FROM coaches ORDER BY name;"])),
          walk: ["Line 7: Ana pro, Leo player, Mia rookie.", "Line 8: blue, red — each once.", "Line 9: Ana, Kai, Leo, Mia — Ana appears in both tables but only once in the answer."] },
        mistake: "Forgetting END at the end of a CASE. SQLite reports a syntax error near the next word, which can be confusing — count your CASEs and ENDs."
      } },
    { title: "Keys, Constraints and Indexes", chapter: "Protecting and speeding up · PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, INDEX", line: "CREATE INDEX idx_players_score ON players (score);",
      content: {
        story: ["Constraints are rules the database enforces on every change: PRIMARY KEY (unique row id), NOT NULL (required), UNIQUE (no duplicates), CHECK (a test, like score >= 0) and FOREIGN KEY (REFERENCES teams(id) must point at a real row). Bad data is refused with an error instead of quietly getting in.",
          "In SQLite, foreign keys are only enforced after PRAGMA foreign_keys = ON; — one of its few quirks. Other databases always enforce them.",
          "An index makes searching fast: CREATE INDEX idx_players_score ON players (score); builds a sorted lookup the database can jump through instead of reading every row. EXPLAIN QUERY PLAN shows whether a query uses one."],
        big: "Constraints refuse bad data; foreign keys keep links valid; indexes make searches fast.",
        caption: "A guard checks each new row against the rules; an index tab jumps straight to the right page. Tap Play.",
        demo: ["NOT NULL, UNIQUE, CHECK (score >= 0)", "REFERENCES teams(id)", "CREATE INDEX … ON players (score)", "SEARCH players USING INDEX"]
      },
      deep: {
        more: ["Indexes aren't free: each one takes space and slows inserts a little. Index the columns you search, join and sort by most often.",
          "Primary keys and UNIQUE columns get an index automatically."],
        ex: { code: src(H.concat(["PRAGMA foreign_keys = ON;", "CREATE TABLE teams (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL);", "CREATE TABLE players (", "    id INTEGER PRIMARY KEY,", "    name TEXT NOT NULL,", "    team_id INTEGER REFERENCES teams(id),", "    score INTEGER CHECK (score >= 0)", ");", "CREATE INDEX idx_players_score ON players (score);", "INSERT INTO teams (name) VALUES ('red'), ('blue');", "INSERT INTO players (name, team_id, score) VALUES ('Ana', 1, 120), ('Leo', 2, 95);", "EXPLAIN QUERY PLAN SELECT name FROM players WHERE score > 100;", "SELECT p.name, t.name AS team FROM players p JOIN teams t ON t.id = p.team_id;"])),
          walk: ["Line 3: switch on foreign-key checks in SQLite.", "Line 4: team names must be unique and present.", "Lines 5–10: every player must have a name, a real team and a score of 0 or more.", "Line 11: an index on score.", "Line 14: the plan says SEARCH players USING INDEX idx_players_score.", "Line 15: Ana red, Leo blue."] },
        mistake: "Inserting a player with team_id 9 when there's no team 9. With foreign keys on, SQLite refuses with “FOREIGN KEY constraint failed” — the rule doing its job."
      } },
    { title: "Transactions, Views and CTEs", chapter: "Real-world SQL · BEGIN, COMMIT, ROLLBACK, VIEW, WITH", line: "BEGIN TRANSACTION;",
      content: {
        story: ["A transaction makes several changes count as one. Moving money takes two updates — one account down, one up. Between BEGIN and COMMIT they either all happen or, with ROLLBACK, none do. A crash halfway leaves nothing half-done.",
          "A view saves a query under a name: CREATE VIEW rich AS SELECT …. After that, SELECT * FROM rich works like a table that's always up to date.",
          "WITH names a temporary result for one query — a common table expression (CTE). It makes long queries readable, step by step. WITH RECURSIVE can even repeat a step, like counting down."],
        big: "Transactions make changes all-or-nothing, views save queries as named tables, and WITH builds a query step by step.",
        caption: "Two updates go into a sealed envelope: COMMIT posts both, ROLLBACK shreds both. Tap Play.",
        demo: ["BEGIN;", "Ana −30, Leo +30", "COMMIT; → saved together", "ROLLBACK; → nothing changed"]
      },
      deep: {
        more: ["Transactions also make bulk inserts much faster: thousands of INSERTs inside one BEGIN … COMMIT are written to disk once instead of thousands of times.",
          "Every statement outside BEGIN runs in its own little transaction automatically."],
        ex: { code: src(H.concat(["CREATE TABLE accounts (name TEXT PRIMARY KEY, balance INTEGER);", "INSERT INTO accounts VALUES ('Ana', 100), ('Leo', 50);", "BEGIN TRANSACTION;", "UPDATE accounts SET balance = balance - 30 WHERE name = 'Ana';", "UPDATE accounts SET balance = balance + 30 WHERE name = 'Leo';", "COMMIT;", "BEGIN;", "DELETE FROM accounts;", "ROLLBACK;", "SELECT * FROM accounts;", "CREATE VIEW rich AS SELECT name FROM accounts WHERE balance > 60;", "SELECT * FROM rich;", "WITH totals AS (SELECT SUM(balance) AS total FROM accounts)", "SELECT total FROM totals;"])),
          walk: ["Lines 5–8: move 30 from Ana to Leo as one change.", "Lines 9–11: delete everything… then ROLLBACK cancels it.", "Line 12: Ana 70, Leo 80 — still there.", "Lines 13–14: a view: Ana and Leo both have over 60.", "Lines 15–16: a CTE: total 150."] },
        mistake: "Forgetting COMMIT. Your changes look saved inside your own session, but other programs can't see them — and they vanish if you close the connection."
      } }
  ];

  var shelves = [
    { title: "SQL Dialects Field Guide", chapter: "Beyond the basics · SQL shelf", line: ["SELECT date('now');", "SELECT CAST('42' AS INTEGER) + 1;"],
      content: {
        story: ["SQL is a standard, but every database adds its own flavour, called a dialect. SQLite is a small file-based database inside apps; PostgreSQL is a powerful open-source server; MySQL powers much of the web; SQL Server is Microsoft's.",
          "The basics in this track — SELECT, WHERE, JOIN, GROUP BY, INSERT, UPDATE, DELETE — work almost everywhere. The differences are mostly in details: auto-numbered ids (INTEGER PRIMARY KEY in SQLite, SERIAL or IDENTITY in PostgreSQL, AUTO_INCREMENT in MySQL), LIMIT vs TOP, and date functions.",
          "SQLite's date and time functions work on text like '2025-03-01': date, time, datetime, julianday and strftime, with modifiers like '+7 days'."],
        big: "Core SQL is the same everywhere; dialects differ in ids, LIMIT/TOP, text joining and date functions.",
        caption: "Four database logos share one SELECT, then each adds its own accent. Tap Play.",
        demo: ["SQLite: INTEGER PRIMARY KEY", "PostgreSQL: GENERATED … AS IDENTITY", "MySQL: AUTO_INCREMENT", "SQL Server: SELECT TOP 3"]
      },
      deep: {
        more: ["CAST(value AS INTEGER) converts between types in every database. typeof(x) is SQLite's way to see what type a value really is.",
          "Store dates as ISO text (YYYY-MM-DD) in SQLite: it sorts correctly and every date function understands it."],
        ex: { code: src(H.concat(["SELECT date('2025-03-01', '+7 days') AS next_week, strftime('%Y', '2025-03-01') AS year;", "SELECT julianday('2025-03-01') - julianday('2025-01-01') AS days_between;", "SELECT CAST('42' AS INTEGER) + 1 AS n, typeof(1) AS a, typeof(1.0) AS b, typeof('1') AS c, typeof(NULL) AS d;", "SELECT format('%05d', 42) AS padded, LOWER('LOUD') AS quiet, REPLACE('a-b-c', '-', '+') AS swapped;"])),
          walk: ["Line 3: 2025-03-08 and 2025.", "Line 4: 59.0 days.", "Line 5: 43, then integer, real, text and null.", "Line 6: 00042, loud and a+b+c."] },
        mistake: "Copying SQL between databases without testing. Most of it works, but a LIMIT, a date function or an id column may need its local spelling."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · SQL shelf", line: ["Parse error: near \"FORM\": syntax error", "Runtime error: UNIQUE constraint failed: players.name"],
      content: {
        story: ["SQL errors fall into a few families. Syntax errors (“near \"FORM\": syntax error”) point at the word just after the mistake — look at it and the word before. “no such table” and “no such column” mean a typo or a missing CREATE.",
          "“ambiguous column name” means two joined tables share that column: prefix it, p.name. Constraint errors (“UNIQUE constraint failed”, “NOT NULL constraint failed”) mean the data broke a rule — the rule is working.",
          "The quiet bugs are the dangerous ones: = NULL finding nothing, a missing WHERE changing every row, a JOIN without the right ON multiplying rows. When a result looks wrong, count the rows and check each clause."],
        big: "Read the word the error points at; prefix ambiguous columns; and watch for silent bugs like = NULL and missing WHERE.",
        caption: "A magnifying glass lands on FORM in a query and turns it into FROM. Tap Play.",
        demo: ["SELECT * FORM players;", "near \"FORM\": syntax error", "SELECT * FROM players;", "✓"]
      },
      deep: {
        more: ["INSERT OR IGNORE skips rows that would break a UNIQUE rule, and INSERT … ON CONFLICT DO UPDATE (an “upsert”) updates the existing row instead.",
          "Build big queries a piece at a time: get the FROM and JOIN right, check the row count, then add WHERE, GROUP BY and the rest."],
        ex: { code: src(H.concat(["CREATE TABLE players (id INTEGER PRIMARY KEY, name TEXT UNIQUE, team TEXT);", "INSERT INTO players (name, team) VALUES ('Ana', 'red'), ('Leo', NULL);", "INSERT OR IGNORE INTO players (name, team) VALUES ('Ana', 'blue');", "SELECT COUNT(*) AS with_equals FROM players WHERE team = NULL;", "SELECT COUNT(*) AS with_is FROM players WHERE team IS NULL;", "INSERT INTO players (name, team) VALUES ('Leo', 'green')", "    ON CONFLICT (name) DO UPDATE SET team = excluded.team;", "SELECT * FROM players;"])),
          walk: ["Line 5: a second Ana would break UNIQUE, so OR IGNORE skips it.", "Line 6: = NULL silently finds 0 rows.", "Line 7: IS NULL finds Leo: 1.", "Lines 8–9: an upsert: Leo exists, so his team is updated instead.", "Line 10: 1 Ana red, 2 Leo green."] },
        mistake: "Assuming no error means a correct answer. SQL happily runs a query that asks the wrong question — check results against a few rows you know."
      } },
    { title: "Window Functions", chapter: "Beyond the basics · SQL shelf", line: ["SELECT name, RANK() OVER (ORDER BY score DESC) FROM players;", "SUM(amount) OVER (ORDER BY day)"],
      content: {
        story: ["Window functions calculate across related rows without squeezing them into one, the way GROUP BY does. Every row stays, and gains a new column.",
          "OVER (ORDER BY score DESC) defines the window. ROW_NUMBER numbers rows 1, 2, 3; RANK gives ties the same place and skips the next; DENSE_RANK gives ties the same place without skipping.",
          "Aggregates become windows too: SUM(amount) OVER (ORDER BY day) is a running total. PARTITION BY team restarts the window for each team, and LAG(score) looks at the previous row."],
        big: "Window functions add rankings, running totals and comparisons to every row with OVER (PARTITION BY … ORDER BY …).",
        caption: "Rows stay in place while a ranking column fills in beside them. Tap Play.",
        demo: ["RANK() OVER (ORDER BY score DESC)", "Sam 1, Ana 2, Leo 2, Mia 4", "SUM(amount) OVER (ORDER BY day)", "10, 25, 45 …"]
      },
      deep: {
        more: ["Window functions run after WHERE and GROUP BY, so to filter by a rank, wrap the query in a CTE and filter outside it.",
          "They're supported by SQLite (3.25+), PostgreSQL, MySQL 8 and SQL Server."],
        ex: { code: src(H.concat(["CREATE TABLE players (name TEXT, team TEXT, score INTEGER);", "INSERT INTO players VALUES ('Ana', 'red', 120), ('Leo', 'blue', 120), ('Mia', 'red', 80), ('Sam', 'blue', 150);", "SELECT name, score,", "    ROW_NUMBER() OVER (ORDER BY score DESC, name) AS row_num,", "    RANK() OVER (ORDER BY score DESC) AS place,", "    DENSE_RANK() OVER (ORDER BY score DESC) AS dense", "FROM players ORDER BY score DESC, name;", "SELECT name, team, score,", "    RANK() OVER (PARTITION BY team ORDER BY score DESC) AS team_place,", "    score - LAG(score) OVER (ORDER BY score, name) AS gap", "FROM players ORDER BY score, name;"])),
          walk: ["Lines 5–9: Sam 1 1 1; Ana and Leo tie: rows 2 and 3, both place 2, dense 2; Mia row 4, place 4, dense 3.", "Lines 10–13: places within each team, and the gap from the next-lower score: Mia (no gap), Ana 40, Leo 0, Sam 30."] },
        mistake: "Trying WHERE RANK() OVER (…) <= 3. Window functions aren't allowed in WHERE; put the query in a WITH and filter the result."
      } },
    { title: "Designing a Database", chapter: "Beyond the basics · SQL shelf", line: ["CREATE TABLE memberships (student_id INTEGER, club_id INTEGER);", "PRIMARY KEY (student_id, club_id)"],
      content: {
        story: ["Good design means storing each fact once. If every order row repeats the customer's address, changing the address means changing hundreds of rows — and missing one leaves the data contradicting itself. Splitting data into tables linked by keys is called normalisation.",
          "One-to-many: one player has many items, so items carry a player_id. Many-to-many: a student joins many clubs and a club has many students, so a third table, memberships, holds pairs of ids.",
          "Start with the nouns in your app (players, teams, items), give each a table with an id, then draw the links between them."],
        big: "Store each fact once: one-to-many links use a foreign key, many-to-many links use a table of pairs.",
        caption: "Students and clubs connect through a table of pairs in the middle. Tap Play.",
        demo: ["students: 1 Ana, 2 Leo", "clubs: 1 Chess, 2 Robots", "memberships: (1,1) (1,2) (2,2)", "JOIN → who is in which club"]
      },
      deep: {
        more: ["A composite primary key, PRIMARY KEY (student_id, club_id), stops the same pair being added twice.",
          "Sometimes designs repeat data on purpose to make reading faster (denormalising) — but start normalised and change only when you measure a need."],
        ex: { code: src(H.concat(["CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL);", "CREATE TABLE clubs (id INTEGER PRIMARY KEY, name TEXT NOT NULL);", "CREATE TABLE memberships (", "    student_id INTEGER REFERENCES students(id),", "    club_id INTEGER REFERENCES clubs(id),", "    PRIMARY KEY (student_id, club_id)", ");", "INSERT INTO students VALUES (1, 'Ana'), (2, 'Leo'), (3, 'Mia');", "INSERT INTO clubs VALUES (1, 'Chess'), (2, 'Robots');", "INSERT INTO memberships VALUES (1, 1), (1, 2), (2, 2);", "SELECT s.name AS student, c.name AS club", "FROM memberships m", "JOIN students s ON s.id = m.student_id", "JOIN clubs c ON c.id = m.club_id", "ORDER BY s.name, c.name;", "SELECT c.name AS club, COUNT(m.student_id) AS members", "FROM clubs c LEFT JOIN memberships m ON m.club_id = c.id", "GROUP BY c.id ORDER BY c.name;"])),
          walk: ["Lines 3–4: two tables of things.", "Lines 5–9: a table of pairs links them; the pair is the key.", "Line 12: Ana is in both clubs, Leo in Robots, Mia in none.", "Lines 13–17: two joins through the middle table: Ana Chess, Ana Robots, Leo Robots.", "Lines 18–20: Chess 1, Robots 2."] },
        mistake: "Storing lists in one cell, like clubs = 'Chess,Robots'. It can't be joined, counted or kept consistent. A list of things is a table of rows."
      } },
    { title: "Safe Queries from Code", chapter: "Beyond the basics · SQL shelf", line: ["SELECT * FROM players WHERE name = :name;", "cursor.execute(\"SELECT * FROM players WHERE name = ?\", (name,))"],
      content: {
        story: ["Apps build SQL from what users type. Gluing that text straight into a query is dangerous: a “name” like x' OR '1'='1 changes the query's meaning. This is SQL injection, one of the most common security holes on the web.",
          "The fix is parameters. Write a placeholder — ? or :name — and pass the value separately. The database treats it purely as data, never as SQL, whatever it contains. In Python: cursor.execute(\"SELECT * FROM players WHERE name = ?\", (name,)).",
          "The sqlite3 shell can set parameters too, with .parameter set :name 'Ana'. Every practice program on the PC uses this, so the numbers in the blue boxes are passed in safely."],
        big: "Never glue user text into SQL; pass it as a parameter (? or :name) so it's always treated as data.",
        caption: "A sneaky name tries to break into the query, but the parameter slot keeps it as plain text. Tap Play.",
        demo: ["name = \"x' OR '1'='1\"", "glued in → every row leaks ✗", "WHERE name = :name", "→ treated as text: no rows ✓"]
      },
      deep: {
        more: ["Parameters also make queries faster when run many times, because the database can prepare the statement once and reuse it.",
          "Libraries called ORMs (like SQLAlchemy, Prisma or Entity Framework) build parameterised SQL for you — but it's still worth knowing the SQL they write."],
        ex: { code: src(H.concat([".parameter set :name 'Ana'", ".parameter set :sneaky \"x' OR '1'='1\"", "CREATE TABLE players (name TEXT, secret TEXT);", "INSERT INTO players VALUES ('Ana', 'likes cats'), ('Leo', 'afraid of bees');", "SELECT name, secret FROM players WHERE name = :name;", "SELECT COUNT(*) AS leaked FROM players WHERE name = :sneaky;"])),
          walk: ["Lines 3–4: two parameters; the second is a classic injection attempt.", "Line 7: only Ana's row.", "Line 8: the sneaky text is just a strange name, so leaked is 0. Glued into the query, it would have matched every row."] },
        mistake: "Building SQL with + or f-strings, like \"... WHERE name = '\" + name + \"'\". It works in testing and breaks — or gets hacked — the first time someone types an apostrophe."
      } }
  ];

  var glossary = [
    ["aggregate", "A function like COUNT, SUM or AVG that turns many rows into one value."],
    ["alias", "A temporary name given with AS, for a column or a table."],
    ["ALTER TABLE", "Changes a table's design, like adding a column."],
    ["AND / OR / NOT", "Words that combine or flip tests in WHERE."],
    ["ASC / DESC", "Ascending (smallest first) or descending order."],
    ["AVG", "The average of a column, skipping NULLs."],
    ["BEGIN", "Starts a transaction."],
    ["BETWEEN", "Tests a range, including both ends."],
    ["BLOB", "Raw binary data, like an image."],
    ["CASE", "SQL's if-else expression: CASE WHEN … THEN … ELSE … END."],
    ["CAST", "Converts a value to another type."],
    ["CHECK", "A constraint that every row must pass a test."],
    ["COALESCE", "Returns the first value that isn't NULL."],
    ["column", "One named field in a table, with a type."],
    ["COMMIT", "Saves a transaction's changes together."],
    ["composite key", "A key made of more than one column."],
    ["constraint", "A rule the database enforces, like NOT NULL or UNIQUE."],
    ["COUNT", "Counts rows (COUNT(*)) or non-NULL values (COUNT(column))."],
    ["CREATE TABLE", "Makes a new table."],
    ["CTE", "A common table expression: a named temporary result made with WITH."],
    ["database", "An organised store of data, usually in tables."],
    ["DEFAULT", "The value a column gets when none is given."],
    ["DELETE", "Removes rows that match WHERE."],
    ["denormalise", "Repeat some data on purpose, usually for speed."],
    ["dialect", "One database's version of SQL."],
    ["DISTINCT", "Removes duplicate rows from an answer."],
    ["DROP TABLE", "Removes a whole table and its data."],
    ["EXISTS", "True if a subquery finds at least one row."],
    ["EXPLAIN QUERY PLAN", "Shows how SQLite will run a query."],
    ["foreign key", "A column that must match a key in another table."],
    ["FROM", "Names the table(s) a query reads."],
    ["GROUP BY", "Groups rows that share values so aggregates run per group."],
    ["HAVING", "Filters groups after GROUP BY."],
    ["IN", "Tests whether a value is in a list or subquery."],
    ["index", "A lookup structure that makes searching a column fast."],
    ["injection", "An attack that sneaks SQL in through user input."],
    ["inner join", "A join that keeps only matching pairs; plain JOIN."],
    ["INSERT", "Adds rows to a table."],
    ["INTEGER", "The type for whole numbers."],
    ["IS NULL", "The right way to test for a missing value."],
    ["JOIN", "Combines rows from two tables using ON."],
    ["key", "A column (or columns) that identifies rows."],
    ["LEFT JOIN", "Keeps every left-side row, with NULLs where there's no match."],
    ["LIKE", "Matches text patterns with % and _."],
    ["LIMIT", "Keeps only the first few rows."],
    ["many-to-many", "A link where both sides can have many of the other, held in a table of pairs."],
    ["MAX / MIN", "The largest or smallest value in a column."],
    ["normalisation", "Designing tables so each fact is stored once."],
    ["NOT NULL", "A constraint that a value is required."],
    ["NULL", "A missing or unknown value."],
    ["OFFSET", "Skips rows before LIMIT takes some."],
    ["ON", "The condition that pairs rows in a join."],
    ["one-to-many", "A link where one row relates to many in another table."],
    ["ORDER BY", "Sorts the answer."],
    ["ORM", "A library that maps tables to objects and writes SQL for you."],
    ["parameter", "A placeholder like ? or :name filled with a value safely."],
    ["PARTITION BY", "Splits a window function's rows into separate groups."],
    ["PostgreSQL", "A powerful open-source database server."],
    ["PRAGMA", "A SQLite command for settings, like foreign_keys = ON."],
    ["primary key", "The column that uniquely identifies each row."],
    ["query", "A request to the database, usually a SELECT."],
    ["RANK", "A window function that ranks rows, giving ties the same place."],
    ["REAL", "The type for decimal numbers in SQLite."],
    ["record", "Another word for a row."],
    ["REFERENCES", "Declares a foreign key."],
    ["ROLLBACK", "Cancels a transaction's changes."],
    ["ROUND", "Rounds a number to a number of decimal places."],
    ["row", "One record in a table."],
    ["ROW_NUMBER", "Numbers rows 1, 2, 3 in a window."],
    ["schema", "The design of a database: its tables, columns and rules."],
    ["SELECT", "Reads data and calculates answers."],
    ["SQL", "Structured Query Language, for working with databases."],
    ["SQLite", "A small, file-based database built into countless apps."],
    ["subquery", "A query in brackets inside another query."],
    ["SUM", "Adds up a column."],
    ["table", "A grid of rows and columns holding one kind of thing."],
    ["TEXT", "The type for words and sentences."],
    ["transaction", "A group of changes that all happen or none do."],
    ["UNION", "Stacks two queries' answers, removing duplicates."],
    ["UNIQUE", "A constraint that no two rows share a value."],
    ["UPDATE", "Changes values in existing rows."],
    ["upsert", "Insert a row, or update it if it already exists."],
    ["view", "A saved query you can select from like a table."],
    ["WHERE", "Filters rows with a test."],
    ["window function", "A calculation across related rows that keeps every row."],
    ["WITH", "Starts a common table expression."]
  ];

  var field = [
    { name: "COUNT / SUM / AVG", head: "aggregates", what: "Count rows, add up or average a column.", ex: "SELECT AVG(score) FROM players;" },
    { name: "MIN / MAX", head: "aggregates", what: "The smallest or largest value.", ex: "SELECT MAX(score) FROM players;" },
    { name: "UPPER / LOWER", head: "text", what: "Change the case of text.", ex: "SELECT UPPER(name) FROM players;" },
    { name: "LENGTH / SUBSTR", head: "text", what: "Count characters, or cut out part of the text.", ex: "SUBSTR(name, 1, 3)" },
    { name: "REPLACE / TRIM", head: "text", what: "Swap part of the text, or remove spaces at the ends.", ex: "TRIM('  hi  ')" },
    { name: "||", head: "text", what: "Joins text together (CONCAT in MySQL).", ex: "name || ' the brave'" },
    { name: "ROUND / ABS", head: "numbers", what: "Round to decimal places, or drop the minus sign.", ex: "ROUND(3.14159, 2)" },
    { name: "CAST", head: "types", what: "Convert between types.", ex: "CAST('42' AS INTEGER)" },
    { name: "COALESCE", head: "NULL", what: "The first value that isn't NULL.", ex: "COALESCE(team, 'none')" },
    { name: "date / strftime", head: "dates (SQLite)", what: "Work with dates stored as 'YYYY-MM-DD' text.", ex: "date('now', '+7 days')" },
    { name: "julianday", head: "dates (SQLite)", what: "A day number; subtract two to get days between dates.", ex: "julianday(b) - julianday(a)" },
    { name: "RANK / ROW_NUMBER", head: "window", what: "Rank or number rows in a window.", ex: "RANK() OVER (ORDER BY score DESC)" },
    { name: "LAG / LEAD", head: "window", what: "Read the previous or next row's value.", ex: "LAG(score) OVER (ORDER BY day)" },
    { name: "typeof", head: "SQLite", what: "Shows what type a value really has.", ex: "typeof(4.5) → real" },
    { name: "random", head: "SQLite", what: "A random whole number; ORDER BY random() shuffles.", ex: "SELECT name FROM players ORDER BY random() LIMIT 1;" }
  ];

  var cheats = [
    { title: "Query Skeleton Card", body: "The clauses, in the order you write them.", code: src(["SELECT name, SUM(score) AS total", "FROM players", "WHERE level > 1", "GROUP BY name", "HAVING SUM(score) > 100", "ORDER BY total DESC", "LIMIT 10;"]) },
    { title: "Table Card", body: "Create, change and remove tables.", code: src(["CREATE TABLE scores (", "    id INTEGER PRIMARY KEY,", "    player_id INTEGER REFERENCES players(id),", "    points INTEGER NOT NULL DEFAULT 0", ");", "ALTER TABLE scores ADD COLUMN note TEXT;", "CREATE INDEX idx_scores_points ON scores (points);", "DROP TABLE scores;"]) },
    { title: "Change Data Card", body: "Insert, update and delete.", code: src(["INSERT INTO players (name, score) VALUES ('Ana', 120), ('Leo', 95);", "UPDATE players SET score = score + 10 WHERE name = 'Ana';", "DELETE FROM players WHERE score < 50;"]) },
    { title: "Filter Card", body: "Every way to choose rows.", code: src(["SELECT name FROM players WHERE score >= 100;", "SELECT name FROM players WHERE team = 'red' AND level > 2;", "SELECT name FROM players WHERE name LIKE 'A%';", "SELECT name FROM players WHERE level BETWEEN 1 AND 5;", "SELECT name FROM players WHERE team IN ('red', 'blue');", "SELECT name FROM players WHERE team IS NULL;"]) },
    { title: "Summary Card", body: "Aggregates and groups.", code: src(["SELECT COUNT(*), AVG(score), MAX(score) FROM players;", "SELECT team, COUNT(*) AS n", "FROM players", "GROUP BY team", "HAVING COUNT(*) > 1;"]) },
    { title: "Join Card", body: "Combining tables.", code: src(["SELECT p.name, i.item", "FROM players p", "JOIN items i ON i.owner_id = p.id;", "SELECT p.name, COUNT(i.id) AS items", "FROM players p", "LEFT JOIN items i ON i.owner_id = p.id", "GROUP BY p.id;"]) },
    { title: "Labels Card", body: "CASE, COALESCE and DISTINCT.", code: src(["SELECT name,", "    CASE WHEN score >= 100 THEN 'pro' ELSE 'rookie' END AS tier,", "    COALESCE(team, 'none') AS team", "FROM players;", "SELECT DISTINCT team FROM players;"]) },
    { title: "Safety Card", body: "Transactions and parameters.", code: src(["BEGIN;", "UPDATE accounts SET balance = balance - 30 WHERE name = 'Ana';", "UPDATE accounts SET balance = balance + 30 WHERE name = 'Leo';", "COMMIT;", "SELECT * FROM players WHERE name = :name;"]) }
  ];

  /* A whole main.sql: shell settings, the blue-box parameters, then SQL. */
  function M(params, body) {
    return H.concat(params.map(function (p) { return ".parameter set :" + p[0] + " " + p[1]; }), [""], body);
  }
  function pad(s, w) { while (s.length < w) s += " "; return s; }
  function dashes(n) { return new Array(n + 1).join("-"); }
  /* A REAL value: sqlite3 always shows a decimal point (65.0). */
  function R(x) { return { real: x }; }
  function cell(x) {
    if (x === null) return "";
    if (typeof x === "object") return x.real % 1 === 0 ? x.real.toFixed(1) : String(x.real);
    return String(x);
  }
  /* What sqlite3 prints in .mode column with .headers on: every cell
     padded to its column's widest entry, columns two spaces apart, and
     nothing at all when no rows come back. */
  function tbl(cols, rows) {
    if (!rows.length) return [];
    var w = cols.map(function (c, i) { var m = c.length; rows.forEach(function (r) { m = Math.max(m, cell(r[i]).length); }); return m; });
    function line(r, raw) { return r.map(function (x, i) { return pad(raw ? x : cell(x), w[i]); }).join("  "); }
    return [line(cols, true), line(w.map(dashes), true)].concat(rows.map(function (r) { return line(r); }));
  }
  function byScoreThenName(a, b) { return b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0); }
  function round1(x) { return Math.round(x * 10) / 10; }

  var projects = [
    { name: "Score Board", about: "Three players, sorted best first.",
      vars: [{ key: "ana", val: 120, min: 0, max: 200 }, { key: "leo", val: 95, min: 0, max: 200 }, { key: "mia", val: 150, min: 0, max: 200 }],
      code: function (v) { return M([["ana", v.ana], ["leo", v.leo], ["mia", v.mia]], ["CREATE TABLE players (name TEXT, score INTEGER);", "INSERT INTO players VALUES ('Ana', :ana), ('Leo', :leo), ('Mia', :mia);", "SELECT name, score FROM players ORDER BY score DESC, name;"]); },
      run: function (v) { return tbl(["name", "score"], [["Ana", v.ana], ["Leo", v.leo], ["Mia", v.mia]].sort(byScoreThenName)); },
      explain: "ORDER BY score DESC puts the best first; if two scores tie, name breaks the tie alphabetically." },
    { name: "Level Filter", about: "WHERE keeps the heroes at or above a level.",
      vars: [{ key: "min_level", val: 4, min: 1, max: 10 }],
      code: function (v) { return M([["min_level", v.min_level]], ["CREATE TABLE heroes (name TEXT, level INTEGER);", "INSERT INTO heroes VALUES ('Ana', 4), ('Leo', 2), ('Mia', 7), ('Sam', 5), ('Zoe', 9), ('Kai', 1);", "SELECT COUNT(*) AS found FROM heroes WHERE level >= :min_level;", "SELECT name, level FROM heroes WHERE level >= :min_level ORDER BY level, name;"]); },
      run: function (v) {
        var rows = [["Ana", 4], ["Leo", 2], ["Mia", 7], ["Sam", 5], ["Zoe", 9], ["Kai", 1]].filter(function (r) { return r[1] >= v.min_level; }).sort(function (a, b) { return a[1] - b[1]; });
        return tbl(["found"], [[rows.length]]).concat(tbl(["name", "level"], rows));
      },
      explain: "Both queries use the same WHERE. Set the level to 10: COUNT says 0, and the second query prints nothing at all — no rows, no headings." },
    { name: "Shop Receipt", about: "price * qty works out each line of a receipt.",
      vars: [{ key: "apples", val: 3, min: 0, max: 10 }, { key: "pears", val: 2, min: 0, max: 10 }],
      code: function (v) { return M([["apples", v.apples], ["pears", v.pears]], ["CREATE TABLE cart (item TEXT, price INTEGER, qty INTEGER);", "INSERT INTO cart VALUES ('Apple', 50, :apples), ('Pear', 75, :pears), ('Bread', 250, 1);", "SELECT item, qty, price * qty AS cost FROM cart ORDER BY item;", "SELECT SUM(price * qty) AS total_cents FROM cart;"]); },
      run: function (v) { var a = 50 * v.apples, p = 75 * v.pears; return tbl(["item", "qty", "cost"], [["Apple", v.apples, a], ["Bread", 1, 250], ["Pear", v.pears, p]]).concat(tbl(["total_cents"], [[a + p + 250]])); },
      explain: "Prices are stored in cents, so the maths stays exact. SUM adds up the calculated cost of every row." },
    { name: "Team Totals", about: "GROUP BY gives one total per team.",
      vars: [{ key: "ana", val: 70, min: 0, max: 100 }, { key: "leo", val: 45, min: 0, max: 100 }],
      code: function (v) { return M([["ana", v.ana], ["leo", v.leo]], ["CREATE TABLE players (name TEXT, team TEXT, score INTEGER);", "INSERT INTO players VALUES", "    ('Ana', 'red', :ana), ('Leo', 'blue', :leo), ('Mia', 'red', 40),", "    ('Sam', 'blue', 25), ('Zoe', 'green', 60);", "SELECT team, COUNT(*) AS players, SUM(score) AS points", "FROM players", "GROUP BY team", "ORDER BY points DESC, team;"]); },
      run: function (v) { var rows = [["red", 2, v.ana + 40], ["blue", 2, v.leo + 25], ["green", 1, 60]]; rows.sort(function (a, b) { return b[2] - a[2] || (a[0] < b[0] ? -1 : 1); }); return tbl(["team", "players", "points"], rows); },
      explain: "GROUP BY team makes one pile per team; COUNT and SUM then run once per pile." },
    { name: "Level Up", about: "UPDATE gives a bonus to everyone with enough XP.",
      vars: [{ key: "bonus", val: 1, min: 1, max: 5 }, { key: "needed", val: 300, min: 0, max: 500 }],
      code: function (v) { return M([["bonus", v.bonus], ["needed", v.needed]], ["CREATE TABLE heroes (name TEXT, level INTEGER, xp INTEGER);", "INSERT INTO heroes VALUES ('Ana', 3, 450), ('Leo', 2, 120), ('Mia', 5, 300);", "UPDATE heroes SET level = level + :bonus WHERE xp >= :needed;", "SELECT name, level, xp FROM heroes ORDER BY name;"]); },
      run: function (v) { return tbl(["name", "level", "xp"], [["Ana", 3, 450], ["Leo", 2, 120], ["Mia", 5, 300]].map(function (r) { return [r[0], r[1] + (r[2] >= v.needed ? v.bonus : 0), r[2]]; })); },
      explain: "UPDATE only touches rows that pass the WHERE. Set needed to 0 and everyone levels up; set it to 500 and nobody does." },
    { name: "Top Players", about: "ORDER BY and LIMIT make a leaderboard.",
      vars: [{ key: "top", val: 3, min: 1, max: 8 }],
      code: function (v) { return M([["top", v.top]], ["CREATE TABLE players (name TEXT, score INTEGER);", "INSERT INTO players VALUES", "    ('Ana', 120), ('Leo', 95), ('Mia', 80), ('Sam', 150),", "    ('Zoe', 110), ('Kai', 60), ('Ivy', 135), ('Max', 70);", "SELECT name, score FROM players ORDER BY score DESC LIMIT :top;"]); },
      run: function (v) { var all = [["Ana", 120], ["Leo", 95], ["Mia", 80], ["Sam", 150], ["Zoe", 110], ["Kai", 60], ["Ivy", 135], ["Max", 70]].sort(byScoreThenName); return tbl(["name", "score"], all.slice(0, v.top)); },
      explain: "Sort first, then LIMIT keeps the top rows. Without ORDER BY, LIMIT would keep whichever rows came first." },
    { name: "Class Average", about: "AVG, MIN and MAX summarise three scores.",
      vars: [{ key: "ana", val: 72, min: 0, max: 100 }, { key: "leo", val: 95, min: 0, max: 100 }, { key: "mia", val: 64, min: 0, max: 100 }],
      code: function (v) { return M([["ana", v.ana], ["leo", v.leo], ["mia", v.mia]], ["CREATE TABLE grades (name TEXT, score INTEGER);", "INSERT INTO grades VALUES ('Ana', :ana), ('Leo', :leo), ('Mia', :mia);", "SELECT ROUND(AVG(score), 1) AS average, MIN(score) AS lowest, MAX(score) AS highest FROM grades;"]); },
      run: function (v) { var a = [v.ana, v.leo, v.mia]; return tbl(["average", "lowest", "highest"], [[R(round1((v.ana + v.leo + v.mia) / 3)), Math.min.apply(null, a), Math.max.apply(null, a)]]); },
      explain: "Aggregates turn the whole column into one row. ROUND keeps one decimal place — and always shows it, even for 80.0." },
    { name: "Sale Price", about: "A percentage discount, worked out per row.",
      vars: [{ key: "pct", val: 25, min: 0, max: 90 }],
      code: function (v) { return M([["pct", v.pct]], ["CREATE TABLE shop (item TEXT, price INTEGER);", "INSERT INTO shop VALUES ('Game', 6000), ('Book', 1250), ('Snack', 199);", "SELECT item, price, price * (100 - :pct) / 100 AS sale FROM shop ORDER BY price DESC;"]); },
      run: function (v) { return tbl(["item", "price", "sale"], [["Game", 6000], ["Book", 1250], ["Snack", 199]].map(function (r) { return [r[0], r[1], Math.floor(r[1] * (100 - v.pct) / 100)]; })); },
      explain: "Prices are in cents. Multiplying before dividing keeps the answer accurate; whole-number division then drops any fraction of a cent." },
    { name: "Grade Bands", about: "CASE turns scores into letters.",
      vars: [{ key: "ana", val: 92, min: 0, max: 100 }, { key: "leo", val: 78, min: 0, max: 100 }, { key: "mia", val: 85, min: 0, max: 100 }],
      code: function (v) { return M([["ana", v.ana], ["leo", v.leo], ["mia", v.mia]], ["CREATE TABLE grades (name TEXT, score INTEGER);", "INSERT INTO grades VALUES ('Ana', :ana), ('Leo', :leo), ('Mia', :mia);", "SELECT name, score,", "    CASE", "        WHEN score >= 90 THEN 'A'", "        WHEN score >= 80 THEN 'B'", "        WHEN score >= 70 THEN 'C'", "        ELSE 'Keep going'", "    END AS grade", "FROM grades", "ORDER BY score DESC, name;"]); },
      run: function (v) {
        function g(s) { return s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : "Keep going"; }
        return tbl(["name", "score", "grade"], [["Ana", v.ana], ["Leo", v.leo], ["Mia", v.mia]].sort(byScoreThenName).map(function (r) { return [r[0], r[1], g(r[1])]; }));
      },
      explain: "CASE checks each WHEN from the top and stops at the first true one, so 95 gets an A, not a B." },
    { name: "Fallen Heroes", about: "DELETE removes every hero with no health left.",
      vars: [{ key: "ana", val: 0, min: 0, max: 100 }, { key: "leo", val: 45, min: 0, max: 100 }],
      code: function (v) { return M([["ana", v.ana], ["leo", v.leo]], ["CREATE TABLE heroes (name TEXT, hp INTEGER);", "INSERT INTO heroes VALUES ('Ana', :ana), ('Leo', :leo), ('Mia', 30);", "DELETE FROM heroes WHERE hp <= 0;", "SELECT COUNT(*) AS standing FROM heroes;", "SELECT name, hp FROM heroes ORDER BY name;"]); },
      run: function (v) { var rows = [["Ana", v.ana], ["Leo", v.leo], ["Mia", 30]].filter(function (r) { return r[1] > 0; }); return tbl(["standing"], [[rows.length]]).concat(tbl(["name", "hp"], rows)); },
      explain: "DELETE removes only the rows its WHERE matches. Give Ana some HP and she survives." },
    { name: "Inventory Count", about: "LEFT JOIN counts every player's things, even zero.",
      vars: [{ key: "swords", val: 1, min: 0, max: 5 }, { key: "potions", val: 3, min: 0, max: 9 }],
      code: function (v) { return M([["swords", v.swords], ["potions", v.potions]], ["CREATE TABLE players (id INTEGER PRIMARY KEY, name TEXT);", "CREATE TABLE items (owner_id INTEGER REFERENCES players(id), item TEXT, qty INTEGER);", "INSERT INTO players VALUES (1, 'Ana'), (2, 'Leo'), (3, 'Mia');", "INSERT INTO items VALUES (1, 'sword', :swords), (1, 'potion', :potions), (2, 'shield', 1);", "SELECT p.name, COALESCE(SUM(i.qty), 0) AS things", "FROM players p", "LEFT JOIN items i ON i.owner_id = p.id", "GROUP BY p.id", "ORDER BY p.name;"]); },
      run: function (v) { return tbl(["name", "things"], [["Ana", v.swords + v.potions], ["Leo", 1], ["Mia", 0]]); },
      explain: "LEFT JOIN keeps Mia even though she owns nothing; her SUM is NULL, and COALESCE turns it into 0." },
    { name: "Bank Transfer", about: "A transaction moves money as one all-or-nothing change.",
      vars: [{ key: "amount", val: 30, min: 0, max: 100 }],
      code: function (v) { return M([["amount", v.amount]], ["CREATE TABLE accounts (name TEXT PRIMARY KEY, balance INTEGER);", "INSERT INTO accounts VALUES ('Ana', 100), ('Leo', 50);", "BEGIN TRANSACTION;", "UPDATE accounts SET balance = balance - :amount WHERE name = 'Ana';", "UPDATE accounts SET balance = balance + :amount WHERE name = 'Leo';", "COMMIT;", "SELECT name, balance FROM accounts ORDER BY name;", "SELECT SUM(balance) AS total FROM accounts;"]); },
      run: function (v) { return tbl(["name", "balance"], [["Ana", 100 - v.amount], ["Leo", 50 + v.amount]]).concat(tbl(["total"], [[150]])); },
      explain: "Both updates sit inside one transaction, so the money is never half-moved. Whatever the amount, the total stays 150." },
    { name: "Running Total", about: "A window function keeps a running total of coins.",
      vars: [{ key: "mon", val: 10, min: 0, max: 50 }, { key: "tue", val: 15, min: 0, max: 50 }, { key: "wed", val: 20, min: 0, max: 50 }],
      code: function (v) { return M([["mon", v.mon], ["tue", v.tue], ["wed", v.wed]], ["CREATE TABLE coins (day INTEGER, label TEXT, amount INTEGER);", "INSERT INTO coins VALUES (1, 'Mon', :mon), (2, 'Tue', :tue), (3, 'Wed', :wed), (4, 'Thu', 5);", "SELECT label, amount, SUM(amount) OVER (ORDER BY day) AS running", "FROM coins", "ORDER BY day;"]); },
      run: function (v) { var t = 0; return tbl(["label", "amount", "running"], [["Mon", v.mon], ["Tue", v.tue], ["Wed", v.wed], ["Thu", 5]].map(function (r) { t += r[1]; return [r[0], r[1], t]; })); },
      explain: "SUM … OVER (ORDER BY day) adds up every row so far, without squeezing the rows into one." },
    { name: "Race Ranks", about: "RANK gives tied runners the same place.",
      vars: [{ key: "ana", val: 52, min: 30, max: 90 }, { key: "leo", val: 60, min: 30, max: 90 }, { key: "mia", val: 47, min: 30, max: 90 }],
      code: function (v) { return M([["ana", v.ana], ["leo", v.leo], ["mia", v.mia]], ["CREATE TABLE race (name TEXT, seconds INTEGER);", "INSERT INTO race VALUES ('Ana', :ana), ('Leo', :leo), ('Mia', :mia), ('Sam', 60);", "SELECT RANK() OVER (ORDER BY seconds) AS place, name, seconds", "FROM race", "ORDER BY place, name;"]); },
      run: function (v) {
        var rows = [["Ana", v.ana], ["Leo", v.leo], ["Mia", v.mia], ["Sam", 60]];
        var ranked = rows.map(function (r) { return [1 + rows.filter(function (o) { return o[1] < r[1]; }).length, r[0], r[1]]; });
        ranked.sort(function (a, b) { return a[0] - b[0] || (a[1] < b[1] ? -1 : 1); });
        return tbl(["place", "name", "seconds"], ranked);
      },
      explain: "Fewest seconds wins. Give two runners the same time: they share a place, and the next place is skipped." },
    { name: "Above Average", about: "A subquery finds who beat the class average.",
      vars: [{ key: "ana", val: 72, min: 0, max: 100 }, { key: "leo", val: 95, min: 0, max: 100 }, { key: "mia", val: 64, min: 0, max: 100 }],
      code: function (v) { return M([["ana", v.ana], ["leo", v.leo], ["mia", v.mia]], ["CREATE TABLE grades (name TEXT, score INTEGER);", "INSERT INTO grades VALUES ('Ana', :ana), ('Leo', :leo), ('Mia', :mia);", "SELECT ROUND(AVG(score), 1) AS average FROM grades;", "SELECT name, score FROM grades", "WHERE score > (SELECT AVG(score) FROM grades)", "ORDER BY score DESC, name;"]); },
      run: function (v) {
        var avg = (v.ana + v.leo + v.mia) / 3;
        var rows = [["Ana", v.ana], ["Leo", v.leo], ["Mia", v.mia]].filter(function (r) { return r[1] > avg; }).sort(byScoreThenName);
        return tbl(["average"], [[R(round1(avg))]]).concat(tbl(["name", "score"], rows));
      },
      explain: "The subquery in brackets works out the average first; the outer query keeps scores above it. Make all three equal and nobody is above average." },
    { name: "Name Tags", about: "Text functions make name tags.",
      vars: [{ key: "keep", val: 3, min: 1, max: 8 }],
      code: function (v) { return M([["keep", v.keep]], ["CREATE TABLE players (name TEXT);", "INSERT INTO players VALUES ('Ana'), ('Leonardo'), ('Mia'), ('Sam');", "SELECT UPPER(name) AS tag, LENGTH(name) AS letters, SUBSTR(name, 1, :keep) AS short", "FROM players", "ORDER BY letters DESC, name;"]); },
      run: function (v) { return tbl(["tag", "letters", "short"], ["Leonardo", "Ana", "Mia", "Sam"].map(function (n) { return [n.toUpperCase(), n.length, n.substr(0, v.keep)]; })); },
      explain: "SUBSTR(name, 1, :keep) keeps the first letters — SQL counts from 1, not 0." },
    { name: "FizzBuzz", about: "A recursive CTE counts, and CASE says Fizz, Buzz or both.",
      vars: [{ key: "limit", val: 15, min: 1, max: 30 }],
      code: function (v) { return M([["limit", v.limit]], ["WITH RECURSIVE numbers(n) AS (", "    SELECT 1", "    UNION ALL", "    SELECT n + 1 FROM numbers WHERE n < :limit", ")", "SELECT CASE", "    WHEN n % 15 = 0 THEN 'FizzBuzz'", "    WHEN n % 3 = 0 THEN 'Fizz'", "    WHEN n % 5 = 0 THEN 'Buzz'", "    ELSE n", "END AS say", "FROM numbers;"]); },
      run: function (v) { var rows = []; for (var n = 1; n <= v.limit; n++) rows.push([n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : n]); return tbl(["say"], rows); },
      explain: "WITH RECURSIVE starts at 1 and keeps adding 1 until it reaches the limit, making a table of numbers for CASE to label." },
    { name: "Rocket Countdown", about: "A recursive CTE counts down to blast off.",
      vars: [{ key: "start", val: 5, min: 1, max: 12 }],
      code: function (v) { return M([["start", v.start]], ["WITH RECURSIVE countdown(n) AS (", "    SELECT :start", "    UNION ALL", "    SELECT n - 1 FROM countdown WHERE n > 1", ")", "SELECT n || '...' AS launch FROM countdown;", "SELECT 'Blast off!' AS rocket;"]); },
      run: function (v) { var rows = []; for (var n = v.start; n >= 1; n--) rows.push([n + "..."]); return tbl(["launch"], rows).concat(tbl(["rocket"], [["Blast off!"]])); },
      explain: "The CTE starts at your number and keeps subtracting 1 while n > 1. || glues the dots onto each number." }
  ];

  var vt = [
    { line: "SELECT * FROM {t};", why: "* reads every column." },
    { line: "SELECT {tc}, {nc} FROM {t};", why: "List the columns you want." },
    { line: "SELECT {tc} FROM {t} WHERE {nc} > {n};", why: "WHERE keeps rows that pass the test." },
    { line: "SELECT {tc} FROM {t} WHERE {nc} = {n};", why: "One = sign tests for equality." },
    { line: "SELECT {tc} FROM {t} WHERE {tc} = '{w}';", why: "Text values go in single quotes." },
    { line: "SELECT {tc} FROM {t} WHERE {nc} >= {n} AND {nc} < {n2};", why: "AND needs both tests to pass." },
    { line: "SELECT {tc} FROM {t} WHERE {nc} BETWEEN {d} AND {n};", why: "BETWEEN includes both ends." },
    { line: "SELECT {tc} FROM {t} WHERE {tc} LIKE '{L}%';", why: "% matches any run of letters." },
    { line: "SELECT {tc} FROM {t} WHERE {nc} IN ({d}, {n}, {n2});", why: "IN matches any value in the list." },
    { line: "SELECT {tc} FROM {t} WHERE {tc} IS NULL;", why: "IS NULL finds missing values." },
    { line: "SELECT {tc} FROM {t} WHERE {nc} IS NOT NULL;", why: "IS NOT NULL skips missing values." },
    { line: "SELECT {tc}, {nc} FROM {t} ORDER BY {nc} DESC;", why: "DESC sorts biggest first." },
    { line: "SELECT {tc} FROM {t} ORDER BY {nc} LIMIT {d};", why: "LIMIT keeps the first few rows." },
    { line: "SELECT {tc} FROM {t} ORDER BY {nc} DESC LIMIT {d} OFFSET {n};", why: "OFFSET skips rows first: a page of results." },
    { line: "SELECT DISTINCT {tc} FROM {t};", why: "DISTINCT removes duplicates." },
    { line: "SELECT COUNT(*) FROM {t};", why: "COUNT(*) counts rows." },
    { line: "SELECT COUNT(*) FROM {t} WHERE {nc} > {n};", why: "Count only the rows that pass." },
    { line: "SELECT SUM({nc}) FROM {t};", why: "SUM adds up a column." },
    { line: "SELECT AVG({nc}) FROM {t};", why: "AVG averages a column, skipping NULLs." },
    { line: "SELECT MAX({nc}), MIN({nc}) FROM {t};", why: "The largest and smallest values." },
    { line: "SELECT {tc}, COUNT(*) FROM {t} GROUP BY {tc};", why: "One count per group." },
    { line: "SELECT team, SUM({nc}) FROM {t} GROUP BY team HAVING SUM({nc}) > {n};", why: "HAVING filters groups." },
    { line: "SELECT {tc}, {nc} * {d} AS boosted FROM {t};", why: "SELECT can calculate; AS names the result." },
    { line: "SELECT UPPER({tc}) FROM {t};", why: "UPPER makes capitals." },
    { line: "SELECT LENGTH({tc}) FROM {t};", why: "LENGTH counts characters." },
    { line: "SELECT {tc} || ' {w}' FROM {t};", why: "|| joins text." },
    { line: "SELECT ROUND(AVG({nc}), 1) FROM {t};", why: "ROUND keeps one decimal place." },
    { line: "SELECT COALESCE({tc}, '{w}') FROM {t};", why: "COALESCE swaps NULL for a default." },
    { line: "SELECT {tc}, CASE WHEN {nc} >= {n} THEN '{w}' ELSE 'none' END FROM {t};", why: "CASE is SQL's if-else." },
    { line: "INSERT INTO {t} ({tc}, {nc}) VALUES ('{w}', {n});", why: "INSERT adds a row." },
    { line: "INSERT INTO {t} (name, team, {nc}) VALUES ('{w}', '{L}', {n});", why: "Values go in the same order as the columns." },
    { line: "UPDATE {t} SET {nc} = {nc} + {n};", why: "Without WHERE, every row changes." },
    { line: "UPDATE {t} SET {nc} = {n} WHERE {tc} = '{w}';", why: "WHERE picks which rows change." },
    { line: "UPDATE {t} SET {tc} = '{w}' WHERE id = {n};", why: "The id points at exactly one row." },
    { line: "DELETE FROM {t} WHERE {nc} < {n};", why: "DELETE removes the matching rows." },
    { line: "DELETE FROM {t} WHERE id = {n};", why: "Delete one row by its id." },
    { line: "CREATE TABLE {nt} (id INTEGER PRIMARY KEY, {tc} TEXT, {nc} INTEGER);", why: "A new table with typed columns." },
    { line: "CREATE TABLE IF NOT EXISTS {nt} (id INTEGER PRIMARY KEY, {tc} TEXT NOT NULL);", why: "IF NOT EXISTS skips it if the table is there." },
    { line: "DROP TABLE IF EXISTS {nt};", why: "DROP removes a whole table." },
    { line: "ALTER TABLE {t} ADD COLUMN {nt}_count INTEGER DEFAULT 0;", why: "ALTER TABLE adds a column." },
    { line: "CREATE INDEX idx_{t}_{nc} ON {t} ({nc});", why: "An index speeds up searches." },
    { line: "CREATE UNIQUE INDEX idx_{t}_{tc} ON {t} ({tc});", why: "A unique index also forbids duplicates." },
    { line: "SELECT p.{tc}, i.item FROM {t} p JOIN items i ON i.owner_id = p.id;", why: "JOIN pairs rows that match ON." },
    { line: "SELECT p.{tc}, COUNT(i.id) FROM {t} p LEFT JOIN items i ON i.owner_id = p.id GROUP BY p.id;", why: "LEFT JOIN keeps rows with no match." },
    { line: "SELECT item, price * qty FROM items WHERE price > {n};", why: "Calculate in SELECT, filter in WHERE." },
    { line: "SELECT {tc} FROM {t} WHERE {nc} > (SELECT AVG({nc}) FROM {t});", why: "A subquery works out a value first." },
    { line: "SELECT {tc} FROM {t} WHERE id IN (SELECT owner_id FROM items WHERE qty > {d});", why: "IN with a subquery's list." },
    { line: "SELECT {tc} FROM {t} WHERE EXISTS (SELECT 1 FROM items WHERE owner_id = {t}.id);", why: "EXISTS checks for any match." },
    { line: "WITH top AS (SELECT * FROM {t} ORDER BY {nc} DESC LIMIT {d}) SELECT {tc} FROM top;", why: "WITH names a temporary result." },
    { line: "CREATE VIEW {nt}_view AS SELECT {tc}, {nc} FROM {t};", why: "A view saves a query as a table." },
    { line: "SELECT {tc}, RANK() OVER (ORDER BY {nc} DESC) FROM {t};", why: "RANK gives ties the same place." },
    { line: "SELECT {tc}, SUM({nc}) OVER (ORDER BY id) FROM {t};", why: "A running total with a window." },
    { line: "SELECT {tc}, ROW_NUMBER() OVER (PARTITION BY team ORDER BY {nc} DESC) FROM {t};", why: "PARTITION BY restarts the count per team." },
    { line: "SAVEPOINT {nt};", why: "A savepoint is a bookmark inside a transaction." },
    { line: "SELECT {tc} FROM {t} WHERE {nc} > :{nc};", why: ":name is a parameter, filled in safely." },
    { line: "SELECT {nc} FROM {t} WHERE {tc} = :{tc};", why: "Parameters keep user text from becoming SQL." },
    { line: "SELECT {tc} FROM {t} UNION SELECT item FROM items WHERE qty > {n};", why: "UNION stacks two answers." },
    { line: "SELECT {tc}, date(joined, '+{d} days') FROM {t};", why: "date adds days to a date." },
    { line: "SELECT {tc} FROM {t} WHERE joined >= '202{d}-01-01';", why: "ISO dates compare and sort correctly as text." },
    { line: "SELECT SUBSTR({tc}, 1, {d}) FROM {t};", why: "SUBSTR cuts out part of the text." },
    { line: "SELECT {tc}, {nc} FROM {t} WHERE {nc} > {n} ORDER BY {nc} DESC LIMIT {d};", why: "Filter, sort and limit together." },
    { line: "SELECT team, AVG({nc}) AS avg_{nc} FROM {t} GROUP BY team ORDER BY avg_{nc} DESC;", why: "Sort groups by their aggregate." },
    { line: "RELEASE {nt};", why: "RELEASE keeps the changes since the savepoint." },
    { line: "ROLLBACK TO {nt};", why: "ROLLBACK TO undoes back to the savepoint." }
  ];
  var themes = [
    { name: "First Queries", t: [0, 1, 2, 3, 4] },
    { name: "Filters", t: [2, 3, 5, 6, 7] },
    { name: "More Filters", t: [8, 9, 10, 6, 7] },
    { name: "Sorting", t: [11, 12, 13, 60, 14] },
    { name: "Counting", t: [15, 16, 17, 18, 19] },
    { name: "Grouping", t: [20, 21, 61, 19, 16] },
    { name: "Calculations", t: [22, 23, 24, 25, 59] },
    { name: "NULL & Choices", t: [9, 10, 27, 28, 26] },
    { name: "Inserting", t: [29, 30, 32, 33, 31] },
    { name: "Changing Data", t: [31, 32, 33, 34, 35] },
    { name: "Tables", t: [36, 37, 38, 39, 49] },
    { name: "Indexes", t: [40, 41, 36, 37, 38] },
    { name: "Joins", t: [42, 43, 44, 47, 46] },
    { name: "Subqueries", t: [45, 46, 47, 48, 56] },
    { name: "Window Functions", t: [50, 51, 52, 60, 26] },
    { name: "Dates", t: [57, 58, 1, 11, 29] },
    { name: "Parameters", t: [54, 55, 2, 3, 32] },
    { name: "Text", t: [23, 24, 25, 59, 7] },
    { name: "Transactions", t: [53, 62, 63, 31, 34, 29] },
    { name: "SQL Masters", t: [43, 45, 48, 52, 61] }
  ];
  /* Vault lines are compiled against one shared game database: six
     people tables with the same columns, plus items. */
  var TABLES = ["players", "heroes", "robots", "pets", "wizards", "knights"];
  var NUMCOLS = ["score", "level", "hp", "coins", "xp"];
  var TEXTCOLS = ["name", "team", "city"];
  var NEWTABLES = ["dragons", "castles", "rockets", "potions", "shields", "gardens", "comets", "falcons", "turtles", "beacons"];
  function pick(bank, r) { return bank[Math.floor(r() * bank.length)]; }

  return {
    blocks: blocks, chapters: chapters, shelves: shelves, glossary: glossary, field: field, cheats: cheats,
    projects: projects, vt: vt, themes: themes,
    fill: function (k, r) {
      if (k === "t") return pick(TABLES, r);
      if (k === "nc") return pick(NUMCOLS, r);
      if (k === "tc") return pick(TEXTCOLS, r);
      if (k === "nt") return pick(NEWTABLES, r);
      return null;
    },
    sandboxNote: "Thirty everyday SQL statements, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your SQL progress is saved separately from every other track.",
    sourcesHTML: 'SQL facts and syntax follow the <a href="https://sqlite.org/lang.html">SQLite documentation</a> (SQLite 3.45), with notes where <a href="https://www.postgresql.org/docs/">PostgreSQL</a> and MySQL differ. Every explanation is written in Code Block’s own words, and every practice program is run by the real sqlite3 shell before it ships.'
  };
});
