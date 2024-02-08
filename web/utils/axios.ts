import Axios from 'axios';

const axios = Axios.create({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axios.interceptors.request.use((request) => {
  const token =
    request.headers['Session-Token'] ||
    document.cookie
      ?.split(';')
      .find((c) => c.trim().startsWith('token='))
      ?.split('=')[1];
  delete request.headers['Session-Token'];

  const forceAuth = request.headers['Force-Auth'] === 'true';
  delete request.headers['Force-Auth'];

  if (!token && forceAuth) {
    window.location.href = '/cloud/sign-in';
    throw new Error('Unauthorized');
  }

  if (!token) {
    return request;
  }

  request.headers['Authorization'] = `Bearer ${token}`;
  return request;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 403 && typeof window !== 'undefined') {
      document.cookie = 'token=; path=/; max-age=0';
      document.cookie = 'sessionId=; path=/; max-age=0';
      window.location.href = '/cloud/sign-in';
      return;
    }

    const errorData = error.response?.data ? error.response.data : error;
    throw errorData;
  },
);

export default axios;
