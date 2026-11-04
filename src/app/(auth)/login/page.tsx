"use client";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.success) router.push("/");
  }, [state, router]);

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-6">
      <div className="bg-surface-2 border border-brand-border rounded-[16px] p-9 w-[380px] shadow-sm">

        {/* Logo */}
        <div className="text-center mb-7">
          <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center mx-auto mb-2.5">
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-[2px] bg-white opacity-90 w-1.5 h-1.5" />
              ))}
            </div>
          </div>
          <h1 className="text-[17px] font-semibold text-brand-text">EduTenant</h1>
          <p className="text-xs text-brand-muted mt-0.5">Inicia sesión en tu academia</p>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-brand-muted block mb-1">Correo electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-hint" />
              <input
                name="email"
                type="email"
                placeholder="admin@academia.com"
                required
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                           text-brand-text placeholder:text-brand-hint
                           focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-brand-muted block mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-hint" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full pl-8 pr-9 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                           text-brand-text placeholder:text-brand-hint
                           focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-hint hover:text-brand-text"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 text-brand-muted cursor-pointer">
              <input type="checkbox" className="rounded" /> Recordarme
            </label>
            <a href="#" className="text-accent-mid hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 bg-danger-bg text-danger text-xs p-2.5 rounded-lg border-l-[3px] border-danger">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {state.error}
            </div>
          )}

          <Button
            variant="primary"
            className="w-full justify-center"
            type="submit"
            disabled={pending}
          >
            {pending ? "Ingresando…" : "Iniciar sesión"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-4 text-brand-hint text-xs">
          <div className="flex-1 h-px bg-brand-border" />
          o continúa con
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-1.5 text-sm border border-brand-border-strong rounded-lg bg-surface-2 hover:bg-surface-1 transition-colors text-brand-text">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>

        <p className="mt-5 text-center text-[13px] text-brand-muted">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-accent-mid hover:underline font-medium">Crear academia</Link>
        </p>
      </div>
    </div>
  );
}
