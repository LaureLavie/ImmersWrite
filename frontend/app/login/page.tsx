"use client";

import { useState } from "react";
import Image from "next/image";
import LogoIW from "../../public/LogoIW.png";
import IWgold from "../../public/IWgold.png";
import "@/styles/global.css";
import "@/styles/login.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors: Record<string, string> = {};

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
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,          
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Une erreur est survenue");
      }

      window.location.href = "/home";
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-container">
        <div className="logo-section ">
        {/* Logo */}
          <div className="LogoIW">
            <Image src={LogoIW} alt="Logo Immers'Write" />
          </div>
        {/* Tagline */}
          <div className="tagline">
            <Image src={IWgold} alt="Plume Immers'Write" />
            <p>
              where words become worlds
            </p>
          </div>
      </div>

      </div>
      <div className="right-container">
        {/* Card */}
        <div className="card">
          <h1>Franchir le seuil</h1>

          <form onSubmit={handleSubmit} className="p-0">
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
              {errors.email && (
                <p>{errors.email}</p>
              )}
            

            {/* Password Input */}

              <label htmlFor="password">Votre Mot de Passe</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                className="input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
              {errors.password && (
                <p>{errors.password}</p>
              )} 
            

            {/* General error message */}
            {errors.general && (
              <div className="errors">
                <p>{errors.general}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold"
            >
              {isLoading ? "connexion en cours..." : "Entrez dans l'univers"}
            </button>
          </form>

          {/* Footer link */}
          <div className="footer_link">
            <p>
              Pas encore membre ?{" "}
              <a href="/register" className="link">
                S'inscrire
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}