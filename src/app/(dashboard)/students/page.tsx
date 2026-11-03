import { Student } from "@/entities/Student";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const AVATAR_COLORS = [
  "bg-teal-bg text-teal", "bg-purple-bg text-purple",
  "bg-warning-bg text-warning", "bg-danger-bg text-danger", "bg-accent-light text-accent"
];

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export default async function StudentsPage() {
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const students = await AppDataSource.getRepository(Student).find({ order: { createdAt: "DESC" } });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[18px] font-medium text-brand-text">Estudiantes</h1>
          <p className="text-[13px] text-brand-muted mt-0.5">{students.length} estudiantes registrados</p>
        </div>
        <Link href="/students/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" /> Nuevo estudiante
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2.5 mb-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-hint" />
          <input
            placeholder="Buscar por nombre o email…"
            className="pl-8 pr-3 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg w-64
                       text-brand-text placeholder:text-brand-hint focus:outline-none focus:border-accent-mid
                       focus:ring-2 focus:ring-accent-light transition-colors"
          />
        </div>
        <select className="text-sm bg-surface-2 border border-brand-border-strong rounded-lg px-2.5 py-1.5 text-brand-muted focus:outline-none focus:border-accent-mid">
          <option>Todos los estados</option>
          <option>Activos</option>
          <option>Inactivos</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-2 border border-brand-border rounded-card overflow-hidden">
        {students.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-brand-muted text-sm mb-4">Sin estudiantes registrados aún</p>
            <Link href="/students/new">
              <Button variant="primary" size="sm"><Plus className="w-4 h-4" /> Agregar primero</Button>
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {["Estudiante", "Email", "Fecha de registro", "Estado", ""].map(h => (
                  <th key={h} className="text-left text-[11px] font-medium uppercase tracking-[0.05em] text-brand-hint px-4 py-2.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {students.map((student, i) => {
                const initials = getInitials(student.name);
                const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <tr key={student.id} className="hover:bg-surface-1 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={"w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 " + color}>
                          {initials}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-brand-text">{student.name}</p>
                          <p className="text-[11px] text-brand-hint">ID: {student.id.slice(0,8)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-brand-muted">{student.email}</td>
                    <td className="px-4 py-3 text-[12px] text-brand-muted">
                      {new Date(student.createdAt).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-4 py-3"><Badge variant="success">Activo</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/students/${student.id}`}>
                          <Button size="sm" variant="ghost">Ver</Button>
                        </Link>
                        <Link href={`/students/${student.id}/edit`}>
                          <Button size="sm" variant="secondary">Editar</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
