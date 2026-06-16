"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, Home, Receipt, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { motion } from "motion/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Categorias", href: "/categorias", icon: FolderOpen },
  { name: "Recorrentes", href: "/recorrentes", icon: Repeat },
  { name: "Despesas", href: "/despesas", icon: Receipt },
];

export function SidebarNavigation() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenu className="gap-1.5">
      {navigation.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.includes(item.href);

        return (
          <SidebarMenuItem key={item.name} className="relative">
            <SidebarMenuButton
              asChild
              isActive={active}
              className={cn(
                "relative px-4 py-2.5 h-11 font-medium transition-all duration-200 cursor-pointer select-none",
                active
                  ? "mr-[-8px] pr-5 rounded-l-xl rounded-r-none bg-background text-foreground border-y border-l border-border/60 shadow-none hover:bg-background hover:text-foreground active-nav-notch z-10"
                  : "rounded-xl text-muted-foreground hover:text-foreground hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60"
              )}
            >
              <Link href={item.href} onClick={handleLinkClick} className="flex items-center gap-3">
                <Icon className={cn(
                  "h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-105",
                  active ? "text-primary" : "text-muted-foreground/80"
                )} />
                <span className="text-sm font-semibold tracking-tight">{item.name}</span>
                {active && (
                  <motion.div
                    layoutId="sidebar-active-dot"
                    className="absolute left-1.5 top-[18px] w-1 h-2 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
