import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const Navbar = () => (
  <nav className="bg-surface-2 border-b border-brand-border px-6 h-13 flex items-center justify-between sticky top-0 z-50">
    <Link href="/" className="flex items-center gap-2 font-semibold text-[15px] text-brand-text">
      <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
        <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-[2px] bg-white opacity-90 w-1.5 h-1.5" />
          ))}
        </div>
      </div>
      EduTenant
    </Link>
    <div className="flex gap-4">
      <Link href="/students" className="text-sm text-brand-muted hover:text-accent">Estudiantes</Link>
      <Link href="/courses" className="text-sm text-brand-muted hover:text-accent">Cursos</Link>
      <Link href="/enrollments" className="text-sm text-brand-muted hover:text-accent">Matrículas</Link>
      <Link href="/tenants" className="text-sm text-brand-muted hover:text-accent">Tenants</Link>
    </div>
    <div className="flex gap-2">
      <Link href="/profile">
        <Button variant="ghost">Perfil</Button>
      </Link>
    </div>
  </nav>
);
