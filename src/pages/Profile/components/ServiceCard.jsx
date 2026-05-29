import { Box, Typography } from "@mui/material";

export default function ServiceCard({ icon, title, desc }) {
  return (
    <Box sx={{ background: "#fff", borderRadius: 3, p: 3, textAlign: "center", boxShadow: "0 14px 35px rgba(15,23,42,0.08)" }}>
      <Box sx={{ width: 48, height: 48, borderRadius: "50%", background: "#f3f4f6", display: "grid", placeItems: "center", mx: "auto", mb: 1.5 }}>
        {icon}
      </Box>
      <Typography fontWeight={500}>{title}</Typography>
      <Typography fontSize={12} color="#64748b">{desc}</Typography>
    </Box>
  );
}
