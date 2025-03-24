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
import { verificationCodeSchema } from '../../utils/validation';
import { getVerificationCode } from '../../redux/slices/authSlice';

const VerificationCodeForm = ({ email, onCodeRequested }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const initialValues = {
        email: email || '',
    };

    const handleSubmit = async (values) => {
        const result = await dispatch(getVerificationCode(values.email));
        if (!result.error && onCodeRequested) {
            onCodeRequested(values.email);
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

            <Formik
                initialValues={initialValues}
                validationSchema={verificationCodeSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, isValid, handleChange, handleBlur }) => (
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
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading || !isValid}
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Отправить код'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default VerificationCodeForm;