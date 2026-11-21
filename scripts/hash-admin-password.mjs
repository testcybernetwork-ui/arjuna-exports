import { randomBytes, scryptSync } from "node:crypto";

if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
  throw new Error("Run this script in an interactive terminal so the password is not echoed.");
}

process.stdout.write("Enter the administrator password (input is hidden): ");
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");
let password = "";
process.stdin.on("data", (chunk) => {
  for (const char of chunk) {
    if (char === "\u0003") {
      process.stdout.write("\nCancelled.\n");
      process.exit(1);
    }
    if (char === "\r" || char === "\n") {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      const normalizedPassword = password.trim();
      password = "";
      if (normalizedPassword.length < 10 || normalizedPassword.length > 1024) {
        process.stderr.write("\nUse a password between 10 and 1024 characters.\n");
        process.exit(1);
      }
      const salt = randomBytes(16).toString("hex");
      const hash = scryptSync(normalizedPassword, salt, 64).toString("hex");
      process.stdout.write(`\nADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}\n`);
      process.exit(0);
    }
    if (char === "\u007f" || char === "\b") password = password.slice(0, -1);
    else password += char;
  }
});
