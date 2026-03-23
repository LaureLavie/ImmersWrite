"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LogoIW from "../public/LogoIW.svg";
import IWgold from "../public/IWgold.webp";
import { getAuthToken, getAuthRole } from "@/lib/auth/cookies";
import "@/styles/global.css";
import "@/styles/welcome.css";

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

      {/* ── Navigation minimale ── */}
      <nav className="welcome-nav">
        <div className="welcome-nav-logo">
          <Image src={LogoIW} alt="Logo Immers'Write" width={36} height={36} priority />
          <span className="welcome-nav-brand">Immers'Write</span>
        </div>
        {mounted && (
          <div className="welcome-nav-links">
            {isLoggedIn ? (
              <Link href={getAuthRole() === "auteur" ? "/dashboard" : "/bibliotheque"} className="welcome-nav-link">
                Mon espace →
              </Link>
            ) : (
              <Link href="/login" className="welcome-nav-link">
                Se connecter
              </Link>
            )}
          </div>
        )}
      </nav>

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
          <Image src={IWgold} alt="Plume dorée" width={28} height={28} />
          <p className="welcome-tagline-text">where words become worlds</p>
          <Image src={IWgold} alt="Plume dorée" width={28} height={28} className="welcome-tagline-flip" />
        </div>

        <p className="welcome-subtitle">
          Au seuil de deux mondes — là où l'imagination de l'auteur
          <br />rencontre la sensibilité du lecteur.
        </p>
      </section>

      {/* ── Séparateur décoratif ── */}
      <div className="welcome-divider" aria-hidden="true">
        <span>✦</span>
      </div>

      {/* ── Manifeste ── */}
      <section className="welcome-manifeste">
        <p className="welcome-manifeste-text">
          Dans un monde numérique saturé, Immers'Write est un refuge.
          Une plateforme de <em>storytelling augmenté</em> qui marie littérature
          et intelligence artificielle générative — pour que chaque histoire
          devienne une expérience multisensorielle : texte, image, son.
        </p>
      </section>

      {/* ── Deux propositions de valeur ── */}
      <section className="welcome-propositions">
        <div className="welcome-card">
          <div className="welcome-card-header">
            <span className="welcome-card-symbol">📖</span>
            <h2 className="welcome-card-title">Pour le Passeur</h2>
            <span className="welcome-card-role">Lecteur</span>
          </div>
          <blockquote className="welcome-card-quote">
            "Tu ne lis pas des histoires. Tu les <em>vis</em>."
          </blockquote>
          <p className="welcome-card-desc">
            Une expérience immersive chapitre par chapitre — les images générées
            par IA, les ambiances sonores et les mots de l'auteur se fondent
            en un seul voyage sensoriel. Pour retrouver du sens et de la profondeur.
          </p>
          <ul className="welcome-card-features">
            <li>✦ Lecture immersive avec visuels IA</li>
            <li>✦ Ambiances sonores intégrées</li>
            <li>✦ Commentaires émotionnels, pas des likes</li>
          </ul>
        </div>

        <div className="welcome-card welcome-card-artiste">
          <div className="welcome-card-header">
            <span className="welcome-card-symbol">✍️</span>
            <h2 className="welcome-card-title">Pour l'Artiste</h2>
            <span className="welcome-card-role">Auteur</span>
          </div>
          <blockquote className="welcome-card-quote">
            "Tu n'écris pas seulement des histoires,
            <br />tu explores des <em>mondes</em>."
          </blockquote>
          <p className="welcome-card-desc">
            Un atelier tout-en-un pour donner vie à ton univers nativement.
            Génère des illustrations avec DALL·E, importe tes ambiances sonores,
            publie tes chapitres — sans jongler entre dix outils.
          </p>
          <ul className="welcome-card-features">
            <li>✦ Éditeur de texte épuré</li>
            <li>✦ Génération d'images IA intégrée</li>
            <li>✦ Import de médias (sons, images)</li>
          </ul>
        </div>
      </section>

      {/* ── Séparateur ── */}
      <div className="welcome-divider" aria-hidden="true">
        <span>◇</span>
      </div>

      {/* ── Citation / vision ── */}
      <section className="welcome-vision">
        <p className="welcome-vision-text">
          Immers'Write n'est pas une plateforme de plus.
          <br />C'est un <strong>seuil</strong>, un <strong>espace protégé</strong>,
          une <strong>invitation au voyage intérieur</strong>.
        </p>
        <p className="welcome-vision-sub">
          "Le code est le corps, l'imagination est l'âme."
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
          <span className="welcome-cta-arrow">→</span>
        </button>

        {mounted && !isLoggedIn && (
          <p className="welcome-cta-hint">
            Déjà de l'autre côté ?{" "}
            <Link href="/login" className="link">
              Se connecter
            </Link>
          </p>
        )}

        {mounted && isLoggedIn && (
          <p className="welcome-cta-hint">
            Tu es déjà connecté·e. Bienvenue de retour ✦
          </p>
        )}
      </section>

      {/* ── Contexte projet (alpha) ── */}
      <section className="welcome-alpha-banner">
        <p>
          <span className="welcome-alpha-badge">Phase Alpha · Juin 2026</span>
          Immers'Write est actuellement en développement actif.
          Suis l'aventure sur{" "}
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

      {/* ── Footer ── */}
      <footer className="welcome-footer">
        <p>© 2026 Immers'Write — Laure Lavie</p>
        <p className="welcome-footer-sub">
          <em>"Le code est le corps, l'imagination est l'âme."</em>
        </p>
      </footer>
    </div>
  );
}