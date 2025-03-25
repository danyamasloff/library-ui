import axios from 'axios';
import { API_URL, STORAGE_KEYS } from './constants';
import { store } from '../redux/store';
import { setAuthState, logout } from '../redux/slices/authSlice';

// Настройка дебаг режима
const DEBUG = process.env.NODE_ENV === 'development';

// Базовые настройки для axios
const api = axios.create({
    baseURL: API_URL,
    timeout: 15000, // Увеличиваем таймаут для медленных соединений
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
    }
});

// Интерцептор для логирования в режиме разработки
if (DEBUG) {
    api.interceptors.request.use(request => {
        console.log(`[Request] ${request.method?.toUpperCase()} ${request.url}`, {
            params: request.params,
            data: request.data
        });
        return request;
    });

    api.interceptors.response.use(response => {
        console.log(`[Response] ${response.config.url}`, {
            status: response.status,
            data: response.data
        });
        return response;
    }, error => {
        console.error(`[API Error] ${error?.config?.url || 'unknown'}`, {
            status: error?.response?.status,
            message: error?.message,
            data: error?.response?.data
        });
        return Promise.reject(error);
    });
}

// Добавляем токен авторизации к запросам, если он существует
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Обработка ошибок ответа
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Если нет подключения к сети или другая проблема без ответа
        if (!error.response) {
            console.error('Сетевая ошибка при обращении к API:', error.message);

            // Диспатчим кастомное событие для оповещения о проблемах с сетью
            window.dispatchEvent(new CustomEvent('api-network-error', {
                detail: { url: error.config?.url, message: error.message }
            }));

            return Promise.reject(error);
        }

        // Обработка 401 Unauthorized - токен истек или невалидный
        if (error.response.status === 401) {
            console.log('Ошибка авторизации 401:', error.response.data);

            // Если это не запрос на обновление токена и у нас нет пометки, что запрос уже повторялся
            if (!originalRequest._retry && originalRequest.url !== '/auth/refresh') {
                originalRequest._retry = true;

                try {
                    // Здесь можно добавить логику обновления токена через refresh token, если ваш API это поддерживает
                    // Например:
                    // const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                    // const response = await api.post('/auth/refresh', { refreshToken });
                    // const { token } = response.data;
                    // localStorage.setItem(STORAGE_KEYS.TOKEN, token);
                    // originalRequest.headers.Authorization = `Bearer ${token}`;
                    // return api(originalRequest);

                    // Если обновление токена не поддерживается, просто выходим
                    store.dispatch(logout());
                    window.dispatchEvent(new CustomEvent('auth-expired'));
                } catch (refreshError) {
                    console.error('Ошибка при обновлении токена:', refreshError);
                    store.dispatch(logout());
                    window.dispatchEvent(new CustomEvent('auth-expired'));
                }
            }

            // Выходим и перенаправляем на страницу входа
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register') {
                setTimeout(() => {
                    window.location.href = '/login';
                }, 100);
            }
        }

        // Обработка ошибки 403 Forbidden - недостаточно прав
        if (error.response.status === 403) {
            console.error('Доступ запрещен:', error.response.data);

            // Проверим состояние авторизации
            const authState = store.getState().auth;
            if (!authState.isAuthenticated && originalRequest.url.startsWith('/books')) {
                // Если запрос к книгам и пользователь не авторизован, можно попробовать перезагрузить страницу
                console.log('Пользователь не авторизован для доступа к API книг');
                window.dispatchEvent(new CustomEvent('access-denied', {
                    detail: { url: error.config?.url }
                }));
            }
        }

        return Promise.reject(error);
    }
);

export default api;