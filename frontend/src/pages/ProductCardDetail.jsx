import { useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Container, Stack, Typography, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80';

export default function ProductCardDetail() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', type, id],
    queryFn: () => {
      if (type === 'game') return productApi.getGame(id);
      if (type === 'app') return productApi.getApp(id);
      if (type === 'powerpoint') return productApi.getPowerpoint(id);
      throw new Error('Unknown product type');
    },
    select: (response) => response?.data ?? response ?? null,
    enabled: Boolean(type) && Boolean(id),
  });


  const defaultImage = useMemo(() => data?.image || FALLBACK_IMAGE, [data?.image]);
  const [failed, setFailed] = useState(false);
  const imageSrc = failed ? FALLBACK_IMAGE : defaultImage;

  if (isLoading) {
    return <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>;
  }

  if (error || !data) {
    return <Container maxWidth="md" sx={{ py: 6 }}><Alert severity="error">{error?.message || 'Product not found'}</Alert></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardMedia
          component="img"
          height="360"
          image={imageSrc}
          alt={data?.name}
          onError={() => setFailed(true)}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" fontWeight={700}>{data?.name}</Typography>
              <Chip label={data?.badge || 'Featured'} />
            </Box>
            <Button variant="outlined" size="small" onClick={() => navigate('/')}>Back to catalog</Button>
            <Typography color="text.secondary">{data?.description || 'A detailed view of this product.'}</Typography>
            <Typography variant="caption" color="text.secondary">{data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Recently added'}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

