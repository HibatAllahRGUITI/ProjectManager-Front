import { Container, Grid, Typography, Button, Box } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import ProjectCard from '../Components/ProjectCard';
import AddProjectModal from '../Components/AddProjectModal';

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Site Web E-commerce",
      description: "Conception et développement d'une boutique en ligne pour la vente de produits artisanaux.",
      productBacklog: "ProductBacklog-Ecommerce"
    },
    {
      id: 2,
      name: "Application Mobile de Fitness",
      description: "Création d'une application mobile pour suivre les entraînements et les progrès des utilisateurs.",
      productBacklog: "ProductBacklog-Fitness"
    },
    {
      id: 3,
      name: "Plateforme de Gestion de Projet",
      description: "Développement d'un outil interne pour optimiser le suivi des tâches et des équipes.",
      productBacklog: "ProductBacklog-GestionProjet"
    },
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: projectTitle,
      description: projectDesc,
      productBacklog: `ProductBacklog-${projectTitle.replace(/\s/g, "")}`
    };
    setProjects([...projects, newProject]);
    setProjectTitle("");
    setProjectDesc("");
    handleClose();
  };

  return (
    <Container sx={{ mt: 6, p: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: { xs: 2, sm: 0 } }}
        >
          Mes projets
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            py: 1.5,
            px: 3,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
          }}
          onClick={handleOpen}
        >
          Ajouter un projet
        </Button>
      </Box>

      <Grid container spacing={4}>
        {projects.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <ProjectCard project={p} />
          </Grid>
        ))}
      </Grid>

      {/* Modal séparé */}
      <AddProjectModal
        open={open}
        handleClose={handleClose}
        handleAddProject={handleAddProject}
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle}
        projectDesc={projectDesc}
        setProjectDesc={setProjectDesc}
      />
    </Container>
  );
}
