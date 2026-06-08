import DialogContainer from "@/components/ui/dialog-container";
import { useWindow } from "@/lib/hooks/useWindow";
import ExpensesForm from "./expenses-form";

export default function ExpensesInserirWindow() {
  const { open, onOpenChange, close } = useWindow("inserir");

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      header="Nova Despesa"
      HeaderIcon="Plus"
    >
      <ExpensesForm onCancel={close} />
    </DialogContainer>
  );
}
