import { Course } from "@/entities/Course";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, BookOpen, Users } from "lucide-react";
import Link from "next/link";

const CARD_STYLES = [
  { bg: "bg-accent-light", text: "text-accent", bar: "bg-accent-mid" },
  { bg: "bg-danger-bg",   text: "text-danger",  bar: "bg-purple" },
  { bg: "bg-teal-bg",     text: "text-teal",    bar: "bg-teal" },
  { bg: "bg-warning-bg",  text: "text-warning", bar: "bg-warning" },
  { bg: "bg-purple-bg",   text: "text-purple",  bar: "bg-purple" },
];

export default async function CoursesPage() {
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const courses = await AppDataSource.getRepository(Course).find({ order: { title: "ASC" } });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[18px] font-medium text-brand-text">Cursos</h1>
          <p className="text-[13px] text-brand-muted mt-0.5">{courses.length} cursos en el catálogo</p>
        </div>
        <Link href="/courses/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" /> Nuevo curso
          </Button>
        </Link>
      </div>

      {/* Grid */}
      {courses.length === 0 ? (
        <div className="bg-surface-2 border border-brand-border rounded-card py-16 text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-brand-muted text-sm mb-4">Sin cursos en el catálogo aún</p>
          <Link href="/courses/new">
            <Button variant="primary" size="sm"><Plus className="w-4 h-4" /> Crear primer curso</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {courses.map((course, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length];
            return (
              <div key={course.id} className="bg-surface-2 border border-brand-border rounded-card p-5 hover:border-brand-border-strong transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className={"w-10 h-10 rounded-lg flex items-center justify-center " + style.bg}>
                    <BookOpen className={"w-5 h-5 " + style.text} />
                  </div>
                  <Badge variant="success">Activo</Badge>
                </div>
                <h3 className="text-[14px] font-medium text-brand-text mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-[12px] text-brand-muted line-clamp-2 mb-4">{course.description}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-brand-hint mb-3">
                  <Users className="w-3 h-3" /> 0 / 60 estudiantes
                </div>
                <div className="h-1 bg-brand-border rounded-full mb-4">
                  <div className={"h-full rounded-full " + style.bar} style={{ width: "0%" }} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Link href={`/courses/${course.id}`} className="flex-1">
                    <Button size="sm" variant="ghost" className="w-full justify-center">Ver</Button>
                  </Link>
                  <Link href={`/courses/${course.id}/edit`} className="flex-1">
                    <Button size="sm" variant="secondary" className="w-full justify-center">Editar</Button>
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Add card */}
          <Link href="/courses/new">
            <div className="bg-surface-2 border-2 border-dashed border-brand-border rounded-card p-5
                            flex flex-col items-center justify-center min-h-[200px] cursor-pointer
                            hover:border-accent hover:bg-accent-light/30 transition-colors group">
              <div className="text-3xl text-brand-hint group-hover:text-accent mb-2">+</div>
              <p className="text-[13px] text-brand-hint group-hover:text-accent">Agregar curso</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
