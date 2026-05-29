import { Box, Typography } from "@mui/material";

export default function FabricInfoCard() {
  return (
    <Box
      sx={{
        mb: 3,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
      }}
    >
      <Box
        sx={{
          p: 3,
          color: "#fff",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1618354691373-d851c5c3a990')",
          backgroundSize: "cover",
        }}
      >
        <Typography fontSize={12}>PREMIUM FABRIC</Typography>
        <Typography fontSize={18}>Navy Pure 100% Wool</Typography>
      </Box>

      <Box sx={{ p: 3, background: "#fff" }}>
        {[
          ["Composition", "100% Virgin Wool"],
          ["Weight", "280g/m²"],
          ["Pattern", "Herringbone"],
          ["Origin", "Italy"],
        ].map(([k, v]) => (
          <Box key={k} display="flex" justifyContent="space-between" mb={1}>
            <Typography fontSize={13} color="#64748b">
              {k}
            </Typography>
            <Typography fontSize={13}>{v}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
