import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { PUBLIC_NAV } from "@/lib/nav";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-[17px] font-bold tracking-tight text-slate-900">ROUTE MIND</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              AI-powered public transport intelligence for Hyderabad. Demand analytics, crowd
              prediction and smarter bus allocation for operators.
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Explore</h3>
            <ul className="mt-3 space-y-2">
              {PUBLIC_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-slate-600 hover:text-brand-700">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Operators</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/login" className="text-sm text-slate-600 hover:text-brand-700">
                  Operator Login
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-slate-600 hover:text-brand-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-600 hover:text-brand-700">
                  About the Project
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6">
          <p className="text-xs leading-relaxed text-slate-400">
            Route Mind is a final-year software project studying public transport demand in
            Hyderabad, Telangana.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Route Mind · Hyderabad, Telangana, India
          </p>
        </div>
      </div>
    </footer>
  );
}
