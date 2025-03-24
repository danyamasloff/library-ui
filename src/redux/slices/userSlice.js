import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../../utils/constants';

// Создаем API-экземпляр с базовым URL
const api = axios.create({
    baseURL: API_URL,
});

// Добавляем интерцептор для токена авторизации
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Получение всех пользователей (для администраторов)
export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(API_ENDPOINTS.USERS.GET_ALL);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Ошибка при получении списка пользователей'
            );
        }
    }
);

// Получение профиля пользователя по ID
export const getUserById = createAsyncThunk(
    'user/getUserById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get(API_ENDPOINTS.USERS.GET_BY_ID(userId));
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Ошибка при получении данных пользователя'
            );
        }
    }
);

const initialState = {
    profile: null,
    users: [],
    loading: false,
    error: null,
    message: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Обработка getAllUsers
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Обработка getUserById
            .addCase(getUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfile, clearError, clearMessage } = userSlice.actions;

export default userSlice.reducer;