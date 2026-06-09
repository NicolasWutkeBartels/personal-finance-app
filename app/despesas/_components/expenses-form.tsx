"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { SelectItem } from "@/components/ui/select";
import { CategorySwatch } from "@/components/finance-screen-common";
import type { DespesaCriar, DespesaAtualizar } from "@/lib/models/despesa";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { useDespesaTipos } from "@/lib/hooks/useDespesaTipos";
import {
  useAtualizarDespesa,
  useCriarDespesa,
  useDespesas,
} from "@/lib/hooks/useDespesas";
import { Form } from "@/components/form";
import { toast } from "sonner";
import {
  TextField,
  CurrencyField,
  DateField,
  SelectField,
  TextareaField,
} from "@/components/fields";

type ExpensesFormProps = {
  value?: string;
  onCancel?: () => void;
};

type ExpenseFormValues = DespesaCriar;

export default function ExpensesForm({ value, onCancel }: ExpensesFormProps) {
  const createMutation = useCriarDespesa();
  const updateMutation = useAtualizarDespesa();
  const categoriesQuery = useCategorias();
  const tiposQuery = useDespesaTipos();
  const despesasQuery = useDespesas();

  const categories = categoriesQuery.data ?? [];
  const tipos = tiposQuery.data ?? [];

  const expense = React.useMemo(() => {
    return despesasQuery.data?.find((d) => d.des_uuid === value);
  }, [despesasQuery.data, value]);

  const methods = useForm<ExpenseFormValues>({
    defaultValues: {
      cat_uuid: "",
      dest_uuid: "",
      des_descricao: "",
      des_valor: 0,
      des_observacao: "",
      des_data: new Date().toISOString().split("T")[0],
      des_hora: "12:00",
    },
  });

  // Popula o formulário com os valores existentes ao editar
  React.useEffect(() => {
    if (value && expense) {
      methods.reset({
        cat_uuid: expense.cat_uuid,
        dest_uuid: expense.dest_uuid,
        des_descricao: expense.des_descricao,
        des_valor: expense.des_valor,
        des_observacao: expense.des_observacao ?? "",
        des_data: expense.des_data,
        des_hora: expense.des_hora.slice(0, 5),
      });
    } else if (!value && categories.length > 0 && tipos.length > 0) {
      methods.reset({
        cat_uuid: categories[0].cat_uuid,
        dest_uuid: tipos[0].dest_uuid,
        des_descricao: "",
        des_valor: 0,
        des_observacao: "",
        des_data: new Date().toISOString().split("T")[0],
        des_hora: "12:00",
      });
    }
  }, [value, expense, methods, categories, tipos]);

  const onSubmit = methods.handleSubmit((values) => {
    const payload = {
      cat_uuid: values.cat_uuid,
      dest_uuid: values.dest_uuid,
      des_descricao: values.des_descricao.trim(),
      des_valor: Number(values.des_valor),
      des_observacao: values.des_observacao?.trim() || null,
      des_data: values.des_data,
      des_hora: values.des_hora,
    };

    if (value) {
      const updatePayload: DespesaAtualizar = {
        ...payload,
        des_uuid: value,
      };
      updateMutation.mutate(updatePayload, {
        onSuccess: () => {
          toast.success("Despesa atualizada com sucesso!");
          methods.reset();
          onCancel?.();
        },
        onError: () => {
          toast.error("Erro ao atualizar despesa.");
        },
      });
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Despesa criada com sucesso!");
        methods.reset();
        onCancel?.();
      },
      onError: () => {
        toast.error("Erro ao criar despesa.");
      },
    });
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form.Root onSubmit={onSubmit} {...methods}>
      <TextField
        name="des_descricao"
        label="Descrição"
        placeholder="Ex: Compras do mercado"
        isRequired
      />

      <Form.Group>
        <CurrencyField
          name="des_valor"
          label="Valor"
          isRequired
          min={0.01}
        />

        <SelectField
          name="cat_uuid"
          label="Categoria"
          placeholder="Selecione uma categoria"
          isRequired
        >
          {categories.map((category) => (
            <SelectItem
              key={category.cat_uuid}
              value={category.cat_uuid}
            >
              <div className="flex items-center gap-2">
                <CategorySwatch category={category} />
                <span>{category.cat_descricao}</span>
              </div>
            </SelectItem>
          ))}
        </SelectField>
      </Form.Group>

      <Form.Group>
        <SelectField
          name="dest_uuid"
          label="Tipo"
          placeholder="Selecione o tipo"
          isRequired
        >
          {tipos.map((tipo) => (
            <SelectItem
              key={tipo.dest_uuid}
              value={tipo.dest_uuid}
            >
              {tipo.dest_descricao}
            </SelectItem>
          ))}
        </SelectField>

        <DateField
          name="des_data"
          label="Data"
          isRequired
        />
      </Form.Group>

      <TextField
        name="des_hora"
        label="Hora"
        type="time"
        isRequired
      />

      <TextareaField
        name="des_observacao"
        label="Observação"
        rows={3}
      />

      <Form.Footer
        isSubmitting={isSubmitting}
        submitLabel={value ? "Salvar" : "Criar"}
        onCancel={onCancel}
      />
    </Form.Root>
  );
}
