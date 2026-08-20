import { useQuery } from '@tanstack/react-query';
import { featureFlagApi } from '../api/featureFlagApi';

export function useFeatureFlag(key) {
  return useQuery({
    queryKey: ['feature-flags', key],
    queryFn: () => featureFlagApi.get(key),
    select: (response) => response?.data?.enabled ?? false,
    staleTime: 30_000,
  });
}
