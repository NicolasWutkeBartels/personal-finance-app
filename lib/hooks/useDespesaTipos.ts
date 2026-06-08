"use client";

import { useQuery } from "@tanstack/react-query";

import { despesaTipoService } from "@/lib/services/despesaTipo";

export function useDespesaTipos() {
  return useQuery({
    queryKey: ["despesaTipo"],
    queryFn: () => despesaTipoService.listAll(),
  });
}
