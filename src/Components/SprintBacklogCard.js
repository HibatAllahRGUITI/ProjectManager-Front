import { Paper, Typography } from "@mui/material";

export default function SprintBacklogCard({ sprint }) {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                borderRadius: 2,
                mb: 2,
                bgcolor: "#fff",
                border: "1px solid #e0e0e0"
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {sprint.title}
            </Typography>
        </Paper>
    );
}
