import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const Navbar = () => (
  <nav className="bg-surface-2 border-b border-brand-border px-6 h-[52px] flex items-center justify-between sticky top-0 z-50">
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
    <div className="flex gap-2">
      <Link href="/login">
        <Button variant="ghost">Iniciar sesión</Button>
      </Link>
      <Link href="/register">
        <Button variant="primary">Crear cuenta</Button>
      </Link>
    </div>
  </nav>
);
