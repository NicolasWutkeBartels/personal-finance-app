"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySwatch } from "@/components/finance-screen-common";
import { useCategorias, useExcluirCategoria } from "@/lib/hooks/useCategorias";
import { SectionHeader } from "@/components/section-header";
import { useRouter } from "next/navigation";
import CategoriasInserirWindow from "./categorias-inserir-window";
import CategoriasAlterarWindow from "./categorias-alterar-window";

export function CategoriasScreen() {
  const router = useRouter();

  const categoriesQuery = useCategorias();
  const deleteMutation = useExcluirCategoria();

  return (
    <>
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
              className="gap-2 items-center"
              onClick={() => router.push("?inserir")}
            >
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </SectionHeader.Action>
        </SectionHeader.Root>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoriesQuery.data?.map((category) => (
            <Card key={category.cat_uuid}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CategorySwatch category={category} />
                    <div>
                      <CardTitle className="text-base">
                        {category.cat_descricao}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        router.push(`?alterar=${category.cat_uuid}`)
                      }
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => deleteMutation.mutate(category.cat_uuid)}
                      className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-1 rounded-full bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>

        {categoriesQuery.data?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma categoria cadastrada. Clique em &quot;Nova
                Categoria&quot; para começar.
              </p>
            </CardContent>
          </Card>
        )}
    </>
  );
}
