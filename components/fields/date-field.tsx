"use client";

import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  parseLocalDate,
  formatDateToLocalStr,
  formatDisplayDate,
} from "@/utils/date-utils";

export interface DateFieldProps {
  name: string;
  label?: string;
  description?: string;
  isRequired?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
  disabledDays?: React.ComponentProps<typeof Calendar>["disabled"];
}

export function DateField({
  name,
  label,
  description,
  isRequired = false,
  className,
  id,
  placeholder = "Selecione uma data",
  disabledDays,
}: DateFieldProps) {
  const [open, setOpen] = React.useState(false);
  const { control } = useFormContext();
  const fieldId = id || name;

  if (!control) {
    throw new Error(
      "DateField deve ser utilizado dentro de um FormProvider (Form.Root).",
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: isRequired ? "Este campo é obrigatório" : false,
      }}
      render={({ field, fieldState }) => {
        const selectedDate = parseLocalDate(field.value);

        return (
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

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id={fieldId}
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-left font-normal h-8 rounded-lg px-2.5 py-1 text-sm border border-input bg-transparent",
                    !field.value && "text-muted-foreground",
                    fieldState.invalid &&
                      "border-destructive focus-visible:ring-destructive/20",
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
                  {field.value ? (
                    formatDisplayDate(field.value)
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    field.onChange(date ? formatDateToLocalStr(date) : null);
                    setOpen(false);
                  }}
                  disabled={disabledDays}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>

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
