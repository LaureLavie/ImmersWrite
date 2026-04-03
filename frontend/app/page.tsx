"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Image from "next/image";
import LogoIW from "../public/LogoIW.svg";
import { getAuthToken, getAuthRole } from "@/lib/auth/cookies";
import "@/styles/global.css";
import "@/styles/welcome.css";
import AlphaTesterSection from "@/components/AlphaTesterSection";

export default function WelcomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!getAuthToken());
  }, []);

  const handleCTA = () => {
    const token = getAuthToken();
    const role = getAuthRole();

    if (token) {
      if (role === "auteur") {
        router.push("/dashboard");
      } else {
        router.push("/bibliotheque");
      }
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="welcome-page">

      

      {/* ── Hero ── */}
      <section className="welcome-hero">
        <div className="welcome-hero-glow" aria-hidden="true" />

        <div className="welcome-logo-container">
          <Image
            src={LogoIW}
            alt="Logo Immers'Write"
            width={140}
            height={140}
            priority
            className="welcome-logo-img"
          />
        </div>

        <h1 className="welcome-title">Immers'Write</h1>

        <div className="welcome-tagline-row">          
          <p className="welcome-tagline-text">where words become worlds</p>          
        </div>
      </section>


      {/* ── Manifeste ── */}
      <section className="welcome-manifeste">
        <p className="welcome-manifeste-text">
          Dans un monde numérique saturé, Immers'Write est un refuge.
          <br />
          Une plateforme de storytelling augmenté
          <br /> qui marie littérature
          et intelligence artificielle générative
          <br /> pour que chaque histoire
          <br /> devienne une expérience immersive : on lit, on voit, on entend.
        </p>
      </section>

      {/* ── Deux propositions de valeur ── */}
      <section className="welcome-propositions">
        <div className="welcome-card">
          <div className="welcome-card-header">
            <h2 className="welcome-card-title">Pour le Passeur</h2>
          </div>
          <blockquote className="welcome-card-quote">
            "Tu ne lis pas des histoires. Tu les vis."
            <br /> Une expérience immersive chapitre par chapitre 
            <br /> — les images générées par IA, les ambiances sonores et les mots de l'auteur se fondent
            en un seul voyage immersif. Pour retrouver du sens et de la profondeur.
          </blockquote>         
          <ul className="welcome-card-features">
            <li>✦ Lecture immersive avec visuels IA</li>
            <li>✦ Ambiances sonores intégrées</li>
            <li>✦ Commentaires émotionnels, pas des likes</li>
          </ul>
        </div>

        <div className="welcome-card">
        <AlphaTesterSection />
        </div>
      </section>


      {/* ── Citation / vision ── */}
      <section className="welcome-vision">
        <p className="welcome-vision-text">
          Immers'Write n'est pas une plateforme de plus.
          <br /> C'est un seuil, un espace protégé,
          <br /> Une invitation à l'immersion dans les histoires.
        </p>
      </section>

      {/* ── CTA principal ── */}
      <section className="welcome-cta-section">
        <button
          className="welcome-cta-btn"
          onClick={handleCTA}
          aria-label="Accéder à Immers'Write"
        >
          <span className="welcome-cta-glow" aria-hidden="true" />
          <span className="welcome-cta-label">Franchir le seuil</span>
        </button>
      </section>

      {/* ── Contexte projet (alpha) ── */}
      <section className="welcome-alpha-banner">
        <p>
          <span className="welcome-alpha-badge">Phase Alpha · Juin 2026</span><br/>
          Immers'Write est actuellement en cours de développement.
          <br/>Suis l'aventure sur{" "}
          <a
            href="https://immerswrite.blogspot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            le blog
          </a>{" "}
          ou{" "}
          <a
            href="https://www.linkedin.com/in/immerswrite"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            LinkedIn
          </a>.
        </p>
      </section>
     <Footer />
    </div>
  );
}