

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {  
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail ?? "Erreur de connexion");
  }

  return response.json();
};

export const register = async (
  email: string,
  password: string,
  passwordConfirm: string,
  role: string,
) => {
  const response = await fetch(`${API_URL}/register`, {  
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      password_confirm: passwordConfirm, 
      role,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail ?? "Erreur d'inscription");
  }

  return response.json();
};

export const logout = async (token: string) => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la déconnexion");
  }

  return response.json();
};