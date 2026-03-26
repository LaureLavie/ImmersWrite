"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Echo from "@/components/Echo";
import ImmersAudioPlayer from "@/components/ImmersAudioPlayer";
import { getChapterByOrder, getChaptersBySlug, type Chapter, type Media } from "@/lib/api/chapters";
import "@/styles/chapter.css";
import "@/styles/responsive.css";


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
          href={`/book/${slug}/${currentOrder - 1}`}
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
          href={`/book/${slug}/${currentOrder + 1}`}
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
          <Link href={`/book/${slug}`} className="chapter-nav-btn">
            ← Retour au livre
          </Link>
        </div>
      </div>
    );
  }

  const importedSounds  = chapter.medias.filter((m: Media) => m.type === "sound");
  const importedImages  = chapter.medias.filter((m: Media) => m.type === "image");

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

            {/* ── Audio principal du chapitre ── */}
      {chapter.sound_url && (
        <section className="chapter-audio-section">
          <ImmersAudioPlayer
            url={chapter.sound_url}
            title={chapter.sound_title}
          />
        </section>
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
        
            {/* les médias importés... */}
            {importedSounds.map((media: Media) => (
              <ImmersAudioPlayer
                key={media.id}
                url={media.url}
                title={media.title}
              />
          ))}
 
            {/* ── Images importées (medias type "image") ── */}
            {importedImages.length > 0 && (
              <div className="chapter-imported-images">
                {importedImages.map((media: Media) => (
                  <figure key={media.id} className="chapter-imported-figure">
                    <img
                      src={media.url}
                      alt={media.title || "Illustration"}
                      className="chapter-imported-image"
                    />
                    {media.title && (
                      <figcaption className="chapter-imported-caption">
                        {media.title}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
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
          <Link href={`/book/${slug}`} className="book-back-link">
            ← retour au livre
          </Link>
        </div>

      </div>
    </div>
  );
}