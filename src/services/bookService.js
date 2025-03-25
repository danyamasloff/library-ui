import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

const logError = (message, error) => console.error(`[Book] ${message}:`, error);

// Получение детальной информации о книге по ID
const getBookById = async (bookId) => {
    try {
        // Сначала пробуем получить книгу по эндпоинту GET_BY_ID
        try {
            const response = await api.get(API_ENDPOINTS.BOOKS.GET_BY_ID(bookId));
            return response.data.data !== undefined ? response.data.data : response.data;
        } catch (error) {
            // Если первый эндпоинт не сработал, пробуем альтернативный
            console.warn(`Не удалось получить книгу по первому эндпоинту, пробуем альтернативный: ${error.message}`);

            // Альтернативный эндпоинт - может быть, книга доступна по другому пути
            const altResponse = await api.get(`${API_ENDPOINTS.BOOKS.GET_ALL}${bookId}`);
            return altResponse.data.data !== undefined ? altResponse.data.data : altResponse.data;
        }
    } catch (error) {
        logError(`Ошибка при получении информации о книге (ID: ${bookId})`, error);
        throw error;
    }
};

// Резервирование книги
const reserveBook = async (bookId, userId) => {
    try {
        // Предполагается, что у API есть эндпоинт для бронирования книги
        const response = await api.post(API_ENDPOINTS.BORROWS.USER, {
            bookId,
            userId
        });
        return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        logError(`Ошибка при бронировании книги (ID: ${bookId})`, error);
        throw error;
    }
};

// Добавление отзыва о книге
const addBookReview = async (bookId, reviewData) => {
    try {
        // Предполагается, что у API есть эндпоинт для добавления отзыва
        const response = await api.post(`${API_ENDPOINTS.BOOKS.GET_BY_ID(bookId)}/reviews`, reviewData);
        return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        logError(`Ошибка при добавлении отзыва (ID книги: ${bookId})`, error);
        throw error;
    }
};

// Получение похожих книг
const getSimilarBooks = async (bookId, genreId) => {
    try {
        let response;
        if (genreId) {
            // Если известен жанр, ищем по жанру
            response = await api.get(API_ENDPOINTS.BOOKS.SEARCH.GENRE, {
                params: { genreId }
            });
        } else {
            // Иначе используем эндпоинт для похожих книг, если есть
            try {
                response = await api.get(`${API_ENDPOINTS.BOOKS.GET_BY_ID(bookId)}/similar`);
            } catch (error) {
                // Если такого эндпоинта нет, возвращаем просто список книг
                console.warn('Эндпоинт для похожих книг не найден, возвращаем все книги:', error.message);
                response = await api.get(API_ENDPOINTS.BOOKS.GET_ALL);
            }
        }

        // Фильтруем, чтобы не включать текущую книгу
        const books = response.data.data !== undefined ? response.data.data : response.data;
        return Array.isArray(books)
            ? books.filter(book => book.id.toString() !== bookId.toString())
            : [];
    } catch (error) {
        logError(`Ошибка при получении похожих книг (ID: ${bookId}, genreId: ${genreId})`, error);
        return []; // В случае ошибки возвращаем пустой массив
    }
};

const bookService = {
    getBookById,
    reserveBook,
    addBookReview,
    getSimilarBooks
};

export default bookService;