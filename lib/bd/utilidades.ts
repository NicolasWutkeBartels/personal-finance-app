import { SITUACAO_ATIVO_UUID } from "@/lib/models/situacao";

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

export function hashText(text: string) {
  return Array.from(text).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function getCategoryVisual(description: string) {
  const index = hashText(description) % CATEGORY_VISUALS.length;
  return CATEGORY_VISUALS[index];
}

export function isActiveSituation(situationUuid: string) {
  return situationUuid === SITUACAO_ATIVO_UUID;
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

export function toCents(value: number) {
  return Math.round(value * 100);
}

export function fromCents(value: number | null | undefined) {
  return Number(value ?? 0) / 100;
}
