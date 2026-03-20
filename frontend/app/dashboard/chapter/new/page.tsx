"use client";


import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getAuthToken } from "@/lib/auth/cookies";
import { createChapter } from "@/lib/api/projects";
import "@/styles/global.css";
import "@/styles/responsive.css";
import "@/styles/dashboard.css";

function NewChapterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderFromUrl = parseInt(searchParams.get("order") ?? "1", 10);

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(orderFromUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setOrder(orderFromUrl);
  }, [orderFromUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }

    const token = getAuthToken();
    if (!token) { router.push("/login"); return; }

    setSaving(true);
    try {
      const chapter = await createChapter(token, {
        order,
        title,
        content: "",
      });
      
      router.push(`/dashboard/chapter/${chapter.order}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de créer ce chapitre.");
      setSaving(false);
    }
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Nouveau chapitre</h1>
          <p className="dashboard-subtitle">Donne un titre à cette nouvelle partie de ton univers.</p>
        </header>

        <div className="card dashboard-form-card">
          <form onSubmit={handleSubmit}>
            <label htmlFor="order">Numéro du chapitre</label>
            <input
              id="order"
              className="input"
              type="number"
              min={1}
              value={order}
              onChange={e => setOrder(parseInt(e.target.value, 10))}
            />
            <p className="dashboard-hint">
              Les chapitres sont triés par numéro dans ton histoire.
            </p>

            <label htmlFor="title">Titre du chapitre *</label>
            <input
              id="title"
              className="input"
              type="text"
              placeholder="Le Réveil dans les Ombres..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
            />

            {error && <p className="dashboard-error-inline">{error}</p>}

            <div className="button-container">
              <Link href="/dashboard" className="btn-logout">
                Annuler
              </Link>
              <button type="submit" className="btn-gold" disabled={saving}>
                {saving ? "Création..." : "Ouvrir l'éditeur →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function NewChapterPage() {
  return (
    <Suspense fallback={<div className="dashboard-loader">Chargement...</div>}>
      <NewChapterForm />
    </Suspense>
  );
}