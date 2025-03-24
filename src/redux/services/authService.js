import axios from 'axios';
import { API_URL, API_ENDPOINTS, STORAGE_KEYS } from '../../utils/constants';

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

        // Отправляем запрос с параметрами в query string, а не в теле запроса
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, null, {
            params: {
                email: userData.email,
                password: userData.password,
                entryCode: userData.entryCode,
            },
        });

        console.log('Ответ сервера на вход:', response);

        // Если ответ пустой или содержит сообщение об ошибке
        if (response.status === 204 || (response.data && typeof response.data === 'string' && response.data.includes('not found'))) {
            throw new Error('Пользователь не найден или неверные учетные данные');
        }

        // Если статус 200 или 202, обрабатываем ответ
        if (response.status === 200 || response.status === 202) {
            // Если данные есть в ответе
            if (response.data) {
                let token = null;
                let user = null;

                // Определяем формат ответа
                if (typeof response.data === 'object') {
                    // Находим токен в ответе
                    if (response.data.token) {
                        token = response.data.token;
                        user = response.data.user || response.data;
                    } else if (response.data.data && response.data.data.token) {
                        token = response.data.data.token;
                        user = response.data.data.user || response.data.data;
                    } else if (response.headers && response.headers.authorization) {
                        token = response.headers.authorization.replace('Bearer ', '');
                        user = response.data;
                    }

                    // Если нет токена, создаем временный
                    if (!token) {
                        // Временное решение - генерируем токен на клиенте
                        token = btoa(`${userData.email}:${new Date().getTime()}`);
                        if (!user && typeof response.data === 'object') {
                            user = response.data;
                        }
                    }
                }

                // Если нашли токен, сохраняем его
                if (token) {
                    localStorage.setItem(STORAGE_KEYS.TOKEN, token);

                    // Сохраняем данные пользователя
                    if (user) {
                        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
                    }

                    return {
                        token,
                        user,
                        isAuthenticated: true,
                    };
                }
            }

            // Если данных в ответе нет, но статус успешный
            const tempToken = btoa(`${userData.email}:${new Date().getTime()}`);
            localStorage.setItem(STORAGE_KEYS.TOKEN, tempToken);

            // Создаем базовый объект пользователя
            const basicUser = {
                email: userData.email,
                // Добавьте другие необходимые поля
            };
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(basicUser));

            return {
                token: tempToken,
                user: basicUser,
                isAuthenticated: true,
            };
        }

        // Если не сработали предыдущие условия
        throw new Error('Неверный формат ответа от сервера');
    } catch (error) {
        console.error('Ошибка при входе:', error);

        // Более детальная обработка ошибок
        if (error.response) {
            // Обрабатываем различные сценарии ошибок от сервера
            const status = error.response.status;

            if (status === 401 || status === 403) {
                throw new Error('Неверные учетные данные или код подтверждения');
            } else if (status === 404) {
                throw new Error('Пользователь не найден');
            } else if (error.response.data) {
                if (typeof error.response.data === 'string') {
                    throw new Error(error.response.data);
                } else if (error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            }
        }

        throw error.message || 'Ошибка при входе в систему';
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