import { Alert, Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { authApi } from '../api/authApi';
import { useApp } from '../appContext';

export default function Login() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      const response = await authApi.login(values);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setError(err.message || 'Unable to sign in');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>Welcome back</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Sign in to continue your shopping experience.</Typography>
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField label="Username" autoComplete="username" fullWidth {...register('username', { required: 'Username is required' })} error={Boolean(errors.username)} helperText={errors.username?.message} />
              <TextField label="Password" type="password" autoComplete="current-password" fullWidth {...register('password', { required: 'Password is required' })} error={Boolean(errors.password)} helperText={errors.password?.message} />
              <Button type="submit" variant="contained" disabled={isSubmitting}>Sign in</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
