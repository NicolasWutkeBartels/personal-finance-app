import * as Lucide from "lucide-react";

interface LucideIconProps extends Lucide.LucideProps {
  name?: keyof typeof Lucide;
}

export default function LucideIcon({ name, ...props }: LucideIconProps) {
  if (!name) return null;

  const Icon = Lucide[name] as Lucide.LucideIcon;

  return <Icon {...props} />;
}
