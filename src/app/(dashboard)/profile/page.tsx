import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  // Placeholder data - in a real app, this would be fetched from the authenticated user
  const user = {
    name: "Juan Pérez",
    email: "juan@ejemplo.com",
  };

  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <h1 className="text-2xl font-bold text-brand-text mb-8">Mi Perfil</h1>
      
      <Card className="p-6 max-w-lg">
        <form className="space-y-4">
          <Input label="Nombre completo" name="name" defaultValue={user.name} />
          <Input label="Email" name="email" type="email" defaultValue={user.email} />
          <hr className="border-brand-border" />
          <h2 className="text-sm font-semibold text-brand-text">Cambiar contraseña</h2>
          <Input label="Nueva contraseña" name="password" type="password" placeholder="••••••••" />
          <Input label="Confirmar contraseña" name="confirmPassword" type="password" placeholder="••••••••" />
          
          <div className="pt-4 flex gap-2">
            <Button variant="primary" type="submit">Guardar cambios</Button>
            <Button variant="ghost" type="button">Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
