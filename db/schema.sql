-- Code Block's database (MySQL 8). Both servers — the Python one
-- (server/) and the PHP one (api/) — run these statements on their first
-- request, so a fresh database sets itself up; every statement is safe to
-- run again. Statements are separated by a semicolon at the end of a line.
--
-- Accounts hold no email or real name: a username, a password hash
-- (PBKDF2-SHA256), and the hash of a one-time recovery code shown at
-- sign-up. Sessions and recovery codes are stored only as SHA-256 hashes.

CREATE TABLE IF NOT EXISTS cb_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(20) NOT NULL,
  username_key VARCHAR(20) NOT NULL,
  pass_hash VARCHAR(160) NOT NULL,
  recovery_hash CHAR(64) NOT NULL,
  public_board TINYINT(1) NOT NULL DEFAULT 1,
  xp INT UNSIGNED NOT NULL DEFAULT 0,
  drills INT UNSIGNED NOT NULL DEFAULT 0,
  streak INT UNSIGNED NOT NULL DEFAULT 0,
  best_streak INT UNSIGNED NOT NULL DEFAULT 0,
  last_day DATE NULL,
  best_wpm SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  last_seen DATETIME NOT NULL,
  UNIQUE KEY uq_username_key (username_key),
  KEY ix_xp (xp),
  KEY ix_last_seen (last_seen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cb_sessions (
  token_hash CHAR(64) NOT NULL PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  KEY ix_sessions_user (user_id),
  KEY ix_sessions_expires (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES cb_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cb_progress (
  user_id INT UNSIGNED NOT NULL,
  track VARCHAR(24) NOT NULL,
  data MEDIUMTEXT NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (user_id, track),
  CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES cb_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cb_daily (
  day DATE NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  xp INT UNSIGNED NOT NULL DEFAULT 0,
  drills INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (day, user_id),
  KEY ix_daily_user (user_id, day),
  CONSTRAINT fk_daily_user FOREIGN KEY (user_id) REFERENCES cb_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cb_counters (
  name VARCHAR(40) NOT NULL PRIMARY KEY,
  n BIGINT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cb_rate (
  bucket CHAR(64) NOT NULL PRIMARY KEY,
  hits INT UNSIGNED NOT NULL,
  reset_at DATETIME NOT NULL,
  KEY ix_rate_reset (reset_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
