import { parse, format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Converte uma string no formato "yyyy-MM-dd" ou um objeto Date para um Date local.
 */
export const parseLocalDate = (
  dateVal: string | Date | undefined | null
): Date | undefined => {
  if (!dateVal) return undefined;
  if (dateVal instanceof Date) return dateVal;

  try {
    if (typeof dateVal === "string" && dateVal.includes("-")) {
      return parse(dateVal, "yyyy-MM-dd", new Date());
    }
  } catch (error) {
    console.error("Erro ao converter data:", error);
  }
  return undefined;
};

/**
 * Formata um objeto Date para uma string no formato "yyyy-MM-dd".
 */
export const formatDateToLocalStr = (date: Date | undefined | null): string => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
};

/**
 * Formata uma data (Date ou string "yyyy-MM-dd") para o formato de exibição "dd/MM/yyyy".
 */
export const formatDisplayDate = (
  dateVal: string | Date | undefined | null
): string => {
  const date = parseLocalDate(dateVal);
  if (!date) return "";
  return format(date, "dd/MM/yyyy", { locale: ptBR });
};
