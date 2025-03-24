// API URLs
export const API_URL = 'http://localhost:8080';

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
};

// Form validation messages
export const VALIDATION_MESSAGES = {
    REQUIRED: 'Это поле обязательно',
    EMAIL_INVALID: 'Введите корректный email',
    PASSWORD_MIN: 'Пароль должен содержать минимум 8 символов',
    PASSWORD_REQUIREMENTS: 'Пароль должен содержать буквы, цифры и специальные символы',
    CODE_LENGTH: 'Код должен содержать 6 символов',
};

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
};