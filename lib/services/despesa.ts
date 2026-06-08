import { ADMIN_USUARIO_UUID } from "@/lib/models/usuario";
import type { DespesaAtualizar, DespesaCriar } from "@/lib/models/despesa";
import {
  SITUACAO_ATIVO_UUID,
  SITUACAO_EXCLUIDO_UUID,
} from "@/lib/models/situacao";
import { categoriaRepository } from "@/lib/repositories/categoria";
import { despesaRepository } from "@/lib/repositories/despesa";
import { DespesaTipoRepository } from "@/lib/repositories/despesaTipo";
import { toCents, fromCents } from "@/lib/bd/utilidades";

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

async function ensureCategoriaAtiva(catUuid: string) {
  const categoria = await categoriaRepository.findById(catUuid);
  if (!categoria || categoria.sit_uuid === SITUACAO_EXCLUIDO_UUID) {
    throw new Error("Categoria não encontrada.");
  }
}

async function ensureTipoAtivo(destUuid: string) {
  const tipo = await DespesaTipoRepository.listAll();
  const found = tipo.find((item) => item.dest_uuid === destUuid);
  if (!found) {
    throw new Error("Tipo de despesa não encontrado.");
  }
}

export const despesaService = {
  async listAll() {
    return despesaRepository.listAll();
  },

  async findById(desUuid: string) {
    const despesa = await despesaRepository.findById(desUuid);
    if (!despesa || despesa.sit_uuid === SITUACAO_EXCLUIDO_UUID) {
      throw new Error("Despesa não encontrada.");
    }
    return despesa;
  },

  async insert(input: DespesaCriar) {
    assertRequired(input.des_descricao, "Descrição");
    assertPositiveAmount(input.des_valor, "Valor");
    assertRequired(input.des_data, "Data");
    assertRequired(input.des_hora, "Hora");
    await ensureCategoriaAtiva(input.cat_uuid);
    await ensureTipoAtivo(input.dest_uuid);

    const despesa = await despesaRepository.insert({
      des_uuid: crypto.randomUUID(),
      usu_uuid: ADMIN_USUARIO_UUID,
      sit_uuid: SITUACAO_ATIVO_UUID,
      cat_uuid: input.cat_uuid,
      dest_uuid: input.dest_uuid,
      des_descricao: input.des_descricao.trim(),
      des_valor: toCents(input.des_valor),
      des_observacao: input.des_observacao?.trim() || null,
      des_data: input.des_data,
      des_hora: input.des_hora.slice(0, 5),
    });

    if (!despesa) {
      throw new Error("Não foi possível criar a despesa.");
    }

    return { ...despesa, des_valor: fromCents(despesa.des_valor) };
  },

  async update(input: DespesaAtualizar) {
    assertRequired(input.des_descricao, "Descrição");
    assertPositiveAmount(input.des_valor, "Valor");
    assertRequired(input.des_data, "Data");
    assertRequired(input.des_hora, "Hora");
    await ensureCategoriaAtiva(input.cat_uuid);
    await ensureTipoAtivo(input.dest_uuid);

    const despesa = await despesaRepository.update({
      des_uuid: input.des_uuid,
      cat_uuid: input.cat_uuid,
      dest_uuid: input.dest_uuid,
      des_descricao: input.des_descricao.trim(),
      des_valor: toCents(input.des_valor),
      des_observacao: input.des_observacao?.trim() || null,
      des_data: input.des_data,
      des_hora: input.des_hora.slice(0, 5),
    });

    if (!despesa) {
      throw new Error("Despesa não encontrada.");
    }

    return { ...despesa, des_valor: fromCents(despesa.des_valor) };
  },

  async delete(desUuid: string) {
    await this.findById(desUuid);
    await despesaRepository.deactivate(desUuid);
  },
};
