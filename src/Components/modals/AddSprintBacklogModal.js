// src/components/AddSprintBacklogModal.jsx

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function AddSprintBacklogModal({ open, handleClose, handleAddSprintBacklog }) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    handleAddSprintBacklog({ title });
    setTitle("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add a SprintBacklog</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title of the SprintBacklog"
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}