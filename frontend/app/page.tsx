"use client";
import { useEffect, useState } from "react";
import "@/styles/global.css";
import "@/styles/home.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardBook from "@/components/CardBook";
import { getBooks, type Book } from "@/lib/api/books";
import "@/styles/cardbook.css";
import "@/styles/responsive.css";

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  if (loading) return <div className="home-container">Chargement...</div>;

  return (
    <div className="home-page">
      <Navbar />
      <h1>Bibliothèque Immers'Write</h1>
      <h2>Découvrer les histoires, entrer dans les mondes...</h2>
      {books.length === 0 ? (
        <div className="home-empty">
          <p>Aucune histoire disponible pour l'instant.</p>
          <p className="home-empty-hint">Les auteurs préparent leurs mondes...</p>
        </div>
      ) : (
        <div className="container-book">
          {books.map((book) => (
            <CardBook
              key={book.id}
              src={book.cover_url}
              title={book.title}
              description={book.description}
              link={`/book/${book.slug}`}
            />
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}