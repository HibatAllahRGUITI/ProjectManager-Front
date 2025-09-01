import axios from "axios";

const API_URL = "http://localhost:8080/api/task";

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const createTaskForUserStory = async (userStoryId, taskData) => {
    try {
        const response = await axios.post(
            `${API_URL}/userStory/${userStoryId}`,
            taskData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error.response?.data || error.message);
        throw error;
    }
};

export const getTaskById = async (taskId) => {
    try {
        const response = await axios.get(`${API_URL}/${taskId}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching task:", error.response?.data || error.message);
        throw error;
    }
};

export const getTasksByUserStoryId = async (userStoryId) => {
    try {
        const response = await axios.get(
            `${API_URL}/userStory/${userStoryId}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks for user story:", error.response?.data || error.message);
        throw error;
    }
};

export const updateTask = async (taskId, updatedTask) => {
    try {
        const response = await axios.put(
            `${API_URL}/${taskId}`,
            updatedTask,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        await axios.delete(`${API_URL}/${taskId}`, getAuthHeaders());
        return true;
    } catch (error) {
        console.error("Error deleting task:", error.response?.data || error.message);
        throw error;
    }
};
