import os
from typing import Optional

class Settings:
    PROJECT_NAME: str = "Details App"
    VERSION: str = "1.0.0"
    
    # Banco de dados com fallback
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./details_local.db"
    )
    
    # Detectar ambiente
    @property
    def is_github_env(self) -> bool:
        return os.getenv("GITHUB_ACTIONS") == "true"
    
    @property
    def is_docker_available(self) -> bool:
        try:
            import docker
            client = docker.from_env()
            client.ping()
            return True
        except:
            return False

settings = Settings()


