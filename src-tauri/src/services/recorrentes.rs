use rusqlite::Connection;

use crate::models::recorrente::{Recorrente, RecorrenteAtualizar, RecorrenteCriar};
use crate::models::situacao::{SITUACAO_ATIVO_UUID, SITUACAO_EXCLUIDO_UUID};
use crate::models::usuario::ADMIN_USUARIO_UUID;
use crate::repositories::categorias as categorias_repo;
use crate::repositories::recorrentes as recorrentes_repo;
use crate::repositories::usuarios as usuarios_repo;
use crate::services::despesa_tipos as despesa_tipos_service;

pub fn listar(conn: &Connection) -> Result<Vec<Recorrente>, String> {
  recorrentes_repo::listar_por_usuario(conn)
}

pub fn criar(conn: &Connection, input: RecorrenteCriar) -> Result<Recorrente, String> {
  validar_recorrente_base(conn, &input.cat_uuid, &input.dest_uuid, input.rec_valor, input.rec_dia)?;

  recorrentes_repo::criar(
    conn,
    RecorrenteCriar {
      cat_uuid: input.cat_uuid,
      dest_uuid: input.dest_uuid,
      rec_descricao: input.rec_descricao.trim().to_string(),
      rec_valor: input.rec_valor,
      rec_dia: input.rec_dia,
      rec_hora: input.rec_hora.trim().to_string(),
      rec_observacao: normalizar_opcional(input.rec_observacao),
    },
  )
}

pub fn atualizar(conn: &Connection, input: RecorrenteAtualizar) -> Result<Recorrente, String> {
  validar_recorrente_base(conn, &input.cat_uuid, &input.dest_uuid, input.rec_valor, input.rec_dia)?;

  let recorrente = recorrentes_repo::buscar_por_uuid(conn, &input.rec_uuid)?
    .ok_or_else(|| "Recorrência não encontrada".to_string())?;

  if recorrente.usu_uuid != ADMIN_USUARIO_UUID {
    return Err("Recorrência não pertence ao usuário atual".to_string());
  }

  if recorrente.sit_uuid == SITUACAO_EXCLUIDO_UUID {
    return Err("Recorrência excluída não pode ser alterada".to_string());
  }

  recorrentes_repo::atualizar(
    conn,
    RecorrenteAtualizar {
      rec_uuid: input.rec_uuid,
      cat_uuid: input.cat_uuid,
      dest_uuid: input.dest_uuid,
      rec_descricao: input.rec_descricao.trim().to_string(),
      rec_valor: input.rec_valor,
      rec_dia: input.rec_dia,
      rec_hora: input.rec_hora.trim().to_string(),
      rec_observacao: normalizar_opcional(input.rec_observacao),
    },
  )
}

pub fn inativar(conn: &Connection, rec_uuid: &str) -> Result<(), String> {
  let recorrente = recorrentes_repo::buscar_por_uuid(conn, rec_uuid)?
    .ok_or_else(|| "Recorrência não encontrada".to_string())?;

  if recorrente.usu_uuid != ADMIN_USUARIO_UUID {
    return Err("Recorrência não pertence ao usuário atual".to_string());
  }

  if recorrente.sit_uuid == SITUACAO_EXCLUIDO_UUID {
    return Err("Recorrência excluída não pode ser inativada".to_string());
  }

  recorrentes_repo::inativar(conn, rec_uuid)
}

pub fn ativar(conn: &Connection, rec_uuid: &str) -> Result<(), String> {
  let recorrente = recorrentes_repo::buscar_por_uuid(conn, rec_uuid)?
    .ok_or_else(|| "Recorrência não encontrada".to_string())?;

  if recorrente.usu_uuid != ADMIN_USUARIO_UUID {
    return Err("Recorrência não pertence ao usuário atual".to_string());
  }

  if recorrente.sit_uuid == SITUACAO_EXCLUIDO_UUID {
    return Err("Recorrência excluída não pode ser ativada".to_string());
  }

  recorrentes_repo::ativar(conn, rec_uuid)
}

pub fn excluir(conn: &Connection, rec_uuid: &str) -> Result<(), String> {
  let recorrente = recorrentes_repo::buscar_por_uuid(conn, rec_uuid)?
    .ok_or_else(|| "Recorrência não encontrada".to_string())?;

  if recorrente.usu_uuid != ADMIN_USUARIO_UUID {
    return Err("Recorrência não pertence ao usuário atual".to_string());
  }

  if recorrente.sit_uuid == SITUACAO_EXCLUIDO_UUID {
    return Ok(());
  }

  recorrentes_repo::excluir(conn, rec_uuid)
}

fn validar_recorrente_base(
  conn: &Connection,
  cat_uuid: &str,
  dest_uuid: &str,
  valor: i64,
  dia: i32,
) -> Result<(), String> {
  if valor <= 0 {
    return Err("O valor da recorrência precisa ser maior que zero".to_string());
  }

  if !(1..=31).contains(&dia) {
    return Err("O dia da recorrência precisa estar entre 1 e 31".to_string());
  }

  usuarios_repo::obter_admin(conn)?;

  let categoria = categorias_repo::buscar_por_uuid(conn, cat_uuid)?
    .ok_or_else(|| "Categoria não encontrada".to_string())?;

  if categoria.usu_uuid != ADMIN_USUARIO_UUID {
    return Err("Categoria não pertence ao usuário atual".to_string());
  }

  if categoria.sit_uuid == SITUACAO_EXCLUIDO_UUID {
    return Err("Categoria excluída não pode ser usada".to_string());
  }

  let tipo = despesa_tipos_service::buscar_por_uuid(conn, dest_uuid)?;
  if tipo.sit_uuid == SITUACAO_EXCLUIDO_UUID {
    return Err("Tipo de despesa excluído não pode ser usado".to_string());
  }

  Ok(())
}

fn normalizar_opcional(valor: Option<String>) -> Option<String> {
  valor
    .map(|texto| texto.trim().to_string())
    .filter(|texto| !texto.is_empty())
}
