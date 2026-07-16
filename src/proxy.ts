import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export default async function proxy(request: NextRequest) {
  // Update the user's session with Supabase
  const { supabaseResponse, user } = await updateSession(request);

  const url = request.nextUrl.clone();
  const isAuthRoute = url.pathname.startsWith("/auth");
  const isAdminRoute = url.pathname.startsWith("/admin");
  const isGodRoute = url.pathname.startsWith("/god");

  // Not logged in
  if (!user) {
    if (isAdminRoute || isGodRoute) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  } else {
    // Logged in
    if (isAuthRoute) {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    // Role-based protection could go here
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, svg (public directory assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
