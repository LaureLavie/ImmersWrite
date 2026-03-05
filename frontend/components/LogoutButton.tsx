"use client";

import { useRouter } from "next/navigation";
import { getAuthToken, removeAuthToken } from "@/lib/auth/cookies";
import { logout } from "@/lib/api/auth";

interface LogoutButtonProps {
  className?: string;
  label?: string;
}

export default function LogoutButton({
  className = "btn-gold",
  label = "Se déconnecter",
}: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = getAuthToken();
      if (token) {
        await logout(token); 
      }
    } catch {
      
    } finally {
      removeAuthToken(); 
      router.push("/login");  
    }
  };

  return (
    <button onClick={handleLogout} className={className}>
      {label}
    </button>
  );
}