import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Stack,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SchoolIcon from '@mui/icons-material/School';
import { ROUTES } from '../utils/constants';
import { AnimatedBox, AnimatedCard, pageTransition, staggerContainer, staggerItem } from '../components/ui/AnimatedComponents';

const Home = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Определяем анимации для разных секций
    const heroAnimation = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
    };

    const textAnimation = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.2 }
    };

    const buttonAnimation = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, delay: 0.4 },
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 }
    };

    const iconAnimation = {
        initial: { scale: 0, rotate: -10 },
        animate: { scale: 1, rotate: 0 },
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
        }
    };

    return (
        <AnimatedBox {...pageTransition}>
            {/* Hero Section */}
            <motion.div {...heroAnimation}>
                <Box
                    sx={{
                        bgcolor: 'primary.light',
                        py: 8,
                        borderRadius: 2,
                        mb: 6,
                        color: 'text.primary',
                    }}
                >
                    <Container maxWidth="lg">
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <motion.div {...textAnimation}>
                                    <Typography
                                        variant="h3"
                                        component="h1"
                                        gutterBottom
                                        fontFamily="Ubuntu"
                                        fontWeight={700}
                                    >
                                        Библиотека ИУЦТ ЦТУТП
                                    </Typography>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <Typography variant="h6" paragraph>
                                        Доступ к электронным ресурсам для студентов и преподавателей института управления и цифровых технологий
                                    </Typography>
                                </motion.div>

                                <Stack direction="row" spacing={2} mt={4}>
                                    {isAuthenticated ? (
                                        <motion.div {...buttonAnimation}>
                                            <Button
                                                component={RouterLink}
                                                to="/catalog"
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                startIcon={<MenuBookIcon />}
                                            >
                                                Перейти к каталогу
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <>
                                            <motion.div {...buttonAnimation}>
                                                <Button
                                                    component={RouterLink}
                                                    to={ROUTES.LOGIN}
                                                    variant="contained"
                                                    color="primary"
                                                    size="large"
                                                >
                                                    Войти
                                                </Button>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5, delay: 0.5 }}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Button
                                                    component={RouterLink}
                                                    to={ROUTES.REGISTER}
                                                    variant="outlined"
                                                    color="primary"
                                                    size="large"
                                                >
                                                    Регистрация
                                                </Button>
                                            </motion.div>
                                        </>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%'
                                }}>
                                    <motion.div
                                        initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                                        animate={{ opacity: 0.6, rotate: 0, scale: 1 }}
                                        transition={{
                                            duration: 0.8,
                                            type: "spring",
                                            stiffness: 100
                                        }}
                                    >
                                        <LocalLibraryIcon sx={{ fontSize: 240, color: 'primary.main' }} />
                                    </motion.div>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </motion.div>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ mb: 6 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        textAlign="center"
                        mb={5}
                        fontFamily="Ubuntu"
                        fontWeight={600}
                    >
                        Возможности нашей библиотеки
                    </Typography>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <motion.div variants={staggerItem}>
                                <AnimatedCard
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2
                                    }}
                                    whileHover={{
                                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
                                        y: -10
                                    }}
                                >
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'secondary.light',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <motion.div {...iconAnimation}>
                                            <LibraryBooksIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                                        </motion.div>
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                                            Электронный каталог
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Доступ к полной коллекции учебной и научной литературы в электронном формате
                                        </Typography>
                                    </CardContent>
                                </AnimatedCard>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <motion.div variants={staggerItem}>
                                <AnimatedCard
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2
                                    }}
                                    whileHover={{
                                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
                                        y: -10
                                    }}
                                >
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'secondary.light',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <motion.div {...iconAnimation}>
                                            <MenuBookIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                                        </motion.div>
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                                            Онлайн доступ
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Читайте книги и статьи в любое время и в любом месте через интернет
                                        </Typography>
                                    </CardContent>
                                </AnimatedCard>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <motion.div variants={staggerItem}>
                                <AnimatedCard
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2
                                    }}
                                    whileHover={{
                                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
                                        y: -10
                                    }}
                                >
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'secondary.light',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <motion.div {...iconAnimation}>
                                            <SchoolIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                                        </motion.div>
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                                            Учебные материалы
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Методические пособия, учебники и другие материалы для успешной учебы
                                        </Typography>
                                    </CardContent>
                                </AnimatedCard>
                            </motion.div>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <motion.div variants={staggerItem}>
                                <AnimatedCard
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2
                                    }}
                                    whileHover={{
                                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
                                        y: -10
                                    }}
                                >
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'secondary.light',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <motion.div {...iconAnimation}>
                                            <LocalLibraryIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                                        </motion.div>
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                                            Научные работы
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Доступ к научным статьям, диссертациям и результатам исследований
                                        </Typography>
                                    </CardContent>
                                </AnimatedCard>
                            </motion.div>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mb: 6, borderRadius: 2 }}>
                    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Typography variant="h4" component="h2" gutterBottom fontFamily="Ubuntu" fontWeight={600}>
                                Присоединяйтесь к нашей библиотеке сегодня!
                            </Typography>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Typography variant="h6" paragraph>
                                Получите доступ к тысячам книг и материалов для учебы и научной работы
                            </Typography>
                        </motion.div>

                        {!isAuthenticated && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <Button
                                    component={RouterLink}
                                    to={ROUTES.REGISTER}
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    sx={{
                                        mt: 2,
                                        color: 'text.primary',
                                        fontWeight: 600,
                                        '&:hover': { bgcolor: 'secondary.dark' }
                                    }}
                                >
                                    Зарегистрироваться
                                </Button>
                            </motion.div>
                        )}
                    </Container>
                </Box>
            </motion.div>

            {/* Recent Additions */}
            <Container maxWidth="lg" sx={{ mb: 6 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        textAlign="center"
                        mb={4}
                        fontFamily="Ubuntu"
                        fontWeight={600}
                    >
                        Недавние поступления
                    </Typography>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    <Grid container spacing={4}>
                        {[1, 2, 3].map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item}>
                                <motion.div variants={staggerItem}>
                                    <AnimatedCard
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 2
                                        }}
                                        whileHover={{
                                            y: -10,
                                            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)'
                                        }}
                                    >
                                        <CardMedia
                                            component="div"
                                            sx={{
                                                pt: '80%',
                                                bgcolor: 'grey.300',
                                            }}
                                            image=""
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="h3" gutterBottom>
                                                Книга #{item}
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                Краткое описание книги или учебника, автор, год издания и т.д.
                                            </Typography>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    component={RouterLink}
                                                    to={isAuthenticated ? `/book/${item}` : ROUTES.LOGIN}
                                                >
                                                    Подробнее
                                                </Button>
                                            </motion.div>
                                        </CardContent>
                                    </AnimatedCard>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </AnimatedBox>
    );
};

export default Home;