import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest, handler: (req: NextRequest, tenantId: string) => Promise<NextResponse>) {
  // 1. Obtener el token de la cookie httpOnly
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Validar token y extraer tenant_id
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Asumiendo que el tenant_id está en app_metadata dentro del payload
    const tenantId = (payload.app_metadata as any)?.tenant_id;
    
    if (!tenantId) {
      return NextResponse.json({ error: "No tenant_id in token" }, { status: 403 });
    }

    // 3. Ejecutar el manejador real pasando el tenantId
    return await handler(request, tenantId as string);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}

export const withProxy = proxy;
