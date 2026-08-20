import { Alert, Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { authApi } from '../api/authApi';
import { useApp } from '../appContext';

export default function Register() {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      const response = await authApi.register({ ...values, role: 'USER' });
      localStorage.setItem('token', response.token || '');
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Unable to create account');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>Create an account</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Join Digitalshop to grab the best offers.</Typography>
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField label="Name" autoComplete="name" fullWidth {...register('name', { required: 'Name is required' })} error={Boolean(errors.name)} helperText={errors.name?.message} />
              <TextField label="Username" autoComplete="username" fullWidth {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Username must be at least 3 characters' } })} error={Boolean(errors.username)} helperText={errors.username?.message} />
              <TextField label="Email" type="email" autoComplete="email" fullWidth {...register('email', { required: 'Email is required' })} error={Boolean(errors.email)} helperText={errors.email?.message} />
              <TextField label="Password" type="password" autoComplete="new-password" fullWidth {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} error={Boolean(errors.password)} helperText={errors.password?.message} />
              <Button type="submit" variant="contained" disabled={isSubmitting}>Create account</Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
