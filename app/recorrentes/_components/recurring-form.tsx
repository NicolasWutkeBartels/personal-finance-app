"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { SelectItem } from "@/components/ui/select";
import { CategorySwatch } from "@/components/finance-screen-common";
import type {
  RecorrenciaCriar,
  RecorrenciaAtualizar,
} from "@/lib/models/recorrencia";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { useDespesaTipos } from "@/lib/hooks/useDespesaTipos";
import {
  useAtualizarRecorrencia,
  useCriarRecorrencia,
  useRecorrencias,
} from "@/lib/hooks/useRecorrencias";
import { Form } from "@/components/form";
import {
  TextField,
  CurrencyField,
  SelectField,
  TextareaField,
} from "@/components/fields";

type RecurringFormProps = {
  value?: string;
  onCancel?: () => void;
};

type RecurringFormValues = RecorrenciaCriar;

export default function RecurringForm({ value, onCancel }: RecurringFormProps) {
  const createMutation = useCriarRecorrencia();
  const updateMutation = useAtualizarRecorrencia();
  const categoriesQuery = useCategorias();
  const tiposQuery = useDespesaTipos();
  const recorrentesQuery = useRecorrencias();

  const categories = categoriesQuery.data ?? [];
  const tipos = tiposQuery.data ?? [];

  const expense = React.useMemo(() => {
    return recorrentesQuery.data?.find((r) => r.rec_uuid === value);
  }, [recorrentesQuery.data, value]);

  const methods = useForm<RecurringFormValues>({
    defaultValues: {
      cat_uuid: "",
      dest_uuid: "",
      rec_descricao: "",
      rec_valor: 0,
      rec_dia: 1,
      rec_hora: "12:00",
      rec_observacao: "",
    },
  });

  // Popula o formulário com os valores existentes ao editar
  React.useEffect(() => {
    if (value && expense) {
      methods.reset({
        cat_uuid: expense.cat_uuid,
        dest_uuid: expense.dest_uuid,
        rec_descricao: expense.rec_descricao,
        rec_valor: expense.rec_valor,
        rec_dia: expense.rec_dia,
        rec_hora: expense.rec_hora.slice(0, 5),
        rec_observacao: expense.rec_observacao ?? "",
      });
    } else if (!value && categories.length > 0 && tipos.length > 0) {
      methods.reset({
        cat_uuid: categories[0].cat_uuid,
        dest_uuid: tipos[0].dest_uuid,
        rec_descricao: "",
        rec_valor: 0,
        rec_dia: 1,
        rec_hora: "12:00",
        rec_observacao: "",
      });
    }
  }, [value, expense, methods, categories, tipos]);

  const onSubmit = methods.handleSubmit((values) => {
    const payload = {
      cat_uuid: values.cat_uuid,
      dest_uuid: values.dest_uuid,
      rec_descricao: values.rec_descricao.trim(),
      rec_valor: Number(values.rec_valor),
      rec_dia: Number(values.rec_dia),
      rec_hora: values.rec_hora,
      rec_observacao: values.rec_observacao?.trim() || null,
    };

    if (value) {
      const updatePayload: RecorrenciaAtualizar = {
        ...payload,
        rec_uuid: value,
      };
      updateMutation.mutate(updatePayload, {
        onSuccess: () => {
          methods.reset();
          onCancel?.();
        },
      });
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        methods.reset();
        onCancel?.();
      },
    });
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Form.Root onSubmit={onSubmit} {...methods}>
      <TextField
        name="rec_descricao"
        label="Nome"
        placeholder="Ex: Aluguel"
        isRequired
      />

      <Form.Group>
        <CurrencyField
          name="rec_valor"
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

        <SelectField
          name="rec_dia"
          label="Dia do mês"
          placeholder="Selecione o dia"
          isRequired
        >
          {Array.from({ length: 28 }, (_, index) => index + 1).map((day) => (
            <SelectItem key={day} value={String(day)}>
              Dia {day}
            </SelectItem>
          ))}
        </SelectField>
      </Form.Group>

      <TextField
        name="rec_hora"
        label="Hora"
        type="time"
        isRequired
      />

      <TextareaField
        name="rec_observacao"
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
