import { Box, Typography } from "@mui/material";

export default function InfoCard({ title, color, textColor = "#fff", children }) {
  return (
    <Box sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 18px 40px rgba(15,23,42,0.08)" }}>
      <Box sx={{ px: 3, py: 2, background: color, color: textColor, borderRadius: "12px 12px 0 0" }}>
        <Typography fontWeight={500}>{title}</Typography>
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
  );
}
