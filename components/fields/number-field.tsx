"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface NumberFieldProps
  extends Omit<React.ComponentProps<typeof Input>, "name" | "type" | "onChange"> {
  name: string;
  label?: string;
  description?: string;
  isRequired?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberField({
  name,
  label,
  description,
  isRequired = false,
  className,
  id,
  min,
  max,
  step,
  ...props
}: NumberFieldProps) {
  const { control } = useFormContext();
  const fieldId = id || name;

  if (!control) {
    throw new Error(
      "NumberField deve ser utilizado dentro de um FormProvider (Form.Root)."
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: isRequired ? "Este campo é obrigatório" : false,
        min: min !== undefined ? { value: min, message: `O valor mínimo é ${min}` } : undefined,
        max: max !== undefined ? { value: max, message: `O valor máximo é ${max}` } : undefined,
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

          <Input
            id={fieldId}
            type="number"
            min={min}
            max={max}
            step={step}
            aria-invalid={fieldState.invalid}
            aria-describedby={
              fieldState.error
                ? `${fieldId}-error`
                : description
                ? `${fieldId}-description`
                : undefined
            }
            {...props}
            value={field.value ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              field.onChange(val === "" ? null : Number(val));
            }}
            onBlur={field.onBlur}
            ref={field.ref}
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
