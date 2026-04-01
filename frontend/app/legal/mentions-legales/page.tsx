import Link from "next/link";
import "@/styles/global.css";
import "@/styles/legal.css";
import "@/styles/responsive.css";

export const metadata = {
  title: "Mentions Légales — Immers'Write",
  description: "Mentions légales obligatoires d'Immers'Write, conformément à la loi n°2004-575 du 21 juin 2004.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="legal-page">
      <header className="legal-hero">
        <Link href="/" style={{ textDecoration: "none" }}>
          <span className="legal-badge">Immers'Write</span>
        </Link>
        <h1>Mentions Légales</h1>
        <p className="legal-hero-meta">
          Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique
        </p>
      </header>

      <main className="legal-content">

        <section className="legal-section">
          <span className="legal-section-number">01</span>
          <h2>Éditeur du site</h2>
          <div className="legal-contact-card">
            <span className="legal-contact-label">Nom</span>
            <p className="legal-contact-value">Laure Lavie</p>
            <span className="legal-contact-label" style={{ marginTop: "0.75rem" }}>Qualité</span>
            <p className="legal-contact-value">
              Conceptrice-Développeuse d'Applications spécialisée IA (en formation),
              Fabrique Numérique Paloise — Pau, France
            </p>
            <span className="legal-contact-label" style={{ marginTop: "0.75rem" }}>Contact</span>
            <p className="legal-contact-value">
              <a href="mailto:immerswrite@gmail.com">immerswrite@gmail.com</a>
            </p>
            <span className="legal-contact-label" style={{ marginTop: "0.75rem" }}>Site web</span>
            <p className="legal-contact-value">
              <a href="https://www.immerswrite.com" target="_blank" rel="noopener noreferrer">
                www.immerswrite.com
              </a>
            </p>
          </div>
          <p>
            Immers'Write est actuellement en phase Alpha (projet de fin d'études). Il n'est pas encore
            commercialisé et ne possède pas de numéro SIRET. Les présentes mentions légales seront
            mises à jour lors du passage en phase commerciale (prévue post-certification, 2027).
          </p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">02</span>
          <h2>Directrice de la publication</h2>
          <p>Laure Lavie, en qualité de porteuse du projet Immers'Write.</p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">03</span>
          <h2>Hébergement</h2>
          <div className="legal-contact-card">
            <span className="legal-contact-label">Hébergeur principal</span>
            <p className="legal-contact-value">OVHcloud</p>
            <span className="legal-contact-label" style={{ marginTop: "0.75rem" }}>Adresse</span>
            <p className="legal-contact-value">
              2 rue Kellermann — 59100 Roubaix, France
            </p>
            <span className="legal-contact-label" style={{ marginTop: "0.75rem" }}>Site</span>
            <p className="legal-contact-value">
              <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">
                www.ovhcloud.com
              </a>
            </p>
          </div>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">04</span>
          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble du site Immers'Write — structure, design, textes, code source, logo, nom
            de marque, slogan "Where words become worlds", charte graphique — est la propriété
            exclusive de Laure Lavie, sauf mentions contraires.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication, transmission ou
            dénaturation, totale ou partielle, de ce site ou de son contenu, par quelque procédé
            que ce soit, et sur quelque support que ce soit, est interdite sans l'autorisation
            préalable écrite de l'éditrice.
          </p>
          <p>
            Les contenus (textes, images, sons) publiés par les auteurs sur la plateforme restent
            la propriété intellectuelle de leurs créateurs. En publiant sur Immers'Write, l'auteur
            accorde une licence d'affichage non exclusive, limitée au fonctionnement de la
            plateforme. Cette licence ne transfère aucun droit de propriété.
          </p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">05</span>
          <h2>Limitation de responsabilité</h2>
          <p>
            Immers'Write est une plateforme en phase de test (Alpha). Des bugs, interruptions de
            service ou pertes de données peuvent survenir. Immers'Write ne saurait être tenu
            responsable de tout dommage direct ou indirect lié à l'utilisation du service pendant
            cette phase expérimentale.
          </p>
          <p>
            Les contenus publiés par les utilisateurs engagent leur seule responsabilité.
            Immers'Write applique une modération manuelle pendant la phase Alpha et se réserve le
            droit de supprimer tout contenu contraire aux lois en vigueur ou aux Conditions
            Générales d'Utilisation.
          </p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">06</span>
          <h2>Droit applicable</h2>
          <p>
            Le présent site et ses mentions légales sont soumis au droit français. En cas de
            litige, et après tentative de résolution amiable, les tribunaux compétents seront
            ceux du ressort de Pau (France).
          </p>
        </section>

      </main>

      <footer className="legal-page-footer">
        <nav className="legal-nav-links">
          <Link href="/legal/mentions-legales" className="legal-nav-link"
            style={{ opacity: 1, color: "var(--amber)" }}>
            Mentions légales
          </Link>
          <Link href="/legal/cgu" className="legal-nav-link">CGU</Link>
          <Link href="/legal/politique-confidentialite" className="legal-nav-link">
            Confidentialité
          </Link>
          <Link href="/" className="legal-nav-link">← Retour à l'accueil</Link>
        </nav>
        <p>© 2026 Immers'Write — Laure Lavie</p>
      </footer>
    </div>
  );
}