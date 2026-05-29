import { Grid, Box, Typography } from "@mui/material";

export default function FeatureCard({ title, desc }) {
  return (
    <Grid item xs={12} md={4}>
      <Box
        sx={{
          p: 3,
          background: "#fff",
          borderRadius: 3,
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
        }}
      >
        <Typography fontWeight={500}>{title}</Typography>
        <Typography fontSize={13} color="#64748b" mt={1}>
          {desc}
        </Typography>
      </Box>
    </Grid>
  );
}
