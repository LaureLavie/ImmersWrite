import Link from "next/link";
import "@/styles/global.css";
import "@/styles/legal.css";
import "@/styles/responsive.css";

export const metadata = {
  title: "Politique de Confidentialité — Immers'Write",
  description:
    "Comment Immers'Write collecte, utilise et protège vos données personnelles, conformément au RGPD.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="legal-page">
      {/* ── Hero ── */}
      <header className="legal-hero">
        <Link href="/" style={{ textDecoration: "none" }}>
          <span className="legal-badge">Immers'Write</span>
        </Link>
        <h1>Politique de Confidentialité</h1>
        <p className="legal-hero-meta">
          Dernière mise à jour&nbsp;: 1er juin 2026 &nbsp;·&nbsp; Version 1.0
        </p>
      </header>

      {/* ── Contenu ── */}
      <main className="legal-content">

        {/* ── Préambule ── */}
        <div className="legal-highlight">
          <p>
            Chers voyageurs, la confiance est le premier seuil à franchir. Cette politique explique
            avec transparence quelles données nous collectons, pourquoi, et comment vous pouvez
            exercer vos droits — en langage humain, pas en jargon juridique opaque.
          </p>
        </div>

        {/* ── 1. Responsable du traitement ── */}
        <section className="legal-section">
          <span className="legal-section-number">01</span>
          <h2>Responsable du traitement</h2>
          <p>
            Le traitement de vos données personnelles est effectué par&nbsp;:
          </p>
          <div className="legal-contact-card">
            <span className="legal-contact-label">Responsable</span>
            <p className="legal-contact-value">Laure Lavie — Créatrice d'Immers'Write</p>
            <span className="legal-contact-label" style={{ marginTop: "0.75rem" }}>
              Statut
            </span>
            <p className="legal-contact-value">
              Projet en phase Alpha — formation CDA spécialisée IA,
              Fabrique Numérique Paloise, Pau (France)
            </p>
            <span className="legal-contact-label" style={{ marginTop: "0.75rem" }}>
              Contact
            </span>
            <p className="legal-contact-value">
              <a href="mailto:immerswrite@gmail.com">immerswrite@gmail.com</a>
            </p>
          </div>
        </section>

        <div className="legal-divider">
          <span className="legal-divider-icon">✦</span>
        </div>

        {/* ── 2. Données collectées ── */}
        <section className="legal-section">
          <span className="legal-section-number">02</span>
          <h2>Données que nous collectons</h2>
          <p>
            Immers'Write collecte uniquement les données strictement nécessaires au
            fonctionnement de la plateforme. Nous appliquons le principe de minimisation des
            données (art. 5 RGPD).
          </p>

          <div className="legal-table-wrapper">
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Donnée</th>
                  <th>Finalité</th>
                  <th>Base légale</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Adresse e-mail</td>
                  <td>Création de compte, confirmation d'inscription, réinitialisation de mot de passe</td>
                  <td>Exécution du contrat</td>
                </tr>
                <tr>
                  <td>Mot de passe (haché bcrypt)</td>
                  <td>Authentification sécurisée — jamais stocké en clair</td>
                  <td>Exécution du contrat</td>
                </tr>
                <tr>
                  <td>Rôle (lecteur / auteur)</td>
                  <td>Personnalisation de l'expérience et contrôle des accès</td>
                  <td>Exécution du contrat</td>
                </tr>
                <tr>
                  <td>Contenus créés (titres, chapitres, descriptions)</td>
                  <td>Affichage et publication des histoires sur la plateforme</td>
                  <td>Exécution du contrat</td>
                </tr>
                <tr>
                  <td>URLs de médias importés (images, sons)</td>
                  <td>Enrichissement immersif des chapitres</td>
                  <td>Exécution du contrat</td>
                </tr>
                <tr>
                  <td>Prompts de génération d'images IA</td>
                  <td>Génération d'illustrations via DALL·E 3 et suivi des quotas</td>
                  <td>Exécution du contrat</td>
                </tr>
                <tr>
                  <td>Cookies de session (JWT)</td>
                  <td>Maintien de la connexion sécurisée</td>
                  <td>Intérêt légitime / consentement</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            <strong style={{ color: "var(--lunar)", fontWeight: 400 }}>Ce que nous ne collectons pas&nbsp;:</strong>{" "}
            données de navigation avancées, suivi publicitaire, vente de données à des tiers,
            localisation, données biométriques.
          </p>
        </section>

        <div className="legal-divider">
          <span className="legal-divider-icon">✦</span>
        </div>

        {/* ── 3. Durée de conservation ── */}
        <section className="legal-section">
          <span className="legal-section-number">03</span>
          <h2>Durée de conservation</h2>
          <ul className="legal-list">
            <li>
              <strong>Données de compte</strong> — conservées pendant toute la durée de votre
              utilisation active, puis supprimées dans un délai de 30 jours suivant la demande
              de suppression de compte.
            </li>
            <li>
              <strong>Contenus publiés</strong> — conservés tant que le compte auteur est actif.
              La suppression du compte entraîne la suppression en cascade de tous les projets,
              chapitres et médias associés.
            </li>
            <li>
              <strong>Tokens JWT</strong> — expiration automatique après 24 heures.
            </li>
            <li>
              <strong>Logs de génération IA</strong> — conservés 90 jours à des fins de suivi
              des quotas (phase alpha), puis supprimés.
            </li>
            <li>
              <strong>E-mails de confirmation / réinitialisation</strong> — liens valables 24h
              (confirmation) ou 1h (réinitialisation), non conservés après expiration.
            </li>
          </ul>
        </section>

        <div className="legal-divider">
          <span className="legal-divider-icon">✦</span>
        </div>

        {/* ── 4. Services tiers ── */}
        <section className="legal-section">
          <span className="legal-section-number">04</span>
          <h2>Services tiers et sous-traitants</h2>
          <p>
            Immers'Write fait appel à des prestataires techniques pour assurer son fonctionnement.
            Ces sous-traitants sont contractuellement engagés à respecter la confidentialité de vos
            données.
          </p>
          <ul className="legal-list">
            <li>
              <strong>OpenAI (DALL·E 3)</strong> — génération d'images IA à partir de vos
              prompts. Vos prompts sont transmis à l'API OpenAI et soumis à leur{" "}
              <a
                href="https://openai.com/policies/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                politique de confidentialité
              </a>.
            </li>
            <li>
              <strong>OVH (hébergement VPS)</strong> — hébergement de l'application et de la
              base de données sur des serveurs localisés en France / Union Européenne.
            </li>
            <li>
              <strong>Neon / PostgreSQL</strong> — hébergement de la base de données relationnelle.
            </li>
            <li>
              <strong>Cloudinary</strong> — stockage et diffusion des images de couverture
              d'histoires.
            </li>
          </ul>
          <p>
            Aucune donnée n'est vendue, louée ou partagée avec des tiers à des fins publicitaires.
            Immers'Write ne contient aucune publicité.
          </p>
        </section>

        <div className="legal-divider">
          <span className="legal-divider-icon">✦</span>
        </div>

        {/* ── 5. Cookies ── */}
        <section className="legal-section">
          <span className="legal-section-number">05</span>
          <h2>Cookies et stockage local</h2>
          <p>
            Immers'Write utilise uniquement des cookies fonctionnels, strictement nécessaires au
            fonctionnement du service&nbsp;:
          </p>
          <ul className="legal-list">
            <li>
              <strong>access_token</strong> — cookie de session sécurisé (JWT) permettant de
              maintenir votre connexion. Durée de vie&nbsp;: 24 heures. Ce cookie est essentiel
              au service et ne nécessite pas de consentement préalable au titre de la directive
              ePrivacy.
            </li>
            <li>
              <strong>user_role</strong> — cookie stockant votre rôle (lecteur / auteur) afin
              d'afficher l'interface adaptée. Durée de vie&nbsp;: 24 heures.
            </li>
          </ul>
          <p>
            Nous n'utilisons pas de cookies analytiques, publicitaires ou de tracking tiers.
            Aucun outil de type Google Analytics n'est installé sur la plateforme.
          </p>
        </section>

        <div className="legal-divider">
          <span className="legal-divider-icon">✦</span>
        </div>

        {/* ── 6. Sécurité ── */}
        <section className="legal-section">
          <span className="legal-section-number">06</span>
          <h2>Sécurité des données</h2>
          <p>
            La protection de vos données est une priorité architecturale d'Immers'Write.
            Les mesures techniques en place comprennent&nbsp;:
          </p>
          <ul className="legal-list">
            <li>Chiffrement des mots de passe via l'algorithme bcrypt (irréversible)</li>
            <li>Authentification par tokens JWT signés avec une clé secrète</li>
            <li>Communication HTTPS (certificat SSL/TLS via Certbot)</li>
            <li>Accès aux routes sensibles protégé par middleware d'authentification</li>
            <li>Isolation des services via conteneurs Docker</li>
            <li>Sauvegardes automatiques quotidiennes de la base de données</li>
          </ul>
          <p>
            En cas de violation de données présentant un risque pour vos droits et libertés,
            vous serez notifié dans les 72 heures conformément à l'article 34 du RGPD.
          </p>
        </section>

        <div className="legal-divider">
          <span className="legal-divider-icon">✦</span>
        </div>

        {/* ── 7. Vos droits ── */}
        <section className="legal-section">
          <span className="legal-section-number">07</span>
          <h2>Vos droits RGPD</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD — règlement UE
            2016/679), vous disposez des droits suivants concernant vos données personnelles&nbsp;:
          </p>
          <ul className="legal-list">
            <li>
              <strong>Droit d'accès (art. 15)</strong> — obtenir une copie des données que nous
              détenons sur vous.
            </li>
            <li>
              <strong>Droit de rectification (art. 16)</strong> — corriger des informations
              inexactes ou incomplètes.
            </li>
            <li>
              <strong>Droit à l'effacement (art. 17)</strong> — supprimer votre compte et
              toutes les données associées. La suppression est effective sous 30 jours.
            </li>
            <li>
              <strong>Droit à la portabilité (art. 20)</strong> — recevoir vos données dans un
              format structuré et lisible.
            </li>
            <li>
              <strong>Droit d'opposition (art. 21)</strong> — vous opposer à tout traitement
              de vos données basé sur notre intérêt légitime.
            </li>
            <li>
              <strong>Droit à la limitation du traitement (art. 18)</strong> — demander la
              suspension temporaire du traitement de vos données.
            </li>
          </ul>
          <p>
            Pour exercer l'un de ces droits, contactez-nous par e-mail&nbsp;:{" "}
            <a href="mailto:immerswrite@gmail.com">immerswrite@gmail.com</a>. Nous nous
            engageons à répondre dans un délai de <strong>30 jours</strong>. En cas de
            réclamation non résolue, vous pouvez saisir la{" "}
            <a
              href="https://www.cnil.fr/fr/plaintes"
              target="_blank"
              rel="noopener noreferrer"
            >
              CNIL (Commission Nationale de l'Informatique et des Libertés)
            </a>.
          </p>
        </section>

        <div className="legal-divider">
          <span className="legal-divider-icon">✦</span>
        </div>

        {/* ── 8. Transferts hors UE ── */}
        <section className="legal-section">
          <span className="legal-section-number">08</span>
          <h2>Transferts de données hors Union Européenne</h2>
          <p>
            Certains sous-traitants (OpenAI) sont basés aux États-Unis. Ces transferts sont
            encadrés par les clauses contractuelles types (CCT) approuvées par la Commission
            européenne, conformément à l'article 46 du RGPD. L'hébergement principal de
            la plateforme et de la base de données est situé en Union Européenne.
          </p>
        </section>

        <div className="legal-divider">
          <span className="legal-divider-icon">✦</span>
        </div>

        {/* ── 9. Mineurs ── */}
        <section className="legal-section">
          <span className="legal-section-number">09</span>
          <h2>Protection des mineurs</h2>
          <p>
            Immers'Write est destiné aux personnes âgées de <strong>13 ans et plus</strong>.
            Conformément à la réglementation française (loi du 7 juillet 2023 relative à la
            majorité numérique), les utilisateurs de moins de 15 ans doivent disposer du
            consentement de leur représentant légal pour créer un compte. Si vous êtes
            représentant légal d'un mineur et souhaitez signaler un usage inapproprié ou
            demander la suppression d'un compte, contactez-nous à{" "}
            <a href="mailto:immerswrite@gmail.com">immerswrite@gmail.com</a>.
          </p>
        </section>

        <div className="legal-divider">
          <span className="legal-divider-icon">✦</span>
        </div>

        {/* ── 10. Modifications ── */}
        <section className="legal-section">
          <span className="legal-section-number">10</span>
          <h2>Modifications de cette politique</h2>
          <p>
            Immers'Write est en constante évolution — et cette politique aussi. En cas de
            modification substantielle (nouvelles données collectées, nouveaux sous-traitants,
            changement de finalité), vous serez notifié par e-mail au moins 15 jours avant
            l'entrée en vigueur des changements. La date de dernière mise à jour figure en
            haut de cette page. L'utilisation continue de la plateforme après notification
            vaut acceptation des nouvelles conditions.
          </p>
        </section>

        {/* ── Contact final ── */}
        <div className="legal-highlight">
          <p>
            Une question sur vos données&nbsp;? Une inquiétude&nbsp;? Nous préférons une
            conversation directe à une plainte formelle. Écrivez-nous à{" "}
            <a href="mailto:immerswrite@gmail.com">immerswrite@gmail.com</a> — nous
            répondons dans les 48 heures.
          </p>
        </div>

      </main>

      {/* ── Footer navigation légale ── */}
      <footer className="legal-page-footer">
        <nav className="legal-nav-links">
          <Link href="/legal/mentions-legales" className="legal-nav-link">
            Mentions légales
          </Link>
          <Link href="/legal/cgu" className="legal-nav-link">
            CGU
          </Link>
          <Link href="/legal/politique-confidentialite" className="legal-nav-link"
            style={{ opacity: 1, color: "var(--amber)" }}>
            Confidentialité
          </Link>
          <Link href="/" className="legal-nav-link">
            ← Retour à l'accueil
          </Link>
        </nav>
        <p>© 2026 Immers'Write — Laure Lavie</p>
      </footer>
    </div>
  );
}