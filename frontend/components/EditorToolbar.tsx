// frontend/components/EditorToolbar.tsx
"use client";
import { useRef, useState } from "react";
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

  const colors = [
    { label: "Ambre", value: "#B38839" },
    { label: "Améthyste", value: "#6B4E9A" },
    { label: "Rose sombre", value: "#5C4A52" },
    { label: "Alerte", value: "#FB7B40" },
  ];

  return (
    <div className="editor-toolbar-format">
      <button type="button" title="Gras" onClick={() => apply(ta => wrapSelection(ta, "**"))}>
        <b>G</b>
      </button>
      <button type="button" title="Italique" onClick={() => apply(ta => wrapSelection(ta, "*"))}>
        <i>I</i>
      </button>

      <span className="editor-toolbar-sep" />

      <button type="button" title="Aligner à gauche"
        onClick={() => apply(ta => insertAtCursor(ta, `\n<div align="left">\n\ntexte\n\n</div>\n`))}>
        ⟸
      </button>
      <button type="button" title="Centrer"
        onClick={() => apply(ta => insertAtCursor(ta, `\n<div align="center">\n\ntexte\n\n</div>\n`))}>
        ⟺
      </button>
      <button type="button" title="Justifier"
        onClick={() => apply(ta => insertAtCursor(ta, `\n<div align="justify">\n\ntexte\n\n</div>\n`))}>
        ☰
      </button>

      <span className="editor-toolbar-sep" />

      <div className="editor-toolbar-popover-wrap">
        <button type="button" title="Couleur" onClick={() => setShowColors(v => !v)}>
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
        <button type="button" title="Émoticône" onClick={() => setShowEmojis(v => !v)}>
          ✦
        </button>
        {showEmojis && (
          <div className="editor-toolbar-popover">
            {EMOJIS.map(e => (
              <button
                key={e}
                type="button"
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