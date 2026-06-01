use rusqlite::Connection;

use crate::models::despesa::{Despesa, DespesaAtualizar, DespesaCriar};
use crate::models::situacao::SITUACAO_EXCLUIDO_UUID;
use crate::models::usuario::ADMIN_USUARIO_UUID;
use crate::repositories::categorias as categorias_repo;
use crate::repositories::despesas as despesas_repo;
use crate::repositories::usuarios as usuarios_repo;
use crate::services::despesa_tipos as despesa_tipos_service;

pub fn listar(conn: &Connection) -> Result<Vec<Despesa>, String> {
  despesas_repo::listar_por_usuario(conn)
}

pub fn criar(conn: &Connection, input: DespesaCriar) -> Result<Despesa, String> {
  validar_despesa_base(conn, &input.cat_uuid, &input.dest_uuid, input.des_valor)?;

  despesas_repo::criar(
    conn,
    DespesaCriar {
      cat_uuid: input.cat_uuid,
      dest_uuid: input.dest_uuid,
      des_descricao: input.des_descricao.trim().to_string(),
      des_valor: input.des_valor,
      des_observacao: normalizar_opcional(input.des_observacao),
      des_data: input.des_data.trim().to_string(),
      des_hora: input.des_hora.trim().to_string(),
    },
  )
}

pub fn atualizar(conn: &Connection, input: DespesaAtualizar) -> Result<Despesa, String> {
  validar_despesa_base(conn, &input.cat_uuid, &input.dest_uuid, input.des_valor)?;

  let despesa = despesas_repo::buscar_por_uuid(conn, &input.des_uuid)?
    .ok_or_else(|| "Despesa não encontrada".to_string())?;

  if despesa.usu_uuid != ADMIN_USUARIO_UUID {
    return Err("Despesa não pertence ao usuário atual".to_string());
  }

  if despesa.sit_uuid == SITUACAO_EXCLUIDO_UUID {
    return Err("Despesa excluída não pode ser alterada".to_string());
  }

  despesas_repo::atualizar(
    conn,
    DespesaAtualizar {
      des_uuid: input.des_uuid,
      cat_uuid: input.cat_uuid,
      dest_uuid: input.dest_uuid,
      des_descricao: input.des_descricao.trim().to_string(),
      des_valor: input.des_valor,
      des_observacao: normalizar_opcional(input.des_observacao),
      des_data: input.des_data.trim().to_string(),
      des_hora: input.des_hora.trim().to_string(),
    },
  )
}

pub fn excluir(conn: &Connection, des_uuid: &str) -> Result<(), String> {
  let despesa = despesas_repo::buscar_por_uuid(conn, des_uuid)?
    .ok_or_else(|| "Despesa não encontrada".to_string())?;

  if despesa.usu_uuid != ADMIN_USUARIO_UUID {
    return Err("Despesa não pertence ao usuário atual".to_string());
  }

  if despesa.sit_uuid == SITUACAO_EXCLUIDO_UUID {
    return Ok(());
  }

  despesas_repo::excluir(conn, des_uuid)
}

fn validar_despesa_base(conn: &Connection, cat_uuid: &str, dest_uuid: &str, valor: i64) -> Result<(), String> {
  if valor <= 0 {
    return Err("O valor da despesa precisa ser maior que zero".to_string());
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
