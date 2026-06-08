import {
  ADMIN_USUARIO_UUID,
  type UsuarioAtualizar,
} from "@/lib/models/usuario";
import { UsuarioRepository } from "@/lib/repositories/usuario";

function assertRequired(value: string, label: string) {
  if (!value.trim()) {
    throw new Error(`${label} é obrigatório.`);
  }
}

export const usuarioService = {
  async findAdmin() {
    const usuario = await UsuarioRepository.findAdmin(ADMIN_USUARIO_UUID);

    if (!usuario) {
      throw new Error("Usuário administrador não encontrado.");
    }
    return usuario;
  },

  async updateAdmin(input: UsuarioAtualizar) {
    assertRequired(input.usu_nome, "Nome");

    const usuario = await UsuarioRepository.updateAdmin(ADMIN_USUARIO_UUID, {
      usu_nome: input.usu_nome.trim(),
      usu_email: input.usu_email?.trim() || null,
      usu_telefone: input.usu_telefone?.trim() || null,
    });

    if (!usuario) {
      throw new Error("Usuário administrador não encontrado.");
    }

    return "";
  },
};
