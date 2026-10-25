<?php
/* On a PHP host the page is served from here, so it can say that the
   API (api/index.php) is present — the same line server/app.py adds.
   js/account.js switches online accounts on only when it sees it; a
   static copy of the site, served as plain index.html, never asks. */
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache');
header_remove('X-Powered-By');
echo preg_replace('/<head>/', "<head>\n    <meta name=\"cb-api\" content=\"api/index.php\">", file_get_contents(__DIR__ . '/index.html'), 1);
