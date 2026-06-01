use rusqlite::Connection;

use crate::models::categoria::{Categoria, CategoriaAtualizar, CategoriaCriar};
use crate::models::situacao::SITUACAO_EXCLUIDO_UUID;
use crate::models::usuario::ADMIN_USUARIO_UUID;
use crate::repositories::categorias as categorias_repo;
use crate::repositories::usuarios as usuarios_repo;

pub fn listar(conn: &Connection) -> Result<Vec<Categoria>, String> {
  categorias_repo::listar_por_usuario(conn)
}

pub fn criar(conn: &Connection, input: CategoriaCriar) -> Result<Categoria, String> {
  let descricao = input.cat_descricao.trim();
  if descricao.is_empty() {
    return Err("A descrição da categoria é obrigatória".to_string());
  }

  usuarios_repo::obter_admin(conn)?;

  categorias_repo::criar(
    conn,
    CategoriaCriar {
      cat_descricao: descricao.to_string(),
    },
  )
}

pub fn atualizar(conn: &Connection, input: CategoriaAtualizar) -> Result<Categoria, String> {
  let descricao = input.cat_descricao.trim();
  if descricao.is_empty() {
    return Err("A descrição da categoria é obrigatória".to_string());
  }

  let categoria = categorias_repo::buscar_por_uuid(conn, &input.cat_uuid)?
    .ok_or_else(|| "Categoria não encontrada".to_string())?;

  if categoria.usu_uuid != ADMIN_USUARIO_UUID {
    return Err("Categoria não pertence ao usuário atual".to_string());
  }

  if categoria.sit_uuid == SITUACAO_EXCLUIDO_UUID {
    return Err("Categoria excluída não pode ser alterada".to_string());
  }

  categorias_repo::atualizar(
    conn,
    CategoriaAtualizar {
      cat_uuid: input.cat_uuid,
      cat_descricao: descricao.to_string(),
    },
  )
}

pub fn excluir(conn: &Connection, cat_uuid: &str) -> Result<(), String> {
  let categoria = categorias_repo::buscar_por_uuid(conn, cat_uuid)?
    .ok_or_else(|| "Categoria não encontrada".to_string())?;

  if categoria.usu_uuid != ADMIN_USUARIO_UUID {
    return Err("Categoria não pertence ao usuário atual".to_string());
  }

  if categoria.sit_uuid == SITUACAO_EXCLUIDO_UUID {
    return Ok(());
  }

  categorias_repo::excluir(conn, cat_uuid)
}
