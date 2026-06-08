"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UseWindowReturn = {
  open: boolean;
  value?: string;
  close: () => void;
  onOpenChange: (open: boolean) => void;
};

export function useWindow(key: string): UseWindowReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const open = searchParams.has(key);
  const value = searchParams.get(key) || undefined;

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(key);

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }, [key, pathname, router, searchParams]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        close();
      }
    },
    [close],
  );

  return {
    open,
    value,
    close,
    onOpenChange,
  };
}
