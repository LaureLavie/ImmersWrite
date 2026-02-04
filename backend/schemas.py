from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime

from .models.user import UserRole


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
    is_active: bool
    created_at: datetime
    
    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None