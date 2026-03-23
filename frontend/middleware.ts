import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages TOUJOURS accessibles à tous (même non connecté)
// La page d'accueil "/" est publique — c'est la landing page Bienvenue
const ALWAYS_PUBLIC = ["/"];

// Pages d'authentification : accessibles sans connexion,
// mais si l'utilisateur est connecté → on le redirige vers son espace
const AUTH_PAGES = [
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

  const isAlwaysPublic = ALWAYS_PUBLIC.some(
    (p) => pathname === p
  );

  const isAuthPage = AUTH_PAGES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  // ── 3. Page toujours publique "/" → laisser passer tout le monde ─────────
  // (le smart redirect est géré côté client dans le bouton CTA)
  if (isAlwaysPublic) {
    return NextResponse.next();
  }

  // ── 4. Utilisateur NON connecté ──────────────────────────────────────────
  if (!token) {
    if (isAuthPage) {
    // Page d'auth accessible → OK
      return NextResponse.next();
    }
    // Page privée → redirection vers /login avec paramètre de retour
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 5. Utilisateur CONNECTÉ sur une page d'auth → redirection selon rôle ─
  if (isAuthPage) {
    if (role === "auteur") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Lecteur ou rôle inconnu → bibliothèque
    return NextResponse.redirect(new URL("/bibliotheque", request.url));
  }

  // ── 6. Protection du dashboard : auteurs uniquement ──────────────────────
  if (pathname.startsWith("/dashboard") && role !== "auteur") {
    return NextResponse.redirect(new URL("/bibliotheque", request.url));
  }

  // ── 7. Toutes les autres pages privées sont accessibles → OK ─────────────
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};