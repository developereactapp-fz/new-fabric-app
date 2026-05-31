import { Box, Typography, Grid, Chip } from "@mui/material";

export default function GarmentCard({ title, price, image, items }) {
  return (
    <Box
      sx={{
        mb: 4,
        background: "#fff",
        borderRadius: 3,
        boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={image}
        sx={{ width: 220, objectFit: "cover" }}
      />

      <Box sx={{ p: 3, flex: 1 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography fontWeight={500}>{title}</Typography>
          <Chip label={price} />
        </Box>

        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item xs={6} key={item.label}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: "#f8fafc",
                }}
              >
                <Typography fontSize={11} color="#64748b">
                  {item.label}
                </Typography>
                <Typography fontSize={13}>{item.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
