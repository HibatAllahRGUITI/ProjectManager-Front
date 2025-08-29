import { Card, CardContent, Typography, IconButton, Box, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EpicCard({ epic, onEdit, onDelete }) {
  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: "0px 4px 15px rgba(0,0,0,0.05)", bgcolor: "#fff" }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>{epic.nom}</Typography>
            {epic.description && <Typography variant="body2" color="text.secondary">{epic.description}</Typography>}
          </Box>
          <Box>
            <Tooltip title="Edit"><IconButton onClick={() => onEdit?.(epic)}><EditIcon /></IconButton></Tooltip>
            <Tooltip title="Delete"><IconButton onClick={() => onDelete?.(epic.id)}><DeleteIcon /></IconButton></Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
