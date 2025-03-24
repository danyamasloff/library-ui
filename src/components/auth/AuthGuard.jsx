import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkAuth } from '../../redux/slices/authSlice';
import { ROUTES } from '../../utils/constants';
import { CircularProgress, Box, Typography } from '@mui/material';

/**
 * Компонент AuthGuard проверяет наличие аутентификации
 * и перенаправляет на страницу входа, если пользователь не авторизован
 */
const AuthGuard = ({ children, requiredAuth = true }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, loading, authChecked } = useSelector(state => state.auth);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            if (!authChecked) {
                await dispatch(checkAuth());
            }
            setIsChecking(false);
        };

        checkAuthentication();
    }, [dispatch, authChecked]);

    useEffect(() => {
        if (!isChecking && !loading) {
            // Если требуется аутентификация, но пользователь не авторизован
            if (requiredAuth && !isAuthenticated) {
                navigate(ROUTES.LOGIN, {
                    state: { from: location.pathname },
                    replace: true
                });
            }

            // Если не требуется аутентификация (страницы входа/регистрации) и пользователь уже авторизован
            if (!requiredAuth && isAuthenticated) {
                navigate(ROUTES.DASHBOARD);
            }
        }
    }, [navigate, location, isAuthenticated, requiredAuth, isChecking, loading]);

    if (isChecking || loading) {
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

    // Возвращаем дочерние элементы только если они должны быть показаны
    if ((requiredAuth && isAuthenticated) || (!requiredAuth && !isAuthenticated)) {
        return children;
    }

    // В остальных случаях ничего не показываем, т.к. будет перенаправление
    return null;
};

export default AuthGuard;