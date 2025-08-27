from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    senha_hash = Column(String)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    editais = relationship("Edital", back_populates="criador")
    documentos = relationship("Documento", back_populates="usuario")
    alertas = relationship("Alerta", back_populates="usuario")

class Edital(Base):
    __tablename__ = "editais"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    descricao = Column(String)
    origem = Column(String)
    prazo_inscricao = Column(DateTime(timezone=True))
    valor_disponivel = Column(Float)
    url = Column(String)
    status = Column(String, default="ABERTO")
    data_publicacao = Column(DateTime(timezone=True))
    publico_alvo = Column(String)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
    criador_id = Column(Integer, ForeignKey("usuarios.id"))

    criador = relationship("Usuario", back_populates="editais")
    documentos = relationship("Documento", back_populates="edital")
    checklists = relationship("Checklist", back_populates="edital")
    alertas = relationship("Alerta", back_populates="edital")

class Documento(Base):
    __tablename__ = "documentos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    tipo = Column(String)
    caminho = Column(String)
    valido_ate = Column(DateTime(timezone=True), nullable=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    edital_id = Column(Integer, ForeignKey("editais.id"), nullable=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario", back_populates="documentos")
    edital = relationship("Edital", back_populates="documentos")

class Checklist(Base):
    __tablename__ = "checklists"

    id = Column(Integer, primary_key=True, index=True)
    edital_id = Column(Integer, ForeignKey("editais.id"))
    documento_id = Column(Integer, ForeignKey("documentos.id"), nullable=True)
    status = Column(String, default="PENDENTE") # Pode ser PENDENTE, CONCLUIDO, N_APLICAVEL
    observacoes = Column(String, nullable=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    edital = relationship("Edital", back_populates="checklists")
    documento = relationship("Documento")

class Alerta(Base):
    __tablename__ = "alertas"

    id = Column(Integer, primary_key=True, index=True)
    edital_id = Column(Integer, ForeignKey("editais.id"))
    tipo = Column(String) # Ex: 'NOVA_PUBLICACAO', '7_DIAS_PRAZO', '24H_PRAZO', 'DOCUMENTO_VENCIDO'
    data_envio = Column(DateTime(timezone=True), server_default=func.now())
    enviado = Column(Boolean, default=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    edital = relationship("Edital", back_populates="alertas")
    usuario = relationship("Usuario", back_populates="alertas")


