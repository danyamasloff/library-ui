import axios from 'axios';
import { API_URL, STORAGE_KEYS } from './constants';

// Создаем axios instance с базовым URL
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000
});

// Добавляем авторизационный заголовок к запросам если токен существует
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

        if (token) {
            // Проверяем, не добавлен ли уже заголовок Authorization
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // Добавляем логирование запросов в режиме разработки
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
                params: config.params,
                headers: {
                    ...config.headers,
                    Authorization: config.headers.Authorization ? 'Bearer ***' : undefined
                }
            });
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Обработка ответов
api.interceptors.response.use(
    (response) => {
        // Логирование успешных ответов
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API Response] ${response.config.url}`, {
                status: response.status,
                data: response.data
            });
        }
        return response;
    },
    (error) => {
        // Логирование ошибок
        if (process.env.NODE_ENV === 'development') {
            console.error(`[API Error] ${error.config?.url}`, {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
        }

        // Обработка 401 Unauthorized - редирект на логин
        if (error.response?.status === 401) {
            console.log('Ошибка авторизации 401, перенаправление на страницу входа');
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);

            // Проверяем, что мы не уже на странице логина, чтобы избежать цикла редиректа
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        // Для 403 Forbidden делаем повторную попытку с обновленным токеном (если есть)
        if (error.response?.status === 403) {
            console.log('Получен 403 Forbidden, возможна проблема с токеном');

            // Можно добавить логику обновления токена здесь, если API поддерживает refresh
            // Например, вызов refreshToken() и повторная попытка
        }

        return Promise.reject(error);
    }
);

export default api;