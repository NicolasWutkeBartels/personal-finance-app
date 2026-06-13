"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import {
  useAtualizarCategoria,
  useCriarCategoria,
  useCategorias,
} from "@/lib/hooks/useCategorias";
import { Form } from "@/components/form";
import { TextField } from "@/components/fields";
import { toast } from "sonner";

type CategoriasFormProps = {
  value?: string;
  onCancel?: () => void;
};

type CategoriasFormValues = {
  cat_descricao: string;
};

export default function CategoriasForm({
  value,
  onCancel,
}: CategoriasFormProps) {
  const createMutation = useCriarCategoria();
  const updateMutation = useAtualizarCategoria();
  const { data: categories } = useCategorias();

  const category = React.useMemo(() => {
    return categories?.find((c) => c.cat_uuid === value);
  }, [categories, value]);

  const methods = useForm<CategoriasFormValues>({
    defaultValues: {
      cat_descricao: "",
    },
  });

  // Popula o formulário com os valores existentes ao editar
  React.useEffect(() => {
    if (value && category) {
      methods.reset({
        cat_descricao: category.cat_descricao,
      });
    } else if (!value) {
      methods.reset({
        cat_descricao: "",
      });
    }
  }, [value, category, methods]);

  const onSubmit = methods.handleSubmit((values) => {
    if (value) {
      const payload = {
        cat_uuid: value,
        cat_descricao: values.cat_descricao.trim(),
      };
      updateMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Categoria atualizada com sucesso!");
          methods.reset();
          onCancel?.(); // Fecha o modal após salvar
        },
        onError: () => {
          toast.error("Erro ao atualizar categoria.");
        },
      });
      return;
    }

    createMutation.mutate(
      {
        cat_descricao: values.cat_descricao.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Categoria criada com sucesso!");
          methods.reset();
          onCancel?.(); // Fecha o modal após salvar
        },
        onError: () => {
          toast.error("Erro ao criar categoria.");
        },
      },
    );
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form.Root onSubmit={onSubmit} {...methods}>
      <TextField
        name="cat_descricao"
        label="Nome"
        placeholder="Ex: Alimentação"
        isRequired
      />

      <Form.Footer isSubmitting={isSubmitting} onCancel={onCancel} />
    </Form.Root>
  );
}
