import React from 'react';
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
    useTheme,
    alpha,
    Divider
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SchoolIcon from '@mui/icons-material/School';
import { ROUTES } from '@utils/constants';
import { AnimatedBox, AnimatedCard, pageTransition, staggerContainer, staggerItem } from '@components/ui/AnimatedComponents';

// Импортируем обновленные компоненты
import AnimatedHeroSection from '@components/home/AnimatedHeroSection';
import BlurredBookCarousel from '@components/home/BlurredBookCarousel';
import LibraryStats from '@components/home/LibraryStats';

const Home = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const theme = useTheme();

    // Анимация для секций
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 }
        }
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
            {/* Улучшенная секция Hero с анимациями */}
            <AnimatedHeroSection isAuthenticated={isAuthenticated} />

            {/* Возможности библиотеки - улучшенная секция */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={sectionVariants}
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
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <motion.div variants={staggerItem}>
                                <AnimatedCard
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 2,
                                        boxShadow: theme.palette.mode === 'light'
                                            ? '0 5px 15px rgba(0,0,0,0.05)'
                                            : '0 5px 15px rgba(0,0,0,0.1)',
                                        overflow: 'hidden'
                                    }}
                                    whileHover={{
                                        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                                        y: -10,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <Box sx={{
                                        p: 3,
                                        backgroundColor: alpha(theme.palette.secondary.light, 0.3),
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Декоративный фон */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0.2,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, transparent 100%)`,
                                                zIndex: 0
                                            }}
                                        />

                                        <motion.div {...iconAnimation} style={{ position: 'relative', zIndex: 1 }}>
                                            <LibraryBooksIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                                        </motion.div>
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
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
                                        borderRadius: 2,
                                        boxShadow: theme.palette.mode === 'light'
                                            ? '0 5px 15px rgba(0,0,0,0.05)'
                                            : '0 5px 15px rgba(0,0,0,0.1)',
                                        overflow: 'hidden'
                                    }}
                                    whileHover={{
                                        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                                        y: -10,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <Box sx={{
                                        p: 3,
                                        backgroundColor: alpha(theme.palette.secondary.light, 0.3),
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Декоративный фон */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0.2,
                                                background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, transparent 100%)`,
                                                zIndex: 0
                                            }}
                                        />

                                        <motion.div {...iconAnimation} style={{ position: 'relative', zIndex: 1 }}>
                                            <MenuBookIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                                        </motion.div>
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
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
                                        borderRadius: 2,
                                        boxShadow: theme.palette.mode === 'light'
                                            ? '0 5px 15px rgba(0,0,0,0.05)'
                                            : '0 5px 15px rgba(0,0,0,0.1)',
                                        overflow: 'hidden'
                                    }}
                                    whileHover={{
                                        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                                        y: -10,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <Box sx={{
                                        p: 3,
                                        backgroundColor: alpha(theme.palette.secondary.light, 0.3),
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Декоративный фон */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0.2,
                                                background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, transparent 100%)`,
                                                zIndex: 0
                                            }}
                                        />

                                        <motion.div {...iconAnimation} style={{ position: 'relative', zIndex: 1 }}>
                                            <SchoolIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                                        </motion.div>
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
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
                                        borderRadius: 2,
                                        boxShadow: theme.palette.mode === 'light'
                                            ? '0 5px 15px rgba(0,0,0,0.05)'
                                            : '0 5px 15px rgba(0,0,0,0.1)',
                                        overflow: 'hidden'
                                    }}
                                    whileHover={{
                                        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
                                        y: -10,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <Box sx={{
                                        p: 3,
                                        backgroundColor: alpha(theme.palette.secondary.light, 0.3),
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {/* Декоративный фон */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0.2,
                                                background: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, transparent 100%)`,
                                                zIndex: 0
                                            }}
                                        />

                                        <motion.div {...iconAnimation} style={{ position: 'relative', zIndex: 1 }}>
                                            <LocalLibraryIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                                        </motion.div>
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
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

            {/* Блок статистики с прыгающими индикаторами */}
            <Box sx={{ py: 4, mb: 6 }}>
                <LibraryStats />
            </Box>

            {/* Улучшенная карусель книг с блюром */}
            <Container maxWidth="lg" sx={{ mb: 6 }}>
                <BlurredBookCarousel
                    title="Новые поступления"
                    subtitle="Ознакомьтесь с последними добавленными книгами в нашей библиотеке"
                    isAuthenticated={isAuthenticated}
                />
            </Container>

            {/* CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        bgcolor: 'primary.main',
                        color: 'white',
                        py: 8,
                        mb: 6,
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}
                >
                    {/* Декоративные элементы */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -100,
                            left: -100,
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background: alpha(theme.palette.common.white, 0.05),
                            zIndex: 1
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -80,
                            right: -80,
                            width: 250,
                            height: 250,
                            borderRadius: '50%',
                            background: alpha(theme.palette.common.white, 0.05),
                            zIndex: 1
                        }}
                    />

                    <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Typography variant="h3" component="h2" gutterBottom fontFamily="Ubuntu" fontWeight={700}>
                                Присоединяйтесь к нашей библиотеке сегодня!
                            </Typography>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Typography variant="h6" paragraph sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
                                Получите доступ к тысячам книг и материалов для учебы и научной работы
                            </Typography>
                        </motion.div>

                        {!isAuthenticated && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
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
                                        py: 1.5,
                                        px: 5,
                                        borderRadius: 2,
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            bgcolor: 'secondary.dark',
                                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                                        }
                                    }}
                                >
                                    Зарегистрироваться
                                </Button>
                            </motion.div>
                        )}
                    </Container>
                </Box>
            </motion.div>
        </AnimatedBox>
    );
};

export default Home;