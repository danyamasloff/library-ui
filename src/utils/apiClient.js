import axios from 'axios';
import { API_URL, STORAGE_KEYS } from './constants';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
    },
    timeout: 10000
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`, config.params || {});
        return config;
    },
    (error) => {
        console.error('[Request Error]', error);
        return Promise.reject(error);
    }
);

// Add response logging
api.interceptors.response.use(
    (response) => {
        console.log(`[Response] ${response.status} ${response.config.url}`, response.data);
        return response;
    },
    (error) => {
        console.error(`[Response Error] ${error.config?.url || 'Unknown URL'}`, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;