import type {
  Despesa,
  DespesaAtualizar,
  DespesaCriar,
} from "@/lib/models/despesa";
import { executeSql, selectAll, selectOne } from "@/lib/bd/conexao";
import { SITUACAO_EXCLUIDO_UUID } from "@/lib/models/situacao";

export const despesaRepository = {
  async listAll() {
    return selectAll<Despesa>(
      `SELECT des_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid, des_descricao, des_valor, des_observacao, des_data, des_hora
       FROM despesa
       WHERE sit_uuid <> $1
       ORDER BY des_data DESC, des_hora DESC`,
      [SITUACAO_EXCLUIDO_UUID],
    );
  },

  async findById(desUuid: string) {
    return selectOne<Despesa>(
      `SELECT des_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid, des_descricao, des_valor, des_observacao, des_data, des_hora
       FROM despesa
       WHERE des_uuid = $1
       LIMIT 1`,
      [desUuid],
    );
  },

  async insert(
    input: DespesaCriar & {
      des_uuid: string;
      usu_uuid: string;
      sit_uuid: string;
      des_valor: number;
    },
  ) {
    await executeSql(
      `INSERT INTO despesa (
        des_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid,
        des_descricao, des_valor, des_observacao, des_data, des_hora
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        input.des_uuid,
        input.usu_uuid,
        input.sit_uuid,
        input.cat_uuid,
        input.dest_uuid,
        input.des_descricao,
        input.des_valor,
        input.des_observacao,
        input.des_data,
        input.des_hora,
      ],
    );

    return this.findById(input.des_uuid);
  },

  async update(input: DespesaAtualizar & { des_valor: number }) {
    await executeSql(
      `UPDATE despesa
       SET cat_uuid = $1,
           dest_uuid = $2,
           des_descricao = $3,
           des_valor = $4,
           des_observacao = $5,
           des_data = $6,
           des_hora = $7
       WHERE des_uuid = $8`,
      [
        input.cat_uuid,
        input.dest_uuid,
        input.des_descricao,
        input.des_valor,
        input.des_observacao,
        input.des_data,
        input.des_hora,
        input.des_uuid,
      ],
    );

    return this.findById(input.des_uuid);
  },

  async deactivate(desUuid: string) {
    await executeSql(
      `UPDATE despesa
       SET sit_uuid = $1
       WHERE des_uuid = $2`,
      [SITUACAO_EXCLUIDO_UUID, desUuid],
    );
  },
};
