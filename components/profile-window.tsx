"use client";

import DialogContainer from "@/components/ui/dialog-container";
import { useWindow } from "@/lib/hooks/useWindow";
import ProfileForm from "./profile-form";

export default function ProfileWindow() {
  const { open, onOpenChange, close } = useWindow("perfil");

  return (
    <DialogContainer
      open={open}
      onOpenChange={onOpenChange}
      header="Editar Perfil"
      HeaderIcon="User"
    >
      <ProfileForm onCancel={close} />
    </DialogContainer>
  );
}
