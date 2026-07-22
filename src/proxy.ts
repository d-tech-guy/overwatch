import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Protected route prefixes.
 *
 * Any request matching these prefixes requires an authenticated session.
 * Unauthenticated users are redirected to /auth/login.
 */
const PROTECTED_PREFIXES = ["/dashboard", "/god", "/admin"];

/**
 * Auth routes that authenticated users should never see.
 *
 * An already-authenticated user visiting /auth/login is redirected
 * to their appropriate dashboard instead of showing the login page again.
 */
const AUTH_REDIRECT_PATHS = ["/auth/login"];



export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const godCookie = request.cookies.get("god_session")?.value;
  let godSession = null;
  if (godCookie) {
    const { verifyGodSession } = await import("@/lib/god-session");
    godSession = await verifyGodSession(godCookie);
  }

  const isGodRoute = pathname.startsWith("/god");

  if (isGodRoute) {
    if (!godSession || godSession.role !== "GOD") {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (godSession && AUTH_REDIRECT_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/god", request.url));
  }

  // Refresh the Supabase session and retrieve the current user.
  const { supabaseResponse, user } = await updateSession(request);

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Redirect unauthenticated users away from protected routes.
  if (isProtected && !user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from the login page.
  if (AUTH_REDIRECT_PATHS.includes(pathname) && user) {
    // Resolve destination based on role stored in user metadata.
    const role = user.user_metadata?.role as string | undefined;
    const destination = role === "platform_admin" ? "/god" : "/admin";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (browser favicon)
     * - Public assets (/logo.svg, /favicon.svg, etc.)
     * - API routes (/api/*)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|logo\\.svg|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$|api/).*)",
  ],
};
