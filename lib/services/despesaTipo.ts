import { DespesaTipoRepository } from "@/lib/repositories/despesaTipo";

async function listAll() {
  return DespesaTipoRepository.listAll();
}

export const DespesaTipoService = {
  listAll,
};
