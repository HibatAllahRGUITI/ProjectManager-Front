import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DescriptionIcon from '@mui/icons-material/Description';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/project/${project.id}`)}
      sx={{
        cursor: "pointer",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: 3,
        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DescriptionIcon color="primary" sx={{ mr: 1.5, fontSize: 32 }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            {project.name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {project.description}
        </Typography>
      </CardContent>
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
        <Typography variant="caption" color="text.secondary">
          Product Backlog: {project.productBacklog}
        </Typography>
      </Box>
    </Card>
  );
}