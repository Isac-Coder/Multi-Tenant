"use client";
import { useActionState, useEffect } from "react";
import { createStudentAction } from "@/app/actions/students";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewStudentPage() {
  const [state, action, pending] = useActionState(createStudentAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/students");
    }
  }, [state, router]);

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
          <form action={action} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre *" name="firstName" placeholder="Nombre" required />
              <Input label="Apellido *" name="lastName" placeholder="Apellido" required />
            </div>
            <Input label="Correo electrónico *" name="email" type="email" placeholder="nombre@email.com" required />
            <Input label="Teléfono" name="phone" placeholder="3000000000" />

            {state?.error && (
              <p className="text-danger text-xs">{state.error}</p>
            )}

            <div className="flex justify-end gap-2.5 pt-2">
              <Link href="/students">
                <Button variant="ghost">Cancelar</Button>
              </Link>
              <Button variant="primary" type="submit" disabled={pending}>
                {pending ? "Guardando..." : "Guardar estudiante"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
