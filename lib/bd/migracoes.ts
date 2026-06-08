import type Database from "@tauri-apps/plugin-sql";

import {
  SITUACAO_ATIVO_UUID,
  SITUACAO_EXCLUIDO_UUID,
  SITUACAO_INATIVO_UUID,
} from "@/lib/models/situacao";

const ADMIN_USUARIO_UUID = "00000000-0000-0000-0000-000000000100";
const RECEITA_TIPO_UUID = "1";
const DESPESA_TIPO_UUID = "2";

type Migracao = {
  versao: number;
  comandos: string[];
};

const MIGRACOES: Migracao[] = [
  {
    versao: 1,
    comandos: [
      `CREATE TABLE IF NOT EXISTS situacao (
        sit_uuid TEXT PRIMARY KEY NOT NULL,
        sit_descricao TEXT NOT NULL
      )`,
      `INSERT OR IGNORE INTO situacao (sit_uuid, sit_descricao) VALUES ('${SITUACAO_ATIVO_UUID}', 'ATIVO')`,
      `INSERT OR IGNORE INTO situacao (sit_uuid, sit_descricao) VALUES ('${SITUACAO_INATIVO_UUID}', 'INATIVO')`,
      `INSERT OR IGNORE INTO situacao (sit_uuid, sit_descricao) VALUES ('${SITUACAO_EXCLUIDO_UUID}', 'EXCLUIDO')`,
      `CREATE TABLE IF NOT EXISTS usuario (
        usu_uuid TEXT PRIMARY KEY NOT NULL,
        sit_uuid TEXT NOT NULL,
        usu_nome TEXT NOT NULL,
        usu_email TEXT,
        usu_telefone TEXT,
        FOREIGN KEY (sit_uuid) REFERENCES situacao(sit_uuid)
      )`,
      `INSERT OR IGNORE INTO usuario (usu_uuid, sit_uuid, usu_nome, usu_email, usu_telefone)
       VALUES ('${ADMIN_USUARIO_UUID}', '${SITUACAO_ATIVO_UUID}', 'Administrador', NULL, NULL)`,
      `CREATE TABLE IF NOT EXISTS despesaTipo (
        dest_uuid TEXT PRIMARY KEY NOT NULL,
        sit_uuid TEXT NOT NULL,
        dest_descricao TEXT NOT NULL,
        FOREIGN KEY (sit_uuid) REFERENCES situacao(sit_uuid)
      )`,
      `INSERT OR IGNORE INTO despesaTipo (dest_uuid, sit_uuid, dest_descricao)
       VALUES ('${RECEITA_TIPO_UUID}', '${SITUACAO_ATIVO_UUID}', 'RECEITA')`,
      `INSERT OR IGNORE INTO despesaTipo (dest_uuid, sit_uuid, dest_descricao)
       VALUES ('${DESPESA_TIPO_UUID}', '${SITUACAO_ATIVO_UUID}', 'DESPESA')`,
      `CREATE TABLE IF NOT EXISTS categoria (
        cat_uuid TEXT PRIMARY KEY NOT NULL,
        usu_uuid TEXT NOT NULL,
        sit_uuid TEXT NOT NULL,
        cat_descricao TEXT NOT NULL,
        FOREIGN KEY (usu_uuid) REFERENCES usuario(usu_uuid),
        FOREIGN KEY (sit_uuid) REFERENCES situacao(sit_uuid)
      )`,
      `CREATE TABLE IF NOT EXISTS despesa (
        des_uuid TEXT PRIMARY KEY NOT NULL,
        usu_uuid TEXT NOT NULL,
        sit_uuid TEXT NOT NULL,
        cat_uuid TEXT NOT NULL,
        dest_uuid TEXT NOT NULL,
        des_descricao TEXT NOT NULL,
        des_valor INTEGER NOT NULL,
        des_observacao TEXT,
        des_data TEXT NOT NULL,
        des_hora TEXT NOT NULL,
        FOREIGN KEY (usu_uuid) REFERENCES usuario(usu_uuid),
        FOREIGN KEY (sit_uuid) REFERENCES situacao(sit_uuid),
        FOREIGN KEY (cat_uuid) REFERENCES categoria(cat_uuid),
        FOREIGN KEY (dest_uuid) REFERENCES despesaTipo(dest_uuid)
      )`,
      `CREATE TABLE IF NOT EXISTS recorrencia (
        rec_uuid TEXT PRIMARY KEY NOT NULL,
        usu_uuid TEXT NOT NULL,
        sit_uuid TEXT NOT NULL,
        cat_uuid TEXT NOT NULL,
        dest_uuid TEXT NOT NULL,
        rec_descricao TEXT NOT NULL,
        rec_valor INTEGER NOT NULL,
        rec_dia INTEGER NOT NULL,
        rec_hora TEXT NOT NULL,
        rec_observacao TEXT,
        FOREIGN KEY (usu_uuid) REFERENCES usuario(usu_uuid),
        FOREIGN KEY (sit_uuid) REFERENCES situacao(sit_uuid),
        FOREIGN KEY (cat_uuid) REFERENCES categoria(cat_uuid),
        FOREIGN KEY (dest_uuid) REFERENCES despesaTipo(dest_uuid)
      )`,
    ],
  },
  {
    versao: 2,
    comandos: ["SELECT 1"],
  },
  {
    versao: 3,
    comandos: [
      `PRAGMA foreign_keys = OFF`,
      `CREATE TABLE IF NOT EXISTS situacao_new (
        sit_uuid TEXT PRIMARY KEY NOT NULL,
        sit_descricao TEXT NOT NULL
      )`,
      `INSERT OR IGNORE INTO situacao_new (sit_uuid, sit_descricao)
       SELECT
         CASE sit_uuid
           WHEN '00000000-0000-0000-0000-000000000001' THEN '1'
           WHEN '00000000-0000-0000-0000-000000000002' THEN '2'
           WHEN '00000000-0000-0000-0000-000000000003' THEN '3'
           ELSE sit_uuid
         END,
         sit_descricao
       FROM situacoes`,
      `CREATE TABLE IF NOT EXISTS usuario_new (
        usu_uuid TEXT PRIMARY KEY NOT NULL,
        sit_uuid TEXT NOT NULL,
        usu_nome TEXT NOT NULL,
        usu_email TEXT,
        usu_telefone TEXT,
        FOREIGN KEY (sit_uuid) REFERENCES situacao_new(sit_uuid)
      )`,
      `INSERT OR IGNORE INTO usuario_new (usu_uuid, sit_uuid, usu_nome, usu_email, usu_telefone)
       SELECT usu_uuid,
         CASE sit_uuid
           WHEN '00000000-0000-0000-0000-000000000001' THEN '1'
           WHEN '00000000-0000-0000-0000-000000000002' THEN '2'
           WHEN '00000000-0000-0000-0000-000000000003' THEN '3'
           ELSE sit_uuid
         END,
         usu_nome,
         usu_email,
         usu_telefone
       FROM usuarios`,
      `CREATE TABLE IF NOT EXISTS despesaTipo_new (
        dest_uuid TEXT PRIMARY KEY NOT NULL,
        sit_uuid TEXT NOT NULL,
        dest_descricao TEXT NOT NULL,
        FOREIGN KEY (sit_uuid) REFERENCES situacao_new(sit_uuid)
      )`,
      `INSERT OR IGNORE INTO despesaTipo_new (dest_uuid, sit_uuid, dest_descricao)
       SELECT
         CASE dest_uuid
           WHEN '00000000-0000-0000-0000-000000000101' THEN '1'
           WHEN '00000000-0000-0000-0000-000000000102' THEN '2'
           ELSE dest_uuid
         END,
         CASE sit_uuid
           WHEN '00000000-0000-0000-0000-000000000001' THEN '1'
           WHEN '00000000-0000-0000-0000-000000000002' THEN '2'
           WHEN '00000000-0000-0000-0000-000000000003' THEN '3'
           ELSE sit_uuid
         END,
         dest_descricao
       FROM despesa_tipos`,
      `CREATE TABLE IF NOT EXISTS categoria_new (
        cat_uuid TEXT PRIMARY KEY NOT NULL,
        usu_uuid TEXT NOT NULL,
        sit_uuid TEXT NOT NULL,
        cat_descricao TEXT NOT NULL,
        FOREIGN KEY (usu_uuid) REFERENCES usuario_new(usu_uuid),
        FOREIGN KEY (sit_uuid) REFERENCES situacao_new(sit_uuid)
      )`,
      `INSERT OR IGNORE INTO categoria_new (cat_uuid, usu_uuid, sit_uuid, cat_descricao)
       SELECT cat_uuid,
         usu_uuid,
         CASE sit_uuid
           WHEN '00000000-0000-0000-0000-000000000001' THEN '1'
           WHEN '00000000-0000-0000-0000-000000000002' THEN '2'
           WHEN '00000000-0000-0000-0000-000000000003' THEN '3'
           ELSE sit_uuid
         END,
         cat_descricao
       FROM categorias`,
      `CREATE TABLE IF NOT EXISTS despesa_new (
        des_uuid TEXT PRIMARY KEY NOT NULL,
        usu_uuid TEXT NOT NULL,
        sit_uuid TEXT NOT NULL,
        cat_uuid TEXT NOT NULL,
        dest_uuid TEXT NOT NULL,
        des_descricao TEXT NOT NULL,
        des_valor INTEGER NOT NULL,
        des_observacao TEXT,
        des_data TEXT NOT NULL,
        des_hora TEXT NOT NULL,
        FOREIGN KEY (usu_uuid) REFERENCES usuario_new(usu_uuid),
        FOREIGN KEY (sit_uuid) REFERENCES situacao_new(sit_uuid),
        FOREIGN KEY (cat_uuid) REFERENCES categoria_new(cat_uuid),
        FOREIGN KEY (dest_uuid) REFERENCES despesaTipo_new(dest_uuid)
      )`,
      `INSERT OR IGNORE INTO despesa_new (des_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid, des_descricao, des_valor, des_observacao, des_data, des_hora)
       SELECT des_uuid,
         usu_uuid,
         CASE sit_uuid
           WHEN '00000000-0000-0000-0000-000000000001' THEN '1'
           WHEN '00000000-0000-0000-0000-000000000002' THEN '2'
           WHEN '00000000-0000-0000-0000-000000000003' THEN '3'
           ELSE sit_uuid
         END,
         cat_uuid,
         CASE dest_uuid
           WHEN '00000000-0000-0000-0000-000000000101' THEN '1'
           WHEN '00000000-0000-0000-0000-000000000102' THEN '2'
           ELSE dest_uuid
         END,
         des_descricao,
         des_valor,
         des_observacao,
         des_data,
         des_hora
       FROM despesas`,
      `CREATE TABLE IF NOT EXISTS recorrencia_new (
        rec_uuid TEXT PRIMARY KEY NOT NULL,
        usu_uuid TEXT NOT NULL,
        sit_uuid TEXT NOT NULL,
        cat_uuid TEXT NOT NULL,
        dest_uuid TEXT NOT NULL,
        rec_descricao TEXT NOT NULL,
        rec_valor INTEGER NOT NULL,
        rec_dia INTEGER NOT NULL,
        rec_hora TEXT NOT NULL,
        rec_observacao TEXT,
        FOREIGN KEY (usu_uuid) REFERENCES usuario_new(usu_uuid),
        FOREIGN KEY (sit_uuid) REFERENCES situacao_new(sit_uuid),
        FOREIGN KEY (cat_uuid) REFERENCES categoria_new(cat_uuid),
        FOREIGN KEY (dest_uuid) REFERENCES despesaTipo_new(dest_uuid)
      )`,
      `INSERT OR IGNORE INTO recorrencia_new (rec_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid, rec_descricao, rec_valor, rec_dia, rec_hora, rec_observacao)
       SELECT rec_uuid,
         usu_uuid,
         CASE sit_uuid
           WHEN '00000000-0000-0000-0000-000000000001' THEN '1'
           WHEN '00000000-0000-0000-0000-000000000002' THEN '2'
           WHEN '00000000-0000-0000-0000-000000000003' THEN '3'
           ELSE sit_uuid
         END,
         cat_uuid,
         CASE dest_uuid
           WHEN '00000000-0000-0000-0000-000000000101' THEN '1'
           WHEN '00000000-0000-0000-0000-000000000102' THEN '2'
           ELSE dest_uuid
         END,
         rec_descricao,
         rec_valor,
         rec_dia,
         rec_hora,
         rec_observacao
       FROM recorrentes`,
      `DROP TABLE IF EXISTS recorrentes`,
      `DROP TABLE IF EXISTS despesas`,
      `DROP TABLE IF EXISTS categorias`,
      `DROP TABLE IF EXISTS despesa_tipos`,
      `DROP TABLE IF EXISTS usuarios`,
      `DROP TABLE IF EXISTS situacoes`,
      `ALTER TABLE situacao_new RENAME TO situacao`,
      `ALTER TABLE usuario_new RENAME TO usuario`,
      `ALTER TABLE despesaTipo_new RENAME TO despesaTipo`,
      `ALTER TABLE categoria_new RENAME TO categoria`,
      `ALTER TABLE despesa_new RENAME TO despesa`,
      `ALTER TABLE recorrencia_new RENAME TO recorrencia`,
      `PRAGMA foreign_keys = ON`,
    ],
  },
];

export async function aplicarMigracoes(
  db: Awaited<ReturnType<typeof Database.load>>,
) {
  const versionRows = await db.select<{ user_version: number }[]>(
    "PRAGMA user_version;",
  );
  let currentVersion = Number(versionRows[0]?.user_version ?? 0);
  const legacyTables = await db.select<{ name: string }[]>(
    `SELECT name
     FROM sqlite_master
     WHERE type = 'table'
       AND name IN ('situacoes', 'usuarios', 'despesa_tipos', 'categorias', 'despesas', 'recorrentes')`,
  );
  const hasLegacySchema = legacyTables.length > 0;

  for (const migracao of MIGRACOES) {
    if (currentVersion >= migracao.versao) {
      continue;
    }

    if (migracao.versao === 3 && !hasLegacySchema) {
      await db.execute("PRAGMA user_version = 3");
      currentVersion = 3;
      continue;
    }

    await db.execute("BEGIN IMMEDIATE");

    try {
      for (const comando of migracao.comandos) {
        await db.execute(comando);
      }

      await db.execute(`PRAGMA user_version = ${migracao.versao}`);
      await db.execute("COMMIT");
      currentVersion = migracao.versao;
    } catch (error) {
      await db.execute("ROLLBACK").catch(() => undefined);
      throw error;
    }
  }
}
