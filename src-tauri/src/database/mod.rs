mod connection;
mod migrations;

use std::error::Error;
use std::path::PathBuf;

use rusqlite::Connection;
use tauri::{AppHandle, Manager, Runtime};

pub fn database_path<R: Runtime>(app: &AppHandle<R>) -> Result<PathBuf, Box<dyn Error>> {
  Ok(app.path().app_local_data_dir()?.join("financeiro.db"))
}

pub fn open_connection<R: Runtime>(app: &AppHandle<R>) -> Result<rusqlite::Connection, Box<dyn Error>> {
  let db_path = database_path(app)?;

  if let Some(parent) = db_path.parent() {
    std::fs::create_dir_all(parent)?;
  }

  Ok(connection::open(&db_path)?)
}

pub fn with_connection<R, T, F>(app: &AppHandle<R>, f: F) -> Result<T, String>
where
  R: Runtime,
  F: FnOnce(&mut Connection) -> Result<T, String>,
{
  let mut conn = open_connection(app).map_err(|e| e.to_string())?;
  f(&mut conn)
}

pub fn initialize<R: Runtime>(app: &AppHandle<R>) -> Result<(), Box<dyn Error>> {
  let mut conn = open_connection(app)?;
  migrations::apply(&mut conn)?;
  Ok(())
}
