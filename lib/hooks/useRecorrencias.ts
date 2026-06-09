"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  RecorrenciaAtualizar,
  RecorrenciaCriar,
} from "@/lib/models/recorrencia";
import { RecorrenciaService } from "@/lib/services/recorrencia";

export function useRecorrencias() {
  return useQuery({
    queryKey: ["recorrencia"],
    queryFn: () => RecorrenciaService.listAll(),
  });
}

export function useCriarRecorrencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RecorrenciaCriar) => RecorrenciaService.insert(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrencia"] });
    },
  });
}

export function useAtualizarRecorrencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RecorrenciaAtualizar) =>
      RecorrenciaService.update(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrencia"] });
    },
  });
}

export function useAtivarRecorrencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recUuid: string) => RecorrenciaService.activate(recUuid),
    onSuccess: async () => {
      toast.success("Recorrência ativada com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["recorrencia"] });
    },
    onError: () => {
      toast.error("Erro ao ativar recorrência.");
    },
  });
}

export function useInativarRecorrencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recUuid: string) => RecorrenciaService.deactivate(recUuid),
    onSuccess: async () => {
      toast.success("Recorrência inativada!");
      await queryClient.invalidateQueries({ queryKey: ["recorrencia"] });
    },
    onError: () => {
      toast.error("Erro ao inativar recorrência.");
    },
  });
}

export function useExcluirRecorrencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recUuid: string) => RecorrenciaService.delete(recUuid),
    onSuccess: async () => {
      toast.success("Recorrência excluída com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["recorrencia"] });
    },
    onError: () => {
      toast.error("Erro ao excluir recorrência.");
    },
  });
}
