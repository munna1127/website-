import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("auth_session");
  const isAuthenticated = session?.value === "authenticated_true";
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
