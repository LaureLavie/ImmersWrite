"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import LogoIW from "../../public/LogoIW.svg";
import IWgold from "../../public/IWgold.webp";
import { saveAuthToken } from "@/lib/auth/cookies";
import PasswordInput from "@/components/PasswordInput";
import "@/styles/global.css";
import "@/styles/auth.css";
import "@/styles/responsive.css";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();


  const message = searchParams.get("message");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors: Record<string, string> = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "L'email n'est pas valide";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Email ou mot de passe incorrect");
      }

      const data = await response.json();
      saveAuthToken(data.access_token, data.role);


      if (data.role === "auteur") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }

    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Une erreur est survenue",
      });
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
          <h1>Franchir le seuil</h1>


          {message === "check-email" && (
            <div style={{
              background: "rgba(179, 136, 57, 0.1)",
              border: "1px solid var(--amber)",
              borderRadius: "20px",
              padding: "1rem 1.5rem",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}>
              <p style={{ color: "var(--amber)", fontSize: "14px", margin: 0, lineHeight: "1.8" }}>
                📬 Inscription réussie ! Vérifie ta boîte mail pour activer ton compte avant de te connecter.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Votre Email</label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              className="input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
            />
            {errors.email && <p>{errors.email}</p>}


            <PasswordInput
              id="password"
              label="Votre Mot de Passe"
              value={formData.password}
              onChange={(v) => setFormData({ ...formData, password: v })}
              disabled={isLoading}
              error={errors.password}
            />

            {errors.general && (
              <div className="errors"><p>{errors.general}</p></div>
            )}

            <div className="button-container">
              <button type="submit" disabled={isLoading} className="btn-gold">
                {isLoading ? "connexion en cours..." : "Entrez dans l'univers"}
              </button>
            </div>
          </form>

          <div className="footer_link">
            <p>
              Première fois ici ?{" "}
              <a href="/register" className="link">Rejoindre l'aventure</a>
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              <a href="/forgot-password" className="link">Mot de passe oublié ?</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}