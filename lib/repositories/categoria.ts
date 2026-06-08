import type {
  Categoria,
  CategoriaAtualizar,
  CategoriaCriar,
} from "@/lib/models/categoria";
import { executeSql, selectAll, selectOne } from "@/lib/bd/conexao";
import { SITUACAO_EXCLUIDO_UUID } from "@/lib/models/situacao";

export const categoriaRepository = {
  async listAll() {
    return selectAll<Categoria>(
      `SELECT cat_uuid, usu_uuid, sit_uuid, cat_descricao
       FROM categoria
       WHERE sit_uuid <> $1
       ORDER BY cat_descricao ASC`,
      [SITUACAO_EXCLUIDO_UUID],
    );
  },

  async findById(catUuid: string) {
    return selectOne<Categoria>(
      `SELECT cat_uuid, usu_uuid, sit_uuid, cat_descricao
       FROM categoria
       WHERE cat_uuid = $1
       LIMIT 1`,
      [catUuid],
    );
  },

  async insert(
    input: CategoriaCriar & {
      cat_uuid: string;
      usu_uuid: string;
      sit_uuid: string;
    },
  ) {
    await executeSql(
      `INSERT INTO categoria (cat_uuid, usu_uuid, sit_uuid, cat_descricao)
       VALUES ($1, $2, $3, $4)`,
      [input.cat_uuid, input.usu_uuid, input.sit_uuid, input.cat_descricao],
    );

    return this.findById(input.cat_uuid);
  },

  async update(input: CategoriaAtualizar) {
    await executeSql(
      `UPDATE categoria
       SET cat_descricao = $1
       WHERE cat_uuid = $2`,
      [input.cat_descricao, input.cat_uuid],
    );

    return this.findById(input.cat_uuid);
  },

  async deactivate(catUuid: string) {
    await executeSql(
      `UPDATE categoria
       SET sit_uuid = $1
       WHERE cat_uuid = $2`,
      [SITUACAO_EXCLUIDO_UUID, catUuid],
    );
  },
};
