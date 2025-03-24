// API URLs
export const API_URL = 'http://localhost:8080';

// API Endpoints
export const API_ENDPOINTS = {
    // Аутентификация
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GET_CODE: '/auth/code/get',
        CHECK_EMAIL: '/auth/check-email-availability',
    },
    // Пользователи
    USERS: {
        GET_ALL: '/users/',
        GET_BY_ID: (id) => `/users/${id}`,
    },
    // Книги
    BOOKS: {
        GET_ALL: '/books/',
        GET_BY_ID: (id) => `/books/${id}`,
    },
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    CATALOG: '/catalog',
};

// Form validation messages
export const VALIDATION_MESSAGES = {
    REQUIRED: 'Это поле обязательно',
    EMAIL_INVALID: 'Введите корректный email',
    EMAIL_EXISTS: 'Пользователь с таким email уже существует',
    PASSWORD_MIN: 'Пароль должен содержать минимум 8 символов',
    PASSWORD_REQUIREMENTS: 'Пароль должен содержать буквы, цифры и специальные символы',
    CODE_LENGTH: 'Код должен содержать 6 символов',
};

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
};