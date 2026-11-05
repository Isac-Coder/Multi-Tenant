export const ROLE_DEFINITIONS = [
  { value: "student", label: "Estudiante" },
  { value: "tenant_admin", label: "Admin" },
  { value: "platform_admin", label: "Super admin" },
] as const;

export type AppRole = (typeof ROLE_DEFINITIONS)[number]["value"];

export function isStudentRole(role?: string): boolean {
  return role === "student";
}

export function isAdminRole(role?: string): boolean {
  return role === "tenant_admin" || role === "platform_admin";
}

export function getRoleLabel(role?: string): string {
  return ROLE_DEFINITIONS.find((item) => item.value === role)?.label ?? "Usuario";
}
