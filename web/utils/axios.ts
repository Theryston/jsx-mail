import Axios from 'axios';

const axios = Axios.create({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axios.interceptors.request.use((request) => {
  const token = localStorage.getItem('token');
  const forceAuth = request.headers['Force-Auth'] === 'true';

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
    if (error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/cloud/sign-in';
      return;
    }

    const errorData = error.response?.data ? error.response.data : error;
    throw errorData;
  },
);

export default axios;
