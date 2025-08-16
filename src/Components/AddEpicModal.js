import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function AddEpicModal({ open, handleClose, handleAddEpic }) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    handleAddEpic({ id: Date.now(), title });
    setTitle("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add an Epic</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title of the Epic"
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
