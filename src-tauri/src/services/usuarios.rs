use rusqlite::Connection;

use crate::models::usuario::{Usuario, UsuarioAtualizar};
use crate::repositories::usuarios as usuarios_repo;

pub fn obter_admin(conn: &Connection) -> Result<Usuario, String> {
  usuarios_repo::obter_admin(conn)
}

pub fn atualizar_admin(conn: &Connection, input: UsuarioAtualizar) -> Result<Usuario, String> {
  let nome = input.usu_nome.trim();
  if nome.is_empty() {
    return Err("O nome do usuário é obrigatório".to_string());
  }

  usuarios_repo::atualizar_admin(
    conn,
    UsuarioAtualizar {
      usu_nome: nome.to_string(),
      usu_email: input.usu_email.map(|valor| valor.trim().to_string()).filter(|valor| !valor.is_empty()),
      usu_telefone: input
        .usu_telefone
        .map(|valor| valor.trim().to_string())
        .filter(|valor| !valor.is_empty()),
    },
  )
}
