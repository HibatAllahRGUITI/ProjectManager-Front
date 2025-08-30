import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UserStoryCard({ userStory, onEdit, onDelete }) {
  return (
    <Card
      sx={{
        mb: 1.5,
        cursor: "grab",
        bgcolor: "#F0E6EF",
        borderRadius: 2,
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        transition: "box-shadow 0.3s",
        "&:hover": {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          "&:last-child": { pb: 2 },
        }}
      >
        <DragIndicatorIcon sx={{ mr: 1, color: "text.secondary" }} />
        <Typography variant="body1" sx={{ flexGrow: 1 }}>
          {userStory.titre}
        </Typography>
        <IconButton
          size="small"
          sx={{ ml: 1 }}
          onClick={onEdit}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          sx={{ ml: 1 }}
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}
