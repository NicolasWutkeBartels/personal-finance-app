"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={toggleTheme}
          tooltip={isDark ? "Modo Claro" : "Modo Escuro"}
          className="rounded-xl px-3 py-2.5 h-10 font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
        >
          {isDark ? (
            <>
              <Sun className="h-5 w-5 text-amber-500" />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5 text-indigo-500" />
              <span>Modo Escuro</span>
            </>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
