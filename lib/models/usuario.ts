import { SITUACAO_ATIVO_UUID } from "@/lib/models/situacao";

export const ADMIN_USUARIO_UUID = "00000000-0000-0000-0000-000000000100";

export interface Usuario {
  usu_uuid: string;
  sit_uuid: string;
  usu_nome: string;
  usu_email: string | null;
  usu_telefone: string | null;
}

export interface UsuarioAtualizar {
  usu_nome: string;
  usu_email: string | null;
  usu_telefone: string | null;
}

export function criarUsuarioAdminPadrao(): Usuario {
  return {
    usu_uuid: ADMIN_USUARIO_UUID,
    sit_uuid: SITUACAO_ATIVO_UUID,
    usu_nome: "Administrador",
    usu_email: null,
    usu_telefone: null,
  };
}
