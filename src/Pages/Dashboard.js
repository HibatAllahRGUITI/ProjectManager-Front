import { Container, Grid, Typography, Button, Box, Menu, MenuItem, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useEffect } from "react";
import ProjectCard from '../Components/ProjectCard';
import AddProjectModal from '../Components/AddProjectModal';
import ProjectPage from './ProjectPage';
import { getProjectsByUser, addProject, editProject, deleteProject } from "../Services/projectService";
import { createBacklog } from "../Services/productBacklogService";

export default function Dashboard() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openBacklog, setOpenBacklog] = useState(false);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [backlogTitle, setBacklogTitle] = useState("");
  const [backlogDesc, setBacklogDesc] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuProjectId, setMenuProjectId] = useState(null);

  // Ouvrir le menu
  const handleMenuOpen = (event, id) => {
    event.stopPropagation();
    setMenuProjectId(id); // stocke l'ID sélectionné
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuProjectId(null);
  };

  // Ajouter projet
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleAddProject = async () => {
    try {
      const createdProject = await addProject(projectTitle, projectDesc);
      setProjects([...projects, createdProject]);
      setProjectTitle("");
      setProjectDesc("");
      handleCloseAdd();
    } catch (error) {
      alert("Error adding project: " + (error.response?.data?.message || error.message));
    }
  };

  // Edit projet
  const handleOpenEdit = () => {
    if (!menuProjectId) return;
    const proj = projects.find(p => p.id === menuProjectId);
    if (!proj) return;
    setProjectTitle(proj.nom);
    setProjectDesc(proj.description || "");
    setOpenEdit(true);
    setAnchorEl(null);
  };

  const handleCloseEdit = () => setOpenEdit(false);

  const handleEditProject = async () => {
    if (!menuProjectId) {
      alert("Project ID is null!");
      return;
    }
    try {
      const updatedProject = await editProject(menuProjectId, projectTitle, projectDesc);
      setProjects(prev =>
        prev.map(p => (p.id === menuProjectId ? updatedProject : p))
      );
      setProjectTitle("");
      setProjectDesc("");
      handleCloseEdit();
    } catch (error) {
      alert("Error editing project: " + (error.response?.data?.message || error.message));
    }
  };

  // Supprimer projet
  const handleDeleteProject = async () => {
    try {
      await deleteProject(menuProjectId);
      setProjects(prev => prev.filter(p => p.id !== menuProjectId));
      handleMenuClose();
    } catch (error) {
      alert("Error deleting project: " + (error.response?.data?.message || error.message));
    }
  };

  // Backlog
  const handleOpenBacklog = (id) => {
    if (!id) return;
    const proj = projects.find(p => p.id === id);
    if (!proj) return;

    setBacklogTitle("");
    setBacklogDesc("");
    setMenuProjectId(id); // stocke correctement l'ID sélectionné
    setOpenBacklog(true);
  };


  const handleCloseBacklog = () => setOpenBacklog(false);

  const handleCreateBacklog = async () => {
    if (!menuProjectId) {
      alert("Le backlog doit être associé à un projet !");
      return;
    }
    try {
      const createdBacklog = await createBacklog(menuProjectId, backlogTitle, backlogDesc);
      setProjects(prev =>
        prev.map(p =>
          p.id === menuProjectId ? { ...p, productBacklog: createdBacklog } : p
        )
      );
      handleCloseBacklog();
    } catch (error) {
      alert("Error creating backlog: " + (error.response?.data?.message || error.message));
    }
  };

  // Sélectionner projet
  const handleSelectProject = (project) => setSelectedProject(project);
  const handleGoBack = () => setSelectedProject(null);

  // Charger projets
  useEffect(() => {
    const fetchProjects = async () => {
      const userItem = localStorage.getItem('user');
      if (!userItem) return;
      try {
        const user = JSON.parse(userItem);
        const data = await getProjectsByUser(user.username);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error.response?.data || error.message);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Container sx={{ mt: 6, p: { xs: 2, md: 4 } }}>
      {!selectedProject ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: { xs: 2, sm: 0 } }}>
              My projects
            </Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />}
              sx={{ py: 1.5, px: 3, borderRadius: 2, textTransform: 'none', fontSize: '1rem', boxShadow: '0px 4px 15px rgba(0,0,0,0.1)' }}
              onClick={handleOpenAdd}>
              Add a Project
            </Button>
          </Box>

          <Grid container spacing={4}>
            {projects.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <Box sx={{ position: "relative" }} onClick={() => handleSelectProject(p)}>
                  <ProjectCard project={p} />
                  <IconButton
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={(e) => handleMenuOpen(e, p.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleOpenEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDeleteProject}>Delete</MenuItem>
            <MenuItem onClick={() => handleOpenBacklog(menuProjectId)}>
              Create Product Backlog
            </MenuItem>

          </Menu>

          {/* Modals */}
          <AddProjectModal
            open={openAdd}
            handleClose={handleCloseAdd}
            handleAddProject={handleAddProject}
            projectTitle={projectTitle}
            setProjectTitle={setProjectTitle}
            projectDesc={projectDesc}
            setProjectDesc={setProjectDesc}
            titleText="Add project"
            buttonText="Add"
          />

          <AddProjectModal
            open={openEdit}
            handleClose={handleCloseEdit}
            handleAddProject={handleEditProject}
            projectTitle={projectTitle}
            setProjectTitle={setProjectTitle}
            projectDesc={projectDesc}
            setProjectDesc={setProjectDesc}
            titleText="Edit project"
            buttonText="Save"
          />

          <AddProjectModal
            open={openBacklog}
            handleClose={handleCloseBacklog}
            handleAddProject={handleCreateBacklog}
            projectTitle={backlogTitle}
            setProjectTitle={setBacklogTitle}
            projectDesc={backlogDesc}
            setProjectDesc={setBacklogDesc}
            titleText="Create Product Backlog"
            buttonText="Create"
          />
        </>
      ) : (
        <ProjectPage project={selectedProject} onGoBack={handleGoBack} sprintBacklogs={[]} />
      )}
    </Container>
  );
}
