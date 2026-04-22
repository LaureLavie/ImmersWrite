import os
from fastapi import HTTPException
from dotenv import load_dotenv
import jwt 
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from openai import AsyncOpenAI
from elevenlabs.client import AsyncElevenLabs

import base64
load_dotenv()

eleven_client = AsyncElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    truncated_password = password[:72]
    return pwd_context.hash(truncated_password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def generate_confirmation_token(email: str) -> str:
    payload = {
        "sub": email,
        "type": "confirm",
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_confirmation_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "confirm":
            raise HTTPException(status_code=400, detail="Token invalide.")
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Le lien de confirmation a expiré.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Le lien de confirmation est invalide.")


def generate_reset_token(email: str) -> str:
    payload = {
        "sub": email,
        "type": "reset",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_reset_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "reset":
            raise HTTPException(status_code=400, detail="Token invalide.")
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Le lien a expiré. Refais une demande.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Lien invalide.")
    
    
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_image(prompt: str) -> str:
    """Appelle DALL-E 3 et retourne l'URL de l'image."""
    response = await client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard", 
        n=1,
    )
    return response.data[0].url


def generate_audio_sync(text: str) -> str:
    """
    Appelle ElevenLabs (v0.2.27 sync API) et retourne l'audio en base64.
    
    Note : Pour l'alpha, l'audio est retourné en base64.
    Pour le sauvegarder définitivement, l'auteur doit :
    1. Télécharger le fichier depuis le navigateur
    2. L'uploader sur Cloudinary
    3. Coller l'URL Cloudinary dans le champ "son principal"
    
    TODO : Intégration directe Cloudinary upload dans une version future.
    """
    try:
        # ElevenLabs v0.2.27 : generate() retourne un itérable de bytes
        audio_generator = eleven_client.generate(
            text=text,
            voice="Bella",          # Voix française disponible
            model="eleven_multilingual_v2"
        )
        # Collecter tous les chunks de bytes
        audio_bytes = b"".join(audio_generator)
        # Encoder en base64 pour transmission JSON
        return base64.b64encode(audio_bytes).decode("utf-8")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur de génération audio ElevenLabs : {str(e)}"
        )