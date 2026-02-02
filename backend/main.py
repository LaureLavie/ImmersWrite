from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, validator
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from datetime import datetime
import jwt
from typing import Optional
import enum
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL")  # Format: postgresql://user:password@host/dbname
SECRET_KEY = os.getenv("SECRET_KEY", "votre-cle-secrete-tres-longue-et-complexe")
ALGORITHM = "HS256"

# Vérification de la connexion à la base de données
try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    # Créer les tables si elles n'existent pas
    Base.metadata.create_all(bind=engine)
except Exception as e:
    raise RuntimeError("Erreur lors de la connexion à la base de données : " + str(e))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# FastAPI app
app = FastAPI(title="Immers'Write API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Enums
class UserTypeEnum(str, enum.Enum):
    lecteur = "lecteur"
    auteur = "auteur"


# Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    user_type = Column(Enum(UserTypeEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Pydantic schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    user_type: UserTypeEnum

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('le mot de passe doit contenir au moins 8 caractères')
        return v


class UserResponse(BaseModel):
    id: int
    email: str
    user_type: UserTypeEnum
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Utilities
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


# Routes
@app.get("/")
async def root():
    return {
        "message": "Bienvenue sur l'API Immers'Write",
        "tagline": "where words become worlds"
    }


@app.get("/health")
async def health_check():
    """
    Endpoint pour vérifier l'état de santé de l'application.
    """
    return {"status": "ok"}


@app.post("/api/auth/register", response_model=TokenResponse, status_code=201)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Inscription d'un nouvel utilisateur (lecteur ou auteur)
    """
    # Vérifier si l'email existe déjà
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="cet email est déjà utilisé"
        )

    # Créer le nouvel utilisateur
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        user_type=user_data.user_type
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Créer le token JWT
    access_token = create_access_token(
        data={"user_id": new_user.id, "email": new_user.email}
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.from_orm(new_user)
    )


@app.post("/api/auth/login", response_model=TokenResponse)
async def login(email: EmailStr, password: str, db: Session = Depends(get_db)):
    """
    Connexion d'un utilisateur existant
    """
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="identifiants incorrects"
        )

    access_token = create_access_token(
        data={"user_id": user.id, "email": user.email}
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)