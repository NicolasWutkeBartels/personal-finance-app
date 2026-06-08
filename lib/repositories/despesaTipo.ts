import type { DespesaTipo } from "@/lib/models/despesaTipo";
import { selectAll } from "@/lib/bd/conexao";
import { SITUACAO_EXCLUIDO_UUID } from "@/lib/models/situacao";

export const DespesaTipoRepository = {
  async listAll() {
    return selectAll<DespesaTipo>(
      `SELECT dest_uuid, sit_uuid, dest_descricao
       FROM despesaTipo
       WHERE sit_uuid <> $1
       ORDER BY dest_descricao ASC`,
      [SITUACAO_EXCLUIDO_UUID],
    );
  },
};
