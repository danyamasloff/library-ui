import api from '../utils/api';

// Получение всех книг
const getAllBooks = async (showOnlyCount = false) => {
    try {
        // Исправляем URL-путь в соответствии с API контроллера
        const response = await api.get('/books', {
            params: { showOnlyCount }
        });

        // Проверяем структуру ответа
        if (response.data && (response.data.data !== undefined || response.data.status)) {
            // Возвращаем данные в зависимости от формата ответа
            return response.data.data !== undefined ? response.data : { data: response.data };
        }

        return { data: [] };
    } catch (error) {
        console.error('Ошибка при получении списка книг:', error);

        // Если сервер вернул пустой список с 404, считаем это корректным пустым результатом
        if (error.response && error.response.status === 404 && error.response.data && error.response.data.response === 'empty list') {
            return { data: [] };
        }

        throw error;
    }
};

// Поиск книг по запросу
const searchBooksByRequest = async (searchRequest) => {
    try {
        const response = await api.get('/books/search/request', {
            params: { searchRequest }
        });

        // Проверяем структуру ответа
        if (response.data && (response.data.data !== undefined || response.data.status)) {
            return response.data.data !== undefined ? response.data : { data: response.data };
        }

        return { data: [] };
    } catch (error) {
        console.error('Ошибка при поиске книг по запросу:', error);

        // Если сервер вернул пустой список с 404, считаем это корректным пустым результатом
        if (error.response && error.response.status === 404 && error.response.data && error.response.data.response === 'empty list') {
            return { data: [] };
        }

        throw error;
    }
};

// Поиск книг по названию
const searchBooksByName = async (searchRequest, showOnlyCount = false) => {
    try {
        const response = await api.get('/books/search/name', {
            params: { namePart: searchRequest, showOnlyCount }
        });

        // Проверяем структуру ответа
        if (response.data && (response.data.data !== undefined || response.data.status)) {
            return response.data.data !== undefined ? response.data : { data: response.data };
        }

        return { data: [] };
    } catch (error) {
        console.error('Ошибка при поиске книг по названию:', error);

        // Если сервер вернул пустой список с 404, считаем это корректным пустым результатом
        if (error.response && error.response.status === 404 && error.response.data && error.response.data.response === 'empty list') {
            return { data: [] };
        }

        throw error;
    }
};

// Поиск книг по жанру
const searchBooksByGenre = async (genreName) => {
    try {
        const response = await api.get('/books/search/genre', {
            params: { genreName }
        });

        // Проверяем структуру ответа
        if (response.data && (response.data.data !== undefined || response.data.status)) {
            return response.data.data !== undefined ? response.data : { data: response.data };
        }

        return { data: [] };
    } catch (error) {
        console.error('Ошибка при поиске книг по жанру:', error);

        // Если сервер вернул пустой список с 404, считаем это корректным пустым результатом
        if (error.response && error.response.status === 404 && error.response.data && error.response.data.response === 'empty list') {
            return { data: [] };
        }

        throw error;
    }
};

// Поиск книг по идентификатору книги
const searchBooksByIdentifier = async (fullIdentifier) => {
    try {
        const response = await api.get('/books/search/book-identifier', {
            params: { fullIdentifier }
        });

        // Проверяем структуру ответа
        if (response.data && (response.data.data !== undefined || response.data.status)) {
            return response.data.data !== undefined ? response.data : { data: response.data };
        }

        return { data: [] };
    } catch (error) {
        console.error('Ошибка при поиске книг по идентификатору:', error);

        // Если сервер вернул пустой список с 404, считаем это корректным пустым результатом
        if (error.response && error.response.status === 404 && error.response.data && error.response.data.response === 'empty list') {
            return { data: [] };
        }

        throw error;
    }
};

// Поиск книг по имени автора
const searchBooksByAuthorName = async (authorName) => {
    try {
        const response = await api.get('/books/search/author-name', {
            params: { authorName }
        });

        // Проверяем структуру ответа
        if (response.data && (response.data.data !== undefined || response.data.status)) {
            return response.data.data !== undefined ? response.data : { data: response.data };
        }

        return { data: [] };
    } catch (error) {
        console.error('Ошибка при поиске книг по имени автора:', error);

        // Если сервер вернул пустой список с 404, считаем это корректным пустым результатом
        if (error.response && error.response.status === 404 && error.response.data && error.response.data.response === 'empty list') {
            return { data: [] };
        }

        throw error;
    }
};

// Поиск книг по идентификатору автора
const searchBooksByAuthorIdentifier = async (authorIdentifier) => {
    try {
        const response = await api.get('/books/search/author-identifier', {
            params: { authorIdentifier }
        });

        // Проверяем структуру ответа
        if (response.data && (response.data.data !== undefined || response.data.status)) {
            return response.data.data !== undefined ? response.data : { data: response.data };
        }

        return { data: [] };
    } catch (error) {
        console.error('Ошибка при поиске книг по идентификатору автора:', error);

        // Если сервер вернул пустой список с 404, считаем это корректным пустым результатом
        if (error.response && error.response.status === 404 && error.response.data && error.response.data.response === 'empty list') {
            return { data: [] };
        }

        throw error;
    }
};

// Вспомогательная функция для обработки разных форматов данных
const normalizeBookData = (bookData) => {
    if (!bookData || typeof bookData !== 'object') return [];

    if (Array.isArray(bookData)) {
        return bookData;
    }

    if (bookData.data && Array.isArray(bookData.data)) {
        return bookData.data;
    }

    return [];
};

const catalogService = {
    getAllBooks,
    searchBooksByRequest,
    searchBooksByName,
    searchBooksByGenre,
    searchBooksByIdentifier,
    searchBooksByAuthorName,
    searchBooksByAuthorIdentifier,
    normalizeBookData
};

export default catalogService;