import React from 'react';
import Link from 'next/link';
import { Home, Users, BookOpen, ClipboardList, Building, Settings, LayoutDashboard } from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Estudiantes', icon: Users, href: '/students' },
    { name: 'Cursos', icon: BookOpen, href: '/courses' },
    { name: 'Inscripciones', icon: ClipboardList, href: '/enrollments' },
    { name: 'Tenants', icon: Building, href: '/tenants' },
  ];

  return (
    <aside className="w-64 bg-surface-2 border-r border-brand-border h-screen sticky top-0 flex flex-col">
      <div className="px-6 h-13 flex items-center gap-2 font-semibold text-[15px] border-b border-brand-border">
        <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-[2px] bg-white opacity-90 w-1.5 h-1.5" />
                ))}
            </div>
        </div>
        EduTenant
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} className="flex items-center gap-3 px-3 py-2 text-sm text-brand-muted hover:bg-surface-1 hover:text-brand-text rounded-md transition-colors">
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-brand-border">
        <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-brand-muted hover:bg-surface-1 hover:text-brand-text rounded-md transition-colors">
            <Settings className="w-4 h-4" />
            Configuración
        </Link>
      </div>
    </aside>
  );
};
