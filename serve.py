"""Local preview server for the store.

Same as `python -m http.server`, but a missing page shows the site's own 404.html
(the way Vercel, Netlify and GitHub Pages do once the site is live).

    python serve.py          # http://localhost:5520
    python serve.py 8000     # another port
"""
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_error(self, code, message=None, explain=None):
        page = os.path.join(ROOT, "404.html")
        if code == 404 and os.path.exists(page):
            with open(page, "rb") as f:
                body = f.read()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5520
    print(f"Asif Books store on http://localhost:{port}")
    http.server.ThreadingHTTPServer(("", port), Handler).serve_forever()
