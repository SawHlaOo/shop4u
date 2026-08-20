import { ArrowForward } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80';

export default function ProductCard({ item, type }) {
  const navigate = useNavigate();
  const image = item?.image || item?.logo || FALLBACK_IMAGE;
  const title = item?.name || 'Untitled product';

  return (
    <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 160ms ease, box-shadow 160ms ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
      <CardMedia component="img" image={image} alt="" height="180" sx={{ objectFit: 'cover' }} />
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1.25 }}>
        {item?.badge ? <Chip label={item.badge} size="small" sx={{ alignSelf: 'flex-start' }} /> : null}
        <Typography variant="h6" component="h2" fontWeight={700}>{title}</Typography>
        <Typography color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 48 }}>
          {item?.description || 'Explore this item and see its details.'}
        </Typography>
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Button endIcon={<ArrowForward />} onClick={() => navigate(`/product/${type}/${item.id}`)}>View details</Button>
        </Box>
      </CardContent>
    </Card>
  );
}
