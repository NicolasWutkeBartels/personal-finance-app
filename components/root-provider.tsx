"use client";

import * as React from "react";
import { AppQueryProvider } from "@/components/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppQueryProvider>
      <ThemeProvider>
        <TooltipProvider>
          <React.Suspense fallback={null}>{children}</React.Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </AppQueryProvider>
  );
}
