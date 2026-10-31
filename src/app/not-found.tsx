import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-8">
      <Card className="p-10 w-full max-w-md text-center">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-bold text-brand-text mb-2">Página no encontrada</h2>
        <p className="text-brand-muted mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex justify-center">
          <Link href="/">
            <Button variant="primary">Volver al inicio</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
