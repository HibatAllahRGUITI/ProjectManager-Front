import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function Sidebar({
  onSelectSection,
  currentSection,
  sprintBacklogs,
  onSelectSprint,
  selectedSprintId,
  productBacklogName,
}) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Project Manager
      </Typography>

      <List component="nav">
        <ListItemButton
          onClick={() => onSelectSection("product")}
          selected={currentSection === "product"}
          sx={{
            borderRadius: 2,
            mb: 1,
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "white",
              "& .MuiListItemIcon-root": { color: "white" },
            },
            "&.Mui-selected:hover": { bgcolor: "primary.dark" },
          }}
        >
          <ListItemIcon><DescriptionIcon /></ListItemIcon>
          <ListItemText primary={productBacklogName || "Product Backlog"} />
        </ListItemButton>

        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, color: "text.secondary", textTransform: "uppercase" }}>
          Sprints
        </Typography>

        {Array.isArray(sprintBacklogs) && sprintBacklogs.map((sprint) => (
          <ListItemButton
            key={sprint.id}
            onClick={() => onSelectSprint(sprint.id)}
            selected={selectedSprintId === sprint.id && currentSection === "sprint"}
            sx={{
              borderRadius: 2,
              mb: 1,
              "&.Mui-selected": {
                bgcolor: "secondary.main",
                color: "white",
                "& .MuiListItemIcon-root": { color: "white" },
              },
              "&.Mui-selected:hover": { bgcolor: "secondary.dark" },
            }}
          >
            <ListItemIcon><CheckCircleIcon /></ListItemIcon>
            <ListItemText primary={sprint.sprintName || `Sprint #${sprint.sprintId}`} />
          </ListItemButton>
        ))}

        {/* Bouton Inviter */}
        <ListItemButton
          onClick={() => onSelectSection("invite")}
          sx={{
            borderRadius: 2,
            mt: 4,
            "&:hover": { bgcolor: "primary.light" },
          }}
        >
          <ListItemIcon><PersonAddIcon /></ListItemIcon>
          <ListItemText primary="Invite People" />
        </ListItemButton>
      </List>
    </Box>
  );
}
