import type {
  Recorrencia,
  RecorrenciaAtualizar,
  RecorrenciaCriar,
} from "@/lib/models/recorrencia";
import { executeSql, selectAll, selectOne } from "@/lib/bd/conexao";
import {
  SITUACAO_ATIVO_UUID,
  SITUACAO_EXCLUIDO_UUID,
  SITUACAO_INATIVO_UUID,
} from "@/lib/models/situacao";
import { fromCents, toCents } from "@/utils/finance-utils";

async function listAll() {
  const rows = await selectAll<Recorrencia>(
    `SELECT rec_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid, rec_descricao, rec_valor, rec_dia, rec_hora, rec_observacao
     FROM recorrencia
     WHERE sit_uuid <> $1
     ORDER BY rec_descricao ASC`,
    [SITUACAO_EXCLUIDO_UUID],
  );
  return rows.map((row) => ({ ...row, rec_valor: fromCents(row.rec_valor) }));
}

async function findById(recUuid: string) {
  const row = await selectOne<Recorrencia>(
    `SELECT rec_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid, rec_descricao, rec_valor, rec_dia, rec_hora, rec_observacao
     FROM recorrencia
     WHERE rec_uuid = $1`,
    [recUuid],
  );
  return row ? { ...row, rec_valor: fromCents(row.rec_valor) } : null;
}

async function insert(
  input: RecorrenciaCriar & {
    rec_uuid: string;
    usu_uuid: string;
    sit_uuid: string;
    rec_valor: number;
  },
) {
  await executeSql(
    `INSERT INTO recorrencia (
      rec_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid,
      rec_descricao, rec_valor, rec_dia, rec_hora, rec_observacao
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      input.rec_uuid,
      input.usu_uuid,
      input.sit_uuid,
      input.cat_uuid,
      input.dest_uuid,
      input.rec_descricao,
      toCents(input.rec_valor),
      input.rec_dia,
      input.rec_hora,
      input.rec_observacao,
    ],
  );

  return findById(input.rec_uuid);
}

async function update(input: RecorrenciaAtualizar & { rec_valor: number }) {
  await executeSql(
    `UPDATE recorrencia
     SET cat_uuid = $1,
         dest_uuid = $2,
         rec_descricao = $3,
         rec_valor = $4,
         rec_dia = $5,
         rec_hora = $6,
         rec_observacao = $7
     WHERE rec_uuid = $8`,
    [
      input.cat_uuid,
      input.dest_uuid,
      input.rec_descricao,
      toCents(input.rec_valor),
      input.rec_dia,
      input.rec_hora,
      input.rec_observacao,
      input.rec_uuid,
    ],
  );

  return findById(input.rec_uuid);
}

async function activate(recUuid: string) {
  await executeSql(
    `UPDATE recorrencia
     SET sit_uuid = $1
     WHERE rec_uuid = $2`,
    [SITUACAO_ATIVO_UUID, recUuid],
  );
}

async function deactivate(recUuid: string) {
  await executeSql(
    `UPDATE recorrencia
     SET sit_uuid = $1
     WHERE rec_uuid = $2`,
    [SITUACAO_INATIVO_UUID, recUuid],
  );
}

async function deleteRec(recUuid: string) {
  await executeSql(
    `UPDATE recorrencia
     SET sit_uuid = $1
     WHERE rec_uuid = $2`,
    [SITUACAO_EXCLUIDO_UUID, recUuid],
  );
}

export const RecorrenciaRepository = {
  listAll,
  findById,
  insert,
  update,
  activate,
  deactivate,
  delete: deleteRec,
};
