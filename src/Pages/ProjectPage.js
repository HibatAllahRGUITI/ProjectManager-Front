import { Box, Drawer } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import ProductBacklogPage from "./ProductBacklogPage";
import SprintBacklogPage from "./SprintBacklogPage";
import { useState } from "react";

// Structure de base pour une nouvelle user story
const newUserStoryBase = {
  tasks: { "to-do": [], "in-progress": [], "done": [] }
};

export default function ProjectPage() {
  const [section, setSection] = useState("product");
  const [sprintBacklogs, setSprintBacklogs] = useState([]);
  const [epics, setEpics] = useState([
    { id: "epic-1", title: "Authentification", userStories: [] },
    { id: "epic-2", title: "Panier et Paiement", userStories: [] },
  ]);
  const [freeUserStories, setFreeUserStories] = useState([
    // Toutes les user stories doivent avoir la propriété `tasks`
    { id: "us-1", title: "En tant que client, je veux m'inscrire", ...newUserStoryBase },
    { id: "us-2", title: "En tant que client, je veux me connecter", ...newUserStoryBase },
    { id: "us-3", title: "En tant qu'admin, je veux réinitialiser un mot de passe", ...newUserStoryBase },
    { id: "us-4", title: "En tant que client, je veux ajouter des produits au panier", ...newUserStoryBase },
    { id: "us-5", title: "En tant que client, je veux payer ma commande", ...newUserStoryBase },
  ]);
  const [selectedSprintId, setSelectedSprintId] = useState(null);

  const handleAddSprintBacklog = (newSprint) => {
    const userStories = newSprint.userStories || [];
    const newSprintWithId = {
      id: `sprint-${Date.now()}`,
      ...newSprint,
      userStories: userStories.map(us => ({
        ...us,
        // Assurez-vous que chaque user story a la structure de tâches correcte
        tasks: us.tasks || { "to-do": [], "in-progress": [], "done": [] }
      }))
    };
    setSprintBacklogs([...sprintBacklogs, newSprintWithId]);
  };

  const handleUpdateEpics = (newEpics) => {
    setEpics(newEpics);
  };

  const handleUpdateFreeUserStories = (newStories) => {
    setFreeUserStories(newStories.map(us => ({
      ...us,
      // Assurez-vous que les user stories déplacées ont la propriété 'tasks'
      tasks: us.tasks || { "to-do": [], "in-progress": [], "done": [] }
    })));
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
          sprintBacklogs={sprintBacklogs}
          onSelectSprint={handleSelectSprint}
          selectedSprintId={selectedSprintId}
        />
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 4 }}>
        {section === "product" ? (
          <ProductBacklogPage
            epics={epics}
            onUpdateEpics={handleUpdateEpics}
            freeUserStories={freeUserStories}
            onUpdateFreeUserStories={handleUpdateFreeUserStories}
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