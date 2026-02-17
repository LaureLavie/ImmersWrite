from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base
import enum

class UserRole(str, enum.Enum):
    auteur = "auteur"
    lecteur = "lecteur"

class Book(Base):
    __tablename__ = "books"

    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(String, nullable=False)
    author       = Column(String, nullable=False)
    description  = Column(Text)
    cover_url    = Column(String)
    slug         = Column(String, unique=True, index=True, nullable=False)
    is_published = Column(Boolean, default=False)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())