

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  slug: string;
  is_published: boolean;
  created_at: string;
}

export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${API_URL}/books`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des livres');
  }
  return response.json();
}

export async function getBookBySlug(slug: string): Promise<Book> {
  const response = await fetch(`${API_URL}/books/${slug}`);
  if (!response.ok) {
    throw new Error('Livre non trouvé');
  }
  return response.json();
}