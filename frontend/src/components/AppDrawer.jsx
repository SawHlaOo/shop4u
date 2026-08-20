import { Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Login, Logout, Person, PersonAdd, VerifiedUser } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useApp } from '../appContext';

export default function AppDrawer() {
  const { openDrawer, setOpenDrawer, user, setUser } = useApp();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setOpenDrawer(false);
    navigate('/');
  };

  return (
    <Drawer open={Boolean(openDrawer)} onClose={() => setOpenDrawer(false)}>
      <List sx={{ width: 260 }}>
        <ListItemButton onClick={() => { setOpenDrawer(false); navigate('/', { state: { resetHome: true } }); }}>
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        {isAuthenticated ? (
          <ListItemButton onClick={() => { setOpenDrawer(false); navigate(`/profile/${user.id}`); }}>
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        ) : (
          <ListItemButton onClick={() => { setOpenDrawer(false); navigate('/login'); }}>
            <ListItemIcon><Login /></ListItemIcon>
            <ListItemText primary="Login" />
          </ListItemButton>
        )}
        {isAdmin ? (
          <ListItemButton onClick={() => { setOpenDrawer(false); navigate('/admin'); }}>
            <ListItemIcon><VerifiedUser /></ListItemIcon>
            <ListItemText primary="Admin" />
          </ListItemButton>
        ) : null}
        {!isAuthenticated ? (
          <ListItemButton onClick={() => { setOpenDrawer(false); navigate('/register'); }}>
            <ListItemIcon><PersonAdd /></ListItemIcon>
            <ListItemText primary="Register" />
          </ListItemButton>
        ) : null}
        <Divider />
        {isAuthenticated ? (
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        ) : null}
      </List>
    </Drawer>
  );
}
