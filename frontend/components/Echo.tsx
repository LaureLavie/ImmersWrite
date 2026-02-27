"use client";

import React, { useState } from 'react';
import wonderful from '../echoes/wonderful.svg';
import heart from '../echoes/heart.svg';
import scare from '../echoes/scare.svg';
import sad from '../echoes/sad.svg';
import mystery from '../echoes/mystery.svg';
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
    { id: 'emerveillement', src: wonderful, label: 'Émerveillement' },
    { id: 'resonance', src: heart, label: 'Résonance' },
    { id: 'intrigue', src: scare, label: 'Intrigue' },
    { id: 'tristesse', src: sad, label: 'Tristesse' },
    { id: 'frisson', src: mystery, label: 'Frisson' },
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