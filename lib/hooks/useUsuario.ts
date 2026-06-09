"use client";

import { useQuery } from "@tanstack/react-query";
import { UsuarioService } from "@/lib/services/usuario";

export function useUsuarioAdmin() {
  return useQuery({
    queryKey: ["usuario-admin"],
    queryFn: () => UsuarioService.findAdmin(),
  });
}
