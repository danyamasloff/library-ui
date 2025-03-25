import api from '@utils/api';
import { API_ENDPOINTS } from '@utils/constants';

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
        const response = await api.get(API_ENDPOINTS.BOOKS.SEARCH.REQUEST, {
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
        const response = await api.get(API_ENDPOINTS.BOOKS.SEARCH.NAME, {
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

// Поиск книг по жанру - ИСПРАВЛЕН URL
const searchBooksByGenre = async (genreName) => {
    try {
        // Проверяем корректность параметра
        if (!genreName || genreName === 'Все жанры') {
            return getAllBooks(); // Если жанр не указан или "Все жанры", возвращаем все книги
        }

        // Используем правильный эндпоинт
        const response = await api.get(API_ENDPOINTS.BOOKS.SEARCH.GENRE, {
            params: { genreName }
        });

        return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        logError('Ошибка при поиске книг по жанру', error);

        if (error.response && error.response.status === 404 ||
            error.response?.status === 403) { // Добавляем обработку 403
            console.log("Возвращаем пустой массив из-за ошибки доступа или отсутствия данных");
            return [];
        }

        throw error;
    }
};

// Получить все жанры
const getAllGenres = async () => {
    try {
        const response = await api.get(API_ENDPOINTS.BOOKS.GENRES);
        return response.data.data !== undefined ? response.data.data : response.data;
    } catch (error) {
        logError('Ошибка при получении списка жанров', error);

        if (error.response && (error.response.status === 404 || error.response.status === 403)) {
            console.log("Возвращаем базовый набор жанров из-за ошибки API");
            // Возвращаем базовый набор жанров если API недоступно
            return [
                { id: 1, name: 'Учебная литература' },
                { id: 2, name: 'Техническая литература' },
                { id: 3, name: 'Научно-популярная' },
                { id: 4, name: 'Программирование' },
                { id: 5, name: 'Математика' },
                { id: 6, name: 'Физика' },
                { id: 7, name: 'Экономика' },
                { id: 8, name: 'Менеджмент' }
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
    getAllGenres
};

export default catalogService;