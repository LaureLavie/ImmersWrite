"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ConfirmPage({ params }: { params: { token: string } }) {
  const router = useRouter();

  useEffect(() => {
    async function confirmAccount() {
      try {
        const response = await fetch(`http://localhost:8000/confirm/${params.token}`);
        if (response.ok) {
          router.push("/login");
        } else {
          console.error("Erreur lors de la confirmation");
        }
      } catch (error) {
        console.error(error);
      }
    }
    confirmAccount();
  }, [params.token, router]);

  return <div>Confirmation en cours...</div>;
}