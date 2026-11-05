import { Student } from "../../entities/Student";
import { Course } from "../../entities/Course";
import { Enrollment } from "../../entities/Enrollment";
import { Tenant } from "../../entities/Tenant";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Users, BookOpen, ClipboardList, TrendingUp, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { In } from "typeorm";
import { getSessionIdentity } from "@/lib/auth-session";
import { isStudentRole } from "@/lib/roles";

export default async function Home() {
  await headers(); // Force dynamic rendering
  const { AppDataSource } = await import("../../database/data-source");
  const { getCurrentTenantDataSource } = await import("../../database/tenant-data-source");
  const session = await getSessionIdentity();
  const { dataSource, tenantId } = await getCurrentTenantDataSource();
  const tenant = await AppDataSource.getRepository(Tenant).findOneBy({ id: tenantId });
  const isStudent = isStudentRole(session?.role);

  const studentRepo = dataSource.getRepository(Student);
  const courseRepo = dataSource.getRepository(Course);
  const enrollmentRepo = dataSource.getRepository(Enrollment);

  const avatarColors = ["bg-teal-bg text-teal", "bg-purple-bg text-purple", "bg-warning-bg text-warning", "bg-danger-bg text-danger", "bg-accent-light text-accent"];

  if (isStudent && session) {
    const currentStudent = await studentRepo.findOne({
      where: { email: session.email, tenantId: session.tenantId },
    });

    if (!currentStudent) {
      return (
        <div className="p-6">
          <div className="bg-surface-2 border border-brand-border rounded-card p-6 text-center">
            <p className="text-brand-muted text-sm">Todavía no tienes cursos disponibles para ver.</p>
          </div>
        </div>
      );
    }

    const studentEnrollments = await enrollmentRepo.find({
      where: { studentId: currentStudent.id, tenantId: session.tenantId },
      relations: { course: true },
      order: { enrolledAt: "DESC" },
    });

    const studentCourseIds = studentEnrollments.map((enrollment) => enrollment.courseId);
    const classmatesByCourse = new Map<string, { courseTitle: string; students: { id: string; name: string }[] }>();

    for (const courseId of studentCourseIds) {
      const courseEnrollments = await enrollmentRepo.find({
        where: { courseId, tenantId: session.tenantId },
        relations: { student: true, course: true },
        order: { enrolledAt: "DESC" },
      });

      const courseTitle = courseEnrollments[0]?.course?.title ?? "Curso";
      const otherStudents = courseEnrollments
        .filter((enrollment) => enrollment.student && enrollment.studentId !== currentStudent.id)
        .map((enrollment) => ({
          id: enrollment.student.id,
          name: enrollment.student.name,
        }))
        .filter((student, index, list) => list.findIndex((item) => item.id === student.id) === index);

      if (otherStudents.length > 0) {
        classmatesByCourse.set(courseId, {
          courseTitle,
          students: otherStudents,
        });
      }
    }

    const plannedMetrics = [
      { label: "Cursos inscritos", value: studentCourseIds.length, sub: "Activos en mi tenant", subColor: "text-success", icon: BookOpen, iconBg: "bg-accent-light", iconColor: "text-accent" },
      { label: "Compañeros", value: Array.from(classmatesByCourse.values()).reduce((total, item) => total + item.students.length, 0), sub: "En tus cursos", subColor: "text-accent", icon: Users, iconBg: "bg-purple-bg", iconColor: "text-purple" },
    ];

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[18px] font-medium text-brand-text">Mi dashboard</h1>
            <p className="text-[13px] text-brand-muted mt-0.5">Bienvenido, {session.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {plannedMetrics.map((m) => (
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

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="bg-surface-2 border border-brand-border rounded-card overflow-hidden order-1 lg:col-span-2">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <h2 className="text-[14px] font-medium text-brand-text">Compañeros en mi curso</h2>
            </div>

            <div className="divide-y divide-brand-border">
              {classmatesByCourse.size === 0 ? (
                <div className="py-10 text-center text-brand-hint text-sm">Aún no tienes compañeros en tus cursos.</div>
              ) : (
                Array.from(classmatesByCourse.entries()).map(([courseId, group], index) => (
                  <div key={courseId} className="px-5 py-4">
                    <p className="text-[12px] font-medium text-brand-muted mb-3">{group.courseTitle}</p>
                    <div className="space-y-2">
                      {group.students.map((student, studentIndex) => {
                        const initials = student.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
                        const color = avatarColors[(index + studentIndex) % avatarColors.length];

                        return (
                          <div key={student.id} className="flex items-center gap-3 rounded-lg hover:bg-surface-1 transition-colors p-2">
                            <div className={"w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 " + color}>
                              {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] text-brand-text truncate">{student.name}</p>
                            </div>
                            <Badge variant="accent">Inscrito en {group.courseTitle}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 order-2 lg:order-2">
            <div className="bg-surface-2 border border-brand-border rounded-card p-4">
              <h3 className="text-[13px] font-medium text-brand-text mb-3">Info del tenant</h3>
              <div className="space-y-2 text-[12px]">
                <div className="flex items-center justify-between"><span className="text-brand-muted">Tenant</span><span className="text-brand-text">{tenant?.name ?? "Mi academia"}</span></div>
                <div className="flex items-center justify-between"><span className="text-brand-muted">Rol</span><Badge variant="purple">Estudiante</Badge></div>
                <div className="flex items-center justify-between"><span className="text-brand-muted">Estado</span><Badge variant="success">Activo</Badge></div>
              </div>
            </div>

            <div className="bg-surface-2 border border-brand-border rounded-card p-4">
              <h3 className="text-[13px] font-medium text-brand-text mb-3">Acceso rápido</h3>
              <div className="space-y-2">
                <Link href="/courses">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-border hover:bg-surface-1 text-[12px] text-brand-muted hover:text-brand-text transition-colors cursor-pointer">
                    <BookOpen className="w-3.5 h-3.5" /> Mis cursos
                  </div>
                </Link>
                <Link href="/enrollment">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-border hover:bg-surface-1 text-[12px] text-brand-muted hover:text-brand-text transition-colors cursor-pointer">
                    <ClipboardList className="w-3.5 h-3.5" /> Mis inscripciones
                  </div>
                </Link>
                <Link href="/profile">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-border hover:bg-surface-1 text-[12px] text-brand-muted hover:text-brand-text transition-colors cursor-pointer">
                    <Users className="w-3.5 h-3.5" /> Mi perfil
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    { label: "Cursos activos", value: totalCourses, sub: `↑ ${newCoursesThisMonth} nuevos`, subColor: "text-success", icon: BookOpen, iconBg: "bg-teal-bg", iconColor: "text-teal" },
    { label: "Inscripciones", value: totalEnrollments, sub: `↑ ${newEnrollmentsThisWeek} esta semana`, subColor: "text-accent", icon: ClipboardList, iconBg: "bg-purple-bg", iconColor: "text-purple" },
    { label: "Inscripciones del mes", value: newEnrollmentsThisMonth, sub: enrollmentMonthComparison, subColor: enrollmentMonthDelta < 0 ? "text-warning" : "text-success", icon: TrendingUp, iconBg: "bg-warning-bg", iconColor: "text-warning" },
  ];

  return (
    <div className="p-6">
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="bg-surface-2 border border-brand-border rounded-card overflow-hidden order-1 lg:col-span-2">
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
                const initials = e.student.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
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

        <div className="flex flex-col gap-4 order-2 lg:order-2">
          <div className="bg-surface-2 border border-brand-border rounded-card p-4">
            <h3 className="text-[13px] font-medium text-brand-text mb-3">Info del tenant</h3>
            <div className="space-y-2 text-[12px]">
              {[
                { label: "ID", value: tenant?.id ?? "-", mono: true },
                { label: "Schema", value: tenant?.schemaName ?? "-", mono: true },
                { label: "Plan", value: "Pro", badge: "purple" },
                { label: "Estado", value: "Activo", badge: "success" },
              ].map((row) => (
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

          <div className="bg-surface-2 border border-brand-border rounded-card p-4">
            <h3 className="text-[13px] font-medium text-brand-text mb-3">Acceso rápido</h3>
            <div className="space-y-2">
              {[
                { label: "Nuevo estudiante", href: "/students/new", emoji: "➕" },
                { label: "Nuevo curso", href: "/courses/new", emoji: "📚" },
                { label: "Nueva inscripción", href: "/enrollment/new", emoji: "📋" },
                { label: "Nuevo tenant", href: "/tenants/new", emoji: "🏢" },
              ].map((item) => (
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
