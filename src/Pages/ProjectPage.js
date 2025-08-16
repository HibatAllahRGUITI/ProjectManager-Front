import { Box, Drawer } from "@mui/material";
import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import ProductBacklogPage from "./ProductBacklogPage";
import SprintBacklogPage from "./SprintBacklogPage";
import InviteModal from "../Components/InviteModal";

const newUserStoryBase = {
  tasks: { "to-do": [], "in-progress": [], "done": [] },
};

export default function ProjectPage() {
  const [section, setSection] = useState("product");
  const [sprintBacklogs, setSprintBacklogs] = useState([]);
  const [epics, setEpics] = useState([
    { id: "epic-1", title: "Authentification", userStories: [] },
    { id: "epic-2", title: "Panier et Paiement", userStories: [] },
  ]);
  const [freeUserStories, setFreeUserStories] = useState([
    { id: "us-1", title: "En tant que client, je veux m'inscrire", ...newUserStoryBase },
    { id: "us-2", title: "En tant que client, je veux me connecter", ...newUserStoryBase },
    { id: "us-3", title: "En tant qu'admin, je veux réinitialiser un mot de passe", ...newUserStoryBase },
    { id: "us-4", title: "En tant que client, je veux ajouter des produits au panier", ...newUserStoryBase },
    { id: "us-5", title: "En tant que client, je veux payer ma commande", ...newUserStoryBase },
  ]);
  const [selectedSprintId, setSelectedSprintId] = useState(null);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState([]);

  const handleInviteUser = ({ email, role }) => {
    setInvitedUsers([...invitedUsers, { email, role }]);
    console.log("Utilisateur invité:", email, role);
  };

  const handleAddSprintBacklog = (newSprint) => {
    const userStories = newSprint.userStories || [];
    const newSprintWithId = {
      id: `sprint-${Date.now()}`,
      ...newSprint,
      userStories: userStories.map((us) => ({
        ...us,
        tasks: us.tasks || { "to-do": [], "in-progress": [], "done": [] },
      })),
    };
    setSprintBacklogs([...sprintBacklogs, newSprintWithId]);
  };

  const handleUpdateEpics = (newEpics) => setEpics(newEpics);
  const handleUpdateFreeUserStories = (newStories) =>
    setFreeUserStories(
      newStories.map((us) => ({
        ...us,
        tasks: us.tasks || { "to-do": [], "in-progress": [], "done": [] },
      }))
    );
  const handleUpdateSprints = (newSprints) => setSprintBacklogs(newSprints);
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
          onSelectSection={(sec) => {
            if (sec === "invite") setIsInviteModalOpen(true);
            else setSection(sec);
          }}
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
        ) : section === "sprint" ? (
          <SprintBacklogPage sprint={sprintBacklogs.find((s) => s.id === selectedSprintId)} />
        ) : null}
      </Box>

      <InviteModal
        open={isInviteModalOpen}
        handleClose={() => setIsInviteModalOpen(false)}
        handleInvite={handleInviteUser}
      />
    </Box>
  );
}
