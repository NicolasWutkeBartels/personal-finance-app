use tauri::AppHandle;

use crate::database;
use crate::models::usuario::{Usuario, UsuarioAtualizar};
use crate::services::usuarios as usuarios_service;

#[tauri::command]
pub fn obter_usuario_admin(app: AppHandle) -> Result<Usuario, String> {
  database::with_connection(&app, |conn| usuarios_service::obter_admin(conn))
}

#[tauri::command]
pub fn atualizar_usuario_admin(app: AppHandle, input: UsuarioAtualizar) -> Result<Usuario, String> {
  database::with_connection(&app, |conn| usuarios_service::atualizar_admin(conn, input))
}
