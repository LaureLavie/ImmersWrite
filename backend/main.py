from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Bienvenue dans l'API Immers'Write!"}

@app.get("/books", response_model=List[schemas.BookResponse])
def get_books(db: Session = Depends(get_db)):
    books = db.query(models.Book)\
              .filter(models.Book.is_published == True)\
              .all()
    return books

@app.get("/books/{slug}", response_model=schemas.BookResponse)
def get_book(slug: str, db: Session = Depends(get_db)):
    book = db.query(models.Book)\
             .filter(models.Book.slug == slug)\
             .first()
    if not book:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    return book

@app.post("/books", response_model=schemas.BookResponse)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Book)\
                 .filter(models.Book.slug == book.slug)\
                 .first()
    if existing:
        raise HTTPException(status_code=400, detail="Ce slug existe déjà")
    db_book = models.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

@app.put("/books/{slug}", response_model=schemas.BookResponse)
def update_book(slug: str, book: schemas.BookCreate, db: Session = Depends(get_db)):
    db_book = db.query(models.Book)\
                .filter(models.Book.slug == slug)\
                .first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Livre non trouvé")
    
    
    for key, value in book.model_dump().items():
        setattr(db_book, key, value)
    
    db.commit()
    db.refresh(db_book)
    return db_book