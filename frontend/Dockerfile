# Utilise une image Node stable et légère
FROM node:20-alpine

WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le reste du code source
COPY . .

# Build l'application Next.js (génère le dossier .next)
RUN npm run build

# Next.js écoute sur le port 3000 par défaut
EXPOSE 3000

# Commande pour lancer en mode production
CMD ["npm", "start"]
