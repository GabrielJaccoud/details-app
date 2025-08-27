# Details App - Frontend Next.js

Este é o frontend do projeto Details, desenvolvido com Next.js. O projeto tem como objetivo mapear, organizar e gerenciar editais de cultura, arte, esporte e leis de incentivo.

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Material UI
- React Hook Form com Zod
- MSW (Mock Service Worker) para desenvolvimento

## Estrutura do Projeto

- `/src/app`: Páginas e layout da aplicação
- `/src/components`: Componentes reutilizáveis
- `/src/context`: Contextos React, incluindo autenticação
- `/src/services`: Serviços para comunicação com a API
- `/src/mocks`: Configuração do Mock Service Worker para desenvolvimento

## Funcionalidades

- Listagem de editais
- Visualização detalhada de editais
- Autenticação de usuários (login/registro)
- Fallback para dados mockados quando a API não está disponível

## Desenvolvimento Local

1. Clone o repositório
2. Instale as dependências:
   ```bash
   cd nextjs-frontend
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:3000`

## Variáveis de Ambiente

- `.env.development`: Configurações para ambiente de desenvolvimento
- `.env.production`: Configurações para ambiente de produção (a ser criado)

## Deploy no Vercel

### Pré-requisitos

- Conta no Vercel
- CLI do Vercel instalada (opcional)

### Passos para Deploy

1. **Usando a Interface Web do Vercel**:
   - Faça login no [Vercel](https://vercel.com)
   - Clique em "New Project"
   - Importe o repositório do GitHub
   - Configure as variáveis de ambiente necessárias
   - Clique em "Deploy"

2. **Usando a CLI do Vercel**:
   ```bash
   # Instalar a CLI do Vercel (se ainda não estiver instalada)
   npm install -g vercel

   # Login na sua conta Vercel
   vercel login

   # Deploy do projeto
   cd nextjs-frontend
   vercel
   ```

3. **Configurações Recomendadas**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

## Integração com o Backend

O frontend está configurado para se comunicar com o backend na URL:
`https://8000-i83ezger1yrrrpsdax61j-e54c7ca7.manusvm.computer`

Para alterar a URL da API em produção, modifique o arquivo `/src/services/mockData.ts` e `/src/context/AuthContext.tsx`.

## Testes

Para executar os testes:
```bash
npm test
```

## Licença

Este projeto está licenciado sob a licença MIT.



Este é um teste de CI/CD para o projeto Details App.

