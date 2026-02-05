# ✍️ Immers'Write : Where Words Become Worlds

> *"Le code est le corps, l'imagination est l'âme."*

## ✨ La Vision

**Immers'Write** n'est pas qu'une plateforme de plus. C'est un pont entre le rationnel (le code, l'IA, la technique) et l'émotionnel (le storytelling, l'immersion).

En tant qu'autrice de trois livres et développeuse en formation **CDA spécialisée IA** à la *Fabrique Numérique Paloise*, j'ai créé cet espace pour transformer la lecture passive en une expérience multisensorielle et redonner aux auteurs leur souveraineté créative. Ici, on ne commente pas avec des "likes", on partage des ressentis.

---

## 🚀 Le Projet

**Immers'Write** est mon projet de certification (avril 2027) et mon futur business. Il répond à un manque naissant sur le marché : l'absence d'une plateforme native combinant écriture, IA générative et immersion totale.

### 📖 Côté Lecteur (Immers)

* **Immersion Totale** : Lecture chapitre par chapitre avec visuels et ambiances sonores générés par l'IA.
* **Connexion Émotionnelle** : Un système de feedback basé sur l'émotion vécue plutôt que sur la validation sociale superficielle.

### ✍️ Côté Auteur (Write)

* **Assistant d'écriture IA** : Pour débloquer la créativité sans la remplacer (Claude Sonnet 4).
* **Studio Multimédia** : Génération native d'images (DALL-E 3) et de voix/sons (ElevenLabs) pour donner vie à l'univers.
* **Gestion d'Univers** : Organisation par bibliothèques d'univers narratifs pour les créateurs multi-projets.

---

## 🛠️ Stack Technique (Mon Engagement)

Pour garantir la viabilité et l'évolution constante de la plateforme (veille IA active), j'ai choisi une architecture robuste et moderne :

* **Backend** : `Python 3.11` + `FastAPI` (Performance et alignement IA).
* **Frontend** : `Next.js 15` (App Router) + `Tailwind CSS` (Expérience utilisateur fluide et SEO).
* **Base de Données** : `PostgreSQL` via **Neon.tech** (Cloud managé, scalable).
* **IA Génératives** : Claude (Texte), DALL-E (Images), ElevenLabs (Audio).
* **Infrastructure** : Micro-services conteneurisés avec `Docker` & `Docker Compose`.
* **Sécurité & Proxy** : `Nginx` + `Certbot` (HTTPS auto-géré).

---

## 🚢 Déploiement & Installation (Mode Manuel)

Ce projet est conçu pour être déployé sur un **VPS** (actuellement `vps-ee54267c`) pour une autonomie totale.

### 1. Pré-requis

* Docker & Docker Compose installés.
* Un fichier `.env` configuré avec les clés d'API (OpenAI, Anthropic, ElevenLabs) et l'URL Neon.

### 2. Lancement rapide

```bash
git clone https://github.com/LaureLavie/ImmersWrite.git
cd ImmersWrite
docker compose up -d --build

```

### 3. Architecture Réseau

Le flux est orchestré par Nginx :

* **HTTPS (443)** ➔ `immerswrite.com`
* **API Route** ➔ Redirection interne vers le container `backend:8000`
* **Web Route** ➔ Redirection interne vers le container `frontend:3000`

---

## 🎯 Roadmap & Ambitions

* **Juin 2026 :** Lancement du **MVP Alpha** (Version fermée pour 10 testeurs).
* **Janvier 2027 :** **MVP Beta** fonctionnel (Intégration complète sons/images).
* **Avril 2027 :** Certification CDA IA & Transformation en Startup.
* **Post 2027 :** Commercialisation et expansion du marché.

---

## 💡 Ma Philosophie de Créatrice

Je ne construis pas un outil pour rendre les gens dépendants de l'IA, mais pour les **autonomiser**. Immers'Write est le miroir de mon parcours : une quête de profondeur dans un monde numérique parfois trop superficiel.

> "Je crée un espace où les autres peuvent se défaire de leurs masques et accéder à leur propre profondeur imaginaire."

---

**Laure Lavie** *Développeuse CDA IA | Autrice | Créatrice d'Univers*
---
