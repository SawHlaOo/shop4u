import { AppBar, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { DarkMode, LightMode, Menu as MenuIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router';
import { useApp } from '../appContext';

export default function Header() {
  const { mode, setMode, setOpenDrawer, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 1 }}>
        <IconButton color="inherit" onClick={() => setOpenDrawer(true)} sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>
        <Typography component="button" type="button" variant="h6" onClick={() => navigate('/')} sx={{ flexGrow: 1, cursor: 'pointer', textAlign: 'left', border: 0, bgcolor: 'transparent', color: 'inherit', font: 'inherit' }}>
          ShopInMgSaw
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {user ? (
            <Button color="inherit" onClick={() => navigate(`/profile/${user.id}`)}>Profile</Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
          {isAdmin && location.pathname !== '/admin' ? (
            <Button color="inherit" onClick={() => navigate('/admin')}>Admin</Button>
          ) : null}
          <IconButton color="inherit" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
