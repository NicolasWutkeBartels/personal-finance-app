"use client";

import { useQuery } from "@tanstack/react-query";
import { usuarioService } from "@/lib/services/usuario";

export function useUsuarioAdmin() {
  return useQuery({
    queryKey: ["usuario-admin"],
    queryFn: () => usuarioService.findAdmin(),
  });
}
