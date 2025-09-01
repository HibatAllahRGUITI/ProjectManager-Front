// src/pages/SprintBacklogPage.jsx
import { Box, Typography, Button, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AddIcon from "@mui/icons-material/Add";
import TaskCard from "../Components/cards/TaskCard";
import AddTaskModal from "../Components/modals/AddTaskModal";
import DetailModal from "../Components/modals/DetailModal";

import {
    createTaskForUserStory,
    updateTask,
    deleteTask,
    getTasksByUserStoryId,
} from "../Services/taskService";

export default function SprintBacklogPage({ sprint: propSprint }) {
    const [sprint, setSprint] = useState(propSprint);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [selectedUserStoryId, setSelectedUserStoryId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const columnLabels = {
        TO_DO: "To Do",
        IN_PROGRESS: "In Progress",
        DONE: "Done"
    };


    // ----- Add Task -----
    const handleAddTask = async ({ title, description }) => {
        try {
            const createdTask = await createTaskForUserStory(selectedUserStoryId, {
                title,
                description,
                status: "TO_DO",
            });

            setSprint((prevSprint) => {
                const newUserStories = prevSprint.userStories.map((us) =>
                    us.id === selectedUserStoryId
                        ? {
                            ...us,
                            tasks: {
                                ...us.tasks,
                                "TO_DO": [...us.tasks["TO_DO"], createdTask],
                            },
                        }
                        : us
                );
                return { ...prevSprint, userStories: newUserStories };
            });

            setIsAddTaskModalOpen(false);
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // ----- Update Task -----
    const handleUpdateTask = async (updatedTask) => {
        try {
            const savedTask = await updateTask(updatedTask.id, updatedTask);

            setSprint((prevSprint) => {
                const newUserStories = prevSprint.userStories.map((us) => {
                    const newTasks = {};
                    Object.keys(us.tasks).forEach((col) => {
                        newTasks[col] = us.tasks[col].map((t) =>
                            t.id === savedTask.id ? savedTask : t
                        );
                    });
                    return { ...us, tasks: newTasks };
                });
                return { ...prevSprint, userStories: newUserStories };
            });

            setSelectedTask(null);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // ----- Delete Task -----
    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);

            setSprint((prevSprint) => {
                const newUserStories = prevSprint.userStories.map((us) => {
                    const newTasks = {};
                    Object.keys(us.tasks).forEach((col) => {
                        newTasks[col] = us.tasks[col].filter((t) => t.id !== taskId);
                    });
                    return { ...us, tasks: newTasks };
                });
                return { ...prevSprint, userStories: newUserStories };
            });

            setSelectedTask(null);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // ----- Drag & Drop -----
    const onDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const [sourceUserStoryId, sourceColumnId] = source.droppableId.split("__");
        const [destUserStoryId, destColumnId] = destination.droppableId.split("__");

        setSprint((prevSprint) => {
            const newUserStories = [...prevSprint.userStories];
            const sourceStory = newUserStories.find(
                (us) => String(us.id) === sourceUserStoryId
            );
            const destStory = newUserStories.find(
                (us) => String(us.id) === destUserStoryId
            );
            if (!sourceStory || !destStory) return prevSprint;

            const sourceTasks = [...sourceStory.tasks[sourceColumnId]];
            const destTasks = [...destStory.tasks[destColumnId]];
            const [movedTask] = sourceTasks.splice(source.index, 1);

            // ⚡ Update backend: change status
            movedTask.status = destColumnId;
            updateTask(movedTask.id, movedTask).catch((err) =>
                console.error("Error updating task status:", err)
            );

            if (
                sourceUserStoryId === destUserStoryId &&
                sourceColumnId === destColumnId
            ) {
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

    // ----- Initial fetch of tasks -----
    useEffect(() => {
        if (propSprint) {
            // Charger les tâches de chaque US depuis le backend
            const fetchTasks = async () => {
                const userStoriesWithTasks = await Promise.all(
                    propSprint.userStories.map(async (us) => {
                        try {
                            const tasks = await getTasksByUserStoryId(us.id);

                            // Regrouper les tasks par statut
                            const groupedTasks = {
                                "TO_DO": tasks.filter((t) => t.status === "TO_DO"),
                                "IN_PROGRESS": tasks.filter((t) => t.status === "IN_PROGRESS"),
                                "DONE": tasks.filter((t) => t.status === "DONE"),
                            };

                            return { ...us, tasks: groupedTasks };
                        } catch (error) {
                            console.error("Error fetching tasks for user story:", us.id, error);
                            return { ...us, tasks: { "TO_DO": [], "IN_PROGRESS": [], "DONE": [] } };
                        }
                    })
                );

                setSprint({ ...propSprint, userStories: userStoriesWithTasks });
            };

            fetchTasks();
        }
    }, [propSprint]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
                    Sprint: {sprint.sprintName}
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {sprint.userStories.map((us) => (
                        <Paper key={us.id} elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 2,
                                }}
                            >
                                <Typography variant="h5">{us.title}</Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setSelectedUserStoryId(us.id);
                                        setIsAddTaskModalOpen(true);
                                    }}
                                    startIcon={<AddIcon />}
                                >
                                    Add a Task
                                </Button>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2 }}>
                                {["TO_DO", "IN_PROGRESS", "DONE"].map((columnId) => (
                                    <Droppable
                                        key={`${us.id}__${columnId}`}
                                        droppableId={`${us.id}__${columnId}`}
                                        type="TASK"
                                    >
                                        {(provided) => (
                                            <Box
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                sx={{
                                                    flex: 1,
                                                    minHeight: 200,
                                                    p: 1,
                                                    border: "1px dashed #ccc",
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        textTransform: "capitalize",
                                                        fontWeight: "bold",
                                                        mb: 1,
                                                    }}
                                                >
                                                    {columnLabels[columnId]}
                                                </Typography>
                                                {(us.tasks[columnId] || []).map((task, index) => (
                                                    <Draggable
                                                        key={task.id}
                                                        draggableId={String(task.id)}
                                                        index={index}
                                                    >
                                                        {(dragProvided) => (
                                                            <div
                                                                ref={dragProvided.innerRef}
                                                                {...dragProvided.draggableProps}
                                                                {...dragProvided.dragHandleProps}
                                                                style={{ ...dragProvided.draggableProps.style }}
                                                                onClick={() => setSelectedTask(task)}
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
                open={isAddTaskModalOpen}
                handleClose={() => setIsAddTaskModalOpen(false)}
                handleAddTask={handleAddTask}
            />

            {selectedTask && (
                <DetailModal
                    open={!!selectedTask}
                    type="task"
                    item={selectedTask}
                    handleClose={() => setSelectedTask(null)}
                    handleUpdate={handleUpdateTask}
                    handleDelete={handleDeleteTask}
                />
            )}
        </DragDropContext>
    );
}
