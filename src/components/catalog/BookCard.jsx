import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    Chip,
    Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { BOOK_STATUSES, ROUTES } from '@/utils/constants';

// Компонент карточки книги
const BookCard = ({ book, onReserve }) => {
    const navigate = useNavigate();

    // Получение статуса книги на русском
    const getBookStatus = (status) => {
        return BOOK_STATUSES[status] || status;
    };

    // Определяем цвет для статуса книги
    const getStatusColor = (status) => {
        switch (status) {
            case 'IN_STOCK':
                return 'success';
            case 'ISSUED':
                return 'error';
            case 'BOOKED':
                return 'warning';
            case 'NOT_AVAILABLE':
                return 'error';
            default:
                return 'default';
        }
    };

    // Форматируем дату
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU');
        } catch (e) {
            return '';
        }
    };

    // Сокращаем текст, если он слишком длинный
    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    // Извлекаем жанры с проверкой на различные форматы данных
    const getGenres = () => {
        // Если книга имеет массив genres
        if (book.genres && Array.isArray(book.genres) && book.genres.length > 0) {
            return book.genres.map(genre => genre.genreName || genre.name || genre);
        }

        // Если жанр указан в виде строки
        if (book.genre) {
            return [book.genre];
        }

        // Если жанр указан в другом поле
        if (book.bookGenre) {
            return [book.bookGenre];
        }

        return ['Не указан'];
    };

    // Получаем имена авторов с проверкой на различные форматы данных
    const getAuthors = () => {
        // Если книга имеет массив authors
        if (book.authors && Array.isArray(book.authors) && book.authors.length > 0) {
            return book.authors.map(author => author.fullName || author.name || author).join(', ');
        }

        // Если автор указан в виде строки
        if (book.author) {
            return book.author;
        }

        // Если автор указан в другом поле
        if (book.authorName) {
            return book.authorName;
        }

        return 'Автор не указан';
    };

    // Проверяем доступность книги
    const isAvailable = book.bookStatus === 'IN_STOCK' || book.available;

    // Получаем ID книги для ссылки
    const getBookId = () => {
        return book.bookId || book.id || 'unknown';
    };

    // Обработчик нажатия на кнопку "Подробнее"
    const handleBookDetails = () => {
        navigate(`/books/${getBookId()}`);
    };

    return (
        <motion.div
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
            layout
        >
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 2 }}>
                {/* Изображение книги или заглушка */}
                <CardMedia
                    component="div"
                    sx={{
                        height: 200,
                        backgroundColor: 'grey.200',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {/* Статус книги (справа вверху) */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 2,
                        }}
                    >
                        <Chip
                            label={getBookStatus(book.bookStatus) || (isAvailable ? 'Доступна' : 'Недоступна')}
                            color={getStatusColor(book.bookStatus) || (isAvailable ? 'success' : 'error')}
                            size="small"
                        />
                    </Box>

                    {/* Иконка книги (если нет изображения) */}
                    <MenuBookIcon
                        sx={{
                            fontSize: 80,
                            color: 'primary.main',
                            opacity: 0.7,
                        }}
                    />

                    {/* Жанры книги (внизу) */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.5,
                        }}
                    >
                        {getGenres().slice(0, 2).map((genre, index) => (
                            <Chip
                                key={index}
                                label={genre}
                                size="small"
                                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                            />
                        ))}
                        {getGenres().length > 2 && (
                            <Chip
                                label={`+${getGenres().length - 2}`}
                                size="small"
                                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                            />
                        )}
                    </Box>
                </CardMedia>

                {/* Содержимое карточки */}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        {truncateText(book.title || book.bookName || book.bookTitle || 'Название не указано', 60)}
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {getAuthors()}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            {book.year || book.releaseDate || book.publicationYear
                                ? formatDate(book.year || book.releaseDate || book.publicationYear)
                                : ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {book.pages || book.pagesNumber || book.pageCount
                                ? `${book.pages || book.pagesNumber || book.pageCount} стр.`
                                : ''}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                        {truncateText(book.description || book.annotation || 'Описание отсутствует', 120)}
                    </Typography>

                    {/* Кнопки */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={handleBookDetails}
                        >
                            Подробнее
                        </Button>

                        {isAvailable && (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<BookmarkIcon />}
                                onClick={() => onReserve && onReserve(book)}
                                disabled={!isAvailable}
                            >
                                Забронировать
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default BookCard;