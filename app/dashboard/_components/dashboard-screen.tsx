"use client";

import { Calendar, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  formatShortDate,
  getCategoryVisual,
} from "@/lib/bd/utilidades";
import { useCategorias } from "@/lib/hooks/useCategorias";
import { useDespesas } from "@/lib/hooks/useDespesas";
import { CategorySwatch } from "@/components/finance-screen-common";
import { SectionHeader } from "@/components/section-header";

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
    <>
      <SectionHeader.Root>
        <SectionHeader.Title
          title="Dashboard"
          description="Visão geral das suas finanças"
        />
      </SectionHeader.Root>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total do Mês
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              {formatCurrency(currentTotal)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {currentMonthExpenses.length} despesas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              vs. Mês Anterior
            </CardTitle>
            {difference >= 0 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              {formatCurrency(Math.abs(difference))}
            </div>
            <p
              className={cn(
                "mt-1 text-xs",
                difference >= 0 ? "text-red-600" : "text-green-600",
              )}
            >
              {difference >= 0 ? "+" : "-"}
              {Math.abs(percentChange).toFixed(1)}% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mês Anterior
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground/70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              {formatCurrency(lastMonthTotal)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {lastMonthExpenses.length} despesas registradas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhuma despesa registrada este mês
                </p>
              ) : (
                topCategories.map(({ category, amount }) => {
                  const percentage =
                    currentTotal > 0 ? (amount / currentTotal) * 100 : 0;
                  const visual = getCategoryVisual(
                    category?.cat_descricao ?? "",
                  );

                  return (
                    <div key={category?.cat_uuid}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CategorySwatch
                            category={category ?? undefined}
                            className="h-6 w-6 rounded-md text-sm"
                          />
                          <span className="text-sm font-medium text-foreground/80">
                            {category?.cat_descricao}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: visual.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExpenses.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhuma despesa registrada
                </p>
              ) : (
                recentExpenses.map((expense) => {
                  const category = categories.find(
                    (item) => item.cat_uuid === expense.cat_uuid,
                  );

                  return (
                    <div
                      key={expense.des_uuid}
                      className="flex items-center justify-between border-b border-border/50 py-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <CategorySwatch category={category} />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {expense.des_descricao}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatShortDate(expense.des_data)}
                            {expense.des_hora ? ` • ${expense.des_hora}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(expense.des_valor)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
