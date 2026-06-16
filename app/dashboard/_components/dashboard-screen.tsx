"use client";

import { Calendar, TrendingDown, TrendingUp, Wallet, FolderOpen, Receipt } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/finance-utils";
import { formatShortDate } from "@/utils/date-utils";
import { getCategoryVisual } from "@/utils/category-utils";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { useDespesas } from "@/lib/hooks/useDespesas";
import { CategorySwatch } from "@/components/finance-screen-common";
import { SectionHeader } from "@/components/section-header";
import { motion } from "motion/react";

export function DashboardScreen() {
  const categoriesQuery = useCategorias();
  const expensesQuery = useDespesas();

  const categories = categoriesQuery.data ?? [];
  const expenses = expensesQuery.data ?? [];

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;

  const currentMonthExpenses = expenses.filter((expense) =>
    expense.des_data.startsWith(currentMonth),
  );
  const lastMonthExpenses = expenses.filter((expense) =>
    expense.des_data.startsWith(lastMonthStr),
  );

  const currentTotal = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.des_valor,
    0,
  );
  const lastMonthTotal = lastMonthExpenses.reduce(
    (sum, expense) => sum + expense.des_valor,
    0,
  );
  const difference = currentTotal - lastMonthTotal;
  const percentChange =
    lastMonthTotal > 0 ? (difference / lastMonthTotal) * 100 : 0;

  const expensesByCategory = currentMonthExpenses.reduce(
    (acc, expense) => {
      acc[expense.cat_uuid] = (acc[expense.cat_uuid] || 0) + expense.des_valor;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topCategories = Object.entries(expensesByCategory)
    .map(([categoryId, amount]) => ({
      category: categories.find((item) => item.cat_uuid === categoryId),
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const recentExpenses = [...currentMonthExpenses]
    .sort(
      (a, b) =>
        new Date(`${b.des_data}T${b.des_hora}`).getTime() -
        new Date(`${a.des_data}T${a.des_hora}`).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="px-6 py-6 space-y-8 max-w-7xl mx-auto font-sans">
      <SectionHeader.Root>
        <SectionHeader.Title
          title="Dashboard"
          description="Visão geral das suas finanças"
        />
      </SectionHeader.Root>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FolderTabCard title="Total do Mês" icon={Wallet}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Despesas Acumuladas</span>
            <div className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
              {formatCurrency(currentTotal)}
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-border/40 mt-3">
              <span className="text-xs text-muted-foreground font-medium">Lançamentos</span>
              <span className="text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-foreground px-2 py-0.5 rounded-full tabular-nums">
                {currentMonthExpenses.length} itens
              </span>
            </div>
          </div>
        </FolderTabCard>

        <FolderTabCard 
          title="vs. Mês Anterior" 
          icon={difference >= 0 ? TrendingUp : TrendingDown}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Diferença Líquida</span>
            <div className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
              {formatCurrency(Math.abs(difference))}
            </div>
            <div className="pt-2 flex items-center mt-3 border-t border-border/40">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border",
                difference >= 0 
                  ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" 
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              )}>
                {difference >= 0 ? "+" : "-"}
                {Math.abs(percentChange).toFixed(1)}% este mês
              </span>
            </div>
          </div>
        </FolderTabCard>

        <FolderTabCard title="Mês Anterior" icon={Calendar}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Período Anterior</span>
            <div className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
              {formatCurrency(lastMonthTotal)}
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-border/40 mt-3">
              <span className="text-xs text-muted-foreground font-medium">Lançamentos</span>
              <span className="text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-foreground px-2 py-0.5 rounded-full tabular-nums">
                {lastMonthExpenses.length} itens
              </span>
            </div>
          </div>
        </FolderTabCard>
      </div>

      {/* Categories and Recent Transactions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <FolderTabCard title="Despesas por Categoria" icon={FolderOpen}>
          <div className="space-y-5 py-2">
            {topCategories.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Nenhuma despesa registrada este mês.
                </p>
              </div>
            ) : (
              topCategories.map(({ category, amount }) => {
                const percentage =
                  currentTotal > 0 ? (amount / currentTotal) * 100 : 0;
                const visual = getCategoryVisual(
                  category?.cat_descricao ?? "",
                );

                return (
                  <div key={category?.cat_uuid} className="space-y-2 group/bar">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CategorySwatch
                          category={category ?? undefined}
                          className="h-7 w-7 text-sm shadow-xs"
                        />
                        <span className="text-sm font-semibold tracking-tight text-foreground/90 group-hover/bar:text-foreground transition-colors">
                          {category?.cat_descricao}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-foreground tabular-nums">
                          {formatCurrency(amount)}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                    
                    {/* Premium Animated Gauge Track */}
                    <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative border border-neutral-200/20">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ ease: [0.16, 1, 0.3, 1], duration: 1, delay: 0.1 }}
                        className="h-full rounded-full relative"
                        style={{ backgroundColor: visual.color }}
                      >
                        {/* Shimmer overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full" />
                      </motion.div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </FolderTabCard>

        <FolderTabCard title="Despesas Recentes" icon={Receipt}>
          <div className="space-y-3.5 py-1">
            {recentExpenses.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Nenhuma despesa registrada.
                </p>
              </div>
            ) : (
              recentExpenses.map((expense, idx) => {
                const category = categories.find(
                  (item) => item.cat_uuid === expense.cat_uuid,
                );

                return (
                  <motion.div
                    key={expense.des_uuid}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    className="flex items-center justify-between border border-border/40 hover:border-border/80 bg-neutral-50/30 dark:bg-neutral-900/10 hover:bg-neutral-50/80 dark:hover:bg-neutral-900/30 rounded-xl p-3 transition-all duration-200 shadow-2xs hover:shadow-xs group/ledger cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <CategorySwatch 
                        category={category} 
                        className="h-9 w-9 text-base group-hover/ledger:scale-105 transition-transform" 
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold tracking-tight text-foreground truncate">
                          {expense.des_descricao}
                        </p>
                        <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase mt-0.5">
                          {formatShortDate(expense.des_data)}
                          {expense.des_hora ? ` • ${expense.des_hora.slice(0, 5)}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        {formatCurrency(expense.des_valor)}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </FolderTabCard>
      </div>
    </div>
  );
}

// Internal reusable folder tab components for visual consistency
function FolderTabCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group/folder-card flex flex-col w-full relative", className)}>
      {/* Folder Tab Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5 px-4.5 py-2 bg-neutral-900 dark:bg-neutral-800 text-white dark:text-neutral-100 text-[10px] font-bold uppercase tracking-wider border-x border-t border-neutral-900 dark:border-neutral-800 geom-chamfer-reverse shadow-xs z-10 select-none">
          {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover/folder-card:text-foreground transition-colors" />}
          <span>{title}</span>
        </div>
      </div>
      {/* Card Body with grid background overlay */}
      <div className="relative flex-1 overflow-hidden rounded-r-2xl rounded-bl-2xl border border-border bg-card p-5 shadow-xs transition-all duration-300 group-hover/folder-card:shadow-sm group-hover/folder-card:border-border/80">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
        {children}
      </div>
    </div>
  );
}
