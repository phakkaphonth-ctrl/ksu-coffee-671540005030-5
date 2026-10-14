import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import handler from "./api/info.js";

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), "public");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
};

http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  if (pathname === "/api/info") return handler(req, res);

  const file = pathname === "/" ? "index.html" : pathname.slice(1);
  const path = normalize(join(PUBLIC_DIR, file));
  if (!path.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    return res.end("Forbidden");
  }

  try {
    const data = await readFile(path);
    res.setHeader("Content-Type", TYPES[extname(path)] || "application/octet-stream");
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end("Not found");
  }
}).listen(PORT, () => console.log(`Listening on port ${PORT}`));