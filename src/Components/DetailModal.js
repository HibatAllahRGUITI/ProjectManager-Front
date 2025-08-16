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
    type,          // "task", "userStory", "epic"
    item,          // l'objet à afficher/modifier
    handleClose,
    handleUpdate,  // fonction pour mise à jour
    handleDelete,  // fonction pour suppression
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
            <DialogTitle>Détails {type}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Titre"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Box>
                {/* Ici tu peux ajouter d'autres champs selon le type */}
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={onDelete}>
                    Supprimer
                </Button>
                <Button onClick={handleClose}>Annuler</Button>
                <Button variant="contained" onClick={onSave}>
                    Sauvegarder
                </Button>
            </DialogActions>
        </Dialog>
    );
}
