import { Box, Typography, Chip, Button } from "@mui/material";

export default function RecentOrdersCard() {
  return (
    <Box sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 18px 40px rgba(15,23,42,0.08)" }}>
      <Box sx={{ px: 3, py: 2, background: "#111", color: "#fff", borderRadius: "12px 12px 0 0" }}>
        <Typography fontWeight={500}>Recent Orders</Typography>
        <Typography fontSize={11} sx={{ opacity: 0.7 }}>Last 3 purchases</Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {[
          { name: "3-Piece Navy Suit", price: "₹32,998", status: "In Production" },
          { name: "Charcoal Blazer", price: "₹18,999", status: "Delivered" },
          { name: "White Dress Shirt", price: "₹4,500", status: "Delivered" },
        ].map((o) => (
          <Box key={o.name} sx={{ mb: 2 }}>
            <Typography fontSize={13}>{o.name}</Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Chip label={o.status} size="small" />
              <Typography fontSize={13}>{o.price}</Typography>
            </Box>
          </Box>
        ))}
        <Button fullWidth variant="outlined">View All Orders</Button>
      </Box>
    </Box>
  );
}
