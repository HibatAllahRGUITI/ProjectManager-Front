import { Box, Drawer, Typography, CircularProgress, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from "../Components/Sidebar";
import ProductBacklogPage from "./ProductBacklogPage";
import SprintBacklogPage from "./SprintBacklogPage";
import InviteModal from "../Components/modals/InviteModal";
import { getProductBacklogByProjectId } from "../Services/productBacklogService";
import { getEpicsByBacklogId, createEpic } from "../Services/epicService";
import { getSprintBacklogByProductBacklogId, createSprintBacklog } from "../Services/sprintBacklogService";
import { getUserStoriesByBacklogId, createUserStory } from "../Services/userStoryService";
import { useProject } from '../contexts/ProjectContext';
import { getSprintById, createSprint } from "../Services/sprintService";

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project, setProject } = useProject();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [section, setSection] = useState("product");
  const [selectedSprintId, setSelectedSprintId] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [sprintBacklogsWithNames, setSprintBacklogsWithNames] = useState([]);

  const handleSelectSprint = (sprintId) => {
    setSelectedSprintId(sprintId);
    setSection("sprint");
  };

  const handleAddEpic = async (newEpic) => {
    try {
      console.log("epic: ", newEpic);
      const createdEpic = await createEpic(productBacklog.id, newEpic.nom, newEpic.description);
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
      console.log("User Story : ", newUserStory);
      const createdUserStory = await createUserStory(productBacklog.id, newUserStory.titre, newUserStory.description);

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
        return {
          ...prev,
          freeUserStories: [...prev.freeUserStories, createdUserStory]
        };
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
      const createdSprintBacklog = await createSprintBacklog(productBacklog.id, createdSprint.id);
      console.log("createdSprintBacklog: ", createdSprintBacklog);

      if (!createdSprintBacklog.id) {
        console.error("SprintBacklog returned without ID!", createdSprintBacklog);
        return;
      }

      const enrichedSB = {
        ...createdSprintBacklog,
        id: createdSprintBacklog.id,
        sprint: createdSprint,
        sprintName: createdSprint.name,
        userStories: [],
      };

      setProject(prev => ({
        ...prev,
        sprintBacklogs: [...(prev.sprintBacklogs || []), enrichedSB],
        sprintBacklogsWithNames: [...(prev.sprintBacklogsWithNames || []), enrichedSB],
      }));
    } catch (err) {
      console.error("Failed to add sprint backlog:", err);
      alert("Erreur lors de la création du sprint backlog !");
    }
  };



  const handleInviteUser = (email) => { };

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setError("Missed Project ID in the URL.");
        setLoading(false);
        return;
      }

      if (project && project.id === parseInt(projectId) && project.epics && project.sprintBacklogs) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const productBacklog = await getProductBacklogByProjectId(projectId);
        if (!productBacklog) {
          setError("Product Backlog not found for this Project.");
          setLoading(false);
          return;
        }

        const [epicsData, userStoriesData, sprintsData] = await Promise.all([
          getEpicsByBacklogId(productBacklog.id),
          getUserStoriesByBacklogId(productBacklog.id),
          getSprintBacklogByProductBacklogId(productBacklog.id)
        ]);

        const enrichedSprintBacklogs = await Promise.all(
          sprintsData.map(async (sb) => {
            try {
              const sprint = await getSprintById(sb.sprint?.id);
              return { ...sb, id: sb.id, sprintName: sprint.name };
            } catch {
              return { ...sb, sprintName: "Unnamed Sprint" };
            }
          })
        );
        setSprintBacklogsWithNames(enrichedSprintBacklogs);

        const epicMap = new Map(epicsData.map(epic => [epic.id, { ...epic, userStories: [] }]));
        const sprintMap = new Map(sprintsData.map(sprint => [sprint.id, { ...sprint, userStories: [] }]));

        const freeUserStories = [];
        userStoriesData.forEach(us => {
          const epicId = us.epic?.id || us.epicId;
          const sprintId = us.sprintBacklog?.id || us.sprintBacklogId;

          if (epicId && epicMap.has(epicId)) {
            epicMap.get(epicId).userStories.push(us);
          } else if (sprintId && sprintMap.has(sprintId)) {
            sprintMap.get(sprintId).userStories.push(us);
          } else {
            freeUserStories.push(us);
          }
        });

        const completeProjectData = {
          id: parseInt(projectId),
          productBacklog: productBacklog,
          epics: Array.from(epicMap.values()),
          freeUserStories: freeUserStories,
          sprintBacklogs: Array.from(sprintMap.values()),
        };

        console.log("✅ Data Loaded Successfully:", completeProjectData);
        setProject(completeProjectData);

      } catch (err) {
        setError("Error while loading project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, project, setProject]);

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

        ) : section === "sprint" && selectedSprint && Array.isArray(selectedSprint.userStories) ? (<SprintBacklogPage
          sprint={selectedSprint}
        />
        ) : (
          <Box>
            <Typography>Please select a sprint.</Typography>
          </Box>
        )}
      </Box>
      <InviteModal
        open={isInviteModalOpen}
        handleClose={() => setIsInviteModalOpen(false)}
        handleInvite={handleInviteUser}
      />
    </Box>
  );
}
