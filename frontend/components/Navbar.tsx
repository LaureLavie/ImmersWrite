'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import LogoIW from "../public/LogoIW.svg";
import LogoutButton from "@/components/LogoutButton";
import "@/styles/navbar.css";
import "@/styles/responsive.css";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <Link href="/" className="logo-link">
        <div className="LogoIW">
          <Image src={LogoIW} alt="Logo Immers'Write" width={50} height={50} priority />
        </div>
      </Link>

      <div className="spacer"></div>

      <button className="burger-menu" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={32} color="#B38839" /> : <Menu size={32} color="#B38839" />}
      </button>

      <ul className={`navlist ${isOpen ? "active" : ""}`}>
        {isOpen && (
          <li className="mobile-close-container">
            <X size={32} color="#B38839" onClick={closeMenu} />
          </li>
        )}

        <li>
          <Link href="/dashboard" className="navlink" onClick={closeMenu}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/" className="navlink" onClick={closeMenu}>
            Bibliothèque
          </Link>
        </li>
        <li>
          <LogoutButton className="btn-logout" label="Déconnexion" />
        </li>
      </ul>
    </nav>
  );
}