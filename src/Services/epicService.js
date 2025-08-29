import axios from "axios";

const API_URL = "http://localhost:8080/api/epic";

export const getEpicsByBacklogId = async (backlogId) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const response = await axios.get(`${API_URL}/productBacklog/${backlogId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching epics:", error.response?.data || error.message);
        throw error;
    }
};

export const createEpic = async (productBacklogId, nom, description) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const response = await axios.post(`${API_URL}`, { nom, description, productBacklogId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating epic:", error.response?.data || error.message);
        throw error;
    }
};
