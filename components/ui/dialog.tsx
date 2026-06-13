"use client";

import {
  createContext,
  useState,
  useCallback,
  useContext,
  type ComponentProps,
} from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const DialogContext = createContext<{ open: boolean }>({ open: false });

function Dialog({
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: ComponentProps<typeof DialogPrimitive.Root>) {
  const [openState, setOpenState] = useState(defaultOpen ?? false);
  const open = openProp !== undefined ? openProp : openState;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpenState(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ open }}>
      <DialogPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        data-slot="dialog"
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  ...props
}: ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}: ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}: ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay data-slot="dialog-overlay" asChild {...props}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
        className={cn(
          "fixed inset-0 isolate z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs",
          className,
        )}
      />
    </DialogPrimitive.Overlay>
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  const { open } = useContext(DialogContext);

  return (
    <AnimatePresence>
      {open && (
        <DialogPortal forceMount>
          <DialogOverlay forceMount />
          <DialogPrimitive.Content
            forceMount
            data-slot="dialog-content"
            asChild
            {...props}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: "-50%", y: "-48%" }}
              animate={{
                opacity: 1,
                scale: 1,
                x: "-50%",
                y: "-50%",
                transition: { type: "spring", duration: 0.4, bounce: 0.15 },
              }}
              exit={{
                opacity: 0,
                scale: 0.85,
                x: "-50%",
                y: "-48%",
                transition: { duration: 0.2, ease: "easeInOut" },
              }}
              className={cn(
                "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 outline-none sm:max-w-sm",
                className,
              )}
            >
              {children}
              {showCloseButton && (
                <DialogPrimitive.Close data-slot="dialog-close" asChild>
                  <Button
                    variant="ghost"
                    className="absolute top-2 right-2"
                    size="icon-sm"
                  >
                    <XIcon />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogPrimitive.Close>
              )}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPortal>
      )}
    </AnimatePresence>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
