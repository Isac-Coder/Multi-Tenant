import { NextResponse, NextRequest } from 'next/server';

// TODO: Instalar una librería como 'jose' para validar JWT de forma segura: npm install jose
// import { jwtVerify } from 'jose';

export async function withProxy(request: NextRequest, handler: (req: NextRequest, tenantId: string) => Promise<NextResponse>) {
  // 1. Obtener el token de la cookie httpOnly
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Validar token y extraer tenant_id
    // TODO: Implementar validación real de JWT aquí. 
    // Por ahora usamos un valor mock para permitir el flujo.
    const tenantId = 'mock-tenant-id-por-definir';

    // 3. Ejecutar el manejador real pasando el tenantId
    return await handler(request, tenantId);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}
