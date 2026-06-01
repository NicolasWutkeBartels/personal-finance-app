use rusqlite::{params, Connection, OptionalExtension};

use crate::models::despesa_tipo::DespesaTipo;

pub fn listar(conn: &Connection) -> Result<Vec<DespesaTipo>, String> {
  let mut stmt = conn
    .prepare(
      "
      SELECT dest_uuid, sit_uuid, dest_descricao
      FROM despesa_tipos
      ORDER BY dest_descricao ASC
      ",
    )
    .map_err(|e| e.to_string())?;

  let rows = stmt
    .query_map([], |row| {
      Ok(DespesaTipo {
        dest_uuid: row.get(0)?,
        sit_uuid: row.get(1)?,
        dest_descricao: row.get(2)?,
      })
    })
    .map_err(|e| e.to_string())?;

  rows
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| e.to_string())
}

pub fn buscar_por_uuid(conn: &Connection, dest_uuid: &str) -> Result<Option<DespesaTipo>, String> {
  let mut stmt = conn
    .prepare(
      "
      SELECT dest_uuid, sit_uuid, dest_descricao
      FROM despesa_tipos
      WHERE dest_uuid = ?1
      ",
    )
    .map_err(|e| e.to_string())?;

  stmt
    .query_row(params![dest_uuid], |row| {
      Ok(DespesaTipo {
        dest_uuid: row.get(0)?,
        sit_uuid: row.get(1)?,
        dest_descricao: row.get(2)?,
      })
    })
    .optional()
    .map_err(|e| e.to_string())
}
