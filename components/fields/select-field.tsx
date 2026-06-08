"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  isRequired?: boolean;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

export function SelectField({
  name,
  label,
  placeholder = "Selecione uma opção",
  description,
  isRequired = false,
  className,
  id,
  children,
}: SelectFieldProps) {
  const { control } = useFormContext();
  const fieldId = id || name;

  if (!control) {
    throw new Error(
      "SelectField deve ser utilizado dentro de um FormProvider (Form.Root)."
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
        <div className={cn("space-y-2 flex flex-col w-full", className)}>
          {label && (
            <Label
              htmlFor={fieldId}
              className={cn(fieldState.error && "text-destructive")}
            >
              {label}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}

          <Select
            value={
              field.value !== undefined &&
              field.value !== null &&
              field.value !== ""
                ? String(field.value)
                : undefined
            }
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id={fieldId}
              className={cn(
                "w-full h-8 rounded-lg px-2.5 py-1 text-sm border border-input bg-transparent",
                !field.value && "text-muted-foreground",
                fieldState.invalid && "border-destructive focus-visible:ring-destructive/20"
              )}
              aria-invalid={fieldState.invalid}
              aria-describedby={
                fieldState.error
                  ? `${fieldId}-error`
                  : description
                  ? `${fieldId}-description`
                  : undefined
              }
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>{children}</SelectContent>
          </Select>

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
