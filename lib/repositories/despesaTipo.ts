import type { DespesaTipo } from "@/lib/models/despesaTipo";
import { selectAll, selectOne } from "@/lib/bd/conexao";
import { SITUACAO_EXCLUIDO_UUID } from "@/lib/models/situacao";

async function listAll() {
  return selectAll<DespesaTipo>(
    `SELECT dest_uuid, sit_uuid, dest_descricao
     FROM despesaTipo
     WHERE sit_uuid <> $1
     ORDER BY dest_descricao ASC`,
    [SITUACAO_EXCLUIDO_UUID],
  );
}

async function findById(destUuid: string) {
  return selectOne<DespesaTipo>(
    `SELECT dest_uuid, sit_uuid, dest_descricao
     FROM despesaTipo
     WHERE dest_uuid = $1`,
    [destUuid],
  );
}

export const DespesaTipoRepository = {
  listAll,
  findById,
};
