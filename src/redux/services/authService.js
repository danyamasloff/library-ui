import api from '@utils/api';
import { API_ENDPOINTS, STORAGE_KEYS } from '@utils/constants';

// Хелперы для логирования
const logInfo = (message) => console.log(`[Auth] ${message}`);
const logError = (message, error) => console.error(`[Auth] ${message}`, error);

// Сервис для работы с аутентификацией
const authService = {
    // Регистрация пользователя
    register: async (userData) => {
        try {
            logInfo(`Отправляем запрос на регистрацию: ${userData.email}`);

            // Отправка запроса на регистрацию
            const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, null, {
                params: {
                    firstName: userData.firstName,
                    secondName: userData.secondName,
                    thirdName: userData.thirdName || '',
                    birthDate: userData.birthDate || null,
                    email: userData.email,
                    password: userData.password,
                },
            });

            logInfo(`Ответ сервера на регистрацию: ${JSON.stringify(response.data)}`);

            return {
                success: true,
                email: userData.email,
                message: 'Регистрация успешна. Для входа необходимо получить код подтверждения.',
                ...response.data
            };
        } catch (error) {
            logError('Ошибка при регистрации:', error);
            throw error;
        }
    },

    // Вход пользователя
    login: async (userData) => {
        try {
            logInfo(`Отправляем запрос на вход: ${userData.email}`);

            // Отправляем запрос с параметрами в query string
            const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, null, {
                params: {
                    email: userData.email,
                    password: userData.password,
                    entryCode: userData.entryCode,
                },
            });

            logInfo(`Успешный вход: статус ${response.status}`);

            // Извлекаем токен из ответа
            let token = null;
            let user = null;

            // Обрабатываем разные форматы ответа
            if (response.data) {
                if (typeof response.data === 'string' && response.data.startsWith('eyJ')) {
                    token = response.data;
                    user = { email: userData.email };
                } else if (typeof response.data === 'object') {
                    if (response.data.token) {
                        token = response.data.token;
                        user = response.data.user || response.data;
                    } else if (response.data.data && response.data.data.token) {
                        token = response.data.data.token;
                        user = response.data.data.user || response.data.data;
                    }

                    if (!user && response.data) {
                        if (response.data.userId || response.data.email) {
                            user = response.data;
                        } else if (response.data.user) {
                            user = response.data.user;
                        }
                    }
                }
            }

            // Проверяем заголовки на наличие токена, если он не найден в ответе
            if (!token && response.headers) {
                if (response.headers.authorization) {
                    token = response.headers.authorization.replace('Bearer ', '');
                } else if (response.headers['x-auth-token']) {
                    token = response.headers['x-auth-token'];
                }
            }

            // Проверяем наличие токена
            if (!token) {
                throw new Error('Сервер не вернул токен авторизации');
            }

            // Сохраняем данные пользователя
            localStorage.setItem(STORAGE_KEYS.TOKEN, token);

            if (user) {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            }

            return {
                token,
                user,
                isAuthenticated: true,
            };
        } catch (error) {
            logError('Ошибка при входе:', error);
            throw error;
        }
    },

    // Получение кода подтверждения
    getVerificationCode: async (email) => {
        try {
            logInfo(`Запрашиваем код подтверждения для: ${email}`);

            // Отправляем запрос на получение кода подтверждения
            const response = await api.post(API_ENDPOINTS.AUTH.GET_CODE, null, {
                params: { email },
            });

            logInfo(`Код подтверждения отправлен успешно`);

            return {
                success: true,
                message: 'Код подтверждения отправлен на ваш email',
                ...response.data
            };
        } catch (error) {
            logError('Ошибка при получении кода:', error);
            throw error;
        }
    },

    // Получение данных пользователя
    getUserProfile: async (userId) => {
        try {
            logInfo(`Запрашиваем профиль пользователя: ${userId}`);

            const response = await api.get(API_ENDPOINTS.USERS.GET_BY_ID(userId));
            logInfo(`Получен профиль пользователя`);

            return response.data.data || response.data;
        } catch (error) {
            logError('Ошибка при получении профиля:', error);
            throw error;
        }
    },

    // Проверка статуса аутентификации
    checkAuthStatus: async () => {
        try {
            // Проверяем наличие токена
            const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
            if (!token) {
                return { isAuthenticated: false };
            }

            // Пробуем запросить данные пользователя
            try {
                // Проверяем JWT токен
                const response = await api.get(API_ENDPOINTS.AUTH.CHECK_AUTH || '/auth/check', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                return {
                    isAuthenticated: true,
                    user: response.data.user || JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null')
                };
            } catch (error) {
                // Если 401 или 403, токен недействителен
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem(STORAGE_KEYS.TOKEN);
                    return { isAuthenticated: false };
                }

                // Для других ошибок считаем токен валидным (ошибка сети или другая проблема)
                const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
                return { isAuthenticated: !!user, user };
            }
        } catch (error) {
            logError('Ошибка при проверке токена:', error);
            return { isAuthenticated: false };
        }
    },

    // Получение токена из localStorage
    getToken: () => {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    // Выход
    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    }
};

export default authService;