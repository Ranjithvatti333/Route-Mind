import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <LogoMark className="h-12 w-12" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Route not found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        This page took a wrong turn. Check the URL or head back to the network.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Back to home
        </Link>
        <Link
          href="/routes"
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Browse routes
        </Link>
      </div>
    </div>
  );
}
