"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { AppBar as MuiAppBar, Toolbar, Typography, Button } from '@mui/material';

export function AppBar() {
  const { user, logout } = useAuth();

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Details App
          </Link>
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
            <Button color="inherit" component={Link} href="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} href="/register">
              Registrar
            </Button>
          </>
        )}
      </Toolbar>
    </MuiAppBar>
  );
}

