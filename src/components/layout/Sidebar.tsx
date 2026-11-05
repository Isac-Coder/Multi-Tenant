'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  Building2, Settings, LogOut
} from 'lucide-react';
import { logoutAction } from '../../app/actions/auth';
import { isStudentRole } from '@/lib/roles';

export const Sidebar = ({ userName, userEmail, userRole }: { userName: string; userEmail: string; userRole?: string }) => {
  const menuItems = isStudentRole(userRole)
    ? [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
        { name: 'Mis cursos', icon: BookOpen, href: '/courses' },
        { name: 'Mis inscripciones', icon: ClipboardList, href: '/enrollment' },
      ]
    : [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
        { name: 'Estudiantes', icon: Users, href: '/students' },
        { name: 'Cursos', icon: BookOpen, href: '/courses' },
        { name: 'Inscripciones', icon: ClipboardList, href: '/enrollment' },
        { name: 'Tenants', icon: Building2, href: '/tenants' },
      ];

  const pathname = usePathname();
  const initials = userName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = '/login';
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside className="w-[220px] min-w-[220px] bg-surface-2 border-r border-brand-border flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-4 h-[52px] flex items-center gap-2 font-semibold text-[15px] border-b border-brand-border flex-shrink-0">
        <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
          <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-[2px] bg-white opacity-90 w-1.5 h-1.5" />
            ))}
          </div>
        </div>
        <span className="text-brand-text">EduTenant</span>
      </div>

      {/* Tenant pill */}
      <div className="px-3 py-3 border-b border-brand-border flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 bg-surface-1 rounded-lg">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-brand-text truncate">{userName}</p>
            <p className="text-[10px] text-brand-hint truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-brand-hint px-2.5 mb-2">General</p>
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors
                ${active
                  ? 'bg-accent-light text-accent font-medium'
                  : 'text-brand-muted hover:bg-surface-1 hover:text-brand-text'
                }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-brand-border flex-shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-brand-hint px-2.5 mb-2">Sistema</p>
        <Link
          href="/profile"
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors
            ${pathname === '/profile'
              ? 'bg-accent-light text-accent font-medium'
              : 'text-brand-muted hover:bg-surface-1 hover:text-brand-text'
            }`}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Configuración
        </Link>
        <button
          onClick={async () => {
            await logoutAction();
            window.location.href = '/login';
          }}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[13px] transition-colors text-brand-muted hover:bg-surface-1 hover:text-brand-text w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};
