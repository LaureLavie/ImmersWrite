from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from models import UserRole


# ──────────────────────────────────────────────────────────────────────────────
# Auth
# ──────────────────────────────────────────────────────────────────────────────

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    password_confirm: str
    role: UserRole

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("le mot de passe doit contenir au moins 8 caractères")
        return v

    @field_validator("password_confirm")
    @classmethod
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("les mots de passe ne correspondent pas")
        return v


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    new_password_confirm: str

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Le mot de passe doit contenir au moins 8 caractères")
        return v

    @field_validator("new_password_confirm")
    @classmethod
    def passwords_match(cls, v, info):
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Les mots de passe ne correspondent pas")
        return v


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: UserRole
    is_confirmed: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str
    role: str


class TokenData(BaseModel):
    email: Optional[str] = None

# ──────────────────────────────────────────────────────────────────────────────
# Suppression de projet
# ──────────────────────────────────────────────────────────────────────────────

class DeleteProjectResponse(BaseModel):
    message: str
    deleted_project_id: int
    deleted_project_title: str
    chapters_deleted: int

# ──────────────────────────────────────────────────────────────────────────────
# Médias importés
# ──────────────────────────────────────────────────────────────────────────────

class MediaCreate(BaseModel):
    type: str
    url: str
    title: Optional[str] = None


class MediaResponse(BaseModel):
    """Ce que l'API renvoie après création d'un media."""
    id: int
    chapter_id: int
    type: str
    url: str
    title: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────────────────────────────────────
# Chapitres
# ──────────────────────────────────────────────────────────────────────────────

class ChapterCreate(BaseModel):
    order: int
    title: str
    content: Optional[str] = None
    image_url: Optional[str] = None
    sound_url: Optional[str] = None
    sound_title: Optional[str] = None
    is_published: bool = False


class ChapterUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    sound_url: Optional[str] = None
    sound_title: Optional[str] = None
    is_published: Optional[bool] = None


class ChapterResponse(BaseModel):
    id: int
    book_id: int
    order: int
    title: str
    content: Optional[str] = None
    image_url: Optional[str] = None
    sound_url: Optional[str] = None
    sound_title: Optional[str] = None
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    medias: List[MediaResponse] = []

    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────────────────────────────────────
# Projets / Livres
# ──────────────────────────────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    title: str
    author_name: str
    description: Optional[str] = None
    cover_url: Optional[str] = None
    slug: str


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    author_name: Optional[str] = None
    description: Optional[str] = None
    cover_url: Optional[str] = None


class BookCreate(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    cover_url: Optional[str] = None
    slug: str
    is_published: bool = False


class BookResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    title: str
    author: str
    description: Optional[str] = None
    cover_url: Optional[str] = None
    slug: str
    is_published: bool
    created_at: datetime
    chapters: List[ChapterResponse] = []

    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────────────────────────────────────
# Images IA
# ──────────────────────────────────────────────────────────────────────────────

class ImageRequest(BaseModel):
    prompt: str
    chapter_id: int


class ImageResponse(BaseModel):
    id: int
    user_id: int
    chapter_id: int
    prompt: str
    url: str
    created_at: datetime

    model_config = {"from_attributes": True}