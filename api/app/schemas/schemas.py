from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    senha: str

class Usuario(UsuarioBase):
    id: int
    criado_em: datetime

    class Config:
        from_attributes = True

class EditalBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    origem: str
    prazo_inscricao: datetime
    valor_disponivel: Optional[float] = None
    url: str
    status: Optional[str] = "ABERTO"
    data_publicacao: datetime
    publico_alvo: Optional[str] = None

class EditalCreate(EditalBase):
    pass

class Edital(EditalBase):
    id: int
    criado_em: datetime
    criador_id: Optional[int] = None

    class Config:
        from_attributes = True

class DocumentoBase(BaseModel):
    nome: str
    tipo: str
    caminho: str
    valido_ate: Optional[datetime] = None

class DocumentoCreate(DocumentoBase):
    usuario_id: int
    edital_id: Optional[int] = None

class Documento(DocumentoBase):
    id: int
    criado_em: datetime
    usuario_id: int
    edital_id: Optional[int] = None

    class Config:
        from_attributes = True

class ChecklistBase(BaseModel):
    edital_id: int
    documento_id: Optional[int] = None
    status: Optional[str] = "PENDENTE"
    observacoes: Optional[str] = None

class ChecklistCreate(ChecklistBase):
    pass

class Checklist(ChecklistBase):
    id: int
    criado_em: datetime

    class Config:
        from_attributes = True

class AlertaBase(BaseModel):
    edital_id: int
    tipo: str
    data_envio: Optional[datetime] = None
    enviado: Optional[bool] = False
    usuario_id: Optional[int] = None

class AlertaCreate(AlertaBase):
    pass

class Alerta(AlertaBase):
    id: int
    criado_em: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


