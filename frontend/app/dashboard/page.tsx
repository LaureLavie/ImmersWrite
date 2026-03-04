"use client";

import Navbar from "@/components/Navbar";
import "@/styles/global.css";
import "@/styles/responsive.css";

export default function DashboardPage() {
  return (
    <div>
      <Navbar />
      <main style={{
        minHeight: "80dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        padding: "2rem",
      }}>
        <h1 style={{
          fontFamily: "var(--font-title)",
          fontSize: "2.5rem",
          background: "var(--gradient-gold)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textAlign: "center",
          fontWeight: 500,
        }}>
          L'Atelier de l'Artiste
        </h1>

        <p style={{
          color: "var(--lunar)",
          fontFamily: "var(--font-body)",
          fontSize: "1rem",
          textAlign: "center",
          maxWidth: "500px",
          lineHeight: "1.8",
          opacity: 0.7,
        }}>
          Ton espace de création. Chaque mot est un monde qui prend vie.
        </p>

        {/* Carte squelette — à compléter avec les vraies features sprint 2 */}
        <div className="card" style={{ maxWidth: "500px", width: "100%", textAlign: "center" }}>
          <p style={{ color: "var(--amber)", fontFamily: "var(--font-body)", fontSize: "0.9rem", opacity: 0.6 }}>
            ✦ L'atelier ouvre ses portes en avril ✦
          </p>
          <p style={{ color: "var(--lunar)", fontSize: "0.85rem", marginTop: "1rem", lineHeight: "1.8" }}>
            Bientôt : créer ton projet, écrire tes chapitres, générer des images avec l'IA.
          </p>
        </div>
      </main>
    </div>
  );
}