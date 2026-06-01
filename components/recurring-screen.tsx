"use client";

import * as React from "react";
import { Pencil, Plus, Repeat, Trash2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { financeApi } from "@/lib/finance-api";
import {
  CategorySwatch,
  SectionHeader,
} from "@/components/finance-screen-common";
import type {
  Recorrente,
  RecorrenteAtualizar,
  RecorrenteCriar,
} from "@/lib/finance-demo";
import { formatCurrency } from "@/lib/finance-demo";
import { queryClient } from "@/lib/queryClient";

type RecurringFormValues = RecorrenteCriar;

export function RecurringScreen() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<Recorrente | null>(
    null,
  );
  const [filterCategory, setFilterCategory] = React.useState("all");

  const categoriesQuery = useQuery({
    queryKey: ["categorias"],
    queryFn: financeApi.listarCategorias,
  });

  const tiposQuery = useQuery({
    queryKey: ["tipos-despesa"],
    queryFn: financeApi.listarTiposDespesa,
  });

  const recorrentesQuery = useQuery({
    queryKey: ["recorrentes"],
    queryFn: financeApi.listarRecorrentes,
  });

  const createMutation = useMutation({
    mutationFn: financeApi.criarRecorrente,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrentes"] });
      setIsDialogOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: financeApi.atualizarRecorrente,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrentes"] });
      setIsDialogOpen(false);
      setEditingExpense(null);
      reset();
    },
  });

  const activateMutation = useMutation({
    mutationFn: financeApi.ativarRecorrente,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrentes"] });
    },
  });

  const inactivateMutation = useMutation({
    mutationFn: financeApi.inativarRecorrente,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrentes"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: financeApi.excluirRecorrente,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recorrentes"] });
    },
  });

  const { register, handleSubmit, reset, control } =
    useForm<RecurringFormValues>({
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

  const resetForm = React.useCallback(() => {
    const firstCategory = categoriesQuery.data?.[0];
    const firstType = tiposQuery.data?.[0];

    reset({
      cat_uuid: firstCategory?.cat_uuid ?? "",
      dest_uuid: firstType?.dest_uuid ?? "",
      rec_descricao: "",
      rec_valor: 0,
      rec_dia: 1,
      rec_hora: "12:00",
      rec_observacao: "",
    });
  }, [categoriesQuery.data, reset, tiposQuery.data]);

  const openCreateDialog = () => {
    setEditingExpense(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (expense: Recorrente) => {
    setEditingExpense(expense);
    reset({
      cat_uuid: expense.cat_uuid,
      dest_uuid: expense.dest_uuid,
      rec_descricao: expense.rec_descricao,
      rec_valor: expense.rec_valor,
      rec_dia: expense.rec_dia,
      rec_hora: expense.rec_hora.slice(0, 5),
      rec_observacao: expense.rec_observacao ?? "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = handleSubmit((values) => {
    const payload = {
      cat_uuid: values.cat_uuid,
      dest_uuid: values.dest_uuid,
      rec_descricao: values.rec_descricao.trim(),
      rec_valor: Number(values.rec_valor),
      rec_dia: Number(values.rec_dia),
      rec_hora: values.rec_hora,
      rec_observacao: values.rec_observacao?.trim() || null,
    };

    if (editingExpense) {
      const updatePayload: RecorrenteAtualizar = {
        ...payload,
        rec_uuid: editingExpense.rec_uuid,
      };
      updateMutation.mutate(updatePayload);
      return;
    }

    createMutation.mutate(payload);
  });

  const filteredRecurring = (recorrentesQuery.data ?? []).filter((item) => {
    const matchesCategory =
      filterCategory === "all" || item.cat_uuid === filterCategory;
    return matchesCategory;
  });

  const categories = categoriesQuery.data ?? [];
  const tipos = tiposQuery.data ?? [];
  const totalMonthly = filteredRecurring
    .filter((item) => item.sit_uuid !== "00000000-0000-0000-0000-000000000002")
    .reduce((sum, item) => sum + item.rec_valor, 0);

  return (
    <div className="p-8">
      <SectionHeader
        title="Despesas Recorrentes"
        description="Despesas aplicadas automaticamente todo mês"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="gap-2"
                onClick={openCreateDialog}
              >
                <Plus className="h-4 w-4" />
                Nova Despesa Recorrente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingExpense
                    ? "Editar Despesa Recorrente"
                    : "Nova Despesa Recorrente"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rec_descricao">Nome</Label>
                  <Input
                    id="rec_descricao"
                    placeholder="Ex: Aluguel"
                    {...register("rec_descricao", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rec_valor">Valor</Label>
                  <Input
                    id="rec_valor"
                    type="number"
                    step="0.01"
                    {...register("rec_valor", {
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
                  <Label htmlFor="rec_dia">Dia do mês</Label>
                  <Controller
                    control={control}
                    name="rec_dia"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger id="rec_dia">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: 28 },
                            (_, index) => index + 1,
                          ).map((day) => (
                            <SelectItem key={day} value={String(day)}>
                              Dia {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rec_hora">Hora</Label>
                  <Input
                    id="rec_hora"
                    type="time"
                    {...register("rec_hora", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rec_observacao">Observação</Label>
                  <Textarea
                    id="rec_observacao"
                    rows={3}
                    {...register("rec_observacao")}
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
              <Repeat className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

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
              <p className="text-sm text-neutral-500">Total Mensal</p>
              <p className="text-xl font-semibold text-neutral-900">
                {formatCurrency(totalMonthly)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredRecurring.map((expense) => {
          const category = categories.find(
            (item) => item.cat_uuid === expense.cat_uuid,
          );
          const tipo = tipos.find(
            (item) => item.dest_uuid === expense.dest_uuid,
          );
          const isActive =
            expense.sit_uuid === "00000000-0000-0000-0000-000000000001";

          return (
            <Card key={expense.rec_uuid}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <CategorySwatch category={category} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-neutral-900">
                          {expense.rec_descricao}
                        </h3>
                        {isActive && (
                          <Repeat className="h-4 w-4 text-neutral-400" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-500">
                        {category?.cat_descricao} • {tipo?.dest_descricao} • Dia{" "}
                        {expense.rec_dia} de cada mês • {expense.rec_hora}
                      </p>
                      {expense.rec_observacao ? (
                        <p className="mt-1 text-xs text-neutral-500">
                          {expense.rec_observacao}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">
                        {formatCurrency(expense.rec_valor)}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {isActive ? "Ativa" : "Inativa"}
                      </p>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) =>
                        checked
                          ? activateMutation.mutate(expense.rec_uuid)
                          : inactivateMutation.mutate(expense.rec_uuid)
                      }
                    />
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
                        onClick={() => deleteMutation.mutate(expense.rec_uuid)}
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

      {filteredRecurring.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-neutral-500">
              Nenhuma despesa recorrente cadastrada. Clique em &quot;Nova
              Despesa Recorrente&quot; para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
