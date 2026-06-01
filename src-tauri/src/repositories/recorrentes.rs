use rusqlite::{params, Connection, OptionalExtension};
use uuid::Uuid;

use crate::models::recorrente::{Recorrente, RecorrenteAtualizar, RecorrenteCriar};
use crate::models::situacao::{SITUACAO_ATIVO_UUID, SITUACAO_EXCLUIDO_UUID, SITUACAO_INATIVO_UUID};
use crate::models::usuario::ADMIN_USUARIO_UUID;

pub fn listar_por_usuario(conn: &Connection) -> Result<Vec<Recorrente>, String> {
  let mut stmt = conn
    .prepare(
      "
      SELECT rec_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid,
             rec_descricao, rec_valor, rec_dia, rec_hora, rec_observacao
      FROM recorrentes
      WHERE usu_uuid = ?1
        AND sit_uuid <> ?2
      ORDER BY rec_descricao ASC
      ",
    )
    .map_err(|e| e.to_string())?;

  let rows = stmt
    .query_map(params![ADMIN_USUARIO_UUID, SITUACAO_EXCLUIDO_UUID], |row| {
      Ok(Recorrente {
        rec_uuid: row.get(0)?,
        usu_uuid: row.get(1)?,
        sit_uuid: row.get(2)?,
        cat_uuid: row.get(3)?,
        dest_uuid: row.get(4)?,
        rec_descricao: row.get(5)?,
        rec_valor: row.get(6)?,
        rec_dia: row.get(7)?,
        rec_hora: row.get(8)?,
        rec_observacao: row.get(9)?,
      })
    })
    .map_err(|e| e.to_string())?;

  rows
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| e.to_string())
}

pub fn buscar_por_uuid(conn: &Connection, rec_uuid: &str) -> Result<Option<Recorrente>, String> {
  let mut stmt = conn
    .prepare(
      "
      SELECT rec_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid,
             rec_descricao, rec_valor, rec_dia, rec_hora, rec_observacao
      FROM recorrentes
      WHERE rec_uuid = ?1
      ",
    )
    .map_err(|e| e.to_string())?;

  stmt
    .query_row(params![rec_uuid], |row| {
      Ok(Recorrente {
        rec_uuid: row.get(0)?,
        usu_uuid: row.get(1)?,
        sit_uuid: row.get(2)?,
        cat_uuid: row.get(3)?,
        dest_uuid: row.get(4)?,
        rec_descricao: row.get(5)?,
        rec_valor: row.get(6)?,
        rec_dia: row.get(7)?,
        rec_hora: row.get(8)?,
        rec_observacao: row.get(9)?,
      })
    })
    .optional()
    .map_err(|e| e.to_string())
}

pub fn criar(conn: &Connection, input: RecorrenteCriar) -> Result<Recorrente, String> {
  let recorrente = Recorrente {
    rec_uuid: Uuid::new_v4().to_string(),
    usu_uuid: ADMIN_USUARIO_UUID.to_string(),
    sit_uuid: SITUACAO_ATIVO_UUID.to_string(),
    cat_uuid: input.cat_uuid,
    dest_uuid: input.dest_uuid,
    rec_descricao: input.rec_descricao,
    rec_valor: input.rec_valor,
    rec_dia: input.rec_dia,
    rec_hora: input.rec_hora,
    rec_observacao: input.rec_observacao,
  };

  conn
    .execute(
      "
      INSERT INTO recorrentes (
        rec_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid,
        rec_descricao, rec_valor, rec_dia, rec_hora, rec_observacao
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
      ",
      params![
        recorrente.rec_uuid,
        recorrente.usu_uuid,
        recorrente.sit_uuid,
        recorrente.cat_uuid,
        recorrente.dest_uuid,
        recorrente.rec_descricao,
        recorrente.rec_valor,
        recorrente.rec_dia,
        recorrente.rec_hora,
        recorrente.rec_observacao
      ],
    )
    .map_err(|e| e.to_string())?;

  Ok(recorrente)
}

pub fn atualizar(conn: &Connection, input: RecorrenteAtualizar) -> Result<Recorrente, String> {
  conn
    .execute(
      "
      UPDATE recorrentes
      SET cat_uuid = ?1,
          dest_uuid = ?2,
          rec_descricao = ?3,
          rec_valor = ?4,
          rec_dia = ?5,
          rec_hora = ?6,
          rec_observacao = ?7
      WHERE rec_uuid = ?8
      ",
      params![
        input.cat_uuid,
        input.dest_uuid,
        input.rec_descricao,
        input.rec_valor,
        input.rec_dia,
        input.rec_hora,
        input.rec_observacao,
        input.rec_uuid
      ],
    )
    .map_err(|e| e.to_string())?;

  buscar_por_uuid(conn, &input.rec_uuid)?.ok_or_else(|| "Recorrência não encontrada".to_string())
}

pub fn inativar(conn: &Connection, rec_uuid: &str) -> Result<(), String> {
  conn
    .execute(
      "
      UPDATE recorrentes
      SET sit_uuid = ?1
      WHERE rec_uuid = ?2
      ",
      params![SITUACAO_INATIVO_UUID, rec_uuid],
    )
    .map_err(|e| e.to_string())?;

  Ok(())
}

pub fn ativar(conn: &Connection, rec_uuid: &str) -> Result<(), String> {
  conn
    .execute(
      "
      UPDATE recorrentes
      SET sit_uuid = ?1
      WHERE rec_uuid = ?2
      ",
      params![SITUACAO_ATIVO_UUID, rec_uuid],
    )
    .map_err(|e| e.to_string())?;

  Ok(())
}

pub fn excluir(conn: &Connection, rec_uuid: &str) -> Result<(), String> {
  conn
    .execute(
      "
      UPDATE recorrentes
      SET sit_uuid = ?1
      WHERE rec_uuid = ?2
      ",
      params![SITUACAO_EXCLUIDO_UUID, rec_uuid],
    )
    .map_err(|e| e.to_string())?;

  Ok(())
}
