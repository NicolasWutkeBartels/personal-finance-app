export const SITUACAO_ATIVO_UUID = "00000000-0000-0000-0000-000000000001";
export const SITUACAO_INATIVO_UUID = "00000000-0000-0000-0000-000000000002";
export const SITUACAO_EXCLUIDO_UUID = "00000000-0000-0000-0000-000000000003";

export interface Usuario {
  usu_uuid: string;
  sit_uuid: string;
  usu_nome: string;
  usu_email: string | null;
  usu_telefone: string | null;
}

export interface UsuarioAtualizar {
  usu_nome: string;
  usu_email: string | null;
  usu_telefone: string | null;
}

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

export interface DespesaTipo {
  dest_uuid: string;
  sit_uuid: string;
  dest_descricao: string;
}

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

export interface Recorrente {
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

export interface RecorrenteCriar {
  cat_uuid: string;
  dest_uuid: string;
  rec_descricao: string;
  rec_valor: number;
  rec_dia: number;
  rec_hora: string;
  rec_observacao: string | null;
}

export interface RecorrenteAtualizar {
  rec_uuid: string;
  cat_uuid: string;
  dest_uuid: string;
  rec_descricao: string;
  rec_valor: number;
  rec_dia: number;
  rec_hora: string;
  rec_observacao: string | null;
}

const CATEGORY_VISUALS = [
  { icon: "🍽️", color: "#f59e0b" },
  { icon: "🚗", color: "#3b82f6" },
  { icon: "🏠", color: "#8b5cf6" },
  { icon: "🏥", color: "#ef4444" },
  { icon: "🎮", color: "#10b981" },
  { icon: "📚", color: "#14b8a6" },
  { icon: "👕", color: "#ec4899" },
  { icon: "✈️", color: "#0ea5e9" },
  { icon: "🎬", color: "#f97316" },
  { icon: "💰", color: "#6b7280" },
];

function hashValue(text: string) {
  return Array.from(text).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function getCategoryVisual(description: string) {
  const index = hashValue(description) % CATEGORY_VISUALS.length;
  return CATEGORY_VISUALS[index];
}

export function isSituacaoAtivo(situacaoUuid: string) {
  return situacaoUuid === SITUACAO_ATIVO_UUID;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatShortDate(dateStr: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${dateStr}T00:00:00`));
}

export function formatLongDate(dateStr: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateStr}T00:00:00`));
}

export function getMonthOptions(amount = 12) {
  return Array.from({ length: amount }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - index);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      }).format(date),
    };
  });
}
