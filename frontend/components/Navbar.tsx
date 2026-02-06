'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/navbar.css";

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
            Se connecter
          </button>
        </li>
        <li>
          <Link href="/library" className="navlink">
            Bibliothèque
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="btn-choice">
            Déconnexion
          </button>
        </li>
      </ul>
    </nav>
  );
}
