import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    CircularProgress,
    Divider,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CloseIcon from '@mui/icons-material/Close';
import { AnimatedBox, AnimatedCard, staggerContainer, staggerItem, pageTransition } from '../components/ui/AnimatedComponents';
import catalogService from '../services/catalogService';

// Примеры жанров для фильтрации - в реальном приложении будут загружаться из API
const genres = [
    'Все жанры',
    'Учебная литература',
    'Техническая литература',
    'Научно-популярная',
    'Программирование',
    'Математика',
    'Физика',
    'Экономика',
    'Менеджмент',
];

const Catalog = () => {
    const { isAuthenticated } = useSelector(state => state.auth);

    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('Все жанры');
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [totalBooks, setTotalBooks] = useState(0);
    const [error, setError] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const booksPerPage = 6;

    // Загрузка книг при монтировании компонента
    useEffect(() => {
        fetchBooks();
    }, []);

    // Функция для загрузки всех книг
    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Получаем общее количество книг
            const totalResponse = await catalogService.getAllBooks(true);
            if (totalResponse && totalResponse.data) {
                setTotalBooks(totalResponse.data);
            }

            // Получаем список книг
            const response = await catalogService.getAllBooks();
            if (response && response.data) {
                setBooks(response.data);
                setFilteredBooks(response.data);
            } else {
                setBooks([]);
                setFilteredBooks([]);
            }
        } catch (error) {
            console.error('Ошибка при загрузке книг:', error);
            setError('Не удалось загрузить список книг. Пожалуйста, попробуйте позже.');
            setSnackbarMessage('Ошибка при загрузке книг');
            setShowSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    // Функция для поиска по API
    const searchBooks = async () => {
        if (!searchQuery) return;

        setLoading(true);
        setError(null);
        try {
            let response;

            if (selectedGenre !== 'Все жанры') {
                // Если выбран жанр, сначала ищем по жанру
                response = await catalogService.searchBooksByGenre(selectedGenre);
                // Затем фильтруем результаты по поисковому запросу
                if (response && response.data) {
                    const filtered = response.data.filter(book =>
                        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))
                    );
                    setBooks(filtered);
                    setFilteredBooks(filtered);
                }
            } else {
                // Если жанр не выбран, ищем по запросу
                response = await catalogService.searchBooksByRequest(searchQuery);
                if (response && response.data) {
                    setBooks(response.data);
                    setFilteredBooks(response.data);
                }
            }

            // Если ничего не найдено
            if (!response || !response.data || response.data.length === 0) {
                setSnackbarMessage('По вашему запросу ничего не найдено');
                setShowSnackbar(true);
                setBooks([]);
                setFilteredBooks([]);
            }
        } catch (error) {
            console.error('Ошибка при поиске книг:', error);
            setError('Не удалось выполнить поиск. Пожалуйста, попробуйте позже.');
            setSnackbarMessage('Ошибка при поиске книг');
            setShowSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    // Функция для фильтрации по жанру
    const filterByGenre = async () => {
        if (selectedGenre === 'Все жанры') {
            // Если "Все жанры", просто загружаем все книги
            if (searchQuery) {
                // Если есть поисковый запрос, выполняем поиск
                searchBooks();
            } else {
                // Иначе загружаем все книги
                fetchBooks();
            }
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await catalogService.searchBooksByGenre(selectedGenre);
            if (response && response.data) {
                // Если есть поисковый запрос, дополнительно фильтруем по нему
                if (searchQuery) {
                    const filtered = response.data.filter(book =>
                        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))
                    );
                    setBooks(filtered);
                    setFilteredBooks(filtered);
                } else {
                    setBooks(response.data);
                    setFilteredBooks(response.data);
                }
            }

            // Если ничего не найдено
            if (!response || !response.data || response.data.length === 0) {
                setSnackbarMessage(`Книги жанра "${selectedGenre}" не найдены`);
                setShowSnackbar(true);
                setBooks([]);
                setFilteredBooks([]);
            }
        } catch (error) {
            console.error('Ошибка при фильтрации по жанру:', error);
            setError('Не удалось отфильтровать книги по жанру. Пожалуйста, попробуйте позже.');
            setSnackbarMessage('Ошибка при фильтрации книг');
            setShowSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    // Обработка изменения страницы
    const handlePageChange = (event, value) => {
        setPage(value);
        // Прокрутка страницы вверх при переходе на новую страницу
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Обработка изменения поискового запроса
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Обработка отправки формы поиска
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchBooks();
    };

    // Обработка изменения жанра
    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
    };

    // Применение фильтра по жанру
    useEffect(() => {
        if (selectedGenre !== 'Все жанры') {
            filterByGenre();
        } else if (books.length > 0) {
            setFilteredBooks(books);
        }
    }, [selectedGenre]);

    // Сброс всех фильтров
    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedGenre('Все жанры');
        fetchBooks();
    };

    // Переключение отображения фильтров
    const handleToggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Обработка закрытия снэкбара
    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
    };

    // Резервировать книгу
    const handleReserveBook = (bookId) => {
        // Здесь будет логика для бронирования книги
        setSnackbarMessage('Функционал бронирования находится в разработке');
        setShowSnackbar(true);
    };

    // Расчет текущей страницы книг
    const indexOfLastBook = page * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    // Функция для форматирования даты
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU');
        } catch (e) {
            return '';
        }
    };

    return (
        <AnimatedBox {...pageTransition}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        fontFamily="Ubuntu"
                        fontWeight={700}
                    >
                        Каталог книг
                    </Typography>
                </motion.div>

                {/* Поисковая панель */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                        <form onSubmit={handleSearchSubmit}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TextField
                                    fullWidth
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Поиск по названию или автору"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: searchQuery && (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setSearchQuery('')} edge="end">
                                                    <CloseIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mr: 1 }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading || !searchQuery}
                                    sx={{ py: 1.5, px: 3, height: 56 }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Найти'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleToggleFilters}
                                    sx={{ ml: 1, py: 1.5, px: 2, height: 56 }}
                                    startIcon={<FilterListIcon />}
                                >
                                    Фильтры
                                </Button>
                            </Box>
                        </form>

                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                                    <FormControl sx={{ minWidth: 200 }}>
                                        <InputLabel id="genre-select-label">Жанр</InputLabel>
                                        <Select
                                            labelId="genre-select-label"
                                            id="genre-select"
                                            value={selectedGenre}
                                            label="Жанр"
                                            onChange={handleGenreChange}
                                        >
                                            {genres.map((genre) => (
                                                <MenuItem key={genre} value={genre}>
                                                    {genre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleResetFilters}
                                        startIcon={<CloseIcon />}
                                    >
                                        Сбросить фильтры
                                    </Button>
                                </Box>
                            </motion.div>
                        )}
                    </Paper>
                </motion.div>

                {/* Сообщение об ошибке */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Alert severity="error" sx={{ mb: 4 }}>
                            {error}
                        </Alert>
                    </motion.div>
                )}

                {/* Результаты поиска */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : filteredBooks.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                По вашему запросу ничего не найдено
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Попробуйте изменить параметры поиска или сбросить фильтры
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleResetFilters}
                            >
                                Сбросить фильтры
                            </Button>
                        </Paper>
                    </motion.div>
                ) : (
                    <>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Найдено книг: {filteredBooks.length}
                            </Typography>
                        </Box>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            <Grid container spacing={3}>
                                {currentBooks.map((book, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={book.id || book.bookId || index}>
                                        <motion.div variants={staggerItem}>
                                            <AnimatedCard
                                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                                whileHover={{
                                                    y: -10,
                                                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)'
                                                }}
                                            >
                                                <CardMedia
                                                    component="div"
                                                    sx={{
                                                        pt: '56.25%', // 16:9 aspect ratio
                                                        bgcolor: 'grey.200',
                                                        position: 'relative'
                                                    }}
                                                    image=""
                                                >
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            right: 0,
                                                            p: 1,
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <Chip
                                                            label={book.available !== false ? "Доступна" : "Недоступна"}
                                                            color={book.available !== false ? "success" : "error"}
                                                            size="small"
                                                        />
                                                    </Box>

                                                    {/* Замещаем отсутствующее изображение */}
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <MenuBookIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            {book.genre || book.bookGenre || 'Книга'}
                                                        </Typography>
                                                    </Box>
                                                </CardMedia>

                                                <CardContent sx={{ flexGrow: 1 }}>
                                                    <Typography variant="h6" component="h2" gutterBottom>
                                                        {book.title || book.bookTitle || 'Название не указано'}
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                                        {book.author || book.authorName || 'Автор не указан'}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', mb: 1 }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                                                            {book.publicationYear || book.year || ''}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {book.pageCount || book.pages || ''} {book.pageCount ? 'стр.' : ''}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                                        {book.description || book.annotation ?
                                                            (book.description || book.annotation).length > 100
                                                                ? `${(book.description || book.annotation).substring(0, 100)}...`
                                                                : (book.description || book.annotation)
                                                            : 'Описание отсутствует'
                                                        }
                                                    </Typography>
                                                </CardContent>

                                                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                    >
                                                        Подробнее
                                                    </Button>
                                                    {isAuthenticated && book.available !== false && (
                                                        <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                color="primary"
                                                                startIcon={<BookmarkIcon />}
                                                                onClick={() => handleReserveBook(book.id || book.bookId)}
                                                            >
                                                                Забронировать
                                                            </Button>
                                                        </motion.div>
                                                    )}
                                                </CardActions>
                                            </AnimatedCard>
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>

                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 2 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                />
                            </Box>
                        )}
                    </>
                )}
            </Container>

            {/* Снэкбар для уведомлений */}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </AnimatedBox>
    );
};

export default Catalog;