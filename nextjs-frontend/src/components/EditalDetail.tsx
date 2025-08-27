"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Container, Typography, Box, CircularProgress, Alert,
  Card, CardContent, CardActions, Button, Chip
} from '@mui/material';
import { getEditalById, Edital } from '@/services/mockData';

interface EditalDetailProps {
  id: string;
}

type StatusColor = 'success' | 'warning' | 'error' | 'default';

export function EditalDetail({ id }: EditalDetailProps) {
  const [edital, setEdital] = useState<Edital | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEdital = async () => {
      try {
        const data = await getEditalById(id);
        setEdital(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchEdital();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Erro ao carregar detalhes do edital: {error}
      </Alert>
    );
  }

  if (!edital) {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        Edital não encontrado.
      </Alert>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string): StatusColor => {
    switch (status) {
      case 'ABERTO':
        return 'success';
      case 'ENCERRANDO_BREVE':
        return 'warning';
      case 'ENCERRADO':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Button component={Link} href="/" variant="outlined">
          Voltar para lista
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              {edital.titulo}
            </Typography>
            <Chip 
              label={edital.status} 
              color={getStatusColor(edital.status)}
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          <Typography variant="body1" paragraph>
            {edital.descricao}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Origem:
                </Typography>
                <Typography variant="body1">
                  {edital.origem}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Valor Disponível:
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(edital.valor_disponivel)}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Data de Publicação:
                </Typography>
                <Typography variant="body1">
                  {formatDate(edital.data_publicacao)}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Prazo de Inscrição:
                </Typography>
                <Typography variant="body1">
                  {formatDate(edital.prazo_inscricao)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          <Button 
            variant="contained" 
            color="primary" 
            href={edital.url} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Acessar Edital Original
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}

