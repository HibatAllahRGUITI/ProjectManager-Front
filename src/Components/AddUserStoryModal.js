import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function AddUserStoryModal({ open, handleClose, handleAddUserStory }) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    handleAddUserStory({ id: Date.now(), title });
    setTitle("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Ajouter une user story</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Titre de la user story"
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit}>Ajouter</Button>
      </DialogActions>
    </Dialog>
  );
}
