import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { logout } from '../../redux/slices/authSlice';
import { ROUTES } from '../../utils/constants';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

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
        { name: 'Каталог', path: '/catalog' },
        { name: 'О библиотеке', path: '/about' },
    ];

    // Настройки пользовательского меню
    const userSettings = isAuthenticated
        ? [
            { name: 'Профиль', action: () => navigate('/profile') },
            { name: 'Мои книги', action: () => navigate('/my-books') },
            { name: 'Выйти', action: handleLogout },
        ]
        : [];

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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
                                >
                                    <Typography textAlign="center">{link.name}</Typography>
                                </MenuItem>
                            ))}
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
                                sx={{ my: 2, color: 'text.primary', display: 'block', mx: 1 }}
                            >
                                {link.name}
                            </Button>
                        ))}
                    </Box>

                    {/* Аутентификация и профиль пользователя */}
                    <Box sx={{ flexGrow: 0 }}>
                        {isAuthenticated ? (
                            <>
                                <Tooltip title="Открыть настройки">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                                            {user?.firstName?.charAt(0) || 'П'}
                                        </Avatar>
                                    </IconButton>
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
                                <Button
                                    component={RouterLink}
                                    to={ROUTES.LOGIN}
                                    color="primary"
                                    sx={{ mx: 1 }}
                                >
                                    Войти
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to={ROUTES.REGISTER}
                                    variant="contained"
                                    color="primary"
                                >
                                    Регистрация
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;