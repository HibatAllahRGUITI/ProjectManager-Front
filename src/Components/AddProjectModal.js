import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

export default function AddProjectModal({ open, handleClose, handleAddProject, projectTitle, setProjectTitle, projectDesc, setProjectDesc }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Ajouter un nouveau projet</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Titre du projet"
          fullWidth
          variant="outlined"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Annuler</Button>
        <Button onClick={handleAddProject} variant="contained" color="primary">Ajouter</Button>
      </DialogActions>
    </Dialog>
  );
}
