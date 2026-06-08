import { DespesaTipoRepository } from "@/lib/repositories/despesaTipo";

export const despesaTipoService = {
  async listAll() {
    return DespesaTipoRepository.listAll();
  },
};
