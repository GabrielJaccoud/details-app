from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..services import crud
from ..models import models
from ..schemas import schemas
from ..database import get_db

router = APIRouter()

@router.post("/documentos/", response_model=schemas.Documento)
def create_documento(documento: schemas.DocumentoCreate, db: Session = Depends(get_db)):
    return crud.create_documento(db=db, documento=documento)

@router.get("/documentos/", response_model=list[schemas.Documento])
def read_documentos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    documentos = crud.get_documentos(db, skip=skip, limit=limit)
    return documentos

@router.get("/documentos/{documento_id}", response_model=schemas.Documento)
def read_documento(documento_id: int, db: Session = Depends(get_db)):
    db_documento = crud.get_documento(db, documento_id=documento_id)
    if db_documento is None:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    return db_documento


