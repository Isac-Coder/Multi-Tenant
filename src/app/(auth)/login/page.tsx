"use client";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/");
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-8">
      <Card className="p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-brand-text mb-6">Iniciar sesión</h1>
        <form action={action} className="space-y-4">
          <Input label="Email" name="email" type="email" placeholder="tu@email.com" required />
          <Input label="Contraseña" name="password" type="password" placeholder="••••••••" required />
          
          {state?.error && <p className="text-danger text-sm">{state.error}</p>}
          
          <Button variant="primary" className="w-full justify-center" type="submit" disabled={pending}>
            {pending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-brand-muted">
          ¿No tienes cuenta? <Link href="/register" className="text-accent font-medium">Regístrate</Link>
        </p>
      </Card>
    </div>
  );
}
