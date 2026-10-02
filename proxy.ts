import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route guard for the operator dashboard (Next.js proxy convention —
 * replaces the deprecated middleware file). Unauthenticated visitors to
 * /dashboard or /dashboard/* are redirected to /login.
 */

const OPERATOR_COOKIE = "rm_operator";
const OPERATOR_COOKIE_VALUE = "granted";

export function proxy(request: NextRequest) {
  const authed = request.cookies.get(OPERATOR_COOKIE)?.value === OPERATOR_COOKIE_VALUE;
  if (!authed) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
