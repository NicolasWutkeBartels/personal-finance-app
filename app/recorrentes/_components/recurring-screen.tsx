"use client";

import * as React from "react";
import { Pencil, Plus, Repeat, Trash2 } from "lucide-react";
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
    <>
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
              className="gap-2"
              onClick={() => router.push("?inserir")}
            >
              <Plus className="h-4 w-4" />
              Nova Despesa Recorrente
            </Button>
          </SectionHeader.Action>
        </SectionHeader.Root>

        <Card className="mb-6 py-2">
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-2 text-foreground/80">
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
                <p className="text-sm text-muted-foreground">Total Mensal</p>
                <p className="text-xl font-semibold text-foreground">
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
                          <h3 className="font-semibold text-foreground">
                            {expense.rec_descricao}
                          </h3>
                          {isActive && (
                            <Repeat className="h-4 w-4 text-muted-foreground/50" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {category?.cat_descricao} • {tipo?.dest_descricao} • Dia{" "}
                          {expense.rec_dia} de cada mês • {expense.rec_hora}
                        </p>
                        {expense.rec_observacao ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {expense.rec_observacao}
                          </p>
                        ) : null}
                      </div>
                    </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(expense.rec_valor)}
                      </p>
                      <p className="text-xs text-muted-foreground">
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
                        onClick={() => router.push(`?alterar=${expense.rec_uuid}`)}
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
            <p className="text-muted-foreground">
              Nenhuma despesa recorrente cadastrada. Clique em &quot;Nova
              Despesa Recorrente&quot; para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
