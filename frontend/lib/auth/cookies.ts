const TOKEN_KEY = "access_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; 


export function saveAuthToken(token: string, role?: string): void {
  if (typeof window === "undefined") return; 


  localStorage.setItem(TOKEN_KEY, token);
  if (role) {
    localStorage.setItem("user_role", role);
  }


  const isProduction = process.env.NODE_ENV === "production";
  const secureFlag = isProduction ? "; Secure" : "";

  document.cookie = [
    `${TOKEN_KEY}=${encodeURIComponent(token)}`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    "Path=/",
    "SameSite=Lax",
    secureFlag,
  ]
    .filter(Boolean)
    .join("; ");


  if (role) {
    document.cookie = [
      `user_role=${encodeURIComponent(role)}`,
      `Max-Age=${COOKIE_MAX_AGE}`,
      "Path=/",
      "SameSite=Lax",
      secureFlag,
    ]
      .filter(Boolean)
      .join("; ");
  }
}


export function clearAuthToken(): void {
  if (typeof window === "undefined") return;

 
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("user_role");


  document.cookie = `${TOKEN_KEY}=; Max-Age=0; Path=/`;
  document.cookie = `user_role=; Max-Age=0; Path=/`;
}


export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}


export function getUserRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_role");
}


export function isAuthenticated(): boolean {
  return !!getAuthToken();
}