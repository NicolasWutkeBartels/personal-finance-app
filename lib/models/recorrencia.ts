export interface Recorrencia {
  rec_uuid: string;
  usu_uuid: string;
  sit_uuid: string;
  cat_uuid: string;
  dest_uuid: string;
  rec_descricao: string;
  rec_valor: number;
  rec_dia: number;
  rec_hora: string;
  rec_observacao: string | null;
}

export interface RecorrenciaCriar {
  cat_uuid: string;
  dest_uuid: string;
  rec_descricao: string;
  rec_valor: number;
  rec_dia: number;
  rec_hora: string;
  rec_observacao: string | null;
}

export interface RecorrenciaAtualizar {
  rec_uuid: string;
  cat_uuid: string;
  dest_uuid: string;
  rec_descricao: string;
  rec_valor: number;
  rec_dia: number;
  rec_hora: string;
  rec_observacao: string | null;
}
