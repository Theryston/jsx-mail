import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchPricing, createUtmOrView } from './fetchers';

export const usePricing = () => {
  return useQuery({
    queryKey: ['pricing'],
    queryFn: fetchPricing,
  });
};

export const useUtm = () => {
  return useMutation({
    mutationFn: createUtmOrView,
  });
};
