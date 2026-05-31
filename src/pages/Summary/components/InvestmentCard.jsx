import { Box, Typography } from "@mui/material";

export default function InvestmentCard() {
  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 3,
        background: "#fff",
        boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
      }}
    >
      <Typography fontWeight={600} mb={2}>
        Investment Breakdown
      </Typography>

      {[
        { label: "Jacket", value: "₹18,999" },
        { label: "Trousers", value: "₹8,999" },
        { label: "Waistcoat", value: "₹5,000" },
        { label: "Tailoring", value: "₹2,000" },
      ].map((item) => (
        <Box
          key={item.label}
          display="flex"
          justifyContent="space-between"
          mb={1.5}
        >
          <Typography fontSize={13} color="#64748b">
            {item.label}
          </Typography>
          <Typography fontSize={13} fontWeight={500}>
            {item.value}
          </Typography>
        </Box>
      ))}

      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography fontWeight={600}>Total Investment</Typography>
        <Typography fontWeight={600} sx={{ color: "#7a3f43" }}>
          ₹34,998
        </Typography>
      </Box>
    </Box>
  );
}
