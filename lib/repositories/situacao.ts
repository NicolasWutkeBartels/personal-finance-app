import type { Situacao } from "@/lib/models/situacao";
import { selectAll, selectOne } from "@/lib/bd/conexao";

async function listAll() {
  return selectAll<Situacao>(
    `SELECT sit_uuid, sit_descricao
     FROM situacao
     ORDER BY sit_uuid ASC`,
  );
}

async function findById(sitUuid: string) {
  return selectOne<Situacao>(
    `SELECT sit_uuid, sit_descricao
     FROM situacao
     WHERE sit_uuid = $1`,
    [sitUuid],
  );
}

export const SituacaoRepository = {
  listAll,
  findById,
};
