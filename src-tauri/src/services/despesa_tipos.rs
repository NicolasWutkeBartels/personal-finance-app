use rusqlite::Connection;

use crate::models::despesa_tipo::DespesaTipo;
use crate::repositories::despesa_tipos as despesa_tipos_repo;

pub fn listar(conn: &Connection) -> Result<Vec<DespesaTipo>, String> {
  despesa_tipos_repo::listar(conn)
}

pub fn buscar_por_uuid(conn: &Connection, dest_uuid: &str) -> Result<DespesaTipo, String> {
  let tipo = despesa_tipos_repo::buscar_por_uuid(conn, dest_uuid)?;
  tipo.ok_or_else(|| "Tipo de despesa não encontrado".to_string())
}
