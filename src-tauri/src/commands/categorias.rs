use tauri::AppHandle;

use crate::database;
use crate::models::categoria::{Categoria, CategoriaAtualizar, CategoriaCriar};
use crate::services::categorias as categorias_service;

#[tauri::command]
pub fn listar_categorias(app: AppHandle) -> Result<Vec<Categoria>, String> {
  database::with_connection(&app, |conn| categorias_service::listar(conn))
}

#[tauri::command]
pub fn criar_categoria(app: AppHandle, input: CategoriaCriar) -> Result<Categoria, String> {
  database::with_connection(&app, |conn| categorias_service::criar(conn, input))
}

#[tauri::command]
pub fn atualizar_categoria(app: AppHandle, input: CategoriaAtualizar) -> Result<Categoria, String> {
  database::with_connection(&app, |conn| categorias_service::atualizar(conn, input))
}

#[tauri::command]
pub fn excluir_categoria(app: AppHandle, cat_uuid: String) -> Result<(), String> {
  database::with_connection(&app, |conn| categorias_service::excluir(conn, &cat_uuid))
}
