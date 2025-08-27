from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter()

@router.post("/editais/", response_model=schemas.Edital)
def create_edital(edital: schemas.EditalCreate, criador_id: int, db: Session = Depends(get_db)):
    return crud.create_edital(db=db, edital=edital, criador_id=criador_id)

@router.get("/editais/", response_model=list[schemas.Edital])
def read_editais(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    editais = crud.get_editais(db, skip=skip, limit=limit)
    return editais

@router.get("/editais/{edital_id}", response_model=schemas.Edital)
def read_edital(edital_id: int, db: Session = Depends(get_db)):
    db_edital = crud.get_edital(db, edital_id=edital_id)
    if db_edital is None:
        raise HTTPException(status_code=404, detail="Edital não encontrado")
    return db_edital


