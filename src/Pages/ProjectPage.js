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
        <Sidebar
          onSelectSection={setSection}
          currentSection={section}
          // On passe les sprints et les fonctions de sélection à la Sidebar
          sprintBacklogs={sprintBacklogs}
          onSelectSprint={handleSelectSprint}
          selectedSprintId={selectedSprintId}
        />
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 4 }}>
        {/* Affichage conditionnel basé sur la section choisie */}
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