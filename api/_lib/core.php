<?php
/* Code Block's API rules, in PHP — the twin of server/core.py.
 *
 * Both servers answer the same requests at /api/index.php against the
 * same tables (db/schema.sql), and tests/api runs one test suite against
 * each, so the two never drift: change a rule here and there together.
 * The security notes at the top of server/core.py apply word for word:
 * PBKDF2-SHA256 (600,000 rounds) password hashes either server can check,
 * hashed session tokens in HttpOnly SameSite cookies, hashed one-time
 * recovery codes, a required X-Code-Block header and same-origin check on
 * every POST, rate limits, and parameterised queries only. */
if (!defined('CB_API')) { http_response_code(404); exit; }

/* What PHP's trim() strips by default; server/core.py strips the same. */
const CB_TRIM = " \t\n\r\x0B\x00";
/* JSON objects and lists nested at most this deep: json_decode's depth
   counts one more level than that. */
const CB_JSON_DEPTH = 32;

const CB_VERSION = 1;
const CB_PBKDF2_ITERATIONS = 600000;
const CB_SESSION_DAYS = 30;
const CB_COOKIE = 'cb_session';
const CB_MAX_BODY = 100000;
const CB_MAX_PROGRESS_BYTES = 65536;
const CB_XP_CAP_EVENT = 80;
const CB_XP_CAP_DAY = 5000;
const CB_WPM_CAP = 250;
const CB_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CB_RESERVED = ['admin', 'administrator', 'root', 'system', 'support', 'moderator', 'mod', 'codeblock', 'code-block', 'staff', 'owner', 'official'];
const CB_COMMON_PASSWORDS = [
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890', 'qwertyuiop', 'qwerty123',
  'iloveyou', '11111111', '00000000', 'abcd1234', 'abc12345', 'letmein1', 'sunshine', 'princess',
  'football', 'baseball', 'welcome1', 'monkey123', 'dragon123', 'trustno1', 'passw0rd', 'codeblock',
];

final class ApiError extends Exception {
  public int $status;
  public string $codeName;
  public function __construct(int $status, string $code, string $message) {
    parent::__construct($message);
    $this->status = $status;
    $this->codeName = $code;
  }
}

/* ---------- small helpers ---------- */

function cb_sha256(string $text): string { return hash('sha256', $text); }

function cb_level_of(int $xp): int {
  $n = 1;
  while (50 * $n * ($n + 1) <= $xp) $n++;
  return $n;
}

function cb_utc_today(): string { return gmdate('Y-m-d'); }

/* ---------- passwords, codes, tokens ---------- */

function cb_hash_password(string $password, int $iterations = CB_PBKDF2_ITERATIONS, ?string $salt = null): string {
  $salt = $salt ?? random_bytes(16);
  $dk = hash_pbkdf2('sha256', $password, $salt, $iterations, 32, true);
  return 'pbkdf2_sha256$' . $iterations . '$' . base64_encode($salt) . '$' . base64_encode($dk);
}

function cb_verify_password(string $password, string $stored): bool {
  $parts = explode('$', $stored);
  if (count($parts) !== 4 || $parts[0] !== 'pbkdf2_sha256' || !ctype_digit($parts[1])) return false;
  $salt = base64_decode($parts[2], true);
  $want = base64_decode($parts[3], true);
  if ($salt === false || $want === false || $want === '') return false;
  $got = hash_pbkdf2('sha256', $password, $salt, (int) $parts[1], strlen($want), true);
  return hash_equals($want, $got);
}

/* Spend the same time as a real check when the username is unknown. */
function cb_burn_a_hash(string $password): void {
  static $dummy = null;
  if ($dummy === null) $dummy = cb_hash_password('not-a-real-password');
  cb_verify_password($password, $dummy);
}

function cb_needs_rehash(string $stored): bool {
  $parts = explode('$', $stored);
  return count($parts) !== 4 || (int) $parts[1] < CB_PBKDF2_ITERATIONS;
}

function cb_new_recovery_code(): string {
  $raw = '';
  for ($i = 0; $i < 16; $i++) $raw .= CB_CODE_ALPHABET[random_int(0, strlen(CB_CODE_ALPHABET) - 1)];
  return implode('-', str_split($raw, 4));
}

function cb_recovery_hash(string $code): string {
  return cb_sha256(strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $code)));
}

function cb_token(): string { return rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '='); }

/* ---------- validation ---------- */

function cb_text(array $body, string $name, int $max = 200): string {
  $v = $body[$name] ?? null;
  if (!is_string($v)) throw new ApiError(400, 'missing_' . $name, 'Please fill in the ' . $name . '.');
  if (mb_strlen($v, 'UTF-8') > $max) throw new ApiError(400, 'too_long', 'That ' . $name . ' is too long.');
  return $v;
}

function cb_check_username(string $username): string {
  $username = trim($username, CB_TRIM);
  if (!preg_match('/^[A-Za-z0-9_.-]{3,20}$/D', $username)) {
    throw new ApiError(400, 'bad_username', 'Usernames are 3 to 20 letters, numbers, dots, dashes or underscores.');
  }
  if (in_array(strtolower($username), CB_RESERVED, true)) throw new ApiError(400, 'reserved_username', 'That username is reserved — try another.');
  return $username;
}

function cb_check_password(string $password, string $username): string {
  $len = mb_strlen($password, 'UTF-8');
  if ($len < 8) throw new ApiError(400, 'short_password', 'Passwords need at least 8 characters.');
  if ($len > 128) throw new ApiError(400, 'long_password', 'Passwords can be at most 128 characters.');
  if (trim($password, CB_TRIM) === '') throw new ApiError(400, 'weak_password', "A password can't be only spaces.");
  $lower = mb_strtolower($password, 'UTF-8');
  if (in_array($lower, CB_COMMON_PASSWORDS, true) || $lower === strtolower($username)) {
    throw new ApiError(400, 'weak_password', 'That password is too easy to guess — try a longer, less common one.');
  }
  return $password;
}

/* The learner's own calendar day, accepted only within a day of UTC. */
function cb_check_day($value): string {
  $today = cb_utc_today();
  if (is_string($value) && preg_match('/^\d{4}-\d{2}-\d{2}$/D', $value)) {
    $d = DateTimeImmutable::createFromFormat('!Y-m-d', $value, new DateTimeZone('UTC'));
    if ($d && $d->format('Y-m-d') === $value) {
      $t = new DateTimeImmutable($today, new DateTimeZone('UTC'));
      if (abs((int) $t->diff($d)->format('%r%a')) <= 1) return $value;
    }
  }
  return $today;
}

function cb_day_before(string $day): string {
  return (new DateTimeImmutable($day, new DateTimeZone('UTC')))->modify('-1 day')->format('Y-m-d');
}

/* ---------- the database ---------- */

/* A PDO MySQL attribute by name: PHP 8.4 moved them to Pdo\Mysql. */
function cb_mysql_attr(string $name): ?int {
  foreach (['Pdo\\Mysql::ATTR_' . $name, 'PDO::MYSQL_ATTR_' . $name] as $c) if (defined($c)) return constant($c);
  return null;
}

function cb_open(string $dsn, ?string $tls): PDO {
  $options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::ATTR_TIMEOUT => 8,
  ];
  if ($tls !== null) {
    $ca = cb_mysql_attr('SSL_CA');
    $check = cb_mysql_attr('SSL_VERIFY_SERVER_CERT');
    if ($ca === null || $check === null) throw new PDOException('This PHP has no MySQL TLS support.');
    $bundle = $tls === 'verify' ? (openssl_get_cert_locations()['default_cert_file'] ?? '') : '';
    $options[$ca] = $bundle;
    $options[$check] = $tls === 'verify';
  }
  $user = getenv('DB_USERNAME') ?: (getenv('DB_USER') ?: '');
  return new PDO($dsn, $user, getenv('DB_PASSWORD') ?: '', $options);
}

/* A connection to the database named by the DB_* settings Wasmer (or any
   host) provides. DB_SSL: unset = TLS when the server offers it; 0 = never;
   1 = always (encrypted, unverified); verify = always, checking the
   certificate. Same settings, same meaning, as server/core.py. */
function cb_connect(): PDO {
  $host = getenv('DB_HOST');
  $name = getenv('DB_NAME');
  if (!$host || !$name) {
    throw new ApiError(503, 'no_database', "Accounts aren't switched on here yet — your progress is safe on this device.");
  }
  $port = (int) (getenv('DB_PORT') ?: 3306);
  $dsn = "mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4";
  $mode = strtolower(trim((string) getenv('DB_SSL')));
  $resting = new ApiError(503, 'no_database', 'The account server is having a rest — your progress is safe on this device. Try again in a minute.');
  try {
    if (in_array($mode, ['0', 'off', 'false', 'no', 'disable', 'disabled'], true)) {
      $pdo = cb_open($dsn, null);
    } elseif (in_array($mode, ['1', 'on', 'true', 'yes', 'require', 'required', 'verify'], true)) {
      $pdo = cb_open($dsn, $mode === 'verify' ? 'verify' : 'encrypt');
    } else {
      try {
        $pdo = cb_open($dsn, 'encrypt');
      } catch (PDOException $e) {
        $pdo = cb_open($dsn, null);
      }
    }
    cb_ensure_schema($pdo);
  } catch (PDOException $e) {
    error_log('Code Block database: ' . $e->getMessage());
    throw $resting;
  }
  return $pdo;
}

/* PHP starts fresh on every request, so a marker row says the tables are
   there: one cheap query, and the full schema only on a new database. */
function cb_ensure_schema(PDO $pdo): void {
  try {
    $ok = $pdo->query("SELECT n FROM cb_counters WHERE name = 'schema'")->fetch();
    if ($ok && (int) $ok['n'] >= CB_VERSION) return;
  } catch (PDOException $e) {
    // a fresh database: build it below
  }
  $text = file_get_contents(__DIR__ . '/../../db/schema.sql');
  $text = implode("\n", array_filter(explode("\n", $text), fn ($l) => strpos(ltrim($l), '--') !== 0));
  foreach (preg_split('/;\s*\n/', $text) as $statement) {
    $statement = trim($statement);
    if ($statement !== '') $pdo->exec(rtrim($statement, ';'));
  }
  $pdo->prepare("INSERT INTO cb_counters (name, n) VALUES ('schema', ?) ON DUPLICATE KEY UPDATE n = ?")->execute([CB_VERSION, CB_VERSION]);
}

function cb_one(PDO $pdo, string $sql, array $args = []): ?array {
  $st = $pdo->prepare($sql);
  $st->execute($args);
  $row = $st->fetch();
  return $row === false ? null : $row;
}

function cb_run(PDO $pdo, string $sql, array $args = []): int {
  $st = $pdo->prepare($sql);
  $st->execute($args);
  return $st->rowCount();
}

function cb_rows(PDO $pdo, string $sql, array $args = []): array {
  $st = $pdo->prepare($sql);
  $st->execute($args);
  return $st->fetchAll();
}

function cb_hit(PDO $pdo, string $bucket, int $limit, int $window): void {
  $key = cb_sha256($bucket);
  cb_run($pdo,
    'INSERT INTO cb_rate (bucket, hits, reset_at) VALUES (?, 1, UTC_TIMESTAMP() + INTERVAL ? SECOND) '
    . 'ON DUPLICATE KEY UPDATE hits = IF(reset_at < UTC_TIMESTAMP(), 1, hits + 1), '
    . 'reset_at = IF(reset_at < UTC_TIMESTAMP(), UTC_TIMESTAMP() + INTERVAL ? SECOND, reset_at)',
    [$key, $window, $window]);
  $row = cb_one($pdo, 'SELECT hits FROM cb_rate WHERE bucket = ?', [$key]);
  if ($row && (int) $row['hits'] > $limit) {
    throw new ApiError(429, 'too_many', "That's a lot of tries in a short time — wait a few minutes, then try again.");
  }
}

function cb_tidy(PDO $pdo): void {
  if (random_int(0, 49) === 0) {
    cb_run($pdo, 'DELETE FROM cb_rate WHERE reset_at < UTC_TIMESTAMP() - INTERVAL 1 HOUR LIMIT 500');
    cb_run($pdo, 'DELETE FROM cb_sessions WHERE expires_at < UTC_TIMESTAMP() LIMIT 500');
  }
}

function cb_bump(PDO $pdo, string $name, int $by = 1): void {
  cb_run($pdo, 'INSERT INTO cb_counters (name, n) VALUES (?, ?) ON DUPLICATE KEY UPDATE n = n + ?', [$name, $by, $by]);
}

/* ---------- users and sessions ---------- */

const CB_USER_COLUMNS = 'id, username, xp, drills, streak, best_streak, last_day, best_wpm, public_board, created_at';

function cb_public_user(array $r): array {
  return [
    'id' => (int) $r['id'],
    'username' => $r['username'],
    'xp' => (int) $r['xp'],
    'level' => cb_level_of((int) $r['xp']),
    'streak' => (int) $r['streak'],
    'bestStreak' => (int) $r['best_streak'],
    'lastDay' => $r['last_day'] ?: null,
    'drills' => (int) $r['drills'],
    'bestWpm' => (int) $r['best_wpm'],
    'public' => (bool) $r['public_board'],
    'joined' => substr($r['created_at'], 0, 10),
  ];
}

function cb_start_session(PDO $pdo, int $userId): string {
  $token = cb_token();
  cb_run($pdo,
    'INSERT INTO cb_sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP() + INTERVAL ? DAY)',
    [cb_sha256($token), $userId, CB_SESSION_DAYS]);
  return $token;
}

/* The signed-in user for a cookie, or null; and the token if it was renewed. */
function cb_session_user(PDO $pdo, ?string $token): array {
  if (!$token || strlen($token) > 200) return [null, null];
  $cols = 'u.' . str_replace(', ', ', u.', CB_USER_COLUMNS);
  $row = cb_one($pdo,
    "SELECT $cols, s.expires_at FROM cb_sessions s JOIN cb_users u ON u.id = s.user_id "
    . 'WHERE s.token_hash = ? AND s.expires_at > UTC_TIMESTAMP()',
    [cb_sha256($token)]);
  if (!$row) return [null, null];
  $renewed = null;
  $left = strtotime($row['expires_at'] . ' UTC') - time();
  if ($left < CB_SESSION_DAYS * 86400 / 2) {
    cb_run($pdo, 'UPDATE cb_sessions SET expires_at = UTC_TIMESTAMP() + INTERVAL ? DAY WHERE token_hash = ?', [CB_SESSION_DAYS, cb_sha256($token)]);
    $renewed = $token;
  }
  cb_run($pdo, 'UPDATE cb_users SET last_seen = UTC_TIMESTAMP() WHERE id = ? AND last_seen < UTC_TIMESTAMP() - INTERVAL 60 SECOND', [$row['id']]);
  return [$row, $renewed];
}

function cb_load_user(PDO $pdo, int $id): ?array {
  return cb_one($pdo, 'SELECT ' . CB_USER_COLUMNS . ' FROM cb_users WHERE id = ?', [$id]);
}

function cb_require_user(array $ctx): array {
  if (!$ctx['user']) throw new ApiError(401, 'signed_out', 'Please sign in first.');
  return $ctx['user'];
}

/* ---------- the endpoints ----------
   Each takes ($pdo, $ctx) and returns [status, payload, cookie], where
   cookie is null (leave it), a token (set it) or '' (clear it). */

function ep_health(PDO $pdo, array $ctx): array {
  return [200, ['ok' => true, 'server' => 'php', 'db' => true, 'version' => CB_VERSION], null];
}

function ep_signup(PDO $pdo, array $ctx): array {
  $body = $ctx['body'];
  cb_hit($pdo, 'signup:' . $ctx['ip'], 10, 3600);
  $username = cb_check_username(cb_text($body, 'username', 40));
  $password = cb_check_password(cb_text($body, 'password', 400), $username);
  $public = ($body['public'] ?? true) !== false;
  $code = cb_new_recovery_code();
  try {
    cb_run($pdo,
      'INSERT INTO cb_users (username, username_key, pass_hash, recovery_hash, public_board, created_at, last_seen) '
      . 'VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP())',
      [$username, strtolower($username), cb_hash_password($password), cb_recovery_hash($code), $public ? 1 : 0]);
  } catch (PDOException $e) {
    if ($e->getCode() === '23000') throw new ApiError(409, 'taken', 'That username is taken — try another.');
    throw $e;
  }
  $user = cb_one($pdo, 'SELECT ' . CB_USER_COLUMNS . ' FROM cb_users WHERE username_key = ?', [strtolower($username)]);
  cb_bump($pdo, 'signups');
  $token = cb_start_session($pdo, (int) $user['id']);
  return [201, ['ok' => true, 'user' => cb_public_user($user), 'recoveryCode' => $code], $token];
}

function ep_login(PDO $pdo, array $ctx): array {
  $body = $ctx['body'];
  $username = trim(cb_text($body, 'username', 40), CB_TRIM);
  $password = cb_text($body, 'password', 400);
  $key = strtolower($username);
  cb_hit($pdo, 'login-ip:' . $ctx['ip'], 60, 900);
  cb_hit($pdo, 'login:' . $ctx['ip'] . ':' . $key, 10, 900);
  cb_hit($pdo, 'login-user:' . $key, 20, 900);
  $row = cb_one($pdo, 'SELECT id, pass_hash FROM cb_users WHERE username_key = ?', [$key]);
  if (!$row) {
    cb_burn_a_hash($password);
    throw new ApiError(401, 'bad_login', "That username and password don't match.");
  }
  if (!cb_verify_password($password, $row['pass_hash'])) throw new ApiError(401, 'bad_login', "That username and password don't match.");
  if (cb_needs_rehash($row['pass_hash'])) cb_run($pdo, 'UPDATE cb_users SET pass_hash = ? WHERE id = ?', [cb_hash_password($password), $row['id']]);
  cb_run($pdo, 'UPDATE cb_users SET last_seen = UTC_TIMESTAMP() WHERE id = ?', [$row['id']]);
  $token = cb_start_session($pdo, (int) $row['id']);
  return [200, ['ok' => true, 'user' => cb_public_user(cb_load_user($pdo, (int) $row['id']))], $token];
}

function ep_logout(PDO $pdo, array $ctx): array {
  if ($ctx['token']) cb_run($pdo, 'DELETE FROM cb_sessions WHERE token_hash = ?', [cb_sha256($ctx['token'])]);
  return [200, ['ok' => true], ''];
}

function ep_me(PDO $pdo, array $ctx): array {
  return [200, ['ok' => true, 'user' => cb_public_user(cb_require_user($ctx))], null];
}

function ep_recover(PDO $pdo, array $ctx): array {
  $body = $ctx['body'];
  $username = trim(cb_text($body, 'username', 40), CB_TRIM);
  $code = cb_text($body, 'recoveryCode', 60);
  $key = strtolower($username);
  cb_hit($pdo, 'recover:' . $ctx['ip'], 10, 3600);
  cb_hit($pdo, 'recover-user:' . $key, 5, 3600);
  $row = cb_one($pdo, 'SELECT id, username, recovery_hash FROM cb_users WHERE username_key = ?', [$key]);
  if (!$row || !hash_equals($row['recovery_hash'], cb_recovery_hash($code))) {
    throw new ApiError(401, 'bad_code', "That username and recovery code don't match.");
  }
  $password = cb_check_password(cb_text($body, 'password', 400), $row['username']);
  $fresh = cb_new_recovery_code();
  cb_run($pdo, 'UPDATE cb_users SET pass_hash = ?, recovery_hash = ? WHERE id = ?', [cb_hash_password($password), cb_recovery_hash($fresh), $row['id']]);
  cb_run($pdo, 'DELETE FROM cb_sessions WHERE user_id = ?', [$row['id']]);
  $token = cb_start_session($pdo, (int) $row['id']);
  return [200, ['ok' => true, 'user' => cb_public_user(cb_load_user($pdo, (int) $row['id'])), 'recoveryCode' => $fresh], $token];
}

function ep_password(PDO $pdo, array $ctx): array {
  $user = cb_require_user($ctx);
  $body = $ctx['body'];
  cb_hit($pdo, 'password:' . $user['id'], 10, 900);
  $current = cb_text($body, 'password', 400);
  $row = cb_one($pdo, 'SELECT pass_hash FROM cb_users WHERE id = ?', [$user['id']]);
  if (!cb_verify_password($current, $row['pass_hash'])) throw new ApiError(401, 'bad_password', "Your current password isn't right.");
  $new = cb_check_password(cb_text($body, 'newPassword', 400), $user['username']);
  cb_run($pdo, 'UPDATE cb_users SET pass_hash = ? WHERE id = ?', [cb_hash_password($new), $user['id']]);
  cb_run($pdo, 'DELETE FROM cb_sessions WHERE user_id = ? AND token_hash <> ?', [$user['id'], cb_sha256($ctx['token'])]);
  return [200, ['ok' => true], null];
}

function ep_settings(PDO $pdo, array $ctx): array {
  $user = cb_require_user($ctx);
  $public = $ctx['body']['public'] ?? null;
  if (!is_bool($public)) throw new ApiError(400, 'bad_settings', 'Nothing to change.');
  cb_run($pdo, 'UPDATE cb_users SET public_board = ? WHERE id = ?', [$public ? 1 : 0, $user['id']]);
  return [200, ['ok' => true, 'user' => cb_public_user(cb_load_user($pdo, (int) $user['id']))], null];
}

function ep_delete(PDO $pdo, array $ctx): array {
  $user = cb_require_user($ctx);
  cb_hit($pdo, 'delete:' . $user['id'], 10, 900);
  $password = cb_text($ctx['body'], 'password', 400);
  $row = cb_one($pdo, 'SELECT pass_hash FROM cb_users WHERE id = ?', [$user['id']]);
  if (!cb_verify_password($password, $row['pass_hash'])) throw new ApiError(401, 'bad_password', "That password isn't right, so nothing was deleted.");
  cb_run($pdo, 'DELETE FROM cb_users WHERE id = ?', [$user['id']]);
  return [200, ['ok' => true], ''];
}

function ep_progress_get(PDO $pdo, array $ctx): array {
  $user = cb_require_user($ctx);
  $tracks = new stdClass();
  foreach (cb_rows($pdo, 'SELECT track, data, updated_at FROM cb_progress WHERE user_id = ?', [$user['id']]) as $r) {
    $data = json_decode($r['data']);
    if (!is_object($data)) continue;
    $tracks->{$r['track']} = ['data' => $data, 'updated' => str_replace(' ', 'T', $r['updated_at']) . 'Z'];
  }
  return [200, ['ok' => true, 'tracks' => $tracks], null];
}

function ep_progress_put(PDO $pdo, array $ctx): array {
  $user = cb_require_user($ctx);
  $body = $ctx['body'];
  $track = $body['track'] ?? null;
  if (!is_string($track) || !preg_match('/^[a-z0-9-]{1,24}$/D', $track)) throw new ApiError(400, 'bad_track', 'Unknown track.');
  $data = $ctx['raw']['data'] ?? null;
  if (!is_object($data)) throw new ApiError(400, 'bad_data', 'Progress must be an object.');
  $text = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($text === false) throw new ApiError(400, 'bad_data', 'Progress must be an object.');
  if (strlen($text) > CB_MAX_PROGRESS_BYTES) throw new ApiError(413, 'too_big', 'That progress is too big to save.');
  cb_hit($pdo, 'progress:' . $user['id'], 60, 60);
  cb_run($pdo,
    'INSERT INTO cb_progress (user_id, track, data, updated_at) VALUES (?, ?, ?, UTC_TIMESTAMP()) '
    . 'ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = VALUES(updated_at)',
    [$user['id'], $track, $text]);
  return [200, ['ok' => true], null];
}

/* A JSON number as a whole number from 0 to $max; anything else is 0. */
function cb_whole($v, int $max): int {
  if (!is_int($v) && !is_float($v)) return 0;
  return (int) max(0, min($max, $v));
}

function ep_event(PDO $pdo, array $ctx): array {
  $body = $ctx['body'];
  $kind = $body['kind'] ?? null;
  if (!in_array($kind, ['rep', 'master', 'bank'], true)) throw new ApiError(400, 'bad_event', 'Unknown event.');
  $track = $body['track'] ?? null;
  if (!is_string($track) || !preg_match('/^[a-z0-9-]{1,24}$/D', $track)) throw new ApiError(400, 'bad_track', 'Unknown track.');
  $xp = cb_whole($body['xp'] ?? 0, CB_XP_CAP_EVENT);
  $wpm = cb_whole($body['wpm'] ?? 0, CB_WPM_CAP);
  $utcDay = cb_utc_today();
  $user = $ctx['user'];
  if (!$user) {
    cb_hit($pdo, 'event-ip:' . $ctx['ip'], 120, 60);
    cb_bump($pdo, 'drills:all');
    cb_bump($pdo, 'drills:' . $utcDay);
    return [200, ['ok' => true, 'user' => null], null];
  }
  cb_hit($pdo, 'event:' . $user['id'], 120, 60);
  $day = cb_check_day($body['day'] ?? null);
  $today = cb_one($pdo, 'SELECT xp FROM cb_daily WHERE day = ? AND user_id = ?', [$day, $user['id']]);
  $earned = $today ? (int) $today['xp'] : 0;
  $xp = max(0, min($xp, CB_XP_CAP_DAY - $earned));
  $last = $user['last_day'] ?: null;
  if ($last === $day) $streak = (int) $user['streak'];
  elseif ($last === cb_day_before($day)) $streak = (int) $user['streak'] + 1;
  elseif ($last && $last > $day) $streak = (int) $user['streak'];
  else $streak = 1;
  $newest = (!$last || $day > $last) ? $day : $last;
  cb_run($pdo,
    'UPDATE cb_users SET xp = xp + ?, drills = drills + 1, best_wpm = GREATEST(best_wpm, ?), '
    . 'streak = ?, best_streak = GREATEST(best_streak, ?), last_day = ?, last_seen = UTC_TIMESTAMP() WHERE id = ?',
    [$xp, $wpm, $streak, $streak, $newest, $user['id']]);
  cb_run($pdo,
    'INSERT INTO cb_daily (day, user_id, xp, drills) VALUES (?, ?, ?, 1) '
    . 'ON DUPLICATE KEY UPDATE xp = xp + VALUES(xp), drills = drills + 1',
    [$day, $user['id'], $xp]);
  cb_bump($pdo, 'drills:all');
  cb_bump($pdo, 'drills:' . $utcDay);
  return [200, ['ok' => true, 'user' => cb_public_user(cb_load_user($pdo, (int) $user['id']))], null];
}

function ep_leaderboard(PDO $pdo, array $ctx): array {
  $period = $ctx['query']['period'] ?? 'week';
  if (!in_array($period, ['week', 'all'], true)) $period = 'week';
  $me = $ctx['user'];
  if ($period === 'week') {
    $board = cb_rows($pdo,
      'SELECT u.id, u.username, u.streak, SUM(d.xp) AS xp FROM cb_daily d JOIN cb_users u ON u.id = d.user_id '
      . 'WHERE d.day >= UTC_DATE() - INTERVAL 6 DAY AND u.public_board = 1 '
      . 'GROUP BY u.id, u.username, u.streak HAVING xp > 0 ORDER BY xp DESC, u.username_key LIMIT 20');
  } else {
    $board = cb_rows($pdo,
      'SELECT id, username, streak, xp FROM cb_users WHERE public_board = 1 AND xp > 0 ORDER BY xp DESC, username_key LIMIT 20');
  }
  $out = [];
  foreach ($board as $i => $r) {
    $out[] = ['rank' => $i + 1, 'username' => $r['username'], 'xp' => (int) $r['xp'], 'level' => cb_level_of((int) $r['xp']),
      'streak' => (int) $r['streak'], 'me' => (bool) ($me && (int) $r['id'] === (int) $me['id'])];
  }
  $mine = null;
  if ($me) {
    if ($period === 'week') {
      $row = cb_one($pdo, 'SELECT COALESCE(SUM(xp), 0) AS xp FROM cb_daily WHERE user_id = ? AND day >= UTC_DATE() - INTERVAL 6 DAY', [$me['id']]);
      $myXp = (int) $row['xp'];
      $ahead = cb_one($pdo,
        'SELECT COUNT(*) AS n FROM (SELECT d.user_id, SUM(d.xp) AS xp FROM cb_daily d JOIN cb_users u ON u.id = d.user_id '
        . 'WHERE d.day >= UTC_DATE() - INTERVAL 6 DAY AND u.public_board = 1 GROUP BY d.user_id HAVING xp > ?) t', [$myXp]);
    } else {
      $myXp = (int) $me['xp'];
      $ahead = cb_one($pdo, 'SELECT COUNT(*) AS n FROM cb_users WHERE public_board = 1 AND xp > ?', [$myXp]);
    }
    $mine = ['rank' => (int) $ahead['n'] + 1, 'xp' => $myXp, 'public' => (bool) $me['public_board']];
  }
  return [200, ['ok' => true, 'period' => $period, 'rows' => $out, 'me' => $mine], null];
}

function ep_stats(PDO $pdo, array $ctx): array {
  $today = 'drills:' . cb_utc_today();
  $learners = (int) cb_one($pdo, 'SELECT COUNT(*) AS n FROM cb_users')['n'];
  $online = (int) cb_one($pdo, 'SELECT COUNT(*) AS n FROM cb_users WHERE last_seen >= UTC_TIMESTAMP() - INTERVAL 5 MINUTE')['n'];
  $counts = [];
  foreach (cb_rows($pdo, 'SELECT name, n FROM cb_counters WHERE name IN (?, ?)', ['drills:all', $today]) as $r) $counts[$r['name']] = (int) $r['n'];
  return [200, ['ok' => true, 'learners' => $learners, 'online' => $online, 'drillsToday' => $counts[$today] ?? 0, 'drillsAll' => $counts['drills:all'] ?? 0], null];
}

const CB_ROUTES = [
  'GET health' => 'ep_health', 'GET stats' => 'ep_stats', 'GET leaderboard' => 'ep_leaderboard', 'GET me' => 'ep_me',
  'GET progress' => 'ep_progress_get', 'POST progress' => 'ep_progress_put', 'POST signup' => 'ep_signup',
  'POST login' => 'ep_login', 'POST logout' => 'ep_logout', 'POST recover' => 'ep_recover', 'POST password' => 'ep_password',
  'POST settings' => 'ep_settings', 'POST delete' => 'ep_delete', 'POST event' => 'ep_event',
];

/* Whether a POST came from this site's own pages — the same test as
   same_origin() in server/core.py: Sec-Fetch-Site when the browser sends
   it, else Origin against the host (or the host a proxy forwarded). */
function cb_same_origin(array $headers): bool {
  $site = $headers['sec-fetch-site'] ?? '';
  if ($site !== '') return $site === 'same-origin';
  $origin = $headers['origin'] ?? '';
  if ($origin === '') return true;
  $at = strpos($origin, '://');
  $seen = strtolower(rtrim($at === false ? $origin : substr($origin, $at + 3), '/'));
  $hosts = array_filter([strtolower($headers['host'] ?? ''), strtolower(trim(explode(',', $headers['x-forwarded-host'] ?? '')[0]))], 'strlen');
  return in_array($seen, $hosts, true);
}

/* The body as [array, object] if it's a JSON object both servers accept
   (see the note in server/core.py), else null. Decoding as objects too is
   what keeps {} an object rather than an empty list, and catches keys
   that start with a NUL; re-encoding catches numbers too big for a float. */
function cb_parse_body(string $raw): ?array {
  $text = $raw === '' ? '{}' : $raw;
  $object = json_decode($text, false, CB_JSON_DEPTH + 1);
  if (!is_object($object) || json_encode($object) === false) return null;
  return [json_decode($text, true, CB_JSON_DEPTH + 1), $object];
}

/* One request: returns [status, payload, cookie]. */
function cb_handle(string $method, string $route, array $query, string $raw, array $headers, string $ip, ?string $token): array {
  $known = [];
  foreach (CB_ROUTES as $k => $fn) { [$m, $r] = explode(' ', $k); if ($r === $route) $known[] = $m; }
  if (!$known) return [404, ['ok' => false, 'error' => 'not_found', 'message' => 'No such thing here.'], null];
  if (!in_array($method, $known, true)) return [405, ['ok' => false, 'error' => 'method', 'message' => 'Wrong method.'], null];
  $body = [];
  $rawBody = new stdClass();
  if ($method === 'POST') {
    /* The custom header is the main lock: another site's page can't send
       it without a CORS answer this server never gives. */
    if (($headers['x-code-block'] ?? '') !== '1' || !cb_same_origin($headers)) {
      return [403, ['ok' => false, 'error' => 'forbidden', 'message' => 'Requests must come from Code Block itself.'], null];
    }
    if (strlen($raw) > CB_MAX_BODY) return [413, ['ok' => false, 'error' => 'too_big', 'message' => "That's too much at once."], null];
    $parsed = cb_parse_body($raw);
    if ($parsed === null) return [400, ['ok' => false, 'error' => 'bad_json', 'message' => "That request didn't make sense."], null];
    [$body, $rawBody] = $parsed;
  }
  try {
    if ($route === 'health') {
      try { $pdo = cb_connect(); } catch (ApiError $e) { return [200, ['ok' => true, 'server' => 'php', 'db' => false, 'version' => CB_VERSION], null]; }
      return ep_health($pdo, []);
    }
    $pdo = cb_connect();
    cb_tidy($pdo);
    [$user, $renewed] = cb_session_user($pdo, $token);
    $ctx = ['body' => $body, 'raw' => (array) $rawBody, 'query' => $query, 'ip' => $ip, 'user' => $user, 'token' => $user ? $token : null];
    try {
      [$status, $payload, $cookie] = (CB_ROUTES[$method . ' ' . $route])($pdo, $ctx);
    } catch (ApiError $e) {
      [$status, $payload, $cookie] = [$e->status, ['ok' => false, 'error' => $e->codeName, 'message' => $e->getMessage()], null];
    }
    if ($cookie === null && $renewed) $cookie = $renewed;
    if ($cookie === null && $token && !$user) $cookie = '';
    return [$status, $payload, $cookie];
  } catch (ApiError $e) {
    return [$e->status, ['ok' => false, 'error' => $e->codeName, 'message' => $e->getMessage()], null];
  }
}
