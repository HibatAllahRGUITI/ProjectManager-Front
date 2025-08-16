// src/pages/SprintBacklogPage.jsx

import { Box, Typography, Button, Paper } from "@mui/material";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "../Components/TaskCard";
import AddTaskModal from "../Components/AddTaskModal";

const initialData = {
    id: "sprint-1",
    title: "Sprint de développement",
    userStories: [
        {
            id: "us-1",
            title: "En tant que client, je veux m'inscrire",
            tasks: {
                "to-do": [{ id: "task-1", title: "Créer le formulaire d'inscription" }],
                "in-progress": [],
                "done": [{ id: "task-2", title: "Configurer l'API d'authentification" }],
            },
        },
        {
            id: "us-2",
            title: "En tant que client, je veux me connecter",
            tasks: {
                "to-do": [{ id: "task-3", title: "Créer la page de connexion" }],
                "in-progress": [],
                "done": [],
            },
        },
    ],
};

export default function SprintBacklogPage({ sprint: propSprint }) {
    const [sprint, setSprint] = useState(propSprint || initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserStoryId, setSelectedUserStoryId] = useState(null);

    const handleAddTask = (taskTitle) => {
        const newTaskId = `task-${Date.now()}`;
        const newTask = { id: newTaskId, title: taskTitle };

        setSprint(prevSprint => {
            const newUserStories = prevSprint.userStories.map(us => {
                if (us.id === selectedUserStoryId) {
                    return {
                        ...us,
                        tasks: {
                            ...us.tasks,
                            "to-do": [...us.tasks["to-do"], newTask],
                        },
                    };
                }
                return us;
            });
            return { ...prevSprint, userStories: newUserStories };
        });
        setIsModalOpen(false);
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const [sourceUserStoryId, sourceColumnId] = source.droppableId.split("__");
        const [destUserStoryId, destColumnId] = destination.droppableId.split("__");

        setSprint(prevSprint => {
            const newUserStories = [...prevSprint.userStories];
            const sourceStory = newUserStories.find(us => us.id === sourceUserStoryId);
            const destStory = newUserStories.find(us => us.id === destUserStoryId);

            if (!sourceStory || !destStory) return prevSprint;

            const sourceTasks = [...sourceStory.tasks[sourceColumnId]];
            const destTasks = [...destStory.tasks[destColumnId]];

            const [movedTask] = sourceTasks.splice(source.index, 1);

            if (sourceUserStoryId === destUserStoryId && sourceColumnId === destColumnId) {
                sourceTasks.splice(destination.index, 0, movedTask);
                sourceStory.tasks[sourceColumnId] = sourceTasks;
            } else {
                destTasks.splice(destination.index, 0, movedTask);
                sourceStory.tasks[sourceColumnId] = sourceTasks;
                destStory.tasks[destColumnId] = destTasks;
            }

            return { ...prevSprint, userStories: newUserStories };
        });
    };


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
                    Sprint: {sprint.title}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {sprint.userStories.map((us) => (
                        <Paper key={us.id} elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="h5">{us.title}</Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setSelectedUserStoryId(us.id);
                                        setIsModalOpen(true);
                                    }}
                                    startIcon={<AddIcon />}
                                >
                                    Tâche
                                </Button>
                            </Box>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                {["to-do", "in-progress", "done"].map((columnId) => (
                                    <Droppable key={`${us.id}__${columnId}`} droppableId={`${us.id}__${columnId}`} type="TASK">
                                        {(provided) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                sx={{ flex: 1, minHeight: 200, p: 1, border: "1px dashed #ccc" }}
                                            >
                                                <Typography variant="body1" sx={{ textTransform: "capitalize", fontWeight: "bold", mb: 1 }}>
                                                    {columnId.replace("-", " ")}
                                                </Typography>
                                                {us.tasks[columnId].map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(dragProvided) => (
                                                            <div
                                                                ref={dragProvided.innerRef}
                                                                {...dragProvided.draggableProps}
                                                                {...dragProvided.dragHandleProps}
                                                                style={{ ...dragProvided.draggableProps.style }}
                                                            >
                                                                <TaskCard task={task} />
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
                        </Paper>
                    ))}
                </Box>

            </Box>
            <AddTaskModal
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                handleAddTask={handleAddTask}
            />
        </DragDropContext>
    );
}