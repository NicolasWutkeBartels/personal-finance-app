import type { Usuario, UsuarioAtualizar } from "@/lib/models/usuario";
import { executeSql, selectOne } from "@/lib/bd/conexao";

async function findAdmin(usuUuid: string) {
  return selectOne<Usuario>(
    `SELECT usu_uuid, sit_uuid, usu_nome, usu_email, usu_telefone
     FROM usuario
     WHERE usu_uuid = $1`,
    [usuUuid],
  );
}

async function updateAdmin(usuUuid: string, input: UsuarioAtualizar) {
  await executeSql(
    `UPDATE usuario
     SET usu_nome = $1,
         usu_email = $2,
         usu_telefone = $3
     WHERE usu_uuid = $4`,
    [input.usu_nome, input.usu_email, input.usu_telefone, usuUuid],
  );

  return findAdmin(usuUuid);
}

export const UsuarioRepository = {
  findAdmin,
  updateAdmin,
};
