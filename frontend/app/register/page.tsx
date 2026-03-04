"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoIW from "../../public/LogoIW.svg";
import IWgold from "../../public/IWgold.webp";
import PasswordInput from "@/components/PasswordInput";
import "@/styles/global.css";
import "@/styles/auth.css";
import "@/styles/responsive.css";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    role: "",
  });
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

    if (formData.password !== formData.passwordConfirm)
      newErrors.passwordConfirm = "Les mots de passe ne correspondent pas";

    if (!formData.role)
      newErrors.role = "Veuillez choisir un rôle";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          password_confirm: formData.passwordConfirm,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Une erreur est survenue");
      }

      router.push("/login?message=check-email");

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

          <form onSubmit={handleSubmit}>
            {/* Email */}
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

            <PasswordInput
              id="passwordConfirm"
              label="Confirmer Votre Mot de Passe"
              value={formData.passwordConfirm}
              onChange={(v) => setFormData({ ...formData, passwordConfirm: v })}
              disabled={isLoading}
              error={errors.passwordConfirm}
            />

      
            <div className="role">
              <label className="label-choice">Je souhaite rejoindre en tant que ...</label>
              <div className="btn-group">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "lecteur" })}
                  className={formData.role === "lecteur" ? "btn-role-active" : "btn-choice"}
                  disabled={isLoading}
                >
                  Lecteur
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "auteur" })}
                  className={formData.role === "auteur" ? "btn-role-active" : "btn-choice"}
                  disabled={isLoading}
                >
                  Auteur
                </button>
              </div>
              {errors.role && <p>{errors.role}</p>}
            </div>

            {errors.general && (
              <div className="errors"><p>{errors.general}</p></div>
            )}

            <div className="button-container">
              <button type="submit" disabled={isLoading} className="btn-gold">
                {isLoading ? "création en cours..." : "Entrez dans l'univers"}
              </button>
            </div>
          </form>

          <div className="footer_link">
            <p>
              Déjà franchi ?{" "}
              <a href="/login" className="link">Reprendre la traversée</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}