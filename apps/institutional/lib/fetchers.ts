import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const fetchPricing = async () => {
  const { data } = await client.get('/user/price');
  return data;
};

export const createUtmOrView = async (body: any) => {
  const { data } = await client.post('/user/utm', body);
  return data;
};
