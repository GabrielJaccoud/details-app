import os
import sys
from app.core.config import settings

def check_docker_availability():
    try:
        import docker
        client = docker.from_env()
        client.ping()
        return True
    except Exception as e:
        print(f"Docker não disponível: {e}")
        return False

def check_database_connection():
    try:
        from app.database import engine
        engine.connect()
        return True
    except Exception as e:
        print(f"Conexão com banco falhou: {e}")
        return False

def main():
    print("=== Verificação de Ambiente ===")
    print(f"Ambiente GitHub: {settings.is_github_env}")
    print(f"Docker disponível: {check_docker_availability()}")
    print(f"Banco conectado: {check_database_connection()}")
    
    if not check_database_connection():
        print("Sugestão: Use SQLite local para desenvolvimento")
        print("DATABASE_URL=sqlite:///./details_dev.db")

if __name__ == "__main__":
    main()


