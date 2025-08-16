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

