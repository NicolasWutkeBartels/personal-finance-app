"use client";

import * as React from "react";
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type FormProps<TFieldValues extends FieldValues> =
  UseFormReturn<TFieldValues> & {
    children: React.ReactNode;
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: any) => void;
  };

type FormGroupProps = React.HTMLAttributes<HTMLDivElement>;

type FormFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  cancelLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
};

function FormRoot<TFieldValues extends FieldValues>({
  children,
  className,
  onSubmit,
  ...methods
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...methods}>
      <form
        className={cn("space-y-4", className)}
        onSubmit={methods.handleSubmit(onSubmit)}
        {...methods}
      >
        {children}
      </form>
    </FormProvider>
  );
}

function FormGroup({ className, ...props }: FormGroupProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)} {...props} />
  );
}

function FormFooter({
  cancelLabel = "Cancelar",
  className,
  isSubmitting,
  onCancel,
  submitDisabled,
  submitLabel = "Salvar",
  ...props
}: FormFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="flex-1"
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        disabled={submitDisabled || isSubmitting}
        className="flex-1"
      >
        {submitLabel}
      </Button>
    </div>
  );
}

export const Form = {
  Root: FormRoot,
  Group: FormGroup,
  Footer: FormFooter,
};
