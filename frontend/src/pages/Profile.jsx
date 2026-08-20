import { Alert, Avatar, Box, Card, CardContent, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authApi.verify();
        setUser(response.user ?? response);
      } catch (err) {
        setError(err.message || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main' }}>{user?.name?.[0] || 'U'}</Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>{user?.name || 'Your profile'}</Typography>
              <Typography color="text.secondary">{user?.email || user?.username}</Typography>
              <Typography sx={{ mt: 1 }}>{user?.role || 'USER'}</Typography>
            </Box>
          </Stack>
          {error ? <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert> : null}
        </CardContent>
      </Card>
    </Container>
  );
}
