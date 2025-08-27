from sqlalchemy.orm import Session
from ..models import models
from ..schemas import schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

# Funções CRUD para Usuário
def get_usuario(db: Session, usuario_id: int):
    return db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()

def get_usuario_by_email(db: Session, email: str):
    return db.query(models.Usuario).filter(models.Usuario.email == email).first()

def get_usuarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Usuario).offset(skip).limit(limit).all()

def create_usuario(db: Session, usuario: schemas.UsuarioCreate):
    hashed_password = get_password_hash(usuario.senha)
    db_usuario = models.Usuario(nome=usuario.nome, email=usuario.email, senha_hash=hashed_password)
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

# Funções CRUD para Edital
def get_edital(db: Session, edital_id: int):
    return db.query(models.Edital).filter(models.Edital.id == edital_id).first()

def get_editais(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Edital).offset(skip).limit(limit).all()

def create_edital(db: Session, edital: schemas.EditalCreate, criador_id: int):
    db_edital = models.Edital(**edital.model_dump(), criador_id=criador_id)
    db.add(db_edital)
    db.commit()
    db.refresh(db_edital)
    return db_edital

# Funções CRUD para Documento
def get_documento(db: Session, documento_id: int):
    return db.query(models.Documento).filter(models.Documento.id == documento_id).first()

def get_documentos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Documento).offset(skip).limit(limit).all()

def create_documento(db: Session, documento: schemas.DocumentoCreate):
    db_documento = models.Documento(**documento.model_dump())
    db.add(db_documento)
    db.commit()
    db.refresh(db_documento)
    return db_documento

# Funções CRUD para Checklist
def get_checklist_item(db: Session, checklist_id: int):
    return db.query(models.Checklist).filter(models.Checklist.id == checklist_id).first()

def get_checklist_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Checklist).offset(skip).limit(limit).all()

def create_checklist_item(db: Session, checklist_item: schemas.ChecklistCreate):
    db_checklist_item = models.Checklist(**checklist_item.model_dump())
    db.add(db_checklist_item)
    db.commit()
    db.refresh(db_checklist_item)
    return db_checklist_item

# Funções CRUD para Alerta
def get_alerta(db: Session, alerta_id: int):
    return db.query(models.Alerta).filter(models.Alerta.id == alerta_id).first()

def get_alertas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Alerta).offset(skip).limit(limit).all()

def create_alerta(db: Session, alerta: schemas.AlertaCreate):
    db_alerta = models.Alerta(**alerta.model_dump())
    db.add(db_alerta)
    db.commit()
    db.refresh(db_alerta)
    return db_alerta


