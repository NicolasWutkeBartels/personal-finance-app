import { PropsWithChildren } from "react";

function Root({ children }: PropsWithChildren) {
  return (
    <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
      {children}
    </div>
  );
}

export function Title({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-muted-foreground">{description}</p>
    </div>
  );
}

export function Action({ children }: PropsWithChildren) {
  return <div className="items-center">{children}</div>;
}

export const SectionHeader = {
  Root,
  Title,
  Action,
};
