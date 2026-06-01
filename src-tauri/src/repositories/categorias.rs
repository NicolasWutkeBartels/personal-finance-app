use rusqlite::{params, Connection, OptionalExtension};

use crate::models::categoria::{Categoria, CategoriaAtualizar, CategoriaCriar};
use crate::models::situacao::{SITUACAO_ATIVO_UUID, SITUACAO_EXCLUIDO_UUID};
use crate::models::usuario::ADMIN_USUARIO_UUID;
use crate::models::usuario::ADMIN_USUARIO_UUID as USUARIO_PADRAO_UUID;
use uuid::Uuid;

pub fn listar_por_usuario(conn: &Connection) -> Result<Vec<Categoria>, String> {
  let mut stmt = conn
    .prepare(
      "
      SELECT cat_uuid, usu_uuid, sit_uuid, cat_descricao
      FROM categorias
      WHERE usu_uuid = ?1
        AND sit_uuid <> ?2
      ORDER BY cat_descricao ASC
      ",
    )
    .map_err(|e| e.to_string())?;

  let rows = stmt
    .query_map(params![USUARIO_PADRAO_UUID, SITUACAO_EXCLUIDO_UUID], |row| {
      Ok(Categoria {
        cat_uuid: row.get(0)?,
        usu_uuid: row.get(1)?,
        sit_uuid: row.get(2)?,
        cat_descricao: row.get(3)?,
      })
    })
    .map_err(|e| e.to_string())?;

  rows
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| e.to_string())
}

pub fn buscar_por_uuid(conn: &Connection, cat_uuid: &str) -> Result<Option<Categoria>, String> {
  let mut stmt = conn
    .prepare(
      "
      SELECT cat_uuid, usu_uuid, sit_uuid, cat_descricao
      FROM categorias
      WHERE cat_uuid = ?1
      ",
    )
    .map_err(|e| e.to_string())?;

  stmt
    .query_row(params![cat_uuid], |row| {
      Ok(Categoria {
        cat_uuid: row.get(0)?,
        usu_uuid: row.get(1)?,
        sit_uuid: row.get(2)?,
        cat_descricao: row.get(3)?,
      })
    })
    .optional()
    .map_err(|e| e.to_string())
}

pub fn criar(conn: &Connection, input: CategoriaCriar) -> Result<Categoria, String> {
  let categoria = Categoria {
    cat_uuid: Uuid::new_v4().to_string(),
    usu_uuid: ADMIN_USUARIO_UUID.to_string(),
    sit_uuid: SITUACAO_ATIVO_UUID.to_string(),
    cat_descricao: input.cat_descricao,
  };

  conn
    .execute(
      "
      INSERT INTO categorias (cat_uuid, usu_uuid, sit_uuid, cat_descricao)
      VALUES (?1, ?2, ?3, ?4)
      ",
      params![
        categoria.cat_uuid,
        categoria.usu_uuid,
        categoria.sit_uuid,
        categoria.cat_descricao
      ],
    )
    .map_err(|e| e.to_string())?;

  Ok(categoria)
}

pub fn atualizar(conn: &Connection, input: CategoriaAtualizar) -> Result<Categoria, String> {
  conn
    .execute(
      "
      UPDATE categorias
      SET cat_descricao = ?1
      WHERE cat_uuid = ?2
      ",
      params![input.cat_descricao, input.cat_uuid],
    )
    .map_err(|e| e.to_string())?;

  buscar_por_uuid(conn, &input.cat_uuid)?.ok_or_else(|| "Categoria não encontrada".to_string())
}

pub fn excluir(conn: &Connection, cat_uuid: &str) -> Result<(), String> {
  conn
    .execute(
      "
      UPDATE categorias
      SET sit_uuid = ?1
      WHERE cat_uuid = ?2
      ",
      params![SITUACAO_EXCLUIDO_UUID, cat_uuid],
    )
    .map_err(|e| e.to_string())?;

  Ok(())
}
