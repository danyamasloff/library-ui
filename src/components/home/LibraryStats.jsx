import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import {
    Box,
    Container,
    Grid,
    Typography,
    Paper,
    useTheme,
    alpha,
    LinearProgress,
    Divider
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useInView } from 'react-intersection-observer';

// Компонент для анимированного счетчика цифр
const AnimatedCounter = ({ value, duration = 2, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const controls = useAnimation();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2
    });

    useEffect(() => {
        if (inView) {
            let startTime;
            let animationFrame;

            const animation = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
                setCount(Math.floor(progress * value));

                if (progress < 1) {
                    animationFrame = requestAnimationFrame(animation);
                }
            };

            animationFrame = requestAnimationFrame(animation);

            return () => cancelAnimationFrame(animationFrame);
        }
    }, [inView, value, duration]);

    return (
        <motion.div ref={ref}>
            <Typography
                variant="h3"
                component="span"
                fontWeight={700}
                color="primary.main"
            >
                {count.toLocaleString()}{suffix}
            </Typography>
        </motion.div>
    );
};

// Компонент анимированного прогресс-бара с "прыгающим" индикатором
const JumpingProgressBar = ({ value, color = 'primary.main', height = 8, labelText }) => {
    const theme = useTheme();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2
    });
    const [animValue, setAnimValue] = useState(0);

    useEffect(() => {
        if (inView) {
            const timer = setTimeout(() => setAnimValue(value), 300);
            return () => clearTimeout(timer);
        }
    }, [inView, value]);

    return (
        <Box ref={ref} sx={{ mb: 2, width: '100%' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5
            }}>
                <Typography variant="body2" fontWeight={500}>
                    {labelText}
                </Typography>
                <Typography variant="body2" fontWeight={700} color={color}>
                    {animValue}%
                </Typography>
            </Box>
            <Box sx={{
                position: 'relative',
                height: height,
                bgcolor: alpha(theme.palette.grey[300], 0.5),
                borderRadius: 5,
                overflow: 'hidden'
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${animValue}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: 5,
                    }}
                />

                {/* Прыгающий индикатор */}
                {inView && (
                    <motion.div
                        initial={{ left: 0, scale: 0 }}
                        animate={{
                            left: `${animValue}%`,
                            scale: 1,
                            y: [0, -10, 0],
                        }}
                        transition={{
                            left: { duration: 1.5, ease: "easeOut" },
                            scale: { duration: 0.5 },
                            y: {
                                duration: 0.5,
                                repeat: 3,
                                repeatType: "reverse",
                                ease: "easeInOut",
                                delay: 1.5
                            }
                        }}
                        style={{
                            position: 'absolute',
                            top: -7,
                            transform: 'translateX(-50%)',
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
                            border: `2px solid ${theme.palette.primary.main}`,
                            zIndex: 1
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};

const LibraryStats = () => {
    const theme = useTheme();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <Container maxWidth="lg">
            <motion.div
                ref={ref}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        fontFamily="Ubuntu"
                        fontWeight={600}
                        gutterBottom
                    >
                        Наша библиотека в цифрах
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ maxWidth: 700, mx: 'auto' }}
                    >
                        Электронная библиотека Института управления и цифровых технологий постоянно пополняется новыми изданиями
                    </Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {/* Карточки со статистикой */}
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 3,
                                    backgroundColor: alpha(theme.palette.primary.light, 0.1),
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.1)}`,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <AutoStoriesIcon
                                        sx={{
                                            fontSize: 60,
                                            color: alpha(theme.palette.primary.main, 0.8),
                                            mb: 2
                                        }}
                                    />
                                </motion.div>
                                <AnimatedCounter value={12580} suffix="+" />
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={500}
                                    sx={{ mt: 1 }}
                                >
                                    Книг в каталоге
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 3,
                                    backgroundColor: alpha(theme.palette.secondary.light, 0.1),
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    boxShadow: `0 5px 15px ${alpha(theme.palette.secondary.main, 0.1)}`,
                                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <PeopleAltIcon
                                        sx={{
                                            fontSize: 60,
                                            color: alpha(theme.palette.secondary.dark, 0.8),
                                            mb: 2
                                        }}
                                    />
                                </motion.div>
                                <AnimatedCounter value={3254} />
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={500}
                                    sx={{ mt: 1 }}
                                >
                                    Активных пользователей
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 3,
                                    backgroundColor: alpha(theme.palette.success.light, 0.1),
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    boxShadow: `0 5px 15px ${alpha(theme.palette.success.main, 0.1)}`,
                                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <DownloadIcon
                                        sx={{
                                            fontSize: 60,
                                            color: alpha(theme.palette.success.main, 0.8),
                                            mb: 2
                                        }}
                                    />
                                </motion.div>
                                <AnimatedCounter value={45720} />
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={500}
                                    sx={{ mt: 1 }}
                                >
                                    Загрузок материалов
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 3,
                                    backgroundColor: alpha(theme.palette.warning.light, 0.1),
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    boxShadow: `0 5px 15px ${alpha(theme.palette.warning.main, 0.1)}`,
                                    border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <TrendingUpIcon
                                        sx={{
                                            fontSize: 60,
                                            color: alpha(theme.palette.warning.dark, 0.8),
                                            mb: 2
                                        }}
                                    />
                                </motion.div>
                                <AnimatedCounter value={1256} suffix="+" />
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={500}
                                    sx={{ mt: 1 }}
                                >
                                    Новых книг за год
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* Графический блок со статистикой */}
                <motion.div variants={itemVariants}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.05)}`,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`,
                            backdropFilter: 'blur(5px)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Декоративный элемент */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.1)} 0%, rgba(255,255,255,0) 70%)`,
                                zIndex: 0
                            }}
                        />

                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography
                                variant="h5"
                                fontFamily="Ubuntu"
                                fontWeight={600}
                                gutterBottom
                            >
                                Анализ использования библиотеки
                            </Typography>

                            <Grid container spacing={4} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={6}>
                                    {/* Прогресс-бары с "прыгающими" индикаторами */}
                                    <Box sx={{ mb: 4 }}>
                                        <JumpingProgressBar value={78} labelText="Электронные книги" color={theme.palette.primary.main} />
                                        <JumpingProgressBar value={64} labelText="Учебные материалы" color={theme.palette.secondary.main} />
                                        <JumpingProgressBar value={86} labelText="Научная литература" color={theme.palette.success.main} />
                                        <JumpingProgressBar value={42} labelText="Периодические издания" color={theme.palette.warning.main} />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                                Статистика по факультетам
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Информационные технологии
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} color="primary.main">
                                                    38%
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Транспортные системы
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} color="primary.main">
                                                    27%
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Экономика и управление
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} color="primary.main">
                                                    21%
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    Другие факультеты
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} color="primary.main">
                                                    14%
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mt: 4 }}>
                                            <Divider sx={{ mb: 2 }} />
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Данные обновлены: {new Date().toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </motion.div>
            </motion.div>
        </Container>
    );
};

export default LibraryStats;