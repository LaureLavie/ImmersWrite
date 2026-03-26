from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from dotenv import load_dotenv
from urllib.parse import quote, unquote
from utils import (
    hash_password,
    verify_password,
    generate_confirmation_token,
    verify_confirmation_token,
    generate_reset_token,
    verify_reset_token,
    generate_image,
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
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    confirm_link = f"{frontend_url.rstrip('/')}/confirm?token={confirmation_token}"

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
    db.add(user)
    db.commit()
    db.refresh(user)
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
# ROUTES IMAGES (Génératiuon d'images par chapitre, protégées auteur uniquement)
# ─────────────────────────────────────────────────────────────────────────────

def get_user_image_count(user_id: int, db: Session) -> int:
    return db.query(models.GeneratedImage).filter(
        models.GeneratedImage.user_id == user_id
    ).count()


def save_image_to_db(user_id: int, chapter_id: int, url: str, prompt: str, db: Session) -> models.GeneratedImage:
    image = models.GeneratedImage(
        user_id=user_id,
        chapter_id=chapter_id,
        url=url,
        prompt=prompt
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


@app.post("/images/generate", response_model=schemas.ImageResponse)
async def generate_chapter_image(
    request: schemas.ImageRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur), 
):
    # 1. Vérifier le quota
    count = get_user_image_count(current_user.id, db)
    if count >= 10:
        raise HTTPException(
            status_code=429,
            detail=f"Quota atteint : {count}/10 images utilisées pour la phase alpha."
        )

    # 2. Appeler DALL-E (generate_image vient de utils.py)
    from utils import generate_image as dalle_generate
    image_url = await dalle_generate(request.prompt)

    # 3. Sauvegarder en BDD
    saved_image = save_image_to_db(
        user_id=current_user.id,
        chapter_id=request.chapter_id,
        url=image_url,
        prompt=request.prompt,
        db=db
    )

    return saved_image


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


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES AUTEUR  — PROJET 
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/author/project", response_model=schemas.BookResponse)
def get_my_project(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):
  
    project = (
        db.query(models.Book)
        .filter(models.Book.user_id == current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Aucun projet trouvé. Crée ton premier projet !")
    return project


@app.post("/author/project", response_model=schemas.BookResponse, status_code=201)
def create_my_project(
    data: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):
   
    existing = (
        db.query(models.Book)
        .filter(models.Book.user_id == current_user.id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Tu as déjà un projet. Pour cette version test, 1 seul projet est autorisé.",
        )

    slug_exists = db.query(models.Book).filter(models.Book.slug == data.slug).first()
    if slug_exists:
        raise HTTPException(status_code=400, detail=f"Le slug '{data.slug}' est déjà utilisé. Choisis-en un autre.")


    new_book = models.Book(
        user_id     = current_user.id,
        title       = data.title,
        author      = data.author_name,
        description = data.description,
        cover_url   = data.cover_url,
        slug        = data.slug,
        is_published= False, 
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book


@app.put("/author/project", response_model=schemas.BookResponse)
def update_my_project(
    data: schemas.ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):
 
    project = db.query(models.Book).filter(models.Book.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Projet introuvable.")

    # exclude_unset=True → ne modifie QUE les champs envoyés
    for key, value in data.model_dump(exclude_unset=True).items():
        # "author_name" dans le schéma → "author" dans le modèle
        if key == "author_name":
            setattr(project, "author", value)
        else:
            setattr(project, key, value)

    db.commit()
    db.refresh(project)
    return project

@app.delete("/author/project", response_model=schemas.DeleteProjectResponse)
def delete_my_project(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):

    # ── Récupère le projet ────────────────────────────────────────────────────
    project = db.query(models.Book).filter(models.Book.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Aucun projet à supprimer.")
 
    # ── Mémorise les infos AVANT suppression (elles seront perdues après) ─────
    project_id    = project.id
    project_title = project.title
    # len() sur la relation lazy-loaded → compte les chapitres liés
    chapters_count = len(project.chapters)
 
    # ── Suppression en cascade ────────────────────────────────────────────────
    # Grâce à cascade="all, delete-orphan" dans le modèle Book,
    # SQLAlchemy supprime automatiquement :
    #   • tous les Chapter liés au Book
    #   • tous les Media liés à chaque Chapter
    # Pas besoin de boucles manuelles.
    db.delete(project)
    db.commit()
 
    # ── Réponse de confirmation ───────────────────────────────────────────────
    return schemas.DeleteProjectResponse(
        message=f"Le projet \"{project_title}\" a été supprimé définitivement.",
        deleted_project_id=project_id,
        deleted_project_title=project_title,
        chapters_deleted=chapters_count,
    )


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES AUTEUR  — CHAPITRES
# ─────────────────────────────────────────────────────────────────────────────

def _get_author_project_or_404(user_id: int, db: Session) -> models.Book:

    project = db.query(models.Book).filter(models.Book.user_id == user_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Tu n'as pas encore de projet.")
    return project


def _get_chapter_or_404(book_id: int, order: int, db: Session) -> models.Chapter:

    chapter = (
        db.query(models.Chapter)
        .filter(
            models.Chapter.book_id == book_id,
            models.Chapter.order == order,
        )
        .first()
    )
    if not chapter:
        raise HTTPException(status_code=404, detail=f"Chapitre {order} introuvable.")
    return chapter


@app.get("/author/project/chapters", response_model=list[schemas.ChapterResponse])
def get_my_chapters(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):
  
    project = _get_author_project_or_404(current_user.id, db)
    return (
        db.query(models.Chapter)
        .filter(models.Chapter.book_id == project.id)
        .order_by(models.Chapter.order)
        .all()
    )


@app.post("/author/project/chapters", response_model=schemas.ChapterResponse, status_code=201)
def create_my_chapter(
    chapter: schemas.ChapterCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):
  
    project = _get_author_project_or_404(current_user.id, db)

    # Vérification ordre unique
    existing = (
        db.query(models.Chapter)
        .filter(
            models.Chapter.book_id == project.id,
            models.Chapter.order == chapter.order,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Un chapitre avec l'ordre {chapter.order} existe déjà.",
        )

    db_chapter = models.Chapter(**chapter.model_dump(), book_id=project.id)
    db.add(db_chapter)
    db.commit()
    db.refresh(db_chapter)
    return db_chapter


@app.get("/author/project/chapters/{order}", response_model=schemas.ChapterResponse)
def get_my_chapter(
    order: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):

    project = _get_author_project_or_404(current_user.id, db)
    return _get_chapter_or_404(project.id, order, db)


@app.put("/author/project/chapters/{order}", response_model=schemas.ChapterResponse)
def update_my_chapter(
    order: int,
    data: schemas.ChapterUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):

    project = _get_author_project_or_404(current_user.id, db)
    chapter = _get_chapter_or_404(project.id, order, db)

    # Verrou : chapitre publié = lecture seule (PUB-04)
    if chapter.is_published:
        raise HTTPException(
            status_code=403,
            detail="Ce chapitre est publié. Tu ne peux plus le modifier.",
        )

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(chapter, key, value)

    db.commit()
    db.refresh(chapter)
    return chapter


@app.delete("/author/project/chapters/{order}", status_code=204)
def delete_my_chapter(
    order: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):
    project = _get_author_project_or_404(current_user.id, db)
    chapter = _get_chapter_or_404(project.id, order, db)


    db.delete(chapter)
    db.commit()


@app.post("/author/project/chapters/{order}/publish", response_model=schemas.ChapterResponse)
def publish_my_chapter(
    order: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):
 
    project = _get_author_project_or_404(current_user.id, db)
    chapter = _get_chapter_or_404(project.id, order, db)

    if chapter.is_published:
        raise HTTPException(status_code=400, detail="Ce chapitre est déjà publié.")

    if not chapter.title or not chapter.content:
        raise HTTPException(
            status_code=400,
            detail="Un titre et un contenu sont requis avant de publier.",
        )

    chapter.is_published = True
    if not project.is_published:
        project.is_published = True
    db.commit()
    db.refresh(chapter)
    return chapter


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES AUTEUR - MEDIA
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/author/project/chapters/{order}/media", response_model=list[schemas.MediaResponse])
def get_chapter_media(
    order: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):
    """Liste les médias d'un chapitre."""
    project = _get_author_project_or_404(current_user.id, db)
    chapter = _get_chapter_or_404(project.id, order, db)
    return chapter.medias


@app.post("/author/project/chapters/{order}/media", response_model=schemas.MediaResponse, status_code=201)
def add_chapter_media(
    order: int,
    media_data: schemas.MediaCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):
    
    project = _get_author_project_or_404(current_user.id, db)
    chapter = _get_chapter_or_404(project.id, order, db)

    if chapter.is_published:
        raise HTTPException(status_code=403, detail="Chapitre publié, impossible d'ajouter des médias.")


    if media_data.type not in ("image", "sound"):
        raise HTTPException(status_code=400, detail="Type invalide. Utilise 'image' ou 'sound'.")

    existing_media = chapter.medias
    images = [m for m in existing_media if m.type == "image"]
    sounds = [m for m in existing_media if m.type == "sound"]

    if media_data.type == "image" and len(images) >= 2:
        raise HTTPException(status_code=400, detail="Max 2 images par chapitre pour l'alpha.")
    if media_data.type == "sound" and len(sounds) >= 1:
        raise HTTPException(status_code=400, detail="Max 1 son par chapitre pour l'alpha.")

    new_media = models.Media(
        chapter_id = chapter.id,
        type       = media_data.type,
        url        = media_data.url,
        title      = media_data.title,
    )
    db.add(new_media)
    db.commit()
    db.refresh(new_media)
    return new_media


@app.delete("/author/project/chapters/{order}/media/{media_id}", status_code=204)
def delete_chapter_media(
    order: int,
    media_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):

    project = _get_author_project_or_404(current_user.id, db)
    chapter = _get_chapter_or_404(project.id, order, db)

    media = db.query(models.Media).filter(
        models.Media.id == media_id,
        models.Media.chapter_id == chapter.id,
    ).first()

    if not media:
        raise HTTPException(status_code=404, detail="Media introuvable.")

    db.delete(media)
    db.commit()

    # ─────────────────────────────────────────────────────────────────────────────
# ROUTES VUES — incrémenter à chaque lecture
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/books/{slug}/chapters/{order}/view", status_code=201)
def record_view(slug: str, order: int, db: Session = Depends(get_db)):
    """Public — appelé automatiquement quand un lecteur ouvre un chapitre."""
    # On vérifie que le chapitre existe et est publié
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

    # On ajoute simplement une ligne dans chapter_views
    view = models.ChapterView(chapter_id=chapter.id)
    db.add(view)
    db.commit()
    return {"message": "Vue enregistrée"}


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES ÉCHOS
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/books/{slug}/chapters/{order}/echo", status_code=201)
def add_echo(
    slug: str,
    order: int,
    data: schemas.EchoCreate,
    db: Session = Depends(get_db),
):
    """Public — enregistre un clic sur un écho émotionnel."""
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

    echo = models.ChapterEcho(chapter_id=chapter.id, type=data.type)
    db.add(echo)
    db.commit()
    return {"message": "Écho enregistré", "type": data.type}


@app.get("/books/{slug}/chapters/{order}/echoes", response_model=schemas.EchoCountsResponse)
def get_echoes(slug: str, order: int, db: Session = Depends(get_db)):
    """Public — retourne les compteurs d'échos d'un chapitre."""
    book = db.query(models.Book).filter(models.Book.slug == slug).first()
    if not book:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    chapter = (
        db.query(models.Chapter)
        .filter(models.Chapter.book_id == book.id, models.Chapter.order == order)
        .first()
    )
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapitre non trouvé")

    # On initialise tous les types à 0
    counts: dict[str, int] = {
        "emerveillement": 0,
        "resonance": 0,
        "intrigue": 0,
        "tristesse": 0,
        "frisson": 0,
    }
    # On compte les échos depuis la BDD et on remplit le dict
    echoes = db.query(models.ChapterEcho).filter(
        models.ChapterEcho.chapter_id == chapter.id
    ).all()
    for echo in echoes:
        if echo.type in counts:
            counts[echo.type] += 1

    total = sum(counts.values())
    return schemas.EchoCountsResponse(chapter_id=chapter.id, total=total, counts=counts)


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES COMMENTAIRES
# ─────────────────────────────────────────────────────────────────────────────

def _anonymize_email(email: str) -> str:
    """Transforme 'laure@gmail.com' en 'lau***@gmail.com' pour l'affichage."""
    if "@" not in email:
        return "Lecteur"
    local, domain = email.split("@", 1)
    visible = local[:3] if len(local) >= 3 else local
    return f"{visible}***@{domain}"


def _build_comment_response(comment: models.Comment) -> schemas.CommentResponse:
    """Construit un CommentResponse avec le label anonymisé et les réponses."""
    user_label = None
    if comment.user:
        if comment.is_author_reply:
            user_label = "✦ L'Auteur"
        else:
            user_label = _anonymize_email(comment.user.email)

    return schemas.CommentResponse(
        id=comment.id,
        chapter_id=comment.chapter_id,
        user_id=comment.user_id,
        user_label=user_label,
        parent_id=comment.parent_id,
        content=comment.content,
        is_author_reply=comment.is_author_reply,
        created_at=comment.created_at,
        # On construit récursivement les réponses
        replies=[_build_comment_response(r) for r in comment.replies],
    )


@app.get("/books/{slug}/chapters/{order}/comments", response_model=list[schemas.CommentResponse])
def get_comments(slug: str, order: int, db: Session = Depends(get_db)):
    """Public — retourne les commentaires racine avec leurs réponses."""
    book = db.query(models.Book).filter(models.Book.slug == slug).first()
    if not book:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    chapter = (
        db.query(models.Chapter)
        .filter(models.Chapter.book_id == book.id, models.Chapter.order == order)
        .first()
    )
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapitre non trouvé")

    # Seulement les commentaires racine (parent_id = None)
    root_comments = (
        db.query(models.Comment)
        .filter(
            models.Comment.chapter_id == chapter.id,
            models.Comment.parent_id == None,
        )
        .order_by(models.Comment.created_at.asc())
        .all()
    )
    return [_build_comment_response(c) for c in root_comments]


@app.post("/books/{slug}/chapters/{order}/comments", response_model=schemas.CommentResponse, status_code=201)
def add_comment(
    slug: str,
    order: int,
    data: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """Authentifié — lecteur ou auteur peut commenter."""
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

    # Si parent_id fourni, vérifier que ce commentaire existe
    if data.parent_id is not None:
        parent = db.query(models.Comment).filter(
            models.Comment.id == data.parent_id,
            models.Comment.chapter_id == chapter.id,
        ).first()
        if not parent:
            raise HTTPException(status_code=404, detail="Commentaire parent introuvable.")

    # Est-ce que c'est l'auteur du livre qui répond ?
    is_author_reply = (book.user_id == current_user.id)

    new_comment = models.Comment(
        chapter_id=chapter.id,
        user_id=current_user.id,
        parent_id=data.parent_id,
        content=data.content,
        is_author_reply=is_author_reply,
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return _build_comment_response(new_comment)


# ─────────────────────────────────────────────────────────────────────────────
# ROUTE STATS AUTEUR — dashboard uniquement
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/author/project/stats", response_model=schemas.ProjectStatsResponse)
def get_project_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_auteur),
):
    """Auteur uniquement — statistiques de vues et d'échos par chapitre."""
    project = db.query(models.Book).filter(models.Book.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Aucun projet trouvé.")

    chapters_stats = []
    total_views = 0
    total_echoes = 0

    for chapter in project.chapters:
        # Compter les vues de ce chapitre
        view_count = db.query(models.ChapterView).filter(
            models.ChapterView.chapter_id == chapter.id
        ).count()

        # Compter les échos de ce chapitre
        echo_total = db.query(models.ChapterEcho).filter(
            models.ChapterEcho.chapter_id == chapter.id
        ).count()

        total_views += view_count
        total_echoes += echo_total

        chapters_stats.append(schemas.ChapterStatsItem(
            chapter_id=chapter.id,
            order=chapter.order,
            title=chapter.title,
            view_count=view_count,
            echo_total=echo_total,
        ))

    return schemas.ProjectStatsResponse(
        total_views=total_views,
        total_echoes=total_echoes,
        chapters=chapters_stats,
    )