import { ADMIN_USUARIO_UUID } from "@/lib/models/usuario";
import type { DespesaAtualizar, DespesaCriar } from "@/lib/models/despesa";
import {
  SITUACAO_ATIVO_UUID,
  SITUACAO_EXCLUIDO_UUID,
} from "@/lib/models/situacao";
import { CategoriaRepository } from "@/lib/repositories/categoria";
import { DespesaRepository } from "@/lib/repositories/despesa";
import { DespesaTipoRepository } from "@/lib/repositories/despesaTipo";

import { assertRequired, assertPositiveAmount } from "@/utils/validation-utils";

async function ensureCategoriaAtiva(catUuid: string) {
  const categoria = await CategoriaRepository.findById(catUuid);
  if (!categoria || categoria.sit_uuid === SITUACAO_EXCLUIDO_UUID) {
    throw new Error("Categoria não encontrada.");
  }
}

async function ensureTipoAtivo(destUuid: string) {
  const tipo = await DespesaTipoRepository.findById(destUuid);
  if (!tipo || tipo.sit_uuid === SITUACAO_EXCLUIDO_UUID) {
    throw new Error("Tipo de despesa não encontrado.");
  }
}

async function listAll() {
  return DespesaRepository.listAll();
}

async function findById(desUuid: string) {
  const despesa = await DespesaRepository.findById(desUuid);
  if (!despesa || despesa.sit_uuid === SITUACAO_EXCLUIDO_UUID) {
    throw new Error("Despesa não encontrada.");
  }
  return despesa;
}

async function insert(input: DespesaCriar) {
  assertRequired(input.des_descricao, "Descrição");
  assertPositiveAmount(input.des_valor, "Valor");
  assertRequired(input.des_data, "Data");
  assertRequired(input.des_hora, "Hora");
  await ensureCategoriaAtiva(input.cat_uuid);
  await ensureTipoAtivo(input.dest_uuid);

  const despesa = await DespesaRepository.insert({
    des_uuid: crypto.randomUUID(),
    usu_uuid: ADMIN_USUARIO_UUID,
    sit_uuid: SITUACAO_ATIVO_UUID,
    cat_uuid: input.cat_uuid,
    dest_uuid: input.dest_uuid,
    des_descricao: input.des_descricao.trim(),
    des_valor: input.des_valor,
    des_observacao: input.des_observacao?.trim() || null,
    des_data: input.des_data,
    des_hora: input.des_hora.slice(0, 5),
  });

  if (!despesa) {
    throw new Error("Não foi possível criar a despesa.");
  }

  return despesa;
}

async function update(input: DespesaAtualizar) {
  assertRequired(input.des_descricao, "Descrição");
  assertPositiveAmount(input.des_valor, "Valor");
  assertRequired(input.des_data, "Data");
  assertRequired(input.des_hora, "Hora");
  await ensureCategoriaAtiva(input.cat_uuid);
  await ensureTipoAtivo(input.dest_uuid);

  const despesa = await DespesaRepository.update({
    des_uuid: input.des_uuid,
    cat_uuid: input.cat_uuid,
    dest_uuid: input.dest_uuid,
    des_descricao: input.des_descricao.trim(),
    des_valor: input.des_valor,
    des_observacao: input.des_observacao?.trim() || null,
    des_data: input.des_data,
    des_hora: input.des_hora.slice(0, 5),
  });

  if (!despesa) {
    throw new Error("Despesa não encontrada.");
  }

  return despesa;
}

async function deleteDespesa(desUuid: string) {
  await findById(desUuid);
  await DespesaRepository.deactivate(desUuid);
}

export const DespesaService = {
  listAll,
  findById,
  insert,
  update,
  delete: deleteDespesa,
};
