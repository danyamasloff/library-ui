import api from '../../utils/api';
import { API_URL, API_ENDPOINTS, STORAGE_KEYS } from '../../utils/constants';

// Хелперы для логирования
const logInfo = (message) => console.log(`[Auth] ${message}`);
const logError = (message, error) => console.error(`[Auth] ${message}`, error);

// Регистрация пользователя
const register = async (userData) => {
    try {
        logInfo(`Отправляем запрос на регистрацию: ${userData.email}`);

        // Проверка доступности email
        try {
            const checkEmailResponse = await api.get(API_ENDPOINTS.AUTH.CHECK_EMAIL, {
                params: { email: userData.email }
            });

            if (checkEmailResponse.data && !checkEmailResponse.data.available) {
                throw new Error('Пользователь с таким email уже существует');
            }
        } catch (emailCheckError) {
            // Если сервер не поддерживает проверку email, продолжаем с регистрацией
            if (emailCheckError.response && emailCheckError.response.status !== 404) {
                throw emailCheckError;
            }
        }

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

        // Обработка разных типов ошибок
        if (error.response) {
            // Есть ответ от сервера с ошибкой
            const data = error.response.data;

            if (typeof data === 'string') {
                throw new Error(data);
            } else if (data && data.message) {
                throw new Error(data.message);
            } else if (error.response.status === 409) {
                throw new Error('Пользователь с таким email уже существует');
            } else {
                throw new Error(`Ошибка при регистрации: ${error.response.status}`);
            }
        }

        // Нет ответа от сервера (сетевая ошибка)
        throw new Error(error.message || 'Ошибка при регистрации. Проверьте подключение к интернету.');
    }
};

// Login
const login = async (userData) => {
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
        console.log('Полный ответ от сервера:', response);

        // Проверяем корректность ответа
        if (response.status === 204 ||
            (response.data && typeof response.data === 'string' && response.data.includes('not found'))) {
            throw new Error('Пользователь не найден или неверные учетные данные');
        }

        // Обрабатываем успешный ответ
        let token = null;
        let user = null;

        // Определяем формат ответа
        if (response.data) {
            console.log('Тип response.data:', typeof response.data);
            console.log('Содержимое response.data:', response.data);

            // Особый случай: прямая строка JWT
            if (typeof response.data === 'string' && response.data.startsWith('eyJ')) {
                token = response.data;
                user = { email: userData.email }; // Базовый объект пользователя
                logInfo('Токен получен напрямую как строка');
            }
            // Объект с данными
            else if (typeof response.data === 'object') {
                // Находим токен в ответе
                if (response.data.token) {
                    token = response.data.token;
                    user = response.data.user || response.data;
                    logInfo('Токен получен из response.data.token');
                } else if (response.data.data && response.data.data.token) {
                    token = response.data.data.token;
                    user = response.data.data.user || response.data.data;
                    logInfo('Токен получен из response.data.data.token');
                } else {
                    // Возможно, сервер вернул просто JWT токен как строку в поле ответа
                    const keys = Object.keys(response.data);
                    for (const key of keys) {
                        if (typeof response.data[key] === 'string' && response.data[key].startsWith('eyJ')) {
                            token = response.data[key];
                            logInfo(`Токен получен из нестандартного поля: ${key}`);
                            break;
                        }
                    }
                }

                // Если пользователя нет, но есть данные в ответе, используем их
                if (!user && response.data) {
                    if (response.data.userId || response.data.email) {
                        user = response.data;
                        logInfo('Данные пользователя получены из корня ответа');
                    } else if (response.data.user) {
                        user = response.data.user;
                        logInfo('Данные пользователя получены из response.data.user');
                    }
                }
            }
        }

        // Проверяем заголовки на наличие токена, если он не найден в ответе
        if (!token && response.headers) {
            console.log('Заголовки ответа:', response.headers);

            if (response.headers.authorization) {
                token = response.headers.authorization.replace('Bearer ', '');
                logInfo('Токен получен из заголовка authorization');
            } else if (response.headers['x-auth-token']) {
                token = response.headers['x-auth-token'];
                logInfo('Токен получен из заголовка x-auth-token');
            }
        }

        // Проверяем наличие токена
        if (!token) {
            console.error('Не удалось найти JWT токен в ответе сервера', response);
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

        // Обработка разных типов ошибок
        if (error.response) {
            console.error('Подробности ошибки ответа:', error.response);

            const status = error.response.status;
            const data = error.response.data;

            if (status === 401 || status === 403) {
                throw new Error('Неверные учетные данные или код подтверждения');
            } else if (status === 404) {
                throw new Error('Пользователь не найден');
            } else if (data) {
                if (typeof data === 'string') {
                    throw new Error(data);
                } else if (data.message) {
                    throw new Error(data.message);
                } else if (data.error) {
                    throw new Error(data.error);
                }
            }
            throw new Error(`Ошибка при входе: ${status}`);
        }

        // Нет ответа от сервера (сетевая ошибка)
        throw new Error(error.message || 'Ошибка при входе. Проверьте подключение к интернету.');
    }
};

// Получение кода подтверждения
const getVerificationCode = async (email) => {
    try {
        logInfo(`Запрашиваем код подтверждения для: ${email}`);

        // Отправляем запрос на получение кода подтверждения
        // Используем эндпоинт из контроллера - /auth/code/get
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

        // Обработка разных типов ошибок
        if (error.response) {
            const data = error.response.data;

            if (typeof data === 'string') {
                throw new Error(data);
            } else if (data && data.message) {
                throw new Error(data.message);
            } else if (data && data.error) {
                throw new Error(data.error);
            } else {
                throw new Error(`Ошибка при получении кода: ${error.response.status}`);
            }
        }

        // Нет ответа от сервера (сетевая ошибка)
        throw new Error(error.message || 'Ошибка при получении кода. Проверьте подключение к интернету.');
    }
};

// Получение данных пользователя
const getUserProfile = async (userId) => {
    try {
        logInfo(`Запрашиваем профиль пользователя: ${userId}`);

        const response = await api.get(API_ENDPOINTS.USERS.GET_BY_ID(userId));
        logInfo(`Получен профиль пользователя`);

        return response.data.data || response.data;
    } catch (error) {
        logError('Ошибка при получении профиля:', error);

        if (error.response) {
            const data = error.response.data;

            if (data && data.message) {
                throw new Error(data.message);
            } else {
                throw new Error(`Ошибка при получении профиля: ${error.response.status}`);
            }
        }

        throw new Error(error.message || 'Ошибка при получении данных пользователя');
    }
};

// Проверка статуса аутентификации
const checkAuthStatus = async () => {
    try {
        // Проверяем наличие токена
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) {
            return { isAuthenticated: false };
        }

        // Пытаемся запросить данные пользователя или проверить токен
        // Здесь можно использовать реальный эндпоинт для проверки токена
        // или просто проверить, не истек ли токен (если используем JWT)
        try {
            // Проверяем токен на валидность
            const response = await api.get(API_ENDPOINTS.AUTH.CHECK_AUTH || '/auth/check');

            return {
                isAuthenticated: true,
                user: response.data.user || JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null')
            };
        } catch (error) {
            // Если ошибка 401 или 403, значит токен невалидный
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                logout();
                return { isAuthenticated: false };
            }

            // Для других ошибок, считаем токен валидным
            // (ошибка сети или другая проблема с сервером)
            const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
            return { isAuthenticated: !!user, user };
        }
    } catch (error) {
        logError('Ошибка при проверке токена:', error);

        // При любой ошибке проверки токена, считаем пользователя не авторизованным
        logout();
        return { isAuthenticated: false };
    }
};

// Выход
const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
};

const authService = {
    register,
    login,
    getVerificationCode,
    getUserProfile,
    checkAuthStatus,
    logout
};

export default authService;