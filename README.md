# Details App

Este é o repositório do projeto Details, um aplicativo para mapear, organizar e gerenciar editais de cultura, arte, esporte e leis de incentivo.

## Tecnologias Utilizadas

### Backend
- Python 3.9+ (FastAPI)
- PostgreSQL + Redis (cache/filas)
- Docker + Docker Compose
- Testes: Pytest
- CI/CD: GitHub Actions

### Frontend (Painel Web)
- React + TypeScript + Vite
- UI: Material-UI
- Estado: Redux Toolkit
- Rotas: React Router

## Arquitetura do Sistema

O sistema é dividido em:
- `backend/`: Contém a API FastAPI, modelos de banco de dados, serviços e lógica de negócio.
- `frontend/`: Contém o painel web desenvolvido em React.
- `mobile/`: (Fase 2+) Aplicação mobile em React Native.
- `infrastructure/`: Arquivos de configuração para deploy (Docker, etc.).
- `docs/`: Documentação do projeto.
- `tests/`: Testes automatizados.

## Status do MVP

Esta é a primeira versão (MVP - Minimum Viable Product) do projeto, focada nas seguintes funcionalidades:
- Scraping de 3 fontes piloto de editais.
- Backend com CRUD de editais, documentos e alertas.
- Painel web com listagem, detalhes, upload de documentos e checklist.
- Notificações via e-mail.
- Banco de dados PostgreSQL.

## Instruções de Instalação e Execução

Detalhes sobre como instalar e executar o projeto serão adicionados aqui em breve.

## Contribuição

Informações sobre como contribuir para o projeto serão adicionadas em `CONTRIBUTING.md`.



## 🚧 Problemas Comuns no GitHub e Soluções

### Docker Compose não disponível no ambiente sandbox

**Sintoma**: `Cannot connect to the Docker daemon` ou limitações de ambiente

**Solução Automática**:
```bash
# Scripts adaptativos detectam o ambiente e configuram automaticamente
python backend/scripts/check_environment.py
python backend/scripts/init_database.py
python backend/scripts/run_app.py
```

### Estratégia de Fallback:
- **Desenvolvimento**: SQLite local (`details_local.db`)
- **GitHub**: SQLite em memória ou arquivo local
- **Produção**: PostgreSQL via Docker/externo

### Comandos Úteis:
```bash
# Verificar ambiente
python backend/scripts/check_environment.py

# Criar tabelas manualmente
python backend/scripts/init_database.py

# Iniciar aplicação com configuração adaptativa
python backend/scripts/run_app.py

# Gerar migrações offline (quando Docker disponível)
alembic revision --autogenerate -m "migracao"
```


