import { Box, Typography } from "@mui/material";

export default function InfoRow({ icon, label, value }) {
  return (
    <Box sx={{ p: 2, mb: 2, borderRadius: 2, background: "#f8fafc", display: "flex", gap: 1.5 }}>
      <Box sx={{ color: "#7a3f43" }}>{icon}</Box>
      <Box>
        <Typography fontSize={11} color="#64748b">
          {label}
        </Typography>
        <Typography fontSize={13}>{value}</Typography>
      </Box>
    </Box>
  );
}
