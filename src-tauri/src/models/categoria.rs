use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Categoria {
  pub cat_uuid: String,
  pub usu_uuid: String,
  pub sit_uuid: String,
  pub cat_descricao: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoriaCriar {
  pub cat_descricao: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoriaAtualizar {
  pub cat_uuid: String,
  pub cat_descricao: String,
}
