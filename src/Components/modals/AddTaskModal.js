import { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default function AddTaskModal({ open, handleClose, handleAddTask }) {
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskTitle.trim()) {
            handleAddTask({ title: taskTitle, description: taskDescription });
            setTaskTitle("");
            setTaskDescription("");
        }
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="add-task-modal-title">
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography id="add-task-modal-title" variant="h6" mb={2}>
                    Add a New Task
                </Typography>

                <TextField
                    fullWidth
                    label="Title of the task"
                    variant="outlined"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button variant="outlined" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
