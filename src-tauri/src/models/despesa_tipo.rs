use serde::{Deserialize, Serialize};

pub const DESPESA_TIPO_RECEITA_UUID: &str = "00000000-0000-0000-0000-000000000101";
pub const DESPESA_TIPO_DESPESA_UUID: &str = "00000000-0000-0000-0000-000000000102";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DespesaTipo {
  pub dest_uuid: String,
  pub sit_uuid: String,
  pub dest_descricao: String,
}
