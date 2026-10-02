/**
 * Demo/local operator authentication.
 * Deliberately minimal — a signed session is NOT implemented; the browser
 * holds an operator cookie that the proxy checks for /dashboard routes.
 * Real authentication belongs to a backend service.
 */

export const OPERATOR_COOKIE = "rm_operator";
const OPERATOR_COOKIE_VALUE = "granted";

/** Local demo operator credentials. */
export const OPERATOR_USERNAME = "admin";
export const OPERATOR_PASSWORD = "admin123";

export function isValidOperatorCredentials(username: string, password: string): boolean {
  return username === OPERATOR_USERNAME && password === OPERATOR_PASSWORD;
}

/** Persist operator state in the browser (client-side only). */
export function setOperatorSession(rememberDays = 1): void {
  const maxAge = rememberDays * 24 * 60 * 60;
  document.cookie = `${OPERATOR_COOKIE}=${OPERATOR_COOKIE_VALUE}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function clearOperatorSession(): void {
  document.cookie = `${OPERATOR_COOKIE}=; path=/; max-age=0`;
}

/** Client-side session check (complements the proxy guard). */
export function hasOperatorSession(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some(
    (c) => c === `${OPERATOR_COOKIE}=${OPERATOR_COOKIE_VALUE}`,
  );
}
