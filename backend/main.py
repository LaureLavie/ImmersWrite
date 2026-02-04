from fastapi import FastAPI

# Création de l'application FastAPI
app = FastAPI()

# Route de base pour vérifier que l'application fonctionne
@app.get("/")
def read_root():
    return {"message": "Bienvenue dans l'API Immers'Write!"}