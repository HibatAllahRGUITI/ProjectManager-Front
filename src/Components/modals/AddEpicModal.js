import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export default function AddEpicModal({ open, onClose, onSave, initialEpic }) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setNom(initialEpic?.nom || "");
      setDescription(initialEpic?.description || "");
    }
  }, [open, initialEpic]);

  const handleSubmit = () => {
    onSave({
      id: initialEpic?.id || null,
      nom,
      description,
    });
  };



  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialEpic ? "Edit Epic" : "Add Epic"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} fullWidth />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={3} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{initialEpic ? "Save" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
}
