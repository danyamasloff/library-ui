// API URLs
export const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-production-api.com'
    : 'http://localhost:8080';

// API Endpoints
export const API_ENDPOINTS = {
    // Аутентификация
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GET_CODE: '/auth/code/get',
        CHECK_EMAIL: '/auth/check-email-availability',
        CHECK_AUTH: '/auth/check-auth',
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
        SEARCH: {
            REQUEST: '/books/search/request',
            NAME: '/books/search/name',
            GENRE: '/books/search/genre', // Убедитесь, что эндпоинт соответствует вашему API
            BOOK_ID: '/books/search/book-identifier',
            AUTHOR_NAME: '/books/search/author-name',
            AUTHOR_ID: '/books/search/author-identifier',
        },
        // Добавлены корректные эндпоинты для жанров и статусов
        GENRES: '/books/genres',
        STATUSES: '/books/statuses',
    },
    // Бронирования книг
    BORROWS: {
        USER: '/borrows/u/',
        TEACHER: '/borrows/t/',
        LIBRARIAN: '/borrows/l/',
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
    BOOK_DETAILS: (id) => `/books/${id}`,
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

// Типы ошибок API
export const API_ERROR_TYPES = {
    NETWORK: 'network_error',
    AUTH: 'auth_error',
    VALIDATION: 'validation_error',
    SERVER: 'server_error',
};

// Статусы книг
export const BOOK_STATUSES = {
    IN_STOCK: 'В наличии',
    ISSUED: 'Выдана',
    NOT_AVAILABLE: 'Нет в наличии',
    BOOKED: 'Забронирована',
};