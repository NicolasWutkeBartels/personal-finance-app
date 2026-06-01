use serde::{Deserialize, Serialize};

use super::situacao::SITUACAO_ATIVO_UUID;

pub const ADMIN_USUARIO_UUID: &str = "00000000-0000-0000-0000-000000000100";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Usuario {
  pub usu_uuid: String,
  pub sit_uuid: String,
  pub usu_nome: String,
  pub usu_email: Option<String>,
  pub usu_telefone: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UsuarioAtualizar {
  pub usu_nome: String,
  pub usu_email: Option<String>,
  pub usu_telefone: Option<String>,
}

impl Usuario {
  pub fn admin_padrao() -> Self {
    Self {
      usu_uuid: ADMIN_USUARIO_UUID.to_string(),
      sit_uuid: SITUACAO_ATIVO_UUID.to_string(),
      usu_nome: "Administrador".to_string(),
      usu_email: None,
      usu_telefone: None,
    }
  }
}
