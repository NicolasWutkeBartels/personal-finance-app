use tauri::AppHandle;

use crate::database;
use crate::models::despesa_tipo::DespesaTipo;
use crate::services::despesa_tipos as despesa_tipos_service;

#[tauri::command]
pub fn listar_tipos_despesa(app: AppHandle) -> Result<Vec<DespesaTipo>, String> {
  database::with_connection(&app, |conn| despesa_tipos_service::listar(conn))
}
