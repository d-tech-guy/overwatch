import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { ROUTES } from "@/lib/constants";

/**
 * Next.js middleware.
 *
 * Responsibilities:
 * 1. Refreshes the Supabase auth session on every request.
 * 2. Protects /dashboard and all nested routes from unauthenticated access.
 * 3. Redirects authenticated users away from the login page.
 */
export default async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname.startsWith("/auth");

  // Redirect unauthenticated users away from dashboard routes
  if (isDashboardRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ROUTES.auth.login;
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from the login page
  if (isAuthRoute && pathname === ROUTES.auth.login && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = ROUTES.dashboard.root;
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
