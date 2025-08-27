import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000"

def add_test_data():
    print("Adicionando dados de teste...")

    # 1. Criar um usuário de teste
    user_data = {
        "nome": "Teste User",
        "email": "test@example.com",
        "senha": "password123"
    }
    try:
        response = requests.post(f"{BASE_URL}/users/", json=user_data)
        response.raise_for_status()
        user = response.json()
        user_id = user["id"]
        print(f"Usuário de teste criado com ID: {user_id}")
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 400 and "Email já registrado" in e.response.text:
            print("Usuário de teste já existe. Buscando ID...")
            response = requests.get(f"{BASE_URL}/users/")
            response.raise_for_status()
            users = response.json()
            user_id = next((u["id"] for u in users if u["email"] == "test@example.com"), None)
            if user_id is None:
                print("Erro: Usuário de teste não encontrado após tentativa de criação.")
                return
            print(f"Usuário de teste encontrado com ID: {user_id}")
        else:
            print(f"Erro ao criar usuário de teste: {e}")
            return
    except Exception as e:
        print(f"Erro inesperado ao criar usuário: {e}")
        return

    # 2. Adicionar editais de teste
    editais_data = [
        {
            "titulo": "Edital de Inovação Cultural",
            "descricao": "Edital para projetos que promovam a inovação e a tecnologia na cultura.",
            "origem": "Ministério da Cultura",
            "prazo_inscricao": (datetime.now() + timedelta(days=60)).isoformat(),
            "valor_disponivel": 150000.00,
            "url": "https://cultura.gov.br/edital-inovacao",
            "status": "ABERTO",
            "data_publicacao": (datetime.now() - timedelta(days=30)).isoformat(),
            "publico_alvo": "Artistas, produtores, startups culturais"
        },
        {
            "titulo": "Fundo de Apoio ao Esporte Local",
            "descricao": "Apoio a iniciativas esportivas em comunidades de baixa renda.",
            "origem": "Secretaria de Esportes Municipal",
            "prazo_inscricao": (datetime.now() + timedelta(days=5)).isoformat(),
            "valor_disponivel": 75000.00,
            "url": "https://esportes.municipio.br/fundo-local",
            "status": "ENCERRANDO_BREVE",
            "data_publicacao": (datetime.now() - timedelta(days=45)).isoformat(),
            "publico_alvo": "Associações esportivas, ONGs"
        },
        {
            "titulo": "Concurso de Artes Visuais Novas Tendências",
            "descricao": "Concurso para artistas visuais emergentes com propostas inovadoras.",
            "origem": "Galeria de Arte Moderna",
            "prazo_inscricao": (datetime.now() + timedelta(days=120)).isoformat(),
            "valor_disponivel": 50000.00,
            "url": "https://galeria.arte.br/concurso-novas-tendencias",
            "status": "ABERTO",
            "data_publicacao": (datetime.now() - timedelta(days=10)).isoformat(),
            "publico_alvo": "Artistas visuais"
        }
    ]

    for edital_data in editais_data:
        try:
            # Verifica se o edital já existe pelo título para evitar duplicatas
            response = requests.get(f"{BASE_URL}/editais/")
            response.raise_for_status()
            existing_editais = response.json()
            if any(e["titulo"] == edital_data["titulo"] for e in existing_editais):
                print("Edital \"" + edital_data["titulo"] + "\" já existe. Pulando.")
                continue

            response = requests.post(f"{BASE_URL}/editais/?criador_id={user_id}", json=edital_data)
            response.raise_for_status()
            print("Edital \"" + edital_data["titulo"] + "\" adicionado com sucesso.")
        except Exception as e:
            print("Erro ao adicionar edital \"" + edital_data["titulo"] + "\": " + str(e))

    print("Dados de teste adicionados.")

if __name__ == "__main__":
    add_test_data()


