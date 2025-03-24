import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';
import { STORAGE_KEYS } from '../../utils/constants';

// Получаем токен и данные пользователя из localStorage
const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
const userData = localStorage.getItem(STORAGE_KEYS.USER);
const user = userData ? JSON.parse(userData) : null;

const initialState = {
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    user: user || null,
    error: null,
    verificationEmail: '',
    message: null,
};

// Регистрация пользователя
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            return await authService.register(userData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Ошибка при регистрации'
            );
        }
    }
);

// Вход пользователя
export const login = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            return await authService.login(userData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Неверные учетные данные'
            );
        }
    }
);

// Получение кода подтверждения
export const getVerificationCode = createAsyncThunk(
    'auth/getVerificationCode',
    async (email, { rejectWithValue }) => {
        try {
            return await authService.getVerificationCode(email);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Ошибка при отправке кода подтверждения'
            );
        }
    }
);

// Получение данных пользователя
export const getUserProfile = createAsyncThunk(
    'auth/getUserProfile',
    async (userId, { rejectWithValue }) => {
        try {
            return await authService.getUserProfile(userId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Ошибка при получении данных пользователя'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            authService.logout();
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            state.message = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        setVerificationEmail: (state, action) => {
            state.verificationEmail = action.payload;
        },
        // Добавляем редьюсер для ручной установки состояния аутентификации
        setAuthState: (state, action) => {
            const { token, user, isAuthenticated } = action.payload;
            state.token = token;
            state.user = user;
            state.isAuthenticated = isAuthenticated;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.verificationEmail = action.payload.email;
                state.message = action.payload.message;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
                state.message = 'Вход выполнен успешно';
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Verification Code
            .addCase(getVerificationCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVerificationCode.fulfilled, (state, action) => {
                state.loading = false;
                state.verificationEmail = action.meta.arg;
                state.message = action.payload.message;
            })
            .addCase(getVerificationCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get User Profile
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = {...state.user, ...action.payload};
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError, clearMessage, setVerificationEmail, setAuthState } = authSlice.actions;

export default authSlice.reducer;