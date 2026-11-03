import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { User, Lock, Shield } from "lucide-react";

export default function ProfilePage() {
  const user = { name: "Juan Pérez", email: "juan@ejemplo.com" };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[18px] font-medium text-brand-text">Mi perfil</h1>
        <p className="text-[13px] text-brand-muted mt-0.5">Gestiona tu cuenta y preferencias</p>
      </div>

      <div className="max-w-lg space-y-4">
        {/* Profile card */}
        <div className="bg-surface-2 border border-brand-border rounded-card p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-purple-bg text-purple flex items-center justify-center text-xl font-semibold">
              JP
            </div>
            <div>
              <h2 className="text-[15px] font-medium text-brand-text">{user.name}</h2>
              <p className="text-[13px] text-brand-muted">{user.email}</p>
            </div>
            <div className="ml-auto">
              <Badge variant="purple">Admin</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <User className="w-3.5 h-3.5 text-brand-hint" />
            <h3 className="text-[12px] font-medium text-brand-muted uppercase tracking-wide">Información personal</h3>
          </div>

          <form className="space-y-3">
            <Input label="Nombre completo" name="name" defaultValue={user.name} />
            <Input label="Email" name="email" type="email" defaultValue={user.email} />

            <div className="h-px bg-brand-border my-4" />

            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-3.5 h-3.5 text-brand-hint" />
              <h3 className="text-[12px] font-medium text-brand-muted uppercase tracking-wide">Cambiar contraseña</h3>
            </div>

            <Input label="Nueva contraseña" name="password" type="password" placeholder="••••••••" />
            <Input label="Confirmar contraseña" name="confirmPassword" type="password" placeholder="••••••••" />

            <div className="flex items-start gap-2 bg-accent-light text-accent text-xs p-2.5 rounded-lg border-l-[3px] border-accent-mid">
              <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              Tu sesión se almacena en cookie httpOnly — nunca en localStorage.
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="ghost" type="button">Cancelar</Button>
              <Button variant="primary" type="submit">Guardar cambios</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
