import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Container,
    Grid,
    Typography,
    Paper,
    Box,
    Button,
    Chip,
    Divider,
    Rating,
    IconButton,
    Alert,
    CircularProgress,
    useTheme,
    Tooltip,
    alpha,
    Breadcrumbs,
    Link,
    Card,
    CardContent,
    Avatar,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from '@mui/material';
import {
    BookmarkBorderOutlined as BookmarkIcon,
    ArrowBackIosNew as ArrowBackIcon,
    FavoriteBorder as FavoriteIcon,
    Share as ShareIcon,
    MenuBook as MenuBookIcon,
    History as HistoryIcon,
    CalendarToday as CalendarIcon,
    Language as LanguageIcon,
    Description as DescriptionIcon,
    Category as CategoryIcon,
    Person as PersonIcon,
    HomeOutlined as HomeIcon,
    LocalLibraryOutlined as LibraryIcon,
} from '@mui/icons-material';
import { AnimatedBox, pageTransition } from '@/components/ui/AnimatedComponents';
import { ROUTES } from '@/utils/constants';
import api from '@/utils/api';

// Компонент для 3D анимации обложки книги
const BookCover = ({ color = '#BBC6B4' }) => {
    const theme = useTheme();

    return (
        <motion.div
            style={{
                width: '100%',
                height: 400,
                backgroundColor: color,
                borderRadius: 8,
                position: 'relative',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
            }}
            initial={{ rotateY: -20 }}
            animate={{
                rotateY: [10, -5, 10],
                boxShadow: [
                    '0 10px 30px rgba(0, 0, 0, 0.15)',
                    '0 15px 60px rgba(0, 0, 0, 0.2)',
                    '0 10px 30px rgba(0, 0, 0, 0.15)'
                ]
            }}
            transition={{
                rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
        >
            {/* Обложка книги */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: 3,
                    background: `linear-gradient(135deg, ${alpha(color, 0.7)} 0%, ${alpha(color, 0.9)} 100%)`,
                }}
            >
                <MenuBookIcon sx={{ fontSize: 80, color: 'white', mb: 2, opacity: 0.9 }} />
            </Box>

            {/* Тень книги */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: '10%',
                    right: '10%',
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.15)',
                    filter: 'blur(15px)',
                    transform: 'translateZ(-100px)',
                    zIndex: -1,
                }}
            />

            {/* Блик на обложке */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)',
                    pointerEvents: 'none',
                }}
            />
        </motion.div>
    );
};

// Компонент TabPanel для вкладок
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`book-tabpanel-${index}`}
            aria-labelledby={`book-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Вспомогательная функция для свойств вкладок
function a11yProps(index) {
    return {
        id: `book-tab-${index}`,
        'aria-controls': `book-tabpanel-${index}`,
    };
}

// Основной компонент детальной страницы книги
const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const { isAuthenticated } = useSelector(state => state.auth);

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [isReserving, setIsReserving] = useState(false);

    // Загружаем данные книги при монтировании компонента
    useEffect(() => {
        const fetchBookDetails = async () => {
            setLoading(true);
            try {
                // Запрос к API для получения детальной информации о книге
                const response = await api.get(`/books/${id}`);

                // Нормализация данных книги
                const bookData = response.data && (response.data.data || response.data);
                if (bookData) {
                    setBook(normalizeBookData(bookData));
                } else {
                    throw new Error('Данные книги не найдены');
                }
            } catch (error) {
                console.error('Ошибка при загрузке информации о книге:', error);
                setError('Не удалось загрузить информацию о книге. Пожалуйста, попробуйте позже.');

                // Если книги с таким ID не существует, создаем демо-книгу для отображения UI
                setBook(createDemoBook(id));
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    // Нормализация данных книги
    const normalizeBookData = (bookData) => {
        return {
            id: bookData.id || bookData.bookId || id,
            title: bookData.title || bookData.bookName || bookData.bookTitle || 'Название не указано',
            authors: Array.isArray(bookData.authors)
                ? bookData.authors
                : (bookData.author ? [{ fullName: bookData.author }] : [{ fullName: 'Автор не указан' }]),
            description: bookData.description || bookData.annotation || 'Описание отсутствует',
            genres: Array.isArray(bookData.genres)
                ? bookData.genres
                : (bookData.genre ? [{ genreName: bookData.genre }] : [{ genreName: 'Не указан' }]),
            bookStatus: bookData.bookStatus || (bookData.available !== false ? 'IN_STOCK' : 'NOT_AVAILABLE'),
            year: bookData.year || bookData.publicationYear || bookData.releaseDate || '2023',
            pages: bookData.pages || bookData.pageCount || bookData.pagesNumber || 256,
            publisher: bookData.publisher || bookData.publishingHouse || 'Издательство не указано',
            isbn: bookData.isbn || `978-5-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1 + Math.random() * 9)}`,
            language: bookData.language || 'Русский',
            coverColor: bookData.coverColor || getRandomCoverColor(),
            rating: bookData.rating || (Math.random() * 2 + 3).toFixed(1),
            available: bookData.available !== false,
            quantity: bookData.quantity || Math.floor(1 + Math.random() * 10),
            ...bookData
        };
    };

    // Создание демо-книги для отображения интерфейса если API недоступен
    const createDemoBook = (bookId) => {
        const titles = [
            'Основы программирования на Python',
            'Архитектура информационных систем',
            'Алгоритмы и структуры данных',
            'Искусственный интеллект и машинное обучение',
            'Цифровая трансформация бизнеса'
        ];

        const authors = [
            { fullName: 'Иванов И.И.' },
            { fullName: 'Петров П.П.' },
            { fullName: 'Сидоров С.С.' }
        ];

        const genres = [
            { genreName: 'Учебная литература' },
            { genreName: 'Программирование' },
            { genreName: 'Информационные технологии' }
        ];

        return {
            id: bookId,
            title: titles[Math.floor(Math.random() * titles.length)],
            authors: [authors[Math.floor(Math.random() * authors.length)]],
            description: 'Это демонстрационная книга, созданная для отображения интерфейса при недоступности API. Книга содержит основные концепции и подходы, необходимые для понимания предметной области. Автор подробно рассматривает как теоретические основы, так и практические аспекты применения. Книга предназначена для широкого круга читателей: от студентов до профессионалов в данной области.',
            genres: [genres[Math.floor(Math.random() * genres.length)]],
            bookStatus: 'IN_STOCK',
            year: 2023,
            pages: Math.floor(200 + Math.random() * 300),
            publisher: 'Издательство "Академия"',
            isbn: `978-5-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1 + Math.random() * 9)}`,
            language: 'Русский',
            coverColor: getRandomCoverColor(),
            rating: (Math.random() * 2 + 3).toFixed(1),
            available: Math.random() > 0.3,
            quantity: Math.floor(1 + Math.random() * 5),
            tableOfContents: [
                { title: 'Введение', page: 1 },
                { title: 'Глава 1. Основные понятия', page: 15 },
                { title: 'Глава 2. Методология', page: 45 },
                { title: 'Глава 3. Практическое применение', page: 120 },
                { title: 'Заключение', page: 230 },
                { title: 'Приложения', page: 250 }
            ],
            reviews: [
                {
                    author: 'Александр П.',
                    date: '12.03.2024',
                    rating: 4.5,
                    text: 'Очень полезная книга для начинающих специалистов. Хорошо структурирована и написана понятным языком.'
                },
                {
                    author: 'Екатерина С.',
                    date: '28.02.2024',
                    rating: 5.0,
                    text: 'Прекрасный учебник! Содержит много практических примеров и упражнений.'
                }
            ]
        };
    };

    // Получение случайного цвета для обложки книги
    const getRandomCoverColor = () => {
        const colors = [
            '#E3F2FD', // Light Blue
            '#FFF8E1', // Light Amber
            '#E8F5E9', // Light Green
            '#F3E5F5', // Light Purple
            '#E0F7FA', // Light Cyan
            '#FBE9E7', // Light Red
            '#BBC6B4', // Theme Light
            '#EFD7BB'  // Theme Secondary
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Обработка изменения вкладки
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Обработка резервирования книги
    const handleReserveBook = () => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
            return;
        }

        setIsReserving(true);

        // Имитация запроса к API
        setTimeout(() => {
            setIsReserving(false);
            // Здесь будет обработка ответа от API
            // Для демо просто показываем уведомление
            alert('Функционал бронирования находится в разработке');
        }, 1500);
    };

    // Обработка возврата назад
    const handleGoBack = () => {
        navigate(-1);
    };

    // Получение авторов книги в виде строки
    const getAuthorsString = () => {
        if (!book || !book.authors || !book.authors.length) return 'Автор не указан';
        return book.authors.map(author => author.fullName || author.name || author).join(', ');
    };

    // Получение жанров книги
    const getGenres = () => {
        if (!book || !book.genres || !book.genres.length) return [];
        return book.genres.map(genre => genre.genreName || genre.name || genre);
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            if (typeof dateString === 'number') return dateString.toString();
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('ru-RU');
        } catch (e) {
            return dateString.toString();
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <AnimatedBox {...pageTransition}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Хлебные крошки */}
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                    <Link
                        underline="hover"
                        color="inherit"
                        href={ROUTES.HOME}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Главная
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        href={ROUTES.CATALOG}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <LibraryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Каталог
                    </Link>
                    <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <MenuBookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        {book?.title}
                    </Typography>
                </Breadcrumbs>

                {/* Кнопка Назад */}
                <Box sx={{ mb: 3 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handleGoBack}
                        variant="text"
                        color="primary"
                    >
                        Вернуться к списку
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                )}

                {book && (
                    <Grid container spacing={4}>
                        {/* Левая колонка - обложка книги и действия */}
                        <Grid item xs={12} md={4}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* 3D обложка книги */}
                                <BookCover color={book.coverColor} />

                                {/* Рейтинг книги */}
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mt: 3,
                                    mb: 2
                                }}>
                                    <Rating
                                        value={parseFloat(book.rating) || 0}
                                        precision={0.5}
                                        readOnly
                                    />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                        {book.rating}
                                    </Typography>
                                </Box>

                                {/* Статус и доступность */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mb: 3
                                }}>
                                    <Chip
                                        label={book.available ? "В наличии" : "Нет в наличии"}
                                        color={book.available ? "success" : "error"}
                                        variant="outlined"
                                        sx={{ fontWeight: 500 }}
                                    />
                                </Box>

                                {/* Кнопки действий */}
                                <Box sx={{ mb: 3 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        size="large"
                                        startIcon={<BookmarkIcon />}
                                        disabled={!book.available || isReserving}
                                        onClick={handleReserveBook}
                                        sx={{ mb: 2 }}
                                    >
                                        {isReserving ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            "Забронировать"
                                        )}
                                    </Button>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Tooltip title="Добавить в избранное">
                                            <span>
                                                <IconButton
                                                    color="primary"
                                                    disabled={!isAuthenticated}
                                                    sx={{
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        '&:hover': {
                                                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                        }
                                                    }}
                                                >
                                                    <FavoriteIcon />
                                                </IconButton>
                                            </span>
                                        </Tooltip>

                                        <Tooltip title="Поделиться">
                                            <IconButton
                                                color="primary"
                                                sx={{
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                    }
                                                }}
                                            >
                                                <ShareIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>

                                {/* Информация о наличии */}
                                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.light, 0.1) }}>
                                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                        <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
                                        Информация о наличии
                                    </Typography>
                                    <Typography variant="body2">
                                        Доступно экземпляров: <strong>{book.quantity}</strong>
                                    </Typography>
                                </Paper>
                            </motion.div>
                        </Grid>

                        {/* Правая колонка - детали книги */}
                        <Grid item xs={12} md={8}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                {/* Заголовок и авторы */}
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    gutterBottom
                                    fontFamily="Ubuntu"
                                    fontWeight={700}
                                >
                                    {book.title}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    gutterBottom
                                    sx={{ mb: 3 }}
                                >
                                    {getAuthorsString()}
                                </Typography>

                                {/* Жанры */}
                                <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {getGenres().map((genre, index) => (
                                        <Chip
                                            key={index}
                                            label={genre}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                        />
                                    ))}
                                </Box>

                                {/* Вкладки с информацией */}
                                <Box sx={{ mb: 3 }}>
                                    <Paper
                                        sx={{
                                            borderRadius: 2,
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                                        }}
                                    >
                                        <Tabs
                                            value={tabValue}
                                            onChange={handleTabChange}
                                            aria-label="book information tabs"
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            sx={{
                                                px: 2,
                                                borderBottom: 1,
                                                borderColor: 'divider',
                                                '& .MuiTab-root': {
                                                    fontWeight: 500,
                                                    minWidth: 120,
                                                }
                                            }}
                                        >
                                            <Tab
                                                label="Описание"
                                                icon={<DescriptionIcon />}
                                                iconPosition="start"
                                                {...a11yProps(0)}
                                            />
                                            <Tab
                                                label="Характеристики"
                                                icon={<CategoryIcon />}
                                                iconPosition="start"
                                                {...a11yProps(1)}
                                            />
                                            <Tab
                                                label="Содержание"
                                                icon={<MenuBookIcon />}
                                                iconPosition="start"
                                                {...a11yProps(2)}
                                            />
                                            <Tab
                                                label="Отзывы"
                                                icon={<PersonIcon />}
                                                iconPosition="start"
                                                {...a11yProps(3)}
                                            />
                                        </Tabs>

                                        {/* Содержимое вкладки Описание */}
                                        <TabPanel value={tabValue} index={0}>
                                            <Box sx={{ p: { xs: 2, md: 3 } }}>
                                                <Typography variant="body1" paragraph>
                                                    {book.description}
                                                </Typography>
                                            </Box>
                                        </TabPanel>

                                        {/* Содержимое вкладки Характеристики */}
                                        <TabPanel value={tabValue} index={1}>
                                            <Box sx={{ p: { xs: 2, md: 3 } }}>
                                                <TableContainer component={Paper} sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
                                                    <Table>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell component="th" scope="row" sx={{ fontWeight: 500, width: '40%' }}>
                                                                    Автор
                                                                </TableCell>
                                                                <TableCell>{getAuthorsString()}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                                                    Год издания
                                                                </TableCell>
                                                                <TableCell>{formatDate(book.year)}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                                                    Издательство
                                                                </TableCell>
                                                                <TableCell>{book.publisher}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                                                    Количество страниц
                                                                </TableCell>
                                                                <TableCell>{book.pages}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                                                    ISBN
                                                                </TableCell>
                                                                <TableCell>{book.isbn}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                                                    Язык издания
                                                                </TableCell>
                                                                <TableCell>{book.language}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                                                    Жанр
                                                                </TableCell>
                                                                <TableCell>{getGenres().join(', ')}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Box>
                                        </TabPanel>

                                        {/* Содержимое вкладки Содержание */}
                                        <TabPanel value={tabValue} index={2}>
                                            <Box sx={{ p: { xs: 2, md: 3 } }}>
                                                {book.tableOfContents && book.tableOfContents.length > 0 ? (
                                                    <ul style={{ paddingLeft: 20 }}>
                                                        {book.tableOfContents.map((item, index) => (
                                                            <li key={index} style={{ marginBottom: 8 }}>
                                                                <Typography variant="body1">
                                                                    {item.title}
                                                                    {item.page && (
                                                                        <Typography
                                                                            component="span"
                                                                            variant="body2"
                                                                            color="text.secondary"
                                                                            sx={{ ml: 1 }}
                                                                        >
                                                                            (стр. {item.page})
                                                                        </Typography>
                                                                    )}
                                                                </Typography>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <Typography variant="body1">
                                                        Оглавление недоступно для этой книги
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TabPanel>

                                        {/* Содержимое вкладки Отзывы */}
                                        <TabPanel value={tabValue} index={3}>
                                            <Box sx={{ p: { xs: 2, md: 3 } }}>
                                                {book.reviews && book.reviews.length > 0 ? (
                                                    <Box>
                                                        {book.reviews.map((review, index) => (
                                                            <Card key={index} sx={{ mb: 2, boxShadow: 'none', bgcolor: alpha(theme.palette.background.default, 0.6) }}>
                                                                <CardContent>
                                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                                        <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                                                                            {review.author.charAt(0)}
                                                                        </Avatar>
                                                                        <Box>
                                                                            <Typography variant="subtitle1" fontWeight={500}>
                                                                                {review.author}
                                                                            </Typography>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                {review.date}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>

                                                                    <Rating
                                                                        value={review.rating}
                                                                        precision={0.5}
                                                                        readOnly
                                                                        size="small"
                                                                        sx={{ mb: 1 }}
                                                                    />

                                                                    <Typography variant="body1">
                                                                        {review.text}
                                                                    </Typography>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body1">
                                                        Отзывов пока нет. Будьте первым, кто оставит отзыв о книге.
                                                    </Typography>
                                                )}

                                                {isAuthenticated && (
                                                    <Box sx={{ mt: 3 }}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            fullWidth
                                                        >
                                                            Оставить отзыв
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Box>
                                        </TabPanel>
                                    </Paper>
                                </Box>

                                {/* Дополнительная информация */}
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Paper sx={{
                                            p: 2,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.primary.light, 0.05)
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CalendarIcon sx={{ mr: 1, color: theme.palette.primary.main }} fontSize="small" />
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Дата публикации
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2">
                                                {formatDate(book.year)}
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Paper sx={{
                                            p: 2,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.primary.light, 0.05)
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <LanguageIcon sx={{ mr: 1, color: theme.palette.primary.main }} fontSize="small" />
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    Язык издания
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2">
                                                {book.language}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>

                                {/* Издатель и ISBN */}
                                <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Издательство
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {book.publisher}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                ISBN
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {book.isbn}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Страниц
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {book.pages}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </AnimatedBox>
    );
};

export default BookDetails;