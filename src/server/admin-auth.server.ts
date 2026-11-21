import "@tanstack/react-start/server-only";
import { createHmac, randomBytes, timingSafeEqual, scryptSync } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query, ensureSchema } from "./db.server.ts";

const SESSION_COOKIE = "arjuna_admin_session";
const TOKEN_COOKIE = "arjuna_admin_token";
const CSRF_COOKIE = "arjuna_admin_csrf";
const SESSION_LIFETIME = 7 * 24 * 60 * 60 * 1000; // 7 days
const LOGIN_WINDOW = 15 * 60 * 1000;
const LOGIN_LIMIT = 5;

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.BLOG_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    return "default-insecure-secret-key-32-chars-minimum-replace-in-env";
  }
  return secret;
}

export function hashPasswordBcrypt(password: string): Promise<string> {
  return bcrypt.hash(password.trim(), 10);
}

export function hashPassword(password: string): string {
  // Sync fallback using scrypt for compatibility with legacy tests
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password.trim(), salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored) return false;
  // If stored as bcrypt hash
  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    try {
      return await bcrypt.compare(password.trim(), stored);
    } catch {
      return false;
    }
  }
  // If stored as scrypt hash
  if (stored.startsWith("scrypt:")) {
    const [, salt, expectedHex] = stored.split(":");
    if (!salt || !expectedHex) return false;
    try {
      const expected = Buffer.from(expectedHex, "hex");
      const actual = scryptSync(password.trim(), salt, expected.length);
      return actual.length === expected.length && timingSafeEqual(actual, expected);
    } catch {
      return false;
    }
  }
  return false;
}

export function getCorsHeaders(request: Request): Headers {
  const origin = request.headers.get("origin") || "";
  const allowed = [
    "https://arjunaexports.com",
    "https://www.arjunaexports.com",
    process.env.ALLOWED_ORIGIN,
  ].filter(Boolean);

  const isAllowed =
    allowed.includes(origin) ||
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:");

  const headers = new Headers();
  if (isAllowed && origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
  } else if (!origin) {
    headers.set("Access-Control-Allow-Origin", "*");
  }
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-CSRF-Token, X-Requested-With",
  );
  return headers;
}

export function createAdminToken(admin: { id: string; email: string; role?: string }): string {
  return jwt.sign(
    {
      sub: admin.id,
      id: admin.id,
      email: admin.email,
      role: admin.role || "admin",
    },
    jwtSecret(),
    { expiresIn: "7d" },
  );
}

export function verifyAdminToken(token: string): { id: string; email: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, jwtSecret()) as {
      id?: string;
      sub?: string;
      email?: string;
      role?: string;
    };
    if (!decoded || (!decoded.id && !decoded.sub)) return null;
    return {
      id: decoded.id || decoded.sub!,
      email: decoded.email || "",
      role: decoded.role || "admin",
    };
  } catch {
    return null;
  }
}

function cookieValue(request: Request, name: string): string | null {
  const cookies = request.headers.get("cookie") ?? "";
  for (const part of cookies.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) {
      try {
        return decodeURIComponent(rest.join("="));
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function createCsrfToken(): string {
  return randomBytes(32).toString("base64url");
}

export function verifyCsrf(request: Request): boolean {
  // If Bearer token is provided, CSRF is not required (stateless API authentication)
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return true;
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host && !origin.includes("arjunaexports.com")) {
        return false;
      }
    } catch {
      return false;
    }
  }

  const cookie = cookieValue(request, CSRF_COOKIE);
  const header = request.headers.get("x-csrf-token");
  if (!cookie || !header) return false;
  const cookieBuffer = Buffer.from(cookie);
  const headerBuffer = Buffer.from(header);
  return cookieBuffer.length === headerBuffer.length && timingSafeEqual(cookieBuffer, headerBuffer);
}

export function csrfCookie(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${CSRF_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=3600; SameSite=Lax; ${isProd ? "Secure;" : ""}`;
}

export function clearCsrfCookie(): string {
  return `${CSRF_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax;`;
}

export async function loginIsRateLimited(ip: string): Promise<boolean> {
  try {
    await ensureSchema();
    const ipHash = createHmac("sha256", jwtSecret()).update(ip).digest("hex");
    const since = Date.now() - LOGIN_WINDOW;
    const res = await query<{ count: string | number }>(
      "SELECT COUNT(*) AS count FROM login_attempts WHERE ip_hash = $1 AND attempted_at > $2",
      [ipHash, since],
    );
    return Number(res.rows[0]?.count || 0) >= LOGIN_LIMIT;
  } catch (err) {
    console.error("[admin-auth] loginIsRateLimited check error:", err);
    return false;
  }
}

export async function recordFailedLogin(ip: string): Promise<void> {
  try {
    await ensureSchema();
    const now = Date.now();
    const ipHash = createHmac("sha256", jwtSecret()).update(ip).digest("hex");
    await query("DELETE FROM login_attempts WHERE attempted_at < $1", [now - LOGIN_WINDOW]);
    await query("INSERT INTO login_attempts (ip_hash, attempted_at) VALUES ($1, $2)", [ipHash, now]);
  } catch (err) {
    console.error("[admin-auth] recordFailedLogin error:", err);
  }
}

export async function clearLoginFailures(ip: string): Promise<void> {
  try {
    const ipHash = createHmac("sha256", jwtSecret()).update(ip).digest("hex");
    await query("DELETE FROM login_attempts WHERE ip_hash = $1", [ipHash]);
  } catch (err) {
    console.error("[admin-auth] clearLoginFailures error:", err);
  }
}

export async function authenticateCredentials(
  email: string,
  password: string,
): Promise<{
  reason: "user_not_found" | "wrong_password" | "authenticated";
  user: { id: string; email: string; role: string } | null;
  userFound: boolean;
  passwordMatch: boolean;
}> {
  await ensureSchema();
  const normalizedEmail = email.trim().toLowerCase();

  // Look up admin by email in Neon admins table
  let rowRes = await query<{
    id: string;
    email: string;
    password_hash: string;
    role: string;
  }>(
    "SELECT id, email, password_hash, role FROM admins WHERE lower(trim(email)) = $1",
    [normalizedEmail],
  );

  // If not found in admins, check admin_users
  if (rowRes.rows.length === 0) {
    rowRes = await query<{
      id: string;
      email: string;
      password_hash: string;
      role: string;
    }>(
      "SELECT id, email, password_hash, role FROM admin_users WHERE lower(trim(email)) = $1",
      [normalizedEmail],
    );
  }

  const user = rowRes.rows[0];
  if (!user) {
    return {
      reason: "user_not_found",
      user: null,
      userFound: false,
      passwordMatch: false,
    };
  }

  const passwordMatch = await verifyPassword(password, user.password_hash);
  if (!passwordMatch) {
    return {
      reason: "wrong_password",
      user: null,
      userFound: true,
      passwordMatch: false,
    };
  }

  return {
    reason: "authenticated",
    user: { id: user.id, email: user.email, role: user.role || "admin" },
    userFound: true,
    passwordMatch: true,
  };
}

export async function checkCredentials(email: string, password: string) {
  const result = await authenticateCredentials(email, password);
  return result.user;
}

export async function changeAdminPassword(
  userId: string,
  currentPassword: string,
  nextPassword: string,
): Promise<boolean> {
  await ensureSchema();
  const res = await query<{ id: string; password_hash: string }>(
    "SELECT id, password_hash FROM admins WHERE id = $1",
    [userId],
  );
  const row = res.rows[0];
  if (!row) return false;

  const valid = await verifyPassword(currentPassword, row.password_hash);
  if (!valid) return false;

  const newHash = await hashPasswordBcrypt(nextPassword);
  await query("UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE id = $2", [
    newHash,
    userId,
  ]);
  await query("UPDATE admin_users SET password_hash = $1 WHERE id = $2", [newHash, userId]);
  await query("DELETE FROM admin_sessions WHERE user_id = $1", [userId]);
  return true;
}

export function createSessionCookie(token: string): string {
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    process.env.ALLOWED_ORIGIN?.includes("https://");

  const secureFlag = isProd ? "Secure; " : "";
  // SameSite=Lax is standard for top-level navigation and secure admin sessions
  return `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_LIFETIME / 1000}; HttpOnly; SameSite=Lax; ${secureFlag}`;
}

export function createSession(userOrId: string | { id: string; email?: string; role?: string }) {
  const id = typeof userOrId === "string" ? userOrId : userOrId.id;
  const email = typeof userOrId === "string" ? "" : userOrId.email || "";
  const role = typeof userOrId === "string" ? "admin" : userOrId.role || "admin";
  const token = jwt.sign({ sub: id, id, email, role }, jwtSecret(), { expiresIn: "7d" });
  const expiresAt = Date.now() + SESSION_LIFETIME;

  return {
    token,
    cookie: createSessionCookie(token),
    expiresAt,
  };
}

export async function currentAdmin(
  request: Request,
): Promise<{ id: string; email: string; role?: string } | null> {
  // 1. Check Authorization: Bearer <token>
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    const verified = verifyAdminToken(token);
    if (verified) return verified;
  }

  // 2. Check token cookie
  const tokenCookie = cookieValue(request, TOKEN_COOKIE);
  if (tokenCookie) {
    const verified = verifyAdminToken(tokenCookie);
    if (verified) return verified;
  }

  // 3. Check legacy session cookie
  const sessionVal = cookieValue(request, SESSION_COOKIE);
  if (sessionVal) {
    const [id] = sessionVal.split(".");
    if (id) {
      try {
        const res = await query<{ id: string; email: string; role: string }>(
          `SELECT u.id, u.email, u.role FROM admin_sessions s
           JOIN admins u ON u.id = s.user_id
           WHERE s.id = $1 AND s.expires_at > $2`,
          [id, Date.now()],
        );
        if (res.rows[0]) return res.rows[0];
      } catch {
        // ignore
      }
    }
  }

  return null;
}

export async function destroySession(request: Request): Promise<void> {
  const sessionVal = cookieValue(request, SESSION_COOKIE);
  if (sessionVal) {
    const [id] = sessionVal.split(".");
    if (id) {
      try {
        await query("DELETE FROM admin_sessions WHERE id = $1", [id]);
      } catch {
        // ignore
      }
    }
  }
}

export function clearSessionCookie(): string {
  return `${TOKEN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax;`;
}
