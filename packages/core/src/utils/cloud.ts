import axios from 'axios';

export const WEBSITE_URL = 'https://jsxmail.org';
export const API_URL = `${WEBSITE_URL}/api`;

export const cloudClient = axios.create({
	baseURL: API_URL,
});
