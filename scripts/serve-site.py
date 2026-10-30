"""Local preview of the published site, as GitHub Pages serves it.

Serves public/landing-pages as the top of the site and, like Pages, answers
/about with about.html and unknown addresses with 404.html.

    python3 scripts/serve-site.py [port]      (default 8127)
"""
import http.server, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'landing-pages')


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def translate_path(self, path):
        p = super().translate_path(path)
        if not os.path.exists(p) and os.path.exists(p + '.html'):
            return p + '.html'
        return p

    def send_error(self, code, message=None, explain=None):
        if code == 404 and os.path.exists(os.path.join(ROOT, '404.html')):
            body = open(os.path.join(ROOT, '404.html'), 'rb').read()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().send_error(code, message, explain)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8127
    http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
