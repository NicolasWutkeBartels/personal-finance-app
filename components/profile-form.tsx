"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useUsuarioAdmin } from "@/lib/hooks/useUsuario";
import type { UsuarioAtualizar } from "@/lib/models/usuario";
import { usuarioService } from "@/lib/services/usuario";
import { Form } from "./form";
import { TextField } from "./fields";
import { Button } from "@/components/ui/button";

type ProfileFormProps = {
  onCancel?: () => void;
};

export default function ProfileForm({ onCancel }: ProfileFormProps) {
  const userQuery = useUsuarioAdmin();

  const { mutate, isPending } = useMutation<string, Error, UsuarioAtualizar>({
    mutationFn: (data) => usuarioService.updateAdmin(data),
    onSuccess: async () => {
      await userQuery.refetch();
      onCancel?.();
    },
  });

  const methods = useForm();
  const userProfile = userQuery.data;

  React.useEffect(() => {
    if (userProfile) {
      methods.reset({
        usu_nome: userProfile.usu_nome ?? "",
        usu_email: userProfile.usu_email ?? "",
        usu_telefone: userProfile.usu_telefone ?? "",
      });
    }
  }, [userProfile, methods]);

  return (
    <Form.Root {...methods} onSubmit={mutate}>
      <TextField name="usu_nome" label="Nome" isRequired />
      <TextField name="usu_email" label="Email" type="email" isRequired />
      <TextField name="usu_telefone" label="Telefone" />

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          Salvar
        </Button>
      </div>
    </Form.Root>
  );
}
