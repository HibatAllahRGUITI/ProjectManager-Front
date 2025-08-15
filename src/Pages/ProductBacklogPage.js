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

export default function ProductBacklogPage() {
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

  const [sprintBacklogs, setSprintBacklogs] = useState([]);
  const [openEpic, setOpenEpic] = useState(false);
  const [openUserStory, setOpenUserStory] = useState(false);
  const [openSprint, setOpenSprint] = useState(false);

  const handleAddEpic = (newEpic) =>
    setEpics([...epics, { id: `epic-${Date.now()}`, ...newEpic, userStories: [] }]);
  const handleAddUserStory = (newUserStory) =>
    setFreeUserStories([...freeUserStories, { id: `us-${Date.now()}`, ...newUserStory }]);
  const handleAddSprintBacklog = (newSprint) =>
    setSprintBacklogs([...sprintBacklogs, { id: `sprint-${Date.now()}`, ...newSprint, userStories: [] }]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const getListAndSetter = (droppableId) => {
      if (droppableId === "free-user-stories") return { list: freeUserStories, setter: setFreeUserStories };
      const epic = epics.find(e => e.id === droppableId);
      if (epic) return { list: epic.userStories, setter: (newList) => setEpics(epics.map(e => e.id === droppableId ? { ...e, userStories: newList } : e)) };
      const sprint = sprintBacklogs.find(s => s.id === droppableId);
      if (sprint) return { list: sprint.userStories, setter: (newList) => setSprintBacklogs(sprintBacklogs.map(s => s.id === droppableId ? { ...s, userStories: newList } : s)) };
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
                <Paper ref={provided.innerRef} {...provided.droppableProps}>
                  <EpicCard epic={epic} />
                  {epic.userStories.map((us, index) => (
                    <Draggable key={us.id} draggableId={us.id} index={index}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          style={{ marginBottom: 8, ...dragProvided.draggableProps.style }}
                        >
                          <UserStoryCard userStory={us} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
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
              <Paper
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ p: 2, borderRadius: 2, minHeight: 400 }}
              >
                {freeUserStories.map((us, index) => (
                  <Draggable key={us.id} draggableId={us.id} index={index}>
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={{
                          padding: 16,
                          marginBottom: 8,
                          borderRadius: 4,
                          background: "#eee",
                          userSelect: "none",
                          ...dragProvided.draggableProps.style
                        }}
                      >
                        {us.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Paper>
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
                <Paper
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{ p: 2, mb: 2, minHeight: 100, borderRadius: 2, background: "#f0f0ff" }}
                >
                  <SprintBacklogCard sprint={sprint} />
                  {sprint.userStories.map((us, index) => (
                    <Draggable key={us.id} draggableId={us.id} index={index}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          style={{ marginBottom: 8, ...dragProvided.draggableProps.style }}
                        >
                          <UserStoryCard userStory={us} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}
        </Box>

      </Box>

      {/* Modals */}
      <AddEpicModal open={openEpic} handleClose={() => setOpenEpic(false)} handleAddEpic={handleAddEpic} />
      <AddUserStoryModal open={openUserStory} handleClose={() => setOpenUserStory(false)} handleAddUserStory={handleAddUserStory} />
      <AddSprintBacklogModal open={openSprint} handleClose={() => setOpenSprint(false)} handleAddSprintBacklog={handleAddSprintBacklog} />
    </DragDropContext>
  );
}
