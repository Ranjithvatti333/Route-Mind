"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, LogoMark } from "@/components/ui/Logo";
import { DASHBOARD_NAV } from "@/lib/nav";
import { clearOperatorSession } from "@/lib/auth";

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Dashboard" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {DASHBOARD_NAV.map((group) => (
        <div key={group.section}>
          <h3 className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {group.section}
          </h3>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Demarcation() {
  return (
    <div className="border-t border-slate-200 px-3 py-3">
      <Link
        href="/"
        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
      >
        &larr; Public website
      </Link>
    </div>
  );
}

/**
 * Dashboard layout shell: fixed sidebar on desktop, slide-in drawer on mobile,
 * sticky top header with page context.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearOperatorSession();
    router.replace("/login");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  const current = DASHBOARD_NAV.flatMap((g) => g.items).find((i) => i.href === pathname);

  return (
    <div className="flex min-h-screen bg-slate-100/70">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-slate-200 px-4">
          <Logo />
        </div>
        <SidebarContent pathname={pathname} />
        <Demarcation />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Dashboard menu">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-card-hover">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current" aria-hidden>
                  <path d="m10 8.6 3.3-3.3 1.4 1.4L11.4 10l3.3 3.3-1.4 1.4L10 11.4l-3.3 3.3-1.4-1.4L8.6 10 5.3 6.7l1.4-1.4L10 8.6Z" />
                </svg>
              </button>
            </div>
            <SidebarContent pathname={pathname} />
            <Demarcation />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-slate-900">
              {current?.label ?? "Operator Dashboard"}
            </h1>
            <p className="text-xs text-slate-500">Hyderabad network</p>
          </div>

          <Link
            href="/dashboard/alerts"
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="View alerts"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current" aria-hidden>
              <path d="M10 2a6 6 0 0 0-6 6v3.3l-1.3 2.2A1 1 0 0 0 3.6 15h12.8a1 1 0 0 0 .9-1.5L16 11.3V8a6 6 0 0 0-6-6Zm-2 14a2 2 0 1 0 4 0H8Z" />
            </svg>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" aria-hidden />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 hover:ring-2 hover:ring-brand-300"
            aria-label="Log out"
            title="Log out"
          >
            OP
          </button>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        <footer className="border-t border-slate-200 px-6 py-4">
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <LogoMark className="h-4 w-4" />
            Route Mind operator workspace — Hyderabad, Telangana.
          </p>
        </footer>
      </div>
    </div>
  );
}
