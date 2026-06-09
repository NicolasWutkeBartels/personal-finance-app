"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  CategoriaAtualizar,
  CategoriaCriar,
} from "@/lib/models/categoria";
import { CategoriaService } from "@/lib/services/categoria";

export function useCategorias() {
  return useQuery({
    queryKey: ["categoria"],
    queryFn: () => CategoriaService.listAll(),
  });
}

export function useCriarCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CategoriaCriar) => CategoriaService.insert(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categoria"] });
    },
  });
}

export function useAtualizarCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CategoriaAtualizar) => CategoriaService.update(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categoria"] });
    },
  });
}

export function useExcluirCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (catUuid: string) => CategoriaService.delete(catUuid),
    onSuccess: async () => {
      toast.success("Categoria excluída com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["categoria"] });
    },
    onError: () => {
      toast.error("Erro ao excluir categoria.");
    },
  });
}
