import { useEffect, useState } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import ProjectPage from "../Pages/ProjectPage";
import { getEpicsByBacklogId } from "../Services/epicService";
import { getSprintBacklogByProductBacklogId } from "../Services/sprintBacklogService";
import { getUserStoriesByBacklogId } from "../Services/userStoryService";

export default function ProjectLoader({ project, onGoBack }) {
    const [completeProjectData, setCompleteProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchProjectDetails = async () => {
            if (!project || !project.productBacklog) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log("➡️ Démarrage du chargement des détails du projet pour l'ID:", project.id);

                const [epicsData, userStoriesData, sprintsData] = await Promise.all([
                    getEpicsByBacklogId(project.productBacklog.id).catch(() => []),
                    getUserStoriesByBacklogId(project.productBacklog.id).catch(() => []),
                    getSprintBacklogByProductBacklogId(project.productBacklog.id).catch(() => []),
                ]);

                const completeData = {
                    ...project,
                    epics: epicsData,
                    freeUserStories: userStoriesData,
                    sprintBacklogs: sprintsData,
                };

                console.log("✅ Données du projet chargées :", completeData);

                if (isMounted) {
                    setCompleteProjectData(completeData);
                    setLoading(false);
                    setError(null);
                }

            } catch (err) {
                console.error("❌ Erreur lors du chargement des données du projet", err);
                if (isMounted) {
                    setError("Échec du chargement des détails du projet.");
                    setLoading(false);
                }
            }
        };

        fetchProjectDetails();

        return () => {
            isMounted = false;
        };

    }, [project]);

    if (loading) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Chargement des données du projet...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (completeProjectData) {
        return <ProjectPage project={completeProjectData} onGoBack={onGoBack} />;
    }

    return null;
}