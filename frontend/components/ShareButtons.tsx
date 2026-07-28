// frontend/components/ShareButtons.tsx
"use client";
import { useState } from "react";
import "@/styles/share-buttons.css";

interface ShareButtonsProps {
  url: string;
  title: string;
  variant?: "chapter" | "book";
}

export default function ShareButtons({ url, title, variant = "chapter" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const shareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
    window.open(fbUrl, "_blank", "width=580,height=520");
  };

  const shareLinkedIn = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
    window.open(liUrl, "_blank", "width=580,height=520");
  };

  const shareInstagram = async () => {
    // Instagram ne propose pas d'intent web → on copie le lien
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback silencieux
    }
  };

  return (
    <div className={`share-buttons share-buttons-${variant}`}>
      <span className="share-buttons-label">
        {variant === "chapter" ? "Partager ce chapitre" : "Partager cette histoire"}
      </span>

      <div className="share-buttons-row">
        <button
          type="button"
          className="share-btn share-btn-facebook"
          onClick={shareFacebook}
          aria-label="Partager sur Facebook"
          title="Partager sur Facebook"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </button>

        <button
          type="button"
          className="share-btn share-btn-linkedin"
          onClick={shareLinkedIn}
          aria-label="Partager sur LinkedIn"
          title="Partager sur LinkedIn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </button>

        <button
          type="button"
          className="share-btn share-btn-instagram"
          onClick={shareInstagram}
          aria-label="Copier le lien pour Instagram"
          title="Copier le lien (Instagram ne permet pas le partage direct)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
          </svg>
        </button>
      </div>

      {copied && (
        <span className="share-buttons-copied">Lien copié ✦ colle-le dans ta story</span>
      )}
    </div>
  );
}