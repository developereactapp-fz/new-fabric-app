import { Box, Typography, Chip } from "@mui/material";

export default function SummaryHeader() {
  return (
    <Box textAlign="center">
      <Chip
        label="✓ CUSTOMIZATION COMPLETE"
        sx={{
          mb: 2,
          px: 2,
          bgcolor: "#f6ecea",
          color: "#7a3f43",
        }}
      />

      <Typography variant="h3" fontWeight={500}>
        Your Custom Suit
      </Typography>

      <Typography variant="h4" sx={{ color: "#7a3f43" }}>
        Summary
      </Typography>

      <Typography fontSize={14} color="#64748b" mt={1}>
        Review your personalized selections before placing your order.
      </Typography>
    </Box>
  );
}
