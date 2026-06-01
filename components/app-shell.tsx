"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  FolderOpen,
  Home,
  Menu,
  Receipt,
  Repeat,
  Settings,
  User,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { financeApi } from "@/lib/finance-api";
import type { UsuarioAtualizar } from "@/lib/finance-demo";
import { queryClient } from "@/lib/queryClient";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

  const userQuery = useQuery({
    queryKey: ["usuario-admin"],
    queryFn: financeApi.obterUsuarioAdmin,
  });

  const updateUserMutation = useMutation({
    mutationFn: financeApi.atualizarUsuarioAdmin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["usuario-admin"] });
      setIsProfileModalOpen(false);
    },
  });

  const profileForm = useForm<UsuarioAtualizar>();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Categorias", href: "/categorias", icon: FolderOpen },
    { name: "Recorrentes", href: "/despesas-recorrentes", icon: Repeat },
    { name: "Despesas", href: "/despesas", icon: Receipt },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const userProfile = userQuery.data;
  const initials = userProfile?.usu_nome
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const openProfileModal = () => {
    profileForm.reset({
      usu_nome: userProfile?.usu_nome ?? "",
      usu_email: userProfile?.usu_email ?? "",
      usu_telefone: userProfile?.usu_telefone ?? "",
    });
    setIsProfileModalOpen(true);
  };

  const handleProfileSubmit = profileForm.handleSubmit((values) => {
    updateUserMutation.mutate({
      usu_nome: values.usu_nome.trim(),
      usu_email: values.usu_email?.trim() || null,
      usu_telefone: values.usu_telefone?.trim() || null,
    });
  });

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-950">
      <aside
        className={cn(
          "border-r border-neutral-200 bg-white transition-[width] duration-300",
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden",
        )}
      >
        <div className="p-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-neutral-50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-neutral-200 text-neutral-700">
                    {initials || <User className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {userProfile?.usu_nome ?? "Carregando..."}
                  </p>
                  <p className="truncate text-xs text-neutral-500">
                    {userProfile?.usu_email ?? " "}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openProfileModal}>
                <Settings className="mr-2 h-4 w-4" />
                Editar perfil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator />

        <nav className="px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-100",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="relative flex-1 overflow-auto">
        <button
          onClick={() => setIsSidebarOpen((value) => !value)}
          className={cn(
            "fixed top-4 z-50 rounded-xl border border-neutral-200 bg-white p-2 shadow-sm transition-all hover:bg-neutral-50",
            isSidebarOpen ? "left-[272px]" : "left-4",
          )}
          aria-label="Alternar sidebar"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5 text-neutral-700" />
          ) : (
            <Menu className="h-5 w-5 text-neutral-700" />
          )}
        </button>

        <div className="min-h-screen">{children}</div>
      </main>

      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            <div className="space-y-2">
              <Label htmlFor="profile-name">Nome</Label>
              <Input id="profile-name" {...profileForm.register("usu_nome")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                {...profileForm.register("usu_email")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Telefone</Label>
              <Input
                id="profile-phone"
                {...profileForm.register("usu_telefone")}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsProfileModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={updateUserMutation.isPending}
              >
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
