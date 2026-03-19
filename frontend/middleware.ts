import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages accessibles sans être connecté
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/confirm",
  "/register/confirmation",
  "/forgot-password",
  "/reset-password",
];

// Préfixes toujours ignorés (fichiers statiques, API interne)
const STATIC_PREFIXES = ["/_next/", "/api/", "/favicon", "/.well-known/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Laisser passer les ressources statiques ──────────────────────────
  const isStatic = STATIC_PREFIXES.some((p) => pathname.startsWith(p));
  if (isStatic) return NextResponse.next();

  const isAsset = /\.(svg|png|jpg|jpeg|webp|ico|mp3|wav|woff|woff2)$/.test(pathname);
  if (isAsset) return NextResponse.next();

  // ── 2. Lire le token et le rôle depuis les cookies ───────────────────────
  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // ── 3. Utilisateur NON connecté ──────────────────────────────────────────
  if (!token) {
    if (isPublicPath) {
      // Page publique accessible → OK
      return NextResponse.next();
    }
    // Page privée → redirection vers /login avec paramètre de retour
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 4. Utilisateur CONNECTÉ sur une page auth → redirection selon rôle ──
  if (isPublicPath) {
    if (role === "auteur") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (role === "lecteur") return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ── 5. Protection du dashboard : auteurs uniquement ──────────────────────
  if (pathname.startsWith("/dashboard") && role !== "auteur") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // ── 6. Toutes les autres pages privées sont accessibles → OK ─────────────
  if (pathname.startsWith("/") && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
  
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};