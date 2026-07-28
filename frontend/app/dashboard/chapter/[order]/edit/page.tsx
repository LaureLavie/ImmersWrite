"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConfirmModal from "@/components/ConfirmModal";
import { useModal } from "@/hooks/useModal";
import { getAuthToken } from "@/lib/auth/cookies";
import {
  getMyChapter,
  saveChapter,
  publishChapter,
  addMedia,
  deleteMedia,
  type Chapter,
} from "@/lib/api/projects";
import "@/styles/global.css";
import "@/styles/responsive.css";
import "@/styles/dashboard.css";
import EditorToolbar from "@/components/EditorToolbar";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ChapterEditPage() {
  const params = useParams();
  const order = parseInt(params.order as string, 10);
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [coverUrl, setCoverUrl] = useState("");
  const [title, setTitle] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [modified, setModified] = useState(false);

  const [imagePrompt, setImagePrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  const [soundPrompt, setSoundPrompt] = useState("");
  const [generatingSound, setGeneratingSound] = useState(false);
  const [soundUrl, setSoundUrl] = useState<string | null>(null);
  const [soundTitle, setSoundTitle] = useState("");
  const [soundError, setSoundError] = useState("");

  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "sound">("image");
  const [addingMedia, setAddingMedia] = useState(false);
  const [mediaError, setMediaError] = useState("");


  const { isOpen, config, openModal, closeModal } = useModal();

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
      setCoverUrl(data.cover_url ?? "");
      setImageUrl(data.image_url ?? null);
      setImageTitle(data.image_title ?? "");
      setSoundUrl(data.sound_url ?? null);
      setSoundTitle(data.sound_title ?? "");
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
      const updated = await saveChapter(token, order, { title, content, cover_url: coverUrl, image_title: imageTitle, sound_url: soundUrl || undefined, sound_title: soundTitle });
      setChapter(updated);
      setModified(false);
      setSuccess("Chapitre sauvegardé ✦");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de sauvegarde.");
    } finally {
      setSaving(false);
    }
  }


  async function doPublish() {
    const token = getAuthToken();
    if (!token) return;
    if (modified) await handleSave();
    setError("");
    setPublishing(true);
    try {
      const updated = await publishChapter(token, order);
      setChapter(updated);
      setSuccess("Chapitre publié ! Les lecteurs peuvent maintenant le découvrir ✦");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de publier.");
    } finally {
      setPublishing(false);
    }
  }

  function handlePublish() {
    openModal({
      mode: "confirm",
      variant: "warning",
      title: "Publier ce chapitre ?",
      message: "Il sera visible par tous les lecteurs dès maintenant.",
      detail: "Attention : une fois publié, il est difficile de le modifier.",
      confirmLabel: "Publier ✦",
      cancelLabel: "Pas encore",
      onConfirm: () => { closeModal(); doPublish(); },
      onCancel: closeModal,
    });
  }


  async function handleGenerateImage() {
    if (!imagePrompt.trim()) { setImageError("Décris ce que tu veux illustrer."); return; }
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
      if (res.status === 429) { setImageError("Quota atteint : 10 images maximum pour cette version test."); return; }
      if (!res.ok) { const e = await res.json(); setImageError(e.detail ?? "Erreur de génération."); return; }
      const data = await res.json();
      const tok = getAuthToken()!;
      const updated = await saveChapter(tok, order, { image_url: data.url, image_title: imageTitle });
      setChapter(updated);
      setImageUrl(data.url);
      setSuccess("Image générée et sauvegardée ✦");
    } catch {
      setImageError("Erreur lors de la génération. Réessaie.");
    } finally {
      setGeneratingImage(false);
    }
  }

  async function handleGenerateSound() {
    if (!soundPrompt.trim()) { setSoundError("Décris l'ambiance sonore souhaitée."); return; }
    const token = getAuthToken();
    if (!token) return;
    setSoundError("");
    setGeneratingSound(true);
    try {
      const res = await fetch(`${API_URL}/audio/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: soundPrompt, chapter_id: chapter?.id }),
      });
      if (res.status === 429) { setSoundError("Quota atteint pour la génération audio."); return; }
      if (!res.ok) { const e = await res.json(); setSoundError(e.detail ?? "Erreur de génération audio."); return; }
      const data = await res.json();
      const audioBytes = atob(data.audio_base64);
      const audioArray = new Uint8Array(audioBytes.length);
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i);
      }
      const blob = new Blob([audioArray], { type: "audio/mpeg" });
      const blobUrl = URL.createObjectURL(blob);
      setSoundUrl(blobUrl);    
      setSoundError("⚠ Audio généré en local. Importe-le sur Cloudinary et colle l'URL dans le champ dédié pour le sauvegarder.");
      setSuccess("Audio généré — écoute-le ci-dessous ✦");
    } catch {
      setSoundError("Erreur lors de la génération audio. Réessaie.");
    } finally {
      setGeneratingSound(false);
    }
  }


  async function handleAddMedia() {
    if (!mediaUrl.trim()) { setMediaError("L'URL du media est requise."); return; }
    const token = getAuthToken();
    if (!token) return;
    setMediaError("");
    setAddingMedia(true);
    try {
      await addMedia(token, order, { type: mediaType, url: mediaUrl, title: mediaTitle || undefined });
      await loadChapter();
      setMediaUrl("");
      setMediaTitle("");
      setSuccess("Media ajouté ✦");
    } catch (err) {
      setMediaError(err instanceof Error ? err.message : "Impossible d'ajouter ce media.");
    } finally {
      setAddingMedia(false);
    }
  }


  async function doDeleteMedia(mediaId: number) {
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

  function handleDeleteMedia(mediaId: number, mediaLabel: string) {
    openModal({
      mode: "confirm",
      variant: "danger",
      title: "Supprimer ce media",
      message: `"${mediaLabel || "Ce media"}" sera supprimé définitivement.`,
      detail: "Cette action est irréversible.",
      confirmLabel: "Supprimer",
      cancelLabel: "Annuler",
      onConfirm: () => { closeModal(); doDeleteMedia(mediaId); },
      onCancel: closeModal,
    });
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

  
  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-content chapter-editor">
        

        {/* ── Barre d'outils ── */}
        <div className="editor-toolbar">
          <Link href="/dashboard" className="link editor-back">← Retour</Link>
          <span className="editor-chapter-label">
            Chapitre {String(order).padStart(2, "0")}
            {chapter.is_published && <span className="dashboard-badge published"> · Publié</span>}
          </span>
          <div className="editor-toolbar-actions">
            { (
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

        {/* ── Feedback ── */}
        {success && <div className="editor-success">{success}</div>}
        {error && <div className="dashboard-error"><p>{error}</p></div>}


        {/* ── Éditeur de chapitre ── */}
        <section className="editor-section">
        <h2>Image de fond du chapitre</h2>
        <p className="editor-section-hint">
            Cette image s'affiche en grand fond derrière le titre du chapitre (comme une couverture).
            Importe une image sur Cloudinary et colle l'URL ici.
          </p>
 
          {/* Prévisualisation de la cover */}
          {coverUrl && (
            <div style={{
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              maxHeight: "180px",
              border: "1px solid rgba(179,136,57,0.3)"
            }}>
              <img
                src={coverUrl}
                alt="Aperçu fond immersif"
                style={{ width: "100%", height: "180px", objectFit: "cover", filter: "brightness(0.6)" }}
              />
              <div style={{
                position: "absolute", bottom: "1rem", left: "1rem",
                fontFamily: "var(--font-title)", color: "var(--lunar)",
                fontSize: "1rem", opacity: 0.8
              }}>
                ↑ Aperçu du fond — Chapitre {order}
              </div>
            </div>
          )}
 
          <input
            className="input"
            type="url"
            placeholder="https://res.cloudinary.com/... (URL de ton image Cloudinary)"
            value={coverUrl}
            onChange={e => { setCoverUrl(e.target.value); setModified(true); }}
            disabled={false}
          />
        </section>
        <section className="editor-section">
          <input
            className="editor-title-input"
            type="text"
            placeholder="Titre du chapitre..."
            value={title}
            onChange={e => { setTitle(e.target.value); setModified(true); }}
            disabled={false}
          />
          <EditorToolbar
            textareaRef={contentRef}
            onChange={(newValue) => { setContent(newValue); setModified(true); }}
          />
          <textarea
            ref={contentRef}
            className="editor-content-textarea"
            placeholder="Commence à écrire ton histoire ici...\n\nLaisse l'inspiration venir, sans te juger."
            value={content}
            onChange={e => { setContent(e.target.value); setModified(true); }}
            disabled={false}
            rows={20}
          />
          { (
            <p className="editor-hint">
              {content.length > 0 ? `${content.length} caractères` : ""}
              {modified ? " · ⚠ Non sauvegardé" : ""}
            </p>
          )}
        </section>

        {/* Image générée par IA ── */}
        <section className="editor-section">
          <h2>Image générée par IA (affichée après le texte)</h2>
          {imageUrl ? (
            <div className="editor-image-preview">
              <img src={imageUrl} alt="Illustration générée" className="editor-generated-image" />
              { (
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
            <div className="editor-image-generator">
              <p className="editor-section-hint">
                Génère une illustration unique pour ce chapitre.
                (1 image max par chapitre · 10 images max pour cette version test)
              </p>
              <textarea
                className="input editor-prompt-textarea"
                placeholder="Ex : Une forêt mystique sous une lune violette, style aquarelle sombre..."
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
                {generatingImage ? "Génération en cours..." : "Générer l'illustration"}
              </button>
            </div>
          )}
        </section>

        {/* ── Sons importés ── */}

        <section className="editor-section">
          <h2>🎵 Ambiance sonore principale (sous le titre)</h2>
          <p className="editor-section-hint">
            Cet audio s'affichera juste en-dessous du titre du chapitre dans l'interface lecteur.
          </p>
 
          {soundUrl ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Lecteur prévisualisation */}
              <audio controls src={soundUrl} style={{ width: "100%", borderRadius: "50px" }} />
              <input
                className="input"
                type="text"
                placeholder="Titre de l'ambiance sonore (optionnel)"
                value={soundTitle}
                onChange={e => { setSoundTitle(e.target.value); setModified(true); }}
                disabled={false}
              />
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    className="btn-choice btn-sm"
                    onClick={() => {
                      
                      const url = prompt("Colle l'URL Cloudinary de ton audio :");
                      if (url) {
                        setSoundUrl(url);
                        setModified(true);
                      }
                    }}
                  >
                    Remplacer par URL Cloudinary
                  </button>
                  <button
                    className="btn-delete btn-sm"
                    onClick={() => {
                      setSoundUrl(null);
                      setSoundTitle("");
                      setModified(true);
                      const tok = getAuthToken();
                      if (tok) saveChapter(tok, order, { sound_url: "" });
                    }}
                  >
                    Supprimer l'audio
                  </button>
                </div>
              </div>
            ) : (
              <div className="editor-image-generator">

                {/* Option A : URL directe (Cloudinary) */}
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--amber)", opacity: 0.8 }}>
                  Option 1 — Colle une URL Cloudinary
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                  className="input"
                  type="url"
                  placeholder="https://res.cloudinary.com/... (URL de ton audio)"
                  value={soundUrl ?? ""}
                  onChange={e => { setSoundUrl(e.target.value); setModified(true); }}
                  style={{ flex: 1 }}
                />
              </div>
 
              {/* Séparateur */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: 0.3 }}>
                <div style={{ flex: 1, height: "1px", background: "var(--amber)" }}/>
                <span style={{ fontSize: "0.75rem", color: "var(--amber)" }}>ou</span>
                <div style={{ flex: 1, height: "1px", background: "var(--amber)" }}/>
              </div>

               {/* Option B : Génération IA */}
               <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--amber)", opacity: 0.8 }}>
                Option 2 — Génère via ElevenLabs
              </p>
              <textarea
                className="input editor-prompt-textarea"
                placeholder="Ex : Musique d'ambiance mystérieuse, violoncelle sombre, quelques notes de piano..."
                value={soundPrompt}
                onChange={e => setSoundPrompt(e.target.value)}
                rows={2}
              />
              {soundError && (
                <p className="dashboard-error-inline" style={{ color: soundError.startsWith("⚠") ? "var(--amber)" : "var(--careful)" }}>
                  {soundError}
                </p>
              )}
              <button
                className="btn-choice"
                onClick={handleGenerateSound}
                disabled={generatingSound || !soundPrompt.trim()}
              >
                {generatingSound ? "Génération en cours..." : "Générer l'ambiance sonore 🎵"}
              </button>
            </div>
          )}
        </section>

        {/* ── Médias importés ── */}
        <section className="editor-section">
      
          <h2>Médias importés</h2>
          <p className="editor-section-hint">
          <strong style={{ color: "var(--lunar)" }}>Sons importés</strong> → affichés sous le titre du chapitre (ambiance)
            <br />
            <strong style={{ color: "var(--lunar)" }}>Images importées</strong> → affichées à la fin du chapitre
            <br />
            Limites : 2 images + 1 son par chapitre (phase alpha)
          </p>

          {/* Liste existante */}
          {chapter.medias.length > 0 && (
            <div className="editor-media-list">
              {chapter.medias.map(media => (
                <div key={media.id} className="editor-media-item">
                  <span className="editor-media-type">
                    {media.type === "image" ? "📷​" : "🎵"}
                  </span>
                  <div className="editor-media-info">
                    {media.title && <p className="editor-media-title">{media.title}</p>}
                    <p className="editor-media-url">
                      {media.url.length > 50 ? media.url.substring(0, 50) + "..." : media.url}
                    </p>
                    <span style={{ fontSize: "0.7rem", color: "var(--amber)", opacity: 0.6 }}>
                      {media.type === "sound" ? "→ Position : sous le titre" : "→ Position : fin du chapitre"}
                    </span>
                  </div>
                  { (
                    <button
                      className="btn-delete btn-sm"
                      onClick={() => handleDeleteMedia(media.id, media.title ?? media.url)}
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Formulaire d'ajout */}
          { (
            <div className="editor-media-form">
          
              <div className="editor-media-type-selector">
                <button
                  type="button"
                  className={mediaType === "image" ? "btn-gold btn-sm" : "btn-choice btn-sm"}
                  onClick={() => setMediaType("image")}
                >
                  Image (fin du chapitre)
                </button>
                <button
                  type="button"
                  className={mediaType === "sound" ? "btn-gold btn-sm" : "btn-choice btn-sm"}
                  onClick={() => setMediaType("sound")}
                >
                  Son (sous le titre)
                </button>
              </div>
            
              <input
                className="input"
                type="url"
                placeholder={
                  mediaType === "image"
                    ? "URL de l'image (Cloudinary, etc.)"
                    : "URL de l'audio (Cloudinary, etc.)"
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

        <div className="editor-footer">
          <Link href="/dashboard" className="link">← Retour au tableau de bord</Link>
        </div>

      </div>

      {/* ConfirmModal  */}
      {config && (
        <ConfirmModal isOpen={isOpen} {...config} />
      )}
      <Footer />
    </div>
  );
}