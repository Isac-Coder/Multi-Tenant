
import Link from "next/link";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { beginSignupAction } from "../../actions/registration";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const errorMessage = error === "email"
    ? "Ya existe una cuenta con ese correo"
    : error === "invalid"
      ? "Revisa los datos e ingresa una contraseña de al menos 8 caracteres"
      : error === "expired"
        ? "La sesión de registro venció. Inicia el proceso nuevamente"
        : error === "unavailable"
          ? "No se pudo iniciar el registro. Inténtalo nuevamente"
          : null;

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
          <p className="text-xs text-brand-muted mt-0.5">Crea tu cuenta primero</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-start mb-6">
          {[
            { label: "Cuenta",   status: "active" },
            { label: "Academia",  status: "pending" },
            { label: "Confirmar", status: "pending" },
          ].map((step, i, arr) => (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              {i < arr.length - 1 && (
                <div className={"absolute top-3.5 left-1/2 w-full h-px z-0 bg-brand-border"} />
              )}
              <div className={"w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold z-10 relative " +
                (step.status === "active" ? "bg-accent-mid text-white ring-2 ring-accent" :
                 "bg-surface-1 text-brand-hint border border-brand-border")}>
                {i + 1}
              </div>
              <span className={"text-[11px] mt-1.5 " + (step.status === "active" ? "text-accent font-medium" : "text-brand-muted")}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-surface-2 border border-brand-border rounded-card p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-brand-text mb-1">Información de cuenta</h2>
          <p className="text-[13px] text-brand-muted mb-5">Primero necesitamos tus datos de contacto.</p>

          <form className="space-y-4" action={beginSignupAction}>
            <Input label="Nombre completo" name="name" placeholder="Ej. Juan Pérez" required />
            <Input label="Email" name="email" type="email" placeholder="tu@email.com" required />
            <Input label="Contraseña" name="password" type="password" placeholder="••••••••" minLength={8} required />

            {errorMessage && <p className="text-danger text-xs">{errorMessage}</p>}

            <div className="flex justify-end pt-2">
              <Button variant="primary" type="submit">
                Siguiente →
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
