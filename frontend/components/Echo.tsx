"use client";

import React, { useState } from 'react';
import '../styles/echo.css';
import '../styles/global.css';
import '../styles/responsive.css';


type EchoType = 'emerveillement' | 'resonance' | 'intrigue' | 'tristesse' | 'frisson';

interface EchoProps {
  onSelect?: (echo: EchoType) => void;
}

export default function Echo({ onSelect }: EchoProps) {
  const [selected, setSelected] = useState<EchoType | null>(null);

  const echoes = [
    { id: 'emerveillement', src:'https://res.cloudinary.com/immerswrite/image/upload/v1772203016/emerveillement_rcb6no.png', label: 'Émerveillement' },
    { id: 'resonance', src:'https://res.cloudinary.com/immerswrite/image/upload/v1772203018/resonance_b6kdxm.png', label: 'Résonance' },
    { id: 'intrigue', src:'https://res.cloudinary.com/immerswrite/image/upload/v1772203022/intrigue_wlxxyn.png', label: 'Intrigue' },
    { id: 'tristesse', src:'https://res.cloudinary.com/immerswrite/image/upload/v1772203014/triste_gtxys6.png', label: 'Tristesse' },
    { id: 'frisson', src:'https://res.cloudinary.com/immerswrite/image/upload/v1772203011/frisson_izjfue.png', label: 'Frisson' },
  ];

  const handleSelect = (id: EchoType) => {
    setSelected(id);
    if (onSelect) onSelect(id);
  };

  return (
    <div className="echo-container">
      <h2 className="echo-title">Que ressentez-vous ?</h2>
      
      <div className="echo-card">
        {echoes.map((echo) => (
          <button
            key={echo.id}
            onClick={() => handleSelect(echo.id as EchoType)}
            className={`echo-button ${selected === echo.id ? 'active' : ''}`}
            aria-label={echo.label}
          >
            {echo.src}
          </button>
        ))}
      </div>
       <p className="echo-description">Partager votre ressenti pour continuer.</p>
    </div>
  );
}