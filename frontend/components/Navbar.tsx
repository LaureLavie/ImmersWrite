'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/navbar.css";
import "@/styles/responsive.css";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    
    localStorage.removeItem("token");
    
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <ul className="navlist">
        <li>
          <button onClick={() => router.push("/login")} className="btn-gold">
            Connexion
          </button>
        </li>
        <li>
          <button onClick={() => router.push("/")} className="btn-choice">
            Bibliothèque
          </button>
        </li>
        <li>
          <button onClick={handleLogout} className="btn-logout">
            Déconnexion
          </button>
        </li>
      </ul>
    </nav>
  );
}
