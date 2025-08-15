// src/pages/ProductBacklogPage.jsx

import { Box, Typography, Button, Paper } from "@mui/material";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddIcon from "@mui/icons-material/Add";
import EpicCard from "../Components/EpicCard";
import UserStoryCard from "../Components/UserStoryCard";
import SprintBacklogCard from "../Components/SprintBacklogCard";
import AddEpicModal from "../Components/AddEpicModal";
import AddUserStoryModal from "../Components/AddUserStoryModal";
import AddSprintBacklogModal from "../Components/AddSprintBacklogModal";

// MODIFICATION: Le composant accepte maintenant les props du parent (ProjectPage).
export default function ProductBacklogPage({ sprintBacklogs, onAddSprintBacklog, onUpdateSprints }) {
  const [epics, setEpics] = useState([
    { id: "epic-1", title: "Authentification", userStories: [] },
    { id: "epic-2", title: "Panier et Paiement", userStories: [] },
  ]);

  const [freeUserStories, setFreeUserStories] = useState([
    { id: "us-1", title: "En tant que client, je veux m'inscrire" },
    { id: "us-2", title: "En tant que client, je veux me connecter" },
    { id: "us-3", title: "En tant qu'admin, je veux réinitialiser un mot de passe" },
    { id: "us-4", title: "En tant que client, je veux ajouter des produits au panier" },
    { id: "us-5", title: "En tant que client, je veux payer ma commande" },
  ]);

  // MODIFICATION: L'état des sprints a été déplacé vers le composant parent.
  // const [sprintBacklogs, setSprintBacklogs] = useState([]);
  const [openEpic, setOpenEpic] = useState(false);
  const [openUserStory, setOpenUserStory] = useState(false);
  const [openSprint, setOpenSprint] = useState(false);

  const handleAddEpic = (newEpic) =>
    setEpics([...epics, { id: `epic-${Date.now()}`, ...newEpic, userStories: [] }]);
  const handleAddUserStory = (newUserStory) =>
    setFreeUserStories([...freeUserStories, { id: `us-${Date.now()}`, ...newUserStory }]);
  // MODIFICATION: La fonction locale handleAddSprintBacklog a été supprimée
  // car nous utilisons maintenant la prop onAddSprintBacklog du parent.
  // const handleAddSprintBacklog = (newSprint) =>
  //   setSprintBacklogs([...sprintBacklogs, { id: `sprint-${Date.now()}`, ...newSprint, userStories: [] }]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const getListAndSetter = (droppableId) => {
      if (droppableId === "free-user-stories") return { list: freeUserStories, setter: setFreeUserStories };
      const epic = epics.find(e => e.id === droppableId);
      if (epic) return { list: epic.userStories, setter: (newList) => setEpics(epics.map(e => e.id === droppableId ? { ...e, userStories: newList } : e)) };
      const sprint = sprintBacklogs.find(s => s.id === droppableId);
      if (sprint) {
        // MODIFICATION: Le setter pour les sprints appelle la fonction passée par le parent (onUpdateSprints).
        return {
          list: sprint.userStories,
          setter: (newList) => {
            const updatedSprints = sprintBacklogs.map(s => s.id === droppableId ? { ...s, userStories: newList } : s);
            onUpdateSprints(updatedSprints);
          }
        };
      }
      return null;
    };

    const sourceObj = getListAndSetter(source.droppableId);
    const destObj = getListAndSetter(destination.droppableId);
    if (!sourceObj || !destObj) return;

    const item = sourceObj.list[source.index];
    const newSource = [...sourceObj.list];
    newSource.splice(source.index, 1);
    sourceObj.setter(newSource);

    const newDest = [...destObj.list];
    newDest.splice(destination.index, 0, item);
    destObj.setter(newDest);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ display: "flex", p: 2, gap: 3, height: "100%" }}>
        {/* Epics */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Epics</Typography>
            <Button variant="contained" color="primary" onClick={() => setOpenEpic(true)} startIcon={<AddIcon />}>Ajouter Epic</Button>
          </Box>
          {epics.map(epic => (
            <Droppable droppableId={epic.id} type="user-story" key={epic.id}>
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ mb: 2 }}>
                  <Paper sx={{ p: 2, borderRadius: 2, background: "#f5f5f5", minHeight: 100 }}>
                    <EpicCard epic={epic} />
                    {epic.userStories.map((us, index) => (
                      <Draggable key={us.id} draggableId={us.id} index={index}>
                        {(dragProvided) => (
                          <Box
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            sx={{ mb: 1 }}
                            style={{ ...dragProvided.draggableProps.style }}
                          >
                            <UserStoryCard userStory={us} />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Paper>
                </Box>
              )}
            </Droppable>
          ))}
        </Box>

        {/* User Stories libres */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>User Stories</Typography>
            <Button variant="contained" color="primary" onClick={() => setOpenUserStory(true)} startIcon={<AddIcon />}>Ajouter US</Button>
          </Box>
          <Droppable droppableId="free-user-stories" type="user-story">
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 400 }}>
                {freeUserStories.map((us, index) => (
                  <Draggable key={us.id} draggableId={us.id} index={index}>
                    {(dragProvided) => (
                      <Box
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        sx={{
                          p: 2,
                          mb: 1,
                          borderRadius: 1,
                          bgcolor: "#eee",
                          userSelect: "none",
                        }}
                        style={{ ...dragProvided.draggableProps.style }}
                      >
                        {us.title}
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </Box>

        {/* Sprint Backlogs */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Sprint Backlogs</Typography>
            <Button variant="contained" color="secondary" onClick={() => setOpenSprint(true)} startIcon={<AddIcon />}>Ajouter Sprint</Button>
          </Box>
          {sprintBacklogs.map(sprint => (
            <Droppable droppableId={sprint.id} key={sprint.id} type="user-story">
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ mb: 2 }}>
                  <Paper sx={{ p: 2, borderRadius: 2, background: "#f0f0ff", minHeight: 100 }}>
                    <SprintBacklogCard sprint={sprint} />
                    {sprint.userStories.map((us, index) => (
                      <Draggable key={us.id} draggableId={us.id} index={index}>
                        {(dragProvided) => (
                          <Box
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            sx={{ mb: 1 }}
                            style={{ ...dragProvided.draggableProps.style }}
                          >
                            <UserStoryCard userStory={us} />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Paper>
                </Box>
              )}
            </Droppable>
          ))}
        </Box>

      </Box>

      {/* Modals */}
      <AddEpicModal open={openEpic} handleClose={() => setOpenEpic(false)} handleAddEpic={handleAddEpic} />
      <AddUserStoryModal open={openUserStory} handleClose={() => setOpenUserStory(false)} handleAddUserStory={handleAddUserStory} />
      {/* MODIFICATION: La prop onAddSprintBacklog est maintenant passée à la modale */}
      <AddSprintBacklogModal open={openSprint} handleClose={() => setOpenSprint(false)} handleAddSprintBacklog={onAddSprintBacklog} />
    </DragDropContext>
  );
}