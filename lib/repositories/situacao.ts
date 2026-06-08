import type { Situacao } from "@/lib/models/situacao";
import { selectAll, selectOne } from "@/lib/bd/conexao";

export const SituacaoRepository = {
  async listAll() {
    return selectAll<Situacao>(
      `SELECT sit_uuid, sit_descricao
       FROM situacao
       ORDER BY sit_uuid ASC`,
    );
  },

  async findById(sitUuid: string) {
    return selectOne<Situacao>(
      `SELECT sit_uuid, sit_descricao
       FROM situacao
       WHERE sit_uuid = $1
       LIMIT 1`,
      [sitUuid],
    );
  },
};
