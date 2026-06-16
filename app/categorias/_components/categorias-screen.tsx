"use client";

import * as React from "react";
import { Pencil, Plus, Trash2, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CategorySwatch } from "@/components/finance-screen-common";
import { useCategorias, useExcluirCategoria } from "@/lib/hooks/useCategorias";
import { useDespesas } from "@/lib/hooks/useDespesas";
import { getCategoryVisual } from "@/utils/category-utils";
import { formatCurrency } from "@/utils/finance-utils";
import { SectionHeader } from "@/components/section-header";
import CategoriasInserirWindow from "./categorias-inserir-window";
import CategoriasAlterarWindow from "./categorias-alterar-window";

export function CategoriasScreen() {
  const router = useRouter();

  const categoriesQuery = useCategorias();
  const expensesQuery = useDespesas();
  const deleteMutation = useExcluirCategoria();

  const categories = categoriesQuery.data ?? [];
  const expenses = expensesQuery.data ?? [];

  // Monthly stats calculations
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthExpenses = expenses.filter((e) => e.des_data.startsWith(currentMonth));
  const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.des_valor, 0);

  return (
    <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto font-sans">
      <CategoriasInserirWindow />
      <CategoriasAlterarWindow />
      
      <SectionHeader.Root>
        <SectionHeader.Title
          title="Categorias"
          description="Gerencie as categorias das suas despesas"
        />
        <SectionHeader.Action>
          <Button
            type="button"
            className="gap-2 font-bold cursor-pointer transition-all duration-200 hover:scale-[1.01] geom-button shadow-2xs"
            onClick={() => router.push("?inserir")}
          >
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        </SectionHeader.Action>
      </SectionHeader.Root>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const categoryExpenses = currentMonthExpenses.filter(
            (e) => e.cat_uuid === category.cat_uuid
          );
          const totalSpent = categoryExpenses.reduce((sum, e) => sum + e.des_valor, 0);
          const percentage = currentMonthTotal > 0 ? (totalSpent / currentMonthTotal) * 100 : 0;
          const visual = getCategoryVisual(category.cat_descricao);

          return (
            <div
              key={category.cat_uuid}
              className="group/cat-card relative flex flex-col w-full relative"
            >
              {/* Folder Tab Header */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5 px-4.5 py-1.5 bg-neutral-900 dark:bg-neutral-800 text-white dark:text-neutral-100 text-[10px] font-bold uppercase tracking-wider border-x border-t border-neutral-900 dark:border-neutral-800 geom-chamfer-reverse shadow-xs z-10 select-none">
                  <Tag className="h-3 w-3 text-muted-foreground/80" />
                  <span>Categoria</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="relative flex-1 overflow-hidden rounded-r-2xl rounded-bl-2xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:shadow-sm hover:border-border/80">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] pointer-events-none" />
                
                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <CategorySwatch category={category} className="h-10 w-10 text-lg shadow-sm" />
                    <div>
                      <h3 className="text-base font-bold tracking-tight text-foreground truncate max-w-[12rem]">
                        {category.cat_descricao}
                      </h3>
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mt-0.5 select-none">
                        {categoryExpenses.length} {categoryExpenses.length === 1 ? "lançamento" : "lançamentos"}
                      </span>
                    </div>
                  </div>

                  {/* Actions Layer */}
                  <div className="flex gap-0.5 sm:opacity-0 sm:group-hover/cat-card:opacity-100 transition-opacity duration-150">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => router.push(`?alterar=${category.cat_uuid}`)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => deleteMutation.mutate(category.cat_uuid)}
                      className="h-7 w-7 text-red-500 hover:text-red-650 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Spent stats readout */}
                <div className="mt-6 pt-4 border-t border-border/40 space-y-2 relative z-10">
                  <div className="flex items-baseline justify-between select-none">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gasto este Mês</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-extrabold text-foreground tabular-nums">
                        {formatCurrency(totalSpent)}
                      </span>
                      {percentage > 0 && (
                        <span className="text-[9px] font-bold text-muted-foreground tabular-nums">
                          ({percentage.toFixed(0)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Gauge */}
                  <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: visual.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="relative overflow-hidden rounded-xl border border-dashed border-border/80 bg-card/45 p-12 text-center select-none shadow-3xs">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.01] pointer-events-none" />
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background shadow-3xs text-muted-foreground mb-4 geom-chamfer shrink-0">
            <Tag className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold tracking-tight text-foreground">
            Sem categorias
          </h3>
          <p className="mx-auto mt-1.5 max-w-[20rem] text-xs text-muted-foreground leading-relaxed">
            Nenhuma categoria de despesas foi cadastrada até o momento. Crie categorias para organizar seus lançamentos.
          </p>
          <Button
            size="sm"
            onClick={() => router.push("?inserir")}
            className="mt-5 font-bold geom-button shrink-0 shadow-2xs cursor-pointer"
          >
            Nova Categoria
          </Button>
        </div>
      )}
    </div>
  );
}
