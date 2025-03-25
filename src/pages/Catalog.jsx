import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    Paper,
    Snackbar,
    Alert,
    Button,
    Chip,
    Tooltip,
    Badge,
    useTheme,
    alpha,
    Card,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import TuneIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/Sort';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { AnimatedBox, pageTransition } from '@/components/ui/AnimatedComponents';
import catalogService from '@/services/catalogService';
import BookList from '@/components/catalog/BookList';
import { useColorMode } from '@/components/ui/ThemeProvider';

// Компонент 3D парящей книги
const FloatingBook = () => {
    const theme = useTheme();

    return (
        <motion.div
            initial={{ rotateY: 0 }}
            animate={{
                rotateY: 360,
                y: [0, -10, 0],
                boxShadow: [
                    '0 5px 15px rgba(0, 0, 0, 0.1)',
                    '0 15px 25px rgba(0, 0, 0, 0.2)',
                    '0 5px 15px rgba(0, 0, 0, 0.1)'
                ]
            }}
            transition={{
                rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
                y: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
            }}
            style={{
                width: 60,
                height: 80,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                fontWeight: 'bold',
                perspective: '1000px'
            }}
        >
            <MenuBookIcon sx={{ fontSize: 30 }} />
        </motion.div>
    );
};

// Декоративные частицы для фона
const ParticlesBackground = () => {
    const theme = useTheme();
    const particles = [...Array(20)].map((_, i) => ({
        id: i,
        size: Math.random() * 10 + 5,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 10
    }));

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                overflow: 'hidden',
                zIndex: 0,
                opacity: 0.5,
                pointerEvents: 'none'
            }}
        >
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    initial={{
                        x: `${particle.x}%`,
                        y: `${particle.y}%`,
                        opacity: 0.2
                    }}
                    animate={{
                        y: [`${particle.y}%`, `${(particle.y + 20) % 100}%`],
                        opacity: [0.2, 0.5, 0.2],
                        rotate: [0, 360]
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        width: particle.size,
                        height: particle.size,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.mode === 'light'
                            ? alpha(theme.palette.primary.main, 0.2)
                            : alpha(theme.palette.primary.main, 0.3)
                    }}
                />
            ))}
        </Box>
    );
};

// Компонент заголовка с анимацией
const AnimatedHeader = ({ title }) => {
    const theme = useTheme();

    return (
        <Box sx={{ position: 'relative', mb: 4 }}>
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
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'inline-block',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '8px',
                            bottom: '4px',
                            left: 0,
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            zIndex: -1,
                        }
                    }}
                >
                    {title}
                </Typography>
            </motion.div>

            <Box sx={{ position: 'absolute', top: -20, right: 0 }}>
                <FloatingBook />
            </Box>
        </Box>
    );
};

// Основной компонент каталога
const Catalog = () => {
    const { isAuthenticated } = useSelector(state => state.auth);
    const { mode } = useColorMode();
    const theme = useTheme();

    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('Все жанры');
    const [viewMode, setViewMode] = useState('grid'); // grid или list
    const [sortOrder, setSortOrder] = useState('newest');
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [totalBooks, setTotalBooks] = useState(0);
    const [error, setError] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [genres, setGenres] = useState([{ id: 'all', name: 'Все жанры' }]);
    const [loadingGenres, setLoadingGenres] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState(0);

    const booksPerPage = 6;

    // Загрузка книг при монтировании компонента
    useEffect(() => {
        fetchBooks();
        fetchGenres();
    }, []);

    // Нормализация данных о книге
    const normalizeBookData = (books) => {
        if (!Array.isArray(books)) {
            console.warn('Получены некорректные данные книг:', books);
            return [];
        }

        return books.map(book => ({
            id: book.id || book.bookId || Math.random().toString(36).substring(2, 11),
            title: book.title || book.bookName || book.bookTitle || 'Название не указано',
            authors: Array.isArray(book.authors)
                ? book.authors
                : (book.author ? [{ fullName: book.author }] : [{ fullName: 'Автор не указан' }]),
            description: book.description || book.annotation || 'Описание отсутствует',
            genres: Array.isArray(book.genres)
                ? book.genres
                : (book.genre ? [{ genreName: book.genre }] : [{ genreName: 'Не указан' }]),
            bookStatus: book.bookStatus || (book.available !== false ? 'IN_STOCK' : 'NOT_AVAILABLE'),
            year: book.year || book.publicationYear || book.releaseDate,
            pages: book.pages || book.pageCount || book.pagesNumber,
            available: book.available !== false,
            ...book // сохраняем остальные поля
        }));
    };

    // Функция для загрузки всех книг
    const fetchBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Получаем общее количество книг
            try {
                const totalResponse = await catalogService.getAllBooks(true);
                if (totalResponse) {
                    setTotalBooks(typeof totalResponse === 'number' ? totalResponse : totalResponse.length);
                }
            } catch (countError) {
                console.warn('Не удалось получить общее количество книг:', countError);
            }

            // Получаем список книг
            const response = await catalogService.getAllBooks();
            if (response && Array.isArray(response)) {
                const normalizedBooks = normalizeBookData(response);
                setBooks(normalizedBooks);
                setFilteredBooks(normalizedBooks);
                console.log('Нормализованные книги:', normalizedBooks);
            } else if (response && response.data) {
                const normalizedBooks = normalizeBookData(response.data);
                setBooks(normalizedBooks);
                setFilteredBooks(normalizedBooks);
                console.log('Нормализованные книги:', normalizedBooks);
            } else {
                setBooks([]);
                setFilteredBooks([]);
                console.log('Пустой ответ от API книг');
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

    // Нормализация данных о жанрах
    const normalizeGenreData = (genresData) => {
        if (!Array.isArray(genresData)) {
            console.warn('Получены некорректные данные жанров:', genresData);
            return [];
        }

        return genresData.map(genre => ({
            id: genre.id || genre.genreId || Math.random().toString(36).substring(2, 11),
            name: genre.name || genre.genreName || genre.title || 'Неизвестный жанр'
        }));
    };

    // Функция для загрузки всех жанров
    const fetchGenres = async () => {
        setLoadingGenres(true);
        try {
            const response = await catalogService.getAllGenres();
            if (response && Array.isArray(response) && response.length > 0) {
                // Нормализуем данные жанров
                const normalizedGenres = normalizeGenreData(response);
                console.log('Нормализованные жанры:', normalizedGenres);

                // Добавляем "Все жанры" в начало списка
                setGenres([{ id: 'all', name: 'Все жанры' }, ...normalizedGenres]);
            } else {
                // Если API вернуло пустой массив, используем базовые жанры
                console.log('Используем дефолтные жанры из-за отсутствия данных от API');
                setGenres([
                    { id: 'all', name: 'Все жанры' },
                    { id: 1, name: 'Учебная литература' },
                    { id: 2, name: 'Техническая литература' },
                    { id: 3, name: 'Научно-популярная' },
                    { id: 4, name: 'Программирование' },
                    { id: 5, name: 'Математика' },
                    { id: 6, name: 'Физика' },
                    { id: 7, name: 'Экономика' },
                    { id: 8, name: 'Менеджмент' },
                ]);
            }
        } catch (error) {
            console.error('Ошибка при загрузке жанров:', error);
            // Если не удалось загрузить жанры, используем дефолтный список
            setGenres([
                { id: 'all', name: 'Все жанры' },
                { id: 1, name: 'Учебная литература' },
                { id: 2, name: 'Техническая литература' },
                { id: 3, name: 'Научно-популярная' },
                { id: 4, name: 'Программирование' },
                { id: 5, name: 'Математика' },
                { id: 6, name: 'Физика' },
                { id: 7, name: 'Экономика' },
                { id: 8, name: 'Менеджмент' },
            ]);
        } finally {
            setLoadingGenres(false);
        }
    };

    // Улучшенная функция для поиска
    const searchBooks = async () => {
        if (!searchQuery) return;

        setLoading(true);
        setError(null);
        try {
            console.log('Поиск по запросу:', searchQuery);

            // Получаем результаты поиска от API
            const response = await catalogService.searchBooksByName(searchQuery);

            if (response && Array.isArray(response)) {
                console.log('Ответ API на поиск:', response);
                const normalizedBooks = normalizeBookData(response);

                // Дополнительная фильтрация результатов поиска по жанру, если выбран конкретный жанр
                if (selectedGenre !== 'Все жанры') {
                    const filteredByGenre = normalizedBooks.filter(book =>
                            book.genres && book.genres.some(genre =>
                                (genre.genreName || genre.name || '').toLowerCase() === selectedGenre.toLowerCase()
                            )
                    );
                    setBooks(filteredByGenre);
                    setFilteredBooks(filteredByGenre);
                } else {
                    setBooks(normalizedBooks);
                    setFilteredBooks(normalizedBooks);
                }

                // Если ничего не найдено
                if (normalizedBooks.length === 0) {
                    setSnackbarMessage('По вашему запросу ничего не найдено');
                    setShowSnackbar(true);
                }
            } else {
                // Если API вернул пустой или некорректный ответ
                setBooks([]);
                setFilteredBooks([]);
                setSnackbarMessage('По вашему запросу ничего не найдено');
                setShowSnackbar(true);
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
            setActiveFilters(prevFilters => prevFilters - 1 >= 0 ? prevFilters - 1 : 0);
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

        setActiveFilters(prevFilters => prevFilters + 1);
        setLoading(true);
        setError(null);
        try {
            console.log('Фильтрация по жанру:', selectedGenre);
            const response = await catalogService.searchBooksByGenre(selectedGenre);
            if (response && Array.isArray(response)) {
                const normalizedBooks = normalizeBookData(response);

                // Если есть поисковый запрос, дополнительно фильтруем по нему
                if (searchQuery) {
                    const filteredBySearch = normalizedBooks.filter(book =>
                        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        book.authors.some(author =>
                            author.fullName && author.fullName.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                    );
                    setBooks(filteredBySearch);
                    setFilteredBooks(filteredBySearch);
                } else {
                    setBooks(normalizedBooks);
                    setFilteredBooks(normalizedBooks);
                }
            }

            // Если ничего не найдено
            if (!response || !Array.isArray(response) || response.length === 0) {
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

    // Локальная фильтрация по названию или автору
    const handleLocalSearch = () => {
        if (!searchQuery) {
            setFilteredBooks(books);
            return;
        }

        const searchQueryLower = searchQuery.toLowerCase();
        const filtered = books.filter(book =>
            book.title.toLowerCase().includes(searchQueryLower) ||
            book.authors.some(author =>
                author.fullName && author.fullName.toLowerCase().includes(searchQueryLower)
            )
        );

        setFilteredBooks(filtered);

        if (filtered.length === 0) {
            setSnackbarMessage('По вашему запросу ничего не найдено');
            setShowSnackbar(true);
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
        if (!searchQuery) return;

        // Если книг мало, проводим локальный поиск
        if (books.length < 100) {
            handleLocalSearch();
        } else {
            // Иначе используем API для поиска
            searchBooks();
        }
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

    // Обработка изменения режима отображения
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    // Обработка изменения сортировки
    const handleSortOrderChange = (order) => {
        setSortOrder(order);
        // Применяем сортировку
        const sortedBooks = [...filteredBooks].sort((a, b) => {
            switch (order) {
                case 'newest':
                    return new Date(b.year || 0) - new Date(a.year || 0);
                case 'oldest':
                    return new Date(a.year || 0) - new Date(b.year || 0);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return 0;
            }
        });
        setFilteredBooks(sortedBooks);
    };

    // Сброс всех фильтров
    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedGenre('Все жанры');
        setActiveFilters(0);
        setSortOrder('newest');
        fetchBooks();
    };

    // Переключение отображения фильтров
    const handleToggleFilters = () => {
        setFilterOpen(!filterOpen);
    };

    // Обработка закрытия снэкбара
    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
    };

    // Резервировать книгу
    const handleReserveBook = (book) => {
        console.log('Резервирование книги:', book);
        // Здесь будет логика для бронирования книги
        setSnackbarMessage('Функционал бронирования находится в разработке');
        setShowSnackbar(true);
    };

    // Расчет текущей страницы книг
    const indexOfLastBook = page * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    return (
        <AnimatedBox {...pageTransition}>
            {/* Фоновые частицы */}
            <ParticlesBackground />

            <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                {/* Анимированный заголовок */}
                <AnimatedHeader title="Каталог книг" />

                {/* Поисковая панель с современным дизайном */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Paper
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: 4,
                            boxShadow: theme.palette.mode === 'dark'
                                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                                : '0 8px 24px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(8px)',
                            backgroundColor: alpha(theme.palette.background.paper, 0.9)
                        }}
                        elevation={3}
                    >
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
                                    sx={{
                                        py: 1.5,
                                        px: 3,
                                        height: 56,
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    {loading ? (
                                        <motion.div
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        >
                                            <SearchIcon />
                                        </motion.div>
                                    ) : (
                                        'Найти'
                                    )}
                                </Button>
                                <Tooltip title="Фильтры">
                                    <Badge color="primary" badgeContent={activeFilters} invisible={activeFilters === 0}>
                                        <IconButton
                                            color="primary"
                                            onClick={handleToggleFilters}
                                            sx={{
                                                ml: 1,
                                                height: 56,
                                                width: 56,
                                                bgcolor: filterOpen ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                                            }}
                                        >
                                            <TuneIcon />
                                        </IconButton>
                                    </Badge>
                                </Tooltip>
                            </Box>
                        </form>

                        <AnimatePresence>
                            {filterOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6} md={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="genre-select-label">Жанр</InputLabel>
                                                <Select
                                                    labelId="genre-select-label"
                                                    id="genre-select"
                                                    value={selectedGenre}
                                                    label="Жанр"
                                                    onChange={handleGenreChange}
                                                >
                                                    {loadingGenres ? (
                                                        <MenuItem disabled>
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                                style={{ marginRight: 8 }}
                                                            >
                                                                <MenuBookIcon fontSize="small" />
                                                            </motion.div>
                                                            Загрузка жанров...
                                                        </MenuItem>
                                                    ) : (
                                                        genres.map((genre) => (
                                                            <MenuItem key={genre.id} value={genre.name}>
                                                                {genre.name}
                                                            </MenuItem>
                                                        ))
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="sort-select-label">Сортировка</InputLabel>
                                                <Select
                                                    labelId="sort-select-label"
                                                    id="sort-select"
                                                    value={sortOrder}
                                                    label="Сортировка"
                                                    onChange={(e) => handleSortOrderChange(e.target.value)}
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <SortIcon />
                                                        </InputAdornment>
                                                    }
                                                >
                                                    <MenuItem value="newest">Сначала новые</MenuItem>
                                                    <MenuItem value="oldest">Сначала старые</MenuItem>
                                                    <MenuItem value="title-asc">По названию (А-Я)</MenuItem>
                                                    <MenuItem value="title-desc">По названию (Я-А)</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    bgcolor: alpha(theme.palette.background.default, 0.6),
                                                    borderRadius: 2,
                                                    p: 0.5
                                                }}>
                                                    <Tooltip title="Сетка">
                                                        <IconButton
                                                            color={viewMode === 'grid' ? 'primary' : 'default'}
                                                            onClick={() => handleViewModeChange('grid')}
                                                        >
                                                            <ViewModuleIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Список">
                                                        <IconButton
                                                            color={viewMode === 'list' ? 'primary' : 'default'}
                                                            onClick={() => handleViewModeChange('list')}
                                                        >
                                                            <ViewListIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3}>
                                            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={handleResetFilters}
                                                    startIcon={<CloseIcon />}
                                                >
                                                    Сбросить фильтры
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    {/* Текущие активные фильтры */}
                                    {activeFilters > 0 && (
                                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
                                                Активные фильтры:
                                            </Typography>

                                            {selectedGenre !== 'Все жанры' && (
                                                <Chip
                                                    label={`Жанр: ${selectedGenre}`}
                                                    onDelete={() => setSelectedGenre('Все жанры')}
                                                    color="primary"
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}

                                            {searchQuery && (
                                                <Chip
                                                    label={`Поиск: ${searchQuery}`}
                                                    onDelete={() => setSearchQuery('')}
                                                    color="primary"
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Paper>
                </motion.div>

                {/* Сообщение об ошибке */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Alert
                            severity="error"
                            sx={{
                                mb: 4,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                borderRadius: 2
                            }}
                        >
                            {error}
                        </Alert>
                    </motion.div>
                )}

                {/* Статистика результатов */}
                <Box sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2
                }}>
                    <Typography variant="body2" color="text.secondary">
                        {loading ? (
                            <motion.span
                                initial={{ opacity: 0.6 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                            >
                                Загрузка книг...
                            </motion.span>
                        ) : (
                            `Найдено книг: ${filteredBooks.length}`
                        )}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalLibraryIcon sx={{ color: 'primary.main', mr: 1, fontSize: 18 }} />
                        <Typography variant="body2" color="text.secondary">
                            Всего в библиотеке: {totalBooks}
                        </Typography>
                    </Box>
                </Box>

                {/* Результаты поиска */}
                <BookList
                    books={currentBooks}
                    loading={loading}
                    error={error}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onReserveBook={handleReserveBook}
                    viewMode={viewMode}
                />

                {/* Нет результатов */}
                {!loading && filteredBooks.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 4,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}>
                            <motion.div
                                initial={{ rotateY: 0 }}
                                animate={{ rotateY: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                style={{ display: 'inline-block', perspective: '1000px', marginBottom: 16 }}
                            >
                                <MenuBookIcon sx={{ fontSize: 80, color: 'primary.main', opacity: 0.7 }} />
                            </motion.div>

                            <Typography variant="h6" gutterBottom>
                                По вашему запросу ничего не найдено
                            </Typography>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                Попробуйте изменить параметры поиска или сбросить фильтры
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleResetFilters}
                                sx={{ mt: 1, borderRadius: 8, px: 4 }}
                            >
                                Сбросить фильтры
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </Container>

            {/* Снэкбар для уведомлений */}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="info"
                    sx={{
                        width: '100%',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        borderRadius: 2
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </AnimatedBox>
    );
};

export default Catalog;