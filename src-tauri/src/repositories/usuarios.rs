use rusqlite::{params, Connection};

use crate::models::situacao::SITUACAO_ATIVO_UUID;
use crate::models::usuario::{Usuario, UsuarioAtualizar, ADMIN_USUARIO_UUID};

pub fn obter_admin(conn: &Connection) -> Result<Usuario, String> {
  let mut stmt = conn
    .prepare(
      "
      SELECT usu_uuid, sit_uuid, usu_nome, usu_email, usu_telefone
      FROM usuarios
      WHERE usu_uuid = ?1
      ",
    )
    .map_err(|e| e.to_string())?;

  stmt
    .query_row(params![ADMIN_USUARIO_UUID], |row| {
      Ok(Usuario {
        usu_uuid: row.get(0)?,
        sit_uuid: row.get(1)?,
        usu_nome: row.get(2)?,
        usu_email: row.get(3)?,
        usu_telefone: row.get(4)?,
      })
    })
    .map_err(|e| e.to_string())
}

pub fn atualizar_admin(conn: &Connection, input: UsuarioAtualizar) -> Result<Usuario, String> {
  conn
    .execute(
      "
      UPDATE usuarios
      SET usu_nome = ?1,
          usu_email = ?2,
          usu_telefone = ?3,
          sit_uuid = ?4
      WHERE usu_uuid = ?5
      ",
      params![
        input.usu_nome,
        input.usu_email,
        input.usu_telefone,
        SITUACAO_ATIVO_UUID,
        ADMIN_USUARIO_UUID
      ],
    )
    .map_err(|e| e.to_string())?;

  obter_admin(conn)
}
