"use client";

import { useState } from "react";
import Image from "next/image";
import LogoIW from "../../public/LogoIW.svg";
import IWgold from "../../public/IWgold.webp";
import "@/styles/global.css";
import "@/styles/auth.css";
import "@/styles/responsive.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setSuccess(true);
    } catch {
      setError("Une erreur est survenue. Réessaie dans un instant.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="left-container">
        <div className="logo-section">
          <div className="LogoIW">
            <Image src={LogoIW} alt="Logo Immers'Write" loading="eager" />
          </div>
          <div className="tagline">
            <Image src={IWgold} alt="Plume Immers'Write" loading="eager" />
            <p>where words become worlds</p>
          </div>
        </div>
      </div>

      <div className="right-container">
        <div className="card">
          {success ? (
            <>
              <h1>Vérifie ta boîte mail</h1>
              <p style={{ color: "var(--lunar)", textAlign: "center", lineHeight: "1.8", marginTop: "1rem" }}>
                Si cet email existe dans notre univers, un lien de réinitialisation t'a été envoyé.
              </p>
              <p style={{ color: "rgba(235,235,235,0.5)", textAlign: "center", fontSize: "14px", marginTop: "1rem" }}>
                Le lien est valable 1 heure.
              </p>
              <div className="footer_link" style={{ marginTop: "2rem" }}>
                <p>
                  <a href="/login" className="link">← Retour à la connexion</a>
                </p>
              </div>
            </>
          ) : (
            <>
              <h1>Retrouver son chemin</h1>

              <form onSubmit={handleSubmit}>
                <label htmlFor="email">Ton adresse email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                {error && (
                  <div className="errors">
                    <p>{error}</p>
                  </div>
                )}

                <div className="button-container">
                  <button type="submit" disabled={isLoading} className="btn-gold">
                    {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                  </button>
                </div>
              </form>

              <div className="footer_link">
                <p>
                  Tu te souviens ?{" "}
                  <a href="/login" className="link">Retour à la connexion</a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}