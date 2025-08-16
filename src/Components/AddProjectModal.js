// Fichier : AddProjectModal.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

export default function AddProjectModal({
  open,
  handleClose,
  handleAddProject,
  projectTitle,
  setProjectTitle,
  projectDesc,
  setProjectDesc,
  titleText,
  buttonText
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{titleText}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title of the project"
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
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleAddProject} variant="contained" color="primary">
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}