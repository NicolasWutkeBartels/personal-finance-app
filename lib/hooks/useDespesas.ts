"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { DespesaAtualizar, DespesaCriar } from "@/lib/models/despesa";
import { despesaService } from "@/lib/services/despesa";
import { queryClient } from "@/utils/queryClient";

export function useDespesas() {
  return useQuery({
    queryKey: ["despesa"],
    queryFn: () => despesaService.listAll(),
  });
}

export function useCriarDespesa() {
  return useMutation({
    mutationFn: (input: DespesaCriar) => despesaService.insert(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["despesa"] });
    },
  });
}

export function useAtualizarDespesa() {
  return useMutation({
    mutationFn: (input: DespesaAtualizar) => despesaService.update(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["despesa"] });
    },
  });
}

export function useExcluirDespesa() {
  return useMutation({
    mutationFn: (desUuid: string) => despesaService.delete(desUuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["despesa"] });
    },
  });
}
