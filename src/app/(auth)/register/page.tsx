import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-8">
      <Card className="p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-brand-text mb-6">Crear cuenta</h1>
        <form className="space-y-4">
          <Input label="Nombre completo" name="name" placeholder="Ej. Juan Pérez" required />
          <Input label="Email" name="email" type="email" placeholder="tu@email.com" required />
          <Input label="Contraseña" name="password" type="password" placeholder="••••••••" required />
          
          <Button variant="primary" className="w-full justify-center" type="submit">
            Registrarse
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-brand-muted">
          ¿Ya tienes cuenta? <Link href="/login" className="text-accent font-medium">Inicia sesión</Link>
        </p>
      </Card>
    </div>
  );
}
