"use client";
import { useState } from "react";

export default function ImageGenerator({ chapterId }: { chapterId: number }) {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, 
        },
        body: JSON.stringify({ prompt, chapter_id: chapterId }),
      });

      if (res.status === 429) {
        setError("Tu as atteint ton quota de 10 images pour la phase alpha.");
        return;
      }
      const data = await res.json();
      setImageUrl(data.image_url);
    } catch {
      setError("Erreur lors de la génération. Réessaie.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-900 rounded-lg">
      <textarea
        className="w-full p-3 rounded bg-gray-800 text-white"
        placeholder="Décris ton illustration... ex: Une forêt mystique sous une lune violette, style aquarelle"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
      />
      <button
        onClick={handleGenerate}
        disabled={isLoading || !prompt}
        className="px-6 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded disabled:opacity-50"
      >
        {isLoading ? "✨ Génération en cours..." : "🎨 Générer l'illustration"}
      </button>

      {error && <p className="text-red-400">{error}</p>}
      {imageUrl && (
        <img src={imageUrl} alt="Illustration générée" className="w-full rounded-lg" />
      )}
    </div>
  );
}