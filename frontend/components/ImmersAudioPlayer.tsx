"use client";
import { useState, useRef } from "react";

interface ImmersAudioPlayerProps {
  url: string;
  title?: string | null;
}

export default function ImmersAudioPlayer({ url, title }: ImmersAudioPlayerProps) {
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);


  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setCurrentTime(current);
    if (total) setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };


  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };


  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(ratio * 100);
  };


  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="immersa-player">
      {/* La balise <audio> est invisible — c'est juste le moteur */}
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="immersa-player-controls">

        {/* ── Bouton Play / Pause ── */}
        <button
          className="immersa-player-btn"
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Pause" : "Lecture"}
        >
          {isPlaying ? (
          
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1" strokeLinecap="round">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            // Icône Play (triangle)
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </button>

        {/* ── Bouton Stop ── */}
        <button
          className="immersa-player-btn"
          onClick={handleStop}
          aria-label="Arrêter"
          disabled={!isPlaying && currentTime === 0}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
          </svg>
        </button>

        {/* ── Zone centrale : titre + barre + temps ── */}
        <div className="immersa-player-info">
          {title && (
            <span className="immersa-player-title">{title}</span>
          )}

          {/* Barre de progression cliquable */}
          <div
            className="immersa-player-progress-container"
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="immersa-player-track">
              <div
                className="immersa-player-fill"
                style={{ width: `${progress}%` }}
              />
              {/* Petit curseur doré sur la position actuelle */}
              <div
                className="immersa-player-cursor"
                style={{ left: `${progress}%` }}
              />
            </div>
          </div>

          {/* Temps actuel / durée totale */}
          <span className="immersa-player-time">
            {formatTime(currentTime)}
            {duration > 0 && ` / ${formatTime(duration)}`}
          </span>
        </div>

      </div>
    </div>
  );
}