"use client";
import { useActionState, useEffect } from "react";
import { createStudentAction } from "../../../../app/actions/students";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewStudentPage() {
  const [state, action, pending] = useActionState(createStudentAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && !state.temporaryPassword) {
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
          {state?.temporaryPassword ? (
            <div className="space-y-4">
              <p className="text-sm text-brand-text">Cuenta creada para {state.email}. Comparte esta contraseña temporal con el estudiante; deberá cambiarla al ingresar.</p>
              <div className="bg-surface-1 border border-brand-border rounded-lg p-3">
                <p className="text-xs text-brand-muted mb-1">Contraseña temporal</p>
                <code className="text-sm font-mono text-brand-text select-all break-all">{state.temporaryPassword}</code>
              </div>
              <div className="flex justify-end">
                <Link href="/students"><Button variant="primary">Volver a estudiantes</Button></Link>
              </div>
            </div>
          ) : (
            <form action={action} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Nombre *" name="firstName" placeholder="Nombre" required />
                <Input label="Apellido *" name="lastName" placeholder="Apellido" required />
              </div>
              <Input label="Correo electrónico *" name="email" type="email" placeholder="nombre@email.com" required />
              <Input label="Teléfono" name="phone" placeholder="3000000000" />

              <label className="flex items-start gap-2 text-sm text-brand-text">
                <input type="checkbox" name="generateAccount" value="true" className="mt-0.5" />
                <span>
                  Generar acceso para el estudiante
                  <span className="block text-xs text-brand-muted mt-0.5">Se mostrará una contraseña temporal que deberá cambiar al primer ingreso.</span>
                </span>
              </label>

              {state?.error && <p className="text-danger text-xs">{state.error}</p>}

              <div className="flex justify-end gap-2.5 pt-2">
                <Link href="/students">
                  <Button variant="ghost">Cancelar</Button>
                </Link>
                <Button variant="primary" type="submit" disabled={pending}>
                  {pending ? "Guardando..." : "Guardar estudiante"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
