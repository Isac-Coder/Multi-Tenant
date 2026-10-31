import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function NewCoursePage() {
  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <h1 className="text-2xl font-bold text-brand-text mb-8">Nuevo Curso</h1>
      
      <Card className="p-6 max-w-lg">
        <form className="space-y-4">
          <Input label="Título del curso" name="title" placeholder="Ej. Introducción a React" required />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-brand-muted">Descripción</label>
            <textarea
              name="description"
              className="w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                         text-brand-text placeholder:text-brand-hint
                         focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light
                         transition-colors"
              rows={4}
              required
            />
          </div>
          <div className="pt-4 flex gap-2">
            <Button variant="primary" type="submit">Guardar</Button>
            <Button variant="ghost" type="button">Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
