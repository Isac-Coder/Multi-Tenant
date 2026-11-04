import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest, handler: (req: NextRequest, tenantId: string, role?: string) => Promise<NextResponse>) {
  // 1. Obtener el token de la cookie httpOnly
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Validar token y extraer tenant_id
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-change-me");
    const { payload } = await jwtVerify(token, secret);
    if (payload.must_change_password === true) {
      return NextResponse.json({ error: "Password change required" }, { status: 403 });
    }

    const metadata = payload.app_metadata as Record<string, unknown> | undefined;
    const tenantId = typeof payload.tenant_id === "string"
      ? payload.tenant_id
      : typeof metadata?.tenant_id === "string"
        ? metadata.tenant_id
        : undefined;
    
    if (!tenantId) {
      return NextResponse.json({ error: "No tenant_id in token" }, { status: 403 });
    }

    // 3. Ejecutar el manejador real pasando el tenantId
    const role = typeof payload.role === "string" ? payload.role : undefined;
    return await handler(request, tenantId, role);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}

export const withProxy = proxy;
