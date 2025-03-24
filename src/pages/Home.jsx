import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
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

const Home = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <Box>
            {/* Hero Section */}
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
                            <Typography
                                variant="h3"
                                component="h1"
                                gutterBottom
                                fontFamily="Ubuntu"
                                fontWeight={700}
                            >
                                Библиотека ИУЦТ ЦТУТП
                            </Typography>
                            <Typography variant="h6" paragraph>
                                Доступ к электронным ресурсам для студентов и преподавателей института управления и цифровых технологий
                            </Typography>
                            <Stack direction="row" spacing={2} mt={4}>
                                {isAuthenticated ? (
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
                                ) : (
                                    <>
                                        <Button
                                            component={RouterLink}
                                            to={ROUTES.LOGIN}
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                        >
                                            Войти
                                        </Button>
                                        <Button
                                            component={RouterLink}
                                            to={ROUTES.REGISTER}
                                            variant="outlined"
                                            color="primary"
                                            size="large"
                                        >
                                            Регистрация
                                        </Button>
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
                                <LocalLibraryIcon sx={{ fontSize: 240, color: 'primary.main', opacity: 0.6 }} />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ mb: 6 }}>
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
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                            <Box sx={{ p: 2, bgcolor: 'secondary.light', display: 'flex', justifyContent: 'center' }}>
                                <LibraryBooksIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                                    Электронный каталог
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Доступ к полной коллекции учебной и научной литературы в электронном формате
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                            <Box sx={{ p: 2, bgcolor: 'secondary.light', display: 'flex', justifyContent: 'center' }}>
                                <MenuBookIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                                    Онлайн доступ
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Читайте книги и статьи в любое время и в любом месте через интернет
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                            <Box sx={{ p: 2, bgcolor: 'secondary.light', display: 'flex', justifyContent: 'center' }}>
                                <SchoolIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                                    Учебные материалы
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Методические пособия, учебники и другие материалы для успешной учебы
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                            <Box sx={{ p: 2, bgcolor: 'secondary.light', display: 'flex', justifyContent: 'center' }}>
                                <LocalLibraryIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                            </Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                                    Научные работы
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Доступ к научным статьям, диссертациям и результатам исследований
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mb: 6, borderRadius: 2 }}>
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" component="h2" gutterBottom fontFamily="Ubuntu" fontWeight={600}>
                        Присоединяйтесь к нашей библиотеке сегодня!
                    </Typography>
                    <Typography variant="h6" paragraph>
                        Получите доступ к тысячам книг и материалов для учебы и научной работы
                    </Typography>
                    {!isAuthenticated && (
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
                    )}
                </Container>
            </Box>

            {/* Recent Additions */}
            <Container maxWidth="lg" sx={{ mb: 6 }}>
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
                <Grid container spacing={4}>
                    {[1, 2, 3].map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
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
                                    <Button
                                        size="small"
                                        color="primary"
                                        component={RouterLink}
                                        to={isAuthenticated ? `/book/${item}` : ROUTES.LOGIN}
                                    >
                                        Подробнее
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;