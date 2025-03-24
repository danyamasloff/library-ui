import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HistoryIcon from '@mui/icons-material/History';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ROUTES } from '../utils/constants';

const Dashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // Перенаправляем на страницу входа, если пользователь не авторизован
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
        }
    }, [isAuthenticated, navigate]);

    // Пример данных для демонстрации
    const borrowedBooks = [
        { id: 1, title: 'Программирование на Python', author: 'Марк Лутц', dueDate: '10.04.2025' },
        { id: 2, title: 'Алгоритмы и структуры данных', author: 'Томас Кормен', dueDate: '15.04.2025' },
    ];

    const recommendations = [
        { id: 1, title: 'Чистый код', author: 'Роберт Мартин' },
        { id: 2, title: 'JavaScript. Подробное руководство', author: 'Дэвид Флэнаган' },
        { id: 3, title: 'Паттерны проектирования', author: 'Эрих Гамма' },
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 3 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    fontFamily="Ubuntu"
                    fontWeight={700}
                >
                    Личный кабинет
                </Typography>

                {user && (
                    <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item>
                                <Avatar
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: 'primary.main',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {user.firstName?.charAt(0) || 'П'}
                                </Avatar>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h5" component="h2">
                                    {user.firstName} {user.secondName} {user.thirdName || ''}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {user.email}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => navigate('/profile')}
                                >
                                    Редактировать профиль
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                <Grid container spacing={4}>
                    {/* Текущие книги */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                            <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                                fontFamily="Ubuntu"
                                fontWeight={600}
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <MenuBookIcon sx={{ mr: 1 }} /> Ваши книги
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {borrowedBooks.length > 0 ? (
                                <Grid container spacing={2}>
                                    {borrowedBooks.map((book) => (
                                        <Grid item xs={12} sm={6} key={book.id}>
                                            <Card variant="outlined" sx={{ height: '100%' }}>
                                                <CardContent>
                                                    <Typography variant="h6" component="h3" gutterBottom>
                                                        {book.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        {book.author}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Срок сдачи: <strong>{book.dueDate}</strong>
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <Button size="small" color="primary">
                                                        Продлить
                                                    </Button>
                                                    <Button size="small">
                                                        Подробнее
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="body1">
                                    У вас нет книг на руках. Перейдите в каталог, чтобы найти книги.
                                </Typography>
                            )}

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/catalog')}
                                >
                                    Перейти в каталог
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Боковой блок */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                            <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                                fontFamily="Ubuntu"
                                fontWeight={600}
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <FavoriteIcon sx={{ mr: 1 }} /> Рекомендации
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <List dense>
                                {recommendations.map((book) => (
                                    <ListItem key={book.id} sx={{ pl: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            <BookmarkIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={book.title}
                                            secondary={book.author}
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                >
                                    Все рекомендации
                                </Button>
                            </Box>
                        </Paper>

                        <Paper sx={{ p: 3, borderRadius: 2 }}>
                            <Typography
                                variant="h5"
                                component="h2"
                                gutterBottom
                                fontFamily="Ubuntu"
                                fontWeight={600}
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <HistoryIcon sx={{ mr: 1 }} /> История
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="body2" paragraph>
                                Ваша история запросов и взятых книг будет отображаться здесь.
                            </Typography>

                            <Button
                                variant="text"
                                color="primary"
                                size="small"
                                fullWidth
                            >
                                Показать полную историю
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Dashboard;