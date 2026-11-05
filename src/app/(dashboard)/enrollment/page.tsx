import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Plus, CheckCircle, ArrowRight, Info, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Enrollment } from "../../../entities/Enrollment";
import { Student } from "../../../entities/Student";
import { getSessionIdentity } from "@/lib/auth-session";
import { isStudentRole } from "@/lib/roles";

const AVATAR_COLORS = [
  "bg-teal-bg text-teal","bg-purple-bg text-purple",
  "bg-warning-bg text-warning","bg-danger-bg text-danger","bg-accent-light text-accent"
];

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
}

export const dynamic = "force-dynamic";

export default async function EnrollmentsPage() {
  const { getCurrentTenantDataSource } = await import("../../../database/tenant-data-source");
  const { dataSource: AppDataSource } = await getCurrentTenantDataSource();
  const session = await getSessionIdentity();
  const isStudent = isStudentRole(session?.role);

  let enrollments: Enrollment[] = [];

  if (isStudent && session) {
    const student = await AppDataSource.getRepository(Student).findOne({
      where: { email: session.email, tenantId: session.tenantId },
    });

    if (student) {
      enrollments = await AppDataSource.getRepository(Enrollment).find({
        where: { studentId: student.id, tenantId: session.tenantId },
        relations: { student: true, course: true },
        order: { enrolledAt: "DESC" },
      });
    }
  } else {
    enrollments = await AppDataSource.getRepository(Enrollment).find({
      relations: { student: true, course: true },
      order: { enrolledAt: "DESC" },
    });
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[18px] font-medium text-brand-text">{isStudent ? "Mis inscripciones" : "Inscripciones"}</h1>
          <p className="text-[13px] text-brand-muted mt-0.5">
            {isStudent ? `${enrollments.length} inscripciones activas` : `${enrollments.length} inscripciones registradas`}
          </p>
        </div>
        {!isStudent && (
          <Link href="/enrollment/new">
            <Button variant="primary">
              <Plus className="w-4 h-4" /> Nueva inscripción
            </Button>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { label: `Todas (${enrollments.length})`, active: true },
          { label: "Activas", active: false },
          { label: "Completadas", active: false },
        ].map(tab => (
          <button key={tab.label}
            className={"px-3 py-1.5 text-[12px] rounded-full border transition-colors " +
              (tab.active
                ? "bg-accent-light text-accent border-accent/20 font-medium"
                : "bg-surface-2 text-brand-muted border-brand-border hover:bg-surface-1")}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-2 border border-brand-border rounded-card overflow-hidden mb-4">
        {enrollments.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList className="w-10 h-10 text-brand-hint mx-auto mb-3 opacity-40" />
            <p className="text-brand-muted text-sm mb-4">
              {isStudent ? "Todavía no tienes inscripciones" : "Sin inscripciones registradas aún"}
            </p>
            {!isStudent && (
              <Link href="/enrollment/new">
                <Button variant="primary" size="sm"><Plus className="w-4 h-4" /> Primera inscripción</Button>
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {["Idempotency-Key","Estudiante","Curso","Fecha","Estado"].map(h => (
                  <th key={h} className="text-left text-[11px] font-medium uppercase tracking-[0.05em] text-brand-hint px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {enrollments.map((e, i) => {
                const initials = getInitials(e.student.name);
                const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const shortKey = "idk_" + e.id.replace(/-/g,"").slice(0,7);
                return (
                  <tr key={e.id} className="hover:bg-surface-1 transition-colors">
                    <td className="px-4 py-3">
                      <code className="text-[11px] bg-surface-1 border border-brand-border px-1.5 py-0.5 rounded font-mono text-brand-muted">
                        {shortKey}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={"w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 " + color}>
                          {initials}
                        </div>
                        <span className="text-[13px] text-brand-text">{e.student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-brand-muted">{e.course.title}</td>
                    <td className="px-4 py-3 text-[12px] text-brand-muted">
                      {new Date(e.enrolledAt).toLocaleDateString("es-CO")}
                    </td>
                    <td className="px-4 py-3"><Badge variant="accent">Activa</Badge></td>
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
