# Putting Code Block online

Code Block runs in two ways:

- **As a static site** (GitHub Pages, Netlify, any web server, or the single file from `npm run build:single`). Everything teaches; progress and profiles stay on each device. There are no accounts and no leaderboard, and the page never calls a server.
- **With its server** (Python or PHP, on MySQL 8). On top of everything above, learners can make free online accounts: progress saved online and ready on any device, a leaderboard, and a live count of lines typed today.

The page decides by itself: the servers add a `<meta name="cb-api">` line when they serve it, and only then does `js/account.js` switch accounts on.

## Wasmer Edge with Python (the current setup)

The app on Wasmer is connected to this GitHub repository and uses the **Python** preset with a **MySQL** database.

1. **What runs.** Wasmer installs `requirements.txt` (FastAPI, Uvicorn and PyMySQL, all without compiled parts except FastAPI's own) and runs `main:app`. That one app serves the page, its `css/`, `js/` and `tracks/` folders, and the API at `/api/index.php`. Nothing else in the repository is served.
2. **The database.** The MySQL database enabled for the app gives it its settings as environment variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME` and `DB_PASSWORD`. The server reads only those. **No password goes in the code or the repository.** The tables are made on the first request (`db/schema.sql`); there is nothing to run by hand.
3. **Deploy.** Push to the branch the app is connected to (or use Wasmer's redeploy button).
4. **Check it.** Open `https://<your-app>/api/index.php?r=health`. It should say:
   ```json
   {"ok":true,"server":"python","db":true,"version":1}
   ```
   Then open the site, go to **Sign Up** in the menu and make an account. The progress card on the Sandbox shows "lines typed today" once the server answers.

### If something is off

| You see | Most likely | What to do |
| --- | --- | --- |
| `"db":false` from the health check | The database settings aren't reaching the app. | Check that MySQL is enabled for the app and that `DB_HOST` and `DB_NAME` are set; redeploy. |
| `"db":false`, and the settings are there | The connection itself fails (TLS or login). | Set `DB_SSL=0` (no TLS) or `DB_SSL=1` (TLS required) as an environment variable and redeploy. The default tries TLS and falls back. |
| The health check address shows the page or a 404 | The Python app isn't the one answering. | Make sure the app uses the Python preset and `main:app`. |
| The deploy fails while installing packages | A package has no build for the host. | The server needs only FastAPI, Uvicorn and PyMySQL. `cryptography` is deliberately not required (see `server/mysql_login.py`). |
| Sign-ups from many people are refused as "a lot of tries" | The host's proxy doesn't pass the visitor's address, so everyone looks like one visitor. | Tell us; the limits can be keyed differently. |

### Keep the database password private

If the database password was ever shared, in a screenshot or a message, change it: the database page on Wasmer can rotate the credentials, and the app picks up the new ones from its environment on the next deploy. Nothing in this repository needs to change.

## Wasmer Edge (or any host) with PHP

The same API is written in PHP (`api/`), rule for rule, against the same tables, so the database works with either server and accounts carry over if you switch.

- Use a PHP 8.1+ host with the `pdo_mysql` extension (on Wasmer, the PHP preset), with the repository root as the web root.
- `index.php` serves the page (with the API line); `api/index.php` is the API; `api/_lib/` holds its rules and refuses direct requests (`api/_lib/.htaccess` adds a second lock on Apache).
- Give it the same `DB_*` environment variables.
- Check `https://<your-site>/api/index.php?r=health`, which says `"server":"php"`.

## Settings

| Variable | Meaning |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | The MySQL 8 server and database. |
| `DB_USERNAME` (or `DB_USER`), `DB_PASSWORD` | Its login. |
| `DB_SSL` | Optional. Unset: use TLS when the server offers it. `0`: never. `1`: always (encrypted; MySQL's certificates are usually self-signed, so not checked). `verify`: always, checking the certificate against the system's authorities. |
| `PORT` | Only for `python main.py`: the port to listen on (default 8080). |

## What the server keeps, and how

- **Accounts**: a username (3–20 letters, numbers, dots, dashes or underscores), a password hash (PBKDF2-SHA256 with 600,000 rounds and a random salt) and the SHA-256 of a one-time recovery code. No email, no real name. Deleting an account deletes everything that belongs to it.
- **Sessions**: a random 32-byte token in an HttpOnly, SameSite=Lax cookie (Secure on HTTPS); only its SHA-256 is stored. Sessions last 30 days and renew while in use. Changing the password signs out other devices; using the recovery code signs out everywhere else and issues a new code.
- **Progress**: each track's mastered blocks and Vault drills, and the typing record, as small JSON documents (64 KB each at most).
- **Typing events**: XP, speed and the learner's day for each finished line, kept as running totals and a per-day XP count for the weekly board. Lines typed without an account only add one to a daily counter.
- **Limits**: sign-ups, logins, recovery tries, events and saves are rate-limited per address and per account. Rate-limit records hold a hash of the address and are cleared within the hour.
- **Requests that change anything** must be JSON, carry an `X-Code-Block` header and come from the site's own pages (browsers say so in `Sec-Fetch-Site`; older ones send an `Origin` that must match the host). The server never answers cross-site (CORS) requests.
- **Fair play**: XP is reported by the browser, so it is capped at 80 a line and 5,000 a day. That keeps a friendly leaderboard honest enough; it is not a basis for prizes.

## Running it locally with accounts

You need MySQL 8 and Python 3.9+ or PHP 8.1+.

```sh
# a database and a user for it
mysql -u root -e "CREATE DATABASE cb_dev; CREATE USER 'cb'@'localhost' IDENTIFIED BY 'choose-a-password'; GRANT ALL ON cb_dev.* TO 'cb'@'localhost';"

export DB_HOST=127.0.0.1 DB_PORT=3306 DB_NAME=cb_dev DB_USERNAME=cb DB_PASSWORD=choose-a-password

# Python
pip install -r requirements.txt
uvicorn main:app --port 8080          # http://localhost:8080

# or PHP
php -S 127.0.0.1:8080                 # http://localhost:8080
```

To test both servers against a scratch database (its name must contain "test", because the tests empty it):

```sh
DB_NAME=cb_test npm run test:api
```
