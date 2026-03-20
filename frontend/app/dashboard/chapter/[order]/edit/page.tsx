"use client";


import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getAuthToken } from "@/lib/auth/cookies";
import {
  getMyChapter,
  saveChapter,
  publishChapter,
  addMedia,
  deleteMedia,
  type Chapter,
  type Media,
} from "@/lib/api/projects";
import "@/styles/global.css";
import "@/styles/responsive.css";
import "@/styles/dashboard.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ChapterEditPage() {
  const params = useParams();
  const order = parseInt(params.order as string, 10);
  const router = useRouter();


  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [modified, setModified] = useState(false);


  const [imagePrompt, setImagePrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");


  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "sound">("image");
  const [addingMedia, setAddingMedia] = useState(false);
  const [mediaError, setMediaError] = useState("");


  useEffect(() => {
    if (!isNaN(order)) loadChapter();
  }, [order]);

  async function loadChapter() {
    const token = getAuthToken();
    if (!token) { router.push("/login"); return; }
    try {
      const data = await getMyChapter(token, order);
      setChapter(data);
      setTitle(data.title);
      setContent(data.content ?? "");
      setImageUrl(data.image_url ?? null);
    } catch {
      setError("Impossible de charger ce chapitre.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);


  async function handleSave() {
    const token = getAuthToken();
    if (!token) return;
    setError("");
    setSaving(true);
    try {
      const updated = await saveChapter(token, order, { title, content });
      setChapter(updated);
      setModified(false);
      setSuccess("Chapitre sauvegardé ✦");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!confirm("Publier ce chapitre ? Il sera visible par les lecteurs et ne pourra plus être modifié.")) return;
    const token = getAuthToken();
    if (!token) return;

    if (modified) await handleSave();

    setError("");
    setPublishing(true);
    try {
      const updated = await publishChapter(token, order);
      setChapter(updated);
      setSuccess("Chapitre publié ! Les lecteurs peuvent maintenant le découvrir");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de publier.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleGenerateImage() {
    if (!imagePrompt.trim()) {
      setImageError("Décris ce que tu veux illustrer.");
      return;
    }
    const token = getAuthToken();
    if (!token) return;

    setImageError("");
    setGeneratingImage(true);
    try {
      const res = await fetch(`${API_URL}/images/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: imagePrompt, chapter_id: chapter?.id }),
      });

      if (res.status === 429) {
        setImageError("Quota atteint : 10 images maximum pour l'alpha.");
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        setImageError(err.detail ?? "Erreur de génération.");
        return;
      }

      const data = await res.json();
      const generatedUrl: string = data.url;

      
      const tok = getAuthToken()!;
      const updated = await saveChapter(tok, order, { image_url: generatedUrl });
      setChapter(updated);
      setImageUrl(generatedUrl);
      setSuccess("Image générée et sauvegardée");
    } catch {
      setImageError("Erreur lors de la génération. Réessaie.");
    } finally {
      setGeneratingImage(false);
    }
  }

  
  async function handleAddMedia() {
    if (!mediaUrl.trim()) {
      setMediaError("L'URL du media est requise.");
      return;
    }
    const token = getAuthToken();
    if (!token) return;

    setMediaError("");
    setAddingMedia(true);
    try {
      await addMedia(token, order, {
        type: mediaType,
        url: mediaUrl,
        title: mediaTitle || undefined,
      });
      await loadChapter();
      setMediaUrl("");
      setMediaTitle("");
      setSuccess("Media ajouté");
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : "Impossible d'ajouter ce media.");
    } finally {
      setAddingMedia(false);
    }
  }

  async function handleDeleteMedia(mediaId: number) {
    if (!confirm("Supprimer ce media ?")) return;
    const token = getAuthToken();
    if (!token) return;
    try {
      await deleteMedia(token, order, mediaId);
      await loadChapter();
      setSuccess("Media supprimé.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer ce media.");
    }
  }

  
  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="dashboard-loader">Ouverture du chapitre...</div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="dashboard-content">
          <p>{error || "Chapitre introuvable."}</p>
          <Link href="/dashboard" className="link">← Retour au tableau de bord</Link>
        </div>
      </div>
    );
  }

  const isLocked = chapter.is_published;

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-content chapter-editor">

        {/* ── Barre d'outils supérieure ── */}
        <div className="editor-toolbar">
          <Link href="/dashboard" className="link editor-back">
            ← Retour
          </Link>
          <span className="editor-chapter-label">
            Chapitre {String(order).padStart(2, "0")}
            {isLocked && <span className="dashboard-badge published"> · Publié</span>}
          </span>
          <div className="editor-toolbar-actions">
            {!isLocked && (
              <>
                <button
                  className="btn-choice btn-sm"
                  onClick={handleSave}
                  disabled={saving || !modified}
                >
                  {saving ? "Sauvegarde..." : modified ? "Sauvegarder *" : "Sauvegardé"}
                </button>
                <button
                  className="btn-gold btn-sm"
                  onClick={handlePublish}
                  disabled={publishing || !title || !content}
                >
                  {publishing ? "Publication..." : "Publier ✦"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Messages de feedback ── */}
        {success && <div className="editor-success">{success}</div>}
        {error && <div className="dashboard-error"><p>{error}</p></div>}

        {/* ══════════════════════════════════════════════════════════════════
            US-05 : Éditeur de texte 
            ══════════════════════════════════════════════════════════════════ */}
        <section className="editor-section">
          <input
            className="editor-title-input"
            type="text"
            placeholder="Titre du chapitre..."
            value={title}
            onChange={e => { setTitle(e.target.value); setModified(true); }}
            disabled={isLocked}
          />

          <textarea
            className="editor-content-textarea"
            placeholder={
              isLocked
                ? "Ce chapitre est publié."
                : "Commence à écrire ton histoire ici...\n\nLaisse ton inspiration couler, sans te juger."
            }
            value={content}
            onChange={e => { setContent(e.target.value); setModified(true); }}
            disabled={isLocked}
            rows={20}
          />

          {!isLocked && (
            <p className="editor-hint">
              {content.length > 0 ? `${content.length} caractères` : ""}
              {modified ? " · ⚠ Non sauvegardé" : ""}
            </p>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            US-07 : Génération image IA
            ══════════════════════════════════════════════════════════════════ */}
        <section className="editor-section">
          <h2>Image IA</h2>

          {imageUrl ? (
            <div className="editor-image-preview">
              <img src={imageUrl} alt="Illustration générée" className="editor-generated-image" />
              {!isLocked && (
                <button
                  className="btn-delete btn-sm"
                  onClick={() => {
                    const tok = getAuthToken();
                    if (tok) saveChapter(tok, order, { image_url: "" }).then(loadChapter);
                    setImageUrl(null);
                  }}
                >
                  Supprimer l'image
                </button>
              )}
            </div>
          ) : (
            !isLocked && (
              <div className="editor-image-generator">
                <p className="editor-section-hint">
                  Génère une illustration unique pour illustrer ce chapitre.
                  (1 image max par chapitre · 10 images max pour l'alpha)
                </p>
                <textarea
                  className="input editor-prompt-textarea"
                  placeholder="Ex : Une forêt mystique sous une lune violette, style aquarelle sombre, tons bleu nuit et or..."
                  value={imagePrompt}
                  onChange={e => setImagePrompt(e.target.value)}
                  rows={3}
                />
                {imageError && <p className="dashboard-error-inline">{imageError}</p>}
                <button
                  className="btn-gold"
                  onClick={handleGenerateImage}
                  disabled={generatingImage || !imagePrompt.trim()}
                >
                  {generatingImage ? " Génération en cours..." : " Générer l'illustration"}
                </button>
              </div>
            )
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            US-06 : Médias importés 
            ══════════════════════════════════════════════════════════════════ */}
        <section className="editor-section">
          <h2>Médias importés</h2>
          <p className="editor-section-hint">
            Enrichis ton chapitre avec des images ou une ambiance sonore.
            (Max 2 images + 1 son par chapitre)
          </p>

          {/* Liste des médias existants */}
          {chapter.medias.length > 0 && (
            <div className="editor-media-list">
              {chapter.medias.map(media => (
                <div key={media.id} className="editor-media-item">
                  <span className="editor-media-type">
                    {media.type === "image" ? "Image" : "Son"}
                  </span>
                  <div className="editor-media-info">
                    {media.title && <p className="editor-media-title">{media.title}</p>}
                    <p className="editor-media-url">{media.url.substring(0, 50)}...</p>
                  </div>
                  {!isLocked && (
                    <button
                      className="btn-delete btn-sm"
                      onClick={() => handleDeleteMedia(media.id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Formulaire d'ajout de media */}
          {!isLocked && (
            <div className="editor-media-form">
              <div className="editor-media-type-selector">
                <button
                  type="button"
                  className={mediaType === "image" ? "btn-gold btn-sm" : "btn-choice btn-sm"}
                  onClick={() => setMediaType("image")}
                >
                  Image
                </button>
                <button
                  type="button"
                  className={mediaType === "sound" ? "btn-gold btn-sm" : "btn-choice btn-sm"}
                  onClick={() => setMediaType("sound")}
                >
                  Son
                </button>
              </div>

              <input
                className="input"
                type="url"
                placeholder={
                  mediaType === "image"
                    ? "URL de l'image (Cloudinary, etc.)"
                    : "URL embed SoundCloud (https://w.soundcloud.com/...)"
                }
                value={mediaUrl}
                onChange={e => setMediaUrl(e.target.value)}
              />

              <input
                className="input"
                type="text"
                placeholder="Titre du media (optionnel)"
                value={mediaTitle}
                onChange={e => setMediaTitle(e.target.value)}
              />

              {mediaError && <p className="dashboard-error-inline">{mediaError}</p>}

              <button
                className="btn-choice"
                onClick={handleAddMedia}
                disabled={addingMedia || !mediaUrl.trim()}
              >
                {addingMedia ? "Ajout..." : "Ajouter le media"}
              </button>
            </div>
          )}
        </section>

        {/* ── Footer ── */}
        <div className="editor-footer">
          <Link href="/dashboard" className="link">← Retour au tableau de bord</Link>
        </div>

      </div>
    </div>
  );
}