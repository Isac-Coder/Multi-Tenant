import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Key } from "lucide-react";
import Link from "next/link";

export default function NewStudentPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/students">
          <button className="flex items-center gap-1.5 text-[13px] text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </Link>
        <span className="text-brand-border">/</span>
        <h1 className="text-[18px] font-medium text-brand-text">Nuevo estudiante</h1>
      </div>

      <div className="max-w-lg">
        <div className="bg-surface-2 border border-brand-border rounded-card p-6 shadow-sm">
          <h2 className="text-[14px] font-medium text-brand-text mb-4">Datos del estudiante</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre *" name="firstName" placeholder="Nombre" required />
              <Input label="Apellido *" name="lastName" placeholder="Apellido" required />
            </div>
            <Input label="Correo electrónico *" name="email" type="email" placeholder="nombre@email.com" required />
            <Input label="Teléfono" name="phone" placeholder="+57 300 000 0000" />

            <div className="flex items-start gap-2 bg-accent-light text-accent text-xs p-2.5 rounded-lg border-l-[3px] border-accent-mid">
              <Key className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              Idempotency-Key generada automáticamente. Doble envío no crea duplicados.
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Link href="/students">
                <Button variant="ghost">Cancelar</Button>
              </Link>
              <Button variant="primary" type="submit">Guardar estudiante</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
