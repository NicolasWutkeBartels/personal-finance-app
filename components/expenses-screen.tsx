"use client";

import * as React from "react";
import { Calendar, Filter, Pencil, Plus, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { financeApi } from "@/lib/finance-api";
import {
  CategorySwatch,
  SectionHeader,
} from "@/components/finance-screen-common";
import type {
  Despesa,
  DespesaAtualizar,
  DespesaCriar,
} from "@/lib/finance-demo";
import {
  formatCurrency,
  formatLongDate,
  getMonthOptions,
} from "@/lib/finance-demo";
import { queryClient } from "@/lib/queryClient";

type ExpenseFormValues = DespesaCriar;

export function ExpensesScreen() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<Despesa | null>(
    null,
  );
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [filterCategory, setFilterCategory] = React.useState("all");
  const [filterMonth, setFilterMonth] = React.useState(currentMonth);

  const categoriesQuery = useQuery({
    queryKey: ["categorias"],
    queryFn: financeApi.listarCategorias,
  });

  const tiposQuery = useQuery({
    queryKey: ["tipos-despesa"],
    queryFn: financeApi.listarTiposDespesa,
  });

  const despesasQuery = useQuery({
    queryKey: ["despesas"],
    queryFn: financeApi.listarDespesas,
  });

  const createMutation = useMutation({
    mutationFn: financeApi.criarDespesa,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["despesas"] });
      setIsDialogOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: financeApi.atualizarDespesa,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["despesas"] });
      setIsDialogOpen(false);
      setEditingExpense(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: financeApi.excluirDespesa,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["despesas"] });
    },
  });

  const { register, handleSubmit, reset, control } = useForm<ExpenseFormValues>(
    {
      defaultValues: {
        cat_uuid: "",
        dest_uuid: "",
        des_descricao: "",
        des_valor: 0,
        des_observacao: "",
        des_data: new Date().toISOString().split("T")[0],
        des_hora: "12:00",
      },
    },
  );

  const resetForm = React.useCallback(() => {
    const firstCategory = categoriesQuery.data?.[0];
    const firstType = tiposQuery.data?.[0];

    reset({
      cat_uuid: firstCategory?.cat_uuid ?? "",
      dest_uuid: firstType?.dest_uuid ?? "",
      des_descricao: "",
      des_valor: 0,
      des_observacao: "",
      des_data: new Date().toISOString().split("T")[0],
      des_hora: "12:00",
    });
  }, [categoriesQuery.data, reset, tiposQuery.data]);

  const openCreateDialog = () => {
    setEditingExpense(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (expense: Despesa) => {
    setEditingExpense(expense);
    reset({
      cat_uuid: expense.cat_uuid,
      dest_uuid: expense.dest_uuid,
      des_descricao: expense.des_descricao,
      des_valor: expense.des_valor,
      des_observacao: expense.des_observacao ?? "",
      des_data: expense.des_data,
      des_hora: expense.des_hora.slice(0, 5),
    });
    setIsDialogOpen(true);
  };

  const onSubmit = handleSubmit((values) => {
    const payload = {
      cat_uuid: values.cat_uuid,
      dest_uuid: values.dest_uuid,
      des_descricao: values.des_descricao.trim(),
      des_valor: Number(values.des_valor),
      des_observacao: values.des_observacao?.trim() || null,
      des_data: values.des_data,
      des_hora: values.des_hora,
    };

    if (editingExpense) {
      const updatePayload: DespesaAtualizar = {
        ...payload,
        des_uuid: editingExpense.des_uuid,
      };
      updateMutation.mutate(updatePayload);
      return;
    }

    createMutation.mutate(payload);
  });

  const filteredExpenses = (despesasQuery.data ?? []).filter((expense) => {
    const matchesCategory =
      filterCategory === "all" || expense.cat_uuid === filterCategory;
    const matchesMonth =
      !filterMonth || expense.des_data.startsWith(filterMonth);
    return matchesCategory && matchesMonth;
  });

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) =>
      new Date(`${b.des_data}T${b.des_hora}`).getTime() -
      new Date(`${a.des_data}T${a.des_hora}`).getTime(),
  );

  const totalFiltered = filteredExpenses.reduce(
    (sum, expense) => sum + expense.des_valor,
    0,
  );

  const categories = categoriesQuery.data ?? [];
  const tipos = tiposQuery.data ?? [];

  return (
    <div className="p-8">
      <SectionHeader
        title="Despesas"
        description="Registre e acompanhe suas despesas"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="gap-2"
                onClick={openCreateDialog}
              >
                <Plus className="h-4 w-4" />
                Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingExpense ? "Editar Despesa" : "Nova Despesa"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="des_descricao">Descrição</Label>
                  <Input
                    id="des_descricao"
                    placeholder="Ex: Compras do mercado"
                    {...register("des_descricao", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="des_valor">Valor</Label>
                  <Input
                    id="des_valor"
                    type="number"
                    step="0.01"
                    {...register("des_valor", {
                      valueAsNumber: true,
                      required: true,
                      min: 0.01,
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat_uuid">Categoria</Label>
                  <Controller
                    control={control}
                    name="cat_uuid"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="cat_uuid">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
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
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dest_uuid">Tipo</Label>
                  <Controller
                    control={control}
                    name="dest_uuid"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="dest_uuid">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tipos.map((tipo) => (
                            <SelectItem
                              key={tipo.dest_uuid}
                              value={tipo.dest_uuid}
                            >
                              {tipo.dest_descricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="des_data">Data</Label>
                  <Input
                    id="des_data"
                    type="date"
                    {...register("des_data", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="des_hora">Hora</Label>
                  <Input
                    id="des_hora"
                    type="time"
                    {...register("des_hora", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="des_observacao">Observação</Label>
                  <Textarea
                    id="des_observacao"
                    rows={3}
                    {...register("des_observacao")}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingExpense(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {editingExpense ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 text-neutral-700">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {getMonthOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.cat_uuid} value={category.cat_uuid}>
                    <div className="flex items-center gap-2">
                      <CategorySwatch category={category} />
                      <span>{category.cat_descricao}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto text-right">
              <p className="text-sm text-neutral-500">Total</p>
              <p className="text-xl font-semibold text-neutral-900">
                {formatCurrency(totalFiltered)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {sortedExpenses.map((expense) => {
          const category = categories.find(
            (item) => item.cat_uuid === expense.cat_uuid,
          );
          const tipo = tipos.find(
            (item) => item.dest_uuid === expense.dest_uuid,
          );

          return (
            <Card key={expense.des_uuid}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <CategorySwatch category={category} className="text-xl" />
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {expense.des_descricao}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatLongDate(expense.des_data)}</span>
                        <span>•</span>
                        <span>{expense.des_hora}</span>
                        <span>•</span>
                        <span>{category?.cat_descricao}</span>
                        <span>•</span>
                        <span>{tipo?.dest_descricao}</span>
                        {expense.des_observacao ? (
                          <>
                            <span>•</span>
                            <span className="max-w-[20rem] truncate">
                              {expense.des_observacao}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold text-neutral-900">
                      {formatCurrency(expense.des_valor)}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(expense)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteMutation.mutate(expense.des_uuid)}
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedExpenses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-neutral-500">
              {despesasQuery.data?.length === 0
                ? 'Nenhuma despesa cadastrada. Clique em "Nova Despesa" para começar.'
                : "Nenhuma despesa encontrada com os filtros selecionados."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
