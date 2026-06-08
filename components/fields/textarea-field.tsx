"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface TextareaFieldProps
  extends Omit<React.ComponentProps<typeof Textarea>, "name"> {
  name: string;
  label?: string;
  description?: string;
  isRequired?: boolean;
}

export function TextareaField({
  name,
  label,
  description,
  isRequired = false,
  className,
  id,
  ...props
}: TextareaFieldProps) {
  const { control } = useFormContext();
  const fieldId = id || name;

  if (!control) {
    throw new Error(
      "TextareaField deve ser utilizado dentro de um FormProvider (Form.Root)."
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: isRequired ? "Este campo é obrigatório" : false,
      }}
      render={({ field, fieldState }) => (
        <div className={cn("space-y-2", className)}>
          {label && (
            <Label
              htmlFor={fieldId}
              className={cn(fieldState.error && "text-destructive")}
            >
              {label}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}

          <Textarea
            id={fieldId}
            aria-invalid={fieldState.invalid}
            aria-describedby={
              fieldState.error
                ? `${fieldId}-error`
                : description
                ? `${fieldId}-description`
                : undefined
            }
            {...field}
            {...props}
            value={field.value ?? ""}
          />

          {description && !fieldState.error && (
            <p
              id={`${fieldId}-description`}
              className="text-[0.8rem] text-muted-foreground"
            >
              {description}
            </p>
          )}

          {fieldState.error && (
            <p
              id={`${fieldId}-error`}
              className="text-[0.8rem] font-medium text-destructive"
            >
              {fieldState.error.message || "Campo inválido"}
            </p>
          )}
        </div>
      )}
    />
  );
}
