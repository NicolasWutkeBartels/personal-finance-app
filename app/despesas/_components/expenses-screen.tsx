"use client";

import * as React from "react";
import { Calendar, Filter, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySwatch } from "@/components/finance-screen-common";
import { formatCurrency } from "@/utils/finance-utils";
import { formatLongDate, getMonthOptions } from "@/utils/date-utils";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { useDespesaTipos } from "@/lib/hooks/useDespesaTipos";
import {
  useDespesas,
  useExcluirDespesa,
} from "@/lib/hooks/useDespesas";
import { SectionHeader } from "@/components/section-header";
import ExpensesInserirWindow from "./expenses-inserir-window";
import ExpensesAlterarWindow from "./expenses-alterar-window";

export function ExpensesScreen() {
  const router = useRouter();
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [filterCategory, setFilterCategory] = React.useState("all");
  const [filterMonth, setFilterMonth] = React.useState(currentMonth);

  const categoriesQuery = useCategorias();
  const tiposQuery = useDespesaTipos();
  const despesasQuery = useDespesas();
  const deleteMutation = useExcluirDespesa();

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
    <>
      <ExpensesInserirWindow />
      <ExpensesAlterarWindow />
      <SectionHeader.Root>
          <SectionHeader.Title
            title="Despesas"
            description="Registre e acompanhe suas despesas"
          />
          <SectionHeader.Action>
            <Button
              type="button"
              className="gap-2"
              onClick={() => router.push("?inserir")}
            >
              <Plus className="h-4 w-4" />
              Nova Despesa
            </Button>
          </SectionHeader.Action>
        </SectionHeader.Root>

        <Card className="mb-6 py-2">
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-2 text-foreground/80">
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
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-semibold text-foreground">
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
                        <h3 className="font-semibold text-foreground">
                          {expense.des_descricao}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
                      <p className="text-lg font-semibold text-foreground">
                        {formatCurrency(expense.des_valor)}
                      </p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => router.push(`?alterar=${expense.des_uuid}`)}
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
            <p className="text-muted-foreground">
                {despesasQuery.data?.length === 0
                  ? 'Nenhuma despesa cadastrada. Clique em "Nova Despesa" para começar.'
                  : "Nenhuma despesa encontrada com os filtros selecionados."}
              </p>
            </CardContent>
          </Card>
        )}
    </>
  );
}
