"use client";

import { PropsWithChildren } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

function Root({ children }: PropsWithChildren) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {children}
    </div>
  );
}

import { motion } from "motion/react";
import { useLaunch } from "@/components/launch-provider";
import { BrandLogo } from "@/components/brand-logo";

export function Title({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const sidebar = useSidebar();
  const { showSplash, layoutIdEnabled } = useLaunch();
  const isExpanded = sidebar.state === "expanded";

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center gap-3">
        {/* Desktop Sidebar Toggle Button integrated directly into Title */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={sidebar.toggleSidebar}
          className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg shrink-0 hidden md:flex items-center justify-center border border-border/40 bg-card/60 shadow-3xs"
          title={isExpanded ? "Recolher menu" : "Expandir menu"}
        >
          {isExpanded ? (
            <ArrowLeft className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
        
        {/* Mobile Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={sidebar.toggleSidebar}
          className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg shrink-0 flex md:hidden items-center justify-center border border-border/40 bg-card/60 shadow-3xs"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile Header Logo */}
        {!showSplash && (
          <div className="md:hidden flex items-center shrink-0">
            <BrandLogo
              layoutId={layoutIdEnabled ? "brand-logo-svg" : undefined}
              className="h-5 w-5 text-foreground"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        )}

        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-sans">
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 md:pl-11 pl-0 select-none">
          {description}
        </p>
      )}
    </div>
  );
}

export function Action({ children }: PropsWithChildren) {
  return <div className="flex items-center shrink-0">{children}</div>;
}

export const SectionHeader = {
  Root,
  Title,
  Action,
};
