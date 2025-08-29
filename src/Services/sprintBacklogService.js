import axios from "axios";

const API_URL = "http://localhost:8080/api/sprintBacklog";

export const getSprintBacklogByProductBacklogId = async (backlogId) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        console.log("sprint token:", token);

        const response = await axios.get(`${API_URL}/productBacklog/${backlogId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching sprint backlog:", error.response?.data || error.message);
        throw error;
    }
};


export const createSprintBacklog = async (backlogId, sprintId) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;
        const response = await axios.post(`${API_URL}`, {
            sprint: { id: sprintId },
            productBacklogId: backlogId,
            userStoryIds: []
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }, {
            sprintId,
            userStoryIds: []
        });
        return response.data;
    } catch (error) {
        console.error("Error creating sprint backlog:", error.response?.data || error.message);
        throw error;
    }
};

