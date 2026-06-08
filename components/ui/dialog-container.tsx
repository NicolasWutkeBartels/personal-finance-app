import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { PropsWithChildren } from "react";
import * as Lucide from "lucide-react";
import LucideIcon from "./icon";

type DialogContainerProps = PropsWithChildren & {
  open: boolean;
  defaultOpen?: boolean;
  onOpenChange(open: boolean): void;
  header?: string;
  HeaderIcon?: keyof typeof Lucide;
  className?: string;
};

export default function DialogContainer({
  open,
  onOpenChange,
  defaultOpen,
  className,
  header,
  HeaderIcon,
  children,
}: DialogContainerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <LucideIcon name={HeaderIcon} />{" "}
            <span className="text-lg">{header}</span>
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
