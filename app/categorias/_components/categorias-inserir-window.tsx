import DialogContainer from "@/components/ui/dialog-container";
import { useWindow } from "@/lib/hooks/useWindow";
import CategoriasForm from "./categorias-form";

export default function CategoriasInserirWindow() {
  const { open, onOpenChange, close } = useWindow("inserir");

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      header="Inserir Categoria"
      HeaderIcon="Plus"
    >
      <CategoriasForm onCancel={close} />
    </DialogContainer>
  );
}
