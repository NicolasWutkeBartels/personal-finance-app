"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CategoriaAtualizar,
  CategoriaCriar,
} from "@/lib/models/categoria";
import { categoriaService } from "@/lib/services/categoria";
import { queryClient } from "@/utils/queryClient";

export function useCategorias() {
  return useQuery({
    queryKey: ["categoria"],
    queryFn: () => categoriaService.listAll(),
  });
}

export function useCriarCategoria() {
  return useMutation({
    mutationFn: (input: CategoriaCriar) => categoriaService.insert(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categoria"] });
    },
  });
}

export function useAtualizarCategoria() {
  return useMutation({
    mutationFn: (input: CategoriaAtualizar) => categoriaService.update(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categoria"] });
    },
  });
}

export function useExcluirCategoria() {
  return useMutation({
    mutationFn: (catUuid: string) => categoriaService.delete(catUuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categoria"] });
    },
  });
}
