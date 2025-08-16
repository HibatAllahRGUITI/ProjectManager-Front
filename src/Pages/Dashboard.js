import { Container, Grid, Typography, Button, Box, Menu, MenuItem, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useEffect } from "react";
import ProjectCard from '../Components/ProjectCard';
import AddProjectModal from '../Components/AddProjectModal';
import ProjectPage from './ProjectPage';

export default function Dashboard() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openBacklog, setOpenBacklog] = useState(false);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [backlogTitle, setBacklogTitle] = useState("");
  const [backlogDesc, setBacklogDesc] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);

  const [projects, setProjects] = useState([
    { id: 1, name: "Site Web E-commerce", description: "Conception et développement d'une boutique en ligne.", productBacklog: null },
    { id: 2, name: "Application Mobile de Fitness", description: "Suivi des entraînements et progrès.", productBacklog: null },
    { id: 3, name: "Plateforme de Gestion de Projet", description: "Outil interne pour le suivi des tâches.", productBacklog: null },
  ]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuProjectId, setMenuProjectId] = useState(null);

  const handleMenuOpen = (event, projectId) => {
    setAnchorEl(event.currentTarget);
    setMenuProjectId(projectId);
  };
  const handleMenuClose = () => { setAnchorEl(null); setMenuProjectId(null); };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleAddProject = () => {
    const newProject = {
      id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      name: projectTitle,
      description: projectDesc,
      productBacklog: null,
    };
    setProjects([...projects, newProject]);
    setProjectTitle(""); setProjectDesc("");
    handleCloseAdd();
  };

  const handleOpenEdit = () => {
    const proj = projects.find(p => p.id === menuProjectId);
    setProjectTitle(proj.name);
    setProjectDesc(proj.description);
    setOpenEdit(true);
    handleMenuClose();
  };
  const handleCloseEdit = () => setOpenEdit(false);
  const handleEditProject = () => {
    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === menuProjectId
          ? { ...p, name: projectTitle, description: projectDesc }
          : p
      )
    );
    setProjectTitle("");
    setProjectDesc("");
    handleCloseEdit();
  };

  const handleDeleteProject = () => {
    setProjects(projects.filter(p => p.id !== menuProjectId));
    handleMenuClose();
  };

  const handleOpenBacklog = () => {
    setBacklogTitle("");
    setBacklogDesc("");
    setOpenBacklog(true);
    handleMenuClose();
  };
  const handleCloseBacklog = () => setOpenBacklog(false);
  const handleCreateBacklog = () => {
    const newBacklog = {
      id: `ProductBacklog-${backlogTitle.replace(/\s/g, "")}-${menuProjectId}`,
      name: backlogTitle,
      description: backlogDesc,
      epics: [],
      freeUserStories: []
    };
    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === menuProjectId
          ? { ...p, productBacklog: newBacklog }
          : p
      )
    );
    handleCloseBacklog();
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const handleGoBack = () => {
    setSelectedProject(null);
  };

  return (
    <Container sx={{ mt: 6, p: { xs: 2, md: 4 } }}>
      {!selectedProject ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: { xs: 2, sm: 0 } }}>
              Mes projets
            </Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />}
              sx={{ py: 1.5, px: 3, borderRadius: 2, textTransform: 'none', fontSize: '1rem', boxShadow: '0px 4px 15px rgba(0,0,0,0.1)' }}
              onClick={handleOpenAdd}>
              Ajouter un projet
            </Button>
          </Box>

          <Grid container spacing={4}>
            {projects.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.id}>
                <Box sx={{ position: "relative" }} onClick={() => handleSelectProject(p)}>
                  <ProjectCard project={p} />
                  <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={(e) => { e.stopPropagation(); handleMenuOpen(e, p.id) }}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleOpenEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDeleteProject}>Delete</MenuItem>
            <MenuItem onClick={handleOpenBacklog}>Create Product Backlog</MenuItem>
          </Menu>

          <AddProjectModal open={openAdd} handleClose={handleCloseAdd} handleAddProject={handleAddProject}
            projectTitle={projectTitle} setProjectTitle={setProjectTitle} projectDesc={projectDesc} setProjectDesc={setProjectDesc}
            titleText="Add projet" buttonText="Add" />

          <AddProjectModal open={openEdit} handleClose={handleCloseEdit} handleAddProject={handleEditProject}
            projectTitle={projectTitle} setProjectTitle={setProjectTitle} projectDesc={projectDesc} setProjectDesc={setProjectDesc}
            titleText="Edit projet" buttonText="Save" />

          <AddProjectModal open={openBacklog} handleClose={handleCloseBacklog} handleAddProject={handleCreateBacklog}
            projectTitle={backlogTitle} setProjectTitle={setBacklogTitle} projectDesc={backlogDesc} setBacklogDesc={setBacklogDesc}
            titleText="Create Product Backlog" buttonText="Create" />
        </>
      ) : (
        <ProjectPage project={selectedProject} onGoBack={handleGoBack} sprintBacklogs={[]} />
      )}
    </Container>
  );
}