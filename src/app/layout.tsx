import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EduTenant — Plataforma SaaS para Academias",
  description: "Gestiona estudiantes, cursos e inscripciones por academia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface-0 font-sans">{children}</body>
    </html>
  );
}
