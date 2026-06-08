import * as React from "react";
import { cn } from "@/lib/utils";

type PageProps = React.HTMLAttributes<HTMLDivElement>;

export function Page({ className, children, ...props }: PageProps) {
  return (
    <div className={cn("px-4 py-2", className)} {...props}>
      <React.Suspense fallback={null}>
        {children}
      </React.Suspense>
    </div>
  );
}
