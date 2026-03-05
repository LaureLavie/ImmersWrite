"use client";

import Cookies from "js-cookie";

const TOKEN_KEY = "access_token";
const ROLE_KEY = "user_role";
const TOKEN_EXPIRY_DAYS = 1;

// true en production (HTTPS), false en local (HTTP)
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export function saveAuthToken(token: string, role: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: TOKEN_EXPIRY_DAYS,
    sameSite: "lax",
    secure: IS_PRODUCTION,
  });
  Cookies.set(ROLE_KEY, role, {
    expires: TOKEN_EXPIRY_DAYS,
    sameSite: "lax",
    secure: IS_PRODUCTION,
  });
}

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function getAuthRole(): string | undefined {
  return Cookies.get(ROLE_KEY);
}

export function removeAuthToken(): void {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
}

export function isAuthenticated(): boolean {
  return !!Cookies.get(TOKEN_KEY);
}