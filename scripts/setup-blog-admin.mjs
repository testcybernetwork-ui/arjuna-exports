import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function readHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    let value = "";
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === "\u0003") {
          process.stdout.write("\nCancelled.\n");
          process.exit(1);
        }
        if (char === "\r" || char === "\n") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.off("data", onData);
          process.stdout.write("\n");
          resolve(value);
          return;
        }
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else value += char;
      }
    };
    process.stdin.on("data", onData);
  });
}

const envPath = path.resolve(".env.local");
let existingEnv = [];
try {
  existingEnv = readFileSync(envPath, "utf8").split(/\r?\n/);
} catch {
  /* first setup */
}
const configuredPassword = existingEnv
  .find((line) => /^ADMIN_PASSWORD=/.test(line))
  ?.slice("ADMIN_PASSWORD=".length)
  .replace(
    /^(?:"([\s\S]*)"|'([\s\S]*)')$/,
    (_, doubleQuoted, singleQuoted) => doubleQuoted ?? singleQuoted,
  );
const passwordInput =
  process.env.ADMIN_PASSWORD ||
  configuredPassword ||
  (await (async () => {
    if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
      throw new Error(
        "Provide ADMIN_PASSWORD to the setup script or run it in an interactive terminal.",
      );
    }
    return readHidden("Admin password (hidden input): ");
  })());
const password = passwordInput.trim();
if (password.length < 10)
  throw new Error("Use an administrator password of at least 10 characters.");
if (password.length > 1024)
  throw new Error("Use an administrator password of at most 1024 characters.");
const salt = randomBytes(16).toString("hex");
const hash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
const sessionSecret = randomBytes(48).toString("base64url");
const email = process.env.ADMIN_EMAIL || "mohan@arjunaexports.com";
const preserved = existingEnv.filter(
  (line) =>
    line && !/^(ADMIN_EMAIL|ADMIN_PASSWORD|ADMIN_PASSWORD_HASH|BLOG_SESSION_SECRET)=/.test(line),
);
preserved.push(
  `ADMIN_EMAIL=${email}`,
  `ADMIN_PASSWORD_HASH=${hash}`,
  `BLOG_SESSION_SECRET=${sessionSecret}`,
);
writeFileSync(envPath, `${preserved.join("\n")}\n`, { mode: 0o600 });
process.stdout.write(
  `Admin environment written to ${envPath}. The password was not displayed. Restart the server to load it.\n`,
);
