"use client";

import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

// Criando um tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inicializa o MSW apenas no ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      const initMocks = async () => {
        const { default: initMockWorker } = await import('@/mocks');
        await initMockWorker();
      };
      
      initMocks();
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

