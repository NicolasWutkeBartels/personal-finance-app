use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Despesa {
  pub des_uuid: String,
  pub usu_uuid: String,
  pub sit_uuid: String,
  pub cat_uuid: String,
  pub dest_uuid: String,
  pub des_descricao: String,
  pub des_valor: i64,
  pub des_observacao: Option<String>,
  pub des_data: String,
  pub des_hora: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DespesaCriar {
  pub cat_uuid: String,
  pub dest_uuid: String,
  pub des_descricao: String,
  pub des_valor: i64,
  pub des_observacao: Option<String>,
  pub des_data: String,
  pub des_hora: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DespesaAtualizar {
  pub des_uuid: String,
  pub cat_uuid: String,
  pub dest_uuid: String,
  pub des_descricao: String,
  pub des_valor: i64,
  pub des_observacao: Option<String>,
  pub des_data: String,
  pub des_hora: String,
}
