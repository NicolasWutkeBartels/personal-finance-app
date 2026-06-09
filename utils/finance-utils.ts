export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function toCents(value: number) {
  return Math.round(value * 100);
}

export function fromCents(value: number | null | undefined) {
  return Number(value ?? 0) / 100;
}
