import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ROUTES } from '@utils/constants';

/**
 * Компонент ProtectedRoute - защищает маршруты, требующие авторизации
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - дочерние компоненты
 * @param {boolean} props.requireAuth - требуется ли авторизация для доступа (по умолчанию true)
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children, requireAuth = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, loading } = useSelector(state => state.auth);

    useEffect(() => {
        // Если требуется авторизация, но пользователь не авторизован
        if (requireAuth && !loading && !isAuthenticated) {
            // Сохраняем текущий путь для возврата после авторизации
            navigate(ROUTES.LOGIN, {
                state: { from: location.pathname },
                replace: true
            });
        }

        // Если пользователь авторизован, но находится на странице логина/регистрации
        if (!requireAuth && !loading && isAuthenticated) {
            navigate(ROUTES.DASHBOARD);
        }
    }, [navigate, location, isAuthenticated, requireAuth, loading]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh'
                }}
            >
                <CircularProgress size={60} />
                <Typography variant="body1" sx={{ mt: 3 }}>
                    Проверка авторизации...
                </Typography>
            </Box>
        );
    }

    // Возвращаем дочерние элементы только если выполняется условие доступа:
    // - Если требуется авторизация и пользователь авторизован
    // - Если не требуется авторизация и пользователь не авторизован
    if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
        return children;
    }

    // В остальных случаях ничего не показываем, т.к. будет перенаправление
    return null;
};

export default ProtectedRoute;