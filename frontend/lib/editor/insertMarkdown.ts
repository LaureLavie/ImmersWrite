// frontend/lib/editor/insertMarkdown.ts

export function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string = before
): string {
  const { selectionStart, selectionEnd, value } = textarea;
  const selected = value.slice(selectionStart, selectionEnd) || "texte";
  const newValue =
    value.slice(0, selectionStart) +
    before + selected + after +
    value.slice(selectionEnd);

  // repositionne le curseur après l'insertion
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.selectionStart = selectionStart + before.length;
    textarea.selectionEnd = selectionStart + before.length + selected.length;
  });

  return newValue;
}

export function insertAtCursor(textarea: HTMLTextAreaElement, text: string): string {
  const { selectionStart, selectionEnd, value } = textarea;
  const newValue = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
  requestAnimationFrame(() => {
    textarea.focus();
    const pos = selectionStart + text.length;
    textarea.selectionStart = textarea.selectionEnd = pos;
  });
  return newValue;
}