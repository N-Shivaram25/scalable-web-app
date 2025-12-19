const { drizzle } = require('drizzle-orm/node-postgres');
const pg = require('pg');
const schema = require('./schema');

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

module.exports = { db, pool };
