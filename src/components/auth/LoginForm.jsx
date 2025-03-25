import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
    Alert,
    Paper,
    Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginSchema } from '@/utils/validation';
import { login, getVerificationCode } from '@/redux/slices/authSlice';
import { ROUTES } from '@/utils/constants';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, verificationEmail } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [codeRequested, setCodeRequested] = useState(false);
    const [emailForCode, setEmailForCode] = useState('');
    // Состояние для отслеживания запроса кода
    const [requestingCode, setRequestingCode] = useState(false);

    const initialValues = {
        email: verificationEmail || '',
        password: '',
        entryCode: '',
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const result = await dispatch(login(values));
        if (!result.error) {
            navigate(ROUTES.DASHBOARD);
        }
        setSubmitting(false);
    };

    // ИСПРАВЛЕНО: Обработчик запроса кода без перезагрузки страницы
    const handleRequestCode = async (email, setFieldValue) => {
        if (!email || requestingCode) return;

        setRequestingCode(true);
        setEmailForCode(email);

        try {
            const result = await dispatch(getVerificationCode(email));
            if (!result.error) {
                setCodeRequested(true);

                // Опционально: устанавливаем фокус на поле кода
                const codeInput = document.getElementById('entryCode');
                if (codeInput) {
                    codeInput.focus();
                }

                // Сообщение для пользователя
                console.log('Код успешно отправлен на email:', email);
            }
        } catch (error) {
            console.error('Ошибка при запросе кода:', error);
        } finally {
            setRequestingCode(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 480, mx: 'auto', borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" fontFamily="Ubuntu" fontWeight={700}>
                Вход в аккаунт
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3} align="center">
                Введите ваши учетные данные для входа в систему
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {codeRequested && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Код для входа отправлен на почту {emailForCode}
                </Alert>
            )}

            <Formik
                initialValues={initialValues}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ values, errors, touched, isValid, handleChange, handleBlur, setFieldValue }) => (
                    <Form>
                        <Field
                            as={TextField}
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.email && Boolean(errors.email)}
                            helperText={touched.email && errors.email}
                            margin="normal"
                            variant="outlined"
                            autoComplete="email"
                        />

                        <Field
                            as={TextField}
                            fullWidth
                            id="password"
                            name="password"
                            label="Пароль"
                            type={showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            margin="normal"
                            variant="outlined"
                            autoComplete="current-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleTogglePassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                            <Field
                                as={TextField}
                                fullWidth
                                id="entryCode"
                                name="entryCode"
                                label="Код подтверждения"
                                value={values.entryCode}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.entryCode && Boolean(errors.entryCode)}
                                helperText={touched.entryCode && errors.entryCode}
                                margin="normal"
                                variant="outlined"
                                autoComplete="one-time-code"
                            />
                            {/* ИСПРАВЛЕНО: Используем тип button вместо submit и предотвращаем сброс формы */}
                            <Button
                                type="button"
                                variant="outlined"
                                color="primary"
                                onClick={() => handleRequestCode(values.email, setFieldValue)}
                                disabled={!values.email || loading || requestingCode}
                                sx={{ ml: 1, height: 56, whiteSpace: 'nowrap', mt: 1 }}
                            >
                                {requestingCode ? <CircularProgress size={24} /> : 'Получить код'}
                            </Button>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading || !isValid}
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
                        </Button>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                Еще нет аккаунта?{' '}
                                <Link component={RouterLink} to={ROUTES.REGISTER} color="primary.main">
                                    Зарегистрироваться
                                </Link>
                            </Typography>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default LoginForm;