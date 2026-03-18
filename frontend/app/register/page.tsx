"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoIW from "../../public/LogoIW.svg";
import IWgold from "../../public/IWgold.webp";
import "@/styles/global.css";
import "@/styles/auth.css";
import "@/styles/responsive.css";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirm: "",
    role: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors: Record<string, string> = {};

    // Validation des champs
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = "Les mots de passe ne correspondent pas";
    }

    if (!formData.role) {
      newErrors.role = "Veuillez choisir un rôle";
    }

    // Si des erreurs sont détectées, les afficher et arrêter l'exécution
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
  
    // Envoi des données au backend
    try {
      const API = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          password_confirm: formData.password_confirm,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Une erreur est survenue");
      }

      // Redirection après succès
      router.push("/register/confirmation");
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Une erreur est survenue",
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
            {errors.email && <p className="error">{errors.email}</p>}

            {/* Mot de passe */}
            <label htmlFor="password">Votre Mot de Passe</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              className="input"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={isLoading}
            />
            {errors.password && <p className="error">{errors.password}</p>}


            {/* Confirmation du mot de passe */}
            <label htmlFor="passwordConfirm">Confirmer votre mot de passe</label>
            <input
              id="passwordConfirm"
              type="password"
              placeholder="********"
              className="input"
              value={formData.password_confirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, password_confirm: e.target.value })
              }
              disabled={isLoading}
            />
            {errors.password_confirm && <p className="error">{errors.password_confirm}</p>}


            {/* Rôle */}
            <div className="role">
              <label className="label-choice">Je souhaite rejoindre en tant que ...</label>
              <div className="btn-group">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "lecteur" })}
                  className={formData.role === "lecteur" ? "btn-gold" : "btn-choice"}
                  disabled={isLoading}
                >
                  Lecteur
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "auteur" })}
                  className={formData.role === "auteur" ? "btn-gold" : "btn-choice"}
                  disabled={isLoading}
                >
                  Auteur
                </button>
              </div>
              {errors.role && <p className="error">{errors.role}</p>}
            </div>

            {/* Erreurs générales */}
            {errors.general && (
              <div className="errors">
                <p>{errors.general}</p>
              </div>
            )}

            {/* Bouton de soumission */}
            <div className="button-container">
              <button type="submit" disabled={isLoading} className="btn-gold">
                {isLoading ? "Création en cours..." : "Entrez dans l'univers"}
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