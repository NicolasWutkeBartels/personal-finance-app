use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Recorrente {
  pub rec_uuid: String,
  pub usu_uuid: String,
  pub sit_uuid: String,
  pub cat_uuid: String,
  pub dest_uuid: String,
  pub rec_descricao: String,
  pub rec_valor: i64,
  pub rec_dia: i32,
  pub rec_hora: String,
  pub rec_observacao: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecorrenteCriar {
  pub cat_uuid: String,
  pub dest_uuid: String,
  pub rec_descricao: String,
  pub rec_valor: i64,
  pub rec_dia: i32,
  pub rec_hora: String,
  pub rec_observacao: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecorrenteAtualizar {
  pub rec_uuid: String,
  pub cat_uuid: String,
  pub dest_uuid: String,
  pub rec_descricao: String,
  pub rec_valor: i64,
  pub rec_dia: i32,
  pub rec_hora: String,
  pub rec_observacao: Option<String>,
}
