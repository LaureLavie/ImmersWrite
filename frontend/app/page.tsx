"use client";
import "@/styles/global.css";
import "@/styles/home.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CardBook from "@/components/CardBook";
import booksData from "@/lib/data/books.json";


export default function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <h1>Bibliothèque de Immers'Write</h1>

      <div className="container-book">
        {booksData.map((book) => (
          <CardBook
            key={book.id}
            src={book.coverUrl}
            title={book.title}
            description={book.description}
            link={`/book/${book.slug}`}
            status={book.status}
          />
        ))}
      </div>

      
      <Footer />
    </div>   
  );
}