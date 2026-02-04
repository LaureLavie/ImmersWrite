export const register = async (email: string, password: string, passwordConfirm: string, role: string) => {
  const response = await fetch("http://localhost:8000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, passwordConfirm, role }),
  });

  if (!response.ok) {
    throw new Error("Failed to register");
  }

  return response.json();
};
