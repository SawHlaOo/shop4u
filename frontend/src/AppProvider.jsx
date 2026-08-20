import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './AppRouter';
import { authApi } from './api/authApi';
import { AppContext, queryClient } from './appContext';

export default function AppProvider() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState('light');
  const [user, setUser] = useState(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const theme = useMemo(() => createTheme({
    palette: mode === 'dark' ? {
      mode,
      primary: { main: '#60a5fa' },
      background: { default: '#0b1220', paper: '#121c2e' },
      text: { primary: '#f8fafc', secondary: '#b8c4d6' },
      divider: 'rgba(148, 163, 184, 0.2)',
    } : {
      mode,
      primary: { main: '#2563eb' },
      background: { default: '#f8fafc', paper: '#ffffff' },
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: 'Roboto, Arial, sans-serif' },
  }), [mode]);

  const syncUser = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await authApi.verify();
      const nextUser = response?.user ?? response;
      setUser(nextUser ?? null);
      if (nextUser) {
        localStorage.setItem('user', JSON.stringify(nextUser));
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem('user');
      try {
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        localStorage.removeItem('user');
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void syncUser();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [syncUser]);

  return (
    <AppContext.Provider value={{ mode, setMode, openDrawer, setOpenDrawer, user, setUser, syncUser }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRouter />
        </ThemeProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
