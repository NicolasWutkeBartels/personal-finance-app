import { ADMIN_USUARIO_UUID } from "@/lib/models/usuario";
import type {
  CategoriaAtualizar,
  CategoriaCriar,
} from "@/lib/models/categoria";
import {
  SITUACAO_ATIVO_UUID,
  SITUACAO_EXCLUIDO_UUID,
} from "@/lib/models/situacao";
import { CategoriaRepository } from "@/lib/repositories/categoria";
import { assertRequired } from "@/utils/validation-utils";

async function listAll() {
  return CategoriaRepository.listAll();
}

async function findById(catUuid: string) {
  const categoria = await CategoriaRepository.findById(catUuid);
  if (!categoria || categoria.sit_uuid === SITUACAO_EXCLUIDO_UUID) {
    throw new Error("Categoria não encontrada.");
  }
  return categoria;
}

async function insert(input: CategoriaCriar) {
  assertRequired(input.cat_descricao, "Nome da categoria");

  const categoria = await CategoriaRepository.insert({
    cat_uuid: crypto.randomUUID(),
    usu_uuid: ADMIN_USUARIO_UUID,
    sit_uuid: SITUACAO_ATIVO_UUID,
    cat_descricao: input.cat_descricao.trim(),
  });

  if (!categoria) {
    throw new Error("Não foi possível criar a categoria.");
  }

  return categoria;
}

async function update(input: CategoriaAtualizar) {
  assertRequired(input.cat_descricao, "Nome da categoria");
  const categoria = await CategoriaRepository.update({
    cat_uuid: input.cat_uuid,
    cat_descricao: input.cat_descricao.trim(),
  });

  if (!categoria) {
    throw new Error("Categoria não encontrada.");
  }

  return categoria;
}

async function deleteCategoria(catUuid: string) {
  await findById(catUuid);
  await CategoriaRepository.deactivate(catUuid);
}

export const CategoriaService = {
  listAll,
  findById,
  insert,
  update,
  delete: deleteCategoria,
};
