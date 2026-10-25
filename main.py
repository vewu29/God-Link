"""Code Block's Python entry point. Wasmer Edge runs `main:app`.

Locally: `uvicorn main:app --port 8080`, or `python main.py`.
"""
import os

from server.app import app

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
