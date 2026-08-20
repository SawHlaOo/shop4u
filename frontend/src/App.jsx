import { Outlet } from 'react-router';
import { Container } from '@mui/material';
import Header from './components/Header';
import AppDrawer from './components/AppDrawer';

export default function App() {
  return (
    <>
      <Header />
      <AppDrawer />
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </>
  );
}
