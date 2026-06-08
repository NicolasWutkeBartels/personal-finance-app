import { ADMIN_USUARIO_UUID } from "@/lib/models/usuario";
import type {
  CategoriaAtualizar,
  CategoriaCriar,
} from "@/lib/models/categoria";
import {
  SITUACAO_ATIVO_UUID,
  SITUACAO_EXCLUIDO_UUID,
} from "@/lib/models/situacao";
import { categoriaRepository } from "@/lib/repositories/categoria";

function assertRequired(value: string, label: string) {
  if (!value.trim()) {
    throw new Error(`${label} é obrigatório.`);
  }
}

export const categoriaService = {
  async listAll() {
    return categoriaRepository.listAll();
  },

  async findById(catUuid: string) {
    const categoria = await categoriaRepository.findById(catUuid);
    if (!categoria || categoria.sit_uuid === SITUACAO_EXCLUIDO_UUID) {
      throw new Error("Categoria não encontrada.");
    }
    return categoria;
  },

  async insert(input: CategoriaCriar) {
    assertRequired(input.cat_descricao, "Nome da categoria");

    const categoria = await categoriaRepository.insert({
      cat_uuid: crypto.randomUUID(),
      usu_uuid: ADMIN_USUARIO_UUID,
      sit_uuid: SITUACAO_ATIVO_UUID,
      cat_descricao: input.cat_descricao.trim(),
    });

    if (!categoria) {
      throw new Error("Não foi possível criar a categoria.");
    }

    return categoria;
  },

  async update(input: CategoriaAtualizar) {
    assertRequired(input.cat_descricao, "Nome da categoria");
    const categoria = await categoriaRepository.update({
      cat_uuid: input.cat_uuid,
      cat_descricao: input.cat_descricao.trim(),
    });

    if (!categoria) {
      throw new Error("Categoria não encontrada.");
    }

    return categoria;
  },

  async delete(catUuid: string) {
    await this.findById(catUuid);
    await categoriaRepository.deactivate(catUuid);
  },
};
