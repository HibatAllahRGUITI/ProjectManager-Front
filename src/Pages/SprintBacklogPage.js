// src/pages/SprintBacklogPage.jsx

import { Box, Typography, Paper } from "@mui/material";
import UserStoryCard from "../Components/UserStoryCard";

export default function SprintBacklogPage({ sprint }) {
    if (!sprint) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" color="text.secondary">Veuillez sélectionner un sprint dans la barre latérale.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
                Sprint: {sprint.title}
            </Typography>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>User Stories du Sprint</Typography>
                {sprint.userStories.length === 0 ? (
                    <Typography color="text.secondary">Aucune user story dans ce sprint.</Typography>
                ) : (
                    sprint.userStories.map((us) => (
                        <UserStoryCard key={us.id} userStory={us} />
                    ))
                )}
            </Paper>
        </Box>
    );
}