import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    Typography,
    Alert,
    Paper,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerSchema } from '../../utils/validation';
import { register } from '../../redux/slices/authSlice';
import { ROUTES } from '../../utils/constants';

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const initialValues = {
        firstName: '',
        secondName: '',
        thirdName: '',
        birthDate: '',  // Теперь это строка, а не объект даты
        email: '',
        password: '',
        confirmPassword: '',
    };

    const handleSubmit = async (values) => {
        const userData = { ...values };
        delete userData.confirmPassword;

        // Если нужна конвертация даты из строки в ISO, можно добавить здесь
        // if (userData.birthDate) {
        //   try {
        //     const date = new Date(userData.birthDate);
        //     userData.birthDate = date.toISOString();
        //   } catch (e) {
        //     console.error('Ошибка форматирования даты:', e);
        //   }
        // }

        const result = await dispatch(register(userData));
        if (!result.error) {
            setRegistrationSuccess(true);
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 3000);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" fontFamily="Ubuntu" fontWeight={700}>
                Регистрация в системе
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3} align="center">
                Заполните форму для создания нового аккаунта
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {registrationSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Регистрация успешно завершена! Сейчас вы будете перенаправлены на страницу входа.
                </Alert>
            )}

            <Formik
                initialValues={initialValues}
                validationSchema={registerSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, isValid, handleChange, handleBlur, setFieldValue }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    id="firstName"
                                    name="firstName"
                                    label="Имя"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.firstName && Boolean(errors.firstName)}
                                    helperText={touched.firstName && errors.firstName}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    id="secondName"
                                    name="secondName"
                                    label="Фамилия"
                                    value={values.secondName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.secondName && Boolean(errors.secondName)}
                                    helperText={touched.secondName && errors.secondName}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    id="thirdName"
                                    name="thirdName"
                                    label="Отчество (если есть)"
                                    value={values.thirdName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.thirdName && Boolean(errors.thirdName)}
                                    helperText={touched.thirdName && errors.thirdName}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/* Заменили DatePicker на обычный TextField с типом date */}
                                <Field
                                    as={TextField}
                                    fullWidth
                                    id="birthDate"
                                    name="birthDate"
                                    label="Дата рождения"
                                    type="date"
                                    value={values.birthDate}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.birthDate && Boolean(errors.birthDate)}
                                    helperText={touched.birthDate && errors.birthDate}
                                    margin="normal"
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>

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

                        <Field
                            as={TextField}
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Подтверждение пароля"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
                            margin="normal"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleToggleConfirmPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading || !isValid}
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Зарегистрироваться'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                Уже есть аккаунт?{' '}
                                <Link component={RouterLink} to={ROUTES.LOGIN} color="primary.main">
                                    Войти
                                </Link>
                            </Typography>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default RegisterForm;