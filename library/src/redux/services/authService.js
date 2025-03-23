import axios from 'axios';
import { API_URL } from '../../utils/constants';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
});

// Register user
const register = async (userData) => {
    const response = await api.post('/auth/register', null, {
        params: {
            firstName: userData.firstName,
            secondName: userData.secondName,
            thirdName: userData.thirdName || '',
            birthDate: userData.birthDate || '',
            email: userData.email,
            password: userData.password,
        },
    });
    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await api.post('/auth/login', null, {
        params: {
            email: userData.email,
            password: userData.password,
            entryCode: userData.entryCode,
        },
    });
    return response.data;
};

// Get verification code
const getVerificationCode = async (email) => {
    const response = await api.post('/auth/code/get', null, {
        params: {
            email,
        },
    });
    return response.data;
};

const authService = {
    register,
    login,
    getVerificationCode,
};

export default authService;