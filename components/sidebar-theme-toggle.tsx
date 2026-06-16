"use client";

import { Sun, Moon, SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => setTheme(isDark ? "light" : "dark")}
          tooltip={isDark ? "Modo Claro" : "Modo Escuro"}
          className="rounded-xl px-3 py-2.5 h-10 font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
        >
          <SunIcon className="h-5 w-5 text-amber-500 hidden dark:block" />
          <span className="hidden dark:block">Modo Claro</span>

          <MoonIcon className="h-5 w-5 text-indigo-500 block dark:hidden" />
          <span className="block dark:hidden">Modo Escuro</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
