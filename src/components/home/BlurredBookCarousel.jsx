import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    IconButton,
    Card,
    CardMedia,
    CardContent,
    Button,
    CardActions,
    Chip,
    useTheme,
    alpha,
    Paper,
    Tooltip,
    Backdrop,
    Pagination,
    Badge
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import LockIcon from '@mui/icons-material/Lock';
import StarIcon from '@mui/icons-material/Star';
import LoginIcon from '@mui/icons-material/Login';
import { ROUTES } from '@utils/constants';

// Пример данных для карусели
const sampleBooks = [
    {
        id: 1,
        title: 'Техническое обеспечение информационных систем',
        author: 'Иванов А.В.',
        genre: 'Учебное пособие',
        available: true,
        year: 2023,
        pages: 320,
        rating: 4.5,
        coverColor: '#E3F2FD'
    },
    {
        id: 2,
        title: 'Цифровизация транспортных систем',
        author: 'Петров С.Н.',
        genre: 'Монография',
        available: true,
        year: 2022,
        pages: 280,
        rating: 4.2,
        coverColor: '#FFF8E1'
    },
    {
        id: 3,
        title: 'Управление проектами в IT',
        author: 'Сидоров И.И.',
        genre: 'Учебник',
        available: false,
        year: 2021,
        pages: 350,
        rating: 4.7,
        coverColor: '#E8F5E9'
    },
    {
        id: 4,
        title: 'Анализ данных в информационных системах',
        author: 'Козлов Д.М.',
        genre: 'Практикум',
        available: true,
        year: 2022,
        pages: 240,
        rating: 4.4,
        coverColor: '#F3E5F5'
    },
    {
        id: 5,
        title: 'Основы программирования на Python',
        author: 'Смирнова А.Д.',
        genre: 'Учебное пособие',
        available: true,
        year: 2023,
        pages: 310,
        rating: 4.9,
        coverColor: '#E0F7FA'
    },
    {
        id: 6,
        title: 'Методы искусственного интеллекта',
        author: 'Федоров К.А.',
        genre: 'Монография',
        available: true,
        year: 2022,
        pages: 420,
        rating: 4.6,
        coverColor: '#FBE9E7'
    },
];

// Компонент рейтинга книги
const BookRating = ({ rating }) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <StarIcon sx={{ fontSize: 18, color: theme.palette.warning.main, mr: 0.5 }} />
            <Typography variant="body2" fontWeight={500}>
                {rating.toFixed(1)}
            </Typography>
        </Box>
    );
};

const BlurredBookCarousel = ({ title, subtitle, books = sampleBooks, isAuthenticated = false }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleItems, setVisibleItems] = useState(3);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [hoveredBook, setHoveredBook] = useState(null);

    // Динамически определяем количество видимых элементов по размеру экрана
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setVisibleItems(1);
            } else if (window.innerWidth < 960) {
                setVisibleItems(2);
            } else {
                setVisibleItems(3);
            }
        };

        handleResize(); // Инициализация при загрузке
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Расчет для пагинации
    const totalPages = Math.ceil(books.length / visibleItems);

    // Изменение страницы
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Переход к следующей странице
    const handleNext = () => {
        setCurrentPage(prev => prev < totalPages ? prev + 1 : 1);
    };

    // Переход к предыдущей странице
    const handlePrev = () => {
        setCurrentPage(prev => prev > 1 ? prev - 1 : totalPages);
    };

    // Получение отображаемых книг для текущей страницы
    const getDisplayedBooks = () => {
        const startIndex = (currentPage - 1) * visibleItems;
        return books.slice(startIndex, startIndex + visibleItems);
    };

    const displayedBooks = getDisplayedBooks();

    // Обработка действия с книгой
    const handleBookAction = () => {
        if (!isAuthenticated) {
            setShowAuthPrompt(true);
            setTimeout(() => setShowAuthPrompt(false), 3000);
        }
    };

    // Перенаправление на страницу входа
    const redirectToLogin = () => {
        navigate(ROUTES.LOGIN);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                position: 'relative',
                py: 4,
                px: { xs: 2, md: 3 },
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.primary.light, 0.1),
                overflow: 'hidden',
                mb: 6
            }}
        >
            {/* Декоративные элементы */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -50,
                    left: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: alpha(theme.palette.primary.light, 0.2),
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -30,
                    right: -30,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: alpha(theme.palette.secondary.light, 0.2),
                    zIndex: 0
                }}
            />

            {/* Диалог авторизации */}
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    position: 'absolute',
                    borderRadius: 3
                }}
                open={showAuthPrompt}
                onClick={() => setShowAuthPrompt(false)}
            >
                <Paper
                    sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: 400
                    }}
                >
                    <LockIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" gutterBottom align="center">
                        Для доступа к каталогу необходима авторизация
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph align="center">
                        Войдите или зарегистрируйтесь, чтобы получить полный доступ к каталогу библиотеки
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<LoginIcon />}
                        onClick={redirectToLogin}
                    >
                        Войти в систему
                    </Button>
                </Paper>
            </Backdrop>

            <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* Заголовок */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                        <Typography
                            variant="h5"
                            component="h2"
                            fontFamily="Ubuntu"
                            fontWeight={600}
                            color="text.primary"
                        >
                            {title || "Новые поступления"}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body1" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                            {currentPage} / {totalPages}
                        </Typography>
                        <IconButton
                            onClick={handlePrev}
                            sx={{
                                bgcolor: 'white',
                                boxShadow: 1,
                                mr: 1,
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                bgcolor: 'white',
                                boxShadow: 1,
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {/* Карусель книг */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        py: 2,
                        position: 'relative',
                        minHeight: 420, // Фиксированная минимальная высота
                    }}
                >
                    {/* Наложение размытия для неавторизованных пользователей - ИСПРАВЛЕНО */}
                    {!isAuthenticated && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backdropFilter: 'blur(4px)',
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                zIndex: 10,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 2,
                                cursor: 'pointer',
                                width: '100%',
                                height: '100%'
                            }}
                            onClick={redirectToLogin}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    maxWidth: 400,
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                }}
                            >
                                <AutoStoriesIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6" align="center" gutterBottom fontWeight={600}>
                                    Библиотека доступна авторизованным пользователям
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center" paragraph>
                                    Войдите в систему, чтобы получить доступ к полному каталогу книг и возможность бронирования
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<LoginIcon />}
                                    sx={{ mt: 2 }}
                                >
                                    Войти в систему
                                </Button>
                            </Paper>
                        </Box>
                    )}

                    {/* Карточки книг */}
                    <AnimatePresence mode="wait">
                        {displayedBooks.map((book, index) => {
                            const isHovered = hoveredBook === book.id;

                            return (
                                <motion.div
                                    key={`${book.id}-${currentPage}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    style={{
                                        flex: `0 0 calc(${100 / visibleItems}% - ${(visibleItems - 1) * 12 / visibleItems}px)`,
                                        maxWidth: `calc(${100 / visibleItems}% - ${(visibleItems - 1) * 12 / visibleItems}px)`,
                                        filter: !isAuthenticated ? 'grayscale(0.5)' : 'none',
                                    }}
                                    onMouseEnter={() => setHoveredBook(book.id)}
                                    onMouseLeave={() => setHoveredBook(null)}
                                >
                                    <Tooltip
                                        title={!isAuthenticated ? "Для полного доступа к каталогу необходима авторизация" : ""}
                                        arrow
                                        placement="top"
                                        disableHoverListener={isAuthenticated}
                                    >
                                        <Card
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: 'all 0.3s ease',
                                                transform: isHovered && isAuthenticated ? 'translateY(-8px)' : 'none',
                                                boxShadow: isHovered && isAuthenticated ? 3 : 1,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                cursor: !isAuthenticated ? 'not-allowed' : 'pointer',
                                                opacity: !isAuthenticated ? 0.8 : 1,
                                                position: 'relative',
                                            }}
                                        >
                                            {/* Индикатор новинки */}
                                            {book.year >= 2023 && isAuthenticated && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 12,
                                                        left: -30,
                                                        backgroundColor: theme.palette.error.main,
                                                        color: 'white',
                                                        py: 0.5,
                                                        px: 3,
                                                        transform: 'rotate(-45deg)',
                                                        transformOrigin: 'center',
                                                        zIndex: 5,
                                                        fontWeight: 'bold',
                                                        fontSize: '0.7rem',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                    }}
                                                >
                                                    НОВИНКА
                                                </Box>
                                            )}

                                            <CardMedia
                                                component="div"
                                                sx={{
                                                    pt: '56.25%', // 16:9 aspect ratio
                                                    position: 'relative',
                                                    bgcolor: book.coverColor || 'grey.200',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        p: 1,
                                                        zIndex: 1
                                                    }}
                                                >
                                                    <Chip
                                                        label={book.available ? "Доступна" : "Недоступна"}
                                                        color={book.available ? "success" : "error"}
                                                        size="small"
                                                        sx={{ fontWeight: 500 }}
                                                    />
                                                </Box>

                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <MenuBookIcon sx={{ fontSize: 60, color: theme.palette.text.secondary, opacity: 0.7 }} />
                                                </Box>

                                                {/* Жанр книги - полупрозрачная наклейка внизу обложки */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        p: 0.5,
                                                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                                                        color: 'white',
                                                        fontSize: '0.75rem',
                                                        textAlign: 'center',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {book.genre}
                                                </Box>
                                            </CardMedia>

                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography
                                                    variant="h6"
                                                    component="h3"
                                                    gutterBottom
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        lineHeight: 1.3,
                                                        height: '2.6em',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {book.title}
                                                </Typography>

                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {book.author}
                                                </Typography>

                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    mt: 1
                                                }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {book.year} г. • {book.pages} стр.
                                                    </Typography>
                                                    <BookRating rating={book.rating} />
                                                </Box>
                                            </CardContent>

                                            <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={handleBookAction}
                                                    disabled={!isAuthenticated}
                                                >
                                                    Подробнее
                                                </Button>

                                                {book.available && (
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<BookmarkIcon />}
                                                        onClick={handleBookAction}
                                                        disabled={!isAuthenticated}
                                                    >
                                                        Забронировать
                                                    </Button>
                                                )}
                                            </CardActions>
                                        </Card>
                                    </Tooltip>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </Box>

                {/* Нумерация страниц */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                fontWeight: 500
                            }
                        }}
                    />
                </Box>

                {/* Кнопка "Смотреть все" */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={isAuthenticated ? () => navigate('/catalog') : handleBookAction}
                        sx={{
                            px: 4,
                            py: 1,
                            borderRadius: 20,
                            fontWeight: 500,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                        }}
                        startIcon={!isAuthenticated && <LockIcon fontSize="small" />}
                    >
                        {isAuthenticated ? "Перейти в полный каталог" : "Войти для просмотра каталога"}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default BlurredBookCarousel;