import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Operator Login",
  description: "Sign in to the Route Mind operator dashboard.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-100/70 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Operator Login</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Access the Route Mind operations dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
