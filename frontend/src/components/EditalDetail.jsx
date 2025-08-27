import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Typography, Box, CircularProgress, Alert,
  Paper, Chip, Stack, Link as MuiLink
} from '@mui/material';
import { getEditalById } from '../services/mockData';

function EditalDetail() {
  const { id } = useParams();
  const [edital, setEdital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEdital = async () => {
      try {
        const data = await getEditalById(id);
        setEdital(data);
      } catch (e) {
        setError(e.message);
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
      <Alert severity="info" sx={{ mt: 4 }}>
        Edital não encontrado.
      </Alert>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {edital.titulo}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label={`Origem: ${edital.origem}`} color="primary" />
          <Chip label={`Status: ${edital.status}`} color="info" />
          {edital.valor_disponivel && (
            <Chip label={`Valor: R$ ${edital.valor_disponivel.toLocaleString('pt-BR')}`} color="success" />
          )}
        </Stack>
        <Typography variant="body1" paragraph>
          **Descrição:** {edital.descricao || 'N/A'}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          **Prazo de Inscrição:** {new Date(edital.prazo_inscricao).toLocaleDateString()} às {new Date(edital.prazo_inscricao).toLocaleTimeString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          **Data de Publicação:** {new Date(edital.data_publicacao).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          **Público Alvo:** {edital.publico_alvo || 'N/A'}
        </Typography>
        {edital.url && (
          <Typography variant="body2" color="text.secondary">
            <MuiLink href={edital.url} target="_blank" rel="noopener" sx={{ mt: 2 }}>
              Ver Edital Completo
            </MuiLink>
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default EditalDetail;


