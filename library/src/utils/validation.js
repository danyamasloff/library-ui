import * as Yup from 'yup';
import { VALIDATION_MESSAGES } from './constants';

// Login form validation schema
export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email(VALIDATION_MESSAGES.EMAIL_INVALID)
        .required(VALIDATION_MESSAGES.REQUIRED),
    password: Yup.string()
        .required(VALIDATION_MESSAGES.REQUIRED)
        .min(8, VALIDATION_MESSAGES.PASSWORD_MIN),
    entryCode: Yup.string()
        .required(VALIDATION_MESSAGES.REQUIRED)
        .length(6, VALIDATION_MESSAGES.CODE_LENGTH),
});

// Registration form validation schema
export const registerSchema = Yup.object().shape({
    firstName: Yup.string().required(VALIDATION_MESSAGES.REQUIRED),
    secondName: Yup.string().required(VALIDATION_MESSAGES.REQUIRED),
    thirdName: Yup.string(),
    birthDate: Yup.string(), // Изменено с Yup.date() на Yup.string()
    email: Yup.string()
        .email(VALIDATION_MESSAGES.EMAIL_INVALID)
        .required(VALIDATION_MESSAGES.REQUIRED),
    password: Yup.string()
        .required(VALIDATION_MESSAGES.REQUIRED)
        .min(8, VALIDATION_MESSAGES.PASSWORD_MIN)
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
            VALIDATION_MESSAGES.PASSWORD_REQUIREMENTS
        ),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
        .required(VALIDATION_MESSAGES.REQUIRED),
});

// Verification code form validation schema
export const verificationCodeSchema = Yup.object().shape({
    email: Yup.string()
        .email(VALIDATION_MESSAGES.EMAIL_INVALID)
        .required(VALIDATION_MESSAGES.REQUIRED),
});