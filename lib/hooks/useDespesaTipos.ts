"use client";

import { useQuery } from "@tanstack/react-query";

import { DespesaTipoService } from "@/lib/services/despesaTipo";

export function useDespesaTipos() {
  return useQuery({
    queryKey: ["despesaTipo"],
    queryFn: () => DespesaTipoService.listAll(),
  });
}
