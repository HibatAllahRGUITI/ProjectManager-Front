import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });

        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        console.log(response.data.token);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const signup = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username,
            email,
            password,
            role: "DEVELOPPEUR"
        });
        return response.data;
    } catch (error) {
        console.error("Signup error:", error.response ? error.response.data : error.message);
        throw error;
    }
};
