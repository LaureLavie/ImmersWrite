'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'lecteur' | 'auteur'>('lecteur');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('tous les champs sont requis');
      return;
    }

    if (password !== confirmPassword) {
      setError('les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      setError('le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          user_type: userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'erreur lors de l\'inscription');
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                >
                  lecteur
                </button>
                <button
                  type="button"
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
                >
                  auteur
                </button>
              </div>

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
  );
}