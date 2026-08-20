import { Box } from '@mui/material';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

export default function FeatureFlagGate({ flag, children, fallback = null }) {
  const { data: enabled = false } = useFeatureFlag(flag);
  if (!enabled) {
    return fallback;
  }
  return <Box>{children}</Box>;
}
