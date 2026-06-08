import { ADMIN_USUARIO_UUID } from "@/lib/models/usuario";
import type {
  RecorrenciaAtualizar,
  RecorrenciaCriar,
} from "@/lib/models/recorrencia";
import {
  SITUACAO_ATIVO_UUID,
  SITUACAO_EXCLUIDO_UUID,
} from "@/lib/models/situacao";
import { categoriaRepository } from "@/lib/repositories/categoria";
import { RecorrenciaRepository } from "@/lib/repositories/recorrencia";
import { fromCents, toCents } from "@/lib/bd/utilidades";
import { DespesaTipoRepository } from "../repositories/despesaTipo";

function assertRequired(value: string, label: string) {
  if (!value.trim()) {
    throw new Error(`${label} é obrigatório.`);
  }
}

function assertPositiveAmount(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} deve ser maior que zero.`);
  }
}

function assertDay(value: number) {
  if (!Number.isInteger(value) || value < 1 || value > 31) {
    throw new Error("O dia da recorrência deve estar entre 1 e 31.");
  }
}

async function ensureCategoriaAtiva(catUuid: string) {
  const categoria = await categoriaRepository.findById(catUuid);
  if (!categoria || categoria.sit_uuid === SITUACAO_EXCLUIDO_UUID) {
    throw new Error("Categoria não encontrada.");
  }
}

async function ensureTipoAtivo(destUuid: string) {
  const tipos = await DespesaTipoRepository.listAll();
  const found = tipos.find((item) => item.dest_uuid === destUuid);
  if (!found) {
    throw new Error("Tipo de despesa não encontrado.");
  }
}

export const recorrenciaService = {
  async listAll() {
    return RecorrenciaRepository.listAll();
  },

  async findById(recUuid: string) {
    const recorrencia = await RecorrenciaRepository.findById(recUuid);
    if (!recorrencia || recorrencia.sit_uuid === SITUACAO_EXCLUIDO_UUID) {
      throw new Error("Recorrência não encontrada.");
    }
    return recorrencia;
  },

  async insert(input: RecorrenciaCriar) {
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
      rec_valor: toCents(input.rec_valor),
      rec_dia: input.rec_dia,
      rec_hora: input.rec_hora.slice(0, 5),
      rec_observacao: input.rec_observacao?.trim() || null,
    });

    if (!recorrencia) {
      throw new Error("Não foi possível criar a recorrência.");
    }

    return { ...recorrencia, rec_valor: fromCents(recorrencia.rec_valor) };
  },

  async update(input: RecorrenciaAtualizar) {
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
      rec_valor: toCents(input.rec_valor),
      rec_dia: input.rec_dia,
      rec_hora: input.rec_hora.slice(0, 5),
      rec_observacao: input.rec_observacao?.trim() || null,
    });

    if (!recorrencia) {
      throw new Error("Recorrência não encontrada.");
    }

    return { ...recorrencia, rec_valor: fromCents(recorrencia.rec_valor) };
  },

  async activate(recUuid: string) {
    await this.findById(recUuid);
    await RecorrenciaRepository.activate(recUuid);
  },

  async deactivate(recUuid: string) {
    await this.findById(recUuid);
    await RecorrenciaRepository.deactivate(recUuid);
  },

  async delete(recUuid: string) {
    await this.findById(recUuid);
    await RecorrenciaRepository.delete(recUuid);
  },
};
