"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Settings } from "lucide-react";

import { UserAvatar } from "./user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";
import ProfileWindow from "./profile-window";

import { useUsuarioAdmin } from "@/lib/hooks/useUsuario";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarThemeToggle } from "./sidebar-theme-toggle";

import { type PropsWithChildren } from "react";

export function Sidebar({ children }: PropsWithChildren) {
  const router = useRouter();

  const { data } = useUsuarioAdmin();

  return (
    <SidebarProvider>
      <ShadcnSidebar className="border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <SidebarHeader className="p-4 pb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer">
                <UserAvatar name={data?.usu_nome} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {data?.usu_nome ?? "Carregando..."}
                  </p>
                  <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                    {data?.usu_email ?? " "}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("?perfil")}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Editar perfil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent className="px-2">
          <SidebarNavigation />
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter className="p-2">
          <SidebarThemeToggle />
        </SidebarFooter>
      </ShadcnSidebar>

      <SidebarInset className="relative flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-950 text-neutral-950 dark:text-neutral-50 pb-safe">
        <header className="sticky top-0 z-40 flex h-[calc(3.5rem+env(safe-area-inset-top,0px))] pt-safe w-full items-center border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-6">
          <SidebarTrigger className="h-9 w-9 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center justify-center cursor-pointer" />
        </header>

        <div className="w-full">{children}</div>
      </SidebarInset>

      <React.Suspense fallback={null}>
        <ProfileWindow />
      </React.Suspense>
    </SidebarProvider>
  );
}
