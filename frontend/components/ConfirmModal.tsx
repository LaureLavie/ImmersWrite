"use client";

import { useEffect, useRef } from "react";
import "@/styles/modal.css";



export type ModalVariant = "danger" | "warning" | "info";
export type ModalMode    = "confirm" | "alert";

export interface ModalConfig {
  mode: ModalMode;
  variant: ModalVariant;
  title: string;
  message: string;
  detail?: string; 
  confirmLabel?: string;
  cancelLabel?: string; 
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface ConfirmModalProps extends ModalConfig {
  isOpen: boolean;
}

export default function ConfirmModal({
  isOpen,
  mode,
  variant,
  title,
  message,
  detail,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {


  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
   
      const t = setTimeout(() => confirmBtnRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);


  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel?.();
      if (e.key === "Enter")  onConfirm();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);


  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;


  const icons: Record<ModalVariant, string> = {
    danger:  "◈",
    warning: "◇",
    info:    "✦",
  };

  return (
   
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onCancel?.(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`modal-box modal-${variant}`}>

        {/* ── Icône décorative ── */}
        <div className={`modal-icon modal-icon-${variant}`} aria-hidden="true">
          {icons[variant]}
        </div>

        {/* ── Contenu ── */}
        <div className="modal-content">
          <h3 id="modal-title" className="modal-title">{title}</h3>
          <p className="modal-message">{message}</p>
          {detail && <p className="modal-detail">{detail}</p>}
        </div>

        {/* ── Actions ── */}
        <div className="modal-actions">
          {/* Bouton annuler — uniquement en mode "confirm" */}
          {mode === "confirm" && onCancel && (
            <button
              className="modal-btn modal-btn-cancel"
              onClick={onCancel}
              type="button"
            >
              {cancelLabel ?? "Annuler"}
            </button>
          )}

          {/* Bouton de confirmation */}
          <button
            ref={confirmBtnRef}
            className={`modal-btn modal-btn-confirm modal-btn-confirm-${variant}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel ?? (mode === "alert" ? "Compris" : "Confirmer")}
          </button>
        </div>

        {/* ── Trait décoratif bas ── */}
        <div className={`modal-bottom-line modal-bottom-line-${variant}`} aria-hidden="true" />

      </div>
    </div>
  );
}