"use client";
import { useActionState, useEffect } from "react";
import { createCourseAction } from "../../../../app/actions/courses";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewCoursePage() {
  const [state, action, pending] = useActionState(createCourseAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/courses");
    }
  }, [state, router]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/courses">
          <button className="flex items-center gap-1.5 text-[13px] text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </Link>
        <span className="text-brand-border">/</span>
        <h1 className="text-[18px] font-medium text-brand-text">Nuevo curso</h1>
      </div>

      <div className="max-w-lg">
        <div className="bg-surface-2 border border-brand-border rounded-card p-6 shadow-sm">
          <h2 className="text-[14px] font-medium text-brand-text mb-4">Detalles del curso</h2>
          <form action={action} className="space-y-4">
            <Input label="Título del curso *" name="title" placeholder="Ej. Inglés B2 — Upper Intermediate" required />

            <div>
              <label className="text-xs font-medium text-brand-muted block mb-1">Descripción *</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe los objetivos y contenido del curso…"
                className="w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                           text-brand-text placeholder:text-brand-hint resize-none
                           focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light transition-colors"
                required
              />
            </div>

            <Input label="Capacidad máxima" name="capacity" type="number" min="1" defaultValue="60" required />

            {state?.error && (
              <p className="text-danger text-xs">{state.error}</p>
            )}

            <div className="flex justify-end gap-2.5 pt-2">
              <Link href="/courses">
                <Button variant="ghost">Cancelar</Button>
              </Link>
              <Button variant="primary" type="submit" disabled={pending}>
                {pending ? "Guardando..." : "Guardar curso"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
