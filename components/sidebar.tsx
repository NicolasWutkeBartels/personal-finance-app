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
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";
import ProfileWindow from "./profile-window";

import { useUsuarioAdmin } from "@/lib/hooks/useUsuario";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarThemeToggle } from "./sidebar-theme-toggle";

import { motion } from "motion/react";
import { useLaunch } from "@/components/launch-provider";
import { BrandLogo } from "@/components/brand-logo";
import { type PropsWithChildren } from "react";

export function Sidebar({ children }: PropsWithChildren) {
  const router = useRouter();

  const { data } = useUsuarioAdmin();
  const { showSplash, layoutIdEnabled } = useLaunch();

  return (
    <>
      <ProfileWindow />
      <SidebarProvider>
        <ShadcnSidebar className="border-r border-border/80 bg-white dark:bg-neutral-950">
          <SidebarHeader className="p-4 pb-2 space-y-3">
            {/* Minimal Monochromatic Brand Symbol with shared layout transition */}
            <div className="flex items-center gap-2.5 px-2 py-1 select-none group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              {!showSplash ? (
                <BrandLogo 
                  layoutId={layoutIdEnabled ? "brand-logo-svg" : undefined}
                  className="h-5 w-5 text-foreground shrink-0" 
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : (
                <div className="h-5 w-5 shrink-0" />
              )}
              {!showSplash ? (
                <motion.span 
                  layoutId={layoutIdEnabled ? "brand-logo-text" : undefined}
                  className="font-bold tracking-wider text-foreground text-xs uppercase font-sans group-data-[collapsible=icon]:hidden"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  Finance
                </motion.span>
              ) : (
                <div className="h-4 w-12 group-data-[collapsible=icon]:hidden" />
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900/60 cursor-pointer">
                  <UserAvatar name={data?.usu_nome} className="h-7 w-7 text-[10px] shrink-0 border border-border/50 shadow-2xs" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-foreground leading-tight">
                      {data?.usu_nome ?? "Carregando..."}
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground mt-0.5 leading-none">
                      {data?.usu_email ?? " "}
                    </p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 font-sans">
                <DropdownMenuLabel className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider px-2 py-1.5">Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("?perfil")}
                  className="cursor-pointer font-medium text-xs"
                >
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                  Editar perfil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarHeader>

          <SidebarSeparator className="bg-border/60" />

          <SidebarContent className="px-2 py-2">
            <SidebarNavigation />
          </SidebarContent>

          <SidebarSeparator className="bg-border/60" />

          <SidebarFooter className="p-3">
            <SidebarThemeToggle />
          </SidebarFooter>
        </ShadcnSidebar>

        <SidebarInset className="relative flex-1 overflow-auto bg-background text-foreground pb-safe">
          <div className="w-full">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
