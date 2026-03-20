"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ConfirmModal from "@/components/ConfirmModal";
import { useModal } from "@/hooks/useModal";
import { getAuthToken } from "@/lib/auth/cookies";
import {
  getMyProject,
  createProject,
  deleteChapter,
  deleteProject,
  type Project,
} from "@/lib/api/projects";
import "@/styles/global.css";
import "@/styles/responsive.css";
import "@/styles/dashboard.css";

export default function DashboardPage() {
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);


  const { isOpen, config, openModal, closeModal } = useModal();

  const [form, setForm] = useState({
    title: "",
    author_name: "",
    description: "",
    slug: "",
  });

  useEffect(() => { loadProject(); }, []);

  async function loadProject() {
    const token = getAuthToken();
    if (!token) { router.push("/login"); return; }
    try {
      const data = await getMyProject(token);
      setProject(data);
    } catch {
      setError("Impossible de charger le projet.");
    } finally {
      setLoading(false);
    }
  }

  function titleToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function handleTitleChange(title: string) {
    setForm(f => ({ ...f, title, slug: titleToSlug(title) }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setError("Le titre est obligatoire."); return; }
    if (!form.author_name.trim()) { setError("Ton nom d'auteur est obligatoire."); return; }
    const token = getAuthToken();
    if (!token) return;
    setSaving(true);
    try {
      const newProject = await createProject(token, {
        title: form.title,
        author_name: form.author_name,
        description: form.description || undefined,
        slug: form.slug || titleToSlug(form.title),
      });
      setProject(newProject);
      setCreating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  }

  
  async function doDeleteChapter(order: number) {
    const token = getAuthToken();
    if (!token) return;
    try {
      await deleteChapter(token, order);
      await loadProject();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer ce chapitre.");
    }
  }

  function handleDeleteChapter(order: number, isPublished: boolean) {
    if (isPublished) {
      openModal({
        mode: "confirm",
        variant: "warning",
        title: "Supprimer un chapitre publié",
        message: "Ce chapitre est actuellement visible par les lecteurs.",
        detail: "Le supprimer le retirera définitivement. Les lecteurs ne pourront plus y accéder.",
        confirmLabel: "Supprimer quand même",
        cancelLabel: "Annuler",
        onConfirm: () => { closeModal(); doDeleteChapter(order); },
        onCancel: closeModal,
      });
    } else {
      openModal({
        mode: "confirm",
        variant: "danger",
        title: "Supprimer ce chapitre",
        message: `Le chapitre ${String(order).padStart(2, "0")} sera supprimé définitivement.`,
        detail: "Cette action est irréversible.",
        confirmLabel: "Supprimer",
        cancelLabel: "Annuler",
        onConfirm: () => { closeModal(); doDeleteChapter(order); },
        onCancel: closeModal,
      });
    }
  }

  
  async function doDeleteProject() {
    const token = getAuthToken();
    if (!token) return;
    setError("");
    setDeletingProject(true);
    try {
      const result = await deleteProject(token);
      setProject(null);
      
      openModal({
        mode: "alert",
        variant: "info",
        title: "Projet supprimé",
        message: result.message,
        detail: `${result.chapters_deleted} chapitre${result.chapters_deleted > 1 ? "s" : ""} supprimé${result.chapters_deleted > 1 ? "s" : ""}.`,
        confirmLabel: "Compris",
        onConfirm: closeModal,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer le projet.");
    } finally {
      setDeletingProject(false);
    }
  }

  function openDeleteProjectModal2() {
  
    openModal({
      mode: "confirm",
      variant: "danger",
      title: "Dernière confirmation",
      message: "Toutes les données seront effacées définitivement.",
      detail: "Chapitres, médias, images IA… Rien ne pourra être récupéré.",
      confirmLabel: "Oui, tout supprimer",
      cancelLabel: "Non, annuler",
      onConfirm: () => { closeModal(); doDeleteProject(); },
      onCancel: closeModal,
    });
  }

  function handleDeleteProject() {
   
    openModal({
      mode: "confirm",
      variant: "warning",
      title: `Supprimer "${project?.title}" ?`,
      message: "Tous les chapitres et médias de ce projet seront effacés.",
      detail: "Cette action est irréversible. Es-tu vraiment sûre ?",
      confirmLabel: "Continuer",
      cancelLabel: "Annuler",
    
      onConfirm: () => openDeleteProjectModal2(),
      onCancel: closeModal,
    });
  }

  function nextChapterOrder(): number {
    if (!project || project.chapters.length === 0) return 1;
    return Math.max(...project.chapters.map(c => c.order)) + 1;
  }


  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />
        <div className="dashboard-loader">Ouverture de l'atelier...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-content">

        <header className="dashboard-header">
          <h1>L'Atelier de l'Artiste</h1>
          <p className="dashboard-subtitle">
            {project
              ? `Ton univers prend forme. ${project.chapters.length} chapitre${project.chapters.length > 1 ? "s" : ""}.`
              : "Ton premier monde t'attend."}
          </p>
        </header>

        {error && (
          <div className="dashboard-error"><p>{error}</p></div>
        )}

        {/* PAS DE PROJET → création */}
        {!project && !creating && (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon">✦</div>
            <p>Tu n'as pas encore de projet.</p>
            <p className="dashboard-empty-hint">
              Pour cette version Test, tu peux créer un seul projet — ton chef-d'œuvre.
            </p>
            <button className="btn-gold" onClick={() => setCreating(true)}>
              Créer mon projet
            </button>
          </div>
        )}

        {!project && creating && (
          <div className="card dashboard-form-card">
            <h2>Nouveau projet</h2>
            <form onSubmit={handleCreate}>
              <label htmlFor="title">Titre de l'histoire *</label>
              <input
                id="title"
                className="input"
                type="text"
                placeholder="L'Ombre des Étoiles Perdues..."
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                required
              />

              <label htmlFor="author_name">Ton nom d'auteur *</label>
              <input
                id="author_name"
                className="input"
                type="text"
                placeholder="Laure Lavie"
                value={form.author_name}
                onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                required
              />

              <label htmlFor="description">Description (optionnel)</label>
              <textarea
                id="description"
                className="input dashboard-textarea"
                placeholder="Une brève description de ton univers..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />

              <label htmlFor="slug">Slug URL (auto-généré)</label>
              <input
                id="slug"
                className="input dashboard-slug-input"
                type="text"
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="mon-histoire"
              />
              <p className="dashboard-hint">
                URL : immerswrite.com/book/<strong>{form.slug || "..."}</strong>
              </p>

              {error && <p className="dashboard-error-inline">{error}</p>}

              <div className="button-container">
                <button type="button" className="btn-logout" onClick={() => setCreating(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-gold" disabled={saving}>
                  {saving ? "Création..." : "Forger mon univers ✦"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PROJET EXISTANT */}
        {project && (
          <>
            <div className="dashboard-project-card card">
              <div className="dashboard-project-info">
                {project.cover_url && (
                  <img
                    src={project.cover_url}
                    alt={project.title}
                    className="dashboard-project-cover"
                  />
                )}
                <div>
                  <h2 className="dashboard-project-title">{project.title}</h2>
                  <p className="dashboard-project-author">par {project.author}</p>
                  {project.description && (
                    <p className="dashboard-project-desc">{project.description}</p>
                  )}
                  <div className="dashboard-project-meta">
                    <span className="dashboard-badge">
                      {project.is_published ? "✓ Publié" : "Brouillon"}
                    </span>
                    <Link
                      href={`/book/${project.slug}`}
                      className="link dashboard-preview-link"
                      target="_blank"
                    >
                      Prévisualiser →
                    </Link>
                  </div>
                  <div className="dashboard-project-danger-zone">
                    <p className="dashboard-danger-label">Zone de danger</p>
                    <button
                      className="btn-delete btn-sm"
                      onClick={handleDeleteProject}
                      disabled={deletingProject}
                    >
                      {deletingProject ? "Suppression..." : "Supprimer le projet"}
                    </button>
                    <p className="dashboard-danger-hint">
                      Supprime le projet et tous ses chapitres. Irréversible.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-chapters-section">
              <div className="dashboard-chapters-header">
                <h2>Chapitres</h2>
                <Link
                  href={`/dashboard/chapter/new?order=${nextChapterOrder()}`}
                  className="btn-gold btn-sm"
                >
                  + Nouveau chapitre
                </Link>
              </div>

              {project.chapters.length === 0 ? (
                <div className="dashboard-chapters-empty">
                  <p>Aucun chapitre pour l'instant.</p>
                  <p className="dashboard-hint">Commence à écrire ton premier chapitre !</p>
                </div>
              ) : (
                <div className="dashboard-chapters-list">
                  {project.chapters.map(chapter => (
                    <div
                      key={chapter.id}
                      className={`dashboard-chapter-item ${chapter.is_published ? "published" : "draft"}`}
                    >
                      <div className="dashboard-chapter-info">
                        <span className="dashboard-chapter-order">
                          {String(chapter.order).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="dashboard-chapter-title">{chapter.title}</p>
                          <div className="dashboard-chapter-meta">
                            <span className={`dashboard-status ${chapter.is_published ? "published" : "draft"}`}>
                              {chapter.is_published ? "✓ Publié" : "Brouillon"}
                            </span>
                            {chapter.image_url && <span className="dashboard-tag">🎨 Image IA</span>}
                            {chapter.medias.some(m => m.type === "sound") && (
                              <span className="dashboard-tag">🎵 Son</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="dashboard-chapter-actions">
                        {!chapter.is_published && (
                          <Link
                            href={`/dashboard/chapter/${chapter.order}/edit`}
                            className="btn-choice btn-sm"
                          >
                            Éditer
                          </Link>
                        )}
                        {chapter.is_published && (
                          <Link
                            href={`/book/${project.slug}/${chapter.order}`}
                            className="link"
                            target="_blank"
                          >
                            Lire →
                          </Link>
                        )}
                        <button
                          className="btn-delete btn-sm"
                          onClick={() => handleDeleteChapter(chapter.order, chapter.is_published)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

    
      {config && (
        <ConfirmModal isOpen={isOpen} {...config} />
      )}
    </div>
  );
}