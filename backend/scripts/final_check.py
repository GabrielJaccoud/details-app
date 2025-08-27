import os
import sys
from app.core.config import settings
from app.database import engine, SessionLocal, Base
from app.models import models
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def check_config():
    print("\n=== Verificação de Configuração ===")
    print(f"Nome do Projeto: {settings.PROJECT_NAME}")
    print(f"Versão: {settings.VERSION}")
    print(f"URL do Banco de Dados: {settings.DATABASE_URL}")
    print(f"Ambiente GitHub: {settings.is_github_env}")
    print(f"Docker Disponível: {settings.is_docker_available}")
    print("✅ Configurações carregadas com sucesso.")

def test_database_connection():
    print("\n=== Teste de Conexão com o Banco de Dados ===")
    try:
        conn = engine.connect()
        conn.close()
        print("✅ Conexão com o banco de dados estabelecida com sucesso.")
        return True
    except Exception as e:
        print(f"❌ Falha na conexão com o banco de dados: {e}")
        return False

def validate_sqlalchemy_models():
    print("\n=== Validação de Modelos SQLAlchemy ===")
    try:
        # Tenta acessar os metadados para verificar se os modelos foram carregados
        _ = Base.metadata.tables
        print("✅ Modelos SQLAlchemy carregados e validados com sucesso.")
        return True
    except Exception as e:
        print(f"❌ Falha na validação dos modelos SQLAlchemy: {e}")
        return False

def confirm_api_endpoints():
    print("\n=== Confirmação de Endpoints da API ===")
    endpoints_to_test = [
        ("GET", "/"),
        ("GET", "/users/"),
        ("GET", "/editais/"),
        ("GET", "/documentos/"),
    ]
    all_passed = True
    for method, url in endpoints_to_test:
        try:
            response = client.request(method, url)
            if response.status_code == 200:
                print(f"✅ Endpoint {method} {url} respondeu com sucesso (Status 200).")
            else:
                print(f"❌ Endpoint {method} {url} falhou (Status {response.status_code}).")
                all_passed = False
        except Exception as e:
            print(f"❌ Erro ao testar endpoint {method} {url}: {e}")
            all_passed = False
    return all_passed

def main():
    print("Iniciando verificação final do backend...")
    
    config_ok = check_config()
    db_connected = test_database_connection()
    models_validated = validate_sqlalchemy_models()
    endpoints_ok = confirm_api_endpoints()

    print("\n=== Relatório de Status ===")
    print(f"Configuração: {'OK' if config_ok else 'FALHA'}")
    print(f"Conexão com DB: {'OK' if db_connected else 'FALHA'}")
    print(f"Modelos SQLAlchemy: {'OK' if models_validated else 'FALHA'}")
    print(f"Endpoints da API: {'OK' if endpoints_ok else 'FALHA'}")

    if config_ok and db_connected and models_validated and endpoints_ok:
        print("\n🎉 Verificação final concluída com sucesso! O backend parece estar funcional.")
    else:
        print("\n⚠️ A verificação final encontrou problemas. Por favor, revise o relatório acima.")

if __name__ == "__main__":
    # Adiciona o diretório raiz do backend ao sys.path para que os módulos possam ser importados
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    main()


