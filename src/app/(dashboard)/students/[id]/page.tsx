import { Student } from "@/entities/Student";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const student = await AppDataSource.getRepository(Student).findOneBy({ id });

  if (!student) return (
    <div className="p-6 text-center">
      <p className="text-brand-muted">Estudiante no encontrado</p>
      <Link href="/students"><Button variant="ghost" className="mt-3">← Volver</Button></Link>
    </div>
  );

  const initials = student.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/students">
          <button className="flex items-center gap-1.5 text-[13px] text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-4 h-4" /> Estudiantes
          </button>
        </Link>
        <span className="text-brand-border">/</span>
        <h1 className="text-[18px] font-medium text-brand-text">Detalle del estudiante</h1>
      </div>

      <div className="max-w-lg space-y-4">
        {/* Profile card */}
        <div className="bg-surface-2 border border-brand-border rounded-card p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-teal-bg text-teal flex items-center justify-center text-xl font-semibold">
              {initials}
            </div>
            <div>
              <h2 className="text-[16px] font-medium text-brand-text">{student.name}</h2>
              <p className="text-[13px] text-brand-muted">{student.email}</p>
            </div>
            <div className="ml-auto">
              <Badge variant="success">Activo</Badge>
            </div>
          </div>

          <div className="space-y-3 border-t border-brand-border pt-4">
            {[
              { label: "ID del estudiante", value: student.id, mono: true },
              { label: "Correo electrónico", value: student.email },
              { label: "Fecha de registro", value: new Date(student.createdAt).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }) },
            ].map(row => (
              <div key={row.label}>
                <p className="text-[11px] font-medium text-brand-muted mb-0.5">{row.label}</p>
                {row.mono
                  ? <code className="text-[12px] bg-surface-1 px-2 py-1 rounded font-mono text-brand-muted block">{row.value}</code>
                  : <p className="text-[13px] text-brand-text">{row.value}</p>
                }
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/students/${id}/edit`}>
            <Button variant="primary">Editar estudiante</Button>
          </Link>
          <Link href="/students">
            <Button variant="secondary">Volver al listado</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
