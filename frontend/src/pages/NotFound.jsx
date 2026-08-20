import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router';

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box textAlign="center">
        <Typography variant="h1" fontWeight={800}>404</Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>This page seems to be missing.</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>The route you requested could not be found.</Typography>
        <Button component={Link} to="/" variant="contained">Go home</Button>
      </Box>
    </Container>
  );
}
