import { Container, Grid, Typography, Button, Box, Menu, MenuItem, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useEffect } from "react";
import ProjectCard from '../Components/cards/ProjectCard';
import AddProjectModal from '../Components/modals/AddProjectModal';
import { useNavigate } from 'react-router-dom';
import { getProjectsByUser, addProject, editProject, deleteProject } from "../Services/projectService";
import { createBacklog, getProductBacklogByProjectId } from "../Services/productBacklogService";
import { useProject } from '../contexts/ProjectContext';

export default function Dashboard() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openBacklog, setOpenBacklog] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [backlogTitle, setBacklogTitle] = useState("");
  const [backlogDesc, setBacklogDesc] = useState("");
  const [projects, setProjects] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuProjectId, setMenuProjectId] = useState(null);

  const { setProject } = useProject();
  const navigate = useNavigate();

  // ───────── Menu et modals ─────────
  const handleMenuOpen = (event, id) => {
    event.stopPropagation();
    setMenuProjectId(id);
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuProjectId(null);
  };
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
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
  const handleOpenBacklog = (id) => {
    if (!id) return;
    setBacklogTitle("");
    setBacklogDesc("");
    setMenuProjectId(id);
    setOpenBacklog(true);
  };
  const handleCloseBacklog = () => setOpenBacklog(false);

  // ───────── Actions CRUD ─────────
  const handleAddProject = async () => {
    try {
      const createdProject = await addProject(projectTitle, projectDesc);
      setProjects([...projects, createdProject]);
      setProjectTitle(""); setProjectDesc("");
      handleCloseAdd();
    } catch (error) {
      alert("Error adding project: " + (error.response?.data?.message || error.message));
    }
  };
  const handleEditProject = async () => {
    if (!menuProjectId) return alert("Project ID is null!");
    try {
      const updatedProject = await editProject(menuProjectId, projectTitle, projectDesc);
      setProjects(prev => prev.map(p => (p.id === menuProjectId ? updatedProject : p)));
      setProjectTitle(""); setProjectDesc("");
      handleCloseEdit();
    } catch (error) {
      alert("Error editing project: " + (error.response?.data?.message || error.message));
    }
  };
  const handleDeleteProject = async () => {
    try {
      await deleteProject(menuProjectId);
      setProjects(prev => prev.filter(p => p.id !== menuProjectId));
      handleMenuClose();
    } catch (error) {
      alert("Error deleting project: " + (error.response?.data?.message || error.message));
    }
  };
  const handleCreateBacklog = async () => {
    if (!menuProjectId) return alert("Backlog must be associated to a Project !");
    try {
      const createdBacklog = await createBacklog(menuProjectId, backlogTitle, backlogDesc);
      setProjects(prev => prev.map(p => (p.id === menuProjectId ? { ...p, productBacklog: createdBacklog } : p)));
      handleCloseBacklog();
    } catch (error) {
      alert("Error creating backlog: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSelectProject = (project) => {
    if (!project.productBacklog) return alert("⚠️ Project with no Product Backlog !");
    setProject(project);
    navigate(`/project/${project.id}`);
  };

  // ───────── useEffect pour récupérer les projets ─────────
  useEffect(() => {
    const fetchProjects = async () => {
      const userItem = localStorage.getItem('user');
      if (!userItem) return;
      try {
        const user = JSON.parse(userItem);
        const projectsData = await getProjectsByUser(user.username);

        const projectsWithBacklog = await Promise.all(
          projectsData.map(async (proj) => {
            try {
              const backlog = await getProductBacklogByProjectId(proj.id);
              return { ...proj, productBacklog: backlog || null };
            } catch {
              return { ...proj, productBacklog: null };
            }
          })
        );
        setProjects(projectsWithBacklog);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Container sx={{ mt: 6, p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: { xs: 2, sm: 0 } }}>My projects</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAdd}>Add a Project</Button>
      </Box>

      <Grid container spacing={4}>
        {projects.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Box sx={{ position: "relative" }} onClick={() => handleSelectProject(p)}>
              <ProjectCard project={p} />
              <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={(e) => handleMenuOpen(e, p.id)}>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleOpenEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteProject}>Delete</MenuItem>
        <MenuItem onClick={() => handleOpenBacklog(menuProjectId)}>Create Product Backlog</MenuItem>
      </Menu>

      {/* Modals */}
      <AddProjectModal open={openAdd} handleClose={handleCloseAdd} handleAddProject={handleAddProject} projectTitle={projectTitle} setProjectTitle={setProjectTitle} projectDesc={projectDesc} setProjectDesc={setProjectDesc} titleText="Add project" buttonText="Add" />
      <AddProjectModal open={openEdit} handleClose={handleCloseEdit} handleAddProject={handleEditProject} projectTitle={projectTitle} setProjectTitle={setProjectTitle} projectDesc={projectDesc} setProjectDesc={setProjectDesc} titleText="Edit project" buttonText="Save" />
      <AddProjectModal open={openBacklog} handleClose={handleCloseBacklog} handleAddProject={handleCreateBacklog} projectTitle={backlogTitle} setProjectTitle={setBacklogTitle} projectDesc={backlogDesc} setProjectDesc={setBacklogDesc} titleText="Create Product Backlog" buttonText="Create" />
    </Container>
  );
}
