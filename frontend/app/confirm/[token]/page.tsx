"use client";


import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ConfirmPageProps {
  params: Promise<{ token: string }>;
}

export default function ConfirmPage({ params }: ConfirmPageProps) {
  const { token } = use(params); 
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    async function confirmAccount() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API_URL}/confirm/${token}`);

        if (response.ok) {
          router.push("/login?message=confirmed");
        } else {
          const data = await response.json();
          console.error("Erreur confirmation :", data.detail);
          router.push("/login?message=confirm-error");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
        router.push("/login?message=confirm-error");
      }
    }

    confirmAccount();
  }, [token, router]);

  return (
    <main style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <p style={{ fontSize: "1.2rem", color: "var(--lunar)" }}>
        ✦ Confirmation de ton compte en cours...
      </p>
    </main>
  );
}