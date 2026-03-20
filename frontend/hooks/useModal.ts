"use client";

import { useState, useCallback } from "react";
import type { ModalConfig } from "@/components/ConfirmModal";

interface UseModalReturn {

  isOpen: boolean;

  config: ModalConfig | null;

  openModal: (cfg: ModalConfig) => void;

  closeModal: () => void;
}

export function useModal(): UseModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig | null>(null);

  const openModal = useCallback((cfg: ModalConfig) => {
    setConfig(cfg);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setConfig(null), 300);
  }, []);

  return { isOpen, config, openModal, closeModal };
}