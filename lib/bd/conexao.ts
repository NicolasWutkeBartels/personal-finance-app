import Database from "@tauri-apps/plugin-sql";

import { aplicarMigracoes } from "@/lib/bd/migracoes";

export const NOME_BANCO = "sqlite:financeiro.db";

let databasePromise: Promise<Awaited<ReturnType<typeof Database.load>>> | null = null;

export async function getDatabase() {
  if (!databasePromise) {
    databasePromise = (async () => {
      const db = await Database.load(NOME_BANCO);

      await db.execute("PRAGMA foreign_keys = ON");
      await db.execute("PRAGMA journal_mode = WAL");
      await db.execute("PRAGMA busy_timeout = 5000");

      await aplicarMigracoes(db);

      return db;
    })();
  }

  return databasePromise;
}

export async function selectAll<T>(sql: string, params: unknown[] = []) {
  const db = await getDatabase();
  return db.select<T[]>(sql, params);
}

export async function selectOne<T>(sql: string, params: unknown[] = []) {
  const query = sql.trim() + " LIMIT 1";
  const rows = await selectAll<T>(query, params);
  return rows[0] ?? null;
}

export async function executeSql(sql: string, params: unknown[] = []) {
  const db = await getDatabase();
  return db.execute(sql, params);
}
