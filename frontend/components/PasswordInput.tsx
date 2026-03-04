"use client";

import { useState } from "react";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export default function PasswordInput({
  id, label, placeholder = "••••••••••••",
  value, onChange, disabled = false, error,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      <label htmlFor={id}>{label}</label>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{ paddingRight: "3rem", width: "100%", boxSizing: "border-box" }}
        />
        {/* Bouton œil */}
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          disabled={disabled}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          style={{
            position: "absolute",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            margin: 0,
            color: "var(--amber)",
            opacity: disabled ? 0.4 : 0.7,
            display: "flex",
            alignItems: "center",
          }}
        >
          {visible ? (
            // Œil barré — masquer
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            // Œil ouvert — afficher
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}