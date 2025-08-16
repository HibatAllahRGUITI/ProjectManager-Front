// src/Components/TaskCard.jsx
import { Paper, Typography } from "@mui/material";

export default function TaskCard({ task }) {
    return (
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "#fff", border: "1px solid #ccc" }}>
            <Typography variant="body1">{task.title}</Typography>
        </Paper>
    );
}