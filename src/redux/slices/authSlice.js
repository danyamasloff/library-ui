import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

// Check for token in localStorage
const token = localStorage.getItem('token');

const initialState = {
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    user: null,
    error: null,
    verificationEmail: '',
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            return await authService.register(userData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'An error occurred during registration'
            );
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            return await authService.login(userData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Invalid credentials'
            );
        }
    }
);

// Get verification code
export const getVerificationCode = createAsyncThunk(
    'auth/getVerificationCode',
    async (email, { rejectWithValue }) => {
        try {
            return await authService.getVerificationCode(email);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to send verification code'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setVerificationEmail: (state, action) => {
            state.verificationEmail = action.payload;
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
                localStorage.setItem('token', action.payload.token);
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
            })
            .addCase(getVerificationCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError, setVerificationEmail } = authSlice.actions;

export default authSlice.reducer;