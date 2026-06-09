export function assertRequired(value: string | null | undefined, label: string) {
  if (!value || !value.trim()) {
    throw new Error(`${label} é obrigatório.`);
  }
}

export function assertPositiveAmount(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} deve ser maior que zero.`);
  }
}

export function assertDay(value: number) {
  if (!Number.isInteger(value) || value < 1 || value > 31) {
    throw new Error("O dia da recorrência deve estar entre 1 e 31.");
  }
}
