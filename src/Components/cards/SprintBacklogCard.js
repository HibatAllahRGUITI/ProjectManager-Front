import { Paper, Typography, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SprintBacklogCard({ sprint, onDelete }) {
    return (
        <Paper
            key={sprint.id ?? `sb-${Math.random()}`}
            elevation={3}
            sx={{
                p: 2,
                borderRadius: 2,
                mb: 2,
                bgcolor: "#fff",
                border: "1px solid #e0e0e0",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {sprint.sprintName || sprint.sprint?.name || "Unnamed Sprint"}
                </Typography>
                {onDelete && (
                    <IconButton
                        aria-label="delete"
                        onClick={() => onDelete(sprint.id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                )}
            </Box>
        </Paper>
    );
}
