import { Box, Typography, Button, Paper } from "@mui/material";
import { useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";

import EpicCard from "../Components/cards/EpicCard";
import UserStoryCard from "../Components/cards/UserStoryCard";
import SprintBacklogCard from "../Components/cards/SprintBacklogCard";

import EpicModal from "../Components/modals/AddEpicModal";
import UserStoryModal from "../Components/modals/AddUserStoryModal";
import SprintBacklogModal from "../Components/modals/AddSprintBacklogModal";

import { updateEpic, deleteEpic } from "../Services/epicService";
import { updateUserStory, deleteUserStory } from "../Services/userStoryService";
import { deleteSprintBacklog } from "../Services/sprintBacklogService";

export default function ProductBacklogPage({
  productBacklog,
  epics: epicsProp = [],
  freeUserStories: freeUserStoriesProp = [],
  sprintBacklogs: sprintBacklogsProp = [],
  onCreateEpic,
  onCreateUserStory,
  onCreateSprint,
}) {
  const [epics, setEpics] = useState(epicsProp);
  const [freeUserStories, setFreeUserStories] = useState(freeUserStoriesProp);
  const [sprintBacklogs, setSprintBacklogs] = useState(sprintBacklogsProp);

  const [openEpic, setOpenEpic] = useState(false);
  const [openUS, setOpenUS] = useState(false);
  const [openSB, setOpenSB] = useState(false);

  const [editingEpic, setEditingEpic] = useState(null);
  const [editingUS, setEditingUS] = useState(null);
  const [editingSB, setEditingSB] = useState(null);

  const epicOptions = useMemo(() => epics.map(e => ({ id: e.id, nom: e.nom })), [epics]);
  const sprintOptions = useMemo(() => sprintBacklogs.map(s => ({ id: s.id, sprint: s.sprint })), [sprintBacklogs]);

  const handleAddEpic = (epic) => {
    setEpics(prev => [...prev, epic]);
    onCreateEpic?.(epic);
  };

  const handleSaveEpic = async (epic) => {
    if (epic.id) {
      try {
        const savedEpic = await updateEpic(epic.id, { id: epic.id, nom: epic.nom, description: epic.description });
        setEpics(prev => prev.map(e => e.id === savedEpic.id ? { ...savedEpic, userStories: e.userStories } : e));
      } catch (err) {
        console.error("Failed to update epic:", err);
      }
    } else {
      handleAddEpic(epic);
    }
  };

  const handleDeleteEpic = async (epicId) => {
    try {
      await deleteEpic(epicId);
      setEpics(prev => prev.filter(e => e.id !== epicId));
    } catch (err) {
      console.error("Failed to delete epic:", err);
    }
  };

  const handleAddUserStory = (us) => {
    if (us.sprintBacklogId) {
      setSprintBacklogs(prev =>
        prev.map(s =>
          s.id === us.sprintBacklogId
            ? { ...s, userStories: [...new Map([...(s.userStories || []), [us.id, us]]).values()] }
            : s
        )
      );
    } else if (us.epicId) {
      setEpics(prev =>
        prev.map(e =>
          e.id === us.epicId
            ? { ...e, userStories: [...new Map([...(e.userStories || []), [us.id, us]]).values()] }
            : e
        )
      );
    } else {
      setFreeUserStories(prev => {
        if (prev.find(freeUs => freeUs.id === us.id)) return prev;
        return [...prev, us];
      });
    }
    onCreateUserStory?.(us);
  };


  const handleEditUserStory = (updatedUS) => {
    setFreeUserStories(prev => prev.map(us => us.id === updatedUS.id ? updatedUS : us));
    setEpics(prev => prev.map(e => ({
      ...e,
      userStories: (e.userStories || []).map(us => us.id === updatedUS.id ? updatedUS : us)
    })));
    setSprintBacklogs(prev => prev.map(sb => ({
      ...sb,
      userStories: (sb.userStories || []).map(us => us.id === updatedUS.id ? updatedUS : us)
    })));
  };

  const handleSaveUserStory = async (usData) => {
    if (usData.id) {
      const updatedUS = await updateUserStory(usData.id, usData);
      handleEditUserStory(updatedUS);
    } else {
      handleAddUserStory(usData);
    }
  };

  const handleDeleteUserStory = async (usId) => {
    try {
      await deleteUserStory(usId);
      setFreeUserStories(prev => prev.filter(us => us.id !== usId));
      setEpics(prev => prev.map(e => ({
        ...e,
        userStories: (e.userStories || []).filter(us => us.id !== usId)
      })));
      setSprintBacklogs(prev => prev.map(sb => ({
        ...sb,
        userStories: (sb.userStories || []).filter(us => us.id !== usId)
      })));
    } catch (err) {
      console.error("Failed to delete user story:", err);
    }
  };

  const handleAddSprintBacklog = (sb) => {
    setSprintBacklogs(prev => [...prev, sb]);
    onCreateSprint?.(sb);
  };

  const handleDeleteSprintBacklog = async (sbId) => {
    if (!sbId) {
      alert("Missed Sprint Backlog ID!");
      return;
    }
    try {
      await deleteSprintBacklog(sbId);
      setSprintBacklogs(prev => prev.filter(s => s.id !== sbId));
    } catch (err) {
      console.error("Failed to delete sprint backlog:", err);
      alert("Erreur lors de la suppression !");
    }
  };

  return (
    <DragDropContext onDragEnd={() => { }}>
      <Box sx={{ display: "flex", p: 2, gap: 3, height: "100%" }}>

        {/* Epics */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Epics</Typography>
            <Button variant="contained" color="primary" onClick={() => { setEditingEpic(null); setOpenEpic(true); }} startIcon={<AddIcon />}>
              Add Epic
            </Button>
          </Box>
          <Box>
            {epics.map(epic => (
              <Box key={`epic-${epic?.id || Math.random()}`} sx={{ mb: 2 }}>
                <EpicCard
                  epic={epic}
                  onEdit={() => { setEditingEpic(epic); setOpenEpic(true); }}
                  onDelete={() => handleDeleteEpic(epic.id)}
                />
                {(epic.userStories || []).map(us => (
                  <UserStoryCard
                    key={`epic-${epic?.id || 0}-us-${us?.id || Math.random()}`}
                    userStory={us}
                    onEdit={() => { setEditingUS(us); setOpenUS(true); }}
                    onDelete={() => handleDeleteUserStory(us.id)}
                  />
                ))}
              </Box>

            ))}
          </Box>
        </Box>

        {/* User Stories libres */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>User Stories</Typography>
            <Button variant="contained" color="primary" onClick={() => { setEditingUS(null); setOpenUS(true); }} startIcon={<AddIcon />}>
              Add US
            </Button>
          </Box>
          <Paper sx={{ minHeight: 400, p: 2, bgcolor: "#fafafa" }}>
            {freeUserStories.map(us => (
              <UserStoryCard
                key={`free-us-${us.id}`}
                userStory={us}
                onEdit={() => { setEditingUS(us); setOpenUS(true); }}
                onDelete={() => handleDeleteUserStory(us.id)}
              />
            ))}
          </Paper>
        </Box>

        {/* Sprint Backlogs */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Sprint Backlogs</Typography>
            <Button variant="contained" color="secondary" onClick={() => { setEditingSB(null); setOpenSB(true); }} startIcon={<AddIcon />}>
              Add Sprint
            </Button>
          </Box>
          <Box>
            {sprintBacklogs.map(sb => (
              <Box key={`sb-${sb.id}`} sx={{ mb: 2 }}>
                {/* Change 'sprintBacklog' prop to 'sprint' */}
                <SprintBacklogCard sprint={sb} onDelete={() => handleDeleteSprintBacklog(sb.id)} />
                {(sb.userStories || []).map(us => (
                  <UserStoryCard
                    key={`sb-${sb.id}-us-${us.id}`}
                    userStory={us}
                    onEdit={() => { setEditingUS(us); setOpenUS(true); }}
                    onDelete={() => handleDeleteUserStory(us.id)}
                  />
                ))}
              </Box>
            ))}
          </Box>
        </Box>

      </Box>

      {/* Modals */}
      <EpicModal open={openEpic} onClose={() => setOpenEpic(false)} onSave={handleSaveEpic} initialEpic={editingEpic} />
      <UserStoryModal
        open={openUS}
        onClose={() => setOpenUS(false)}
        onSave={editingUS ? handleSaveUserStory : handleAddUserStory}
        initialUS={editingUS}
        epicOptions={epicOptions}
        sprintOptions={sprintOptions}
        defaultProductBacklogId={productBacklog?.id}
      />
      <SprintBacklogModal open={openSB} onClose={() => setOpenSB(false)} onSave={handleAddSprintBacklog} initialSB={editingSB} />
    </DragDropContext>
  );
}