import axios from 'axios';
import { API_URL, STORAGE_KEYS } from './constants';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
    baseURL: API_URL,
    timeout: 15000, // Увеличиваем таймаут для медленных соединений
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
    }
});

// Добавляем токен авторизации к запросам, если он существует
api.interceptors.request.use(
    (config) => {
        // Логируем запрос для отладки
        console.log('[Request]', config.method?.toUpperCase(), config.url, config.params || {});

        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('[Request Error]', error);
        return Promise.reject(error);
    }
);

// Обрабатываем ошибки ответа
api.interceptors.response.use(
    (response) => {
        // Логируем успешные ответы для отладки если нужно
        // console.log('[Response]', response.config.url, response.status);
        return response;
    },
    (error) => {
        // Логируем ошибку для отладки
        console.error(
            '[Response Error]',
            error.config?.url,
            error.message,
            error.response?.status
        );

        // Обрабатываем разные типы ошибок
        if (!error.response) {
            // Ошибки сети, таймауты, CORS и т.д.
            console.error('Сетевая ошибка при обращении к API:', error.message);

            // Диспатчим кастомное событие для оповещения о проблемах с сетью
            window.dispatchEvent(new CustomEvent('api-network-error', {
                detail: { url: error.config?.url, message: error.message }
            }));
        }
        else if (error.response.status === 401) {
            // Ошибка авторизации (истек токен и т.д.)
            console.error('Ошибка авторизации:', error.response.data);

            // Очищаем данные авторизации
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);

            // Перенаправляем на страницу входа, если пользователь уже не там
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register') {
                // Диспатчим событие для логаута
                window.dispatchEvent(new CustomEvent('auth-expired'));

                // Перенаправляем через небольшую задержку, чтобы компоненты успели отреагировать
                setTimeout(() => {
                    window.location.href = '/login';
                }, 100);
            }
        }
        else if (error.response.status === 403) {
            // Недостаточно прав
            console.error('Доступ запрещен:', error.response.data);

            // Диспатчим событие для оповещения о недостатке прав
            window.dispatchEvent(new CustomEvent('access-denied', {
                detail: { url: error.config?.url }
            }));
        }

        return Promise.reject(error);
    }
);

export default api;