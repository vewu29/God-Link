"""Code Block's API rules — accounts, sessions, progress, XP, the leaderboard.

This module holds the behaviour; server/app.py only wires it to HTTP. The
PHP server (api/index.php) implements the same rules, endpoint for endpoint,
against the same tables (db/schema.sql), and tests/api checks both servers
with one test suite — so a change here must be made there too.

Security, in short:
- Passwords: PBKDF2-HMAC-SHA256, 600,000 iterations, 16-byte random salt,
  stored as "pbkdf2_sha256$<iterations>$<salt>$<hash>" (standard base64).
  Both languages have it built in, so either server checks the other's
  hashes. Unknown usernames still pay for one hash, so timing doesn't tell
  which usernames exist.
- Sessions: 32 random bytes in an HttpOnly, SameSite=Lax cookie (Secure on
  HTTPS); only their SHA-256 is stored. 30 days, renewed while in use.
- Recovery: a one-time code shown at sign-up (there is no email); only its
  SHA-256 is stored. Using it sets a new password, signs out everywhere
  else and issues a fresh code.
- Requests that change anything must be JSON POSTs carrying the
  X-Code-Block header, from this site's own pages (the browser's
  Sec-Fetch-Site says so; older browsers' Origin must match the host).
- Rate limits on sign-up, login, recovery, events and saves.
- The database is reached only through parameterised queries, over TLS
  whenever the database offers it (see DB_SSL in connect()).

Both servers read a request body the same way: a JSON object no more
than 32 levels deep, with no NaN or Infinity, no number too big for a
float, no unpaired UTF-16 surrogates and no key starting with a NUL —
PHP's json_decode refuses each of those, so Python refuses them too.
"""
import base64
import datetime
import hashlib
import hmac
import json
import math
import os
import re
import secrets
import sys

import pymysql
import pymysql.cursors

from . import mysql_login

try:
    import ssl
except ImportError:  # a Python built without TLS: connect in the clear
    ssl = None

mysql_login.install()

VERSION = 1
PBKDF2_ITERATIONS = 600000
SESSION_DAYS = 30
COOKIE = "cb_session"
MAX_BODY = 100000
MAX_PROGRESS_BYTES = 65536
XP_CAP_EVENT = 80
XP_CAP_DAY = 5000
WPM_CAP = 250
JSON_DEPTH = 32
# What PHP's trim() strips, so both servers tidy names the same way.
TRIM = " \t\n\r\x0b\x00"
USERNAME_RE = re.compile(r"[A-Za-z0-9_.-]{3,20}")
TRACK_RE = re.compile(r"[a-z0-9-]{1,24}")
DAY_RE = re.compile(r"\d{4}-\d{2}-\d{2}")
RESERVED = {"admin", "administrator", "root", "system", "support", "moderator", "mod", "codeblock", "code-block", "staff", "owner", "official"}
COMMON_PASSWORDS = {
    "password", "password1", "password123", "12345678", "123456789", "1234567890", "qwertyuiop", "qwerty123",
    "iloveyou", "11111111", "00000000", "abcd1234", "abc12345", "letmein1", "sunshine", "princess",
    "football", "baseball", "welcome1", "monkey123", "dragon123", "trustno1", "passw0rd", "codeblock",
}
CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
SCHEMA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "db", "schema.sql")


class ApiError(Exception):
    """An answer the client should see: an HTTP status, a short code and plain words."""

    def __init__(self, status, code, message):
        super().__init__(message)
        self.status = status
        self.code = code
        self.message = message


# ---------- small helpers ----------

def b64(raw):
    return base64.b64encode(raw).decode("ascii")


def b64d(text):
    return base64.b64decode(text.encode("ascii"))


def sha256_hex(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def level_of(xp):
    """Level n begins at 50·(n−1)·n XP — the same rule as js/typing-fx.js."""
    n = 1
    while 50 * n * (n + 1) <= xp:
        n += 1
    return n


def utc_today():
    return datetime.datetime.now(datetime.timezone.utc).date()


# ---------- passwords, codes, tokens ----------

def hash_password(password, iterations=PBKDF2_ITERATIONS, salt=None):
    salt = salt if salt is not None else secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations, 32)
    return "pbkdf2_sha256$%d$%s$%s" % (iterations, b64(salt), b64(dk))


_DUMMY_HASH = None


def verify_password(password, stored):
    try:
        algo, iterations, salt, dk = stored.split("$")
        if algo != "pbkdf2_sha256":
            return False
        want = b64d(dk)
        got = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), b64d(salt), int(iterations), len(want))
        return hmac.compare_digest(got, want)
    except (ValueError, TypeError):
        return False


def burn_a_hash(password):
    """Spend the same time as a real check when the username is unknown."""
    global _DUMMY_HASH
    if _DUMMY_HASH is None:
        _DUMMY_HASH = hash_password("not-a-real-password")
    verify_password(password, _DUMMY_HASH)


def needs_rehash(stored):
    try:
        return int(stored.split("$")[1]) < PBKDF2_ITERATIONS
    except (IndexError, ValueError):
        return True


def new_recovery_code():
    raw = "".join(secrets.choice(CODE_ALPHABET) for _ in range(16))
    return "-".join(raw[i:i + 4] for i in range(0, 16, 4))


def recovery_hash(code):
    return sha256_hex(re.sub(r"[^A-Za-z0-9]", "", str(code)).upper())


# ---------- validation ----------

def text_field(body, name, maximum=200):
    value = body.get(name)
    if not isinstance(value, str):
        raise ApiError(400, "missing_" + name, "Please fill in the " + name + ".")
    if len(value) > maximum:
        raise ApiError(400, "too_long", "That " + name + " is too long.")
    return value


def check_username(username):
    username = username.strip(TRIM)
    if not USERNAME_RE.fullmatch(username):
        raise ApiError(400, "bad_username", "Usernames are 3 to 20 letters, numbers, dots, dashes or underscores.")
    if username.lower() in RESERVED:
        raise ApiError(400, "reserved_username", "That username is reserved — try another.")
    return username


def check_password(password, username):
    if len(password) < 8:
        raise ApiError(400, "short_password", "Passwords need at least 8 characters.")
    if len(password) > 128:
        raise ApiError(400, "long_password", "Passwords can be at most 128 characters.")
    if not password.strip(TRIM):
        raise ApiError(400, "weak_password", "A password can't be only spaces.")
    lowered = password.lower()
    if lowered in COMMON_PASSWORDS or lowered == username.lower():
        raise ApiError(400, "weak_password", "That password is too easy to guess — try a longer, less common one.")
    return password


def check_day(value):
    """The learner's own calendar day (so streaks follow their midnight),
    accepted only within a day of the server's UTC date."""
    today = utc_today()
    if isinstance(value, str) and DAY_RE.fullmatch(value):
        try:
            day = datetime.date.fromisoformat(value)
            if abs((day - today).days) <= 1:
                return day
        except ValueError:
            pass
    return today


# ---------- the database ----------

_schema_ready = False
_tls_works = None  # learned on the first connection when DB_SSL is unset
_tls_contexts = {}


def _tls_context(verify):
    """TLS settings: checked against the system's CAs, or (by default) just
    encrypted — MySQL servers usually present their own self-signed certificate."""
    if verify not in _tls_contexts:
        if verify:
            ctx = ssl.create_default_context()
        else:
            ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
        _tls_contexts[verify] = ctx
    return _tls_contexts[verify]


def _tls_failed(error):
    """Whether a failed TLS attempt is worth one try in the clear: not when
    the host simply couldn't be reached."""
    original = getattr(error, "original_exception", None)
    return original is None or (ssl is not None and isinstance(original, ssl.SSLError))


def connect():
    """A connection to the database named by the DB_* settings Wasmer (or any
    host) provides. DB_SSL: unset = TLS when the server offers it; 0 = never;
    1 = always (encrypted, unverified); verify = always, checking the
    certificate and host name."""
    global _schema_ready, _tls_works
    host = os.environ.get("DB_HOST")
    name = os.environ.get("DB_NAME")
    if not host or not name:
        raise ApiError(503, "no_database", "Accounts aren't switched on here yet — your progress is safe on this device.")
    options = dict(
        host=host,
        port=int(os.environ.get("DB_PORT") or 3306),
        user=os.environ.get("DB_USERNAME") or os.environ.get("DB_USER") or "",
        password=os.environ.get("DB_PASSWORD") or "",
        database=name,
        charset="utf8mb4",
        autocommit=True,
        connect_timeout=8,
        read_timeout=20,
        write_timeout=20,
        cursorclass=pymysql.cursors.DictCursor,
    )
    mode = (os.environ.get("DB_SSL") or "").strip().lower()
    resting = ApiError(503, "no_database", "The account server is having a rest — your progress is safe on this device. Try again in a minute.")
    try:
        if mode in ("0", "off", "false", "no", "disable", "disabled") or ssl is None and mode in ("", "prefer", "preferred"):
            conn = pymysql.connect(ssl_disabled=True, **options)
        elif mode in ("1", "on", "true", "yes", "require", "required", "verify"):
            if ssl is None:
                raise resting
            conn = pymysql.connect(ssl=_tls_context(mode == "verify"), **options)
        elif _tls_works is False:
            conn = pymysql.connect(ssl_disabled=True, **options)
        else:
            try:
                conn = pymysql.connect(ssl=_tls_context(False), **options)
                _tls_works = True
            except pymysql.MySQLError as e:
                if _tls_works or not _tls_failed(e):
                    raise
                conn = pymysql.connect(ssl_disabled=True, **options)
                _tls_works = False
    except ApiError:
        raise
    except Exception:  # unreachable, refused, bad login or a driver fault: all the same to a learner
        raise resting
    if not _schema_ready:
        try:
            ensure_schema(conn)
        except pymysql.MySQLError:
            conn.close()
            raise resting
        _schema_ready = True
    return conn


def schema_statements():
    with open(SCHEMA, encoding="utf-8") as f:
        text = "\n".join(line for line in f.read().splitlines() if not line.strip().startswith("--"))
    return [s.strip() for s in re.split(r";\s*\n", text) if s.strip()]


def ensure_schema(conn):
    """Build the tables on a new database. A marker row records the schema
    version, so the PHP server (which starts fresh on every request) needs
    only one cheap query to know the tables are there."""
    with conn.cursor() as cur:
        try:
            cur.execute("SELECT n FROM cb_counters WHERE name = 'schema'")
            row = cur.fetchone()
            if row and int(row["n"]) >= VERSION:
                return
        except pymysql.MySQLError:
            pass  # a fresh database: build it below
        for statement in schema_statements():
            cur.execute(statement.rstrip(";"))
        cur.execute("INSERT INTO cb_counters (name, n) VALUES ('schema', %s) ON DUPLICATE KEY UPDATE n = %s", (VERSION, VERSION))


def one(conn, sql, args=()):
    with conn.cursor() as cur:
        cur.execute(sql, args)
        return cur.fetchone()


def run(conn, sql, args=()):
    with conn.cursor() as cur:
        cur.execute(sql, args)
        return cur.rowcount


def rows(conn, sql, args=()):
    with conn.cursor() as cur:
        cur.execute(sql, args)
        return cur.fetchall()


def hit(conn, bucket, limit, window_seconds):
    """Count one try against a limit; refuse once the window is full."""
    key = sha256_hex(bucket)
    run(conn,
        "INSERT INTO cb_rate (bucket, hits, reset_at) VALUES (%s, 1, UTC_TIMESTAMP() + INTERVAL %s SECOND) "
        "ON DUPLICATE KEY UPDATE hits = IF(reset_at < UTC_TIMESTAMP(), 1, hits + 1), "
        "reset_at = IF(reset_at < UTC_TIMESTAMP(), UTC_TIMESTAMP() + INTERVAL %s SECOND, reset_at)",
        (key, window_seconds, window_seconds))
    row = one(conn, "SELECT hits FROM cb_rate WHERE bucket = %s", (key,))
    if row and row["hits"] > limit:
        raise ApiError(429, "too_many", "That's a lot of tries in a short time — wait a few minutes, then try again.")


def tidy(conn):
    """Now and then, sweep out expired sessions and old rate counters."""
    if secrets.randbelow(50) == 0:
        run(conn, "DELETE FROM cb_rate WHERE reset_at < UTC_TIMESTAMP() - INTERVAL 1 HOUR LIMIT 500")
        run(conn, "DELETE FROM cb_sessions WHERE expires_at < UTC_TIMESTAMP() LIMIT 500")


def bump(conn, name, by=1):
    run(conn, "INSERT INTO cb_counters (name, n) VALUES (%s, %s) ON DUPLICATE KEY UPDATE n = n + %s", (name, by, by))


# ---------- users and sessions ----------

USER_COLUMNS = "id, username, xp, drills, streak, best_streak, last_day, best_wpm, public_board, created_at"


def public_user(row):
    return {
        "id": row["id"],
        "username": row["username"],
        "xp": row["xp"],
        "level": level_of(row["xp"]),
        "streak": row["streak"],
        "bestStreak": row["best_streak"],
        "lastDay": row["last_day"].isoformat() if row.get("last_day") else None,
        "drills": row["drills"],
        "bestWpm": row["best_wpm"],
        "public": bool(row["public_board"]),
        "joined": row["created_at"].date().isoformat(),
    }


def start_session(conn, user_id):
    token = secrets.token_urlsafe(32)
    run(conn,
        "INSERT INTO cb_sessions (token_hash, user_id, created_at, expires_at) "
        "VALUES (%s, %s, UTC_TIMESTAMP(), UTC_TIMESTAMP() + INTERVAL %s DAY)",
        (sha256_hex(token), user_id, SESSION_DAYS))
    return token


def session_user(conn, token):
    """The signed-in user for a cookie, or None. Returns (user, renewed_token_or_None)."""
    if not token or len(token) > 200:
        return None, None
    row = one(conn,
              "SELECT u." + USER_COLUMNS.replace(", ", ", u.") + ", s.expires_at FROM cb_sessions s "
              "JOIN cb_users u ON u.id = s.user_id WHERE s.token_hash = %s AND s.expires_at > UTC_TIMESTAMP()",
              (sha256_hex(token),))
    if not row:
        return None, None
    renewed = None
    left = row["expires_at"] - datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    if left < datetime.timedelta(days=SESSION_DAYS / 2):
        run(conn, "UPDATE cb_sessions SET expires_at = UTC_TIMESTAMP() + INTERVAL %s DAY WHERE token_hash = %s",
            (SESSION_DAYS, sha256_hex(token)))
        renewed = token
    run(conn, "UPDATE cb_users SET last_seen = UTC_TIMESTAMP() WHERE id = %s AND last_seen < UTC_TIMESTAMP() - INTERVAL 60 SECOND",
        (row["id"],))
    return row, renewed


def load_user(conn, user_id):
    return one(conn, "SELECT " + USER_COLUMNS + " FROM cb_users WHERE id = %s", (user_id,))


# ---------- the endpoints ----------
# Each takes (conn, ctx) where ctx carries: body (dict), query (dict), ip,
# user (row or None), token (cookie value or None). Each returns
# (status, payload, cookie) where cookie is None (leave it), a token string
# (set it) or "" (clear it).

def ep_health(conn, ctx):
    return 200, {"ok": True, "server": "python", "db": True, "version": VERSION}, None


def ep_signup(conn, ctx):
    body = ctx["body"]
    hit(conn, "signup:" + ctx["ip"], 10, 3600)
    username = check_username(text_field(body, "username", 40))
    password = check_password(text_field(body, "password", 400), username)
    public = body.get("public", True) is not False
    code = new_recovery_code()
    try:
        run(conn,
            "INSERT INTO cb_users (username, username_key, pass_hash, recovery_hash, public_board, created_at, last_seen) "
            "VALUES (%s, %s, %s, %s, %s, UTC_TIMESTAMP(), UTC_TIMESTAMP())",
            (username, username.lower(), hash_password(password), recovery_hash(code), 1 if public else 0))
    except pymysql.err.IntegrityError:
        raise ApiError(409, "taken", "That username is taken — try another.")
    user = one(conn, "SELECT " + USER_COLUMNS + " FROM cb_users WHERE username_key = %s", (username.lower(),))
    bump(conn, "signups")
    token = start_session(conn, user["id"])
    return 201, {"ok": True, "user": public_user(user), "recoveryCode": code}, token


def ep_login(conn, ctx):
    body = ctx["body"]
    username = text_field(body, "username", 40).strip(TRIM)
    password = text_field(body, "password", 400)
    key = username.lower()
    hit(conn, "login-ip:" + ctx["ip"], 60, 900)
    hit(conn, "login:" + ctx["ip"] + ":" + key, 10, 900)
    hit(conn, "login-user:" + key, 20, 900)
    row = one(conn, "SELECT id, pass_hash FROM cb_users WHERE username_key = %s", (key,))
    if not row:
        burn_a_hash(password)
        raise ApiError(401, "bad_login", "That username and password don't match.")
    if not verify_password(password, row["pass_hash"]):
        raise ApiError(401, "bad_login", "That username and password don't match.")
    if needs_rehash(row["pass_hash"]):
        run(conn, "UPDATE cb_users SET pass_hash = %s WHERE id = %s", (hash_password(password), row["id"]))
    run(conn, "UPDATE cb_users SET last_seen = UTC_TIMESTAMP() WHERE id = %s", (row["id"],))
    token = start_session(conn, row["id"])
    return 200, {"ok": True, "user": public_user(load_user(conn, row["id"]))}, token


def ep_logout(conn, ctx):
    if ctx["token"]:
        run(conn, "DELETE FROM cb_sessions WHERE token_hash = %s", (sha256_hex(ctx["token"]),))
    return 200, {"ok": True}, ""


def require_user(ctx):
    if not ctx["user"]:
        raise ApiError(401, "signed_out", "Please sign in first.")
    return ctx["user"]


def ep_me(conn, ctx):
    user = require_user(ctx)
    return 200, {"ok": True, "user": public_user(user)}, None


def ep_recover(conn, ctx):
    body = ctx["body"]
    username = text_field(body, "username", 40).strip(TRIM)
    code = text_field(body, "recoveryCode", 60)
    key = username.lower()
    hit(conn, "recover:" + ctx["ip"], 10, 3600)
    hit(conn, "recover-user:" + key, 5, 3600)
    row = one(conn, "SELECT id, username, recovery_hash FROM cb_users WHERE username_key = %s", (key,))
    if not row or not hmac.compare_digest(row["recovery_hash"], recovery_hash(code)):
        raise ApiError(401, "bad_code", "That username and recovery code don't match.")
    password = check_password(text_field(body, "password", 400), row["username"])
    fresh = new_recovery_code()
    run(conn, "UPDATE cb_users SET pass_hash = %s, recovery_hash = %s WHERE id = %s",
        (hash_password(password), recovery_hash(fresh), row["id"]))
    run(conn, "DELETE FROM cb_sessions WHERE user_id = %s", (row["id"],))
    token = start_session(conn, row["id"])
    return 200, {"ok": True, "user": public_user(load_user(conn, row["id"])), "recoveryCode": fresh}, token


def ep_password(conn, ctx):
    user = require_user(ctx)
    body = ctx["body"]
    hit(conn, "password:" + str(user["id"]), 10, 900)
    current = text_field(body, "password", 400)
    row = one(conn, "SELECT pass_hash FROM cb_users WHERE id = %s", (user["id"],))
    if not verify_password(current, row["pass_hash"]):
        raise ApiError(401, "bad_password", "Your current password isn't right.")
    new = check_password(text_field(body, "newPassword", 400), user["username"])
    run(conn, "UPDATE cb_users SET pass_hash = %s WHERE id = %s", (hash_password(new), user["id"]))
    run(conn, "DELETE FROM cb_sessions WHERE user_id = %s AND token_hash <> %s", (user["id"], sha256_hex(ctx["token"])))
    return 200, {"ok": True}, None


def ep_settings(conn, ctx):
    user = require_user(ctx)
    public = ctx["body"].get("public")
    if not isinstance(public, bool):
        raise ApiError(400, "bad_settings", "Nothing to change.")
    run(conn, "UPDATE cb_users SET public_board = %s WHERE id = %s", (1 if public else 0, user["id"]))
    return 200, {"ok": True, "user": public_user(load_user(conn, user["id"]))}, None


def ep_delete(conn, ctx):
    user = require_user(ctx)
    hit(conn, "delete:" + str(user["id"]), 10, 900)
    password = text_field(ctx["body"], "password", 400)
    row = one(conn, "SELECT pass_hash FROM cb_users WHERE id = %s", (user["id"],))
    if not verify_password(password, row["pass_hash"]):
        raise ApiError(401, "bad_password", "That password isn't right, so nothing was deleted.")
    run(conn, "DELETE FROM cb_users WHERE id = %s", (user["id"],))
    return 200, {"ok": True}, ""


def ep_progress_get(conn, ctx):
    user = require_user(ctx)
    tracks = {}
    for row in rows(conn, "SELECT track, data, updated_at FROM cb_progress WHERE user_id = %s", (user["id"],)):
        try:
            data = json.loads(row["data"])
        except ValueError:
            continue
        if isinstance(data, dict):
            tracks[row["track"]] = {"data": data, "updated": row["updated_at"].isoformat() + "Z"}
    return 200, {"ok": True, "tracks": tracks}, None


def ep_progress_put(conn, ctx):
    user = require_user(ctx)
    body = ctx["body"]
    track = body.get("track")
    if not isinstance(track, str) or not TRACK_RE.fullmatch(track):
        raise ApiError(400, "bad_track", "Unknown track.")
    data = body.get("data")
    if not isinstance(data, dict):
        raise ApiError(400, "bad_data", "Progress must be an object.")
    text = json.dumps(data, separators=(",", ":"), ensure_ascii=False)
    if len(text.encode("utf-8")) > MAX_PROGRESS_BYTES:
        raise ApiError(413, "too_big", "That progress is too big to save.")
    hit(conn, "progress:" + str(user["id"]), 60, 60)
    run(conn,
        "INSERT INTO cb_progress (user_id, track, data, updated_at) VALUES (%s, %s, %s, UTC_TIMESTAMP()) "
        "ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = VALUES(updated_at)",
        (user["id"], track, text))
    return 200, {"ok": True}, None


def whole(value, maximum):
    """A JSON number as a whole number from 0 to maximum; anything else is 0."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return 0
    return int(max(0, min(maximum, value)))


def ep_event(conn, ctx):
    body = ctx["body"]
    kind = body.get("kind")
    if kind not in ("rep", "master", "bank"):
        raise ApiError(400, "bad_event", "Unknown event.")
    track = body.get("track")
    if not isinstance(track, str) or not TRACK_RE.fullmatch(track):
        raise ApiError(400, "bad_track", "Unknown track.")
    xp = whole(body.get("xp"), XP_CAP_EVENT)
    wpm = whole(body.get("wpm"), WPM_CAP)
    utc_day = utc_today().isoformat()
    user = ctx["user"]
    if not user:
        hit(conn, "event-ip:" + ctx["ip"], 120, 60)
        bump(conn, "drills:all")
        bump(conn, "drills:" + utc_day)
        return 200, {"ok": True, "user": None}, None
    hit(conn, "event:" + str(user["id"]), 120, 60)
    day = check_day(body.get("day"))
    today = one(conn, "SELECT xp FROM cb_daily WHERE day = %s AND user_id = %s", (day, user["id"]))
    earned_today = today["xp"] if today else 0
    xp = max(0, min(xp, XP_CAP_DAY - earned_today))
    last = user.get("last_day")
    if last == day:
        streak = user["streak"]
    elif last == day - datetime.timedelta(days=1):
        streak = user["streak"] + 1
    elif last and last > day:
        streak = user["streak"]
    else:
        streak = 1
    newest = day if not last or day > last else last
    run(conn,
        "UPDATE cb_users SET xp = xp + %s, drills = drills + 1, best_wpm = GREATEST(best_wpm, %s), "
        "streak = %s, best_streak = GREATEST(best_streak, %s), last_day = %s, last_seen = UTC_TIMESTAMP() WHERE id = %s",
        (xp, wpm, streak, streak, newest, user["id"]))
    run(conn,
        "INSERT INTO cb_daily (day, user_id, xp, drills) VALUES (%s, %s, %s, 1) "
        "ON DUPLICATE KEY UPDATE xp = xp + VALUES(xp), drills = drills + 1",
        (day, user["id"], xp))
    bump(conn, "drills:all")
    bump(conn, "drills:" + utc_day)
    return 200, {"ok": True, "user": public_user(load_user(conn, user["id"]))}, None


def ep_leaderboard(conn, ctx):
    period = ctx["query"].get("period", "week")
    if period not in ("week", "all"):
        period = "week"
    me = ctx["user"]
    if period == "week":
        board = rows(conn,
                     "SELECT u.id, u.username, u.streak, SUM(d.xp) AS xp FROM cb_daily d JOIN cb_users u ON u.id = d.user_id "
                     "WHERE d.day >= UTC_DATE() - INTERVAL 6 DAY AND u.public_board = 1 "
                     "GROUP BY u.id, u.username, u.streak HAVING xp > 0 ORDER BY xp DESC, u.username_key LIMIT 20")
    else:
        board = rows(conn,
                     "SELECT id, username, streak, xp FROM cb_users WHERE public_board = 1 AND xp > 0 "
                     "ORDER BY xp DESC, username_key LIMIT 20")
    out = [{"rank": i + 1, "username": r["username"], "xp": int(r["xp"]), "level": level_of(int(r["xp"])), "streak": r["streak"],
            "me": bool(me and r["id"] == me["id"])} for i, r in enumerate(board)]
    mine = None
    if me:
        if period == "week":
            row = one(conn, "SELECT COALESCE(SUM(xp), 0) AS xp FROM cb_daily WHERE user_id = %s AND day >= UTC_DATE() - INTERVAL 6 DAY", (me["id"],))
            my_xp = int(row["xp"])
            ahead = one(conn,
                        "SELECT COUNT(*) AS n FROM (SELECT d.user_id, SUM(d.xp) AS xp FROM cb_daily d JOIN cb_users u ON u.id = d.user_id "
                        "WHERE d.day >= UTC_DATE() - INTERVAL 6 DAY AND u.public_board = 1 GROUP BY d.user_id HAVING xp > %s) t", (my_xp,))
        else:
            my_xp = int(me["xp"])
            ahead = one(conn, "SELECT COUNT(*) AS n FROM cb_users WHERE public_board = 1 AND xp > %s", (my_xp,))
        mine = {"rank": int(ahead["n"]) + 1, "xp": my_xp, "public": bool(me["public_board"])}
    return 200, {"ok": True, "period": period, "rows": out, "me": mine}, None


def ep_stats(conn, ctx):
    learners = one(conn, "SELECT COUNT(*) AS n FROM cb_users")["n"]
    online = one(conn, "SELECT COUNT(*) AS n FROM cb_users WHERE last_seen >= UTC_TIMESTAMP() - INTERVAL 5 MINUTE")["n"]
    counts = {r["name"]: int(r["n"]) for r in rows(conn, "SELECT name, n FROM cb_counters WHERE name IN (%s, %s)",
                                                       ("drills:all", "drills:" + utc_today().isoformat()))}
    return 200, {"ok": True, "learners": int(learners), "online": int(online),
                 "drillsToday": counts.get("drills:" + utc_today().isoformat(), 0), "drillsAll": counts.get("drills:all", 0)}, None


ROUTES = {
    ("GET", "health"): ep_health,
    ("GET", "stats"): ep_stats,
    ("GET", "leaderboard"): ep_leaderboard,
    ("GET", "me"): ep_me,
    ("GET", "progress"): ep_progress_get,
    ("POST", "progress"): ep_progress_put,
    ("POST", "signup"): ep_signup,
    ("POST", "login"): ep_login,
    ("POST", "logout"): ep_logout,
    ("POST", "recover"): ep_recover,
    ("POST", "password"): ep_password,
    ("POST", "settings"): ep_settings,
    ("POST", "delete"): ep_delete,
    ("POST", "event"): ep_event,
}


def _no_constants(name):
    raise ValueError("JSON has no " + name)


def _finite_float(text):
    value = float(text)
    if not math.isfinite(value):
        raise ValueError("number too big")
    return value


def _float_sized_int(text):
    value = int(text)
    if abs(value) > sys.float_info.max:
        raise ValueError("number too big")
    return value


def _unicode_ok(text):
    try:
        text.encode("utf-8")
        return True
    except UnicodeEncodeError:  # an unpaired surrogate such as "\ud800"
        return False


def _sound(value):
    """No deeper than JSON_DEPTH, no unpaired surrogates, no key starting with NUL."""
    stack = [(value, 1)]
    while stack:
        item, depth = stack.pop()
        if isinstance(item, dict):
            if depth > JSON_DEPTH:
                return False
            for key, inner in item.items():
                if key.startswith("\x00") or not _unicode_ok(key):
                    return False
                stack.append((inner, depth + 1))
        elif isinstance(item, list):
            if depth > JSON_DEPTH:
                return False
            stack.extend((inner, depth + 1) for inner in item)
        elif isinstance(item, str) and not _unicode_ok(item):
            return False
    return True


def parse_body(raw_body):
    """The request body as a dict, or None if it isn't a JSON object both servers accept."""
    try:
        body = json.loads(raw_body.decode("utf-8") or "{}", parse_constant=_no_constants,
                          parse_float=_finite_float, parse_int=_float_sized_int)
    except (ValueError, UnicodeDecodeError, RecursionError):
        return None
    return body if isinstance(body, dict) and _sound(body) else None


def same_origin(headers):
    """Whether a POST came from this site's own pages. Browsers say so
    directly in Sec-Fetch-Site, which no proxy rewrites; older browsers
    send only Origin, which is checked against the host instead (a proxy
    may rewrite Host, so the forwarded host counts too). Requests with
    neither come from outside a browser, where cookies can't be borrowed."""
    site = headers.get("sec-fetch-site")
    if site:
        return site == "same-origin"
    origin = headers.get("origin")
    if not origin:
        return True
    seen = origin.split("://", 1)[-1].rstrip("/").lower()
    hosts = {headers.get("host", "").lower(), headers.get("x-forwarded-host", "").split(",")[0].strip().lower()}
    return seen in hosts - {""}


def handle(method, route, query, raw_body, headers, ip, token):
    """Run one API request. Returns (status, payload, cookie)."""
    known = {m for (m, r) in ROUTES if r == route}
    if not known:
        return 404, {"ok": False, "error": "not_found", "message": "No such thing here."}, None
    if method not in known:
        return 405, {"ok": False, "error": "method", "message": "Wrong method."}, None
    body = {}
    if method == "POST":
        # The custom header is the main lock: another site's page can't
        # send it without a CORS answer this server never gives.
        if headers.get("x-code-block") != "1" or not same_origin(headers):
            return 403, {"ok": False, "error": "forbidden", "message": "Requests must come from Code Block itself."}, None
        if len(raw_body) > MAX_BODY:
            return 413, {"ok": False, "error": "too_big", "message": "That's too much at once."}, None
        body = parse_body(raw_body)
        if body is None:
            return 400, {"ok": False, "error": "bad_json", "message": "That request didn't make sense."}, None
    conn = None
    try:
        if route == "health":
            try:
                conn = connect()
            except ApiError:
                return 200, {"ok": True, "server": "python", "db": False, "version": VERSION}, None
            return ep_health(conn, None)
        conn = connect()
        tidy(conn)
        user, renewed = session_user(conn, token)
        ctx = {"body": body, "query": query, "ip": ip, "user": user, "token": token if user else None}
        try:
            status, payload, cookie = ROUTES[(method, route)](conn, ctx)
        except ApiError as e:
            status, payload, cookie = e.status, {"ok": False, "error": e.code, "message": e.message}, None
        if cookie is None and renewed:
            cookie = renewed
        if cookie is None and token and not user:
            cookie = ""  # a stale cookie: clear it
        return status, payload, cookie
    except ApiError as e:
        return e.status, {"ok": False, "error": e.code, "message": e.message}, None
    finally:
        if conn is not None:
            conn.close()
