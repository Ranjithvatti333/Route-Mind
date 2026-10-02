"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Section";
import { isValidOperatorCredentials, setOperatorSession } from "@/lib/auth";

/**
 * Local operator login. Credentials are validated against the bundled demo
 * operator account; success sets the operator cookie that the proxy guard
 * checks for /dashboard routes.
 */
export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidOperatorCredentials(username.trim(), password)) {
      setError("Invalid username or password.");
      return;
    }

    setOperatorSession(remember ? 30 : 1);
    router.push("/dashboard");
  };

  return (
    <Card className="p-7">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Operator username"
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <div className="mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 accent-brand-600"
          />
          <label htmlFor="remember" className="text-sm text-slate-600">
            Remember me
          </label>
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>

      <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
        Operator access only — authorized transport operations staff. Contact your administrator
        for credentials.
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        <Link href="/" className="font-medium text-brand-600 hover:text-brand-700">
          &larr; Back to public site
        </Link>
      </p>
    </Card>
  );
}
