import React from "react";
import { RotateCcw } from "lucide-react";
import Button from "@/components/molecules/Button";
import { useSyncNewDocentes } from "@/hooks/useEmployee"; // o donde hayas creado el hook

type Props = {
  className?: string;
};
export default function SyncEmployees({ className }: Props) {
  const { mutate: sync, isPending } = useSyncNewDocentes();

  return (
    <Button
      text={isPending ? "Sincronizando..." : "Sincronizar"}
      icon={<RotateCcw size={18} />}
      variant="text-icon"
      className= {className}
      onClick={() => sync()}
      disabled={isPending}
      aria-label="Sincronizar docentes"
    />
  );
}
