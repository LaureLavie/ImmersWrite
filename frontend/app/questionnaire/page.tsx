"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/styles/questionnaire.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ── Types ────────────────────────────────────────────────────────────────────

interface Answers {
  q1: string;
  q2: string[];
  q3: string[];
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: number;
  q9_email: string;
  q9_message: string;
}

const TOTAL_STEPS = 9;

const STAR_LABELS = [
  "Pas vraiment…",
  "Peut-être…",
  "Pourquoi pas !",
  "Oui, ça m'intéresse !",
  "Quand est-ce que ça ouvre ?!",
];

// ── Données des étapes ────────────────────────────────────────────────────────

const STEP_1_OPTIONS = [
  "✦ Lecteur·rice — j'aime m'immerger dans les histoires des autres",
  "✍️ Auteur·rice — j'écris, je crée, je construis des univers",
  "◈ Les deux à la fois — je suis auteur·rice ET lecteur·rice",
  "◇ Ni l'un ni l'autre — je suis simplement curieux·se",
];

const STEP_2_OPTIONS = [
  "Wattpad",
  "AO3 / Archive Of Our Own",
  "Scrivener / Google Docs / Word",
  "Kindle / liseuse / ebook",
  "Blog personnel / Substack / Medium",
  "Nulle part — je cherche encore ma plateforme",
  "Autre",
];

const STEP_3_OPTIONS = [
  "L'immersion — le texte seul ne suffit pas, je veux vivre l'histoire",
  "Des outils de création visuels intégrés (générer des images)",
  "Des ambiances sonores liées à la lecture",
  "Une communauté de qualité, pas de toxicité",
  "Un espace d'écriture épuré et inspirant",
  "Une reconnaissance émotionnelle — pas juste des « likes »",
  "Un assistant IA pour débloquer ma créativité",
  "Une interface en français, pensée pour les francophones",
];

const STEP_4_OPTIONS = [
  "Je l'utilise déjà régulièrement (images, texte, musique…)",
  "Je l'ai testée mais je ne sais pas bien l'utiliser",
  "Je suis curieux·se mais j'ai peur que ça remplace ma créativité",
  "Je ne l'utilise pas — ça ne m'attire pas",
  "Je veux m'en servir comme outil, pas comme substitut à ma voix",
];

const STEP_5_OPTIONS = [
  "Des illustrations générées par IA, propres à chaque histoire",
  "Des ambiances musicales immersives pendant la lecture",
  "Un système de commentaires émotionnels (ressentis, pas des likes)",
  "Une interface de lecture épurée, sans distraction",
  "La possibilité de suivre mes auteur·rices préféré·es",
  "Un mode lecture accessible sur mobile, parfaitement responsive",
];

const STEP_7_OPTIONS = [
  "Gratuit uniquement — je ne paye pas pour ce type de service",
  "Jusqu'à 5 € / mois — un café",
  "Entre 5 et 15 € / mois — si ça vaut vraiment le coup",
  "Entre 15 et 30 € / mois — si les fonctionnalités sont au rendez-vous",
  "Plus de 30 € / mois — si c'est vraiment un outil pro",
];

// ── Sous-composants ───────────────────────────────────────────────────────────

function RadioGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="qst-options">
      {options.map((opt) => (
        <div
          key={opt}
          className={`qst-opt${selected === opt ? " selected" : ""}`}
          onClick={() => onChange(opt)}
        >
          <div className="qst-opt-indicator" />
          <span className="qst-opt-text">{opt}</span>
        </div>
      ))}
    </div>
  );
}

function CheckGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );
  };
  return (
    <div className="qst-options">
      {options.map((opt) => (
        <div
          key={opt}
          className={`qst-opt${selected.includes(opt) ? " selected" : ""}`}
          onClick={() => toggle(opt)}
        >
          <div className="qst-opt-indicator-check">
            <div className="qst-check-mark" />
          </div>
          <span className="qst-opt-text">{opt}</span>
        </div>
      ))}
    </div>
  );
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div className="qst-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`qst-star${active >= n ? " lit" : ""}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        ))}
      </div>
      <div className="qst-star-label">
        {active > 0 ? STAR_LABELS[active - 1] : ""}
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function QuestionnairePage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [answers, setAnswers] = useState<Answers>({
    q1: "",
    q2: [],
    q3: [],
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: 0,
    q9_email: "",
    q9_message: "",
  });

  const progress = (step / TOTAL_STEPS) * 100;

  const isStepValid = (): boolean => {
    switch (step) {
      case 1: return answers.q1 !== "";
      case 2: return answers.q2.length > 0;
      case 3: return answers.q3.length > 0;
      case 4: return answers.q4 !== "";
      case 5: return answers.q5 !== "";
      case 6: return answers.q6.trim() !== "";
      case 7: return answers.q7 !== "";
      case 8: return answers.q8 > 0;
      case 9: return true; // facultatif
      default: return true;
    }
  };

  const stepLabels: Record<number, string> = {
    1: "Ton univers",
    2: "Tes habitudes",
    3: "Tes frustrations",
    4: "L'IA dans ta créativité",
    5: "Ce qui compte pour toi",
    6: "Ton expérience idéale",
    7: "Le prix du voyage",
    8: "Ta note",
    9: "Pour rester en contact",
  };

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitting(true);
    try {
      // Validation email si fourni
      if (
        answers.q9_email &&
        !/\S+@\S+\.\S+/.test(answers.q9_email)
      ) {
        setSubmitError("Adresse email invalide.");
        setSubmitting(false);
        return;
      }

      const payload = {
        role: answers.q1.includes("Auteur") ? "auteur" : "lecteur",
        email: answers.q9_email || null,
        answers: {
          profil: answers.q1,
          plateformes: answers.q2,
          frustrations: answers.q3,
          rapport_ia: answers.q4,
          fonctionnalite_cle: answers.q5,
          experience_revee: answers.q6,
          budget: answers.q7,
          note: answers.q8,
          message: answers.q9_message,
        },
        echo_ressenti: null,
      };

      const res = await fetch(`${API_URL}/alpha-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        // Si email déjà inscrit, on laisse passer (inscription déjà faite)
        if (res.status === 400 && err.detail?.includes("déjà inscrite")) {
          setSubmitted(true);
          return;
        }
        throw new Error(err.detail ?? "Une erreur est survenue.");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erreur d'envoi. Réessaie."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = async () => {
    if (step === TOTAL_STEPS) {
      await handleSubmit();
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Rendu de l'étape courante ──────────────────────────────────────────────

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="qst-step-label">
              Étape 1 sur 9 — {stepLabels[1]}
            </div>
            <div className="qst-question">Tu es plutôt… ?</div>
            <div className="qst-hint">
              Choisis ce qui te correspond le mieux aujourd'hui.
            </div>
            <RadioGroup
              options={STEP_1_OPTIONS}
              selected={answers.q1}
              onChange={(v) => setAnswers({ ...answers, q1: v })}
            />
          </>
        );

      case 2:
        return (
          <>
            <div className="qst-step-label">
              Étape 2 sur 9 — {stepLabels[2]}
            </div>
            <div className="qst-question">
              Où lis-tu ou écris-tu actuellement ?{" "}
              <span style={{ opacity: 0.5, fontSize: "0.85em" }}>
                (plusieurs choix possibles)
              </span>
            </div>
            <CheckGroup
              options={STEP_2_OPTIONS}
              selected={answers.q2}
              onChange={(v) => setAnswers({ ...answers, q2: v })}
            />
          </>
        );

      case 3:
        return (
          <>
            <div className="qst-step-label">
              Étape 3 sur 9 — {stepLabels[3]}
            </div>
            <div className="qst-question">
              Qu'est-ce qui te manque le plus dans les plateformes actuelles ?
            </div>
            <div className="qst-hint">Coche tout ce qui résonne en toi.</div>
            <CheckGroup
              options={STEP_3_OPTIONS}
              selected={answers.q3}
              onChange={(v) => setAnswers({ ...answers, q3: v })}
            />
          </>
        );

      case 4:
        return (
          <>
            <div className="qst-step-label">
              Étape 4 sur 9 — {stepLabels[4]}
            </div>
            <div className="qst-question">
              Quel est ton rapport à l'intelligence artificielle générative ?
            </div>
            <RadioGroup
              options={STEP_4_OPTIONS}
              selected={answers.q4}
              onChange={(v) => setAnswers({ ...answers, q4: v })}
            />
          </>
        );

      case 5:
        return (
          <>
            <div className="qst-step-label">
              Étape 5 sur 9 — {stepLabels[5]}
            </div>
            <div className="qst-question">
              Sur une plateforme de lecture immersive, quelle fonctionnalité
              serait indispensable pour toi ?
            </div>
            <div className="qst-hint">
              Une seule réponse — ton instinct d'abord.
            </div>
            <RadioGroup
              options={STEP_5_OPTIONS}
              selected={answers.q5}
              onChange={(v) => setAnswers({ ...answers, q5: v })}
            />
          </>
        );

      case 6:
        return (
          <>
            <div className="qst-step-label">
              Étape 6 sur 9 — {stepLabels[6]}
            </div>
            <div className="qst-question">
              Décris en quelques mots l'expérience de lecture ou d'écriture dont
              tu rêves.
            </div>
            <div className="qst-hint">
              Libre, sincère, même imparfait. C'est cette voix qui compte.
            </div>
            <textarea
              className="qst-textarea"
              rows={4}
              placeholder="Ex : J'aimerais que mes chapitres soient accompagnés de visuels qui transportent le lecteur dans mon univers…"
              value={answers.q6}
              onChange={(e) =>
                setAnswers({ ...answers, q6: e.target.value })
              }
            />
          </>
        );

      case 7:
        return (
          <>
            <div className="qst-step-label">
              Étape 7 sur 9 — {stepLabels[7]}
            </div>
            <div className="qst-question">
              Pour une plateforme qui réunit tout (écriture + IA + lecture
              immersive), quel budget mensuel semble juste pour toi ?
            </div>
            <RadioGroup
              options={STEP_7_OPTIONS}
              selected={answers.q7}
              onChange={(v) => setAnswers({ ...answers, q7: v })}
            />
          </>
        );

      case 8:
        return (
          <>
            <div className="qst-step-label">
              Étape 8 sur 9 — {stepLabels[8]}
            </div>
            <div className="qst-question">
              À quel point le concept d'Immers'Write te parle-t-il ?
            </div>
            <div className="qst-hint">
              "Une plateforme où les auteurs créent des histoires enrichies
              d'images IA, et où les lecteurs les vivent comme une expérience
              multisensorielle."
            </div>
            <StarRating
              value={answers.q8}
              onChange={(n) => setAnswers({ ...answers, q8: n })}
            />
          </>
        );

      case 9:
        return (
          <>
            <div className="qst-step-label">
              Étape 9 sur 9 — {stepLabels[9]}
            </div>
            <div className="qst-question">
              Tu veux être parmi les premiers testeurs d'Immers'Write ?
            </div>
            <div className="qst-hint">
              Laisse ton email si tu souhaites recevoir une invitation alpha.
              Zéro spam, promis.
            </div>
            <div className="qst-field-label">Email (facultatif)</div>
            <input
              className="qst-input"
              type="email"
              placeholder="votre@email.com"
              value={answers.q9_email}
              onChange={(e) =>
                setAnswers({ ...answers, q9_email: e.target.value })
              }
            />
            <div className="qst-divider">
              <span>✦</span>
            </div>
            <div className="qst-field-label" style={{ marginTop: "0.25rem" }}>
              Un dernier message à partager ?
            </div>
            <textarea
              className="qst-textarea"
              rows={3}
              placeholder="Une idée, une attente, un rêve pour cette plateforme…"
              value={answers.q9_message}
              onChange={(e) =>
                setAnswers({ ...answers, q9_message: e.target.value })
              }
            />
          </>
        );

      default:
        return null;
    }
  };

  // ── Écran de remerciement ──────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="qst-page">
        <Navbar />
        <div className="qst-header">
          <div className="qst-logo-badge">Immers'Write</div>
          <h1>Parle-moi de toi, Voyageur</h1>
        </div>
        <div className="qst-thanks">
          <div className="qst-thanks-glyph">✦</div>
          <h2>Merci, Voyageur</h2>
          <p className="qst-thanks-body">
            Ton témoignage façonnera Immers'Write. Chaque réponse est importante
            dans la construction de cet univers.
            <br />
            <br />
            Suis l'aventure sur le blog et les réseaux.
          </p>
          <div className="qst-thanks-links">
            <a
              href="https://immerswrite.blogspot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="qst-thanks-link"
            >
              Blog →
            </a>
            <a
              href="https://www.facebook.com/immerswrite"
              target="_blank"
              rel="noopener noreferrer"
              className="qst-thanks-link"
            >
              Facebook →
            </a>
            <a
              href="https://www.linkedin.com/in/immerswrite"
              target="_blank"
              rel="noopener noreferrer"
              className="qst-thanks-link"
            >
              LinkedIn →
            </a>
          </div>
          <Link href="/" className="link" style={{ marginTop: "1rem", opacity: 0.5, fontSize: "0.85rem" }}>
            ← Retour à l'accueil
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Rendu principal ────────────────────────────────────────────────────────

  return (
    <div className="qst-page">
      
      {/* Barre de progression sticky */}
      <div className="qst-progress-wrap">
        <div className="qst-progress-bar">
          <div
            className="qst-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="qst-progress-label">
          <span>{step} / {TOTAL_STEPS}</span>
          <span style={{ color: "var(--amber)", opacity: 0.7 }}>
            {stepLabels[step]}
          </span>
        </div>
      </div>

      {/* En-tête */}
      <div className="qst-header">
        <div className="qst-logo-badge">Immers'Write</div>
        <h1>Parle-moi de toi, Voyageur</h1>
        <p className="qst-header-sub">
          5 minutes pour façonner la plateforme de tes rêves.
          <br />
          <span>Tes réponses sont précieuses</span> — et anonymes si tu le souhaites.
        </p>
      </div>

      {/* Carte étape */}
      <div className="qst-card" key={step}>
        {renderStep()}
      </div>

      {/* Erreur */}
      {submitError && (
        <div className="qst-error" style={{ maxWidth: 640, width: "100%" }}>
          {submitError}
        </div>
      )}

      {/* Navigation */}
      <div className="qst-nav">
        <span className="qst-nav-info">{step} / {TOTAL_STEPS}</span>
        <div className="qst-nav-btns">
          {step > 1 && (
            <button className="qst-btn qst-btn-prev" onClick={goPrev}>
              ← Retour
            </button>
          )}
          <button
            className="qst-btn qst-btn-next"
            onClick={goNext}
            disabled={!isStepValid() || submitting}
          >
            {submitting
              ? "Envoi…"
              : step === TOTAL_STEPS
              ? "Envoyer ✦"
              : "Continuer →"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}