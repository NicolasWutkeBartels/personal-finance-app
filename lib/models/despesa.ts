export interface Despesa {
  des_uuid: string;
  usu_uuid: string;
  sit_uuid: string;
  cat_uuid: string;
  dest_uuid: string;
  des_descricao: string;
  des_valor: number;
  des_observacao: string | null;
  des_data: string;
  des_hora: string;
}

export interface DespesaCriar {
  cat_uuid: string;
  dest_uuid: string;
  des_descricao: string;
  des_valor: number;
  des_observacao: string | null;
  des_data: string;
  des_hora: string;
}

export interface DespesaAtualizar {
  des_uuid: string;
  cat_uuid: string;
  dest_uuid: string;
  des_descricao: string;
  des_valor: number;
  des_observacao: string | null;
  des_data: string;
  des_hora: string;
}
