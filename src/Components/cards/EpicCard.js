import { Card, CardContent, Typography } from "@mui/material";

export default function EpicCard({ epic }) {
  return (
    <Card sx={{ mb: 2, borderRadius: 3, boxShadow: "0px 4px 15px rgba(0,0,0,0.05)", bgcolor: "#fff" }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>{epic.nom}</Typography>
      </CardContent>
    </Card>
  );
}
