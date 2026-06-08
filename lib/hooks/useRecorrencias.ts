"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  RecorrenciaAtualizar,
  RecorrenciaCriar,
} from "@/lib/models/recorrencia";
import { recorrenciaService } from "@/lib/services/recorrencia";
import { queryClient } from "@/utils/queryClient";

export function useRecorrencias() {
  return useQuery({
    queryKey: ["recorrencia"],
    queryFn: () => recorrenciaService.listAll(),
  });
}

export function useCriarRecorrencia() {
  return useMutation({
    mutationFn: (input: RecorrenciaCriar) => recorrenciaService.insert(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrencia"] });
    },
  });
}

export function useAtualizarRecorrencia() {
  return useMutation({
    mutationFn: (input: RecorrenciaAtualizar) =>
      recorrenciaService.update(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrencia"] });
    },
  });
}

export function useAtivarRecorrencia() {
  return useMutation({
    mutationFn: (recUuid: string) => recorrenciaService.activate(recUuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrencia"] });
    },
  });
}

export function useInativarRecorrencia() {
  return useMutation({
    mutationFn: (recUuid: string) => recorrenciaService.deactivate(recUuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrencia"] });
    },
  });
}

export function useExcluirRecorrencia() {
  return useMutation({
    mutationFn: (recUuid: string) => recorrenciaService.delete(recUuid),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrencia"] });
    },
  });
}
