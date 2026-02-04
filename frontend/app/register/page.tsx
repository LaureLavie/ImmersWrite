"use client";

import { useState } from "react";
import Image from "next/image";
import LogoIW from "../../public/LogoIW.png";
import "@/styles/global.css";


export default function RegisterPage() {
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

    // Validation côté client
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "l'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "l'email n'est pas valide";
    }

    if (!formData.password) {
      newErrors.password = "le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "le mot de passe doit contenir au moins 8 caractères";
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "les mots de passe ne correspondent pas";
    }

    if (!formData.role) {
      newErrors.role = "veuillez choisir un rôle";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          password_confirm: formData.passwordConfirm,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "une erreur est survenue");
      }

      // Redirection vers la page de connexion ou dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "une erreur est survenue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    

      {/* Main container */}
      <div className="w-100dvw">
        {/* Logo */}
        <div className="flex justify-center mb-12 animate-fade-in">
          <div className="relative w-32 h-32 animate-glow">
            <Image src={LogoIW} alt="Logo Immers'Write" />
          </div>
        </div>

        {/* Card */}
        <div
          className="relative p-8 rounded-3xl animate-slide-up"
          style={{
            background: "rgba(19, 15, 59, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(179, 136, 57, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            animationDelay: "0.2s",
            animationFillMode: "both",
          }}
        >
          {/* Title */}
          <h1
            style={{ fontFamily: "var(--font-title)", fontSize: "3rem", lineHeight: "1.6" }}
          >
            franchir le seuil
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm text-lunar/80 tracking-wide">
                votre email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="votre@email.com"
                className="w-80% px-6 py-3 midnight/50 border border-amber/30 rounded-full 
                         text-lunar placeholder:text-lunar/40 
                         focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/50
                         transition-all duration-300"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-amber text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm text-lunar/80 tracking-wide">
                votre mot de passe
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••••••"
                className="w-80% px-6 py-3 midnight/50 border border-amber/30 rounded-full 
                         text-lunar placeholder:text-lunar/40
                         focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/50
                         transition-all duration-300"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-amber text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm text-lunar/80 tracking-wide">
                confirmer votre mot de passe
              </label>
              <input
                type="password"
                value={formData.passwordConfirm}
                onChange={(e) =>
                  setFormData({ ...formData, passwordConfirm: e.target.value })
                }
                placeholder="••••••••••••"
                className="w-80% px-6 py-3 midnight/50 border border-amber/30 rounded-full 
                         text-lunar placeholder:text-lunar/40
                         focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/50
                         transition-all duration-300"
                disabled={isLoading}
              />
              {errors.passwordConfirm && (
                <p className="text-amber text-xs mt-1">
                  {errors.passwordConfirm}
                </p>
              )}
            </div>

            {/* Role selection */}
            <div className="space-y-3">
              <label className="block text-sm text-lunar/80 tracking-wide text-center">
                je souhaite rejoindre en tant que ...
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "lecteur" })}
                  className={`btn-gold
                    ${
                      formData.role === "lecteur"
                        ? "midnight"
                        : "bg-transparent border-amber/30 text-lunar/60 hover:border-amber/60"
                    }`}
                  disabled={isLoading}
                >
                  lecteur
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "auteur" })}
                  className={`btn-gold
                    ${
                      formData.role === "auteur"
                        ? "amber"
                        : "bg-transparent border-amber/30 text-lunar/60 hover:border-amber/60"
                    }`}
                  disabled={isLoading}
                >
                  auteur
                </button>
              </div>
              {errors.role && (
                <p className="text-amber text-xs text-center mt-1">
                  {errors.role}
                </p>
              )}
            </div>

            {/* General error */}
            {errors.general && (
              <div className="p-4 rounded-2xl bg-amber/10 border border-amber/30">
                <p className="text-amber text-sm text-center">{errors.general}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  création en cours...
                </span>
              ) : (
                "entrez dans l'univers"
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-lunar/60">
              déjà membre ?{" "}
              <a
                href="/login"
                className="text-amber hover:text-amber-light transition-colors border-b border-amber/30 hover:border-amber"
              >
                se connecter
              </a>
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p
          className="text-center mt-8 text-lunar/40 text-sm tracking-widest animate-fade-in"
          style={{ animationDelay: "0.6s", animationFillMode: "both" }}
        >
          where words become worlds
        </p>
      </div>
    </div>
  );
}