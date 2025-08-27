"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Container, Typography, Box, CircularProgress, Alert,
  List, ListItem, ListItemText, ListItemButton, Divider
} from '@mui/material';
import { getEditais, Edital } from '@/services/mockData';

export function EditaisList() {
  const [editais, setEditais] = useState<Edital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEditais = async () => {
      try {
        const data = await getEditais();
        setEditais(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchEditais();
  }, []);

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
        Erro ao carregar editais: {error}
      </Alert>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Editais Disponíveis
      </Typography>
      {editais.length === 0 ? (
        <Typography variant="body1">Nenhum edital encontrado.</Typography>
      ) : (
        <List>
          {editais.map((edital) => (
            <React.Fragment key={edital.id}>
              <ListItem disablePadding>
                <ListItemButton component={Link} href={`/editais/${edital.id}`}>
                  <ListItemText
                    primary={edital.titulo}
                    secondary={
                      <>
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Origem: {edital.origem}
                        </Typography>
                        {" — Prazo: "}
                        {new Date(edital.prazo_inscricao).toLocaleDateString()}
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
}

