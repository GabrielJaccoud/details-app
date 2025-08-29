import os
import sys
from app.core.config import settings

def setup_environment():
    # Configurar ambiente baseado na detecção
    if settings.is_github_env or not settings.is_docker_available:
        print("🔧 Configurando para ambiente limitado...")
        os.environ["DATABASE_URL"] = "sqlite:///./details_github.db"
    else:
        print("🔧 Usando configuração padrão...")

def start_application():
    setup_environment()
    
    # Importar após configuração
    from app.main import app
    import uvicorn
    
    print("🚀 Iniciando aplicação...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=settings.is_github_env
    )

if __name__ == "__main__":
    start_application()


