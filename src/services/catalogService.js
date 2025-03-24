import api from '../utils/api';
import { API_ENDPOINTS } from '../utils/constants';

const logError = (message, error) => console.error(`[Catalog] ${message}:`, error);

// Получение всех книг
const getAllBooks = async (showOnlyCount = false) => {
    try {
        // Делаем запрос к API с корректными параметрами
        const response = await api.get(API_ENDPOINTS.BOOKS.GET_ALL, {
            params: { showOnlyCount }
        });

        // Обрабатываем разные форматы ответа
        if (response.data !== undefined) {
            if (showOnlyCount) {
                // Если запрашивали только количество
                return typeof response.data === 'number'
                    ? response.data
                    : (response.data.data !== undefined ? response.data.data : response.data);
            } else {
                // Если запрашивали список книг
                return response.data.data !== undefined ? response.data.data : response.data;
            }
        }

        return showOnlyCount ? 0 : [];
    } catch (error) {
        logError('Ошибка при получении списка книг', error);

        // Если сервер вернул пустой список с 404, считаем это корректным пустым результатом
        if (error.response && error.response.status === 404 &&
            error.response.data && error.response.data.response === 'empty list') {
            return showOnlyCount ? 0 : [];
        }

        throw error;
    }
};

// Поиск книг по запросу
const searchBooksByRequest = async (searchRequest) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.BOOKS.GET_ALL}search/request`, {
            params: { searchRequest }
        });

        return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        logError('Ошибка при поиске книг по запросу', error);

        // Обрабатываем случай пустого результата
        if (error.response && error.response.status === 404 &&
            error.response.data && error.response.data.response === 'empty list') {
            return [];
        }

        throw error;
    }
};

// Поиск книг по названию
const searchBooksByName = async (namePart, showOnlyCount = false) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.BOOKS.GET_ALL}search/name`, {
            params: { namePart, showOnlyCount }
        });

        if (showOnlyCount) {
            return typeof response.data === 'number'
                ? response.data
                : (response.data.data !== undefined ? response.data.data : response.data);
        }

        return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        logError('Ошибка при поиске книг по названию', error);

        if (error.response && error.response.status === 404 &&
            error.response.data && error.response.data.response === 'empty list') {
            return showOnlyCount ? 0 : [];
        }

        throw error;
    }
};

// Поиск книг по жанру
const searchBooksByGenre = async (genreName) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.BOOKS.GET_ALL}search/genre`, {
            params: { genreName }
        });

        return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        logError('Ошибка при поиске книг по жанру', error);

        if (error.response && error.response.status === 404 &&
            error.response.data && error.response.data.response === 'empty list') {
            return [];
        }

        throw error;
    }
};

// Поиск книг по идентификатору книги
const searchBooksByIdentifier = async (fullIdentifier) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.BOOKS.GET_ALL}search/book-identifier`, {
            params: { fullIdentifier }
        });

        return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        logError('Ошибка при поиске книг по идентификатору', error);

        if (error.response && error.response.status === 404 &&
            error.response.data && error.response.data.response === 'empty list') {
            return [];
        }

        throw error;
    }
};

// Поиск книг по имени автора
const searchBooksByAuthorName = async (authorName) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.BOOKS.GET_ALL}search/author-name`, {
            params: { authorName }
        });

        return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        logError('Ошибка при поиске книг по имени автора', error);

        if (error.response && error.response.status === 404 &&
            error.response.data && error.response.data.response === 'empty list') {
            return [];
        }

        throw error;
    }
};

// Поиск книг по идентификатору автора
const searchBooksByAuthorIdentifier = async (authorIdentifier) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.BOOKS.GET_ALL}search/author-identifier`, {
            params: { authorIdentifier }
        });

        return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        logError('Ошибка при поиске книг по идентификатору автора', error);

        if (error.response && error.response.status === 404 &&
            error.response.data && error.response.data.response === 'empty list') {
            return [];
        }

        throw error;
    }
};

// Вспомогательная функция для нормализации данных книг
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

// Создаем новую книгу
const createBook = async (bookData) => {
    try {
        const response = await api.post(API_ENDPOINTS.BOOKS.GET_ALL, bookData);
        return response.data.data || response.data;
    } catch (error) {
        logError('Ошибка при создании книги', error);
        throw error;
    }
};

// Обновляем книгу
const updateBook = async (bookId, bookData) => {
    try {
        const response = await api.put(`${API_ENDPOINTS.BOOKS.GET_BY_ID(bookId)}`, bookData);
        return response.data.data || response.data;
    } catch (error) {
        logError(`Ошибка при обновлении книги (ID: ${bookId})`, error);
        throw error;
    }
};

// Удаляем книгу
const deleteBook = async (bookId) => {
    try {
        const response = await api.delete(API_ENDPOINTS.BOOKS.GET_BY_ID(bookId));
        return response.data.data || response.data;
    } catch (error) {
        logError(`Ошибка при удалении книги (ID: ${bookId})`, error);
        throw error;
    }
};

// Получить все жанры
const getAllGenres = async () => {
    try {
        const response = await api.get(`${API_ENDPOINTS.BOOKS.GET_ALL}genres`);
        return response.data.data || response.data;
    } catch (error) {
        logError('Ошибка при получении списка жанров', error);

        if (error.response && error.response.status === 404) {
            return [];
        }

        throw error;
    }
};

// Получить все статусы книг
const getAllBookStatuses = async () => {
    try {
        const response = await api.get(`${API_ENDPOINTS.BOOKS.GET_ALL}statuses`);
        return response.data.data || response.data;
    } catch (error) {
        logError('Ошибка при получении списка статусов книг', error);

        if (error.response && error.response.status === 404) {
            // Возвращаем дефолтные статусы, если API не поддерживает этот эндпоинт
            return [
                { name: 'IN_STOCK', title: 'В наличии' },
                { name: 'ISSUED', title: 'Выдана' },
                { name: 'NOT_AVAILABLE', title: 'Нет в наличии' },
                { name: 'BOOKED', title: 'Забронирована' }
            ];
        }

        throw error;
    }
};

const catalogService = {
    getAllBooks,
    searchBooksByRequest,
    searchBooksByName,
    searchBooksByGenre,
    searchBooksByIdentifier,
    searchBooksByAuthorName,
    searchBooksByAuthorIdentifier,
    normalizeBookData,
    createBook,
    updateBook,
    deleteBook,
    getAllGenres,
    getAllBookStatuses
};

export default catalogService;