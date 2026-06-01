pub mod commands;
pub mod database;
pub mod models;
pub mod repositories;
pub mod services;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      database::initialize(&app.handle())?;

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      commands::usuarios::obter_usuario_admin,
      commands::usuarios::atualizar_usuario_admin,
      commands::despesa_tipos::listar_tipos_despesa,
      commands::categorias::listar_categorias,
      commands::categorias::criar_categoria,
      commands::categorias::atualizar_categoria,
      commands::categorias::excluir_categoria,
      commands::despesas::listar_despesas,
      commands::despesas::criar_despesa,
      commands::despesas::atualizar_despesa,
      commands::despesas::excluir_despesa,
      commands::recorrentes::listar_recorrentes,
      commands::recorrentes::criar_recorrente,
      commands::recorrentes::atualizar_recorrente,
      commands::recorrentes::ativar_recorrente,
      commands::recorrentes::inativar_recorrente,
      commands::recorrentes::excluir_recorrente
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
