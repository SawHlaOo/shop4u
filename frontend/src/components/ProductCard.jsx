import { Button, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80';
const TELEGRAM_URL = import.meta.env.VITE_TELEGRAM_URL?.trim() || 'https://t.me/';

export default function ProductCard({ item, type }) {
  const image = item?.image || item?.logo || FALLBACK_IMAGE;
  const title = item?.name || 'Untitled product';

  return (
    <Card
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', textAlign: 'left', backgroundColor: 'background.paper' }}
    >
      <CardMedia component="img" image={image} alt="" height="180" sx={{ objectFit: 'cover' }} />
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1.25 }}>
        {item?.badge ? <Chip label={item.badge} size="small" sx={{ alignSelf: 'flex-start' }} /> : null}
        <Typography variant="h6" component="h2" fontWeight={700}>{title}</Typography>
        <Typography color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 48 }}>
          {item?.description || 'Explore this item and see its details.'}
        </Typography>
        <Button component="a" href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" variant="contained" sx={{ alignSelf: 'flex-start', mt: 'auto' }}>
          Go Telegram to buy
        </Button>
      </CardContent>
    </Card>
  );
}
