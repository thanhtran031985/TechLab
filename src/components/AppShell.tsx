'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  History,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Code2,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('techlab-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('techlab-theme', nextTheme);
  };

  const navItems = [
    { href: '/', label: 'Khóa học', icon: BookOpen },
    { href: '/progress', label: 'Tiến độ & Lịch sử', icon: History },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-ink">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-line bg-nav-bg transition-all duration-150 ease-in-out shrink-0 ${
          collapsed ? 'w-[48px]' : 'w-[200px]'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex h-[44px] items-center px-3 border-b border-line gap-2 overflow-hidden">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-on-primary shrink-0">
            <Code2 size={16} />
          </div>
          {!collapsed && (
            <span className="font-semibold text-[13px] tracking-tight truncate">
              TechLab
            </span>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-2 px-1 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`relative flex items-center h-[34px] rounded-[4px] px-2.5 text-[12px] font-medium transition-colors ${
                  isActive
                    ? 'bg-nav-active text-primary font-semibold'
                    : 'text-ink hover:bg-surface-2'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-nav-accent" />
                )}
                <Icon size={16} className="shrink-0" />
                {!collapsed && <span className="ml-2.5 truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar collapse button */}
        <div className="p-1 border-t border-line">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
            className="flex h-[32px] w-full items-center justify-center rounded-[4px] text-ink-soft hover:bg-surface-2 hover:text-ink transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex h-[44px] items-center justify-between border-b border-line bg-surface px-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-ink">
              Nền tảng học tập kỹ thuật phần mềm tương tác
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Chuyển sang chế độ Tối' : 'Chuyển sang chế độ Sáng'}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[4px] border border-line text-ink hover:bg-surface-2 transition-colors"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </header>

        {/* Content area: No global scroll, internal panels scroll */}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden bg-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
