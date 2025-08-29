import { Box, Typography, Button, Paper } from "@mui/material";
import { useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";

import EpicCard from "../Components/cards/EpicCard";
import UserStoryCard from "../Components/cards/UserStoryCard";
import SprintBacklogCard from "../Components/cards/SprintBacklogCard";

import EpicModal from "../Components/modals/AddEpicModal";
import UserStoryModal from "../Components/modals/AddUserStoryModal";
import SprintBacklogModal from "../Components/modals/AddSprintBacklogModal";

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

  // Modals
  const [openEpic, setOpenEpic] = useState(false);
  const [openUS, setOpenUS] = useState(false);
  const [openSB, setOpenSB] = useState(false);

  const [editingEpic, setEditingEpic] = useState(null);
  const [editingUS, setEditingUS] = useState(null);
  const [editingSB, setEditingSB] = useState(null);

  // Options pour modals
  const epicOptions = useMemo(() => epics.map(e => ({ id: e.id, nom: e.nom })), [epics]);
  const sprintOptions = useMemo(() => sprintBacklogs.map(s => ({ id: s.id, sprint: s.sprint })), [sprintBacklogs]);

  // ---------- Fonctions simples de création ----------
  const handleAddEpic = (epic) => {
    setEpics(prev => [...prev, epic]);
    onCreateEpic?.(epic);
  };

  const handleAddUserStory = (us) => {
    if (us.sprintBacklogId) {
      setSprintBacklogs(prev =>
        prev.map(s => s.id === us.sprintBacklogId ? { ...s, userStories: [...(s.userStories || []), us] } : s)
      );
    } else if (us.epicId) {
      setEpics(prev =>
        prev.map(e => e.id === us.epicId ? { ...e, userStories: [...(e.userStories || []), us] } : e)
      );
    } else {
      setFreeUserStories(prev => [...prev, us]);
    }
    onCreateUserStory?.(us);
  };

  const handleAddSprintBacklog = (sb) => {
    setSprintBacklogs(prev => [...prev, sb]);
    onCreateSprint?.(sb);
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
              <Box key={`epic-${epic.id}`} sx={{ mb: 2 }}>
                <EpicCard epic={epic} onEdit={() => { }} onDelete={() => { }} />
                {(epic.userStories || []).map(us => (
                  <UserStoryCard key={`us-${us.id}`} userStory={us} onEdit={() => { }} onDelete={() => { }} />
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
              <UserStoryCard key={us.id} userStory={us} onEdit={() => { }} onDelete={() => { }} />
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
              <Box key={sb.id} sx={{ mb: 2 }}>
                <SprintBacklogCard sprint={sb} onEdit={() => { }} onDelete={() => { }} />
                {(sb.userStories || []).map(us => (
                  <UserStoryCard key={us.id} userStory={us} onEdit={() => { }} onDelete={() => { }} />
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Modals */}
      <EpicModal open={openEpic} onClose={() => setOpenEpic(false)} onSave={handleAddEpic} initialEpic={editingEpic} />
      <UserStoryModal
        open={openUS}
        onClose={() => setOpenUS(false)}
        onSave={handleAddUserStory}
        initialUS={editingUS}
        epicOptions={epicOptions}
        sprintOptions={sprintOptions}
        defaultProductBacklogId={productBacklog?.id}
      />
      <SprintBacklogModal open={openSB} onClose={() => setOpenSB(false)} onSave={handleAddSprintBacklog} initialSB={editingSB} />
    </DragDropContext>
  );
}
