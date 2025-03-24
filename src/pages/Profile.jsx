import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    TextField,
    Button,
    Avatar,
    Divider,
    Alert,
    Card,
    CardContent,
    CircularProgress,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import { AnimatedPaper, pageTransition } from '../components/ui/AnimatedComponents';
import { ROUTES } from '../utils/constants';

const Profile = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Перенаправляем на страницу входа, если пользователь не авторизован
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        firstName: '',
        secondName: '',
        thirdName: '',
        email: '',
        birthDate: ''
    });

    // Инициализируем форму данными пользователя
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                secondName: user.secondName || '',
                thirdName: user.thirdName || '',
                email: user.email || '',
                birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Имитация сохранения данных
        setTimeout(() => {
            setLoading(false);
            setSaveSuccess(true);

            // Скрыть сообщение об успехе через 3 секунды
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        }, 1000);
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" mt={2}>
                    Загрузка данных профиля...
                </Typography>
            </Container>
        );
    }

    return (
        <Box component={motion.div} {...pageTransition}>
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
                        Профиль пользователя
                    </Typography>
                </motion.div>

                <Grid container spacing={4}>
                    {/* Левый блок - профиль пользователя */}
                    <Grid item xs={12} md={8}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <AnimatedPaper sx={{ p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <AccountCircleIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                                    <Typography variant="h5" component="h2" fontFamily="Ubuntu" fontWeight={600}>
                                        Личные данные
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 3 }} />

                                {saveSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Alert severity="success" sx={{ mb: 2 }}>
                                            Данные успешно сохранены
                                        </Alert>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Имя"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Фамилия"
                                                name="secondName"
                                                value={formData.secondName}
                                                onChange={handleChange}
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Отчество"
                                                name="thirdName"
                                                value={formData.thirdName}
                                                onChange={handleChange}
                                                margin="normal"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Дата рождения"
                                                name="birthDate"
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={handleChange}
                                                margin="normal"
                                                variant="outlined"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                margin="normal"
                                                variant="outlined"
                                                disabled
                                                helperText="Email нельзя изменить"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={loading}
                                                sx={{ py: 1.5, px: 4 }}
                                            >
                                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Сохранить изменения'}
                                            </Button>
                                        </motion.div>
                                    </Box>
                                </form>
                            </AnimatedPaper>
                        </motion.div>
                    </Grid>

                    {/* Правый блок - дополнительные настройки */}
                    <Grid item xs={12} md={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card sx={{ mb: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                bgcolor: 'primary.main',
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                                mr: 2
                                            }}
                                        >
                                            {user.firstName?.charAt(0) || 'П'}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" component="div">
                                                {user.firstName} {user.secondName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.role ? mapRoleToRussian(user.role) : 'Пользователь'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Дата регистрации: {user.registerDttm ? new Date(user.registerDttm).toLocaleDateString('ru-RU') : 'Не указана'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card sx={{ mb: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6" component="div">
                                            Безопасность
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="primary"
                                            sx={{ mb: 1 }}
                                        >
                                            Изменить пароль
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="secondary"
                                        >
                                            Настройки двухфакторной аутентификации
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card sx={{ borderRadius: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6" component="div">
                                            Статистика
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="body2" paragraph>
                                        <strong>Взято книг:</strong> 0
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        <strong>Активных заказов:</strong> 0
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>История поиска:</strong> 5 запросов
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

// Вспомогательные функции
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

export default Profile;