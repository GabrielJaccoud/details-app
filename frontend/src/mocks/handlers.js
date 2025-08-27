import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'https://8000-i83ezger1yrrrpsdax61j-e54c7ca7.manusvm.computer';

export const handlers = [
  http.post(`${API_BASE_URL}/token`, async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    if (username === 'test@example.com' && password === 'password123') {
      return HttpResponse.json({
        access_token: 'mock-access-token',
        token_type: 'bearer',
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  http.post(`${API_BASE_URL}/users/`, async ({ request }) => {
    const { nome, email, senha } = await request.json();

    if (email === 'test@example.com') {
      return new HttpResponse(null, { status: 400, statusText: 'Email já registrado' });
    }

    // Simula um registro bem-sucedido
    return HttpResponse.json({
      id: 99,
      nome: nome,
      email: email,
      criado_em: new Date().toISOString(),
    }, { status: 201 });
  }),

  http.get(`${API_BASE_URL}/users/me/`, () => {
    const token = localStorage.getItem('access_token');
    if (token === 'mock-access-token') {
      return HttpResponse.json({
        id: 1,
        nome: 'Mock User',
        email: 'test@example.com',
        criado_em: new Date().toISOString(),
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),
];


