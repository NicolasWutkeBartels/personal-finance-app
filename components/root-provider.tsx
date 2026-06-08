"use client";

import * as React from "react";
import { AppQueryProvider } from "@/components/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppQueryProvider>
      <ThemeProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </AppQueryProvider>
  );
}
