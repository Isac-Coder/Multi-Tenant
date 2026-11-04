import Link from "next/link";
import { Button } from "../components/ui/Button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-8">
      <div className="bg-surface-2 border border-brand-border rounded-card p-12 w-full max-w-md text-center shadow-sm">
        {/* Logo */}
        <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mx-auto mb-6">
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-[2px] bg-white opacity-90 w-1.5 h-1.5" />
            ))}
          </div>
        </div>

        <h1 className="text-[64px] font-semibold text-accent leading-none mb-3">404</h1>
        <h2 className="text-[20px] font-medium text-brand-text mb-2">Página no encontrada</h2>
        <p className="text-[13px] text-brand-muted mb-8 leading-relaxed">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex justify-center gap-2">
          <Link href="/">
            <Button variant="primary">
              <Home className="w-4 h-4" /> Ir al dashboard
            </Button>
          </Link>
          <Link href="javascript:history.back()">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4" /> Volver
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
