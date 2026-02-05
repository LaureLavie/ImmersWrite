POURQUOI J'AI CHOISI CES STACKS - Justification personnelle

Contexte

Projet de fin de formation CDA spécialisée IA à la Fabrique Numérique Paloise.
Objectif : plateforme d'écriture immersive enrichie par IA générative.
Deadline MVP : Juin 2026 | Certification : Avril 2027

Critères de décision

Alignement avec formation : Valoriser compétences IA

Employabilité : Technologies demandées sur le marché

Scalabilité : Capacité à gérer croissance utilisateurs

Coûts maîtrisés : Viable en bootstrap

Écosystème mature : Documentation, communauté, support

Backend : Python + FastAPI

Choix : Python 3.11+ avec FastAPI

Raisons :

Python = langage de référence IA/ML (alignement formation)

FastAPI = framework moderne, performant, documentation automatique

Écosystème APIs IA optimisé pour Python (OpenAI, Anthropic, Stability)

Syntaxe claire et explicite (maintenance facilitée)

Async natif (performance sur I/O intensives comme appels API)

Alternatives considérées :

Node.js + Express : Rejeté (moins pertinent pour spécialisation IA)

Django : Rejeté (trop lourd pour une API, moins moderne)

Frontend : Next + Tailwind

Choix : Next.js  15 avec App Router + Tailwind CSS

Raisons :

Next.js  = framework react full-stack moderne, optimisé pour Vercel (hébergement natif)

Routing automatique par fichiers → gain de temps et structure claire

SEO natif grâce au rendu côté serveur (SSR) et génération statique (SSG)

App Router = modularité + performance + gestion avancée des layouts

Tailwind = productivité CSS, cohérence design sans effort

Écosystème riche : composants UI (shadcn/ui), gestion des métadonnées, middleware

Pré-rendering intelligent (ISR) → scalabilité sans surcharge serveur

Support des API routes (non utilisé ici mais utile pour extensions futures)

Base de données : PostgreSQL

Choix : PostgreSQL 15+ avec SQLAlchemy

Raisons :

SGBD relationnel robuste et éprouvé

Support JSON natif (flexibilité données IA)

Gratuit et open-source

Excellente intégration Python

Alternatives considérées :

MongoDB : Rejeté (structure relationnelle nécessaire users/projets/chapters)

MySQL : Rejeté (PostgreSQL plus features avancées)

Authentification : JWT

Choix : JSON Web Tokens avec python-jose

Raisons :

Stateless = scalable horizontalement

Standard industrie RESTful APIs

Refresh tokens = sécurité + UX

Implémentation simple et documentée

Alternatives considérées :

OAuth2 complet : Over-engineering pour MVP

Hébergement

Choix : Vercel (front) + Railway (back+DB)

Raisons :

Vercel = déploiement nextjs optimal, gratuit jusqu'à gros trafic

Railway = simplicité, pricing transparent

Séparation front/back = architecture moderne et scalable

Intégration Git automatique (CI/CD natif)

Alternatives considérées :

Render : Utilisé en dev (free tier) puis migré Railway (performance)

Heroku : Rejeté (plus cher)

AWS/GCP : Rejeté (complexité inutile pour MVP)

APIs Génératives

Texte : Claude Sonnet 4

Raisons :

Qualité créative supérieure sur contenu narratif

Contexte 200k tokens (gère chapitres complets)

Style moins "robotique" que GPT pour fiction

Coût raisonnable (~0.68€/user/mois)

Images : DALL-E 3

Raisons :

Qualité professionnelle polyvalente

Intégration simple (même SDK qu'OpenAI texte)

Suit bien les prompts (prévisibilité)

Pricing clair (0.03€/image standard)

Audio : ElevenLabs

Raisons :

Qualité voix imbattable (réalisme, émotions)

API simple et bien documentée

Multilingue (29 langues)

Pricing prévisible (20€/mois pour 100k chars)

Coûts estimés

Dev (0-10 users) : ~20€/mois
Beta (50 users) : ~70€/mois
Production (200 users, 100 actifs) : ~200€/mois

→ Rentable dès 10 clients à 20€/moi

9. RESSOURCES COMPILÉES - TO-DO List Tech

APPRENTISSAGE BACKEND

Python Basics (si besoin refresh) :

Python.org Tutorial - 2h

Real Python - Python Basics - 5h

FastAPI (priorité haute) :

[ ] FastAPI Docs - Tutorial - Lire intégralement - 3h

[ ] FastAPI freeCodeCamp Course - Suivre jusqu'à h10 minimum - 10h

[ ] Full Stack FastAPI Template - Analyser le code - 2h

SQLAlchemy + Alembic :

[ ] SQLAlchemy 2.0 Tutorial - Sections 1-5 - 4h

[ ] Alembic Tutorial - Complet - 2h

Auth JWT :

[ ] FastAPI Security Tutorial - 1h

[ ] JWT.io Introduction - 30min

TEMPS TOTAL BACKEND : ~30h → Réparti sur 2 semaines

APPRENTISSAGE FRONTEND

Next (si besoin refresh) :

[ ] https://nextjs.org/docs  - Sections 1-8 - 5h

[ ] https://nextjs.org/docs#app-router-and-pages-router  - App router - 1h

Tailwind CSS :

[ ] Tailwind Docs - Core Concepts - 2h

[ ] Tailwind UI Components - Explorer - 1h

[ ] shadcn/ui Installation - Mettre en place - 1h



TEMPS TOTAL FRONTEND : ~15h → Réparti sur 1 semaine

INTÉGRATION APIs IA

OpenAI (DALL-E 3) :

[ ] OpenAI Quickstart - 1h

[ ] Images API Guide - 1h

[ ] Tester en Python (script standalone) - 1h

Anthropic Claude :

[ ] Claude API Getting Started - 1h

[ ] Messages API Reference - 1h

[ ] Tester en Python (script standalone) - 1h

ElevenLabs :

[ ] ElevenLabs API Docs - 1h

[ ] Voice Library - Explorer - 30min

[ ] Tester génération audio - 1h

TEMPS TOTAL APIs : ~10h → Réparti sur 3-4 jours

DÉPLOIEMENT

Vercel :

[ ] Vercel Deploy Next - 30min

[ ] Déployer projet test - 30min

Railway :

[ ] Railway Python Guide - 30min

[ ] Railway PostgreSQL - 30min

[ ] Déployer API test - 1h

TEMPS TOTAL DÉPLOIEMENT : ~3h → 1 journée

10. CHECKLIST AVANT DE CODER - Validation décisions

DÉCISIONS FINALISÉES :

[ ] Stack backend validée : Python + FastAPI

[ ] Stack frontend validée : Next + Tailwind

[ ] Base de données validée : PostgreSQL

[ ] Hébergement choisi : Vercel + Railway

[ ] API texte choisie : Claude Sonnet 4

[ ] API images choisie : DALL-E 3

[ ] API audio choisie : ElevenLabs

COMPTES CRÉÉS :

[ ] Compte GitHub (+ repo Immers'Write créé)

[ ] Compte Vercel (lié à GitHub)

[ ] Compte Railway (lié à GitHub)

[ ] Compte Anthropic (API key obtenue)

[ ] Compte OpenAI (API key obtenue, 5$ de crédit ajouté minimum)

[ ] Compte ElevenLabs (free tier activé)

ENVIRONNEMENT LOCAL :

[ ] Python 3.11+ installé (python --version)

[ ] Node.js 18+ installé (node --version)

[ ] Git installé et configuré

[ ] VS Code installé avec extensions (Python, ESLint, Tailwind CSS IntelliSense)

[ ] PostgreSQL installé localement OU Docker installé

DOCUMENTATION LUE :

[ ] FastAPI Tutorial (au moins 50%)

[ ] Next Docs (sections principales)

[ ] Anthropic Claude API docs (quickstart)

[ ] OpenAI Images API docs (quickstart)

IMPORTANT :

Je NE reviens PAS sur mes décisions avant juin 2026, même si je découvre une "meilleure" techno. L'ennemi du bien est le mieux. J'ai une stack solide. Je construis avec.

Les seules exceptions acceptables pour changer :

Une techno choisie est abandonnée par son créateur

Une faille de sécurité critique non-patchable

Un coût devient prohibitif (×10 prévu)