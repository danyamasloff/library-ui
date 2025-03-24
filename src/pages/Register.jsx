import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';
import { ROUTES } from '../utils/constants';

const Register = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Перенаправляем на дашборд, если пользователь уже авторизован
    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTES.DASHBOARD);
        }
    }, [isAuthenticated, navigate]);

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    textAlign="center"
                    gutterBottom
                    fontFamily="Ubuntu"
                    fontWeight={700}
                    color="primary.main"
                >
                    Библиотека ИУЦТ ЦТУТП
                </Typography>
                <RegisterForm />
            </Box>
        </Container>
    );
};

export default Register;