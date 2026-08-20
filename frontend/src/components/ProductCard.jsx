import { Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80';
const TELEGRAM_URL = import.meta.env.VITE_TELEGRAM_URL?.trim() || 'https://t.me/';

export default function ProductCard({ item, type }) {
  const image = item?.image || item?.logo || FALLBACK_IMAGE;
  const title = item?.name || 'Untitled product';
  const openTelegram = () => window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer');

  return (
    <Card
      component="button"
      type="button"
      onClick={openTelegram}
      aria-label={`Contact us on Telegram about ${title}`}
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', textAlign: 'left', cursor: 'pointer', border: 0, padding: 0, backgroundColor: 'background.paper', transition: 'transform 160ms ease, box-shadow 160ms ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}
    >
      <CardMedia component="img" image={image} alt="" height="180" sx={{ objectFit: 'cover' }} />
      <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1.25 }}>
        {item?.badge ? <Chip label={item.badge} size="small" sx={{ alignSelf: 'flex-start' }} /> : null}
        <Typography variant="h6" component="h2" fontWeight={700}>{title}</Typography>
        <Typography color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 48 }}>
          {item?.description || 'Explore this item and see its details.'}
        </Typography>
      </CardContent>
    </Card>
  );
}
