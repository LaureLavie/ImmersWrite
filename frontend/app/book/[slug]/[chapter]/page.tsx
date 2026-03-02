"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Echo from "@/components/Echo";
import { getChapterByOrder, getChaptersBySlug, type Chapter } from "@/lib/api/chapters";
import "@/styles/chapter.css";
import "@/styles/responsive.css";


function SoundCloudPlayer({ url, title }: { url: string; title?: string | null }) {
  
  const embedUrl = url.startsWith("https://w.soundcloud.com")
    ? url
    : `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23B38839&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;

  return (
    <div className="chapter-audio-section">
      {title && <span className="audio-label">🎵 {title}</span>}
      <iframe
        src={embedUrl}
        height="80"
        allow="autoplay"
        title={title || "Ambiance sonore"}
      />
    </div>
  );
}


function ChapterNav({
  slug,
  currentOrder,
  totalChapters,
}: {
  slug: string;
  currentOrder: number;
  totalChapters: number;
}) {
  const hasPrev = currentOrder > 1;
  const hasNext = currentOrder < totalChapters;

  return (
    <div className="chapter-nav">
      {hasPrev ? (
        <Link
          href={`/books/${slug}/${currentOrder - 1}`}
          className="chapter-nav-btn prev"
        >
          ← Chapitre précédent
        </Link>
      ) : (
        <span className="chapter-nav-btn prev disabled">← Chapitre précédent</span>
      )}

      <span className="chapter-nav-center">
        {currentOrder} / {totalChapters}
      </span>

      {hasNext ? (
        <Link
          href={`/books/${slug}/${currentOrder + 1}`}
          className="chapter-nav-btn next"
        >
          Chapitre suivant →
        </Link>
      ) : (
        <span className="chapter-nav-btn next disabled">Chapitre suivant →</span>
      )}
    </div>
  );
}


export default function ChapterPage() {
  const params = useParams();
  const slug = params.slug as string;
  const orderParam = params.chapter as string;
  const order = parseInt(orderParam, 10);

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [totalChapters, setTotalChapters] = useState(0);
  const [echoSent, setEchoSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Chargement en parallèle : chapitre + liste complète (pour le total)
        const [chapterData, allChapters] = await Promise.all([
          getChapterByOrder(slug, order),
          getChaptersBySlug(slug),
        ]);
        setChapter(chapterData);
        setTotalChapters(allChapters.length);
      } catch {
        setError("Ce chapitre n'existe pas ou n'est plus disponible.");
      } finally {
        setLoading(false);
      }
    }
    if (slug && !isNaN(order)) fetchData();
  }, [slug, order]);

  
  useEffect(() => {
    setEchoSent(false);
  }, [order]);

  if (loading) {
    return (
      <div className="chapter-page chapter-page-no-image">
        <Navbar />
        <div style={{ minHeight: "80dvh", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
          Ouverture du chapitre...
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="chapter-page chapter-page-no-image">
        <Navbar />
        <div style={{ minHeight: "80dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem", opacity: 0.7 }}>
          <p>{error || "Chapitre introuvable"}</p>
          <Link href={`/books/${slug}`} className="chapter-nav-btn">
            ← Retour au livre
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`chapter-page ${!chapter.image_url ? "chapter-page-no-image" : ""}`}>

      {/* Image de fond immersive (Cloudinary) */}
      {chapter.image_url && (
        <img
          src={chapter.image_url}
          alt={chapter.title}
          className="chapter-immersive-bg"
        />
      )}

      <div className="chapter-page-content">
        <Navbar />

        {/* ── Hero ── */}
        <section className="chapter-hero">
          <p className="chapter-number-label">Chapitre {chapter.order}</p>
          <h1 className="chapter-title">{chapter.title}</h1>
        </section>

        {/* ── Audio SoundCloud (si présent) ── */}
        {chapter.sound_url && (
          <SoundCloudPlayer url={chapter.sound_url} title={chapter.sound_title} />
        )}

        {/* ── Texte du chapitre ── */}
        <section className="chapter-reading-section">
          <div className="chapter-reading-inner">
            {chapter.content ? (
              <div className="chapter-content">{chapter.content}</div>
            ) : (
              <p className="chapter-content" style={{ opacity: 0.4, fontStyle: "italic", textAlign: "center" }}>
                Ce chapitre est en cours d'écriture...
              </p>
            )}

            

            {/* Séparateur décoratif */}
            <div className="chapter-divider">
              <span>✦</span>
            </div>
          </div>
        </section>

        {/* ── Echo du lecteur ── */}
        <section className="chapter-echo-section">
          {!echoSent ? (
            <Echo
              onSelect={(echo) => {
                console.log("Echo sélectionné :", echo);
                setEchoSent(true);
                // TODO: envoyer l'echo à l'API quand le backend sera prêt
              }}
            />
          ) : (
            <div style={{ textAlign: "center", opacity: 0.6, fontFamily: "var(--font-body)", fontSize: "0.95rem", padding: "2rem" }}>
              Votre ressenti a été partagé. ✦
            </div>
          )}
        </section>

        {/* ── Navigation prev/next ── */}
        <ChapterNav
          slug={slug}
          currentOrder={order}
          totalChapters={totalChapters}
        />

        {/* ── Footer retour au livre ── */}
        <div className="chapter-footer">
          <Link href={`/books/${slug}`} className="book-back-link">
            ← retour au livre
          </Link>
        </div>

      </div>
    </div>
  );
}