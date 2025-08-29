import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export default function AddSprintBacklogModal({ open, onClose, onSave, initialSB }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (open) {
      setName(initialSB?.sprint?.name || "");
      setDescription(initialSB?.sprint?.description || "");
      setStartDate(initialSB?.sprint?.startDate || "");
      setEndDate(initialSB?.sprint?.endDate || "");
    }
  }, [open, initialSB]);

  const handleSubmit = () => {
    onSave({
      id: initialSB?.id || null,
      sprint: {
        id: initialSB?.sprint?.id || null,
        name,
        description,
        startDate, // format yyyy-MM-dd
        endDate,
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialSB ? "Edit Sprint Backlog" : "Add Sprint Backlog"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Sprint name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={2} />
          <TextField label="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="End date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{initialSB ? "Save" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
}
