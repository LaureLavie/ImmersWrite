
"use client";
import "@/styles/echo-display.css";

interface EchoDisplayProps {
  counts: Record<string, number>;
  total: number;
}


const ECHO_ICONS: { id: string; src: string; label: string }[] = [
  { id: "emerveillement", src: "https://res.cloudinary.com/immerswrite/image/upload/v1772203016/emerveillement_rcb6no.png", label: "Émerveillement" },
  { id: "resonance",      src: "https://res.cloudinary.com/immerswrite/image/upload/v1772203018/resonance_b6kdxm.png",      label: "Résonance"      },
  { id: "intrigue",       src: "https://res.cloudinary.com/immerswrite/image/upload/v1772203022/intrigue_wlxxyn.png",       label: "Intrigue"       },
  { id: "tristesse",      src: "https://res.cloudinary.com/immerswrite/image/upload/v1772203014/triste_gtxys6.png",         label: "Tristesse"      },
  { id: "frisson",        src: "https://res.cloudinary.com/immerswrite/image/upload/v1772203011/frisson_izjfue.png",        label: "Frisson"        },
];

export default function EchoDisplay({ counts, total }: EchoDisplayProps) {
  if (total === 0) return null;

  return (
    <div className="echo-display">
      <span className="echo-display-label">
        {total} écho{total > 1 ? "s" : ""} partagé{total > 1 ? "s" : ""}
      </span>
      <div className="echo-display-row">
        {ECHO_ICONS.map(({ id, src, label }) => {
          const count = counts[id] ?? 0;
          if (count === 0) return null; 
          return (
            <div key={id} className="echo-display-item" title={label}>
              <img src={src} alt={label} className="echo-display-icon" />
              <span className="echo-display-count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}