import axios from 'axios';
import { API_URL, API_ENDPOINTS, STORAGE_KEYS } from '../../utils/constants';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // увеличиваем таймаут до 10 секунд
});

// Add token to requests if it exists
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

// Register user
const register = async (userData) => {
    try {
        console.log('Отправляем запрос на регистрацию:', {
            ...userData,
            password: '***скрыто***'
        });

        // Проверка доступности email
        const checkEmailResponse = await api.get(API_ENDPOINTS.AUTH.CHECK_EMAIL, {
            params: { email: userData.email }
        });

        if (!checkEmailResponse.data.available) {
            throw new Error('Пользователь с таким email уже существует');
        }

        // Отправка запроса на регистрацию с Query Parameters
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

        console.log('Ответ сервера на регистрацию:', response.data);

        return {
            success: true,
            email: userData.email,
            message: 'Регистрация успешна. Для входа необходимо получить код подтверждения.',
            ...response.data
        };
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        throw error.response?.data || error.message || 'Ошибка при регистрации';
    }
};

// Login user
const login = async (userData) => {
    try {
        console.log('Отправляем запрос на вход:', {
            email: userData.email,
            entryCode: userData.entryCode,
            password: '***скрыто***'
        });

        // Пробуем отправить запрос на вход с Query Parameters
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, null, {
            params: {
                email: userData.email,
                password: userData.password,
                entryCode: userData.entryCode,
            },
        });

        console.log('Ответ сервера на вход:', response.data);

        // Если статус 202 (ACCEPTED) - считаем это успехом, даже если нет токена
        if (response.status === 202 || response.data.statusCodeValue === 202) {
            console.log('Получен успешный ответ с кодом 202');

            // Генерируем временный токен на основе данных пользователя
            // Это временное решение, пока на сервере не будет реализована выдача настоящих токенов
            const tempToken = btoa(`${userData.email}:${new Date().getTime()}`);
            localStorage.setItem(STORAGE_KEYS.TOKEN, tempToken);

            // Извлекаем данные пользователя из тела ответа
            let user = null;
            if (response.data.body) {
                user = response.data.body;
            } else if (typeof response.data === 'object') {
                user = response.data;
            }

            if (user) {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            }

            return {
                token: tempToken,
                user: user,
                isAuthenticated: true,
            };
        }

        // Если у нас стандартный ответ с токеном
        if (response.data && response.status === 200) {
            // Проверка структуры ответа
            let userData = response.data;
            let token = null;

            // Находим токен в ответе
            if (response.data.data && response.data.data.token) {
                token = response.data.data.token;
                userData = response.data.data.user || response.data.data;
            } else if (response.data.token) {
                token = response.data.token;
                userData = response.data.user || response.data;
            } else if (response.headers && response.headers.authorization) {
                token = response.headers.authorization.replace('Bearer ', '');
            }

            // Если нашли токен, сохраняем его
            if (token) {
                localStorage.setItem(STORAGE_KEYS.TOKEN, token);

                // Сохраняем данные пользователя
                if (userData) {
                    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
                }

                return {
                    token,
                    user: userData,
                    isAuthenticated: true,
                };
            } else {
                console.warn('Токен не найден в ответе:', response.data);
            }
        }

        throw new Error('Формат ответа не соответствует ожидаемому');
    } catch (error) {
        console.error('Ошибка при входе:', error);

        // Подробная информация об ошибке
        if (error.response) {
            // Ответ получен, но со статусом ошибки
            if (error.response.status === 403) {
                throw new Error('Неверный код подтверждения. Запросите новый код.');
            } else if (error.response.data && typeof error.response.data === 'string') {
                throw new Error(error.response.data);
            } else if (error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error(`Ошибка сервера: ${error.response.status}`);
            }
        } else if (error.request) {
            // Запрос отправлен, но ответ не получен
            throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
        } else {
            // Другие ошибки
            throw error.message || 'Ошибка при входе в систему';
        }
    }
};

// Get verification code
const getVerificationCode = async (email) => {
    try {
        console.log('Запрашиваем код подтверждения для:', email);

        const response = await api.post(API_ENDPOINTS.AUTH.GET_CODE, null, {
            params: { email },
        });

        console.log('Ответ сервера на запрос кода:', response.data);

        return {
            success: true,
            message: 'Код подтверждения отправлен на ваш email',
            ...response.data
        };
    } catch (error) {
        console.error('Ошибка при получении кода:', error);

        if (error.response && error.response.data) {
            if (typeof error.response.data === 'string') {
                throw new Error(error.response.data);
            } else if (error.response.data.message) {
                throw new Error(error.response.data.message);
            }
        }

        throw error.message || 'Ошибка при получении кода подтверждения';
    }
};

// Получение данных пользователя
const getUserProfile = async (userId) => {
    try {
        console.log('Запрашиваем профиль пользователя:', userId);

        const response = await api.get(API_ENDPOINTS.USERS.GET_BY_ID(userId));
        console.log('Ответ сервера о профиле:', response.data);

        return response.data.data || response.data;
    } catch (error) {
        console.error('Ошибка при получении профиля:', error);
        throw error.response?.data?.message || error.message || 'Ошибка при получении данных пользователя';
    }
};

// Logout
const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
};

const authService = {
    register,
    login,
    getVerificationCode,
    getUserProfile,
    logout
};

export default authService;