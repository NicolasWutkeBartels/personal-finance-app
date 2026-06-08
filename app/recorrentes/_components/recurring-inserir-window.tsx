import DialogContainer from "@/components/ui/dialog-container";
import { useWindow } from "@/lib/hooks/useWindow";
import RecurringForm from "./recurring-form";

export default function RecurringInserirWindow() {
  const { open, onOpenChange, close } = useWindow("inserir");

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      header="Nova Despesa Recorrente"
      HeaderIcon="Plus"
    >
      <RecurringForm onCancel={close} />
    </DialogContainer>
  );
}
