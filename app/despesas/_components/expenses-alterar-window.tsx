import DialogContainer from "@/components/ui/dialog-container";
import { useWindow } from "@/lib/hooks/useWindow";
import ExpensesForm from "./expenses-form";

export default function ExpensesAlterarWindow() {
  const { open, onOpenChange, value, close } = useWindow("alterar");

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      header="Editar Despesa"
      HeaderIcon="Pencil"
    >
      <ExpensesForm value={value} onCancel={close} />
    </DialogContainer>
  );
}
