/**
 * Frees TCP port 3000 (typical Next dev) so a stale `next dev` cannot serve
 * broken HTML that 404s `/_next/static/chunks/*.js` after a rebuild.
 */
import { execSync } from "node:child_process";
import process from "node:process";

const port = process.env.DEV_PORT ?? "3000";

function killWindows() {
  let out;
  try {
    out = execSync("netstat -ano", { encoding: "utf8" });
  } catch {
    return;
  }
  const pids = new Set();
  for (const line of out.split("\n")) {
    if (!line.includes("LISTENING")) continue;
    if (!line.includes(`:${port}`)) continue;
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (/^\d+$/.test(pid)) pids.add(pid);
  }
  for (const pid of pids) {
    try {
      execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
    } catch {
      /* ignore */
    }
  }
}

function killUnix() {
  try {
    execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: "ignore" });
  } catch {
    /* nothing listening or lsof missing */
  }
}

if (process.platform === "win32") killWindows();
else killUnix();
