<?php
/* Code Block's API on a PHP host: the same JSON requests, at the same
   address, as the Python server (server/app.py), so the page works
   unchanged on either. The rules live in api/_lib/core.php; this file
   only reads the request and writes the answer.

   Settings come from the environment, as Wasmer provides them for its
   MySQL databases: DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
   (and optionally DB_SSL). Without them the site still works and keeps
   progress on each device. */
define('CB_API', true);
ini_set('display_errors', '0');
require __DIR__ . '/_lib/core.php';

/* Request headers, lower-cased, as server/app.py sees them. */
function cb_request_headers(): array {
  $headers = [];
  foreach ($_SERVER as $key => $value) {
    if (is_string($value) && strncmp($key, 'HTTP_', 5) === 0) $headers[strtolower(str_replace('_', '-', substr($key, 5)))] = $value;
  }
  return $headers;
}

/* The visitor's address: the last hop a proxy added, else the socket's. */
function cb_client_ip(): string {
  $hops = array_values(array_filter(array_map('trim', explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''))), 'strlen'));
  if ($hops) return $hops[count($hops) - 1];
  $real = trim((string) ($_SERVER['HTTP_X_REAL_IP'] ?? ''));
  if ($real !== '') return $real;
  return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

/* Whether the visitor's browser is on HTTPS, so the cookie gets Secure. */
function cb_is_https(): bool {
  $proto = trim(explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''))[0]);
  if ($proto !== '') { if ($proto === 'https') return true; }
  elseif (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') return true;
  foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $h) if (strncmp((string) ($_SERVER[$h] ?? ''), 'https://', 8) === 0) return true;
  return false;
}

$method = (string) ($_SERVER['REQUEST_METHOD'] ?? 'GET');
$route = is_string($_GET['r'] ?? null) ? $_GET['r'] : '';
$raw = $method === 'POST' ? (string) file_get_contents('php://input', false, null, 0, CB_MAX_BODY + 1) : '';
$token = is_string($_COOKIE[CB_COOKIE] ?? null) ? $_COOKIE[CB_COOKIE] : null;

try {
  [$status, $payload, $cookie] = cb_handle($method, $route, $_GET, $raw, cb_request_headers(), cb_client_ip(), $token);
} catch (Throwable $e) {
  /* Never show internals; the details go to the server's log. */
  error_log('Code Block API: ' . $e->getMessage());
  [$status, $payload, $cookie] = [500, ['ok' => false, 'error' => 'server', 'message' => 'Something went wrong on our side. Try again in a minute.'], null];
}

http_response_code($status);
header_remove('X-Powered-By');
header('Content-Type: application/json');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('X-Frame-Options: SAMEORIGIN');
header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()');
if ($cookie !== null) {
  setcookie(CB_COOKIE, $cookie, [
    'expires' => $cookie === '' ? 1 : time() + CB_SESSION_DAYS * 86400,
    'path' => '/',
    'secure' => cb_is_https(),
    'httponly' => true,
    'samesite' => 'Lax',
  ]);
}
if ($method !== 'HEAD') echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
