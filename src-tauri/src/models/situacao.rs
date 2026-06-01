use serde::{Deserialize, Serialize};

pub const SITUACAO_ATIVO_UUID: &str = "00000000-0000-0000-0000-000000000001";
pub const SITUACAO_INATIVO_UUID: &str = "00000000-0000-0000-0000-000000000002";
pub const SITUACAO_EXCLUIDO_UUID: &str = "00000000-0000-0000-0000-000000000003";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Situacao {
  pub sit_uuid: String,
  pub sit_descricao: String,
}
