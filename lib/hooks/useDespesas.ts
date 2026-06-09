"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { DespesaAtualizar, DespesaCriar } from "@/lib/models/despesa";
import { DespesaService } from "@/lib/services/despesa";

export function useDespesas() {
  return useQuery({
    queryKey: ["despesa"],
    queryFn: () => DespesaService.listAll(),
  });
}

export function useCriarDespesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DespesaCriar) => DespesaService.insert(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["despesa"] });
    },
  });
}

export function useAtualizarDespesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DespesaAtualizar) => DespesaService.update(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["despesa"] });
    },
  });
}

export function useExcluirDespesa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (desUuid: string) => DespesaService.delete(desUuid),
    onSuccess: async () => {
      toast.success("Despesa excluída com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["despesa"] });
    },
    onError: () => {
      toast.error("Erro ao excluir despesa.");
    },
  });
}
