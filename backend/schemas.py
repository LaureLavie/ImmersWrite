from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime

from models import UserRole


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    password_confirm: str
    role: UserRole
    
    @field_validator('password')
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('le mot de passe doit contenir au moins 8 caractères')
        return v
    
    @field_validator('password_confirm')
    @classmethod
    def passwords_match(cls, v, info):
        if 'password' in info.data and v != info.data['password']:
            raise ValueError('les mots de passe ne correspondent pas')
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


class TokenData(BaseModel):
    email: Optional[str] = None

class ChapterCreate(BaseModel):
    order: int
    title: str
    content: Optional[str] = None
    image_url: Optional[str] = None       # URL Cloudinary
    sound_url: Optional[str] = None       # URL SoundCloud embed
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

    model_config = {"from_attributes": True}

class BookCreate(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    cover_url: Optional[str] = None
    slug: str
    is_published: bool = False

class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    description: Optional[str] = None
    cover_url: Optional[str] = None
    slug: str
    is_published: bool
    created_at: datetime
    chapters: List[ChapterResponse] = []
    
    model_config = {"from_attributes": True}