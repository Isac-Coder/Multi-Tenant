import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Key, Shield } from "lucide-react";
import Link from "next/link";

export default function NewTenantPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tenants">
          <button className="flex items-center gap-1.5 text-[13px] text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-4 h-4" /> Tenants
          </button>
        </Link>
        <span className="text-brand-border">/</span>
        <h1 className="text-[18px] font-medium text-brand-text">Nuevo tenant</h1>
      </div>

      <div className="max-w-lg">
        <div className="bg-surface-2 border border-brand-border rounded-card p-6 shadow-sm">
          <h2 className="text-[14px] font-medium text-brand-text mb-1">Datos de la academia</h2>
          <p className="text-[12px] text-brand-muted mb-5">
            Se creará un schema aislado en la base de datos para esta academia.
          </p>

          <form className="space-y-4">
            <Input label="Nombre de la academia *" name="name" placeholder="Ej. Instituto de Idiomas Prestige" required />
            <div>
              <Input label="Slug único *" name="slug" placeholder="ej. instituto-prestige" required />
              <p className="text-[11px] text-brand-hint mt-1">slug.edutenant.app</p>
            </div>

            <div className="flex items-start gap-2 bg-accent-light text-accent text-xs p-2.5 rounded-lg border-l-[3px] border-accent-mid">
              <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              Los datos de este tenant estarán completamente aislados de otros tenants.
            </div>

            <div className="flex items-start gap-2 bg-accent-light text-accent text-xs p-2.5 rounded-lg border-l-[3px] border-accent-mid">
              <Key className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              Operación idempotente — usar la misma{" "}
              <code className="bg-accent/10 px-1 rounded">Idempotency-Key</code>{" "}
              no creará duplicados.
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Link href="/tenants">
                <Button variant="ghost">Cancelar</Button>
              </Link>
              <Button variant="primary" type="submit">Crear tenant</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
