/**
 * Cloudflare D1 Database Access Layer
 * 
 * Provides a clean abstraction for querying Cloudflare D1 using parameterized
 * prepared statements. Works in Cloudflare Workers via `@opennextjs/cloudflare`
 * `getCloudflareContext()`, and falls back to local SQLite when running in
 * Node environments (e.g. unit tests or local dev).
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";

// Define D1 types matching Cloudflare Workers runtime
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<{ success: boolean; meta: Record<string, unknown> }>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

// In-memory or file-backed fallback for local Node dev/tests
let fallbackDbInstance: D1Database | null = null;

function createLocalSqliteFallback(): D1Database {
  try {
    // Dynamic require so edge/worker bundle never evaluates node:sqlite
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require("node:sqlite");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require("node:fs");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("node:path");

    const dbDir = path.resolve(process.cwd(), ".wrangler/state/v3/d1");
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const dbPath = path.join(dbDir, "local-fallback.sqlite");
    const sqlite = new DatabaseSync(dbPath);

    // Apply initial schema if needed
    const schemaPath = path.resolve(process.cwd(), "migrations/0001_initial_schema.sql");
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, "utf8");
      sqlite.exec(sql);
    }

    const adapter: D1Database = {
      prepare(query: string): D1PreparedStatement {
        let bindings: unknown[] = [];
        const prep: D1PreparedStatement = {
          bind(...values: unknown[]) {
            bindings = values;
            return prep;
          },
          async first<T = unknown>(colName?: string): Promise<T | null> {
            const stmt = sqlite.prepare(query);
            const row = stmt.get(...(bindings as any[])) as any;
            if (!row) return null;
            if (colName) return row[colName] ?? null;
            return row as T;
          },
          async run() {
            const stmt = sqlite.prepare(query);
            stmt.run(...(bindings as any[]));
            return { success: true, meta: {} };
          },
          async all<T = unknown>(): Promise<D1Result<T>> {
            const stmt = sqlite.prepare(query);
            const rows = stmt.all(...(bindings as any[])) as T[];
            return { results: rows || [], success: true, meta: {} };
          },
        };
        return prep;
      },
      async batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]> {
        const results: D1Result<T>[] = [];
        for (const s of statements) {
          const res = await s.all<T>();
          results.push(res);
        }
        return results;
      },
      async exec(query: string) {
        sqlite.exec(query);
        return { count: 1, duration: 0 };
      },
    };

    return adapter;
  } catch (err: any) {
    console.error("Failed to initialize local sqlite fallback:", err?.message);
    throw new Error(`D1 database is not accessible: ${err?.message}`);
  }
}

/**
 * Returns the active D1Database instance.
 * On Cloudflare Workers / Wrangler dev, uses `getCloudflareContext().env.DB`.
 * In standalone Node environments, uses local SQLite fallback.
 */
export async function getDb(): Promise<D1Database> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    if (ctx?.env?.DB) {
      return ctx.env.DB as unknown as D1Database;
    }
  } catch {
    // Cloudflare context not available (running in Node / unit test)
  }

  if (!fallbackDbInstance) {
    fallbackDbInstance = createLocalSqliteFallback();
  }
  return fallbackDbInstance;
}
