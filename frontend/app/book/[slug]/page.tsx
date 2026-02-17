"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBookBySlug, type Book } from "@/lib/api/books";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import "@/styles/book.css";
import "@/styles/responsive.css";

export default function BookPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        const data = await getBookBySlug(slug);
        setBook(data);
      } catch (err) {
        setError("Ce livre n'existe pas ou n'est plus disponible.");
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchBook();
  }, [slug]);

  if (loading) return <div className="book-loading">Ouverture du livre...</div>;
  if (error || !book) return <div className="book-error">{error}</div>;

  return (
    <div className={`book-page ${!book.cover_url ? "book-page-no-image" : ""}`}>

      {/* Image de fond fixe */}
      {book.cover_url && (
        <img
          src={book.cover_url}
          alt={book.title}
          className="book-immersive-bg"
        />
      )}

      {/* Tout le contenu défile par dessus */}
      <div className="book-page-content">

        <Navbar />

        {/* Hero plein écran */}
        <section className="book-hero">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">par {book.author}</p>
          <span className="book-scroll-hint">↓ commencer la lecture</span>
        </section>

        {/* Zone de lecture opaque */}
        <section className="book-reading-section">
          <div className="book-reading-inner">

            <p className="book-description">{book.description}</p>

            <h2 className="book-chapters-title">Chapitres</h2>
            <div className="chapters-list">
              <p className="chapters-empty">
                Les chapitres arrivent bientôt...
              </p>
            </div>

          </div>
        </section>

        {/* Retour bibliothèque */}
        <div className="book-footer-section">
          <Link href="/" className="book-back-link">
            ← retour à la bibliothèque
          </Link>
        </div>

      </div>
    </div>
  );
}