"use client";

import { useState } from "react";
import "@/styles/alpha-tester.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ─────────────────────────────────────────────────────────
   Questions Lecteur
───────────────────────────────────────────────────────── */
const QUESTIONS_LECTEUR = [
  {
    id: "plateformes",
    label: "Où lis-tu habituellement de la fiction en ligne ?",
    type: "checkbox",
    options: ["Wattpad", "AO3 / FanFiction", "Royal Road", "Kindle / Ebooks", "Blogs / Newsletters", "Autre"],
  },
  {
    id: "frequence",
    label: "À quelle fréquence lis-tu de la fiction en ligne ?",
    type: "radio",
    options: ["Tous les jours", "Plusieurs fois par semaine", "Une fois par semaine", "Occasionnellement"],
  },
  {
    id: "immersion",
    label: "Écoutes-tu de la musique ou regardes-tu des images pour t'immerger dans une histoire ?",
    type: "radio",
    options: ["Oui, toujours", "Parfois", "Non, jamais", "Non, mais ça m'intéresserait"],
  },
  {
    id: "frustration",
    label: "Quelle est ta plus grande frustration avec les plateformes de lecture actuelles ?",
    type: "textarea",
    placeholder: "Interface froide, pas d'immersion, contenu noyé dans la masse…",
  },
  {
    id: "attente_alpha",
    label: "Qu'est-ce que tu attends le plus d'Immers'Write en tant que lecteur ?",
    type: "textarea",
    placeholder: "Ce que tu rêves de vivre, voir, ressentir quand tu lis une histoire…",
  },
  {
    id: "feedback",
    label: "Es-tu prêt à donner des retours réguliers pendant la phase alpha ?",
    type: "radio",
    options: ["Oui, avec plaisir", "Oui, si ce n'est pas trop long", "Peut-être", "Je ne suis pas sûr"],
  },
];

/* ─────────────────────────────────────────────────────────
   Questions Auteur
───────────────────────────────────────────────────────── */
const QUESTIONS_AUTEUR = [
  {
    id: "plateformes_auteur",
    label: "Où publies-tu ou partages-tu tes écrits actuellement ?",
    type: "checkbox",
    options: ["Wattpad", "AO3 / FanFiction", "Blog personnel", "Royal Road", "Réseaux sociaux", "Nulle part encore", "Autre"],
  },
  {
    id: "genre",
    label: "Dans quel(s) genre(s) écris-tu ?",
    type: "checkbox",
    options: ["Fantasy / Fantastique", "Science-Fiction", "Romance", "Thriller / Horreur", "Contemporain", "Paranormal / Mystique", "Autre"],
  },
  {
    id: "ia_usage",
    label: "Utilises-tu déjà des outils IA dans ton processus créatif ?",
    type: "radio",
    options: ["Oui, régulièrement (images, textes, sons…)", "Oui, parfois", "Non, mais ça m'intéresse", "Non, et je préfère sans"],
  },
  {
    id: "blocage",
    label: "Quel est ton plus grand blocage en tant qu'auteur en ligne aujourd'hui ?",
    type: "textarea",
    placeholder: "Page blanche, outils éparpillés, difficulté à illustrer mes univers…",
  },
  {
    id: "attente_alpha_auteur",
    label: "Qu'espères-tu créer ou expérimenter sur Immers'Write ?",
    type: "textarea",
    placeholder: "L'univers que tu voudrais donner à lire, les ambiances que tu veux créer…",
  },
  {
    id: "feedback_auteur",
    label: "Es-tu prêt à tester les fonctionnalités auteur et envoyer des retours détaillés ?",
    type: "radio",
    options: ["Oui, je suis partant", "Oui, si les fonctionnalités m'intéressent", "Peut-être", "Je veux d'abord en savoir plus"],
  },
];

const ECHOS_CONFIRMATION = [
  {
    id: "emerveillement",
    src: "https://res.cloudinary.com/immerswrite/image/upload/v1772203016/emerveillement_rcb6no.png",
    label: "Émerveillement",
  },
  {
    id: "resonance",
    src: "https://res.cloudinary.com/immerswrite/image/upload/v1772203018/resonance_b6kdxm.png",
    label: "Résonance",
  },
  {
    id: "intrigue",
    src: "https://res.cloudinary.com/immerswrite/image/upload/v1772203022/intrigue_wlxxyn.png",
    label: "Intrigue",
  },
  {
    id: "frisson",
    src: "https://res.cloudinary.com/immerswrite/image/upload/v1772203011/frisson_izjfue.png",
    label: "Frisson",
  },
];

const TOTAL_STEPS = 4;

/* ─────────────────────────────────────────────────────────
   Composant principal
───────────────────────────────────────────────────────── */
export default function AlphaTesterSection() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"lecteur" | "auteur" | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [activeEcho, setActiveEcho] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const questions = role === "lecteur" ? QUESTIONS_LECTEUR : QUESTIONS_AUTEUR;

  const handleAnswer = (id: string, value: string, type: string) => {
    if (type === "checkbox") {
      const current = (answers[id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers((prev) => ({ ...prev, [id]: updated }));
    } else {
      setAnswers((prev) => ({ ...prev, [id]: value }));
    }
  };

  const isStepValid = (): boolean => {
    if (step === 1) return role !== null;
    if (step === 2) {
      const required = questions.slice(0, 3).map((q) => q.id);
      return required.every((id) => {
        const ans = answers[id];
        if (Array.isArray(ans)) return ans.length > 0;
        return typeof ans === "string" && ans.trim() !== "";
      });
    }
    return true;
  };

  const handleSubmit = async () => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Adresse email invalide.");
      return;
    }
    setEmailError("");
    setSubmitError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/alpha-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          email: email || null,
          answers,
          echo_ressenti: activeEcho,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Une erreur est survenue. Réessaie.");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur d'envoi. Réessaie.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <section id="devenir-testeur" className="alpha-section">
      <div className="alpha-glow" aria-hidden="true" />

      <div className="alpha-inner">
        {!submitted ? (
          <>
            {/* ── En-tête ── */}
            <div className="alpha-header">
              <span className="alpha-badge">Phase Alpha · Juin 2026</span>
              <h2 className="alpha-heading">Devenir testeur alpha</h2>
              <p className="alpha-subheading">
                10 voyageurs pour forger l'expérience. Pas de compte caché, pas d'engagement payant.
                Juste toi, tes retours, et un projet qui prend vie.
              </p>
              <div className="alpha-progress-bar">
                <div className="alpha-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="alpha-step-label">Étape {step} sur {TOTAL_STEPS}</p>
            </div>

            {/* ── Carte formulaire ── */}
            <div className="alpha-card">
              {step === 1 && (
                <StepRole role={role} setRole={setRole} />
              )}
              {step === 2 && role && (
                <StepQuestions
                  questions={questions.slice(0, 3)}
                  answers={answers}
                  onAnswer={handleAnswer}
                  role={role}
                />
              )}
              {step === 3 && role && (
                <StepQuestions
                  questions={questions.slice(3)}
                  answers={answers}
                  onAnswer={handleAnswer}
                  role={role}
                  isLast
                />
              )}
              {step === 4 && (
                <StepConfirmation
                  email={email}
                  setEmail={setEmail}
                  emailError={emailError}
                  activeEcho={activeEcho}
                  setActiveEcho={setActiveEcho}
                />
              )}
            </div>

            {/* ── Erreur submit ── */}
            {submitError && (
              <p style={{ color: "var(--careful)", textAlign: "center", fontSize: "0.88rem" }}>
                {submitError}
              </p>
            )}

            {/* ── Navigation ── */}
            <div className="alpha-nav-row">
              {step > 1 && (
                <button className="alpha-btn-back" onClick={() => setStep((s) => s - 1)}>
                  ← Retour
                </button>
              )}
              {step < TOTAL_STEPS ? (
                <button
                  className="alpha-btn-next"
                  onClick={() => isStepValid() && setStep((s) => s + 1)}
                  disabled={!isStepValid()}
                >
                  Continuer →
                </button>
              ) : (
                <button
                  className="alpha-btn-submit"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Envoi en cours…" : "Rejoindre l'aventure ✦"}
                </button>
              )}
            </div>

            <p className="alpha-disclaimer">
              Inscription gratuite · Accès anonyme · Tu peux te désinscrire à tout moment
            </p>
          </>
        ) : (
          <WelcomeMessage role={role} />
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Étape 1 — Choix du rôle
───────────────────────────────────────────────────────── */
function StepRole({
  role,
  setRole,
}: {
  role: "lecteur" | "auteur" | null;
  setRole: (r: "lecteur" | "auteur") => void;
}) {
  return (
    <div>
      <h3 className="alpha-step-title">Qui es-tu dans cet univers ?</h3>
      <p className="alpha-step-desc">
        Immers'Write est un seuil entre deux mondes. Choisis ta porte d'entrée.
      </p>
      <div className="alpha-role-grid">
        <RoleCard
          active={role === "lecteur"}
          onClick={() => setRole("lecteur")}
          icon="◈"
          title="Le Passeur"
          subtitle="Lecteur"
          desc="Tu cherches des histoires qui te transportent vraiment. Tu veux vivre une expérience narrative, pas juste lire des mots."
          features={[
            "Lecture immersive texte + images IA",
            "Ambiances sonores intégrées",
            "Commentaires émotionnels",
          ]}
        />
        <RoleCard
          active={role === "auteur"}
          onClick={() => setRole("auteur")}
          icon="✦"
          title="L'Artiste"
          subtitle="Auteur"
          desc="Tu as des univers à créer. Tu veux un atelier tout-en-un pour donner vie à tes histoires avec l'aide de l'IA."
          features={[
            "Éditeur de texte épuré",
            "Génération d'images IA (DALL·E 3)",
            "Publication chapitre par chapitre",
          ]}
        />
      </div>
    </div>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
  desc,
  features,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
}) {
  return (
    <button
      onClick={onClick}
      className={`alpha-role-card ${active ? "active" : ""}`}
    >
      <span className="alpha-role-icon">{icon}</span>
      <span className="alpha-role-title">{title}</span>
      <span className="alpha-role-subtitle">{subtitle}</span>
      <p className="alpha-role-desc">{desc}</p>
      <ul className="alpha-role-features">
        {features.map((f) => (
          <li key={f} className="alpha-role-feature-item">{f}</li>
        ))}
      </ul>
      {active && <span className="alpha-role-checkmark">✓ Choisi</span>}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   Étapes 2 & 3 — Questions
───────────────────────────────────────────────────────── */
function StepQuestions({
  questions,
  answers,
  onAnswer,
  role,
  isLast,
}: {
  questions: typeof QUESTIONS_LECTEUR;
  answers: Record<string, string | string[]>;
  onAnswer: (id: string, value: string, type: string) => void;
  role: "lecteur" | "auteur";
  isLast?: boolean;
}) {
  return (
    <div>
      <h3 className="alpha-step-title">
        {isLast
          ? "Presque terminé… quelques derniers mots"
          : role === "lecteur"
          ? "Parle-moi de toi, lecteur"
          : "Parle-moi de toi, artiste"}
      </h3>
      <p className="alpha-step-desc">
        Ces réponses me permettent de créer une expérience faite pour toi.
      </p>
      <div className="alpha-questions-list">
        {questions.map((q) => (
          <QuestionField
            key={q.id}
            question={q}
            answers={answers}
            onAnswer={onAnswer}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionField({
  question,
  answers,
  onAnswer,
}: {
  question: (typeof QUESTIONS_LECTEUR)[0];
  answers: Record<string, string | string[]>;
  onAnswer: (id: string, value: string, type: string) => void;
}) {
  const { id, label, type, options, placeholder } = question as {
    id: string;
    label: string;
    type: string;
    options?: string[];
    placeholder?: string;
  };
  const value = answers[id] || (type === "checkbox" ? [] : "");

  return (
    <div className="alpha-question-block">
      <label className="alpha-question-label">{label}</label>

      {(type === "radio" || type === "checkbox") && options && (
        <div className="alpha-options-grid">
          {options.map((opt) => {
            const isSelected =
              type === "checkbox"
                ? (value as string[]).includes(opt)
                : value === opt;
            return (
              <button
                key={opt}
                onClick={() => onAnswer(id, opt, type)}
                className={`alpha-option-btn ${isSelected ? "selected" : ""}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {type === "textarea" && (
        <textarea
          className="alpha-textarea"
          placeholder={placeholder}
          value={value as string}
          onChange={(e) => onAnswer(id, e.target.value, "textarea")}
          rows={3}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Étape 4 — Confirmation
───────────────────────────────────────────────────────── */
function StepConfirmation({
  email,
  setEmail,
  emailError,
  activeEcho,
  setActiveEcho,
}: {
  email: string;
  setEmail: (v: string) => void;
  emailError: string;
  activeEcho: string | null;
  setActiveEcho: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="alpha-step-title">La dernière porte</h3>
      <p className="alpha-step-desc">
        Laisse un email si tu veux recevoir ton lien d'accès quand l'alpha ouvre.
        C'est entièrement facultatif — tu peux rester anonyme.
      </p>

      <div className="alpha-question-block">
        <label className="alpha-question-label">Email (optionnel)</label>
        <input
          type="email"
          placeholder="ton@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="alpha-input-email"
        />
        {emailError && <p className="alpha-input-error">{emailError}</p>}
        <p className="alpha-input-hint">
          Utilisé uniquement pour t'envoyer ton lien d'accès. Jamais partagé, jamais vendu.
        </p>
      </div>

      <div className="alpha-question-block" style={{ marginTop: "2rem" }}>
        <label className="alpha-question-label">
          Avant de franchir le seuil… un dernier écho. Qu'est-ce que tu ressens en imaginant l'expérience ?
        </label>
        <div className="alpha-echo-row">
          {ECHOS_CONFIRMATION.map((e) => (
            <button
              key={e.id}
              onClick={() => setActiveEcho(e.id)}
              title={e.label}
              className={`alpha-echo-btn ${activeEcho === e.id ? "active" : ""}`}
            >
              <img src={e.src} alt={e.label} className="alpha-echo-icon" />
              <span className="alpha-echo-label">{e.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Message de bienvenue final
───────────────────────────────────────────────────────── */
function WelcomeMessage({ role }: { role: "lecteur" | "auteur" | null }) {
  return (
    <div className="alpha-welcome-block">
      <span className="alpha-welcome-glyph" aria-hidden="true">✦</span>

      <h2 className="alpha-welcome-title">
        {role === "auteur"
          ? "L'atelier t'attend, Artiste."
          : "Bienvenue de l'autre côté du seuil, Passeur."}
      </h2>

      <p className="alpha-welcome-text">
        {role === "auteur"
          ? `Ta candidature a été reçue. Tu fais partie des créateurs qui vont façonner Immers'Write.\n\nDès que l'alpha ouvre en juin 2026, je t'enverrai ton lien d'accès si tu as laissé ton email — sinon, l'annonce sera sur le blog et les réseaux.\n\nD'ici là, suis les coulisses du projet. Chaque bug corrigé, chaque feature qui prend vie — c'est une page de notre aventure commune.`
          : `Ta candidature a été reçue. Tu feras partie des premiers lecteurs à franchir ce seuil.\n\nQuand l'alpha ouvrira ses portes en juin 2026, tu seras parmi les premiers à vivre une histoire comme tu ne l'as jamais vécue — texte, images IA, ambiances sonores.\n\nD'ici là, l'aventure se raconte en direct sur le blog.`}
      </p>

      <div className="alpha-welcome-links">
        <a
          href="https://immerswrite.blogspot.com"
          target="_blank"
          rel="noopener noreferrer"
          className="alpha-welcome-link"
        >
          → Suivre les coulisses du projet
        </a>
        <a
          href="https://www.facebook.com/immerswrite"
          target="_blank"
          rel="noopener noreferrer"
          className="alpha-welcome-link"
        >
          → Rejoindre la communauté Facebook
        </a>
        <a
          href="https://www.linkedin.com/in/immerswrite"
          target="_blank"
          rel="noopener noreferrer"
          className="alpha-welcome-link"
        >
          → LinkedIn
        </a>
      </div>

      <div className="alpha-welcome-divider" aria-hidden="true" />

      <p className="alpha-welcome-manifeste">"Where words become worlds"</p>
    </div>
  );
}