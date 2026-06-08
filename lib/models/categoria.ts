export interface Categoria {
  cat_uuid: string;
  usu_uuid: string;
  sit_uuid: string;
  cat_descricao: string;
}

export interface CategoriaCriar {
  cat_descricao: string;
}

export interface CategoriaAtualizar {
  cat_uuid: string;
  cat_descricao: string;
}
