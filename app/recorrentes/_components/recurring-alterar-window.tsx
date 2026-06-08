import DialogContainer from "@/components/ui/dialog-container";
import { useWindow } from "@/lib/hooks/useWindow";
import RecurringForm from "./recurring-form";

export default function RecurringAlterarWindow() {
  const { open, onOpenChange, value, close } = useWindow("alterar");

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      header="Editar Despesa Recorrente"
      HeaderIcon="Pencil"
    >
      <RecurringForm value={value} onCancel={close} />
    </DialogContainer>
  );
}
