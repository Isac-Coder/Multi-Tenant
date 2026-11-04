import { Student } from "../../entities/Student";
import { Course } from "../../entities/Course";
import { Enrollment } from "../../entities/Enrollment";
import { Tenant } from "../../entities/Tenant";
import { MetricCard } from "../../components/ui/MetricCard";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Users, BookOpen, ClipboardList, TrendingUp, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

export default async function Home() {
  await headers(); // Force dynamic rendering
  const { AppDataSource } = await import("../../database/data-source");
  const { getCurrentTenantDataSource } = await import("../../database/tenant-data-source");
  const { dataSource, tenantId } = await getCurrentTenantDataSource();
  const tenant = await AppDataSource.getRepository(Tenant).findOneBy({ id: tenantId });

  const studentRepo = dataSource.getRepository(Student);
  const courseRepo = dataSource.getRepository(Course);
  const enrollmentRepo = dataSource.getRepository(Enrollment);
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalStudents,
    totalCourses,
    totalEnrollments,
    recentEnrollments,
    activeStudentsThisMonth,
    newCoursesThisMonth,
    newEnrollmentsThisWeek,
    newEnrollmentsThisMonth,
    newEnrollmentsLastMonth
  ] = await Promise.all([
    studentRepo.count(),
    courseRepo.count(),
    enrollmentRepo.count(),
    enrollmentRepo.find({
      relations: { student: true, course: true },
      order: { enrolledAt: "DESC" },
      take: 5,
    }),
    studentRepo.createQueryBuilder("student")
      .where("student.createdAt >= :date", { date: new Date(new Date().setDate(new Date().getDate() - 30)) })
      .getCount(),
    courseRepo.createQueryBuilder("course")
      .where("course.createdAt >= :date", { date: new Date(new Date().setDate(new Date().getDate() - 30)) })
      .getCount(),
    enrollmentRepo.createQueryBuilder("enrollment")
      .where("enrollment.enrolledAt >= :date", { date: new Date(new Date().setDate(new Date().getDate() - 7)) })
      .getCount(),
    enrollmentRepo.createQueryBuilder("enrollment")
      .where("enrollment.enrolledAt >= :start", { start: currentMonthStart })
      .getCount(),
    enrollmentRepo.createQueryBuilder("enrollment")
      .where("enrollment.enrolledAt >= :start", { start: previousMonthStart })
      .andWhere("enrollment.enrolledAt < :end", { end: currentMonthStart })
      .getCount(),
  ]);

  const enrollmentMonthDelta = newEnrollmentsThisMonth - newEnrollmentsLastMonth;
  const enrollmentMonthComparison = enrollmentMonthDelta > 0
    ? `↑ ${enrollmentMonthDelta} vs mes anterior`
    : enrollmentMonthDelta < 0
      ? `↓ ${Math.abs(enrollmentMonthDelta)} vs mes anterior`
      : "Sin cambios vs mes anterior";

  const metrics = [
    { label: "Estudiantes activos", value: totalStudents, sub: `↑ ${activeStudentsThisMonth} este mes`, subColor: "text-success", icon: Users, iconBg: "bg-accent-light", iconColor: "text-accent" },
    { label: "Cursos activos",      value: totalCourses,  sub: `↑ ${newCoursesThisMonth} nuevos`,    subColor: "text-success", icon: BookOpen, iconBg: "bg-teal-bg", iconColor: "text-teal" },
    { label: "Inscripciones",       value: totalEnrollments, sub: `↑ ${newEnrollmentsThisWeek} esta semana`, subColor: "text-accent", icon: ClipboardList, iconBg: "bg-purple-bg", iconColor: "text-purple" },
    { label: "Inscripciones del mes", value: newEnrollmentsThisMonth, sub: enrollmentMonthComparison, subColor: enrollmentMonthDelta < 0 ? "text-warning" : "text-success", icon: TrendingUp, iconBg: "bg-warning-bg", iconColor: "text-warning" },
  ];

  const avatarColors = ["bg-teal-bg text-teal", "bg-purple-bg text-purple", "bg-warning-bg text-warning", "bg-danger-bg text-danger", "bg-accent-light text-accent"];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[18px] font-medium text-brand-text">Dashboard</h1>
          <p className="text-[13px] text-brand-muted mt-0.5">Resumen de {tenant?.name ?? "tu academia"}</p>
        </div>
        <Link href="/students/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" /> Nuevo estudiante
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-surface-1 border border-brand-border rounded-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-brand-muted">{m.label}</p>
              <div className={"w-8 h-8 rounded-lg flex items-center justify-center " + m.iconBg}>
                <m.icon className={"w-4 h-4 " + m.iconColor} />
              </div>
            </div>
            <p className="text-[22px] font-medium text-brand-text">{m.value}</p>
            <p className={"text-[11px] mt-0.5 " + m.subColor}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent enrollments */}
        <div className="col-span-2 bg-surface-2 border border-brand-border rounded-card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <h2 className="text-[14px] font-medium text-brand-text">Inscripciones recientes</h2>
            <Link href="/enrollment">
              <Button variant="ghost" size="sm">
                Ver todas <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-brand-border">
            {recentEnrollments.length === 0 ? (
              <div className="py-10 text-center text-brand-hint text-sm">Sin inscripciones aún</div>
            ) : (
              recentEnrollments.map((e, i) => {
                const initials = e.student.name.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase();
                const color = avatarColors[i % avatarColors.length];
                return (
                  <div key={e.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface-1 transition-colors">
                    <div className={"w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 " + color}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-brand-text truncate">{e.student.name}</p>
                      <p className="text-[11px] text-brand-hint truncate">{e.course.title}</p>
                    </div>
                    <span className="text-[11px] text-brand-hint whitespace-nowrap">{new Date(e.enrolledAt).toLocaleDateString("es-CO")}</span>
                    <Badge variant="accent">Activa</Badge>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick info */}
        <div className="flex flex-col gap-4">
          {/* Tenant info */}
          <div className="bg-surface-2 border border-brand-border rounded-card p-4">
            <h3 className="text-[13px] font-medium text-brand-text mb-3">Info del tenant</h3>
            <div className="space-y-2 text-[12px]">
              {[
                { label: "ID",     value: "ten_4f29b1", mono: true },
                { label: "Schema", value: "prestige",   mono: true },
                { label: "Plan",   value: "Pro",        badge: "purple" },
                { label: "Estado", value: "Activo",     badge: "success" },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-brand-muted">{row.label}</span>
                  {row.mono
                    ? <code className="text-[11px] bg-surface-1 px-1.5 py-0.5 rounded font-mono text-brand-muted">{row.value}</code>
                    : row.badge
                      ? <Badge variant={row.badge as any}>{row.value}</Badge>
                      : <span className="text-brand-text">{row.value}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Quick access */}
          <div className="bg-surface-2 border border-brand-border rounded-card p-4">
            <h3 className="text-[13px] font-medium text-brand-text mb-3">Acceso rápido</h3>
            <div className="space-y-2">
              {[
                { label: "Nuevo estudiante",   href: "/students/new",  emoji: "➕" },
                { label: "Nuevo curso",        href: "/courses/new",   emoji: "📚" },
                { label: "Nueva inscripción",  href: "/enrollment/new",emoji: "📋" },
                { label: "Nuevo tenant",       href: "/tenants/new",   emoji: "🏢" },
              ].map(item => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-border hover:bg-surface-1 text-[12px] text-brand-muted hover:text-brand-text transition-colors cursor-pointer">
                    <span>{item.emoji}</span>
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
