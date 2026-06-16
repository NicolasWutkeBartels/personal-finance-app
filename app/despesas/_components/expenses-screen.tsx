"use client";

import * as React from "react";
import { Calendar, Filter, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
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

  // Group sortedExpenses by date
  const groupedExpenses = sortedExpenses.reduce((groups, expense) => {
    const dateStr = expense.des_data;
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(expense);
    return groups;
  }, {} as Record<string, typeof sortedExpenses>);

  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => b.localeCompare(a));

  const getRelativeDateLabel = (dateStr: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (dateStr === todayStr) return "Hoje";
    if (dateStr === yesterdayStr) return "Ontem";
    
    return formatLongDate(dateStr);
  };

  return (
    <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto font-sans">
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
            className="gap-2 font-bold cursor-pointer transition-all duration-200 hover:scale-[1.01] geom-button shadow-2xs"
            onClick={() => router.push("?inserir")}
          >
            <Plus className="h-4 w-4" />
            Nova Despesa
          </Button>
        </SectionHeader.Action>
      </SectionHeader.Root>

      {/* Control Panel Console Filters */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-2xs">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] pointer-events-none" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center relative z-10">
          <div className="flex items-center gap-2 text-muted-foreground select-none shrink-0">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Filtros</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full md:w-auto">
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-full md:w-48 bg-background border-border">
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
              <SelectTrigger className="w-full md:w-48 bg-background border-border">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.cat_uuid} value={category.cat_uuid}>
                    <div className="flex items-center gap-2">
                      <CategorySwatch category={category} className="h-5 w-5 text-xs" />
                      <span>{category.cat_descricao}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Key Metric Display Badge */}
          <div className="md:ml-auto flex flex-col justify-end items-start md:items-end bg-neutral-50 dark:bg-neutral-900 border border-border/40 px-4 py-2 rounded-xl select-none">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Soma Filtrada</span>
            <span className="text-lg font-extrabold text-foreground tabular-nums leading-tight mt-0.5">
              {formatCurrency(totalFiltered)}
            </span>
          </div>
        </div>
      </div>

      {/* Grouped Ledger Transactions */}
      <div className="space-y-6 pt-2">
        {sortedDates.map((dateStr) => {
          const dayExpenses = groupedExpenses[dateStr];
          const relativeLabel = getRelativeDateLabel(dateStr);

          return (
            <div key={dateStr} className="space-y-2.5">
              {/* Ledger Day Header */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest select-none">
                  {relativeLabel}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider uppercase select-none">
                  {dayExpenses.length} {dayExpenses.length === 1 ? "item" : "itens"}
                </span>
              </div>

              {/* Single grouped container container for this day's expenses */}
              <div className="overflow-hidden bg-card border border-border/70 rounded-xl shadow-2xs divide-y divide-border/30">
                {dayExpenses.map((expense) => {
                  const category = categories.find(
                    (item) => item.cat_uuid === expense.cat_uuid,
                  );
                  const tipo = tipos.find(
                    (item) => item.dest_uuid === expense.dest_uuid,
                  );

                  return (
                    <div
                      key={expense.des_uuid}
                      className="flex items-center justify-between gap-4 p-3.5 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 transition-colors group/row cursor-default"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <CategorySwatch category={category} className="h-9 w-9 text-base group-hover/row:scale-105 transition-transform" />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold tracking-tight text-foreground truncate">
                            {expense.des_descricao}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium select-none">
                            <span className="font-semibold text-[9px] uppercase tracking-wider text-muted-foreground/75 bg-neutral-100 dark:bg-neutral-800 px-1 rounded-sm">
                              {expense.des_hora?.slice(0, 5)}
                            </span>
                            <span>•</span>
                            <span className="text-[11px]">{category?.cat_descricao}</span>
                            <span>•</span>
                            <span className="text-[11px]">
                              {tipo?.dest_descricao}
                            </span>
                            {expense.des_observacao ? (
                              <>
                                <span>•</span>
                                <span className="max-w-[15rem] truncate text-muted-foreground/60 text-[11px]">
                                  {expense.des_observacao}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-sm font-bold text-foreground tabular-nums">
                          {formatCurrency(expense.des_valor)}
                        </span>
                        
                        {/* Inline context control buttons */}
                        <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover/row:opacity-100 transition-opacity duration-150">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => router.push(`?alterar=${expense.des_uuid}`)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => deleteMutation.mutate(expense.des_uuid)}
                            className="h-7 w-7 text-red-500 hover:text-red-650 hover:bg-red-500/10 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {sortedExpenses.length === 0 && (
        <div className="relative overflow-hidden rounded-xl border border-dashed border-border/80 bg-card/45 p-12 text-center select-none shadow-3xs">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] pointer-events-none" />
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background shadow-3xs text-muted-foreground mb-4 geom-chamfer shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold tracking-tight text-foreground">
            {despesasQuery.data?.length === 0 ? "Sem lançamentos" : "Nenhum resultado"}
          </h3>
          <p className="mx-auto mt-1.5 max-w-[20rem] text-xs text-muted-foreground leading-relaxed">
            {despesasQuery.data?.length === 0
              ? 'Nenhuma despesa foi registrada neste período. Adicione uma nova despesa para começar.'
              : "Nenhuma despesa encontrada com os filtros selecionados. Experimente ajustar os meses ou categorias."}
          </p>
          {despesasQuery.data?.length === 0 && (
            <Button
              size="sm"
              onClick={() => router.push("?inserir")}
              className="mt-5 font-bold geom-button shrink-0 shadow-2xs cursor-pointer"
            >
              Nova Despesa
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
