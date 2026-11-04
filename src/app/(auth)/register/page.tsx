import Link from "next/link";
import { Key, Building2, MapPin } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { redirect } from "next/navigation";
import { getPendingSignup } from "@/lib/auth-session";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ name?: string; email?: string }> }) {
  const { name, email } = await searchParams;
  const pendingSignup = await getPendingSignup();
  if (!pendingSignup || !name || !email || name !== pendingSignup.name || email !== pendingSignup.email) redirect("/signup");

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-6">
      <div className="w-[480px]">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mx-auto mb-2.5">
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-[2px] bg-white opacity-90 w-1.5 h-1.5" />
              ))}
            </div>
          </div>
          <h1 className="text-[17px] font-semibold text-brand-text">EduTenant</h1>
          <p className="text-xs text-brand-muted mt-0.5">Crea tu academia en minutos</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-start mb-6">
          {[
            { label: "Cuenta",   status: "done" },
            { label: "Academia",  status: "active" },
            { label: "Confirmar", status: "pending" },
          ].map((step, i, arr) => (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              {i < arr.length - 1 && (
                <div className={"absolute top-3.5 left-1/2 w-full h-px z-0 " + (step.status === "done" ? "bg-accent" : "bg-brand-border")} />
              )}
              <div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold z-10 relative " +
                (step.status === "done" ? "bg-accent text-white" :
                 step.status === "active" ? "bg-accent-mid text-white ring-2 ring-accent" :
                 "bg-surface-1 text-brand-hint border border-brand-border")}>
                {step.status === "done" ? "✓" : i + 1}
              </div>
              <span className={"text-[11px] mt-1.5 " + (step.status === "active" ? "text-accent font-medium" : "text-brand-muted")}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-surface-2 border border-brand-border rounded-card p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-brand-text mb-1">Cuéntanos sobre tu academia</h2>
          <p className="text-[13px] text-brand-muted mb-5">Esto creará tu tenant con datos completamente aislados.</p>

          <form className="space-y-4" action="/register/confirm" method="get">
            <input type="hidden" name="name" value={name} />
            <input type="hidden" name="email" value={email} />
            <div>
              <label className="text-xs font-medium text-brand-muted block mb-1">
                <Building2 className="w-3 h-3 inline mr-1" />
                Nombre de la academia *
              </label>
              <input
                name="academyName"
                placeholder="Ej. Instituto de Idiomas Prestige"
                required
                className="w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                           text-brand-text placeholder:text-brand-hint
                           focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-brand-muted block mb-1">Slug único (subdominio) *</label>
                <input
                  name="slug"
                  placeholder="mi-academia"
                  required
                  className="w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                             text-brand-text placeholder:text-brand-hint
                             focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light transition-colors"
                />
                <p className="text-[11px] text-brand-hint mt-1">slug.edutenant.app</p>
              </div>
              <div>
                <label className="text-xs font-medium text-brand-muted block mb-1">
                  <MapPin className="w-3 h-3 inline mr-1" />Ciudad
                </label>
                <input
                  name="city"
                  placeholder="Ciudad principal"
                  className="w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                             text-brand-text placeholder:text-brand-hint
                             focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light transition-colors"
                />
              </div>
            </div>

            {/* Idempotency notice */}
            <div className="flex justify-end gap-2.5 pt-1">
              <Link href="/signup">
                <Button variant="secondary">Atrás</Button>
              </Link>
              <Button variant="primary" type="submit">
                Crear academia →
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-center text-[13px] text-brand-muted">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-accent-mid hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
