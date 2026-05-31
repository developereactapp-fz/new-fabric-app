import { Box, Typography } from "@mui/material";

export default function StatCard({ icon, label, value }) {
  return (
    <Box sx={{ background: "rgba(255,255,255,0.18)", borderRadius: 3, p: 3 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          background: "rgba(255,255,255,0.25)",
          display: "grid",
          placeItems: "center",
          mb: 1,
        }}
      >
        {icon}
      </Box>
      <Typography fontSize={11} sx={{ opacity: 0.8 }}>
        {label}
      </Typography>
      <Typography fontSize={20} fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
