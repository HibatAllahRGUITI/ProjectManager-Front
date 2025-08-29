import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

const STATUTS = ["TO_DO", "IN_PROGRESS", "CODE_REVIEW", "TESTING", "DONE"]; // adapte aux valeurs de ton StatutEnum

export default function AddUserStoryModal({ open, onClose, onSave, initialUS, epicOptions = [], sprintOptions = [], defaultProductBacklogId }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [valeurMetier, setValeurMetier] = useState(0);
  const [urgence, setUrgence] = useState(0);
  const [complexite, setComplexite] = useState(0);
  const [risques, setRisques] = useState(0);
  const [dependances, setDependances] = useState(0);
  const [statut, setStatut] = useState("TO_DO");
  const [epicId, setEpicId] = useState(null);
  const [sprintBacklogId, setSprintBacklogId] = useState(null);

  useEffect(() => {
    if (open) {
      setTitre(initialUS?.titre || "");
      setDescription(initialUS?.description || "");
      setValeurMetier(initialUS?.valeurMetier ?? 0);
      setUrgence(initialUS?.urgence ?? 0);
      setComplexite(initialUS?.complexite ?? 0);
      setRisques(initialUS?.risques ?? 0);
      setDependances(initialUS?.dependances ?? 0);
      setStatut(initialUS?.statut || "TO_DO");
      setEpicId(initialUS?.epicId || null);
      setSprintBacklogId(initialUS?.sprintBacklogId || null);
    }
  }, [open, initialUS]);

  const handleSubmit = () => {
    onSave({
      id: initialUS?.id || null,
      titre,
      description,
      valeurMetier: Number(valeurMetier),
      urgence: Number(urgence),
      complexite: Number(complexite),
      risques: Number(risques),
      dependances: Number(dependances),
      statut,
      epicId: epicId || null,
      sprintBacklogId: sprintBacklogId || null,
      productBacklogId: defaultProductBacklogId,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialUS ? "Edit User Story" : "Add User Story"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12}>
            <TextField label="Titre" fullWidth value={titre} onChange={(e) => setTitre(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" fullWidth multiline minRows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField label="Valeur métier" type="number" fullWidth value={valeurMetier} onChange={(e) => setValeurMetier(e.target.value)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField label="Urgence" type="number" fullWidth value={urgence} onChange={(e) => setUrgence(e.target.value)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField label="Complexité" type="number" fullWidth value={complexite} onChange={(e) => setComplexite(e.target.value)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField label="Risques" type="number" fullWidth value={risques} onChange={(e) => setRisques(e.target.value)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField label="Dépendances" type="number" fullWidth value={dependances} onChange={(e) => setDependances(e.target.value)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField select label="Statut" fullWidth value={statut} onChange={(e) => setStatut(e.target.value)}>
              {STATUTS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{initialUS ? "Save" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
}
