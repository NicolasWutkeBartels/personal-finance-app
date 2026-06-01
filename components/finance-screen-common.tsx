"use client";

import { cn } from "@/lib/utils";
import { getCategoryVisual, type Categoria } from "@/lib/finance-demo";

export const EMOJI_OPTIONS = ["🍽️", "🚗", "🏠", "🏥", "🎮", "📚", "👕", "✈️", "🎬", "💰"];
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

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-semibold text-neutral-900">{title}</h2>
        <p className="mt-1 text-neutral-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

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
