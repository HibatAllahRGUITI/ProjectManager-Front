import { Box, Typography, Button, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import EpicCard from "../Components/cards/EpicCard";
import UserStoryCard from "../Components/cards/UserStoryCard";
import SprintBacklogCard from "../Components/cards/SprintBacklogCard";
import AddEpicModal from "../Components/modals/AddEpicModal";
import AddUserStoryModal from "../Components/modals/AddUserStoryModal";
import AddSprintBacklogModal from "../Components/modals/AddSprintBacklogModal";

export default function ProductBacklogPage({
  sprintBacklogs,
  onCreateSprint,
  epics,
  onCreateEpic,
  freeUserStories,
  onCreateUserStory,
}) {
  const [openEpic, setOpenEpic] = useState(false);
  const [openUserStory, setOpenUserStory] = useState(false);
  const [openSprint, setOpenSprint] = useState(false);

  useEffect(() => {
    console.log("📝 ProductBacklogPage mounted");
    console.log("Epics:", epics);
    console.log("Free User Stories:", freeUserStories);
    console.log("Sprint Backlogs:", sprintBacklogs);
  }, [epics, freeUserStories, sprintBacklogs]);

  const handleAddEpic = (newEpic) =>
    onCreateEpic({
      id: `epic-${Date.now()}`,
      ...newEpic,
      userStories: [],
    });

  const handleAddUserStory = (newUserStory) =>
    onCreateUserStory({
      id: `us-${Date.now()}`,
      ...newUserStory,
    });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const getListAndSetter = (droppableId) => {
      if (droppableId === "free-user-stories")
        return { list: freeUserStories, setter: onCreateUserStory };

      const epic = epics.find((e) => String(e.id) === droppableId);
      if (epic)
        return {
          list: epic.userStories || [],
          setter: (newList) =>
            onCreateEpic(
              epics.map((e) =>
                String(e.id) === droppableId ? { ...e, userStories: newList } : e
              )
            ),
        };

      const sprint = sprintBacklogs.find((s) => String(s.id) === droppableId);
      if (sprint)
        return {
          list: sprint.userStories || [],
          setter: (newList) =>
            onCreateSprint(
              sprintBacklogs.map((s) =>
                String(s.id) === droppableId ? { ...s, userStories: newList } : s
              )
            ),
        };

      return null;
    };

    const sourceObj = getListAndSetter(source.droppableId);
    const destObj = getListAndSetter(destination.droppableId);
    if (!sourceObj || !destObj) return;

    if (source.droppableId === destination.droppableId) {
      const newList = Array.from(sourceObj.list);
      const [movedItem] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, movedItem);
      sourceObj.setter(newList);
    } else {
      const sourceList = Array.from(sourceObj.list);
      const [movedItem] = sourceList.splice(source.index, 1);

      const destList = Array.from(destObj.list);
      destList.splice(destination.index, 0, movedItem);

      sourceObj.setter(sourceList);
      destObj.setter(destList);
    }
  };

  console.log("Epics type:", Array.isArray(epics), epics);
  console.log("SprintBacklogs type:", Array.isArray(sprintBacklogs), sprintBacklogs);


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box sx={{ display: "flex", p: 2, gap: 3, height: "100%" }}>
        {/* Epics */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Epics</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenEpic(true)}
              startIcon={<AddIcon />}
            >
              Add an Epic
            </Button>
          </Box>
          <Box>
            {epics.map((epic) => {
              const userStories = epic.userStories || []; // Toujours un tableau
              return (
                <Droppable droppableId={epic.id.toString()} type="user-story" key={epic.id}>
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ mb: 2 }}>
                      <Paper sx={{ p: 2, borderRadius: 2, background: "#f5f5f5", minHeight: 100 }}>
                        <EpicCard epic={epic} />
                        {epic.userStories?.map((us, index) => (
                          <Draggable key={us.id} draggableId={String(us.id)} index={index}>
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
              );
            })}
          </Box>
        </Box>

        {/* User Stories libres */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>User Stories</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenUserStory(true)}
              startIcon={<AddIcon />}
            >
              Add a US
            </Button>
          </Box>
          <Droppable droppableId="free-user-stories" type="user-story">
            {(provided) => (
              <Paper
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ minHeight: 400, p: 2, bgcolor: "#fafafa" }}
              >
                {freeUserStories.map((us, index) => (
                  <Draggable key={us.id} draggableId={String(us.id)} index={index}>
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        style={{ ...dragProvided.draggableProps.style }}
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
        </Box>

        {/* Sprint Backlogs */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>Sprint Backlogs</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenSprint(true)}
              startIcon={<AddIcon />}
            >
              Add a Sprint
            </Button>
          </Box>
          <Box>
            {sprintBacklogs.map((sprint) => {
              const userStories = sprint.userStories || [];
              return (
                <Droppable droppableId={sprint.id.toString()} key={sprint.id} type="user-story">
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ mb: 2 }}>
                      <Paper sx={{ p: 2, borderRadius: 2, background: "#f0f0ff", minHeight: 100 }}>
                        <SprintBacklogCard sprint={sprint.sprint} />
                        {sprint.userStories?.map((us, index) => (
                          <Draggable key={us.id} draggableId={String(us.id)} index={index}>
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
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Modals */}
      <AddEpicModal open={openEpic} handleClose={() => setOpenEpic(false)} handleAddEpic={handleAddEpic} />
      <AddUserStoryModal open={openUserStory} handleClose={() => setOpenUserStory(false)} handleAddUserStory={handleAddUserStory} />
      <AddSprintBacklogModal open={openSprint} handleClose={() => setOpenSprint(false)} handleAddSprintBacklog={onCreateSprint} />
    </DragDropContext>
  );
}
