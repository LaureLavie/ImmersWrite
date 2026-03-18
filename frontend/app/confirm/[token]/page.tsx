"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ConfirmPage() {
  const { token } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("Confirmation en cours...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const confirm = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API}/confirm/${token}`);
        const data = await response.json();
        if (response.ok) {
          setMessage("✅ Compte confirmé ! Redirection...");
          setTimeout(() => router.push("/login?message=confirmed"), 2000);
        } else {
          setError(true);
          setMessage(data.detail || "Lien invalide ou expiré.");
        }
      } catch {
        setError(true);
        setMessage("Une erreur est survenue.");
      }
    };

    if (token) confirm();
  }, [token, router]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <p style={{ color: error ? "red" : "green", fontSize: "1.2rem" }}>
        {message}
      </p>
    </div>
  );
}