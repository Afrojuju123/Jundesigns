import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "jun_admin_session";
export const COOKIE_NAME = ADMIN_COOKIE_NAME;

export const ADMIN_COOKIE = {
  name: ADMIN_COOKIE_NAME,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
  sameSite: "lax" as const,
};

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const sessionSecret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!sessionSecret || !token) return false;
  return token === sessionSecret;
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD environment variable is not configured.");
    return false;
  }
  return password === adminPassword;
}

export function getAdminCookieHeader(): { name: string; value: string; maxAge: number } {
  const sessionSecret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "fallback";
  return {
    name: ADMIN_COOKIE.name,
    value: sessionSecret,
    maxAge: ADMIN_COOKIE.maxAge,
  };
}
