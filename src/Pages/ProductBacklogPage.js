import { Box, Typography, Button, Paper } from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";

import EpicCard from "../Components/cards/EpicCard";
import UserStoryCard from "../Components/cards/UserStoryCard";
import SprintBacklogCard from "../Components/cards/SprintBacklogCard";

import EpicModal from "../Components/modals/AddEpicModal";
import UserStoryModal from "../Components/modals/AddUserStoryModal";
import SprintBacklogModal from "../Components/modals/AddSprintBacklogModal";

import { updateEpic, deleteEpic } from "../Services/epicService";
import { updateUserStory, deleteUserStory, assignUserStory, fetchUserStoriesByIds } from "../Services/userStoryService";
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
  const [allUserStories, setAllUserStories] = useState([]);

  const [openEpic, setOpenEpic] = useState(false);
  const [openUS, setOpenUS] = useState(false);
  const [openSB, setOpenSB] = useState(false);

  const [editingEpic, setEditingEpic] = useState(null);
  const [editingUS, setEditingUS] = useState(null);
  const [editingSB, setEditingSB] = useState(null);

  const epicOptions = useMemo(() => epics.map(e => ({ id: e.id, nom: e.nom })), [epics]);
  const sprintOptions = useMemo(() => sprintBacklogs.map(s => ({ id: s.id, sprint: s.sprint })), [sprintBacklogs]);

  // 🔹 Charger toutes les User Stories à partir des IDs des Sprints
  useEffect(() => {
    const sprintUSIds = sprintBacklogs.flatMap(sb => sb.userStoryIds || []);
    fetchUserStoriesByIds(sprintUSIds).then(fetchedUS => {
      const fromEpics = epics.flatMap(e => e.userStories || []);
      const combined = [...fromEpics, ...freeUserStories, ...fetchedUS];
      // éliminer doublons
      const uniqueUS = Array.from(new Map(combined.map(us => [us.id, us])).values());
      setAllUserStories(uniqueUS);
    });
  }, [epics, freeUserStories, sprintBacklogs]);

  const getUserStoriesForSprint = (sb) => {
    if (!sb.userStoryIds) return [];
    return sb.userStoryIds
      .map(id => allUserStories.find(us => us.id === id))
      .filter(Boolean);
  };

  // ----- CRUD Epics -----
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

  // ----- CRUD User Stories -----
  const handleAddUserStory = (us) => {
    if (us.sprintBacklogId) {
      setSprintBacklogs(prev =>
        prev.map(s => s.id === us.sprintBacklogId
          ? { ...s, userStories: [...(s.userStories || []), us] }
          : s
        )
      );
    } else if (us.epicId) {
      setEpics(prev =>
        prev.map(e => e.id === us.epicId
          ? { ...e, userStories: [...(e.userStories || []), us] }
          : e
        )
      );
    } else {
      setFreeUserStories(prev => {
        if (prev.find(freeUs => freeUs.id === us.id)) return prev;
        return [...prev, us];
      });
    }
    setAllUserStories(prev => {
      if (prev.find(existing => existing.id === us.id)) return prev;
      return [...prev, us];
    });
    onCreateUserStory?.(us);
  };

  const handleEditUserStory = (updatedUS) => {
    setFreeUserStories(prev => prev.filter(us => us.id !== updatedUS.id));
    setEpics(prev => prev.map(e => ({
      ...e,
      userStories: (e.userStories || []).filter(us => us.id !== updatedUS.id)
    })));
    setSprintBacklogs(prev => prev.map(sb => ({
      ...sb,
      userStories: (sb.userStories || []).filter(us => us.id !== updatedUS.id)
    })));

    if (updatedUS.sprintBacklogId) {
      setSprintBacklogs(prev =>
        prev.map(sb => sb.id === updatedUS.sprintBacklogId
          ? { ...sb, userStories: [...(sb.userStories || []), updatedUS] }
          : sb
        )
      );
    } else if (updatedUS.epicId) {
      setEpics(prev =>
        prev.map(e => e.id === updatedUS.epicId
          ? { ...e, userStories: [...(e.userStories || []), updatedUS] }
          : e
        )
      );
    } else {
      setFreeUserStories(prev => [...prev, updatedUS]);
    }

    setAllUserStories(prev => {
      if (prev.find(us => us.id === updatedUS.id)) return prev.map(us => us.id === updatedUS.id ? updatedUS : us);
      return [...prev, updatedUS];
    });
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
      setAllUserStories(prev => prev.filter(us => us.id !== usId));
    } catch (err) {
      console.error("Failed to delete user story:", err);
    }
  };

  // ----- CRUD Sprint Backlogs -----
  const handleAddSprintBacklog = (sb) => {
    setSprintBacklogs(prev => [...prev, sb]);
    onCreateSprint?.(sb);
  };

  const handleDeleteSprintBacklog = async (sbId) => {
    if (!sbId) return;
    try {
      await deleteSprintBacklog(sbId);
      setSprintBacklogs(prev => prev.filter(s => s.id !== sbId));
    } catch (err) {
      console.error("Failed to delete sprint backlog:", err);
    }
  };

  // ----- Drag & Drop -----
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const usId = parseInt(draggableId.replace("us-", ""), 10);

    let epicId = null;
    let sprintBacklogId = null;

    if (destination.droppableId.startsWith("epic-")) {
      epicId = parseInt(destination.droppableId.replace("epic-", ""), 10);
    } else if (destination.droppableId.startsWith("sprint-")) {
      sprintBacklogId = parseInt(destination.droppableId.replace("sprint-", ""), 10);
    }

    try {
      const updatedUS = await assignUserStory(usId, { epicId, sprintBacklogId });
      handleEditUserStory(updatedUS);
    } catch (err) {
      console.error("Erreur Drag & Drop:", err);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: "flex", p: 2, gap: 3, height: "100%" }}>
        {/* ----- Epics ----- */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Epics</Typography>
            <Button variant="contained" color="primary" onClick={() => { setEditingEpic(null); setOpenEpic(true); }} startIcon={<AddIcon />}>
              Add Epic
            </Button>
          </Box>
          <Box>
            {epics.map(epic => (
              <Droppable droppableId={`epic-${epic.id}`} key={`epic-${epic.id}`}>
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ mb: 2 }}>
                    <EpicCard epic={epic} onEdit={() => { setEditingEpic(epic); setOpenEpic(true); }} onDelete={() => handleDeleteEpic(epic.id)} />
                    {(epic.userStories || []).map((us, index) => (
                      <Draggable key={`us-${us.id}`} draggableId={`us-${us.id}`} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <UserStoryCard userStory={us} onEdit={() => { setEditingUS(us); setOpenUS(true); }} onDelete={() => handleDeleteUserStory(us.id)} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            ))}
          </Box>
        </Box>

        {/* ----- Free User Stories ----- */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>User Stories</Typography>
            <Button variant="contained" color="primary" onClick={() => { setEditingUS(null); setOpenUS(true); }} startIcon={<AddIcon />}>
              Add US
            </Button>
          </Box>
          <Droppable droppableId="freeUserStories">
            {(provided) => (
              <Paper ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 400, p: 2, bgcolor: "#fafafa" }}>
                {freeUserStories.map((us, index) => (
                  <Draggable key={`free-us-${us.id}`} draggableId={`us-${us.id}`} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <UserStoryCard userStory={us} onEdit={() => { setEditingUS(us); setOpenUS(true); }} onDelete={() => handleDeleteUserStory(us.id)} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Paper>
            )}
          </Droppable>
        </Box>

        {/* ----- Sprint Backlogs ----- */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Sprint Backlogs</Typography>
            <Button variant="contained" color="secondary" onClick={() => { setEditingSB(null); setOpenSB(true); }} startIcon={<AddIcon />}>
              Add Sprint
            </Button>
          </Box>
          <Box>
            {sprintBacklogs.map(sb => {
              const userStories = sb.userStories || getUserStoriesForSprint(sb);
              return (
                <Droppable droppableId={`sprint-${sb.id}`} key={`sb-${sb.id}`}>
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ mb: 2 }}>
                      <SprintBacklogCard sprint={sb} onDelete={() => handleDeleteSprintBacklog(sb.id)}>
                        {userStories.map((us, index) => (
                          <Draggable key={`us-${us.id}`} draggableId={`us-${us.id}`} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <UserStoryCard userStory={us} onEdit={() => { setEditingUS(us); setOpenUS(true); }} onDelete={() => handleDeleteUserStory(us.id)} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </SprintBacklogCard>
                    </Box>
                  )}
                </Droppable>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* ----- Modals ----- */}
      <EpicModal open={openEpic} onClose={() => setOpenEpic(false)} onSave={handleSaveEpic} initialEpic={editingEpic} />
      <UserStoryModal open={openUS} onClose={() => setOpenUS(false)} onSave={editingUS ? handleSaveUserStory : handleAddUserStory} initialUS={editingUS} epicOptions={epicOptions} sprintOptions={sprintOptions} defaultProductBacklogId={productBacklog?.id} />
      <SprintBacklogModal open={openSB} onClose={() => setOpenSB(false)} onSave={handleAddSprintBacklog} initialSB={editingSB} />
    </DragDropContext>
  );
}
