export default function handler(req, res) {
  const platform = process.env.VERCEL ? "vercel"
    : process.env.RENDER ? "render" : "local";
  const commit = process.env.VERCEL_GIT_COMMIT_SHA
    || process.env.RENDER_GIT_COMMIT || "local";

  const body = {
    platform,
    student: process.env.STUDENT_ID || "NOT SET",
    commit,
    time: new Date().toISOString(),
  };

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body, null, 2));
}