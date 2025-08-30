import axios from "axios";

const API_URL = "http://localhost:8080/api/userStory";

export const getUserStoriesByBacklogId = async (backlogId) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const response = await axios.get(`${API_URL}/backlog/${backlogId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user stories:", error.response?.data || error.message);
        throw error;
    }
};

export const createUserStory = async (backlogId, titre, description) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const response = await axios.post(`${API_URL}/backlog/${backlogId}`, {
            titre,
            description,
            statut: "TO_DO"
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating user story:", error.response?.data || error.message);
        throw error;
    }
};

export const updateUserStory = async (id, userStoryData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const response = await axios.put(
        `${API_URL}/${id}`,
        userStoryData,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
};

export const deleteUserStory = async (id) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("Error deleting user story:", error.response?.data || error.message);
        throw error;
    }
};

