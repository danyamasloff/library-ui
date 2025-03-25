import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Stack,
    useTheme,
    alpha
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { ROUTES } from '@utils/constants.js';

const AnimatedHeroSection = ({ isAuthenticated }) => {
    const theme = useTheme();

    // Усовершенствованные анимации для более заметного эффекта
    const titleVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const subtitleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.3,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
            transition: { duration: 0.3 }
        },
        tap: {
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    const iconVariants = {
        hidden: { opacity: 0, scale: 0.5, rotate: -20 },
        visible: {
            opacity: 0.8,
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 0.2
            }
        },
        floating: {
            y: [0, -15, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const decorationVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 0.3,
            transition: { duration: 1.5, delay: 0.5 }
        }
    };

    return (
        <Box
            sx={{
                position: 'relative',
                bgcolor: theme.palette.mode === 'light'
                    ? alpha(theme.palette.primary.light, 0.3)
                    : alpha(theme.palette.primary.dark, 0.2),
                py: { xs: 6, md: 10 },
                borderRadius: 3,
                mb: 6,
                overflow: 'hidden',
                boxShadow: '0px 5px 20px rgba(0, 0, 0, 0.05)',
            }}
        >
            {/* Декоративные элементы для добавления глубины и интереса */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={decorationVariants}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: -100,
                        left: -100,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.4)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
                        zIndex: 0
                    }}
                />
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={decorationVariants}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -50,
                        right: -50,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.4)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
                        zIndex: 0
                    }}
                />
            </motion.div>

            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                    <Grid item xs={12} md={7}>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={titleVariants}
                        >
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                fontFamily="Ubuntu"
                                fontWeight={700}
                                color="primary.dark"
                                sx={{
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                    letterSpacing: '-0.5px'
                                }}
                            >
                                Библиотека ИУЦТ ЦТУТП
                            </Typography>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={subtitleVariants}
                        >
                            <Typography
                                variant="h5"
                                paragraph
                                color="text.secondary"
                                sx={{
                                    maxWidth: '90%',
                                    lineHeight: 1.5,
                                    mb: 4,
                                    fontWeight: 400
                                }}
                            >
                                Доступ к электронным ресурсам для студентов и преподавателей института управления и цифровых технологий
                            </Typography>
                        </motion.div>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
                            {isAuthenticated ? (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={buttonVariants}
                                >
                                    <Button
                                        component={RouterLink}
                                        to="/catalog"
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        startIcon={<MenuBookIcon />}
                                        sx={{
                                            py: 1.5,
                                            px: 4,
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            borderRadius: 2
                                        }}
                                    >
                                        Перейти к каталогу
                                    </Button>
                                </motion.div>
                            ) : (
                                <>
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        whileTap="tap"
                                        variants={buttonVariants}
                                    >
                                        <Button
                                            component={RouterLink}
                                            to={ROUTES.LOGIN}
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            sx={{
                                                py: 1.5,
                                                px: 4,
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                borderRadius: 2
                                            }}
                                        >
                                            Войти
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        whileTap="tap"
                                        variants={buttonVariants}
                                        style={{ marginLeft: '16px' }}
                                    >
                                        <Button
                                            component={RouterLink}
                                            to={ROUTES.REGISTER}
                                            variant="outlined"
                                            color="primary"
                                            size="large"
                                            sx={{
                                                py: 1.5,
                                                px: 4,
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                borderRadius: 2
                                            }}
                                        >
                                            Регистрация
                                        </Button>
                                    </motion.div>
                                </>
                            )}
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            position: 'relative'
                        }}>
                            {/* Основная иконка с анимацией парения */}
                            <motion.div
                                initial="hidden"
                                animate={["visible", "floating"]}
                                variants={iconVariants}
                            >
                                <LocalLibraryIcon
                                    sx={{
                                        fontSize: { xs: 160, md: 260 },
                                        color: theme.palette.primary.main,
                                        filter: 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.1))'
                                    }}
                                />
                            </motion.div>

                            {/* Декоративные элементы вокруг иконки */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0)} 30%, ${alpha(theme.palette.background.default, 0.15)} 70%)`,
                                    zIndex: -1
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AnimatedHeroSection;