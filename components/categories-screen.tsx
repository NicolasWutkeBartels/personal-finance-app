"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { financeApi } from "@/lib/finance-api";
import {
  CategorySwatch,
  SectionHeader,
} from "@/components/finance-screen-common";
import type {
  Categoria,
  CategoriaAtualizar,
  CategoriaCriar,
} from "@/lib/finance-demo";
import { queryClient } from "@/lib/queryClient";

type CategoryFormValues = CategoriaCriar;

export function CategoriesScreen() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] =
    React.useState<Categoria | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["categorias"],
    queryFn: financeApi.listarCategorias,
  });

  const createMutation = useMutation({
    mutationFn: financeApi.criarCategoria,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setIsDialogOpen(false);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: financeApi.atualizarCategoria,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setIsDialogOpen(false);
      setEditingCategory(null);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: financeApi.excluirCategoria,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const { register, handleSubmit, reset } = useForm<CategoryFormValues>({
    defaultValues: {
      cat_descricao: "",
    },
  });

  const openCreateDialog = () => {
    setEditingCategory(null);
    reset({ cat_descricao: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Categoria) => {
    setEditingCategory(category);
    reset({ cat_descricao: category.cat_descricao });
    setIsDialogOpen(true);
  };

  const onSubmit = handleSubmit((values) => {
    if (editingCategory) {
      const payload: CategoriaAtualizar = {
        cat_uuid: editingCategory.cat_uuid,
        cat_descricao: values.cat_descricao.trim(),
      };
      updateMutation.mutate(payload);
      return;
    }

    createMutation.mutate({
      cat_descricao: values.cat_descricao.trim(),
    });
  });

  return (
    <div className="p-8">
      <SectionHeader
        title="Categorias"
        description="Gerencie as categorias das suas despesas"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="gap-2"
                onClick={openCreateDialog}
              >
                <Plus className="h-4 w-4" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cat_descricao">Nome</Label>
                  <Input
                    id="cat_descricao"
                    placeholder="Ex: Alimentação"
                    {...register("cat_descricao", { required: true })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingCategory(null);
                      reset({ cat_descricao: "" });
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
                    {editingCategory ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

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
                    onClick={() => openEditDialog(category)}
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
              <div className="h-1 rounded-full bg-neutral-200" />
            </CardContent>
          </Card>
        ))}
      </div>

      {categoriesQuery.data?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-neutral-500">
              Nenhuma categoria cadastrada. Clique em &quot;Nova Categoria&quot;
              para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
