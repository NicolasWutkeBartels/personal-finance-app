"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface CurrencyFieldProps
  extends Omit<React.ComponentProps<typeof Input>, "name" | "type" | "onChange" | "value"> {
  name: string;
  label?: string;
  description?: string;
  isRequired?: boolean;
  min?: number;
  max?: number;
}

const formatBRL = (value: number | undefined | null) => {
  if (value === undefined || value === null) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const parseBRLToNumber = (valueStr: string): number | null => {
  const digits = valueStr.replace(/\D/g, "");
  if (!digits) return null;
  return Number(digits) / 100;
};

export function CurrencyField({
  name,
  label,
  description,
  isRequired = false,
  className,
  id,
  min,
  max,
  ...props
}: CurrencyFieldProps) {
  const { control } = useFormContext();
  const fieldId = id || name;

  if (!control) {
    throw new Error(
      "CurrencyField deve ser utilizado dentro de um FormProvider (Form.Root)."
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: isRequired ? "Este campo é obrigatório" : false,
        min: min !== undefined ? { value: min, message: `O valor mínimo é ${formatBRL(min)}` } : undefined,
        max: max !== undefined ? { value: max, message: `O valor máximo é ${formatBRL(max)}` } : undefined,
      }}
      render={({ field, fieldState }) => {
        const displayValue = formatBRL(field.value);

        return (
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
              type="text"
              inputMode="numeric"
              placeholder="R$ 0,00"
              aria-invalid={fieldState.invalid}
              aria-describedby={
                fieldState.error
                  ? `${fieldId}-error`
                  : description
                  ? `${fieldId}-description`
                  : undefined
              }
              {...props}
              value={displayValue}
              onChange={(e) => {
                const numericValue = parseBRLToNumber(e.target.value);
                field.onChange(numericValue);
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
        );
      }}
    />
  );
}
