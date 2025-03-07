import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((request) => {
  let token: string | undefined = '';

  if (typeof window !== 'undefined') {
    token = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('token='))
      ?.split('=')[1];
  } else {
    const { cookies } = require('next/headers');
    token = cookies().get('token')?.value;
  }

  if (!token) {
    return request;
  }

  request.headers['Authorization'] = `Bearer ${token}`;
  return request;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 403 && typeof window !== 'undefined') {
      document.cookie = 'token=; path=/; max-age=0';
      document.cookie = 'sessionId=; path=/; max-age=0';
      window.location.href = '/sign-in';
    }

    const errorData = error.response?.data ? error.response.data : error;
    throw errorData;
  },
);

export default api;
