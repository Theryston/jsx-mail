import client from './client';
import { getToken } from './get-token';
import { setToken } from './set-token';

export async function logout() {
  const token = getToken();
  if (!token) return;

  try {
    await client.delete('/session');
  } catch (error) {
    // do nothing
  }

  setToken('');
}
