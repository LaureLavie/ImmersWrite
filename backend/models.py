from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import enum


class UserRole(str, enum.Enum):
    auteur = "auteur"
    lecteur = "lecteur"


class User(Base):
    __tablename__ = "users"

    id               = Column(Integer, primary_key=True, index=True)
    email            = Column(String, unique=True, nullable=False)
    hashed_password  = Column(String, nullable=False)
    is_confirmed     = Column(Boolean, default=False)
    role             = Column(SAEnum(UserRole, name="userrole"), nullable=False)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())


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
    chapters     = relationship(
        "Chapter",
        back_populates="book",
        order_by="Chapter.order",
        cascade="all, delete-orphan"
    )


class Chapter(Base):
    __tablename__ = "chapters"

    id           = Column(Integer, primary_key=True, index=True)
    book_id      = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    order        = Column(Integer, nullable=False)
    title        = Column(String, nullable=False)
    content      = Column(Text)
    image_url    = Column(String)
    sound_url    = Column(String)
    sound_title  = Column(String)
    is_published = Column(Boolean, default=False)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())
    book         = relationship("Book", back_populates="chapters")

class GeneratedImage(Base):
    __tablename__ = "generated_images"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    prompt = Column(String, nullable=False)
    url = Column(String, nullable=False) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())