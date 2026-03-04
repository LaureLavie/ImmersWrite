import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register"];

const STATIC_PREFIXES = ["/_next/", "/api/", "/favicon"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("access_token")?.value;

  if (!token && pathname === "/") {
   
    return NextResponse.redirect(new URL("/register", request.url));
  }

  if (pathname === "/") {
    const isConfirmed = request.cookies.get("is_confirmed")?.value === "true";
    if (!isConfirmed) {
   
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const isStatic = STATIC_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (isStatic) {
    return NextResponse.next();
  }

  const isAsset = /\.(svg|png|jpg|jpeg|webp|ico|mp3|wav|woff|woff2)$/.test(
    pathname
  );
  if (isAsset) {
    return NextResponse.next();
  }

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  if (isPublicPath) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

