import axios from "axios";

const API_URL = "http://localhost:8080/api/sprint";

export const createSprint = async (sprintData) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        const response = await axios.post(API_URL, sprintData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error("Error creating sprint:", error.response?.data || error.message);
        throw error;
    }
};

export const getSprintById = async (sprintId) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        const response = await axios.get(`${API_URL}/${sprintId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching sprint:", error.response?.data || error.message);
        throw error;
    }
};
