import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Alert,
    CircularProgress,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HistoryIcon from '@mui/icons-material/History';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getUserById } from '../redux/slices/userSlice';
import { ROUTES } from '../utils/constants';
import {
    AnimatedPaper,
    AnimatedBox,
    AnimatedCard,
    staggerContainer,
    staggerItem,
    pageTransition
} from '../components/ui/AnimatedComponents';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { profile, loading, error } = useSelector((state) => state.user);
    const [userProfile, setUserProfile] = useState(null);

    // Перенаправляем на страницу входа, если пользователь не авторизован
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
        } else if (user?.userId) {
            // Загружаем подробные данные пользователя
            dispatch(getUserById(user.userId));
        }
    }, [isAuthenticated, navigate, dispatch, user]);

    // Объединяем данные из auth.user и user.profile
    useEffect(() => {
        if (user || profile) {
            setUserProfile({
                ...user,
                ...profile
            });
        }
    }, [user, profile]);

    // Пример данных для демонстрации
    const borrowedBooks = profile?.borrows || [];
    const recommendations = [
        { id: 1, title: 'Чистый код', author: 'Роберт Мартин' },
        { id: 2, title: 'JavaScript. Подробное руководство', author: 'Дэвид Флэнаган' },
        { id: 3, title: 'Паттерны проектирования', author: 'Эрих Гамма' },
    ];

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CircularProgress size={60} />
                    <Typography variant="h6" mt={2}>
                        Загрузка данных...
                    </Typography>
                </motion.div>
            </Container>
        );
    }

    return (
        <AnimatedBox
            sx={{ py: 3 }}
            {...pageTransition}
        >
            <Container maxWidth="lg">
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
                        Личный кабинет
                    </Typography>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    </motion.div>
                )}

                {userProfile && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                bgcolor: 'primary.main',
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {userProfile.firstName?.charAt(0) || 'П'}
                                        </Avatar>
                                    </motion.div>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="h5" component="h2">
                                        {userProfile.fullName ||
                                            `${userProfile.firstName || ''} ${userProfile.secondName || ''} ${userProfile.thirdName || ''}`}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {userProfile.email}
                                    </Typography>
                                    {userProfile.role && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Статус: <strong>{mapRoleToRussian(userProfile.role)}</strong>
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid item>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => navigate('/profile')}
                                        >
                                            Редактировать профиль
                                        </Button>
                                    </motion.div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </motion.div>
                )}

                <Grid container spacing={4}>
                    {/* Текущие книги */}
                    <Grid item xs={12} md={8}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <AnimatedPaper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <motion.div
                                        initial={{ rotate: -10, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <MenuBookIcon sx={{ mr: 1, fontSize: 28 }} color="primary" />
                                    </motion.div>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        gutterBottom
                                        fontFamily="Ubuntu"
                                        fontWeight={600}
                                    >
                                        Ваши книги
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />

                                {borrowedBooks.length > 0 ? (
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="initial"
                                        animate="animate"
                                    >
                                        <Grid container spacing={2}>
                                            {borrowedBooks.map((book, index) => (
                                                <Grid item xs={12} sm={6} key={book.id || index}>
                                                    <motion.div variants={staggerItem}>
                                                        <AnimatedCard
                                                            variant="outlined"
                                                            sx={{ height: '100%' }}
                                                            whileHover={{
                                                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                                                y: -5
                                                            }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <CardContent>
                                                                <Typography variant="h6" component="h3" gutterBottom>
                                                                    {book.bookTitle || book.title}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                    {book.author}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    Срок сдачи: <strong>{formatDate(book.returnDate)}</strong>
                                                                </Typography>
                                                            </CardContent>
                                                            <CardActions>
                                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                    <Button size="small" color="primary">
                                                                        Продлить
                                                                    </Button>
                                                                </motion.div>
                                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                    <Button size="small">
                                                                        Подробнее
                                                                    </Button>
                                                                </motion.div>
                                                            </CardActions>
                                                        </AnimatedCard>
                                                    </motion.div>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </motion.div>
                                ) : (
                                    <Typography variant="body1">
                                        У вас нет книг на руках. Перейдите в каталог, чтобы найти книги.
                                    </Typography>
                                )}

                                <Box sx={{ mt: 3, textAlign: 'center' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => navigate('/catalog')}
                                        >
                                            Перейти в каталог
                                        </Button>
                                    </motion.div>
                                </Box>
                            </AnimatedPaper>
                        </motion.div>
                    </Grid>

                    {/* Боковой блок */}
                    <Grid item xs={12} md={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <AnimatedPaper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <FavoriteIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    </motion.div>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        gutterBottom
                                        fontFamily="Ubuntu"
                                        fontWeight={600}
                                    >
                                        Рекомендации
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />

                                <motion.div variants={staggerContainer} initial="initial" animate="animate">
                                    <List dense>
                                        {recommendations.map((book, index) => (
                                            <motion.div key={book.id} variants={staggerItem}>
                                                <ListItem sx={{ pl: 0 }}>
                                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                                        <motion.div
                                                            initial={{ rotate: 0 }}
                                                            whileHover={{ rotate: 15, scale: 1.2 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <BookmarkIcon color="primary" />
                                                        </motion.div>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={book.title}
                                                        secondary={book.author}
                                                    />
                                                </ListItem>
                                            </motion.div>
                                        ))}
                                    </List>
                                </motion.div>

                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                        >
                                            Все рекомендации
                                        </Button>
                                    </motion.div>
                                </Box>
                            </AnimatedPaper>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <AnimatedPaper sx={{ p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <motion.div
                                        animate={{
                                            rotate: [0, 10, 0, -10, 0],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatDelay: 3
                                        }}
                                    >
                                        <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    </motion.div>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        gutterBottom
                                        fontFamily="Ubuntu"
                                        fontWeight={600}
                                    >
                                        История
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />

                                <Typography variant="body2" paragraph>
                                    Ваша история запросов и взятых книг будет отображаться здесь.
                                </Typography>

                                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        size="small"
                                        fullWidth
                                    >
                                        Показать полную историю
                                    </Button>
                                </motion.div>
                            </AnimatedPaper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </AnimatedBox>
    );
};

// Вспомогательные функции
const formatDate = (dateString) => {
    if (!dateString) return 'Не указан';

    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
};

const mapRoleToRussian = (role) => {
    const roles = {
        ADMIN: 'Администратор',
        LIBRARIAN: 'Библиотекарь',
        TEACHER: 'Преподаватель',
        STUDENT: 'Студент',
        AUTHORIZED: 'Авторизованный пользователь',
        DEACTIVATED: 'Не активирован'
    };

    return roles[role] || role;
};

export default Dashboard;