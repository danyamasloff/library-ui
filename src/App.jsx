import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, CircularProgress, Box, Alert, Snackbar } from '@mui/material';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Dashboard from '@pages/Dashboard';
import Profile from '@pages/Profile';
import Catalog from '@pages/Catalog';
import NotFound from '@pages/NotFound';

// Components
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';
import ProtectedRoute from '@components/auth/ProtectedRoute';

// Auth
import { checkAuth, clearError } from '@redux/slices/authSlice';
import { ROUTES } from '@utils/constants';

function App() {
    const { isAuthenticated, loading: authLoading, error: authError } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [appLoading, setAppLoading] = useState(true);
    const [networkError, setNetworkError] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Проверяем статус авторизации при загрузке
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                await dispatch(checkAuth()).unwrap();
            } catch (error) {
                console.error('Auth check failed:', error);

                if (error && error.includes && error.includes('Network Error')) {
                    setNetworkError(true);
                }
            } finally {
                setAppLoading(false);
            }
        };

        checkAuthStatus();
    }, [dispatch]);

    // Слушаем сетевые ошибки
    useEffect(() => {
        const handleNetworkError = (event) => {
            console.warn('Network error detected:', event.detail);
            setNetworkError(true);
            setApiError('Проблема с подключением к серверу. Пожалуйста, проверьте соединение.');
        };

        const handleAuthExpired = () => {
            console.log('Auth token expired, redirecting to login');
            // Дополнительная логика при истечении токена, если нужна
        };

        const handleOnlineStatus = () => {
            // Восстанавливаем соединение при возвращении онлайн
            if (navigator.onLine) {
                setNetworkError(false);
                setApiError(null);
                // Опционально - перезагрузить данные
            } else {
                setNetworkError(true);
                setApiError('Отсутствует подключение к интернету');
            }
        };

        // Слушаем кастомные события от API клиента
        window.addEventListener('api-network-error', handleNetworkError);
        window.addEventListener('auth-expired', handleAuthExpired);

        // Слушаем статус сети
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('api-network-error', handleNetworkError);
            window.removeEventListener('auth-expired', handleAuthExpired);
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    // Очищаем ошибки авторизации при смене страницы
    useEffect(() => {
        if (authError) {
            dispatch(clearError());
        }
    }, [location.pathname, dispatch, authError]);

    // Закрытие сообщения об ошибке API
    const handleCloseApiError = () => {
        setApiError(null);
    };

    if (appLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <>
            <Header />
            <Container component="main" sx={{ py: 4, flexGrow: 1, minHeight: 'calc(100vh - 200px)' }}>
                {/* Показываем предупреждение о проблемах с сетью */}
                {networkError && (
                    <Alert
                        severity="warning"
                        sx={{ mb: 4 }}
                    >
                        Сервер недоступен или возникли проблемы с подключением. Некоторые функции могут быть недоступны.
                    </Alert>
                )}

                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        {/* Главная доступна всем */}
                        <Route path={ROUTES.HOME} element={<Home />} />

                        {/* Страницы аутентификации доступны только неавторизованным */}
                        <Route path={ROUTES.LOGIN} element={
                            <ProtectedRoute requireAuth={false}>
                                <Login />
                            </ProtectedRoute>
                        } />

                        <Route path={ROUTES.REGISTER} element={
                            <ProtectedRoute requireAuth={false}>
                                <Register />
                            </ProtectedRoute>
                        } />

                        {/* Страницы, требующие авторизации */}
                        <Route path={ROUTES.DASHBOARD} element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        <Route path={ROUTES.PROFILE} element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />

                        {/* Каталог требует авторизации */}
                        <Route path={ROUTES.CATALOG} element={
                            <ProtectedRoute>
                                <Catalog />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AnimatePresence>

                {/* Всплывающее сообщение об ошибке API */}
                <Snackbar
                    open={!!apiError}
                    autoHideDuration={6000}
                    onClose={handleCloseApiError}
                >
                    <Alert
                        onClose={handleCloseApiError}
                        severity="error"
                        sx={{ width: '100%' }}
                    >
                        {apiError}
                    </Alert>
                </Snackbar>
            </Container>
            <Footer />
        </>
    );
}

export default App;