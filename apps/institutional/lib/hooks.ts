import { useQuery } from '@tanstack/react-query';
import { fetchPricing } from './fetchers';

export const usePricing = () => {
  return useQuery({
    queryKey: ['pricing'],
    queryFn: fetchPricing,
  });
};
