"use client";

import { cn } from "@/lib/utils";
import { getCategoryVisual } from "@/lib/bd/utilidades";
import type { Categoria } from "@/lib/models/categoria";

export const EMOJI_OPTIONS = [
  "🍽️",
  "🚗",
  "🏠",
  "🏥",
  "🎮",
  "📚",
  "👕",
  "✈️",
  "🎬",
  "💰",
];
export const COLOR_OPTIONS = [
  "#ef4444",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

export function CategorySwatch({
  category,
  className,
}: {
  category?: Categoria;
  className?: string;
}) {
  const visual = getCategoryVisual(category?.cat_descricao ?? "");

  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-lg text-2xl",
        className,
      )}
      style={{ backgroundColor: `${visual.color}20` }}
    >
      {visual.icon}
    </div>
  );
}
