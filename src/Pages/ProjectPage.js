// src/pages/ProjectPage.jsx

import { Box, Drawer } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import ProductBacklogPage from "./ProductBacklogPage";
import SprintBacklogPage from "./SprintBacklogPage";
import { useState } from "react";

export default function ProjectPage() {
  const [section, setSection] = useState("product");
  // L'état des sprints est remonté ici
  const [sprintBacklogs, setSprintBacklogs] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState(null);

  const handleAddSprintBacklog = (newSprint) => {
    const newSprintWithId = { id: `sprint-${Date.now()}`, ...newSprint, userStories: [] };
    setSprintBacklogs([...sprintBacklogs, newSprintWithId]);
  };

  const handleUpdateSprints = (newSprints) => {
    setSprintBacklogs(newSprints);
  };

  const handleSelectSprint = (sprintId) => {
    setSelectedSprintId(sprintId);
    setSection("sprint");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Sidebar - Fixe sur la gauche */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            bgcolor: "#ffffff",
            borderRight: "1px solid #e0e0e0",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        {/* On passe la liste des sprints et la fonction de sélection à la Sidebar */}
        <Sidebar
          onSelectSection={setSection}
          currentSection={section}
          sprintBacklogs={sprintBacklogs}
          onSelectSprint={handleSelectSprint}
          selectedSprintId={selectedSprintId}
        />
      </Drawer>

      {/* Contenu principal */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        {/* On passe la liste des sprints et les fonctions de manipulation au ProductBacklogPage */}
        {section === "product" ? (
          <ProductBacklogPage
            sprintBacklogs={sprintBacklogs}
            onAddSprintBacklog={handleAddSprintBacklog}
            onUpdateSprints={handleUpdateSprints}
          />
        ) : (
          <SprintBacklogPage
            sprint={sprintBacklogs.find(s => s.id === selectedSprintId)}
          />
        )}
      </Box>
    </Box>
  );
}