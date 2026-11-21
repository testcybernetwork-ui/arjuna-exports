import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");
const resetExisting = args.has("--reset-existing");
const seedFromEnv = args.has("--seed-from-env");
if (args.has("--help")) {
  process.stdout.write(
    "Usage: npm run admin:db -- --check | npm run admin:db -- --seed-from-env | npm run admin:db -- --reset-existing\n" +
      "Requires BLOG_DATA_DIR to point to an existing, persistent blog data directory and ADMIN_EMAIL.\n" +
      "--seed-from-env creates or updates the account from ADMIN_EMAIL and ADMIN_PASSWORD_HASH.\n",
  );
  process.exit(0);
}
if ([...args].some((arg) => !["--check", "--reset-existing", "--seed-from-env"].includes(arg))) {
  throw new Error("Use --check or --reset-existing; see --help.");
}
if ([checkOnly, resetExisting, seedFromEnv].filter(Boolean).length > 1)
  throw new Error("Choose only one of --check, --seed-from-env, or --reset-existing.");
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  throw new Error(
    "This utility requires a persistent SQLite volume and cannot safely target serverless temporary storage.",
  );
}

const dataDirectory = process.env.BLOG_DATA_DIR?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const environmentHash = process.env.ADMIN_PASSWORD_HASH?.trim();
if (!dataDirectory)
  throw new Error("Set BLOG_DATA_DIR to the persistent blog data directory first.");
if (!email) throw new Error("Set ADMIN_EMAIL to the administrator email first.");
if (seedFromEnv && !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/i.test(environmentHash || ""))
  throw new Error("Set ADMIN_PASSWORD_HASH to a valid scrypt hash before seeding.");
const databasePath = path.join(path.resolve(dataDirectory), "blog.sqlite");
if (!existsSync(databasePath)) throw new Error(`Database file not found: ${databasePath}`);

function readHidden(prompt) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
      reject(new Error("Run this command in an interactive terminal; password input is hidden."));
      return;
    }
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    let value = "";
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === "\u0003") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.off("data", onData);
          process.stdout.write("\nCancelled.\n");
          reject(new Error("Cancelled."));
          return;
        }
        if (char === "\r" || char === "\n") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.off("data", onData);
          process.stdout.write("\n");
          resolve(value.trim());
          return;
        }
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else value += char;
      }
    };
    process.stdin.on("data", onData);
  });
}

function verifyPassword(password, stored) {
  const [algorithm, salt, digest] = stored.split(":");
  if (
    algorithm !== "scrypt" ||
    !/^[a-f0-9]{32}$/i.test(salt || "") ||
    !/^[a-f0-9]{128}$/i.test(digest || "")
  )
    return false;
  const expected = Buffer.from(digest, "hex");
  const actual = scryptSync(password.trim(), salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

const host = process.env.RENDER
  ? "Render"
  : process.env.RAILWAY_ENVIRONMENT_NAME
    ? "Railway"
    : "Node host";
const db = new Database(databasePath, checkOnly ? { readonly: true, fileMustExist: true } : {});
try {
  const tableExists = Boolean(
    db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='admin_users'").get(),
  );
  if (!tableExists && checkOnly) {
    process.stdout.write(
      `${JSON.stringify({ host, database: databasePath, normalizedEmail: email, userFound: false, passwordMatches: false, reason: "admin_users table is missing" }, null, 2)}\n`,
    );
    process.exitCode = 2;
  } else {
    if (!checkOnly) {
      db.exec(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          passwordHash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'admin',
          createdAt TEXT NOT NULL
        );
      `);
      const columns = new Set(
        db
          .prepare("PRAGMA table_info(admin_users)")
          .all()
          .map((column) => column.name),
      );
      if (!columns.has("role"))
        db.exec("ALTER TABLE admin_users ADD COLUMN role TEXT NOT NULL DEFAULT 'admin'");
    }

    const matches = db
      .prepare(
        "SELECT id,email,passwordHash FROM admin_users WHERE lower(trim(email))=? AND role='admin'",
      )
      .all(email);
    if (matches.length > 1)
      throw new Error("More than one admin account matches the normalized email.");
    const existing = matches[0];

    if (checkOnly) {
      const password = existing ? await readHidden("Password to check (hidden input): ") : "";
      const hash = existing?.passwordHash ?? "";
      process.stdout.write(
        `${JSON.stringify(
          {
            host,
            database: databasePath,
            normalizedEmail: email,
            userFound: Boolean(existing),
            passwordMatches: existing ? verifyPassword(password, hash) : false,
            hashAlgorithm: hash.split(":")[0] || null,
            hashLength: hash.length || null,
          },
          null,
          2,
        )}\n`,
      );
      if (!existing || !verifyPassword(password, hash)) process.exitCode = 1;
    } else if (seedFromEnv) {
      const now = new Date().toISOString();
      const syncAccount = db.transaction(() => {
        if (existing) {
          db.prepare("UPDATE admin_users SET email=?,passwordHash=? WHERE id=?").run(
            email,
            environmentHash,
            existing.id,
          );
          const sessionsTableExists = Boolean(
            db
              .prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='admin_sessions'")
              .get(),
          );
          if (sessionsTableExists)
            db.prepare("DELETE FROM admin_sessions WHERE userId=?").run(existing.id);
          return "updated";
        }
        db.prepare(
          "INSERT INTO admin_users(id,email,passwordHash,role,createdAt) VALUES(?,?,?,?,?)",
        ).run(randomUUID(), email, environmentHash, "admin", now);
        return "created";
      });
      process.stdout.write(`Admin account ${syncAccount()} from environment in ${databasePath}.\n`);
    } else {
      if (existing && !resetExisting) {
        throw new Error(
          "Admin already exists. Use --reset-existing to intentionally reset its password.",
        );
      }
      const password = await readHidden("New administrator password (hidden input): ");
      if (password.length < 10 || password.length > 1024)
        throw new Error("Use a password between 10 and 1024 characters.");
      const salt = randomBytes(16).toString("hex");
      const digest = scryptSync(password, salt, 64).toString("hex");
      const passwordHash = `scrypt:${salt}:${digest}`;
      const now = new Date().toISOString();
      const updateOrInsert = db.transaction(() => {
        if (existing) {
          db.prepare("UPDATE admin_users SET email=?,passwordHash=? WHERE id=?").run(
            email,
            passwordHash,
            existing.id,
          );
          const sessionsTableExists = Boolean(
            db
              .prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='admin_sessions'")
              .get(),
          );
          if (sessionsTableExists)
            db.prepare("DELETE FROM admin_sessions WHERE userId=?").run(existing.id);
          return "reset";
        }
        db.prepare(
          "INSERT INTO admin_users(id,email,passwordHash,role,createdAt) VALUES(?,?,?,?,?)",
        ).run(randomUUID(), email, passwordHash, "admin", now);
        return "created";
      });
      const action = updateOrInsert();
      process.stdout.write(
        `Admin ${action} in ${databasePath} for ${email}. The password was not displayed.\n`,
      );
    }
  }
} finally {
  db.close();
}
