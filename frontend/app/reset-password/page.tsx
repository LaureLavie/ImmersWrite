"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import LogoIW from "../../public/LogoIW.svg";
import IWgold from "../../public/IWgold.webp";
import "@/styles/global.css";
import "@/styles/auth.css";
import "@/styles/responsive.css";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({ password: "", passwordConfirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrors({ general: "Lien invalide ou expiré. Refais une demande de réinitialisation." });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors: Record<string, string> = {};

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          new_password: formData.password,
          new_password_confirm: formData.passwordConfirm,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Le lien est invalide ou expiré.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Une erreur est survenue.",
      });
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
              <h1>Mot de passe réinitialisé</h1>
              <p style={{ color: "var(--lunar)", textAlign: "center", lineHeight: "1.8", marginTop: "1rem" }}>
                Ton mot de passe a été mis à jour. Tu vas être redirigé vers la connexion...
              </p>
              <div className="footer_link" style={{ marginTop: "2rem" }}>
                <p>
                  <a href="/login" className="link">→ Connexion</a>
                </p>
              </div>
            </>
          ) : (
            <>
              <h1>Nouveau mot de passe</h1>

              <form onSubmit={handleSubmit}>
                <label htmlFor="password">Nouveau mot de passe</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  className="input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
                {errors.password && <p style={{ color: "var(--amber)", fontSize: "14px" }}>{errors.password}</p>}

                <label htmlFor="passwordConfirm" style={{ marginTop: "1rem" }}>Confirmer le mot de passe</label>
                <input
                  id="passwordConfirm"
                  type="password"
                  placeholder="••••••••••••"
                  className="input"
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  disabled={isLoading}
                />
                {errors.passwordConfirm && <p style={{ color: "var(--amber)", fontSize: "14px" }}>{errors.passwordConfirm}</p>}

                {errors.general && (
                  <div className="errors">
                    <p>{errors.general}</p>
                  </div>
                )}

                <div className="button-container">
                  <button type="submit" disabled={isLoading || !token} className="btn-gold">
                    {isLoading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
                  </button>
                </div>
              </form>

              <div className="footer_link">
                <p>
                  <a href="/forgot-password" className="link">← Refaire une demande</a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}