"use client";

import * as React from "react";
import { Pencil, Plus, Repeat, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CategorySwatch } from "@/components/finance-screen-common";
import { formatCurrency } from "@/utils/finance-utils";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { useDespesaTipos } from "@/lib/hooks/useDespesaTipos";
import {
  useAtivarRecorrencia,
  useExcluirRecorrencia,
  useInativarRecorrencia,
  useRecorrencias,
} from "@/lib/hooks/useRecorrencias";
import { SectionHeader } from "@/components/section-header";
import RecurringInserirWindow from "./recurring-inserir-window";
import RecurringAlterarWindow from "./recurring-alterar-window";
import { cn } from "@/lib/utils";

export function RecurringScreen() {
  const router = useRouter();
  const [filterCategory, setFilterCategory] = React.useState("all");

  const categoriesQuery = useCategorias();
  const tiposQuery = useDespesaTipos();
  const recorrentesQuery = useRecorrencias();
  const activateMutation = useAtivarRecorrencia();
  const inactivateMutation = useInativarRecorrencia();
  const deleteMutation = useExcluirRecorrencia();

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
    <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto font-sans">
      <RecurringInserirWindow />
      <RecurringAlterarWindow />
      
      <SectionHeader.Root>
        <SectionHeader.Title
          title="Despesas Recorrentes"
          description="Despesas aplicadas automaticamente todo mês"
        />
        <SectionHeader.Action>
          <Button
            type="button"
            className="gap-2 font-bold cursor-pointer transition-all duration-200 hover:scale-[1.01] geom-button shadow-2xs"
            onClick={() => router.push("?inserir")}
          >
            <Plus className="h-4 w-4" />
            Nova Despesa Recorrente
          </Button>
        </SectionHeader.Action>
      </SectionHeader.Root>

      {/* Control Panel Console Filters */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-2xs">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] pointer-events-none" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center relative z-10">
          <div className="flex items-center gap-2 text-muted-foreground select-none shrink-0">
            <Repeat className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Filtros</span>
          </div>

          <div className="w-full md:w-auto">
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
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Mensal Recorrente</span>
            <span className="text-lg font-extrabold text-foreground tabular-nums leading-tight mt-0.5">
              {formatCurrency(totalMonthly)}
            </span>
          </div>
        </div>
      </div>

      {/* Ledger rows list */}
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
            <div
              key={expense.rec_uuid}
              className={cn(
                "flex items-center justify-between gap-4 p-4 border rounded-xl shadow-2xs hover:shadow-xs transition-all duration-200 group/row cursor-default bg-card",
                isActive 
                  ? "border-border/70 hover:border-border" 
                  : "border-border/40 bg-neutral-50/10 dark:bg-neutral-900/5 opacity-75"
              )}
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Due Date Calendar sheet badge */}
                <div className="flex flex-col items-center justify-center h-11 w-11 shrink-0 bg-neutral-100 dark:bg-neutral-900 border border-border rounded-lg shadow-3xs overflow-hidden select-none shrink-0 group-hover/row:scale-105 transition-transform duration-200">
                  <div className="w-full bg-red-600 dark:bg-red-700 h-3 flex items-center justify-center text-[7px] font-bold text-white tracking-widest uppercase">
                    DIA
                  </div>
                  <div className="flex-1 flex items-center justify-center text-sm font-extrabold text-foreground tabular-nums">
                    {expense.rec_dia}
                  </div>
                </div>

                {/* Category swatch */}
                <CategorySwatch category={category} className="h-9 w-9 text-base shrink-0" />
                
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-tight text-foreground truncate">
                      {expense.rec_descricao}
                    </h3>
                    {isActive && (
                      <Repeat className="h-3.5 w-3.5 text-muted-foreground/45 shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium select-none">
                    <span className="text-[11px]">{category?.cat_descricao}</span>
                    <span>•</span>
                    <span className="text-[11px]">{tipo?.dest_descricao}</span>
                    <span>•</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/75 bg-neutral-100 dark:bg-neutral-800 px-1 rounded-sm">
                      {expense.rec_hora?.slice(0, 5)}
                    </span>
                  </div>
                  {expense.rec_observacao ? (
                    <p className="mt-1 text-xs text-muted-foreground/60 truncate max-w-[20rem] font-medium">
                      {expense.rec_observacao}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right select-none">
                  <p className="text-sm font-bold text-foreground tabular-nums">
                    {formatCurrency(expense.rec_valor)}
                  </p>
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-wider mt-0.5",
                    isActive ? "text-emerald-500" : "text-muted-foreground"
                  )}>
                    {isActive ? "Ativa" : "Inativa"}
                  </p>
                </div>

                {/* Elegant toggle switch */}
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) =>
                    checked
                      ? activateMutation.mutate(expense.rec_uuid)
                      : inactivateMutation.mutate(expense.rec_uuid)
                  }
                  className="cursor-pointer"
                />

                {/* Row context buttons */}
                <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover/row:opacity-100 transition-opacity duration-150">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => router.push(`?alterar=${expense.rec_uuid}`)}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteMutation.mutate(expense.rec_uuid)}
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

      {filteredRecurring.length === 0 && (
        <div className="relative overflow-hidden rounded-xl border border-dashed border-border/80 bg-card/45 p-12 text-center select-none shadow-3xs">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] pointer-events-none" />
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background shadow-3xs text-muted-foreground mb-4 geom-chamfer shrink-0">
            <Repeat className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold tracking-tight text-foreground">
            Sem despesas recorrentes
          </h3>
          <p className="mx-auto mt-1.5 max-w-[20rem] text-xs text-muted-foreground leading-relaxed">
            Nenhuma cobrança ou assinatura recorrente cadastrada. Adicione despesas mensais recorrentes para automatizar o controle.
          </p>
          <Button
            size="sm"
            onClick={() => router.push("?inserir")}
            className="mt-5 font-bold geom-button shrink-0 shadow-2xs cursor-pointer"
          >
            Nova Despesa Recorrente
          </Button>
        </div>
      )}
    </div>
  );
}
