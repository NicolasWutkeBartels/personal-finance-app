use tauri::AppHandle;

use crate::database;
use crate::models::recorrente::{Recorrente, RecorrenteAtualizar, RecorrenteCriar};
use crate::services::recorrentes as recorrentes_service;

#[tauri::command]
pub fn listar_recorrentes(app: AppHandle) -> Result<Vec<Recorrente>, String> {
  database::with_connection(&app, |conn| recorrentes_service::listar(conn))
}

#[tauri::command]
pub fn criar_recorrente(app: AppHandle, input: RecorrenteCriar) -> Result<Recorrente, String> {
  database::with_connection(&app, |conn| recorrentes_service::criar(conn, input))
}

#[tauri::command]
pub fn atualizar_recorrente(app: AppHandle, input: RecorrenteAtualizar) -> Result<Recorrente, String> {
  database::with_connection(&app, |conn| recorrentes_service::atualizar(conn, input))
}

#[tauri::command]
pub fn inativar_recorrente(app: AppHandle, rec_uuid: String) -> Result<(), String> {
  database::with_connection(&app, |conn| recorrentes_service::inativar(conn, &rec_uuid))
}

#[tauri::command]
pub fn ativar_recorrente(app: AppHandle, rec_uuid: String) -> Result<(), String> {
  database::with_connection(&app, |conn| recorrentes_service::ativar(conn, &rec_uuid))
}

#[tauri::command]
pub fn excluir_recorrente(app: AppHandle, rec_uuid: String) -> Result<(), String> {
  database::with_connection(&app, |conn| recorrentes_service::excluir(conn, &rec_uuid))
}
