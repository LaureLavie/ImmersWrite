from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from dotenv import load_dotenv
from utils import (
    hash_password,
    verify_password,
    generate_confirmation_token,
    verify_confirmation_token,
    generate_reset_token,
    verify_reset_token,
)
import jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Immers'Write API", version="1.0.0")

raw_origins = os.getenv("ALLOWED_ORIGINS", "")
origins = raw_origins.split(",") if raw_origins else []
origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _env_bool(key: str, default: bool = False) -> bool:
    val = os.getenv(key)
    if val is None:
        return default
    return val.strip().lower() in ("1", "true", "yes")


conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=_env_bool("MAIL_STARTTLS", True),
    MAIL_SSL_TLS=_env_bool("MAIL_SSL_TLS", False),
    USE_CREDENTIALS=True,
)

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> models.User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Token invalide")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée, reconnecte-toi")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")
    return user


def require_auteur(current_user: models.User = Depends(get_current_user)) -> models.User:
    if current_user.role != models.UserRole.auteur:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé aux auteurs",
        )
    return current_user


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES PUBLIQUES
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API Immers'Write ✦"}


@app.post("/register")
async def register(user: schemas.UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    new_user = models.User(
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    confirmation_token = generate_confirmation_token(new_user.email)
    confirm_link = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/confirm/{confirmation_token}"

    message = MessageSchema(
        subject="Confirmez votre compte Immers'Write",
        recipients=[new_user.email],
        body=f"""
            <p>Bienvenue sur Immers'Write !</p>
            <p>Confirme ton compte en cliquant sur ce lien :</p>
            <p><a href="{confirm_link}">{confirm_link}</a></p>
            <p>Ce lien expire dans 24h.</p>
        """,
        subtype="html",
    )
    fm = FastMail(conf)
    await fm.send_message(message)

    return {"message": "Inscription réussie. Vérifie ton email pour confirmer ton compte."}


@app.get("/confirm/{token}")
async def confirm_email(token: str, db: Session = Depends(get_db)):
    email = verify_confirmation_token(token)
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    if user.is_confirmed:
        return {"message": "Compte déjà confirmé"}
    user.is_confirmed = True
    db.commit()
    return {"message": "Compte confirmé avec succès. Tu peux maintenant te connecter."}


@app.post("/login", response_model=schemas.Token)
async def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()


    if not user or not pwd_context.verify(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    if not user.is_confirmed:
        raise HTTPException(
            status_code=403,
            detail="Compte non confirmé. Vérifie ta boîte mail pour activer ton compte.",
        )

    access_token = jwt.encode(
        {
            "sub": user.email,
            "role": user.role,
            "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
    }


@app.post("/logout")
def logout(_: models.User = Depends(get_current_user)):
    """
    Le token JWT est stateless.
    Le frontend doit supprimer le cookie `access_token` à la réception du 200.
    """
    return {"message": "Déconnexion réussie. À bientôt dans l'univers."}


@app.post("/forgot-password")
async def forgot_password(
    request: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if user:
        reset_token = generate_reset_token(user.email)
        reset_link = f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token={reset_token}"
        message = MessageSchema(
            subject="Réinitialisation de ton mot de passe Immers'Write",
            recipients=[user.email],
            body=f"""
                <p>Tu as demandé à réinitialiser ton mot de passe.</p>
                <p><a href="{reset_link}">Clique ici pour créer un nouveau mot de passe</a></p>
                <p>Ce lien expire dans <strong>1 heure</strong>.</p>
                <p>Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>
            """,
            subtype="html",
        )
        fm = FastMail(conf)
        await fm.send_message(message)
    return {"message": "Si cet email existe, un lien de réinitialisation a été envoyé."}


@app.post("/reset-password")
async def reset_password(
    request: schemas.ResetPasswordRequest, db: Session = Depends(get_db)
):
    email = verify_reset_token(request.token)
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    user.hashed_password = hash_password(request.new_password)
    db.commit()
    return {"message": "Mot de passe réinitialisé avec succès."}


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES LIVRES (lecture publique / écriture auteur uniquement)
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/books", response_model=List[schemas.BookResponse])
def get_books(db: Session = Depends(get_db)):
    """Public — liste les livres publiés"""
    return db.query(models.Book).filter(models.Book.is_published == True).all()


@app.get("/books/{slug}", response_model=schemas.BookResponse)
def get_book(slug: str, db: Session = Depends(get_db)):
    """Public — détail d'un livre"""
    book = db.query(models.Book).filter(models.Book.slug == slug).first()
    if not book:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    return book


@app.post("/books", response_model=schemas.BookResponse)
def create_book(
    book: schemas.BookCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_auteur),   # ← protégé auteur
):
    existing = db.query(models.Book).filter(models.Book.slug == book.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ce slug existe déjà")
    db_book = models.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


@app.put("/books/{slug}", response_model=schemas.BookResponse)
def update_book(
    slug: str,
    book: schemas.BookCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_auteur),   # ← protégé auteur
):
    db_book = db.query(models.Book).filter(models.Book.slug == slug).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    for key, value in book.model_dump().items():
        setattr(db_book, key, value)
    db.commit()
    db.refresh(db_book)
    return db_book


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES CHAPITRES
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/books/{slug}/chapters", response_model=List[schemas.ChapterResponse])
def get_chapters(slug: str, db: Session = Depends(get_db)):
    """Public — liste les chapitres publiés d'un livre"""
    book = db.query(models.Book).filter(models.Book.slug == slug).first()
    if not book:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    return (
        db.query(models.Chapter)
        .filter(models.Chapter.book_id == book.id, models.Chapter.is_published == True)
        .order_by(models.Chapter.order)
        .all()
    )


@app.get("/books/{slug}/chapters/{order}", response_model=schemas.ChapterResponse)
def get_chapter(slug: str, order: int, db: Session = Depends(get_db)):
    """Public — détail d'un chapitre publié"""
    book = db.query(models.Book).filter(models.Book.slug == slug).first()
    if not book:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    chapter = (
        db.query(models.Chapter)
        .filter(
            models.Chapter.book_id == book.id,
            models.Chapter.order == order,
            models.Chapter.is_published == True,
        )
        .first()
    )
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapitre non trouvé")
    return chapter


@app.post("/books/{slug}/chapters", response_model=schemas.ChapterResponse)
def create_chapter(
    slug: str,
    chapter: schemas.ChapterCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_auteur),   # ← protégé auteur
):
    book = db.query(models.Book).filter(models.Book.slug == slug).first()
    if not book:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    existing = (
        db.query(models.Chapter)
        .filter(models.Chapter.book_id == book.id, models.Chapter.order == chapter.order)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail=f"Un chapitre avec l'ordre {chapter.order} existe déjà")
    db_chapter = models.Chapter(**chapter.model_dump(), book_id=book.id)
    db.add(db_chapter)
    db.commit()
    db.refresh(db_chapter)
    return db_chapter


@app.put("/books/{slug}/chapters/{order}", response_model=schemas.ChapterResponse)
def update_chapter(
    slug: str,
    order: int,
    chapter: schemas.ChapterUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_auteur),
):
    book = db.query(models.Book).filter(models.Book.slug == slug).first()
    if not book:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    db_chapter = (
        db.query(models.Chapter)
        .filter(models.Chapter.book_id == book.id, models.Chapter.order == order)
        .first()
    )
    if not db_chapter:
        raise HTTPException(status_code=404, detail="Chapitre non trouvé")
    for key, value in chapter.model_dump(exclude_unset=True).items():
        setattr(db_chapter, key, value)
    db.commit()
    db.refresh(db_chapter)
    return db_chapter


@app.delete("/books/{slug}/chapters/{order}", status_code=204)
def delete_chapter(
    slug: str,
    order: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_auteur),
):
    book = db.query(models.Book).filter(models.Book.slug == slug).first()
    if not book:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    db_chapter = (
        db.query(models.Chapter)
        .filter(models.Chapter.book_id == book.id, models.Chapter.order == order)
        .first()
    )
    if not db_chapter:
        raise HTTPException(status_code=404, detail="Chapitre non trouvé")
    db.delete(db_chapter)
    db.commit()