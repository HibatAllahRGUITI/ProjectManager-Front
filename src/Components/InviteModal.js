// src/components/InviteModal.jsx
import { Modal, Box, Typography, TextField, Button, MenuItem } from "@mui/material";
import { useState } from "react";

export default function InviteModal({ open, handleClose, handleInvite }) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("productOwner");

    const handleSubmit = () => {
        handleInvite({ email, role });
        setEmail("");
        setRole("productOwner");
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper', p: 4, borderRadius: 2, width: 300,
                boxShadow: 24
            }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Inviter un utilisateur</Typography>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Rôle"
                    select
                    fullWidth
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    sx={{ mb: 3 }}
                >
                    <MenuItem value="productOwner">ProductOwner</MenuItem>
                    <MenuItem value="scrumMaster">ScrumMaster</MenuItem>
                    <MenuItem value="developer">Developer</MenuItem>
                </TextField>
                <Button variant="contained" fullWidth onClick={handleSubmit}>Inviter</Button>
            </Box>
        </Modal>
    );
}
