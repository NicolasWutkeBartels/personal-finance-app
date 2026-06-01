use tauri::AppHandle;

use crate::database;
use crate::models::despesa::{Despesa, DespesaAtualizar, DespesaCriar};
use crate::services::despesas as despesas_service;

#[tauri::command]
pub fn listar_despesas(app: AppHandle) -> Result<Vec<Despesa>, String> {
  database::with_connection(&app, |conn| despesas_service::listar(conn))
}

#[tauri::command]
pub fn criar_despesa(app: AppHandle, input: DespesaCriar) -> Result<Despesa, String> {
  database::with_connection(&app, |conn| despesas_service::criar(conn, input))
}

#[tauri::command]
pub fn atualizar_despesa(app: AppHandle, input: DespesaAtualizar) -> Result<Despesa, String> {
  database::with_connection(&app, |conn| despesas_service::atualizar(conn, input))
}

#[tauri::command]
pub fn excluir_despesa(app: AppHandle, des_uuid: String) -> Result<(), String> {
  database::with_connection(&app, |conn| despesas_service::excluir(conn, &des_uuid))
}
