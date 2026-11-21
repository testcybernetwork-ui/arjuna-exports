import pg from "pg";
import { readFileSync } from "node:fs";
import path from "node:path";
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

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  console.log("Running database migrations on Neon...");
  const schemaPath = path.resolve(process.cwd(), "src/server/schema.sql");
  const sql = readFileSync(schemaPath, "utf8");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    console.log("Database migrations applied successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
