/**
 * Script to initialize the database schema
 * Run with: pnpm tsx scripts/init-db.ts
 * 
 * Make sure to set DATABASE_URL in your .env.local file first
 */

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env.local file
try {
  const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
  envFile.split("\n").forEach((line) => {
    const [key, ...values] = line.split("=");
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join("=").trim();
    }
  });
} catch (error) {
  console.warn("⚠️  Could not read .env.local file, using environment variables");
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in environment variables");
  console.error("Please create a .env.local file with your Neon database URL");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function initDatabase() {
  try {
    console.log("🔄 Initializing database schema...");

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_type VARCHAR(20) NOT NULL,
        table_number INTEGER,
        delivery_address TEXT,
        delivery_number VARCHAR(20),
        delivery_phone VARCHAR(20),
        delivery_time INTEGER,
        items JSONB NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Created orders table");

    // Create menu_items table
    await sql`
      CREATE TABLE IF NOT EXISTS menu_items (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        ingredients TEXT[],
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log("✅ Created menu_items table");

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category)`;
    console.log("✅ Created indexes");

    console.log("✅ Database schema initialized successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initDatabase();

