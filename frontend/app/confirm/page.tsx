"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ConfirmToken() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [message, setMessage] = useState("Confirmation en cours...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const confirm = async () => {
      if (!token) {
        setError(true);
        setMessage("Lien de confirmation invalide.");
        return;
      }
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

    confirm();
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

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ConfirmToken />
    </Suspense>
  );
}