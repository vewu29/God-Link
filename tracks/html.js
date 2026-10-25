"use strict";
/* ================= HTML & CSS — a Code Block track =================
   Written fresh for Code Block in plain words. Facts follow the HTML
   Living Standard (html.spec.whatwg.org), the CSS specifications and
   MDN Web Docs. In tests/content every page — each PC project, each
   library example — passes the W3C Nu HTML Checker with its CSS
   checker on, and is drawn by a real browser: a project's visible
   text must match the app, and the styles its numbers set must
   compute to those numbers. Every drill and Vault line is checked by
   the Nu checker inside a small page. */
cbRegisterTrack("html", function () {
  function src(lines) { return lines.join("\n"); }
  /* A whole page for a library example: the head holds the charset,
     the title and any styles; the body holds what you see. */
  function doc(title, style, body, head) {
    var out = ["<!DOCTYPE html>", '<html lang="en">', "<head>", '  <meta charset="utf-8">'].concat(head || [], ["  <title>" + title + "</title>"]);
    if (style && style.length) out = out.concat(["  <style>"], style.map(function (l) { return l ? "    " + l : ""; }), ["  </style>"]);
    return src(out.concat(["</head>", "<body>"], body.map(function (l) { return l ? "  " + l : ""; }), ["</body>", "</html>"]));
  }

  var blocks = [
    { name: "Doctype Block", short: "<!DOCTYPE>", chapter: "HTML Ch. 1 · Your First Page", icon: "i-flag", verb: "start",
      line: "<!DOCTYPE html>",
      explain: "The first line of every web page. It tells the browser to use modern HTML rules." },
    { name: "Heading Block", short: "<h1>", chapter: "HTML Ch. 1 · Your First Page", icon: "i-say", verb: "title",
      line: "<h1>Hello, world!</h1>",
      explain: "Tags come in pairs: <h1> opens a big heading and </h1> closes it. The text between them is what you see." },
    { name: "Paragraph Block", short: "<p>", chapter: "HTML Ch. 2 · Text and Headings", icon: "i-rows", verb: "write",
      line: "<p>Welcome to my page.</p>",
      explain: "<p> holds a paragraph. The browser adds space above and below it and wraps long lines for you." },
    { name: "Strong Block", short: "<strong>", chapter: "HTML Ch. 2 · Text and Headings", icon: "i-stamp", verb: "stress",
      line: "<p>This is <strong>really</strong> important.</p>",
      explain: "<strong> marks words as important, and browsers show them in bold. <em> adds emphasis, shown in italics." },
    { name: "Link Block", short: "<a href>", chapter: "HTML Ch. 3 · Links", icon: "i-link", verb: "link",
      line: '<a href="about.html">About me</a>',
      explain: "<a> makes a link. href says where it goes: another file, another website, or a spot on the same page." },
    { name: "Email Link Block", short: "mailto:", chapter: "HTML Ch. 3 · Links", icon: "i-visit", verb: "email",
      line: '<a href="mailto:ana@example.com">Email me</a>',
      explain: "A mailto: link opens the visitor's email app with the address filled in." },
    { name: "Image Block", short: "<img alt>", chapter: "HTML Ch. 4 · Images", icon: "i-eye", verb: "show",
      line: '<img src="cat.jpg" alt="A sleepy orange cat">',
      explain: "<img> shows a picture from the file in src. alt describes it for people who can't see it — and shows up if the file is missing." },
    { name: "List Item Block", short: "<li>", chapter: "HTML Ch. 5 · Lists", icon: "i-list", verb: "list",
      line: "<li>Apples</li>",
      explain: "<li> is one item in a list. Put items inside <ul> for bullet points or <ol> for numbers." },
    { name: "Numbered List Block", short: "<ol>", chapter: "HTML Ch. 5 · Lists", icon: "i-rows", verb: "number",
      line: "<ol><li>Mix</li><li>Bake</li></ol>",
      explain: "<ol> is an ordered list: the browser numbers the items 1, 2, 3 for you, so steps stay in order." },
    { name: "Table Row Block", short: "<tr><td>", chapter: "HTML Ch. 6 · Tables", icon: "i-grid", verb: "tabulate",
      line: "<tr><td>Ana</td><td>120</td></tr>",
      explain: "A table is built row by row. <tr> is a row, <td> is one cell in it, and <th> is a heading cell." },
    { name: "Label Block", short: "<label>", chapter: "HTML Ch. 7 · Forms", icon: "i-tag", verb: "label",
      line: '<label for="email">Email</label>',
      explain: "A label names a form field. for must match the field's id — then tapping the label jumps into the field." },
    { name: "Input Block", short: "<input>", chapter: "HTML Ch. 7 · Forms", icon: "i-keyboard", verb: "ask",
      line: '<input type="email" id="email" name="email" required>',
      explain: "<input> is a box to type in. type picks the kind (text, email, number), and required means it can't be left empty." },
    { name: "Button Block", short: "<button>", chapter: "HTML Ch. 7 · Forms", icon: "i-cursor", verb: "press",
      line: '<button type="submit">Sign up</button>',
      explain: "A button inside a form sends it. Real <button> elements work with a keyboard and screen readers for free." },
    { name: "Header Block", short: "<header>", chapter: "HTML Ch. 8 · Page Structure", icon: "i-layers", verb: "frame",
      line: "<header><h1>My Site</h1></header>",
      explain: "<header>, <nav>, <main> and <footer> name the parts of a page, so browsers and screen readers know what each part is." },
    { name: "Nav Block", short: "<nav>", chapter: "HTML Ch. 8 · Page Structure", icon: "i-point", verb: "guide",
      line: '<nav><a href="index.html">Home</a></nav>',
      explain: "<nav> holds the page's main links. Screen readers let people jump straight to it." },
    { name: "Stylesheet Block", short: "<link>", chapter: "CSS Ch. 9 · CSS Basics", icon: "i-file", verb: "attach",
      line: '<link rel="stylesheet" href="style.css">',
      explain: "This line goes in the <head> and connects a CSS file. One stylesheet can style every page of a site." },
    { name: "Rule Block", short: "h1 { }", chapter: "CSS Ch. 9 · CSS Basics", icon: "i-brackets", verb: "style",
      line: "h1 { color: navy; }",
      explain: "A CSS rule: the selector (h1) picks what to style, and inside the braces each property: value; pair says how." },
    { name: "Class Block", short: ".card", chapter: "CSS Ch. 10 · Selectors", icon: "i-shapes", verb: "select",
      line: ".card { background: white; }",
      explain: "A dot means a class. This rule styles every element with class=\"card\" — reuse a class as often as you like." },
    { name: "Hover Block", short: ":hover", chapter: "CSS Ch. 10 · Selectors", icon: "i-cursor", verb: "react",
      line: "a:hover { color: crimson; }",
      explain: ":hover applies while the mouse is over the element. It's called a pseudo-class: a state, not a tag." },
    { name: "Font Block", short: "font-family", chapter: "CSS Ch. 11 · Text Styling", icon: "i-pencil", verb: "letter",
      line: "font-family: Georgia, serif;",
      explain: "font-family lists fonts in order of preference. The last one, serif or sans-serif, is the safe fallback every computer has." },
    { name: "Size Block", short: "rem", chapter: "CSS Ch. 11 · Text Styling", icon: "i-sliders", verb: "size",
      line: "font-size: 1.25rem;",
      explain: "rem is relative to the page's base font size (usually 16px), so 1.25rem is 20px and grows if the visitor wants bigger text." },
    { name: "Padding Block", short: "padding", chapter: "CSS Ch. 12 · The Box Model", icon: "i-box", verb: "pad",
      line: "padding: 16px;",
      explain: "Every element is a box. padding is the space inside its border; margin is the space outside it." },
    { name: "Border Box Block", short: "border-box", chapter: "CSS Ch. 12 · The Box Model", icon: "i-cube", verb: "fit",
      line: "box-sizing: border-box;",
      explain: "With border-box, width includes the padding and border, so a 200px box really is 200px wide." },
    { name: "Flex Block", short: "display: flex", chapter: "CSS Ch. 13 · Flexbox", icon: "i-swap-h", verb: "line up",
      line: "display: flex;",
      explain: "display: flex lines the children up in a row. Flexbox is the everyday tool for bars, buttons and menus." },
    { name: "Space Between Block", short: "justify-content", chapter: "CSS Ch. 13 · Flexbox", icon: "i-column", verb: "spread",
      line: "justify-content: space-between;",
      explain: "justify-content spreads flex items along the row: space-between pushes the first and last to the ends." },
    { name: "Grid Block", short: "grid", chapter: "CSS Ch. 14 · Grid", icon: "i-grid", verb: "arrange",
      line: "grid-template-columns: repeat(3, 1fr);",
      explain: "On a grid, this makes three equal columns. fr means one share of the free space." },
    { name: "Gap Block", short: "gap", chapter: "CSS Ch. 14 · Grid", icon: "i-gap", verb: "space",
      line: "gap: 16px;",
      explain: "gap puts space between grid or flex items — and only between them, never around the outside." },
    { name: "Viewport Block", short: "viewport", chapter: "CSS Ch. 15 · Responsive Design", icon: "i-gauge", verb: "fit",
      line: '<meta name="viewport" content="width=device-width, initial-scale=1">',
      explain: "This head line tells phones to use their real width instead of pretending to be a desktop. Every page needs it." },
    { name: "Media Query Block", short: "@media", chapter: "CSS Ch. 15 · Responsive Design", icon: "i-sliders", verb: "adapt",
      line: "@media (max-width: 600px) {",
      explain: "Rules inside @media apply only when the test passes — here, on screens 600px wide or narrower." },
    { name: "Variable Block", short: "--brand", chapter: "CSS Ch. 16 · Colors, Variables and Motion", icon: "i-tag", verb: "name",
      line: "--brand: #0b5c7d;",
      explain: "A custom property is a CSS variable. Set it once, use it anywhere with var(--brand), and change the whole site's color in one place." }
  ];

  var chapters = [
    { title: "Your First Page", chapter: "Start here · tags, <html>, <head>, <body>", line: "<h1>Hello, world!</h1>",
      content: {
        story: ["Every web page you've ever visited is made of HTML. HTML isn't a programming language that does math — it's a markup language: you wrap text in tags to say what each part is. <h1>Hello</h1> means “this is the main heading.”",
          "A page has two halves. The <head> holds facts about the page: its title on the browser tab, its character set, and links to styles. The <body> holds everything you actually see.",
          "To try it, save the code as index.html and double-click the file: your browser opens it. Edit, save, refresh — that's the whole loop. No install needed."],
        big: "HTML wraps content in tags; the head describes the page and the body is what you see.",
        caption: "The browser reads the tags and draws the page. Tap Play.",
        demo: ["<!DOCTYPE html>", "<html lang=\"en\">", "<body><h1>Hello, world!</h1></body>", "Hello, world!"]
      },
      deep: {
        more: ["Most tags come in pairs: an opening tag <p> and a closing tag </p> with a slash. A few, like <img> and <meta>, are empty: they have no closing tag.",
          "Comments look like <!-- this -->. The browser skips them, so they're handy for notes to yourself."],
        ex: { code: doc("My First Page", null, ["<!-- A comment: the browser skips it -->", "<h1>Hello, world!</h1>", "<p>I am learning HTML.</p>"], ['  <meta name="viewport" content="width=device-width, initial-scale=1">']),
          walk: ["Line 1: modern HTML rules, please.", "Line 2: the page is in English (lang=\"en\").", "Lines 3–7: the head — the text's character set, a phone-friendly width, and the title shown on the tab: My First Page.", "Lines 8–12: the body, which is what you see.", "Line 9: a comment, never shown.", "Lines 10–11: a big heading, Hello, world!, then a paragraph, I am learning HTML."] },
        mistake: "Forgetting a closing tag, like <h1>Hello with no </h1>. The heading then swallows everything after it. Every tag you open, close."
      } },
    { title: "Text and Headings", chapter: "Words · <h1>–<h6>, <p>, <strong>, <em>, <br>", line: "<p>Welcome to my page.</p>",
      content: {
        story: ["Headings run from <h1> (the main title) down to <h6>. Use them like an outline: one <h1> for the page, <h2> for each section, <h3> inside those.",
          "<p> holds a paragraph. HTML ignores extra spaces and line breaks in your file — the browser decides where lines wrap. To force a new line inside a paragraph, use <br>.",
          "<strong> marks important words (bold) and <em> adds emphasis (italics). <hr> draws a line between topics."],
        big: "Headings outline the page, <p> holds paragraphs, and <strong> and <em> stress words.",
        caption: "A heading, then a paragraph with one strong word. Tap Play.",
        demo: ["<h1>All About Cats</h1>", "<h2>Why cats nap</h2>", "<p>Cats sleep <strong>a lot</strong>.</p>", "All About Cats"]
      },
      deep: {
        more: ["Pick a heading for its place in the outline, not its size. If an <h3> looks too big, change its size with CSS — don't skip to <h5>.",
          "Search engines and screen readers use headings to understand and jump around a page."],
        ex: { code: doc("All About Cats", null, ["<h1>All About Cats</h1>", "<h2>Why cats nap</h2>", "<p>Cats sleep for <strong>12 to 16 hours</strong> a day.</p>", "<p>They are <em>very</em> good at it.</p>", "<hr>", "<h2>A short poem</h2>", "<p>Sun on the sill,<br>a cat stays still.</p>"]),
          walk: ["Line 8: the page's one main heading: All About Cats.", "Line 9: a section heading: Why cats nap.", "Line 10: 12 to 16 hours shows in bold.", "Line 11: very shows in italics.", "Line 12: a line across the page.", "Lines 13–14: <br> breaks the poem onto two lines: Sun on the sill, / a cat stays still."] },
        mistake: "Pressing Enter in your file and expecting a new line on the page. HTML squeezes spaces and line breaks together; use a new <p> or a <br>."
      } },
    { title: "Links", chapter: "Connections · <a href>, pages, sites, #spots, mailto:", line: '<a href="about.html">About me</a>',
      content: {
        story: ["Links are what make the web a web. <a href=\"about.html\">About me</a> shows the words About me, and clicking them opens about.html.",
          "href can point to a file in the same folder (about.html), a file in another folder (games/space.html), another website (https://example.com), or a spot on the same page (#contact — the # means “the element with id=contact”).",
          "Write link text that makes sense on its own. “Read the rules” beats “click here,” because screen-reader users often hear a list of links with nothing around them."],
        big: "<a href=\"…\"> makes a link to a file, a website, a spot on the page, or an email address.",
        caption: "Click the words and the browser follows the href. Tap Play.",
        demo: ["<a href=\"about.html\">About me</a>", "<a href=\"https://example.com\">", "<a href=\"#contact\">", "<a href=\"mailto:ana@example.com\">"]
      },
      deep: {
        more: ["A link that starts with https:// is absolute: it works from anywhere. One without is relative: it's found starting from the current page's folder.",
          "target=\"_blank\" opens a link in a new tab. Use it sparingly — people can choose that themselves."],
        ex: { code: doc("Links", null, ["<h1>Links</h1>", "<p><a href=\"about.html\">About me</a> — a page in the same folder.</p>", "<p><a href=\"https://developer.mozilla.org/\">MDN Web Docs</a> — another website.</p>", "<p><a href=\"#contact\">Jump to contact</a> — a spot on this page.</p>", "<p><a href=\"mailto:ana@example.com\">Email Ana</a> — opens an email.</p>", "<h2 id=\"contact\">Contact</h2>", "<p>Say hello any time.</p>"]),
          walk: ["Line 8: the page's heading.", "Line 9: a relative link to another page beside this one.", "Line 10: an absolute link to another website.", "Line 11: # jumps to the element whose id is contact.", "Line 12: mailto: starts an email to Ana.", "Lines 13–14: the spot the jump link lands on: Contact."] },
        mistake: "Linking with spaces or capitals that don't match the file name: href=\"About Me.html\" won't find about-me.html. Name files in lowercase, with dashes instead of spaces."
      } },
    { title: "Images", chapter: "Pictures · <img>, src, alt, width, <figure>", line: '<img src="cat.jpg" alt="A sleepy orange cat">',
      content: {
        story: ["<img src=\"cat.jpg\" alt=\"A sleepy orange cat\"> shows a picture. src is the file to show, and alt is a short description of it.",
          "alt matters. Screen readers read it aloud to blind visitors, search engines read it, and the browser shows it when the picture can't load. Describe what the picture shows; for decoration that adds nothing, use an empty alt=\"\".",
          "Give images a width and height so the page doesn't jump while they load. <figure> with <figcaption> adds a visible caption."],
        big: "<img> needs a src to show and an alt that describes it.",
        caption: "The file loads into the box; if it can't, the alt text stands in. Tap Play.",
        demo: ["<img src=\"cat.jpg\"", "     alt=\"A sleepy orange cat\">", "<figure> … <figcaption>", "The park, seen from above."]
      },
      deep: {
        more: ["Common image files are .jpg for photos, .png for graphics with sharp edges, .svg for logos and icons that stay crisp at any size, and .webp for small, modern files.",
          "Big photos make pages slow. Shrink them to the size you'll show before putting them on a site."],
        ex: { code: doc("Images", null, ["<img src=\"cat.jpg\" alt=\"A sleepy orange cat\" width=\"300\" height=\"200\">", "<figure>", "  <img src=\"park.png\" alt=\"Map of the park with the lake in the middle\" width=\"300\" height=\"200\">", "  <figcaption>The park, seen from above.</figcaption>", "</figure>", "<img src=\"divider.png\" alt=\"\">"]),
          walk: ["Line 8: a photo, 300 by 200 pixels. There's no cat.jpg next to this example, so the browser shows the alt text instead — exactly why alt matters.", "Lines 9–12: a figure with a caption under it: The park, seen from above.", "Line 13: an empty alt tells screen readers to skip a purely decorative image."] },
        mistake: "Writing alt=\"image\" or leaving alt out. Say what the picture shows, the way you'd describe it over the phone."
      } },
    { title: "Lists", chapter: "Lists · <ul>, <ol>, <li>, nesting", line: "<li>Apples</li>",
      content: {
        story: ["HTML has two everyday lists. <ul> is an unordered list, shown with bullet points. <ol> is an ordered list, numbered for you. Each item goes in its own <li>.",
          "A list can live inside a list item: put a whole <ul> inside an <li> to make sub-points.",
          "Menus are lists too. Most navigation bars are a <ul> of links, styled with CSS to sit in a row."],
        big: "<ul> makes bullets, <ol> makes numbers, and every item goes in an <li>.",
        caption: "Bullets for things, numbers for steps. Tap Play.",
        demo: ["<ul>", "  <li>Tent</li>", "  <li>Snacks</li>", "</ul>"]
      },
      deep: {
        more: ["<ol start=\"5\"> starts counting at 5, and <ol reversed> counts down.",
          "Only <li> may sit directly inside <ul> or <ol>. Put anything else inside an <li>."],
        ex: { code: doc("Packing", null, ["<h1>Camping Trip</h1>", "<h2>Packing list</h2>", "<ul>", "  <li>Tent</li>", "  <li>Flashlight</li>", "  <li>Snacks", "    <ul>", "      <li>Apples</li>", "      <li>Crackers</li>", "    </ul>", "  </li>", "</ul>", "<h2>Pitching the tent</h2>", "<ol>", "  <li>Lay out the groundsheet.</li>", "  <li>Push in the poles.</li>", "  <li>Peg down the corners.</li>", "</ol>"]),
          walk: ["Line 8: the page's heading: Camping Trip.", "Lines 9–19: bullet points: Tent, Flashlight, Snacks — and under Snacks, a smaller list: Apples, Crackers.", "Lines 20–25: numbered steps, 1 to 3, in order."] },
        mistake: "Putting text straight inside <ul> without an <li>. Every item needs its own <li>."
      } },
    { title: "Tables", chapter: "Grids of data · <table>, <tr>, <th>, <td>, <caption>", line: "<tr><td>Ana</td><td>120</td></tr>",
      content: {
        story: ["Tables are for data with rows and columns: scores, prices, timetables. A table is written one row at a time: <tr> is a row, and each <td> in it is a cell.",
          "<th> is a heading cell, shown in bold. scope=\"col\" says it heads a column, so screen readers can announce “Score: 120” as they move through the table.",
          "<caption> gives the table a title. <thead> and <tbody> group the heading rows and the data rows."],
        big: "A table is built from rows (<tr>) of cells (<td>), with <th> for the headings.",
        caption: "Row by row, the cells line up into columns. Tap Play.",
        demo: ["<table>", "  <tr><th>Player</th><th>Score</th></tr>", "  <tr><td>Ana</td><td>120</td></tr>", "</table>"]
      },
      deep: {
        more: ["colspan=\"2\" makes a cell stretch across two columns; rowspan does the same downwards.",
          "Don't use tables to lay out a page. That's what CSS flexbox and grid are for."],
        ex: { code: doc("High Scores", null, ["<table>", "  <caption>High scores</caption>", "  <thead>", "    <tr><th scope=\"col\">Player</th><th scope=\"col\">Score</th></tr>", "  </thead>", "  <tbody>", "    <tr><td>Mia</td><td>140</td></tr>", "    <tr><td>Ana</td><td>120</td></tr>", "    <tr><td>Leo</td><td>95</td></tr>", "  </tbody>", "</table>"]),
          walk: ["Line 9: the table's title: High scores.", "Lines 10–12: the heading row: Player, Score.", "Lines 13–17: three rows of data: Mia 140, Ana 120, Leo 95."] },
        mistake: "A row with a missing cell. Count the cells: every row should have as many as the heading row, or the columns slide out of line."
      } },
    { title: "Forms", chapter: "Asking questions · <form>, <label>, <input>, <button>", line: '<label for="email">Email</label>',
      content: {
        story: ["Forms collect answers: sign-ups, searches, orders. A <form> wraps the fields, and its action says where the answers are sent.",
          "Each field is an <input> with a type: text, email, number, password, checkbox and more. Phones show the right keyboard for each type — an @ key for email, digits for number.",
          "Every field needs a <label>. Its for matches the input's id, so tapping the label focuses the field and screen readers read the label aloud. A <button type=\"submit\"> sends the form."],
        big: "A form is labelled inputs plus a submit button; for and id tie each label to its field.",
        caption: "Each label points at its box, and the button sends them all. Tap Play.",
        demo: ["<label for=\"email\">Email</label>", "<input type=\"email\" id=\"email\">", "<button type=\"submit\">", "Sign up"]
      },
      deep: {
        more: ["required stops the form from sending until the field is filled in, and type=\"email\" checks for an @. The browser does this for free — but a server must still check everything again.",
          "name is the label the answer travels under when the form is sent: name=\"email\" sends email=ana@example.com."],
        ex: { code: doc("Sign Up", null, ["<form action=\"/signup\" method=\"post\">", "  <p>", "    <label for=\"name\">Name</label>", "    <input type=\"text\" id=\"name\" name=\"name\" required>", "  </p>", "  <p>", "    <label for=\"email\">Email</label>", "    <input type=\"email\" id=\"email\" name=\"email\" required>", "  </p>", "  <p>", "    <label for=\"age\">Age</label>", "    <input type=\"number\" id=\"age\" name=\"age\" min=\"5\" max=\"120\">", "  </p>", "  <p>", "    <input type=\"checkbox\" id=\"news\" name=\"news\">", "    <label for=\"news\">Send me the newsletter</label>", "  </p>", "  <button type=\"submit\">Sign up</button>", "</form>"]),
          walk: ["Line 8: the form sends its answers to /signup.", "Lines 9–16: Name and Email, both required; email must contain an @.", "Lines 17–20: Age only accepts numbers from 5 to 120.", "Lines 21–24: a checkbox, with its label after it.", "Line 25: Sign up sends the form."] },
        mistake: "A placeholder instead of a label. Placeholder text disappears as soon as you type, and many screen readers skip it. Always add a <label>."
      } },
    { title: "Page Structure", chapter: "Landmarks · <header>, <nav>, <main>, <section>, <footer>", line: "<header><h1>My Site</h1></header>",
      content: {
        story: ["A real page has parts: a header with the site's name, navigation links, the main content, and a footer. HTML has a tag for each: <header>, <nav>, <main> and <footer>.",
          "Inside <main>, <section> groups a topic with its heading, and <article> holds something that makes sense on its own, like a blog post or a game card.",
          "These tags look like plain boxes, but they tell browsers, search engines and screen readers what each part is for. A screen-reader user can jump straight to <main> or <nav>."],
        big: "<header>, <nav>, <main>, <section>, <article> and <footer> say what each part of the page is.",
        caption: "The page splits into named parts, top to bottom. Tap Play.",
        demo: ["<header> … </header>", "<nav> … </nav>", "<main> … </main>", "<footer> … </footer>"]
      },
      deep: {
        more: ["<div> is a box with no meaning, for styling only. Reach for a meaningful tag first, and use <div> when nothing else fits.",
          "Use one <main> per page."],
        ex: { code: doc("Ana's Games", null, ["<header>", "  <h1>Ana's Games</h1>", "  <nav>", "    <a href=\"#games\">Games</a>", "    <a href=\"#about\">About</a>", "  </nav>", "</header>", "<main>", "  <section id=\"games\">", "    <h2>Games</h2>", "    <article>", "      <h3>Space Run</h3>", "      <p>Dodge asteroids for as long as you can.</p>", "    </article>", "  </section>", "  <section id=\"about\">", "    <h2>About</h2>", "    <p>I make small games in my spare time.</p>", "  </section>", "</main>", "<footer>", "  <p>Made by Ana, 2025</p>", "</footer>"]),
          walk: ["Lines 8–14: the header: the site's name and its navigation links.", "Lines 15–27: the main content, in two sections.", "Lines 18–21: an article: one game, complete on its own.", "Lines 28–30: the footer, at the bottom."] },
        mistake: "Building everything from <div>s. The page may look the same, but nobody — not search engines, not screen readers — can tell the header from the footer."
      } },
    { title: "CSS Basics", chapter: "Style · selectors, properties, <style>, <link>", line: "h1 { color: navy; }",
      content: {
        story: ["HTML says what things are; CSS says how they look. A CSS rule has a selector and a block of declarations: h1 { color: navy; } makes every h1 navy.",
          "Each declaration is property: value; — the colon between them and the semicolon at the end. A rule can hold as many as you like.",
          "CSS can live in a <style> tag in the head, or in its own file connected with <link rel=\"stylesheet\" href=\"style.css\">. A separate file is best for real sites: every page shares one look."],
        big: "A CSS rule is selector { property: value; } — the selector picks, the declarations style.",
        caption: "The rule finds every h1 and paints it navy. Tap Play.",
        demo: ["h1 {", "  color: navy;", "}", "<h1> turns navy"]
      },
      deep: {
        more: ["Colors can be names (navy, crimson), hex codes (#0b5c7d), rgb(11, 92, 125) or hsl(197, 84%, 27%).",
          "style=\"color: red;\" on a single tag is an inline style. It works, but it's hard to change later — keep styles in CSS rules."],
        ex: { code: doc("Styled Page", ["body {", "  background-color: #fdf6e3;", "  color: #333333;", "}", "h1 {", "  color: navy;", "}"], ["<h1>Hello, CSS!</h1>", "<p>The background is cream and this text is dark gray.</p>", "<p style=\"color: crimson;\">This one has its own inline style.</p>"]),
          walk: ["Lines 6–14: a <style> block in the head, holding two rules.", "Lines 7–10: the body gets a cream background and dark gray text.", "Lines 11–13: headings turn navy.", "Lines 17–19: the page: a navy heading, a gray paragraph, and one crimson paragraph from its inline style."] },
        mistake: "Forgetting a semicolon: color: navy font-size: 20px. The browser can't tell where one declaration ends, so it throws both away."
      } },
    { title: "Selectors", chapter: "Picking · tags, .classes, #ids, descendants, :hover", line: ".card { background: white; }",
      content: {
        story: ["Selectors choose what a rule styles. A tag name (p) picks every <p>. A class (.note) picks every element with class=\"note\". An id (#intro) picks the one element with id=\"intro\".",
          "Combine them: nav a picks links inside a nav. p.note picks only paragraphs with the note class. Pseudo-classes pick states: a:hover while the mouse is over a link, li:first-child for the first item.",
          "When two rules disagree, the more specific one wins: an id beats a class, and a class beats a tag. If they're equally specific, the later rule wins."],
        big: "Tags, .classes and #ids pick elements; the more specific selector wins a tie.",
        caption: "Each selector lights up the elements it picks. Tap Play.",
        demo: ["p { … }", ".note { … }", "#intro { … }", "nav a:hover { … }"]
      },
      deep: {
        more: ["Classes are the workhorse: give elements meaningful class names like card or price, and style those.",
          "An element can have several classes: class=\"card featured\" matches both .card and .featured."],
        ex: { code: doc("Selectors", ["p { color: #333333; }", ".note { background: #fff3c4; padding: 8px; }", "#intro { font-weight: bold; }", "nav a { margin-right: 12px; }", "a:hover { color: crimson; }", "li:first-child { color: green; }"], ["<p id=\"intro\">Selectors pick what a rule styles.</p>", "<p class=\"note\">A class can be used on many elements.</p>", "<nav><a href=\"#intro\">Top</a> <a href=\"#list\">List</a></nav>", "<ul id=\"list\">", "  <li>The first item is green</li>", "  <li>The second item is not</li>", "</ul>"]),
          walk: ["Line 7: every paragraph is dark gray.", "Line 8: the .note paragraph gets a yellow background.", "Line 9: the #intro paragraph is bold.", "Line 10: links inside the nav get space between them.", "Line 11: links turn crimson when you hover over them.", "Line 12: only the first list item is green."] },
        mistake: "Writing note { … } instead of .note { … }. Without the dot, CSS looks for a <note> tag, finds none, and nothing changes."
      } },
    { title: "Text Styling", chapter: "Type · font-family, font-size, rem, line-height, text-align", line: "font-family: Georgia, serif;",
      content: {
        story: ["Text is most of the web, so CSS has plenty for it. font-family picks the font, font-size its size, font-weight how bold, and line-height the space between lines.",
          "Sizes in rem are relative to the page's base size, usually 16px: 1rem is 16px, 2rem is 32px. Visitors who set their browser to bigger text get bigger text everywhere — px would ignore them.",
          "text-align lines text up left, right or centered. text-transform: uppercase shows capitals without changing the HTML."],
        big: "font-family, font-size (in rem), font-weight and line-height make text easy to read.",
        caption: "The same words in different fonts, sizes and weights. Tap Play.",
        demo: ["font-family: Georgia, serif;", "font-size: 1.25rem;", "line-height: 1.6;", "text-align: center;"]
      },
      deep: {
        more: ["A line-height of about 1.5 makes paragraphs comfortable to read. A plain number like 1.5 means 1.5 times the font size.",
          "Lines of about 60 to 75 characters are easiest to read; max-width: 65ch on paragraphs keeps them there."],
        ex: { code: doc("The Daily Pixel", ["body { font-family: Georgia, serif; line-height: 1.6; }", "h1 { font-family: Arial, sans-serif; font-size: 2.5rem; text-align: center; }", ".small { font-size: 0.875rem; color: #555555; }", ".loud { font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; }"], ["<h1>The Daily Pixel</h1>", "<p>Georgia is a serif font: small strokes on the letters guide the eye along a line.</p>", "<p class=\"loud\">Breaking news</p>", "<p class=\"small\">Small print, still readable.</p>"]),
          walk: ["Line 7: Georgia for the body, with roomy lines.", "Line 8: the heading in Arial, 2.5 times the base size, centered.", "Line 9: small, softer text.", "Line 10: bold, spaced-out capitals.", "Line 16: the HTML says Breaking news, but the page shows BREAKING NEWS."] },
        mistake: "Setting every size in px. Visitors who need bigger text can't get it. Use rem for font sizes."
      } },
    { title: "The Box Model", chapter: "Boxes · content, padding, border, margin, box-sizing", line: "padding: 16px;",
      content: {
        story: ["To CSS, every element is a box with four layers. In the middle is the content. Around it is padding, then the border, then margin — empty space that pushes other boxes away.",
          "padding: 16px adds space inside the border on all four sides. margin: 0 auto gives a box no space above and below and equal space left and right, which centers it.",
          "By default, width sets only the content, so padding and border make the box wider than you asked. box-sizing: border-box makes width include them — most sites switch it on for everything."],
        big: "Content, padding, border, margin — and border-box makes width mean the whole box.",
        caption: "The box grows layer by layer: content, padding, border, margin. Tap Play.",
        demo: ["width: 200px;", "padding: 20px;", "border: 5px solid;", "margin: 30px;"]
      },
      deep: {
        more: ["One value sets all four sides; two set top-and-bottom then left-and-right: padding: 8px 16px.",
          "Your browser's developer tools (right-click, Inspect) draw the box model of any element, with every number."],
        ex: { code: doc("Boxes", [".box {", "  width: 200px;", "  padding: 20px;", "  border: 5px solid #e76f51;", "  margin: 30px;", "}", ".sized {", "  box-sizing: border-box;", "}"], ["<div class=\"box\">200 + 40 + 10 = 250px wide</div>", "<div class=\"box sized\">border-box: 200px wide in total</div>"]),
          walk: ["Lines 7–12: a 200px box with 20px padding, a 5px border and a 30px margin.", "Line 19: by default the box is 200 + 20 + 20 + 5 + 5 = 250px wide.", "Lines 13–15 and 20: border-box squeezes padding and border inside, so this one is 200px wide."] },
        mistake: "Setting width: 100% and padding together without border-box. The box ends up wider than its parent and the page scrolls sideways."
      } },
    { title: "Flexbox", chapter: "Rows · display: flex, justify-content, align-items, gap, wrap", line: "display: flex;",
      content: {
        story: ["display: flex on a parent lines its children up in a row. It's the everyday tool for navigation bars, button groups, and anything that sits side by side.",
          "justify-content spreads the items along the row: flex-start, center, space-between. align-items lines them up across it: center puts them in the middle vertically.",
          "gap adds space between items. flex-wrap: wrap lets them flow onto a new line when the row runs out of room, which is perfect for phones."],
        big: "display: flex makes a row; justify-content spreads it, align-items centers it, gap spaces it.",
        caption: "Three boxes slide into a row and spread out. Tap Play.",
        demo: ["display: flex;", "justify-content: space-between;", "align-items: center;", "gap: 12px;"]
      },
      deep: {
        more: ["flex-direction: column stacks the items instead, and then justify-content works up and down.",
          "flex: 1 on a child lets it grow to fill the leftover space."],
        ex: { code: doc("Flexbox", [".row {", "  display: flex;", "  justify-content: space-between;", "  align-items: center;", "  gap: 12px;", "  padding: 12px;", "  background: #e8f1fb;", "}", ".row div { background: #2f6db5; color: white; padding: 8px 12px; }", ".tall { padding-top: 24px; padding-bottom: 24px; }"], ["<div class=\"row\">", "  <div>Left</div>", "  <div class=\"tall\">Middle</div>", "  <div>Right</div>", "</div>"]),
          walk: ["Lines 7–14: the parent becomes a flex row.", "Line 9: space-between pushes Left and Right to the ends.", "Line 10: the shorter boxes line up with the middle of the tall one.", "Lines 20–24: Left, Middle and Right, side by side."] },
        mistake: "Putting display: flex on the children instead of their parent. Flexbox is set on the container; its direct children are the ones that line up."
      } },
    { title: "Grid", chapter: "Layouts · display: grid, columns, fr, gap, span", line: "grid-template-columns: repeat(3, 1fr);",
      content: {
        story: ["Flexbox handles one row; grid handles rows and columns at once. display: grid on a parent, then grid-template-columns says how many columns and how wide.",
          "repeat(3, 1fr) makes three equal columns: fr is one share of the free space. 200px 1fr makes a fixed sidebar beside a stretchy column.",
          "Children fill the grid in order, one cell each. grid-column: span 2 lets an item stretch across two columns."],
        big: "display: grid plus grid-template-columns lays children out in rows and columns.",
        caption: "Items drop into the grid, one cell at a time. Tap Play.",
        demo: ["display: grid;", "grid-template-columns: repeat(3, 1fr);", "gap: 8px;", "grid-column: span 2;"]
      },
      deep: {
        more: ["repeat(auto-fit, minmax(160px, 1fr)) makes as many columns as fit, each at least 160px — a responsive card grid in one line.",
          "Grid and flexbox work together: a grid for the page, flexbox inside each card."],
        ex: { code: doc("Grid", [".gallery {", "  display: grid;", "  grid-template-columns: repeat(3, 1fr);", "  gap: 8px;", "}", ".gallery div { background: #2f6db5; color: white; padding: 24px 0; text-align: center; }", ".wide { grid-column: span 2; }"], ["<div class=\"gallery\">", "  <div>1</div>", "  <div class=\"wide\">2 (two columns)</div>", "  <div>3</div>", "  <div>4</div>", "  <div>5</div>", "</div>"]),
          walk: ["Lines 7–11: a grid of three equal columns with 8px gaps.", "Line 13: an item that spans two columns.", "Lines 17–23: row one holds 1 and the wide 2; row two holds 3, 4 and 5."] },
        mistake: "Using grid where a simple row would do. For one line of items, flexbox is simpler; reach for grid when you need rows and columns together."
      } },
    { title: "Responsive Design", chapter: "Every screen · viewport, @media, %, max-width, mobile first", line: "@media (max-width: 600px) {",
      content: {
        story: ["People visit on phones, tablets and wide monitors, so a page has to fit them all. Step one: the viewport meta tag in the head, so phones show the page at their real width.",
          "Step two: flexible sizes. max-width: 100% stops images overflowing; percentages and fr let boxes stretch and shrink.",
          "Step three: media queries. Rules inside @media (min-width: 600px) { … } apply only on screens at least 600px wide. Start with the phone layout, then add rules for bigger screens — that's called mobile first."],
        big: "Add the viewport tag, use flexible sizes, and let @media rules adjust the layout for each screen.",
        caption: "On a phone the cards stack; on a wide screen they sit in a row. Tap Play.",
        demo: ["<meta name=\"viewport\" …>", ".cards { grid-template-columns: 1fr; }", "@media (min-width: 600px) {", "  .cards { grid-template-columns: repeat(3, 1fr); }"]
      },
      deep: {
        more: ["Test by dragging your browser window narrow, or open the developer tools' device mode to try phone sizes.",
          "Fingers are bigger than mouse pointers: make buttons and links at least 44px tall on touch screens."],
        ex: { code: doc("Responsive Cards", [".cards { display: grid; grid-template-columns: 1fr; gap: 12px; }", ".card { background: #fff3c4; padding: 12px; }", "img { max-width: 100%; height: auto; }", "@media (min-width: 600px) {", "  .cards { grid-template-columns: repeat(3, 1fr); }", "}"], ["<div class=\"cards\">", "  <div class=\"card\">Phones see one column.</div>", "  <div class=\"card\">Wider screens see three.</div>", "  <div class=\"card\">Drag the window to watch.</div>", "</div>"], ['  <meta name="viewport" content="width=device-width, initial-scale=1">']),
          walk: ["Line 5: the viewport tag, so phones use their real width.", "Line 8: on small screens, one card per row.", "Line 10: images never grow wider than their box.", "Lines 11–13: on screens 600px and wider, three columns."] },
        mistake: "Designing only on a big monitor. Over half of all web visits come from phones — check yours at phone width first."
      } },
    { title: "Colors, Variables and Motion", chapter: "Polish · custom properties, var(), transition, :focus-visible", line: "--brand: #0b5c7d;",
      content: {
        story: ["Custom properties are CSS variables. Set them once on :root — --brand: #0b5c7d; — and use them anywhere with var(--brand). Change one line and the whole site's color changes.",
          "transition makes changes glide instead of jump: transition: background-color 0.2s; fades a button's color on hover over a fifth of a second.",
          "Polish includes everyone. :focus-visible styles the outline keyboard users follow, and @media (prefers-reduced-motion: reduce) turns motion off for people who get dizzy from it."],
        big: "--name: value; sets a variable, var(--name) uses it, and transition makes changes glide.",
        caption: "One variable changes, and every button follows. Tap Play.",
        demo: [":root { --brand: #0b5c7d; }", "background: var(--brand);", "transition: background-color 0.2s;", ":focus-visible { outline: … }"]
      },
      deep: {
        more: ["hsl() describes colors the way people think about them: hue (0–360 around the color wheel), saturation and lightness.",
          "Check that text and background have enough contrast — at least 4.5 to 1 for normal text. Browser developer tools show the ratio."],
        ex: { code: doc("Buttons", [":root {", "  --brand: #0b5c7d;", "  --accent: #b5452b;", "  --radius: 8px;", "}", ".button {", "  display: inline-block;", "  background: var(--brand);", "  color: white;", "  padding: 10px 18px;", "  border-radius: var(--radius);", "  text-decoration: none;", "  transition: background-color 0.2s ease;", "}", ".button:hover { background: var(--accent); }", ".button:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }", "@media (prefers-reduced-motion: reduce) {", "  .button { transition: none; }", "}"], ["<p><a class=\"button\" href=\"#start\">Start</a></p>", "<p id=\"start\" style=\"color: hsl(200, 80%, 30%);\">hsl() mixes hue, saturation and lightness.</p>"]),
          walk: ["Lines 7–11: three variables on :root.", "Lines 12–20: a button that uses them.", "Lines 19 and 21: hovering swaps in the accent color, fading over 0.2 seconds.", "Line 22: keyboard users see a clear outline.", "Lines 23–25: no fading for people who ask for less motion.", "Lines 29–30: a Start button, and a line of blue text made with hsl()."] },
        mistake: "Removing focus outlines with outline: none and replacing them with nothing. Keyboard users then can't see where they are. Style :focus-visible instead."
      } }
  ];

  var shelves = [
    { title: "HTML & CSS Field Guide", chapter: "Beyond the basics · HTML & CSS shelf", line: ["<details><summary>", "&lt; &gt; &amp;"],
      content: {
        story: ["HTML has over a hundred elements, but a couple of dozen do nearly all the work. A few more are worth knowing: <details> hides content until it's opened, <code> and <kbd> show code and keys, <abbr> explains short forms, and <sub> and <sup> drop or lift characters.",
          "Some characters mean something to HTML, so they're written as entities: &lt; for <, &gt; for >, and &amp; for &.",
          "MDN Web Docs (developer.mozilla.org) explains every element and property, with examples and a table of which browsers support it."],
        big: "A handful of extra elements and a few entities cover most of what's left; MDN documents the rest.",
        caption: "A details box opens, and entities print the characters HTML keeps for itself. Tap Play.",
        demo: ["<details>", "  <summary>What is HTML?</summary>", "</details>", "&lt;p&gt; shows <p>"]
      },
      deep: {
        more: ["Every browser has developer tools: right-click any part of a page and choose Inspect to see its HTML and the CSS that styles it — on any website.",
          "Can I use (caniuse.com) shows which browsers support a feature."],
        ex: { code: doc("Handy Elements", null, ["<details>", "  <summary>What is HTML?</summary>", "  <p>The language that gives a web page its structure.</p>", "</details>", "<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.</p>", "<p>Type <code>&lt;p&gt;</code> to start a paragraph.</p>", "<p><abbr title=\"Cascading Style Sheets\">CSS</abbr> makes pages look good.</p>", "<p>Water is H<sub>2</sub>O, and 2<sup>10</sup> is 1024.</p>", "<p>Fish &amp; chips &mdash; a classic.</p>"]),
          walk: ["Lines 8–11: only the summary shows — What is HTML? — until you open it.", "Line 12: keys to press, in keyboard style.", "Line 13: the entities print the tag as text: Type <p> to start a paragraph.", "Line 14: hover over CSS to see what it stands for.", "Line 15: H₂O and 2¹⁰.", "Line 16: Fish & chips — a classic."] },
        mistake: "Typing a < straight into your text. The browser may think a tag is starting and hide the words after it. Write &lt; instead."
      } },
    { title: "The Bug Hunter's Handbook", chapter: "Beyond the basics · HTML & CSS shelf", line: ["Right-click › Inspect", "validator.w3.org"],
      content: {
        story: ["Browsers never crash on bad HTML or CSS — they guess and keep going. That's friendly, but it hides mistakes. A checker finds them: paste your page into validator.w3.org, or into the CSS validator at jigsaw.w3.org/css-validator.",
          "For “why does it look like that?”, open the developer tools (right-click, Inspect). Click any element to see every CSS rule that applies to it, which rules lost, and the box model with real numbers.",
          "When rules fight, the cascade decides: !important first, then the most specific selector (ids beat classes, classes beat tags), then whichever rule comes last."],
        big: "Validators find mistakes, developer tools show which rules apply, and specificity settles fights.",
        caption: "Four rules argue about one paragraph; the most specific wins. Tap Play.",
        demo: ["p { color: green; }", "p { color: blue; }", "p.warn { color: crimson; }", "#special { color: purple; }"]
      },
      deep: {
        more: ["A crossed-out rule in the developer tools lost the cascade, or had a typo the browser couldn't read.",
          "Check the basics first: is the file saved? Is the stylesheet's href right? Is the class name spelled the same in the HTML and the CSS?"],
        ex: { code: doc("Which Rule Wins?", ["p { color: green; }", "p { color: blue; }", ".warn { color: darkorange; }", "p.warn { color: crimson; }", "#special { color: purple; }", ".tip { color: teal !important; }", "#hint { color: black; }"], ["<p>Blue: the later of two equal rules wins.</p>", "<p class=\"warn\">Crimson: p.warn is more specific than .warn.</p>", "<p class=\"warn\" id=\"special\">Purple: an id beats any number of classes.</p>", "<p class=\"tip\" id=\"hint\">Teal: !important beats even an id.</p>"]),
          walk: ["Lines 7–8: two equal rules, so the later one wins.", "Lines 9–10: a tag plus a class is more specific than a class alone.", "Line 11: an id beats classes.", "Lines 12–13: !important overrules the id — a sledgehammer, hard to undo, so save it for emergencies.", "Lines 17–20: each paragraph names the color it ends up."] },
        mistake: "A typo like colr: red. The browser silently skips what it can't read, so nothing changes and nothing complains. The validator and the developer tools both point it out."
      } },
    { title: "Accessibility for Everyone", chapter: "Beyond the basics · HTML & CSS shelf", line: ["alt=\"…\"", "<label for=\"…\">"],
      content: {
        story: ["About one in six people lives with a disability. Accessible pages work for people who can't see the screen, can't use a mouse, or need bigger text — and they're better for everyone else too.",
          "Most of it is just using HTML properly: real headings in order, alt text on images, a label on every field, real <button> and <a> elements that work with a keyboard, and lang on the <html> tag.",
          "In CSS: keep text contrast high, never hide the focus outline without replacing it, size text in rem, and respect prefers-reduced-motion."],
        big: "Real headings, alt text, labels, real buttons, strong contrast and visible focus make a page work for everyone.",
        caption: "A keyboard user tabs in, and the skip link appears first. Tap Play.",
        demo: ["<a class=\"skip\" href=\"#main\">", "<img alt=\"Tall wooden shelves\">", "<label for=\"q\">Book title</label>", "<button type=\"submit\">"]
      },
      deep: {
        more: ["Try your page with only the keyboard: Tab moves forward, Shift+Tab back, Enter follows links and presses buttons. If you get stuck or lost, so will others.",
          "Every computer and phone has a screen reader built in — VoiceOver on Apple devices, Narrator on Windows, TalkBack on Android. Try one for five minutes."],
        ex: { code: doc("Town Library", [".skip { position: absolute; left: -9999px; }", ".skip:focus { left: 8px; top: 8px; background: white; padding: 8px; }", "button { padding: 10px 16px; }"], ["<a class=\"skip\" href=\"#main\">Skip to the content</a>", "<header><h1>Town Library</h1></header>", "<main id=\"main\">", "  <h2>Find a book</h2>", "  <form action=\"/search\" role=\"search\">", "    <label for=\"q\">Book title</label>", "    <input type=\"search\" id=\"q\" name=\"q\">", "    <button type=\"submit\">Search</button>", "  </form>", "  <img src=\"shelves.jpg\" alt=\"Tall wooden shelves full of books\" width=\"300\" height=\"200\">", "</main>"]),
          walk: ["Lines 7–8 and 13: a skip link, out of sight until a keyboard user tabs to it; it jumps past the header.", "Line 14: one h1 names the page.", "Lines 15–16: the main content, opened by an h2.", "Lines 17–21: a search form with a real label and a real button.", "Line 22: the alt text says what the picture shows."] },
        mistake: "Making a “button” from a <div> with a click handler. It can't be reached with Tab and screen readers don't call it a button. Use <button>."
      } },
    { title: "Publishing Your Site", chapter: "Beyond the basics · HTML & CSS shelf", line: ["index.html", "https://ana.github.io/games/"],
      content: {
        story: ["A website is just a folder of files on a computer that's always online. index.html is the home page: visit a folder's address and the server sends its index.html.",
          "Keep things tidy: lowercase file names with dashes instead of spaces (space-run.html), a css folder for styles and an images folder for pictures. Links between your pages use relative paths, so they keep working wherever the folder goes.",
          "Free hosts like GitHub Pages, Netlify and Cloudflare Pages put a folder online with HTTPS in a few minutes. Add a description and an icon, and your site looks finished in search results and browser tabs."],
        big: "A site is a folder: index.html is the home page, and free hosts like GitHub Pages put it online.",
        caption: "The folder goes up, and the world can visit. Tap Play.",
        demo: ["my-site/", "  index.html", "  css/style.css", "  images/logo.png"]
      },
      deep: {
        more: ["Before publishing, check every page at phone width, run it through the validator, and click every link.",
          "Don't put anything secret in HTML or CSS. Anyone can read them with View Source."],
        ex: { code: doc("Ana's Games", null, ["<h1>Ana's Games</h1>", "<p><a href=\"games/space-run.html\">Space Run</a></p>", "<p><a href=\"about.html\">About me</a></p>"], ['  <meta name="viewport" content="width=device-width, initial-scale=1">', '  <meta name="description" content="Small browser games made by Ana.">', '  <link rel="icon" href="favicon.png">', '  <link rel="stylesheet" href="css/style.css">']),
          walk: ["Line 6: the description search engines show under your link.", "Line 7: the little icon on the browser tab.", "Line 8: the stylesheet, kept in a css folder.", "Line 9: the title, shown on the tab and in search results.", "Lines 13–14: links into a games folder, and to a page beside this one."] },
        mistake: "Linking to a file on your own computer, like href=\"C:/Users/Ana/site/about.html\". It works for you and for nobody else. Use relative paths: href=\"about.html\"."
      } },
    { title: "Layout Recipes", chapter: "Beyond the basics · HTML & CSS shelf", line: ["place-items: center;", "repeat(auto-fit, minmax(140px, 1fr))"],
      content: {
        story: ["A few layouts come up again and again, and modern CSS solves each in a line or two.",
          "Center anything: display: grid; place-items: center;. A card grid that fits any screen: grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)). A footer that stays at the bottom: make the body a flex column at least as tall as the screen, and let main grow.",
          "Keep these recipes handy; they cover most pages you'll build."],
        big: "place-items centers, auto-fit grids fit any screen, and a flex column pins the footer down.",
        caption: "A centered box, cards that wrap, and a footer that stays down. Tap Play.",
        demo: ["display: grid; place-items: center;", "repeat(auto-fit, minmax(140px, 1fr))", "body { display: flex; flex-direction: column; }", "main { flex: 1; }"]
      },
      deep: {
        more: ["min-height: 100vh means at least as tall as the screen: vh is one percent of the viewport's height.",
          "auto-fit makes as many columns as fit; minmax keeps each between a minimum and an equal share."],
        ex: { code: doc("Layout Recipes", ["body { margin: 0; min-height: 100vh; display: flex; flex-direction: column; font-family: sans-serif; }", "main { flex: 1; }", ".center { display: grid; place-items: center; min-height: 120px; background: #e8f1fb; }", ".cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; padding: 12px; }", ".cards div { background: #fff3c4; padding: 12px; }", "footer { background: #264653; color: white; padding: 12px; }"], ["<main>", "  <div class=\"center\">Perfectly centered</div>", "  <div class=\"cards\">", "    <div>Card A</div>", "    <div>Card B</div>", "    <div>Card C</div>", "  </div>", "</main>", "<footer>The footer stays at the bottom.</footer>"]),
          walk: ["Lines 7–8: the body is a column as tall as the screen, and main grows to fill it, which pins the footer to the bottom.", "Line 9: place-items: center centers the text both ways.", "Line 10: as many columns of 140px or more as fit.", "Lines 16–24: a centered box, three cards, and the footer."] },
        mistake: "Centering with margins and guesswork, like margin-top: 37%. It breaks on the next screen size. Use grid or flexbox centering."
      } }
  ];

  var glossary = [
    ["<!DOCTYPE html>", "The first line of a page: use modern HTML rules."],
    ["<a>", "A link."],
    ["<body>", "Holds everything you see on the page."],
    ["<button>", "A clickable button that also works with a keyboard."],
    ["<div>", "A plain box with no meaning, for styling."],
    ["<form>", "Wraps fields whose answers are sent together."],
    ["<head>", "Holds facts about the page: its title, charset and styles."],
    ["<img>", "Shows a picture."],
    ["<input>", "A field to type in or choose from."],
    ["<label>", "Names a form field."],
    ["<li>", "One item in a list."],
    ["<main>", "The page's main content; one per page."],
    ["<nav>", "The page's main links."],
    ["<p>", "A paragraph."],
    ["<span>", "A plain wrapper for words inside a line."],
    ["<table>", "Rows and columns of data."],
    ["absolute URL", "A full address starting with https://; works from anywhere."],
    ["accessibility", "Making pages work for everyone, including screen-reader and keyboard users."],
    ["align-items", "Lines flex or grid items up across the row."],
    ["alt text", "A description of an image, read aloud and shown if it can't load."],
    ["attribute", "Extra information in an opening tag, like href=\"about.html\"."],
    ["block element", "Starts on a new line and fills the width, like <p> and <div>."],
    ["border", "The line around an element's padding."],
    ["box model", "Content, padding, border and margin: the four layers of every box."],
    ["box-sizing", "border-box makes width include padding and border."],
    ["browser", "The program that reads HTML and CSS and draws the page."],
    ["cascade", "How CSS picks a winner: importance, then specificity, then order."],
    ["class", "A reusable name on elements, selected in CSS with a dot."],
    ["comment", "<!-- … --> in HTML, /* … */ in CSS: notes the browser skips."],
    ["contrast", "How much text stands out from its background; aim for 4.5 to 1 or more."],
    ["CSS", "Cascading Style Sheets: the language of how pages look."],
    ["custom property", "A CSS variable like --brand, used with var(--brand)."],
    ["declaration", "One property: value; pair."],
    ["developer tools", "The browser's built-in inspector for HTML, CSS and more."],
    ["element", "An opening tag, its content and its closing tag."],
    ["em", "A unit relative to the current font size."],
    ["entity", "A code such as &amp; or &lt; for a character HTML keeps for itself."],
    ["fallback font", "The last font in a list, like serif, that every computer has."],
    ["flexbox", "display: flex — lays children out in a row or column."],
    ["focus", "Which element the keyboard is on right now."],
    ["fr", "One share of a grid's free space."],
    ["gap", "Space between flex or grid items."],
    ["grid", "display: grid — lays children out in rows and columns."],
    ["hex color", "#rrggbb: a color written as red, green and blue in hexadecimal."],
    ["hover", "The state of an element under the mouse pointer."],
    ["href", "Where a link goes."],
    ["hsl()", "A color as hue, saturation and lightness."],
    ["HTML", "HyperText Markup Language: the structure of every web page."],
    ["id", "A unique name for one element, selected in CSS with #."],
    ["inline element", "Sits inside a line of text, like <a>, <strong> and <span>."],
    ["inline style", "A style=\"…\" attribute on one tag."],
    ["justify-content", "Spreads flex items along the row."],
    ["margin", "Space outside an element's border."],
    ["media query", "@media (…) { } — rules for certain screens only."],
    ["mobile first", "Style for phones first, then add rules for bigger screens."],
    ["nesting", "Putting elements inside other elements."],
    ["padding", "Space inside an element's border."],
    ["property", "What a declaration changes, like color or width."],
    ["pseudo-class", "A state in a selector, like :hover or :first-child."],
    ["px", "Pixels: a fixed size unit."],
    ["relative URL", "An address found from the current page's folder, like about.html."],
    ["rem", "A unit relative to the page's base font size, usually 16px."],
    ["responsive design", "Pages that adapt to any screen size."],
    ["rule", "A selector plus a block of declarations."],
    ["screen reader", "Software that reads a page aloud for people who can't see it."],
    ["selector", "The part of a CSS rule that picks elements."],
    ["semantic HTML", "Tags chosen for meaning, like <nav> and <article>, not looks."],
    ["specificity", "How strongly a selector targets: ids beat classes, classes beat tags."],
    ["src", "The file an image (or other media) loads."],
    ["stylesheet", "A file of CSS rules, linked from the head."],
    ["tag", "A word in angle brackets, like <p>, that marks up content."],
    ["transition", "Makes a style change glide over time."],
    ["validator", "A checker that finds mistakes in HTML or CSS."],
    ["var()", "Uses a custom property's value."],
    ["viewport", "The visible area of the page; set it with the viewport meta tag."],
    ["void element", "A tag with no closing tag, like <img>, <br> and <meta>."]
  ];

  var field = [
    { name: "<h1>–<h6> / <p>", head: "text", what: "Headings and paragraphs.", ex: "<h2>Rules</h2><p>Be kind.</p>" },
    { name: "<strong> / <em>", head: "text", what: "Important and emphasized words.", ex: "<strong>Stop</strong>" },
    { name: "<a href>", head: "links", what: "Links to pages, sites, spots and email.", ex: "<a href=\"#top\">Top</a>" },
    { name: "<img alt>", head: "media", what: "Pictures, always with alt text.", ex: "<img src=\"a.png\" alt=\"…\">" },
    { name: "<ul> / <ol> / <li>", head: "lists", what: "Bullets, numbers and their items.", ex: "<ul><li>Tea</li></ul>" },
    { name: "<table> / <tr> / <td>", head: "data", what: "Rows and columns of data.", ex: "<tr><td>Ana</td></tr>" },
    { name: "<form> / <label> / <input>", head: "forms", what: "Questions and answers.", ex: "<input type=\"email\" id=\"e\">" },
    { name: "<header> / <main> / <footer>", head: "structure", what: "The named parts of a page.", ex: "<main><h1>Hi</h1></main>" },
    { name: "selectors", head: "CSS", what: "Tags, .classes, #ids, :hover.", ex: "nav a:hover { }" },
    { name: "color / background", head: "CSS", what: "Text and background colors.", ex: "color: #0b5c7d;" },
    { name: "font-* / line-height", head: "CSS", what: "Fonts, sizes and spacing of text.", ex: "font-size: 1.25rem;" },
    { name: "padding / border / margin", head: "CSS", what: "The layers of the box.", ex: "padding: 8px 16px;" },
    { name: "display: flex", head: "CSS", what: "Rows and columns of items.", ex: "justify-content: center;" },
    { name: "display: grid", head: "CSS", what: "Two-way layouts.", ex: "grid-template-columns: 1fr 1fr;" },
    { name: "@media / var()", head: "CSS", what: "Responsive rules and variables.", ex: "@media (min-width: 600px) { }" }
  ];

  var cheats = [
    { title: "Page Skeleton Card", body: "Every page starts like this.", code: src(["<!DOCTYPE html>", "<html lang=\"en\">", "<head>", "  <meta charset=\"utf-8\">", "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">", "  <title>My Page</title>", "  <link rel=\"stylesheet\" href=\"style.css\">", "</head>", "<body>", "  <h1>My Page</h1>", "</body>", "</html>"]) },
    { title: "Text Card", body: "Headings, paragraphs, stress.", code: src(["<h1>Main title</h1>", "<h2>A section</h2>", "<p>Words with <strong>strong</strong> and <em>emphasis</em>.</p>", "<p>Line one<br>Line two</p>", "<hr>", "<!-- a comment -->"]) },
    { title: "Links & Images Card", body: "Point somewhere, show something.", code: src(["<a href=\"about.html\">About</a>", "<a href=\"https://example.com\">A website</a>", "<a href=\"#top\">Back to top</a>", "<a href=\"mailto:me@example.com\">Email me</a>", "<img src=\"photo.jpg\" alt=\"What the photo shows\" width=\"300\" height=\"200\">"]) },
    { title: "Lists & Tables Card", body: "Items and rows.", code: src(["<ul>", "  <li>Bullet</li>", "</ul>", "<ol>", "  <li>Step one</li>", "</ol>", "<table>", "  <tr><th scope=\"col\">Name</th><th scope=\"col\">Score</th></tr>", "  <tr><td>Ana</td><td>120</td></tr>", "</table>"]) },
    { title: "Forms Card", body: "Labels, fields, a button.", code: src(["<form action=\"/send\" method=\"post\">", "  <label for=\"name\">Name</label>", "  <input type=\"text\" id=\"name\" name=\"name\" required>", "  <label for=\"email\">Email</label>", "  <input type=\"email\" id=\"email\" name=\"email\">", "  <button type=\"submit\">Send</button>", "</form>"]) },
    { title: "Selectors Card", body: "Pick what to style.", code: src(["p { color: #333333; }", ".card { padding: 16px; }", "#title { font-size: 2rem; }", "nav a { color: navy; }", "a:hover { color: crimson; }", "li:first-child { font-weight: bold; }"]) },
    { title: "Box Card", body: "Padding, border, margin.", code: src(["* { box-sizing: border-box; }", ".box {", "  width: 300px;", "  padding: 16px;", "  border: 2px solid #333333;", "  border-radius: 8px;", "  margin: 0 auto;", "}"]) },
    { title: "Layout Card", body: "Flexbox, grid, media queries.", code: src([".row { display: flex; gap: 12px; align-items: center; }", ".bar { display: flex; justify-content: space-between; }", ".grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }", "@media (max-width: 600px) {", "  .grid { grid-template-columns: 1fr; }", "}"]) }
  ];

  /* A whole page for a PC project: the styles in the head, then the body. */
  function page(title, css, body) {
    return ["<!DOCTYPE html>", '<html lang="en">', "<head>", '  <meta charset="utf-8">', '  <meta name="viewport" content="width=device-width, initial-scale=1">', "  <title>" + title + "</title>", "  <style>"]
      .concat(css.map(function (l) { return "    " + l; }), ["  </style>", "</head>", "<body>"], body.map(function (l) { return "  " + l; }), ["</body>", "</html>"]);
  }

  /* Each project's run() is the text the page shows, line by line, and
     checks() lists the styles a real browser must compute for it:
     [selector, CSS property (or .property of the element), value]. */
  var projects = [
    { name: "Hello Page", about: "A heading and a paragraph; the number sets the heading's size.",
      vars: [{ key: "font-size", val: 32, min: 16, max: 64 }],
      code: function (v) { return page("Hello Page", ["body { font-family: sans-serif; }", "h1 { color: navy; font-size: " + v["font-size"] + "px; }"], ["<h1>Hello, world!</h1>", "<p>This is my first web page.</p>"]); },
      run: function () { return ["Hello, world!", "This is my first web page."]; },
      checks: function (v) { return [["h1", "font-size", v["font-size"] + "px"]]; },
      explain: "font-size sets how tall the heading's letters are. Change the number and open the page again: the browser redraws it at the new size." },
    { name: "Business Card", about: "A card with padding inside and rounded corners.",
      vars: [{ key: "padding", val: 16, min: 4, max: 40 }, { key: "border-radius", val: 12, min: 0, max: 30 }],
      code: function (v) { return page("Business Card", ["body { font-family: sans-serif; background: #eef2f7; }", ".card {", "  background: white;", "  padding: " + v.padding + "px;", "  border-radius: " + v["border-radius"] + "px;", "  border: 2px solid #0b5c7d;", "  max-width: 280px;", "}", "h1 { margin: 0; font-size: 24px; }", ".job { color: #555555; }"], ["<div class=\"card\">", "  <h1>Ana Lopez</h1>", "  <p class=\"job\">Game developer</p>", "  <p><a href=\"mailto:ana@example.com\">ana@example.com</a></p>", "</div>"]); },
      run: function () { return ["Ana Lopez", "Game developer", "ana@example.com"]; },
      checks: function (v) { return [[".card", "padding-top", v.padding + "px"], [".card", "border-top-left-radius", v["border-radius"] + "px"]]; },
      explain: "padding is the space between the text and the border; border-radius rounds the corners. Set the radius to 0 for sharp corners." },
    { name: "Shopping List", about: "A bulleted list with room between the items.",
      vars: [{ key: "margin-bottom", val: 8, min: 0, max: 24 }],
      code: function (v) { return page("Shopping List", ["body { font-family: sans-serif; }", "li { margin-bottom: " + v["margin-bottom"] + "px; }"], ["<h1>Shopping List</h1>", "<ul>", "  <li>Apples</li>", "  <li>Bread</li>", "  <li>Cheese</li>", "  <li>Dates</li>", "</ul>"]); },
      run: function () { return ["Shopping List", "Apples", "Bread", "Cheese", "Dates"]; },
      checks: function (v) { return [["li", "margin-bottom", v["margin-bottom"] + "px"]]; },
      explain: "One rule styles every <li> at once: margin-bottom adds space under each item." },
    { name: "Recipe Steps", about: "Headings, a paragraph and numbered steps, with roomy lines.",
      vars: [{ key: "line-height", val: 24, min: 16, max: 40 }],
      code: function (v) { return page("Pancakes", ["body { font-family: Georgia, serif; }", "ol { line-height: " + v["line-height"] + "px; }"], ["<h1>Pancakes</h1>", "<h2>You need</h2>", "<p>Flour, milk, 2 eggs and a pinch of salt.</p>", "<h2>Steps</h2>", "<ol>", "  <li>Whisk everything together.</li>", "  <li>Heat a pan with a little butter.</li>", "  <li>Cook each side until golden.</li>", "</ol>"]); },
      run: function () { return ["Pancakes", "You need", "Flour, milk, 2 eggs and a pinch of salt.", "Steps", "Whisk everything together.", "Heat a pan with a little butter.", "Cook each side until golden."]; },
      checks: function (v) { return [["ol", "line-height", v["line-height"] + "px"]]; },
      explain: "<ol> numbers the steps for you. line-height sets the height of each line of text, so bigger numbers spread the steps out." },
    { name: "Picture Frame", about: "A picture drawn with a CSS gradient, in a frame you can thicken.",
      vars: [{ key: "border", val: 8, min: 1, max: 24 }],
      code: function (v) { return page("Picture Frame", [".photo {", "  width: 200px;", "  height: 120px;", "  background: linear-gradient(#fdb36b, #e0607e);", "  border: " + v.border + "px solid #3b2f2f;", "}", "figcaption { font-family: sans-serif; }"], ["<figure>", "  <div class=\"photo\" role=\"img\" aria-label=\"An orange and pink sunset\"></div>", "  <figcaption>Sunset at the lake</figcaption>", "</figure>"]); },
      run: function () { return ["Sunset at the lake"]; },
      checks: function (v) { return [[".photo", "border-top-width", v.border + "px"]]; },
      explain: "border: 8px solid #3b2f2f is three settings in one: thickness, style and color. role=\"img\" and aria-label describe the drawn picture, like alt text does for <img>." },
    { name: "Price Table", about: "A table with a caption, heading cells and padded cells.",
      vars: [{ key: "padding", val: 8, min: 2, max: 20 }],
      code: function (v) { return page("Price Table", ["table { border-collapse: collapse; font-family: sans-serif; }", "th, td { border: 1px solid #999999; padding: " + v.padding + "px; }", "th { background: #e8eef5; }"], ["<table>", "  <caption>Fruit prices</caption>", "  <tr><th scope=\"col\">Fruit</th><th scope=\"col\">Price</th></tr>", "  <tr><td>Apple</td><td>50c</td></tr>", "  <tr><td>Pear</td><td>75c</td></tr>", "  <tr><td>Plum</td><td>30c</td></tr>", "</table>"]); },
      run: function () { return ["Fruit prices", "Fruit Price", "Apple 50c", "Pear 75c", "Plum 30c"]; },
      checks: function (v) { return [["td", "padding-top", v.padding + "px"], ["th", "padding-left", v.padding + "px"]]; },
      explain: "th, td styles both kinds of cell at once — a comma lists several selectors. border-collapse: collapse merges the cell borders into single lines." },
    { name: "Sign-Up Form", about: "Labels tied to their fields, and a button that sends them.",
      vars: [{ key: "width", val: 240, min: 120, max: 320 }],
      code: function (v) { return page("Join the Club", ["body { font-family: sans-serif; }", "label { display: block; margin-top: 12px; }", "input { width: " + v.width + "px; padding: 6px; }", "button { margin-top: 16px; padding: 8px 16px; }"], ["<h1>Join the club</h1>", "<form action=\"/join\" method=\"post\">", "  <label for=\"name\">Name</label>", "  <input type=\"text\" id=\"name\" name=\"name\" required>", "  <label for=\"email\">Email</label>", "  <input type=\"email\" id=\"email\" name=\"email\" required>", "  <button type=\"submit\">Sign up</button>", "</form>"]); },
      run: function () { return ["Join the club", "Name", "Email", "Sign up"]; },
      checks: function (v) { return [["input", "width", v.width + "px"], ["label", "display", "block"]]; },
      explain: "display: block puts each label on its own line above its field. Here the form can't really send — the preview blocks it — but on a real site the answers go to /join." },
    { name: "Navigation Bar", about: "A list of links laid out in a row with flexbox.",
      vars: [{ key: "gap", val: 24, min: 0, max: 48 }],
      code: function (v) { return page("Navigation", ["body { margin: 0; font-family: sans-serif; }", "nav { background: #0b5c7d; padding: 12px 16px; }", "nav ul { display: flex; gap: " + v.gap + "px; margin: 0; padding: 0; list-style: none; }", "nav a { color: white; text-decoration: none; }"], ["<nav>", "  <ul>", "    <li><a href=\"#home\">Home</a></li>", "    <li><a href=\"#games\">Games</a></li>", "    <li><a href=\"#about\">About</a></li>", "  </ul>", "</nav>"]); },
      run: function () { return ["Home", "Games", "About"]; },
      checks: function (v) { return [["nav ul", "column-gap", v.gap + "px"], ["nav ul", "display", "flex"]]; },
      explain: "A menu is a list of links. display: flex turns the list into a row, list-style: none removes the bullets, and gap spaces the links out." },
    { name: "Feature Cards", about: "Three cards that sit in a row and wrap on narrow screens.",
      vars: [{ key: "gap", val: 16, min: 0, max: 40 }, { key: "border-radius", val: 8, min: 0, max: 24 }],
      code: function (v) { return page("Features", ["body { font-family: sans-serif; background: #f4f6f8; }", ".cards { display: flex; flex-wrap: wrap; gap: " + v.gap + "px; }", ".card { flex: 1 1 140px; background: white; padding: 16px; border-radius: " + v["border-radius"] + "px; }", ".card h2 { margin-top: 0; font-size: 18px; }"], ["<h1>Why Code Block?</h1>", "<div class=\"cards\">", "  <div class=\"card\"><h2>Fast</h2><p>Loads in a blink.</p></div>", "  <div class=\"card\"><h2>Free</h2><p>No cost, ever.</p></div>", "  <div class=\"card\"><h2>Fun</h2><p>Learn by playing.</p></div>", "</div>"]); },
      run: function () { return ["Why Code Block?", "Fast", "Loads in a blink.", "Free", "No cost, ever.", "Fun", "Learn by playing."]; },
      checks: function (v) { return [[".cards", "column-gap", v.gap + "px"], [".card", "border-top-left-radius", v["border-radius"] + "px"]]; },
      explain: "flex: 1 1 140px means: grow to share the space, shrink if needed, start at 140px. With flex-wrap, cards that don't fit move to the next row." },
    { name: "Color Grid", about: "Six tiles on a grid; a CSS variable sets the number of columns.",
      vars: [{ key: "columns", val: 3, min: 1, max: 6 }],
      code: function (v) { var t = []; for (var i = 1; i <= 6; i++) t.push("  <div class=\"tile\">" + i + "</div>"); return page("Color Grid", [":root { --columns: " + v.columns + "; }", ".grid { display: grid; grid-template-columns: repeat(var(--columns), 1fr); gap: 8px; }", ".tile { background: #2f6db5; color: white; padding: 16px; text-align: center; font-family: sans-serif; }"], ["<div class=\"grid\">"].concat(t, ["</div>"])); },
      run: function () { return ["1", "2", "3", "4", "5", "6"]; },
      checks: function (v) { return [[".grid", "count:grid-template-columns", v.columns]]; },
      explain: "--columns is a CSS variable, and repeat(var(--columns), 1fr) makes that many equal columns. The six tiles flow into the grid row by row." },
    { name: "Centered Hero", about: "A big banner with its heading centered both ways.",
      vars: [{ key: "min-height", val: 200, min: 100, max: 400 }],
      code: function (v) { return page("Hero", [".hero {", "  min-height: " + v["min-height"] + "px;", "  display: flex;", "  justify-content: center;", "  align-items: center;", "  background: #1d3557;", "  color: white;", "  font-family: sans-serif;", "}"], ["<section class=\"hero\">", "  <h1>Centered!</h1>", "</section>"]); },
      run: function () { return ["Centered!"]; },
      checks: function (v) { return [[".hero", "min-height", v["min-height"] + "px"], [".hero", "align-items", "center"]]; },
      explain: "justify-content centers the heading across the banner, and align-items centers it up and down — however tall the banner grows." },
    { name: "Color Mixer", about: "One variable spins the hue around the color wheel.",
      vars: [{ key: "hue", val: 200, min: 0, max: 360 }],
      code: function (v) { return page("Color Mixer", [":root { --hue: " + v.hue + "; }", ".swatch {", "  background: hsl(var(--hue), 70%, 30%);", "  color: white;", "  padding: 24px;", "  font-family: sans-serif;", "}"], ["<div class=\"swatch\">", "  <h1>Hue " + v.hue + "</h1>", "  <p>Change the number to spin the color wheel.</p>", "</div>"]); },
      run: function (v) { return ["Hue " + v.hue, "Change the number to spin the color wheel."]; },
      checks: function (v) { return [[".swatch", "--hue", String(v.hue)]]; },
      explain: "hsl() takes a hue (0 to 360 around the color wheel), a saturation and a lightness. 0 is red, 120 green, 240 blue, and 360 is red again." },
    { name: "Big Button", about: "A button with padding, rounded corners and a hover color.",
      vars: [{ key: "padding", val: 12, min: 4, max: 24 }, { key: "border-radius", val: 8, min: 0, max: 30 }],
      code: function (v) { return page("Big Button", ["button {", "  font-size: 18px;", "  padding: " + v.padding + "px " + (2 * v.padding) + "px;", "  border: none;", "  border-radius: " + v["border-radius"] + "px;", "  background: #1f6f66;", "  color: white;", "}", "button:hover { background: #134e48; }"], ["<button type=\"button\">Play now</button>"]); },
      run: function () { return ["Play now"]; },
      checks: function (v) { return [["button", "padding-top", v.padding + "px"], ["button", "padding-left", 2 * v.padding + "px"], ["button", "border-top-left-radius", v["border-radius"] + "px"]]; },
      explain: "Two padding values mean top-and-bottom, then left-and-right — here the sides get twice as much. A big radius turns the button into a pill." },
    { name: "Download Progress", about: "A <progress> bar and its label show how far along you are.",
      vars: [{ key: "value", val: 40, min: 0, max: 100 }],
      code: function (v) { return page("Download", ["body { font-family: sans-serif; }", "progress { width: 100%; height: 20px; }"], ["<label for=\"download\">Downloading... " + v.value + "%</label>", "<progress id=\"download\" value=\"" + v.value + "\" max=\"100\"></progress>"]); },
      run: function (v) { return ["Downloading... " + v.value + "%"]; },
      checks: function (v) { return [["progress", ".value", v.value]]; },
      explain: "value and max are attributes: the bar fills value out of max. The label is tied to the bar with for and id, so screen readers announce both." },
    { name: "Blog Layout", about: "Header, main and footer, with the main column kept readable.",
      vars: [{ key: "max-width", val: 600, min: 300, max: 900 }],
      code: function (v) { return page("My Blog", ["body { margin: 0; font-family: sans-serif; }", "header, footer { background: #264653; color: white; padding: 12px; }", "main { max-width: " + v["max-width"] + "px; margin: 0 auto; padding: 16px; }"], ["<header><h1>My Blog</h1></header>", "<main>", "  <article>", "    <h2>First post</h2>", "    <p>Today I built my first web page.</p>", "  </article>", "</main>", "<footer><p>Made with HTML and CSS</p></footer>"]); },
      run: function () { return ["My Blog", "First post", "Today I built my first web page.", "Made with HTML and CSS"]; },
      checks: function (v) { return [["main", "max-width", v["max-width"] + "px"]]; },
      explain: "max-width stops the text column from stretching across a wide screen, and margin: 0 auto centers it. On a phone it simply fills the width." },
    { name: "Type Scale", about: "Headings sized in rem follow the page's base font size.",
      vars: [{ key: "font-size", val: 16, min: 12, max: 24 }],
      code: function (v) { return page("Type Scale", ["html { font-size: " + v["font-size"] + "px; }", "body { font-family: Georgia, serif; }", "h1 { font-size: 2rem; }", "h2 { font-size: 1.5rem; }", "p { font-size: 1rem; }"], ["<h1>Big title</h1>", "<h2>Smaller heading</h2>", "<p>Body text, one rem tall.</p>"]); },
      run: function () { return ["Big title", "Smaller heading", "Body text, one rem tall."]; },
      checks: function (v) { return [["h1", "font-size", 2 * v["font-size"] + "px"], ["h2", "font-size", 1.5 * v["font-size"] + "px"], ["p", "font-size", v["font-size"] + "px"]]; },
      explain: "rem means “times the base size on <html>.” Change the base and every size on the page scales with it: 2rem is always twice the base." },
    { name: "Box Model Lab", about: "The page works out the box's total width, and the browser agrees.",
      vars: [{ key: "width", val: 120, min: 40, max: 200 }, { key: "padding", val: 20, min: 0, max: 40 }],
      code: function (v) { return page("Box Model", [".box {", "  width: " + v.width + "px;", "  padding: " + v.padding + "px;", "  border: 4px solid #e76f51;", "  margin: 10px;", "  font-family: sans-serif;", "}"], ["<div class=\"box\">Content</div>", "<p>Total width: " + (v.width + 2 * v.padding + 8) + "px</p>"]); },
      run: function (v) { return ["Content", "Total width: " + (v.width + 2 * v.padding + 8) + "px"]; },
      checks: function (v) { return [[".box", ".offsetWidth", v.width + 2 * v.padding + 8]]; },
      explain: "The total is the width, plus padding on both sides, plus the 4px border on both sides. The margin sits outside the box, so it isn't counted." },
    { name: "Smooth Hover", about: "A link that fades to a new color, as slowly as you like.",
      vars: [{ key: "transition-duration", val: 300, min: 0, max: 2000 }],
      code: function (v) { return page("Smooth Hover", ["body { font-family: sans-serif; }", "a {", "  color: #0b5c7d;", "  transition-property: color;", "  transition-duration: " + v["transition-duration"] + "ms;", "}", "a:hover { color: #c0392b; }"], ["<p id=\"top\">Hover over <a href=\"#top\">this link</a> to watch the color fade.</p>"]); },
      run: function () { return ["Hover over this link to watch the color fade."]; },
      checks: function (v) { return [["a", "transition-duration", v["transition-duration"] / 1000 + "s"]]; },
      explain: "transition-duration sets how long the fade takes: 1000ms is one second, and 0 makes it instant. On a phone, tap and hold the link instead of hovering." }
  ];

  var vt = [
    { line: "<h1>{w}</h1>", why: "<h1> is the page's main heading." },
    { line: "<h{h}>{w} News</h{h}>", why: "Headings run from h1 down to h6." },
    { line: "<p>{w} has {n} coins.</p>", why: "<p> holds a paragraph." },
    { line: "<p>This is <strong>{w}</strong>.</p>", why: "<strong> marks important words." },
    { line: "<p><em>{w}</em> is my favorite word.</p>", why: "<em> adds emphasis." },
    { line: '<a href="{sv}.html">{w}</a>', why: "href says where the link goes." },
    { line: '<a href="mailto:{sv}@example.com">Email {w}</a>', why: "mailto: starts an email." },
    { line: '<img src="{sv}.jpg" alt="{w} at sunset">', why: "alt describes the picture." },
    { line: "<li>{w}</li>", why: "<li> is one list item." },
    { line: "<ol><li>{w}</li><li>{L}</li></ol>", why: "<ol> numbers its items." },
    { line: "<tr><td>{w}</td><td>{n}</td></tr>", why: "<tr> is a row of <td> cells." },
    { line: '<th scope="col">{w}</th>', why: "<th> heads a column." },
    { line: '<label for="{sv}">{w}</label>', why: "for matches the field's id." },
    { line: '<input type="text" id="{sv}" name="{sv}">', why: "<input> is a box to type in." },
    { line: '<input type="number" id="{v}" min="0" max="{n}">', why: "min and max limit a number." },
    { line: '<button type="button">{w}</button>', why: "A real button works with any keyboard." },
    { line: '<section id="{sv}"><h2>{w}</h2></section>', why: "A section groups a topic with its heading." },
    { line: '<nav><a href="{sv}.html">{w}</a></nav>', why: "<nav> holds the main links." },
    { line: "<footer><p>Made by {w}</p></footer>", why: "<footer> sits at the bottom." },
    { line: '<div class="{sv}">{w}</div>', why: "class names a box for CSS." },
    { line: '<span class="{sv}">{w}</span>', why: "<span> wraps words inside a line." },
    { line: '<button class="{sv}" type="button">{w}</button>', why: "A class lets CSS style the button." },
    { line: '<link rel="stylesheet" href="{sv}.css">', why: "<link> attaches a stylesheet." },
    { line: "<title>{w} Page</title>", why: "The title shows on the tab." },
    { line: '<meta name="description" content="{w} and {n} more.">', why: "A description for search results." },
    { line: "h1 { color: {col}; }", why: "selector { property: value; }" },
    { line: "p { font-size: {n}px; }", why: "One rule styles every paragraph." },
    { line: ".{sv} { background: {col}; }", why: "A dot selects a class." },
    { line: "#{sv} { margin: {n}px; }", why: "# selects an id." },
    { line: ".{sv}:hover { color: {col}; }", why: ":hover applies under the mouse." },
    { line: "color: {col};", why: "color sets the text color." },
    { line: "background-color: {col};", why: "background-color fills the box." },
    { line: "font-size: 1.{d}rem;", why: "rem follows the base font size." },
    { line: "font: {d}00 {n}px Georgia, serif;", why: "font sets weight, size and family at once." },
    { line: "line-height: 1.{d};", why: "A plain number scales with the font." },
    { line: "text-align: {align}; color: {col};", why: "Two declarations can share a line." },
    { line: "padding: {n}px;", why: "padding is space inside the border." },
    { line: "padding: {d}px {n}px;", why: "Two values: top-bottom, then left-right." },
    { line: "margin: {n}px auto;", why: "auto side margins center a box." },
    { line: "border: {d}px solid {col};", why: "Width, style and color in one." },
    { line: "border-radius: {n}px;", why: "border-radius rounds the corners." },
    { line: "width: {n}%;", why: "% is a share of the parent's width." },
    { line: "max-width: {n}0px;", why: "max-width stops a box growing too wide." },
    { line: "display: {disp};", why: "display decides how a box lays out." },
    { line: "justify-content: {jc};", why: "justify-content spreads items along the row." },
    { line: "align-items: {ai}; gap: {n}px;", why: "align-items lines items up across the row." },
    { line: "flex: {d} 1 {n}0px;", why: "grow, shrink, then the starting size." },
    { line: "grid-template-columns: repeat({d}, 1fr);", why: "Equal columns with fr." },
    { line: "gap: {n}px;", why: "gap spaces items apart." },
    { line: "grid-column: span {d};", why: "span stretches across columns." },
    { line: "@media (max-width: {n}0px) {", why: "Rules for narrow screens." },
    { line: "@media (min-width: {n}0px) { .{sv} { display: none; } }", why: "Hide something on wide screens." },
    { line: "--{sv}: {col};", why: "A custom property is a CSS variable." },
    { line: "color: var(--{sv});", why: "var() uses a variable." },
    { line: "transition: color 0.{d}s;", why: "transition makes changes glide." },
    { line: "transform: rotate({n}deg);", why: "rotate turns a box by degrees." },
    { line: "opacity: 0.{d};", why: "opacity fades from 1 down to 0." },
    { line: "box-shadow: 0 {d}px {n}px rgba(0, 0, 0, 0.2);", why: "A soft shadow under a box." },
    { line: ".{sv} { display: grid; gap: {n}px; }", why: "A grid with gaps." },
    { line: ".{sv} { display: flex; justify-content: {jc}; }", why: "A flex row, spread out." },
    { line: "nav a { color: {col}; text-decoration: none; }", why: "Links inside the nav." },
    { line: ".{sv} img { max-width: 100%; height: auto; }", why: "Images that never overflow." },
    { line: "button:focus-visible { outline: {d}px solid {col}; }", why: "A clear outline for keyboard users." },
    { line: ".{sv} { box-sizing: border-box; padding: {n}px; }", why: "border-box keeps the width honest." },
    { line: "background: linear-gradient({col}, {cb});", why: "A gradient blends two colors." }
  ];
  var themes = [
    { name: "Headings & Text", t: [0, 1, 2, 3, 4] },
    { name: "Links & Images", t: [5, 6, 7, 3, 2] },
    { name: "Lists & Tables", t: [8, 9, 10, 11, 2] },
    { name: "Forms", t: [12, 13, 14, 15, 21] },
    { name: "Page Structure", t: [16, 17, 18, 19, 20] },
    { name: "The Head", t: [22, 23, 24, 5, 2] },
    { name: "First Rules", t: [25, 26, 27, 30, 31] },
    { name: "Selectors", t: [27, 28, 29, 60, 25] },
    { name: "Color", t: [30, 64, 52, 53, 39] },
    { name: "Text Styling", t: [32, 33, 34, 35, 26] },
    { name: "Box Model", t: [36, 37, 38, 39, 40] },
    { name: "Sizes", t: [41, 42, 36, 40, 63] },
    { name: "Flexbox", t: [43, 44, 45, 46, 59] },
    { name: "Grid", t: [47, 48, 49, 58, 43] },
    { name: "Responsive", t: [50, 51, 41, 42, 61] },
    { name: "Variables", t: [52, 53, 64, 31, 27] },
    { name: "Motion", t: [54, 55, 56, 29, 57] },
    { name: "Accessible Pages", t: [7, 12, 62, 15, 16] },
    { name: "Mixed Practice", t: [2, 13, 27, 45, 48] },
    { name: "Web Masters", t: [19, 51, 58, 59, 62] }
  ];
  var BANKS = {
    col: ["navy", "teal", "crimson", "orchid", "tomato", "slateblue", "seagreen", "coral", "steelblue", "darkorange", "purple", "goldenrod", "indigo", "olive"],
    cb: ["white", "ivory", "lavender", "honeydew", "mistyrose", "aliceblue", "beige", "linen"],
    h: ["2", "3", "4", "5", "6"],
    align: ["left", "center", "right", "justify"],
    disp: ["flex", "grid", "block", "inline-block", "inline-flex", "none"],
    jc: ["center", "space-between", "space-around", "space-evenly", "flex-start", "flex-end"],
    ai: ["center", "flex-start", "flex-end", "stretch", "baseline"]
  };
  function pick(bank, r) { return bank[Math.floor(r() * bank.length)]; }

  return {
    blocks: blocks, chapters: chapters, shelves: shelves, glossary: glossary, field: field, cheats: cheats,
    projects: projects, vt: vt, themes: themes,
    fill: function (k, r) {
      if (BANKS[k]) return pick(BANKS[k], r);
      return null;
    },
    sandboxNote: "Thirty everyday HTML and CSS lines, in the order the Library teaches them. Every explanation is written in plain words for Code Block. Each block takes 8 perfect repetitions, and your HTML & CSS progress is saved separately from every other track.",
    sourcesHTML: 'HTML and CSS facts follow the <a href="https://html.spec.whatwg.org/">HTML Living Standard</a>, the <a href="https://www.w3.org/Style/CSS/">CSS specifications</a> and <a href="https://developer.mozilla.org/">MDN Web Docs</a>. Every explanation is written in Code Block’s own words. Every practice page passes the W3C Nu HTML Checker and is drawn by a real browser before it ships, and Compile &amp; Run shows your page drawn by your own browser.'
  };
});
