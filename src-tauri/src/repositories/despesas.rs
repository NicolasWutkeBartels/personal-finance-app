use rusqlite::{params, Connection, OptionalExtension};
use uuid::Uuid;

use crate::models::despesa::{Despesa, DespesaAtualizar, DespesaCriar};
use crate::models::situacao::{SITUACAO_ATIVO_UUID, SITUACAO_EXCLUIDO_UUID};
use crate::models::usuario::ADMIN_USUARIO_UUID;

pub fn listar_por_usuario(conn: &Connection) -> Result<Vec<Despesa>, String> {
  let mut stmt = conn
    .prepare(
      "
      SELECT des_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid,
             des_descricao, des_valor, des_observacao, des_data, des_hora
      FROM despesas
      WHERE usu_uuid = ?1
        AND sit_uuid <> ?2
      ORDER BY des_data DESC, des_hora DESC
      ",
    )
    .map_err(|e| e.to_string())?;

  let rows = stmt
    .query_map(params![ADMIN_USUARIO_UUID, SITUACAO_EXCLUIDO_UUID], |row| {
      Ok(Despesa {
        des_uuid: row.get(0)?,
        usu_uuid: row.get(1)?,
        sit_uuid: row.get(2)?,
        cat_uuid: row.get(3)?,
        dest_uuid: row.get(4)?,
        des_descricao: row.get(5)?,
        des_valor: row.get(6)?,
        des_observacao: row.get(7)?,
        des_data: row.get(8)?,
        des_hora: row.get(9)?,
      })
    })
    .map_err(|e| e.to_string())?;

  rows
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| e.to_string())
}

pub fn buscar_por_uuid(conn: &Connection, des_uuid: &str) -> Result<Option<Despesa>, String> {
  let mut stmt = conn
    .prepare(
      "
      SELECT des_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid,
             des_descricao, des_valor, des_observacao, des_data, des_hora
      FROM despesas
      WHERE des_uuid = ?1
      ",
    )
    .map_err(|e| e.to_string())?;

  stmt
    .query_row(params![des_uuid], |row| {
      Ok(Despesa {
        des_uuid: row.get(0)?,
        usu_uuid: row.get(1)?,
        sit_uuid: row.get(2)?,
        cat_uuid: row.get(3)?,
        dest_uuid: row.get(4)?,
        des_descricao: row.get(5)?,
        des_valor: row.get(6)?,
        des_observacao: row.get(7)?,
        des_data: row.get(8)?,
        des_hora: row.get(9)?,
      })
    })
    .optional()
    .map_err(|e| e.to_string())
}

pub fn criar(conn: &Connection, input: DespesaCriar) -> Result<Despesa, String> {
  let despesa = Despesa {
    des_uuid: Uuid::new_v4().to_string(),
    usu_uuid: ADMIN_USUARIO_UUID.to_string(),
    sit_uuid: SITUACAO_ATIVO_UUID.to_string(),
    cat_uuid: input.cat_uuid,
    dest_uuid: input.dest_uuid,
    des_descricao: input.des_descricao,
    des_valor: input.des_valor,
    des_observacao: input.des_observacao,
    des_data: input.des_data,
    des_hora: input.des_hora,
  };

  conn
    .execute(
      "
      INSERT INTO despesas (
        des_uuid, usu_uuid, sit_uuid, cat_uuid, dest_uuid,
        des_descricao, des_valor, des_observacao, des_data, des_hora
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
      ",
      params![
        despesa.des_uuid,
        despesa.usu_uuid,
        despesa.sit_uuid,
        despesa.cat_uuid,
        despesa.dest_uuid,
        despesa.des_descricao,
        despesa.des_valor,
        despesa.des_observacao,
        despesa.des_data,
        despesa.des_hora
      ],
    )
    .map_err(|e| e.to_string())?;

  Ok(despesa)
}

pub fn atualizar(conn: &Connection, input: DespesaAtualizar) -> Result<Despesa, String> {
  conn
    .execute(
      "
      UPDATE despesas
      SET cat_uuid = ?1,
          dest_uuid = ?2,
          des_descricao = ?3,
          des_valor = ?4,
          des_observacao = ?5,
          des_data = ?6,
          des_hora = ?7
      WHERE des_uuid = ?8
      ",
      params![
        input.cat_uuid,
        input.dest_uuid,
        input.des_descricao,
        input.des_valor,
        input.des_observacao,
        input.des_data,
        input.des_hora,
        input.des_uuid
      ],
    )
    .map_err(|e| e.to_string())?;

  buscar_por_uuid(conn, &input.des_uuid)?.ok_or_else(|| "Despesa não encontrada".to_string())
}

pub fn excluir(conn: &Connection, des_uuid: &str) -> Result<(), String> {
  conn
    .execute(
      "
      UPDATE despesas
      SET sit_uuid = ?1
      WHERE des_uuid = ?2
      ",
      params![SITUACAO_EXCLUIDO_UUID, des_uuid],
    )
    .map_err(|e| e.to_string())?;

  Ok(())
}
