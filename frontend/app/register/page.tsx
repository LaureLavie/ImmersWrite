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
<<<<<<< HEAD
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
=======
    <>
   
      <div className="min-h-screen relative flex items-center justify-center p-6">
        {/* Décorations de fond */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 floating-decoration"
            style={{
              background: 'radial-gradient(circle, #B38839 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <div 
            className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-10 floating-decoration"
            style={{
              background: 'radial-gradient(circle, #B38839 0%, transparent 70%)',
              filter: 'blur(80px)',
              animationDelay: '-10s',
            }}
          />
        </div>

        <div className="relative w-full max-w-[420px] fade-in-up">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="inline-block relative">
              {/* Cercle avec plume */}
              <div className="w-28 h-28 mx-auto mb-6 relative">
                <svg 
                  className="absolute inset-0 w-full h-full shimmer" 
                  viewBox="0 0 120 120"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="58"
                    fill="none"
                    stroke="#B38839"
                    strokeWidth="0.8"
                    opacity="0.6"
                  />
                  <path
                    d="M 60 20 Q 50 30, 45 50 Q 40 70, 50 85 L 40 100"
                    fill="none"
                    stroke="#B38839"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60 20 Q 70 30, 65 45"
                    fill="none"
                    stroke="#B38839"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
              </div>
              
              <h1 
                className="text-[#B38839] text-[22px] tracking-[0.3em] font-light mb-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Immers'Write
              </h1>
              <p className="text-[#EBEBEB] text-[11px] tracking-[0.2em] font-light opacity-70">
                where words become worlds
              </p>
            </div>
          </div>

          {/* Card principale */}
          <div 
            className="relative backdrop-blur-sm p-10"
            style={{
              background: 'rgba(19, 15, 59, 0.6)',
              border: '1px solid rgba(179, 136, 57, 0.25)',
              borderRadius: '32px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2 
              className="text-[#B38839] text-center text-[26px] tracking-[0.15em] font-light mb-10"
              style={{ 
                fontFamily: "'Cinzel', serif",
                textTransform: 'uppercase',
                fontSize: '18px',
                letterSpacing: '0.3em',
              }}
            >
              Franchir le seuil
            </h2>

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email */}
              <div>
                <label 
                  htmlFor="email"
                  className="block text-[#EBEBEB] text-[13px] mb-2.5 font-light"
                  style={{ fontWeight: 300 }}
                >
                  votre email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  disabled={isLoading}
                  className="w-full bg-transparent text-[#EBEBEB] placeholder-[#EBEBEB]/40 px-6 py-3.5 text-[15px] font-light"
                  style={{
                    border: '1px solid rgba(179, 136, 57, 0.35)',
                    borderRadius: '50px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#B38839'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(179, 136, 57, 0.35)'}
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label 
                  htmlFor="password"
                  className="block text-[#EBEBEB] text-[13px] mb-2.5 font-light"
                  style={{ fontWeight: 300 }}
                >
                  votre mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full bg-transparent text-[#EBEBEB] placeholder-[#EBEBEB]/40 px-6 py-3.5 text-[15px] font-light"
                  style={{
                    border: '1px solid rgba(179, 136, 57, 0.35)',
                    borderRadius: '50px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#B38839'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(179, 136, 57, 0.35)'}
                />
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label 
                  htmlFor="confirmPassword"
                  className="block text-[#EBEBEB] text-[13px] mb-2.5 font-light"
                  style={{ fontWeight: 300 }}
                >
                  confirmer votre mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full bg-transparent text-[#EBEBEB] placeholder-[#EBEBEB]/40 px-6 py-3.5 text-[15px] font-light"
                  style={{
                    border: '1px solid rgba(179, 136, 57, 0.35)',
                    borderRadius: '50px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#B38839'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(179, 136, 57, 0.35)'}
                />
              </div>

              {/* Message d'erreur */}
              {error && (
                <div 
                  className="text-[#B38839] text-[13px] text-center px-5 py-2.5 font-light"
                  style={{
                    background: 'rgba(179, 136, 57, 0.1)',
                    borderRadius: '50px',
                    border: '1px solid rgba(179, 136, 57, 0.2)',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Texte de liaison */}
              <p 
                className="text-center text-[13px] font-light italic"
                style={{ 
                  color: 'rgba(179, 136, 57, 0.7)',
                  fontWeight: 300,
                }}
              >
                je souhaite rejoindre en tant que ...
              </p>

              {/* Type d'utilisateur */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('lecteur')}
                  disabled={isLoading}
                  className="flex-1 py-3.5 text-[14px] font-light tracking-wide transition-all duration-300"
                  style={{
                    background: userType === 'lecteur' ? 'transparent' : 'transparent',
                    border: userType === 'lecteur' ? '1.5px solid rgba(179, 136, 57, 0.6)' : '1px solid rgba(179, 136, 57, 0.25)',
                    borderRadius: '50px',
                    color: userType === 'lecteur' ? '#EBEBEB' : 'rgba(179, 136, 57, 0.6)',
                    fontWeight: 300,
                  }}
>>>>>>> origin/main
                >
                  lecteur
                </button>
                <button
                  type="button"
<<<<<<< HEAD
                  onClick={() => setFormData({ ...formData, role: "auteur" })}
                  className={`btn-gold
                    ${
                      formData.role === "auteur"
                        ? "amber"
                        : "bg-transparent border-amber/30 text-lunar/60 hover:border-amber/60"
                    }`}
                  disabled={isLoading}
=======
                  onClick={() => setUserType('auteur')}
                  disabled={isLoading}
                  className="flex-1 py-3.5 text-[14px] font-light tracking-wide transition-all duration-300"
                  style={{
                    background: userType === 'auteur' ? '#B38839' : 'transparent',
                    border: userType === 'auteur' ? '1.5px solid #B38839' : '1px solid rgba(179, 136, 57, 0.25)',
                    borderRadius: '50px',
                    color: userType === 'auteur' ? '#130F3B' : 'rgba(179, 136, 57, 0.6)',
                    fontWeight: userType === 'auteur' ? 400 : 300,
                  }}
>>>>>>> origin/main
                >
                  auteur
                </button>
              </div>
<<<<<<< HEAD
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
=======

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 text-[14px] tracking-[0.1em] transition-all duration-300"
                style={{
                  background: '#B38839',
                  border: 'none',
                  borderRadius: '50px',
                  color: '#130F3B',
                  fontWeight: 400,
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
                onMouseOver={(e) => {
                  if (!isLoading) e.currentTarget.style.background = 'rgba(179, 136, 57, 0.9)';
                }}
                onMouseOut={(e) => {
                  if (!isLoading) e.currentTarget.style.background = '#B38839';
                }}
              >
                {isLoading ? 'inscription en cours...' : 'entrez dans l\'univers'}
              </button>
            </form>

            {/* Lien vers connexion */}
            <div className="mt-8 text-center">
              <p className="text-[13px] font-light" style={{ color: 'rgba(235, 235, 235, 0.5)' }}>
                vous avez déjà franchi le seuil ?{' '}
                <a
                  href="/login"
                  className="transition-colors duration-300"
                  style={{
                    color: '#B38839',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(179, 136, 57, 0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = 'rgba(179, 136, 57, 0.8)';
                    e.currentTarget.style.borderBottomColor = '#B38839';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#B38839';
                    e.currentTarget.style.borderBottomColor = 'rgba(179, 136, 57, 0.3)';
                  }}
                >
                  se connecter
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
>>>>>>> origin/main
  );
}