"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConfirmModal from "@/components/ConfirmModal";
import { useModal } from "@/hooks/useModal";
import { getAuthToken } from "@/lib/auth/cookies";
import { getProjectStats, type ProjectStats } from "@/lib/api/engagement";
import {  
  getMyProject,
  createProject,
  updateProject, 
  deleteProject,
  deleteChapter,
  type Project,
} from "@/lib/api/projects";
import "@/styles/global.css";
import "@/styles/responsive.css";
import "@/styles/dashboard.css";
import ShareButtons from "@/components/ShareButtons";

export default function DashboardPage() {
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editSuccess, setEditSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [stats, setStats] = useState<ProjectStats | null>(null);


  const { isOpen, config, openModal, closeModal } = useModal();

  const [form, setForm] = useState({
    title: "",
    author_name: "",
    description: "",
    cover_url: "",
    slug: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    author_name: "",
    description: "",
    cover_url: "",
  });

  useEffect(() => { loadProject(); }, []);

  async function loadProject() {
    const token = getAuthToken();
    if (!token) { router.push("/login"); return; }
    try {
      const [data, statsData] = await Promise.all([
        getMyProject(token),
        getProjectStats(token).catch(() => null),
      ]);
      setProject(data);
      setStats(statsData);
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

  function openEditForm() {
    if (!project) return;
    setEditForm({
      title: project.title,
      author_name: project.author,
      description: project.description ?? "",
      cover_url: project.cover_url ?? "",
    });
    setEditing(true);
    setError("");
  }

  async function handleEditSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!editForm.title.trim()) { setError("Le titre est obligatoire."); return; }
    if (!editForm.author_name.trim()) { setError("Le nom d'auteur est obligatoire."); return; }
    const token = getAuthToken();
    if (!token) return;
    setSaving(true);
    try {
      const updated = await updateProject(token, {
        title: editForm.title,
        author_name: editForm.author_name,
        description: editForm.description || undefined,
        cover_url: editForm.cover_url || undefined,
      });
      setProject(updated);
      setEditing(false);
      setEditSuccess("Projet mis à jour ✦");
      setTimeout(() => setEditSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
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
        cover_url: form.cover_url || undefined,
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

        {editSuccess && (
          <div className="editor-success">{editSuccess}</div>
        )}

        {/* PAS DE PROJET → création */}
        {!project && !creating && (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon">✦</div>
            <p>Tu n'as pas encore de projet.</p>
            <p className="dashboard-empty-hint">
              Pour cette version, tu peux créer un seul projet — ton chef-d'œuvre.
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
                placeholder="Ton nom de plume..."
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

              <label htmlFor="cover_url">URL de la couverture (optionnel)</label>
              <input
                id="cover_url"
                className="input"
                type="text"
                placeholder="https://res.cloudinary.com/projet/ma-couverture.jpg"
                value={form.cover_url}
                onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))}
              />
              <p className="dashboard-hint">
                Colle l'URL de ton image de couverture (ex: Cloudinary).
              </p>

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

        {/* FORMULAIRE D'ÉDITION */}

        {project && editing && (
          <div className="card dashboard-form-card">
            <h2>Modifier le projet</h2>
            <form onSubmit={handleEditSave}>
              <label htmlFor="edit-title">Titre de l'histoire *</label>
              <input
                id="edit-title"
                className="input"
                type="text"
                value={editForm.title}
                onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                required
              />
 
              <label htmlFor="edit-author">Nom d'auteur *</label>
              <input
                id="edit-author"
                className="input"
                type="text"
                value={editForm.author_name}
                onChange={e => setEditForm(f => ({ ...f, author_name: e.target.value }))}
                required
              />
 
              <label htmlFor="edit-description">Description</label>
              <textarea
                id="edit-description"
                className="input dashboard-textarea"
                placeholder="Une brève description de ton univers..."
                value={editForm.description}
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
 
              <label htmlFor="edit-cover">URL de la couverture</label>
              <input
                id="edit-cover"
                className="input"
                type="text"
                placeholder="https://res.cloudinary.com/..."
                value={editForm.cover_url}
                onChange={e => setEditForm(f => ({ ...f, cover_url: e.target.value }))}
              />
 
              {error && <p className="dashboard-error-inline">{error}</p>}
 
              <div className="button-container">
                <button
                  type="button"
                  className="btn-logout"
                  onClick={() => { setEditing(false); setError(""); }}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-gold" disabled={saving}>
                  {saving ? "Sauvegarde..." : "Sauvegarder ✦"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PROJET EXISTANT */}
        {project && !editing && (
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
                      {project.is_published ? "Publié" : "Brouillon"}
                    </span>
                    <Link
                      href={`/book/${project.slug}`}
                      className="link dashboard-preview-link"
                      target="_blank"
                    >
                      Prévisualiser →
                    </Link>
                    <ShareButtons url={`/book/${project.slug}`} title={project.title} variant="book" />
                  </div>

                  <div className="button-container" style={{ justifyContent: "flex-start", marginTop: "1rem" }}>
                    <button
                      className="btn-choice btn-sm"
                      onClick={openEditForm}
                    >
                      Modifier le projet
                    </button>
                  </div>

                  <div className="dashboard-project-danger-zone">
                
                    <button
                      className="btn-delete btn-sm"
                      onClick={handleDeleteProject}
                      disabled={deletingProject}
                    >
                      {deletingProject ? "Suppression..." : "Supprimer mon projet"}
                    </button>
                    <p className="dashboard-danger-hint">
                      Supprime le projet et tous ses chapitres. Irréversible.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          {/* ── Bloc statistiques ── */}
          {stats && (
            <div className="dashboard-stats-section card">
              <h2>Statistiques ✦</h2>
              <div className="dashboard-stats-totals">
                <div className="dashboard-stat-item">
                  <span className="dashboard-stat-number">{stats.total_views}</span>
                  <span className="dashboard-stat-label">lectures totales</span>
                </div>
                <div className="dashboard-stat-item">
                  <span className="dashboard-stat-number">{stats.total_echoes}</span>
                  <span className="dashboard-stat-label">échos reçus</span>
                </div>
              </div>

              {stats.chapters.length > 0 && (
                <div className="dashboard-stats-list">
                  {stats.chapters.map(ch => (
                    <div key={ch.chapter_id} className="dashboard-stats-row">
                      <span className="dashboard-stats-chapter-order">
                        {String(ch.order).padStart(2, "0")}
                      </span>
                      <span className="dashboard-stats-chapter-title">{ch.title}</span>
                      <span className="dashboard-stats-badge">
                        👁 {ch.view_count}
                      </span>
                      <span className="dashboard-stats-badge">
                        ✦ {ch.echo_total}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
                        {chapter.is_published && (
                          <Link
                          href={`/book/${project.slug}/${chapter.order}`}
                          className="link"
                          target="_blank"
                          >
                            Lire →
                          </Link>
                        )}
                        {chapter.is_published && (
                          <Link
                            href={`/dashboard/chapter/${chapter.order}/edit`}
                            className="btn-choice btn-sm"
                          >
                            Modifier
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
      <Footer />
    </div>
  );
}