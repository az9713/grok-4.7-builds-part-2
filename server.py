#!/usr/bin/env python3
"""Serve the grill questionnaire and persist answers.json in this folder."""

from __future__ import annotations

import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ANSWERS = ROOT / "answers.json"
PORT = int(os.environ.get("PORT", "8765"))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        if self.path.rstrip("/") != "/save":
            self.send_error(404, "unknown endpoint")
            return
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length)
        try:
            payload = json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_error(400, "body must be JSON")
            return
        ANSWERS.write_text(
            json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        body = json.dumps(
            {"ok": True, "path": "answers.json", "bytes": ANSWERS.stat().st_size}
        ).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))


if __name__ == "__main__":
    os.chdir(ROOT)
    httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Grill questionnaire: http://127.0.0.1:{PORT}/questionnaire.html")
    print(f"Answers write to:    {ANSWERS}")
    print("Save in the page. I will read answers.json from this folder.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
