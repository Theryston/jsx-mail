import axios from 'axios';
import { API_URL } from '../utils/cloud';
import { getToken } from './get-token';

const token = getToken();

const client = axios.create({
	baseURL: API_URL,
	headers: {
		Authorization: token ? `Bearer ${token}` : undefined,
	}
})

export default client