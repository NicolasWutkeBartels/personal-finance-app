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
    <SidebarMenu>
      {navigation.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.includes(item.href);

        return (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              isActive={active}
              className={cn(
                "rounded-xl px-3 py-2.5 h-10 font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
                active
                  ? "bg-neutral-900 text-white hover:bg-neutral-900 hover:text-white data-[active=true]:bg-neutral-900 data-[active=true]:text-white dark:bg-neutral-50 dark:text-neutral-900 dark:data-[active=true]:bg-neutral-50 dark:data-[active=true]:text-neutral-900"
                  : "text-neutral-700 dark:text-neutral-300"
              )}
            >
              <Link href={item.href} onClick={handleLinkClick}>
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
