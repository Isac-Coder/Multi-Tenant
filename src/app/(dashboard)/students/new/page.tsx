import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function NewStudentPage() {
  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <h1 className="text-2xl font-bold text-brand-text mb-8">Nuevo Estudiante</h1>
      
      <Card className="p-6 max-w-lg">
        <form className="space-y-4">
          <Input label="Nombre completo" name="name" placeholder="Ej. Juan Pérez" required />
          <Input label="Email" name="email" type="email" placeholder="juan@ejemplo.com" required />
          <div className="pt-4 flex gap-2">
            <Button variant="primary" type="submit">Guardar</Button>
            <Button variant="ghost" type="button">Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
