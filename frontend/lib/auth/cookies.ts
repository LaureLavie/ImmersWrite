"use client";

const TOKEN_KEY = "access_token";
const ROLE_KEY = "user_role";

// true en production (HTTPS), false en local (HTTP)
const IS_PROD = process.env.NODE_ENV === "production";

// ── Helpers natifs ────────────────────────────────────────────────────────────

function setCookie(name: string, value: string, days: number): void {
  // Guard SSR : document n'existe pas côté serveur
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const secure = IS_PROD ? "; Secure" : "";

  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${expires.toUTCString()}`,
    "path=/",
    "SameSite=Lax",
    secure,
  ]
    .filter(Boolean)
    .join("; ");
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const prefix = name + "=";
  for (const raw of document.cookie.split(";")) {
    const c = raw.trim();
    if (c.startsWith(prefix)) {
      return decodeURIComponent(c.slice(prefix.length));
    }
  }
  return undefined;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// ── API publique ──────────────────────────────────────────────────────────────

/** Sauvegarde le token JWT et le rôle après connexion réussie. */
export function saveAuthToken(token: string, role: string): void {
  setCookie(TOKEN_KEY, token, 1); // 1 jour = aligné sur le JWT (24h)
  setCookie(ROLE_KEY, role, 1);
}

/** Récupère le token JWT stocké. */
export function getAuthToken(): string | undefined {
  return getCookie(TOKEN_KEY);
}

/** Récupère le rôle de l'utilisateur connecté. */
export function getAuthRole(): string | undefined {
  return getCookie(ROLE_KEY);
}

/** Supprime le token et le rôle → déconnexion côté client. */
export function removeAuthToken(): void {
  deleteCookie(TOKEN_KEY);
  deleteCookie(ROLE_KEY);
}

/** true si un token est présent. */
export function isAuthenticated(): boolean {
  return !!getCookie(TOKEN_KEY);
}