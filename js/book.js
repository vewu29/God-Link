"use strict";
/* ================= MY BOOK — on-device PDF reader =================
   The book's PDF is opened from the reader's own device and rendered
   locally with PDF.js. Nothing is uploaded and no book text is stored
   in this page; only the file name and last-read page are remembered
   (same localStorage pattern as Sandbox progress). */
(function initBook() {
  function $(id) { return document.getElementById(id); }
  var fileInput = $("bookFile"), pickBtn = $("bookPickBtn"), changeBtn = $("bookChange");
  var drop = $("bookDrop"), frame = $("bookFrame"), stage = $("bookStage");
  var canvas = $("bookCanvas"), ctx = canvas.getContext("2d");
  var nameEl = $("bookName"), statusEl = $("bookStatus");
  var prevBtn = $("bookPrev"), nextBtn = $("bookNext");
  var pageInput = $("bookPageInput"), pageTotal = $("bookPageTotal");
  var zoomIn = $("bookZoomIn"), zoomOut = $("bookZoomOut");
  /* Loop 69 — every other save in the app is kept per track
     (progress, the Vault, profiles), but the book's place lived
     in one shared slot: reading the Drive manual overwrote the
     C++ place, and the C# room's "last time" note could name
     another track's book. The place is per track now; the
     original key stays the C++ slot, and the other tracks read
     it as a fallback (the file-name match in openFile still
     decides whether a remembered place applies) until their
     own first save. */
  var STORE = window.__isDrive ? "code-block-book-drive-v1" : window.__isCS ? "code-block-book-cs-v1" : "code-block-book-v1";
  var LEGACY_STORE = "code-block-book-v1";
  var pdfDoc = null, pageNum = 1, zoom = 1, rendering = false, pendingPage = null;
  var lastHeardPage = 0;
  var bookName = "", blobUrl = null;
  /* Loop 69 — load and render generations. A slow first file
     used to be able to land after a fast second one and quietly
     replace it (the name said one book, the pages were the
     other), and a render left over from a previous book could
     write its status, announcement and saved place over the
     new book. Every open and every render takes a number; only
     the newest number may touch the room. */
  var loadToken = 0, renderToken = 0;

  /* Loop 56 — the remembered place is validated at the door,
     like Sandbox progress: name a real string, page a whole
     number of 1 or more, zoom a finite number. Anything else
     an older build or a hand edit left behind reads as "no
     memory", never as a page the reader cannot draw. */
  function readStore(key) {
    try {
      var m = JSON.parse(localStorage.getItem(key) || "null");
      if (!m || typeof m !== "object" || typeof m.name !== "string" || !m.name) return null;
      var pg = Math.floor(Number(m.page));
      var zm = Number(m.zoom);
      return { name: m.name, page: isFinite(pg) && pg > 0 ? pg : 1, zoom: isFinite(zm) ? zm : 1 };
    } catch (e) { return null; }
  }
  function loadMemory() {
    var m = readStore(STORE);
    if (!m && STORE !== LEGACY_STORE) m = readStore(LEGACY_STORE);
    return m;
  }
  function saveMemory() {
    try { localStorage.setItem(STORE, JSON.stringify({ name: bookName, page: pageNum, zoom: zoom })); } catch (e) {}
  }
  function setStatus(html) { statusEl.innerHTML = html; }
  function updateControls() {
    var total = pdfDoc ? pdfDoc.numPages : 1;
    pageTotal.textContent = "/ " + total;
    pageInput.max = total;
    if (document.activeElement !== pageInput) pageInput.value = pageNum;
    prevBtn.disabled = !pdfDoc || pageNum <= 1;
    nextBtn.disabled = !pdfDoc || pageNum >= total;
  }
  function renderPage(n) {
    if (!pdfDoc) return;
    if (rendering) { pendingPage = n; return; }
    rendering = true;
    pageNum = n;
    var doc = pdfDoc, token = ++renderToken;
    doc.getPage(n).then(function (page) {
      if (token !== renderToken || pdfDoc !== doc) return null;
      var unscaled = page.getViewport({ scale: 1 });
      var avail = Math.max(280, stage.clientWidth - 20);
      var fit = avail / unscaled.width;
      var viewport = page.getViewport({ scale: fit * zoom });
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";
      var transform = dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null;
      return page.render({ canvasContext: ctx, viewport: viewport, transform: transform }).promise;
    }).then(function () {
      if (token !== renderToken || pdfDoc !== doc) return;
      rendering = false;
      updateControls();
      saveMemory();
      setStatus("<strong>Page " + pageNum + " of " + doc.numPages + ".</strong> Your place is saved on this device — leave and come back, and the book reopens right here.");
      /* Loop 50 — the canvas wore a fixed "Current book page"
         label, so a listener could not tell one page from the
         next. The label now names the page, and a genuine page
         CHANGE is announced once; zoom and resize re-renders of
         the same page stay silent. */
      canvas.setAttribute("aria-label", "Book page " + pageNum + " of " + doc.numPages);
      if (pageNum !== lastHeardPage) { lastHeardPage = pageNum; if (window.cbAnnounce) window.cbAnnounce("Page " + pageNum + " of " + doc.numPages); }
      if (pendingPage !== null) { var p = pendingPage; pendingPage = null; renderPage(p); }
    }).catch(function () {
      if (token !== renderToken || pdfDoc !== doc) return;
      rendering = false;
      /* Loop 69 — a page queued behind a failed draw used to
         survive the failure and fire after the NEXT successful
         render, teleporting the reader to a page they asked
         for before the error. The queue dies with the draw
         that failed. */
      pendingPage = null;
      setStatus("That page could not be drawn. Try the next page, or open the file again.");
    });
  }
  function showFallbackReader(url) {
    var old = stage.querySelector("embed.book-fallback");
    if (old) old.remove();
    canvas.style.display = "none";
    var emb = document.createElement("embed");
    emb.src = url; emb.type = "application/pdf";
    emb.className = "book-fallback";
    emb.setAttribute("aria-label", "Book PDF viewer");
    stage.appendChild(emb);
    setStatus("<strong>Reading with the built-in viewer.</strong> Use its own controls to turn pages and zoom.");
    pageTotal.textContent = "";
    prevBtn.disabled = nextBtn.disabled = true;
    zoomIn.disabled = zoomOut.disabled = true;
    pageInput.disabled = true;
    /* Loop 69 — focus lands here too, on the one book control
       the built-in viewer leaves enabled: the panel that held
       the opening button is hidden by now, so without a landing
       the keyboard learner's place falls to the top of the page. */
    try { changeBtn.focus({ preventScroll: true }); } catch (e) { try { changeBtn.focus(); } catch (e2) {} }
  }
  function restoreCanvasReader() {
    var emb = stage.querySelector("embed.book-fallback");
    if (emb) emb.remove();
    canvas.style.display = "";
    zoomIn.disabled = zoomOut.disabled = false;
    pageInput.disabled = false;
  }
  /* Loop 56 — the PDF engine used to ride along on every
     visit though only this room needs it. It now loads on
     the first book a learner actually opens; if the CDN
     cannot be reached, the built-in viewer below takes the
     file instead, exactly as it always did when the library
     was missing. */
  var pdfLibPromise = null;
  function ensurePdfLib() {
    if (window.pdfjsLib && pdfjsLib.getDocument) return Promise.resolve(true);
    if (!pdfLibPromise) {
      pdfLibPromise = new Promise(function (resolve) {
        var s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        /* Loop 69 — a script that arrives without the library
           counts as a failed load too: the next open retries
           instead of replaying this cached miss all session. */
        s.onload = function () { var ok = !!(window.pdfjsLib && pdfjsLib.getDocument); if (!ok) pdfLibPromise = null; resolve(ok); };
        s.onerror = function () { pdfLibPromise = null; resolve(false); };
        document.head.appendChild(s);
      });
    }
    return pdfLibPromise;
  }
  function openFile(file) {
    if (!file) return;
    var token = ++loadToken;
    /* Loop 69 — the previous book leaves the room before the
       new one is even read: its document is destroyed and
       pdfDoc cleared, so while the new file loads (and if it
       lands in the built-in viewer instead) the page controls,
       the resize re-render and the saved place can no longer
       act on a book that is no longer open. Before this, a
       corrupt second file fell back to the viewer while the
       first book stayed loaded underneath — a resize or a tap
       on Next redrew it over the viewer and saved its page
       under the new file's name. */
    renderToken++;
    if (pdfDoc && pdfDoc.destroy) { try { pdfDoc.destroy(); } catch (e) {} }
    pdfDoc = null; rendering = false; pendingPage = null; lastHeardPage = 0;
    restoreCanvasReader();
    if (blobUrl) { try { URL.revokeObjectURL(blobUrl); } catch (e) {} blobUrl = null; }
    bookName = file.name || "Book";
    nameEl.textContent = bookName;
    drop.classList.add("hidden");
    frame.classList.remove("hidden");
    changeBtn.classList.remove("hidden");
    setStatus("Loading <strong>" + bookName.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</strong>…");
    var mem = loadMemory();
    var startPage = (mem && mem.name === bookName) ? mem.page : 1;
    zoom = (mem && mem.name === bookName) ? Math.min(2.5, Math.max(0.6, mem.zoom)) : 1;
    pageNum = startPage;
    updateControls();
    ensurePdfLib().then(function (ok) {
      if (token !== loadToken) return;
      if (!ok) {
        blobUrl = URL.createObjectURL(file);
        showFallbackReader(blobUrl);
        return;
      }
      try { pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; } catch (e) {}
      file.arrayBuffer().then(function (buf) {
        return pdfjsLib.getDocument({ data: buf }).promise;
      }).then(function (doc) {
        if (token !== loadToken) { if (doc && doc.destroy) { try { doc.destroy(); } catch (e) {} } return; }
        pdfDoc = doc;
        restoreCanvasReader();
        pageNum = Math.min(Math.max(1, startPage), doc.numPages);
        updateControls();
        renderPage(pageNum);
        /* Loop 69 — focus lands on the page box when a book
           opens: the button that started the open sits in the
           drop panel, which has just hidden, and focus used to
           fall to the top of the page, leaving a keyboard
           learner to tab back through the whole app to reach
           the page controls they just summoned. */
        try { pageInput.focus({ preventScroll: true }); } catch (e) { try { pageInput.focus(); } catch (e2) {} }
      }).catch(function () {
        if (token !== loadToken) return;
        blobUrl = URL.createObjectURL(file);
        showFallbackReader(blobUrl);
      });
    });
    window.scrollTo(0, 0);
  }
  pickBtn.addEventListener("click", function () { fileInput.click(); });
  changeBtn.addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files[0]) openFile(fileInput.files[0]);
    fileInput.value = "";
  });
  prevBtn.addEventListener("click", function () { if (pdfDoc && pageNum > 1) renderPage(pageNum - 1); });
  nextBtn.addEventListener("click", function () { if (pdfDoc && pageNum < pdfDoc.numPages) renderPage(pageNum + 1); });
  pageInput.addEventListener("change", function () {
    if (!pdfDoc) return;
    var n = parseInt(pageInput.value, 10);
    if (isNaN(n)) { pageInput.value = pageNum; return; }
    renderPage(Math.min(pdfDoc.numPages, Math.max(1, n)));
  });
  zoomIn.addEventListener("click", function () { if (!pdfDoc) return; zoom = Math.min(2.5, +(zoom + 0.25).toFixed(2)); renderPage(pageNum); });
  zoomOut.addEventListener("click", function () { if (!pdfDoc) return; zoom = Math.max(0.6, +(zoom - 0.25).toFixed(2)); renderPage(pageNum); });
  var resizeTimer = null;
  window.addEventListener("resize", function () {
    /* Loop 69 — the frame check alone let a resize that landed
       while the learner was in another room through: the frame
       is only hidden when no book is open, so with a book open
       the handler re-drew the page against a stage inside a
       display:none view (clientWidth 0), shrinking the canvas
       to the 280px floor — and nothing re-fit it on return.
       Hidden rooms do not resize; the arrival refit below
       restores the fit instead. */
    if (!pdfDoc || frame.classList.contains("hidden") || $("bookView").classList.contains("hidden")) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { renderPage(pageNum); }, 220);
  });
  /* Loop 69 — arriving back at the Book room re-fits the open
     page to the room's real width (the menu calls this the way
     it re-renders the Vault and Profile rooms on entry), so a
     rotation or zoom that happened in another room — or the
     room simply being wider than the stale canvas — never
     leaves the page wearing an old fit. */
  window.cbBookRefit = function () {
    if (!pdfDoc || frame.classList.contains("hidden")) return;
    renderPage(pageNum);
  };
  /* If a book was read before, say so on the empty state.
     Loop 69 — the note reads this track's own slot only: the
     legacy fallback in loadMemory may restore a place when the
     same file is picked in another track, but it must not make
     this room's empty state name a book read under a different
     track. */
  var mem = readStore(STORE);
  if (mem && mem.name) {
    var note = document.createElement("p");
    note.style.marginTop = "12px";
    note.innerHTML = "Last time you were reading <strong></strong> — pick that same file and it reopens on page " + (mem.page || 1) + ".";
    note.querySelector("strong").textContent = mem.name;
    drop.appendChild(note);
  }
})();
