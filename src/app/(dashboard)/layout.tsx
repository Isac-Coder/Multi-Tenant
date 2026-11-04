import { Sidebar } from "../../components/layout/Sidebar";
import { getSessionIdentity } from "@/lib/auth-session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionIdentity();

  return (
    <div className="flex h-screen bg-surface-0 overflow-hidden">
      <Sidebar userName={session?.name ?? "Usuario"} userEmail={session?.email ?? ""} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
