import { useState } from 'react';
import { Box, Button, Card, CardContent, CardMedia, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch, TextField, Typography, Stack, Alert } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { featureFlagApi } from '../api/featureFlagApi';
import { productApi } from '../api/productApi';
import { authApi } from '../api/authApi';

const PRODUCT_TYPES = [
  { value: 'game', label: 'Game' },
  { value: 'app', label: 'App' },
  { value: 'powerpoint', label: 'Powerpoint' },
];

const PRODUCT_BADGES = [
  { value: '', label: 'No category' },
  { value: 'Popular', label: 'Popular' },
  { value: 'New arrivals', label: 'New arrivals' },
  { value: 'Promotions', label: 'Promotions' },
];

const emptyProductDraft = { type: 'game', name: '', description: '', image: '', logo: '', badge: '' };

export default function Admin() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [draft, setDraft] = useState({ key: '', enabled: false, description: '' });
  const [productDraft, setProductDraft] = useState(emptyProductDraft);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userDeleteId, setUserDeleteId] = useState('');

  const { data: flags = [], isLoading: flagsLoading, error: flagsError } = useQuery({
    queryKey: ['feature-flags-admin'],
    queryFn: () => featureFlagApi.list(),
    select: (response) => response?.data ?? []
  });

  const { data: games = [], isLoading: gamesLoading, error: gamesError } = useQuery({
    queryKey: ['games'],
    queryFn: () => productApi.listGames(),
    select: (response) => response?.data ?? []
  });
 
  const { data: apps = [], isLoading: appsLoading, error: appsError } = useQuery({
    queryKey: ['apps'],
    queryFn: () => productApi.listApps(),
    select: (response) => response?.data ?? []
  });
 
  const { data: powerpoints = [], isLoading: powerpointsLoading, error: powerpointsError } = useQuery({
    queryKey: ['powerpoints'],
    queryFn: () => productApi.listPowerpoints(),
    select: (response) => response?.data ?? []
  });
  
  
  const createMutation = useMutation({
    mutationFn: (payload) => featureFlagApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags-admin'] });
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      setOpen(false);
      setDraft({ key: '', enabled: false, description: '' });
    }
  });

  const productMutation = useMutation({
    mutationFn: (payload) => {
      if (payload.type === 'game') return productApi.createGame(payload);
      if (payload.type === 'app') return productApi.createApp(payload);
      if (payload.type === 'powerpoint') return productApi.createPowerpoint(payload);
      throw new Error('Unknown product type');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['powerpoints'] });
      setOpenProduct(false);
      setSelectedProduct(null);
      setProductDraft(emptyProductDraft);
    }
  });
 
  const productUpdateMutation = useMutation({
    mutationFn: ({ id, type, payload }) => {
      if (type === 'game') return productApi.updateGame(id, payload);
      if (type === 'app') return productApi.updateApp(id, payload);
      if (type === 'powerpoint') return productApi.updatePowerpoint(id, payload);
      throw new Error('Unknown product type');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['powerpoints'] });
      setOpenProduct(false);
      setSelectedProduct(null);
      setProductDraft(emptyProductDraft);
    }
  });
 
  const productDeleteMutation = useMutation({
    mutationFn: ({ id, type }) => {
      if (type === 'game') return productApi.deleteGame(id);
      if (type === 'app') return productApi.deleteApp(id);
      if (type === 'powerpoint') return productApi.deletePowerpoint(id);
      throw new Error('Unknown product type');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      queryClient.invalidateQueries({ queryKey: ['powerpoints'] });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => authApi.deleteUser(id),
    onSuccess: () => {
      setUserDeleteId('');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, payload }) => featureFlagApi.update(key, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags-admin'] });
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
    }
  });

  const removeMutation = useMutation({
    mutationFn: (key) => featureFlagApi.remove(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags-admin'] });
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
    }
  });

  const handleOpenProductModal = (product = null, type = 'game') => {
    if (product) {
      setSelectedProduct({ id: product.id, type });
      setProductDraft({
        type,
        name: product.name || '',
        description: product.description || '',
        image: product.image || '',
        logo: product.logo || '',
        badge: product.badge || '',
      });
    } else {
      setSelectedProduct(null);
      setProductDraft(emptyProductDraft);
    }
    setOpenProduct(true);
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
      productUpdateMutation.mutate({ id: selectedProduct.id, type: selectedProduct.type, payload: productDraft });
      return;
    }
    productMutation.mutate(productDraft);
  };

  const handleDeleteProduct = (id, type) => {
    productDeleteMutation.mutate({ id, type });
  };

  const handleDeleteUser = () => {
    if (!userDeleteId) return;
    deleteUserMutation.mutate(Number(userDeleteId));
  };
 
 
 
  const errorMessage =
    flagsError?.message ||
    gamesError?.message ||
    appsError?.message ||
    powerpointsError?.message ||
    createMutation.error?.message ||
    updateMutation.error?.message ||
    removeMutation.error?.message ||
    productMutation.error?.message ||
    productUpdateMutation.error?.message ||
    productDeleteMutation.error?.message ||
    deleteUserMutation.error?.message ||
    null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Admin dashboard</Typography>
          <Typography color="text.secondary">Manage feature flags, products, and admin tools.</Typography>
        </Box>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button variant="outlined" onClick={() => handleOpenProductModal(null, 'game')}>Create game</Button>
          <Button variant="outlined" onClick={() => handleOpenProductModal(null, 'app')}>Create app</Button>
          <Button variant="outlined" onClick={() => handleOpenProductModal(null, 'powerpoint')}>Create powerpoint</Button>
          <Button variant="contained" onClick={() => setOpen(true)}>Create flag</Button>
        </Stack>
      </Stack>

      {errorMessage ? <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert> : null}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Feature flags</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>Changes are saved to the server and visible to customers.</Typography>

        {flagsLoading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
        ) : (
          <Grid container spacing={2}>
            {flags.map((flag) => (
              <Grid item xs={12} md={6} key={flag.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Typography variant="h6">{flag.key}</Typography>
                      <Chip label={flag.enabled ? 'Enabled' : 'Disabled'} color={flag.enabled ? 'success' : 'default'} />
                    </Stack>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>{flag.description || 'No description provided.'}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={Boolean(flag.enabled)}
                            disabled={updateMutation.isPending}
                            onChange={() => updateMutation.mutate({ key: flag.key, payload: { enabled: !flag.enabled } })}
                          />
                        }
                        label="Enabled"
                      />
                      <Button size="small" variant="outlined" disabled={removeMutation.isPending} onClick={() => removeMutation.mutate(flag.key)}>Delete</Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
 
 
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>Product card management</Typography>
          <Typography color="text.secondary">Create, view, and update detailed product cards.</Typography>
        </Stack>
        {[ 
          { title: 'Games', items: games, loading: gamesLoading, type: 'game' },
          { title: 'Apps', items: apps, loading: appsLoading, type: 'app' },
          { title: 'Powerpoints', items: powerpoints, loading: powerpointsLoading, type: 'powerpoint' },
        ].map(({ title, items, loading, type }) => (
          <Box key={title} sx={{ mb: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>{title}</Typography>
              <Typography color="text.secondary">{items.length} cards</Typography>
            </Stack>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
            ) : (
              <Grid container spacing={2}>
                {items.map((item) => (
                  <Grid item xs={12} md={6} key={`${type}-${item.id}`}> 
                    <ProductAdminCard
                      item={item}
                      type={type}
                      onEdit={() => handleOpenProductModal(item, type)}
                      onDelete={() => handleDeleteProduct(item.id, type)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 4, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Debug / Admin user cleanup</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Enter a user ID to delete that account. This action is admin-only and useful for debugging.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="User ID"
            value={userDeleteId}
            onChange={(event) => setUserDeleteId(event.target.value)}
            type="number"
            sx={{ width: { xs: '100%', sm: 200 } }}
          />
          <Button
            variant="contained"
            color="error"
            disabled={!userDeleteId || deleteUserMutation.isPending}
            onClick={handleDeleteUser}
          >
            Delete user
          </Button>
        </Stack>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create feature flag</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Key" value={draft.key} onChange={(event) => setDraft({ ...draft, key: event.target.value })} />
            <TextField label="Description" multiline minRows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            <FormControlLabel control={<Switch checked={draft.enabled} onChange={() => setDraft({ ...draft, enabled: !draft.enabled })} />} label="Enabled" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => createMutation.mutate({ key: draft.key, description: draft.description, enabled: draft.enabled })}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openProduct} onClose={() => setOpenProduct(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedProduct ? 'Edit product card' : 'Create product card'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
           <FormControl fullWidth>
             <InputLabel id="product-type-label">Product type</InputLabel>
             <Select
               labelId="product-type-label"
               value={productDraft.type}
               label="Product type"
               onChange={(event) => setProductDraft({ ...productDraft, type: event.target.value })}
               disabled={Boolean(selectedProduct)}
             >
               {PRODUCT_TYPES.map((option) => (
                 <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
               ))}
             </Select>
           </FormControl>
           <TextField label="Name" value={productDraft.name} onChange={(event) => setProductDraft({ ...productDraft, name: event.target.value })} fullWidth />
            <TextField label="Description" multiline minRows={3} value={productDraft.description} onChange={(event) => setProductDraft({ ...productDraft, description: event.target.value })} fullWidth />
            <TextField label="Image URL" value={productDraft.image} onChange={(event) => setProductDraft({ ...productDraft, image: event.target.value })} fullWidth />
            <TextField label="Logo URL" value={productDraft.logo} onChange={(event) => setProductDraft({ ...productDraft, logo: event.target.value })} fullWidth />
            <FormControl fullWidth>
              <InputLabel id="product-badge-label">Category</InputLabel>
              <Select
                labelId="product-badge-label"
                value={productDraft.badge}
                label="Category"
                onChange={(event) => setProductDraft({ ...productDraft, badge: event.target.value })}
              >
                {PRODUCT_BADGES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProduct(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProduct}>{selectedProduct ? 'Update' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function ProductAdminCard({ item, type, onEdit, onDelete }) {
  const [imageSrc, setImageSrc] = useState(item.image || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80');

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="180"
        image={imageSrc}
        alt={item.name}
        onError={() => setImageSrc('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80')}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{item.name}</Typography>
            <Chip label={item.badge || 'Featured'} size="small" />
          </Stack>
 
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
            {item.logo ? (
              <Box component="img" src={item.logo} alt={`${item.name} logo`} sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }} />
            ) : null}
            <Typography variant="caption" color="text.secondary">Type: {type}</Typography>
          </Stack>
  
          <Typography color="text.secondary" sx={{ mb: 1 }}>{item.description || 'No description available.'}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>ID: {item.id}</Typography>
        </Stack>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={onEdit}>Edit</Button>
          <Button size="small" color="error" variant="outlined" onClick={onDelete}>Delete</Button>
        </Stack>
      </Box>
    </Card>
  );
}
 
