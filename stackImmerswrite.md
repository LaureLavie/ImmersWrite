---
🛠️ Justification Technique & Stratégie : Immers'Write

1. Contexte & Vision
Formation : CDA spécialisée IA (Fabrique Numérique Paloise).

Objectif : Plateforme d'écriture immersive enrichie par IA générative.

Philosophie : "Le code est le corps, l'imagination est l'âme."

Deadline MVP : Juin 2026 | Certification | Avril 2027.

2. Hébergement & Infrastructure (Le choix de la souveraineté)
Choix : VPS Auto-hébergé avec Docker & Docker Compose

Pourquoi ? Contrairement à Vercel ou Railway, le VPS offre un contrôle total sur l'environnement.

Docker : Permet d'isoler le frontend, le backend et la base de données dans des conteneurs étanches.

Nginx & Certbot : Gestion personnalisée du nom de domaine immerswrite.com et sécurisation SSL (HTTPS) gratuite et automatisée.

Coût : Prix fixe mensuel (environ 8€ le VPS), évitant les mauvaises surprises de la tarification à l'usage des plateformes PaaS.

3. Stack Logicielle (Le moteur)
Backend : Python 3.11 + FastAPI
IA-Ready : Langage natif des bibliothèques IA (OpenAI, Anthropic).
Performance : FastAPI est l'un des frameworks les plus rapides grâce à l'asynchrone.
Documentation : Génération automatique de Swagger pour tester les API.

Frontend : Next.js 15 + Tailwind CSS
Modernité : App Router pour une structure de projet claire et performante.
SEO & Immersion : Rendu hybride (SSR/SSG) pour un chargement instantané des mondes narratifs.
Design : Tailwind pour une interface léchée et immersive sans perdre de temps en CSS pur.

Base de Données : PostgreSQL (via Neon ou Docker local)
Fiabilité : Le standard pour les données relationnelles (utilisateurs, chapitres, univers).
Évolutivité : Support natif du JSON pour stocker des métadonnées issues de l'IA.

Authentification : JWT (JSON Web Tokens)
Sécurité : Standard de l'industrie pour les API REST.
Expérience : Permet une connexion fluide et sécurisée sur tous les appareils.

4. APIs Génératives (L'étincelle créative)
Texte : Claude 3.5 Sonnet (Anthropic) pour sa plume plus "littéraire" et moins robotique.
Images : DALL-E 3 (OpenAI) pour la cohérence visuelle des univers.
Audio : ElevenLabs pour le réalisme émotionnel des voix narratives.

5. Ressources & To-Do List Apprentissage
📂 Backend & API (Estimation : 30h)
[ ] FastAPI : Maîtriser les routes, les schémas Pydantic et l'injection de dépendances.
[ ] SQLAlchemy : Gérer les modèles de données et les migrations avec Alembic.
[ ] JWT : Implémenter le flux Login / Register sécurisé.

📂 Frontend & UI (Estimation : 15h)
[ ] Next.js 15 : Comprendre le fetching de données côté serveur (Server Components).
[ ] Tailwind : Créer des layouts immersifs (mode sombre natif, animations légères).

📂 DevOps & Déploiement (Estimation : 10h)
[ ] Docker : Écrire des Dockerfiles optimisés pour le Back et le Front.
[ ] Nginx : Configurer le reverse-proxy pour diriger immerswrite.com vers les bons conteneurs.
[ ] Certbot : Automatiser le renouvellement du cadenas HTTPS.

6. Checklist de Validation (Avant de coder)
Décisions Finalisées
[x] Domaine : immerswrite.com pointé vers l'IP du VPS.
[x] Infrastructure : VPS Debian/Ubuntu avec Docker installé.
[x] Stack : FastAPI / Next.js / PostgreSQL / Docker.

Environnement de Travail
[x] Local : Python 3.11, Node.js 20+, Git, VS Code.
[x] Docker : Docker Desktop (pour tester le déploiement localement avant d'envoyer sur le VPS).

Engagement Personnel
"Je ne reviens pas sur mes choix technologiques avant le MVP de juin 2026. L'ennemi du progrès est la recherche constante de l'outil 'parfait'. Ma stack est solide, maintenant je construis."

---