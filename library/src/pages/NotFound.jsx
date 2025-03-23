import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ROUTES } from '../utils/constants';

const NotFound = () => {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    textAlign: 'center',
                }}
            >
                <ErrorOutlineIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    fontFamily="Ubuntu"
                    fontWeight={700}
                >
                    404
                </Typography>
                <Typography variant="h4" gutterBottom fontFamily="Ubuntu">
                    Страница не найдена
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 480 }}>
                    Извините, но страница, которую вы пытаетесь найти, не существует или была перемещена.
                </Typography>
                <Button
                    component={RouterLink}
                    to={ROUTES.HOME}
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 2 }}
                >
                    Вернуться на главную
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;