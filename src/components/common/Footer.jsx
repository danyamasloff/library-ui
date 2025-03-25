import { Box, Container, Grid, Typography, Link, Paper, Divider, IconButton, Tooltip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useColorMode } from '@ui/ThemeProvider';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import { motion } from 'framer-motion';

const Footer = () => {
    const { mode } = useColorMode();

    return (
        <Box
            sx={{
                background: mode === 'light'
                    ? 'linear-gradient(180deg, rgba(245,245,245,0.4) 0%, rgba(245,245,245,0.9) 15%, rgba(245,245,245,1) 100%)'
                    : 'linear-gradient(180deg, rgba(25,25,25,0.4) 0%, rgba(35,35,35,0.9) 15%, rgba(45,45,45,1) 100%)',
                py: 6,
                borderTop: `1px solid ${mode === 'light' ? 'rgba(224,224,224,0.8)' : 'rgba(66,66,66,0.8)'}`,
                backdropFilter: 'blur(10px)',
                mt: 'auto',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: mode === 'light'
                    ? 'inset 0px 5px 15px rgba(0,0,0,0.03)'
                    : 'inset 0px 5px 15px rgba(0,0,0,0.1)',
            }}
            component="footer"
        >
            {/* Декоративные элементы */}
            <Box sx={{
                position: 'absolute',
                top: -20,
                left: '5%',
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: mode === 'light' ? 'rgba(188, 198, 180, 0.15)' : 'rgba(141, 158, 123, 0.05)',
                zIndex: 0
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: mode === 'light' ? 'rgba(239, 215, 187, 0.15)' : 'rgba(217, 185, 144, 0.05)',
                zIndex: 0
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            component={motion.div}
                            whileHover={{ y: -5, boxShadow: 3 }}
                            transition={{ duration: 0.3 }}
                            sx={{
                                p: 3,
                                height: '100%',
                                backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(40,40,40,0.5)',
                                backdropFilter: 'blur(5px)',
                                borderRadius: 2,
                                borderTop: `3px solid ${mode === 'light' ? 'primary.main' : 'primary.dark'}`
                            }}
                        >
                            <Typography variant="h6" color="primary.main" fontFamily="Ubuntu" fontWeight={700} gutterBottom>
                                ИУЦТ ЦТУТП
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Библиотека института управления и цифровых технологий
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Tooltip title="Facebook">
                                    <IconButton size="small" color="primary">
                                        <FacebookIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Twitter">
                                    <IconButton size="small" color="primary">
                                        <TwitterIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Instagram">
                                    <IconButton size="small" color="primary">
                                        <InstagramIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Telegram">
                                    <IconButton size="small" color="primary">
                                        <TelegramIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            component={motion.div}
                            whileHover={{ y: -5, boxShadow: 3 }}
                            transition={{ duration: 0.3 }}
                            sx={{
                                p: 3,
                                height: '100%',
                                backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(40,40,40,0.5)',
                                backdropFilter: 'blur(5px)',
                                borderRadius: 2,
                                borderTop: `3px solid ${mode === 'light' ? 'primary.main' : 'primary.dark'}`
                            }}
                        >
                            <Typography variant="h6" color="text.primary" fontFamily="Ubuntu" gutterBottom>
                                Навигация
                            </Typography>
                            <Link component={RouterLink} to="/" color="text.secondary" display="block" sx={{ mb: 1.5, '&:hover': {color: 'primary.main'} }}>
                                Главная
                            </Link>
                            <Link component={RouterLink} to="/catalog" color="text.secondary" display="block" sx={{ mb: 1.5, '&:hover': {color: 'primary.main'} }}>
                                Каталог
                            </Link>
                            <Link component={RouterLink} to="/about" color="text.secondary" display="block" sx={{ mb: 1.5, '&:hover': {color: 'primary.main'} }}>
                                О библиотеке
                            </Link>
                            <Link component={RouterLink} to="/rules" color="text.secondary" display="block" sx={{ mb: 1.5, '&:hover': {color: 'primary.main'} }}>
                                Правила пользования
                            </Link>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            component={motion.div}
                            whileHover={{ y: -5, boxShadow: 3 }}
                            transition={{ duration: 0.3 }}
                            sx={{
                                p: 3,
                                height: '100%',
                                backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(40,40,40,0.5)',
                                backdropFilter: 'blur(5px)',
                                borderRadius: 2,
                                borderTop: `3px solid ${mode === 'light' ? 'primary.main' : 'primary.dark'}`
                            }}
                        >
                            <Typography variant="h6" color="text.primary" fontFamily="Ubuntu" gutterBottom>
                                Полезные ссылки
                            </Typography>
                            <Link href="https://miit.ru/" target="_blank" color="text.secondary" display="block" sx={{ mb: 1.5, '&:hover': {color: 'primary.main'} }}>
                                Сайт РУТ (МИИТ)
                            </Link>
                            <Link href="https://library.miit.ru/" target="_blank" color="text.secondary" display="block" sx={{ mb: 1.5, '&:hover': {color: 'primary.main'} }}>
                                Научно-техническая библиотека
                            </Link>
                            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1.5, '&:hover': {color: 'primary.main'} }}>
                                Электронные ресурсы
                            </Link>
                            <Link href="#" color="text.secondary" display="block" sx={{ mb: 1.5, '&:hover': {color: 'primary.main'} }}>
                                Помощь читателю
                            </Link>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            elevation={0}
                            component={motion.div}
                            whileHover={{ y: -5, boxShadow: 3 }}
                            transition={{ duration: 0.3 }}
                            sx={{
                                p: 3,
                                height: '100%',
                                backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(40,40,40,0.5)',
                                backdropFilter: 'blur(5px)',
                                borderRadius: 2,
                                borderTop: `3px solid ${mode === 'light' ? 'primary.main' : 'primary.dark'}`
                            }}
                        >
                            <Typography variant="h6" color="text.primary" fontFamily="Ubuntu" gutterBottom>
                                Контакты
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                Адрес: г. Москва, ул. Образцова, д. 9, стр. 9
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                Телефон: +7 (495) 000-00-00
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                Email: library@iuct.ru
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Часы работы: Пн-Пт 10:00-18:00
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Divider sx={{
                    my: 4,
                    opacity: 0.7,
                    borderColor: mode === 'light' ? 'rgba(224,224,224,0.8)' : 'rgba(66,66,66,0.8)',
                }} />

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 0 }
                }}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} ИУЦТ ЦТУТП. Все права защищены.
                    </Typography>
                    <Box>
                        <Link color="text.secondary" sx={{ mx: 1, fontSize: '0.875rem', '&:hover': {color: 'primary.main'} }}>
                            Политика конфиденциальности
                        </Link>
                        <Link color="text.secondary" sx={{ mx: 1, fontSize: '0.875rem', '&:hover': {color: 'primary.main'} }}>
                            Условия использования
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;