import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "../../../../components/ui/Button";
import { completeRegistrationAction } from "../../../actions/registration";
import { getPendingSignup } from "@/lib/auth-session";

interface RegistrationDetails {
  name?: string;
  email?: string;
  academyName?: string;
  slug?: string;
  city?: string;
  error?: string;
}

export default async function ConfirmRegistrationPage({ searchParams }: { searchParams: Promise<RegistrationDetails> }) {
  const [{ name, email, academyName, slug, city, error }, pendingSignup] = await Promise.all([
    searchParams,
    getPendingSignup(),
  ]);
  if (!pendingSignup || name !== pendingSignup.name || email !== pendingSignup.email || !academyName || !slug) redirect("/signup");
  const errorMessage = error === "duplicate"
    ? "Ya existe una cuenta o academia con esos datos"
    : error === "invalid"
      ? "Revisa el nombre y el subdominio de la academia"
      : null;

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-6">
      <div className="w-[480px]">
        <div className="text-center mb-6">
          <h1 className="text-[17px] font-semibold text-brand-text">EduTenant</h1>
          <p className="text-xs text-brand-muted mt-0.5">Revisa los datos del registro</p>
        </div>

        <div className="flex items-start mb-6">
          {[
            { label: "Cuenta", state: "done" },
            { label: "Academia", state: "done" },
            { label: "Confirmar", state: "active" },
          ].map((step, index) => (
            <div key={step.label} className="flex-1 flex flex-col items-center relative">
              {index < 2 && <div className="absolute top-3.5 left-1/2 w-full h-px z-0 bg-accent" />}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold z-10 relative ${step.state === "done" ? "bg-accent text-white" : "bg-accent-mid text-white ring-2 ring-accent"}`}>
                {step.state === "done" ? "✓" : index + 1}
              </div>
              <span className={`text-[11px] mt-1.5 ${step.state === "active" ? "text-accent font-medium" : "text-brand-muted"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <form action={completeRegistrationAction} className="bg-surface-2 border border-brand-border rounded-card p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-brand-text mb-4">Confirmar datos</h2>
          {errorMessage && <p className="text-danger text-xs mb-4">{errorMessage}</p>}
          <input type="hidden" name="academyName" value={academyName} />
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="city" value={city ?? ""} />
          <dl className="space-y-4">
            {[
              { label: "Nombre completo", value: name },
              { label: "Correo electrónico", value: email },
              { label: "Academia", value: academyName },
              { label: "Subdominio", value: `${slug}.edutenant.app` },
              { label: "Ciudad", value: city || "No especificada" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-medium text-brand-muted">{item.label}</dt>
                <dd className="text-sm text-brand-text mt-0.5 break-words">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex justify-between pt-6">
            <Link href={{ pathname: "/register", query: { name, email } }}>
              <Button variant="secondary">Volver a editar</Button>
            </Link>
            <Button type="submit" variant="primary">Confirmar y entrar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}