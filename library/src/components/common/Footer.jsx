import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#F5F5F5',
                py: 4,
                borderTop: '1px solid #E0E0E0',
                mt: 'auto',
            }}
            component="footer"
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="primary.main" fontFamily="Ubuntu" fontWeight={700} gutterBottom>
                            ИУЦТ ЦТУТП
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Библиотека института управления и цифровых технологий
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" fontFamily="Ubuntu" gutterBottom>
                            Ссылки
                        </Typography>
                        <Link component={RouterLink} to="/" color="text.secondary" display="block" sx={{ mb: 1 }}>
                            Главная
                        </Link>
                        <Link component={RouterLink} to="/catalog" color="text.secondary" display="block" sx={{ mb: 1 }}>
                            Каталог
                        </Link>
                        <Link component={RouterLink} to="/about" color="text.secondary" display="block" sx={{ mb: 1 }}>
                            О библиотеке
                        </Link>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" fontFamily="Ubuntu" gutterBottom>
                            Контакты
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Адрес: г. Москва, ул. Образцова, д. 9, стр. 9
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Телефон: +7 (495) 000-00-00
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Email: library@iuct.ru
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #E0E0E0', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        © {new Date().getFullYear()} ИУЦТ ЦТУТП. Все права защищены.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;