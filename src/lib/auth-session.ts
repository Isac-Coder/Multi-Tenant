import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { EncryptJWT, jwtDecrypt, jwtVerify, SignJWT } from "jose";

const SECRET = process.env.JWT_SECRET || "super-secret-key-change-me";
const SIGNING_KEY = new TextEncoder().encode(SECRET);
const ENCRYPTION_KEY = createHash("sha256").update(SECRET).digest();
const SESSION_COOKIE = "auth-token";
const PENDING_SIGNUP_COOKIE = "pending-signup";

export interface PendingSignup {
  name: string;
  email: string;
  passwordHash: string;
}

export async function storePendingSignup(signup: PendingSignup): Promise<void> {
  const token = await new EncryptJWT({
    name: signup.name,
    email: signup.email,
    passwordHash: signup.passwordHash,
  })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .encrypt(ENCRYPTION_KEY);

  (await cookies()).set(PENDING_SIGNUP_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60,
    path: "/",
  });
}

export async function getPendingSignup(): Promise<PendingSignup | null> {
  const token = (await cookies()).get(PENDING_SIGNUP_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtDecrypt(token, ENCRYPTION_KEY);
    if (
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.passwordHash !== "string"
    ) return null;

    return {
      name: payload.name,
      email: payload.email,
      passwordHash: payload.passwordHash,
    };
  } catch {
    return null;
  }
}

export async function clearPendingSignup(): Promise<void> {
  (await cookies()).delete(PENDING_SIGNUP_COOKIE);
}

export async function startSession(email: string, tenantId: string, role: string, name?: string, mustChangePassword = false): Promise<void> {
  const token = await new SignJWT({
    email,
    name: name?.trim() || formatNameFromEmail(email),
    tenant_id: tenantId,
    role,
    must_change_password: mustChangePassword,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(SIGNING_KEY);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2,
    path: "/",
  });
}

export async function getSessionIdentity(): Promise<{ name: string; email: string; tenantId: string; role: string; mustChangePassword: boolean } | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SIGNING_KEY);
    const email = typeof payload.email === "string" ? payload.email : "";
    const tenantId = typeof payload.tenant_id === "string" ? payload.tenant_id : "";
    const role = typeof payload.role === "string" ? payload.role : "";
    if (!email || !tenantId || !role) return null;
    const name = typeof payload.name === "string" && payload.name.trim()
      ? payload.name
      : formatNameFromEmail(email);

    return { name, email, tenantId, role, mustChangePassword: payload.must_change_password === true };
  } catch {
    return null;
  }
}

function formatNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] ?? "Usuario";
  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}