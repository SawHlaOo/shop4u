import { Alert, Box, CircularProgress, Container, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import ProductCard from '../components/ProductCard';

function CatalogSection({ title, type, items, isLoading, search }) {
  const visibleItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? items.filter((item) => item.name?.toLowerCase().includes(term)) : items;
  }, [items, search]);

  return (
    <Box component="section" sx={{ mt: 5 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>{title}</Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}><CircularProgress aria-label={`Loading ${title}`} /></Box>
      ) : (
        <Grid container spacing={3} alignItems="stretch">
          {visibleItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={`${type}-${item.id}`} sx={{ display: 'flex' }}>
              <ProductCard type={type} item={item} />
            </Grid>
          ))}
          {!visibleItems.length ? <Grid item xs={12}><Alert severity="info">No {title.toLowerCase()} match your search.</Alert></Grid> : null}
        </Grid>
      )}
    </Box>
  );
}

export default function Home() {
  const [search, setSearch] = useState('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const games = useQuery({ queryKey: ['games'], queryFn: productApi.listGames, select: (response) => response?.data ?? [] });
  const apps = useQuery({ queryKey: ['apps'], queryFn: productApi.listApps, select: (response) => response?.data ?? [] });
  const powerpoints = useQuery({ queryKey: ['powerpoints'], queryFn: productApi.listPowerpoints, select: (response) => response?.data ?? [] });
  const error = games.error || apps.error || powerpoints.error;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, border: '1px solid', borderColor: 'divider', background: isDarkMode ? 'linear-gradient(135deg, #172554, #1e293b)' : 'linear-gradient(135deg, #eff6ff, #f5f3ff)', color: isDarkMode ? '#f8fafc' : 'text.primary' }}>
        <Stack spacing={2} maxWidth={720}>
          <Typography component="h1" variant="h3" fontWeight={800}>hey! discover your needs </Typography>
          <Typography sx={{ color: isDarkMode ? '#dbeafe' : 'text.secondary' }}>We sell games, apps, and presentation templates based on trust and quality.</Typography>
          <TextField label="Search here" value={search} onChange={(event) => setSearch(event.target.value)} fullWidth inputProps={{ 'aria-label': 'Search here' }} sx={isDarkMode ? { '& .MuiInputLabel-root': { color: '#dbeafe' }, '& .MuiInputLabel-root.Mui-focused': { color: '#93c5fd' }, '& .MuiOutlinedInput-root': { color: '#f8fafc', '& fieldset': { borderColor: 'rgba(219, 234, 254, 0.45)' }, '&:hover fieldset': { borderColor: '#bfdbfe' }, '&.Mui-focused fieldset': { borderColor: '#93c5fd' } } } : undefined} />
        </Stack>
      </Paper>

      {error ? <Alert severity="error" sx={{ mt: 3 }}>{error.message || 'Unable to load the catalog right now. Please try again shortly.'}</Alert> : null}
      <CatalogSection title="Games" type="game" items={games.data || []} isLoading={games.isLoading} search={search} />
      <CatalogSection title="Apps" type="app" items={apps.data || []} isLoading={apps.isLoading} search={search} />
      <CatalogSection title="Presentation templates" type="powerpoint" items={powerpoints.data || []} isLoading={powerpoints.isLoading} search={search} />
    </Container>
  );
}
