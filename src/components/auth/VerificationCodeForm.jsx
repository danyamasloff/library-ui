import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Alert,
    Paper,
} from '@mui/material';
import { verificationCodeSchema } from '@/utils/validation';
import { getVerificationCode } from '@/redux/slices/authSlice';

const VerificationCodeForm = ({ email, onCodeRequested }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const [codeSent, setCodeSent] = useState(false);
    const [sentToEmail, setSentToEmail] = useState('');

    const initialValues = {
        email: email || '',
    };

    // ИСПРАВЛЕНО: Предотвращаем действия по умолчанию и обрабатываем отправку асинхронно
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const result = await dispatch(getVerificationCode(values.email));
            if (!result.error) {
                // Устанавливаем состояние успешной отправки
                setCodeSent(true);
                setSentToEmail(values.email);

                // Вызываем колбэк, если он был передан
                if (onCodeRequested) {
                    onCodeRequested(values.email);
                }
            }
        } catch (error) {
            console.error('Ошибка при запросе кода:', error);
        } finally {
            // Убираем состояние загрузки формы
            setSubmitting(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 480, mx: 'auto', borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom align="center" fontFamily="Ubuntu" fontWeight={600}>
                Получить код подтверждения
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3} align="center">
                Введите ваш email для получения кода подтверждения
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {codeSent && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Код подтверждения отправлен на {sentToEmail}
                </Alert>
            )}

            <Formik
                initialValues={initialValues}
                validationSchema={verificationCodeSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ values, errors, touched, isValid, handleChange, handleBlur, isSubmitting }) => (
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

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading || !isValid || isSubmitting}
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            {loading || isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Отправить код'
                            )}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default VerificationCodeForm;