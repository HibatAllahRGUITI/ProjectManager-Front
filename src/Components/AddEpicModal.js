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
      <DialogTitle>Ajouter un Epic</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Titre de l'Epic"
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
