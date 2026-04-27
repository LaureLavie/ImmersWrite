import Link from "next/link";
import "@/styles/global.css";
import "@/styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-legal-links">
      <Link href="/questionnaire">Partager mon avis →</Link>
      <span className="footer-legal-sep" aria-hidden="true">✦</span>
        <Link href="/legal/mentions-legales" className="footer-legal-link">
          Mentions légales
        </Link>
        <span className="footer-legal-sep" aria-hidden="true">✦</span>
        <Link href="/legal/cgu" className="footer-legal-link">
          CGU
        </Link>
        <span className="footer-legal-sep" aria-hidden="true">✦</span>
        <Link href="/legal/politique-confidentialite" className="footer-legal-link">
          Confidentialité
        </Link>
        <span className="footer-legal-sep" aria-hidden="true">✦</span>
      </div>
      <p>© 2026 Immers'Write — Laure Lavie</p>
      <p className="welcome-footer-sub">
          "Le code est le corps, l'imagination est l'âme."
        </p>
    </footer>
  );
}