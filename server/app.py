"""The web server: the site itself plus the JSON API at /api/index.php.

Wasmer runs it through main.py (main:app). Locally:
    pip install -r requirements.txt
    DB_HOST=… DB_PORT=… DB_NAME=… DB_USERNAME=… DB_PASSWORD=… uvicorn main:app --port 8080

The API URL ends in .php on purpose: the PHP server (api/index.php)
answers at the same address, so the page works unchanged on either.
Without DB_* settings the site still runs; the API reports that
accounts are off and the page keeps progress on the device.
"""
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from starlette.concurrency import run_in_threadpool
from starlette.staticfiles import StaticFiles

from . import core

ROOT = Path(__file__).resolve().parent.parent
app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
}


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    for name, value in SECURITY_HEADERS.items():
        response.headers.setdefault(name, value)
    return response


def client_ip(request):
    """The visitor's address: the last hop a proxy added, else the socket's."""
    hops = [h.strip() for h in request.headers.get("x-forwarded-for", "").split(",") if h.strip()]
    if hops:
        return hops[-1]
    real = request.headers.get("x-real-ip", "").strip()
    if real:
        return real
    return request.client.host if request.client else "unknown"


def is_https(request):
    """Whether the visitor's browser is on HTTPS, so the cookie gets Secure.
    A proxy in front may speak plain HTTP to this server; the page's own
    address (in Origin or Referer) still tells."""
    proto = request.headers.get("x-forwarded-proto", "").split(",")[0].strip()
    if (proto or request.url.scheme) == "https":
        return True
    return any(request.headers.get(h, "").startswith("https://") for h in ("origin", "referer"))


async def read_body(request, limit):
    """Up to limit + 1 bytes of the body: enough to know it's too big
    without holding a huge upload in memory."""
    chunks, size = [], 0
    async for chunk in request.stream():
        chunks.append(chunk)
        size += len(chunk)
        if size > limit:
            break
    return b"".join(chunks)[:limit + 1]


@app.api_route("/api/index.php", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
async def api(request: Request):
    raw = await read_body(request, core.MAX_BODY) if request.method == "POST" else b""
    headers = {k.lower(): v for k, v in request.headers.items()}
    try:
        status, payload, cookie = await run_in_threadpool(
            core.handle, request.method, request.query_params.get("r", ""), dict(request.query_params),
            raw, headers, client_ip(request), request.cookies.get(core.COOKIE))
    except Exception:  # never leak internals; the client gets plain words
        status, payload, cookie = 500, {"ok": False, "error": "server", "message": "Something went wrong on our side. Try again in a minute."}, None
    response = JSONResponse(payload, status_code=status, headers={"Cache-Control": "no-store"})
    secure = is_https(request)
    if cookie == "":
        response.delete_cookie(core.COOKIE, path="/", secure=secure, httponly=True, samesite="lax")
    elif cookie:
        response.set_cookie(core.COOKIE, cookie, max_age=core.SESSION_DAYS * 86400, path="/",
                            secure=secure, httponly=True, samesite="lax")
    return response


# The page says the API is here, so js/account.js switches accounts on
# (a static copy of the site, without this line, never asks).
API_META = '<head>\n    <meta name="cb-api" content="api/index.php">'


def page():
    html = (ROOT / "index.html").read_text(encoding="utf-8").replace("<head>", API_META, 1)
    return HTMLResponse(html, headers={"Cache-Control": "no-cache"})


@app.api_route("/", methods=["GET", "HEAD"])
async def home():
    return page()


@app.api_route("/index.html", methods=["GET", "HEAD"])
async def index():
    return page()


# Only the folders the page loads are served — never the server's own code,
# the tests or the repository's other files.
for folder in ("css", "js", "tracks"):
    app.mount("/" + folder, StaticFiles(directory=ROOT / folder), name=folder)
