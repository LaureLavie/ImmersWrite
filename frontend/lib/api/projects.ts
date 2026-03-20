

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export interface Media {
  id: number;
  chapter_id: number;
  type: "image" | "sound";
  url: string;
  title: string | null;
  created_at: string;
}

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
  updated_at: string | null;
  medias: Media[];
}

export interface Project {
  id: number;
  user_id: number;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  slug: string;
  is_published: boolean;
  created_at: string;
  chapters: Chapter[];
}

export interface DeleteProjectResponse {
  message: string;
  deleted_project_id: number;
  deleted_project_title: string;
  chapters_deleted: number;
}


function authHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyProject(token: string): Promise<Project | null> {
  const res = await fetch(`${API_URL}/author/project`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Erreur lors de la récupération du projet");
  return res.json();
}

export async function createProject(
  token: string,
  data: { title: string; author_name: string; description?: string; cover_url?: string; slug: string }
): Promise<Project> {
  const res = await fetch(`${API_URL}/author/project`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Erreur lors de la création du projet");
  }
  return res.json();
}

export async function updateProject(
  token: string,
  data: { title?: string; author_name?: string; description?: string; cover_url?: string }
): Promise<Project> {
  const res = await fetch(`${API_URL}/author/project`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Erreur de mise à jour");
  }
  return res.json();
}

export async function deleteProject(token: string): Promise<DeleteProjectResponse> {
  const res = await fetch(`${API_URL}/author/project`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Impossible de supprimer le projet.");
  }
  return res.json();
}

export async function getMyChapters(token: string): Promise<Chapter[]> {
  const res = await fetch(`${API_URL}/author/project/chapters`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Impossible de récupérer les chapitres");
  return res.json();
}

export async function getMyChapter(token: string, order: number): Promise<Chapter> {
  const res = await fetch(`${API_URL}/author/project/chapters/${order}`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Chapitre ${order} introuvable`);
  return res.json();
}

export async function createChapter(
  token: string,
  data: { order: number; title: string; content?: string }
): Promise<Chapter> {
  const res = await fetch(`${API_URL}/author/project/chapters`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Erreur lors de la création du chapitre");
  }
  return res.json();
}

export async function saveChapter(
  token: string,
  order: number,
  data: { title?: string; content?: string; image_url?: string; sound_url?: string; sound_title?: string }
): Promise<Chapter> {
  const res = await fetch(`${API_URL}/author/project/chapters/${order}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Erreur de sauvegarde");
  }
  return res.json();
}

export async function deleteChapter(token: string, order: number): Promise<void> {
  const res = await fetch(`${API_URL}/author/project/chapters/${order}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Impossible de supprimer ce chapitre");
  }
}

export async function publishChapter(token: string, order: number): Promise<Chapter> {
  const res = await fetch(`${API_URL}/author/project/chapters/${order}/publish`, {
    method: "POST",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Impossible de publier ce chapitre");
  }
  return res.json();
}

export async function addMedia(
  token: string,
  chapterOrder: number,
  data: { type: "image" | "sound"; url: string; title?: string }
): Promise<Media> {
  const res = await fetch(`${API_URL}/author/project/chapters/${chapterOrder}/media`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Erreur lors de l'ajout du media");
  }
  return res.json();
}

export async function deleteMedia(
  token: string,
  chapterOrder: number,
  mediaId: number
): Promise<void> {
  const res = await fetch(
    `${API_URL}/author/project/chapters/${chapterOrder}/media/${mediaId}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Erreur lors de la suppression du media");
  }
}