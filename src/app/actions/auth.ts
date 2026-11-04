"use server";

import { cookies } from "next/headers";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "super-secret-key-change-me");

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // VALIDACIÓN MOCK: En una app real, aquí validarías contra DB
  if (email === "isac@gmail.com" && password === "123456789") {
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(SECRET);

    (await cookies()).set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 2, // 2 hours
      path: "/",
    });

    return { success: true };
  }

  return { error: "Credenciales inválidas" };
}

export async function logoutAction() {
  (await cookies()).delete("auth-token");
  return { success: true };
}
