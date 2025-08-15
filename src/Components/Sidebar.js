// src/components/Sidebar.jsx

import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Sidebar({ onSelectSection, currentSection, sprintBacklogs, onSelectSprint, selectedSprintId }) {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Gestion de Projet
      </Typography>
      <List component="nav">
        <ListItemButton
          onClick={() => onSelectSection("product")}
          selected={currentSection === "product"}
          sx={{
            borderRadius: 2, mb: 1,
            "&.Mui-selected": { bgcolor: "primary.main", color: "white", "& .MuiListItemIcon-root": { color: "white" } },
            "&.Mui-selected:hover": { bgcolor: "primary.dark" },
          }}
        >
          <ListItemIcon><DescriptionIcon /></ListItemIcon>
          <ListItemText primary="Product Backlog" />
        </ListItemButton>

        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, color: "text.secondary", textTransform: "uppercase" }}>
          Sprints
        </Typography>
        {/* Boucle sur la liste des sprints reçue par props */}
        {sprintBacklogs.map(sprint => (
          <ListItemButton
            key={sprint.id}
            onClick={() => onSelectSprint(sprint.id)}
            selected={selectedSprintId === sprint.id && currentSection === "sprint"}
            sx={{
              borderRadius: 2, mb: 1,
              "&.Mui-selected": { bgcolor: "secondary.main", color: "white", "& .MuiListItemIcon-root": { color: "white" } },
              "&.Mui-selected:hover": { bgcolor: "secondary.dark" },
            }}
          >
            <ListItemIcon><CheckCircleIcon /></ListItemIcon>
            <ListItemText primary={sprint.title} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}