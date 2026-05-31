import { Box, Typography } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function HeaderActionCard({ icon, title, sub }) {
  return (
    <Box
      sx={{
        background: "rgba(255,255,255,0.18)",
        borderRadius: 3,
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: "rgba(255,255,255,0.25)",
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography fontSize={13} fontWeight={500}>
            {title}
          </Typography>
          <Typography fontSize={11} sx={{ opacity: 0.75 }}>
            {sub}
          </Typography>
        </Box>
      </Box>
      <ArrowForwardIosRoundedIcon fontSize="small" />
    </Box>
  );
}
