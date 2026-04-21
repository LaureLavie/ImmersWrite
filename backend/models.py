from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import enum



class UserRole(str, enum.Enum):
    auteur  = "auteur"
    lecteur = "lecteur"



class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_confirmed    = Column(Boolean, default=False)
    role            = Column(String, nullable=False)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    books = relationship("Book", back_populates="user")

class AlphaRegistration(Base):
    __tablename__ = "alpha_registrations"
 
    id              = Column(Integer, primary_key=True, index=True)
    role            = Column(String, nullable=False)
    email           = Column(String, nullable=True)
    answers         = Column(JSON, nullable=True)
    echo_ressenti   = Column(String, nullable=True)
    statut          = Column(String, default="en_attente")
    notes_admin     = Column(Text, nullable=True) 
    created_at      = Column(DateTime(timezone=True), server_default=func.now())


class Book(Base):
    __tablename__ = "books"

    id           = Column(Integer, primary_key=True, index=True)

    user_id      = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    title        = Column(String, nullable=False)
    author       = Column(String, nullable=False)   
    description  = Column(Text)
    cover_url    = Column(String)
    slug         = Column(String, unique=True, index=True, nullable=False)
    is_published = Column(Boolean, default=False)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())


    user     = relationship("User", back_populates="books")
    chapters = relationship(
        "Chapter",
        back_populates="book",
        order_by="Chapter.order",
        cascade="all, delete-orphan",
    )



class Chapter(Base):
    __tablename__ = "chapters"

    id           = Column(Integer, primary_key=True, index=True)
    book_id      = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False)
    order        = Column(Integer, nullable=False)
    cover_url    = Column(String)
    title        = Column(String, nullable=False)
    content      = Column(Text)
    image_url    = Column(String)
    image_title  = Column(String)
    sound_url    = Column(String)
    sound_title  = Column(String)
    music_url    = Column(String)
    music_title  = Column(String)
    is_published = Column(Boolean, default=False)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())


    book   = relationship("Book", back_populates="chapters")

    medias = relationship(
        "Media",
        back_populates="chapter",
        cascade="all, delete-orphan",
    )
    views    = relationship("ChapterView",  back_populates="chapter", cascade="all, delete-orphan")
    echoes   = relationship("ChapterEcho",  back_populates="chapter", cascade="all, delete-orphan")
    comments = relationship(
        "Comment",
        back_populates="chapter",
        cascade="all, delete-orphan",
        primaryjoin="and_(Comment.chapter_id == Chapter.id, Comment.parent_id == None)",
    )


class Media(Base):
    __tablename__ = "media"

    id         = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)

    type       = Column(String, nullable=False)

    url        = Column(String, nullable=False)

    title      = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


    chapter = relationship("Chapter", back_populates="medias")



class GeneratedImage(Base):
    __tablename__ = "generated_images"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    prompt     = Column(String, nullable=False)
    url        = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneratedAudio(Base):
    __tablename__ = "generated_audios"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id"), nullable=False)
    prompt     = Column(String, nullable=False)
    url        = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ChapterView(Base):
    __tablename__ = "chapter_views"

    id         = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    chapter = relationship("Chapter", back_populates="views")


class ChapterEcho(Base):
    __tablename__ = "chapter_echoes"

    id         = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    # emerveillement | resonance | intrigue | tristesse | frisson
    type       = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    chapter = relationship("Chapter", back_populates="echoes")


class Comment(Base):
    __tablename__ = "comments"

    id               = Column(Integer, primary_key=True, index=True)
    chapter_id       = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    user_id          = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    parent_id        = Column(Integer, ForeignKey("comments.id", ondelete="CASCADE"), nullable=True)
    content          = Column(Text, nullable=False)
    is_author_reply  = Column(Boolean, default=False)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    chapter  = relationship("Chapter", back_populates="comments")
    user     = relationship("User")
    replies  = relationship(
        "Comment",
        back_populates="parent",
        foreign_keys="Comment.parent_id",
        cascade="all, delete-orphan",
    )
    parent   = relationship("Comment", back_populates="replies", remote_side="Comment.id")