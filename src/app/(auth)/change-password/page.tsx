import { redirect } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { changeStudentPasswordAction } from "../../actions/student-password";
import { getSessionIdentity } from "@/lib/auth-session";

export default async function ChangePasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [session, { error }] = await Promise.all([getSessionIdentity(), searchParams]);
  if (!session || session.role !== "student") redirect("/login");
  if (!session.mustChangePassword) redirect("/");

  const errorMessage = error === "length"
    ? "La contraseña debe tener al menos 8 caracteres"
    : error === "mismatch"
      ? "Las contraseñas no coinciden"
      : null;

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-6">
      <div className="bg-surface-2 border border-brand-border rounded-card p-8 w-full max-w-md shadow-sm">
        <h1 className="text-[18px] font-medium text-brand-text">Crea tu nueva contraseña</h1>
        <p className="text-[13px] text-brand-muted mt-2 mb-6">
          Hola, {session.name}. Para continuar, reemplaza la contraseña temporal.
        </p>

        <form action={changeStudentPasswordAction} className="space-y-4">
          <Input label="Nueva contraseña" name="password" type="password" minLength={8} required />
          <Input label="Confirmar contraseña" name="confirmPassword" type="password" minLength={8} required />
          {errorMessage && <p className="text-danger text-xs">{errorMessage}</p>}
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">Guardar y continuar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}