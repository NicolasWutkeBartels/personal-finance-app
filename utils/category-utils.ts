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
