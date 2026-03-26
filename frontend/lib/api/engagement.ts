const API_URL = process.env.NEXT_PUBLIC_API_URL;


export interface EchoCounts {
  chapter_id: number;
  total: number;
  counts: Record<string, number>;
}

export interface CommentType {
  id: number;
  chapter_id: number;
  user_id: number | null;
  user_label: string | null;
  parent_id: number | null;
  content: string;
  is_author_reply: boolean;
  created_at: string;
  replies: CommentType[];
}

export interface ProjectStats {
  total_views: number;
  total_echoes: number;
  chapters: {
    chapter_id: number;
    order: number;
    title: string;
    view_count: number;
    echo_total: number;
  }[];
}

// ── Vues ───────────────────────────────────────────────────────────────────

export async function recordView(slug: string, order: number): Promise<void> {
  
  try {
    await fetch(`${API_URL}/books/${slug}/chapters/${order}/view`, {
      method: "POST",
    });
  } catch {    
  }
}



export async function addEcho(slug: string, order: number, type: string): Promise<void> {
  await fetch(`${API_URL}/books/${slug}/chapters/${order}/echo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });
}

export async function getEchoes(slug: string, order: number): Promise<EchoCounts> {
  const res = await fetch(`${API_URL}/books/${slug}/chapters/${order}/echoes`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Impossible de récupérer les échos");
  return res.json();
}

export async function getComments(slug: string, order: number): Promise<CommentType[]> {
  const res = await fetch(`${API_URL}/books/${slug}/chapters/${order}/comments`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Impossible de récupérer les commentaires");
  return res.json();
}

export async function addComment(
  slug: string,
  order: number,
  content: string,
  token: string,
  parentId?: number
): Promise<CommentType> {
  const res = await fetch(`${API_URL}/books/${slug}/chapters/${order}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, parent_id: parentId ?? null }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Impossible d'envoyer le commentaire.");
  }
  return res.json();
}

export async function getProjectStats(token: string): Promise<ProjectStats> {
  const res = await fetch(`${API_URL}/author/project/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Impossible de récupérer les statistiques");
  return res.json();
}