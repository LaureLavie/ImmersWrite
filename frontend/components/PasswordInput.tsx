"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean; 
  error?: string;  
}

export default function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "••••••••••••",
  label = "Mot de passe",
  required = false,
  autoComplete = "current-password",
  disabled = false,
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", width: "100%" }}>
      
      <label htmlFor={id}>{label}</label>

      <div style={{ position: "relative" }}>
        <input
          id={id}
          name={name}
         
          type={showPassword ? "text" : "password"}
          value={value}
     
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className="input"
          style={{ paddingRight: "3rem" }} 
        />

        {/* Bouton œil */}
        <button
          type="button" 
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            padding: "0.25rem",
            color: "var(--lunar)",
            display: "flex",
            alignItems: "center",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {showPassword
            ? <EyeOff size={18} strokeWidth={1.5} />
            : <Eye size={18} strokeWidth={1.5} />
          }
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <p style={{ color: "var(--amber)", fontSize: "14px", margin: "0.25rem 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}