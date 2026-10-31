import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function NewTenantPage() {
  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <h1 className="text-2xl font-bold text-brand-text mb-8">Nuevo Tenant</h1>
      
      <Card className="p-6 max-w-lg">
        <form className="space-y-4">
          <Input label="Nombre del Tenant" name="name" placeholder="Ej. Academia Central" required />
          <Input label="Slug" name="slug" placeholder="Ej. academia-central" required />
          
          <div className="pt-4 flex gap-2">
            <Button variant="primary" type="submit">Guardar</Button>
            <Button variant="ghost" type="button">Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
