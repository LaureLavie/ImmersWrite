
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Chapter {
  id: number;
  book_id: number;
  order: number;
  title: string;
  content: string | null;
  image_url: string | null;      
  sound_url: string | null;      
  sound_title: string | null;
  is_published: boolean;
  created_at: string;
}


export async function getChaptersBySlug(slug: string): Promise<Chapter[]> {
  const res = await fetch(`${API_URL}/books/${slug}/chapters`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Chapitres introuvables");
  return res.json();
}


export async function getChapterByOrder(slug: string, order: number): Promise<Chapter> {
  const res = await fetch(`${API_URL}/books/${slug}/chapters/${order}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Chapitre introuvable");
  return res.json();
}