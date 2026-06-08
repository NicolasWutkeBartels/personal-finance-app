export const SITUACAO_ATIVO_UUID = "1";
export const SITUACAO_INATIVO_UUID = "2";
export const SITUACAO_EXCLUIDO_UUID = "3";

export interface Situacao {
  sit_uuid: string;
  sit_descricao: string;
}
