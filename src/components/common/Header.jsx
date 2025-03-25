import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Link,
    Badge,
    Divider,
    useTheme,
    alpha
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { logout } from '@redux/slices/authSlice';
import { ROUTES } from '@utils/constants';
import ThemeToggleButton from '@components/ui/ThemeToggleButton';
import { useColorMode } from '@components/ui/ThemeProvider';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const theme = useTheme();
    const { mode } = useColorMode();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);

    // Отслеживаем скролл для анимации шапки
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleCloseUserMenu();
        navigate(ROUTES.HOME);
    };

    // Навигационные ссылки
    const navLinks = [
        { name: 'Главная', path: ROUTES.HOME },
        { name: 'Каталог', path: ROUTES.CATALOG },
        { name: 'О библиотеке', path: '/about' },
    ];

    // Настройки пользовательского меню
    const userSettings = isAuthenticated
        ? [
            { name: 'Личный кабинет', action: () => navigate('/dashboard') },
            { name: 'Мой профиль', action: () => navigate('/profile') },
            { name: 'Мои книги', action: () => navigate('/my-books') },
            { name: 'Выйти', action: handleLogout },
        ]
        : [];

    // Определяем активный путь для подсветки меню
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease-in-out'
            }}
            component={motion.header}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Логотип для десктопа */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'Ubuntu',
                            fontWeight: 700,
                            color: 'primary.main',
                            textDecoration: 'none',
                        }}
                    >
                        ИУЦТ ЦТУТП
                    </Typography>

                    {/* Меню мобильной навигации */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="навигационное меню"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {navLinks.map((link) => (
                                <MenuItem
                                    key={link.name}
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigate(link.path);
                                    }}
                                    selected={isActive(link.path)}
                                >
                                    <Typography textAlign="center">{link.name}</Typography>
                                </MenuItem>
                            ))}
                            {!isAuthenticated && (
                                <MenuItem
                                    onClick={() => {
                                        handleCloseNavMenu();
                                        navigate(ROUTES.LOGIN);
                                    }}
                                >
                                    <Typography textAlign="center">Войти</Typography>
                                </MenuItem>
                            )}
                            <Divider />
                            <MenuItem>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                                    <Typography>Сменить тему</Typography>
                                    <ThemeToggleButton />
                                </Box>
                            </MenuItem>
                        </Menu>
                    </Box>

                    {/* Логотип для мобильных устройств */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'Ubuntu',
                            fontWeight: 700,
                            color: 'primary.main',
                            textDecoration: 'none',
                        }}
                    >
                        ИУЦТ ЦТУТП
                    </Typography>

                    {/* Навигация для десктопа */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {navLinks.map((link) => (
                            <Button
                                key={link.name}
                                component={RouterLink}
                                to={link.path}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: isActive(link.path) ? 'primary.main' : 'text.primary',
                                    display: 'block',
                                    mx: 1,
                                    borderBottom: isActive(link.path) ? '2px solid' : 'none',
                                    borderColor: 'primary.main',
                                    borderRadius: 0,
                                    fontWeight: isActive(link.path) ? 600 : 400,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        borderBottom: '2px solid',
                                        borderColor: 'primary.light',
                                    },
                                }}
                            >
                                {link.name}
                            </Button>
                        ))}
                    </Box>

                    {/* Кнопка поиска и переключения темы */}
                    <Box sx={{ display: 'flex', mr: 2 }}>
                        <Tooltip title="Поиск книг">
                            <IconButton
                                color="inherit"
                                sx={{
                                    mr: 1,
                                    bgcolor: theme.palette.mode === 'light'
                                        ? 'rgba(0, 0, 0, 0.04)'
                                        : 'rgba(255, 255, 255, 0.08)',
                                }}
                                onClick={() => navigate(ROUTES.CATALOG)}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>

                        {/* Переключатель темы - виден только на десктопе */}
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <ThemeToggleButton />
                        </Box>
                    </Box>

                    {/* Аутентификация и профиль пользователя */}
                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                        {isAuthenticated ? (
                            <>
                                {/* Кнопка уведомлений */}
                                <Tooltip title="Уведомления">
                                    <IconButton
                                        sx={{ mr: 2 }}
                                        color="inherit"
                                        aria-label="notifications"
                                    >
                                        <Badge badgeContent={3} color="primary">
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>

                                {/* Кнопка профиля с анимацией при наведении */}
                                <Tooltip title="Открыть меню профиля">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    border: '2px solid',
                                                    borderColor: 'primary.light'
                                                }}
                                            >
                                                {user?.firstName?.charAt(0) || 'П'}
                                            </Avatar>
                                        </IconButton>
                                    </motion.div>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {userSettings.map((setting) => (
                                        <MenuItem key={setting.name} onClick={setting.action}>
                                            <Typography textAlign="center">{setting.name}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex' }}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        component={RouterLink}
                                        to={ROUTES.LOGIN}
                                        color="primary"
                                        sx={{ mx: 1 }}
                                    >
                                        Войти
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        component={RouterLink}
                                        to={ROUTES.REGISTER}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Регистрация
                                    </Button>
                                </motion.div>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;