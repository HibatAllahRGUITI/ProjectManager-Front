import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function DetailModal({
    open,
    type,
    item,
    handleClose,
    handleUpdate,
    handleDelete,
}) {
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (item) setTitle(item.title || "");
    }, [item]);

    const onSave = () => {
        if (!title.trim()) return;
        handleUpdate({ ...item, title });
    };

    const onDelete = () => {
        handleDelete(item.id);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Details {type}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Box>
                {/* Ici tu peux ajouter d'autres champs selon le type */}
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={onDelete}>
                    delete
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={onSave}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
