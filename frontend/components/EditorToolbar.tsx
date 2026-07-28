// frontend/components/EditorToolbar.tsx
"use client";
import { useState } from "react";
import { wrapSelection, insertAtCursor } from "@/lib/editor/insertMarkdown";
import "@/styles/editor-toolbar.css";

const EMOJIS = ["✦", "🌑", "💓", "🧩", "🌊", "✨", "🖋️", "🌙", "🔥", "💫"];

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
}

export default function EditorToolbar({ textareaRef, onChange }: Props) {
  const [showEmojis, setShowEmojis] = useState(false);
  const [showColors, setShowColors] = useState(false);

  const apply = (fn: (ta: HTMLTextAreaElement) => string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    onChange(fn(ta));
  };

  // Empêche le textarea de perdre le focus/la sélection au clic
  const preventBlur = (e: React.MouseEvent) => e.preventDefault();

  // Enveloppe la sélection dans un bloc <div align="..."> (au lieu de "texte" en dur)
  const wrapBlock = (ta: HTMLTextAreaElement, align: string): string => {
    return wrapSelection(ta, `\n<div align="${align}">\n\n`, `\n\n</div>\n`);
  };

  const colors = [
    { label: "Ambre", value: "#B38839" },
    { label: "Améthyste", value: "#6B4E9A" },
    { label: "Rose sombre", value: "#5C4A52" },
    { label: "Alerte", value: "#FB7B40" },
  ];

  return (
    <div className="editor-toolbar-format">
      <button type="button" title="Gras"
        onMouseDown={preventBlur}
        onClick={() => apply(ta => wrapSelection(ta, "**"))}>
        <b>G</b>
      </button>
      <button type="button" title="Italique"
        onMouseDown={preventBlur}
        onClick={() => apply(ta => wrapSelection(ta, "*"))}>
        <i>I</i>
      </button>

      <span className="editor-toolbar-sep" />

      <button type="button" title="Aligner à gauche"
        onMouseDown={preventBlur}
        onClick={() => apply(ta => wrapBlock(ta, "left"))}>
        ⟸
      </button>
      <button type="button" title="Centrer"
        onMouseDown={preventBlur}
        onClick={() => apply(ta => wrapBlock(ta, "center"))}>
        ⟺
      </button>
      <button type="button" title="Justifier"
        onMouseDown={preventBlur}
        onClick={() => apply(ta => wrapBlock(ta, "justify"))}>
        ☰
      </button>

      <span className="editor-toolbar-sep" />

      <div className="editor-toolbar-popover-wrap">
        <button type="button" title="Couleur"
          onMouseDown={preventBlur}
          onClick={() => setShowColors(v => !v)}>
          🎨
        </button>
        {showColors && (
          <div className="editor-toolbar-popover">
            {colors.map(c => (
              <button
                key={c.value}
                type="button"
                style={{ background: c.value }}
                title={c.label}
                onMouseDown={preventBlur}
                onClick={() => {
                  apply(ta => wrapSelection(ta, `<span style="color:${c.value}">`, `</span>`));
                  setShowColors(false);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="editor-toolbar-popover-wrap">
        <button type="button" title="Émoticône"
          onMouseDown={preventBlur}
          onClick={() => setShowEmojis(v => !v)}>
          ✦
        </button>
        {showEmojis && (
          <div className="editor-toolbar-popover">
            {EMOJIS.map(e => (
              <button
                key={e}
                type="button"
                onMouseDown={preventBlur}
                onClick={() => {
                  apply(ta => insertAtCursor(ta, e));
                  setShowEmojis(false);
                }}
              >
                {e}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}