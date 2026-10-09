const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const connectionString = "postgresql://postgres.bfnvobksryepuykvhcqo:25104010%40VEDANT@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres";

async function runMigration() {
  console.log("Connecting to Supabase PostgreSQL database...");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected successfully!");

    const sqlPath = path.join(__dirname, "../lib/supabase/schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    console.log("Executing schema SQL and seed data...");
    await client.query(sql);

    console.log("SUCCESS! Tables 'categories', 'workers', 'service_requests', and 'audit_logs' created and seeded!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

runMigration();
