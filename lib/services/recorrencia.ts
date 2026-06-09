import { ADMIN_USUARIO_UUID } from "@/lib/models/usuario";
import type {
  RecorrenciaAtualizar,
  RecorrenciaCriar,
} from "@/lib/models/recorrencia";
import {
  SITUACAO_ATIVO_UUID,
  SITUACAO_EXCLUIDO_UUID,
} from "@/lib/models/situacao";
import { CategoriaRepository } from "@/lib/repositories/categoria";
import { RecorrenciaRepository } from "@/lib/repositories/recorrencia";

import { DespesaTipoRepository } from "../repositories/despesaTipo";
import {
  assertRequired,
  assertPositiveAmount,
  assertDay,
} from "@/utils/validation-utils";

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
  return RecorrenciaRepository.listAll();
}

async function findById(recUuid: string) {
  const recorrencia = await RecorrenciaRepository.findById(recUuid);
  if (!recorrencia || recorrencia.sit_uuid === SITUACAO_EXCLUIDO_UUID) {
    throw new Error("Recorrência não encontrada.");
  }
  return recorrencia;
}

async function insert(input: RecorrenciaCriar) {
  assertRequired(input.rec_descricao, "Descrição");
  assertPositiveAmount(input.rec_valor, "Valor");
  assertDay(input.rec_dia);
  assertRequired(input.rec_hora, "Hora");
  await ensureCategoriaAtiva(input.cat_uuid);
  await ensureTipoAtivo(input.dest_uuid);

  const recorrencia = await RecorrenciaRepository.insert({
    rec_uuid: crypto.randomUUID(),
    usu_uuid: ADMIN_USUARIO_UUID,
    sit_uuid: SITUACAO_ATIVO_UUID,
    cat_uuid: input.cat_uuid,
    dest_uuid: input.dest_uuid,
    rec_descricao: input.rec_descricao.trim(),
    rec_valor: input.rec_valor,
    rec_dia: input.rec_dia,
    rec_hora: input.rec_hora.slice(0, 5),
    rec_observacao: input.rec_observacao?.trim() || null,
  });

  if (!recorrencia) {
    throw new Error("Não foi possível criar a recorrência.");
  }

  return recorrencia;
}

async function update(input: RecorrenciaAtualizar) {
  assertRequired(input.rec_descricao, "Descrição");
  assertPositiveAmount(input.rec_valor, "Valor");
  assertDay(input.rec_dia);
  assertRequired(input.rec_hora, "Hora");
  await ensureCategoriaAtiva(input.cat_uuid);
  await ensureTipoAtivo(input.dest_uuid);

  const recorrencia = await RecorrenciaRepository.update({
    rec_uuid: input.rec_uuid,
    cat_uuid: input.cat_uuid,
    dest_uuid: input.dest_uuid,
    rec_descricao: input.rec_descricao.trim(),
    rec_valor: input.rec_valor,
    rec_dia: input.rec_dia,
    rec_hora: input.rec_hora.slice(0, 5),
    rec_observacao: input.rec_observacao?.trim() || null,
  });

  if (!recorrencia) {
    throw new Error("Recorrência não encontrada.");
  }

  return recorrencia;
}

async function activate(recUuid: string) {
  await findById(recUuid);
  await RecorrenciaRepository.activate(recUuid);
}

async function deactivate(recUuid: string) {
  await findById(recUuid);
  await RecorrenciaRepository.deactivate(recUuid);
}

async function deleteRec(recUuid: string) {
  await findById(recUuid);
  await RecorrenciaRepository.delete(recUuid);
}

export const RecorrenciaService = {
  listAll,
  findById,
  insert,
  update,
  activate,
  deactivate,
  delete: deleteRec,
};
