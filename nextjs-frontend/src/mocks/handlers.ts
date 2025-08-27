import { http, HttpResponse } from 'msw';
import { mockEditais } from '@/services/mockData';

export const handlers = [
  // Autenticação
  http.post('https://8000-i83ezger1yrrrpsdax61j-e54c7ca7.manusvm.computer/token', async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    if (username === 'teste@example.com' && password === '123456') {
      return HttpResponse.json({
        access_token: 'mock_token_123456',
        token_type: 'bearer',
        user: {
          id: 1,
          nome: 'Usuário Teste',
          email: 'teste@example.com'
        }
      });
    }

    return new HttpResponse(
      JSON.stringify({ detail: 'Email ou senha incorretos' }),
      { status: 401 }
    );
  }),

  // Registro de usuário
  http.post('https://8000-i83ezger1yrrrpsdax61j-e54c7ca7.manusvm.computer/users/', async ({ request }) => {
    const user = await request.json();
    
    return HttpResponse.json({
      id: 999,
      nome: user.nome,
      email: user.email,
      created_at: new Date().toISOString()
    });
  }),

  // Obter usuário atual
  http.get('https://8000-i83ezger1yrrrpsdax61j-e54c7ca7.manusvm.computer/users/me/', () => {
    return HttpResponse.json({
      id: 1,
      nome: 'Usuário Teste',
      email: 'teste@example.com'
    });
  }),

  // Listar editais
  http.get('https://8000-i83ezger1yrrrpsdax61j-e54c7ca7.manusvm.computer/editais/', () => {
    return HttpResponse.json(mockEditais);
  }),

  // Obter edital por ID
  http.get('https://8000-i83ezger1yrrrpsdax61j-e54c7ca7.manusvm.computer/editais/:id', ({ params }) => {
    const { id } = params;
    const edital = mockEditais.find(e => e.id === Number(id));
    
    if (!edital) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(edital);
  })
];

