import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import RegisterForm from '../components/auth/RegisterForm';
import { AnimatedBox, pageTransition } from '../components/ui/AnimatedComponents';
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
            <AnimatedBox
                sx={{ py: 4 }}
                {...pageTransition}
            >
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
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
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <RegisterForm />
                </motion.div>
            </AnimatedBox>
        </Container>
    );
};

export default Register;