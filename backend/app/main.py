from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Bem-vindo ao backend do Details!"}




from .api import users, editais, documentos

app.include_router(users.router)
app.include_router(editais.router)
app.include_router(documentos.router)


