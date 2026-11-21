import pg from "pg";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import dns from "node:dns";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const resolver = new dns.Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

const originalLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  let cb = callback;
  let opts = options;
  if (typeof options === "function") {
    cb = options;
    opts = {};
  }
  if (typeof hostname === "string" && hostname.includes("neon.tech")) {
    resolver.resolve4(hostname, (err, addrs) => {
      if (!err && addrs && addrs.length > 0) {
        if (opts && opts.all) {
          return cb(
            null,
            addrs.map((a) => ({ address: a, family: 4 })),
          );
        }
        return cb(null, addrs[0], 4);
      }
      return originalLookup(hostname, opts, cb);
    });
  } else {
    return originalLookup(hostname, opts, cb);
  }
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  console.error(
    "ERROR: Both ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set.",
  );
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function seedAdmin() {
  const email = adminEmail.trim().toLowerCase();
  const password = adminPassword.trim();

  if (password.length < 8) {
    console.error("ERROR: ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  console.log(`Hashing password and seeding admin for: ${email}`);
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const client = await pool.connect();
  try {
    const adminId = randomUUID();

    // Upsert into admins table
    await client.query(
      `
      INSERT INTO admins (id, email, password_hash, role, created_at, updated_at)
      VALUES ($1, $2, $3, 'admin', NOW(), NOW())
      ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          updated_at = NOW();
      `,
      [adminId, email, passwordHash],
    );

    // Also upsert into admin_users table for backwards compatibility
    await client.query(
      `
      INSERT INTO admin_users (id, email, password_hash, role, created_at)
      VALUES ($1, $2, $3, 'admin', NOW())
      ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash;
      `,
      [adminId, email, passwordHash],
    );

    console.log(`Admin user '${email}' seeded successfully in Neon!`);
  } catch (error) {
    console.error("Failed to seed admin:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedAdmin();
