from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Details API")

# Configuração CORS abrangente
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://5173-i83ezger1yrrrpsdax61j-e54c7ca7.manusvm.computer",
    "*"  # Para desenvolvimento - ajustar em produção
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex="https://.*\\.manusvm\\.computer",
)

@app.get("/")
async def root():
    return {"message": "Bem-vindo ao backend do Details!"}

from .api import users, editais, documentos, auth

app.include_router(users.router)
app.include_router(editais.router)
app.include_router(documentos.router)
app.include_router(auth.router)


