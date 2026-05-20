/**
 * lib/neonDb.ts — Singleton pg Pool for Neon Postgres
 * Uses DATABASE_URL from .env.local
 */
import { Pool } from "pg";

let _pool: Pool | null = null;

export function getPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!_pool) _pool = new Pool({ connectionString: url });
  return _pool;
}

/** Convenience: run a parameterised query */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getPool();
  if (!pool) throw new Error("DATABASE_URL not configured");
  const { rows } = await pool.query(sql, params);
  return rows as T[];
}
