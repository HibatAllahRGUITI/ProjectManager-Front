import axios from 'axios';

const API_URL = 'http://localhost:8080/api/projects';

export const getProjectsByUser = async (username) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const response = await axios.get(`${API_URL}/user/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error.response?.data || error.message);
        throw error;
    }
};

export const addProject = async (title, description) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const response = await axios.post(API_URL, { nom: title, description }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding project:', error.response?.data || error.message);
        throw error;
    }
};

export const editProject = async (id, title, description) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const response = await axios.put(`${API_URL}/${id}`, { nom: title, description }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error editing project:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteProject = async (id) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Error deleting project:', error.response?.data || error.message);
        throw error;
    }
};


