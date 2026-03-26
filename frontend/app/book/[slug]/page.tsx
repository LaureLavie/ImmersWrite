"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBookBySlug, type Book } from "@/lib/api/books";
import { getChaptersBySlug, type Chapter } from "@/lib/api/chapters";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import "@/styles/book.css";
import "@/styles/responsive.css";

export default function BookPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      try {
        const [bookData, chaptersData] = await Promise.all([
          getBookBySlug(slug),
          getChaptersBySlug(slug),
        ]);
        setBook(bookData);
        setChapters(chaptersData);
      } catch {
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

      {book.cover_url && (
        <img
          src={book.cover_url}
          alt={book.title}
          className="book-immersive-bg"
        />
      )}

      <div className="book-page-content">
        <Navbar />

        {/* Hero plein écran */}
        <section className="book-hero">
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">par {book.author}</p>
        </section>

        {/* Zone de lecture */}
        <section className="book-reading-section">
          <div className="book-reading-inner">
          <h2 className="book-chapters-title">Synopsis</h2>

            <p className="book-description">{book.description}</p>

            <h2 className="book-chapters-title">Chapitres</h2>

            <div className="chapters-list">
              {chapters.length === 0 ? (
                <p className="chapters-empty">
                  Les chapitres arrivent bientôt...
                </p>
              ) : (
                chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/book/${slug}/${chapter.order}`}
                    className="chapter-item"
                  >
                    <span className="chapter-number">{String(chapter.order).padStart(2, "0")}</span>
                    <span className="chapter-title">{chapter.title}</span>
                  </Link>
                ))
              )}
            </div>

          </div>
        </section>

        <div className="book-footer-section">
          <Link href="/bibliotheque" className="book-back-link">
            ← retour à la bibliothèque
          </Link>
        </div>

      </div>
    </div>
  );
}