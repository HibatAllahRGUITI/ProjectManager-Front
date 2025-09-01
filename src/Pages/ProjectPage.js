import { Box, Drawer, Typography, CircularProgress, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';

import Sidebar from "../Components/Sidebar";
import ProductBacklogPage from "./ProductBacklogPage";
import SprintBacklogPage from "./SprintBacklogPage";
import InviteModal from "../Components/modals/InviteModal";

import { getProductBacklogByProjectId } from "../Services/productBacklogService";
import { getEpicsByBacklogId, createEpic } from "../Services/epicService";
import { getSprintBacklogByProductBacklogId, createSprintBacklog } from "../Services/sprintBacklogService";
import { getUserStoriesByBacklogId, createUserStory } from "../Services/userStoryService";
import { getSprintById, createSprint } from "../Services/sprintService";
import { inviteUserToProject } from "../Services/projectService";

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project, setProject } = useProject();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [section, setSection] = useState("product");
  const [selectedSprintId, setSelectedSprintId] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [sprintBacklogsWithNames, setSprintBacklogsWithNames] = useState([]);

  const handleSelectSprint = (sprintId) => {
    setSelectedSprintId(sprintId);
    setSection("sprint");
  };

  const handleAddEpic = async (newEpic) => {
    try {
      const createdEpic = await createEpic(project.productBacklog.id, newEpic.nom, newEpic.description);
      setProject(prev => ({
        ...prev,
        epics: [...prev.epics, { ...createdEpic, userStories: [] }]
      }));
    } catch (err) {
      console.error("Failed to add epic:", err);
    }
  };

  const handleAddUserStory = async (newUserStory) => {
    try {
      const createdUserStory = await createUserStory(project.productBacklog.id, newUserStory.titre, newUserStory.description);
      setProject(prev => {
        if (newUserStory.epicId) {
          return {
            ...prev,
            epics: prev.epics.map(epic =>
              epic.id === newUserStory.epicId
                ? { ...epic, userStories: [...epic.userStories, createdUserStory] }
                : epic
            )
          };
        }
        return { ...prev, freeUserStories: [...prev.freeUserStories, createdUserStory] };
      });
    } catch (err) {
      console.error("Failed to add user story:", err);
    }
  };

  const handleAddSprintBacklog = async (newSprintBacklog) => {
    try {
      const sprintData = {
        name: newSprintBacklog.sprint.name,
        description: newSprintBacklog.sprint.description,
        startDate: newSprintBacklog.sprint.startDate,
        endDate: newSprintBacklog.sprint.endDate,
      };
      const createdSprint = await createSprint(sprintData);
      const createdSprintBacklog = await createSprintBacklog(project.productBacklog.id, createdSprint.id);

      const enrichedSB = {
        ...createdSprintBacklog,
        sprint: createdSprint,
        sprintName: createdSprint.name,
        userStories: [],
      };

      setProject(prev => ({
        ...prev,
        sprintBacklogs: [...(prev.sprintBacklogs || []), enrichedSB],
      }));
      setSprintBacklogsWithNames(prev => [...prev, enrichedSB]);
    } catch (err) {
      console.error("Failed to add sprint backlog:", err);
      alert("Erreur lors de la création du sprint backlog !");
    }
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setError("Missed Project ID in the URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const productBacklog = await getProductBacklogByProjectId(projectId);
        const [epicsData, userStoriesData, sprintsData] = await Promise.all([
          getEpicsByBacklogId(productBacklog.id),
          getUserStoriesByBacklogId(productBacklog.id),
          getSprintBacklogByProductBacklogId(productBacklog.id),
        ]);

        // Maps
        const epicMap = new Map(epicsData.map(epic => [epic.id, { ...epic, userStories: [] }]));
        const sprintMap = new Map(sprintsData.map(sb => [sb.id, { ...sb, userStories: [] }]));

        // User Stories placement
        userStoriesData.forEach(us => {
          const sprintId = us.sprintBacklog?.id || us.sprintBacklogId;
          const epicId = us.epic?.id || us.epicId;

          const normalizedUS = {
            ...us,
            title: us.titre,
            tasks: us.tasks || { "to-do": [], "in-progress": [], "done": [] },
          };

          if (epicId && epicMap.has(epicId)) {
            epicMap.get(epicId).userStories.push(normalizedUS);
          } else if (sprintId && sprintMap.has(sprintId)) {
            sprintMap.get(sprintId).userStories.push(normalizedUS);
          }
        });

        const freeUserStories = userStoriesData.filter(
          us => !us.epicId && !us.sprintBacklogId
        );

        // Enrich sprints with sprint names
        const enrichedSprintBacklogs = await Promise.all(
          Array.from(sprintMap.values()).map(async (sb) => {
            try {
              const sprint = await getSprintById(sb.sprint?.id);
              return { ...sb, sprintName: sprint.name };
            } catch {
              return { ...sb, sprintName: "Unnamed Sprint" };
            }
          })
        );

        const completeProjectData = {
          id: parseInt(projectId),
          productBacklog,
          epics: Array.from(epicMap.values()),
          freeUserStories,
          sprintBacklogs: enrichedSprintBacklogs,
        };

        setProject(completeProjectData);
        setSprintBacklogsWithNames(enrichedSprintBacklogs);

      } catch (err) {
        console.error(err);
        setError("Error while loading project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, setProject]);

  if (loading || !project) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading Project Data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </Box>
    );
  }

  const { productBacklog, epics, freeUserStories } = project;
  const selectedSprint = sprintBacklogsWithNames.find((s) => s.id === selectedSprintId);

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
          onSelectSection={(sec) => sec === "invite" ? setIsInviteModalOpen(true) : setSection(sec)}
          currentSection={section}
          productBacklogName={productBacklog?.nom}
          onSelectSprint={handleSelectSprint}
          selectedSprintId={selectedSprintId}
          sprintBacklogs={sprintBacklogsWithNames}
        />
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 4 }}>
        {section === "product" ? (
          <ProductBacklogPage
            onCreateEpic={handleAddEpic}
            onCreateUserStory={handleAddUserStory}
            onCreateSprint={handleAddSprintBacklog}
            productBacklog={productBacklog}
            epics={epics}
            freeUserStories={freeUserStories}
            sprintBacklogs={sprintBacklogsWithNames}
          />
        ) : section === "sprint" && selectedSprint ? (
          <SprintBacklogPage sprint={selectedSprint} />
        ) : (
          <Typography>Please select a sprint.</Typography>
        )}
      </Box>

      <InviteModal
        open={isInviteModalOpen}
        handleClose={() => setIsInviteModalOpen(false)}
        handleInvite={async ({ email }) => {
          try {
            console.log("projectId: ", project.id);
            await inviteUserToProject(project.id, email);
            alert(`User ${email} added to project !`);
          } catch (err) {
            alert(err.response?.data || err.message);
          }
        }}
      />
    </Box>
  );
}
