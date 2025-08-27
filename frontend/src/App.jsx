import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import EditaisList from './components/EditaisList';
import EditalDetail from './components/EditalDetail';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Details App
            </RouterLink>
          </Typography>
          {user ? (
            <>
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                Bem-vindo, {user.email}
              </Typography>
              <Button color="inherit" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Registrar
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ my: 2 }}>
          <Routes>
            <Route path="/" element={<EditaisList />} />
            <Route path="/editais/:id" element={<EditalDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Box>
      </Container>
    </>
  );
}

export default App;


