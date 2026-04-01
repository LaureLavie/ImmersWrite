import Link from "next/link";
import "@/styles/global.css";
import "@/styles/legal.css";
import "@/styles/responsive.css";

export const metadata = {
  title: "Conditions Générales d'Utilisation — Immers'Write",
  description:
    "Les règles du voyage dans Immers'Write — droits, obligations et engagement mutuel entre la plateforme et ses voyageurs.",
};

export default function CGUPage() {
  return (
    <div className="legal-page">
      <header className="legal-hero">
        <Link href="/" style={{ textDecoration: "none" }}>
          <span className="legal-badge">Immers'Write</span>
        </Link>
        <h1>Conditions Générales d'Utilisation</h1>
        <p className="legal-hero-meta">
          Dernière mise à jour&nbsp;: 1er juin 2026 &nbsp;·&nbsp; Version 1.0 — Phase Alpha
        </p>
      </header>

      <main className="legal-content">

        <div className="legal-highlight">
          <p>
            Ces CGU définissent le contrat entre vous et Immers'Write. Elles sont rédigées pour
            être lues et comprises — pas pour décourager. En créant un compte, vous acceptez
            ce voyage ensemble.
          </p>
        </div>

        <section className="legal-section">
          <span className="legal-section-number">01</span>
          <h2>Présentation et accès au service</h2>
          <p>
            Immers'Write est une plateforme web de lecture et d'écriture immersive combinant
            littérature et intelligence artificielle générative. Elle permet aux auteurs de
            publier des chapitres enrichis (texte, image IA, médias) et aux lecteurs de vivre
            une expérience narrative multisensorielle.
          </p>
          <p>
            Pendant la phase Alpha (juin – août 2026), l'accès est limité à un groupe restreint
            de testeurs invités. La plateforme est disponible à l'adresse{" "}
            <a href="https://www.immerswrite.com" target="_blank" rel="noopener noreferrer">
              www.immerswrite.com
            </a>. L'accès nécessite la création d'un compte et la confirmation de l'adresse e-mail.
          </p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">02</span>
          <h2>Création de compte et conditions d'accès</h2>
          <p>Pour accéder à Immers'Write, vous devez&nbsp;:</p>
          <ul className="legal-list">
            <li>Être âgé de 13 ans minimum (15 ans pour les résidents français sans consentement parental)</li>
            <li>Fournir une adresse e-mail valide et un mot de passe d'au moins 8 caractères</li>
            <li>Choisir un rôle : Lecteur ou Auteur</li>
            <li>Confirmer votre inscription via le lien envoyé par e-mail</li>
            <li>Accepter les présentes CGU et la Politique de Confidentialité</li>
          </ul>
          <p>
            Vous êtes responsable de la confidentialité de vos identifiants. Tout accès à votre
            compte via vos identifiants est présumé vous être imputable. En cas de perte ou de
            compromission, utilisez la procédure de réinitialisation de mot de passe ou
            contactez-nous.
          </p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">03</span>
          <h2>Rôles et fonctionnalités</h2>
          <div className="legal-table-wrapper">
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Fonctionnalité</th>
                  <th>Lecteur</th>
                  <th>Auteur</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lire les histoires publiées</td>
                  <td>✦</td>
                  <td>✦</td>
                </tr>
                <tr>
                  <td>Laisser un commentaire / écho émotionnel</td>
                  <td>✦</td>
                  <td>✦</td>
                </tr>
                <tr>
                  <td>Créer un projet d'écriture</td>
                  <td>—</td>
                  <td>✦ (1 projet en Alpha)</td>
                </tr>
                <tr>
                  <td>Écrire et publier des chapitres</td>
                  <td>—</td>
                  <td>✦</td>
                </tr>
                <tr>
                  <td>Générer des images via IA (DALL·E 3)</td>
                  <td>—</td>
                  <td>✦ (10 images max en Alpha)</td>
                </tr>
                <tr>
                  <td>Importer des médias (images, sons)</td>
                  <td>—</td>
                  <td>✦ (2 images + 1 son / chapitre)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Les limites indiquées (1 projet, 10 images, etc.) sont propres à la phase Alpha et
            seront étendues dans les versions ultérieures du service.
          </p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">04</span>
          <h2>Propriété des contenus et licence</h2>
          <p>
            <strong style={{ color: "var(--lunar)", fontWeight: 400 }}>Vos contenus vous appartiennent.</strong>{" "}
            Les textes, histoires, descriptions et médias que vous publiez restent votre propriété
            intellectuelle exclusive.
          </p>
          <p>
            En publiant sur Immers'Write, vous accordez à la plateforme une licence d'affichage
            non exclusive, mondiale, gratuite et limitée à la durée de votre présence sur la
            plateforme, pour les seules finalités suivantes&nbsp;: afficher votre contenu aux
            lecteurs, l'inclure dans les pages de la bibliothèque, l'associer à votre profil
            auteur.
          </p>
          <p>
            Concernant les <strong style={{ color: "var(--lunar)", fontWeight: 400 }}>images générées par IA</strong>&nbsp;:
            les droits sur les images produites via DALL·E 3 sont soumis aux conditions
            d'utilisation d'OpenAI. En règle générale, vous êtes libre d'utiliser les images
            générées pour vos usages personnels et commerciaux dans le cadre des{" "}
            <a
              href="https://openai.com/policies/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
            >
              conditions OpenAI
            </a>.
          </p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">05</span>
          <h2>Règles de la communauté</h2>
          <p>
            Immers'Write est un espace protégé, construit sur le respect et la profondeur.
            Les contenus suivants sont <strong style={{ color: "var(--careful)", fontWeight: 400 }}>strictement interdits</strong>&nbsp;:
          </p>
          <ul className="legal-list">
            <li>Contenus à caractère sexuel explicite, particulièrement impliquant des mineurs (tolérance zéro)</li>
            <li>Propos haineux, discriminatoires, racistes, homophobes ou incitant à la violence</li>
            <li>Harcèlement, menaces ou atteinte à la vie privée d'autrui</li>
            <li>Contenus violant les droits d'auteur de tiers (textes, images, musiques copiés sans autorisation)</li>
            <li>Informations personnelles d'autres utilisateurs partagées sans consentement</li>
            <li>Contenus générés par IA contournant délibérément les filtres de sécurité d'OpenAI</li>
            <li>Spam, démarchage commercial, contenus publicitaires non sollicités</li>
          </ul>
          <p>
            Immers'Write se réserve le droit de supprimer tout contenu non conforme et de
            suspendre ou supprimer le compte contrevenant, sans préavis en cas de violation grave.
          </p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">06</span>
          <h2>Signalement de contenus inappropriés</h2>
          <p>
            Si vous constatez un contenu qui vous semble contraire aux présentes CGU ou aux lois
            en vigueur, contactez-nous immédiatement à{" "}
            <a href="mailto:immerswrite@gmail.com">immerswrite@gmail.com</a> avec le lien
            vers le contenu concerné et une description du problème. Nous traitons chaque
            signalement dans un délai de 48 heures ouvrées.
          </p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">07</span>
          <h2>Disponibilité du service — Phase Alpha</h2>
          <p>
            Immers'Write est en phase de développement actif. Des interruptions, bugs ou pertes
            de données peuvent survenir. Nous nous engageons à&nbsp;:
          </p>
          <ul className="legal-list">
            <li>Communiquer transparemment sur les incidents via le blog et les réseaux sociaux</li>
            <li>Corriger les bugs critiques dans un délai de 24 heures</li>
            <li>Effectuer des sauvegardes quotidiennes de la base de données</li>
            <li>Ne pas modifier unilatéralement les contenus publiés par les auteurs</li>
          </ul>
          <p>
            Immers'Write ne saurait être tenu responsable de toute interruption de service pendant
            la phase Alpha. L'utilisation de la plateforme pendant cette période implique
            l'acceptation de ce contexte expérimental.
          </p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">08</span>
          <h2>Résiliation et suppression de compte</h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment en contactant{" "}
            <a href="mailto:immerswrite@gmail.com">immerswrite@gmail.com</a>.
            La suppression entraîne l'effacement définitif de votre adresse e-mail, de vos projets,
            chapitres et médias associés dans un délai de 30 jours.
          </p>
          <p>
            <strong style={{ color: "var(--lunar)", fontWeight: 400 }}>Attention</strong> :
            les chapitres déjà publiés et commentés par des lecteurs ne peuvent être restaurés
            après suppression.
          </p>
          <p>
            Immers'Write se réserve le droit de suspendre ou supprimer un compte en cas de
            violation grave et répétée des présentes CGU, après notification préalable sauf
            urgence (contenus illicites, sécurité de la plateforme).
          </p>
        </section>

        <div className="legal-divider"><span className="legal-divider-icon">✦</span></div>

        <section className="legal-section">
          <span className="legal-section-number">09</span>
          <h2>Évolution des CGU</h2>
          <p>
            Les présentes CGU peuvent être modifiées pour refléter l'évolution du service,
            de la législation ou des pratiques de la plateforme. En cas de modification
            substantielle, vous serez notifié par e-mail au moins 15 jours avant l'entrée
            en vigueur des nouvelles conditions. Le maintien de votre utilisation vaudra
            acceptation des nouvelles CGU.
          </p>
        </section>

        <section className="legal-section">
          <span className="legal-section-number">10</span>
          <h2>Droit applicable et juridiction</h2>
          <p>
            Les présentes CGU sont régies par le droit français. En cas de litige, une solution
            amiable sera d'abord recherchée. À défaut, les tribunaux compétents seront ceux
            du ressort de Pau (France).
          </p>
        </section>

      </main>

      <footer className="legal-page-footer">
        <nav className="legal-nav-links">
          <Link href="/legal/mentions-legales" className="legal-nav-link">Mentions légales</Link>
          <Link href="/legal/cgu" className="legal-nav-link"
            style={{ opacity: 1, color: "var(--amber)" }}>CGU</Link>
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