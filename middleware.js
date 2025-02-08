import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req) {
  const cookie = await cookies();
  const token = cookie.get("fetch-access-toekn");

  // Redirect to login if token is not found and trying to access /dashboard
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protects /dashboard and its subroutes
};
