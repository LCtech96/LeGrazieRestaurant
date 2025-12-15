import { neon } from "@neondatabase/serverless";

// Lazy initialization to avoid errors during build time
let sqlInstance: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!sqlInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    sqlInstance = neon(process.env.DATABASE_URL);
  }
  return sqlInstance;
}

// Export a proxy that initializes sql only when actually used
export const sql = new Proxy({} as ReturnType<typeof neon>, {
  get(_target, prop) {
    const sql = getSql();
    const value = (sql as any)[prop];
    if (typeof value === 'function') {
      return value.bind(sql);
    }
    return value;
  },
});

// Database schema (run this in your Neon database)
/*
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
);

CREATE TABLE IF NOT EXISTS menu_items (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  ingredients TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
*/



