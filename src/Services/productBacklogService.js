import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productBacklog';

export const createBacklog = async (projectId, title, description) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const response = await axios.post(API_URL, {
            projectId,
            nom: title,
            description
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating backlog:', error.response?.data || error.message);
        throw error;
    }
};

export const getProductBacklogByProjectId = async (projectId) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        console.log("sprint token:", token);

        const response = await axios.get(`${API_URL}/project/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching product backlog:", error.response?.data || error.message);
        throw error;
    }
};