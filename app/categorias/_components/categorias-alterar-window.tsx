import DialogContainer from "@/components/ui/dialog-container";
import { useWindow } from "@/lib/hooks/useWindow";
import CategoriasForm from "./categorias-form";

export default function CategoriasAlterarWindow() {
  const { open, onOpenChange, value, close } = useWindow("alterar");

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      header="Alterar Categoria"
      HeaderIcon="Pencil"
    >
      <CategoriasForm value={value} onCancel={close} />
    </DialogContainer>
  );
}
